// ---- Import required modules ----
const mqtt = require("mqtt");
const webpush = require("web-push");
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors"); // 👈 important for browser requests

// ---- Express app setup ----
const app = express();
app.use(bodyParser.json());
app.use(cors()); // 👈 allows your dashboard (e.g., GitHub Pages) to send POST requests

// ---- MQTT setup ----
const mqttClient = mqtt.connect("mqtt://broker.hivemq.com");

// ---- Store active browser subscriptions ----
let subscriptions = [];

// ---- Web Push setup ----
webpush.setVapidDetails(
  "mailto:youremail@example.com",
  "BH5lF245zY83SZEohDm7Fgu-Vd0vHaKhhEmhYMeYCzh3DKwkw95aRgKre_mGMdEeyUKzucGkeNolilV84Q91RrY",
  "1xzAm_ajw2gnaumen3w1BvNxP_z5RANzx_vWesuRpmU"
);

// ---- Endpoint for browsers to register their push subscription ----
app.post("/subscribe", (req, res) => {
  const subscription = req.body;

  // Avoid duplicate subscriptions
  const exists = subscriptions.find(
    (s) => JSON.stringify(s) === JSON.stringify(subscription)
  );
  if (!exists) {
    subscriptions.push(subscription);
    console.log("✅ New browser subscribed:", subscriptions.length);
  }

  res.status(201).json({ message: "Subscription received successfully" });
});

// ---- When connected to MQTT broker ----
mqttClient.on("connect", () => {
  console.log("✅ Connected to HiveMQ broker");
  mqttClient.subscribe("esp32/status", (err) => {
    if (!err) console.log("📡 Subscribed to topic: esp32/status");
  });
});

// ---- Handle MQTT messages ----
mqttClient.on("message", (topic, message) => {
  const value = message.toString();
  console.log(`📩 Message on ${topic}: ${value}`);

  if (topic === "esp32/status" && value === "LEAK") {
    console.log("🚨 Leak detected! Sending push notification...");

    const payload = JSON.stringify({
      title: "🚨 FLOWS Alert",
      body: "Water leak detected by ESP32 system!",
      icon: "https://cdn-icons-png.flaticon.com/512/2913/2913551.png",
      badge: "https://cdn-icons-png.flaticon.com/512/2913/2913551.png"
    });

    subscriptions.forEach((sub, index) => {
      webpush.sendNotification(sub, payload).catch((err) => {
        console.error(`❌ Push failed for sub ${index}:`, err.statusCode);
      });
    });
  }
});

// ---- Start server ----
const PORT = process.env.PORT || 4000;
app.listen(PORT, () =>
  console.log(`🌐 MQTT Web Push Bridge running on port ${PORT}`)
);
