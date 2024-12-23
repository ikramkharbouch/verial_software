const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
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

router.post(
    '/',
    [
      body('name').notEmpty().withMessage('Product name is required'),
      body('dimensions').notEmpty().withMessage('Dimensions are required'),
      body('brand').notEmpty().withMessage('Brand is required'),
      body('description').optional().isString(),
      body('purchase_price')
        .isNumeric()
        .withMessage('Purchase price must be a number'),
      body('sale_price')
        .isNumeric()
        .withMessage('Sale price must be a number'),
      body('stock_level')
        .isInt({ min: 0 })
        .withMessage('Stock level must be a non-negative integer'),
      body('low_stock')
        .isInt({ min: 0 })
        .withMessage('Low stock threshold must be a non-negative integer'),
      body('used').isIn([0, 1]).withMessage('Used must be 0 (No) or 1 (Yes)'),
      body('last_sold').isISO8601().withMessage('Last sold date must be a valid date'),
    ],
    async (req, res) => {
      const errors = validationResult(req);
  
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
  
      const {
        name,
        dimensions,
        brand,
        description,
        purchase_price,
        sale_price,
        stock_level,
        low_stock,
        used,
        last_sold,
      } = req.body;
  
      try {
        const query = `
          INSERT INTO articles (
            name,
            dimensions,
            brand,
            description,
            purchase_price,
            sale_price,
            stock_level,
            low_stock,
            used,
            last_sold
          )
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
          RETURNING *;
        `;
  
        const values = [
          name,
          dimensions,
          brand,
          description,
          purchase_price,
          sale_price,
          stock_level,
          low_stock,
          used,
          last_sold,
        ];
  
        const result = await pool.query(query, values);
        res.status(201).json({
          message: 'Article created successfully',
          article: result.rows[0],
        });
      } catch (error) {
        console.error('Error creating article:', error);
        res.status(500).json({ error: 'Internal Server Error' });
      }
    }
  );
  
  module.exports = router;
  
