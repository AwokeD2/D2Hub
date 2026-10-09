import { useState, useMemo } from "react";
import * as api from "../lib/api";

export type Shape2D = "Circle" | "Triangle" | "Square";
export type Shape3D = "Sphere" | "Pyramid" | "Cube" | "Cone" | "Cylinder" | "Prism";

export interface Shape2DInfo {
  id: Shape2D;
  name: string;
  icon: string;
  color: string;
  bg: string;
  border: string;
}

export const SHAPES_2D_LIST: Shape2DInfo[] = [
  { id: "Circle", name: "Circle", icon: "⚪", color: "text-amber-300", bg: "bg-amber-950/50", border: "border-amber-600/70" },
  { id: "Triangle", name: "Triangle", icon: "🔺", color: "text-emerald-400", bg: "bg-emerald-950/50", border: "border-emerald-600/70" },
  { id: "Square", name: "Square", icon: "🟩", color: "text-purple-400", bg: "bg-purple-950/50", border: "border-purple-600/70" },
];

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

export const SHAPES_3D_LIST: { id: Shape3D; name: string; parts: [Shape2D, Shape2D]; icons: string }[] = [
  { id: "Sphere", name: "Sphere", parts: ["Circle", "Circle"], icons: "⚪⚪" },
  { id: "Pyramid", name: "Pyramid", parts: ["Triangle", "Triangle"], icons: "🔺🔺" },
  { id: "Cube", name: "Cube", parts: ["Square", "Square"], icons: "🟩🟩" },
  { id: "Cone", name: "Cone", parts: ["Circle", "Triangle"], icons: "⚪🔺" },
  { id: "Cylinder", name: "Cylinder", parts: ["Circle", "Square"], icons: "⚪🟩" },
  { id: "Prism", name: "Prism", parts: ["Triangle", "Square"], icons: "🔺🟩" },
];

export const SHAPE_3D_TARGET: Record<Shape2D, Shape3D> = {
  Circle: "Prism", // Triangle + Square (Must NOT contain Circle)
  Triangle: "Cylinder", // Circle + Square (Must NOT contain Triangle)
  Square: "Cone", // Circle + Triangle (Must NOT contain Square)
};

