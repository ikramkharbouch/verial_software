const express = require('express');
const router = express.Router();
const pool = require('../db'); // Assuming you have a db.js file for PostgreSQL connection

// GET route to fetch inventory data
router.get('/inventory', async (req, res) => {
  try {
    const fetchQuery = 'SELECT * FROM inventory;';
    const result = await pool.query(fetchQuery);
    res.status(200).json(result.rows);
  } catch (error) {
    console.error('Error fetching inventory data:', error);
    res.status(500).json({ error: 'Failed to fetch inventory data.' });
  }
});

// Generic GET route for finance
router.get('/finance', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM finance;');
    res.status(200).json(result.rows);
  } catch (error) {
    console.error('Error fetching finance data:', error);
    res.status(500).json({ error: 'Failed to fetch finance data.' });
  }
});

// Generic GET route for providers
router.get('/providers', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM providers;');
    res.status(200).json(result.rows);
  } catch (error) {
    console.error('Error fetching providers data:', error);
    res.status(500).json({ error: 'Failed to fetch providers data.' });
  }
});

// Generic GET route for articles
router.get('/articles', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM articles;');
    res.status(200).json(result.rows);
  } catch (error) {
    console.error('Error fetching articles data:', error);
    res.status(500).json({ error: 'Failed to fetch articles data.' });
  }
});


module.exports = router;