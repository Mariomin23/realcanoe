const router = require('express').Router();
const Player = require('../models/Player');

// GET /api/players?category=delantera|medios|trasera|all
router.get('/', async (req, res) => {
  try {
    const { category } = req.query;
    const allowedCategories = ['delantera', 'medios', 'trasera'];
    const filter = category && allowedCategories.includes(category) ? { category } : {};
    const players = await Player.find(filter).select('-__v').sort({ number: 1 });
    res.json(players);
  } catch {
    res.status(500).json({ error: 'Error al obtener jugadores' });
  }
});

module.exports = router;
