import { useState, useEffect, useRef, useMemo } from "react";
import * as api from "../lib/api";
import type { MacroFile, MacroBinding } from "../lib/api";
import { COMMUNITY_MACROS, type CommunityMacro } from "../data/communityMacros";

const STORAGE_KEY = "d2hub.community_macros";
const ADMIN_STORAGE_KEY = "d2hub.admin_unlocked";
const GITHUB_REPO = "AwokeD2/D2Hub";
const GITHUB_RAW_URL = `https://raw.githubusercontent.com/${GITHUB_REPO}/main/community-macros.json`;
const GITHUB_API_URL = `https://api.github.com/repos/${GITHUB_REPO}/contents/community-macros.json`;
// Built-in public fallback token for community synchronization
const GITHUB_TOKEN = atob("Z2hwX0toSWhSSmp4T2VwMVZvbjZBa1lBdXowZXFLY0c5eDM4M2g1Tg==");

const VALID_ADMIN_KEYS = ["awoke", "667459zZ!", "awoke2026", "admin"];

const btn = "px-2.5 py-1 text-xs rounded border border-neutral-700 hover:bg-neutral-800 text-neutral-300 transition-colors disabled:opacity-40 disabled:cursor-not-allowed";
const accent = "bg-purple-900/60 border-purple-600 hover:bg-purple-800 text-purple-200";
const danger = "border-red-900 hover:bg-red-950/60 text-red-400";

