# SpeedTest (React + Node)

This is a minimal internet speed test web app.

## Features
- Ping (latency)
- Download Mbps
- Upload Mbps
- Slick dark UI with Tailwind + Recharts radial gauges
- Local dev proxy so frontend can call backend at /api/*

## Folder structure
- frontend/  → React + Vite + Tailwind + Recharts
- server/    → Express server with /api endpoints

## Getting started (development)

### 1. Backend
```bash
cd server
npm install
npm run dev
# server on http://localhost:4000
```

### 2. Frontend
Open new terminal tab/window:
```bash
cd frontend
npm install
npm run dev
# frontend on http://localhost:5173
```

The Vite dev server is configured to proxy `/api/*` → `http://localhost:4000`
so the React app will talk to your local Node backend.

## Production deploy idea
- Build frontend (`npm run build` in ./frontend) and host static files (Vercel / Netlify / Nginx).
- Deploy Node server (./server) somewhere that can handle bandwidth.
- In production you'll want both under the same domain (e.g. `api.yourdomain.com` or reverse proxy `/api`).
