import { Router } from "express";
import { requireAuth } from "../middleware/auth";
import { changeMyPassword } from "../services/passwordService";
import { createAuditLog } from "../services/auditLogService";

const router = Router();

router.post("/me/change-password", requireAuth, async (req, res) => {
  try {
    const {
      currentPassword,
      newPassword,
    } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        error: "Current password and new password are required.",
      });
    }

    const userId = req.session.userId!;

    await changeMyPassword(userId, {
      currentPassword,
      newPassword,
    });

    await createAuditLog({
      userId,
      action: "PASSWORD_CHANGED",
      entityType: "USER",
      entityId: userId,
      description: "User changed their password.",
    });

    req.session.destroy((sessionError) => {
      if (sessionError) {
        console.error("Session destruction error after password change:", sessionError);

        return res.status(500).json({
          error: "Password changed, but the session could not be ended safely.",
        });
      }

      return res.json({
        message: "Password changed successfully. Please log in again.",
      });
    });
  } catch (error) {
    console.error("Change password error:", error);

    if (error instanceof Error) {
      return res.status(400).json({
        error: error.message,
      });
    }

    return res.status(500).json({
      error: "Could not change password.",
    });
  }
});

export default router;
