// routes/admin/user.routes.js

const express = require("express");
const router = express.Router();

const {
  getAllUsers,
  getSingleUser,
  updateUser,
  deleteUser,
} = require("../../controllers/admin/user.controller");

const authMiddleware = require("../../middlewares/auth.middleware");
const roleMiddleware = require("../../middlewares/role.middleware");

router.get(
  "/",
  authMiddleware,
  roleMiddleware("ADMIN", "RECEPTIONIST", "PATIENT"),
  getAllUsers
);

router.get(
  "/:id",
  authMiddleware,
  roleMiddleware("ADMIN", "RECEPTIONIST", "PATIENT"),
  getSingleUser
);

router.put(
  "/:id",
  authMiddleware,
  roleMiddleware("ADMIN", "RECEPTIONIST", "PATIENT"),
  updateUser
);

router.delete(
  "/:id",
  authMiddleware,
  roleMiddleware("ADMIN", "RECEPTIONIST", "PATIENT"),
  deleteUser
);

module.exports = router;