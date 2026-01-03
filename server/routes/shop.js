const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const Order = require('../models/Order');

const multer = require('multer');
const path = require('path');

// Configure Multer for local storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname)); // Unique filename
    }
});

const upload = multer({ storage: storage });

// Get all products
router.get('/products', async (req, res) => {
    try {
        const products = await Product.find();
        res.json(products);
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

// Create Product (Admin/Mentor) - Support Image Upload
router.post('/products', upload.single('image'), async (req, res) => {
    try {
        const { title, description, price, studentName, buyLink } = req.body;

        let imageUrl = '';
        if (req.file) {
            imageUrl = `http://localhost:5000/uploads/${req.file.filename}`;
        }

        const newProduct = new Product({
            title,
            description,
            price,
            studentName,
            imageUrl,
            buyLink
        });

        await newProduct.save();
        res.json(newProduct);
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

// Create Order (User)
router.post('/orders', async (req, res) => {
    try {
        const { user, products, totalAmount } = req.body;
        const newOrder = new Order({
            user,
            products,
            totalAmount
        });
        await newOrder.save();
        res.json(newOrder);
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

// Delete Product (Admin/Mentor)
router.delete('/products/:id', async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ msg: 'Product not found' });
        }
        await Product.findByIdAndDelete(req.params.id);
        res.json({ msg: 'Product removed' });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
