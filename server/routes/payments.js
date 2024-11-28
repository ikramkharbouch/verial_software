const express = require('express');
const router = express.Router();
const pool = require('../db'); // Replace with your actual database configuration

// Middleware to parse JSON
router.use(express.json());

router.get('/', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM payments ORDER BY date DESC',
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching payments:', error);
    res.status(500).send('Internal Server Error');
  }
});

// GET a payment by ID
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query('SELECT * FROM payments WHERE id = $1', [
      id,
    ]);
    if (result.rows.length === 0) {
      return res.status(404).send('Payment not found');
    }
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error fetching payment:', error);
    res.status(500).send('Internal Server Error');
  }
});

// POST a new payment
router.post('/', async (req, res) => {
  const { payer, amount, method, date, status } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO payments (payer, amount, method, date, status) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [payer, amount, method, date, status],
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error creating payment:', error);
    res.status(500).send('Internal Server Error');
  }
});

// DELETE a payment
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query(
      'DELETE FROM payments WHERE id = $1 RETURNING *',
      [id],
    );
    if (result.rows.length === 0) {
      return res.status(404).send('Payment not found');
    }
    res.status(204).send();
  } catch (error) {
    console.error('Error deleting payment:', error);
    res.status(500).send('Internal Server Error');
  }
});

module.exports = router;
