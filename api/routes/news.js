const router = require('express').Router();
const News = require('../models/News');
const { verifyToken, requireRole } = require('../middleware/auth');

const canModify = [verifyToken, requireRole('admin', 'superadmin')];

// GET /api/news
router.get('/', async (req, res) => {
  try {
    const news = await News.find().select('-__v').sort({ createdAt: -1 });
    res.json(news);
  } catch {
    res.status(500).json({ error: 'Error al obtener noticias' });
  }
});

// POST /api/news — admin/superadmin
router.post('/', ...canModify, async (req, res) => {
  try {
    const { title, excerpt, date, category, image } = req.body;
    const item = await News.create({ title, excerpt, date, category, image });
    res.status(201).json(item);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// PUT /api/news/:id — admin/superadmin
router.put('/:id', ...canModify, async (req, res) => {
  try {
    const { id } = req.params;
    if (!/^[0-9a-fA-F]{24}$/.test(id)) return res.status(400).json({ error: 'ID inválido' });
    const { title, excerpt, date, category, image } = req.body;
    const item = await News.findByIdAndUpdate(
      id,
      { title, excerpt, date, category, image },
      { new: true, runValidators: true }
    ).select('-__v');
    if (!item) return res.status(404).json({ error: 'Noticia no encontrada' });
    res.json(item);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// DELETE /api/news/:id — solo superadmin
router.delete('/:id', verifyToken, requireRole('superadmin'), async (req, res) => {
  try {
    const { id } = req.params;
    if (!/^[0-9a-fA-F]{24}$/.test(id)) return res.status(400).json({ error: 'ID inválido' });
    const item = await News.findByIdAndDelete(id);
    if (!item) return res.status(404).json({ error: 'Noticia no encontrada' });
    res.json({ success: true });
  } catch {
    res.status(500).json({ error: 'Error al eliminar noticia' });
  }
});

module.exports = router;
