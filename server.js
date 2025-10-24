require('dotenv').config();
const express = require('express');
const { Pool } = require('pg');
const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

pool.connect()
  .then(() => console.log('✅ Connected to PostgreSQL database'))
  .catch(err => console.error('❌ Database connection failed:', err));

app.post("/register", async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).send("Username and password required");
  }

  try {
    const query = "INSERT INTO users (username, password) VALUES ($1, $2)";
    await pool.query(query, [username, password]);
    res.send("User registered successfully!");
  } catch (err) {
    console.error("Error inserting user:", err);
    res.status(500).send("Error saving user");
  }
});

app.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    const query = "SELECT * FROM users WHERE username = $1 AND password = $2";
    const result = await pool.query(query, [username, password]);

    if (result.rows.length > 0) {
      res.send(`<h2>Welcome back, ${username}! ✅</h2>`);
    } else {
      res.send('<h2>Invalid username or password ❌</h2>');
    }
  } catch (err) {
    console.error('Database error:', err);
    res.status(500).send("Something went wrong, please try again.");
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
