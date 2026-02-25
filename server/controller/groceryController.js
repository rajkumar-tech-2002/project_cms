import pool from '../db.js';

// Get all items
export const getItems = async (req, res) => {
  try {
    const [rows] = await pool.query(
      'SELECT g.*, v.available_stock FROM grocery_master g LEFT JOIN grocery_available_stock v ON g.id = v.grocery_id WHERE g.status = "Active"'
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Add new item
export const addItem = async (req, res) => {
  const { grocery_name, category, unit, minimum_stock, status } = req.body;
  try {
    const [result] = await pool.query(
      'INSERT INTO grocery_master (grocery_name, category, unit, minimum_stock, status, created_at, updated_at) VALUES (?, ?, ?, ?, ?, NOW(), NOW())',
      [grocery_name, category, unit, minimum_stock, status]
    );
    res.json({ id: result.insertId, grocery_name, category, unit, minimum_stock, status });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Edit item
export const updateItem = async (req, res) => {
  const { id } = req.params;
  const { grocery_name, category, unit, minimum_stock, status } = req.body;
  try {
    await pool.query(
      'UPDATE grocery_master SET grocery_name=?, category=?, unit=?, minimum_stock=?, status=?, updated_at=NOW() WHERE id=?',
      [grocery_name, category, unit, minimum_stock, status, id]
    );
    res.json({ id, grocery_name, category, unit, minimum_stock, status });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Delete item
export const deleteItem = async (req, res) => {
  const { id } = req.params;
  try {
    const [stockRows] = await pool.query('SELECT COUNT(*) as cnt FROM grocery_stock WHERE grocery_id=?', [id]);
    if (stockRows[0].cnt > 0) {
      // Soft delete
      await pool.query('UPDATE grocery_master SET status="Inactive" WHERE id=?', [id]);
      return res.json({ success: true, softDeleted: true });
    } else {
      // Hard delete allowed only if no stock history
      await pool.query('DELETE FROM grocery_master WHERE id=?', [id]);
      return res.json({ success: true, softDeleted: false });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get all unique categories
export const getCategories = async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT DISTINCT category FROM grocery_master WHERE status = "Active"');
    const categories = rows.map(row => row.category).filter(c => c);
    res.json(categories);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get all unique units
export const getUnits = async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT DISTINCT unit FROM grocery_master WHERE status = "Active"');
    const units = rows.map(row => row.unit).filter(u => u);
    res.json(units);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
