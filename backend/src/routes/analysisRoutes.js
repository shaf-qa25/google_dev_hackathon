const express = require('express')
const router = express.Router();
const upload = require("../middlewares/upload");
const analysisController = require('../controllers/analysisController');
const reportController = require('../controllers/reportController');

router.post('/upload', upload.single('file'), analysisController.uploadFile);

router.post('/analyze', analysisController.runAnalysis);


router.post('/report', reportController.downloadReport);

module.exports = router;


