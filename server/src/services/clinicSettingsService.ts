import { prisma } from "../lib/prisma";

type ClinicSettingsData = {
  clinicName: string;
  address?: string;
  phone?: string;
  email?: string;
  logo?: string;
};

function normalizeRequiredText(
  value: unknown,
  fieldName: string,
  maxLength: number
) {
  if (typeof value !== "string") {
    throw new Error(`${fieldName} is required.`);
  }

  const trimmed = value.trim();

  if (!trimmed) {
    throw new Error(`${fieldName} is required.`);
  }

  if (trimmed.length > maxLength) {
    throw new Error(
      `${fieldName} must not exceed ${maxLength} characters.`
    );
  }

  return trimmed;
}

function normalizeOptionalText(
  value: unknown,
  fieldName: string,
  maxLength: number
) {
  if (value === undefined || value === null) {
    return null;
  }

  if (typeof value !== "string") {
    throw new Error(`${fieldName} is invalid.`);
  }

  const trimmed = value.trim();

  if (!trimmed) {
    return null;
  }

  if (trimmed.length > maxLength) {
    throw new Error(
      `${fieldName} must not exceed ${maxLength} characters.`
    );
  }

  return trimmed;
}

function validatePhone(value: string | null) {
  if (!value) {
    return;
  }

  if (!/^[0-9+()\-.\s]{7,30}$/.test(value)) {
    throw new Error("Phone number contains an invalid phone number.");
  }
}

function validateEmail(value: string | null) {
  if (!value) {
    return;
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
    throw new Error("Please enter a valid email address.");
  }
}

export async function getClinicSettings() {
  return prisma.clinicSettings.findFirst({
    orderBy: {
      updatedAt: "desc",
    },
  });
}

export async function updateClinicSettings(data: ClinicSettingsData) {
  const clinicName = normalizeRequiredText(
    data.clinicName,
    "Clinic name",
    100
  );

  const address = normalizeOptionalText(
    data.address,
    "Address",
    300
  );

  const phone = normalizeOptionalText(
    data.phone,
    "Phone number",
    30
  );

  const email = normalizeOptionalText(
    data.email,
    "Email address",
    254
  );

  const logo = normalizeOptionalText(
    data.logo,
    "Logo",
    10000
  );

  validatePhone(phone);
  validateEmail(email);

  const existing = await prisma.clinicSettings.findFirst();

  if (existing) {
    return prisma.clinicSettings.update({
      where: {
        settingId: existing.settingId,
      },
      data: {
        clinicName,
        address,
        phone,
        email,
        logo,
      },
    });
  }

  return prisma.clinicSettings.create({
    data: {
      clinicName,
      address,
      phone,
      email,
      logo,
    },
  });
}