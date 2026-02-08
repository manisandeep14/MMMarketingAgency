import User from "../models/User.js";
import { generateToken, generateVerificationToken } from "../utils/jwt.js";
import { sendEmail } from "../config/brevo.js";
import {
  getVerificationEmailTemplate,
  getPasswordResetEmailTemplate,
} from "../utils/emailTemplates.js";
import crypto from "crypto";
import { OAuth2Client } from "google-auth-library";

/* =========================
   GOOGLE CLIENT (GLOBAL)
========================= */
const googleClient = new OAuth2Client(process.env.VITE_GOOGLE_CLIENT_ID);

/* =========================
   EMAIL REGISTER
========================= */
export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Name, email and password are required",
      });
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({
        success: false,
        message: "User already exists",
      });
    }

    const verificationToken = generateVerificationToken();

    const user = await User.create({
      name,
      email,
      password,
      verificationToken,
      provider: "local",
    });

    const verificationUrl = `https://mmmarketingagency.onrender.com/api/auth/verify-email/${verificationToken}`;
    const emailHtml = getVerificationEmailTemplate(name, verificationUrl);

    // ✅ CONTROLLED EMAIL SEND
    try {
      await sendEmail({
        to: email,
        subject: "Verify your email",
        html: emailHtml,
      });
    } catch (err) {
      console.error("Email failed:", err.message);
      return res.status(500).json({
        success: false,
        message: "Registration failed. Email could not be sent.",
      });
    }

    res.status(201).json({
      success: true,
      message: "Registration successful. Please verify your email.",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/* =========================
   VERIFY EMAIL
========================= */
export const verifyEmail = async (req, res) => {
  const { token } = req.params;

  const user = await User.findOne({ verificationToken: token });
  if (!user) {
    return res.redirect(
      `${process.env.FRONTEND_URL}/login?verified=false`
    );
  }

  user.isVerified = true;
  user.verificationToken = undefined;
  await user.save();

  return res.redirect(
    `${process.env.FRONTEND_URL}/login?verified=true`
  );
};

/* =========================
   LOGIN (EMAIL)
========================= */
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    if (user.provider !== "local") {
      return res.status(400).json({
        success: false,
        message: "Please login using Google",
      });
    }

    if (!user.isVerified) {
      return res.status(401).json({
        success: false,
        message: "Please verify your email",
      });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    const token = generateToken(user);

    res.status(200).json({
      success: true,
      token,
      user,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/* =========================
   GOOGLE AUTH (REGISTER + LOGIN)
========================= */
export const googleAuth = async (req, res) => {
  try {
    const { tokenId } = req.body;

    if (!tokenId) {
      return res.status(400).json({
        success: false,
        message: "Google token missing",
      });
    }

    const ticket = await googleClient.verifyIdToken({
      idToken: tokenId,
      audience: process.env.VITE_GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const { sub, email, name } = payload;

    let user = await User.findOne({ email });

    if (!user) {
      user = await User.create({
        name,
        email,
        googleId: sub,
        provider: "google",
        isVerified: true,
      });
    }

    const token = generateToken(user);

    res.status(200).json({
      success: true,
      token,
      user,
    });
  } catch (error) {
    console.error("Google Auth Error:", error);
    res.status(500).json({
      success: false,
      message: "Google authentication failed",
    });
  }
};

/* =========================
   FORGOT PASSWORD
========================= */
export const forgotPassword = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });

    if (!user || user.provider !== "local") {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const resetToken = crypto.randomBytes(32).toString("hex");

    user.resetPasswordToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");

    user.resetPasswordExpire = Date.now() + 3600000;
    await user.save();

    const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;
    const emailHtml = getPasswordResetEmailTemplate(user.name, resetUrl);

    sendEmail({
      to: user.email, // ✅ FIXED
      subject: "Reset your password",
      html: emailHtml,
    }).catch(err => {
      console.error("Email failed:", err.message);
    });

    res.status(200).json({
      success: true,
      message: "Reset email sent",
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/* =========================
   RESET PASSWORD
========================= */
export const resetPassword = async (req, res) => {
  try {
    const hashedToken = crypto
      .createHash("sha256")
      .update(req.params.token)
      .digest("hex");

    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpire: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid token",
      });
    }

    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();

    res.status(200).json({
      success: true,
      message: "Password reset successful",
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/* =========================
   PROFILE
========================= */
export const getProfile = async (req, res) => {
  const user = await User.findById(req.user.id);
  res.status(200).json({ success: true, user });
};

export const updateProfile = async (req, res) => {
  const user = await User.findById(req.user.id);

  if (req.body.name) user.name = req.body.name;
  if (req.body.email && user.provider === "local") {
    user.email = req.body.email;
  }

  await user.save();
  res.status(200).json({ success: true, user });
};

/* =========================
   ADDRESS
========================= */
export const addAddress = async (req, res) => {
  const user = await User.findById(req.user.id);
  user.addresses.push(req.body);
  await user.save();
  res.status(200).json({ success: true, user });
};

export const updateAddress = async (req, res) => {
  const user = await User.findById(req.user.id);
  const address = user.addresses.id(req.params.addressId);
  Object.assign(address, req.body);
  await user.save();
  res.status(200).json({ success: true, user });
};

export const deleteAddress = async (req, res) => {
  const user = await User.findById(req.user.id);
  user.addresses.pull(req.params.addressId);
  await user.save();
  res.status(200).json({ success: true, user });
};
