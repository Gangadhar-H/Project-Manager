const mongoose = require('mongoose');

const ProjectSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please add a project name'],
        trim: true
    },
    description: {
        type: String,
        required: [true, 'Please add a description']
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    collaborators: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Limit projects per user to 4
ProjectSchema.statics.checkProjectLimit = async function (userId) {
    const count = await this.countDocuments({ user: userId });
    return count < 4;
};

module.exports = mongoose.model('Project', ProjectSchema);