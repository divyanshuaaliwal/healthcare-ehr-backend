const express = require("express");
const router = express.Router();

const {
  getMyPatients,
  getPatientDetails,
} = require("../../controllers/doctor/patient.controller");

const authMiddleware = require("../../middlewares/auth.middleware");
const roleMiddleware = require("../../middlewares/role.middleware");

router.get(
  "/my-patients",
  authMiddleware,
  roleMiddleware("DOCTOR", "ADMIN"),
  getMyPatients
);

router.get(
  "/patients/:id",
  authMiddleware,
  roleMiddleware("DOCTOR", "ADMIN"),
  getPatientDetails
);

module.exports = router;