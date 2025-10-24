// require('dotenv').config();
const express = require('express');
const mysql = require('mysql2');
require('dotenv').config();
const app = express();
const port = process.env.PORT || 3000;
const PORT = process.env.PORT || 5000;


app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
app.use(express.urlencoded({ extended: true })); // handles form data
app.use(express.static('public')); // serves index.html from /public

// ✅ Database connection

const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,   // <- make sure this is here
  database: process.env.DB_NAME
});

db.connect((err) => {
  if (err) {
    console.error('Database connection failed:', err);
    return;
  }
  console.log('Connected to MySQL database');
});

app.post("/register", (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).send("Username and password required");
  }

  const sql = "INSERT INTO users (username, password) VALUES (?, ?)";
  db.query(sql, [username, password], (err, result) => {
    if (err) {
      console.error("Error inserting user:", err);
      return res.status(500).send("Error saving user");
    }
    res.send("User registered successfully!");
  });
});

// ✅ Login route (put this here)
app.post('/login', (req, res) => {
  const { username, password } = req.body;

  const query = 'INSERT INTO users (username, password) VALUES (?, ?)';
  db.query(query, [username, password], (err, result) => {
    if (err) {
      console.error('Database error:', err);
      return res.send('<h2>Oops! Something went wrong. Try again.</h2>');
    }
    console.log('New user saved:', username);
    res.send(`<h2>Thanks, ${username}. Your login has been recorded ✅</h2>`);
  });
});

// ✅ Start server
app.listen(port, () => {
  console.log(`Server started on http://localhost:${port}`);
});
