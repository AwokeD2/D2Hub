// D2 Hub's adapter over d2ttk's vendored engine (see README.md).
// This is a 1:1 port of the optimise-mode logic from d2ttk's WeaponPage chunk:
// mode weights/favoured tables and the column-picker, calling the vendored
// stats/constants/build-code modules for perk effects, damage profiles and TTK.
//
// Import map (minified export -> meaning), derived from WeaponPage's imports:
//   stats.js:      e = perkEffect(name), f = computeTtk(args), n = normaliseName
//   constants.js:  a = STAT hashes,      G = guardianHp (230)
//   build-code.js: g = damageProfile(weapon, frameTable, exoticTable),
//                  h = frame damage table, f = exotic damage table

import { g as damageProfile, h as FRAME_TABLE, f as EXOTIC_TABLE, c as computeDisplay } from "./build-code.DxSnnzfm.js";
import { e as perkEffect, f as computeTtk, n as normName } from "./stats.mH12I4Q0.js";
import { a as STAT, G as GUARDIAN_HP } from "./constants.CnI7Hrdg.js";

const STAT_BY_NAME = {
  range: STAT.RANGE,
  stability: STAT.STABILITY,
  handling: STAT.HANDLING,
  aimAssistance: STAT.AIM_ASSISTANCE,
  reloadSpeed: STAT.RELOAD_SPEED,
};
const HASH_TO_NAME = Object.fromEntries(Object.entries(STAT_BY_NAME).map(([n, h]) => [h, n]));

// Verbatim from d2ttk (weights + favoured-perk bonus tables).
export const MODES = [
  { key: "lowest-ttk", label: "Lowest TTK", weights: { stability: 1, handling: 1 }, favoured: {}, ttkMode: "lowest" },
  { key: "easiest-ttk", label: "Easiest TTK", weights: { stability: 1, handling: 1 },
    favoured: { headseeker: 50, rampage: 40, "golden tricorn": 40, "target lock": 40, "kill clip": 30, frenzy: 30 }, ttkMode: "easiest" },
  { key: "best-feel", label: "Best feel", weights: { aimAssistance: 3, handling: 2, stability: 1 },
    favoured: { "moving target": 30, rangefinder: 25, "zen moment": 20, "opening shot": 25, "keep away": 20 } },
  { key: "most-reliable", label: "Most reliable", weights: { range: 2, stability: 2, handling: 2, reloadSpeed: 1 },
    favoured: { "zen moment": 25, "moving target": 20, rangefinder: 20, "fragile focus": 15 } },
  { key: "duelling", label: "Duelling", weights: { range: 3, stability: 3, aimAssistance: 2 },
    favoured: { rangefinder: 25, "zen moment": 25, "moving target": 20, "tap the trigger": 20 } },
];

function plugStatMods(plug) {
  const out = {};
  const add = (hash, v) => {
    const n = HASH_TO_NAME[hash];
    if (n) out[n] = (out[n] ?? 0) + v;
  };
  for (const m of plug.statModifiers ?? []) add(m.statHash, m.value);
  const eff = perkEffect(plug.name);
  if (eff) {
    const bonuses = eff.statBonuses ?? eff.tiers?.[eff.tiers.length - 1]?.statBonuses ?? [];
    for (const b of bonuses) add(b.statHash, b.value);
  }
  return out;
}

function cappedGain(cur, add) {
  return Math.min(100, cur + add) - Math.min(100, cur);
}

function scorePlug(plug, mode, stats) {
  const mods = plugStatMods(plug);
  let s = 0;
  for (const [stat, w] of Object.entries(mode.weights)) {
    s += w * cappedGain(stats[stat] ?? 0, mods[stat] ?? 0);
  }
  s += mode.favoured[normName(plug.name)] ?? 0;
  return s;
}

function currentStats(weapon) {
  const out = { range: 0, stability: 0, handling: 0, aimAssistance: 0, reloadSpeed: 0 };
  for (const st of weapon.stats ?? []) {
    const n = HASH_TO_NAME[st.statHash];
    if (n) out[n] = st.displayValue;
  }
  return out;
}

