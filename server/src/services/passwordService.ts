import bcrypt from "bcrypt";
import { prisma } from "../lib/prisma";

type ChangePasswordData = {
  currentPassword: string;
  newPassword: string;
};

export async function changeMyPassword(
  userId: string,
  data: ChangePasswordData
) {
  const user = await prisma.user.findUnique({
    where: {
      userId,
    },
  });

  if (!user) {
    throw new Error("User account not found.");
  }

  const currentPasswordMatches = await bcrypt.compare(
    data.currentPassword,
    user.passwordHash
  );

  if (!currentPasswordMatches) {
    throw new Error("Current password is incorrect.");
  }

  if (data.newPassword.length < 8) {
    throw new Error("New password must be at least 8 characters.");
  }

  if (data.currentPassword === data.newPassword) {
    throw new Error(
      "New password must be different from your current password."
    );
  }

  const newPasswordHash = await bcrypt.hash(data.newPassword, 12);

  await prisma.user.update({
    where: {
      userId,
    },
    data: {
      passwordHash: newPasswordHash,
    },
  });
}
