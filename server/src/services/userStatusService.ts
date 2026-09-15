import { prisma } from "../lib/prisma";

export async function setUserStatus(
  userId: string,
  status: "ACTIVE" | "INACTIVE"
) {
  return prisma.user.update({
    where: {
      userId,
    },
    data: {
      status,
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
      updatedAt: true,
    },
  });
}
