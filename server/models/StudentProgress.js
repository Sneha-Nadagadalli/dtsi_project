const mongoose = require('mongoose');

const progressSchema = new mongoose.Schema({
    studentName: { type: String, required: true }, // Or link to User if students have accounts
    mentor: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    date: { type: Date, default: Date.now },
    description: { type: String, required: true },
    details: { type: String }, // specific metrics or notes
    sharedWith: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }] // Parents who can view
});

module.exports = mongoose.model('StudentProgress', progressSchema);
