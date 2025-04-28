// controllers/projectController.js
const Project = require('../models/Project');
const { validationResult } = require('express-validator');

// @desc    Create new project
// @route   POST /api/projects
// @access  Private
exports.createProject = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        // Check project limit
        const canCreate = await Project.checkProjectLimit(req.user.id);
        if (!canCreate) {
            return res.status(400).json({ message: 'User can have maximum 4 projects' });
        }

        const { name, description } = req.body;

        const project = new Project({
            name,
            description,
            user: req.user.id
        });

        await project.save();

        res.status(201).json({
            success: true,
            data: project
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Get all projects for logged in user
// @route   GET /api/projects
// @access  Private
exports.getProjects = async (req, res) => {
    try {
        const projects = await Project.find({
            $or: [
                { user: req.user.id },
                { collaborators: req.user.id }
            ]
        });

        res.status(200).json({
            success: true,
            count: projects.length,
            data: projects
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Get single project
// @route   GET /api/projects/:id
// @access  Private
exports.getProject = async (req, res) => {
    try {
        const project = await Project.findById(req.params.id);

        if (!project) {
            return res.status(404).json({ message: 'Project not found' });
        }

        // Make sure user owns the project or is a collaborator
        if (project.user.toString() !== req.user.id &&
            !project.collaborators.includes(req.user.id)) {
            return res.status(401).json({ message: 'Not authorized to access this project' });
        }

        res.status(200).json({
            success: true,
            data: project
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Update project
// @route   PUT /api/projects/:id
// @access  Private
exports.updateProject = async (req, res) => {
    const { name, description } = req.body;

    // Build project object
    const projectFields = {};
    if (name) projectFields.name = name;
    if (description) projectFields.description = description;

    try {
        let project = await Project.findById(req.params.id);

        if (!project) {
            return res.status(404).json({ message: 'Project not found' });
        }

        // Make sure user owns the project
        if (project.user.toString() !== req.user.id) {
            return res.status(401).json({ message: 'Not authorized to update this project' });
        }

        project = await Project.findByIdAndUpdate(
            req.params.id,
            { $set: projectFields },
            { new: true }
        );

        res.status(200).json({
            success: true,
            data: project
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Delete project
// @route   DELETE /api/projects/:id
// @access  Private
exports.deleteProject = async (req, res) => {
    try {
        const project = await Project.findById(req.params.id);

        if (!project) {
            return res.status(404).json({ message: 'Project not found' });
        }

        // Make sure user owns the project
        if (project.user.toString() !== req.user.id) {
            return res.status(401).json({ message: 'Not authorized to delete this project' });
        }

        await project.remove();

        res.status(200).json({
            success: true,
            data: {}
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Add collaborator to project
// @route   PUT /api/projects/:id/collaborators
// @access  Private
exports.addCollaborator = async (req, res) => {
    try {
        const { email } = req.body;

        // Find user by email
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const project = await Project.findById(req.params.id);

        if (!project) {
            return res.status(404).json({ message: 'Project not found' });
        }

        // Make sure user owns the project
        if (project.user.toString() !== req.user.id) {
            return res.status(401).json({ message: 'Not authorized to add collaborators' });
        }

        // Check if user is already a collaborator
        if (project.collaborators.includes(user._id)) {
            return res.status(400).json({ message: 'User is already a collaborator' });
        }

        project.collaborators.push(user._id);
        await project.save();

        res.status(200).json({
            success: true,
            data: project
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: 'Server Error' });
    }
};