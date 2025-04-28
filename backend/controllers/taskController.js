// controllers/taskController.js
const Task = require('../models/Task');
const Project = require('../models/Project');
const { validationResult } = require('express-validator');

// @desc    Create new task
// @route   POST /api/tasks
// @access  Private
exports.createTask = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const { title, description, status, priority, projectId, dueDate } = req.body;

        // Check if project exists and user has access
        const project = await Project.findById(projectId);

        if (!project) {
            return res.status(404).json({ message: 'Project not found' });
        }

        // Verify user owns project or is a collaborator
        if (project.user.toString() !== req.user.id &&
            !project.collaborators.includes(req.user.id)) {
            return res.status(401).json({ message: 'Not authorized to add tasks to this project' });
        }

        const task = new Task({
            title,
            description,
            status,
            priority,
            project: projectId,
            user: req.user.id,
            dueDate
        });

        await task.save();

        res.status(201).json({
            success: true,
            data: task
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Get all tasks for a project
// @route   GET /api/tasks/project/:projectId
// @access  Private
exports.getTasksByProject = async (req, res) => {
    try {
        const project = await Project.findById(req.params.projectId);

        if (!project) {
            return res.status(404).json({ message: 'Project not found' });
        }

        // Verify user owns project or is a collaborator
        if (project.user.toString() !== req.user.id &&
            !project.collaborators.includes(req.user.id)) {
            return res.status(401).json({ message: 'Not authorized to view tasks for this project' });
        }

        const tasks = await Task.find({ project: req.params.projectId });

        res.status(200).json({
            success: true,
            count: tasks.length,
            data: tasks
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Get single task
// @route   GET /api/tasks/:id
// @access  Private
exports.getTask = async (req, res) => {
    try {
        const task = await Task.findById(req.params.id).populate('project', 'name user collaborators');

        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }

        // Check if user has access to the project
        if (task.project.user.toString() !== req.user.id &&
            !task.project.collaborators.includes(req.user.id)) {
            return res.status(401).json({ message: 'Not authorized to access this task' });
        }

        res.status(200).json({
            success: true,
            data: task
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Update task
// @route   PUT /api/tasks/:id
// @access  Private
exports.updateTask = async (req, res) => {
    const { title, description, status, priority, dueDate } = req.body;

    // Build task object
    const taskFields = {};
    if (title) taskFields.title = title;
    if (description) taskFields.description = description;
    if (status) {
        taskFields.status = status;
        // If status is changed to completed, set completedAt date
        if (status === 'Completed') {
            taskFields.completedAt = Date.now();
        } else {
            taskFields.completedAt = null;
        }
    }
    if (priority) taskFields.priority = priority;
    if (dueDate) taskFields.dueDate = dueDate;

    try {
        let task = await Task.findById(req.params.id).populate('project', 'user collaborators');

        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }

        // Check if user has access to the project
        if (task.project.user.toString() !== req.user.id &&
            !task.project.collaborators.includes(req.user.id)) {
            return res.status(401).json({ message: 'Not authorized to update this task' });
        }

        task = await Task.findByIdAndUpdate(
            req.params.id,
            { $set: taskFields },
            { new: true }
        );

        res.status(200).json({
            success: true,
            data: task
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Delete task
// @route   DELETE /api/tasks/:id
// @access  Private
exports.deleteTask = async (req, res) => {
    try {
        const task = await Task.findById(req.params.id).populate('project', 'user');

        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }

        // Only project owner can delete tasks
        if (task.project.user.toString() !== req.user.id) {
            return res.status(401).json({ message: 'Not authorized to delete this task' });
        }

        await task.remove();

        res.status(200).json({
            success: true,
            data: {}
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Add comment to task
// @route   POST /api/tasks/:id/comments
// @access  Private
exports.addComment = async (req, res) => {
    try {
        const { text } = req.body;

        if (!text) {
            return res.status(400).json({ message: 'Comment text is required' });
        }

        const task = await Task.findById(req.params.id).populate('project', 'user collaborators');

        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }

        // Check if user has access to the project
        if (task.project.user.toString() !== req.user.id &&
            !task.project.collaborators.includes(req.user.id)) {
            return res.status(401).json({ message: 'Not authorized to comment on this task' });
        }

        const newComment = {
            text,
            user: req.user.id
        };

        task.comments.unshift(newComment);
        await task.save();

        res.status(200).json({
            success: true,
            data: task.comments
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: 'Server Error' });
    }
};