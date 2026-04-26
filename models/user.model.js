const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const Schema = mongoose.Schema;

const doctorProfileSchema = new Schema(
  {
    experience: { type: Number, default: null },
    qualifications: { type: String, trim: true, default: "" },
    bio: { type: String, trim: true, default: "" },
    clinicAddress: { type: String, trim: true, default: "" },
    consultationFee: { type: Number, default: null },
    languages: { type: String, trim: true, default: "" },
  },
  { _id: false }
);

const patientProfileSchema = new Schema(
  {
    patientId: { type: String, unique: true, sparse: true },
    dob: { type: String, default: "" },
    bloodGroup: {
      type: String,
      enum: ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-", ""],
      default: "",
    },
    insurance: { type: String, trim: true, default: "" },
    emergencyContact: { type: String, trim: true, default: "" },
  },
  { _id: false }
);

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      trim: true,
    },
    gender: {
      type: String,
      enum: ["Male", "Female", "Other", ""],
      default: "",
    },
    age: {
      type: Number,
    },
    role: {
      type: String,
      enum: [
        "ADMIN",
        "DOCTOR",
        "PATIENT",
        "RECEPTIONIST",
        "LAB_TECHNICIAN",
        "PHARMACIST",
        "NURSE",
      ],
      default: "PATIENT",
    },
    department: {
      type: String,
      trim: true,
    },
    specialization: {
      type: String,
      trim: true,
    },
    address: {
      type: String,
      trim: true,
    },
    licenseNumber: {
      type: String,
      trim: true,
    },
    shiftTiming: {
      type: String,
      trim: true,
    },
    bio: {
      type: String,
      trim: true,
    },
    qualifications: {
      type: String,
      trim: true,
    },
    labName: {
      type: String,
      trim: true,
    },
    languages: {
      type: String,
      trim: true,
    },

    // Role-specific embedded sub-documents
    doctorProfile: { type: doctorProfileSchema, default: () => ({}) },
    patientProfile: { type: patientProfileSchema, default: () => ({}) },

    refreshToken: {
      type: String,
      default: "",
    },
    resetPasswordToken: String,
    resetPasswordExpire: Date,
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

userSchema.pre("save", async function () {
  // Hash password only if modified
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 10);
  }

  if (
    this.isNew &&
    this.role === "PATIENT" &&
    (!this.patientProfile || !this.patientProfile.patientId)
  ) {
    const randomPart = Math.random().toString(36).substring(2, 8).toUpperCase();
    this.patientProfile = this.patientProfile || {};
    this.patientProfile.patientId = `PAT-${randomPart}`;
  }
});


userSchema.methods.isPasswordCorrect = async function (password) {
  return await bcrypt.compare(password, this.password);
};

userSchema.methods.generateAccessToken = function () {
  return jwt.sign(
    {
      userId: this._id,
      role: this.role,
      email: this.email,
    },
    process.env.ACCESS_TOKEN_SECRETKEY,
    {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
    }
  );
};

userSchema.methods.generateRefreshToken = function () {
  return jwt.sign(
    {
      userId: this._id,
    },
    process.env.REFRESH_TOKEN_SECRETKEY,
    {
      expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
    }
  );
};

userSchema.methods.generatePasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString("hex");

  this.resetPasswordToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  this.resetPasswordExpire = Date.now() + 10 * 60 * 1000; // 10 minutes

  return resetToken;
};

const User = mongoose.model("User", userSchema);

module.exports = User;