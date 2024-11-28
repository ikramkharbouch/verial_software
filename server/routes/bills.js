const express = require('express');
const pool = require('../db');

const router = express.Router();
const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

// Get all made bills
router.get('/', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM made_bills ORDER BY date DESC');
        res.json(result.rows);
    } catch (error) {
        console.error(error);
        res.status(500).send('Error fetching made bills.');
    }
});

// Create a new made bill
router.post('/', async (req, res) => {
    const { id, provider, amount, method, date, status } = req.body;
    try {
        const query = `
            INSERT INTO made_bills (id, provider, amount, method, date, status)
            VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`;
        const values = [id, provider, amount, method, date, status];
        const result = await pool.query(query, values);
        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).send('Error creating a new made bill.');
    }
});

// Update an existing made bill
router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { provider, amount, method, date, status } = req.body;
    try {
        const query = `
            UPDATE made_bills
            SET provider = $1, amount = $2, method = $3, date = $4, status = $5
            WHERE id = $6 RETURNING *`;
        const values = [provider, amount, method, date, status, id];
        const result = await pool.query(query, values);
        if (result.rows.length === 0) {
            return res.status(404).send('Made bill not found.');
        }
        res.json(result.rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).send('Error updating the made bill.');
    }
});

// Delete a made bill
router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const query = `DELETE FROM made_bills WHERE id = $1 RETURNING *`;
        const result = await pool.query(query, [id]);
        if (result.rows.length === 0) {
            return res.status(404).send('Made bill not found.');
        }
        res.json(result.rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).send('Error deleting the made bill.');
    }
});

router.get('/:id/download', async (req, res) => {
    const { id } = req.params;

    try {
        // Define file path dynamically
        const filePath = path.join(__dirname, `../invoices/Invoice_${id}.pdf`);

        // Check if the file already exists
        if (!fs.existsSync(filePath)) {
            // Generate a new PDF file
            const doc = new PDFDocument();
            doc.pipe(fs.createWriteStream(filePath)); // Write to file

            // Add content to the PDF
            doc.fontSize(16).text(`Invoice ID: ${id}`, { align: 'center' });
            doc.text('Provider: Example Provider', { align: 'left' });
            doc.text('Amount: $1234.56', { align: 'left' });
            doc.text('Status: Paid', { align: 'left' });
            doc.text('Date: 2024-01-01', { align: 'left' });

            doc.end(); // Finalize the document
        }

        // Serve the PDF file
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename=Invoice_${id}.pdf`);
        res.sendFile(filePath);
    } catch (error) {
        console.error('Error generating or serving PDF:', error);
        res.status(500).send('Error generating invoice');
    }
});

module.exports = router;
