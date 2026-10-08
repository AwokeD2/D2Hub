import { useState, useEffect, useRef } from "react";
import { listen } from "@tauri-apps/api/event";
import * as api from "../lib/api";
import type { MacroBinding } from "../lib/api";

interface Calibration { x: number; y: number; }

const STORAGE_KEY = "d2hub.loadouts";
const NAMES_KEY = "d2hub.loadoutNames";
const HOTKEYS_KEY = "d2hub.loadoutHotkeys";
const CLOSE_ESC_KEY = "d2hub.loadoutCloseWithEsc";
const INV_KEY = "d2hub.invKey";
const TIMING_PRESET_KEY = "d2hub.timingPreset";
const SLOT_COUNT = 20;

/** Layout-independent key capture using e.code so symbol keys and non-EN layouts work reliably. */
function comboFromKeyEvent(e: KeyboardEvent): string | null {
  const mods: string[] = [];
  if (e.ctrlKey) mods.push("Ctrl");
  if (e.altKey) mods.push("Alt");
  if (e.shiftKey) mods.push("Shift");
  const code = e.code;
  if (/^(Control|Alt|Shift|Meta)(Left|Right)?$/.test(code)) return null;
  return [...mods, code].join("+");
}

function friendlyKeyName(combo: string): string {
  return combo
    .split("+")
    .map(key => {
      if (key.startsWith("Key")) return key.slice(3);
      if (key.startsWith("Digit")) return key.slice(5);
      const symbolMap: Record<string, string> = {
        BracketLeft: "[",
        BracketRight: "]",
        Minus: "-",
        Equal: "=",
        Semicolon: ";",
        Quote: "'",
        Comma: ",",
        Period: ".",
        Slash: "/",
        Backslash: "\\",
        Backquote: "`",
        Space: "Space",
      };
      return symbolMap[key] ?? key;
    })
    .join("+");
}

function loadoutBindingName(slot: number) { return "loadout_" + slot; }

function loadCalibrations(): Record<number, Calibration> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch { return {}; }
}

function saveCalibrations(data: Record<number, Calibration>) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

