const User = require("../../models/user.model");

/* ─── GET MY PROFILE ──────────────────────────────────────────────── */
exports.getMyProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password -refreshToken");
    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    res.status(200).json({ success: true, user });
  } catch (error) {
    console.error("Get Profile Error:", error);
    res.status(500).json({ success: false, message: "Failed to fetch profile", error: error.message });
  }
};

/* ─── UPDATE DOCTOR PROFILE ───────────────────────────────────────── */
exports.updateDoctorProfile = async (req, res) => {
  try {
    // Shared fields allowed for all roles
    const sharedFields = ["name", "phone", "gender", "age", "address"];
    // Doctor-specific nested fields
    const doctorFields = [
      "specialization", "department", "experience",
      "qualifications", "bio", "clinicAddress",
      "consultationFee", "languages",
    ];

    const updateData = {};

    sharedFields.forEach((field) => {
      if (req.body[field] !== undefined) updateData[field] = req.body[field];
    });

    doctorFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        updateData[`doctorProfile.${field}`] = req.body[field];
      }
    });

    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      { $set: updateData },
      { new: true, runValidators: true }
    ).select("-password -refreshToken");

    res.status(200).json({
      success: true,
      message: "Doctor profile updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    console.error("Update Doctor Profile Error:", error);
    res.status(500).json({ success: false, message: "Failed to update profile", error: error.message });
  }
};

/* ─── GET PATIENT PROFILE ─────────────────────────────────────────── */
exports.getPatientProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password -refreshToken");
    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    res.status(200).json({ success: true, user });
  } catch (error) {
    console.error("Get Patient Profile Error:", error);
    res.status(500).json({ success: false, message: "Failed to fetch profile", error: error.message });
  }
};

/* ─── UPDATE PATIENT PROFILE ──────────────────────────────────────── */
exports.updatePatientProfile = async (req, res) => {
  try {
    const sharedFields = ["name", "phone", "gender", "age", "address"];
    const patientFields = ["dob", "bloodGroup", "insurance", "emergencyContact"];

    const updateData = {};

    sharedFields.forEach((field) => {
      if (req.body[field] !== undefined) updateData[field] = req.body[field];
    });

    patientFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        updateData[`patientProfile.${field}`] = req.body[field];
      }
    });

    // patientId is read-only — never allow update
    delete updateData["patientProfile.patientId"];

    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      { $set: updateData },
      { new: true, runValidators: true }
    ).select("-password -refreshToken");

    res.status(200).json({
      success: true,
      message: "Patient profile updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    console.error("Update Patient Profile Error:", error);
    res.status(500).json({ success: false, message: "Failed to update profile", error: error.message });
  }
};

/* ─── UPDATE PROFILE (Pharmacist / Nurse / Receptionist) ─────────── */
exports.updateProfile = async (req, res) => {
  try {
    const allowedFields = [
      "name", "phone", "gender", "age", "address",
      "department", "specialization", "experience",
      "licenseNumber", "shiftTiming", "bio",
    ];

    const updateData = {};
    allowedFields.forEach((field) => {
      const value = req.body[field];
      // Skip undefined AND empty strings
      if (value !== undefined && value !== "") {
        updateData[field] = value;
      }
    });

    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      { $set: updateData },
      { returnDocument: "after", runValidators: true }
    ).select("-password -refreshToken");

    if (!updatedUser) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    console.error("Update Profile Error:", error);
    res.status(500).json({ success: false, message: "Failed to update profile", error: error.message });
  }
};

exports.updateLabProfile = async (req, res) => {
  try {
    const allowedFields = [
      "name",
      "phone",
      "gender",
      "age",
      "address",
      "department",
      "specialization",
      "qualifications",
      "experience",
      "shiftTiming",
      "bio",
      "licenseNumber",
      "labName",
      "languages"
    ];

    const updateData = {};

    allowedFields.forEach((field) => {
      const value = req.body[field];

      if (value !== undefined) {
        updateData[field] = value;
      }
    });

    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      { $set: updateData },
      {
        new: true,
        runValidators: true
      }
    ).select("-password -refreshToken");

    if (!updatedUser) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    res.status(200).json({
      success: true,
      message: "Lab profile updated successfully",
      user: updatedUser
    });
  } catch (error) {
    console.error("Update Lab Profile Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to update profile",
      error: error.message
    });
  }
};