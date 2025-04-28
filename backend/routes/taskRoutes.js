// routes/taskRoutes.js
const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const {
    createTask,
    getTasksByProject,
    getTask,
    updateTask,
    deleteTask,
    addComment
} = require('../controllers/taskController');
const { protect } = require('../middleware/auth');

// Create task
router.post('/', [
    protect,
    check('title', 'Title is required').not().isEmpty(),
    check('description', 'Description is required').not().isEmpty(),
    check('projectId', 'Project ID is required').not().isEmpty()
], createTask);

// Get all tasks for a project
router.get('/project/:projectId', protect, getTasksByProject);

// Get single task
router.get('/:id', protect, getTask);

// Update task
router.put('/:id', protect, updateTask);

// Delete task
router.delete('/:id', protect, deleteTask);

// Add comment to task
router.post('/:id/comments', protect, addComment);

module.exports = router;