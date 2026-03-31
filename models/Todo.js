const mongoose = require('mongoose');

// [LOG: 20260331_1142] - Modularized Todo Schema
const todoSchema = new mongoose.Schema({
    id: { type: Number, required: true, unique: true },
    text: { type: String, required: true }
});

const Todo = mongoose.model('Todo', todoSchema);

module.exports = Todo;
