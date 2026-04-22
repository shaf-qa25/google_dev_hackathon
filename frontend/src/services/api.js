import axios from 'axios';

// Replace these with your actual Vercel deployment links
const VERCEL_BACKEND_URL = 'https://your-backend-repo.vercel.app/api';
const LOCAL_BACKEND_URL = 'http://localhost:5000/api';

const api = axios.create({
    // Automatic switch: Agar Vercel pe ho toh prod URL, varna local
    baseURL: import.meta.env.PROD ? VERCEL_BACKEND_URL : LOCAL_BACKEND_URL,
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