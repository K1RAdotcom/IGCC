
import { Request, Response, NextFunction } from "express";
import { prisma } from "../lib/prisma";

export async function requireAdmin(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    if (!req.session.userId) {
      return res.status(401).json({
        error: "Authentication required.",
      });
    }

    const user = await prisma.user.findUnique({
      where: {
        userId: req.session.userId,
      },
      select: {
        userId: true,
        role: true,
        status: true,
      },
    });

    if (!user || user.status !== "ACTIVE" || user.role !== "ADMIN") {
      return res.status(403).json({
        error: "Administrator access required.",
      });
    }

    next();
  } catch (error) {
    console.error("Administrator authorization error:", error);

    return res.status(500).json({
      error: "Could not verify administrator access.",
    });
  }
}
