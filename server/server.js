const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Database Connection
const MONGO_URI = process.env.MONGO_URI;

mongoose.connect(MONGO_URI)
    .then(() => console.log('MongoDB Connected Successfully'))
    .catch(err => {
        console.error('MongoDB Connection Error:', err);
        process.exit(1); // Exit process with failure
    });

// Basic Route
app.get('/', (req, res) => {
    res.send('DTSI School API is running');
});

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/uploads', express.static('uploads')); // Serve uploaded images
app.use('/api/progress', require('./routes/progress'));
app.use('/api/videos', require('./routes/videos'));
app.use('/api/blog', require('./routes/blog'));
app.use('/api/shop', require('./routes/shop'));
app.use('/api/dashboard', require('./routes/dashboard'));
app.use('/api/workshops', require('./routes/workshops'));
app.use('/api/home-content', require('./routes/homeContent'));

// Start Server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
