import { useState, useMemo } from "react";

export type Shape2D = "Circle" | "Triangle" | "Square";
export type Shape3D = "Sphere" | "Pyramid" | "Cube" | "Cone" | "Cylinder" | "Prism";

export const SHAPE_2D_ICONS: Record<Shape2D, { icon: string; color: string }> = {
  Circle: { icon: "⚪", color: "text-amber-300" },
  Triangle: { icon: "🔺", color: "text-emerald-400" },
  Square: { icon: "🟩", color: "text-purple-400" },
};

export const SHAPE_3D_COMPOSITION: Record<Shape3D, [Shape2D, Shape2D]> = {
  Sphere: ["Circle", "Circle"],
  Pyramid: ["Triangle", "Triangle"],
  Cube: ["Square", "Square"],
  Cone: ["Circle", "Triangle"],
  Cylinder: ["Circle", "Square"],
  Prism: ["Triangle", "Square"],
};

export const SHAPE_3D_TARGET: Record<Shape2D, Shape3D> = {
  Circle: "Prism", // Triangle + Square
  Triangle: "Cylinder", // Circle + Square
  Square: "Cone", // Circle + Triangle
};

export interface DissectionStep {
  fromStatue: "Left" | "Middle" | "Right";
  fromShape: Shape2D;
  toStatue: "Left" | "Middle" | "Right";
  toShape: Shape2D;
  resultingShapes?: {
    Left: Shape3D;
    Middle: Shape3D;
    Right: Shape3D;
  };
}

function get3DShapeName(part1: Shape2D, part2: Shape2D): Shape3D {
  for (const [s3d, [p1, p2]] of Object.entries(SHAPE_3D_COMPOSITION) as [Shape3D, [Shape2D, Shape2D]][]) {
    if ((p1 === part1 && p2 === part2) || (p1 === part2 && p2 === part1)) {
      return s3d;
    }
  }
  return "Sphere";
}

// 100% Guaranteed BFS Shortest-Path Dissection Solver
function solveVerityBFS(
  start3D: { Left: Shape3D; Middle: Shape3D; Right: Shape3D },
  inside2D: { Left: Shape2D; Middle: Shape2D; Right: Shape2D }
): {
  steps: DissectionStep[];
  target3D: { Left: Shape3D; Middle: Shape3D; Right: Shape3D };
  isBalanced: boolean;
  counts: { Circle: number; Triangle: number; Square: number };
} {
  // Count total 2D shapes
  const allShapes = [
    ...SHAPE_3D_COMPOSITION[start3D.Left],
    ...SHAPE_3D_COMPOSITION[start3D.Middle],
    ...SHAPE_3D_COMPOSITION[start3D.Right],
  ];

  const counts: { Circle: number; Triangle: number; Square: number } = { Circle: 0, Triangle: 0, Square: 0 };
  for (const s of allShapes) counts[s]++;

  const isBalanced = counts.Circle === 2 && counts.Triangle === 2 && counts.Square === 2;

  const target3D = {
    Left: SHAPE_3D_TARGET[inside2D.Left],
    Middle: SHAPE_3D_TARGET[inside2D.Middle],
    Right: SHAPE_3D_TARGET[inside2D.Right],
  };

  if (!isBalanced) {
    return { steps: [], target3D, isBalanced: false, counts };
  }

  const target2D = {
    Left: [...SHAPE_3D_COMPOSITION[target3D.Left]].sort(),
    Middle: [...SHAPE_3D_COMPOSITION[target3D.Middle]].sort(),
    Right: [...SHAPE_3D_COMPOSITION[target3D.Right]].sort(),
  };

  const startState = {
    Left: [...SHAPE_3D_COMPOSITION[start3D.Left]],
    Middle: [...SHAPE_3D_COMPOSITION[start3D.Middle]],
    Right: [...SHAPE_3D_COMPOSITION[start3D.Right]],
  };

  function isSolved(st: typeof startState): boolean {
    return (
      [...st.Left].sort().join(",") === target2D.Left.join(",") &&
      [...st.Middle].sort().join(",") === target2D.Middle.join(",") &&
      [...st.Right].sort().join(",") === target2D.Right.join(",")
    );
  }

  if (isSolved(startState)) {
    return { steps: [], target3D, isBalanced: true, counts };
  }

  function stateKey(st: typeof startState): string {
    return `${[...st.Left].sort().join("")}|${[...st.Middle].sort().join("")}|${[...st.Right].sort().join("")}`;
  }

  const statues = ["Left", "Middle", "Right"] as const;
  const queue: { state: typeof startState; steps: DissectionStep[] }[] = [{ state: startState, steps: [] }];
  const visited = new Set<string>();
  visited.add(stateKey(startState));

  while (queue.length > 0) {
    const { state, steps } = queue.shift()!;
    if (isSolved(state)) {
      return { steps, target3D, isBalanced: true, counts };
    }

    for (let i = 0; i < statues.length; i++) {
      for (let j = i + 1; j < statues.length; j++) {
        const sA = statues[i];
        const sB = statues[j];

        for (let idxA = 0; idxA < 2; idxA++) {
          for (let idxB = 0; idxB < 2; idxB++) {
            const shapeA = state[sA][idxA];
            const shapeB = state[sB][idxB];
            if (shapeA === shapeB) continue; // swapping identical shapes produces identical state

            const next = {
              Left: [...state.Left] as [Shape2D, Shape2D],
              Middle: [...state.Middle] as [Shape2D, Shape2D],
              Right: [...state.Right] as [Shape2D, Shape2D],
            };
            next[sA][idxA] = shapeB;
            next[sB][idxB] = shapeA;

            const k = stateKey(next);
            if (!visited.has(k)) {
              visited.add(k);
              queue.push({
                state: next,
                steps: [
                  ...steps,
                  {
                    fromStatue: sA,
                    fromShape: shapeA,
                    toStatue: sB,
                    toShape: shapeB,
                    resultingShapes: {
                      Left: get3DShapeName(next.Left[0], next.Left[1]),
                      Middle: get3DShapeName(next.Middle[0], next.Middle[1]),
                      Right: get3DShapeName(next.Right[0], next.Right[1]),
                    },
                  },
                ],
              });
            }
          }
        }
      }
    }
  }

  return { steps: [], target3D, isBalanced: true, counts };
}

