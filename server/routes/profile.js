const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const bcrypt = require('bcrypt');
const pool = require('../db');

// Middleware to hash password before updating
const hashPassword = async (password) => {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(password, salt);
};

// Multer configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, '../uploads'); // Resolve to the correct absolute path
    console.log('Resolved upload path:', uploadPath);
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath); // Save files in an 'uploads' folder
  },
  filename: (req, file, cb) => {
    console.log('Original file name:', file.originalname);
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    cb(null, `${uniqueSuffix}-${file.originalname}`);
  },
});

const upload = multer({ storage });

// Serve static files in the 'uploads' directory
router.use('/uploads', express.static(path.join(__dirname, '../uploads')));


// File upload endpoint
router.post('/upload', upload.single('avatar'), async (req, res) => {
  try {
    console.log('File upload endpoint hit');

    if (!req.file) {
      console.log('No file uploaded');
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const userId = req.body.userId; // Assuming the userId is sent in the request body
    if (!userId) {
      return res.status(400).json({ message: 'User ID is required' });
    }

    const fileUrl = `/uploads/${req.file.filename}`; // Relative path to the uploaded file

    // Update the profile picture in the database
    await pool.query('UPDATE users SET profile_picture = $1 WHERE id = $2', [
      fileUrl,
      userId,
    ]);

    res.status(200).json({ url: fileUrl });
  } catch (error) {
    console.error('Error during file upload:', error);
    res.status(500).json({ message: 'Failed to upload file' });
  }
});

// Profile route to fetch user data
router.post('/', async (req, res) => {
  try {
    const { userId } = req.body; // Extract userId from the request body

    if (!userId) {
      return res.status(400).json({ message: 'User ID is required' });
    }

    const result = await pool.query(
      `
        SELECT 
          id, 
          username, 
          email, 
          phone_number AS "phoneNumber", 
          profile_picture AS "profilePicture", 
          address, 
          role 
        FROM users 
        WHERE id = $1
        `,
      [userId],
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error('Error fetching profile:', error);
    res.status(500).json({ message: 'Failed to fetch profile' });
  }
});

// Update profile
router.put('/', async (req, res) => {
  try {
    const userId = req.body.userId; // Assuming userId is sent in the request body
    const {
      username,
      email,
      phoneNumber,
      profilePicture,
      address,
      role,
      password,
    } = req.body;

    if (!userId) {
      return res.status(400).json({ message: 'User ID is required' });
    }

    const hashedPassword = password ? await hashPassword(password) : undefined;

    await pool.query(
      `UPDATE users
         SET
           username = COALESCE($1, username),
           email = COALESCE($2, email),
           phone_number = COALESCE($3, phone_number),
           profile_picture = COALESCE($4, profile_picture),
           address = COALESCE($5, address),
           role = COALESCE($6, role),
           password = COALESCE($7, password),
           updated_at = CURRENT_TIMESTAMP
         WHERE id = $8`,
      [
        username,
        email,
        phoneNumber,
        profilePicture,
        address,
        role,
        hashedPassword,
        userId,
      ],
    );

    const updatedResult = await pool.query(
      'SELECT id, username, email, phone_number AS "phoneNumber", profile_picture AS "profilePicture", address, role FROM users WHERE id = $1',
      [userId],
    );

    res.status(200).json(updatedResult.rows[0]);
  } catch (error) {
    console.error('Error updating profile:', error);
    res.status(500).json({ message: 'Failed to update profile' });
  }
});

module.exports = router;