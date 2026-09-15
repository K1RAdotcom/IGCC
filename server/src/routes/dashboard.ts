import { Router } from "express";
import { requireAuth } from "../middleware/auth";
import { getDashboardStats } from "../services/dashboardService";

const router = Router();

router.get("/stats", requireAuth, async (_req, res) => {
  try {
    const stats = await getDashboardStats();

    return res.json(stats);
  } catch (error) {
    console.error("Dashboard stats error:", error);

    return res.status(500).json({
      error: "Could not load dashboard statistics.",
    });
  }
});

export default router;
