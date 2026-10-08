import { useState, useEffect } from "react";
import { getResetState, type LostSector, type NightfallItem, type RaidRotation, type DungeonRotation } from "../data/rotations";

function formatCountdown(target: Date): string {
  const diff = target.getTime() - Date.now();
  if (diff <= 0) return "Resetting...";
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const secs = Math.floor((diff % (1000 * 60)) / 1000);

  if (hours > 24) {
    const days = Math.floor(hours / 24);
    const remHours = hours % 24;
    return `${days}d ${remHours}h ${mins}m`;
  }
  return `${hours}h ${mins}m ${secs}s`;
}

export default function RotationPanel() {
  const [resetData, setResetData] = useState(() => getResetState());
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setNow(new Date());
      setResetData(getResetState());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const {
    currentLostSector,
    exoticSlot,
    currentNightfall,
    currentRaid,
    currentDungeon,
    nextDaily,
    nextWeekly,
    isXurActive,
  } = resetData;

  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-y-auto bg-neutral-950 p-4 text-neutral-100">
      {/* Top Banner / Timers */}
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3 rounded-lg border border-neutral-800 bg-neutral-900/80 p-3.5 backdrop-blur">
        <div>
          <h1 className="text-base font-bold tracking-wide text-purple-300">Daily & Weekly Reset Rotations</h1>
          <p className="text-xs text-neutral-400">Live active Master Lost Sectors, Nightfall weapons, and Featured Raids</p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Daily Countdown */}
          <div className="rounded border border-neutral-800 bg-neutral-950/70 px-3 py-1.5 text-center">
            <div className="text-[10px] font-medium uppercase tracking-wider text-neutral-500">Daily Reset</div>
            <div className="font-mono text-xs font-semibold text-amber-300">{formatCountdown(nextDaily)}</div>
          </div>

          {/* Weekly Countdown */}
          <div className="rounded border border-neutral-800 bg-neutral-950/70 px-3 py-1.5 text-center">
            <div className="text-[10px] font-medium uppercase tracking-wider text-neutral-500">Weekly Reset</div>
            <div className="font-mono text-xs font-semibold text-purple-300">{formatCountdown(nextWeekly)}</div>
          </div>

          {/* Xûr Badge */}
          <div className={`rounded border px-3 py-1.5 text-center ${
            isXurActive
              ? "border-emerald-700 bg-emerald-950/40 text-emerald-300"
              : "border-neutral-800 bg-neutral-950/60 text-neutral-500"
          }`}>
            <div className="text-[10px] font-medium uppercase tracking-wider">Agent of the Nine</div>
            <div className="text-xs font-semibold">{isXurActive ? "Xûr Active (Tower Hangar)" : "Leaves on Tue"}</div>
          </div>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {/* Card 1: Master & Legend Lost Sector */}
        <div className="flex flex-col rounded-lg border border-neutral-800 bg-neutral-900/40 p-4 transition-colors hover:border-neutral-700">
          <div className="mb-2 flex items-center justify-between">
            <span className="rounded bg-amber-950/60 px-2 py-0.5 text-[11px] font-semibold tracking-wide text-amber-300 border border-amber-800/60">
              Active Master / Legend Lost Sector
            </span>
            <span className="text-xs font-bold text-purple-400">Exotic: {exoticSlot}</span>
          </div>

          <h2 className="text-lg font-bold text-neutral-100">{currentLostSector.name}</h2>
          <div className="mb-3 text-xs text-neutral-400">📍 {currentLostSector.destination}</div>

          <div className="mt-auto grid grid-cols-2 gap-2 text-xs">
            <div className="rounded border border-neutral-800/80 bg-neutral-950/60 p-2">
              <span className="text-[10px] uppercase text-neutral-500 block mb-1">Champions</span>
              <div className="flex flex-wrap gap-1">
                {currentLostSector.champions.map(c => (
                  <span key={c} className="rounded bg-red-950/60 border border-red-800/50 px-1.5 py-0.5 text-[10px] font-medium text-red-300">
                    {c}
                  </span>
                ))}
              </div>
            </div>

            <div className="rounded border border-neutral-800/80 bg-neutral-950/60 p-2">
              <span className="text-[10px] uppercase text-neutral-500 block mb-1">Shields</span>
              <div className="flex flex-wrap gap-1">
                {currentLostSector.shields.map(s => (
                  <span key={s} className="rounded bg-cyan-950/50 border border-cyan-800/40 px-1.5 py-0.5 text-[10px] font-medium text-cyan-300">
                    {s}
                  </span>
                ))}
              </div>
            </div>

            <div className="rounded border border-neutral-800/80 bg-neutral-950/60 p-2">
              <span className="text-[10px] uppercase text-neutral-500 block">Surge</span>
              <span className="font-medium text-emerald-300">{currentLostSector.surge}</span>
            </div>

            <div className="rounded border border-neutral-800/80 bg-neutral-950/60 p-2">
              <span className="text-[10px] uppercase text-neutral-500 block">Threat</span>
              <span className="font-medium text-rose-400">{currentLostSector.threat}</span>
            </div>
          </div>
        </div>

        {/* Card 2: Weekly Nightfall */}
        <div className="flex flex-col rounded-lg border border-neutral-800 bg-neutral-900/40 p-4 transition-colors hover:border-neutral-700">
          <div className="mb-2 flex items-center justify-between">
            <span className="rounded bg-blue-950/60 px-2 py-0.5 text-[11px] font-semibold tracking-wide text-blue-300 border border-blue-800/60">
              Grandmaster & Nightfall of the Week
            </span>
            <span className="rounded bg-yellow-950/60 px-2 py-0.5 text-[10px] font-bold text-yellow-300 border border-yellow-800/40">
              Adept Drop
            </span>
          </div>

          <h2 className="text-lg font-bold text-neutral-100">{currentNightfall.strike}</h2>
          <div className="mb-3 text-xs text-neutral-400">Weapon: <span className="font-semibold text-yellow-300">{currentNightfall.weapon}</span></div>

          <div className="mt-auto grid grid-cols-2 gap-2 text-xs">
            <div className="rounded border border-neutral-800/80 bg-neutral-950/60 p-2">
              <span className="text-[10px] uppercase text-neutral-500 block mb-1">Champions</span>
              <div className="flex flex-wrap gap-1">
                {currentNightfall.champions.map(c => (
                  <span key={c} className="rounded bg-red-950/60 border border-red-800/50 px-1.5 py-0.5 text-[10px] font-medium text-red-300">
                    {c}
                  </span>
                ))}
              </div>
            </div>

            <div className="rounded border border-neutral-800/80 bg-neutral-950/60 p-2">
              <span className="text-[10px] uppercase text-neutral-500 block">Surges</span>
              <span className="font-medium text-emerald-300">{currentNightfall.surge}</span>
            </div>
          </div>
        </div>

        {/* Card 3: Featured Raid Rotator */}
        <div className="flex flex-col rounded-lg border border-neutral-800 bg-neutral-900/40 p-4 transition-colors hover:border-neutral-700">
          <div className="mb-2 flex items-center justify-between">
            <span className="rounded bg-purple-950/60 px-2 py-0.5 text-[11px] font-semibold tracking-wide text-purple-300 border border-purple-800/60">
              Weekly Featured Raid
            </span>
            <span className="text-xs text-emerald-400 font-semibold">Uncapped Spoils & Drops</span>
          </div>

          <h3 className="text-lg font-bold text-neutral-100">{currentRaid.name}</h3>
          <p className="mb-3 text-xs text-neutral-400">
            Exotic Chance: <span className="text-purple-300 font-semibold">{currentRaid.featuredExotic}</span>
          </p>

          <div className="mt-auto rounded border border-neutral-800 bg-neutral-950/70 p-2 text-xs text-neutral-300">
            💡 All encounters reward Pinnacle gear and can be farmed repeatedly this week for loot and spoils of conquest.
          </div>
        </div>

        {/* Card 4: Featured Dungeon Rotator */}
        <div className="flex flex-col rounded-lg border border-neutral-800 bg-neutral-900/40 p-4 transition-colors hover:border-neutral-700">
          <div className="mb-2 flex items-center justify-between">
            <span className="rounded bg-indigo-950/60 px-2 py-0.5 text-[11px] font-semibold tracking-wide text-indigo-300 border border-indigo-800/60">
              Weekly Featured Dungeon
            </span>
            <span className="text-xs text-emerald-400 font-semibold">Pinnacle Rotator</span>
          </div>

          <h3 className="text-lg font-bold text-neutral-100">{currentDungeon.name}</h3>
          <p className="mb-3 text-xs text-neutral-400">
            Exotic Reward: <span className="text-indigo-300 font-semibold">{currentDungeon.featuredExotic}</span>
          </p>

          <div className="mt-auto rounded border border-neutral-800 bg-neutral-950/70 p-2 text-xs text-neutral-300">
            🗝️ Final boss drops Pinnacle gear and is farmable with no weekly loot lockouts.
          </div>
        </div>
      </div>

      {/* Bonus Rep & Checklist Footer */}
      <div className="mt-4 rounded-lg border border-neutral-800 bg-neutral-900/30 p-3 text-xs text-neutral-400 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="font-bold text-purple-400">✨ Ada-1 Synthesis:</span>
          <span>Pick up 10 synthweave bounties per class for transmog unlock materials before seasonal reset.</span>
        </div>
        <div className="text-[11px] text-neutral-500">
          Auto-synchronized with Destiny 2 Server Clocks (17:00 UTC)
        </div>
      </div>
    </div>
  );
}
