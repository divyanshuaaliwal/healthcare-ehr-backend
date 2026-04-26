const mongoose = require("mongoose");

const medicalRecordSchema = new mongoose.Schema(
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

    bloodGroup: {
      type: String,
      trim: true,
    },

    allergies: [
      {
        type: String,
      },
    ],

    chronicDiseases: [
      {
        type: String,
      },
    ],

    height: {
      type: Number,
    },

    weight: {
      type: Number,
    },

    bloodPressure: {
      type: String,
    },

    sugarLevel: {
      type: String,
    },

    medicalHistory: {
      type: String,
      trim: true,
    },

    emergencyContactName: {
      type: String,
      trim: true,
    },

    emergencyContactNumber: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("MedicalRecord", medicalRecordSchema);