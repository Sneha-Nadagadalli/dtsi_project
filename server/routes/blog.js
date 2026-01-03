const express = require('express');
const router = express.Router();
const Blog = require('../models/Blog');
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

// Get all blogs
router.get('/', async (req, res) => {
    try {
        const blogs = await Blog.find().sort({ date: -1 });
        res.json(blogs);
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

// Create Blog (Doctor)
router.post('/', upload.single('image'), async (req, res) => {
    try {
        const { title, content, author } = req.body;

        let image = '';
        if (req.file) {
            image = `http://localhost:5000/uploads/${req.file.filename}`;
        }

        const newBlog = new Blog({
            title,
            content,
            author, // Default is 'Dr. Sneha' in schematic if empty, but good to pass if needed
            image
        });

        await newBlog.save();
        res.json(newBlog);
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

// Update Blog (Doctor)
router.put('/:id', upload.single('image'), async (req, res) => {
    try {
        const { title, content, author } = req.body;
        let updateData = { title, content, author };

        if (req.file) {
            updateData.image = `http://localhost:5000/uploads/${req.file.filename}`;
        }

        const updatedBlog = await Blog.findByIdAndUpdate(
            req.params.id,
            updateData,
            { new: true }
        );

        if (!updatedBlog) {
            return res.status(404).json({ msg: 'Blog not found' });
        }

        res.json(updatedBlog);
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

// Delete Blog
router.delete('/:id', async (req, res) => {
    try {
        const blog = await Blog.findById(req.params.id);
        if (!blog) {
            return res.status(404).json({ msg: 'Blog not found' });
        }
        await Blog.findByIdAndDelete(req.params.id);
        res.json({ msg: 'Blog removed' });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