function bestTtkPlug(plugs, dmg, mode) {
  let best = null;
  for (const p of plugs) {
    const eff = perkEffect(p.name);
    const ttk = computeTtk({
      critDmg: dmg.crit, bodyDmg: dmg.body, rpm: dmg.rpm, burstSize: dmg.burstSize,
      mag: 30, damageMult: eff?.damageMult ?? 1, damageRamp: eff?.damageRamp ?? null,
      weaponStat: 200, guardianHp: GUARDIAN_HP, fireDelayMult: eff?.drawTimeMult ?? 1,
    });
    const fav = mode.favoured[normName(p.name)] ?? 0;
    const adjusted = ttk - (mode.ttkMode === "easiest" ? fav * 0.001 : 0);
    if (!best || adjusted < best.adjusted) best = { hash: p.hash, adjusted, ttk };
  }
  return best;
}

const SKIP_COLUMNS = new Set(["Intrinsic"]);
const TRAIT_COLUMNS = new Set(["Trait 1", "Trait 2"]);

/**
 * Clone of d2ttk's per-socket optimise picker. Returns null for mode "off".
 * { mode, picks: {socketIndex: plugHash}, stats (optimised), baseStats,
 *   dmg (damage profile incl. base optimalTtkSeconds), optimalTtk (seconds,
 *   for the picked trait roll in TTK modes; base profile TTK otherwise) }
 */
export function pickRoll(weapon, modeKey) {
  const mode = MODES.find((m) => m.key === modeKey) ?? null;
  if (!mode || !weapon?.sockets) return null;

  const dmg = damageProfile(weapon, FRAME_TABLE, EXOTIC_TABLE);
  const stats = currentStats(weapon);
  const baseStats = { ...stats };
  const picks = {};
  let pickedTtk = null;

  for (const socket of weapon.sockets) {
    if (SKIP_COLUMNS.has(socket.columnLabel) || (socket.plugs ?? []).length === 0) continue;

    if (mode.ttkMode && TRAIT_COLUMNS.has(socket.columnLabel) && dmg) {
      const best = bestTtkPlug(socket.plugs, dmg, mode);
      if (best) {
        picks[socket.socketIndex] = best.hash;
        if (pickedTtk === null || best.ttk < pickedTtk) pickedTtk = best.ttk;
      }
      continue;
    }

    let best = null;
    for (const p of socket.plugs) {
      const s = scorePlug(p, mode, stats);
      if (!best || s > best.score) best = { hash: p.hash, score: s, plug: p };
    }
    if (best) {
      picks[socket.socketIndex] = best.hash;
      const mods = plugStatMods(best.plug);
      for (const [n, v] of Object.entries(mods)) stats[n] = Math.min(100, (stats[n] ?? 0) + v);
    }
  }

  const optimalTtk = pickedTtk ?? dmg?.optimalTtkSeconds ?? null;
  return { mode, picks, stats, baseStats, dmg, optimalTtk };
}

