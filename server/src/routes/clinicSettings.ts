import { Router } from "express";
import { requireAuth } from "../middleware/auth";
import { requireAdmin } from "../middleware/admin";
import {
  getClinicSettings,
  updateClinicSettings,
} from "../services/clinicSettingsService";
import { createAuditLog } from "../services/auditLogService";

const router = Router();

router.get("/", requireAuth, requireAdmin, async (_req, res) => {
  try {
    const settings = await getClinicSettings();

    return res.json({
      settings,
    });
  } catch (error) {
    console.error("Get clinic settings error:", error);

    return res.status(500).json({
      error: "Could not load clinic settings.",
    });
  }
});

router.patch("/", requireAuth, requireAdmin, async (req, res) => {
  try {
    const settings = await updateClinicSettings(req.body);

    await createAuditLog({
      userId: req.session.userId!,
      action: "SETTINGS_UPDATED",
      entityType: "CLINIC_SETTINGS",
      entityId: settings.settingId,
      description: "Clinic settings were updated.",
    });

    return res.json({
      message: "Clinic settings updated successfully.",
      settings,
    });
  } catch (error) {
    console.error("Update clinic settings error:", error);

    if (error instanceof Error) {
      return res.status(400).json({
        error: error.message,
      });
    }

    return res.status(500).json({
      error: "Could not update clinic settings.",
    });
  }
});

export default router;