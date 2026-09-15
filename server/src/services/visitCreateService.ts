import { prisma } from "../lib/prisma";

type CreateVisitInput = {
  patientId: string;
  visitDateTime?: string;
  reasonForVisit: string;
  complaintSymptoms?: string;
  bloodPressure?: string;
  pulse?: number;
  bloodSugar?: number;
  respiration?: number;
  temperature?: number;
  assessmentObservation?: string;
  treatment?: string;
  actionTaken?: string;
  additionalNotes?: string;
  recommendationsFollowUp?: string;
};

async function generateVisitDisplayId() {
  const year = new Date().getFullYear();

  const count = await prisma.visit.count({
    where: {
      visitDateTime: {
        gte: new Date(`${year}-01-01T00:00:00`),
        lt: new Date(`${year + 1}-01-01T00:00:00`),
      },
    },
  });

  return `VIS-${year}-${String(count + 1).padStart(5, "0")}`;
}

export async function createVisit(
  staffUserId: string,
  input: CreateVisitInput
) {
  const patient = await prisma.patient.findUnique({
    where: {
      patientId: input.patientId,
    },
  });

  if (!patient) {
    throw new Error("Patient not found.");
  }

  if (!input.reasonForVisit?.trim()) {
    throw new Error("Reason for visit is required.");
  }

  const displayId = await generateVisitDisplayId();

  const visit = await prisma.visit.create({
    data: {
      displayId,
      patientId: input.patientId,
      staffUserId,
      visitDateTime: input.visitDateTime
        ? new Date(input.visitDateTime)
        : new Date(),
      reasonForVisit: input.reasonForVisit.trim(),
      complaintSymptoms: input.complaintSymptoms?.trim() || null,
      bloodPressure: input.bloodPressure?.trim() || null,
      pulse: input.pulse ?? null,
      bloodSugar: input.bloodSugar ?? null,
      respiration: input.respiration ?? null,
      temperature: input.temperature ?? null,
      assessmentObservation:
        input.assessmentObservation?.trim() || null,
      treatment: input.treatment?.trim() || null,
      actionTaken: input.actionTaken?.trim() || null,
      additionalNotes: input.additionalNotes?.trim() || null,
      recommendationsFollowUp:
        input.recommendationsFollowUp?.trim() || null,
    },
    include: {
      patient: {
        select: {
          patientId: true,
          displayId: true,
          fullName: true,
        },
      },
      staff: {
        select: {
          userId: true,
          displayId: true,
          fullName: true,
          username: true,
        },
      },
    },
  });

  return visit;
}
