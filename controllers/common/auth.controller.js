const User = require("../../models/user.model");
const crypto = require("crypto");
const sendEmail = require("../../utils/sendEmail");

/* ─── REGISTER USER ───────────────────────────────────────────────── */
exports.registerUser = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      role,
      phone,
      gender,
      age,
      department,
      specialization,
      address,
    } = req.body;

    // Basic validation
    if (!name || !email || !password || !role) {
      return res.status(400).json({
        success: false,
        message: "Name, email, password and role are required",
      });
    }

    const allowedRoles = [
      "ADMIN",
      "DOCTOR",
      "PATIENT",
      "RECEPTIONIST",
      "LAB_TECHNICIAN",
      "PHARMACIST",
      "NURSE",
    ];

    if (!allowedRoles.includes(role)) {
      return res.status(400).json({
        success: false,
        message: "Invalid role selected",
      });
    }

    // Role-based validation
    if (role === "DOCTOR" && !specialization) {
      return res.status(400).json({
        success: false,
        message: "Doctor specialization is required",
      });
    }

    if (
      ["DOCTOR", "RECEPTIONIST", "LAB_TECHNICIAN", "PHARMACIST"].includes(role) &&
      !department
    ) {
      return res.status(400).json({
        success: false,
        message: "Department is required for selected role",
      });
    }

    if (role === "PATIENT" && (!gender || !age || !address)) {
      return res.status(400).json({
        success: false,
        message: "Gender, age and address are required for patient",
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User already exists",
      });
    }

    // Create user
    const user = new User({
      name,
      email: email.toLowerCase(),
      password,
      role,
      phone,
      gender,
      age,
      department,
      specialization,
      address,
    });

    await user.save();

    // Generate token
    let token = "";
    try {
      token = user.generateAccessToken();
    } catch (error) {
      console.error("Token generation failed:", error.message);
    }

    return res.status(201).json({
      success: true,
      message: "User registered successfully",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        gender: user.gender,
        age: user.age,
        department: user.department,
        specialization: user.specialization,
        address: user.address,
        ...(user.role === "PATIENT" && {
          patientId: user.patientProfile?.patientId,
        }),
      },
    });
  } catch (error) {
    console.error("Registration Error:", error);
    return res.status(500).json({
      success: false,
      message: "Registration failed",
      error: error.message,
    });
  }
};

/* ─── LOGIN USER ──────────────────────────────────────────────────── */
exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    const user = await User.findOne({ email: email.toLowerCase() });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    if (!user.isActive) {
      return res.status(403).json({
        success: false,
        message: "Your account has been deactivated",
      });
    }

    const isMatch = await user.isPasswordCorrect(password);

    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    const token = user.generateAccessToken();

    return res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        gender: user.gender,
        age: user.age,
        department: user.department,
        specialization: user.specialization,
        address: user.address,
        ...(user.role === "PATIENT" && {
          patientId: user.patientProfile?.patientId,
        }),
      },
    });
  } catch (error) {
    console.error("Login Error:", error);
    return res.status(500).json({
      success: false,
      message: "Login failed",
      error: error.message,
    });
  }
};

/* ─── FORGOT PASSWORD ─────────────────────────────────────────────── */

exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ success: false, message: "Email is required" });
    }

    const user = await User.findOne({ email: email.toLowerCase() });

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    const resetToken = user.generatePasswordResetToken();
    await user.save({ validateBeforeSave: false });

    const resetURL = `http://localhost:5173/reset-password/${resetToken}`;

    await sendEmail({
      to: user.email,
      subject: "VitalEHR - Password Reset Request",
      html: `
        <div style="font-family: sans-serif; max-width: 480px; margin: auto;">
          <h2 style="color: #0891b2;">Reset Your Password</h2>
          <p>Hi ${user.name},</p>
          <p>Click the button below to reset your password. This link expires in <strong>10 minutes</strong>.</p>
          <a href="${resetURL}"
            style="display:inline-block;margin-top:16px;padding:12px 24px;
                   background:#0891b2;color:white;border-radius:8px;
                   text-decoration:none;font-weight:bold;">
            Reset Password
          </a>
          <p style="margin-top:24px;color:#64748b;font-size:13px;">
            If you didn't request this, you can safely ignore this email.
          </p>
        </div>
      `,
    });

    return res.status(200).json({
      success: true,
      message: "Reset link sent to your email",
    });

  } catch (error) {
    console.error("Forgot Password Error:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

/* ─── RESET PASSWORD ──────────────────────────────────────────────── */
exports.resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    if (!password) {
      return res.status(400).json({
        success: false,
        message: "New password is required",
      });
    }

    // Hash the incoming token to compare against stored hash
    const hashedToken = crypto
      .createHash("sha256")
      .update(token)
      .digest("hex");

    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpire: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired token",
      });
    }

    // ✅ pre-save hook will hash the new password automatically
    user.password = password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();

    return res.status(200).json({
      success: true,
      message: "Password reset successful",
    });
  } catch (error) {
    console.error("Reset Password Error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};