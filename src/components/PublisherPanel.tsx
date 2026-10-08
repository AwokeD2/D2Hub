import { useState, useEffect, useRef } from "react";
import { invoke } from "@tauri-apps/api/core";
import { listen } from "@tauri-apps/api/event";

interface VersionStatus {
  current: string;
  next: {
    patch: string;
    minor: string;
    major: string;
  };
  repo: string;
}

export default function PublisherPanel() {
  const [currentVer, setCurrentVer] = useState("1.0.4");
  const [nextVers, setNextVers] = useState({ patch: "1.0.5", minor: "1.1.0", major: "2.0.0" });
  const [repo, setRepo] = useState("AwokeD2/D2Hub");
  const [bumpType, setBumpType] = useState<"patch" | "minor" | "major" | "custom">("patch");
  const [customVer, setCustomVer] = useState("");
  const [notes, setNotes] = useState("");
  const [logs, setLogs] = useState<string[]>([
    "[SYSTEM] D2 Hub Git-Push & Release Suite initialized.",
    "[SYSTEM] Select version bump and click 'Build & Publish' to compile and upload."
  ]);
  const [isBuilding, setIsBuilding] = useState(false);
  const [pipelineStep, setPipelineStep] = useState(0);
  const [progressPercent, setProgressPercent] = useState(0);
  const [progressStatus, setProgressStatus] = useState("Ready to publish");
  const [successUrl, setSuccessUrl] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const terminalRef = useRef<HTMLDivElement>(null);
  const progressTimerRef = useRef<number | null>(null);

  const effectiveVersion = bumpType === "custom" 
    ? (customVer.trim().replace(/^v/, "") || nextVers.patch)
    : nextVers[bumpType];

  const fetchStatus = async () => {
    try {
      const data = await invoke<VersionStatus>("get_status");
      setCurrentVer(data.current);
      setNextVers(data.next);
      setRepo(data.repo);
    } catch (e) {
      console.error("Failed to fetch version status:", e);
    }
  };

  useEffect(() => {
    fetchStatus();

    const unlistenLog = listen<string>("build-log", (event) => {
      const line = event.payload;
      setLogs((prev) => [...prev, line]);

      if (line.includes("[SUCCESS]")) {
        setPipelineStep(4);
        setProgressPercent(100);
        setProgressStatus("Release Published Successfully!");
        setSuccessUrl(`https://github.com/${repo}/releases/tag/v${effectiveVersion}`);
        setIsBuilding(false);
        fetchStatus();
      } else if (line.includes("[ERROR]")) {
        setIsBuilding(false);
        setProgressStatus("Build encountered an error.");
      } else if (line.includes("Updating project version")) {
        setPipelineStep(1);
        setProgressPercent((p) => Math.max(p, 15));
        setProgressStatus("1/4 Updating Version Manifests...");
      } else if (line.includes("Running beforeBuildCommand") || line.includes("vite v")) {
        setPipelineStep(1);
        setProgressPercent((p) => Math.max(p, 25));
        setProgressStatus("1/4 Compiling Web App Bundle...");
      } else if (line.includes("Compiling") || line.includes("Building")) {
        setPipelineStep(2);
        setProgressPercent((p) => Math.min(75, Math.max(p, 40) + 2));
        setProgressStatus("2/4 Compiling Native Rust & Tauri Binaries...");
      } else if (line.includes("Patching") || line.includes("bundle") || line.includes("nsis") || line.includes("manifest")) {
        setPipelineStep(3);
        setProgressPercent((p) => Math.max(p, 80));
        setProgressStatus("3/4 Packaging NSIS Installer & Generating Signatures...");
      } else if (line.includes("Uploading") || line.includes("Publishing")) {
        setPipelineStep(4);
        setProgressPercent((p) => Math.max(p, 92));
        setProgressStatus("4/4 Uploading Release Artifacts to GitHub...");
      }
    });

    const unlistenFinish = listen("build-finished", () => {
      setIsBuilding(false);
    });

    return () => {
      unlistenLog.then((f) => f());
      unlistenFinish.then((f) => f());
    };
  }, [effectiveVersion, repo]);

  // Smooth progress creep while building
  useEffect(() => {
    if (isBuilding) {
      progressTimerRef.current = window.setInterval(() => {
        setProgressPercent((prev) => {
          if (prev < 70) return prev + 1;
          if (prev < 90) return prev + 0.5;
          return prev;
        });
      }, 1200);
    } else {
      if (progressTimerRef.current) clearInterval(progressTimerRef.current);
    }
    return () => {
      if (progressTimerRef.current) clearInterval(progressTimerRef.current);
    };
  }, [isBuilding]);

  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [logs]);

  const addTag = (tag: string) => {
    setNotes((prev) => {
      const clean = prev.trim();
      return clean ? `${clean}\n- ${tag}` : `- ${tag}`;
    });
  };

  const handlePublish = async () => {
    if (isBuilding) return;
    setIsBuilding(true);
    setSuccessUrl(null);
    setPipelineStep(1);
    setProgressPercent(10);
    setProgressStatus("Initializing Release Pipeline...");
    setLogs((prev) => [...prev, `\n[INFO] Starting production release pipeline for v${effectiveVersion}...`]);

    try {
      await invoke("start_publish", {
        version: effectiveVersion,
        notes: notes.trim()
      });
    } catch (e) {
      setLogs((prev) => [...prev, `[ERROR] Failed to start build: ${e}`]);
      setIsBuilding(false);
    }
  };

  const handleAbort = async () => {
    try {
      await invoke("cancel_publish");
    } catch {}
    setIsBuilding(false);
    setProgressStatus("Build Aborted");
  };

  const handleCopyLogs = () => {
    navigator.clipboard.writeText(logs.join("\n"));
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const handleOpenRelease = () => {
    if (successUrl) {
      invoke("open_url", { url: successUrl });
    }
  };

  return (
    <div className="h-screen w-screen flex flex-col bg-[#090a0f] text-neutral-200 select-none overflow-hidden font-sans antialiased">
      {/* Top Header */}
      <header className="flex items-center justify-between border-b border-purple-900/30 bg-[#10121a]/90 px-6 py-3.5 backdrop-blur-md shrink-0">
        <div className="flex items-center gap-3.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500 to-indigo-700 shadow-lg shadow-purple-950/60 ring-1 ring-purple-400/40">
            <span className="text-lg font-black text-white tracking-tighter">D2</span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-sm font-bold tracking-wide text-white uppercase flex items-center gap-2">
                D2 Hub <span className="text-purple-400">//</span> Git-Push & Release Suite
              </h1>
              <span className="rounded-full bg-purple-950/80 border border-purple-500/40 px-2 py-0.5 text-[10px] font-mono font-bold text-purple-300 shadow-sm">
                PROD PUBLISHER
              </span>
            </div>
            <p className="text-[11px] text-neutral-400 flex items-center gap-1.5 mt-0.5">
              <span>Target Repo:</span>
              <span className="font-mono font-semibold text-neutral-200">{repo}</span>
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse ml-1" />
              <span className="text-[10px] text-emerald-400 font-semibold">Ready</span>
            </p>
          </div>
        </div>

        {/* Current Version Pill */}
        <div className="flex items-center gap-3">
          <div className="flex flex-col items-end">
            <span className="text-[10px] uppercase font-bold tracking-wider text-neutral-400">Current Version</span>
            <span className="font-mono text-sm font-black text-purple-300">v{currentVer}</span>
          </div>
          <button 
            onClick={fetchStatus} 
            title="Refresh Status" 
            className="rounded-lg border border-neutral-800 bg-[#151824] p-2 text-neutral-400 hover:border-purple-500/40 hover:text-purple-300 transition-all cursor-pointer"
          >
            🔄
          </button>
        </div>
      </header>

      {/* Main Grid */}
      <main className="flex-1 grid grid-cols-12 gap-5 p-5 min-h-0 overflow-hidden">
        {/* Left Column: Version & Changelog (6 Cols) */}
        <div className="col-span-6 flex flex-col gap-4 min-h-0 overflow-y-auto pr-1">
          {/* Card 1: Version Selector */}
          <div className="rounded-xl border border-purple-900/30 bg-[#151824]/80 backdrop-blur-md p-4 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-xs font-bold uppercase tracking-wider text-neutral-300 flex items-center gap-2">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-purple-900/60 text-purple-400 text-[10px] font-bold">1</span>
                Select Version Bump
              </h2>
              <span className="text-[11px] font-mono text-purple-300 font-semibold">Target: v{effectiveVersion}</span>
            </div>

            <div className="grid grid-cols-3 gap-2.5">
              {/* Patch */}
              <div 
                onClick={() => setBumpType("patch")}
                className={`cursor-pointer rounded-lg p-3 transition-all flex flex-col justify-between border ${
                  bumpType === "patch"
                    ? "bg-purple-950/40 border-purple-500 shadow-md shadow-purple-950/50"
                    : "bg-[#10121a]/80 border-neutral-800 hover:border-purple-500/50"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className={`text-xs font-bold ${bumpType === "patch" ? "text-purple-300" : "text-neutral-300"}`}>Patch</span>
                  <span className={`h-2 w-2 rounded-full ${bumpType === "patch" ? "bg-purple-400" : "bg-neutral-600"}`} />
                </div>
                <div className="mt-2">
                  <div className="text-sm font-mono font-bold text-white">{nextVers.patch}</div>
                  <div className="text-[10px] text-neutral-400 mt-0.5 leading-tight">Bug fixes & tweaks</div>
                </div>
              </div>

              {/* Minor */}
              <div 
                onClick={() => setBumpType("minor")}
                className={`cursor-pointer rounded-lg p-3 transition-all flex flex-col justify-between border ${
                  bumpType === "minor"
                    ? "bg-purple-950/40 border-purple-500 shadow-md shadow-purple-950/50"
                    : "bg-[#10121a]/80 border-neutral-800 hover:border-purple-500/50"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className={`text-xs font-bold ${bumpType === "minor" ? "text-purple-300" : "text-neutral-300"}`}>Minor</span>
                  <span className={`h-2 w-2 rounded-full ${bumpType === "minor" ? "bg-purple-400" : "bg-neutral-600"}`} />
                </div>
                <div className="mt-2">
                  <div className="text-sm font-mono font-bold text-white">{nextVers.minor}</div>
                  <div className="text-[10px] text-neutral-400 mt-0.5 leading-tight">Features & updates</div>
                </div>
              </div>

              {/* Major */}
              <div 
                onClick={() => setBumpType("major")}
                className={`cursor-pointer rounded-lg p-3 transition-all flex flex-col justify-between border ${
                  bumpType === "major"
                    ? "bg-purple-950/40 border-purple-500 shadow-md shadow-purple-950/50"
                    : "bg-[#10121a]/80 border-neutral-800 hover:border-purple-500/50"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className={`text-xs font-bold ${bumpType === "major" ? "text-purple-300" : "text-neutral-300"}`}>Major</span>
                  <span className={`h-2 w-2 rounded-full ${bumpType === "major" ? "bg-purple-400" : "bg-neutral-600"}`} />
                </div>
                <div className="mt-2">
                  <div className="text-sm font-mono font-bold text-white">{nextVers.major}</div>
                  <div className="text-[10px] text-neutral-400 mt-0.5 leading-tight">Major overhaul</div>
                </div>
              </div>
            </div>

            {/* Custom Version Row */}
            <div className="mt-3 flex items-center gap-2 pt-2 border-t border-purple-900/20">
              <input 
                type="checkbox" 
                id="customCheck"
                checked={bumpType === "custom"}
                onChange={(e) => setBumpType(e.target.checked ? "custom" : "patch")}
                className="rounded border-neutral-700 bg-[#151824] text-purple-500 focus:ring-0 cursor-pointer"
              />
              <label htmlFor="customCheck" className="text-xs text-neutral-300 cursor-pointer font-medium">Custom Version:</label>
              <input 
                type="text" 
                disabled={bumpType !== "custom"}
                value={customVer}
                onChange={(e) => setCustomVer(e.target.value)}
                placeholder="e.g. 1.0.5" 
                className="flex-1 rounded-md border border-neutral-700 bg-[#10121a] px-2.5 py-1 text-xs font-mono text-neutral-200 placeholder-neutral-500 focus:border-purple-500 focus:outline-none disabled:opacity-40 disabled:cursor-not-allowed"
              />
            </div>
          </div>

          {/* Card 2: Release Changelog Composer */}
          <div className="rounded-xl border border-purple-900/30 bg-[#151824]/80 backdrop-blur-md p-4 flex-1 flex flex-col min-h-0 shadow-sm">
            <div className="flex items-center justify-between mb-2.5">
              <h2 className="text-xs font-bold uppercase tracking-wider text-neutral-300 flex items-center gap-2">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-purple-900/60 text-purple-400 text-[10px] font-bold">2</span>
                Release Changelog / Notes
              </h2>
              <span className="text-[10px] text-neutral-500">Markdown Supported</span>
            </div>

            {/* Quick Tag Chips */}
            <div className="flex flex-wrap items-center gap-1.5 mb-2">
              <button 
                type="button" 
                onClick={() => addTag("✨ Feature: ")}
                className="rounded bg-[#1c2030] px-2 py-0.5 text-[10px] font-medium text-purple-300 hover:bg-purple-900/50 hover:text-white transition-colors border border-purple-900/40 cursor-pointer"
              >
                + ✨ Feature
              </button>
              <button 
                type="button" 
                onClick={() => addTag("🐛 Fix: ")}
                className="rounded bg-[#1c2030] px-2 py-0.5 text-[10px] font-medium text-emerald-300 hover:bg-emerald-950/60 hover:text-white transition-colors border border-emerald-900/40 cursor-pointer"
              >
                + 🐛 Bug Fix
              </button>
              <button 
                type="button" 
                onClick={() => addTag("⚡ Optimization: ")}
                className="rounded bg-[#1c2030] px-2 py-0.5 text-[10px] font-medium text-amber-300 hover:bg-amber-950/60 hover:text-white transition-colors border border-amber-900/40 cursor-pointer"
              >
                + ⚡ Speed
              </button>
              <button 
                type="button" 
                onClick={() => addTag("🎮 Skate Suite: ")}
                className="rounded bg-[#1c2030] px-2 py-0.5 text-[10px] font-medium text-cyan-300 hover:bg-cyan-950/60 hover:text-white transition-colors border border-cyan-900/40 cursor-pointer"
              >
                + 🎮 Skates
              </button>
              <button 
                type="button" 
                onClick={() => addTag("🌐 Cloud Sync: ")}
                className="rounded bg-[#1c2030] px-2 py-0.5 text-[10px] font-medium text-indigo-300 hover:bg-indigo-950/60 hover:text-white transition-colors border border-indigo-900/40 cursor-pointer"
              >
                + 🌐 Cloud
              </button>
            </div>

            <textarea 
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="- Describe key updates, skate macro improvements, or bug fixes in this release..."
              className="flex-1 w-full rounded-lg border border-neutral-700 bg-[#10121a]/90 p-3 text-xs text-neutral-100 placeholder-neutral-500 focus:border-purple-500 focus:ring-1 focus:ring-purple-500/50 focus:outline-none resize-none font-sans leading-relaxed min-h-[140px]"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3 pt-1">
            <button 
              disabled={isBuilding}
              onClick={handlePublish}
              className={`flex-1 flex items-center justify-center gap-2 rounded-xl px-5 py-3 text-sm font-bold text-white shadow-lg transition-all cursor-pointer border ${
                isBuilding
                  ? "bg-neutral-800 border-neutral-700 text-neutral-400 cursor-not-allowed"
                  : "bg-gradient-to-r from-purple-600 via-purple-700 to-indigo-600 shadow-purple-950/80 hover:from-purple-500 hover:to-indigo-500 active:scale-[0.99] border-purple-400/30"
              }`}
            >
              <span>{isBuilding ? "⏳" : "🚀"}</span>
              <span>{isBuilding ? `COMPILING & PUBLISHING v${effectiveVersion}...` : "BUILD & PUBLISH RELEASE TO GITHUB"}</span>
            </button>

            {isBuilding && (
              <button 
                onClick={handleAbort}
                className="rounded-xl border border-red-700/60 bg-red-950/80 px-4 py-3 text-sm font-bold text-red-300 hover:bg-red-900 hover:text-white transition-all cursor-pointer shadow-md flex items-center gap-1.5"
              >
                ⏹ Abort
              </button>
            )}
          </div>
        </div>

        {/* Right Column: Live Pipeline, Progress Bar & Terminal Log (6 Cols) */}
        <div className="col-span-6 flex flex-col gap-3 min-h-0 overflow-hidden">
          {/* Stepper Header */}
          <div className="rounded-xl border border-purple-900/30 bg-[#151824]/80 p-3.5 shrink-0 shadow-sm">
            <div className="flex items-center justify-between text-[11px] font-semibold text-neutral-400 mb-2">
              <span className="flex items-center gap-1.5 text-neutral-300">
                🛡️ PIPELINE ENGINE
              </span>
              <span className="text-purple-300 font-mono">{isBuilding ? `${Math.round(progressPercent)}%` : "Idle"}</span>
            </div>
            <div className="grid grid-cols-4 gap-2 text-center text-[10px] mb-3">
              <div className={`rounded py-1.5 px-1 border transition-colors ${
                pipelineStep > 1 ? "bg-emerald-950/60 border-emerald-700/60 text-emerald-300 font-bold" :
                pipelineStep === 1 ? "bg-purple-950/80 border-purple-500 text-purple-300 font-bold animate-pulse" :
                "bg-[#10121a] border-neutral-800 text-neutral-500"
              }`}>1. Sync Version</div>

              <div className={`rounded py-1.5 px-1 border transition-colors ${
                pipelineStep > 2 ? "bg-emerald-950/60 border-emerald-700/60 text-emerald-300 font-bold" :
                pipelineStep === 2 ? "bg-purple-950/80 border-purple-500 text-purple-300 font-bold animate-pulse" :
                "bg-[#10121a] border-neutral-800 text-neutral-500"
              }`}>2. Compile & Sign</div>

              <div className={`rounded py-1.5 px-1 border transition-colors ${
                pipelineStep > 3 ? "bg-emerald-950/60 border-emerald-700/60 text-emerald-300 font-bold" :
                pipelineStep === 3 ? "bg-purple-950/80 border-purple-500 text-purple-300 font-bold animate-pulse" :
                "bg-[#10121a] border-neutral-800 text-neutral-500"
              }`}>3. Manifest</div>

              <div className={`rounded py-1.5 px-1 border transition-colors ${
                pipelineStep >= 4 ? "bg-emerald-950/60 border-emerald-700/60 text-emerald-300 font-bold" :
                pipelineStep === 4 ? "bg-purple-950/80 border-purple-500 text-purple-300 font-bold animate-pulse" :
                "bg-[#10121a] border-neutral-800 text-neutral-500"
              }`}>4. GitHub Upload</div>
            </div>

            {/* Live Visual Progress Bar */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-[10px]">
                <span className="text-neutral-300 font-medium truncate flex items-center gap-1.5">
                  {isBuilding && <span className="inline-block h-2 w-2 rounded-full bg-purple-400 animate-ping" />}
                  {progressStatus}
                </span>
                <span className="font-mono text-purple-400 font-bold">{Math.round(progressPercent)}%</span>
              </div>
              <div className="h-2 w-full overflow-hidden rounded-full bg-[#0c0e14] border border-purple-950/80 p-0.5">
                <div 
                  className="h-full rounded-full bg-gradient-to-r from-purple-600 via-indigo-500 to-emerald-400 transition-all duration-300 shadow-sm shadow-purple-500/50"
                  style={{ width: `${Math.min(100, Math.max(0, progressPercent))}%` }}
                />
              </div>
            </div>
          </div>

          {/* Terminal Console Box */}
          <div className="rounded-xl border border-purple-900/40 bg-[#090a0f] p-3 flex-1 flex flex-col min-h-0 shadow-inner">
            <div className="flex items-center justify-between pb-2 mb-2 border-b border-neutral-800 shrink-0 text-xs">
              <div className="flex items-center gap-2">
                <span className="font-mono text-[11px] font-bold text-neutral-400">⌨️ BUILD CONSOLE LOG</span>
              </div>
              <div className="flex items-center gap-2">
                <button 
                  onClick={handleCopyLogs}
                  className="text-[10px] text-neutral-400 hover:text-purple-300 rounded px-2 py-0.5 bg-[#151824] border border-neutral-800 transition-colors cursor-pointer"
                >
                  {copied ? "✓ Copied!" : "📋 Copy"}
                </button>
                <button 
                  onClick={() => setLogs(["[SYSTEM] Console cleared."])}
                  className="text-[10px] text-neutral-400 hover:text-red-300 rounded px-2 py-0.5 bg-[#151824] border border-neutral-800 transition-colors cursor-pointer"
                >
                  🗑️ Clear
                </button>
              </div>
            </div>

            <div 
              ref={terminalRef}
              className="flex-1 overflow-y-auto font-mono text-[11px] leading-relaxed p-1 text-neutral-300 space-y-1 select-text"
            >
              {logs.map((line, idx) => {
                let colorClass = "text-neutral-300";
                if (line.includes("[SUCCESS]")) colorClass = "text-emerald-400 font-bold bg-emerald-950/30 px-1.5 py-0.5 rounded";
                else if (line.includes("[ERROR]")) colorClass = "text-red-400 font-bold bg-red-950/30 px-1.5 py-0.5 rounded";
                else if (line.includes("[WARN]")) colorClass = "text-amber-300";
                else if (line.includes("Compiling") || line.includes("Building")) colorClass = "text-purple-300";
                else if (line.includes("Uploading") || line.includes("manifest")) colorClass = "text-cyan-300";

                return (
                  <div key={idx} className={colorClass}>
                    {line}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Success Banner */}
          {successUrl && (
            <div className="rounded-xl border border-emerald-500/50 bg-emerald-950/40 p-3.5 text-emerald-200 flex items-center justify-between shadow-lg shadow-emerald-950/50 shrink-0 animate-fade-in">
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400 font-bold text-base">
                  ✓
                </div>
                <div>
                  <div className="text-xs font-bold text-white">Release Successfully Published!</div>
                  <div className="text-[11px] text-emerald-300 font-mono">v{effectiveVersion} published to GitHub</div>
                </div>
              </div>
              <button 
                onClick={handleOpenRelease}
                className="rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-bold text-white hover:bg-emerald-500 transition-colors shadow-sm cursor-pointer"
              >
                View on GitHub ↗
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
