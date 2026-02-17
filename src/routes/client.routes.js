const express = require('express');
const router = express.Router();
const { 
    getClients, 
    createClient, 
    updateClient, 
    deleteClient, 
    getClientById 
} = require('../controllers/client.controller');
const auth = require('../middlewares/auth.middleware');

// Todas las rutas de aquí para abajo están protegidas por el middleware 'auth'
router.use(auth);

router.route('/')
    .get(getClients)
    .post(createClient);

router.route('/:id')
    .get(getClientById)
    .patch(updateClient) // Usamos PATCH para actualizaciones parciales
    .delete(deleteClient);

module.exports = router;