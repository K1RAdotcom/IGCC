import { Router } from "express";
import rateLimit from "express-rate-limit";
import { createAuditLog } from "../services/auditLogService";
import {
  requestPasswordReset,
  resetPassword,
} from "../services/passwordResetService";

const router = Router();

const forgotPasswordLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 5,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  message: {
    error: "Too many password reset requests. Please try again later.",
  },
});

const resetPasswordLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  message: {
    error: "Too many password reset attempts. Please try again later.",
  },
});

router.post(
  "/forgot-password",
  forgotPasswordLimiter,
  async (req, res) => {
    const email =
      typeof req.body?.email === "string" ? req.body.email.trim() : "";

    if (!email) {
      return res.status(400).json({
        error: "Email is required.",
      });
    }

    try {
      await requestPasswordReset(email);
    } catch (error) {
      console.error("Password reset email error:", error);
    }

    return res.json({
      message:
        "If an account exists for that email, a password reset link has been sent.",
    });
  }
);

router.post(
  "/reset-password",
  resetPasswordLimiter,
  async (req, res) => {
    const token =
      typeof req.body?.token === "string" ? req.body.token.trim() : "";
    const newPassword =
      typeof req.body?.newPassword === "string" ? req.body.newPassword : "";

    if (!token || !newPassword) {
      return res.status(400).json({
        error: "Reset token and new password are required.",
      });
    }

    try {
      const userId = await resetPassword(token, newPassword);

      try {
        await createAuditLog({
          userId,
          action: "PASSWORD_RESET",
          entityType: "USER",
          entityId: userId,
          description: "User reset their password using a password reset link.",
        });
      } catch (auditError) {
        console.error("Password reset audit log error:", auditError);
      }

      return res.json({
        message: "Password reset successfully. Please log in.",
      });
    } catch (error) {
      console.error("Password reset error:", error);

      if (error instanceof Error) {
        return res.status(400).json({
          error: error.message,
        });
      }

      return res.status(500).json({
        error: "Could not reset password.",
      });
    }
  }
);

export default router;