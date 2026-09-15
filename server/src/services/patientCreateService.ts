import { prisma } from "../lib/prisma";

type CreatePatientData = {
  fullName: string;
  dateOfBirth: string;
  phone: string;
  email?: string;
  gender?: string;
  address?: string;
  secondaryPhone?: string;
  patientCategory: "MEMBER" | "STAFF" | "GUEST" | "OTHER";
  emergencyContactName: string;
  emergencyContactPhone: string;
  profilePhoto?: string;
  golfClubMembership?: string;
  medicalPhysicalInformation?: string;
  additionalNotes?: string;
};

function validateTextLength(
  value: string | undefined,
  fieldName: string,
  maxLength: number
) {
  if (value && value.length > maxLength) {
    throw new Error(`${fieldName} must not exceed ${maxLength} characters.`);
  }
}

function validatePhone(value: string, fieldName: string) {
  if (!/^[0-9+()\-.\s]{7,30}$/.test(value)) {
    throw new Error(`${fieldName} contains an invalid phone number.`);
  }
}

function validateDateOfBirth(value: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    throw new Error("Please enter a valid date of birth.");
  }

  const today = new Date();

  if (date > today) {
    throw new Error("Date of birth cannot be in the future.");
  }

  const minimumDate = new Date();
  minimumDate.setFullYear(minimumDate.getFullYear() - 120);

  if (date < minimumDate) {
    throw new Error("Please enter a valid date of birth.");
  }
}

function validateEmail(value: string | undefined) {
  if (!value) {
    return;
  }

  if (value.length > 254) {
    throw new Error("Email address must not exceed 254 characters.");
  }

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!emailPattern.test(value)) {
    throw new Error("Please enter a valid email address.");
  }
}

export async function createPatient(data: CreatePatientData) {
  const fullName = data.fullName?.trim();
  const dateOfBirth = data.dateOfBirth?.trim();
  const phone = data.phone?.trim();
  const email = data.email?.trim() || null;
  const gender = data.gender?.trim() || null;
  const address = data.address?.trim() || null;
  const secondaryPhone = data.secondaryPhone?.trim() || null;
  const emergencyContactName = data.emergencyContactName?.trim();
  const emergencyContactPhone = data.emergencyContactPhone?.trim();
  const profilePhoto = data.profilePhoto?.trim() || null;
  const golfClubMembership = data.golfClubMembership?.trim() || null;
  const medicalPhysicalInformation =
    data.medicalPhysicalInformation?.trim() || null;
  const additionalNotes = data.additionalNotes?.trim() || null;

  if (!fullName) {
    throw new Error("Full name is required.");
  }

  if (!dateOfBirth) {
    throw new Error("Date of birth is required.");
  }

  if (!phone) {
    throw new Error("Phone number is required.");
  }

  if (!data.patientCategory) {
    throw new Error("Patient category is required.");
  }

  if (!emergencyContactName) {
    throw new Error("Emergency contact name is required.");
  }

  if (!emergencyContactPhone) {
    throw new Error("Emergency contact phone is required.");
  }

  if (
    data.patientCategory !== "MEMBER" &&
    data.patientCategory !== "STAFF" &&
    data.patientCategory !== "GUEST" &&
    data.patientCategory !== "OTHER"
  ) {
    throw new Error("Invalid patient category.");
  }

  validateTextLength(fullName, "Full name", 100);
  validateTextLength(phone, "Phone number", 30);
  validateTextLength(gender ?? undefined, "Gender", 50);
  validateTextLength(address ?? undefined, "Address", 300);
  validateTextLength(
    secondaryPhone ?? undefined,
    "Secondary phone",
    30
  );
  validateTextLength(
    emergencyContactName,
    "Emergency contact name",
    100
  );
  validateTextLength(
    emergencyContactPhone,
    "Emergency contact phone",
    30
  );
  validateTextLength(
    golfClubMembership ?? undefined,
    "Golf club membership",
    100
  );
  validateTextLength(
    medicalPhysicalInformation ?? undefined,
    "Relevant medical/physical information",
    2000
  );
  validateTextLength(
    additionalNotes ?? undefined,
    "Additional notes",
    2000
  );

  validatePhone(phone, "Phone number");
  validatePhone(emergencyContactPhone, "Emergency contact phone");

  if (secondaryPhone) {
    validatePhone(secondaryPhone, "Secondary phone");
  }

  validateEmail(email ?? undefined);
  validateDateOfBirth(dateOfBirth);

  return prisma.$transaction(async (tx) => {
    const sequenceResult = await tx.$queryRaw<
      Array<{ next_number: bigint }>
    >`
      SELECT nextval('"patient_display_id_seq"') AS next_number
    `;

    const nextNumber = Number(sequenceResult[0].next_number);

    const displayId = `GC-${String(nextNumber).padStart(6, "0")}`;

    return tx.patient.create({
      data: {
        displayId,
        fullName,
        dateOfBirth: new Date(dateOfBirth),
        phone,
        email,
        gender,
        address,
        secondaryPhone,
        patientCategory: data.patientCategory,
        emergencyContactName,
        emergencyContactPhone,
        profilePhoto,
        golfClubMembership,
        medicalPhysicalInformation,
        additionalNotes,
      },
    });
  });
}