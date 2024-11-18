const express = require('express');
const { connectDB } = require('./config/db'); // Destructure connectDB from the export
require('dotenv').config();

const app = express();

// Middleware
app.use(express.json());

// Connect to the database
connectDB();

// Routes
const apiRoutes = require('./routes/apiRoutes');
app.use('/api', apiRoutes);

module.exports = app;
