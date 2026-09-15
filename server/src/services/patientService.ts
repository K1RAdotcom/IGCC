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

export async function getAllPatients() {
  return prisma.patient.findMany({
    orderBy: {
      fullName: "asc",
    },
  });
}

export async function createPatient(data: CreatePatientData) {
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
        fullName: data.fullName,
        dateOfBirth: new Date(data.dateOfBirth),
        phone: data.phone,
        email: data.email,
        gender: data.gender,
        address: data.address,
        secondaryPhone: data.secondaryPhone,
        patientCategory: data.patientCategory,
        emergencyContactName: data.emergencyContactName,
        emergencyContactPhone: data.emergencyContactPhone,
        profilePhoto: data.profilePhoto,
        golfClubMembership: data.golfClubMembership,
        medicalPhysicalInformation: data.medicalPhysicalInformation,
        additionalNotes: data.additionalNotes,
      },
    });
  });
}

export async function getPatientById(patientId: string) {
  return prisma.patient.findUnique({
    where: {
      patientId,
    },
    include: {
      visits: {
        orderBy: {
          visitDateTime: "desc",
        },
      },
    },
  });
}