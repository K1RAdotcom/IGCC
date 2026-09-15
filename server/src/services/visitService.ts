import { prisma } from "../lib/prisma";

type CreateVisitData = {
  patientId: string;
  staffUserId: string;
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

type UpdateVisitData = {
  visitDateTime?: string;
  reasonForVisit?: string;
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

function validateTextLength(
  value: string | undefined,
  fieldName: string,
  maxLength: number
) {
  if (value && value.length > maxLength) {
    throw new Error(`${fieldName} must not exceed ${maxLength} characters.`);
  }
}

function validateVital(
  value: number | undefined,
  fieldName: string,
  minimum: number,
  maximum: number
) {
  if (value === undefined || value === null) {
    return;
  }

  if (typeof value !== "number" || !Number.isFinite(value)) {
    throw new Error(`${fieldName} must be a valid number.`);
  }

  if (value < minimum || value > maximum) {
    throw new Error(
      `${fieldName} must be between ${minimum} and ${maximum}.`
    );
  }
}

function validateDateTime(value: string | undefined) {
  if (!value) {
    return;
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    throw new Error("Please enter a valid visit date and time.");
  }
}

function normalizeOptionalText(value?: string) {
  return value?.trim() || null;
}

export async function createVisit(data: CreateVisitData) {
  const patientId = data.patientId?.trim();
  const reasonForVisit = data.reasonForVisit?.trim();
  const complaintSymptoms = normalizeOptionalText(data.complaintSymptoms);
  const bloodPressure = normalizeOptionalText(data.bloodPressure);
  const assessmentObservation = normalizeOptionalText(
    data.assessmentObservation
  );
  const treatment = normalizeOptionalText(data.treatment);
  const actionTaken = normalizeOptionalText(data.actionTaken);
  const additionalNotes = normalizeOptionalText(data.additionalNotes);
  const recommendationsFollowUp = normalizeOptionalText(
    data.recommendationsFollowUp
  );

  if (!patientId) {
    throw new Error("Patient ID is required.");
  }

  if (!reasonForVisit) {
    throw new Error("Reason for visit is required.");
  }

  validateTextLength(reasonForVisit, "Reason for visit", 500);
  validateTextLength(
    complaintSymptoms ?? undefined,
    "Patient's description / complaint",
    3000
  );
  validateTextLength(
    bloodPressure ?? undefined,
    "Blood pressure",
    30
  );
  validateTextLength(
    assessmentObservation ?? undefined,
    "Assessment/observation",
    3000
  );
  validateTextLength(treatment ?? undefined, "Treatment", 3000);
  validateTextLength(actionTaken ?? undefined, "Action taken", 3000);
  validateTextLength(
    additionalNotes ?? undefined,
    "Additional notes",
    3000
  );
  validateTextLength(
    recommendationsFollowUp ?? undefined,
    "Recommendations/follow-up",
    3000
  );

  validateVital(data.pulse, "Pulse", 20, 300);
  validateVital(data.bloodSugar, "Blood sugar", 10, 1000);
  validateVital(data.respiration, "Respiration", 1, 100);
  validateVital(data.temperature, "Temperature", 25, 45);

  validateDateTime(data.visitDateTime);

  const patient = await prisma.patient.findUnique({
    where: {
      patientId,
    },
    select: {
      patientId: true,
    },
  });

  if (!patient) {
    throw new Error("Patient not found.");
  }

  return prisma.$transaction(async (tx) => {
    const sequenceResult = await tx.$queryRaw<
      Array<{ next_number: bigint }>
    >`
      SELECT nextval('"visit_display_id_seq"') AS next_number
    `;

    const nextNumber = Number(sequenceResult[0].next_number);
    const year = new Date().getFullYear();

    const displayId = `VIS-${year}-${String(nextNumber).padStart(5, "0")}`;

    return tx.visit.create({
      data: {
        displayId,
        patientId,
        staffUserId: data.staffUserId,
        visitDateTime: data.visitDateTime
          ? new Date(data.visitDateTime)
          : new Date(),
        reasonForVisit,
        complaintSymptoms,
        bloodPressure,
        pulse: data.pulse,
        bloodSugar: data.bloodSugar,
        respiration: data.respiration,
        temperature: data.temperature,
        assessmentObservation,
        treatment,
        actionTaken,
        additionalNotes,
        recommendationsFollowUp,
      },
    });
  });
}

export async function updateVisit(
  visitId: string,
  data: UpdateVisitData
) {
  const existingVisit = await prisma.visit.findUnique({
    where: {
      visitId,
    },
  });

  if (!existingVisit) {
    throw new Error("Visit not found.");
  }

  const reasonForVisit =
    data.reasonForVisit !== undefined
      ? data.reasonForVisit.trim()
      : undefined;

  if (reasonForVisit !== undefined && !reasonForVisit) {
    throw new Error("Reason for visit is required.");
  }

  validateTextLength(reasonForVisit, "Reason for visit", 500);
  validateTextLength(
    data.complaintSymptoms?.trim(),
    "Patient's description / complaint",
    3000
  );
  validateTextLength(
    data.bloodPressure?.trim(),
    "Blood pressure",
    30
  );
  validateTextLength(
    data.assessmentObservation?.trim(),
    "Assessment/observation",
    3000
  );
  validateTextLength(data.treatment?.trim(), "Treatment", 3000);
  validateTextLength(data.actionTaken?.trim(), "Action taken", 3000);
  validateTextLength(
    data.additionalNotes?.trim(),
    "Additional notes",
    3000
  );
  validateTextLength(
    data.recommendationsFollowUp?.trim(),
    "Recommendations/follow-up",
    3000
  );

  validateVital(data.pulse, "Pulse", 20, 300);
  validateVital(data.bloodSugar, "Blood sugar", 10, 1000);
  validateVital(data.respiration, "Respiration", 1, 100);
  validateVital(data.temperature, "Temperature", 25, 45);

  validateDateTime(data.visitDateTime);

  return prisma.visit.update({
    where: {
      visitId,
    },
    data: {
      visitDateTime: data.visitDateTime
        ? new Date(data.visitDateTime)
        : undefined,
      reasonForVisit,
      complaintSymptoms:
        data.complaintSymptoms !== undefined
          ? normalizeOptionalText(data.complaintSymptoms)
          : undefined,
      bloodPressure:
        data.bloodPressure !== undefined
          ? normalizeOptionalText(data.bloodPressure)
          : undefined,
      pulse: data.pulse,
      bloodSugar: data.bloodSugar,
      respiration: data.respiration,
      temperature: data.temperature,
      assessmentObservation:
        data.assessmentObservation !== undefined
          ? normalizeOptionalText(data.assessmentObservation)
          : undefined,
      treatment:
        data.treatment !== undefined
          ? normalizeOptionalText(data.treatment)
          : undefined,
      actionTaken:
        data.actionTaken !== undefined
          ? normalizeOptionalText(data.actionTaken)
          : undefined,
      additionalNotes:
        data.additionalNotes !== undefined
          ? normalizeOptionalText(data.additionalNotes)
          : undefined,
      recommendationsFollowUp:
        data.recommendationsFollowUp !== undefined
          ? normalizeOptionalText(data.recommendationsFollowUp)
          : undefined,
    },
  });
}

export async function getVisitsByPatientId(patientId: string) {
  return prisma.visit.findMany({
    where: {
      patientId,
    },
    orderBy: {
      visitDateTime: "desc",
    },
  });
}

export async function getVisitById(visitId: string) {
  return prisma.visit.findUnique({
    where: {
      visitId,
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
          displayId: true,
          fullName: true,
          username: true,
        },
      },
    },
  });
}