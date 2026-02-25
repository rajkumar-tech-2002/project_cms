import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Get NEC logo
export const getLogo = async (req, res) => {
	try {
		const logoPath = path.join(__dirname, '..', 'assets', 'nec.png');
		if (fs.existsSync(logoPath)) {
			res.sendFile(logoPath);
		} else {
			res.status(404).json({ error: 'Logo not found' });
		}
	} catch (error) {
		console.error('Error serving logo:', error);
		res.status(500).json({ error: 'Failed to serve logo' });
	}
};

// Move purchased items to grocery_master and record stock IN
export const movePurchaseToStock = async (req, res) => {
	const { purchaseId, items } = req.body; // items: [{ name, unit, quantity, selected }]
	if (!purchaseId || !Array.isArray(items) || items.length === 0) {
		return res.status(400).json({ error: 'Invalid request data' });
	}
	const conn = await pool.getConnection();
	try {
		await conn.beginTransaction();
		// 1. Update purchase_master with the verified/edited items and quantities
		const itemsString = items
			.map((item) => `${item.name} (${item.unit}) - Qty: ${item.quantity}`)
			.join("; ");

		await conn.query(
			'UPDATE purchase_master SET grocery_name_unit = ?, status = "Received" WHERE id = ?',
			[itemsString, purchaseId]
		);

		// 2. For each selected item, add stock IN
		for (const item of items) {
			if (!item.selected) continue;

			let groceryId = item.groceryId;

			if (!groceryId) {
				const [rows] = await conn.query(
					'SELECT id FROM grocery_master WHERE grocery_name = ? AND unit = ? AND status = "Active"',
					[item.name, item.unit]
				);

				if (rows.length > 0) {
					groceryId = rows[0].id;
				} else {
					console.warn(`Grocery item not found and insert skipped for: ${item.name}`);
					continue;
				}
			}

			// Insert stock IN movement
			await conn.query(
				'INSERT INTO grocery_stock (grocery_id, movement_type, quantity, movement_date, remarks, created_at) VALUES (?, "IN", ?, NOW(), ?, NOW())',
				[groceryId, item.quantity, `Purchase Order #${purchaseId}`]
			);
		}

		await conn.commit();
		res.json({ success: true });
	} catch (err) {
		await conn.rollback();
		console.error('Error moving purchase to stock:', err);
		res.status(500).json({ error: 'Failed to move items to stock' });
	} finally {
		conn.release();
	}
};
import pool from '../db.js';

// Get all purchases
export const getAllPurchases = async (req, res) => {
	try {
		const [purchases] = await pool.query(
			`SELECT * FROM purchase_master ORDER BY created_at DESC`
		);
		res.json(purchases);
	} catch (error) {
		console.error('Error fetching purchases:', error);
		res.status(500).json({ error: 'Failed to fetch purchases' });
	}
};

// Get single purchase by ID
export const getPurchaseById = async (req, res) => {
	const { id } = req.params;
	try {
		const [purchase] = await pool.query(
			'SELECT * FROM purchase_master WHERE id = ?',
			[id]
		);
		if (purchase.length === 0) {
			return res.status(404).json({ error: 'Purchase not found' });
		}
		res.json(purchase[0]);
	} catch (error) {
		console.error('Error fetching purchase:', error);
		res.status(500).json({ error: 'Failed to fetch purchase' });
	}
};

// Create new purchase
export const createPurchase = async (req, res) => {
	const { order_no, vendor_name, vendor_phone, purchase_date, grocery_name_unit, status } = req.body;

	try {
		const [result] = await pool.query(
			`INSERT INTO purchase_master 
			(order_no, vendor_name, vendor_phone, purchase_date, grocery_name_unit, status) 
			VALUES (?, ?, ?, ?, ?, ?)`,
			[order_no, vendor_name, vendor_phone, purchase_date, grocery_name_unit, status || 'Pending']
		);

		res.status(201).json({
			id: result.insertId,
			order_no,
			vendor_name,
			vendor_phone,
			purchase_date,
			grocery_name_unit,
			status: status || 'Pending',
			message: 'Purchase created successfully'
		});
	} catch (error) {
		console.error('Error creating purchase:', error);
		res.status(500).json({ error: 'Failed to create purchase' });
	}
};

