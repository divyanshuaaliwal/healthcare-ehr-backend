const mongoose = require("mongoose");

const labReportSchema = new mongoose.Schema(
  {
    patient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    doctor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    labTechnician: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    reportName: {
      type: String,
      required: true,
      trim: true,
    },

    reportType: {
      type: String,
      enum: [
        "BLOOD_TEST",
        "XRAY",
        "MRI",
        "CT_SCAN",
        "URINE_TEST",
        "COVID_TEST",
        "OTHER",
      ],
      default: "OTHER",
    },

    reportDate: {
      type: Date,
      required: true,
    },

    result: {
      type: String,
      trim: true,
    },

    remarks: {
      type: String,
      trim: true,
    },

    status: {
      type: String,
      enum: ["PENDING", "COMPLETED"],
      default: "PENDING",
    },

    fileUrl: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("LabReport", labReportSchema);