// routes/common/prescription.routes.js

const express = require("express");
const router = express.Router();

const {
  createPrescription,
  getAllPrescriptions,
  getSinglePrescription,
  updatePrescription,
  deletePrescription,
  dispensePrescription,
} = require("../../controllers/common/prescription.controller");

const authMiddleware = require("../../middlewares/auth.middleware");
const roleMiddleware = require("../../middlewares/role.middleware");

router.post(
  "/create",
  authMiddleware,
  roleMiddleware("ADMIN", "DOCTOR"),
  createPrescription
);

router.get(
  "/",
  authMiddleware,
  roleMiddleware("ADMIN", "DOCTOR", "PATIENT", "PHARMACIST"),
  getAllPrescriptions
);

router.get(
  "/:id",
  authMiddleware,
  roleMiddleware("ADMIN", "DOCTOR", "PATIENT", "PHARMACIST"),
  getSinglePrescription
);

router.put(
  "/:id",
  authMiddleware,
  roleMiddleware("ADMIN", "DOCTOR"),
  updatePrescription
);

router.delete(
  "/:id",
  authMiddleware,
  roleMiddleware("ADMIN"),
  deletePrescription
);

router.put(
  "/:id/dispense",
  authMiddleware,
  roleMiddleware("ADMIN", "PHARMACIST"),
  dispensePrescription
);

module.exports = router;