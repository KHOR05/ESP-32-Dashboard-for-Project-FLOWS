const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const sgMail = require("@sendgrid/mail");

const app = express();
app.use(bodyParser.json());
app.use(cors());

// ✅ Check and load SendGrid API key directly from Render env vars
if (!process.env.SENDGRID_API_KEY) {
  console.error("❌ Missing SENDGRID_API_KEY environment variable!");
  process.exit(1);
}

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

app.post("/send-email", async (req, res) => {
  const { subject, message } = req.body;

  const mailOptions = {
    from: "khorshanshan@gmail.com",  // ✅ must be verified in SendGrid
    to: "khorshanshan@gmail.com",    // recipient
    subject: subject || "ESP32 Leak Alert",
    text: message || "Leak detected from ESP32!",
  };

  try {
    await sgMail.send(mailOptions);
    console.log("✅ Email sent successfully!");
    res.json({ success: true });
  } catch (error) {
    console.error("❌ SendGrid Error:", error.response?.body || error.message);
    res.status(500).json({ success: false, error: error.message });
  }
});

app.listen(3000, () => {
  console.log("✅ Server running at http://localhost:3000");
});
