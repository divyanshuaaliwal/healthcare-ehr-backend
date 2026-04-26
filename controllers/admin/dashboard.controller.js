const User = require("../../models/user.model");
const Appointment = require("../../models/appointment.model");
const Prescription = require("../../models/prescription.model");
const LabReport = require("../../models/labReport.model");
const MedicalRecord = require("../../models/medicalRecord.model");

exports.getDashboardStats = async (req, res) => {
  try {
    const [
      totalUsers,
      totalDoctors,
      totalPatients,
      totalReceptionists,
      totalLabTechnicians,
      totalPharmacists,
      totalNurses,
      totalAppointments,
      totalPrescriptions,
      totalLabReports,
      totalMedicalRecords,
    ] = await Promise.all([
      User.countDocuments(),
      User.countDocuments({ role: "DOCTOR" }),
      User.countDocuments({ role: "PATIENT" }),
      User.countDocuments({ role: "RECEPTIONIST" }),
      User.countDocuments({ role: "LAB_TECHNICIAN" }),
      User.countDocuments({ role: "PHARMACIST" }),
      Appointment.countDocuments(),
      Prescription.countDocuments(),
      LabReport.countDocuments(),
      MedicalRecord.countDocuments(),
    ]);

    res.status(200).json({
      success: true,
      stats: {
        totalUsers,
        totalDoctors,
        totalPatients,
        totalReceptionists,
        totalLabTechnicians,
        totalPharmacists,
        totalAppointments,
        totalPrescriptions,
        totalLabReports,
        totalMedicalRecords,
      },
    });
  } catch (error) {
    console.log("Dashboard Stats Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch dashboard stats",
      error: error.message,
    });
  }
};