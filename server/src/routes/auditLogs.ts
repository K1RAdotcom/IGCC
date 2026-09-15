import { Router } from "express";
import { requireAuth } from "../middleware/auth";
import { requireAdmin } from "../middleware/admin";
import { getAuditLogs } from "../services/auditLogService";

const router = Router();

router.get("/", requireAuth, requireAdmin, async (_req, res) => {
  try {
    const logs = await getAuditLogs();

    return res.json({
      logs,
    });
  } catch (error) {
    console.error("Get audit logs error:", error);

    return res.status(500).json({
      error: "Could not load audit logs.",
    });
  }
});

export default router;