// Comprehensive curated priority tables for D2 Reference List (PvE & PvP meta combinations).
const GLOBAL_PERK_SCORES = {
  // S+ Tier Universal Traits
  "keep away": 95, "heal clip": 95, "headseeker": 95, "kill clip": 95,
  "incandescent": 95, "voltshot": 95, "destabilizing rounds": 90, "kinetic tremors": 95,
  "bait and switch": 100, "precision instrument": 95, "reconstruction": 95, "rewind rounds": 95,
  "envious assassin": 95, "auto-loading holster": 95, "explosive light": 95, "cascade point": 90,
  "chain reaction": 95, "controlled burst": 95, "reservoir burst": 90, "snapshot sights": 90,
  "lone wolf": 90, "zen moment": 90, "moving target": 90, "opening shot": 95,
  "explosive payload": 95, "firefly": 90, "dragonfly": 85, "frenzy": 90, "target lock": 90,
  "outlaw": 85, "rapid hit": 90, "subsistence": 85, "slideshot": 90,
  "dynamic sway reduction": 85, "eye of the storm": 90, "tap the trigger": 85,
  "desperate measures": 85, "sword logic": 85, "one for all": 90, "rampage": 80,
  "golden tricorn": 80, "vorpal weapon": 85, "enlightened action": 80, "perpetual motion": 80,
  "demolitionist": 85, "overflow": 80, "slice": 80, "triple tap": 90, "fourth times the charm": 90,
  "fourth time's the charm": 90, "repulsor brace": 80, "threat detector": 85, "surrounded": 85, "hatchling": 75,
  "under pressure": 85, "fragile focus": 70, "rangefinder": 75, "firmly planted": 70,
  "slickdraw": 75, "discord": 75, "bipod": 85, "lead from gold": 85, "field prep": 80,
  "clown cartridge": 80, "impulse amplifier": 85, "chaos reshaped": 95, "withering gaze": 85,
  "rimestealer": 80, "reconnaissance": 80, "attrition orbs": 75, "strategist": 75,
  "closing time": 80, "to the pain": 80, "deconstruct": 80, "killing tally": 95,
  "trench barrel": 90, "one-two punch": 95, "close to melee": 85, "ambitious assassin": 85,

  // Barrels & Launchers
  "fluted barrel": 95, "smallbore": 90, "corkscrew rifling": 90, "arrowhead brake": 90,
  "hammer-forged rifling": 85, "polygonal rifling": 75, "extended barrel": 70, "full bore": 65,
  "barrel shroud": 90, "full choke": 90, "quick launch": 95, "smart drift control": 90,
  "hard launch": 85, "linear compensator": 85, "confined launch": 75, "volatile launch": 75,
  "elastic string": 100, "polymer string": 90,

  // Magazines, Batteries, & Rounds
  "ricochet rounds": 95, "high-caliber rounds": 90, "accurized rounds": 90, "appended mag": 85,
  "tactical mag": 85, "flared magwell": 80, "armor-piercing rounds": 80, "light mag": 75, "extended mag": 70,
  "projection fuse": 90, "particle repeater": 90, "liquid coils": 85, "accelerated coils": 85,
  "impact casing": 95, "alloy magazine": 85, "spike grenades": 95, "disorienting grenades": 95,
  "blinding grenades": 95, "high-explosive ordnance": 85, "mini-frags": 80, "assault mag": 90,
  "fiberglass arrow shaft": 95, "compact arrow shaft": 85,
};

