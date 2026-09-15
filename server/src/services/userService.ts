
import bcrypt from "bcrypt";
import { prisma } from "../lib/prisma";

type CreateUserData = {
  fullName: string;
  username: string;
  email?: string;
  password: string;
  role: "ADMIN" | "CLINIC_STAFF";
};

export async function createUser(data: CreateUserData) {
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
        fullName: data.fullName,
        username: data.username,
        email: data.email,
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