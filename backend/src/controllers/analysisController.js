const mlService = require("../services/mlService")
exports.uploadFile = (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                message: "PLease upload a CSV file"
            });
        }


        res.status(200).json({
            message: 'File uploaded successfully',
            csvUrl: req.file.path,
            publicId: req.file.filename
        });
    } catch (error) {
        res.status(500).json({
            message: "internal server error",
            error: error.message
        });
    }
};

exports.runAnalysis = async (req, res) => {
    try {
        const { csvUrl, config } = req.body;

        if (!csvUrl) {
            return res.status(400).json({ message: "Dataset URL missing!" });
        }

        // Service call
        const result = await mlService.analyzeDataset(csvUrl, config);

        res.status(200).json({
            success: true,
            data: result
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};