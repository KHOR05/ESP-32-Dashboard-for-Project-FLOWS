const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const nodemailer = require("nodemailer");

const app = express();
app.use(bodyParser.json());
app.use(cors());

// ✅ Ensure environment variables exist
if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
  console.error("❌ Missing EMAIL_USER or EMAIL_PASS environment variables!");
  process.exit(1);
}

// ✅ Configure Nodemailer transporter for Gmail SMTP
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL_USER, // taken from Render environment variable
    pass: process.env.EMAIL_PASS, // taken from Render environment variable
  },
});

// ✅ Optional: verify connection on startup
transporter.verify((error, success) => {
  if (error) {
    console.error("❌ SMTP Connection Error:", error);
  } else {
    console.log("✅ SMTP Server is ready to send emails.");
  }
});

// ✅ API endpoint to send email notifications
app.post("/send-email", async (req, res) => {
  const { subject, message, to } = req.body;

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: to || process.env.EMAIL_USER,
    subject: subject || "ESP32 Notification",
    text: message || "Alert from ESP32 device!",
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("✅ Email sent:", info.messageId);
    res.status(200).json({ success: true, message: "Email sent successfully!" });
  } catch (error) {
    console.error("❌ Email send error:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
