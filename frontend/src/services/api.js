import axios from 'axios';

const BACKEND_URL = 'https://biasaudit.onrender.com/api';

const api = axios.create({
    baseURL: BACKEND_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

export const uploadCSV = async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    return api.post('/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
    });
};

export const runAnalysis = async (csvUrl, config) => {
    return api.post('/analyze', { csvUrl, config });
};

export const downloadReport = async (reportData) => {
    return api.post('/report', reportData, { responseType: 'blob' });
};

export default api;