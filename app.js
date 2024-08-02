const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const app = express();

dotenv.config();
connectDB();


app.use(express.json());
app.use('/api/auth', authRoutes);

app.listen(4000, () => console.log('Server running on port 4000'));
