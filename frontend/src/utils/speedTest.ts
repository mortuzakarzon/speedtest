// src/utils/speedTest.ts

// High-res timestamp helper
const now = () => performance.now();

// 1. Ping test
// We hit /api/ping several times, measure round-trip latency,
// sort the samples, drop the slowest one, and average the rest.
export async function measurePing(sampleCount = 5): Promise<number> {
  const samples: number[] = [];

  for (let i = 0; i < sampleCount; i++) {
    const start = now();
    await fetch("/api/ping?x=" + Math.random(), { cache: "no-store" });
    const end = now();
    samples.push(end - start);
  }

  // sort ascending (fastest first)
  samples.sort((a, b) => a - b);

  // drop the worst (last element)
  const trimmed = samples.slice(0, sampleCount - 1);

  const avg =
    trimmed.reduce((sum, v) => sum + v, 0) /
    (trimmed.length === 0 ? 1 : trimmed.length);

  return avg; // in ms
}

// 2. Download speed test (Mbps)
// We GET a known-size random blob from /api/download
// Mbps = (bits transferred) / seconds / 1_000_000
export async function measureDownloadMbps(
  sizeInBytes = 5_000_000 // ~5 MB
): Promise<number> {
  const url = `/api/download?size=${sizeInBytes}&_=${Math.random()}`;

  const start = now();
  const res = await fetch(url, {
    cache: "no-store",
  });

  // read whole body
  const buf = await res.arrayBuffer();
  const end = now();

  const durationSeconds = (end - start) / 1000;
  const bits = buf.byteLength * 8;
  const mbps = bits / durationSeconds / 1_000_000;
  return mbps;
}

// 3. Upload speed test (Mbps)
// We generate random bytes in the browser, POST them to /api/upload,
// and time how long it took.
// NOTE: crypto.getRandomValues() can't fill >65536 bytes at once.
// We'll fill in chunks so we can test ~1MB safely.
export async function measureUploadMbps(
  sizeInBytes = 1_000_000 // ~1 MB
): Promise<number> {
  const chunk = new Uint8Array(sizeInBytes);

  const MAX = 65536; // browser limit per getRandomValues() call
  for (let offset = 0; offset < sizeInBytes; offset += MAX) {
    const end = Math.min(offset + MAX, sizeInBytes);
    crypto.getRandomValues(chunk.subarray(offset, end));
  }

  const start = now();
  await fetch("/api/upload", {
    method: "POST",
    headers: {
      "Content-Type": "application/octet-stream",
    },
    body: chunk,
  });
  const end = now();

  const durationSeconds = (end - start) / 1000;
  const bits = sizeInBytes * 8;
  const mbps = bits / durationSeconds / 1_000_000;
  return mbps;
}

// 4. Result type so UI can keep all 3 numbers together
export type SpeedTestResult = {
  pingMs: number;
  downloadMbps: number;
  uploadMbps: number;
};
