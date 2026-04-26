const Appointment = require("../../models/appointment.model");
const Prescription = require("../../models/prescription.model");
const MedicalRecord = require("../../models/medicalRecord.model");
const LabReport = require("../../models/labReport.model");
const User = require("../../models/user.model");

/* GET MY PATIENTS */
exports.getMyPatients = async (req, res) => {
  try {
    const doctorId = req.user._id;

    const appointments = await Appointment.find({
      doctor: doctorId,
    }).populate("patient", "-password -refreshToken");

    const patientMap = new Map();

    appointments.forEach((appointment) => {
      if (appointment.patient) {
        patientMap.set(appointment.patient._id.toString(), appointment.patient);
      }
    });

    const patients = Array.from(patientMap.values());

    res.status(200).json({
      success: true,
      count: patients.length,
      patients,
    });
  } catch (error) {
    console.log("Get My Patients Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch patients",
      error: error.message,
    });
  }
};

/* GET PATIENT DETAILS */
exports.getPatientDetails = async (req, res) => {
  try {
    const patientId = req.params.id;

    const patient = await User.findById(patientId).select(
      "-password -refreshToken"
    );

    if (!patient) {
      return res.status(404).json({
        success: false,
        message: "Patient not found",
      });
    }

    const appointments = await Appointment.find({ patient: patientId })
      .populate("doctor", "name specialization department")
      .sort({ createdAt: -1 });

    const prescriptions = await Prescription.find({ patient: patientId })
      .populate("doctor", "name specialization department")
      .sort({ createdAt: -1 });

    const medicalRecords = await MedicalRecord.find({ patient: patientId })
      .populate("doctor", "name specialization department")
      .sort({ createdAt: -1 });

    const labReports = await LabReport.find({ patient: patientId })
      .populate("doctor", "name specialization department")
      .sort({ createdAt: -1 });

    const vitals = await Vital.find({ patient: patientId })
      .populate("doctor", "name specialization department")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      patient,
      appointments,
      prescriptions,
      medicalRecords,
      labReports,
      vitals,
    });
  } catch (error) {
    console.log("Get Patient Details Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch patient details",
      error: error.message,
    });
  }
};
