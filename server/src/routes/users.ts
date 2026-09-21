import { Router } from "express";
import {
  createUser,
  getUsers,
  UserValidationError,
} from "../services/userService";
import { setUserStatus } from "../services/userStatusService";
import { createAuditLog } from "../services/auditLogService";
import { requireAuth } from "../middleware/auth";
import { requireAdmin } from "../middleware/admin";
import { prisma } from "../lib/prisma";

const router = Router();

router.get("/", requireAuth, requireAdmin, async (_req, res) => {
  try {
    const users = await getUsers();

    return res.json({
      users,
    });
  } catch (error) {
    console.error("Get users error:", error);

    return res.status(500).json({
      error: "Could not load staff accounts.",
    });
  }
});

router.get("/me", requireAuth, async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: {
        userId: req.session.userId,
      },
      select: {
        userId: true,
        displayId: true,
        fullName: true,
        username: true,
        email: true,
        role: true,
        status: true,
      },
    });

    if (!user) {
      return res.status(404).json({
        error: "User account not found.",
      });
    }

    if (user.status !== "ACTIVE") {
      return res.status(403).json({
        error: "User account is inactive.",
      });
    }

    return res.json({
      user,
    });
  } catch (error) {
    console.error("Get current user error:", error);

    return res.status(500).json({
      error: "Could not load account information.",
    });
  }
});

router.post("/", requireAuth, requireAdmin, async (req, res) => {
  try {
    const {
      fullName,
      username,
      email,
      password,
      role,
    } = req.body;

    if (!fullName || !username || !password || !role) {
      return res.status(400).json({
        error: "Missing required user information.",
      });
    }

    if (role !== "ADMIN" && role !== "CLINIC_STAFF") {
      return res.status(400).json({
        error: "Invalid user role.",
      });
    }

    const user = await createUser({
      fullName,
      username,
      email,
      password,
      role,
    });

    await createAuditLog({
      userId: req.session.userId!,
      action: "USER_CREATED",
      entityType: "USER",
      entityId: user.userId,
      description: `Created staff account ${user.displayId} for ${user.fullName}.`,
    });

    return res.status(201).json({
      userId: user.userId,
      displayId: user.displayId,
      fullName: user.fullName,
      username: user.username,
      email: user.email,
      role: user.role,
      status: user.status,
      createdAt: user.createdAt,
    });
  } catch (error) {
    console.error("Create user error:", error);

    if (error instanceof UserValidationError) {
      return res.status(400).json({
        error: error.message,
      });
    }

    if (
      error instanceof Error &&
      error.message === "An Administrator account already exists."
    ) {
      return res.status(409).json({
        error: error.message,
      });
    }

    if (
      error instanceof Error &&
      error.message === "Username already exists."
    ) {
      return res.status(409).json({
        error: error.message,
      });
    }

    if (
      error instanceof Error &&
      error.message.includes("Unique constraint")
    ) {
      return res.status(409).json({
        error: "Username or email already exists.",
      });
    }

    return res.status(500).json({
      error: "Could not create staff account.",
    });
  }
});

router.patch("/:userId/status", requireAuth, requireAdmin, async (req, res) => {
  try {
    const userId = req.params.userId as string;
    const { status } = req.body;

    if (status !== "ACTIVE" && status !== "INACTIVE") {
      return res.status(400).json({
        error: "Invalid user status.",
      });
    }

    if (userId === req.session.userId && status === "INACTIVE") {
      return res.status(400).json({
        error: "You cannot deactivate your own account.",
      });
    }

    const user = await setUserStatus(userId, status);

    await createAuditLog({
      userId: req.session.userId!,
      action:
        status === "ACTIVE"
          ? "USER_ACTIVATED"
          : "USER_DEACTIVATED",
      entityType: "USER",
      entityId: user.userId,
      description:
        status === "ACTIVE"
          ? `Activated staff account ${user.displayId} for ${user.fullName}.`
          : `Deactivated staff account ${user.displayId} for ${user.fullName}.`,
    });

    return res.json({
      message: `User account ${
        status === "ACTIVE" ? "activated" : "deactivated"
      } successfully.`,
      user,
    });
  } catch (error) {
    console.error("Update user status error:", error);

    return res.status(500).json({
      error: "Could not update user status.",
    });
  }
});

export default router;