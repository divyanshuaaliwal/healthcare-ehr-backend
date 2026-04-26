const express = require("express");
const router = express.Router();

const { getDashboardStats } = require("../../controllers/admin/dashboard.controller");

const authMiddleware = require("../../middlewares/auth.middleware");
const roleMiddleware = require("../../middlewares/role.middleware");

router.get(
  "/",
  authMiddleware,
  roleMiddleware("ADMIN"),
  getDashboardStats
);

module.exports = router;