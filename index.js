require('dotenv').config();
const express = require('express');
const path = require('path');
const connectDB = require('./config/db');

const app = express();

app.use(express.json({ limit: '10kb' }));

// Serve static assets
app.use('/css', express.static(path.join(__dirname, 'css')));
app.use('/js', express.static(path.join(__dirname, 'js')));

// Serve frontend — no DB needed
app.get('/',                (req, res) => res.sendFile(path.join(__dirname, 'index.html')));
app.get('/plantilla',       (req, res) => res.sendFile(path.join(__dirname, 'plantilla.html')));
app.get('/plantilla.html',  (req, res) => res.sendFile(path.join(__dirname, 'plantilla.html')));
app.get('/calendario',      (req, res) => res.sendFile(path.join(__dirname, 'calendario.html')));
app.get('/calendario.html', (req, res) => res.sendFile(path.join(__dirname, 'calendario.html')));
app.get('/noticias',        (req, res) => res.sendFile(path.join(__dirname, 'noticias.html')));
app.get('/noticias.html',   (req, res) => res.sendFile(path.join(__dirname, 'noticias.html')));
app.get('/contacto',        (req, res) => res.sendFile(path.join(__dirname, 'contacto.html')));
app.get('/contacto.html',   (req, res) => res.sendFile(path.join(__dirname, 'contacto.html')));

// DB middleware only for API routes
const dbMiddleware = async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (err) {
    res.status(503).json({ error: 'Base de datos no disponible' });
  }
};

// API routes
app.use('/api/auth',    dbMiddleware, require('./api/routes/auth'));
app.use('/api/players', dbMiddleware, require('./api/routes/players'));
app.use('/api/matches', dbMiddleware, require('./api/routes/matches'));
app.use('/api/news',    dbMiddleware, require('./api/routes/news'));
app.use('/api/contact', dbMiddleware, require('./api/routes/contact'));

// Export for Vercel serverless
module.exports = app;

// Listen only when run directly (local dev)
if (require.main === module) {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Real Canoe Rugby server running on port ${PORT}`);
  });
}
