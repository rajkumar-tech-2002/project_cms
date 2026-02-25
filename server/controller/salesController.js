import pool from '../db.js';

// Record a new sale from a counter
export const recordSale = async (req, res) => {
    const { counter_name, item_name, item_no, quantity, price, staff_id } = req.body;

    if (!counter_name || !item_name || !quantity) {
        return res.status(400).json({ error: 'Counter name, item name, and quantity are required.' });
    }

    const connection = await pool.getConnection();
    try {
        await connection.beginTransaction();

        // 1. Insert into counter_sales
        await connection.query(
            'INSERT INTO counter_sales (counter_name, item_name, item_no, quantity, price, staff_id) VALUES (?, ?, ?, ?, ?, ?)',
            [counter_name, item_name, item_no, quantity, price || 0, staff_id]
        );

        // 2. Update counter_stock
        // Check if item exists in counter_stock
        const [stockRows] = await connection.query(
            'SELECT available_quantity FROM counter_stock WHERE counter_name = ? AND item_name = ?',
            [counter_name, item_name]
        );

        if (stockRows.length > 0) {
            const currentQty = stockRows[0].available_quantity;
            if (currentQty < quantity) {
                await connection.rollback();
                return res.status(400).json({ error: 'Insufficient stock at counter.' });
            }
            await connection.query(
                'UPDATE counter_stock SET available_quantity = available_quantity - ? WHERE counter_name = ? AND item_name = ?',
                [quantity, counter_name, item_name]
            );
        } else {
            // This case shouldn't happen often if we sync on distribution, 
            // but for safety, we'll return an error if stock record wasn't initialized
            await connection.rollback();
            return res.status(400).json({ error: 'Stock record not found for this item at this counter.' });
        }

        await connection.commit();
        res.json({ success: true, message: 'Sale recorded successfully' });
    } catch (error) {
        await connection.rollback();
        console.error('Error recording sale:', error);
        res.status(500).json({ error: 'Failed to record sale' });
    } finally {
        connection.release();
    }
};

// Get summary for Admin (Assigned vs Sold vs Remaining)
export const getCounterMonitoringData = async (req, res) => {
    try {
        // We calculate this based on counter_stock which should have the latest state
        // and distributed_items for total assigned (historical)

        // Let's get everything from counter_stock as it's the source of truth for "Current Available"
        // and we can join it with a subquery of sales for "Total Sold"
        const [rows] = await pool.query(`
            SELECT 
                cs.counter_name, 
                cs.item_name, 
                cs.item_no,
                cs.price,
                cs.available_quantity as remaining,
                (SELECT SUM(quantity) FROM counter_sales WHERE counter_name = cs.counter_name AND item_name = cs.item_name) as sold
            FROM counter_stock cs
        `);

        // Assigned = remaining + sold
        const data = rows.map(row => {
            const sold = parseInt(row.sold || 0);
            const price = parseFloat(row.price || 0);
            return {
                ...row,
                sold: sold,
                price: price,
                revenue: sold * price,
                assigned: parseInt(row.remaining || 0) + sold
            };
        });

        res.json(data);
    } catch (error) {
        console.error('Error fetching monitoring data:', error);
        res.status(500).json({ error: 'Failed to fetch monitoring data' });
    }
};

// Get specific counter stock for Staff
export const getCounterStock = async (req, res) => {
    const { counter } = req.params;
    try {
        const [rows] = await pool.query(
            'SELECT * FROM counter_stock WHERE counter_name = ?',
            [counter]
        );
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch counter stock' });
    }
};

