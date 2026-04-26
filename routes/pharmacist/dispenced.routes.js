const express = require("express");
const router = express.Router();

const {
  getDispensedPrescriptions,
} = require("../../controllers/pharmacist/dispensed.controller");

const authMiddleware = require("../../middlewares/auth.middleware");
const roleMiddleware = require("../../middlewares/role.middleware");

router.get(
  "/",
  authMiddleware,
  roleMiddleware("ADMIN", "PHARMACIST"),
  getDispensedPrescriptions
);

module.exports = router;