import express from "express";
import { getScores, createScore } from "../controllers/scoreController.js";
import authMiddleware from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/", getScores);
router.post("/", authMiddleware, createScore);

export default router;