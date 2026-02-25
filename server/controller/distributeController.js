import pool from '../db.js';

// Get all distributed items
export const getDistributedItems = async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM distributed_items');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Add a distributed item record
export const addDistributedItem = async (req, res) => {
  try {
    const { issue_no, center, location, issue_date, issued_items } = req.body;
    if (!issue_no || !center || !location || !issue_date || !issued_items) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    // issued_items is a string like 'Dosa(15), Idly(20)'
    const [result] = await pool.query(
      'INSERT INTO distributed_items (issue_no, center, location, issue_date, issued_items) VALUES (?, ?, ?, ?, ?)',
      [issue_no, center, location, issue_date, issued_items]
    );

    // Sync with counter_stock table
    try {
      const itemsList = issued_items.split(',').map(s => s.trim());
      for (const itemStr of itemsList) {
        // Regex to extract Item No (optional), Name, and Quantity
        // Format: "ITEM_NO - ITEM_NAME(QTY)" or "ITEM_NAME(QTY)"
        const match = itemStr.match(/(?:(.*)\s*-\s*)?(.*)\((\d+)\)/);
        if (match) {
          const itemNo = match[1] ? match[1].trim() : null;
          const itemName = match[2].trim();
          const quantity = parseInt(match[3]);

          // Fetch price from prepared_items
          let price = 0;
          const [preparedRows] = await pool.query(
            'SELECT price_per_item FROM prepared_items WHERE name = ? OR item_no = ? ORDER BY id DESC LIMIT 1',
            [itemName, itemNo]
          );
          if (preparedRows.length > 0) {
            price = preparedRows[0].price_per_item || 0;
          }

          // Use INSERT ... ON DUPLICATE KEY UPDATE for atomic update
          await pool.query(
            'INSERT INTO counter_stock (counter_name, item_name, item_no, available_quantity, price) VALUES (?, ?, ?, ?, ?) ON DUPLICATE KEY UPDATE available_quantity = available_quantity + ?, item_no = VALUES(item_no), price = VALUES(price)',
            [center, itemName, itemNo, quantity, price, quantity]
          );
        }
      }
    } catch (syncError) {
      console.error('Failed to sync counter_stock:', syncError);
      // We don't return error to user as distribution was successfully inserted
    }

    res.json({ id: result.insertId, issue_no, center, location, issue_date, issued_items });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update a distributed item record
export const updateDistributedItem = async (req, res) => {
  try {
    const { id } = req.params;
    const { issue_no, center, location, issue_date, issued_items } = req.body;
    if (!issue_no || !center || !location || !issue_date || !issued_items) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    await pool.query(
      'UPDATE distributed_items SET issue_no=?, center=?, location=?, issue_date=?, issued_items=? WHERE id=?',
      [issue_no, center, location, issue_date, issued_items, id]
    );
    res.json({ id, issue_no, center, location, issue_date, issued_items });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Delete a distributed item record
export const deleteDistributedItem = async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query('DELETE FROM distributed_items WHERE id=?', [id]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get all locations (for dropdown)
export const getAllLocations = async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT id, center, location FROM location_master');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get all prepared items (for dropdown)
export const getAllPreparedItems = async (req, res) => {
  try {
    const { date } = req.query;
    let query = 'SELECT item_name, item_no, available_quantity, prepared_date FROM item_availiablity';
    let params = [];
    if (date) {
      query += ' WHERE prepared_date = ?';
      params.push(date);
    }
    const [rows] = await pool.query(query, params);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get distribution notifications (Stub)
export const getNotifications = async (req, res) => {
  try {
    res.json([]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Clear distribution notifications (Stub)
export const clearNotifications = async (req, res) => {
  try {
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
