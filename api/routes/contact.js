const router = require('express').Router();

const ALLOWED_SUBJECTS = ['unirse', 'entrenamiento', 'patrocinio', 'prensa', 'otro'];

// POST /api/contact
router.post('/', async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    if (!name || !email || !subject || !message) {
      return res.status(400).json({ error: 'Todos los campos son obligatorios' });
    }

    if (typeof name !== 'string' || name.trim().length < 2 || name.trim().length > 100) {
      return res.status(400).json({ error: 'Nombre inválido' });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      return res.status(400).json({ error: 'Email inválido' });
    }

    if (!ALLOWED_SUBJECTS.includes(subject)) {
      return res.status(400).json({ error: 'Asunto no válido' });
    }

    if (typeof message !== 'string' || message.trim().length < 10 || message.trim().length > 2000) {
      return res.status(400).json({ error: 'Mensaje inválido (10-2000 caracteres)' });
    }

    // TODO: integrar nodemailer o servicio de email
    console.log('Formulario recibido:', {
      name: name.trim(),
      email: email.trim(),
      subject,
      message: message.trim()
    });

    res.json({ success: true });
  } catch {
    res.status(500).json({ error: 'Error interno' });
  }
});

module.exports = router;