// Sync all existing distribution records into counter_stock (Migration tool)
export const syncCounterStock = async (req, res) => {
    try {
        const [distributions] = await pool.query('SELECT center, issued_items FROM distributed_items');

        for (const dist of distributions) {
            const counter = dist.center;
            if (!dist.issued_items) continue;

            const itemsList = dist.issued_items.split(',').map(s => s.trim());
            for (const itemStr of itemsList) {
                const match = itemStr.match(/(?:(.*)\s*-\s*)?(.*)\((\d+)\)/);
                if (match) {
                    const itemNo = match[1] ? match[1].trim() : null;
                    const itemName = match[2].trim();
                    const qty = parseInt(match[3]);

                    // Fetch price from prepared_items
                    let price = 0;
                    const [preparedRows] = await pool.query(
                        'SELECT price_per_item FROM prepared_items WHERE name = ? OR item_no = ? ORDER BY id DESC LIMIT 1',
                        [itemName, itemNo]
                    );
                    if (preparedRows.length > 0) {
                        price = preparedRows[0].price_per_item || 0;
                    }

                    await pool.query(
                        'INSERT INTO counter_stock (counter_name, item_name, item_no, available_quantity, price) VALUES (?, ?, ?, ?, ?) ON DUPLICATE KEY UPDATE available_quantity = available_quantity, item_no = VALUES(item_no), price = VALUES(price)',
                        [counter, itemName, itemNo, qty, price]
                    );
                }
            }
        }
        res.json({ success: true, message: 'Stock sync completed' });
    } catch (error) {
        console.error('Sync error:', error);
        res.status(500).json({ error: 'Failed to sync stock' });
    }
};

// Get sales report for a specific counter (Staff Reports)
export const getCounterSalesReport = async (req, res) => {
    const { counter, startDate, endDate } = req.query;

    if (!counter) {
        return res.status(400).json({ error: 'Counter name is required' });
    }

    try {
        let query = 'SELECT * FROM counter_sales WHERE counter_name = ?';
        const params = [counter];

        if (startDate && endDate) {
            query += ' AND DATE(sale_date) BETWEEN ? AND ?';
            params.push(startDate, endDate);
        } else if (startDate) {
            query += ' AND DATE(sale_date) = ?';
            params.push(startDate);
        } else {
            // Default to today
            query += ' AND DATE(sale_date) = CURDATE()';
        }

        query += ' ORDER BY sale_date DESC';

        const [rows] = await pool.query(query, params);
        res.json(rows);
    } catch (error) {
        console.error('Error fetching sales report:', error);
        res.status(500).json({ error: 'Failed to fetch sales report' });
    }
};
// Get summary metrics for Counter Reports
export const getCounterReportSummary = async (req, res) => {
    const { counter, startDate, endDate } = req.query;

    if (!counter) {
        return res.status(400).json({ error: 'Counter name is required' });
    }

    try {
        // 1. Get Sales Summary (Sold Qty & Revenue)
        let salesQuery = `
            SELECT 
                SUM(quantity) as total_sold, 
                SUM(quantity * price) as total_revenue,
                COUNT(id) as total_transactions
            FROM counter_sales 
            WHERE counter_name = ?
        `;
        const params = [counter];

        if (startDate && endDate) {
            salesQuery += ' AND DATE(sale_date) BETWEEN ? AND ?';
            params.push(startDate, endDate);
        } else {
            salesQuery += ' AND DATE(sale_date) = CURDATE()';
        }

        const [salesRows] = await pool.query(salesQuery, params);

        // 2. Get Current Stock Status (Pending items at counter)
        const [stockRows] = await pool.query(
            'SELECT item_name, item_no, available_quantity FROM counter_stock WHERE counter_name = ? AND available_quantity > 0',
            [counter]
        );

        res.json({
            summary: salesRows[0] || { total_sold: 0, total_revenue: 0, total_transactions: 0 },
            stock: stockRows || []
        });
    } catch (error) {
        console.error('Error fetching report summary:', error);
        res.status(500).json({ error: 'Failed to fetch report summary' });
    }
};

// Get admin sales notifications (Stub)
export const getAdminSalesNotifications = async (req, res) => {
    try {
        res.json([]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Clear admin sales notifications (Stub)
export const clearAdminNotifications = async (req, res) => {
    try {
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