function loadNames(): Record<number, string> {
  try {
    const raw = localStorage.getItem(NAMES_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch { return {}; }
}

function saveNames(data: Record<number, string>) {
  localStorage.setItem(NAMES_KEY, JSON.stringify(data));
}

function loadHotkeys(): Record<number, string> {
  try {
    const raw = localStorage.getItem(HOTKEYS_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch { return {}; }
}

function saveHotkeys(data: Record<number, string>) {
  localStorage.setItem(HOTKEYS_KEY, JSON.stringify(data));
}

export default function LoadoutPanel() {
  const [invKey, setInvKey] = useState(() => localStorage.getItem(INV_KEY) ?? "");
  // Global setting: close the character screen with Esc instead of re-pressing
  // the Inventory Key at the end of every loadout swap.
  const [closeWithEsc, setCloseWithEsc] = useState(() => localStorage.getItem(CLOSE_ESC_KEY) === "true");
  const [timingPreset, setTimingPreset] = useState(() => localStorage.getItem(TIMING_PRESET_KEY) ?? "default");
  const [slots, setSlots] = useState<Record<number, Calibration>>(loadCalibrations);
  const [names, setNames] = useState<Record<number, string>>(loadNames);
  const [hotkeys, setHotkeys] = useState<Record<number, string>>(loadHotkeys);
  // Slot currently armed for click-to-set-position (the overlay flow).
  const [calibrating, setCalibrating] = useState<number | null>(null);
  // Slot currently armed for "press a key" hotkey capture.
  const [keyBinding, setKeyBinding] = useState<number | null>(null);
  const [status, setStatus] = useState("");
  const [editingName, setEditingName] = useState<number | null>(null);

  useEffect(() => { localStorage.setItem(INV_KEY, invKey); }, [invKey]);
  useEffect(() => { localStorage.setItem(TIMING_PRESET_KEY, timingPreset); }, [timingPreset]);

  // Keep a ref to the currently-armed calibration slot so the (stable) event
  // listeners below always see the latest value without needing to re-subscribe.
  const calibratingRef = useRef<number | null>(null);
  useEffect(() => { calibratingRef.current = calibrating; }, [calibrating]);

  const slotsRef = useRef(slots);
  useEffect(() => { slotsRef.current = slots; }, [slots]);
  const namesRef = useRef(names);
  useEffect(() => { namesRef.current = names; }, [names]);
  const hotkeysRef = useRef(hotkeys);
  useEffect(() => { hotkeysRef.current = hotkeys; }, [hotkeys]);
  const invKeyRef = useRef(invKey);
  useEffect(() => { invKeyRef.current = invKey; }, [invKey]);
  const closeWithEscRef = useRef(closeWithEsc);
  useEffect(() => { closeWithEscRef.current = closeWithEsc; }, [closeWithEsc]);
  const timingPresetRef = useRef(timingPreset);
  useEffect(() => { timingPresetRef.current = timingPreset; }, [timingPreset]);

  const settingsMounted = useRef(false);
  useEffect(() => {
    localStorage.setItem(CLOSE_ESC_KEY, String(closeWithEsc));
    localStorage.setItem(TIMING_PRESET_KEY, timingPreset);
    if (!settingsMounted.current) { settingsMounted.current = true; return; }
    (async () => {
      try {
        const existing = await api.loadBindings();
        const next = existing.map(b =>
          b.kind === "loadout" ? { ...b, closeWithEsc, timingPreset } : b,
        );
        await api.saveBindings(next);
        await api.registerHotkeys(next);
        setStatus("Settings updated");
      } catch (e) {
        setStatus("Failed to update settings: " + e);
      }
    })();
  }, [closeWithEsc, timingPreset]);

  useEffect(() => {
    let unlistenResult: (() => void) | undefined;
    let unlistenCancel: (() => void) | undefined;

    listen<[number, number]>("calibration-result", (event) => {
      const slot = calibratingRef.current;
      if (slot === null) return;
      const [x, y] = event.payload;
      setSlots(prev => {
        const next = { ...prev, [slot]: { x, y } };
        saveCalibrations(next);
        return next;
      });
      setStatus((namesRef.current[slot] || "Loadout Slot " + slot) + " calibrated at " + x + ", " + y);
      setCalibrating(null);
      syncSlotRegistration(slot, { x, y });
    }).then(fn => { unlistenResult = fn; });

    listen("calibration-cancelled", () => {
      if (calibratingRef.current !== null) {
        setStatus("Cancelled");
        setCalibrating(null);
      }
    }).then(fn => { unlistenCancel = fn; });

    let unlistenSwapFailed: (() => void) | undefined;
    listen<{ name: string; reason: string }>("loadout-swap-failed", (event) => {
      setStatus("Loadout swap failed: " + event.payload.reason);
    }).then(fn => { unlistenSwapFailed = fn; });

    return () => { unlistenResult?.(); unlistenCancel?.(); unlistenSwapFailed?.(); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // While a slot is armed for hotkey capture, listen for the next keydown
  // (mirrors the old WPF app's Window_PreviewKeyDown "assign loadout hotkey" flow).
  useEffect(() => {
    if (keyBinding === null) return;
    const slot = keyBinding;
    const handler = (e: KeyboardEvent) => {
      e.preventDefault(); e.stopPropagation();
      if (e.key === "Escape") {
        setKeyBinding(null);
        setStatus("Cancelled");
        return;
      }
      const combo = comboFromKeyEvent(e);
      if (!combo) return; // ignore bare modifier keydowns
      setHotkeys(prev => {
        const next = { ...prev, [slot]: combo };
        saveHotkeys(next);
        return next;
      });
      setKeyBinding(null);
      setStatus(slotLabel(slot) + " bound to " + combo);
      syncSlotRegistration(slot, undefined, combo);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [keyBinding]);

  async function startCalibrate(slot: number) {
    setCalibrating(slot);
    setStatus("Switch to your game and click the position of " + slotLabel(slot) + " on screen. Esc to cancel.");
    try {
      await api.startCalibrationOverlay();
    } catch (e) {
      setStatus("Failed to start calibration: " + e);
      setCalibrating(null);
    }
  }

  async function cancelCalibrate() {
    setCalibrating(null);
    setStatus("Cancelled");
    try { await api.cancelCalibration(); } catch { /* best-effort */ }
  }

  function startKeyBind(slot: number) {
    setKeyBinding(slot);
    setStatus("Press a key for " + slotLabel(slot) + "... Esc to cancel.");
  }

  function cancelKeyBind() {
    setKeyBinding(null);
    setStatus("Cancelled");
  }

  function clearSlot(slot: number) {
    const next = { ...slots };
    delete next[slot];
    setSlots(next);
    saveCalibrations(next);
    setStatus("Cleared " + slotLabel(slot));
    unregisterSlot(slot);
  }

  function clearHotkey(slot: number) {
    const next = { ...hotkeys };
    delete next[slot];
    setHotkeys(next);
    saveHotkeys(next);
    setStatus("Cleared hotkey for " + slotLabel(slot));
    unregisterSlot(slot);
  }

  /**
   * Once a slot has both a hotkey and a calibrated position, (re)register it
   * as a native "loadout" binding — click position + inventory key stored
   * directly, no .ahk file involved. D2 Hub's Rust side drives the actual
   * key/mouse input itself (see loadout.rs) when the hotkey fires, gated on
   * Destiny 2 being the focused window.
   */
  async function syncSlotRegistration(slot: number, calOverride?: Calibration, hotkeyOverride?: string) {
    const cal = calOverride ?? slotsRef.current[slot];
    const hotkey = hotkeyOverride ?? hotkeysRef.current[slot];
    const invKey = invKeyRef.current;
    if (!cal || !hotkey) return;
    if (!invKey) {
      setStatus("Set the Inventory Key above to activate this hotkey");
      return;
    }
    try {
      const existing = await api.loadBindings();
      const merged: MacroBinding[] = [
        ...existing.filter(b => b.name !== loadoutBindingName(slot)),
        {
          name: loadoutBindingName(slot),
          file: "",
          hotkey,
          enabled: true,
          kind: "loadout",
          clickX: cal.x,
          clickY: cal.y,
          inventoryKey: invKey,
          closeWithEsc: closeWithEscRef.current,
          timingPreset: timingPresetRef.current,
        },
      ];
      await api.saveBindings(merged);
      await api.registerHotkeys(merged);
      setStatus(slotLabel(slot) + " active: " + friendlyKeyName(hotkey) + " -> " + cal.x + ", " + cal.y);
    } catch (e) {
      setStatus("Failed to register hotkey: " + e);
    }
  }

  /** Remove this slot's binding from the shared bindings list and re-register the rest. */
  async function unregisterSlot(slot: number) {
    try {
      const existing = await api.loadBindings();
      const next = existing.filter(b => b.name !== loadoutBindingName(slot));
      await api.saveBindings(next);
      await api.registerHotkeys(next);
    } catch { /* best-effort */ }
  }

  function renameSlot(slot: number, name: string) {
    const next = { ...names };
    if (name.trim()) next[slot] = name.trim();
    else delete next[slot];
    setNames(next);
    saveNames(next);
  }

  function slotLabel(slot: number) {
    return names[slot] || "Loadout Slot " + slot;
  }

  const inputCls = "w-20 rounded border border-neutral-700 bg-neutral-900 px-2 py-0.5 text-xs font-mono text-neutral-100 placeholder-neutral-600 focus:border-purple-500 focus:outline-none";

  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-hidden p-3">
      <div className="mb-3 shrink-0">
        <h2 className="mb-2 text-sm font-semibold text-neutral-200">Destiny 2 Auto Loadout Swapper</h2>
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
          <label className="flex items-center gap-1.5 text-[11px] text-neutral-400">
            Inventory Key:
            <input className={inputCls} value={invKey} onChange={e => setInvKey(e.target.value)} placeholder="e.g. F1" spellCheck={false} />
          </label>
          <div className="flex items-center gap-1.5 text-[11px] text-neutral-400">
            Close with Esc
            <button
              type="button"
              onClick={() => setCloseWithEsc(v => !v)}
              title={closeWithEsc
                ? "On — swap backs out of the Loadouts menu with Esc, leaving you in your inventory. Click to close the whole character screen with the Inventory Key instead."
                : "Off — swap closes the whole character screen with the Inventory Key. Click to back out with Esc and stay in your inventory."}
              className={"flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[11px] font-semibold transition-colors " + (closeWithEsc
                ? "border-emerald-700 bg-emerald-950/40 text-emerald-300 hover:bg-emerald-950/70"
                : "border-red-800 bg-red-950/40 text-red-300 hover:bg-red-950/70")}
            >
              <span aria-hidden className={"h-2 w-2 rounded-full " + (closeWithEsc ? "bg-emerald-400" : "bg-red-400")} />
              {closeWithEsc ? "On" : "Off"}
            </button>
          </div>
          <label className="flex items-center gap-1.5 text-[11px] text-neutral-400">
            Swap Speed:
            <select
              className="rounded border border-neutral-700 bg-neutral-900 px-2 py-0.5 text-xs text-neutral-100 focus:border-purple-500 focus:outline-none"
              value={timingPreset}
              onChange={e => setTimingPreset(e.target.value)}
              title="Adjust timing to fix dropped inputs if your game stutters or drops frames during swaps."
            >
              <option value="default">Normal (Stable FPS)</option>
              <option value="fast">Fast (High FPS)</option>
              <option value="safe">Safe (FPS Drops)</option>
              <option value="40fps">Very Safe (40 FPS)</option>
            </select>
          </label>
          <span className="text-[10px] text-neutral-600">(the key that opens your character screen — the loadout panel opens with the Left arrow automatically; press a slot's hotkey while Destiny 2 is focused to run its swap)</span>
        </div>
      </div>

      {status && <div className="mb-2 text-[11px] text-neutral-500">{status}</div>}

      {calibrating !== null && (
        <div className="mb-2 flex items-center justify-between rounded border border-amber-800 bg-amber-950/40 px-3 py-2 text-xs text-amber-300">
          <span className="animate-pulse">Click on screen for <strong>{slotLabel(calibrating)}</strong>. Esc to cancel.</span>
          <button
            className="ml-3 shrink-0 rounded border border-amber-700 bg-amber-900/50 px-2 py-0.5 text-[10px] text-amber-200 hover:bg-amber-900"
            onClick={cancelCalibrate}>
            Cancel
          </button>
        </div>
      )}

      {keyBinding !== null && (
        <div className="mb-2 flex items-center justify-between rounded border border-purple-800 bg-purple-950/40 px-3 py-2 text-xs text-purple-300">
          <span className="animate-pulse">Press a key for <strong>{slotLabel(keyBinding)}</strong>. Esc to cancel.</span>
          <button
            className="ml-3 shrink-0 rounded border border-purple-700 bg-purple-900/50 px-2 py-0.5 text-[10px] text-purple-200 hover:bg-purple-900"
            onClick={cancelKeyBind}>
            Cancel
          </button>
        </div>
      )}

      <div className="min-h-0 flex-1 overflow-y-auto">
        <div className="grid grid-cols-1 gap-1.5 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: SLOT_COUNT }, (_, i) => i + 1).map(slot => {
            const cal = slots[slot];
            const hotkey = hotkeys[slot];
            const cls = calibrating === slot ? "border-amber-500 bg-amber-950/30" :
                        keyBinding === slot ? "border-purple-500 bg-purple-950/30" :
                        cal && hotkey ? "border-emerald-800 bg-emerald-950/20" :
                        (cal || hotkey) ? "border-neutral-700 bg-neutral-900/70" :
                        "border-neutral-800 bg-neutral-900/50";
            return (
              <div key={slot} className={"rounded border px-2.5 py-2 " + cls}>
                <div className="mb-1 flex items-center gap-1.5">
                  <span className="shrink-0 rounded bg-neutral-800 px-1 py-0.5 text-[9px] font-mono text-neutral-500">#{slot}</span>
                  {editingName === slot ? (
                    <input
                      autoFocus
                      className="min-w-0 flex-1 rounded border border-purple-600 bg-neutral-950 px-1 py-0.5 text-[11px] text-neutral-100 focus:outline-none"
                      defaultValue={names[slot] ?? ""}
                      placeholder={"Loadout Slot " + slot}
                      onBlur={e => { renameSlot(slot, e.target.value); setEditingName(null); }}
                      onKeyDown={e => {
                        if (e.key === "Enter") (e.target as HTMLInputElement).blur();
                        if (e.key === "Escape") setEditingName(null);
                      }}
                    />
                  ) : (
                    <button
                      className="min-w-0 flex-1 truncate text-left text-[11px] font-medium text-neutral-200 hover:text-purple-300"
                      title="Click to rename"
                      onClick={() => setEditingName(slot)}>
                      {slotLabel(slot)}
                    </button>
                  )}
                </div>

                <div className="mb-1.5 flex flex-col gap-0.5">
                  <div className={hotkey ? "text-[10px] text-purple-400" : "text-[10px] text-neutral-600"}>
                    {hotkey ? "\u2328 " + friendlyKeyName(hotkey) : "No hotkey"}
                  </div>
                  <div className={cal ? "text-[10px] text-emerald-400" : "text-[10px] text-neutral-600"}>
                    {cal ? "\u2713 " + cal.x + ", " + cal.y : "Not calibrated"}
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-1">
                  <button className={"rounded border px-2 py-0.5 text-[10px] " + (keyBinding === slot ? "border-purple-700 bg-purple-900/50 text-purple-200" : "border-neutral-700 bg-neutral-800 text-neutral-300 hover:bg-neutral-700")}
                    onClick={() => startKeyBind(slot)}>{hotkey ? "Rebind" : "Bind"}</button>
                  <button className={"rounded border px-2 py-0.5 text-[10px] " + (calibrating === slot ? "border-amber-700 bg-amber-900/50 text-amber-200" : "border-neutral-700 bg-neutral-800 text-neutral-300 hover:bg-neutral-700")}
                    onClick={() => startCalibrate(slot)}>{cal ? "Recalibrate" : "Calibrate"}</button>
                  {hotkey && (
                    <button className="rounded border border-red-900 bg-red-950/30 px-1.5 py-0.5 text-[10px] text-red-400 hover:bg-red-950/60"
                      onClick={() => clearHotkey(slot)} title="Clear hotkey">{'\u2715\u2328'}</button>
                  )}
                  {cal && (
                    <button className="rounded border border-red-900 bg-red-950/30 px-1.5 py-0.5 text-[10px] text-red-400 hover:bg-red-950/60"
                      onClick={() => clearSlot(slot)} title="Clear calibration">{'\u2715'}</button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}