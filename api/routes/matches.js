const router = require('express').Router();
const Match = require('../models/Match');
const Standings = require('../models/Standings');

// GET /api/matches/upcoming
router.get('/upcoming', async (req, res) => {
  try {
    const matches = await Match.find({ status: 'upcoming' })
      .select('-__v')
      .sort({ sortOrder: 1 });
    res.json(matches);
  } catch {
    res.status(500).json({ error: 'Error al obtener próximos partidos' });
  }
});

// GET /api/matches/calendar
router.get('/calendar', async (req, res) => {
  try {
    const matches = await Match.find()
      .select('-__v')
      .sort({ sortOrder: 1 });
    res.json(matches);
  } catch {
    res.status(500).json({ error: 'Error al obtener calendario' });
  }
});

// GET /api/matches/standings
router.get('/standings', async (req, res) => {
  try {
    const standings = await Standings.find()
      .select('-__v')
      .sort({ position: 1 });
    res.json(standings);
  } catch {
    res.status(500).json({ error: 'Error al obtener clasificación' });
  }
});

module.exports = router;
