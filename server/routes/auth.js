var express = require('express');
var router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const pool = require('../db');
const crypto = require('crypto');
const secretKey = crypto.randomBytes(32).toString('hex');

// Secret keys for JWT
const ACCESS_TOKEN_SECRET = secretKey;
const REFRESH_TOKEN_SECRET = crypto.randomBytes(32).toString('hex');
const invalidatedTokens = new Set(); // Use Redis or a database in production

// Generate Tokens
const generateAccessToken = (user) => {
  return jwt.sign({ id: user.id, username: user.username }, ACCESS_TOKEN_SECRET, { expiresIn: '15m' });
};

const generateRefreshToken = (user) => {
  return jwt.sign({ id: user.id, username: user.username }, REFRESH_TOKEN_SECRET);
};

// Login Route
router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  console.log(username, password);

  try {
    console.log('try username', username);
    const query = `SELECT * FROM users WHERE username = $1`; // No need for manual quotes around $1
    const values = [username.username]; // Add quotes around the username value

    const result = await pool.query(query, values);

    const user = result.rows[0];

    console.log(result.rows);

    if (!user) {
      console.log('user problem ?')
      return res.status(400).json({ message: 'User not found' });
    }

    const isMatch = await bcrypt.compare(username.password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    console.log('password is a match')

    // Generate tokens
    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    // Store refresh token in database
    await pool.query('INSERT INTO refresh_tokens (user_id, token) VALUES ($1, $2)', [user.id, refreshToken]);

    // Send refresh token as an HttpOnly cookie
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      // secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
    });

    console.log(accessToken);

    res.status(200).json({
      user: { id: user.id, username: user.username, email: user.email },
      accessToken,
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Register Route
router.post('/register', async (req, res) => {
  const { username, password, email } = req.body;

  try {
    const existingUser = await pool.query('SELECT * FROM users WHERE username = $1', [username]);
    if (existingUser.rows.length > 0) {
      return res.status(400).json({ message: 'Username already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await pool.query(
      'INSERT INTO users (username, password, email) VALUES ($1, $2, $3) RETURNING *',
      [username, hashedPassword, email],
    );

    const newUser = result.rows[0];
    res.status(201).json({ user: { id: newUser.id, username: newUser.username } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

router.post('/refresh', async (req, res) => {
  const refreshToken = req.cookies.refreshToken;

  if (!refreshToken) {
    return res.status(401).json({ message: 'No refresh token provided' });
  }

  try {
    const decoded = jwt.verify(refreshToken, REFRESH_TOKEN_SECRET);

    // Generate a new access token
    const accessToken = generateAccessToken({ id: decoded.id, username: decoded.username });
    res.status(200).json({ accessToken });
  } catch (err) {
    console.error('Refresh token validation error:', err.message);
    res.status(401).json({ message: 'Invalid or expired refresh token' });
  }
});

// Validate Endpoint (Access Token)
router.post('/validate', async (req, res) => {
  const { authorization } = req.headers;

  if (!authorization) {
    return res.status(401).json({ message: 'No token provided' });
  }

  const token = authorization.split(' ')[1];
  if (invalidatedTokens.has(token)) {
    return res.status(401).json({ message: 'Token is invalidated' });
  }

  try {
    const decoded = jwt.verify(token, ACCESS_TOKEN_SECRET);
    const result = await pool.query('SELECT id, username, email FROM users WHERE id = $1', [decoded.id]);
    const user = result.rows[0];
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json({ user });
  } catch (err) {
    console.error('Token validation error:', err.message);
    res.status(401).json({ message: 'Invalid or expired token' });
  }
});

// Logout Route
router.post('/logout', async (req, res) => {
  const { refreshToken } = req.cookies;

  if (refreshToken) {
    // Delete the refresh token from the database
    await pool.query('DELETE FROM refresh_tokens WHERE token = $1', [refreshToken]);
  }

  res.clearCookie('refreshToken'); // Clear refresh token cookie
  res.status(200).json({ message: 'Logged out successfully' });
});

module.exports = router;
