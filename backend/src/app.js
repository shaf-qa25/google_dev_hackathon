const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const dotenv = require('dotenv');
const analysisRoutes = require("./routes/analysisRoutes");

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan('dev'))

// Pehla test route
app.get('/', (req, res) => {
    res.send("Backend is running!");
});

app.use('/api', analysisRoutes);
// app.post('/api/upload', ...)

module.exports = app;