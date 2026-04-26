// routes/common/medicalRecord.routes.js

const express = require("express");
const router = express.Router();

const {
  createMedicalRecord,
  getAllMedicalRecords,
  getSingleMedicalRecord,
  updateMedicalRecord,
  deleteMedicalRecord,
} = require("../../controllers/common/medicalRecord.controller");

const authMiddleware = require("../../middlewares/auth.middleware");
const roleMiddleware = require("../../middlewares/role.middleware");

router.post(
  "/create",
  authMiddleware,
  roleMiddleware("ADMIN", "DOCTOR" , "NURSE", "PATIENT"),
  createMedicalRecord
);

router.get(
  "/",
  authMiddleware,
  roleMiddleware("ADMIN", "DOCTOR", "PATIENT", "RECEPTIONIST", "NURSE"),
  getAllMedicalRecords
);

router.get(
  "/:id",
  authMiddleware,
  roleMiddleware("ADMIN", "DOCTOR", "PATIENT", "RECEPTIONIST", "NURSE"),
  getSingleMedicalRecord
);

router.put(
  "/:id",
  authMiddleware,
  roleMiddleware("ADMIN", "DOCTOR", "NURSE", "PATIENT"),
  updateMedicalRecord
);

router.delete(
  "/:id",
  authMiddleware,
  roleMiddleware("ADMIN"),
  deleteMedicalRecord
);

module.exports = router;