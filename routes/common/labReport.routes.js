const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const {
  createLabReport,
  getAllLabReports,
  getSingleLabReport,
  updateLabReport,
  deleteLabReport,
  getLabResults,
  submitLabResult,
  upload,
} = require("../../controllers/common/labReport.controller");

const authMiddleware = require("../../middlewares/auth.middleware");
const roleMiddleware = require("../../middlewares/role.middleware");

router.post(
  "/create",
  authMiddleware,
  roleMiddleware("ADMIN", "DOCTOR", "LAB_TECHNICIAN"),
  createLabReport
);

router.get(
  "/",
  authMiddleware,
  roleMiddleware("ADMIN", "DOCTOR", "PATIENT", "LAB_TECHNICIAN"),
  getAllLabReports
);

// ⚠️ MUST be before /:id routes
router.get(
  "/results",
  authMiddleware,
  roleMiddleware("ADMIN", "DOCTOR", "LAB_TECHNICIAN"),
  getLabResults
);

// ⚠️ MUST be before /:id routes
router.post(
  "/:id/submit-result",
  authMiddleware,
  roleMiddleware("ADMIN", "LAB_TECHNICIAN"),
  upload.single("file"),
  submitLabResult
);

router.get(
  "/:id",
  authMiddleware,
  roleMiddleware("ADMIN", "DOCTOR", "PATIENT", "LAB_TECHNICIAN"),
  getSingleLabReport
);

router.put(
  "/:id",
  authMiddleware,
  roleMiddleware("ADMIN", "DOCTOR", "LAB_TECHNICIAN"),
  updateLabReport
);

router.delete(
  "/:id",
  authMiddleware,
  roleMiddleware("ADMIN"),
  deleteLabReport
);

module.exports = router;