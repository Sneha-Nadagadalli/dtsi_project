const express = require('express');
const router = express.Router();
const Video = require('../models/Video');

// Get all videos
router.get('/', async (req, res) => {
    try {
        const videos = await Video.find();
        res.json(videos);
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

// Add Video (Admin)
router.post('/', async (req, res) => {
    try {
        const newVideo = new Video(req.body);
        await newVideo.save();
        res.json(newVideo);
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

module.exports = router;
