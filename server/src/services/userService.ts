import bcrypt from "bcrypt";
import { prisma } from "../lib/prisma";

type CreateUserData = {
  fullName: string;
  username: string;
  email?: string;
  password: string;
  role: "ADMIN" | "CLINIC_STAFF";
};

export class UserValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "UserValidationError";
  }
}

function normalizeUsername(value: string) {
  const username = value.trim().toLowerCase();

  if (username.length < 3) {
    throw new UserValidationError(
      "Username must be at least 3 characters."
    );
  }

  if (username.length > 30) {
    throw new UserValidationError(
      "Username must not exceed 30 characters."
    );
  }

  if (!/^[a-z0-9._-]+$/.test(username)) {
    throw new UserValidationError(
      "Username can only contain letters, numbers, dots, underscores, and hyphens."
    );
  }

  return username;
}

function normalizeEmail(value?: string) {
  if (value === undefined || value === null) {
    return null;
  }

  if (typeof value !== "string") {
    throw new UserValidationError("Email address is invalid.");
  }

  const email = value.trim().toLowerCase();

  if (!email) {
    return null;
  }

  if (email.length > 254) {
    throw new UserValidationError(
      "Email address must not exceed 254 characters."
    );
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    throw new UserValidationError(
      "Please enter a valid email address."
    );
  }

  return email;
}

function normalizeFullName(value: string) {
  if (typeof value !== "string") {
    throw new UserValidationError("Full name is required.");
  }

  const fullName = value.trim();

  if (!fullName) {
    throw new UserValidationError("Full name is required.");
  }

  if (fullName.length < 2) {
    throw new UserValidationError(
      "Full name must be at least 2 characters."
    );
  }

  if (fullName.length > 100) {
    throw new UserValidationError(
      "Full name must not exceed 100 characters."
    );
  }

  return fullName;
}

function validatePassword(value: string) {
  if (typeof value !== "string" || !value) {
    throw new UserValidationError("Password is required.");
  }

  if (value.length < 8) {
    throw new UserValidationError(
      "Password must be at least 8 characters."
    );
  }

  if (value.length > 128) {
    throw new UserValidationError(
      "Password must not exceed 128 characters."
    );
  }

  if (value !== value.trim()) {
    throw new UserValidationError(
      "Password cannot start or end with spaces."
    );
  }
}

export async function createUser(data: CreateUserData) {
  const fullName = normalizeFullName(data.fullName);
  const username = normalizeUsername(data.username);
  const email = normalizeEmail(data.email);

  validatePassword(data.password);

  if (data.role !== "ADMIN" && data.role !== "CLINIC_STAFF") {
    throw new UserValidationError("Invalid user role.");
  }

  const passwordHash = await bcrypt.hash(data.password, 12);

  return prisma.$transaction(async (tx) => {
    if (data.role === "ADMIN") {
      const existingAdmin = await tx.user.findFirst({
        where: {
          role: "ADMIN",
        },
        select: {
          userId: true,
        },
      });

      if (existingAdmin) {
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
      throw new Error("Username already exists.");
    }

    const sequenceResult = await tx.$queryRaw<
      Array<{ next_number: bigint }>
    >`
      SELECT nextval('"user_display_id_seq"') AS next_number
    `;

    const nextNumber = Number(sequenceResult[0].next_number);

    const displayId = `USR-${String(nextNumber).padStart(5, "0")}`;

    return tx.user.create({
      data: {
        displayId,
        fullName,
        username,
        email: email ?? undefined,
        passwordHash,
        role: data.role,
      },
    });
  });
}

export async function getUsers() {
  return prisma.user.findMany({
    select: {
      userId: true,
      displayId: true,
      fullName: true,
      username: true,
      email: true,
      role: true,
      status: true,
      createdAt: true,
      updatedAt: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
}