const express = require('express');
const router = express.Router();
const StudentProgress = require('../models/StudentProgress');
// Middleware to verify token would go here, skipping for brevity in initial setup but important for production

// Get all progress (Mentor/Admin)
router.get('/', async (req, res) => {
    try {
        const progress = await StudentProgress.find().populate('mentor', 'name').sort({ date: -1 });
        res.json(progress);
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

// Get progress for a specific student (Parent)
router.get('/student/:name', async (req, res) => {
    try {
        const progress = await StudentProgress.find({ studentName: req.params.name }).sort({ date: -1 });
        res.json(progress);
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

// Add Progress (Mentor)
router.post('/', async (req, res) => {
    try {
        const { studentName, mentor, description, details } = req.body;
        const newProgress = new StudentProgress({
            studentName,
            mentor,
            description,
            details
        });
        const savedProgress = await newProgress.save();
        res.json(savedProgress);
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
