const router = require('express').Router();
const Match = require('../models/Match');
const Standings = require('../models/Standings');
const { verifyToken, requireRole } = require('../middleware/auth');

const canModify = [verifyToken, requireRole('admin', 'superadmin')];

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

// POST /api/matches — admin/superadmin
router.post('/', ...canModify, async (req, res) => {
  try {
    const match = await Match.create(req.body);
    res.status(201).json(match);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// PUT /api/matches/:id — admin/superadmin
router.put('/:id', ...canModify, async (req, res) => {
  try {
    const { id } = req.params;
    if (!/^[0-9a-fA-F]{24}$/.test(id)) return res.status(400).json({ error: 'ID inválido' });
    const match = await Match.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true
    }).select('-__v');
    if (!match) return res.status(404).json({ error: 'Partido no encontrado' });
    res.json(match);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// DELETE /api/matches/:id — solo superadmin
router.delete('/:id', verifyToken, requireRole('superadmin'), async (req, res) => {
  try {
    const { id } = req.params;
    if (!/^[0-9a-fA-F]{24}$/.test(id)) return res.status(400).json({ error: 'ID inválido' });
    const match = await Match.findByIdAndDelete(id);
    if (!match) return res.status(404).json({ error: 'Partido no encontrado' });
    res.json({ success: true });
  } catch {
    res.status(500).json({ error: 'Error al eliminar partido' });
  }
});

module.exports = router;
