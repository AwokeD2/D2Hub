// Destiny 2 Daily & Weekly Rotations Dataset & Live Schedule Engine

export interface LostSector {
  name: string;
  destination: string;
  champions: ("Barrier" | "Overload" | "Unstoppable")[];
  shields: ("Solar" | "Void" | "Arc" | "Strand" | "Stasis")[];
  surge: string;
  threat: string;
  guideUrl?: string;
}

export interface NightfallItem {
  strike: string;
  weapon: string;
  adeptWeapon: string;
  surge: string;
  champions: ("Barrier" | "Overload" | "Unstoppable")[];
}

export interface RaidRotation {
  name: string;
  featuredExotic: string;
  spoilsFarming: boolean;
}

export interface DungeonRotation {
  name: string;
  featuredExotic: string;
  pinnacle: boolean;
}

// Canonical modern Master/Legend Lost Sectors pool
export const LOST_SECTORS_POOL: LostSector[] = [
  {
    name: "The Forgotten Deep",
    destination: "The Pale Heart",
    champions: ["Barrier", "Unstoppable"],
    shields: ["Void", "Arc"],
    surge: "Solar / Strand",
    threat: "Void Threat",
  },
  {
    name: "The Broken Deep",
    destination: "The Pale Heart",
    champions: ["Overload", "Unstoppable"],
    shields: ["Solar"],
    surge: "Arc / Stasis",
    threat: "Arc Threat",
  },
  {
    name: "The Blooming Deep",
    destination: "The Pale Heart",
    champions: ["Barrier", "Overload"],
    shields: ["Arc", "Void"],
    surge: "Void / Strand",
    threat: "Solar Threat",
  },
  {
    name: "Thrilladrome",
    destination: "Neomuna (Liming Harbor)",
    champions: ["Barrier", "Overload"],
    shields: ["Void"],
    surge: "Arc / Strand",
    threat: "Void Threat",
  },
  {
    name: "Hydroponics Delta",
    destination: "Neomuna (Zephyr Concourse)",
    champions: ["Barrier", "Unstoppable"],
    shields: ["Void"],
    surge: "Solar / Strand",
    threat: "Void Threat",
  },
  {
    name: "Gilded Precept",
    destination: "Neomuna (Ahamkara Head)",
    champions: ["Barrier", "Unstoppable"],
    shields: ["Solar"],
    surge: "Arc / Stasis",
    threat: "Solar Threat",
  },
  {
    name: "Bunker E15",
    destination: "Europa (Eventide Ruins)",
    champions: ["Barrier", "Overload"],
    shields: ["Void"],
    surge: "Void / Solar",
    threat: "Void Threat",
  },
  {
    name: "Perdition",
    destination: "Europa (Cadmus Ridge)",
    champions: ["Barrier", "Overload"],
    shields: ["Arc", "Void"],
    surge: "Arc / Stasis",
    threat: "Arc Threat",
  },
  {
    name: "Concealed Void",
    destination: "Europa (Asterion Abyss)",
    champions: ["Barrier", "Overload"],
    shields: ["Solar", "Void", "Arc"],
    surge: "Solar / Strand",
    threat: "Solar Threat",
  },
  {
    name: "Aphelion's Rest",
    destination: "Dreaming City (The Strand)",
    champions: ["Overload", "Unstoppable"],
    shields: ["Void"],
    surge: "Stasis / Strand",
    threat: "Void Threat",
  },
  {
    name: "Chamber of Starlight",
    destination: "Dreaming City (Rheasilvia)",
    champions: ["Unstoppable", "Overload"],
    shields: ["Solar", "Void"],
    surge: "Solar / Void",
    threat: "Solar Threat",
  },
  {
    name: "Bay of Drowned Wishes",
    destination: "Dreaming City (Divalian Mists)",
    champions: ["Overload", "Unstoppable"],
    shields: ["Void"],
    surge: "Arc / Solar",
    threat: "Arc Threat",
  },
];

// Exotic armor rotation cycle: Helmet -> Gauntlets -> Chest -> Legs
export const EXOTIC_SLOTS = ["Helmets", "Gauntlets", "Chest Armor", "Leg Armor"] as const;

// Featured weekly Nightfalls
export const NIGHTFALLS_POOL: NightfallItem[] = [
  {
    strike: "The Disgraced",
    weapon: "Uzume RR4 (Sniper)",
    adeptWeapon: "Uzume RR4 (Adept)",
    surge: "Arc / Strand",
    champions: ["Barrier", "Unstoppable"],
  },
  {
    strike: "Fallen S.A.B.E.R.",
    weapon: "The Slammer (Sword)",
    adeptWeapon: "The Slammer (Adept)",
    surge: "Arc / Void",
    champions: ["Barrier", "Overload"],
  },
  {
    strike: "Liminality",
    weapon: "Scintillation (Linear Fusion)",
    adeptWeapon: "Scintillation (Adept)",
    surge: "Void / Strand",
    champions: ["Barrier", "Unstoppable"],
  },
  {
    strike: "Battleground: Europa",
    weapon: "Wild Style (Grenade Launcher)",
    adeptWeapon: "Wild Style (Adept)",
    surge: "Solar / Stasis",
    champions: ["Barrier", "Unstoppable"],
  },
  {
    strike: "Heist Battleground: Moon",
    weapon: "Undercurrent (Wave Frame GL)",
    adeptWeapon: "Undercurrent (Adept)",
    surge: "Arc / Strand",
    champions: ["Barrier", "Unstoppable"],
  },
  {
    strike: "The Devil's Lair",
    weapon: "Warden's Law (Hand Cannon)",
    adeptWeapon: "Warden's Law (Adept)",
    surge: "Arc / Void",
    champions: ["Barrier", "Overload"],
  },
];

