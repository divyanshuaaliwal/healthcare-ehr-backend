const mongoose = require("mongoose");

const prescriptionSchema = new mongoose.Schema(
  {
    patient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    doctor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    appointment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Appointment",
    },

    medicines: [
      {
        medicineName: {
          type: String,
          required: true,
        },
        dosage: {
          type: String,
          required: true,
        },
        frequency: {
          type: String,
          required: true,
        },
        duration: {
          type: String,
          required: true,
        },
        quantity: {
          type: String,
        },
        instructions: {
          type: String,
        },
      },
    ],

    diagnosis: {
      type: String,
      trim: true,
    },

    instructions: {
      type: String,
      trim: true,
    },

    status: {
      type: String,
      enum: ["PENDING", "DISPENSED"],
      default: "PENDING",
    },

    dispensedAt: {
      type: Date,
    },

    dispensedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Prescription", prescriptionSchema);