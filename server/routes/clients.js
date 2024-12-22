const express = require('express');
const { body, validationResult } = require('express-validator');
const pool = require('../db');

const router = express.Router();
const { v4: uuidv4 } = require('uuid'); // Import UUID library

router.get('/', async (req, res) => {
  try {
    const query = `SELECT * FROM clients`;
    const result = await pool.query(query);

    res.status(200).json(result.rows);
  } catch (error) {
    console.error('Database error:', error);
    res.status(500).json({ error: 'Failed to fetch clients' });
  }
});

router.post(
  '/create',
  [
    body('companyName').notEmpty().withMessage("Company's name is required"),
    body('nif').notEmpty().withMessage('NIF is required'),
    body('clientName').notEmpty().withMessage("Client's name is required"),
    body('phone1')
      .optional()
      .isMobilePhone()
      .withMessage('Phone 1 must be a valid phone number'),
    body('phone2')
      .optional()
      .isMobilePhone()
      .withMessage('Phone 2 must be a valid phone number'),
    body('phone3')
      .optional()
      .isMobilePhone()
      .withMessage('Phone 3 must be a valid phone number'),
    body('email1')
      .optional()
      .isEmail()
      .withMessage('Email 1 must be a valid email'),
    body('email2')
      .optional()
      .isEmail()
      .withMessage('Email 2 must be a valid email'),
    body('email3')
      .optional()
      .isEmail()
      .withMessage('Email 3 must be a valid email'),
    body('postalCode')
      .optional()
      .isPostalCode('any')
      .withMessage('Postal code must be valid'),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    console.log(req.body);
    console.log(errors);
    if (!errors.isEmpty()) {
      console.log('did it enter here ?');
      console.log(errors);
      return res.status(400).json({ errors: errors.array() });
    }

    // Generate a new ID
    const id = uuidv4(); // Generate unique ID using UUID

    const {
      companyName,
      nif,
      clientName,
      clientType,
      phone1,
      phone2,
      phone3,
      iceo,
      country,
      province,
      postalCode,
      email1,
      email2,
      email3,
    } = req.body;

    console.log(req.body);

    try {
      const query = `
      INSERT INTO clients (company_name, nif, client_name, client_type, phone1, phone2, phone3, iceo, country, province, postal_code, email1, email2, email3)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
    `;
    await pool.query(query, [
      companyName,
      nif,
      clientName,
      clientType,
      phone1,
      phone2,
      phone3,
      iceo,
      country,
      province,
      postalCode,
      email1,
      email2,
      email3,
    ]);
    
      res.status(201).json({ message: 'Client added successfully!' });
    } catch (error) {
      console.error('Database error:', error);
      res.status(500).json({ error: 'Database insertion failed' });
    }
  },
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
    res
      .status(500)
      .json({ error: 'An error occurred while deleting the client' });
  }
});

router.post(
  '/client-documents/create',
  [
    body('clientName').notEmpty().withMessage('Client name is required'),
    body('invoiceType').notEmpty().withMessage('Invoice type is required'),
    body('items')
      .isArray({ min: 1 })
      .withMessage('At least one item must be selected'),
    body('date')
      .isISO8601()
      .toDate()
      .withMessage('Invalid date format'),
    body('units')
      .isInt({ min: 1 })
      .withMessage('Units must be a positive integer'),
    body('price')
      .isNumeric()
      .withMessage('Price must be a valid number'),
    body('comment')
      .optional()
      .isString()
      .withMessage('Comment must be a string'),
  ],
  async (req, res) => {
    const errors = validationResult(req);

    console.log(req.body);

    // console.log(errors);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { clientName, invoiceType, items, date, units, price, comment } = req.body;

    try {
      const query = `
        INSERT INTO client_invoices
          (client_name, invoice_type, items, date_of_purchase, number_of_units, unit_price, total_price, comment)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
        RETURNING *;
      `;
      const tvaPercentage = 20; // For calculation, you can make this dynamic if needed.
      const totalPrice = price + (price * tvaPercentage) / 100;

      const result = await pool.query(query, [
        clientName,
        invoiceType,
        JSON.stringify(items),
        date,
        units,
        price,
        totalPrice,
        comment || null,
      ]);

      res.status(201).json(result.rows[0]);
    } catch (error) {
      console.error('Database error:', error);
      res.status(500).json({ error: 'Failed to create the invoice' });
    }
  }
);

// Route to get all client invoices
router.get('/client-invoices', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM client_invoices ORDER BY id DESC');
    res.status(200).json(result.rows); // Send all rows as JSON response
  } catch (error) {
    console.error('Error fetching client invoices:', error);
    res.status(500).json({ error: 'Failed to fetch client invoices' });
  }
});

module.exports = router;
