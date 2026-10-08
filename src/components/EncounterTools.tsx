import { useState, useEffect, useRef } from "react";

// Web Audio API beep generator (no external audio files needed)
function playTone(freq: number, durationMs: number, type: OscillatorType = "sine") {
  try {
    const ctx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, ctx.currentTime);
    gain.gain.setValueAtTime(0.15, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + durationMs / 1000);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + durationMs / 1000);
  } catch {
    // Audio context unavailable or user blocked autoplay
  }
}

// -------------------------------------------------------------
// VERITY ENCOUNTER CONSTANTS & ALGORITHMS
// -------------------------------------------------------------
export type Shape2D = "Circle" | "Triangle" | "Square";
export type Shape3D = "Sphere" | "Pyramid" | "Cube" | "Cone" | "Cylinder" | "Prism";

const SHAPE_COMPOSITION: Record<Shape3D, [Shape2D, Shape2D]> = {
  Sphere: ["Circle", "Circle"],
  Pyramid: ["Triangle", "Triangle"],
  Cube: ["Square", "Square"],
  Cone: ["Circle", "Triangle"],
  Cylinder: ["Circle", "Square"],
  Prism: ["Triangle", "Square"],
};

function getShape3DFrom2D(a: Shape2D, b: Shape2D): Shape3D | null {
  for (const [s3d, [part1, part2]] of Object.entries(SHAPE_COMPOSITION) as [Shape3D, [Shape2D, Shape2D]][]) {
    if ((part1 === a && part2 === b) || (part1 === b && part2 === a)) {
      return s3d;
    }
  }
  return null;
}

interface DissectionStep {
  fromStatue: "Left" | "Middle" | "Right";
  fromShape: Shape2D;
  toStatue: "Left" | "Middle" | "Right";
  toShape: Shape2D;
}

function solveDissection(
  start3D: { Left: Shape3D; Middle: Shape3D; Right: Shape3D },
  inside2D: { Left: Shape2D; Middle: Shape2D; Right: Shape2D }
): { steps: DissectionStep[]; target3D: { Left: Shape3D; Middle: Shape3D; Right: Shape3D } } {
  // Target outside 3D shapes: each statue must have the TWO OTHER 2D shapes that the inside player does NOT have
  const targets: { Left: Shape2D[]; Middle: Shape2D[]; Right: Shape2D[] } = {
    Left: (["Circle", "Triangle", "Square"] as Shape2D[]).filter(s => s !== inside2D.Left),
    Middle: (["Circle", "Triangle", "Square"] as Shape2D[]).filter(s => s !== inside2D.Middle),
    Right: (["Circle", "Triangle", "Square"] as Shape2D[]).filter(s => s !== inside2D.Right),
  };

  const target3D = {
    Left: getShape3DFrom2D(targets.Left[0], targets.Left[1])!,
    Middle: getShape3DFrom2D(targets.Middle[0], targets.Middle[1])!,
    Right: getShape3DFrom2D(targets.Right[0], targets.Right[1])!,
  };

  const current: { Left: Shape2D[]; Middle: Shape2D[]; Right: Shape2D[] } = {
    Left: [...SHAPE_COMPOSITION[start3D.Left]],
    Middle: [...SHAPE_COMPOSITION[start3D.Middle]],
    Right: [...SHAPE_COMPOSITION[start3D.Right]],
  };

  const steps: DissectionStep[] = [];
  const statues = ["Left", "Middle", "Right"] as const;

  for (let iteration = 0; iteration < 4; iteration++) {
    // Check if fully solved
    let solved = true;
    for (const stat of statues) {
      const cur = [...current[stat]].sort().join(",");
      const tgt = [...targets[stat]].sort().join(",");
      if (cur !== tgt) solved = false;
    }
    if (solved) break;

    // Find a statue that has an unwanted shape
    let moved = false;
    for (let i = 0; i < statues.length; i++) {
      const statA = statues[i];
      const unwantedIdxA = current[statA].findIndex(s => !targets[statA].includes(s) || current[statA].filter(x => x === s).length > 1);
      if (unwantedIdxA === -1) continue;

      const shapeA = current[statA][unwantedIdxA];

      // Find another statue that wants shapeA or has an unwanted shape that statue A wants
      for (let j = 0; j < statues.length; j++) {
        if (i === j) continue;
        const statB = statues[j];
        const unwantedIdxB = current[statB].findIndex(s => !targets[statB].includes(s) || (targets[statA].includes(s) && s !== shapeA));
        if (unwantedIdxB === -1) continue;

        const shapeB = current[statB][unwantedIdxB];

        // Swap shapeA and shapeB between statA and statB
        current[statA].splice(unwantedIdxA, 1, shapeB);
        current[statB].splice(unwantedIdxB, 1, shapeA);
        steps.push({
          fromStatue: statA,
          fromShape: shapeA,
          toStatue: statB,
          toShape: shapeB,
        });
        moved = true;
        break;
      }
      if (moved) break;
    }
  }

  return { steps, target3D };
}

