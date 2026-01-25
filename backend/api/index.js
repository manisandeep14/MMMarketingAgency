//vercel files

import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import authRoutes from "./auth/index.js";

dotenv.config();

const app = express();

app.use(cors({
  origin: [
    "http://localhost:5173",
    process.env.FRONTEND_URL,
  ],
  credentials: true,
}));

app.use(express.json());

app.use("/auth", authRoutes);

app.get("/", (req, res) => {
  res.json({ success: true, message: "Backend running on Vercel 🚀" });
});

export default app;
