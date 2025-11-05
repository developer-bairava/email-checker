// src/controllers/mailController.js
import { verifyEmail } from "../services/mailService.js";

export const checkEmail = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required",
      });
    }

    // 🧠 Run all checks (format, MX, SMTP, search engine)
    const result = await verifyEmail(email);

    return res.json({
      success: true,
      message: "Email verification completed ✅",
      result,
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({
      success: false,
      message: "Server error during verification",
      error: error.message,
    });
  }
};
