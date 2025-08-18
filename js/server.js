require("dotenv").config({ path: "c:/ronnix/ronnxwebdev/.env" });
console.log("GMAIL_USER:", process.env.GMAIL_USER);
console.log("GMAIL_PASS:", process.env.GMAIL_PASS ? "Loaded" : "Missing");

const express = require("express");
const nodemailer = require("nodemailer");
const cors = require("cors");

const app = express();
app.use(cors({
  origin: ["http://127.0.0.1:3000", "http://localhost:3000"], // Add your frontend origin here
}));
app.use(express.json());

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_USER, // From .env
    pass: process.env.GMAIL_PASS  // From .env (App Password recommended)
  }
});

// Verify transporter configuration
transporter.verify((error, success) => {
  if (error) {
    console.error("Error with email transporter:", error);
  } else {
    console.log("Email transporter is ready");
  }
});

app.post("/api/consultation", async (req, res) => {
  const { fullname, email, mobile, project } = req.body;

  if (!fullname || !email || !mobile || !project) {
    return res.json({ success: false, error: "Missing fields" });
  }

  try {
    await transporter.sendMail({
      from: `"Tragon Technologies" <${process.env.GMAIL_USER}>`, // Change this line
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
    res.json({ success: false, error: err.message });
  }
});

app.get("/", (req, res) => {
  res.send("Backend is running! 🚀");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
