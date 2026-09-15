import { Router } from "express";
import { requireAuth } from "../middleware/auth";
import {
  createVisit,
  getVisitsByPatientId,
  getVisitById,
  updateVisit,
} from "../services/visitService";
import { createAuditLog } from "../services/auditLogService";

const router = Router();

router.get("/patient/:patientId", requireAuth, async (req, res) => {
  const patientId = String(req.params.patientId);
  const visits = await getVisitsByPatientId(patientId);

  return res.json(visits);
});

router.get("/:visitId", requireAuth, async (req, res) => {
  const visitId = String(req.params.visitId);
  const visit = await getVisitById(visitId);

  if (!visit) {
    return res.status(404).json({
      error: "Visit not found.",
    });
  }

  return res.json(visit);
});

router.post("/", requireAuth, async (req, res) => {
  try {
    const {
      patientId,
      reasonForVisit,
      complaintSymptoms,
      bloodPressure,
      pulse,
      bloodSugar,
      respiration,
      temperature,
      assessmentObservation,
      treatment,
      actionTaken,
      additionalNotes,
      recommendationsFollowUp,
      visitDateTime,
    } = req.body;

    if (!patientId || !reasonForVisit) {
      return res.status(400).json({
        error: "Patient ID and reason for visit are required.",
      });
    }

    const visit = await createVisit({
      patientId,
      staffUserId: req.session.userId!,
      reasonForVisit,
      complaintSymptoms,
      bloodPressure,
      pulse,
      bloodSugar,
      respiration,
      temperature,
      assessmentObservation,
      treatment,
      actionTaken,
      additionalNotes,
      recommendationsFollowUp,
      visitDateTime,
    });

    await createAuditLog({
      userId: req.session.userId!,
      action: "VISIT_CREATED",
      entityType: "VISIT",
      entityId: visit.visitId,
      description: `Recorded visit ${visit.displayId} for patient ${visit.patientId}.`,
    });

    return res.status(201).json(visit);
  } catch (error) {
    console.error("Create visit error:", error);

    if (error instanceof Error) {
      return res.status(400).json({
        error: error.message,
      });
    }

    return res.status(500).json({
      error: "Could not record visit.",
    });
  }
});

router.patch("/:visitId", requireAuth, async (req, res) => {
  try {
    const visitId = String(req.params.visitId);

    const visit = await updateVisit(visitId, req.body);

    await createAuditLog({
      userId: req.session.userId!,
      action: "VISIT_UPDATED",
      entityType: "VISIT",
      entityId: visit.visitId,
      description: `Updated visit ${visit.displayId} for patient ${visit.patientId}.`,
    });

    return res.json({
      message: "Visit updated successfully.",
      visit,
    });
  } catch (error) {
    console.error("Update visit error:", error);

    if (error instanceof Error) {
      if (error.message === "Visit not found.") {
        return res.status(404).json({
          error: error.message,
        });
      }

      return res.status(400).json({
        error: error.message,
      });
    }

    return res.status(500).json({
      error: "Could not update visit.",
    });
  }
});

export default router;
