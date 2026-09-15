import { Router } from "express";
import { requireAuth } from "../middleware/auth";
import { createPatient } from "../services/patientCreateService";
import { createAuditLog } from "../services/auditLogService";

const router = Router();

router.post("/", requireAuth, async (req, res) => {
  try {
    const {
      fullName,
      dateOfBirth,
      phone,
      email,
      gender,
      address,
      secondaryPhone,
      patientCategory,
      emergencyContactName,
      emergencyContactPhone,
      profilePhoto,
      golfClubMembership,
      medicalPhysicalInformation,
      additionalNotes,
    } = req.body;

    const patient = await createPatient({
      fullName,
      dateOfBirth,
      phone,
      email,
      gender,
      address,
      secondaryPhone,
      patientCategory,
      emergencyContactName,
      emergencyContactPhone,
      profilePhoto,
      golfClubMembership,
      medicalPhysicalInformation,
      additionalNotes,
    });

    await createAuditLog({
      userId: req.session.userId!,
      action: "PATIENT_CREATED",
      entityType: "PATIENT",
      entityId: patient.patientId,
      description: `Registered patient ${patient.displayId} for ${patient.fullName}.`,
    });

    return res.status(201).json({
      message: "Patient registered successfully.",
      patient,
    });
  } catch (error) {
    console.error("Create patient error:", error);

    if (error instanceof Error) {
      return res.status(400).json({
        error: error.message,
      });
    }

    return res.status(500).json({
      error: "Could not register patient.",
    });
  }
});

export default router;