// Update purchase
export const updatePurchase = async (req, res) => {
	const { id } = req.params;
	const { order_no, vendor_name, vendor_phone, purchase_date, grocery_name_unit, status } = req.body;

	try {
		const [result] = await pool.query(
			`UPDATE purchase_master 
			SET order_no = ?, vendor_name = ?, vendor_phone = ?, purchase_date = ?, 
			    grocery_name_unit = ?, status = ?
			WHERE id = ?`,
			[order_no, vendor_name, vendor_phone, purchase_date, grocery_name_unit, status, id]
		);

		if (result.affectedRows === 0) {
			return res.status(404).json({ error: 'Purchase not found' });
		}

		res.json({ message: 'Purchase updated successfully' });
	} catch (error) {
		console.error('Error updating purchase:', error);
		res.status(500).json({ error: 'Failed to update purchase' });
	}
};

// Delete purchase
export const deletePurchase = async (req, res) => {
	const { id } = req.params;

	try {
		const [result] = await pool.query(
			'DELETE FROM purchase_master WHERE id = ?',
			[id]
		);

		if (result.affectedRows === 0) {
			return res.status(404).json({ error: 'Purchase not found' });
		}

		res.json({ message: 'Purchase deleted successfully' });
	} catch (error) {
		console.error('Error deleting purchase:', error);
		res.status(500).json({ error: 'Failed to delete purchase' });
	}
};

// Get all vendors for dropdown
export const getVendorsForDropdown = async (req, res) => {
	try {
		const [vendors] = await pool.query(
			`SELECT id, vendor_name, vendor_phone FROM vendor_master ORDER BY vendor_name`
		);

		// Format for dropdown
		const formattedVendors = vendors.map(vendor => ({
			value: vendor.id.toString(),
			label: vendor.vendor_name,
			phone: vendor.vendor_phone
		}));

		res.json(formattedVendors);
	} catch (error) {
		console.error('Error fetching vendors:', error);
		res.status(500).json({ error: 'Failed to fetch vendors' });
	}
};

// Get all groceries for dropdown
export const getGroceriesForDropdown = async (req, res) => {
	try {
		const [groceries] = await pool.query(
			`SELECT id, grocery_name, unit, category FROM grocery_master WHERE status = 'Active' ORDER BY grocery_name`
		);

		// Format for dropdown
		const formattedGroceries = groceries.map(grocery => ({
			value: grocery.id.toString(),
			label: grocery.grocery_name,
			unit: grocery.unit,
			category: grocery.category
		}));

		res.json(formattedGroceries);
	} catch (error) {
		console.error('Error fetching groceries:', error);
		res.status(500).json({ error: 'Failed to fetch groceries' });
	}
};

