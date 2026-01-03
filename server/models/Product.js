const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    imageUrl: { type: String, required: true },
    studentName: { type: String }, // Artist
    stock: { type: Number, default: 1 },
    category: { type: String, default: 'Painting' },
    buyLink: { type: String }
});

module.exports = mongoose.model('Product', productSchema);
