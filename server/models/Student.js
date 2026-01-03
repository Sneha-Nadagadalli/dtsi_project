const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
    name: { type: String, required: true },
    age: { type: Number },
    details: { type: String }, // Diagnosis or background
    mentor: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // The mentor managing this file
    parent: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // Linked parent account
    accessUsername: { type: String }, // Username for parent to log in
    conditionDescription: { type: String, default: '' },
    medicalRecords: [{
        filename: String,
        fileUrl: String,
        uploadedAt: { type: Date, default: Date.now }
    }],
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Student', studentSchema);
