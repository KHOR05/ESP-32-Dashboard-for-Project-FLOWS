// Import required packages
const express = require("express");
const bodyParser = require("body-parser");
const nodemailer = require("nodemailer");
const cors = require("cors");

const app = express();
app.use(bodyParser.json());
app.use(cors());

// 📧 Configure Gmail transporter
let transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "khorshanshan@gmail.com",     
    pass: "bnjk gpmc zmlx ggjv"         
  }
});

// 📩 API route to send email
app.post("/send-email", (req, res) => {
  const { subject, message } = req.body;

  let mailOptions = {
    from: '"ESP32 Leak Sensor" <khorshanshan@gmail.com>',
    to: "khorshanshan@gmail.com",         //recipient email
    subject: subject || "ESP32 Leak Alert",
    text: message || "Leak detected from ESP32!"
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error("❌ Error:", error);
      return res.status(500).json({ success: false, error });
    }
    console.log("✅ Email sent:", info.response);
    res.json({ success: true, info });
  });
});

// 🚀 Use Render's port or fallback to 3000 for local
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});

