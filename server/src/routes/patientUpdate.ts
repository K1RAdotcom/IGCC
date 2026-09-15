import { Router } from "express";
import { requireAuth } from "../middleware/auth";
import { updatePatient } from "../services/patientUpdateService";
import { createAuditLog } from "../services/auditLogService";

const router = Router();

router.patch("/:patientId", requireAuth, async (req, res) => {
  try {
    const patientId = String(req.params.patientId);

    const patient = await updatePatient(patientId, req.body);

    await createAuditLog({
      userId: req.session.userId!,
      action: "PATIENT_UPDATED",
      entityType: "PATIENT",
      entityId: patient.patientId,
      description: `Updated patient ${patient.displayId} for ${patient.fullName}.`,
    });

    return res.json({
      message: "Patient updated successfully.",
      patient,
    });
  } catch (error) {
    console.error("Update patient error:", error);

    if (error instanceof Error) {
      if (error.message === "Patient not found.") {
        return res.status(404).json({
          error: error.message,
        });
      }

      return res.status(400).json({
        error: error.message,
      });
    }

    return res.status(500).json({
      error: "Could not update patient.",
    });
  }
});

export default router;
