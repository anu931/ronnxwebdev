require("dotenv").config();
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
const corsOptions = {
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
};

app.use(cors(corsOptions));
app.options("*", cors(corsOptions)); // 👈 Handle preflight requests

// ✅ Parse JSON
app.use(express.json());

// ✅ Serve static files
app.use(express.static("deploy"));

// ✅ Rate limiter
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

transporter.verify((error) => {
  if (error) {
    console.error("Error with email transporter:", error);
  } else {
    console.log("Email transporter is ready ✅");
  }
});

// ✅ Consultation API
app.post("/api/consultation", async (req, res) => {
  const { fullname, email, mobile, project } = req.body;

  if (!fullname || !email || !mobile || !project) {
    return res.status(400).json({ success: false, error: "Missing fields" });
  }

  try {
    await transporter.sendMail({
      from: process.env.GMAIL_USER,
      to: process.env.GMAIL_USER, // Change if you want to receive elsewhere
      subject: "New Consultation Request",
      text: `Name: ${fullname}\nEmail: ${email}\nMobile: ${mobile}\nProject: ${project}`,
      html: `<b>Name:</b> ${fullname}<br><b>Email:</b> ${email}<br><b>Mobile:</b> ${mobile}<br><b>Project:</b> ${project}`
    });
    res.json({ success: true });
  } catch (err) {
    console.error("Email send error:", err);
    res.status(500).json({ success: false, error: "Failed to send email" });
  }
});

// ✅ Root route
app.get("/", (req, res) => {
  res.send("Backend is running! 🚀");
});

// ✅ Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