export const RAIDS_POOL: RaidRotation[] = [
  { name: "Salvation's Edge", featuredExotic: "Euphony (Linear Fusion)", spoilsFarming: true },
  { name: "Root of Nightmares", featuredExotic: "Conditional Finality (Shotgun)", spoilsFarming: true },
  { name: "Crota's End", featuredExotic: "Necrochasm (Auto Rifle)", spoilsFarming: true },
  { name: "Vault of Glass", featuredExotic: "Vex Mythoclast (Fusion)", spoilsFarming: true },
  { name: "King's Fall", featuredExotic: "Touch of Malice (Scout)", spoilsFarming: true },
  { name: "Vow of the Disciple", featuredExotic: "Collective Obligation (Pulse)", spoilsFarming: true },
  { name: "Deep Stone Crypt", featuredExotic: "Eyes of Tomorrow (Rocket)", spoilsFarming: true },
  { name: "Last Wish", featuredExotic: "One Thousand Voices (Fusion)", spoilsFarming: true },
];

export const DUNGEONS_POOL: DungeonRotation[] = [
  { name: "Vesper's Host", featuredExotic: "Ice Breaker (Sniper Rifle)", pinnacle: true },
  { name: "Warlord's Ruin", featuredExotic: "Buried Bloodline (Sidearm)", pinnacle: true },
  { name: "Ghosts of the Deep", featuredExotic: "The Navigator (Trace Rifle)", pinnacle: true },
  { name: "Spire of the Watcher", featuredExotic: "Hierarchy of Needs (Bow)", pinnacle: true },
  { name: "Duality", featuredExotic: "Heartshadow (Sword)", pinnacle: true },
  { name: "Grasp of Avarice", featuredExotic: "Gjallarhorn Catalyst / Eyasluna", pinnacle: true },
  { name: "Prophecy", featuredExotic: "Judgment / Relentless Rolls", pinnacle: true },
  { name: "Pit of Heresy", featuredExotic: "High-Stat Armor Spikes", pinnacle: true },
  { name: "Shattered Throne", featuredExotic: "Wish-Ender Token Runs", pinnacle: true },
];

// Calculation of current day / week based on Destiny 2 Reset anchor:
// Anchor: Tuesday Jan 2, 2024 at 17:00:00 UTC
const ANCHOR_UTC_MS = Date.UTC(2024, 0, 2, 17, 0, 0);

export function getResetState(now = new Date()) {
  const nowMs = now.getTime();
  const diffDays = Math.floor((nowMs - ANCHOR_UTC_MS) / (1000 * 60 * 60 * 24));
  const diffWeeks = Math.floor(diffDays / 7);

  // Lost sector index and exotic slot
  const lostSectorIndex = ((diffDays % LOST_SECTORS_POOL.length) + LOST_SECTORS_POOL.length) % LOST_SECTORS_POOL.length;
  const exoticSlot = EXOTIC_SLOTS[((diffDays % EXOTIC_SLOTS.length) + EXOTIC_SLOTS.length) % EXOTIC_SLOTS.length];
  const currentLostSector = LOST_SECTORS_POOL[lostSectorIndex];

  // Nightfall & featured raids
  const nightfallIndex = ((diffWeeks % NIGHTFALLS_POOL.length) + NIGHTFALLS_POOL.length) % NIGHTFALLS_POOL.length;
  const currentNightfall = NIGHTFALLS_POOL[nightfallIndex];

  const raidIndex = ((diffWeeks % RAIDS_POOL.length) + RAIDS_POOL.length) % RAIDS_POOL.length;
  const currentRaid = RAIDS_POOL[raidIndex];

  const dungeonIndex = ((diffWeeks % DUNGEONS_POOL.length) + DUNGEONS_POOL.length) % DUNGEONS_POOL.length;
  const currentDungeon = DUNGEONS_POOL[dungeonIndex];

  // Next Daily Reset: upcoming 17:00 UTC
  const nextDaily = new Date(now);
  nextDaily.setUTCHours(17, 0, 0, 0);
  if (now.getTime() >= nextDaily.getTime()) {
    nextDaily.setUTCDate(nextDaily.getUTCDate() + 1);
  }

  // Next Weekly Reset: upcoming Tuesday 17:00 UTC
  const nextWeekly = new Date(now);
  nextWeekly.setUTCHours(17, 0, 0, 0);
  const dayOfWeek = nextWeekly.getUTCDay(); // 0 is Sun, 2 is Tue
  let daysUntilTuesday = (2 - dayOfWeek + 7) % 7;
  if (daysUntilTuesday === 0 && now.getTime() >= nextWeekly.getTime()) {
    daysUntilTuesday = 7;
  }
  nextWeekly.setUTCDate(nextWeekly.getUTCDate() + daysUntilTuesday);

  // Xûr window: Friday 17:00 UTC to Tuesday 17:00 UTC
  const currentUtcDay = now.getUTCDay();
  const currentUtcHour = now.getUTCHours();
  const isXurActive =
    (currentUtcDay === 5 && currentUtcHour >= 17) || // Fri after 17:00
    currentUtcDay === 6 || // Sat
    currentUtcDay === 0 || // Sun
    currentUtcDay === 1 || // Mon
    (currentUtcDay === 2 && currentUtcHour < 17); // Tue before 17:00

  return {
    currentLostSector,
    exoticSlot,
    currentNightfall,
    currentRaid,
    currentDungeon,
    nextDaily,
    nextWeekly,
    isXurActive,
  };
}
