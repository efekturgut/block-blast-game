import express from "express";
import { getScores, createScore } from "../controllers/scoreController.js";

const router = express.Router();

router.get("/", getScores);
router.post("/", createScore);

export default router;