const express = require("express");
const router = express.Router();

const {
  getMyProfile,
  updateDoctorProfile,
  getPatientProfile,
  updatePatientProfile,
  updateProfile,
  updateLabProfile
} = require("../../controllers/common/profile.controller");

const authMiddleware = require("../../middlewares/auth.middleware");

// Shared — works for both roles (returns full user doc)
router.get("/me", authMiddleware, getMyProfile);

// Doctor-specific
router.put("/doctor/update", authMiddleware, updateDoctorProfile);

//all
router.put("/update", authMiddleware, updateProfile); 

// Patient-specific
router.get("/patient/profile", authMiddleware, getPatientProfile);
router.put("/patient/profile", authMiddleware, updatePatientProfile);

//lab
router.put("/lab/update", authMiddleware, updateLabProfile);

module.exports = router;