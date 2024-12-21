const express = require('express');
const { body, validationResult } = require('express-validator');
const pool = require('../db');

const router = express.Router();
const { v4: uuidv4 } = require('uuid'); // Import UUID library

// GET all users
router.get('/', async (req, res) => {
  try {
    const query = `SELECT * FROM users`;
    const result = await pool.query(query);

    res.status(200).json(result.rows);
  } catch (error) {
    console.error('Database error:', error);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

// POST create a new user
router.post(
  '/create',
  [
    body('name').notEmpty().withMessage("Name is required"),
    body('email').isEmail().withMessage('Email must be valid'),
    body('role').notEmpty().withMessage("Role is required"),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log(errors);
      return res.status(400).json({ errors: errors.array() });
    }

    // Generate a new ID
    const id = uuidv4(); // Generate unique ID using UUID
    const { name, email, role } = req.body;

    try {
      const query = `
        INSERT INTO users (id, name, email, role)
        VALUES ($1, $2, $3, $4)
      `;
      await pool.query(query, [id, name, email, role]);

      res.status(201).json({ message: 'User created successfully!' });
    } catch (error) {
      console.error('Database error:', error);
      res.status(500).json({ error: 'Failed to create user' });
    }
  }
);

// DELETE user by ID
router.delete('/:id', async (req, res) => {
  const { id } = req.params; // Extract user ID from URL parameters

  try {
    const result = await pool.query('DELETE FROM users WHERE id = $1', [id]);

    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ error: 'An error occurred while deleting the user' });
  }
});

// PUT update user by ID
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { name, email, role } = req.body;

  try {
    const query = `
      UPDATE users
      SET name = $1, email = $2, role = $3
      WHERE id = $4
    `;
    const result = await pool.query(query, [name, email, role, id]);

    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.status(200).json({ message: 'User updated successfully!' });
  } catch (error) {
    console.error('Database error:', error);
    res.status(500).json({ error: 'Failed to update user' });
  }
});

module.exports = router;
