const express = require('express');
const router = express.Router();
const Student = require('../models/Student');
const Task = require('../models/Task');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const User = require('../models/User');
const bcrypt = require('bcryptjs');

// Configure Multer for Medical Records
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadPath = 'uploads/medical/';
        if (!fs.existsSync(uploadPath)) {
            fs.mkdirSync(uploadPath, { recursive: true });
        }
        cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname);
    }
});

const upload = multer({ storage: storage });

// === STUDENTS ===

// Get all students for a specific mentor
router.get('/my-students/:mentorId', async (req, res) => {
    try {
        const students = await Student.find({ mentor: req.params.mentorId });
        res.json(students);
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

// Search Student by Name (Parent)
router.post('/student/search', async (req, res) => {
    try {
        const { name } = req.body;
        // ... (existing search logic)
        if (!name) return res.status(400).json({ msg: 'Please enter a name' });
        const student = await Student.findOne({ name: { $regex: new RegExp(name.trim(), 'i') } });
        if (!student) return res.status(404).json({ msg: 'Student not found' });
        res.json(student);
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

// Get My Child (Parent - Auto Link)
router.get('/student/my-child/:studentId', async (req, res) => {
    try {
        const student = await Student.findById(req.params.studentId);
        if (!student) {
            return res.status(404).json({ msg: 'No student linked to this account' });
        }
        res.json(student);
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

// Create Student (Mentor)
router.post('/students', async (req, res) => {
    try {
        const { name, mentor } = req.body;

        const newStudent = new Student({
            name,
            mentor
        });

        // Auto-generate Parent Credentials
        // Format: name_3randomdigits (e.g., john_492)
        const cleanName = name.replace(/\s+/g, '').toLowerCase();
        const randomSuffix = Math.floor(100 + Math.random() * 900);
        const username = `${cleanName}_${randomSuffix}`;
        const password = '112233';

        // Create Parent User
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const parentUser = new User({
            name: `Parent of ${name}`,
            username: username,
            password: hashedPassword,
            role: 'parent',
            linkedStudentId: newStudent._id
        });

        await parentUser.save();

        // Update Student with Parent Info
        newStudent.parent = parentUser._id;
        newStudent.accessUsername = username;

        await newStudent.save();

        res.json({
            ...newStudent.toObject(),
            generatedUsername: username,
            generatedPassword: password
        });
    } catch (err) {
        console.error("ERROR CREATING STUDENT:", err);
        res.status(500).json({ msg: 'Server Error', error: err.message, stack: err.stack });
    }
});

// Delete Student (Mentor)
router.delete('/students/:id', async (req, res) => {
    try {
        const student = await Student.findById(req.params.id);
        if (!student) {
            return res.status(404).json({ msg: 'Student not found' });
        }
        await Student.findByIdAndDelete(req.params.id);
        // Optionally delete associated tasks? For now, we'll leave them or cascade later.
        // await Task.deleteMany({ student: req.params.id }); 
        res.json({ msg: 'Student removed' });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

// Update Student (Mentor - Name & Condition)
router.put('/students/:id', async (req, res) => {
    try {
        const updatedStudent = await Student.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(updatedStudent);
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

// Upload Medical Record
router.post('/students/:id/medical-records', upload.single('file'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ msg: 'No file uploaded' });
        }

        const fileUrl = `http://localhost:5000/uploads/medical/${req.file.filename}`;

        const student = await Student.findById(req.params.id);
        student.medicalRecords.push({
            filename: req.file.originalname,
            fileUrl: fileUrl
        });
        await student.save();

        res.json(student);
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

// Delete Medical Record
router.delete('/students/:id/medical-records/:recordId', async (req, res) => {
    try {
        const student = await Student.findById(req.params.id);
        const record = student.medicalRecords.id(req.params.recordId);

        if (record) {
            // Optional: Delete file from filesystem
            // const filePath = path.join(__dirname, '../../uploads/medical/', path.basename(record.fileUrl));
            // if (fs.existsSync(filePath)) fs.unlinkSync(filePath);

            record.deleteOne(); // Remove subdocument
            await student.save();
        }

        res.json(student);
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

// === TASKS ===

// Get tasks for a student
router.get('/tasks/:studentId', async (req, res) => {
    try {
        const tasks = await Task.find({ student: req.params.studentId });
        res.json(tasks);
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

// Create Task
router.post('/tasks', async (req, res) => {
    try {
        const newTask = new Task(req.body);
        await newTask.save();
        res.json(newTask);
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

// Update Task (Status/Score)
router.put('/tasks/:id', async (req, res) => {
    try {
        const updatedTask = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(updatedTask);
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

module.exports = router;
