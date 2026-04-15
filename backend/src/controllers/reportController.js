const { generatePDF } = require('../utils/reportGenerator');

exports.downloadReport = (req, res) => {
    try {
        const reportData = req.body;

        if (!reportData.verdict) {
            return res.status(400).json({ message: "No analysis data provided" });
        }

        // Set headers for PDF download
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', 'attachment; filename=Bias_Report.pdf');

        // Generate and stream the PDF directly to the user
        generatePDF(reportData, res);

    } catch (error) {
        res.status(500).json({ message: "PDF Generation failed", error: error.message });
    }
};