export interface DissectionStep {
  fromStatue: "Left" | "Middle" | "Right";
  fromShape: Shape2D;
  toStatue: "Left" | "Middle" | "Right";
  toShape: Shape2D;
  resultingShapes: {
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

// 100% BFS Shortest-Path Dissection Solver
function solveVerityBFS(
  start3D: { Left: Shape3D; Middle: Shape3D; Right: Shape3D },
  inside2D: { Left: Shape2D; Middle: Shape2D; Right: Shape2D }
): {
  steps: DissectionStep[];
  target3D: { Left: Shape3D; Middle: Shape3D; Right: Shape3D };
  isBalanced: boolean;
  counts: { Circle: number; Triangle: number; Square: number };
} {
  const allShapes = [
    ...SHAPE_3D_COMPOSITION[start3D.Left],
    ...SHAPE_3D_COMPOSITION[start3D.Middle],
    ...SHAPE_3D_COMPOSITION[start3D.Right],
  ];

  const counts = { Circle: 0, Triangle: 0, Square: 0 };
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
            if (shapeA === shapeB) continue; // Swapping identical shapes changes nothing

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

export interface EncounterToolsProps {
  isOverlay?: boolean;
}

export default function EncounterTools({ isOverlay = false }: EncounterToolsProps = {}) {
  const [activeTab, setActiveTab] = useState<"outside" | "inside">("outside");

  // Outside 3D Statues (Starting hold)
  const [left3D, setLeft3D] = useState<Shape3D>("Sphere");
  const [mid3D, setMid3D] = useState<Shape3D>("Pyramid");
  const [right3D, setRight3D] = useState<Shape3D>("Cube");

  // Inside 2D Statues (Starting callouts)
  const [leftInside, setLeftInside] = useState<Shape2D>("Circle");
  const [midInside, setMidInside] = useState<Shape2D>("Triangle");
  const [rightInside, setRightInside] = useState<Shape2D>("Square");

  // Inside Solo Room Guide State
  const [soloStatue, setSoloStatue] = useState<Shape2D>("Circle");
  const [soloWall1, setSoloWall1] = useState<Shape2D>("Circle");
  const [soloWall2, setSoloWall2] = useState<Shape2D>("Triangle");

  const solution = useMemo(() => {
    return solveVerityBFS(
      { Left: left3D, Middle: mid3D, Right: right3D },
      { Left: leftInside, Middle: midInside, Right: rightInside }
    );
  }, [left3D, mid3D, right3D, leftInside, midInside, rightInside]);

  const setPresetPure = () => {
    setLeft3D("Sphere");
    setMid3D("Pyramid");
    setRight3D("Cube");
    setLeftInside("Circle");
    setMidInside("Triangle");
    setRightInside("Square");
  };

  const setPresetMixed = () => {
    setLeft3D("Cone");
    setMid3D("Cylinder");
    setRight3D("Prism");
    setLeftInside("Circle");
    setMidInside("Triangle");
    setRightInside("Square");
  };

  return (
    <div className={`flex min-h-0 flex-1 flex-col overflow-y-auto bg-neutral-950 text-neutral-100 ${isOverlay ? "p-2.5" : "p-4"}`}>
      {/* Header */}
      <div className={`flex flex-wrap items-center justify-between border-b border-neutral-800 ${isOverlay ? "mb-2.5 pb-2 gap-2" : "mb-4 pb-3 gap-3"}`}>
        <div>
          <div className="flex items-center gap-2">
            <span className="rounded bg-purple-950/80 border border-purple-700/60 px-2 py-0.5 text-xs font-bold uppercase tracking-wider text-purple-300">
              Salvation's Edge
            </span>
            <h1 className={`${isOverlay ? "text-sm" : "text-base"} font-bold text-neutral-100`}>Verity (4th Encounter) Solver</h1>
            <span className="rounded bg-neutral-900 border border-neutral-700 px-1.5 py-0.5 text-[10px] font-mono text-neutral-400">
              Ref: nokynokes
            </span>
          </div>
          {!isOverlay && (
            <p className="mt-0.5 text-xs text-neutral-400">
              Clickable statue selector with instant BFS optimal dissections (0 to 3 cuts) and inside solo room escape guide
            </p>
          )}
        </div>

        {/* Tab Switcher & Presets */}
        <div className="flex items-center gap-2">
          {activeTab === "outside" && (
            <div className="flex items-center gap-1.5">
              <button
                onClick={setPresetPure}
                className="rounded border border-neutral-800 bg-neutral-900 px-2 py-1 text-[11px] font-medium text-neutral-300 hover:bg-neutral-800 hover:text-white transition-colors"
                title="Reset to pure shapes (Sphere, Pyramid, Cube)"
              >
                Reset Pure
              </button>
              <button
                onClick={setPresetMixed}
                className="rounded border border-neutral-800 bg-neutral-900 px-2 py-1 text-[11px] font-medium text-neutral-300 hover:bg-neutral-800 hover:text-white transition-colors"
                title="Set to mixed shapes (Cone, Cylinder, Prism)"
              >
                Mixed Test
              </button>
            </div>
          )}

          <div className="flex items-center rounded border border-neutral-800 bg-neutral-900 p-0.5 text-xs font-semibold">
            <button
              onClick={() => setActiveTab("outside")}
              className={`rounded px-2.5 py-1 transition-colors ${
                activeTab === "outside" ? "bg-purple-600 text-white" : "text-neutral-400 hover:text-neutral-200"
              }`}
            >
              Outside (Dissection)
            </button>
            <button
              onClick={() => setActiveTab("inside")}
              className={`rounded px-2.5 py-1 transition-colors ${
                activeTab === "inside" ? "bg-purple-600 text-white" : "text-neutral-400 hover:text-neutral-200"
              }`}
            >
              Inside (Solo Escape)
            </button>
          </div>

          {!isOverlay && (
            <button
              onClick={() => api.toggleVerityOverlay().catch(() => {})}
              className="flex items-center gap-1.5 rounded border border-purple-700/80 bg-purple-950/80 px-2.5 py-1.5 text-xs font-bold text-purple-200 hover:bg-purple-900 transition-colors shadow-sm"
              title="Toggle floating in-game Verity overlay window (Default: Alt+V)"
            >
              <span>⚔️</span>
              <span>Overlay</span>
              <span className="rounded bg-purple-900 px-1 py-0.2 text-[10px] font-mono text-purple-300 border border-purple-700/60">
                Alt+V
              </span>
            </button>
          )}
        </div>
      </div>

      {/* OUTSIDE DISSECTION SOLVER (NOKYNOKES INTERACTIVE STYLE) */}
      {activeTab === "outside" && (
        <div className="flex flex-col gap-3">
          <div className={`grid grid-cols-1 gap-3 ${isOverlay ? "md:grid-cols-12" : "xl:grid-cols-12"}`}>
            {/* Statues Selection Grid */}
            <div className={`flex flex-col rounded-lg border border-neutral-800 bg-neutral-900/40 ${isOverlay ? "p-3 md:col-span-7 gap-2.5" : "p-4 xl:col-span-7 gap-4"}`}>
              {/* Header */}
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-sm font-bold text-neutral-100">Outside Statues Configuration</h2>
                  {!isOverlay && (
                    <p className="text-[11px] text-neutral-400">
                      Click each statue's inside 2D symbol callout and outside 3D starting shape
                    </p>
                  )}
                </div>

                {/* Balance validation badge */}
                <div
                  className={`rounded border px-2 py-0.5 text-xs font-bold font-mono flex items-center gap-1.5 ${
                    solution.isBalanced
                      ? "border-emerald-700/80 bg-emerald-950/40 text-emerald-300"
                      : "border-amber-700/80 bg-amber-950/60 text-amber-300"
                  }`}
                >
                  <span>{solution.isBalanced ? "✓ Valid Pool" : "⚠️ Invalid Pool"}</span>
                  <span className="text-[10px] text-neutral-400">
                    (⚪{solution.counts.Circle} 🔺{solution.counts.Triangle} 🟩{solution.counts.Square})
                  </span>
                </div>
              </div>

              {/* 3 Columns: Left, Middle, Right */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                {(["Left", "Middle", "Right"] as const).map(pos => {
                  const current2D = pos === "Left" ? leftInside : pos === "Middle" ? midInside : rightInside;
                  const set2D = pos === "Left" ? setLeftInside : pos === "Middle" ? setMidInside : setRightInside;

                  const current3D = pos === "Left" ? left3D : pos === "Middle" ? mid3D : right3D;
                  const set3D = pos === "Left" ? setLeft3D : pos === "Middle" ? setMid3D : setRight3D;

                  const targetForThis = SHAPE_3D_TARGET[current2D];

                  return (
                    <div
                      key={pos}
                      className={`flex flex-col rounded-lg border border-neutral-800 bg-neutral-950/90 shadow-md ${isOverlay ? "p-2" : "p-3"}`}
                    >
                      {/* Statue Title */}
                      <div className="mb-2 flex items-center justify-between border-b border-neutral-800/80 pb-1">
                        <span className="font-bold text-xs uppercase tracking-wider text-purple-300">
                          {pos}
                        </span>
                        <span className="text-[10px] font-semibold text-neutral-400">
                          Goal: <span className="text-amber-300 font-bold">{targetForThis}</span>
                        </span>
                      </div>

                      {/* 1. Inside 2D Callout (Radio Chips) */}
                      <div className="mb-3">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 block mb-1.5">
                          Inside Callout (2D)
                        </span>
                        <div className="grid grid-cols-3 gap-1.5">
                          {SHAPES_2D_LIST.map(shape => {
                            const isSelected = current2D === shape.id;
                            return (
                              <button
                                key={shape.id}
                                onClick={() => set2D(shape.id)}
                                className={`flex flex-col items-center justify-center rounded-md border p-1.5 transition-all text-xs ${
                                  isSelected
                                    ? `${shape.border} ${shape.bg} ring-1 ring-purple-500 font-bold shadow-sm`
                                    : "border-neutral-800 bg-neutral-900/60 hover:bg-neutral-800/80 text-neutral-400"
                                }`}
                              >
                                <span className="text-sm">{shape.icon}</span>
                                <span className="text-[10px] mt-0.5">{shape.name}</span>
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      {/* 2. Outside 3D Shape (Radio Chips) */}
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 block mb-1.5">
                          Outside Statue (3D)
                        </span>
                        <div className="grid grid-cols-2 gap-1.5">
                          {SHAPES_3D_LIST.map(s3d => {
                            const isSelected = current3D === s3d.id;
                            return (
                              <button
                                key={s3d.id}
                                onClick={() => set3D(s3d.id)}
                                className={`flex flex-col items-center justify-center rounded-md border p-1.5 transition-all ${
                                  isSelected
                                    ? "border-purple-500 bg-purple-950/60 text-white font-bold ring-1 ring-purple-500 shadow-sm"
                                    : "border-neutral-800 bg-neutral-900/50 hover:bg-neutral-800/70 text-neutral-300"
                                }`}
                              >
                                <span className="text-xs font-mono tracking-widest">{s3d.icons}</span>
                                <span className="text-[10px] mt-0.5 truncate">{s3d.name}</span>
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Status Note */}
              {!solution.isBalanced && (
                <div className="rounded border border-amber-800/80 bg-amber-950/40 p-2.5 text-xs text-amber-200">
                  ⚠️ <strong>Notice:</strong> In Destiny 2, the three outside statues always start with exactly two Circles, two Triangles, and two Squares combined (e.g. Sphere + Pyramid + Cube, or Cone + Cylinder + Prism). Please verify what each statue is holding.
                </div>
              )}
            </div>

            {/* Solution & Cut Sequence Output (5 Cols on side-by-side screens) */}
            <div className={`flex flex-col rounded-lg border border-purple-900/70 bg-purple-950/20 ${isOverlay ? "p-3 md:col-span-5" : "p-4 xl:col-span-5"}`}>
              <div className={`flex items-center justify-between border-b border-purple-800/50 ${isOverlay ? "mb-2 pb-1.5" : "mb-3 pb-2"}`}>
                <div>
                  <span className="text-sm font-bold text-purple-200">⚔️ Exact Dissection Sequence</span>
                  <div className="text-[10px] text-purple-300/80">BFS Shortest-Path Solution</div>
                </div>
                <span className="rounded bg-purple-900/80 border border-purple-700/60 px-2.5 py-0.5 text-xs font-extrabold text-purple-200">
                  {solution.steps.length} {solution.steps.length === 1 ? "Cut" : "Cuts"} Needed
                </span>
              </div>

              {/* Goal Targets */}
              <div className={`rounded border border-neutral-800 bg-neutral-950/90 ${isOverlay ? "mb-2.5 p-2" : "mb-3.5 p-3"}`}>
                <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 block mb-1.5">
                  Goal Statues (Must NOT contain inside player's callout):
                </span>
                <div className="grid grid-cols-3 gap-1.5 text-center text-xs">
                  <div className="rounded border border-neutral-800/90 bg-neutral-900/70 p-1.5">
                    <span className="text-[9px] text-neutral-400 block mb-0.5">Left</span>
                    <span className="font-bold text-amber-300 block text-xs">{solution.target3D.Left}</span>
                    <span className="text-[9px] text-neutral-400 font-mono">
                      {SHAPE_3D_COMPOSITION[solution.target3D.Left].map(s => SHAPE_2D_ICONS[s].icon).join("+")}
                    </span>
                  </div>

                  <div className="rounded border border-neutral-800/90 bg-neutral-900/70 p-1.5">
                    <span className="text-[9px] text-neutral-400 block mb-0.5">Middle</span>
                    <span className="font-bold text-amber-300 block text-xs">{solution.target3D.Middle}</span>
                    <span className="text-[9px] text-neutral-400 font-mono">
                      {SHAPE_3D_COMPOSITION[solution.target3D.Middle].map(s => SHAPE_2D_ICONS[s].icon).join("+")}
                    </span>
                  </div>

                  <div className="rounded border border-neutral-800/90 bg-neutral-900/70 p-1.5">
                    <span className="text-[9px] text-neutral-400 block mb-0.5">Right</span>
                    <span className="font-bold text-amber-300 block text-xs">{solution.target3D.Right}</span>
                    <span className="text-[9px] text-neutral-400 font-mono">
                      {SHAPE_3D_COMPOSITION[solution.target3D.Right].map(s => SHAPE_2D_ICONS[s].icon).join("+")}
                    </span>
                  </div>
                </div>
              </div>

              {/* Step Sequence Cards */}
              {!solution.isBalanced ? (
                <div className="flex-1 rounded border border-amber-800/70 bg-amber-950/30 p-4 text-center text-xs text-amber-200 flex flex-col items-center justify-center">
                  <span className="text-2xl mb-2">⚠️</span>
                  <span>Select a valid combination of 3D shapes to calculate the dissection steps.</span>
                </div>
              ) : solution.steps.length === 0 ? (
                <div className="flex-1 rounded border border-emerald-800/70 bg-emerald-950/30 p-4 text-center text-xs text-emerald-200 flex flex-col items-center justify-center">
                  <span className="text-2xl mb-2">🎉</span>
                  <span className="font-bold text-emerald-300 text-sm">Already Solved!</span>
                  <span className="text-neutral-400 mt-1">
                    All outside statues already match their target 3D shapes.
                  </span>
                </div>
              ) : (
                <div className="flex flex-col gap-2 overflow-y-auto">
                  {solution.steps.map((st, idx) => (
                    <div
                      key={idx}
                      className={`rounded-lg border border-purple-800/60 bg-neutral-950 text-xs shadow-md ${isOverlay ? "p-2" : "p-3"}`}
                    >
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="rounded bg-purple-900/90 px-2 py-0.5 text-[10px] font-extrabold text-purple-200 tracking-wider">
                          CUT #{idx + 1}
                        </span>
                        <span className="text-[10px] text-neutral-400 font-mono">
                          L: {st.resultingShapes.Left} · M: {st.resultingShapes.Middle} · R: {st.resultingShapes.Right}
                        </span>
                      </div>

                      {/* Main action display */}
                      <div className="grid grid-cols-2 gap-1.5 text-xs">
                        {/* Side A */}
                        <div className="rounded border border-neutral-800 bg-neutral-900/60 p-1.5">
                          <span className="text-[9px] uppercase font-bold text-neutral-400 block mb-0.5">
                            Dissect from {st.fromStatue}
                          </span>
                          <div className="flex items-center gap-1 font-bold text-rose-300 text-xs">
                            <span>{SHAPE_2D_ICONS[st.fromShape].icon}</span>
                            <span>{st.fromShape}</span>
                          </div>
                        </div>

                        {/* Side B */}
                        <div className="rounded border border-neutral-800 bg-neutral-900/60 p-1.5">
                          <span className="text-[9px] uppercase font-bold text-neutral-400 block mb-0.5">
                            Dissect from {st.toStatue}
                          </span>
                          <div className="flex items-center gap-1 font-bold text-cyan-300 text-xs">
                            <span>{SHAPE_2D_ICONS[st.toShape].icon}</span>
                            <span>{st.toShape}</span>
                          </div>
                        </div>
                      </div>

                      {/* Resulting statue snapshot */}
                      <div className="mt-1.5 text-[10px] text-neutral-400 flex items-center justify-between border-t border-neutral-800/60 pt-1">
                        <span>Result:</span>
                        <span className="text-purple-300 font-semibold font-mono">
                          {st.fromStatue} ➔ {st.resultingShapes[st.fromStatue]} · {st.toStatue} ➔{" "}
                          {st.resultingShapes[st.toStatue]}
                        </span>
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
      {activeTab === "inside" && (
        <div className="rounded-lg border border-neutral-800 bg-neutral-900/40 p-4 max-w-2xl">
          <h2 className="text-sm font-bold text-purple-300 mb-1">Inside Solo Room Escape Guide</h2>
          <p className="text-xs text-neutral-400 mb-4">
            Select your own statue symbol and the 2 starting shapes on your wall to get your step-by-step escape guide.
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
