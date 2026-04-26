const Prescription = require("../../models/prescription.model");

/* CREATE PRESCRIPTION */
exports.createPrescription = async (req, res) => {
  try {
    const {
      patient,
      doctor,
      appointment,
      medicines,
      diagnosis,
      instructions,
    } = req.body;

    if (!patient || !doctor || !medicines || medicines.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Patient, doctor and medicines are required",
      });
    }

    const prescription = await Prescription.create({
      patient,
      doctor,
      appointment,
      medicines,
      diagnosis,
      instructions,
    });

    res.status(201).json({
      success: true,
      message: "Prescription created successfully",
      prescription,
    });
  } catch (error) {
    console.log("Create Prescription Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to create prescription",
      error: error.message,
    });
  }
};

/* GET ALL PRESCRIPTIONS */
exports.getAllPrescriptions = async (req, res) => {
  try {
    let prescriptions;

    if (
      req.user.role === "ADMIN" ||
      req.user.role === "PHARMACIST"
    ) {
      prescriptions = await Prescription.find()
        .populate("patient", "name email phone")
        .populate("doctor", "name email specialization department")
        .populate("appointment")
        .sort({ createdAt: -1 });
    } 
    
    else if (req.user.role === "DOCTOR") {
      prescriptions = await Prescription.find({
        doctor: req.user._id,
      })
        .populate("patient", "name email phone")
        .populate("doctor", "name email specialization department")
        .populate("appointment")
        .sort({ createdAt: -1 });
    } 
    
    else if (req.user.role === "PATIENT") {
      prescriptions = await Prescription.find({
        patient: req.user._id,
      })
        .populate("patient", "name email phone")
        .populate("doctor", "name email specialization department")
        .populate("appointment")
        .sort({ createdAt: -1 });
    }

    res.status(200).json({
      success: true,
      count: prescriptions.length,
      prescriptions,
    });
  } catch (error) {
    console.log("Get Prescriptions Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch prescriptions",
      error: error.message,
    });
  }
};

/* GET SINGLE PRESCRIPTION */
exports.getSinglePrescription = async (req, res) => {
  try {
    const prescription = await Prescription.findById(req.params.id)
      .populate("patient", "name email phone")
      .populate("doctor", "name email specialization department")
      .populate("appointment");

    if (!prescription) {
      return res.status(404).json({
        success: false,
        message: "Prescription not found",
      });
    }

    res.status(200).json({
      success: true,
      prescription,
    });
  } catch (error) {
    console.log("Get Single Prescription Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch prescription",
      error: error.message,
    });
  }
};

/* UPDATE PRESCRIPTION */
exports.updatePrescription = async (req, res) => {
  try {
    const prescription = await Prescription.findById(req.params.id);

    if (!prescription) {
      return res.status(404).json({
        success: false,
        message: "Prescription not found",
      });
    }

    const updatedPrescription = await Prescription.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    res.status(200).json({
      success: true,
      message: "Prescription updated successfully",
      prescription: updatedPrescription,
    });
  } catch (error) {
    console.log("Update Prescription Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to update prescription",
      error: error.message,
    });
  }
};

/* DELETE PRESCRIPTION */
exports.deletePrescription = async (req, res) => {
  try {
    const prescription = await Prescription.findById(req.params.id);

    if (!prescription) {
      return res.status(404).json({
        success: false,
        message: "Prescription not found",
      });
    }

    await Prescription.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: "Prescription deleted successfully",
    });
  } catch (error) {
    console.log("Delete Prescription Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to delete prescription",
      error: error.message,
    });
  }
};

exports.dispensePrescription = async (req, res) => {
  try {
    const prescription = await Prescription.findById(req.params.id);

    if (!prescription) {
      return res.status(404).json({
        success: false,
        message: "Prescription not found",
      });
    }

    prescription.status = "DISPENSED";
    prescription.dispensedAt = new Date();
    prescription.dispensedBy = req.user._id;

    await prescription.save();

    res.status(200).json({
      success: true,
      message: "Prescription dispensed successfully",
      prescription,
    });
  } catch (error) {
    console.log("Dispense Prescription Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to dispense prescription",
      error: error.message,
    });
  }
};