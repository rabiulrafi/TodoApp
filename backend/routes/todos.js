const express = require('express');
const { getTodos, addTodo,getSingleTodo,deleteSingleTodo, updateSingleTodo  } = require('../controllers/todoController');
const router = express.Router();

router.get('/', getTodos);
router.post('/', addTodo);
router.get('/:id', getSingleTodo);
router.delete('/:id', deleteSingleTodo);
router.put('/:id', updateSingleTodo);

module.exports = router;
