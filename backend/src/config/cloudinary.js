const dotenv = require('dotenv');
const cloudinary = require("cloudinary").v2
const { CloudinaryStorage } = require("multer-storage-cloudinary");
dotenv.config();

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
})


const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: "gdProject_uploads",
        resource_type: "raw",
        format: 'csv',
        public_id: (req, file) => `dataset-${Date.now()}`
    }
})


module.exports = { cloudinary, storage };
