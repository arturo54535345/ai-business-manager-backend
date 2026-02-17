const express = require('express');
const router = express.Router();
const { register, login } = require('../controllers/auth.controller');

// --- RUTAS PÚBLICAS (Cualquiera puede entrar) ---
router.post('/register', register);
router.post('/login', login);

// --- FUTURAS RUTAS DE AUTH (Aquí irán más adelante) ---
// router.post('/forgot-password', forgotPassword);
// router.post('/reset-password/:token', resetPassword);
// router.get('/me', authMiddleware, getMe); // Para ver tus propios datos

module.exports = router;