// Weapon-Type Specific Overrides (boosts true godrolls for each specific weapon category)
const TYPE_PERK_BOOSTS = {
  "rocket launcher": {
    "bait and switch": 105, "explosive light": 100, "envious assassin": 100,
    "auto-loading holster": 100, "reconstruction": 100, "cascade point": 95,
    "bipod": 90, "field prep": 90, "clown cartridge": 90, "impact casing": 100,
    "quick launch": 100, "smart drift control": 95, "hard launch": 90,
    "keep away": 10, "headseeker": 10, "eye of the storm": 10, "moving target": 10
  },
  "grenade launcher": {
    "bait and switch": 105, "envious assassin": 100, "auto-loading holster": 100,
    "cascade point": 100, "explosive light": 95, "spike grenades": 100,
    "disorienting grenades": 100, "chain reaction": 100, "ambitious assassin": 95,
    "quick launch": 100, "hard launch": 95, "voltshot": 95, "lead from gold": 90,
    "keep away": 10, "headseeker": 10, "eye of the storm": 10
  },
  "heavy grenade launcher": {
    "bait and switch": 105, "envious assassin": 100, "auto-loading holster": 100,
    "cascade point": 100, "explosive light": 95, "spike grenades": 100,
    "chain reaction": 95, "quick launch": 100
  },
  "linear fusion rifle": {
    "bait and switch": 105, "precision instrument": 100, "firing line": 95,
    "rewind rounds": 100, "reconstruction": 100, "triple tap": 95,
    "fourth times the charm": 100, "fourth time's the charm": 100, "envious assassin": 95, "auto-loading holster": 90,
    "fluted barrel": 95, "arrowhead brake": 90, "accelerated coils": 95, "liquid coils": 90,
    "projection fuse": 90
  },
  "machine gun": {
    "killing tally": 105, "target lock": 95, "incandescent": 95, "voltshot": 95,
    "rewind rounds": 100, "reconstruction": 100, "feeding frenzy": 90, "subsistence": 90,
    "frenzy": 90, "fluted barrel": 95, "arrowhead brake": 95, "appended mag": 90, "tactical mag": 90
  },
  "sniper rifle": {
    "snapshot sights": 105, "opening shot": 100, "keep away": 95, "moving target": 95,
    "precision instrument": 95, "firing line": 95, "triple tap": 95, "fourth times the charm": 95,
    "fourth time's the charm": 95, "fluted barrel": 100, "accurized rounds": 95, "tactical mag": 90
  },
  "shotgun": {
    "slideshot": 105, "opening shot": 105, "threat detector": 100, "slickdraw": 95,
    "auto-loading holster": 90, "one-two punch": 100, "trench barrel": 95, "vorpal weapon": 90,
    "barrel shroud": 100, "full choke": 95, "corkscrew rifling": 90, "accurized rounds": 100,
    "assault mag": 95, "tactical mag": 85
  },
  "fusion rifle": {
    "controlled burst": 105, "reservoir burst": 100, "under pressure": 100, "high-impact reserves": 95,
    "auto-loading holster": 95, "reconstruction": 95, "kickstart": 95, "cornered": 90,
    "fluted barrel": 95, "smallbore": 90, "particle repeater": 100, "projection fuse": 95,
    "accelerated coils": 95, "liquid coils": 90
  },
  "hand cannon": {
    "keep away": 100, "eye of the storm": 100, "opening shot": 100, "slideshot": 95,
    "zen moment": 95, "moving target": 95, "heal clip": 95, "incandescent": 95,
    "firefly": 90, "explosive payload": 100, "precision instrument": 95, "kill clip": 95,
    "rapid hit": 90, "outlaw": 90, "fluted barrel": 95, "smallbore": 95, "hammer-forged rifling": 90,
    "ricochet rounds": 100, "accurized rounds": 95, "high-caliber rounds": 90
  },
  "pulse rifle": {
    "headseeker": 105, "keep away": 100, "zen moment": 95, "heal clip": 95,
    "kill clip": 95, "incandescent": 95, "kinetic tremors": 95, "moving target": 90,
    "rapid hit": 90, "outlaw": 90, "arrowhead brake": 100, "fluted barrel": 95,
    "smallbore": 95, "ricochet rounds": 100, "high-caliber rounds": 90
  },
  "submachine gun": {
    "target lock": 100, "kill clip": 100, "dynamic sway reduction": 95, "zen moment": 95,
    "keep away": 95, "threat detector": 95, "heal clip": 95, "incandescent": 95,
    "voltshot": 95, "frenzy": 90, "subsistence": 90, "tap the trigger": 90,
    "fluted barrel": 95, "smallbore": 95, "corkscrew rifling": 90, "ricochet rounds": 100,
    "high-caliber rounds": 95, "accurized rounds": 90, "tactical mag": 85
  },
  "auto rifle": {
    "target lock": 95, "dynamic sway reduction": 95, "zen moment": 95, "keep away": 95,
    "heal clip": 95, "incandescent": 95, "voltshot": 95, "kinetic tremors": 95,
    "onslaught": 100, "kill clip": 95, "subsistence": 90, "rewind rounds": 95,
    "arrowhead brake": 95, "fluted barrel": 95, "smallbore": 90, "ricochet rounds": 100,
    "high-caliber rounds": 90, "appended mag": 85
  },
  "bow": {
    "archer's tempo": 105, "precision instrument": 100, "opening shot": 95, "elastic string": 105,
    "fiberglass arrow shaft": 100, "compact arrow shaft": 90, "straight fletching": 90,
    "dragonfly": 95, "incandescent": 95, "voltshot": 95, "kinetic tremors": 95,
    "successful warm-up": 95, "explosive head": 100, "shoot to loot": 90
  }
};

