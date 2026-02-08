import express from "express";
import {
  register,
  login,
  forgotPassword,
  resetPassword,
  getProfile,
  updateProfile,
  addAddress,
  updateAddress,
  deleteAddress,

  // 🔥 GOOGLE AUTH
  googleAuth,
} from "../controllers/authController.js";

import { protect } from "../middleware/auth.js";

const router = express.Router();

/* =========================
   AUTH
========================= */
router.post("/register", register);
router.post("/login", login);

// 🔥 GOOGLE REGISTER + LOGIN
router.post("/google", googleAuth);

/* =========================
   PASSWORD
========================= */
router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:token", resetPassword);

/* =========================
   PROFILE
========================= */
router.get("/profile", protect, getProfile);
router.put("/profile", protect, updateProfile);

/* =========================
   ADDRESS
========================= */
router.post("/address", protect, addAddress);
router.put("/address/:addressId", protect, updateAddress);
router.delete("/address/:addressId", protect, deleteAddress);

export default router;
