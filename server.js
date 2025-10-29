// server.js — Express backend using PostgreSQL (pg)

const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());
// Serve static frontend from repo root
app.use(express.static(__dirname));

// Simple correct answers map
const correctAnswers = {
  q1: 'Chandragupta Maurya',
  q2: '1947',
  q3: 'Bihar',
  q4: 'Bahadur Shah Zafar',
  q5: 'Civil Disobedience Movement',
};

// Health endpoint for Render and quick checks
app.get('/health', async (req, res) => {
  // If DB is available, do a lightweight query, otherwise return OK
  if (global.__USE_IN_MEMORY_DB || !global.__POOL) {
    return res.json({ status: 'ok' });
  }

  try {
    const client = await global.__POOL.connect();
    try {
      await client.query('SELECT 1');
      res.json({ status: 'ok' });
    } finally {
      client.release();
    }
  } catch (err) {
    console.error('Health check DB error:', err);
    res.status(500).json({ status: 'error', error: String(err) });
  }
});

// Choose storage strategy: managed Postgres or in-memory (used for tests)
if (process.env.USE_IN_MEMORY_DB === 'true' || process.env.NODE_ENV === 'test') {
  // In-memory fallback: store results in an array
  global.__USE_IN_MEMORY_DB = true;
  const results = [];

  app.post('/api/submitQuiz', (req, res) => {
    const userAnswers = req.body;
    let score = 0;
    for (const key in correctAnswers) {
      if (userAnswers[key] === correctAnswers[key]) score++;
    }

    const id = results.length + 1;
    results.push({ id, timestamp: new Date().toISOString(), score, userAnswers, correctAnswers });

    res.status(201).json({ message: 'Quiz submitted (in-memory)', score, correctAnswers, resultId: id });
  });
} else {
  // Postgres-backed storage (production / Render)
  const connectionString = process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/quizquestdb';

  const pool = new Pool({
    connectionString,
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
  });

  global.__POOL = pool;

  async function initDB() {
    const client = await pool.connect();
    try {
      await client.query(`
        CREATE TABLE IF NOT EXISTS results (
          id SERIAL PRIMARY KEY,
          timestamp TIMESTAMPTZ DEFAULT now(),
          score INTEGER NOT NULL,
          user_answers JSONB NOT NULL,
          correct_answers JSONB NOT NULL
        );
      `);
      console.log('✅ Postgres: results table is ready');
    } finally {
      client.release();
    }
  }

  app.post('/api/submitQuiz', async (req, res) => {
    try {
      const userAnswers = req.body;
      let score = 0;
      for (const key in correctAnswers) {
        if (userAnswers[key] === correctAnswers[key]) score++;
      }

      const client = await pool.connect();
      try {
        const insert = await client.query(
          `INSERT INTO results(score, user_answers, correct_answers) VALUES($1, $2, $3) RETURNING id`,
          [score, userAnswers, correctAnswers]
        );

        res.status(201).json({ message: 'Quiz submitted and score saved!', score, correctAnswers, resultId: insert.rows[0].id });
      } finally {
        client.release();
      }
    } catch (err) {
      console.error('Error saving quiz result:', err);
      res.status(500).json({ message: 'Server error during quiz submission.' });
    }
  });

  initDB().catch((err) => console.error('DB init error:', err));
}

// Export app for tests
module.exports = app;

// Only start the server when run directly (not when required by tests)
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
  });
}