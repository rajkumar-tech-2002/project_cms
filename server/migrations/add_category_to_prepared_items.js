import pool from '../db.js';

async function migrate() {
    try {
        console.log('Starting migration: Adding category to prepared_items...');

        // Check if column already exists
        const [columns] = await pool.query('SHOW COLUMNS FROM prepared_items LIKE "category"');

        if (columns.length === 0) {
            await pool.query('ALTER TABLE prepared_items ADD COLUMN category VARCHAR(255) AFTER name');
            console.log('Successfully added "category" column to "prepared_items" table.');
        } else {
            console.log('Column "category" already exists in "prepared_items" table.');
        }

        process.exit(0);
    } catch (error) {
        console.error('Migration failed:', error);
        process.exit(1);
    }
}

migrate();
