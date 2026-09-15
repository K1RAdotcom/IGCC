import { Request, Response, NextFunction } from "express";
import { prisma } from "../lib/prisma";

export async function requireAuth(
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
        status: true,
      },
    });

    if (!user || user.status !== "ACTIVE") {
      req.session.destroy(() => {});

      return res.status(401).json({
        error: "Your account is inactive or no longer available.",
      });
    }

    next();
  } catch (error) {
    console.error("Authentication check error:", error);

    return res.status(500).json({
      error: "Could not verify authentication.",
    });
  }
}
