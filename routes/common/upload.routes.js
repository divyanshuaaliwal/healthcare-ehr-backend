const express = require("express");
const router = express.Router();

const { uploadFile } = require("../../controllers/common/upload.controller");

const authMiddleware = require("../../middlewares/auth.middleware");
const upload = require("../../middlewares/upload.middleware");

router.post(
  "/",
  authMiddleware,
  upload.single("file"),
  uploadFile
);

module.exports = router;