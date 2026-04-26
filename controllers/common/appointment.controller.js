const Appointment = require("../../models/appointment.model");

/* CREATE APPOINTMENT */
exports.createAppointment = async (req, res) => {
  try {
    const { doctor, appointmentDate, appointmentTime, reason, notes } = req.body;

    // patient is always the logged-in user for self-booking
    // admin/receptionist can override by passing patient in body
    const patientId = req.body.patient || req.user._id;

    if (!patientId || !doctor || !appointmentDate || !appointmentTime) {
      return res.status(400).json({
        success: false,
        message: "Doctor, appointment date and time are required",
      });
    }

    const appointment = await Appointment.create({
      patient: patientId,
      doctor,
      bookedBy: req.user._id,
      appointmentDate,
      appointmentTime,
      reason,
      notes,
    });

    res.status(201).json({
      success: true,
      message: "Appointment created successfully",
      appointment,
    });
  } catch (error) {
    console.log("Create Appointment Error:", error);
    res.status(500).json({ success: false, message: "Failed to create appointment", error: error.message });
  }
};

/* GET ALL APPOINTMENTS */
exports.getAllAppointments = async (req, res) => {
  try {
    let appointments;

    // Admin and receptionist can see all appointments
    if (
      req.user.role === "ADMIN" ||
      req.user.role === "RECEPTIONIST"
    ) {
      appointments = await Appointment.find()
        .populate("patient", "name email phone")
        .populate("doctor", "name email specialization department")
        .populate("bookedBy", "name role")
        .sort({ createdAt: -1 });
    }

    // Doctor can see only own appointments
    else if (req.user.role === "DOCTOR") {
      appointments = await Appointment.find({
        doctor: req.user._id,
      })
        .populate("patient", "name email phone")
        .populate("doctor", "name email specialization department")
        .populate("bookedBy", "name role")
        .sort({ createdAt: -1 });
    }

    // Patient can see only own appointments
    else if (req.user.role === "PATIENT") {
      appointments = await Appointment.find({
        patient: req.user._id,
      })
        .populate("patient", "name email phone")
        .populate("doctor", "name email specialization department")
        .populate("bookedBy", "name role")
        .sort({ createdAt: -1 });
    }

    res.status(200).json({
      success: true,
      count: appointments.length,
      appointments,
    });
  } catch (error) {
    console.log("Get Appointments Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch appointments",
      error: error.message,
    });
  }
};

/* GET SINGLE APPOINTMENT */
exports.getSingleAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id)
      .populate("patient", "name email phone gender age")
      .populate("doctor", "name email specialization department")
      .populate("bookedBy", "name role");

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: "Appointment not found",
      });
    }

    res.status(200).json({
      success: true,
      appointment,
    });
  } catch (error) {
    console.log("Get Single Appointment Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch appointment",
      error: error.message,
    });
  }
};

/* UPDATE APPOINTMENT */
exports.updateAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id);

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: "Appointment not found",
      });
    }

    const updatedAppointment = await Appointment.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    res.status(200).json({
      success: true,
      message: "Appointment updated successfully",
      appointment: updatedAppointment,
    });
  } catch (error) {
    console.log("Update Appointment Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to update appointment",
      error: error.message,
    });
  }
};

/* DELETE APPOINTMENT */
exports.deleteAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id);

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: "Appointment not found",
      });
    }

    await Appointment.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: "Appointment deleted successfully",
    });
  } catch (error) {
    console.log("Delete Appointment Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to delete appointment",
      error: error.message,
    });
  }
};

//update status and checkedIn
exports.updateAppointmentStatus = async (req, res) => {
  try {
    const { status, checkedIn } = req.body;

    const allowedStatuses = [
      "PENDING",
      "CONFIRMED",
      "COMPLETED",
      "CANCELLED",
      "NO_SHOW",
    ];

    if (status && !allowedStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid appointment status",
      });
    }

    const appointment = await Appointment.findById(req.params.id);

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: "Appointment not found",
      });
    }

    if (status) {
      appointment.status = status;
    }

    if (checkedIn !== undefined) {
      appointment.checkedIn = checkedIn;
    }

    await appointment.save();

    res.status(200).json({
      success: true,
      message: "Appointment status updated successfully",
      appointment,
    });
  } catch (error) {
    console.log("Update Appointment Status Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to update appointment status",
      error: error.message,
    });
  }
};