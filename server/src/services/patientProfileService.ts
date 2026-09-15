import { prisma } from "../lib/prisma";

export async function getPatientProfile(patientId: string) {
  const patient = await prisma.patient.findUnique({
    where: {
      patientId,
    },
    include: {
      visits: {
        orderBy: {
          visitDateTime: "desc",
        },
        include: {
          staff: {
            select: {
              displayId: true,
              fullName: true,
              username: true,
            },
          },
        },
      },
    },
  });

  return patient;
}
