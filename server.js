// server.js
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const cors = require('cors');
require('dotenv').config();

const connectDB = require('./config/db');
const recipesRouter = require('./routes/recipes');

const app = express();
const PORT = process.env.PORT || 5000;

// Connect database
connectDB();

// Middlewares
app.use(cors());
app.use(express.json()); // parse JSON bodies

// API routes
app.use('/api/recipes', recipesRouter);

// Serve frontend (public folder)
app.use(express.static(path.join(__dirname, 'public')));

// Fallback to index.html for SPA-like behaviour
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Error handling middleware (simple)
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ success: false, message: 'Server Error' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

const MONGO_URI = process.env.MONGO_URI;
mongoose.connect(MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.error("MongoDB connection error:", err));
