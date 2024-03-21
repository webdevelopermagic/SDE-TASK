const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const db = require('./db');
const snippetModel = require('./models/snippet');
const redis = require('redis');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(bodyParser.json());
app.use(cors());

// Redis Client
const redisClient = redis.createClient();

redisClient.on('error', (err) => {
  console.error('Redis Error:', err);
});

// Endpoint to submit a code snippet
app.post('/api/snippets', async (req, res) => {
  try {
    const { username, language, stdin, code } = req.body;
    const snippet = await snippetModel.createSnippet(username, language, stdin, code);
    // Invalidate cache
    redisClient.del('snippets');
    res.json(snippet);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Endpoint to fetch all code snippets
app.get('/api/snippets', async (req, res) => {
  try {
    redisClient.get('snippets', async (err, data) => {
      if (err) throw err;

      if (data !== null) {
        res.json(JSON.parse(data));
      } else {
        const snippets = await snippetModel.getAllSnippets();
        redisClient.setex('snippets', 3600, JSON.stringify(snippets));
        res.json(snippets);
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