/**
 * Returns exact curated meta godroll picks and alternatives from https://d2referencelist.org.
 */
export function pickReferenceRoll(weapon, refDb) {
  if (!weapon?.sockets) return null;
  const wName = normName(weapon.name);

  // If D2 Reference List database is supplied, look up the exact weapon (749 endgame weapons)
  if (Array.isArray(refDb) && refDb.length > 0) {
    const entry = refDb.find(w => {
      const rw = normName(w.name);
      return rw === wName || rw.includes(wName) || wName.includes(rw);
    });
    if (entry) {
      const parsePerkLines = (s) => (s ? String(s).split(/\r?\n/).map(x => normName(x)).filter(Boolean) : []);
      const refTargets = {
        barrel: parsePerkLines(entry.barrel),
        mag: parsePerkLines(entry.mag),
        perk1: parsePerkLines(entry.perk1),
        perk2: parsePerkLines(entry.perk2),
        origin: parsePerkLines(entry.origin)
      };

      const picks = {};
      const alts = {};

      for (const socket of weapon.sockets) {
        if (SKIP_COLUMNS.has(socket.columnLabel) || (socket.plugs ?? []).length === 0) continue;
        const col = socket.columnLabel;
        let targetList = [];
        if (col === "Barrel" || col === "Sight" || col === "Launch" || col === "Blade" || col === "Bowstring") {
          targetList = refTargets.barrel;
        } else if (col === "Magazine" || col === "Battery" || col === "Arrow" || col === "Guard") {
          targetList = refTargets.mag;
        } else if (col === "Trait 1" || col === "Column 3" || col === "Perk 1") {
          targetList = refTargets.perk1;
        } else if (col === "Trait 2" || col === "Column 4" || col === "Perk 2") {
          targetList = refTargets.perk2;
        } else if (col === "Origin Trait" || col === "Origin") {
          targetList = refTargets.origin;
        }

        const plugs = socket.plugs || [];
        const matchedPicks = [];
        for (const targetName of targetList) {
          const found = plugs.find(p => {
            const pn = normName(p.name);
            return pn === targetName || pn.includes(targetName) || targetName.includes(pn);
          });
          if (found && !matchedPicks.includes(found.hash)) {
            matchedPicks.push(found.hash);
          }
        }

        if (matchedPicks.length > 0) {
          picks[socket.socketIndex] = matchedPicks[0];
          if (matchedPicks.length > 1) {
            alts[socket.socketIndex] = matchedPicks.slice(1);
          }
        } else {
          // If this specific socket wasn't specified in d2ref, use archetype score
          const wType = (weapon.weaponType || weapon.itemTypeDisplayName || "").toLowerCase();
          const overrides = TYPE_PERK_BOOSTS[wType] || {};
          const scored = plugs.map(p => {
            const name = normName(p.name);
            const score = overrides[name] != null ? overrides[name] : (GLOBAL_PERK_SCORES[name] ?? 0);
            return { hash: p.hash, score };
          }).sort((a, b) => b.score - a.score);
          if (scored.length > 0) {
            picks[socket.socketIndex] = scored[0].hash;
          }
        }
      }

      const rollCount = entry.tier ? `${entry.tier}-TIER · D2 REFERENCE LIST` : "D2 REFERENCE LIST";
      return { picks, alts, tier: entry.tier, verdict: entry.verdict, rollCount };
    }
  }

  // Fallback to archetype scoring
  const wType = (weapon.weaponType || weapon.itemTypeDisplayName || "").toLowerCase();
  const overrides = TYPE_PERK_BOOSTS[wType] || {};
  const picks = {};
  const alts = {};

  for (const socket of weapon.sockets) {
    if (SKIP_COLUMNS.has(socket.columnLabel) || (socket.plugs ?? []).length === 0) continue;
    const scored = (socket.plugs ?? []).map(p => {
      const name = normName(p.name);
      const score = overrides[name] != null ? overrides[name] : (GLOBAL_PERK_SCORES[name] ?? 0);
      return { hash: p.hash, score, plug: p };
    }).sort((a, b) => b.score - a.score);

    if (scored.length > 0) {
      picks[socket.socketIndex] = scored[0].hash;
      const topAlts = scored.slice(1, 3).filter(x => x.score >= 70).map(x => x.hash);
      if (topAlts.length > 0) {
        alts[socket.socketIndex] = topAlts;
      }
    }
  }
  return { picks, alts, rollCount: "CURATED" };
}

