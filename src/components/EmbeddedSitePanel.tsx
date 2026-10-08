import { useEffect, useRef, useState } from "react";
import * as api from "../lib/api";
import { profileForAccount, type Account } from "../lib/accounts";

export interface SitePanelSite {
  /** Unique id for this site *within this panel*, e.g. "godroll" or "d2ttk" */
  id: string;
  /** Unique webview label, globally unique across the whole app (e.g. "dim", "godroll", "godroll-d2ttk") */
  webviewLabel: string;
  title: string;
  url: string;
  isCustom?: boolean;
}

interface Props {
  /** localStorage key for remembering which site of `sites` was last selected */
  storageKey: string;
  sites: SitePanelSite[];
  /** Whether this tab is the one currently selected */
  active: boolean;
  /** Account profile (isolated browser session). Changing it recreates the webviews. */
  profile?: string;
  /** When provided, enables the per-account "Login" export/import transfer bar.
   * Only passed to the DIM panel, so the feature appears there and not on Godroll. */
  accounts?: Account[];
}

const ZOOM_STEPS = [50, 67, 75, 80, 90, 100, 110, 125, 150, 175, 200];
const DEFAULT_ZOOM = 100;

function loadCustomSites(storageKey: string): SitePanelSite[] {
  try {
    const raw = localStorage.getItem(storageKey + ".customSites");
    return raw ? (JSON.parse(raw) as SitePanelSite[]) : [];
  } catch { return []; }
}

function loadSelected(storageKey: string, sites: SitePanelSite[]): string {
  try {
    const saved = localStorage.getItem(storageKey);
    if (saved && sites.some(s => s.id === saved)) return saved;
  } catch { /* ignore */ }
  return sites[0]?.id ?? "";
}

function loadZoomMap(storageKey: string): Record<string, number> {
  try {
    const raw = localStorage.getItem(storageKey + ".zoom");
    return raw ? (JSON.parse(raw) as Record<string, number>) : {};
  } catch { return {}; }
}

/**
 * Docks one or more real, native child webviews inside this tab's content
 * area — one per entry in `sites` — and shows a dropdown so the user can
 * switch which site is on top, zoom, add custom sites, and reload.
 */
