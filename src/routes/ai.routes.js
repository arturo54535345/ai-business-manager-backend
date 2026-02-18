const express = require('express');
const router = express.Router();
const {chatWithAI} = require('../controllers/ai.controller');
const auth = require('../middlewares/auth.middleware');

//protegemos la ruta con autenticacion solo para usuarios registrados
router.use(auth);

router.post('/chat', chatWithAI);

module.exports = router;