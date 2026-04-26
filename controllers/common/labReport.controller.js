const LabReport = require("../../models/labReport.model");

/* CREATE LAB REPORT */
exports.createLabReport = async (req, res) => {
  try {
    const {
      patient,
      doctor,
      labTechnician,
      reportName,
      reportType,
      reportDate,
      result,
      remarks,
      status,
      fileUrl,
    } = req.body;

    if (!patient || !reportName || !reportDate) {
      return res.status(400).json({
        success: false,
        message: "Patient, report name and report date are required",
      });
    }

    const labReport = await LabReport.create({
      patient,
      doctor,
      labTechnician,
      reportName,
      reportType,
      reportDate,
      result,
      remarks,
      status,
      fileUrl,
    });

    res.status(201).json({
      success: true,
      message: "Lab report created successfully",
      labReport,
    });
  } catch (error) {
    console.log("Create Lab Report Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to create lab report",
      error: error.message,
    });
  }
};

/* GET ALL LAB REPORTS */
exports.getAllLabReports = async (req, res) => {
  try {
    let labReports;

    if (
      req.user.role === "ADMIN" ||
      req.user.role === "LAB_TECHNICIAN"
    ) {
      labReports = await LabReport.find()
        .populate("patient", "name email phone")
        .populate("doctor", "name email specialization department")
        .populate("labTechnician", "name email department")
        .sort({ createdAt: -1 });
    } 
    
    else if (req.user.role === "DOCTOR") {
      labReports = await LabReport.find({
        doctor: req.user._id,
      })
        .populate("patient", "name email phone")
        .populate("doctor", "name email specialization department")
        .populate("labTechnician", "name email department")
        .sort({ createdAt: -1 });
    } 
    
    else if (req.user.role === "PATIENT") {
      labReports = await LabReport.find({
        patient: req.user._id,
      })
        .populate("patient", "name email phone")
        .populate("doctor", "name email specialization department")
        .populate("labTechnician", "name email department")
        .sort({ createdAt: -1 });
    }

    res.status(200).json({
      success: true,
      count: labReports.length,
      labReports,
    });
  } catch (error) {
    console.log("Get Lab Reports Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch lab reports",
      error: error.message,
    });
  }
};

/* GET SINGLE LAB REPORT */
exports.getSingleLabReport = async (req, res) => {
  try {
    const labReport = await LabReport.findById(req.params.id)
      .populate("patient", "name email phone")
      .populate("doctor", "name email specialization department")
      .populate("labTechnician", "name email department");

    if (!labReport) {
      return res.status(404).json({
        success: false,
        message: "Lab report not found",
      });
    }

    res.status(200).json({
      success: true,
      labReport,
    });
  } catch (error) {
    console.log("Get Single Lab Report Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch lab report",
      error: error.message,
    });
  }
};

/* UPDATE LAB REPORT */
exports.updateLabReport = async (req, res) => {
  try {
    const labReport = await LabReport.findById(req.params.id);

    if (!labReport) {
      return res.status(404).json({
        success: false,
        message: "Lab report not found",
      });
    }

    const updatedLabReport = await LabReport.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    res.status(200).json({
      success: true,
      message: "Lab report updated successfully",
      labReport: updatedLabReport,
    });
  } catch (error) {
    console.log("Update Lab Report Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to update lab report",
      error: error.message,
    });
  }
};

/* DELETE LAB REPORT */
exports.deleteLabReport = async (req, res) => {
  try {
    const labReport = await LabReport.findById(req.params.id);

    if (!labReport) {
      return res.status(404).json({
        success: false,
        message: "Lab report not found",
      });
    }

    await LabReport.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: "Lab report deleted successfully",
    });
  } catch (error) {
    console.log("Delete Lab Report Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to delete lab report",
      error: error.message,
    });
  }
};

// controllers/common/labReport.controller.js — add this
exports.getLabResults = async (req, res) => {
  try {
    const results = await LabReport.find({ status: "COMPLETED" })
      .populate("patient", "name email phone")
      .populate("doctor", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: results.length,
      results,
    });
  } catch (error) {
    console.log("Get Lab Results Error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch lab results",
      error: error.message,
    });
  }
};

const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Multer config for PDF uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = "uploads/lab-results";
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    cb(null, `lab-result-${Date.now()}${path.extname(file.originalname)}`);
  },
});

exports.upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype === "application/pdf") cb(null, true);
    else cb(new Error("Only PDF files are allowed"));
  },
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
});

exports.submitLabResult = async (req, res) => {
  try {
    const { result, remarks, status } = req.body;
    const fileUrl = req.file ? `/uploads/lab-results/${req.file.filename}` : null;

    const labReport = await LabReport.findById(req.params.id);
    if (!labReport) return res.status(404).json({ success: false, message: "Lab report not found" });

    labReport.result   = result   || labReport.result;
    labReport.remarks  = remarks  || labReport.remarks;
    labReport.status   = "COMPLETED";
    labReport.fileUrl  = fileUrl  || labReport.fileUrl;
    labReport.labTechnician = req.user._id;

    await labReport.save();

    res.status(200).json({ success: true, message: "Lab result submitted successfully", labReport });
  } catch (error) {
    console.log("Submit Lab Result Error:", error);
    res.status(500).json({ success: false, message: "Failed to submit result", error: error.message });
  }
};