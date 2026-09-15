import bcrypt from "bcrypt";
import { prisma } from "../lib/prisma";

export async function authenticateUser(
  username: string,
  password: string
) {
  const user = await prisma.user.findUnique({
    where: {
      username,
    },
  });

  if (!user) {
    return null;
  }

  if (user.status !== "ACTIVE") {
    return null;
  }

  const passwordMatches = await bcrypt.compare(
    password,
    user.passwordHash
  );

  if (!passwordMatches) {
    return null;
  }

  return {
    userId: user.userId,
    displayId: user.displayId,
    fullName: user.fullName,
    username: user.username,
    email: user.email,
    role: user.role,
    status: user.status,
  };
}