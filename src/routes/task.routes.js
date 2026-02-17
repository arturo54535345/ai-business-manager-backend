const express = require('express');
const router = express.Router();
const { 
    getTasks, 
    createTask, 
    updateTask, 
    deleteTask, 
    getTaskById 
} = require('../controllers/task.controller');
const auth = require('../middlewares/auth.middleware');

// Protección total
router.use(auth);

router.route('/')
    .get(getTasks)
    .post(createTask);

router.route('/:id')
    .get(getTaskById)
    .patch(updateTask)
    .delete(deleteTask);

module.exports = router;