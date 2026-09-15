
import { Router } from "express";
import rateLimit from "express-rate-limit";
import { authenticateUser } from "../services/authService";
import { createAuditLog } from "../services/auditLogService";
import {
  canRegisterAsAdmin,
  registerUser,
} from "../services/registrationService";

const router = Router();

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  message: {
    error: "Too many login attempts. Please try again later.",
  },
});

const registrationLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  limit: 5,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  message: {
    error: "Too many registration attempts. Please try again later.",
  },
});

router.get("/registration-status", async (_req, res) => {
  try {
    const adminAvailable = await canRegisterAsAdmin();

    return res.json({
      adminAvailable,
    });
  } catch (error) {
    console.error("Registration status error:", error);

    return res.status(500).json({
      error: "Could not check registration status.",
    });
  }
});

router.post("/register", registrationLimiter, async (req, res) => {
  try {
    const {
      fullName,
      username,
      email,
      password,
      confirmPassword,
      role,
    } = req.body;

    if (!fullName || !username || !password || !confirmPassword || !role) {
      return res.status(400).json({
        error: "Please complete all required fields.",
      });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({
        error: "Passwords do not match.",
      });
    }

    if (role === "ADMIN") {
      const adminAvailable = await canRegisterAsAdmin();

      if (!adminAvailable) {
        return res.status(403).json({
          error: "An Administrator account already exists.",
        });
      }
    }

    const user = await registerUser({
      fullName,
      username,
      email,
      password,
      role,
    });

    try {
      await createAuditLog({
        userId: user.userId,
        action: "USER_CREATED",
        entityType: "USER",
        entityId: user.userId,
        description:
          "User " +
          user.displayId +
          " (" +
          user.fullName +
          ") created a " +
          user.role +
          " account through self-registration.",
      });
    } catch (auditError) {
      console.error("Registration audit error:", auditError);
    }

    return res.status(201).json({
      message: "Account created successfully.",
      user,
    });
  } catch (error) {
    console.error("Registration error:", error);

    const message =
      error instanceof Error
        ? error.message
        : "Could not create account.";

    return res.status(400).json({
      error: message,
    });
  }
});

router.post("/login", loginLimiter, async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({
        error: "Username and password are required.",
      });
    }

    const user = await authenticateUser(username, password);

    if (!user) {
      return res.status(401).json({
        error: "Invalid username or password.",
      });
    }

    req.session.userId = user.userId;

    await createAuditLog({
      userId: user.userId,
      action: "LOGIN",
      entityType: "USER",
      entityId: user.userId,
      description:
        "User " +
        user.displayId +
        " (" +
        user.fullName +
        ") logged in.",
    });

    return res.json({
      message: "Login successful.",
      user,
    });
  } catch (error) {
    console.error("Login error:", error);

    return res.status(500).json({
      error: "Could not log in.",
    });
  }
});

router.post("/logout", async (req, res) => {
  const userId = req.session.userId;

  if (userId) {
    try {
      await createAuditLog({
        userId,
        action: "LOGOUT",
        entityType: "USER",
        entityId: userId,
        description: "User logged out.",
      });
    } catch (error) {
      console.error("Logout audit error:", error);
    }
  }

  req.session.destroy((error) => {
    if (error) {
      return res.status(500).json({
        error: "Could not log out.",
      });
    }

    return res.json({
      message: "Logout successful.",
    });
  });
});

export default router;
