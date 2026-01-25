//vercerl files

import express from "express";
import { register, login, googleAuth } from "../src/routes/authRoutes.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/google", googleAuth);

export default router;
