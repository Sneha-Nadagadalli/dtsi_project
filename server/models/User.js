const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, unique: true, sparse: true }, // Restored: optional and unique if provided
    username: { type: String, unique: true, sparse: true }, // For parent login
    password: { type: String, required: true },
    linkedStudentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Student' }, // Direct link to student
    role: {
        type: String,
        enum: ['admin', 'doctor', 'mentor', 'parent', 'user'],
        default: 'user'
    },
    // For parents, link to student/child name or ID if needed
    childName: { type: String },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', userSchema);