/**
 * Resolves Light.gg community popularity & curated ratings (Gold, PvE blue, PvP red).
 */
export function pickLightGGRoll(weapon, lightggData) {
  if (!weapon?.sockets) return null;
  const perksList = lightggData?.perks || [];
  if (!Array.isArray(perksList) || perksList.length === 0) {
    return pickReferenceRoll(weapon);
  }

  const scoreMap = new Map();
  for (const p of perksList) {
    if (!p || !p.hash) continue;
    let score = p.pct || 0;
    if (p.isGold) score += 1000;
    if (p.isBlue) score += 500;
    if (p.isRed) score += 500;
    scoreMap.set(p.hash, score);
  }

  const picks = {};
  const alts = {};

  for (const socket of weapon.sockets) {
    if (SKIP_COLUMNS.has(socket.columnLabel) || (socket.plugs ?? []).length === 0) continue;
    const scored = (socket.plugs ?? []).map(plug => {
      const s = scoreMap.get(plug.hash) ?? 0;
      return { hash: plug.hash, score: s, plug };
    }).sort((a, b) => b.score - a.score);

    if (scored.length > 0) {
      picks[socket.socketIndex] = scored[0].hash;
      const topAlts = scored.slice(1, 3).filter(x => x.score >= 10).map(x => x.hash);
      if (topAlts.length > 0) {
        alts[socket.socketIndex] = topAlts;
      }
    }
  }

  return { picks, alts, rollCount: "LIGHT.GG" };
}

/** Base damage profile (optimalTtkSeconds, crit/body, pattern) without a mode. */
export function baseProfile(weapon) {
  try { return damageProfile(weapon, FRAME_TABLE, EXOTIC_TABLE); } catch { return null; }
}

/// ---------------------------------------------------------------------------
/// Site-exact display model. computeDisplay is d2ttk's own calculator (the
/// function behind the weapon page's stat sidebar): it applies the selected
/// perks' modifiers to every stat, the Tier bonus, statGroup interpolation
/// curves, and returns the roll's crit/body TTK.
/// ---------------------------------------------------------------------------

/** Mirror of the site's mount effect: fixed-roll weapons (every non-intrinsic
 * socket has exactly one plug) start fully selected; random rolls start empty. */
export function defaultSelections(weapon) {
  const sockets = (weapon.sockets ?? []).filter(
    (s) => s.columnLabel !== "Intrinsic" && (s.plugs ?? []).length > 0,
  );
  if (sockets.length > 0 && sockets.every((s) => s.plugs.length === 1)) {
    const out = {};
    for (const s of sockets) out[s.socketIndex] = s.plugs[0].hash;
    return out;
  }
  return {};
}

/**
 * Run the site's display calculator with its default state (Tier 5 where
 * supported, weapon stat 100, enhanced perks on, no buffs) plus the given
 * perk selection. picks null/undefined = the site's initial view.
 * Returns Sa's full result: { displayStats, orderedStats, derivedStats,
 * pvpDmg: {critTtk, bodyTtk, critDmg, bodyDmg, critShots, bodyShots, pattern},
 * rpm, baseRpm, activeEffects, ... } or null on failure.
 */
export function displayFor(weapon, statGroup, picks) {
  try {
    const selected = { ...defaultSelections(weapon), ...(picks ?? {}) };
    return computeDisplay(weapon, statGroup ?? null, {
      selectedPerks: selected,
      selectedTier: weapon.supportsTiering ? 5 : 1,
      weaponStat: 100,
      activatedPerks: new Map(),
      activeBuffs: new Map(),
      useEnhanced: true,
    });
  } catch (e) {
    console.error("displayFor failed:", e);
    return null;
  }
}
