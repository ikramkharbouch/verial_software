const express = require('express');
const router = express.Router();
const pool = require('../db'); // Assuming you have a db.js file for PostgreSQL connection

// GET route to fetch inventory data
router.get('/inventory', async (req, res) => {
  try {
    const fetchQuery = 'SELECT * FROM articles;';
    const result = await pool.query(fetchQuery);
    res.status(200).json(result.rows);
  } catch (error) {
    console.error('Error fetching inventory data:', error);
    res.status(500).json({ error: 'Failed to fetch inventory data.' });
  }
});

router.get('/finance/invoices-overview', async (req, res) => {
  try {
    const query = 'SELECT month, outstanding, paid FROM finance;';
    const result = await pool.query(query);
    res.status(200).json(result.rows);
  } catch (error) {
    console.error('Error fetching invoices overview data:', error);
    res.status(500).json({ error: 'Failed to fetch invoices overview data.' });
  }
});

router.get('/finance/due-invoices', async (req, res) => {
  try {
    const query = `
      SELECT due_date AS x, due_invoices AS y
      FROM finance
      WHERE due_date IS NOT NULL AND due_invoices IS NOT NULL;
    `;
    const result = await pool.query(query);

    // Format the data for the frontend
    const responseData = [
      {
        id: 'Invoices',
        data: result.rows,
      },
    ];

    res.status(200).json(responseData);
  } catch (error) {
    console.error('Error fetching due invoices data:', error);
    res.status(500).json({ error: 'Failed to fetch due invoices data.' });
  }
});

router.get('/finance/revenue-expenses', async (req, res) => {
  try {
    const query = 'SELECT month AS x, revenue, expenses FROM finance;';
    const result = await pool.query(query);

    // Format the data
    const revenueData = result.rows.map((row) => ({
      x: row.x,
      y: row.revenue,
    }));

    const expensesData = result.rows.map((row) => ({
      x: row.x,
      y: row.expenses,
    }));

    const formattedData = [
      { id: 'Revenue', data: revenueData },
      { id: 'Expenses', data: expensesData },
    ];

    res.status(200).json(formattedData);
  } catch (error) {
    console.error('Error fetching revenue and expenses data:', error);
    res.status(500).json({ error: 'Failed to fetch revenue and expenses data.' });
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