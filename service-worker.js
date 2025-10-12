self.addEventListener("install", () => {
  console.log("✅ Service Worker Installed");
  self.skipWaiting();
});

self.addEventListener("activate", () => {
  console.log("✅ Service Worker Activated");
});

self.addEventListener("push", (event) => {
  const data = event.data?.json() || {};
  const title = data.title || "🚨 FLOWS Alert";
  const options = {
    body: data.body || "Water leak detected!",
    icon: "https://cdn-icons-png.flaticon.com/512/2913/2913551.png",
    badge: "https://cdn-icons-png.flaticon.com/512/2913/2913551.png",
  };
  event.waitUntil(self.registration.showNotification(title, options));
});
