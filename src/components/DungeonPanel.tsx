import { useState, useMemo, useRef } from "react";
import { DUNGEONS_DATA, type DungeonGuide } from "../data/dungeons";

export default function DungeonPanel() {
  const [selectedDungeonId, setSelectedDungeonId] = useState<string>("sd");
  const [searchQuery, setSearchQuery] = useState("");
  const iframeRef = useRef<HTMLIFrameElement | null>(null);

  const filteredDungeons = useMemo(() => {
    if (!searchQuery.trim()) return DUNGEONS_DATA;
    const q = searchQuery.toLowerCase();
    return DUNGEONS_DATA.filter(d => 
      d.name.toLowerCase().includes(q) ||
      d.location.toLowerCase().includes(q) ||
      d.exotic.name.toLowerCase().includes(q) ||
      d.encounters.some(e => 
        e.name.toLowerCase().includes(q) ||
        e.summary.toLowerCase().includes(q)
      )
    );
  }, [searchQuery]);

  const currentDungeon: DungeonGuide = useMemo(() => {
    return DUNGEONS_DATA.find(d => d.id === selectedDungeonId) || DUNGEONS_DATA[0];
  }, [selectedDungeonId]);

  return (
    <div className="flex h-full min-h-0 flex-1 overflow-hidden bg-neutral-950 text-neutral-100 relative">
      {/* Sidebar: Dungeon List */}
      <div className="flex w-72 shrink-0 flex-col border-r border-neutral-800 bg-neutral-900/60 backdrop-blur-md">
        {/* Search Header */}
        <div className="border-b border-neutral-800 p-3">
          <div className="relative">
            <input
              type="text"
              placeholder="Search dungeons, bosses, loot..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full rounded-lg border border-neutral-700 bg-neutral-900/90 px-3 py-2 pl-8 text-xs text-neutral-200 placeholder-neutral-500 focus:border-amber-500 focus:outline-none transition-colors"
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

        {/* Dungeon Items List */}
        <div className="flex-1 overflow-y-auto p-2 space-y-1 custom-scrollbar">
          {filteredDungeons.map(dungeon => {
            const isSelected = dungeon.id === selectedDungeonId;
            return (
              <button
                key={dungeon.id}
                onClick={() => setSelectedDungeonId(dungeon.id)}
                className={`w-full flex items-center gap-3 rounded-lg px-3 py-2.5 text-left transition-all ${
                  isSelected
                    ? "bg-amber-600/20 border border-amber-500/50 shadow-sm text-amber-200"
                    : "hover:bg-neutral-800/60 border border-transparent text-neutral-300 hover:text-neutral-100"
                }`}
              >
                {/* Thumbnail */}
                <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-md border border-neutral-700/80 bg-neutral-800 flex items-center justify-center">
                  {dungeon.bannerImage ? (
                    <img 
                      src={dungeon.bannerImage} 
                      alt={dungeon.name}
                      className="h-full w-full object-cover"
                      loading="lazy"
                    />
                  ) : (
                    <span className="text-sm font-bold text-amber-400">🗝️</span>
                  )}
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-1">
                    <span className={`text-xs font-semibold truncate ${isSelected ? "text-amber-300 font-bold" : "text-neutral-200"}`}>
                      {dungeon.name}
                    </span>
                  </div>
                  <div className="text-[11px] text-neutral-400 truncate mt-0.5">
                    {dungeon.location}
                  </div>
                  <div className="text-[10px] text-amber-400/90 font-medium truncate mt-0.5">
                    ✨ {dungeon.exotic.name}
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Footer info */}
        <div className="border-t border-neutral-800/80 p-2.5 text-[11px] text-neutral-400 flex items-center justify-between bg-neutral-950/40">
          <span>{filteredDungeons.length} Dungeons</span>
          <span className="text-amber-400">Exact Section Order</span>
        </div>
      </div>

      {/* Main Content: Embedded Guide with In-Order Section Tabs */}
      <div className="flex flex-1 flex-col overflow-hidden bg-neutral-950">
        {/* Top Activity Bar */}
        <div className="flex items-center justify-between border-b border-neutral-800/80 bg-neutral-900/40 px-4 py-2.5">
          <div className="flex items-center gap-3">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
              Dungeon Guide
            </span>
            <h2 className="text-sm font-bold text-neutral-100 flex items-center gap-2">
              {currentDungeon.name}
              <span className="text-xs font-normal text-neutral-400">({currentDungeon.location})</span>
            </h2>
          </div>

          <div className="flex items-center gap-2 text-xs text-neutral-400">
            <button
              onClick={() => {
                if (iframeRef.current) {
                  iframeRef.current.src = `/guides/${selectedDungeonId}.html`;
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
            key={selectedDungeonId}
            src={`/guides/${selectedDungeonId}.html`}
            title={currentDungeon.name}
            className="w-full h-full border-0 bg-[#0b0e14]"
            sandbox="allow-same-origin allow-scripts allow-popups"
          />
        </div>
      </div>
    </div>
  );
}
