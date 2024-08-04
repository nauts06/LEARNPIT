const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const app = express();
const path = require('path');

dotenv.config();
connectDB();

// Init Middleware
app.use(express.json({ extended: false }));

// Serve static files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Define Routes
app.use(express.json());
app.use('/api/auth', authRoutes);
app.use('/api/tutors', require('./routes/tutorRoutes'));
app.use('/api/students', require('./routes/studentRoutes'));

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));