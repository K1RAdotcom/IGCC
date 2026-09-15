import { Router } from "express";
import {
  getAllPatients,
  getPatientById,
} from "../services/patientService";
import { requireAuth } from "../middleware/auth";

const router = Router();

router.get("/", requireAuth, async (req, res) => {
  const search = String(req.query.search ?? "").trim();

  if (!search) {
    const patients = await getAllPatients();
    return res.json(patients);
  }

  const patients = await getAllPatients();
  const searchTerm = search.toLowerCase();

  const filteredPatients = patients.filter(
    (patient) =>
      patient.displayId.toLowerCase().includes(searchTerm) ||
      patient.fullName.toLowerCase().includes(searchTerm) ||
      patient.phone.toLowerCase().includes(searchTerm)
  );

  return res.json(filteredPatients);
});

router.get("/:patientId", requireAuth, async (req, res) => {
  const patientId = String(req.params.patientId);
  const patient = await getPatientById(patientId);

  if (!patient) {
    return res.status(404).json({
      error: "Patient not found.",
    });
  }

  return res.json(patient);
});

export default router;
