require("dotenv").config({ path: "./.env" });
const express = require('express');
const app = express();
const path = require("path");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const cors = require("cors");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// Connect MongoDB
const { dbConnect } = require("./databaseConfig/connectDatabase");
dbConnect()
  .then(() => console.log("Database connected successfully"))
  .catch((err) => console.error("Database connection failed:", err));

const port = process.env.PORT || 8080;


// Middleware
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);

    if (
      origin.includes("vercel.app") ||
      origin.includes("localhost")
    ) {
      return callback(null, origin);
    }

    return callback(new Error("Not allowed by CORS"));
  },
  credentials: true
}));

//routes

//common
const authRoutes = require("./routes/common/auth.routes");
const appointmentRoutes = require("./routes/common/appointment.routes");
const prescriptionRoutes = require("./routes/common/Prescription.routes");
const medicalRecordRoutes = require("./routes/common/medicalRecord.routes");
const labReportRoutes = require("./routes/common/labReport.routes");
const profileRoutes = require("./routes/common/profile.routes");
const uploadRoutes = require("./routes/common/upload.routes");

//admin
const dashboardRoutes = require("./routes/admin/dashboard.routes");
const userRoutes = require("./routes/admin/user.routes");

//pharmacist
const dispensedRoutes = require("./routes/pharmacist/dispenced.routes");

//lab
const labTemplateRoutes = require("./routes/lab/labTemplate.routes");

//doctor
const patientRoutes = require("./routes/doctor/patient.routes");


//use routes
app.use("/api", authRoutes);
app.use("/appointment", appointmentRoutes);
app.use("/prescription", prescriptionRoutes);
app.use("/medical-record", medicalRecordRoutes);
app.use("/lab-report", labReportRoutes);
app.use("/admin/dashboard", dashboardRoutes);
app.use("/profile", profileRoutes);
app.use("/dispensed-prescriptions", dispensedRoutes);
app.use("/lab-templates", labTemplateRoutes);
app.use("/admin/users", userRoutes);
app.use("/upload", uploadRoutes);
app.use("/doctor", patientRoutes);

app.use("/uploads", express.static(path.join(__dirname, "uploads")));


app.get('/', (req, res) => {
  res.send('HealthCare EHR Backend is running!');
});


app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