// Create a new bill for a purchase order
export const createPurchaseBill = async (req, res) => {
	const { purchase_id, bill_no, bill_date, items, total_amount, bill_document } = req.body;

	if (!purchase_id || !bill_no || !bill_date || !Array.isArray(items) || items.length === 0) {
		return res.status(400).json({ error: 'Invalid bill data' });
	}

	const conn = await pool.getConnection();
	try {
		await conn.beginTransaction();

		// 1. Insert into purchase_bills
		const [billResult] = await conn.query(
			'INSERT INTO purchase_bills (purchase_id, bill_no, bill_date, total_amount, bill_document) VALUES (?, ?, ?, ?, ?)',
			[purchase_id, bill_no, bill_date, total_amount, bill_document]
		);
		const billId = billResult.insertId;

		// 2. Process items
		for (const item of items) {
			const { grocery_id, quantity, price_per_unit } = item;
			const itemTotalPrice = quantity * price_per_unit;

			// Insert into purchase_bill_items
			await conn.query(
				'INSERT INTO purchase_bill_items (bill_id, grocery_id, quantity, price_per_unit, total_price) VALUES (?, ?, ?, ?, ?)',
				[billId, grocery_id, quantity, price_per_unit, itemTotalPrice]
			);

			// 3. Register Stock IN
			await conn.query(
				'INSERT INTO grocery_stock (grocery_id, movement_type, quantity, movement_date, remarks, created_at) VALUES (?, "IN", ?, ?, ?, NOW())',
				[grocery_id, quantity, bill_date, `Bill #${bill_no} for PO #${purchase_id}`]
			);
		}

		// 4. Update purchase_master status
		const [purchaseRows] = await conn.query('SELECT grocery_name_unit FROM purchase_master WHERE id = ?', [purchase_id]);
		const poString = purchaseRows[0]?.grocery_name_unit || "";

		// Parse PO quantities
		const poItems = poString.split('; ').reduce((acc, str) => {
			const match = str.match(/^(.+?)\s*\((.+?)\)\s*-\s*Qty:\s*(\d+)$/);
			if (match) {
				const key = `${match[1]}|${match[2]}`;
				acc[key] = (acc[key] || 0) + parseInt(match[3], 10);
			}
			return acc;
		}, {});

		// Get total billed quantities so far for this PO
		const [billedRows] = await conn.query(
			`SELECT g.grocery_name, g.unit, SUM(bi.quantity) as total_qty
			 FROM purchase_bill_items bi
			 JOIN grocery_master g ON bi.grocery_id = g.id
			 WHERE bi.bill_id IN (SELECT id FROM purchase_bills WHERE purchase_id = ?)
			 GROUP BY bi.grocery_id`,
			[purchase_id]
		);

		let allReceived = true;
		for (const key in poItems) {
			const [name, unit] = key.split('|');
			const billedItem = billedRows.find(r => r.grocery_name === name && r.unit === unit);
			if (!billedItem || billedItem.total_qty < poItems[key]) {
				allReceived = false;
				break;
			}
		}

		const finalStatus = allReceived ? "Received" : "Partially Received";
		await conn.query(
			'UPDATE purchase_master SET status = ? WHERE id = ?',
			[finalStatus, purchase_id]
		);

		await conn.commit();
		res.status(201).json({ success: true, billId, message: 'Bill created and stock updated successfully' });
	} catch (error) {
		await conn.rollback();
		console.error('Error creating purchase bill:', error);
		res.status(500).json({ error: 'Failed to create bill' });
	} finally {
		conn.release();
	}
};

// Get all bills for a specific purchase order
export const getBillsByPurchase = async (req, res) => {
	const { id } = req.params;
	try {
		const [bills] = await pool.query(
			'SELECT * FROM purchase_bills WHERE purchase_id = ? ORDER BY bill_date DESC',
			[id]
		);
		res.json(bills);
	} catch (error) {
		console.error('Error fetching bills:', error);
		res.status(500).json({ error: 'Failed to fetch bills' });
	}
};

// Get details for a specific bill
export const getBillDetails = async (req, res) => {
	const { id } = req.params;
	try {
		const [bill] = await pool.query('SELECT * FROM purchase_bills WHERE id = ?', [id]);
		if (bill.length === 0) return res.status(404).json({ error: 'Bill not found' });

		const [items] = await pool.query(
			`SELECT bi.*, g.grocery_name, g.unit, g.category 
			 FROM purchase_bill_items bi 
			 JOIN grocery_master g ON bi.grocery_id = g.id 
			 WHERE bi.bill_id = ?`,
			[id]
		);

		res.json({ ...bill[0], items });
	} catch (error) {
		console.error('Error fetching bill details:', error);
		res.status(500).json({ error: 'Failed to fetch bill details' });
	}
};
