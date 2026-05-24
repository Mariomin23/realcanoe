require('dotenv').config();
const express = require('express');
const path = require('path');
const connectDB = require('./config/db');

const app = express();

app.use(express.json({ limit: '10kb' }));

// Serve static assets without exposing server files
app.use('/css', express.static(path.join(__dirname, 'css')));
app.use('/js', express.static(path.join(__dirname, 'js')));

// Connect DB before each request (cached for serverless)
app.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (err) {
    res.status(503).json({ error: 'Base de datos no disponible' });
  }
});

// API routes
app.use('/api/auth', require('./api/routes/auth'));
app.use('/api/players', require('./api/routes/players'));
app.use('/api/matches', require('./api/routes/matches'));
app.use('/api/news', require('./api/routes/news'));
app.use('/api/contact', require('./api/routes/contact'));

// Serve frontend
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Export for Vercel serverless
module.exports = app;

// Listen only when run directly (local dev)
if (require.main === module) {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Real Canoe Rugby server running on port ${PORT}`);
  });
}
