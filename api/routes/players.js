const router = require('express').Router();
const multer = require('multer');
const Player = require('../models/Player');
const { verifyToken, requireRole } = require('../middleware/auth');

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 2 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    if (file.mimetype.startsWith('image/')) cb(null, true);
    else cb(new Error('Solo se permiten imágenes'));
  }
});

// GET /api/players?category=delantera|medios|trasera
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

// POST /api/players — crear jugador (admin/superadmin)
router.post(
  '/',
  verifyToken,
  requireRole('admin', 'superadmin'),
  upload.single('photo'),
  async (req, res) => {
    try {
      const { name, number, position, category, nationality, age } = req.body;

      const data = {
        name: String(name || '').trim(),
        number: Number(number),
        position: String(position || '').trim(),
        category,
        nationality: nationality || '🇪🇸',
        age: age ? Number(age) : undefined
      };

      if (req.file) {
        data.avatar = `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`;
      } else {
        data.avatar = `https://ui-avatars.com/api/?name=${encodeURIComponent(data.name)}&background=213c94&color=fef744&size=200&bold=true`;
      }

      const player = await Player.create(data);
      res.status(201).json(player);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  }
);

// PUT /api/players/:id — editar nombre y/o foto (admin/superadmin)
router.put(
  '/:id',
  verifyToken,
  requireRole('admin', 'superadmin'),
  upload.single('photo'),
  async (req, res) => {
    try {
      const { id } = req.params;
      if (!/^[0-9a-fA-F]{24}$/.test(id)) {
        return res.status(400).json({ error: 'ID inválido' });
      }

      const updates = {};
      if (req.body.name)     updates.name     = String(req.body.name).trim().slice(0, 100);
      if (req.body.number)   updates.number   = Number(req.body.number);
      if (req.body.position) updates.position = String(req.body.position).trim().slice(0, 60);

      if (req.file) {
        updates.avatar = `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`;
      }

      const player = await Player.findByIdAndUpdate(id, updates, {
        new: true,
        runValidators: true
      }).select('-__v');

      if (!player) return res.status(404).json({ error: 'Jugador no encontrado' });
      res.json(player);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  }
);

// DELETE /api/players/:id — solo superadmin
router.delete(
  '/:id',
  verifyToken,
  requireRole('superadmin'),
  async (req, res) => {
    try {
      const { id } = req.params;
      if (!/^[0-9a-fA-F]{24}$/.test(id)) {
        return res.status(400).json({ error: 'ID inválido' });
      }
      const player = await Player.findByIdAndDelete(id);
      if (!player) return res.status(404).json({ error: 'Jugador no encontrado' });
      res.json({ success: true });
    } catch {
      res.status(500).json({ error: 'Error al eliminar jugador' });
    }
  }
);

module.exports = router;
