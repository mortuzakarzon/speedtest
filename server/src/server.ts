import express from "express";
import cors from "cors";

const app = express();
const PORT = 4000;

app.use(cors());
app.use(express.raw({ type: "application/octet-stream", limit: "50mb" }));

// health / ping endpoint
app.get("/api/ping", (_req, res) => {
  // tiny fast response, timestamp prevents some proxies caching
  res.json({ ok: true, t: Date.now() });
});

// download endpoint:
// returns N random bytes so frontend can measure download throughput.
app.get("/api/download", (req, res) => {
  let size = parseInt(req.query.size as string, 10);
  if (isNaN(size) || size <= 0 || size > 50_000_000) {
    size = 5_000_000; // default ~5MB, also limit abuse
  }

  const buffer = Buffer.allocUnsafe(size);
  // fill with random-ish data
  for (let i = 0; i < size; i++) {
    buffer[i] = Math.floor(Math.random() * 256);
  }

  // We explicitly disable caching
  res.set({
    "Content-Type": "application/octet-stream",
    "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
    Pragma: "no-cache",
    Expires: "0",
    "Content-Length": buffer.length.toString(),
  });

  res.send(buffer);
});

// upload endpoint:
// frontend POSTs random bytes here. We just discard it.
app.post("/api/upload", (req, res) => {
  // We could measure size server-side if you want analytics
  const sizeBytes = req.body.length || 0;

  // Also turn off caching here (not really needed for POST but consistent)
  res.set({
    "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
    Pragma: "no-cache",
    Expires: "0",
  });

  res.json({ ok: true, sizeBytes });
});

app.listen(PORT, () => {
  console.log(`SpeedTest server running on http://localhost:${PORT}`);
});
