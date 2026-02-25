import pool from '../db.js';

// Get all locations
export const getLocations = async (req, res) => {
	try {
		const [rows] = await pool.query('SELECT * FROM location_master');
		res.json(rows);
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
};

// Add a new location
export const addLocation = async (req, res) => {
	const { center, type, location, incharge, status } = req.body;
	try {
		const [result] = await pool.query(
			'INSERT INTO location_master (center, type, location, incharge, status, created_at, updated_at) VALUES (?, ?, ?, ?, ?, NOW(), NOW())',
			[center, type, location, incharge, status || 'Active']
		);
		res.json({ id: result.insertId, ...req.body });
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
};

// Update a location
export const updateLocation = async (req, res) => {
	const { id } = req.params;
	const { center, type, location, incharge, status } = req.body;
	try {
		await pool.query(
			'UPDATE location_master SET center=?, type=?, location=?, incharge=?, status=?, updated_at=NOW() WHERE id=?',
			[center, type, location, incharge, status, id]
		);
		res.json({ id, ...req.body });
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
};

// Delete a location
export const deleteLocation = async (req, res) => {
	const { id } = req.params;
	try {
		await pool.query('DELETE FROM location_master WHERE id=?', [id]);
		res.json({ success: true });
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
};