export default function EncounterTools() {
  const [mode, setMode] = useState<"outside" | "inside">("outside");

  // Outside 3D initial statues
  const [left3D, setLeft3D] = useState<Shape3D>("Sphere");
  const [mid3D, setMid3D] = useState<Shape3D>("Pyramid");
  const [right3D, setRight3D] = useState<Shape3D>("Cube");

  // Inside 2D initial calls
  const [leftInside, setLeftInside] = useState<Shape2D>("Circle");
  const [midInside, setMidInside] = useState<Shape2D>("Triangle");
  const [rightInside, setRightInside] = useState<Shape2D>("Square");

  // Inside Solo Room guide state
  const [soloStatue, setSoloStatue] = useState<Shape2D>("Circle");
  const [soloWall1, setSoloWall1] = useState<Shape2D>("Circle");
  const [soloWall2, setSoloWall2] = useState<Shape2D>("Triangle");

  const solution = useMemo(() => {
    return solveVerityBFS(
      { Left: left3D, Middle: mid3D, Right: right3D },
      { Left: leftInside, Middle: midInside, Right: rightInside }
    );
  }, [left3D, mid3D, right3D, leftInside, midInside, rightInside]);

  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-y-auto bg-neutral-950 p-4 text-neutral-100">
      {/* Header */}
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3 border-b border-neutral-800 pb-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="rounded bg-purple-950/80 border border-purple-700/60 px-2 py-0.5 text-xs font-bold uppercase tracking-wider text-purple-300">
              Salvation's Edge
            </span>
            <h1 className="text-base font-bold text-neutral-100">Verity (4th Encounter) 3D Dissection Solver</h1>
          </div>
          <p className="mt-0.5 text-xs text-neutral-400">
            Automated dissection calculator for outside players & step-by-step escape guide for inside players
          </p>
        </div>

        {/* Mode Switcher */}
        <div className="flex items-center rounded border border-neutral-800 bg-neutral-900 p-0.5 text-xs font-semibold">
          <button
            onClick={() => setMode("outside")}
            className={`rounded px-3 py-1.5 transition-colors ${
              mode === "outside" ? "bg-purple-600 text-white" : "text-neutral-400 hover:text-neutral-200"
            }`}
          >
            Outside (Dissection Solver)
          </button>
          <button
            onClick={() => setMode("inside")}
            className={`rounded px-3 py-1.5 transition-colors ${
              mode === "inside" ? "bg-purple-600 text-white" : "text-neutral-400 hover:text-neutral-200"
            }`}
          >
            Inside (Solo Room Escape)
          </button>
        </div>
      </div>

      {/* OUTSIDE DISSECTION SOLVER */}
      {mode === "outside" && (
        <div className="flex flex-col gap-4">
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            {/* Step 1 & 2 Inputs */}
            <div className="flex flex-col gap-4 rounded-lg border border-neutral-800 bg-neutral-900/40 p-4">
              <div>
                <div className="mb-2 flex items-center justify-between">
                  <h2 className="text-xs font-bold uppercase tracking-wide text-purple-300">
                    1. Current Outside 3D Statues
                  </h2>
                  <span className="text-[11px] text-neutral-500">What each statue holds now</span>
                </div>

                <div className="grid grid-cols-3 gap-2.5">
                  {(["Left", "Middle", "Right"] as const).map(pos => {
                    const val = pos === "Left" ? left3D : pos === "Middle" ? mid3D : right3D;
                    const setVal = pos === "Left" ? setLeft3D : pos === "Middle" ? setMid3D : setRight3D;
                    const parts = SHAPE_3D_COMPOSITION[val];

                    return (
                      <div key={pos} className="flex flex-col rounded border border-neutral-800 bg-neutral-950 p-2.5">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 mb-1">
                          {pos} Statue
                        </span>
                        <select
                          value={val}
                          onChange={e => setVal(e.target.value as Shape3D)}
                          className="rounded border border-neutral-700 bg-neutral-900 px-2 py-1 text-xs font-semibold text-neutral-100 focus:border-purple-500 focus:outline-none"
                        >
                          {(Object.keys(SHAPE_3D_COMPOSITION) as Shape3D[]).map(s => (
                            <option key={s} value={s}>{s}</option>
                          ))}
                        </select>
                        <div className="mt-2 flex items-center justify-center gap-1.5 text-xs text-neutral-300 font-mono">
                          <span>{SHAPE_2D_ICONS[parts[0]].icon}</span>
                          <span>+</span>
                          <span>{SHAPE_2D_ICONS[parts[1]].icon}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div>
                <div className="mb-2 flex items-center justify-between">
                  <h2 className="text-xs font-bold uppercase tracking-wide text-purple-300">
                    2. Inside Players' 2D Statue Calls
                  </h2>
                  <span className="text-[11px] text-neutral-500">What each inside player sees on their statue</span>
                </div>

                <div className="grid grid-cols-3 gap-2.5">
                  {(["Left", "Middle", "Right"] as const).map(pos => {
                    const val = pos === "Left" ? leftInside : pos === "Middle" ? midInside : rightInside;
                    const setVal = pos === "Left" ? setLeftInside : pos === "Middle" ? setMidInside : setRightInside;

                    return (
                      <div key={pos} className="flex flex-col rounded border border-neutral-800 bg-neutral-950 p-2.5">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 mb-1">
                          {pos} Inside
                        </span>
                        <select
                          value={val}
                          onChange={e => setVal(e.target.value as Shape2D)}
                          className="rounded border border-neutral-700 bg-neutral-900 px-2 py-1 text-xs font-semibold text-neutral-100 focus:border-purple-500 focus:outline-none"
                        >
                          <option value="Circle">Circle (⚪)</option>
                          <option value="Triangle">Triangle (🔺)</option>
                          <option value="Square">Square (🟩)</option>
                        </select>
                        <div className="mt-2 text-center text-xs">
                          Needs: <span className="font-bold text-amber-300">{SHAPE_3D_TARGET[val]}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Balance Validation Indicator */}
              <div className={`rounded border p-2.5 text-xs flex items-center justify-between ${
                solution.isBalanced
                  ? "border-emerald-800/80 bg-emerald-950/30 text-emerald-300"
                  : "border-amber-800/80 bg-amber-950/40 text-amber-200"
              }`}>
                <div className="flex items-center gap-2">
                  <span>{solution.isBalanced ? "✓" : "⚠️"}</span>
                  <span>
                    Total shapes on outside statues:
                  </span>
                </div>
                <div className="flex items-center gap-3 font-mono font-bold">
                  <span>⚪ {solution.counts.Circle}/2</span>
                  <span>🔺 {solution.counts.Triangle}/2</span>
                  <span>🟩 {solution.counts.Square}/2</span>
                </div>
              </div>
            </div>

            {/* Dissection Steps Solution Card */}
            <div className="flex flex-col rounded-lg border border-purple-900/60 bg-purple-950/20 p-4">
              <div className="mb-3 flex items-center justify-between border-b border-purple-800/40 pb-2">
                <span className="text-sm font-bold text-purple-200">⚔️ Exact Dissection Sequence</span>
                <span className="rounded bg-purple-900/60 border border-purple-700/60 px-2 py-0.5 text-[10px] font-bold text-purple-300">
                  {solution.steps.length} {solution.steps.length === 1 ? "Cut" : "Cuts"} Needed
                </span>
              </div>

              {/* Target 3D Statues */}
              <div className="mb-4 rounded border border-neutral-800 bg-neutral-950/80 p-3">
                <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-500 block mb-2">
                  Goal Statues (Must NOT match inside player's shape):
                </span>
                <div className="grid grid-cols-3 gap-2 text-center font-mono text-xs">
                  <div className="rounded border border-neutral-800 bg-neutral-900/70 p-2">
                    <span className="text-[10px] text-neutral-400 block mb-0.5">Left</span>
                    <span className="font-bold text-amber-300 block">{solution.target3D.Left}</span>
                    <span className="text-[10px] text-neutral-500">
                      {SHAPE_3D_COMPOSITION[solution.target3D.Left].map(s => SHAPE_2D_ICONS[s].icon).join(" + ")}
                    </span>
                  </div>
                  <div className="rounded border border-neutral-800 bg-neutral-900/70 p-2">
                    <span className="text-[10px] text-neutral-400 block mb-0.5">Middle</span>
                    <span className="font-bold text-amber-300 block">{solution.target3D.Middle}</span>
                    <span className="text-[10px] text-neutral-500">
                      {SHAPE_3D_COMPOSITION[solution.target3D.Middle].map(s => SHAPE_2D_ICONS[s].icon).join(" + ")}
                    </span>
                  </div>
                  <div className="rounded border border-neutral-800 bg-neutral-900/70 p-2">
                    <span className="text-[10px] text-neutral-400 block mb-0.5">Right</span>
                    <span className="font-bold text-amber-300 block">{solution.target3D.Right}</span>
                    <span className="text-[10px] text-neutral-500">
                      {SHAPE_3D_COMPOSITION[solution.target3D.Right].map(s => SHAPE_2D_ICONS[s].icon).join(" + ")}
                    </span>
                  </div>
                </div>
              </div>

              {/* Step by step execution */}
              {!solution.isBalanced ? (
                <div className="rounded border border-amber-800 bg-amber-950/40 p-4 text-center text-xs text-amber-200">
                  ⚠️ The statues you selected do not sum to 2 Circles, 2 Triangles, and 2 Squares. In Destiny 2, the total count is always 2 of each shape. Please double check what the statues outside are holding.
                </div>
              ) : solution.steps.length === 0 ? (
                <div className="rounded border border-emerald-800 bg-emerald-950/40 p-4 text-center text-xs text-emerald-300">
                  🎉 Statues are already solved! All outside statues already have the correct non-matching 3D shapes.
                </div>
              ) : (
                <div className="flex flex-col gap-2.5">
                  {solution.steps.map((st, idx) => (
                    <div
                      key={idx}
                      className="flex flex-col gap-1.5 rounded border border-purple-800/60 bg-neutral-950/90 p-3 text-xs"
                    >
                      <div className="flex items-center justify-between">
                        <span className="rounded bg-purple-900/80 px-1.5 py-0.5 text-[10px] font-bold text-purple-200">
                          CUT #{idx + 1}
                        </span>
                        {st.resultingShapes && (
                          <span className="text-[10px] text-neutral-500 font-mono">
                            Result: L: {st.resultingShapes.Left} | M: {st.resultingShapes.Middle} | R: {st.resultingShapes.Right}
                          </span>
                        )}
                      </div>

                      <div className="text-sm font-semibold text-neutral-100 flex items-center flex-wrap gap-1.5">
                        <span>Dissect</span>
                        <span className="rounded bg-neutral-900 border border-neutral-700 px-1.5 py-0.5 font-bold text-rose-300">
                          {SHAPE_2D_ICONS[st.fromShape].icon} {st.fromShape}
                        </span>
                        <span>from</span>
                        <span className="font-bold text-purple-300">{st.fromStatue}</span>
                        <span className="text-neutral-500">⇄</span>
                        <span>Dissect</span>
                        <span className="rounded bg-neutral-900 border border-neutral-700 px-1.5 py-0.5 font-bold text-cyan-300">
                          {SHAPE_2D_ICONS[st.toShape].icon} {st.toShape}
                        </span>
                        <span>from</span>
                        <span className="font-bold text-purple-300">{st.toStatue}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* INSIDE SOLO ROOM ESCAPE GUIDE */}
      {mode === "inside" && (
        <div className="rounded-lg border border-neutral-800 bg-neutral-900/40 p-4 max-w-2xl">
          <h2 className="text-sm font-bold text-purple-300 mb-1">Inside Solo Room Solver</h2>
          <p className="text-xs text-neutral-400 mb-4">
            Select your own statue shape and the 2 starting shapes on your wall to get your exact exit sequence.
          </p>

          <div className="grid grid-cols-3 gap-3 mb-4 text-xs">
            <div className="rounded border border-neutral-800 bg-neutral-950 p-2.5">
              <label className="text-[10px] font-bold uppercase text-neutral-400 block mb-1">My Statue</label>
              <select
                value={soloStatue}
                onChange={e => setSoloStatue(e.target.value as Shape2D)}
                className="w-full rounded border border-neutral-700 bg-neutral-900 px-2 py-1 text-xs text-neutral-100 font-semibold"
              >
                <option value="Circle">Circle (⚪)</option>
                <option value="Triangle">Triangle (🔺)</option>
                <option value="Square">Square (🟩)</option>
              </select>
            </div>

            <div className="rounded border border-neutral-800 bg-neutral-950 p-2.5">
              <label className="text-[10px] font-bold uppercase text-neutral-400 block mb-1">Wall Shape 1</label>
              <select
                value={soloWall1}
                onChange={e => setSoloWall1(e.target.value as Shape2D)}
                className="w-full rounded border border-neutral-700 bg-neutral-900 px-2 py-1 text-xs text-neutral-100 font-semibold"
              >
                <option value="Circle">Circle (⚪)</option>
                <option value="Triangle">Triangle (🔺)</option>
                <option value="Square">Square (🟩)</option>
              </select>
            </div>

            <div className="rounded border border-neutral-800 bg-neutral-950 p-2.5">
              <label className="text-[10px] font-bold uppercase text-neutral-400 block mb-1">Wall Shape 2</label>
              <select
                value={soloWall2}
                onChange={e => setSoloWall2(e.target.value as Shape2D)}
                className="w-full rounded border border-neutral-700 bg-neutral-900 px-2 py-1 text-xs text-neutral-100 font-semibold"
              >
                <option value="Circle">Circle (⚪)</option>
                <option value="Triangle">Triangle (🔺)</option>
                <option value="Square">Square (🟩)</option>
              </select>
            </div>
          </div>

          <div className="rounded border border-purple-800/80 bg-neutral-950 p-4 text-xs leading-relaxed space-y-3">
            <div className="font-bold text-purple-300 text-sm">Your Exact Solo Room Sequence:</div>

            <div className="flex items-start gap-2">
              <span className="rounded bg-purple-900 px-1.5 py-0.5 font-bold text-white text-[10px]">STEP 1</span>
              <div>
                <span className="font-bold text-neutral-200">Remove duplicates / Give away your statue's shape:</span>
                <p className="text-neutral-400 mt-0.5">
                  If either of your wall shapes is <span className="font-semibold text-amber-300">{soloStatue}</span>, kill that Knight and deposit {soloStatue} onto one of the two teammate statues that DOES NOT have {soloStatue}.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-2">
              <span className="rounded bg-purple-900 px-1.5 py-0.5 font-bold text-white text-[10px]">STEP 2</span>
              <div>
                <span className="font-bold text-neutral-200">Trade away your second shape:</span>
                <p className="text-neutral-400 mt-0.5">
                  Kill the other Knight and deposit that shape onto the teammate whose statue matches that shape.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-2">
              <span className="rounded bg-emerald-800 px-1.5 py-0.5 font-bold text-white text-[10px]">ESCAPE</span>
              <div>
                <span className="font-bold text-emerald-300">Assemble Pure Key & Walk Through:</span>
                <p className="text-neutral-400 mt-0.5">
                  Once your teammates send both shapes to you, your wall will show <span className="font-bold text-emerald-300">two {soloStatue}s</span>. Pick up both to form your 3D key (<span className="font-bold text-amber-300">{soloStatue === "Circle" ? "Sphere" : soloStatue === "Triangle" ? "Pyramid" : "Cube"}</span>) and walk through the glass mirror to escape!
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
