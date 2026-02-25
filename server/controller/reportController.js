import pool from '../db.js';

// Get consolidated reporting data for Admin
export const getAdminReportData = async (req, res) => {
    const { startDate, endDate } = req.query;

    if (!startDate || !endDate) {
        return res.status(400).json({ error: 'Start date and end date are required' });
    }

    try {
        // 1. Sales Summary
        const [salesRows] = await pool.query(`
            SELECT 
                counter_name, 
                item_name, 
                item_no, 
                SUM(quantity) as total_quantity, 
                SUM(quantity * price) as total_revenue,
                MAX(sale_date) as last_sale
            FROM counter_sales 
            WHERE DATE(sale_date) BETWEEN ? AND ?
            GROUP BY counter_name, item_name, item_no
            ORDER BY total_revenue DESC
        `, [startDate, endDate]);

        // 2. Purchase Log
        const [purchaseRows] = await pool.query(`
            SELECT * FROM purchase_master 
            WHERE DATE(purchase_date) BETWEEN ? AND ?
            ORDER BY purchase_date DESC
        `, [startDate, endDate]);

        // 3. Distribution Log
        const [distributionRows] = await pool.query(`
            SELECT * FROM distributed_items 
            WHERE DATE(issue_date) BETWEEN ? AND ?
            ORDER BY issue_date DESC
        `, [startDate, endDate]);

        // 4. Profit Summary (Overall)
        const [[profitSummary]] = await pool.query(`
            SELECT 
                (SELECT SUM(quantity * price) FROM counter_sales WHERE DATE(sale_date) BETWEEN ? AND ?) as total_sales,
                (SELECT SUM(total_amount) FROM purchase_bills WHERE DATE(bill_date) BETWEEN ? AND ?) as total_purchase
        `, [startDate, endDate, startDate, endDate]);

        // 5. Counter-wise Performance (for Profit/Loss tab)
        const [counterSalesRows] = await pool.query(`
            SELECT 
                counter_name, 
                SUM(quantity * price) as revenue,
                COUNT(id) as transactions
            FROM counter_sales 
            WHERE DATE(sale_date) BETWEEN ? AND ?
            GROUP BY counter_name
            ORDER BY revenue DESC
        `, [startDate, endDate]);

        res.json({
            sales: salesRows || [],
            purchases: purchaseRows || [],
            distributions: distributionRows || [],
            profitSummary: profitSummary || { total_sales: 0, total_purchase: 0 },
            counterSales: counterSalesRows || []
        });

    } catch (error) {
        console.error('Error fetching admin reports:', error);
        res.status(500).json({ error: 'Failed to fetch report data' });
    }
};
