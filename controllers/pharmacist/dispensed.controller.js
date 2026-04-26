// controllers/pharmacist/dispensed.controller.js

const Prescription = require("../../models/prescription.model");

exports.getDispensedPrescriptions = async (req, res) => {
  try {
    const prescriptions = await Prescription.find({ status: "DISPENSED" })
      .populate("patient", "name email phone")
      .populate("doctor", "name specialization department")
      .populate("dispensedBy", "name role")
      .sort({ dispensedAt: -1 });

    // Map medicines so med.name works (frontend reads med.name, schema stores medicineName)
    const dispensed = prescriptions.map((p) => {
      const obj = p.toObject();
      return {
        ...obj,
        patientName: obj.patient?.name || "Unknown Patient",
        doctorName: obj.doctor?.name || "Unknown Doctor",
        notes: obj.instructions, // PharmacyDispensed renders item.notes
        medicines: (obj.medicines || []).map((m) => ({
          ...m,
          name: m.medicineName, // alias — frontend badge loop reads med.name
        })),
      };
    });

    res.status(200).json({
      success: true,
      count: dispensed.length,
      dispensed, // ← key must be "dispensed" so res.data?.dispensed resolves first
    });
  } catch (error) {
    console.log("Get Dispensed Prescriptions Error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch dispensed prescriptions",
      error: error.message,
    });
  }
};