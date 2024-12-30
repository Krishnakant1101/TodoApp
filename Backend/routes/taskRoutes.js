const express = require('express');
const { getTasks, createTask, updateTask, deleteTask,updateTaskStage } = require('../controllers/taskController');
const authenticateToken = require('../middlewares/authenticateToken');

const router = express.Router();

router.get('/getAllTodoData',  getTasks);
router.post('/addTodoData',  createTask);
router.put('/updateTodoData',  updateTask);
router.put('/updateTodoStage',  updateTaskStage);
router.delete('/deleteTodoData',  deleteTask);

module.exports = router;
