const express = require('express');
const router = express.Router();
const { getDashboardData } = require('../controllers/dashboard.controller');
const auth = require('../middlewares/auth.middleware');

router.use(auth);

router.get('/', getDashboardData);

module.exports = router;