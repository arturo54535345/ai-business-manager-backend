const express = require('express');
const router = express.Router();
const { register, login } = require('../controllers/auth.controller');

// ==========================================
// RUTAS DE AUTENTICACIÓN
// ==========================================

// 🔓 RUTAS PÚBLICAS (Cualquiera puede acceder)
router.post('/register', register);
router.post('/login', login);

// 🔮 FUTURO: Aquí pondremos la ruta para "Ver mi perfil" (/me)
// router.get('/me', require('../middlewares/auth.middleware'), getMe);

module.exports = router;