const express = require('express');
const router = express.Router();
const { 
    getFinances, 
    createFinance, 
    deleteFinance, 
    getSummary 
} = require('../controllers/finance.controller');
const auth = require('../middlewares/auth.middleware');

router.use(auth);

// ¡Importante! La ruta 'summary' debe ir ANTES de '/:id' para que no confunda la palabra "summary" con un ID
router.get('/summary', getSummary);

router.route('/')
    .get(getFinances)
    .post(createFinance);

router.route('/:id')
    .delete(deleteFinance);

module.exports = router;