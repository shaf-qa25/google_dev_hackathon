const axios = require('axios');

const MOCK_MODE = true;

exports.analyzeDataset = async (csvUrl, config) => {
    if (MOCK_MODE) {

        return {
            biasScore: 34,
            verdict: "BIASED",
            metrics: {
                demographicParity: 0.43,
                equalizedOdds: 0.71,
                disparateImpact: 0.56
            },
            groupStats: [
                { group: "Male", approvalRate: 73 },
                { group: "Female", approvalRate: 41 }
            ],
            topFeatures: [
                { feature: "gender", importance: 0.82 },
                { feature: "zip_code", importance: 0.61 }
            ]
        };
    }

    // mlService.js
    try {
        console.log("DEBUG: Calling Shivani's API at:", process.env.ML_API_URL);

        const response = await axios.post(process.env.ML_API_URL, {
            dataset_url: csvUrl,
            target_column: config.target,
            sensitive_feature: config.sensitive
        });

        console.log("--- DEBUG: Response from Shivani's API ---");
        console.log(JSON.stringify(response.data, null, 2));

        return response.data;

    } catch (error) {
        console.error("--- DEBUG: ML API ERROR ---");
        if (error.response) {
            console.error("Status:", error.response.status);
            console.error("Data:", error.response.data);
        } else {
            console.error("Message:", error.message);
        }
        throw new Error("ML API is not responding correctly");
    }
};