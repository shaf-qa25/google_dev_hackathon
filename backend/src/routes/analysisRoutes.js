const express = require('express')
const router = express.Router();
const upload = require("../middlewares/upload");
const analysisController = require('../controllers/analysisController');

router.post('/upload', upload.single('file'), analysisController.uploadFile);

router.post('/analyze', analysisController.runAnalysis);

module.exports = router;


