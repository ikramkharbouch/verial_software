const express = require('express');
const router = express.Router();
const pool = require('../db'); // Assuming you have a pool setup for your database connection

// GET route to fetch all articles
router.get('/', async (req, res) => {
  try {
    const query = `
        SELECT 
          id, 
          name AS productName, 
          provider_id, 
          dimensions, 
          sales, 
          used, 
          stock_level, 
          low_stock, 
          brand, 
          purchase_price, 
          sale_price AS totalPrice, 
          profit_margin, 
          last_sold, 
          created_at, 
          updated_at, 
          description 
        FROM articles
      `;
    const result = await pool.query(query);
    res.status(200).json(result.rows);
  } catch (error) {
    console.error('Error fetching articles:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;
