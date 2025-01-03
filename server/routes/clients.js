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

router.put(
  '/:id',
  [
    body('companyName').optional().isString().withMessage("Company's name must be a string"),
    body('nif').optional().isString().withMessage('NIF must be a string'),
    body('clientName').optional().isString().withMessage("Client's name must be a string"),
    body('clientType').optional().isString().withMessage('Client type must be a string'),
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

    console.log(errors);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { id } = req.params;
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

    try {
      // Construct the SET clause dynamically based on provided fields
      const fields = [];
      const values = [];
      let index = 1;

      if (companyName) fields.push(`company_name = $${index++}`), values.push(companyName);
      if (nif) fields.push(`nif = $${index++}`), values.push(nif);
      if (clientName) fields.push(`client_name = $${index++}`), values.push(clientName);
      if (clientType) fields.push(`client_type = $${index++}`), values.push(clientType);
      if (phone1) fields.push(`phone1 = $${index++}`), values.push(phone1);
      if (phone2) fields.push(`phone2 = $${index++}`), values.push(phone2);
      if (phone3) fields.push(`phone3 = $${index++}`), values.push(phone3);
      if (iceo) fields.push(`iceo = $${index++}`), values.push(iceo);
      if (country) fields.push(`country = $${index++}`), values.push(country);
      if (province) fields.push(`province = $${index++}`), values.push(province);
      if (postalCode) fields.push(`postal_code = $${index++}`), values.push(postalCode);
      if (email1) fields.push(`email1 = $${index++}`), values.push(email1);
      if (email2) fields.push(`email2 = $${index++}`), values.push(email2);
      if (email3) fields.push(`email3 = $${index++}`), values.push(email3);

      // Ensure at least one field to update is provided
      if (fields.length === 0) {
        return res.status(400).json({ error: 'No fields provided for update' });
      }

      values.push(id);

      const query = `
        UPDATE clients
        SET ${fields.join(', ')}
        WHERE id = $${index}
      `;

      await pool.query(query, values);

      res.status(200).json({ message: 'Client updated successfully!' });
    } catch (error) {
      console.error('Database error:', error);
      res.status(500).json({ error: 'Database update failed' });
    }
  },
);


// DELETE Client by ID
router.delete('/:id', async (req, res) => {
  const { id } = req.params; // Extract client ID from URL parameters

  console.log(id);

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
    body('items.*.name')
      .isString()
      .withMessage('Each item must have a name'),
    body('items.*.units')
      .isInt({ gt: 0 })
      .withMessage('Each item must have a positive unit count'),
    body('items.*.unitPrice')
      .isFloat({ min: 0 })
      .withMessage('Each item must have a valid unit price'),
    body('items.*.tvaPercentage1')
      .isFloat({ min: 0 })
      .withMessage('Each item must have a valid first TVA percentage'),
    body('items.*.tvaPercentage2')
      .isFloat({ min: 0 })
      .withMessage('Each item must have a valid second TVA percentage'),
    body('date')
      .isISO8601()
      .toDate()
      .withMessage('Invalid date format'),
    body('comment')
      .optional()
      .isString()
      .withMessage('Comment must be a string'),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { clientName, invoiceType, items, date, comment } = req.body;

    try {
      // Generate the invoice number
      const currentMonth = new Date().getMonth() + 1; // Months are 0-indexed
      const invoiceNumber = `${String(currentMonth).padStart(2, '0')}-${await getNextInvoiceNumber()}`;

      // Calculate the total price for all items
      const totalPrice = items.reduce((sum, item) => {
        const priceAfterTva1 = item.unitPrice * (1 + item.tvaPercentage1 / 100);
        const finalPrice = priceAfterTva1 * (1 + item.tvaPercentage2 / 100);
        return sum + finalPrice * item.units;
      }, 0);

      // Insert the invoice data
      const query = `
        INSERT INTO client_invoices
          (invoice_number, client_name, invoice_type, items, date_of_purchase, total_price, comment)
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        RETURNING *;
      `;

      const result = await pool.query(query, [
        invoiceNumber,
        clientName,
        invoiceType,
        JSON.stringify(items), // Save items as JSON
        date,
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

// Function to get the next invoice number from the sequence
async function getNextInvoiceNumber() {
  const result = await pool.query('SELECT nextval(\'invoice_number_seq\') AS next_invoice_number');
  return String(result.rows[0].next_invoice_number).padStart(3, '0');
}


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

router.put('/client-invoices/:id', async (req, res) => {
  const { id } = req.params;
  const {
    client_name,
    invoice_type,
    date_of_purchase,
    total_price,
    comment,
  } = req.body;

  try {
    const result = await pool.query(
      `UPDATE client_invoices
       SET client_name = $1,
           invoice_type = $2,
           date_of_purchase = $3,
           total_price = $4,
           comment = $5
       WHERE id = $6
       RETURNING *`,
      [client_name, invoice_type, date_of_purchase, total_price, comment, id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ message: 'Invoice not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error updating invoice:', error);
    res.status(500).json({ message: 'Failed to update invoice' });
  }
});

router.delete('/client-invoices/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query(
      `DELETE FROM client_invoices
       WHERE invoice_id = $1
       RETURNING *`,
      [id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ message: 'Invoice not found' });
    }

    res.json({ message: 'Invoice deleted successfully', invoice: result.rows[0] });
  } catch (error) {
    console.error('Error deleting invoice:', error);
    res.status(500).json({ message: 'Failed to delete invoice' });
  }
});

module.exports = router;
