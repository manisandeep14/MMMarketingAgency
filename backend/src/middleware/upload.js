// middleware/multer.js
import multer from 'multer';

// Store files in memory so we can pipe them to Cloudinary
const storage = multer.memoryStorage();

// Accept only images
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed'), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024, // ⬅️ increased to 10MB
    files: 10, // allow up to 10 images at once (optional, recommended)
  },
});

export default upload;
