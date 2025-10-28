// src/utils/speedTest.ts

import { API_BASE_URL } from "../config";

// high-res timestamp
const now = () => performance.now();

// 1. Ping test
export async function measurePing(sampleCount = 5): Promise<number> {
  const samples: number[] = [];

  for (let i = 0; i < sampleCount; i++) {
    const start = now();
    await fetch(`${API_BASE_URL}/api/ping?x=` + Math.random(), {
      cache: "no-store",
    });
    const end = now();
    samples.push(end - start);
  }

  // sort fastest -> slowest
  samples.sort((a, b) => a - b);

  // drop worst one to remove a random spike
  const trimmed = samples.slice(0, sampleCount - 1);

  const avg =
    trimmed.reduce((sum, v) => sum + v, 0) /
    (trimmed.length === 0 ? 1 : trimmed.length);

  return avg; // ms
}

// 2. Download Mbps
export async function measureDownloadMbps(
  sizeInBytes = 5_000_000 // ~5 MB
): Promise<number> {
  const url = `${API_BASE_URL}/api/download?size=${sizeInBytes}&_=${Math.random()}`;

  const start = now();
  const res = await fetch(url, {
    cache: "no-store",
  });
  const buf = await res.arrayBuffer();
  const end = now();

  const durationSeconds = (end - start) / 1000;
  const bits = buf.byteLength * 8;
  const mbps = bits / durationSeconds / 1_000_000;
  return mbps;
}

// 3. Upload Mbps
export async function measureUploadMbps(
  sizeInBytes = 1_000_000 // ~1 MB
): Promise<number> {
  // create random data safely in 64KB chunks
  const data = new Uint8Array(sizeInBytes);
  const MAX = 65536;
  for (let offset = 0; offset < sizeInBytes; offset += MAX) {
    const end = Math.min(offset + MAX, sizeInBytes);
    crypto.getRandomValues(data.subarray(offset, end));
  }

  const start = now();
  await fetch(`${API_BASE_URL}/api/upload`, {
    method: "POST",
    headers: {
      "Content-Type": "application/octet-stream",
    },
    body: data,
  });
  const end = now();

  const durationSeconds = (end - start) / 1000;
  const bits = sizeInBytes * 8;
  const mbps = bits / durationSeconds / 1_000_000;
  return mbps;
}

export type SpeedTestResult = {
  pingMs: number;
  downloadMbps: number;
  uploadMbps: number;
};
