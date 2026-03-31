const express = require('express');
const router = express.Router();
const Todo = require('../models/Todo');

// [LOG: 20260331_1144] - All /todos routes moved here

// 할 일 목록 가져오기
router.get('/', async (req, res) => {
    try {
        const todos = await Todo.find();
        res.json(todos);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// 할 일 추가
router.post('/', async (req, res) => {
    const todo = new Todo(req.body);
    try {
        const newTodo = await todo.save();
        res.status(201).json(newTodo);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// 할 일 수정 (PATCH)
router.patch('/:id', async (req, res) => {
    try {
        const updatedTodo = await Todo.findOneAndUpdate(
            { id: req.params.id },
            { $set: req.body },
            { new: true }
        );
        if (!updatedTodo) return res.status(404).send('Not Found');
        res.json(updatedTodo);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// 할 일 삭제
router.delete('/:id', async (req, res) => {
    try {
        const result = await Todo.deleteOne({ id: req.params.id });
        if (result.deletedCount === 0) return res.status(404).send('Not Found');
        res.status(204).send();
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// 전체 삭제
router.delete('/', async (req, res) => {
    try {
        await Todo.deleteMany({});
        res.status(204).send();
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
