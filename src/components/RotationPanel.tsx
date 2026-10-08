import { useState, useEffect } from "react";
import {
  getResetState,
  type LostSector,
  type NightfallItem,
  type RaidRotation,
  type DungeonRotation,
  type WeeklyTimelineEntry,
} from "../data/rotations";

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
  const [showFullTimeline, setShowFullTimeline] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setResetData(getResetState());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const {
    currentLostSector,
    exoticSlot,
    currentNightfall,
    currentRaids,
    currentDungeons,
    nextDaily,
    nextWeekly,
    nextWeek,
    timeline,
    isXurActive,
  } = resetData;

  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-y-auto bg-neutral-950 p-4 text-neutral-100">
      {/* Top Banner / Reset Timers */}
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3 rounded-lg border border-neutral-800 bg-neutral-900/80 p-3.5 backdrop-blur">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-base font-bold tracking-wide text-purple-300">Daily & Weekly Reset Rotations</h1>
            <span className="rounded bg-emerald-950/80 border border-emerald-700/60 px-2 py-0.5 text-[10px] font-bold text-emerald-300">
              ✓ D2RAD Live Synced
            </span>
          </div>
          <p className="text-xs text-neutral-400 mt-0.5">
            Verified dual-slot raid & dungeon rotators, GM weapon of the week, and multi-week timeline predictions
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
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
          <div
            className={`rounded border px-3 py-1.5 text-center ${
              isXurActive
                ? "border-emerald-700 bg-emerald-950/40 text-emerald-300"
                : "border-neutral-800 bg-neutral-950/60 text-neutral-500"
            }`}
          >
            <div className="text-[10px] font-medium uppercase tracking-wider">Agent of the Nine</div>
            <div className="text-xs font-semibold">{isXurActive ? "Xûr Active (Tower Hangar)" : "Leaves on Tue"}</div>
          </div>
        </div>
      </div>

      {/* Main Active Activities Grid */}
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
                  <span
                    key={c}
                    className="rounded bg-red-950/60 border border-red-800/50 px-1.5 py-0.5 text-[10px] font-medium text-red-300"
                  >
                    {c}
                  </span>
                ))}
              </div>
            </div>

            <div className="rounded border border-neutral-800/80 bg-neutral-950/60 p-2">
              <span className="text-[10px] uppercase text-neutral-500 block mb-1">Shields</span>
              <div className="flex flex-wrap gap-1">
                {currentLostSector.shields.map(s => (
                  <span
                    key={s}
                    className="rounded bg-cyan-950/50 border border-cyan-800/40 px-1.5 py-0.5 text-[10px] font-medium text-cyan-300"
                  >
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

        {/* Card 2: Weekly Grandmaster Nightfall & Weapon with Image */}
        <div className="flex flex-col rounded-lg border border-neutral-800 bg-neutral-900/40 p-4 transition-colors hover:border-neutral-700">
          <div className="mb-2 flex items-center justify-between">
            <span className="rounded bg-blue-950/60 px-2 py-0.5 text-[11px] font-semibold tracking-wide text-blue-300 border border-blue-800/60">
              Grandmaster & Nightfall of the Week
            </span>
            <span className="rounded bg-yellow-950/60 px-2 py-0.5 text-[10px] font-bold text-yellow-300 border border-yellow-800/40">
              Adept Guaranteed
            </span>
          </div>

          <div className="flex items-center gap-3.5 mb-3">
            {/* High-res weapon thumbnail */}
            <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg border-2 border-yellow-500/80 bg-neutral-950 shadow-lg shadow-yellow-950/30">
              <img
                src={currentNightfall.iconUrl}
                alt={currentNightfall.weapon}
                className="h-full w-full object-cover"
                loading="lazy"
                onError={e => {
                  // Fallback if image fails
                  (e.target as HTMLElement).style.display = "none";
                }}
              />
              <div className="absolute bottom-0 right-0 rounded-tl bg-neutral-950/90 px-1 py-0.5 text-[9px] font-extrabold text-yellow-400">
                ADEPT
              </div>
            </div>

            <div>
              <h2 className="text-base font-bold text-neutral-100">{currentNightfall.strike}</h2>
              <div className="text-xs font-semibold text-yellow-300 mt-0.5">{currentNightfall.weapon}</div>
              <div className="text-[11px] text-neutral-400 font-mono mt-0.5">
                Adept drop on Grandmaster platinum clear
              </div>
            </div>
          </div>

          <div className="mt-auto grid grid-cols-2 gap-2 text-xs">
            <div className="rounded border border-neutral-800/80 bg-neutral-950/60 p-2">
              <span className="text-[10px] uppercase text-neutral-500 block mb-1">Champions</span>
              <div className="flex flex-wrap gap-1">
                {currentNightfall.champions.map(c => (
                  <span
                    key={c}
                    className="rounded bg-red-950/60 border border-red-800/50 px-1.5 py-0.5 text-[10px] font-medium text-red-300"
                  >
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

        {/* Card 3: Featured Raids (D2RAD Dual-Slot) */}
        <div className="flex flex-col rounded-lg border border-purple-900/60 bg-purple-950/20 p-4 transition-colors hover:border-purple-700/80">
          <div className="mb-2 flex items-center justify-between">
            <span className="rounded bg-purple-950/80 px-2 py-0.5 text-[11px] font-semibold tracking-wide text-purple-300 border border-purple-700/60">
              Weekly Featured Raids (2 Active)
            </span>
            <span className="text-xs text-emerald-400 font-semibold">Uncapped Spoils & Drops</span>
          </div>

          <div className="space-y-2.5 my-1">
            {currentRaids.map((raid, idx) => (
              <div
                key={raid.id}
                className="flex items-center gap-3 rounded border border-neutral-800/80 bg-neutral-950/80 p-2.5"
              >
                {raid.exoticIconUrl ? (
                  <img
                    src={raid.exoticIconUrl}
                    alt={raid.featuredExotic}
                    className="h-10 w-10 shrink-0 rounded border border-purple-700/60 object-cover"
                    loading="lazy"
                  />
                ) : (
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded border border-purple-800/60 bg-purple-950 font-bold text-purple-300">
                    {idx + 1}
                  </div>
                )}
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-neutral-100 truncate">{raid.name}</span>
                    <span className="text-[10px] font-semibold text-purple-400">Slot 0{idx + 1}</span>
                  </div>
                  <div className="text-[11px] text-neutral-400">
                    Exotic: <span className="font-medium text-purple-300">{raid.featuredExotic}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-auto rounded border border-neutral-800/80 bg-neutral-950/60 p-2 text-xs text-neutral-400">
            💡 All encounters reward Pinnacle gear and can be farmed repeatedly this week for unlimited weapon drops & spoils.
          </div>
        </div>

        {/* Card 4: Featured Dungeons (D2RAD Dual-Slot) */}
        <div className="flex flex-col rounded-lg border border-indigo-900/60 bg-indigo-950/20 p-4 transition-colors hover:border-indigo-700/80">
          <div className="mb-2 flex items-center justify-between">
            <span className="rounded bg-indigo-950/80 px-2 py-0.5 text-[11px] font-semibold tracking-wide text-indigo-300 border border-indigo-700/60">
              Weekly Featured Dungeons (2 Active)
            </span>
            <span className="text-xs text-emerald-400 font-semibold">Pinnacle Rotator</span>
          </div>

          <div className="space-y-2.5 my-1">
            {currentDungeons.map((dungeon, idx) => (
              <div
                key={dungeon.id}
                className="flex items-center gap-3 rounded border border-neutral-800/80 bg-neutral-950/80 p-2.5"
              >
                {dungeon.exoticIconUrl ? (
                  <img
                    src={dungeon.exoticIconUrl}
                    alt={dungeon.featuredExotic}
                    className="h-10 w-10 shrink-0 rounded border border-indigo-700/60 object-cover"
                    loading="lazy"
                  />
                ) : (
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded border border-indigo-800/60 bg-indigo-950 font-bold text-indigo-300">
                    {idx + 1}
                  </div>
                )}
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-neutral-100 truncate">{dungeon.name}</span>
                    <span className="text-[10px] font-semibold text-indigo-400">Slot 0{idx + 1}</span>
                  </div>
                  <div className="text-[11px] text-neutral-400">
                    Exotic: <span className="font-medium text-indigo-300">{dungeon.featuredExotic}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-auto rounded border border-neutral-800/80 bg-neutral-950/60 p-2 text-xs text-neutral-400">
            🗝️ Final boss drops Pinnacle gear and is farmable with no weekly loot lockouts on exotic chances or artifice rolls.
          </div>
        </div>
      </div>

      {/* Next Week's Predictions (D2RAD Model) */}
      <div className="mt-4 rounded-lg border border-neutral-800 bg-neutral-900/60 p-4">
        <div className="mb-3 flex items-center justify-between border-b border-neutral-800 pb-2">
          <div className="flex items-center gap-2">
            <span className="rounded bg-sky-950/80 border border-sky-700/60 px-2 py-0.5 text-[11px] font-bold text-sky-300">
              ◇ Next Week Predictions
            </span>
            <span className="text-xs font-semibold text-neutral-400">
              Reset: {nextWeek.formattedDate} at 17:00 UTC
            </span>
          </div>
          <span className="text-[11px] text-neutral-500 font-mono">D2RAD Cycle Engine</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {/* Next Raids */}
          <div className="rounded border border-neutral-800 bg-neutral-950/70 p-3">
            <span className="text-[10px] font-bold uppercase tracking-wider text-purple-400 block mb-2">
              Upcoming Raids
            </span>
            <div className="space-y-1.5">
              {nextWeek.raids.map(r => (
                <div key={r.id} className="text-xs font-semibold text-neutral-200 flex items-center gap-1.5">
                  <span className="text-purple-400">✦</span>
                  <span>{r.name}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Next Dungeons */}
          <div className="rounded border border-neutral-800 bg-neutral-950/70 p-3">
            <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-400 block mb-2">
              Upcoming Dungeons
            </span>
            <div className="space-y-1.5">
              {nextWeek.dungeons.map(d => (
                <div key={d.id} className="text-xs font-semibold text-neutral-200 flex items-center gap-1.5">
                  <span className="text-indigo-400">🗝️</span>
                  <span>{d.name}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Next Nightfall & Weapon */}
          <div className="rounded border border-neutral-800 bg-neutral-950/70 p-3 flex items-center gap-3">
            <img
              src={nextWeek.nightfall.iconUrl}
              alt={nextWeek.nightfall.weapon}
              className="h-12 w-12 shrink-0 rounded border border-yellow-600/70 object-cover"
              loading="lazy"
            />
            <div className="min-w-0 flex-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-yellow-400 block mb-0.5">
                Upcoming GM Weapon
              </span>
              <div className="text-xs font-bold text-neutral-100 truncate">{nextWeek.nightfall.weapon}</div>
              <div className="text-[10px] text-neutral-400 truncate">{nextWeek.nightfall.strike}</div>
            </div>
          </div>
        </div>
      </div>

      {/* D2RAD Rotation Timeline (Interactive & Collapsible) */}
      <div className="mt-4 rounded-lg border border-neutral-800 bg-neutral-900/40 p-4">
        <div className="mb-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h2 className="text-sm font-bold text-neutral-100">📅 D2RAD Rotation Timeline</h2>
            <span className="text-xs text-neutral-400">Past, Current, and Upcoming Weekly Reset Projections</span>
          </div>
          <button
            onClick={() => setShowFullTimeline(!showFullTimeline)}
            className="rounded border border-neutral-700 bg-neutral-800/80 px-2.5 py-1 text-xs font-medium text-neutral-300 hover:bg-neutral-700 hover:text-white transition-colors"
          >
            {showFullTimeline ? "Collapse Timeline" : "Expand Full Timeline"}
          </button>
        </div>

        {/* Timeline Table */}
        <div className="overflow-x-auto rounded border border-neutral-800 bg-neutral-950">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-neutral-800 bg-neutral-900/70 font-semibold text-neutral-400">
                <th className="px-3.5 py-2.5">Reset Date</th>
                <th className="px-3.5 py-2.5">Featured Raids</th>
                <th className="px-3.5 py-2.5">Featured Dungeons</th>
                <th className="px-3.5 py-2.5">Nightfall / GM Weapon</th>
                <th className="px-3.5 py-2.5 text-right">Verification</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-800/60 font-medium">
              {(showFullTimeline ? timeline : timeline.slice(0, 4)).map((entry, idx) => (
                <tr
                  key={idx}
                  className={`transition-colors ${
                    entry.isCurrent
                      ? "bg-purple-950/30 font-semibold"
                      : entry.isNext
                      ? "bg-sky-950/20"
                      : "hover:bg-neutral-900/40"
                  }`}
                >
                  <td className="px-3.5 py-2.5 whitespace-nowrap">
                    <div className="flex items-center gap-1.5">
                      {entry.isCurrent && (
                        <span className="rounded bg-purple-900 px-1.5 py-0.2 text-[9px] font-extrabold text-purple-200 uppercase">
                          Current
                        </span>
                      )}
                      {entry.isNext && (
                        <span className="rounded bg-sky-900 px-1.5 py-0.2 text-[9px] font-extrabold text-sky-200 uppercase">
                          Next
                        </span>
                      )}
                      <span className={entry.isCurrent ? "text-purple-300 font-bold" : "text-neutral-300"}>
                        {entry.formattedDate}
                      </span>
                    </div>
                  </td>

                  <td className="px-3.5 py-2.5">
                    <div className="flex items-center gap-1 text-neutral-200">
                      <span>{entry.raids[0].name}</span>
                      <span className="text-neutral-500">·</span>
                      <span>{entry.raids[1].name}</span>
                    </div>
                  </td>

                  <td className="px-3.5 py-2.5">
                    <div className="flex items-center gap-1 text-neutral-200">
                      <span>{entry.dungeons[0].name}</span>
                      <span className="text-neutral-500">·</span>
                      <span>{entry.dungeons[1].name}</span>
                    </div>
                  </td>

                  <td className="px-3.5 py-2.5">
                    <div className="flex items-center gap-2">
                      <img
                        src={entry.nightfall.iconUrl}
                        alt={entry.nightfall.weapon}
                        className="h-6 w-6 rounded border border-neutral-700 object-cover"
                        loading="lazy"
                      />
                      <span className="text-yellow-300/90 text-[11px] truncate">{entry.nightfall.weapon}</span>
                    </div>
                  </td>

                  <td className="px-3.5 py-2.5 text-right whitespace-nowrap">
                    <span
                      className={`inline-flex items-center gap-1 rounded px-2 py-0.5 text-[10px] font-bold ${
                        entry.state === "Live data verified"
                          ? "bg-emerald-950/70 border border-emerald-800 text-emerald-300"
                          : "bg-neutral-900 border border-neutral-700 text-neutral-400"
                      }`}
                    >
                      {entry.state === "Live data verified" ? "✓ Verified" : "◇ Predicted"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Bonus Rep & Sync Footer */}
      <div className="mt-4 rounded-lg border border-neutral-800 bg-neutral-900/30 p-3 text-xs text-neutral-400 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="font-bold text-purple-400">✨ Ada-1 Synthesis:</span>
          <span>Pick up 10 synthweave bounties per class for transmog unlock materials before seasonal reset.</span>
        </div>
        <div className="text-[11px] text-neutral-500">
          Synchronized with Destiny 2 Server Clocks & D2RAD Canon Cycle (17:00 UTC)
        </div>
      </div>
    </div>
  );
}
