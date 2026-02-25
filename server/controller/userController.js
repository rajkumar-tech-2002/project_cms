import pool from '../db.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

// Get all users
export const getAllUsers = async (req, res) => {
	try {
		const [rows] = await pool.query('SELECT id, name, email, user_id, role, counter, status, created_at FROM users ORDER BY created_at DESC');
		res.json(rows);
	} catch (err) {
		res.status(500).json({ error: 'Failed to fetch users' });
	}
};

// Create a new user
export const createUser = async (req, res) => {
	const { name, email, user_id, password, role, counter, status } = req.body;
	if (!name || !user_id || !password || !role) {
		return res.status(400).json({ error: 'Name, User ID, Password, and Role are required.' });
	}
	try {
		// Check if user_id already exists
		const [existing] = await pool.query('SELECT id FROM users WHERE user_id = ?', [user_id]);
		if (existing.length > 0) {
			return res.status(400).json({ error: 'User ID already exists.' });
		}

		// Hash password
		const hashedPassword = await bcrypt.hash(password, 10);

		const [result] = await pool.query(
			'INSERT INTO users (name, email, user_id, password, role, counter, status, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, NOW(), NOW())',
			[name, email, user_id, hashedPassword, role, counter || 'Main Counter', status || 'Active']
		);
		res.status(201).json({ id: result.insertId, name, email, user_id, role, counter, status: status || 'Active' });
	} catch (err) {
		res.status(500).json({ error: 'Failed to create user' });
	}
};

// Update an existing user
export const updateUser = async (req, res) => {
	const { id } = req.params;
	const { name, email, user_id, password, role, counter, status } = req.body;
	try {
		let query = 'UPDATE users SET name = ?, email = ?, user_id = ?, role = ?, counter = ?, status = ?, updated_at = NOW()';
		let params = [name, email, user_id, role, counter, status];

		if (password) {
			const hashedPassword = await bcrypt.hash(password, 10);
			query = 'UPDATE users SET name = ?, email = ?, user_id = ?, password = ?, role = ?, counter = ?, status = ?, updated_at = NOW()';
			params = [name, email, user_id, hashedPassword, role, counter, status];
		}

		query += ' WHERE id = ?';
		params.push(id);

		await pool.query(query, params);
		res.json({ message: 'User updated successfully' });
	} catch (err) {
		res.status(500).json({ error: 'Failed to update user' });
	}
};

// Delete a user
export const deleteUser = async (req, res) => {
	const { id } = req.params;
	try {
		const [result] = await pool.query('DELETE FROM users WHERE id = ?', [id]);
		if (result.affectedRows === 0) {
			return res.status(404).json({ error: 'User not found' });
		}
		res.json({ message: 'User deleted successfully' });
	} catch (err) {
		res.status(500).json({ error: 'Failed to delete user' });
	}
};

export const getRoles = async (req, res) => {
	try {
		const [rows] = await pool.query('SELECT DISTINCT role FROM users WHERE status = "Active"');
		const roles = rows.map(row => row.role);
		res.json({ roles });
	} catch (err) {
		res.status(500).json({ error: 'Failed to fetch roles' });
	}
};

export const getCounters = async (req, res) => {
	try {
		const [rows] = await pool.query('SELECT DISTINCT center FROM location_master WHERE status = "Active"');
		const counters = rows.map(row => row.center);
		res.json({ counters });
	} catch (err) {
		res.status(500).json({ error: 'Failed to fetch counters' });
	}
};

export const loginUser = async (req, res) => {
	const role = req.body.role;
	const userId = req.body.userId || req.body.user_id;
	const password = req.body.password;
	if (!role || !userId || !password) {
		return res.status(400).json({ error: 'Role, userId, and password are required.' });
	}
	try {
		const [userRows] = await pool.query(
			'SELECT * FROM users WHERE user_id = ? AND status = ? LIMIT 1',
			[userId, 'Active']
		);
		if (userRows.length === 0) {
			return res.status(401).json({ success: false, error: 'Invalid username or password.' });
		}
		const user = userRows[0];

		// Check if password in database is a bcrypt hash
		let isMatch = false;
		if (user.password && (user.password.startsWith('$2b$') || user.password.startsWith('$2a$'))) {
			isMatch = await bcrypt.compare(password, user.password);
		} else {
			// Fallback for plain text passwords in transition
			isMatch = (password === user.password);

			// Automatically upgrade the password to a hash for future logins
			if (isMatch) {
				try {
					const hashedPassword = await bcrypt.hash(password, 10);
					await pool.query('UPDATE users SET password = ? WHERE id = ?', [hashedPassword, user.id]);
					console.log(`Successfully migrated password to hash for user: ${user.user_id}`);
				} catch (migrationError) {
					console.error('Failed to migrate password:', migrationError);
					// We still allow the login even if auto-migration fails
				}
			}
		}

		if (!isMatch) {
			return res.status(401).json({ success: false, error: 'Invalid username or password.' });
		}

		if (user.role !== role) {
			return res.status(401).json({ success: false, error: `Your role is '${user.role}'. Please select the correct role.` });
		}
		const { password: _, ...userWithoutPassword } = user;
		const token = jwt.sign(
			{ userId: user.user_id, role: user.role },
			process.env.JWT_SECRET || 'your_jwt_secret',
			{ expiresIn: '1d' }
		);
		return res.json({ success: true, user: userWithoutPassword, token });
	} catch (err) {
		return res.status(500).json({ success: false, error: 'Server error. Please try again later.' });
	}
};
