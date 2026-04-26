const express = require("express");
const router = express.Router();

const {
  createAppointment,
  getAllAppointments,
  getSingleAppointment,
  updateAppointment,
  deleteAppointment,
  updateAppointmentStatus,
} = require("../../controllers/common/appointment.controller");

const authMiddleware = require("../../middlewares/auth.middleware");
const roleMiddleware = require("../../middlewares/role.middleware");

// Create appointment
router.post(
  "/create",
  authMiddleware,
  roleMiddleware(
    "ADMIN",
    "RECEPTIONIST",
    "PATIENT",
    "DOCTOR"
  ),
  createAppointment
);

// Get all appointments
router.get(
  "/",
  authMiddleware,
  roleMiddleware(
    "ADMIN",
    "DOCTOR",
    "PATIENT",
    "RECEPTIONIST",
    "NURSE"
  ),
  getAllAppointments
);

// Get single appointment
router.get(
  "/:id",
  authMiddleware,
  roleMiddleware(
    "ADMIN",
    "DOCTOR",
    "PATIENT",
    "RECEPTIONIST",
    "NURSE"
  ),
  getSingleAppointment
);

// Update appointment
router.put(
  "/:id",
  authMiddleware,
  roleMiddleware(
    "ADMIN",
    "RECEPTIONIST",
    "DOCTOR",
    "NURSE",
    "PATIENT"
  ),
  updateAppointment
);

// Delete appointment
router.delete(
  "/:id",
  authMiddleware,
  roleMiddleware(
    "ADMIN",
    "RECEPTIONIST",
    "PATIENT",
    "DOCTOR",
  ),
  deleteAppointment
);

// Update appointment status
router.patch(
  "/:id/status",
  authMiddleware,
  roleMiddleware(
    "ADMIN",
    "RECEPTIONIST",
    "DOCTOR",
    "NURSE",
    "PATIENT"
  ),
  updateAppointmentStatus
);

module.exports = router;