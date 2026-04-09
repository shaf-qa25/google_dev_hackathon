const express = require('express');
const cors = require('cors');
const app = express();

// app.use(cors()); // Frontend se connect karne ke liye zaroori hai
app.use(express.json());

// Pehla test route
app.get('/', (req, res) => {
    res.send("Backend is running! 🚀");
});

// Baaki routes (Upload, Analyze, Report) yahan define honge
// app.post('/api/upload', ...)

module.exports = app;