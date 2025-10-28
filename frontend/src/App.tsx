import SpeedTestPanel from "./components/SpeedTestPanel";

export default function App() {
  return (
    <div className="min-h-screen bg-bg text-white flex flex-col items-center px-4 py-10">
      <header className="w-full max-w-4xl flex flex-col items-center text-center mb-10">
        <div className="text-xs text-slate-500 font-mono tracking-wider mb-2">
          ONLINE SPEED ANALYZER
        </div>
        <h1 className="text-3xl md:text-4xl font-semibold text-white">
          How fast is your internet?
        </h1>
        <p className="text-slate-400 text-sm md:text-base mt-3 max-w-xl">
          Run a quick test to measure download, upload, and ping. No install. Just browser.
        </p>
      </header>

      <main className="w-full max-w-4xl">
        <SpeedTestPanel />
      </main>

      <footer className="mt-16 text-[10px] text-slate-600 text-center">
        <p>© {new Date().getFullYear()} SpeedTest Inc. All rights reserved.</p>
      </footer>
    </div>
  );
}
