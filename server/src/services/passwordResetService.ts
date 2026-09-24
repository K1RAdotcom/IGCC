import bcrypt from "bcrypt";
import { createHash, randomBytes } from "node:crypto";
import { prisma } from "../lib/prisma";
import { sendPasswordResetEmail } from "./emailService";

const RESET_TOKEN_TTL_MS = 60 * 60 * 1000;

function hashResetToken(token: string) {
  return createHash("sha256").update(token).digest("hex");
}

function getAppUrl() {
  const appUrl = process.env.APP_URL?.trim();

  if (!appUrl) {
    throw new Error("APP_URL is not configured.");
  }

  return appUrl.replace(/\/+$/, "");
}

export async function requestPasswordReset(email: string) {
  const normalizedEmail = email.trim().toLowerCase();

  if (!normalizedEmail) {
    return;
  }

  const user = await prisma.user.findFirst({
    where: {
      email: {
        equals: normalizedEmail,
        mode: "insensitive",
      },
      status: "ACTIVE",
    },
  });

  if (!user?.email) {
    return;
  }

  await prisma.passwordResetToken.deleteMany({
    where: {
      userId: user.userId,
    },
  });

  const rawToken = randomBytes(32).toString("hex");
  const tokenHash = hashResetToken(rawToken);
  const expiresAt = new Date(Date.now() + RESET_TOKEN_TTL_MS);

  await prisma.passwordResetToken.create({
    data: {
      userId: user.userId,
      tokenHash,
      expiresAt,
    },
  });

  const resetUrl = `${getAppUrl()}/reset-password?token=${encodeURIComponent(
    rawToken
  )}`;

  await sendPasswordResetEmail(user.email, resetUrl);
}

export async function resetPassword(
  rawToken: string,
  newPassword: string
) {
  if (!rawToken.trim()) {
    throw new Error("Invalid or expired reset link.");
  }

  if (newPassword.length < 8) {
    throw new Error("New password must be at least 8 characters.");
  }

  const tokenHash = hashResetToken(rawToken.trim());

  const resetToken = await prisma.passwordResetToken.findUnique({
    where: {
      tokenHash,
    },
    include: {
      user: true,
    },
  });

  if (
    !resetToken ||
    resetToken.usedAt ||
    resetToken.expiresAt.getTime() <= Date.now() ||
    resetToken.user.status !== "ACTIVE"
  ) {
    throw new Error("Invalid or expired reset link.");
  }

  const newPasswordHash = await bcrypt.hash(newPassword, 12);

  await prisma.$transaction([
    prisma.user.update({
      where: {
        userId: resetToken.userId,
      },
      data: {
        passwordHash: newPasswordHash,
      },
    }),
    prisma.passwordResetToken.update({
      where: {
        id: resetToken.id,
      },
      data: {
        usedAt: new Date(),
      },
    }),
  ]);

  return resetToken.userId;
}