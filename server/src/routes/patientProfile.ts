import { Router } from "express";
import { requireAuth } from "../middleware/auth";
import { getPatientProfile } from "../services/patientProfileService";

const router = Router();

router.get("/:patientId", requireAuth, async (req, res) => {
  try {
    const patient = await getPatientProfile(String(req.params.patientId));

    if (!patient) {
      return res.status(404).json({
        error: "Patient not found.",
      });
    }

    return res.json(patient);
  } catch (error) {
    console.error("Patient profile error:", error);

    return res.status(500).json({
      error: "Could not load patient profile.",
    });
  }
});

export default router;
