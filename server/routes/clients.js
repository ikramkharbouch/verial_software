const express = require('express');
const { body, validationResult } = require('express-validator');
const pool = require('../db');

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const query = `SELECT * FROM clients`;
    const result = await pool.query(query);

    res.status(200).json(result.rows);
  } catch (error) {
    console.error("Database error:", error);
    res.status(500).json({ error: 'Failed to fetch clients' });
  }
});

router.post('/create',
  [
    body('id').isInt().withMessage('ID should be a number'),
    body('companyName').notEmpty().withMessage("Company's name is required"),
    body('nif').notEmpty().withMessage('NIF is required'),
    body('clientName').notEmpty().withMessage("Client's name is required"),
    body('phone1').optional().isMobilePhone().withMessage('Phone 1 must be a valid phone number'),
    body('phone2').optional().isMobilePhone().withMessage('Phone 2 must be a valid phone number'),
    body('phone3').optional().isMobilePhone().withMessage('Phone 3 must be a valid phone number'),
    body('email1').optional().isEmail().withMessage('Email 1 must be a valid email'),
    body('email2').optional().isEmail().withMessage('Email 2 must be a valid email'),
    body('email3').optional().isEmail().withMessage('Email 3 must be a valid email'),
    body('postalCode').optional().isPostalCode('any').withMessage('Postal code must be valid')
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { id, companyName, nif, clientName, clientType, phone1, phone2, phone3, iceo, country, province, postalCode, email1, email2, email3 } = req.body;

    try {
      const query = `
        INSERT INTO clients (id, company_name, nif, client_name, client_type, phone1, phone2, phone3, iceo, country, province, postal_code, email1, email2, email3)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)
      `;
      await pool.query(query, [id, companyName, nif, clientName, clientType, phone1, phone2, phone3, iceo, country, province, postalCode, email1, email2, email3]);

      res.status(201).json({ message: 'Client added successfully!' });
    } catch (error) {
      console.error("Database error:", error);
      res.status(500).json({ error: 'Database insertion failed' });
    }
  }
);

// DELETE Client by ID
router.delete('/:id', async (req, res) => {
  const { id } = req.params; // Extract client ID from URL parameters


  try {
      // Execute a query to delete the client from the database
      const result = await pool.query('DELETE FROM clients WHERE id = $1', [id]);

      if (result.rowCount === 0) {
          return res.status(404).json({ error: 'Client not found' });
      }

      res.status(200).json({ message: 'Client deleted successfully' });
  } catch (error) {
      console.error('Error deleting client:', error);
      res.status(500).json({ error: 'An error occurred while deleting the client' });
  }
});

module.exports = router;
