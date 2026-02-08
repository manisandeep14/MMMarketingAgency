  // backend/src/controllers/adminInviteController.js
  import crypto from 'crypto';
  import AdminInvite from '../models/AdminInvite.js';
  import User from '../models/User.js';
  import { sendEmail } from "../config/brevo.js";
  import dotenv from 'dotenv';
  dotenv.config();

  const INVITE_TTL_HOURS = Number(process.env.ADMIN_INVITE_TTL_HOURS) || 72; // 72 hours default

  // -------------------------------------------------------------------
  // Create an invite token (protected route; admin only)
  // POST /api/admin/invites
  // -------------------------------------------------------------------
  export const createInvite = async (req, res) => {
    try {
      const { email } = req.body;
      if (!email) {
        return res
          .status(400)
          .json({ success: false, message: 'Email is required' });
      }

      // generate token
      const token = crypto.randomBytes(20).toString('hex');
      const expiresAt = new Date(Date.now() + INVITE_TTL_HOURS * 3600 * 1000);

      const invite = await AdminInvite.create({
        email,
        token,
        expiresAt,
        createdBy: req.user ? req.user.id : undefined,
      });

      // Optional: send invite email with link
      if (process.env.ENABLE_EMAILS?.toLowerCase() !== 'false') {
        const inviteLink = `${process.env.FRONTEND_URL}/admin-invite/${token}`;
        const html = `<p>You have been invited to become an admin. Click the link to accept and create your admin account:</p>
                      <p><a href="${inviteLink}">${inviteLink}</a></p>
                      <p>Expires: ${expiresAt.toUTCString()}</p>`;

        try {
          await sendEmail({
            to: email,
            subject: 'Admin invite - MM Furniture',
            html,
          });
        } catch (err) {
          console.warn('Failed to send invite email', err.message);
        }
      }

      return res.status(201).json({
        success: true,
        invite: {
          email: invite.email,
          token: invite.token,
          expiresAt,
        },
      });
    } catch (err) {
      console.error(err);
      return res
        .status(500)
        .json({ success: false, message: err.message });
    }
  };

  // -------------------------------------------------------------------
  // List all invites (admin only)
  // GET /api/admin/invites
  // -------------------------------------------------------------------
  export const listInvites = async (req, res) => {
    try {
      const invites = await AdminInvite.find({})
        .sort({ createdAt: -1 })
        .lean();

      return res.status(200).json({
        success: true,
        invites,
      });
    } catch (err) {
      console.error('Error listing invites:', err);
      return res
        .status(500)
        .json({ success: false, message: err.message });
    }
  };

  // -------------------------------------------------------------------
  // Resend an invite by ID (admin only)
  // POST /api/admin/invites/:id/resend
  // -------------------------------------------------------------------
  export const resendInvite = async (req, res) => {
    try {
      const { id } = req.params;

      const invite = await AdminInvite.findById(id);

      if (!invite) {
        return res
          .status(404)
          .json({ success: false, message: 'Invite not found' });
      }

      if (invite.used) {
        return res
          .status(400)
          .json({ success: false, message: 'Cannot resend a used invite' });
      }

      if (invite.expiresAt && invite.expiresAt < Date.now()) {
        return res
          .status(400)
          .json({ success: false, message: 'Cannot resend an expired invite' });
      }

      const inviteLink = `${process.env.FRONTEND_URL}/admin-invite/${invite.token}`;
      const html = `<p>You have been invited to become an admin. Click the link to accept and create your admin account:</p>
                    <p><a href="${inviteLink}">${inviteLink}</a></p>
                    <p>Expires: ${invite.expiresAt?.toUTCString() || 'No expiry set'}</p>`;

      if (process.env.ENABLE_EMAILS?.toLowerCase() !== 'false') {
        await sendEmail({
          to: invite.email,
          subject: 'Admin invite - MM Furniture (resent)',
          html,
        });
      }

      return res.status(200).json({
        success: true,
        message: 'Invite resent successfully',
      });
    } catch (err) {
      console.error('Error resending invite:', err);
      return res
        .status(500)
        .json({ success: false, message: err.message });
    }
  };

  // -------------------------------------------------------------------
  // Consume invite when registering or upgrading an existing account
  // POST /api/admin/invites/consume
  // -------------------------------------------------------------------
  export const consumeInviteAndCreateAdmin = async (req, res) => {
    try {
      const { token, name, email, password } = req.body;
      if (!token) {
        return res
          .status(400)
          .json({ success: false, message: 'Invite token required' });
      }

      const invite = await AdminInvite.findOne({ token });
      if (!invite) {
        return res
          .status(400)
          .json({ success: false, message: 'Invalid invite token' });
      }

      if (invite.used) {
        return res
          .status(400)
          .json({ success: false, message: 'Invite token already used' });
      }

      if (invite.expiresAt && invite.expiresAt < Date.now()) {
        return res
          .status(400)
          .json({ success: false, message: 'Invite token expired' });
      }

      // allow either creating a new user or turning an existing user into admin
      let user = await User.findOne({ email: email || invite.email });

      if (!user) {
        // create new user and set role admin
        user = await User.create({
          name,
          email: email || invite.email,
          password,
          role: 'admin',
          isVerified: true,
        });
      } else {
        // promote existing user
        user.role = 'admin';
        user.isVerified = true;
        await user.save();
      }

      // mark invite used
      invite.used = true;
      await invite.save();

      // create token (login) – generateToken(user) should include role in payload
      const { generateToken } = await import('../utils/jwt.js');
      const jwt = generateToken(user);

      return res.status(200).json({
        success: true,
        message: 'Admin account created/updated. You are now an admin.',
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
        token: jwt,
      });
    } catch (err) {
      console.error(err);
      return res
        .status(500)
        .json({ success: false, message: err.message });
    }
  };
