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
  port: 587,           // TLS port
  secure: false,       // use true for port 465
  auth: {
    user: "khorshanshan@gmail.com", // your Gmail address
    pass: "mook wxdg aibs pczr", // your Gmail App Password (NOT normal password)
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

  // Default email info (if fields missing)
  const mailOptions = {
    from: "khorshanshan@gmail.com",                  // sender (must match Gmail account)
    to: to || "khorshanshan@gmail.com",              // recipient
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

// ✅ Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
