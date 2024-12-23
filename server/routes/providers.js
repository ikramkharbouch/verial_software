const express = require('express');
const router = express.Router();
const pool = require('../db');
const { body, validationResult } = require('express-validator');

// Route to fetch all providers
router.get('/', async (req, res) => {

    console.log('here');
  try {
    const query = 'SELECT * FROM providers';
    const result = await pool.query(query);
    res.status(200).json(result.rows);
  } catch (error) {
    console.error('Error fetching providers:', error);
    res.status(500).json({ error: 'Failed to fetch providers' });
  }
});

// Create a new provider
router.post(
  '/create',
  [
    body('name').notEmpty().withMessage('Name is required').isString(),
    body('orders').notEmpty().withMessage('Orders is required').isInt(),
    body('pending').notEmpty().withMessage('Pending is required').isInt(),
    body('value').notEmpty().withMessage('Value is required').isNumeric(),
    body('email').optional().isEmail().withMessage('Invalid email format'),
    body('phone')
      .optional()
      .isMobilePhone()
      .withMessage('Invalid phone format'),
    body('country').optional().isString(),
    body('province').optional().isString(),
    body('address').optional().isString(),
    body('type').optional().isString(),
    body('status').optional().isString(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {
      name,
      orders,
      pending,
      value,
      email,
      phone,
      country,
      province,
      address,
      type,
      status,
    } = req.body;

    const query = `
        INSERT INTO providers (
          name, orders, pending, value, color, email, phone, country,
          province, address, type, status, created_at, updated_at
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
        RETURNING *;
      `;

    try {
      const randomColor = getRandomColor();
      const result = await pool.query(query, [
        name,
        orders,
        pending,
        value,
        randomColor,
        email,
        phone,
        country,
        province,
        address,
        type,
        status,
      ]);

      res
        .status(201)
        .json({
          message: 'Provider created successfully',
          provider: result.rows[0],
        });
    } catch (error) {
      console.error('Database error:', error);
      res.status(500).json({ error: 'Failed to create provider' });
    }
  },
);

// Update a provider
router.put(
  '/:id',
  [
    body('name').optional().isString().withMessage('Name must be a string'),
    body('orders').optional().isInt().withMessage('Orders must be an integer'),
    body('pending')
      .optional()
      .isInt()
      .withMessage('Pending must be an integer'),
    body('value').optional().isNumeric().withMessage('Value must be a number'),
    body('label').optional().isString().withMessage('Label must be a string'),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { id } = req.params;
    const { name, orders, pending, value, label } = req.body;

    const fields = [];
    const values = [];

    if (name !== undefined) {
      fields.push('name = $' + (fields.length + 1));
      values.push(name);
    }
    if (orders !== undefined) {
      fields.push('orders = $' + (fields.length + 1));
      values.push(orders);
    }
    if (pending !== undefined) {
      fields.push('pending = $' + (fields.length + 1));
      values.push(pending);
    }
    if (value !== undefined) {
      fields.push('value = $' + (fields.length + 1));
      values.push(value);
    }
    if (label !== undefined) {
      fields.push('label = $' + (fields.length + 1));
      values.push(label);
    }

    if (fields.length === 0) {
      return res.status(400).json({ error: 'No valid fields to update' });
    }

    const query = `
        UPDATE providers
        SET ${fields.join(', ')}
        WHERE id = $${fields.length + 1}
        RETURNING *;
      `;
    values.push(id);

    try {
      const result = await pool.query(query, values);
      if (result.rowCount === 0) {
        return res.status(404).json({ error: 'Provider not found' });
      }
      res
        .status(200)
        .json({
          message: 'Provider updated successfully',
          provider: result.rows[0],
        });
    } catch (error) {
      console.error('Database error:', error);
      res.status(500).json({ error: 'Failed to update provider' });
    }
  },
);

// Delete a provider
router.delete('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query(
      'DELETE FROM providers WHERE id = $1 RETURNING *',
      [id],
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Provider not found' });
    }

    res
      .status(200)
      .json({
        message: 'Provider deleted successfully',
        provider: result.rows[0],
      });
  } catch (error) {
    console.error('Database error:', error);
    res.status(500).json({ error: 'Failed to delete provider' });
  }
});

module.exports = router;
