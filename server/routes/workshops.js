const express = require('express');
const router = express.Router();
const Workshop = require('../models/Workshop');

// Get all workshops
router.get('/', async (req, res) => {
    try {
        const workshops = await Workshop.find().sort({ date: 1 });
        res.json(workshops);
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

// Create Workshop (Mentor/Admin)
router.post('/', async (req, res) => {
    try {
        const newWorkshop = new Workshop(req.body);
        await newWorkshop.save();
        res.json(newWorkshop);
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

// Delete Workshop (Mentor/Admin)
router.delete('/:id', async (req, res) => {
    try {
        const workshop = await Workshop.findById(req.params.id);
        if (!workshop) {
            return res.status(404).json({ msg: 'Workshop not found' });
        }
        await Workshop.findByIdAndDelete(req.params.id);
        res.json({ msg: 'Workshop removed' });
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

// Update Workshop (Mentor/Admin)
router.put('/:id', async (req, res) => {
    try {
        const { title, date, description } = req.body;
        const updatedWorkshop = await Workshop.findByIdAndUpdate(
            req.params.id,
            { title, date, description },
            { new: true }
        );
        if (!updatedWorkshop) {
            return res.status(404).json({ msg: 'Workshop not found' });
        }
        res.json(updatedWorkshop);
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

module.exports = router;
