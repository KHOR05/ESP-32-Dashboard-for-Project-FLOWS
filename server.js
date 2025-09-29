// server.js
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const sgMail = require("@sendgrid/mail");

const app = express();
app.use(bodyParser.json());
app.use(cors());

// ⚡ Load SendGrid API Key from environment variable
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

app.post("/send-email", async (req, res) => {
  const { subject, message } = req.body;

  const mailOptions = {
    from: "khorshanshan@gmail.com",  // ✅ must be the verified sender
    to: "khorshanshan@gmail.com",        // 👈 change to the recipient
    subject: subject || "ESP32 Leak Alert",
    text: message || "Leak detected from ESP32!",
  };

  try {
    await sgMail.send(mailOptions);
    console.log("✅ Email sent!");
    res.json({ success: true });
  } catch (error) {
    console.error("❌ SendGrid Error:", error.response?.body || error.message);
    res.status(500).json({ success: false, error: error.message });
  }
});

app.listen(3000, () => {
  console.log("✅ Server running at http://localhost:3000");
});
