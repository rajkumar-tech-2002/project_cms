import pool from '../db.js';

async function migrate() {
    try {
        console.log('Starting migration: Adding category to counter_stock...');

        // Check if column already exists
        const [columns] = await pool.query('SHOW COLUMNS FROM counter_stock LIKE "category"');

        if (columns.length === 0) {
            await pool.query('ALTER TABLE counter_stock ADD COLUMN category VARCHAR(255) AFTER item_no');
            console.log('Successfully added "category" column to "counter_stock" table.');
        } else {
            console.log('Column "category" already exists in "counter_stock" table.');
        }

        process.exit(0);
    } catch (error) {
        console.error('Migration failed:', error);
        process.exit(1);
    }
}

migrate();
