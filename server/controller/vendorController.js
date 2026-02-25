import pool from '../db.js';

// Get all vendors
export const getVendors = async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM vendor_master');
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Add new vendor
export const addVendor = async (req, res) => {
    const { vendor_name, vendor_email, vendor_phone, vendor_address } = req.body;
    try {
        const [result] = await pool.query(
            'INSERT INTO vendor_master (vendor_name, vendor_email, vendor_phone, vendor_address, created_at, updated_at) VALUES (?, ?, ?, ?, NOW(), NOW())',
            [vendor_name, vendor_email, vendor_phone, vendor_address]
        );
        res.json({ id: result.insertId, vendor_name, vendor_email, vendor_phone, vendor_address });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Edit vendor
export const updateVendor = async (req, res) => {
    const { id } = req.params;
    const { vendor_name, vendor_email, vendor_phone, vendor_address } = req.body;
    try {
        await pool.query(
            'UPDATE vendor_master SET vendor_name=?, vendor_email=?, vendor_phone=?, vendor_address=?, updated_at=NOW() WHERE id=?',
            [vendor_name, vendor_email, vendor_phone, vendor_address, id]
        );
        res.json({ id, vendor_name, vendor_email, vendor_phone, vendor_address });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Delete vendor
export const deleteVendor = async (req, res) => {
    const { id } = req.params;
    try {
        await pool.query('DELETE FROM vendor_master WHERE id=?', [id]);
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
