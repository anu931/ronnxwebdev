require("dotenv").config();
console.log("GMAIL_USER:", process.env.GMAIL_USER);
console.log("GMAIL_PASS:", process.env.GMAIL_PASS ? "Loaded" : "Missing");

const express = require("express");
const nodemailer = require("nodemailer");
const cors = require("cors");
const rateLimit = require("express-rate-limit");

const app = express();



// ✅ Debug route to confirm env vars
app.get("/debug-env", (req, res) => {
  res.json({
    gmail_user: process.env.GMAIL_USER ? "Loaded ✅" : "Missing ❌",
    gmail_pass: process.env.GMAIL_PASS ? "Loaded ✅" : "Missing ❌"
  });
});

// ✅ CORS Config
app.use(cors({
  origin: [
    "http://127.0.0.1:3000",
    "http://localhost:3000",
    "https://tragon.in",
    "http://tragon.in",
    "https://www.tragon.in",
    "https://tragontechnologies.onrender.com"
  ],
  methods: ["GET", "POST", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "Accept"],
}));

// ✅ Parse JSON
app.use(express.json());

// ✅ Serve static files from deploy directory
app.use(express.static("deploy"));

// ✅ Rate limiter BEFORE route
const limiter = rateLimit({ windowMs: 60 * 1000, max: 5 });
app.use("/api/consultation", limiter);

// ✅ Nodemailer Transport
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASS
  }
});

// Verify transporter
transporter.verify((error) => {
  if (error) {
    console.error("Error with email transporter:", error);
  } else {
    console.log("Email transporter is ready");
  }
});

// ✅ API Route
app.post("/api/consultation", async (req, res) => {
  const { fullname, email, mobile, project } = req.body;

  if (!fullname || !email || !mobile || !project) {
    return res.status(400).json({ success: false, error: "Missing fields" });
  }

  try {
    await transporter.sendMail({
      from: `"Tragon Technologies" <${process.env.GMAIL_USER}>`,
      to: process.env.GMAIL_USER,
      subject: "New Consultation Request",
      text: `Name: ${fullname}
Email: ${email}
Mobile: ${mobile}
Project: ${project}`
    });

    res.json({ success: true });
  } catch (err) {
    console.error("Error sending email:", err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// ✅ Root test route
app.get("/", (req, res) => {
  res.send("Backend is running! 🚀");
});

// ✅ Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
