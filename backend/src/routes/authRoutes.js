import express from 'express';
import {
  register,
  verifyEmail,
  login,
  forgotPassword,
  resetPassword,
  getProfile,
  updateProfile,
  addAddress,
  updateAddress,
  deleteAddress,
} from '../controllers/authController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.post('/register', register);
router.get('/verify-email/:token', verifyEmail);
router.post('/login', login);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password/:token', resetPassword);

router.get('/profile', protect, getProfile);
router.put('/profile', protect, updateProfile);

// Address routes (protected)
router.post('/address', protect, addAddress);
router.put('/address/:addressId', protect, updateAddress);
router.delete('/address/:addressId', protect, deleteAddress);


export default router;
