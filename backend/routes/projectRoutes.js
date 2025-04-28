// routes/projectRoutes.js
const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const {
    createProject,
    getProjects,
    getProject,
    updateProject,
    deleteProject,
    addCollaborator
} = require('../controllers/projectController');
const { protect } = require('../middleware/auth');

// Create project
router.post('/', [
    protect,
    check('name', 'Name is required').not().isEmpty(),
    check('description', 'Description is required').not().isEmpty()
], createProject);

// Get all projects for user
router.get('/', protect, getProjects);

// Get single project
router.get('/:id', protect, getProject);

// Update project
router.put('/:id', protect, updateProject);

// Delete project
router.delete('/:id', protect, deleteProject);

// Add collaborator to project
router.put('/:id/collaborators', protect, addCollaborator);

module.exports = router;