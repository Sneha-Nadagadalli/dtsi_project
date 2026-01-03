const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
    title: { type: String, required: true },
    student: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
    status: { type: String, enum: ['Pending', 'In Progress', 'Completed'], default: 'Pending' },
    score: { type: Number, default: 0 }, // e.g., 0-100% or 0-10 scale
    feedback: { type: String },
    assignedDate: { type: Date, default: Date.now },
    dueDate: { type: Date },
    completedDate: { type: Date }
});

module.exports = mongoose.model('Task', taskSchema);