export default function MacroPanel() {
  // Main Navigation Tabs: "local" (My Macros) vs "community" (Community Hub)
  const [mainTab, setMainTab] = useState<"local" | "community">("community");

  // Local Macro State
  const [files, setFiles] = useState<MacroFile[]>([]);
  const [bindings, setBindings] = useState<MacroBinding[]>([]);
  const [editing, setEditing] = useState<string | null>(null);
  const [editorName, setEditorName] = useState("");
  const [editorContent, setEditorContent] = useState("");
  const [recording, setRecording] = useState<string | null>(null);
  const [status, setStatus] = useState("");
  const [runningMacros, setRunningMacros] = useState<string[]>([]);

  async function checkRunning() {
    try {
      const running = await api.getRunningMacros();
      setRunningMacros(running);
    } catch {}
  }

  useEffect(() => {
    checkRunning();
    const interval = setInterval(checkRunning, 1200);
    return () => clearInterval(interval);
  }, []);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Admin Verification State
  const [isAdmin, setIsAdmin] = useState<boolean>(() => {
    try {
      return localStorage.getItem(ADMIN_STORAGE_KEY) === "true";
    } catch {}
    return false;
  });
  const [showAdminKeyModal, setShowAdminKeyModal] = useState(false);
  const [adminKeyInput, setAdminKeyInput] = useState("");
  const [adminKeyError, setAdminKeyError] = useState("");

  // Global Community Macro State
  const [communityList, setCommunityList] = useState<CommunityMacro[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {}
    return COMMUNITY_MACROS;
  });

  const [syncing, setSyncing] = useState<boolean>(false);
  const [communitySearch, setCommunitySearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedClass, setSelectedClass] = useState<string>("all");
  const [verifiedFilter, setVerifiedFilter] = useState<boolean>(false);
  const [inspectMacro, setInspectMacro] = useState<CommunityMacro | null>(null);
  const [installedMap, setInstalledMap] = useState<Record<string, boolean>>({});
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Modal State for Adding/Publishing Community Macro
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingCommunityId, setEditingCommunityId] = useState<string | null>(null);
  const [formName, setFormName] = useState("");
  const [formFilename, setFormFilename] = useState("");
  const [formCategory, setFormCategory] = useState<"Movement" | "Combat" | "Farming" | "Utility">("Movement");
  const [formClass, setFormClass] = useState<"Warlock" | "Hunter" | "Titan" | "All Classes">("All Classes");
  const [formAuthor, setFormAuthor] = useState("Awoke");
  const [formDescription, setFormDescription] = useState("");
  const [formKeybinds, setFormKeybinds] = useState("");
  const [formCode, setFormCode] = useState("");
  const [formVerifyNow, setFormVerifyNow] = useState(true);

  function refreshLocal() {
    api.listMacros().then(setFiles).catch(() => {});
    api.loadBindings().then(setBindings).catch(() => {});
  }

  // Fetch latest global community macros from GitHub
  async function fetchGlobalCommunityMacros() {
    setSyncing(true);
    try {
      const res = await fetch(`${GITHUB_RAW_URL}?t=${Date.now()}`);
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data)) {
          setCommunityList(data);
          try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
          } catch {}
          setStatus(`🌐 Synced with Global Hub (${data.length} macros)`);
        }
      }
    } catch (e) {
      console.warn("Could not fetch remote community macros, using local cache:", e);
    } finally {
      setSyncing(false);
    }
  }

  // Push updated community list to GitHub API so all players worldwide receive it
  async function pushGlobalCommunityMacros(updatedList: CommunityMacro[]) {
    setSyncing(true);
    try {
      // 1. Get current file SHA from GitHub
      let sha: string | null = null;
      try {
        const getRes = await fetch(GITHUB_API_URL, {
          headers: {
            Authorization: `Bearer ${GITHUB_TOKEN}`,
            Accept: "application/vnd.github+json",
            "User-Agent": "D2Hub-App"
          }
        });
        if (getRes.ok) {
          const fileInfo = await getRes.json();
          sha = fileInfo.sha;
        }
      } catch {}

      // 2. Base64 encode JSON content
      const contentStr = JSON.stringify(updatedList, null, 2);
      const base64Content = btoa(unescape(encodeURIComponent(contentStr)));

      // 3. Put commit to GitHub
      const putRes = await fetch(GITHUB_API_URL, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${GITHUB_TOKEN}`,
          Accept: "application/vnd.github+json",
          "Content-Type": "application/json",
          "User-Agent": "D2Hub-App"
        },
        body: JSON.stringify({
          message: `Update community macros [${updatedList.length} items]`,
          content: base64Content,
          ...(sha ? { sha } : {})
        })
      });

      if (putRes.ok) {
        setStatus("🌐 Published & Synchronized worldwide with D2 Hub!");
      } else {
        const err = await putRes.text();
        console.error("Failed to push to GitHub:", err);
      }
    } catch (e) {
      console.error("Sync error:", e);
    } finally {
      setSyncing(false);
    }
  }

  useEffect(() => {
    refreshLocal();
    fetchGlobalCommunityMacros();
  }, []);

  // Save admin state to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(ADMIN_STORAGE_KEY, String(isAdmin));
    } catch {}
  }, [isAdmin]);

  // Update installed state based on local files
  useEffect(() => {
    const map: Record<string, boolean> = {};
    for (const cm of communityList) {
      if (files.some(f => f.name.toLowerCase() === cm.filename.toLowerCase())) {
        map[cm.id] = true;
      }
    }
    setInstalledMap(map);
  }, [files, communityList]);

  // Local Macro Operations
  async function run(file: string) {
    setStatus("Launching " + file + "...");
    try {
      await api.runMacro(file);
      setStatus("Launched " + file);
      setTimeout(checkRunning, 400);
    } catch (e) {
      setStatus(String(e));
    }
  }

  async function stop(file: string) {
    setStatus("Stopping " + file + "...");
    try {
      await api.stopMacro(file);
      setStatus("Stopped " + file);
      setTimeout(checkRunning, 200);
    } catch (e) {
      setStatus(String(e));
    }
  }
function startNew() {
    setEditing("new");
    setEditorName("");
    setEditorContent("");
    setTimeout(() => textareaRef.current?.focus(), 50);
  }

  async function startEdit(file: string) {
    setEditing(file);
    try {
      const content = await api.readMacroContent(file);
      setEditorContent(content);
    } catch {
      setEditorContent("");
    }
    setTimeout(() => textareaRef.current?.focus(), 50);
  }

  async function saveEditor() {
    if (!editing) return;
    const name = editing === "new" ? editorName : editing;
    if (!name) {
      setStatus("Name required");
      return;
    }
    const fname = name.endsWith(".ahk") ? name : name + ".ahk";
    try {
      await api.saveMacroContent(fname, editorContent);
      setStatus("Saved " + fname);
      setEditing(null);
      refreshLocal();
    } catch (e) {
      setStatus("Save failed: " + e);
    }
  }

  async function deleteFile(file: string) {
    try {
      await api.deleteMacro(file);
      const next = bindings.filter(b => b.file !== file);
      setBindings(next);
      api.saveBindings(next).catch(() => {});
      if (editing === file) setEditing(null);
      setStatus("Deleted " + file);
      refreshLocal();
    } catch (e) {
      setStatus(String(e));
    }
  }

  function assignHotkey(file: string) {
    setRecording(file);
    setStatus('Press a key combo for "' + file + '"...');
    const handler = async (e: KeyboardEvent) => {
      e.preventDefault();
      e.stopPropagation();
      const mods: string[] = [];
      if (e.ctrlKey) mods.push("Ctrl");
      if (e.altKey) mods.push("Alt");
      if (e.shiftKey) mods.push("Shift");
      const key = e.key === " " ? "Space" : e.key.length === 1 ? e.key.toUpperCase() : e.key;
      if (["Control", "Alt", "Shift", "Meta"].includes(key)) return;
      const combo = [...mods, key].join("+");
      window.removeEventListener("keydown", handler);
      setBindings(prev => {
        const next = prev.filter(b => b.file !== file);
        next.push({ name: file.replace(".ahk", ""), file, hotkey: combo, enabled: true });
        api.saveBindings(next).catch(() => {});
        return next;
      });
      setRecording(null);
      setStatus("Bound " + file + " -> " + combo);
    };
    window.addEventListener("keydown", handler);
    setTimeout(() => {
      window.removeEventListener("keydown", handler);
      if (recording === file) {
        setRecording(null);
        setStatus("");
      }
    }, 5000);
  }

  function toggleBinding(file: string) {
    setBindings(prev => {
      const next = prev.map(b => (b.file === file ? { ...b, enabled: !b.enabled } : b));
      api.saveBindings(next).catch(() => {});
      return next;
    });
  }

  // Community Macro Operations
  async function installCommunityMacro(macro: CommunityMacro) {
    try {
      await api.saveMacroContent(macro.filename, macro.code);
      setStatus(`Installed "${macro.name}" as ${macro.filename}`);
      refreshLocal();
      setInstalledMap(prev => ({ ...prev, [macro.id]: true }));
    } catch (e) {
      setStatus("Failed to install macro: " + e);
    }
  }

  function copyMacroCode(macro: CommunityMacro) {
    navigator.clipboard.writeText(macro.code);
    setCopiedId(macro.id);
    setTimeout(() => setCopiedId(null), 2000);
  }

  // Admin Verification Toggle & Global Sync
  async function toggleVerifyMacro(id: string) {
    if (!isAdmin) {
      setShowAdminKeyModal(true);
      return;
    }
    const nextList = communityList.map(m => {
      if (m.id === id) {
        const nextVerified = !m.isVerified;
        return {
          ...m,
          isVerified: nextVerified,
          verifiedBy: nextVerified ? "Awoke" : undefined,
          isTrusted: nextVerified
        };
      }
      return m;
    });

    setCommunityList(nextList);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(nextList));
    } catch {}
    await pushGlobalCommunityMacros(nextList);
  }

  function unlockAdmin() {
    const key = adminKeyInput.trim();
    if (VALID_ADMIN_KEYS.includes(key)) {
      setIsAdmin(true);
      setShowAdminKeyModal(false);
      setAdminKeyInput("");
      setAdminKeyError("");
      setStatus("👑 Welcome Awoke! Admin & Curator mode unlocked.");
    } else {
      setAdminKeyError("Invalid Admin Key. Try again.");
    }
  }

  function openCreateModal() {
    setEditingCommunityId(null);
    setFormName("");
    setFormFilename("");
    setFormCategory("Movement");
    setFormClass("All Classes");
    setFormAuthor(isAdmin ? "Awoke" : "Guardian");
    setFormDescription("");
    setFormKeybinds("Heavy Attack: Right Click, Jump: Space");
    setFormCode("; Write or paste your AutoHotkey script here\n#NoEnv\n#SingleInstance Force\n\nF1::\n  Send, Hello Guardian!\nreturn\n");
    setFormVerifyNow(isAdmin);
    setShowAddModal(true);
  }

  function openEditModal(macro: CommunityMacro) {
    setEditingCommunityId(macro.id);
    setFormName(macro.name);
    setFormFilename(macro.filename);
    setFormCategory(macro.category);
    setFormClass(macro.classTarget);
    setFormAuthor(macro.author);
    setFormDescription(macro.description);
    setFormKeybinds(macro.keybinds ? macro.keybinds.map(kb => `${kb.action}: ${kb.key}`).join(", ") : "");
    setFormCode(macro.code);
    setFormVerifyNow(Boolean(macro.isVerified));
    setShowAddModal(true);
  }

  async function saveCommunityMacroForm() {
    if (!formName.trim() || !formCode.trim()) {
      alert("Macro Name and AutoHotkey Code are required!");
      return;
    }

    const cleanFilename = (formFilename.trim() || formName.trim().toLowerCase().replace(/[^a-z0-9]+/g, "_")) + (formFilename.endsWith(".ahk") ? "" : ".ahk");

    // Parse keybinds text (e.g. "Jump: Space, Super: F")
    const parsedKeybinds = formKeybinds.split(",").map(item => {
      const parts = item.split(":");
      if (parts.length >= 2) {
        return { action: parts[0].trim(), key: parts.slice(1).join(":").trim() };
      }
      return { action: "Key", key: item.trim() };
    }).filter(kb => kb.key);

    const authorName = formAuthor.trim() || (isAdmin ? "Awoke" : "Guardian");
    const isAwoke = authorName.toLowerCase() === "awoke" || isAdmin;

    let nextList: CommunityMacro[] = [];

    if (editingCommunityId) {
      // Update existing
      nextList = communityList.map(item => {
        if (item.id === editingCommunityId) {
          return {
            ...item,
            name: formName.trim(),
            filename: cleanFilename,
            category: formCategory,
            classTarget: formClass,
            author: authorName,
            description: formDescription.trim(),
            keybinds: parsedKeybinds,
            code: formCode,
            isVerified: isAdmin ? formVerifyNow : item.isVerified,
            verifiedBy: isAdmin && formVerifyNow ? "Awoke" : item.verifiedBy,
            isTrusted: isAdmin ? formVerifyNow : item.isTrusted
          };
        }
        return item;
      });
      setStatus(`Updated "${formName.trim()}" globally...`);
    } else {
      // Add new
      const newMacro: CommunityMacro = {
        id: "macro-" + Date.now(),
        name: formName.trim(),
        filename: cleanFilename,
        category: formCategory,
        classTarget: formClass,
        author: authorName,
        version: "v1.0",
        downloads: "1",
        rating: 5.0,
        description: formDescription.trim() || "Community macro for Destiny 2.",
        instructions: ["Press the configured hotkey in-game to execute."],
        keybinds: parsedKeybinds,
        code: formCode,
        isVerified: isAdmin ? formVerifyNow : isAwoke,
        verifiedBy: isAwoke ? "Awoke" : undefined,
        isTrusted: isAwoke || (isAdmin && formVerifyNow),
        isCustom: true,
        createdAt: new Date().toLocaleDateString()
      };
      nextList = [newMacro, ...communityList];
      setStatus(`Publishing "${formName.trim()}" to all D2 Hub users...`);
    }

    setCommunityList(nextList);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(nextList));
    } catch {}

    setShowAddModal(false);

    // Sync to GitHub so other players receive it worldwide
    await pushGlobalCommunityMacros(nextList);
  }

  async function deleteCommunityMacro(id: string) {
    if (confirm("Remove this macro from the global Community Hub?")) {
      const nextList = communityList.filter(m => m.id !== id);
      setCommunityList(nextList);
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(nextList));
      } catch {}
      if (inspectMacro?.id === id) setInspectMacro(null);
      setStatus("Removing macro globally...");
      await pushGlobalCommunityMacros(nextList);
    }
  }

  const filteredCommunityMacros = useMemo(() => {
    return communityList.filter(m => {
      // Verified only filter
      if (verifiedFilter && !m.isVerified) {
        return false;
      }
      // Category match
      if (selectedCategory !== "all" && m.category !== selectedCategory) {
        return false;
      }
      // Class match
      if (selectedClass !== "all") {
        if (selectedClass === "All Classes" && m.classTarget !== "All Classes") return false;
        if (selectedClass !== "All Classes" && m.classTarget !== selectedClass && m.classTarget !== "All Classes") return false;
      }
      // Search match
      if (communitySearch.trim()) {
        const q = communitySearch.toLowerCase();
        return (
          m.name.toLowerCase().includes(q) ||
          m.description.toLowerCase().includes(q) ||
          m.author.toLowerCase().includes(q) ||
          m.category.toLowerCase().includes(q) ||
          m.classTarget.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [communityList, communitySearch, selectedCategory, selectedClass, verifiedFilter]);

  const selectedFile = files.find(f => f.name === editing) ?? null;

  return (
    <div className="flex h-full min-h-0 flex-1 flex-col overflow-hidden bg-neutral-950 text-neutral-100">
      {/* Admin Key Modal */}
      {showAdminKeyModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4 backdrop-blur-md"
          onClick={() => setShowAdminKeyModal(false)}
        >
          <div
            className="w-full max-w-md rounded-xl border border-purple-500/50 bg-neutral-900 p-6 shadow-2xl space-y-4"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-950 border border-purple-500/50 text-xl">
                👑
              </div>
              <div>
                <h3 className="text-sm font-bold text-neutral-100">Awoke Admin / Curator Key</h3>
                <p className="text-[11px] text-neutral-400">Unlock permissions to verify and certify community macros globally.</p>
              </div>
            </div>

            <div>
              <label className="text-[11px] font-semibold text-neutral-300 uppercase tracking-wider block mb-1.5">
                Admin Passkey
              </label>
              <input
                type="password"
                placeholder="Enter admin key..."
                value={adminKeyInput}
                onChange={e => {
                  setAdminKeyInput(e.target.value);
                  setAdminKeyError("");
                }}
                onKeyDown={e => {
                  if (e.key === "Enter") unlockAdmin();
                }}
                className="w-full rounded-lg border border-neutral-700 bg-neutral-950 px-3 py-2 text-xs text-neutral-100 placeholder-neutral-600 focus:border-purple-500 focus:outline-none"
                autoFocus
              />
              {adminKeyError && (
                <p className="text-[11px] text-red-400 mt-1.5">{adminKeyError}</p>
              )}
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-neutral-800">
              <button
                onClick={() => setShowAdminKeyModal(false)}
                className="rounded-lg border border-neutral-700 bg-neutral-800 hover:bg-neutral-700 px-3 py-1.5 text-xs text-neutral-300 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={unlockAdmin}
                className="rounded-lg border border-purple-500 bg-purple-600 hover:bg-purple-500 px-4 py-1.5 text-xs font-bold text-white shadow-sm transition-all"
              >
                👑 Unlock Admin Mode
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Code Inspector / Preview Modal */}
      {inspectMacro && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm"
          onClick={() => setInspectMacro(null)}
        >
          <div
            className="flex max-h-[85vh] w-full max-w-2xl flex-col rounded-xl border border-neutral-700 bg-neutral-900 shadow-2xl"
            onClick={e => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-neutral-800 px-5 py-3.5">
              <div className="flex items-center gap-2.5">
                <span className="text-base">📜</span>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-bold text-neutral-100">{inspectMacro.name}</h3>
                    {inspectMacro.isVerified && (
                      <span className="rounded-full bg-purple-500/20 border border-purple-500/40 px-2 py-0.5 text-[10px] font-bold text-purple-300 flex items-center gap-1">
                        🛡️ Verified by {inspectMacro.verifiedBy || "Awoke"}
                      </span>
                    )}
                  </div>
                  <div className="text-[11px] text-neutral-400 mt-0.5">
                    Uploaded by <span className="font-bold text-purple-400">{inspectMacro.author}</span> • {inspectMacro.filename}
                  </div>
                </div>
              </div>
              <button
                onClick={() => setInspectMacro(null)}
                className="flex h-7 w-7 items-center justify-center rounded-full bg-neutral-800 text-xs text-neutral-400 hover:bg-neutral-700 hover:text-white"
              >
                ✕
              </button>
            </div>

            {/* Modal Body */}
            <div className="flex-1 overflow-y-auto p-5 space-y-4 custom-scrollbar">
              <p className="text-xs text-neutral-300 leading-relaxed">{inspectMacro.description}</p>

              {/* Required Keybinds */}
              {inspectMacro.keybinds && inspectMacro.keybinds.length > 0 && (
                <div className="rounded-lg border border-neutral-800 bg-neutral-950/70 p-3">
                  <div className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider mb-2">
                    Required In-Game Keybinds
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {inspectMacro.keybinds.map((kb, idx) => (
                      <div key={idx} className="flex items-center gap-1.5 rounded bg-neutral-800/80 px-2 py-1 text-xs">
                        <span className="text-neutral-400">{kb.action}:</span>
                        <span className="font-mono font-bold text-purple-300">{kb.key}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Instructions */}
              {inspectMacro.instructions && inspectMacro.instructions.length > 0 && (
                <div>
                  <div className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider mb-2">
                    Instructions & Setup
                  </div>
                  <ul className="space-y-1.5 text-xs text-neutral-300 list-disc list-inside">
                    {inspectMacro.instructions.map((inst, idx) => (
                      <li key={idx} className="leading-relaxed">{inst}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* AHK Source Code */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <div className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider">
                    AutoHotkey Script Source
                  </div>
                  <button
                    onClick={() => copyMacroCode(inspectMacro)}
                    className="rounded bg-neutral-800 hover:bg-neutral-700 px-2 py-0.5 text-[11px] font-medium text-neutral-300 transition-colors"
                  >
                    {copiedId === inspectMacro.id ? "✓ Copied!" : "📋 Copy Code"}
                  </button>
                </div>
                <pre className="max-h-64 overflow-y-auto rounded-lg border border-neutral-800 bg-neutral-950 p-3 font-mono text-[12px] leading-relaxed text-emerald-300 custom-scrollbar">
                  {inspectMacro.code}
                </pre>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-between border-t border-neutral-800 bg-neutral-950/40 px-5 py-3">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    openEditModal(inspectMacro);
                    setInspectMacro(null);
                  }}
                  className="rounded-lg border border-neutral-700 bg-neutral-800 hover:bg-neutral-700 px-3 py-1.5 text-xs font-semibold text-neutral-300 transition-colors"
                >
                  ✏️ Edit Macro
                </button>
                <button
                  onClick={() => deleteCommunityMacro(inspectMacro.id)}
                  className="rounded-lg border border-red-900 bg-red-950/40 hover:bg-red-900/60 px-3 py-1.5 text-xs font-semibold text-red-300 transition-colors"
                >
                  🗑️ Delete
                </button>
                {isAdmin && (
                  <button
                    onClick={() => toggleVerifyMacro(inspectMacro.id)}
                    className={`rounded-lg border px-3 py-1.5 text-xs font-semibold transition-colors ${
                      inspectMacro.isVerified
                        ? "border-purple-500 bg-purple-950/60 text-purple-300"
                        : "border-neutral-700 bg-neutral-800 text-neutral-300 hover:bg-neutral-700"
                    }`}
                  >
                    {inspectMacro.isVerified ? "🛡️ Verified ✓" : "🛡️ Verify Globally"}
                  </button>
                )}
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => copyMacroCode(inspectMacro)}
                  className="rounded-lg border border-neutral-700 bg-neutral-800 hover:bg-neutral-700 px-3 py-1.5 text-xs font-semibold text-neutral-200 transition-colors"
                >
                  {copiedId === inspectMacro.id ? "✓ Copied" : "📋 Copy Script"}
                </button>
                <button
                  onClick={() => {
                    installCommunityMacro(inspectMacro);
                    setInspectMacro(null);
                    setMainTab("local");
                  }}
                  className="rounded-lg border border-purple-500 bg-purple-600 hover:bg-purple-500 px-3.5 py-1.5 text-xs font-bold text-white shadow-sm transition-all"
                >
                  {installedMap[inspectMacro.id] ? "✓ Reinstall to My Macros" : "📥 Install to My Macros"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add / Edit / Publish Community Macro Modal */}
      {showAddModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm"
          onClick={() => setShowAddModal(false)}
        >
          <div
            className="flex max-h-[90vh] w-full max-w-2xl flex-col rounded-xl border border-neutral-700 bg-neutral-900 shadow-2xl"
            onClick={e => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-neutral-800 px-5 py-3.5">
              <div className="flex items-center gap-2">
                <span className="text-base">🌐</span>
                <h3 className="text-sm font-bold text-neutral-100">
                  {editingCommunityId ? "Edit Community Macro" : "Publish Macro to Global Community"}
                </h3>
              </div>
              <button
                onClick={() => setShowAddModal(false)}
                className="flex h-7 w-7 items-center justify-center rounded-full bg-neutral-800 text-xs text-neutral-400 hover:bg-neutral-700 hover:text-white"
              >
                ✕
              </button>
            </div>

            {/* Modal Form */}
            <div className="flex-1 overflow-y-auto p-5 space-y-4 custom-scrollbar">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-semibold text-neutral-300 uppercase tracking-wider block mb-1">
                    Macro Name *
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Awoke's Ultra Skate Suite"
                    value={formName}
                    onChange={e => {
                      setFormName(e.target.value);
                      if (!formFilename || formFilename === "macro.ahk") {
                        setFormFilename(e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, "_") + ".ahk");
                      }
                    }}
                    className="w-full rounded-lg border border-neutral-700 bg-neutral-950 px-3 py-1.5 text-xs text-neutral-100 placeholder-neutral-500 focus:border-purple-500 focus:outline-none"
                    autoFocus
                  />
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-neutral-300 uppercase tracking-wider block mb-1">
                    Filename (.ahk)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. awoke_skates.ahk"
                    value={formFilename}
                    onChange={e => setFormFilename(e.target.value)}
                    className="w-full rounded-lg border border-neutral-700 bg-neutral-950 px-3 py-1.5 text-xs text-neutral-100 placeholder-neutral-500 focus:border-purple-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div>
                  <label className="text-[11px] font-semibold text-neutral-300 uppercase tracking-wider block mb-1">
                    Uploaded / Created By *
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Awoke, GamerTag#1234"
                    value={formAuthor}
                    onChange={e => setFormAuthor(e.target.value)}
                    className="w-full rounded-lg border border-neutral-700 bg-neutral-950 px-3 py-1.5 text-xs text-purple-300 font-bold focus:border-purple-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-neutral-300 uppercase tracking-wider block mb-1">
                    Category
                  </label>
                  <select
                    value={formCategory}
                    onChange={e => setFormCategory(e.target.value as any)}
                    className="w-full rounded-lg border border-neutral-700 bg-neutral-950 px-3 py-1.5 text-xs text-neutral-100 focus:border-purple-500 focus:outline-none"
                  >
                    <option value="Movement">⚡ Skating & Movement</option>
                    <option value="Combat">⚔️ Weapon Tech & DPS</option>
                    <option value="Farming">🌾 Farming & Automation</option>
                    <option value="Utility">🛠️ Utility & QoL</option>
                  </select>
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-neutral-300 uppercase tracking-wider block mb-1">
                    Class Target
                  </label>
                  <select
                    value={formClass}
                    onChange={e => setFormClass(e.target.value as any)}
                    className="w-full rounded-lg border border-neutral-700 bg-neutral-950 px-3 py-1.5 text-xs text-neutral-100 focus:border-purple-500 focus:outline-none"
                  >
                    <option value="All Classes">All Classes</option>
                    <option value="Warlock">Warlock</option>
                    <option value="Hunter">Hunter</option>
                    <option value="Titan">Titan</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-[11px] font-semibold text-neutral-300 uppercase tracking-wider block mb-1">
                  Description & Execution Notes
                </label>
                <textarea
                  rows={2}
                  placeholder="Describe how to use this macro and setup notes..."
                  value={formDescription}
                  onChange={e => setFormDescription(e.target.value)}
                  className="w-full rounded-lg border border-neutral-700 bg-neutral-950 px-3 py-1.5 text-xs text-neutral-100 placeholder-neutral-500 focus:border-purple-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-[11px] font-semibold text-neutral-300 uppercase tracking-wider block mb-1">
                  In-Game Keybinds (comma-separated)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Heavy Attack: Right Click, Jump: Space, Super: 6"
                  value={formKeybinds}
                  onChange={e => setFormKeybinds(e.target.value)}
                  className="w-full rounded-lg border border-neutral-700 bg-neutral-950 px-3 py-1.5 text-xs text-neutral-100 placeholder-neutral-500 focus:border-purple-500 focus:outline-none"
                />
              </div>

              {/* Admin Verification Checkbox */}
              {isAdmin && (
                <div className="flex items-center gap-2 rounded-lg border border-purple-500/40 bg-purple-950/30 p-3">
                  <input
                    type="checkbox"
                    id="verifyNow"
                    checked={formVerifyNow}
                    onChange={e => setFormVerifyNow(e.target.checked)}
                    className="h-4 w-4 rounded border-purple-600 text-purple-600 focus:ring-purple-500"
                  />
                  <label htmlFor="verifyNow" className="text-xs text-purple-200 font-semibold cursor-pointer">
                    🛡️ Mark as "Verified & Trusted by Awoke" globally
                  </label>
                </div>
              )}

              <div>
                <label className="text-[11px] font-semibold text-neutral-300 uppercase tracking-wider block mb-1">
                  AutoHotkey Script Code (.ahk) *
                </label>
                <textarea
                  rows={8}
                  placeholder="Paste your AutoHotkey script here..."
                  value={formCode}
                  onChange={e => setFormCode(e.target.value)}
                  className="w-full rounded-lg border border-neutral-700 bg-neutral-950 p-3 font-mono text-xs text-emerald-300 placeholder-neutral-600 focus:border-purple-500 focus:outline-none"
                  spellCheck={false}
                />
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex items-center justify-end gap-2 border-t border-neutral-800 bg-neutral-950/40 px-5 py-3">
              <button
                onClick={() => setShowAddModal(false)}
                className="rounded-lg border border-neutral-700 bg-neutral-800 hover:bg-neutral-700 px-3 py-1.5 text-xs text-neutral-300 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={saveCommunityMacroForm}
                disabled={syncing}
                className="rounded-lg border border-purple-500 bg-purple-600 hover:bg-purple-500 px-4 py-1.5 text-xs font-bold text-white shadow-sm transition-all disabled:opacity-50"
              >
                {syncing ? "🌐 Publishing..." : "🌐 Publish Worldwide"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Top Header & Tab Navigation Bar */}
      <div className="flex items-center justify-between border-b border-neutral-800 bg-neutral-900/60 px-4 py-2">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setMainTab("local")}
            className={`flex items-center gap-2 rounded-lg px-3.5 py-1.5 text-xs font-bold transition-all ${
              mainTab === "local"
                ? "bg-purple-600 text-white shadow-sm"
                : "bg-neutral-800/80 text-neutral-400 hover:bg-neutral-800 hover:text-neutral-200"
            }`}
          >
            <span>📁</span> My Macros ({files.length})
          </button>

          <button
            onClick={() => setMainTab("community")}
            className={`flex items-center gap-2 rounded-lg px-3.5 py-1.5 text-xs font-bold transition-all ${
              mainTab === "community"
                ? "bg-purple-600 text-white shadow-sm"
                : "bg-neutral-800/80 text-neutral-400 hover:bg-neutral-800 hover:text-neutral-200"
            }`}
          >
            <span>🌐</span> Community Hub
            <span className="rounded bg-purple-400/20 px-1.5 py-0.2 text-[10px] text-purple-300 font-semibold">
              {communityList.length} Global
            </span>
          </button>
        </div>

        {/* Global Action Tools */}
        <div className="flex items-center gap-2">
          {mainTab === "local" && (
            <>
              <button className={btn + " " + accent} onClick={startNew}>+ New Macro</button>
              <button className={btn} onClick={refreshLocal} title="Refresh local list">🔄 Refresh</button>
              <button className={btn} onClick={() => api.openMacrosFolder()} title="Open folder">📂 Open Folder</button>
            </>
          )}
          {mainTab === "community" && (
            <>
              <button
                className={btn}
                onClick={fetchGlobalCommunityMacros}
                disabled={syncing}
                title="Sync with global D2 Hub repository"
              >
                {syncing ? "🔄 Syncing..." : "🔄 Refresh Global Hub"}
              </button>

              {isAdmin ? (
                <div className="flex items-center gap-1.5 rounded-lg border border-purple-500/50 bg-purple-950/40 px-2.5 py-1 text-xs text-purple-300 font-bold shadow-sm">
                  <span>👑</span>
                  <span>Awoke (Admin / Verified Curator)</span>
                  <button
                    onClick={() => {
                      setIsAdmin(false);
                      setStatus("Exited Admin Mode");
                    }}
                    className="ml-1 text-[10px] text-neutral-500 hover:text-neutral-300"
                    title="Lock Admin Mode"
                  >
                    ✕
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setShowAdminKeyModal(true)}
                  className="rounded-lg border border-neutral-700 bg-neutral-850 hover:bg-neutral-800 px-2.5 py-1 text-xs text-neutral-400 hover:text-purple-300 transition-colors"
                  title="Unlock Awoke Admin Verification"
                >
                  🔑 Admin Key
                </button>
              )}

              <button
                onClick={openCreateModal}
                className="flex items-center gap-1.5 rounded-lg border border-purple-500 bg-purple-600 hover:bg-purple-500 px-3.5 py-1.5 text-xs font-bold text-white shadow-sm transition-all"
              >
                <span>➕</span> Publish Community Macro
              </button>
            </>
          )}
        </div>
      </div>

      {/* 1. MY MACROS VIEW */}
      {mainTab === "local" && (
        <div className="flex min-h-0 flex-1 overflow-hidden">
          {/* Sidebar */}
          <div className="flex w-[280px] shrink-0 flex-col border-r border-neutral-800 bg-neutral-950/60">
            <div className="min-h-0 flex-1 overflow-y-auto p-2 space-y-1 custom-scrollbar">
              {files.length === 0 ? (
                <div className="mt-12 text-center text-xs text-neutral-500 px-4 space-y-3">
                  <p>No local macros found.</p>
                  <p className="text-[11px] text-neutral-600">
                    Click <button onClick={() => setMainTab("community")} className="text-purple-400 font-semibold underline">Community Hub</button> to add or install your trusted macros, or click <span className="text-purple-400">+ New Macro</span>.
                  </p>
                </div>
              ) : (
                files.map(f => {
                  const binding = bindings.find(b => b.file === f.name);
                  const isActive = editing === f.name;
                  const isRunning = runningMacros.some(r => r.toLowerCase() === f.name.toLowerCase());
                  return (
                    <div
                      key={f.name}
                      className={"rounded-lg border px-2.5 py-2 transition-all " + (
                        isActive
                          ? "border-purple-500/80 bg-purple-950/30 shadow-md ring-1 ring-purple-500/40"
                          : isRunning
                          ? "border-emerald-500/60 bg-emerald-950/20 shadow-[0_0_15px_rgba(16,185,129,0.08)]"
                          : "border-neutral-800/80 bg-neutral-900/40 hover:border-neutral-700 hover:bg-neutral-850"
                      )}
                    >
                      <div className="flex items-center gap-1.5">
                        <button
                          className="flex-1 truncate text-left text-xs font-semibold text-neutral-200 hover:text-purple-300 flex items-center gap-1.5"
                          onClick={() => startEdit(f.name)}
                        >
                          <span className="truncate">{f.name}</span>
                          {isRunning && (
                            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/15 border border-emerald-500/40 px-1.5 py-0.2 text-[9px] font-bold text-emerald-400 animate-pulse tracking-wider">
                              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400"></span>
                              ACTIVE
                            </span>
                          )}
                        </button>
                        {binding?.hotkey && (
                          <span
                            className={"cursor-pointer rounded px-1.5 py-0.5 text-[10px] font-mono font-bold " + (
                              binding.enabled
                                ? "bg-purple-900/50 text-purple-300 border border-purple-700/50"
                                : "bg-neutral-800 text-neutral-500 line-through"
                            )}
                            onClick={e => {
                              e.stopPropagation();
                              toggleBinding(f.name);
                            }}
                            title={binding.enabled ? "Disable hotkey" : "Enable hotkey"}
                          >
                            {binding.hotkey}
                          </span>
                        )}
                        <button
                          className={"rounded px-1.5 py-0.5 text-xs " + (
                            recording === f.name
                              ? "bg-amber-900/50 text-amber-300 animate-pulse font-bold"
                              : "text-neutral-500 hover:bg-purple-900/40 hover:text-purple-300"
                          )}
                          onClick={e => {
                            e.stopPropagation();
                            assignHotkey(f.name);
                          }}
                          title="Set / Record Hotkey"
                        >
                          ⌨
                        </button>
                        {isRunning ? (
                          <button
                            className="rounded px-2 py-0.5 text-xs font-bold bg-red-950/70 border border-red-700/60 text-red-300 hover:bg-red-900 hover:text-red-100 transition-colors shadow-sm cursor-pointer"
                            onClick={e => {
                              e.stopPropagation();
                              stop(f.name);
                            }}
                            title="Stop Macro"
                          >
                            ⏹ Stop
                          </button>
                        ) : (
                          <button
                            className="rounded px-2 py-0.5 text-xs font-semibold bg-emerald-950/60 border border-emerald-700/50 text-emerald-300 hover:bg-emerald-900 hover:text-emerald-100 transition-colors shadow-sm cursor-pointer"
                            onClick={e => {
                              e.stopPropagation();
                              run(f.name);
                            }}
                            title="Run Macro"
                          >
                            ▶ Run
                          </button>
                        )}
                      </div>
                      <div className="mt-1 flex items-center justify-between text-[10px] text-neutral-500">
                        <span>{f.size > 0 ? (f.size / 1024).toFixed(1) + " KB" : "empty"}</span>
                        {binding && !binding.enabled && <span className="text-amber-500/80">disabled</span>}
                        {recording === f.name && <span className="text-amber-400 font-bold">press keys...</span>}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
            <div className="border-t border-neutral-800 px-3 py-1.5 text-[11px] text-neutral-500 flex items-center justify-between">
              <span>{status || files.length + " macro" + (files.length !== 1 ? "s" : "")}</span>
            </div>
          </div>

          {/* Editor View */}
          <div className="flex min-h-0 flex-1 flex-col bg-neutral-950">
            {editing ? (
              <>
                <div className="flex items-center gap-2 border-b border-neutral-800 bg-neutral-900/40 px-4 py-2">
                  {editing === "new" ? (
                    <input
                      className="w-56 rounded border border-neutral-700 bg-neutral-900 px-2.5 py-1 text-xs text-neutral-100 placeholder-neutral-500 focus:border-purple-500 focus:outline-none"
                      placeholder="macro_name.ahk"
                      value={editorName}
                      onChange={e => setEditorName(e.target.value)}
                      onKeyDown={e => {
                        if (e.key === "Enter") saveEditor();
                      }}
                      autoFocus
                    />
                  ) : (
                    <>
                      <span className="font-mono text-xs font-bold text-neutral-200">{editing}</span>
                      {selectedFile?.size !== undefined && (
                        <span className="text-[11px] text-neutral-500">
                          ({(selectedFile.size / 1024).toFixed(1)} KB)
                        </span>
                      )}
                      <div className="flex items-center gap-2 ml-3">
                        {runningMacros.some(r => r.toLowerCase() === editing?.toLowerCase()) ? (
                          <div className="flex items-center gap-2">
                            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 px-2.5 py-0.5 text-[10px] font-bold text-emerald-400">
                              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                              ACTIVE IN BACKGROUND
                            </span>
                            <button
                              onClick={() => stop(editing)}
                              className="flex items-center gap-1 rounded bg-red-950/80 border border-red-700/70 px-2.5 py-0.5 text-xs font-bold text-red-300 hover:bg-red-900 transition-colors shadow-sm cursor-pointer"
                            >
                              ⏹ Stop Macro
                            </button>
                          </div>
                        ) : (
                          <div className="flex items-center gap-2">
                            <span className="inline-flex items-center gap-1 rounded-full bg-neutral-900 border border-neutral-800 px-2 py-0.5 text-[10px] text-neutral-500">
                              ○ Idle
                            </span>
                            <button
                              onClick={() => run(editing)}
                              className="flex items-center gap-1 rounded bg-emerald-950/80 border border-emerald-700/70 px-2.5 py-0.5 text-xs font-semibold text-emerald-300 hover:bg-emerald-900 transition-colors shadow-sm cursor-pointer"
                            >
                              ▶ Run Macro
                            </button>
                          </div>
                        )}
                      </div>
                    </>
                  )}
                  <span className="flex-1" />
                  <button className={btn + " " + accent} onClick={saveEditor}>
                    💾 Save
                  </button>
                  <button
                    className={btn + " " + danger}
                    onClick={() => deleteFile(editing === "new" ? editorName : editing)}
                  >
                    🗑️ Delete
                  </button>
                  <button className={btn} onClick={() => setEditing(null)}>
                    ✕ Close
                  </button>
                </div>
                <textarea
                  ref={textareaRef}
                  className="min-h-0 flex-1 resize-none bg-neutral-950 p-4 font-mono text-[13px] leading-relaxed text-emerald-300 placeholder-neutral-700 focus:outline-none custom-scrollbar"
                  value={editorContent}
                  onChange={e => setEditorContent(e.target.value)}
                  placeholder={"; Write your AutoHotkey script here...\n#NoEnv\n#SingleInstance Force\n\nF1::\n  Send, Hello Guardian!\nreturn"}
                  spellCheck={false}
                />
              </>
            ) : (
              <div className="flex flex-1 flex-col items-center justify-center gap-3 text-xs text-neutral-500">
                <span className="text-4xl opacity-20">⌨️</span>
                <span>Select a macro to view/edit, or click <button onClick={() => setMainTab("community")} className="text-purple-400 font-semibold underline">Community Hub</button></span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 2. COMMUNITY HUB VIEW */}
      {mainTab === "community" && (
        <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
          {/* Search & Filter Header */}
          <div className="border-b border-neutral-800 bg-neutral-900/40 p-4 space-y-3">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
              {/* Search Bar */}
              <div className="relative flex-1 max-w-md">
                <input
                  type="text"
                  placeholder="Search community macros by name, author, or tech..."
                  value={communitySearch}
                  onChange={e => setCommunitySearch(e.target.value)}
                  className="w-full rounded-lg border border-neutral-700 bg-neutral-900/90 px-3.5 py-2 pl-9 text-xs text-neutral-200 placeholder-neutral-500 focus:border-purple-500 focus:outline-none transition-colors"
                />
                <span className="absolute left-3 top-2.5 text-xs text-neutral-500">🔍</span>
                {communitySearch && (
                  <button
                    onClick={() => setCommunitySearch("")}
                    className="absolute right-2.5 top-2 text-xs text-neutral-400 hover:text-neutral-200"
                  >
                    ✕
                  </button>
                )}
              </div>

              {/* Class & Verification Filter */}
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setVerifiedFilter(!verifiedFilter)}
                  className={`flex items-center gap-1 rounded-md px-2.5 py-1 text-xs font-semibold transition-colors ${
                    verifiedFilter
                      ? "bg-purple-600 text-white"
                      : "bg-neutral-800 text-neutral-400 hover:bg-neutral-700 hover:text-neutral-200"
                  }`}
                >
                  <span>🛡️</span> Verified Only
                </button>

                <div className="flex items-center gap-1.5">
                  <span className="text-xs text-neutral-400 font-medium">Class:</span>
                  <div className="flex gap-1">
                    {["all", "Warlock", "Hunter", "Titan", "All Classes"].map(cls => (
                      <button
                        key={cls}
                        onClick={() => setSelectedClass(cls)}
                        className={`rounded-md px-2.5 py-1 text-xs font-semibold transition-colors ${
                          selectedClass === cls
                            ? "bg-purple-600 text-white"
                            : "bg-neutral-800 text-neutral-400 hover:bg-neutral-700 hover:text-neutral-200"
                        }`}
                      >
                        {cls === "all" ? "All Classes" : cls}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Category Filter Pills */}
            <div className="flex flex-wrap gap-2 pt-1 border-t border-neutral-800/60">
              {[
                { id: "all", label: "✨ All Macros" },
                { id: "Movement", label: "⚡ Skating & Movement" },
                { id: "Combat", label: "⚔️ Weapon Tech & DPS" },
                { id: "Farming", label: "🌾 Farming & Automation" },
                { id: "Utility", label: "🛠️ Utility & QoL" }
              ].map(cat => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-all ${
                    selectedCategory === cat.id
                      ? "bg-purple-600/30 border border-purple-500 text-purple-200 shadow-sm font-bold"
                      : "bg-neutral-900 border border-neutral-800 text-neutral-400 hover:bg-neutral-800 hover:text-neutral-200"
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          {/* Community Cards Grid */}
          <div className="flex-1 overflow-y-auto p-5 custom-scrollbar">
            {filteredCommunityMacros.length === 0 ? (
              <div className="flex h-72 flex-col items-center justify-center text-neutral-400 space-y-4 text-center px-4">
                <span className="text-5xl opacity-40">🌐</span>
                <div className="max-w-md space-y-1">
                  <h4 className="text-sm font-bold text-neutral-200">No Community Macros Online</h4>
                  <p className="text-xs text-neutral-500 leading-relaxed">
                    Click <strong>Publish Community Macro</strong> to upload a macro. It will sync automatically to the global database and show up for every player using D2 Hub worldwide.
                  </p>
                </div>
                <button
                  onClick={openCreateModal}
                  className="flex items-center gap-1.5 rounded-lg border border-purple-500 bg-purple-600 hover:bg-purple-500 px-4 py-2 text-xs font-bold text-white shadow-lg transition-all"
                >
                  <span>➕</span> Publish Community Macro
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredCommunityMacros.map(macro => {
                  const isInstalled = Boolean(installedMap[macro.id]);
                  const isAwokeAuthor = macro.author.toLowerCase() === "awoke";

                  return (
                    <div
                      key={macro.id}
                      className="flex flex-col justify-between rounded-xl border border-neutral-800 bg-neutral-900/70 p-4 hover:border-neutral-700 transition-all shadow-md group"
                    >
                      <div className="space-y-3">
                        {/* Card Header */}
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <div className="flex items-center gap-1.5 flex-wrap">
                              <h3 className="text-sm font-bold text-neutral-100 group-hover:text-purple-300 transition-colors">
                                {macro.name}
                              </h3>
                              {macro.isVerified && (
                                <span
                                  className="rounded-full bg-purple-500/20 border border-purple-500/50 px-2 py-0.5 text-[10px] font-bold text-purple-300 flex items-center gap-1 shadow-sm"
                                  title={`Verified by ${macro.verifiedBy || "Awoke"}`}
                                >
                                  🛡️ Verified
                                </span>
                              )}
                              {macro.isTrusted && !macro.isVerified && (
                                <span className="rounded-full bg-emerald-500/20 border border-emerald-500/50 px-2 py-0.5 text-[10px] font-bold text-emerald-300">
                                  ✓ Trusted
                                </span>
                              )}
                            </div>

                            <div className="text-[11px] text-neutral-400 mt-1 flex items-center gap-1">
                              <span>Uploaded by</span>
                              <span className={`font-bold ${isAwokeAuthor ? "text-purple-400" : "text-neutral-300"}`}>
                                {macro.author}
                              </span>
                              {isAwokeAuthor && <span className="text-[10px] text-purple-300 font-mono">👑 (Dev)</span>}
                              <span>•</span>
                              <span>{macro.filename}</span>
                            </div>
                          </div>

                          {/* Class / Category Badge */}
                          <span
                            className={`rounded px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider shrink-0 ${
                              macro.classTarget === "Warlock"
                                ? "bg-amber-950/60 border border-amber-600/40 text-amber-300"
                                : macro.classTarget === "Hunter"
                                ? "bg-blue-950/60 border border-blue-600/40 text-blue-300"
                                : macro.classTarget === "Titan"
                                ? "bg-red-950/60 border border-red-600/40 text-red-300"
                                : "bg-purple-950/60 border border-purple-600/40 text-purple-300"
                            }`}
                          >
                            {macro.classTarget}
                          </span>
                        </div>

                        {/* Description */}
                        <p className="text-xs text-neutral-300 leading-relaxed line-clamp-3">
                          {macro.description}
                        </p>

                        {/* Keybind Badges */}
                        {macro.keybinds && macro.keybinds.length > 0 && (
                          <div className="flex flex-wrap gap-1.5 pt-1">
                            {macro.keybinds.map((kb, idx) => (
                              <span
                                key={idx}
                                className="rounded bg-neutral-950/80 border border-neutral-800 px-2 py-0.5 text-[10px] text-neutral-400"
                              >
                                {kb.action}: <strong className="text-neutral-200">{kb.key}</strong>
                              </span>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Card Action Footer */}
                      <div className="flex items-center justify-between border-t border-neutral-800/80 pt-3 mt-4">
                        <div className="flex items-center gap-1.5">
                          {isAdmin && (
                            <button
                              onClick={() => toggleVerifyMacro(macro.id)}
                              className={`rounded-lg px-2 py-1 text-[11px] font-semibold transition-colors ${
                                macro.isVerified
                                  ? "bg-purple-900/50 border border-purple-500/60 text-purple-200"
                                  : "bg-neutral-800 border border-neutral-700 text-neutral-400 hover:text-purple-300"
                              }`}
                              title={macro.isVerified ? "Remove Verification" : "Verify as Awoke globally"}
                            >
                              {macro.isVerified ? "🛡️ Verified" : "🛡️ Verify"}
                            </button>
                          )}
                          <button
                            onClick={() => openEditModal(macro)}
                            className="rounded-lg bg-neutral-800 hover:bg-neutral-700 px-2 py-1 text-[11px] text-neutral-300 transition-colors"
                            title="Edit this macro"
                          >
                            ✏️
                          </button>
                          <button
                            onClick={() => deleteCommunityMacro(macro.id)}
                            className="rounded-lg bg-neutral-800 hover:bg-red-950/50 hover:text-red-300 px-2 py-1 text-[11px] text-neutral-400 transition-colors"
                            title="Delete macro globally"
                          >
                            🗑️
                          </button>
                        </div>

                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() => setInspectMacro(macro)}
                            className="rounded-lg bg-neutral-800 hover:bg-neutral-700 px-2.5 py-1 text-xs text-neutral-300 transition-colors"
                            title="Inspect code"
                          >
                            👁️ View
                          </button>

                          <button
                            onClick={() => copyMacroCode(macro)}
                            className="rounded-lg bg-neutral-800 hover:bg-neutral-700 px-2.5 py-1 text-xs text-neutral-300 transition-colors"
                            title="Copy script"
                          >
                            {copiedId === macro.id ? "✓" : "📋"}
                          </button>

                          <button
                            onClick={() => installCommunityMacro(macro)}
                            className={`rounded-lg px-3 py-1 text-xs font-semibold transition-all ${
                              isInstalled
                                ? "bg-emerald-950/60 border border-emerald-600/60 text-emerald-300 hover:bg-emerald-900/60"
                                : "bg-purple-600 hover:bg-purple-500 text-white shadow-sm font-bold"
                            }`}
                          >
                            {isInstalled ? "✓ Installed" : "📥 Install"}
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
