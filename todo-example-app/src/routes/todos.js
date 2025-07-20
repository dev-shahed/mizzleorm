const express = require('express');
const { TodoModel } = require('../models/todo');
const { getDB } = require('../config/database');

const router = express.Router();

// Middleware to initialize TodoModel
router.use((req, res, next) => {
  req.todoModel = new TodoModel(getDB());
  next();
});

// GET /api/todos/stats - Get todo statistics
router.get('/stats', async (req, res) => {
  try {
    const stats = await req.todoModel.getStats();
    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// GET /api/todos - Get all todos with optional filters
router.get('/', async (req, res) => {
  try {
    const { completed, priority } = req.query;
    const filters = {};
    
    if (completed !== undefined) {
      filters.completed = completed === 'true';
    }
    
    if (priority) {
      filters.priority = priority;
    }

    const todos = await req.todoModel.findAll(filters);
    res.json({
      success: true,
      data: todos,
      count: todos.length
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// GET /api/todos/:id - Get a specific todo
router.get('/:id', async (req, res) => {
  try {
    const todo = await req.todoModel.findById(req.params.id);
    
    if (!todo) {
      return res.status(404).json({
        success: false,
        error: 'Todo not found'
      });
    }

    res.json({
      success: true,
      data: todo
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
});

// POST /api/todos - Create a new todo
router.post('/', async (req, res) => {
  try {
    const todo = await req.todoModel.create(req.body);
    res.status(201).json({
      success: true,
      data: todo
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
});

// PUT /api/todos/:id - Update a todo
router.put('/:id', async (req, res) => {
  try {
    const todo = await req.todoModel.update(req.params.id, req.body);
    
    if (!todo) {
      return res.status(404).json({
        success: false,
        error: 'Todo not found'
      });
    }

    res.json({
      success: true,
      data: todo
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
});

// PATCH /api/todos/:id/toggle - Toggle todo completion status
router.patch('/:id/toggle', async (req, res) => {
  try {
    const todo = await req.todoModel.toggleComplete(req.params.id);
    res.json({
      success: true,
      data: todo
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
});

// DELETE /api/todos/:id - Delete a todo
router.delete('/:id', async (req, res) => {
  try {
    const deleted = await req.todoModel.delete(req.params.id);
    
    if (!deleted) {
      return res.status(404).json({
        success: false,
        error: 'Todo not found'
      });
    }

    res.json({
      success: true,
      message: 'Todo deleted successfully'
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
});

module.exports = router;