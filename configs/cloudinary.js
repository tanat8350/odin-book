const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');
const { post } = require('./prisma');
require('dotenv').config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'odin-book',
    formats: ['jpg', 'jpeg', 'png'],
    public_id: (req, file) => file.originalname,
  },
});

const postImageStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'odin-book-post',
    formats: ['jpg', 'jpeg', 'png'],
    public_id: (req, file) => file.originalname,
  },
});

const upload = multer({ storage: storage });
const uploadImagePost = multer({ storage: postImageStorage });

module.exports = {
  cloudinary,
  upload,
  uploadImagePost,
};