export default function EncounterTools() {
  const [activeTool, setActiveTool] = useState<"verity" | "vesper" | "crota">("verity");

  // -------------------------------------------------------------
  // VERITY STATE
  // -------------------------------------------------------------
  const [verityMode, setVerityMode] = useState<"outside" | "inside">("outside");

  // Outside state
  const [outsideLeft3D, setOutsideLeft3D] = useState<Shape3D>("Sphere");
  const [outsideMid3D, setOutsideMid3D] = useState<Shape3D>("Pyramid");
  const [outsideRight3D, setOutsideRight3D] = useState<Shape3D>("Cube");

  const [insideLeft2D, setInsideLeft2D] = useState<Shape2D>("Circle");
  const [insideMid2D, setInsideMid2D] = useState<Shape2D>("Triangle");
  const [insideRight2D, setInsideRight2D] = useState<Shape2D>("Square");

  // Inside state
  const [myStatue, setMyStatue] = useState<Shape2D>("Circle");
  const [myWallShape1, setMyWallShape1] = useState<Shape2D>("Circle");
  const [myWallShape2, setMyWallShape2] = useState<Shape2D>("Triangle");

  // -------------------------------------------------------------
  // VESPER RADIATION STATE
  // -------------------------------------------------------------
  const [radiationStacks, setRadiationStacks] = useState(0);
  const [radTimerRunning, setRadTimerRunning] = useState(false);
  const [terminals, setTerminals] = useState(["", "", "", ""]);

  useEffect(() => {
    let t: ReturnType<typeof setInterval> | null = null;
    if (radTimerRunning) {
      t = setInterval(() => {
        setRadiationStacks(prev => {
          const next = prev + 1;
          if (next === 8) {
            playTone(880, 250, "triangle"); // Warning beep at 8x
          } else if (next >= 10) {
            playTone(1100, 450, "sawtooth"); // Wipe alarm
            setRadTimerRunning(false);
          }
          return Math.min(next, 10);
        });
      }, 3500); // approx stack interval
    }
    return () => {
      if (t) clearInterval(t);
    };
  }, [radTimerRunning]);

  // -------------------------------------------------------------
  // CROTA CHALICE STATE
  // -------------------------------------------------------------
  const [chalicePercent, setChalicePercent] = useState(0);
  const [chaliceRunning, setChaliceRunning] = useState(false);

  useEffect(() => {
    let timer: ReturnType<typeof setInterval> | null = null;
    if (chaliceRunning) {
      timer = setInterval(() => {
        setChalicePercent(p => {
          const next = p + 4;
          if (next === 76 || next === 80) playTone(700, 150, "sine");
          if (next >= 96) playTone(950, 300, "square");
          if (next >= 100) {
            setChaliceRunning(false);
            return 100;
          }
          return next;
        });
      }, 1000);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [chaliceRunning]);

  // Calculate dissection
  const dissectionResult = solveDissection(
    { Left: outsideLeft3D, Middle: outsideMid3D, Right: outsideRight3D },
    { Left: insideLeft2D, Middle: insideMid2D, Right: insideRight2D }
  );

  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-y-auto bg-neutral-950 p-4 text-neutral-100">
      {/* Top Selector Bar */}
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3 border-b border-neutral-800 pb-3">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTool("verity")}
            className={`rounded px-3 py-1.5 text-xs font-bold uppercase tracking-wider transition-colors ${
              activeTool === "verity" ? "bg-purple-900/70 border border-purple-500 text-purple-200" : "bg-neutral-900 text-neutral-400 hover:text-neutral-200"
            }`}
          >
            🏰 Verity 4th Encounter (Salvation's Edge)
          </button>
          <button
            onClick={() => setActiveTool("vesper")}
            className={`rounded px-3 py-1.5 text-xs font-bold uppercase tracking-wider transition-colors ${
              activeTool === "vesper" ? "bg-cyan-900/70 border border-cyan-500 text-cyan-200" : "bg-neutral-900 text-neutral-400 hover:text-neutral-200"
            }`}
          >
            ⚡ Vesper's Host Nuclear Operator
          </button>
          <button
            onClick={() => setActiveTool("crota")}
            className={`rounded px-3 py-1.5 text-xs font-bold uppercase tracking-wider transition-colors ${
              activeTool === "crota" ? "bg-emerald-900/70 border border-emerald-500 text-emerald-200" : "bg-neutral-900 text-neutral-400 hover:text-neutral-200"
            }`}
          >
            ⚔️ Crota's End Chalice Metronome
          </button>
        </div>

        <button
          onClick={() => playTone(800, 150)}
          className="rounded border border-neutral-700 bg-neutral-900 px-2.5 py-1 text-[11px] text-neutral-400 hover:bg-neutral-800"
        >
          🔊 Test Audio Cue
        </button>
      </div>

      {/* TOOL 1: VERITY SOLVER */}
      {activeTool === "verity" && (
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-neutral-400">Encounter View:</span>
            <button
              onClick={() => setVerityMode("outside")}
              className={`rounded px-3 py-1 text-xs font-semibold ${
                verityMode === "outside" ? "bg-purple-600 text-white" : "bg-neutral-900 text-neutral-400 hover:bg-neutral-800"
              }`}
            >
              Outside (Dissection Solver)
            </button>
            <button
              onClick={() => setVerityMode("inside")}
              className={`rounded px-3 py-1 text-xs font-semibold ${
                verityMode === "inside" ? "bg-purple-600 text-white" : "bg-neutral-900 text-neutral-400 hover:bg-neutral-800"
              }`}
            >
              Inside (Solo Room Guide)
            </button>
          </div>

          {verityMode === "outside" ? (
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
              {/* Inputs */}
              <div className="rounded-lg border border-neutral-800 bg-neutral-900/50 p-4">
                <h3 className="mb-2 text-sm font-bold text-purple-300">1. Starting Outside 3D Statues</h3>
                <div className="grid grid-cols-3 gap-2 text-xs">
                  {(["Left", "Middle", "Right"] as const).map(pos => {
                    const val = pos === "Left" ? outsideLeft3D : pos === "Middle" ? outsideMid3D : outsideRight3D;
                    const setVal = pos === "Left" ? setOutsideLeft3D : pos === "Middle" ? setOutsideMid3D : setOutsideRight3D;
                    return (
                      <div key={pos} className="rounded border border-neutral-800 bg-neutral-950 p-2">
                        <span className="text-[10px] uppercase font-bold text-neutral-400">{pos} Statue</span>
                        <select
                          value={val}
                          onChange={e => setVal(e.target.value as Shape3D)}
                          className="mt-1 w-full rounded border border-neutral-700 bg-neutral-900 px-1 py-1 text-xs text-neutral-100"
                        >
                          {(["Sphere", "Pyramid", "Cube", "Cone", "Cylinder", "Prism"] as Shape3D[]).map(s => (
                            <option key={s} value={s}>{s}</option>
                          ))}
                        </select>
                      </div>
                    );
                  })}
                </div>

                <h3 className="mb-2 mt-4 text-sm font-bold text-purple-300">2. Inside Players' 2D Statue Calls</h3>
                <div className="grid grid-cols-3 gap-2 text-xs">
                  {(["Left", "Middle", "Right"] as const).map(pos => {
                    const val = pos === "Left" ? insideLeft2D : pos === "Middle" ? insideMid2D : insideRight2D;
                    const setVal = pos === "Left" ? setInsideLeft2D : pos === "Middle" ? setInsideMid2D : setInsideRight2D;
                    return (
                      <div key={pos} className="rounded border border-neutral-800 bg-neutral-950 p-2">
                        <span className="text-[10px] uppercase font-bold text-neutral-400">{pos} Inside Call</span>
                        <select
                          value={val}
                          onChange={e => setVal(e.target.value as Shape2D)}
                          className="mt-1 w-full rounded border border-neutral-700 bg-neutral-900 px-1 py-1 text-xs text-neutral-100"
                        >
                          <option value="Circle">Circle (⚪)</option>
                          <option value="Triangle">Triangle (🔺)</option>
                          <option value="Square">Square (🟩)</option>
                        </select>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Solution Card */}
              <div className="flex flex-col rounded-lg border border-purple-900/60 bg-purple-950/20 p-4">
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-sm font-bold text-purple-300">⚔️ Exact Dissection Sequence</span>
                  <span className="text-[11px] font-semibold text-emerald-400">Automated Solver</span>
                </div>

                <div className="mb-3 rounded border border-neutral-800 bg-neutral-950/80 p-2.5 text-xs">
                  <span className="text-[10px] uppercase font-bold text-neutral-500 block mb-1">Target 3D Shapes Needed:</span>
                  <div className="flex justify-between font-mono text-xs">
                    <div>Left: <span className="text-amber-300 font-bold">{dissectionResult.target3D.Left}</span></div>
                    <div>Mid: <span className="text-amber-300 font-bold">{dissectionResult.target3D.Middle}</span></div>
                    <div>Right: <span className="text-amber-300 font-bold">{dissectionResult.target3D.Right}</span></div>
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  {dissectionResult.steps.length === 0 ? (
                    <div className="rounded border border-emerald-800 bg-emerald-950/40 p-3 text-center text-xs text-emerald-300">
                      ✓ Statues already match required shapes! No cuts needed.
                    </div>
                  ) : (
                    dissectionResult.steps.map((st, idx) => (
                      <div key={idx} className="rounded border border-purple-800/60 bg-neutral-950/90 p-2.5 text-xs leading-relaxed">
                        <span className="font-bold text-purple-400 mr-2">Step {idx + 1}:</span>
                        Cut <span className="font-semibold text-rose-300">{st.fromShape}</span> from <span className="font-bold text-neutral-200">{st.fromStatue}</span>, then cut <span className="font-semibold text-cyan-300">{st.toShape}</span> from <span className="font-bold text-neutral-200">{st.toStatue}</span>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          ) : (
            /* Inside Solo Room Solver */
            <div className="rounded-lg border border-neutral-800 bg-neutral-900/50 p-4 max-w-xl">
              <h3 className="mb-2 text-sm font-bold text-purple-300">Inside Solo Room Guide</h3>
              <div className="grid grid-cols-3 gap-2 mb-4 text-xs">
                <div>
                  <label className="text-[10px] font-semibold text-neutral-400 block mb-1">My Statue</label>
                  <select
                    value={myStatue}
                    onChange={e => setMyStatue(e.target.value as Shape2D)}
                    className="w-full rounded border border-neutral-700 bg-neutral-900 px-2 py-1 text-xs text-neutral-100"
                  >
                    <option value="Circle">Circle (⚪)</option>
                    <option value="Triangle">Triangle (🔺)</option>
                    <option value="Square">Square (🟩)</option>
                  </select>
                </div>

                <div>
                  <label className="text-[10px] font-semibold text-neutral-400 block mb-1">Wall Shape 1</label>
                  <select
                    value={myWallShape1}
                    onChange={e => setMyWallShape1(e.target.value as Shape2D)}
                    className="w-full rounded border border-neutral-700 bg-neutral-900 px-2 py-1 text-xs text-neutral-100"
                  >
                    <option value="Circle">Circle</option>
                    <option value="Triangle">Triangle</option>
                    <option value="Square">Square</option>
                  </select>
                </div>

                <div>
                  <label className="text-[10px] font-semibold text-neutral-400 block mb-1">Wall Shape 2</label>
                  <select
                    value={myWallShape2}
                    onChange={e => setMyWallShape2(e.target.value as Shape2D)}
                    className="w-full rounded border border-neutral-700 bg-neutral-900 px-2 py-1 text-xs text-neutral-100"
                  >
                    <option value="Circle">Circle</option>
                    <option value="Triangle">Triangle</option>
                    <option value="Square">Square</option>
                  </select>
                </div>
              </div>

              <div className="rounded border border-purple-800/80 bg-neutral-950 p-3 text-xs leading-relaxed">
                <div className="font-bold text-purple-300 mb-1">Action Plan:</div>
                <p className="text-neutral-300 mb-1">
                  1. Eliminate your statue shape ({myStatue}) from your own room: deposit it onto the teammate statue who needs it.
                </p>
                <p className="text-neutral-300 mb-1">
                  2. Once your wall has the two other shapes that are NOT {myStatue}, pick up both to form your 3D key.
                </p>
                <p className="text-emerald-400 font-semibold">
                  3. Walk through the mirror glass to escape!
                </p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TOOL 2: VESPER'S HOST NUCLEAR OPERATOR */}
      {activeTool === "vesper" && (
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          {/* Keypad */}
          <div className="rounded-lg border border-neutral-800 bg-neutral-900/50 p-4">
            <h3 className="mb-2 text-sm font-bold text-cyan-300">Operator Terminal Codepad</h3>
            <p className="text-xs text-neutral-400 mb-3">Record the 4 active terminal numbers called out during encounters.</p>
            <div className="grid grid-cols-4 gap-2 mb-4">
              {terminals.map((val, idx) => (
                <div key={idx} className="rounded border border-neutral-800 bg-neutral-950 p-2 text-center">
                  <span className="text-[10px] text-neutral-500 block mb-1">Terminal {idx + 1}</span>
                  <input
                    type="text"
                    maxLength={2}
                    value={val}
                    onChange={e => {
                      const next = [...terminals];
                      next[idx] = e.target.value.toUpperCase();
                      setTerminals(next);
                    }}
                    placeholder="—"
                    className="w-full bg-neutral-900 border border-neutral-700 rounded text-center font-mono text-base font-bold text-cyan-300 py-1"
                  />
                </div>
              ))}
            </div>
            <button
              onClick={() => setTerminals(["", "", "", ""])}
              className="rounded border border-neutral-700 bg-neutral-800 px-3 py-1 text-xs text-neutral-300 hover:bg-neutral-700"
            >
              Clear Numbers
            </button>
          </div>

          {/* Radiation Monitor */}
          <div className="rounded-lg border border-neutral-800 bg-neutral-900/50 p-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-bold text-rose-300">Radiation Wipe Counter</h3>
              <span className={`text-xs font-bold ${radiationStacks >= 8 ? "text-red-400 animate-pulse" : "text-neutral-400"}`}>
                {radiationStacks}/10 Stacks
              </span>
            </div>

            {/* Meter */}
            <div className="h-4 w-full rounded bg-neutral-950 border border-neutral-800 overflow-hidden mb-3">
              <div
                className={`h-full transition-all duration-300 ${
                  radiationStacks >= 8 ? "bg-red-500" : radiationStacks >= 5 ? "bg-amber-400" : "bg-cyan-400"
                }`}
                style={{ width: `${(radiationStacks / 10) * 100}%` }}
              />
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setRadTimerRunning(!radTimerRunning)}
                className={`rounded px-3 py-1.5 text-xs font-bold ${
                  radTimerRunning ? "bg-red-800 text-white" : "bg-cyan-700 text-white hover:bg-cyan-600"
                }`}
              >
                {radTimerRunning ? "Stop Radiation Timer" : "Start Radiation Timer"}
              </button>
              <button
                onClick={() => {
                  setRadiationStacks(0);
                  setRadTimerRunning(false);
                }}
                className="rounded border border-neutral-700 bg-neutral-800 px-3 py-1.5 text-xs text-neutral-300 hover:bg-neutral-700"
              >
                Reset Stacks
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TOOL 3: CROTA CHALICE METRONOME */}
      {activeTool === "crota" && (
        <div className="rounded-lg border border-neutral-800 bg-neutral-900/50 p-4 max-w-xl">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-bold text-emerald-300">Chalice of Light Charge Metronome</h3>
            <span className={`text-xs font-bold ${chalicePercent >= 80 ? "text-amber-300" : "text-emerald-400"}`}>
              {chalicePercent}% Charged
            </span>
          </div>

          <div className="h-4 w-full rounded bg-neutral-950 border border-neutral-800 overflow-hidden mb-3">
            <div
              className={`h-full transition-all duration-200 ${
                chalicePercent >= 90 ? "bg-red-500" : chalicePercent >= 75 ? "bg-amber-400" : "bg-emerald-400"
              }`}
              style={{ width: `${chalicePercent}%` }}
            />
          </div>

          <div className="flex items-center gap-2 text-xs">
            <button
              onClick={() => {
                if (chaliceRunning) {
                  setChaliceRunning(false);
                } else {
                  setChalicePercent(0);
                  setChaliceRunning(true);
                }
              }}
              className={`rounded px-3 py-1.5 font-bold ${
                chaliceRunning ? "bg-red-800 text-white" : "bg-emerald-700 text-white hover:bg-emerald-600"
              }`}
            >
              {chaliceRunning ? "Stop / Swap Chalice" : "Take Chalice (Start 25s Timer)"}
            </button>
            <button
              onClick={() => {
                setChalicePercent(0);
                setChaliceRunning(false);
              }}
              className="rounded border border-neutral-700 bg-neutral-800 px-3 py-1.5 text-neutral-300 hover:bg-neutral-700"
            >
              Reset
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
