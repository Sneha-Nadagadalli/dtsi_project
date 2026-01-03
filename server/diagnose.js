const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const Student = require('./models/Student');
require('dotenv').config();

async function debug() {
    try {
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/dtsi');
        console.log('Connected to DB');

        const mentor = await User.findOne({ role: 'mentor' });
        if (!mentor) {
            console.log('No mentor found to test with');
            process.exit(0);
        }

        const name = "Debug Test Student " + Date.now();
        const mentorId = mentor._id;

        console.log(`Attempting to create student for mentor: ${mentorId}`);

        const newStudent = new Student({
            name,
            mentor: mentorId
        });

        const cleanName = name.replace(/\s+/g, '').toLowerCase();
        const randomSuffix = Math.floor(100 + Math.random() * 900);
        const username = `${cleanName}_${randomSuffix}`;
        const password = '112233';

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const parentUser = new User({
            name: `Parent of ${name}`,
            username: username,
            password: hashedPassword,
            role: 'parent',
            linkedStudentId: newStudent._id
        });

        console.log('Saving parent user...');
        await parentUser.save();
        console.log('Parent user saved');

        newStudent.parent = parentUser._id;
        newStudent.accessUsername = username;

        console.log('Saving student...');
        await newStudent.save();
        console.log('Student saved successfully');

        process.exit(0);
    } catch (err) {
        console.error('DIAGNOSTIC ERROR:', err);
        process.exit(1);
    }
}

debug();
