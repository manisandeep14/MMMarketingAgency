// backend/src/routes/adminInviteRoutes.js
import express from 'express';
import {
  createInvite,
  consumeInviteAndCreateAdmin,
  listInvites,
  resendInvite,
} from '../controllers/adminInviteController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

// Create new invite (admin only)
router.post('/', protect, authorize('admin'), createInvite);

// List all invites (admin only)
router.get('/', protect, authorize('admin'), listInvites);

// Resend an invite by ID (admin only)
router.post('/:id/resend', protect, authorize('admin'), resendInvite);

// Public endpoint to consume invite and create/promote admin
router.post('/consume', consumeInviteAndCreateAdmin);

export default router;
