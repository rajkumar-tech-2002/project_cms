import pool from '../db.js';

export const getInventory = async (req, res) => {
    try {
        // Fetch data from grocery_available_stock view or table
        const [rows] = await pool.query(
            `SELECT 
				grocery_id as id, 
				grocery_name as name, 
				unit, 
				minimum_stock as minimumLevel, 
				available_stock as currentStock, 
				DATE_FORMAT(last_updated_date, '%d-%m-%Y') as lastUpdated 
			FROM grocery_available_stock`
        );

        // Calculate status for each item
        const formattedInventory = rows.map(item => {
            const current = parseFloat(item.currentStock || 0);
            const min = parseFloat(item.minimumLevel || 0);

            let status = "Normal";
            if (current <= min / 2) {
                status = "Critical";
            } else if (current <= min) {
                status = "Low";
            }

            return {
                ...item,
                status,
                currentStock: current,
                minimumLevel: min
            };
        });

        res.json(formattedInventory);
    } catch (error) {
        console.error('Error fetching inventory:', error);
        res.status(500).json({ error: 'Failed to fetch inventory' });
    }
};
