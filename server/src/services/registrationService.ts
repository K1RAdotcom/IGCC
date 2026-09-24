import bcrypt from "bcrypt";
import { prisma } from "../lib/prisma";

type RegisterUserData = {
  fullName: string;
  username: string;
  email?: string;
  password: string;
  role: "ADMIN" | "CLINIC_STAFF";
};

function normalizeUsername(value: string) {
  return value.trim().toLowerCase();
}

function normalizeEmail(value?: string) {
  const trimmed = value?.trim().toLowerCase();
  return trimmed || null;
}

function validateFullName(fullName: string) {
  if (fullName.length < 2) {
    throw new Error("Full name must be at least 2 characters.");
  }

  if (fullName.length > 100) {
    throw new Error("Full name must not exceed 100 characters.");
  }
}

function validateUsername(username: string) {
  if (username.length < 3) {
    throw new Error("Username must be at least 3 characters.");
  }

  if (username.length > 30) {
    throw new Error("Username must not exceed 30 characters.");
  }

  if (!/^[a-z0-9._-]+$/.test(username)) {
    throw new Error(
      "Username can only contain letters, numbers, dots, underscores, and hyphens."
    );
  }
}

function validateEmail(email: string | null) {
  if (!email) {
    throw new Error("Email address is required.");
  }

  if (email.length > 254) {
    throw new Error("Email address is too long.");
  }

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!emailPattern.test(email)) {
    throw new Error("Please enter a valid email address.");
  }
}

export async function canRegisterAsAdmin() {
  const adminCount = await prisma.user.count({
    where: {
      role: "ADMIN",
    },
  });

  return adminCount === 0;
}

export async function registerUser(data: RegisterUserData) {
  const fullName = data.fullName?.trim();
  const username = normalizeUsername(data.username);
  const email = normalizeEmail(data.email);

  if (!fullName) {
    throw new Error("Full name is required.");
  }

  if (!username) {
    throw new Error("Username is required.");
  }

  if (!data.password) {
    throw new Error("Password is required.");
  }

  if (data.password.length < 8) {
    throw new Error("Password must be at least 8 characters.");
  }

  if (data.password.length > 128) {
    throw new Error("Password must not exceed 128 characters.");
  }

  if (data.password !== data.password.trim()) {
    throw new Error("Password cannot start or end with spaces.");
  }

  if (data.role !== "ADMIN" && data.role !== "CLINIC_STAFF") {
    throw new Error("Invalid account type.");
  }

  validateFullName(fullName);
  validateUsername(username);
  validateEmail(email);

  return prisma.$transaction(async (tx) => {
    if (data.role === "ADMIN") {
      const adminExists = await tx.user.findFirst({
        where: {
          role: "ADMIN",
        },
        select: {
          userId: true,
        },
      });

      if (adminExists) {
        throw new Error("An Administrator account already exists.");
      }
    }

    const existingUsername = await tx.user.findUnique({
      where: {
        username,
      },
      select: {
        userId: true,
      },
    });

    if (existingUsername) {
      throw new Error("That username is already in use.");
    }

    const existingEmail = await tx.user.findFirst({
      where: {
        email: email!,
      },
      select: {
        userId: true,
      },
    });

    if (existingEmail) {
      throw new Error("That email address is already in use.");
    }

    const sequenceResult = await tx.$queryRaw<
      Array<{ next_number: bigint }>
    >`
      SELECT nextval('"user_display_id_seq"') AS next_number
    `;

    const nextNumber = Number(sequenceResult[0].next_number);

    const displayId = `USR-${String(nextNumber).padStart(5, "0")}`;

    const passwordHash = await bcrypt.hash(data.password, 12);

    return tx.user.create({
      data: {
        displayId,
        fullName,
        username,
        email,
        passwordHash,
        role: data.role,
      },
      select: {
        userId: true,
        displayId: true,
        fullName: true,
        username: true,
        email: true,
        role: true,
        status: true,
        createdAt: true,
      },
    });
  });
}