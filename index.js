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
const pages = ['/', '/plantilla', '/calendario', '/noticias', '/contacto'];
const htmlFiles = {
  '/':          'index.html',
  '/plantilla': 'plantilla.html',
  '/calendario':'calendario.html',
  '/noticias':  'noticias.html',
  '/contacto':  'contacto.html',
};
pages.forEach(route => {
  app.get(route, (req, res) => {
    res.sendFile(path.join(__dirname, htmlFiles[route]));
  });
  app.get(route + '.html', (req, res) => {
    res.sendFile(path.join(__dirname, htmlFiles[route]));
  });
});

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
