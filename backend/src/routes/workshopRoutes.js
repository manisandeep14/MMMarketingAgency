import express from "express";
import { createWorkshopRequest } from "../controllers/workshopController.js";

const router = express.Router();

router.post("/workshop-request", createWorkshopRequest);

export default router;