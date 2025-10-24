const express = require('express');
const mysql = require('mysql2');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Serve static frontend (if using build/dist folder)
app.use(express.static(path.join(__dirname, 'public'))); // or 'dist' if using React/Vite

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Database connection
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

db.connect((err) => {
  if (err) {
    console.error('Database connection failed:', err);
    return;
  }
  console.log('✅ Connected to MySQL database');
});

// Register route
app.post('/register', (req, res) => {
  const { username, password } = req.body;

  if (!username || !password)
    return res.status(400).send('Username and password required');

  const sql = 'INSERT INTO users (username, password) VALUES (?, ?)';
  db.query(sql, [username, password], (err, result) => {
    if (err) {
      console.error('Error inserting user:', err);
      return res.status(500).send('Error saving user');
    }
    res.send('User registered successfully!');
  });
});

// Login route
app.post('/login', (req, res) => {
  const { username, password } = req.body;

  const sql = 'SELECT * FROM users WHERE username = ? AND password = ?';
  db.query(sql, [username, password], (err, results) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).send('Error during login');
    }

    if (results.length > 0) {
      res.send(`Welcome back, ${username}! ✅`);
    } else {
      res.send('Invalid username or password ❌');
    }
  });
});

// Start server
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