export default function EmbeddedSitePanel({ storageKey, sites: defaultSites, active, profile, accounts }: Props) {
  const [customSites, setCustomSites] = useState<SitePanelSite[]>(() => loadCustomSites(storageKey));
  const sites = [...defaultSites, ...customSites];

  const [selected, setSelected] = useState(() => loadSelected(storageKey, sites));
  const [addSiteOpen, setAddSiteOpen] = useState(false);
  const [newSiteTitle, setNewSiteTitle] = useState("");
  const [newSiteUrl, setNewSiteUrl] = useState("");
  const [addSiteError, setAddSiteError] = useState("");

  // --- Per-account DIM login transfer (only when `accounts` is provided) ---
  const [transferOpen, setTransferOpen] = useState(false);
  const [transferId, setTransferId] = useState<string>(() => {
    const list = accounts ?? [];
    const match = list.find(a => (profileForAccount(a.id) ?? null) === (profile ?? null));
    return match?.id ?? list[0]?.id ?? "Main";
  });
  const [exportedToken, setExportedToken] = useState("");
  const [importText, setImportText] = useState("");
  const [transferBusy, setTransferBusy] = useState(false);
  const [transferMsg, setTransferMsg] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);
  const createdRef = useRef<Set<string>>(new Set());
  const createdProfileRef = useRef<Record<string, string | undefined>>({});
  const [zoomMap, setZoomMap] = useState<Record<string, number>>(() => loadZoomMap(storageKey));

  useEffect(() => {
    try { localStorage.setItem(storageKey, selected); } catch { /* ignore */ }
  }, [storageKey, selected]);

  const site = sites.find(s => s.id === selected) ?? sites[0] ?? defaultSites[0];
  const zoom = zoomMap[site.id] ?? DEFAULT_ZOOM;

  function setZoom(pct: number) {
    setZoomMap(prev => {
      const next = { ...prev, [site.id]: pct };
      try { localStorage.setItem(storageKey + ".zoom", JSON.stringify(next)); } catch { /* ignore */ }
      return next;
    });
    api.setWebPanelZoom(site.webviewLabel, pct / 100).catch(() => {});
  }

  function zoomStep(dir: 1 | -1) {
    const idx = ZOOM_STEPS.reduce((best, v, i) => (Math.abs(v - zoom) < Math.abs(ZOOM_STEPS[best] - zoom) ? i : best), 0);
    const nextIdx = Math.min(ZOOM_STEPS.length - 1, Math.max(0, idx + dir));
    setZoom(ZOOM_STEPS[nextIdx]);
  }

  function handleAddCustomSite(e: React.FormEvent) {
    e.preventDefault();
    setAddSiteError("");
    const title = newSiteTitle.trim();
    let url = newSiteUrl.trim();
    if (!title) { setAddSiteError("Title is required"); return; }
    if (!url) { setAddSiteError("URL is required"); return; }
    if (!url.startsWith("http://") && !url.startsWith("https://")) {
      url = "https://" + url;
    }
    const id = "custom-" + Date.now();
    const webviewLabel = "site-" + id;
    const newSite: SitePanelSite = { id, webviewLabel, title, url, isCustom: true };
    const updated = [...customSites, newSite];
    setCustomSites(updated);
    try { localStorage.setItem(storageKey + ".customSites", JSON.stringify(updated)); } catch { /* ignore */ }
    setSelected(id);
    setNewSiteTitle("");
    setNewSiteUrl("");
    setAddSiteOpen(false);
  }

  function handleDeleteCustomSite(id: string) {
    const toDelete = customSites.find(s => s.id === id);
    if (toDelete && createdRef.current.has(toDelete.id)) {
      api.closeWebPanel(toDelete.webviewLabel).catch(() => {});
      createdRef.current.delete(toDelete.id);
    }
    const updated = customSites.filter(s => s.id !== id);
    setCustomSites(updated);
    try { localStorage.setItem(storageKey + ".customSites", JSON.stringify(updated)); } catch { /* ignore */ }
    if (selected === id) {
      setSelected(defaultSites[0].id);
    }
  }

  function currentBounds(): api.PanelBounds | null {
    const el = containerRef.current;
    if (!el) return null;
    const r = el.getBoundingClientRect();
    if (r.width < 1 || r.height < 1) return null;
    return { x: Math.round(r.left), y: Math.round(r.top), width: Math.round(r.width), height: Math.round(r.height) };
  }

  async function reloadSite() {
    try {
      await api.closeWebPanel(site.webviewLabel);
      createdRef.current.delete(site.id);
      const bounds = currentBounds();
      if (bounds) {
        await api.ensureWebPanel(site.webviewLabel, site.url, bounds, profile);
        createdRef.current.add(site.id);
        createdProfileRef.current[site.id] = profile;
        await api.showWebPanel(site.webviewLabel);
        await api.setWebPanelZoom(site.webviewLabel, zoom / 100).catch(() => {});
      }
    } catch { /* best-effort */ }
  }

  // --- Export DIM Login ---
  async function doExport() {
    setTransferBusy(true);
    setTransferMsg("");
    setExportedToken("");
    try {
      const p = profileForAccount(transferId) ?? null;
      const token = await api.exportDimLogin(p);
      setExportedToken(token);
      setTransferMsg("Ready to copy. Paste this token into another account/device to transfer the login.");
    } catch (e) {
      setTransferMsg("Export failed: " + e);
    } finally {
      setTransferBusy(false);
    }
  }

  async function copyExported() {
    try {
      await navigator.clipboard.writeText(exportedToken);
      setTransferMsg("Copied to clipboard!");
    } catch {
      setTransferMsg("Couldn't write to clipboard — select and copy the text box below.");
    }
  }

  // --- Import DIM Login ---
  async function doImport() {
    const raw = importText.trim();
    if (!raw) return;
    setTransferBusy(true);
    setTransferMsg("");
    try {
      const p = profileForAccount(transferId) ?? null;
      await api.importDimLogin(p, raw);
      setTransferMsg("Login imported! Reloading DIM…");
      setImportText("");
      setTimeout(() => { reloadSite(); }, 600);
    } catch (e) {
      setTransferMsg("Import failed: " + e);
    } finally {
      setTransferBusy(false);
    }
  }

  useEffect(() => {
    let cancelled = false;

    async function sync() {
      const bounds = currentBounds();
      if (!bounds) {
        if (active && !cancelled) {
          requestAnimationFrame(() => {
            if (!cancelled) sync();
          });
        }
        return;
      }
      try {
        for (const s of sites) {
          const isSelected = s.id === site.id;
          if (createdRef.current.has(s.id) && createdProfileRef.current[s.id] !== profile) {
            await api.closeWebPanel(s.webviewLabel);
            createdRef.current.delete(s.id);
          }
          if (isSelected) {
            if (!createdRef.current.has(s.id)) {
              await api.ensureWebPanel(s.webviewLabel, s.url, bounds, profile);
              createdRef.current.add(s.id);
              createdProfileRef.current[s.id] = profile;
              await api.setWebPanelZoom(s.webviewLabel, (zoomMap[s.id] ?? DEFAULT_ZOOM) / 100).catch(() => {});
            } else {
              await api.setWebPanelBounds(s.webviewLabel, bounds);
            }
            if (cancelled) return;
            if (active) await api.showWebPanel(s.webviewLabel);
            else await api.hideWebPanel(s.webviewLabel);
          } else if (createdRef.current.has(s.id)) {
            // Free RAM for unselected background dropdown sites while keeping selected active
            await api.closeWebPanel(s.webviewLabel).catch(() => {});
            createdRef.current.delete(s.id);
          }
        }
      } catch {
        /* best-effort */
      }
    }

    sync();

    const ro = new ResizeObserver(() => { if (createdRef.current.has(site.id)) sync(); });
    if (containerRef.current) ro.observe(containerRef.current);
    window.addEventListener("resize", sync);

    return () => {
      cancelled = true;
      ro.disconnect();
      window.removeEventListener("resize", sync);
      for (const s of sites) {
        if (createdRef.current.has(s.id)) api.hideWebPanel(s.webviewLabel).catch(() => {});
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selected, active, profile, customSites.length]);

  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
      <div className="flex shrink-0 items-center justify-between border-b border-neutral-800 bg-neutral-900/40 px-3 py-1">
        <div className="flex flex-wrap items-center gap-2">
          {sites.length > 1 ? (
            <select
              className="rounded border border-neutral-700 bg-neutral-900 px-1.5 py-0.5 text-[11px] font-medium text-neutral-300 focus:border-purple-500 focus:outline-none"
              value={selected}
              onChange={e => setSelected(e.target.value)}
              title="Switch site"
            >
              {sites.map(s => (
                <option key={s.id} value={s.id}>
                  {s.title} {s.isCustom ? "(Custom)" : ""}
                </option>
              ))}
            </select>
          ) : (
            <span className="text-[11px] font-medium text-neutral-400">{site.title}</span>
          )}

          {site.isCustom && (
            <button
              className="rounded border border-red-900 bg-red-950/40 px-1.5 py-0.5 text-[10px] text-red-300 hover:bg-red-900/60 transition-colors"
              onClick={() => handleDeleteCustomSite(site.id)}
              title="Delete this custom website"
            >
              🗑 Delete
            </button>
          )}

          <button
            className="rounded border border-neutral-700 bg-neutral-800 px-2 py-0.5 text-[11px] text-neutral-300 hover:bg-neutral-700 transition-colors"
            onClick={reloadSite}
            title="Reload current site"
          >
            ↻ Reload
          </button>

          <button
            className="rounded border border-neutral-700 bg-neutral-800 px-2 py-0.5 text-[11px] text-neutral-300 hover:bg-neutral-700 transition-colors"
            onClick={() => setAddSiteOpen(v => !v)}
            title="Add a custom website saved locally"
          >
            + Add Site
          </button>

          <div className="flex items-center overflow-hidden rounded border border-neutral-700">
            <button
              className="px-2 py-0.5 text-[11px] text-neutral-300 hover:bg-neutral-700 transition-colors disabled:opacity-40"
              onClick={() => zoomStep(-1)}
              disabled={zoom <= ZOOM_STEPS[0]}
              title="Zoom out"
            >
              −
            </button>
            <button
              className="border-x border-neutral-700 bg-neutral-900 px-1.5 py-0.5 text-[11px] font-mono text-neutral-400 hover:bg-neutral-800 transition-colors"
              onClick={() => setZoom(DEFAULT_ZOOM)}
              title="Reset zoom to 100%"
            >
              {zoom}%
            </button>
            <button
              className="px-2 py-0.5 text-[11px] text-neutral-300 hover:bg-neutral-700 transition-colors disabled:opacity-40"
              onClick={() => zoomStep(1)}
              disabled={zoom >= ZOOM_STEPS[ZOOM_STEPS.length - 1]}
              title="Zoom in"
            >
              +
            </button>
          </div>

          {accounts && (
            <button
              className={"rounded border px-2 py-0.5 text-[11px] transition-colors " + (transferOpen ? "border-purple-700 bg-purple-950/50 text-purple-200" : "border-neutral-700 bg-neutral-800 text-neutral-300 hover:bg-neutral-700")}
              onClick={() => setTransferOpen(v => !v)}
              title="Export or import a saved account's DIM login"
            >
              ⇄ Login
            </button>
          )}
        </div>
        <span className="truncate text-[10px] text-neutral-600">{site.url}</span>
      </div>

      {addSiteOpen && (
        <form onSubmit={handleAddCustomSite} className="flex flex-wrap items-center gap-2 border-b border-neutral-800 bg-neutral-900/80 px-3 py-2">
          <input
            type="text"
            placeholder="Site Title (e.g. D2Foundry)"
            value={newSiteTitle}
            onChange={e => setNewSiteTitle(e.target.value)}
            className="rounded border border-neutral-700 bg-neutral-950 px-2 py-1 text-xs text-neutral-200 focus:border-purple-500 focus:outline-none"
          />
          <input
            type="text"
            placeholder="https://d2foundry.gg"
            value={newSiteUrl}
            onChange={e => setNewSiteUrl(e.target.value)}
            className="flex-1 min-w-[200px] rounded border border-neutral-700 bg-neutral-950 px-2 py-1 text-xs text-neutral-200 focus:border-purple-500 focus:outline-none"
          />
          <button
            type="submit"
            className="rounded border border-purple-800 bg-purple-900/40 px-3 py-1 text-xs text-purple-200 hover:bg-purple-900/70 transition-colors"
          >
            Save Site
          </button>
          <button
            type="button"
            onClick={() => setAddSiteOpen(false)}
            className="rounded border border-neutral-700 bg-neutral-800 px-2 py-1 text-xs text-neutral-300 hover:bg-neutral-700 transition-colors"
          >
            Cancel
          </button>
          {addSiteError && <span className="text-xs text-red-400">{addSiteError}</span>}
        </form>
      )}

      {accounts && transferOpen && (
        <div className="shrink-0 border-b border-neutral-800 bg-neutral-900/70 px-3 py-2">
          <div className="flex flex-wrap items-center gap-2">
            <label className="flex items-center gap-1.5 text-[11px] text-neutral-400">
              Account:
              <select
                className="rounded border border-neutral-700 bg-neutral-900 px-1.5 py-0.5 text-[11px] text-neutral-200 focus:border-purple-500 focus:outline-none"
                value={transferId}
                onChange={e => { setTransferId(e.target.value); setExportedToken(""); setTransferMsg(""); }}
              >
                {accounts.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
              </select>
            </label>
            <button
              className="rounded border border-neutral-700 bg-neutral-800 px-2.5 py-0.5 text-[11px] text-neutral-300 hover:bg-neutral-700 transition-colors disabled:opacity-40"
              onClick={doExport}
              disabled={transferBusy}
            >
              Export token
            </button>
            {exportedToken && (
              <button
                className="rounded border border-purple-800 bg-purple-900/40 px-2.5 py-0.5 text-[11px] text-purple-200 hover:bg-purple-900/70 transition-colors"
                onClick={copyExported}
              >
                Copy token
              </button>
            )}
            <span className="text-neutral-700">|</span>
            <input
              type="text"
              placeholder="Paste a login token to import…"
              className="w-48 rounded border border-neutral-700 bg-neutral-900 px-2 py-0.5 font-mono text-[11px] text-neutral-200 focus:border-purple-500 focus:outline-none"
              value={importText}
              onChange={e => setImportText(e.target.value)}
              disabled={transferBusy}
            />
            <button
              className="rounded border border-neutral-700 bg-neutral-800 px-2.5 py-0.5 text-[11px] text-neutral-300 hover:bg-neutral-700 transition-colors disabled:opacity-40"
              onClick={doImport}
              disabled={transferBusy || !importText.trim()}
            >
              Import into this account
            </button>
          </div>
          {transferMsg && (
            <div className="mt-1.5 text-[11px] text-neutral-400">
              {transferMsg}
            </div>
          )}
          {exportedToken && (
            <div className="mt-2">
              <textarea
                readOnly
                value={exportedToken}
                onClick={e => (e.target as HTMLTextAreaElement).select()}
                className="h-16 w-full rounded border border-neutral-800 bg-neutral-950 p-2 font-mono text-[10px] text-neutral-300 focus:border-purple-500 focus:outline-none"
              />
            </div>
          )}
        </div>
      )}

      <div ref={containerRef} className="relative min-h-0 flex-1 bg-neutral-950" />
    </div>
  );
}