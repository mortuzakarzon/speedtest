import { useState } from "react";
import SpeedGauge from "./SpeedGauge";
import {
  measurePing,
  measureDownloadMbps,
  measureUploadMbps,
  SpeedTestResult,
} from "../utils/speedTest";

type Status = "idle" | "running" | "done" | "error";

export default function SpeedTestPanel() {
  const [status, setStatus] = useState<Status>("idle");
  const [result, setResult] = useState<SpeedTestResult | null>(null);
  const [log, setLog] = useState<string[]>([]);

  async function runTest() {
    setStatus("running");
    setResult(null);
    setLog(["Starting test..."]);

    function pushLog(msg: string) {
      setLog((prev) => [...prev, msg]);
    }

    try {
      pushLog("Measuring ping...");
      const pingMs = await measurePing();
      pushLog(`Ping: ${pingMs.toFixed(1)} ms`);

      pushLog("Checking download speed...");
      const downloadMbps = await measureDownloadMbps();
      pushLog(`Download: ${downloadMbps.toFixed(1)} Mbps`);

      pushLog("Checking upload speed...");
      const uploadMbps = await measureUploadMbps();
      pushLog(`Upload: ${uploadMbps.toFixed(1)} Mbps`);

      const finalResult = { pingMs, downloadMbps, uploadMbps };
      setResult(finalResult);
      setStatus("done");
      pushLog("✅ Test complete.");
    } catch (err) {
      console.error(err);
      setStatus("error");
      pushLog("❌ Something went wrong. Is the backend running?");
    }
  }

  const isRunning = status === "running";

  return (
    <div className="glass-card p-6 md:p-8 rounded-2xl border border-white/5 shadow-2xl bg-card/60">
      {/* Action + status row */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="text-lg font-semibold text-white">
            Internet Speed Test
          </div>
          <div className="text-xs text-slate-500 font-mono">
            Status:{" "}
            <span
              className={
                status === "running"
                  ? "text-yellow-400"
                  : status === "done"
                  ? "text-green-400"
                  : status === "error"
                  ? "text-red-400"
                  : "text-slate-400"
              }
            >
              {status}
            </span>
          </div>
        </div>

        <button
          onClick={runTest}
          disabled={isRunning}
          className={
            "px-5 py-3 rounded-xl text-sm font-semibold " +
            "bg-accent text-black hover:brightness-110 active:scale-95 " +
            "disabled:opacity-40 disabled:cursor-not-allowed disabled:active:scale-100"
          }
        >
          {isRunning ? "Testing..." : "Start Test"}
        </button>
      </div>

      {/* Results */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
        <SpeedGauge
          label="Download"
          unit="Mbps"
          value={result ? result.downloadMbps : 0}
          max={50}
        />
        <SpeedGauge
          label="Upload"
          unit="Mbps"
          value={result ? result.uploadMbps : 0}
          max={50}
        />
        <SpeedGauge
          label="Ping"
          unit="ms"
          value={result ? result.pingMs : 0}
          max={50}
        />
      </div>

      {/* Console log */}
      <div className="mt-8 bg-black/30 rounded-xl p-4 font-mono text-[11px] leading-relaxed text-slate-300 max-h-40 overflow-y-auto border border-white/5">
        {log.map((line, i) => (
          <div key={i} className="text-xs">
            {line}
          </div>
        ))}
        {log.length === 0 && (
          <div className="text-slate-600 italic">
            Click "Start Test" to begin...
          </div>
        )}
      </div>

      {/* Helper note */}
      <div className="text-[10px] text-slate-600 mt-4 text-center md:text-left">
        Uses browser Fetch API. Speeds may vary slightly vs native apps.
      </div>
    </div>
  );
}
