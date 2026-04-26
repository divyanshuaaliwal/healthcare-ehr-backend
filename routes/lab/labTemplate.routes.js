const express = require("express");
const router = express.Router();

const {
  createLabTemplate,
  getAllLabTemplates,
  updateLabTemplate,
  deleteLabTemplate,
} = require("../../controllers/lab/labTemplate.controller");

const authMiddleware = require("../../middlewares/auth.middleware");
const roleMiddleware = require("../../middlewares/role.middleware");

// POST /lab-templates        ← LabTemplates.tsx uses this (no /create)
router.post(
  "/",
  authMiddleware,
  roleMiddleware("ADMIN", "LAB_TECHNICIAN"),
  createLabTemplate
);

// POST /lab-templates/create ← keep for backward compat
router.post(
  "/create",
  authMiddleware,
  roleMiddleware("ADMIN", "LAB_TECHNICIAN"),
  createLabTemplate
);

router.get(
  "/",
  authMiddleware,
  roleMiddleware("ADMIN", "LAB_TECHNICIAN", "DOCTOR"),
  getAllLabTemplates
);

router.put(
  "/:id",
  authMiddleware,
  roleMiddleware("ADMIN", "LAB_TECHNICIAN"),
  updateLabTemplate
);

// DELETE /:id ← LabTemplates.tsx calls this too
router.delete(
  "/:id",
  authMiddleware,
  roleMiddleware("ADMIN", "LAB_TECHNICIAN"),
  deleteLabTemplate
);

module.exports = router;