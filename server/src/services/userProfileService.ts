import { prisma } from "../lib/prisma";

type UpdateMyProfileData = {
  fullName?: string;
  email?: string;
};

export async function updateMyProfile(
  userId: string,
  data: UpdateMyProfileData
) {
  const existingUser = await prisma.user.findUnique({
    where: {
      userId,
    },
  });

  if (!existingUser) {
    throw new Error("User account not found.");
  }

  if (data.fullName !== undefined && !data.fullName.trim()) {
    throw new Error("Full name is required.");
  }

  return prisma.user.update({
    where: {
      userId,
    },
    data: {
      fullName:
        data.fullName !== undefined
          ? data.fullName.trim()
          : undefined,

      email:
        data.email !== undefined
          ? data.email.trim() || null
          : undefined,
    },
    select: {
      userId: true,
      displayId: true,
      fullName: true,
      username: true,
      email: true,
      role: true,
      status: true,
    },
  });
}
