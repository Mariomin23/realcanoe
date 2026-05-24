const router = require('express').Router();
const News = require('../models/News');

// GET /api/news
router.get('/', async (req, res) => {
  try {
    const news = await News.find()
      .select('-__v')
      .sort({ createdAt: -1 });
    res.json(news);
  } catch {
    res.status(500).json({ error: 'Error al obtener noticias' });
  }
});

module.exports = router;
