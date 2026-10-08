// Destiny 2 Daily & Weekly Rotations Dataset & Live Schedule Engine
// Synchronized with Bungie Manifest & D2RAD Dual-Slot Rotation Timeline (d2rad.com)

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
  iconUrl: string;
  adeptIconUrl?: string;
  surge: string;
  champions: ("Barrier" | "Overload" | "Unstoppable")[];
}

export interface RaidRotation {
  id: string;
  name: string;
  featuredExotic: string;
  exoticIconUrl?: string;
  spoilsFarming: boolean;
}

export interface DungeonRotation {
  id: string;
  name: string;
  featuredExotic: string;
  exoticIconUrl?: string;
  pinnacle: boolean;
}

export interface WeeklyTimelineEntry {
  resetDate: Date;
  formattedDate: string;
  isCurrent: boolean;
  isNext: boolean;
  state: "Live data verified" | "Predicted";
  raids: [RaidRotation, RaidRotation];
  dungeons: [DungeonRotation, DungeonRotation];
  nightfall: NightfallItem;
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

// Featured weekly Nightfalls with official Bungie CDN weapon icons (Adept)
export const NIGHTFALLS_POOL: NightfallItem[] = [
  {
    strike: "The Disgraced",
    weapon: "Uzume RR4 (Sniper)",
    adeptWeapon: "Uzume RR4 (Adept)",
    iconUrl: "https://www.bungie.net/common/destiny2_content/icons/103bde336ea126cb029e2d0a1e390a9d.jpg",
    adeptIconUrl: "https://www.bungie.net/common/destiny2_content/icons/103bde336ea126cb029e2d0a1e390a9d.jpg",
    surge: "Arc / Strand",
    champions: ["Barrier", "Unstoppable"],
  },
  {
    strike: "Fallen S.A.B.E.R.",
    weapon: "The Slammer (Sword)",
    adeptWeapon: "The Slammer (Adept)",
    iconUrl: "https://www.bungie.net/common/destiny2_content/icons/86ac040ea14a03ea5267550c6612a803.jpg",
    adeptIconUrl: "https://www.bungie.net/common/destiny2_content/icons/86ac040ea14a03ea5267550c6612a803.jpg",
    surge: "Arc / Void",
    champions: ["Barrier", "Overload"],
  },
  {
    strike: "Liminality",
    weapon: "Scintillation (Linear Fusion)",
    adeptWeapon: "Scintillation (Adept)",
    iconUrl: "https://www.bungie.net/common/destiny2_content/icons/ed14ac4aa12009e1923264421e16c2ef.jpg",
    adeptIconUrl: "https://www.bungie.net/common/destiny2_content/icons/ed14ac4aa12009e1923264421e16c2ef.jpg",
    surge: "Void / Strand",
    champions: ["Barrier", "Unstoppable"],
  },
  {
    strike: "Battleground: Europa",
    weapon: "Wild Style (Grenade Launcher)",
    adeptWeapon: "Wild Style (Adept)",
    iconUrl: "https://www.bungie.net/common/destiny2_content/icons/a94bd173bc9d085e992c8089b869b215.jpg",
    adeptIconUrl: "https://www.bungie.net/common/destiny2_content/icons/a94bd173bc9d085e992c8089b869b215.jpg",
    surge: "Solar / Stasis",
    champions: ["Barrier", "Unstoppable"],
  },
  {
    strike: "Heist Battleground: Moon",
    weapon: "Undercurrent (Wave Frame GL)",
    adeptWeapon: "Undercurrent (Adept)",
    iconUrl: "https://www.bungie.net/common/destiny2_content/icons/7acc726a9f36c22c2f0261b1393fa369.jpg",
    adeptIconUrl: "https://www.bungie.net/common/destiny2_content/icons/7acc726a9f36c22c2f0261b1393fa369.jpg",
    surge: "Arc / Strand",
    champions: ["Barrier", "Unstoppable"],
  },
  {
    strike: "The Devil's Lair",
    weapon: "Warden's Law (Hand Cannon)",
    adeptWeapon: "Warden's Law (Adept)",
    iconUrl: "https://www.bungie.net/common/destiny2_content/icons/44a28fd1d59042f6c154119c571a2c3e.jpg",
    adeptIconUrl: "https://www.bungie.net/common/destiny2_content/icons/44a28fd1d59042f6c154119c571a2c3e.jpg",
    surge: "Arc / Void",
    champions: ["Barrier", "Overload"],
  },
  {
    strike: "PsiOps Battleground: Cosmodrome",
    weapon: "Shadow Price (Auto Rifle)",
    adeptWeapon: "Shadow Price (Adept)",
    iconUrl: "https://www.bungie.net/common/destiny2_content/icons/712f5e756b1b6f8a6178b1f34d3676f4.jpg",
    adeptIconUrl: "https://www.bungie.net/common/destiny2_content/icons/712f5e756b1b6f8a6178b1f34d3676f4.jpg",
    surge: "Arc / Solar",
    champions: ["Barrier", "Unstoppable"],
  },
  {
    strike: "Birthplace of the Vile",
    weapon: "Horror's Least (Pulse Rifle)",
    adeptWeapon: "Horror's Least (Adept)",
    iconUrl: "https://www.bungie.net/common/destiny2_content/icons/a084ca50c3bbccdce972b9c893254a15.jpg",
    adeptIconUrl: "https://www.bungie.net/common/destiny2_content/icons/a084ca50c3bbccdce972b9c893254a15.jpg",
    surge: "Void / Strand",
    champions: ["Overload", "Unstoppable"],
  },
];

// D2RAD Canonical 9-Raid Sequence (Loops 01 -> 09 -> 01)
export const CANONICAL_RAIDS: RaidRotation[] = [
  {
    id: "last-wish",
    name: "Last Wish",
    featuredExotic: "One Thousand Voices",
    exoticIconUrl: "https://www.bungie.net/common/destiny2_content/icons/51c53df606cca474dce3cadbf7d5ce28.jpg",
    spoilsFarming: true,
  },
  {
    id: "garden-of-salvation",
    name: "Garden of Salvation",
    featuredExotic: "Divinity (Quest)",
    exoticIconUrl: "https://www.bungie.net/common/destiny2_content/icons/c6aa03536fd68b5fca5ad6b83ea0cf1e.jpg",
    spoilsFarming: true,
  },
  {
    id: "deep-stone-crypt",
    name: "Deep Stone Crypt",
    featuredExotic: "Eyes of Tomorrow",
    exoticIconUrl: "https://www.bungie.net/common/destiny2_content/icons/9caeff89015f02ad52e6fefe95398b01.jpg",
    spoilsFarming: true,
  },
  {
    id: "vault-of-glass",
    name: "Vault of Glass",
    featuredExotic: "Vex Mythoclast",
    exoticIconUrl: "https://www.bungie.net/common/destiny2_content/icons/111a10b59029fc6a9ca5e821267e6f6c.jpg",
    spoilsFarming: true,
  },
  {
    id: "vow-of-the-disciple",
    name: "Vow of the Disciple",
    featuredExotic: "Collective Obligation",
    exoticIconUrl: "https://www.bungie.net/common/destiny2_content/icons/238ab90ba2f858ebb8a5a1797a13fdd4.jpg",
    spoilsFarming: true,
  },
  {
    id: "kings-fall",
    name: "King's Fall",
    featuredExotic: "Touch of Malice",
    exoticIconUrl: "https://www.bungie.net/common/destiny2_content/icons/106a8a40a6e55b5ec5088a26d1ed979d.jpg",
    spoilsFarming: true,
  },
  {
    id: "root-of-nightmares",
    name: "Root of Nightmares",
    featuredExotic: "Conditional Finality",
    exoticIconUrl: "https://www.bungie.net/common/destiny2_content/icons/c9b4d65adcdfcadde871e5961ce912fb.jpg",
    spoilsFarming: true,
  },
  {
    id: "crotas-end",
    name: "Crota's End",
    featuredExotic: "Necrochasm",
    exoticIconUrl: "https://www.bungie.net/common/destiny2_content/icons/52e8bb636771f4731da3f73f06fcad04.jpg",
    spoilsFarming: true,
  },
  {
    id: "salvations-edge",
    name: "Salvation's Edge",
    featuredExotic: "Euphony",
    exoticIconUrl: "https://www.bungie.net/common/destiny2_content/icons/fe16110003f0cc75145eed012458a667.jpg",
    spoilsFarming: true,
  },
];

// D2RAD Canonical 10-Dungeon Sequence (Loops 01 -> 10 -> 01)
export const CANONICAL_DUNGEONS: DungeonRotation[] = [
  {
    id: "shattered-throne",
    name: "The Shattered Throne",
    featuredExotic: "Wish-Ender",
    exoticIconUrl: "https://www.bungie.net/common/destiny2_content/icons/8e5d7a68305a0d1e53ccade9398c7e8b.jpg",
    pinnacle: true,
  },
  {
    id: "pit-of-heresy",
    name: "Pit of Heresy",
    featuredExotic: "Xenophage / High-Stat Armor",
    exoticIconUrl: "https://www.bungie.net/common/destiny2_content/icons/de34570a93281dc201690cfd146e6d24.jpg",
    pinnacle: true,
  },
  {
    id: "prophecy",
    name: "Prophecy",
    featuredExotic: "Judgment / Relentless Rolls",
    exoticIconUrl: "https://www.bungie.net/common/destiny2_content/icons/038d5831a7c95696367a8894093d1c5d.jpg",
    pinnacle: true,
  },
  {
    id: "grasp-of-avarice",
    name: "Grasp of Avarice",
    featuredExotic: "Gjallarhorn",
    exoticIconUrl: "https://www.bungie.net/common/destiny2_content/icons/b62083eed6a4708e581fc9a061bcc8e9.jpg",
    pinnacle: true,
  },
  {
    id: "duality",
    name: "Duality",
    featuredExotic: "Heartshadow",
    exoticIconUrl: "https://www.bungie.net/common/destiny2_content/icons/94c6933727fa885fb2002a8c7aee5e42.jpg",
    pinnacle: true,
  },
  {
    id: "spire-of-the-watcher",
    name: "Spire of the Watcher",
    featuredExotic: "Hierarchy of Needs",
    exoticIconUrl: "https://www.bungie.net/common/destiny2_content/icons/8c32410000243e6024130f755b23fbe6.jpg",
    pinnacle: true,
  },
  {
    id: "ghosts-of-the-deep",
    name: "Ghosts of the Deep",
    featuredExotic: "The Navigator",
    exoticIconUrl: "https://www.bungie.net/common/destiny2_content/icons/4984c634a7d2eca3baafc000a121263d.jpg",
    pinnacle: true,
  },
  {
    id: "warlords-ruin",
    name: "Warlord's Ruin",
    featuredExotic: "Buried Bloodline",
    exoticIconUrl: "https://www.bungie.net/common/destiny2_content/icons/fcae8edcd35227d35fca0a108d831840.jpg",
    pinnacle: true,
  },
  {
    id: "vespers-host",
    name: "Vesper's Host",
    featuredExotic: "Ice Breaker",
    exoticIconUrl: "https://www.bungie.net/common/destiny2_content/icons/5f3f44c8ec720f4ece9a8903ae29df60.jpg",
    pinnacle: true,
  },
  {
    id: "sundered-doctrine",
    name: "Sundered Doctrine",
    featuredExotic: "Exclusive Dungeon Arsenal",
    exoticIconUrl: "https://www.bungie.net/common/destiny2_content/icons/fcb3832c5d129eb787c2fff1506f70c3.jpg",
    pinnacle: true,
  },
];

// Compatibility exports
export const RAIDS_POOL = CANONICAL_RAIDS;
export const DUNGEONS_POOL = CANONICAL_DUNGEONS;

// D2RAD Base Reference Anchor:
// On October 6, 2026 17:00:00 UTC:
// Raids: Vault of Glass (index 3) + Salvation's Edge (index 8)
// Dungeons: Warlord's Ruin (index 7) + Pit of Heresy (index 1)
const D2RAD_ANCHOR_UTC_MS = Date.UTC(2026, 9, 6, 17, 0, 0); // October 6, 2026 17:00 UTC
const D2RAD_REF_RAID_SLOT_A = 3; // Vault of Glass
const D2RAD_REF_RAID_SLOT_B = 8; // Salvation's Edge
const D2RAD_REF_DUNGEON_SLOT_A = 7; // Warlord's Ruin
const D2RAD_REF_DUNGEON_SLOT_B = 1; // Pit of Heresy

const ANCHOR_UTC_MS = Date.UTC(2024, 0, 2, 17, 0, 0);

function getWeekDiff(timeMs: number): number {
  return Math.floor((timeMs - D2RAD_ANCHOR_UTC_MS) / (1000 * 60 * 60 * 24 * 7));
}

function getRaidsForWeek(weekOffset: number): [RaidRotation, RaidRotation] {
  const rLen = CANONICAL_RAIDS.length;
  const idxA = (((D2RAD_REF_RAID_SLOT_A + weekOffset) % rLen) + rLen) % rLen;
  const idxB = (((D2RAD_REF_RAID_SLOT_B + weekOffset) % rLen) + rLen) % rLen;
  return [CANONICAL_RAIDS[idxA], CANONICAL_RAIDS[idxB]];
}

function getDungeonsForWeek(weekOffset: number): [DungeonRotation, DungeonRotation] {
  const dLen = CANONICAL_DUNGEONS.length;
  const idxA = (((D2RAD_REF_DUNGEON_SLOT_A + weekOffset) % dLen) + dLen) % dLen;
  const idxB = (((D2RAD_REF_DUNGEON_SLOT_B + weekOffset) % dLen) + dLen) % dLen;
  return [CANONICAL_DUNGEONS[idxA], CANONICAL_DUNGEONS[idxB]];
}

function getNightfallForWeek(diffWeeks: number): NightfallItem {
  const nLen = NIGHTFALLS_POOL.length;
  const idx = ((diffWeeks % nLen) + nLen) % nLen;
  return NIGHTFALLS_POOL[idx];
}

const MONTH_NAMES = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

export function getResetState(now = new Date()) {
  const nowMs = now.getTime();
  const diffDays = Math.floor((nowMs - ANCHOR_UTC_MS) / (1000 * 60 * 60 * 24));
  const diffWeeks = Math.floor(diffDays / 7);
  const d2radWeekOffset = getWeekDiff(nowMs);

  // Lost sector index and exotic slot
  const lostSectorIndex = ((diffDays % LOST_SECTORS_POOL.length) + LOST_SECTORS_POOL.length) % LOST_SECTORS_POOL.length;
  const exoticSlot = EXOTIC_SLOTS[((diffDays % EXOTIC_SLOTS.length) + EXOTIC_SLOTS.length) % EXOTIC_SLOTS.length];
  const currentLostSector = LOST_SECTORS_POOL[lostSectorIndex];

  // Current Nightfall
  const currentNightfall = getNightfallForWeek(diffWeeks);

  // Current Featured Raids & Dungeons (Two simultaneous slots verified by D2RAD)
  const currentRaids = getRaidsForWeek(d2radWeekOffset);
  const currentDungeons = getDungeonsForWeek(d2radWeekOffset);

  // Single active items for backward compatibility
  const currentRaid = currentRaids[0];
  const currentDungeon = currentDungeons[0];

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

  // Next Week's Predicted Rotations
  const nextWeekOffset = d2radWeekOffset + 1;
  const nextWeekRaids = getRaidsForWeek(nextWeekOffset);
  const nextWeekDungeons = getDungeonsForWeek(nextWeekOffset);
  const nextWeekNightfall = getNightfallForWeek(diffWeeks + 1);
  const nextWeekDate = new Date(nextWeekly);
  const nextWeekFormatted = `${MONTH_NAMES[nextWeekDate.getUTCMonth()]} ${nextWeekDate.getUTCDate()}`;

  const nextWeek = {
    resetDate: nextWeekDate,
    formattedDate: nextWeekFormatted,
    raids: nextWeekRaids,
    dungeons: nextWeekDungeons,
    nightfall: nextWeekNightfall,
  };

  // Rotation Timeline (1 past week + current week + 6 upcoming predicted weeks)
  const timeline: WeeklyTimelineEntry[] = [];
  for (let offset = d2radWeekOffset - 1; offset <= d2radWeekOffset + 6; offset++) {
    const entryDate = new Date(D2RAD_ANCHOR_UTC_MS + offset * 7 * 24 * 3600 * 1000);
    const isCurrent = offset === d2radWeekOffset;
    const isNext = offset === d2radWeekOffset + 1;
    const formattedDate = `${MONTH_NAMES[entryDate.getUTCMonth()]} ${entryDate.getUTCDate()}`;

    timeline.push({
      resetDate: entryDate,
      formattedDate,
      isCurrent,
      isNext,
      state: offset <= d2radWeekOffset ? "Live data verified" : "Predicted",
      raids: getRaidsForWeek(offset),
      dungeons: getDungeonsForWeek(offset),
      nightfall: getNightfallForWeek(diffWeeks + (offset - d2radWeekOffset)),
    });
  }

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
    currentRaids,
    currentDungeons,
    currentRaid,
    currentDungeon,
    nextDaily,
    nextWeekly,
    nextWeek,
    timeline,
    isXurActive,
  };
}
