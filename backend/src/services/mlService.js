const axios = require('axios');

// Jab Shivani API de degi, isko false kar dena
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

    // JAB API MIL JAYEGI, TAB YE CHALEGA:
    try {
        const response = await axios.post(process.env.ML_API_URL, {
            url: csvUrl,
            configuration: config
        });
        return response.data;
    } catch (error) {
        throw new Error("ML API is not responding");
    }
};