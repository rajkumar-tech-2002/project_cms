// Get item availability by item_no
export const getItemAvailability = async (req, res) => {
  try {
    const { item_no } = req.params;
    if (!item_no) return res.status(400).json({ error: 'Missing item_no' });
    const [rows] = await pool.query('SELECT * FROM item_availability WHERE item_no = ?', [item_no]);
    if (rows.length === 0) return res.status(404).json({ error: 'Item not found' });
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
import pool from '../db.js';

// Get all prepared items
export const getPreparedItems = async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM prepared_items');
    // groceries_used is stored as a formatted string, just return as is
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Add a prepared item
export const addPreparedItem = async (req, res) => {
  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();
    const { name, description, quantity_prepared, groceries_used, prepared_date, price_per_item, total_price } = req.body;
    // groceries_used: [{grocery_id, quantity_used}, ...]
    if (!name || !quantity_prepared || !groceries_used || !prepared_date) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    // 1. Check all groceries have enough stock and grocery_id is valid
    for (const g of groceries_used) {
      if (!g.grocery_id) {
        await conn.rollback();
        return res.status(400).json({ error: 'Each grocery used must have a valid grocery_id.' });
      }
      const [stockRows] = await conn.query(
        `SELECT g.grocery_name, COALESCE(s.available_stock, 0) as available_stock 
         FROM grocery_master g 
         LEFT JOIN grocery_available_stock s ON g.id = s.grocery_id 
         WHERE g.id = ?`, [g.grocery_id]
      );

      if (!stockRows.length || stockRows[0].available_stock < g.quantity_used) {
        const name = stockRows.length > 0 ? stockRows[0].grocery_name : `ID ${g.grocery_id}`;
        const available = stockRows.length > 0 ? stockRows[0].available_stock : 0;
        await conn.rollback();
        return res.status(400).json({
          error: `Insufficient stock for "${name}". Available: ${available}, Requested: ${g.quantity_used}`
        });
      }
    }
    // 2. Generate item_no (ITM_YYYY_XXX)
    const year = new Date().getFullYear();
    const [lastRows] = await conn.query(
      'SELECT item_no FROM prepared_items WHERE item_no LIKE ? ORDER BY id DESC LIMIT 1',
      [`ITM_${year}_%`]
    );

    let nextNum = 1;
    if (lastRows.length > 0) {
      const lastNo = lastRows[0].item_no;
      const parts = lastNo.split('_');
      if (parts.length === 3) {
        nextNum = parseInt(parts[2], 10) + 1;
      }
    }
    const item_no = `ITM_${year}_${String(nextNum).padStart(3, '0')}`;

    // 3. Fetch grocery names/units to build the formatted string for prepared_items table
    const groceryDetails = [];
    for (const g of groceries_used) {
      const [rows] = await conn.query('SELECT grocery_name, unit FROM grocery_master WHERE id = ?', [g.grocery_id]);
      if (rows.length > 0) {
        groceryDetails.push(`${rows[0].grocery_name} - ${g.quantity_used} ${rows[0].unit}`);
      }
    }
    const groceries_used_string = groceryDetails.join(', ');

    // 4. Insert prepared item
    const [result] = await conn.query(
      'INSERT INTO prepared_items (item_no, name, description, quantity_prepared, groceries_used, prepared_date, price_per_item, total_price) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [item_no, name, description, quantity_prepared, groceries_used_string, prepared_date, price_per_item || 0, total_price || 0]
    );
    const prepared_item_id = result.insertId;

    // 4. Insert into prepared_item_ingredients and grocery_stock (OUT)
    for (const g of groceries_used) {
      await conn.query(
        'INSERT INTO prepared_item_ingredients (prepared_item_id, grocery_id, quantity_used) VALUES (?, ?, ?)',
        [prepared_item_id, g.grocery_id, g.quantity_used]
      );
      await conn.query(
        'INSERT INTO grocery_stock (grocery_id, quantity, movement_type, movement_date, remarks, created_at) VALUES (?, ?, "OUT", ?, ?, NOW())',
        [g.grocery_id, g.quantity_used, prepared_date, `PreparedItem#${prepared_item_id}`]
      );
    }
    await conn.commit();
    res.json({
      id: prepared_item_id,
      item_no,
      name,
      description,
      quantity_prepared,
      groceries_used: groceries_used_string,
      prepared_date,
      price_per_item: price_per_item || 0,
      total_price: total_price || 0
    });
  } catch (err) {
    await conn.rollback();
    res.status(500).json({ error: err.message });
  } finally {
    conn.release();
  }
};

// Update a prepared item
export const updatePreparedItem = async (req, res) => {
  try {
    const { id } = req.params;
    const { item_no, name, description, quantity_prepared, groceries_used, prepared_date, price_per_item, total_price } = req.body;
    if (!name || !quantity_prepared || !groceries_used || !prepared_date) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    let groceries_used_string = groceries_used;
    if (Array.isArray(groceries_used)) {
      const groceryDetails = [];
      for (const g of groceries_used) {
        const [rows] = await pool.query('SELECT grocery_name, unit FROM grocery_master WHERE id = ?', [g.grocery_id]);
        if (rows.length > 0) {
          groceryDetails.push(`${rows[0].grocery_name} - ${g.quantity_used} ${rows[0].unit}`);
        }
      }
      groceries_used_string = groceryDetails.join(', ');
    }

    await pool.query(
      'UPDATE prepared_items SET name=?, description=?, quantity_prepared=?, groceries_used=?, prepared_date=?, price_per_item=?, total_price=? WHERE id=?',
      [name, description, quantity_prepared, groceries_used_string, prepared_date, price_per_item || 0, total_price || 0, id]
    );
    res.json({ id, item_no, name, description, quantity_prepared, groceries_used: groceries_used_string, prepared_date, price_per_item: price_per_item || 0, total_price: total_price || 0 });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Delete a prepared item
export const deletePreparedItem = async (req, res) => {
  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();
    const { id } = req.params;

    // 1. Delete associated stock movements
    await conn.query('DELETE FROM grocery_stock WHERE remarks = ?', [`PreparedItem#${id}`]);

    // 2. Delete associated ingredients
    await conn.query('DELETE FROM prepared_item_ingredients WHERE prepared_item_id = ?', [id]);

    // 3. Delete the prepared item itself
    const [result] = await conn.query('DELETE FROM prepared_items WHERE id = ?', [id]);

    if (result.affectedRows === 0) {
      await conn.rollback();
      return res.status(404).json({ error: 'Prepared item not found' });
    }

    await conn.commit();
    res.json({ success: true });
  } catch (err) {
    await conn.rollback();
    res.status(500).json({ error: err.message });
  } finally {
    conn.release();
  }
};

// Get groceries master list (for dropdowns)
export const getGroceriesMaster = async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT id, grocery_name, unit FROM grocery_master');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get item categories
export const getItemCategories = async (req, res) => {
  try {
    // Return distinct categories from grocery_master or prepared_items if available
    const [rows] = await pool.query('SELECT DISTINCT category FROM grocery_master WHERE status = "Active"');
    const categories = rows.map(row => row.category).filter(c => c);
    res.json(categories);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
