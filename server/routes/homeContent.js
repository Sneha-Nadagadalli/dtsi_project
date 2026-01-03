const express = require('express');
const router = express.Router();
const HomeContent = require('../models/HomeContent');

// Get home content (Public)
router.get('/', async (req, res) => {
    try {
        let content = await HomeContent.findOne();
        if (!content) {
            // Create default content if it doesn't exist
            content = new HomeContent();
            await content.save();
        }
        res.json(content);
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

// Update home content (Mentor/Admin)
router.put('/', async (req, res) => {
    try {
        const { _id, __v, ...updateData } = req.body;
        let content = await HomeContent.findOne();

        if (!content) {
            content = new HomeContent(updateData);
        } else {
            Object.assign(content, updateData);
            content.updatedAt = Date.now();
        }

        await content.save();
        res.json(content);
    } catch (err) {
        console.error("HOME CONTENT UPDATE ERROR:", err);
        res.status(500).json({ msg: 'Server Error', error: err.message });
    }
});

module.exports = router;
