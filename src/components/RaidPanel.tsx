import { useState, useMemo, useRef } from "react";
import { RAIDS_DATA, type RaidGuide } from "../data/raids";

export default function RaidPanel() {
  const [selectedRaidId, setSelectedRaidId] = useState<string>("ron");
  const [searchQuery, setSearchQuery] = useState("");
  const iframeRef = useRef<HTMLIFrameElement | null>(null);

  const filteredRaids = useMemo(() => {
    if (!searchQuery.trim()) return RAIDS_DATA;
    const q = searchQuery.toLowerCase();
    return RAIDS_DATA.filter(r => 
      r.name.toLowerCase().includes(q) ||
      r.location.toLowerCase().includes(q) ||
      r.exotic.name.toLowerCase().includes(q) ||
      r.encounters.some(e => 
        e.name.toLowerCase().includes(q) ||
        e.summary.toLowerCase().includes(q)
      )
    );
  }, [searchQuery]);

  const currentRaid: RaidGuide = useMemo(() => {
    return RAIDS_DATA.find(r => r.id === selectedRaidId) || RAIDS_DATA[0];
  }, [selectedRaidId]);

  return (
    <div className="flex h-full min-h-0 flex-1 overflow-hidden bg-neutral-950 text-neutral-100 relative">
      {/* Sidebar: Raid List */}
      <div className="flex w-72 shrink-0 flex-col border-r border-neutral-800 bg-neutral-900/60 backdrop-blur-md">
        {/* Search Header */}
        <div className="border-b border-neutral-800 p-3">
          <div className="relative">
            <input
              type="text"
              placeholder="Search raids, bosses, loot..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full rounded-lg border border-neutral-700 bg-neutral-900/90 px-3 py-2 pl-8 text-xs text-neutral-200 placeholder-neutral-500 focus:border-purple-500 focus:outline-none transition-colors"
            />
            <span className="absolute left-2.5 top-2.5 text-xs text-neutral-500">🔍</span>
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-2 top-2 text-xs text-neutral-400 hover:text-neutral-200"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {/* Raid Items List */}
        <div className="flex-1 overflow-y-auto p-2 space-y-1 custom-scrollbar">
          {filteredRaids.map(raid => {
            const isSelected = raid.id === selectedRaidId;
            return (
              <button
                key={raid.id}
                onClick={() => setSelectedRaidId(raid.id)}
                className={`w-full flex items-center gap-3 rounded-lg px-3 py-2.5 text-left transition-all ${
                  isSelected
                    ? "bg-purple-600/20 border border-purple-500/50 shadow-sm text-purple-200"
                    : "hover:bg-neutral-800/60 border border-transparent text-neutral-300 hover:text-neutral-100"
                }`}
              >
                {/* Thumbnail */}
                <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-md border border-neutral-700/80 bg-neutral-800 flex items-center justify-center">
                  {raid.bannerImage ? (
                    <img 
                      src={raid.bannerImage} 
                      alt={raid.name}
                      className="h-full w-full object-cover"
                      loading="lazy"
                    />
                  ) : (
                    <span className="text-sm font-bold text-purple-400">⚔️</span>
                  )}
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-1">
                    <span className={`text-xs font-semibold truncate ${isSelected ? "text-purple-300 font-bold" : "text-neutral-200"}`}>
                      {raid.name}
                    </span>
                  </div>
                  <div className="text-[11px] text-neutral-400 truncate mt-0.5">
                    {raid.location}
                  </div>
                  <div className="text-[10px] text-purple-400/90 font-medium truncate mt-0.5">
                    ✨ {raid.exotic.name}
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Footer info */}
        <div className="border-t border-neutral-800/80 p-2.5 text-[11px] text-neutral-400 flex items-center justify-between bg-neutral-950/40">
          <span>{filteredRaids.length} Raids</span>
          <span className="text-purple-400">Exact Section Order</span>
        </div>
      </div>

      {/* Main Content: Embedded Guide with In-Order Section Tabs */}
      <div className="flex flex-1 flex-col overflow-hidden bg-neutral-950">
        {/* Top Activity Bar */}
        <div className="flex items-center justify-between border-b border-neutral-800/80 bg-neutral-900/40 px-4 py-2.5">
          <div className="flex items-center gap-3">
            <span className="text-xs font-bold uppercase tracking-wider text-purple-400 bg-purple-500/10 px-2 py-0.5 rounded border border-purple-500/20">
              Raid Guide
            </span>
            <h2 className="text-sm font-bold text-neutral-100 flex items-center gap-2">
              {currentRaid.name}
              <span className="text-xs font-normal text-neutral-400">({currentRaid.location})</span>
            </h2>
          </div>

          <div className="flex items-center gap-2 text-xs text-neutral-400">
            <button
              onClick={() => {
                if (iframeRef.current) {
                  iframeRef.current.src = `/guides/${selectedRaidId}.html`;
                }
              }}
              className="rounded bg-neutral-800/80 hover:bg-neutral-700 px-2.5 py-1 text-[11px] text-neutral-200 transition-colors"
              title="Reset view"
            >
              🔄 Reset
            </button>
          </div>
        </div>

        {/* Embedded Guide Viewport */}
        <div className="flex-1 overflow-hidden relative">
          <iframe
            ref={iframeRef}
            key={selectedRaidId}
            src={`/guides/${selectedRaidId}.html`}
            title={currentRaid.name}
            className="w-full h-full border-0 bg-[#0b0e14]"
            sandbox="allow-same-origin allow-scripts allow-popups"
          />
        </div>
      </div>
    </div>
  );
}
