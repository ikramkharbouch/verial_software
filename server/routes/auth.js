var express = require('express');
var router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const pool = require('../db');
const crypto = require('crypto');
const secretKey = crypto.randomBytes(32).toString('hex');

// Secret key for JWT
const JWT_SECRET = secretKey;

// Login Route
router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    // Fetch user from database
    const result = await pool.query('SELECT * FROM users WHERE username = $1', [
      username,
    ]);
    const user = result.rows[0];

    if (!user) {
      return res.status(400).json({ message: 'User not found' });
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Generate token
    const token = jwt.sign(
      { id: user.id, username: user.username },
      JWT_SECRET,
      { expiresIn: '1h' },
    );

    res.json({ user: { id: user.id, username: user.username }, token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Register Route
router.post('/register', async (req, res) => {
  const { username, password } = req.body;

  try {
    // Check if username already exists
    const existingUser = await pool.query(
      'SELECT * FROM users WHERE username = $1',
      [username],
    );
    if (existingUser.rows.length > 0) {
      return res.status(400).json({ message: 'Username already exists' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert the new user
    const result = await pool.query(
      'INSERT INTO users (username, password) VALUES ($1, $2) RETURNING *',
      [username, hashedPassword],
    );

    const newUser = result.rows[0];
    res
      .status(201)
      .json({ user: { id: newUser.id, username: newUser.username } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Validate Token Route
router.post('/validate', (req, res) => {
  const { authorization } = req.headers;

  if (!authorization) {
    return res.status(401).json({ message: 'No token provided' });
  }

  const token = authorization.split(' ')[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    res.json({ user: { id: decoded.id, username: decoded.username } });
  } catch (err) {
    res.status(401).json({ message: 'Invalid token' });
  }
});

module.exports = router;