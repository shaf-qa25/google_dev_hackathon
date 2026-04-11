exports.uploadFile = (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                message: "PLease upload a CSV file"
            });
        }


        res.status(200).json({
            message: 'File uploaded successfully',
            filename: req.file.filename,
            originalName: req.file.originalname
        });
    } catch (error) {
        res.status(500).json({
            message: "internal server error",
            error: error.message
        });
    }
};

exports.runAnalysis = async (req, res) => {
    res.status(200).json({
        message: "Analysis route hit!!"
    })
}