import { prisma } from "../lib/prisma";

type UpdatePatientData = {
  fullName?: string;
  dateOfBirth?: string;
  phone?: string;
  email?: string;
  gender?: string;
  address?: string;
  secondaryPhone?: string;
  patientCategory?: "MEMBER" | "STAFF" | "GUEST" | "OTHER";
  emergencyContactName?: string;
  emergencyContactPhone?: string;
  profilePhoto?: string;
  golfClubMembership?: string;
  medicalPhysicalInformation?: string;
  additionalNotes?: string;
};

export async function updatePatient(
  patientId: string,
  data: UpdatePatientData
) {
  const existingPatient = await prisma.patient.findUnique({
    where: { patientId },
  });

  if (!existingPatient) {
    throw new Error("Patient not found.");
  }

  if (data.fullName !== undefined && !data.fullName.trim()) {
    throw new Error("Full name is required.");
  }

  if (data.phone !== undefined && !data.phone.trim()) {
    throw new Error("Phone number is required.");
  }

  if (
    data.emergencyContactName !== undefined &&
    !data.emergencyContactName.trim()
  ) {
    throw new Error("Emergency contact name is required.");
  }

  if (
    data.emergencyContactPhone !== undefined &&
    !data.emergencyContactPhone.trim()
  ) {
    throw new Error("Emergency contact phone is required.");
  }

  return prisma.patient.update({
    where: {
      patientId,
    },
    data: {
      fullName:
        data.fullName !== undefined ? data.fullName.trim() : undefined,

      dateOfBirth:
        data.dateOfBirth !== undefined
          ? new Date(data.dateOfBirth)
          : undefined,

      phone: data.phone !== undefined ? data.phone.trim() : undefined,

      email: data.email !== undefined ? data.email.trim() || null : undefined,

      gender:
        data.gender !== undefined ? data.gender.trim() || null : undefined,

      address:
        data.address !== undefined ? data.address.trim() || null : undefined,

      secondaryPhone:
        data.secondaryPhone !== undefined
          ? data.secondaryPhone.trim() || null
          : undefined,

      patientCategory: data.patientCategory,

      emergencyContactName:
        data.emergencyContactName !== undefined
          ? data.emergencyContactName.trim()
          : undefined,

      emergencyContactPhone:
        data.emergencyContactPhone !== undefined
          ? data.emergencyContactPhone.trim()
          : undefined,

      profilePhoto:
        data.profilePhoto !== undefined
          ? data.profilePhoto.trim() || null
          : undefined,

      golfClubMembership:
        data.golfClubMembership !== undefined
          ? data.golfClubMembership.trim() || null
          : undefined,

      medicalPhysicalInformation:
        data.medicalPhysicalInformation !== undefined
          ? data.medicalPhysicalInformation.trim() || null
          : undefined,

      additionalNotes:
        data.additionalNotes !== undefined
          ? data.additionalNotes.trim() || null
          : undefined,
    },
  });
}
