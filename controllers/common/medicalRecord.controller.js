const MedicalRecord = require("../../models/medicalRecord.model");

/* CREATE MEDICAL RECORD */
exports.createMedicalRecord = async (req, res) => {
  try {
    const {
      patient,
      doctor,
      bloodGroup,
      allergies,
      chronicDiseases,
      height,
      weight,
      bloodPressure,
      sugarLevel,
      medicalHistory,
      emergencyContactName,
      emergencyContactNumber,
    } = req.body;

    if (!patient) {
      return res.status(400).json({
        success: false,
        message: "Patient is required",
      });
    }

    const medicalRecord = await MedicalRecord.create({
      patient,
      doctor,
      bloodGroup,
      allergies,
      chronicDiseases,
      height,
      weight,
      bloodPressure,
      sugarLevel,
      medicalHistory,
      emergencyContactName,
      emergencyContactNumber,
    });

    res.status(201).json({
      success: true,
      message: "Medical record created successfully",
      medicalRecord,
    });
  } catch (error) {
    console.log("Create Medical Record Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to create medical record",
      error: error.message,
    });
  }
};

/* GET ALL MEDICAL RECORDS */
exports.getAllMedicalRecords = async (req, res) => {
  try {
    let medicalRecords;

    if (req.user.role === "ADMIN") {
      medicalRecords = await MedicalRecord.find()
        .populate("patient", "name email phone gender age")
        .populate("doctor", "name email specialization department")
        .sort({ createdAt: -1 });
    } 
    
    else if (req.user.role === "DOCTOR") {
      medicalRecords = await MedicalRecord.find({
        doctor: req.user._id,
      })
        .populate("patient", "name email phone gender age")
        .populate("doctor", "name email specialization department")
        .sort({ createdAt: -1 });
    } 
    
    else if (req.user.role === "PATIENT") {
      medicalRecords = await MedicalRecord.find({
        patient: req.user._id,
      })
        .populate("patient", "name email phone gender age")
        .populate("doctor", "name email specialization department")
        .sort({ createdAt: -1 });
    }

    else if (req.user.role === "RECEPTIONIST") {
      medicalRecords = await MedicalRecord.find()
        .populate("patient", "name email phone gender age")
        .populate("doctor", "name email specialization department")
        .select("-medicalHistory -allergies -chronicDiseases")
        .sort({ createdAt: -1 });
    }

    res.status(200).json({
      success: true,
      count: medicalRecords.length,
      medicalRecords,
    });
  } catch (error) {
    console.log("Get Medical Records Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch medical records",
      error: error.message,
    });
  }
};

/* GET SINGLE MEDICAL RECORD */
exports.getSingleMedicalRecord = async (req, res) => {
  try {
    const medicalRecord = await MedicalRecord.findById(req.params.id)
      .populate("patient", "name email phone gender age")
      .populate("doctor", "name email specialization department");

    if (!medicalRecord) {
      return res.status(404).json({
        success: false,
        message: "Medical record not found",
      });
    }

    res.status(200).json({
      success: true,
      medicalRecord,
    });
  } catch (error) {
    console.log("Get Single Medical Record Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch medical record",
      error: error.message,
    });
  }
};

/* UPDATE MEDICAL RECORD */
exports.updateMedicalRecord = async (req, res) => {
  try {
    const medicalRecord = await MedicalRecord.findById(req.params.id);

    if (!medicalRecord) {
      return res.status(404).json({
        success: false,
        message: "Medical record not found",
      });
    }

    // ✅ CLEAN + SAFE UPDATE
    const updateData = {
      ...req.body,
      allergies: Array.isArray(req.body.allergies) ? req.body.allergies : [],
      chronicDiseases: Array.isArray(req.body.chronicDiseases) ? req.body.chronicDiseases : [],
    };

    const updatedMedicalRecord = await MedicalRecord.findByIdAndUpdate(
      req.params.id,
      updateData,
      {
        new: true,
        runValidators: true,
      }
    );

    res.status(200).json({
      success: true,
      message: "Medical record updated successfully",
      medicalRecord: updatedMedicalRecord,
    });
  } catch (error) {
    console.log("Update Medical Record Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to update medical record",
      error: error.message,
    });
  }
};

/* DELETE MEDICAL RECORD */
exports.deleteMedicalRecord = async (req, res) => {
  try {
    const medicalRecord = await MedicalRecord.findById(req.params.id);

    if (!medicalRecord) {
      return res.status(404).json({
        success: false,
        message: "Medical record not found",
      });
    }

    await MedicalRecord.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: "Medical record deleted successfully",
    });
  } catch (error) {
    console.log("Delete Medical Record Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to delete medical record",
      error: error.message,
    });
  }
};