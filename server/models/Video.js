const mongoose = require('mongoose');

const videoSchema = new mongoose.Schema({
    title: { type: String, required: true },
    url: { type: String, required: true }, // YouTube or other link
    category: { type: String, default: 'General' },
    description: { type: String },
    isPrivate: { type: Boolean, default: true } // Accessible only to parents
});

module.exports = mongoose.model('Video', videoSchema);
