import express from "express";
import { checkEmail } from "../controllers/mailController.js";

const router = express.Router();

// POST /api/mail/check
router.post("/check", checkEmail);

export default router;
