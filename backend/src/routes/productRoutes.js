// routes/products.js
import express from 'express';
import {
  getAllProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
} from '../controllers/productController.js';
import { protect, authorize } from '../middleware/auth.js';

// NOTE: make sure this path matches your multer middleware file.
// If your file is named "multer.js", either rename it to upload.js
// or change the import below to: import upload from '../middleware/multer.js';
import upload from '../middleware/upload.js';

const router = express.Router();

// public
router.get('/', getAllProducts);
router.get('/:id', getProduct);

// admin - create / update / delete (multipart images)
// Allow up to 10 images per product
router.post('/', protect, authorize('admin'), upload.array('images', 10), createProduct);
router.put('/:id', protect, authorize('admin'), upload.array('images', 10), updateProduct);
router.delete('/:id', protect, authorize('admin'), deleteProduct);

export default router;
