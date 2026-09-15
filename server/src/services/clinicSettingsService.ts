import { prisma } from "../lib/prisma";

type ClinicSettingsData = {
  clinicName: string;
  address?: string;
  phone?: string;
  email?: string;
  logo?: string;
};

export async function getClinicSettings() {
  return prisma.clinicSettings.findFirst({
    orderBy: {
      updatedAt: "desc",
    },
  });
}

export async function updateClinicSettings(data: ClinicSettingsData) {
  if (!data.clinicName?.trim()) {
    throw new Error("Clinic name is required.");
  }

  const existing = await prisma.clinicSettings.findFirst();

  if (existing) {
    return prisma.clinicSettings.update({
      where: {
        settingId: existing.settingId,
      },
      data: {
        clinicName: data.clinicName.trim(),
        address: data.address?.trim() || null,
        phone: data.phone?.trim() || null,
        email: data.email?.trim() || null,
        logo: data.logo?.trim() || null,
      },
    });
  }

  return prisma.clinicSettings.create({
    data: {
      clinicName: data.clinicName.trim(),
      address: data.address?.trim() || null,
      phone: data.phone?.trim() || null,
      email: data.email?.trim() || null,
      logo: data.logo?.trim() || null,
    },
  });
}