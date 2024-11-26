const express = require('express');
const chargesRouter = express.Router();
const db = require('../db'); // Replace with your actual database configuration

// Get all charges
chargesRouter.get('/', async (req, res) => {
    try {
        const result = await db.query('SELECT * FROM charges ORDER BY charge_date DESC');
        res.status(200).json(result.rows);
    } catch (error) {
        console.error('Error fetching charges:', error);
        res.status(500).json({ error: 'Failed to fetch charges' });
    }
});

// Get a single charge by ID
chargesRouter.get('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const result = await db.query('SELECT * FROM charges WHERE id = $1', [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Charge not found' });
        }
        res.status(200).json(result.rows[0]);
    } catch (error) {
        console.error('Error fetching charge:', error);
        res.status(500).json({ error: 'Failed to fetch charge' });
    }
});

// Create a new charge
chargesRouter.post('/', async (req, res) => {
    const { charge_type, provider_client, invoice_number, payment_method, charge_date, amount, description } = req.body;
    try {
        const result = await db.query(
            `INSERT INTO charges 
             (charge_type, provider_client, invoice_number, payment_method, charge_date, amount, description) 
             VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
            [charge_type, provider_client, invoice_number, payment_method, charge_date, amount, description]
        );
        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error('Error creating charge:', error);
        res.status(500).json({ error: 'Failed to create charge' });
    }
});

// Update a charge
chargesRouter.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { charge_type, provider_client, invoice_number, payment_method, charge_date, amount, description } = req.body;
    try {
        const result = await db.query(
            `UPDATE charges 
             SET charge_type = $1, provider_client = $2, invoice_number = $3, 
                 payment_method = $4, charge_date = $5, amount = $6, description = $7, updated_at = NOW() 
             WHERE id = $8 RETURNING *`,
            [charge_type, provider_client, invoice_number, payment_method, charge_date, amount, description, id]
        );
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Charge not found' });
        }
        res.status(200).json(result.rows[0]);
    } catch (error) {
        console.error('Error updating charge:', error);
        res.status(500).json({ error: 'Failed to update charge' });
    }
});

// Delete a charge
chargesRouter.delete('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const result = await db.query('DELETE FROM charges WHERE id = $1 RETURNING *', [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Charge not found' });
        }
        res.status(200).json({ message: 'Charge deleted successfully' });
    } catch (error) {
        console.error('Error deleting charge:', error);
        res.status(500).json({ error: 'Failed to delete charge' });
    }
});

module.exports = chargesRouter;
