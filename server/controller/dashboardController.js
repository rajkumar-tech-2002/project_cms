import pool from '../db.js';

export const getDashboardData = async (req, res) => {
    try {
        // 1. Get Stats Card Data
        const [totalStockRows] = await pool.query('SELECT SUM(available_stock) as total FROM grocery_available_stock');
        const [todayPurchaseRows] = await pool.query('SELECT COUNT(*) as count FROM purchase_master WHERE DATE(purchase_date) = CURDATE()');
        const [todayDistributeRows] = await pool.query('SELECT COUNT(*) as count FROM distributed_items WHERE DATE(issue_date) = CURDATE()');
        const [lowStockAlertRows] = await pool.query('SELECT COUNT(*) as count FROM grocery_available_stock WHERE available_stock <= minimum_stock');

        // 2. Get Charts Data (Last 6 Months)
        const [purchaseChartRows] = await pool.query(`
			SELECT DATE_FORMAT(purchase_date, '%b') as month, COUNT(*) as count 
			FROM purchase_master 
			WHERE purchase_date >= DATE_SUB(CURDATE(), INTERVAL 6 MONTH)
			GROUP BY DATE_FORMAT(purchase_date, '%b'), MONTH(purchase_date)
			ORDER BY MONTH(purchase_date)
		`);

        const [distributeChartRows] = await pool.query(`
			SELECT DATE_FORMAT(issue_date, '%b') as month, COUNT(*) as count 
			FROM distributed_items 
			WHERE issue_date >= DATE_SUB(CURDATE(), INTERVAL 6 MONTH)
			GROUP BY DATE_FORMAT(issue_date, '%b'), MONTH(issue_date)
			ORDER BY MONTH(issue_date)
		`);

        // Combine chart data
        const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        const last6Months = [];
        for (let i = 5; i >= 0; i--) {
            const d = new Date();
            d.setMonth(d.getMonth() - i);
            last6Months.push(months[d.getMonth()]);
        }

        const chartData = last6Months.map(m => {
            const p = purchaseChartRows.find(row => row.month === m);
            const d = distributeChartRows.find(row => row.month === m);
            return {
                name: m,
                purchase: p ? p.count : 0,
                distribution: d ? d.count : 0
            };
        });

        // 3. Get Low Stock Items (Top 5)
        const [lowStockItemsRows] = await pool.query(`
			SELECT 
				grocery_id as id, 
				grocery_name as name, 
				available_stock as current, 
				minimum_stock as minimum, 
				unit 
			FROM grocery_available_stock 
			WHERE available_stock <= minimum_stock 
			ORDER BY (available_stock / minimum_stock) ASC 
			LIMIT 5
		`);

        const formattedLowStockItems = lowStockItemsRows.map(item => ({
            ...item,
            status: item.current <= item.minimum / 2 ? "Critical" : "Low"
        }));

        res.json({
            stats: {
                totalStock: totalStockRows[0].total || 0,
                todayPurchase: todayPurchaseRows[0].count || 0,
                todayDistribution: todayDistributeRows[0].count || 0,
                lowStockAlerts: lowStockAlertRows[0].count || 0
            },
            chartData,
            lowStockItems: formattedLowStockItems
        });

    } catch (error) {
        console.error('Error fetching dashboard data:', error);
        res.status(500).json({ error: 'Failed to fetch dashboard data' });
    }
};

export const getCounterDashboardData = async (req, res) => {
    const { counter } = req.query;
    if (!counter) {
        return res.status(400).json({ error: 'Counter name is required' });
    }
    try {
        // 1. Today's actual sales from counter_sales table
        const [salesRows] = await pool.query(
            'SELECT SUM(quantity) as total FROM counter_sales WHERE counter_name = ? AND DATE(sale_date) = CURDATE()',
            [counter]
        );

        // 2. Active items in stock for this counter
        const [stockRows] = await pool.query(
            'SELECT COUNT(*) as count FROM counter_stock WHERE counter_name = ? AND available_quantity > 0',
            [counter]
        );

        // 3. Pending distributions (received today)
        const [pendingRows] = await pool.query(
            'SELECT COUNT(*) as count FROM distributed_items WHERE center = ? AND DATE(issue_date) = CURDATE()',
            [counter]
        );

        // 4. Sales performance for the last 7 days (Chart Data)
        const [chartRows] = await pool.query(`
            SELECT 
                DATE_FORMAT(sale_date, '%d %b') as date, 
                SUM(quantity) as count 
            FROM counter_sales 
            WHERE counter_name = ? AND sale_date >= DATE_SUB(CURDATE(), INTERVAL 7 DAY) 
            GROUP BY DATE(sale_date) 
            ORDER BY DATE(sale_date)
        `, [counter]);

        res.json({
            stats: {
                todaySales: salesRows[0].total || 0,
                totalItems: stockRows[0].count || 0,
                pendingOrders: pendingRows[0].count || 0
            },
            chartData: chartRows
        });
    } catch (error) {
        console.error('Error fetching counter dashboard data:', error);
        res.status(500).json({ error: 'Failed to fetch counter data' });
    }
};

