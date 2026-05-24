const router = require('express').Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { verifyToken } = require('../middleware/auth');

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password || typeof username !== 'string' || typeof password !== 'string') {
      return res.status(400).json({ error: 'Credenciales inválidas' });
    }

    const user = await User.findOne({ username: username.trim().toLowerCase() });
    if (!user) return res.status(401).json({ error: 'Usuario o contraseña incorrectos' });

    const valid = await user.comparePassword(password);
    if (!valid) return res.status(401).json({ error: 'Usuario o contraseña incorrectos' });

    const token = jwt.sign(
      { id: user._id, username: user.username, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({ token, user: { username: user.username, role: user.role } });
  } catch {
    res.status(500).json({ error: 'Error en el servidor' });
  }
});

// GET /api/auth/me — verifica token activo
router.get('/me', verifyToken, (req, res) => {
  res.json({ username: req.user.username, role: req.user.role });
});

module.exports = router;
