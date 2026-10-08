export interface Encounter {
  name: string;
  subtitle?: string;
  summary: string;
  image?: string;
  roles: { role: string; description: string }[];
  steps: string[];
  mechanics?: { title: string; text: string }[];
  dpsTips?: string;
  loot: { weapons: string[]; armor: string[] };
}

export interface RedBorderRoom {
  room: string;
  location: string;
  image?: string;
  notes: string;
}

export interface SecretChest {
  title: string;
  location: string;
  image?: string;
  guide: string;
}

export interface WishGuide {
  number: number;
  name: string;
  effect: string;
  category: "Checkpoint" | "Loot / Key" | "Fun / Audio" | "Challenge";
  description: string;
  shuroChiNote?: string;
}

export interface RaidGuide {
  id: string;
  name: string;
  tagline: string;
  location: string;
  bannerImage?: string;
  lootTableImage?: string;
  exotic: { name: string; type: string; image?: string };
  encounters: Encounter[];
  redBorderPuzzle?: {
    title: string;
    summary: string;
    referenceImage?: string;
    steps: string[];
    rooms?: RedBorderRoom[];
  };
  secretChests?: SecretChest[];
  wishes?: WishGuide[];
}

export const RAIDS_DATA: RaidGuide[] = [
  {
    id: "se",
    name: "Salvation's Edge",
    tagline: "Free the light. Enter the Monolith to confront the Witness.",
    location: "The Pale Heart (Monolith)",
    bannerImage: "https://www.paracausality.com/assets/img/guides/SE/se_banner.webp",
    lootTableImage: "https://www.paracausality.com/assets/img/guides/SE/Salvations-Edge-Loot-table-Infographic-v3-Destiny-2-1.webp",
    exotic: { name: "Euphony", type: "Linear Fusion Rifle (Special Strand)" },
    redBorderPuzzle: {
      title: "Deepsight Red Border Chest Puzzle",
      summary: "In the first enclosed chamber you see at the beginning of the raid, look at the 3rd column of symbols from the left. These forms correlate to the resonance buffs (Pyramid, Sphere, Cube) required in the 3 active hidden rooms (Room 1, Room 3, Room 5).",
      referenceImage: "https://www.paracausality.com/assets/img/guides/SE/Salvations-Edge-Red-Border-Chest-Screen-1-Destiny-2.webp",
      steps: [
        "In the starting entrance room, check the 3rd column from the left: Bottom symbol = Room 1, Middle symbol = Room 3, Top symbol = Room 5.",
        "Rooms 1, 3, and 5 will have glowing conductor plates that produce resonance.",
        "Input the matching resonance into each room's conductor.",
        "On successful activation, 'Energy flows deeper into the monolith...' will appear.",
        "Upon completing all 3, 'A boon will be granted.' confirms the extra red border chest at the Witness!"
      ],
      rooms: [
        {
          room: "Room 1 (Before 1st Encounter)",
          location: "At the start of the raid jumping section, follow the left path to a brightly lit entrance leading to the conductor room.",
          image: "https://www.paracausality.com/assets/img/guides/SE/Salvations-Edge-Red-Border-Chest-Screen-2-Destiny-2.webp",
          notes: "Corresponds to the bottom symbol of the 3rd column."
        },
        {
          room: "Room 3 (Between 1st & 2nd Encounters)",
          location: "After climbing the red elevator, hop over the big greenish-blue cubes and look for a wide, well-lit opening on the right side wall.",
          image: "https://www.paracausality.com/assets/img/guides/SE/Salvations-Edge-Red-Border-Chest-Screen-4-Destiny-2.webp",
          notes: "Corresponds to the middle symbol of the 3rd column."
        },
        {
          room: "Room 5 (Before 3rd Encounter)",
          location: "Inside the chamber with decaying tree limbs, jump to the left upward cubes to locate the conductor plates.",
          image: "https://www.paracausality.com/assets/img/guides/SE/Salvations-Edge-Red-Border-Chest-Screen-17Destiny-2.webp",
          notes: "Corresponds to the top symbol of the 3rd column."
        }
      ]
    },
    secretChests: [
      {
        title: "Secret Chest #1 (After Herald of Finality)",
        location: "South exit of 2nd encounter, top of red elevator",
        image: "https://www.paracausality.com/assets/img/guides/SE/c4757-17179959621442-1920.webp",
        guide: "After defeating the Herald of Finality, take the red elevator up. Climb into the dark room with two 'Omen of the Witness' Subjugators. Eliminate them, go to the back left wall of yellow stones, crouch down, and squeeze through the small ground opening."
      },
      {
        title: "Secret Chest #2 (Pre-Witness Traversal)",
        location: "Block jumping section right before the Witness boss room",
        image: "https://www.paracausality.com/assets/img/guides/SE/feeeb-17179963784073-1920.webp",
        guide: "In front of the massive entrance leading into the Witness arena, drop down to the right ledge or wall footholds. Look for a small square tunnel opening on the bottom-right wall."
      }
    ],
    encounters: [
      {
        name: "1. Substratum",
        subtitle: "Conductor Resonance Overload",
        summary: "Navigate 3 sector plates (Left, Center, Right) to collect Pyramidal and Spherical resonance buffs and deposit into the matching conductor totems before the timer expires.",
        image: "https://www.paracausality.com/assets/img/guides/SE/substratum.webp",
        roles: [
          { role: "Plate Defenders (3x)", description: "Stand on active plates to spawn resonance shapes and defend against Subjugators." },
          { role: "Resonance Runners (2x)", description: "Collect the required resonance shapes (Pyramid / Sphere) and slam into designated conductors." },
          { role: "Add Clear & Floater (1x)", description: "Kill Tormentors and yellow-bar adds to extend the encounter timer." }
        ],
        steps: [
          "Split into three teams of two for Left, Center, and Right rooms.",
          "Clear adds and kill the Minotaurs/Subjugators to reveal room plates.",
          "Step on plates to close rooms and trigger resonance conductors.",
          "Check which resonance type is required by the totem (Triangle / Circle) and collect exactly that buff.",
          "Deposit at the central conductor to unlock the doors and advance to the next floor (repeat 3 times)."
        ],
        mechanics: [
          { title: "Resonance Overload", text: "Holding the wrong resonance type or exceeding 3 stacks causes instant death upon depositing." },
          { title: "Floor Completion", text: "All 3 plates must be completed before the global timer reaches 0:00." }
        ],
        dpsTips: "Fast burst weapons (Dragons Breath, Microcosm, Machine Guns) to instantly melt Tormentors and Subjugators.",
        loot: {
          weapons: ["Nullify (Pulse)", "Imminence (SMG)", "Non-Denouement (Bow)"],
          armor: ["Helmet", "Gauntlets", "Leg Armor"]
        }
      },
      {
        name: "2. Herald of Finality",
        subtitle: "The Witness's Vanguard",
        summary: "Split into two wings (Light and Dark) to cleanse resonance shapes, take down the Trammel Subjugators, and shatter the Herald's shield for DPS in the middle arena.",
        image: "https://www.paracausality.com/assets/img/guides/SE/herald.webp",
        roles: [
          { role: "Left Wing (Light)", description: "Collect Spherical resonance, manage the Light plate circuit, and defeat the Tormentor." },
          { role: "Right Wing (Dark)", description: "Collect Pyramidal resonance, charge Dark totems, and defeat the Subjugator." },
          { role: "Mid Anchors", description: "Bait boss slams and clear rushing Screebs/Grim." }
        ],
        steps: [
          "Defeat the Taken Ogres and Subjugators on both wings.",
          "Match resonance conductors on both wings simultaneously.",
          "When both wings are closed, Herald of Finality drops to the center.",
          "Group up in Well of Radiance / Ward of Dawn on the center platform and burst boss.",
          "Jump away when boss prepares massive shockwave stomp."
        ],
        mechanics: [
          { title: "Resonance Cleansing", text: "Both wings must deposit their matching resonance stacks within 15 seconds of each other to break the boss immune shield." }
        ],
        dpsTips: "Precision Sniper Rifles (Still Hunt + Celestial Nighthawk, Whisper of the Worm) or Edge Transit / Apex Predator with Gjallarhorn.",
        loot: {
          weapons: ["Critical Anomaly (Sniper)", "Non-Denouement (Bow)", "Forthcoming Deviance (Glaive)"],
          armor: ["Chest Armor", "Class Item", "Helmet"]
        }
      },
      {
        name: "3. Repository",
        subtitle: "Resonance Transmutation",
        summary: "Progress through 3 sequential rooms transmuting Pyramidal, Spherical, and Cubical resonance into compound shapes (Prism, Cylinder, Cone) to deposit at the repository gateways.",
        image: "https://www.paracausality.com/assets/img/guides/SE/warren.webp",
        roles: [
          { role: "Left / Mid / Right Runners", description: "Collect base resonance and combine into compound shapes." },
          { role: "Plate Holders", description: "Hold plate lines to keep resonance generators active." }
        ],
        steps: [
          "Clear the Dread tormentors to spawn the initial base shapes.",
          "Combine shapes by picking up two distinct resonance buffs (e.g. Triangle + Circle = Cone).",
          "Deposit compound resonance into the 3 matching totems.",
          "Repeat across all 3 expanding arena chambers."
        ],
        mechanics: [
          { title: "Compound Shapes", text: "Circle + Circle = Sphere, Triangle + Triangle = Pyramid, Square + Square = Cube. Mix types to create 3D solids." }
        ],
        loot: {
          weapons: ["Imminence (SMG)", "Nullify (Pulse)", "Summum Bonum (Sword)"],
          armor: ["Gauntlets", "Leg Armor", "Chest Armor"]
        }
      },
      {
        name: "4. Verity",
        subtitle: "The Solo Room 3D Shadow Puzzle",
        summary: "3 players get pulled into separate solo shadow rooms; 3 players remain in the main hall. Inside players distribute symbols so each holds the 2 symbols NOT on their statue. Outside players dissect the 3D statues to match inside requirements.",
        image: "https://www.paracausality.com/assets/img/guides/SE/verity-shapes-v2.webp",
        roles: [
          { role: "Inside Solo Players (3x)", description: "Check your statue's symbol (Square/Circle/Triangle). Kill Knights to get symbols and send them to the players who need them." },
          { role: "Outside Dissectors (3x)", description: "View the 3 statues holding 3D solids. Dissect symbols between statues until each statue holds the 3D solid made of the OTHER two players' symbols." },
          { role: "Ghost Rescuers", description: "When Witness freezes the team, find and interact with the frozen statues of your teammates." }
        ],
        steps: [
          "Inside: Identify your starting symbol (e.g., Circle). Kill Knights to spawn symbols. Give away the symbol matching your wall to the corresponding teammate.",
          "Inside: Once you have the two OTHER symbols (e.g., Triangle + Square), pick them up to get the 'Escaping the Shadow' buff and step through the glass mirror.",
          "Outside: Dissect the 3D shapes on the 3 statues so each statue contains the two 2D shapes that the inside player needs to escape.",
          "When Witness summons 'The Witness tests your resolve', look at the 3 ghosts on the wall and interact with your dead teammates' matching statues to revive."
        ],
        mechanics: [
          { title: "Dissection Rules", text: "Removing a symbol from Statue A and placing it on Statue B swaps that 2D face between their 3D shapes." }
        ],
        loot: {
          weapons: ["Critical Anomaly (Sniper)", "Summum Bonum (Sword)", "Forthcoming Deviance (Glaive)"],
          armor: ["Helmet", "Gauntlets", "Class Item"]
        }
      },
      {
        name: "5. The Witness",
        subtitle: "Zenith of Finality",
        summary: "Destroy the glyph arms by reading wrist resonance, break the 6 chest glyph bands, jump up to the platform, and dodge the Witness's arena attacks while damaging the critical chest weakpoints.",
        image: "https://www.paracausality.com/assets/img/guides/SE/witnesstrap.webp",
        roles: [
          { role: "Arm Breakers (2x)", description: "Shoot the Witness's wrists, read the resonance shape buff, pick up matching floor buff, and shoot the arm weakpoint." },
          { role: "Glyph Shooters (All)", description: "Shoot the chest glyphs when an arm is severed." },
          { role: "Add & Subjugator Control", description: "Kill Subjugators immediately to prevent freezing/strand suspension." }
        ],
        steps: [
          "Shoot the glowing bracelets on the Witness's arms to trigger attacks.",
          "Avoid the hand beam/laser attack by standing in the safe quadrant or jumping over the floor wave.",
          "Pick up the glowing shape dropped by the arm and shoot the chest band.",
          "Repeat until all 6 glyph bands are broken.",
          "Jump onto the DPS ledge: continuously move and jump to dodge Witness eye beams, hand slams, and floor lasers while firing heavy weapons at the chest."
        ],
        mechanics: [
          { title: "Witness Attack Patterns", text: "Red floor glow = Jump up. High lasers = Crouch. Side sweep = Jump to opposite side of ledge." },
          { title: "Final Stand", text: "Witness floats to the back and unleashes continuous laser barrage; all 6 guardians must dump remaining heavy and supers." }
        ],
        dpsTips: "Microcosm, Still Hunt + Celestial Nighthawk, Whisper of the Worm, Linear Fusion Rifles, Edge Transit with Bait and Switch.",
        loot: {
          weapons: ["Euphony (Exotic LFR)", "All Raid Weapons"],
          armor: ["All Raid Armor Pieces"]
        }
      }
    ]
  },
  {
    id: "dp",
    name: "The Desert Perpetual",
    tagline: "Uncover the timeless machinery buried beneath the shifting sands of the Nine.",
    location: "Mercurian Vaults (Timeless Core)",
    bannerImage: "https://www.paracausality.com/assets/img/guides/DP/dp_banner.webp",
    lootTableImage: "https://www.paracausality.com/assets/img/guides/DP/The-Desert-Perpetual-Loot-Table-infographic-Destiny-2.webp",
    exotic: { name: "Timeless Heart", type: "Heavy Fusion Rifle (Vex Stasis/Solar Prototype)" },
    secretChests: [
      {
        title: "Secret Chest #1 (After Agraios Defeat)",
        location: "Return traversal path from Velocity's Tomb",
        image: "https://www.paracausality.com/assets/img/guides/DP/An4CGV4.webp",
        guide: "After defeating Agraios, follow the return path back to The Nursery. Locate the floating Nine sphere carved with 4 symbols. Approach the 4 matching Nine symbols scattered along the dunes to unlock the chest."
      },
      {
        title: "Secret Chest #2 (After Epoptes Defeat)",
        location: "Return traversal path from Fallow Pavilion",
        image: "https://www.paracausality.com/assets/img/guides/DP/nAj1nNo.webp",
        guide: "After clearing Epoptes, examine the carved symbols on the sphere ball at the exit. Activate the 4 matching Nine glyphs in the surrounding canyon."
      },
      {
        title: "Secret Chest #3 (After Iatros Defeat)",
        location: "Return traversal path from The Chambers",
        image: "https://www.paracausality.com/assets/img/guides/DP/HEorn20.webp",
        guide: "Following the Iatros fight, check the sphere ball at the chamber exit and trigger all 4 required Nine runes on the cliffs."
      }
    ],
    encounters: [
      {
        name: "1. The Nursery",
        subtitle: "Central Hub & Encounter Gate Selection",
        summary: "The opening and central hub of the raid. The central platform contains three half-spheres corresponding to the 3 boss encounters. Interact with a half-sphere to spawn a line of spheres leading to that boss portal.",
        image: "https://www.paracausality.com/assets/img/guides/DP/TP_2025_Apollo_Raid_Teaser_06_No_Guardians_Uncropped.webp",
        roles: [
          { role: "Portal Navigators", description: "Interact with designated boss half-sphere to reveal path to encounter." },
          { role: "Add Clear", description: "Defend central confluxes while team aligns boss gateways." }
        ],
        steps: [
          "Interact with one of the 3 half-spheres in the central room:",
          "• 'Interference patterns swell' -> Agraios, the Hobgoblin",
          "• 'All are entangled' -> Epoptes, the Hydra",
          "• 'Axion is axiom' -> Iatros, the Wyvern",
          "Follow the line of smaller spheres pointing to the portal gate with the matching Nine symbol in the distance."
        ],
        loot: {
          weapons: ["Perpetual Motion (Hand Cannon)", "Dune Walker (Scout)"],
          armor: ["Helmet", "Gauntlets"]
        }
      },
      {
        name: "2. Agraios, Inherent",
        subtitle: "Velocity's Tomb",
        summary: "Split into 3 Temporality Buff Runners and 3 Chronon Collectors. Read variable matrices, eliminate incorrect variables, rotate matching dials, and trigger ring activations to break Agraios's shield.",
        image: "https://www.paracausality.com/assets/img/guides/DP/Agraios.webp",
        roles: [
          { role: "Temporality Buff Runners (3x)", description: "Cycle the Temporality buff, read variable equations on the main spire, and call out variable eliminations." },
          { role: "Chronon Collectors (3x)", description: "Collect Chronon charges and deposit into matching outer dials." }
        ],
        steps: [
          "Defeat Barrier Hobgoblins and Minotaurs to spawn initial Temporality charges.",
          "Runners read the variable equation on the main spire and call out which outer dials must be aligned.",
          "Collectors rotate dials around the perimeter to balance temporal polarity.",
          "Step inside the chronometer rings in ascending numbered order.",
          "Agraios drops his shield: group up in Well of Radiance at the central safe zone and burst boss."
        ],
        dpsTips: "Outbreak Perfected, Thunderlord, Whisper of the Worm, Linear Fusion Rifles with Bait & Switch, Tractor Cannon.",
        loot: {
          weapons: ["Solar Flare (Rocket)", "Perpetual Motion (HC)"],
          armor: ["Chest Armor", "Leg Armor"]
        }
      },
      {
        name: "3. Epoptes, Lord of Quanta",
        subtitle: "Fallow Pavilion",
        summary: "Divide into 2 groups of 3 (Left and Right wings). Each side assigns an Inside Room Reader, an Outside Arena Reader, and an Ad Clear player to shoot triangle orbs and side-room eyes.",
        image: "https://www.paracausality.com/assets/img/guides/DP/Epoptes.webp",
        roles: [
          { role: "Inside Room Readers (2x)", description: "Enter side rooms, read eye combinations on the floating triangle orbs, and call out to outside." },
          { role: "Outside Readers / Shooters (2x)", description: "Shoot matching eye nodes on Epoptes's central structure." },
          { role: "Ad Clear / Support (2x)", description: "Manage Harpies, Cyclops, and drop healing rifts." }
        ],
        steps: [
          "Split team into 3 players Left and 3 players Right.",
          "Inside reader steps into the side chamber and reads the illuminated eye nodes on the floating triangle.",
          "Outside reader destroys the corresponding matching eyes on the main arena structure.",
          "Coordinate both sides simultaneously to collapse Epoptes's quantum shield.",
          "DPS phase begins in the central pavilion."
        ],
        dpsTips: "Thunderlord, Outbreak Perfected, Apex Predator, Celestial Nighthawk Golden Gun, Thundercrash.",
        loot: {
          weapons: ["Quantum Wave (Fusion)", "Dune Walker (Scout)"],
          armor: ["Gauntlets", "Chest Armor"]
        }
      },
      {
        name: "4. Iatros, Inward-Turned",
        subtitle: "The Chambers",
        summary: "Ascend vertical climbing platforms where a different player collects each of the 3 ascending buffs, manages Chronon banking, and stuns the Wyvern.",
        image: "https://www.paracausality.com/assets/img/guides/DP/Iatros.webp",
        roles: [
          { role: "Platform Climbers (3x)", description: "Assign 3 distinct players to collect the 3 platform buffs in sequence." },
          { role: "Minotaur & Bank Control (3x)", description: "Defend ground relays from Wyvern dive-bombs and bank Chronon cells." }
        ],
        steps: [
          "Player 1 climbs platforms, grabs Buff 1, and drops down to assist ground team.",
          "Player 2 ascends to collect Buff 2.",
          "Player 3 climbs to the apex to claim Buff 3 and trigger DPS Phase.",
          "DPS Iatros from the upper chamber ledge."
        ],
        loot: {
          weapons: ["Timeless Verdict (Pulse)", "Solar Flare (Rocket)"],
          armor: ["Leg Armor", "Helmet"]
        }
      },
      {
        name: "5. Koregos, The Worldline",
        subtitle: "The Nursery - Final Confrontation",
        summary: "Adopt a 2-2-2 team formation (2 Cyclical, 2 Contact, 2 Absolute). All 6 players dunk one of the 6 Chronons during the encounter, rotate roles between phases, stun boss laser attacks, and execute Final Stand.",
        image: "https://www.paracausality.com/assets/img/guides/DP/Koregos.webp",
        roles: [
          { role: "Cyclical Pair (2x)", description: "Manage cyclical time loops and dunk Chronon 1 & 2." },
          { role: "Contact Pair (2x)", description: "Hold contact tether nodes and dunk Chronon 3 & 4." },
          { role: "Absolute Pair (2x)", description: "Stun Koregos before rotating to interrupt wipe laser, dunk Chronon 5 & 6." }
        ],
        steps: [
          "Form 2-2-2 pair assignments for Cyclical, Contact, and Absolute roles.",
          "Each pair performs their required mechanics and banks their assigned Chronons.",
          "Constant/Absolute buffed players stun Koregos right before role rotation to cancel his wipe laser.",
          "After completing a phase, all pairs rotate clockwise to the next role.",
          "When all 6 Chronons are deposited, Koregos becomes vulnerable in the center of The Nursery.",
          "Dump heavy ammo, supers, and precision damage during DPS & Final Stand."
        ],
        dpsTips: "Whisper of the Worm, Microcosm, Still Hunt + Nighthawk, Edge Transit / Apex Predator with Bait & Switch.",
        loot: {
          weapons: ["Timeless Heart (Exotic Heavy Fusion)", "All Desert Perpetual Weapons"],
          armor: ["Class Item", "All Armor Pieces"]
        }
      }
    ]
  },
  {
    id: "ce",
    name: "Crota's End",
    tagline: "He waits in the dark below. Descend into the Hellmouth.",
    location: "Moon (Ocean of Storms)",
    bannerImage: "https://www.paracausality.com/assets/img/guides/CE/CE-Overlay.webp",
    lootTableImage: "https://www.paracausality.com/assets/img/guides/CE/CE-Loot-Table.webp",
    exotic: { name: "Necrochasm", type: "Auto Rifle (Kinetic Arc Cursed)" },
    redBorderPuzzle: {
      title: "Deepsight Red Border Chest Puzzle",
      summary: "Throughout Crota's End, there are 3 submerged Hive statues. Each statue requires a player holding a fully charged (Enlightened) Chalice of Light to interact and ignite the statue.",
      referenceImage: "https://www.paracausality.com/assets/img/guides/CE/CE-DS-01.webp",
      steps: [
        "Statue 1 (The Abyss): Located near Lantern 13 in a small side cave on the left.",
        "Statue 2 (The Bridge): Located across the bridge on the lower left wall corridor.",
        "Statue 3 (Post-Ir Yût): Located on the high crystal room balcony before Crota.",
        "When all 3 statues are ignited, an extra red border weapon chest spawns upon defeating Crota."
      ],
      rooms: [
        {
          room: "Statue 1 (The Abyss)",
          location: "Near Lantern 13 in a small side cave along the left cavern wall.",
          image: "https://www.paracausality.com/assets/img/guides/CE/CE-DS-02.webp",
          notes: "Deposit Enlightened Chalice into the submerged statue."
        },
        {
          room: "Statue 2 (The Bridge)",
          location: "Across the bridge on the lower left corridor under the arena.",
          image: "https://www.paracausality.com/assets/img/guides/CE/CE-DS-03.webp",
          notes: "Requires an Enlightened guardian on the far side."
        }
      ]
    },
    secretChests: [
      {
        title: "Secret Chest #1 (The Abyss Thrallway)",
        location: "First active door with glowing orange crystal",
        image: "https://www.paracausality.com/assets/img/guides/CE/CE-SC-01.webp",
        guide: "As you traverse the Abyss, check the stone doors along the left wall. The door with the glowing orange Hive crystal above it contains the first secret chest."
      },
      {
        title: "Secret Chest #2 (The Wall Climb)",
        location: "High wall hole before Ir Yût",
        image: "https://www.paracausality.com/assets/img/guides/CE/CE-SC-02.webp",
        guide: "During the vertical Hellmouth wall climb, look up to the right near the upper platforms for a small square opening in the wall."
      }
    ],
    encounters: [
      {
        name: "1. The Abyss",
        subtitle: "Lanterns of Light",
        summary: "Carry the Chalice of Light from lantern to lantern, preserving light while navigating through pitch black darkness and Weight of Darkness debuff.",
        image: "https://www.paracausality.com/assets/img/guides/CE/CE-01-00.webp",
        roles: [
          { role: "Chalice Bearers (Rotation)", description: "Take the Chalice when full, enlighten lanterns, and pass to teammate." },
          { role: "Crowd Control", description: "Blind Thrall, kill Unstoppable Ogres at plate." }
        ],
        steps: [
          "Take Chalice of Light from the podium.",
          "Follow the lantern path; when Chalice is full (Enlightened), interact with the lantern to cleanse Weight of Darkness.",
          "Pass Chalice to next player immediately before filling causes death.",
          "At the final bridge plate, build bridge while defending against Ogres."
        ],
        mechanics: [
          { title: "Chalice Overflow", text: "Holding a fully charged Chalice for more than 10 seconds results in instant death. Swap promptly." }
        ],
        loot: {
          weapons: ["Fang of Ir Yût (Scout)", "Song of Ir Yût (LMG)"],
          armor: ["Helmet", "Gauntlets"]
        }
      },
      {
        name: "2. The Bridge",
        subtitle: "Crossing the Chasm",
        summary: "Charge the bridge using Chalice buffs, send Swordbearers across one by one, and defeat the Gatekeepers on the far side.",
        image: "https://www.paracausality.com/assets/img/guides/CE/CE-02-00.webp",
        roles: [
          { role: "Near Side Plate Holders", description: "Stand on middle and 2 totems to keep bridge formed." },
          { role: "Sword Crossers", description: "Enlighten with Chalice, kill Swordbearer, grab sword, cross bridge, kill Gatekeeper." }
        ],
        steps: [
          "Charge Chalice to enlightened, kill Swordbearer, pick up Sword, and cross formed bridge.",
          "Slay Gatekeeper on far side with Sword heavy attacks.",
          "Once 3 players are across, far side takes over bridge plates.",
          "All 6 cross, deposit swords, and defeat final wave of Gatekeepers."
        ],
        mechanics: [
          { title: "Annihilator Totems", text: "Stepping off middle bridge plate while standing on totems will cause a team wipe within 10 seconds." }
        ],
        loot: {
          weapons: ["Oversoul Edict (Pulse)", "Swordbreaker (Shotgun)"],
          armor: ["Chest Armor", "Gauntlets"]
        }
      },
      {
        name: "3. Ir Yût, the Deathsinger",
        subtitle: "Song of Ruin",
        summary: "Identify real Wizard shrieker rooms using Enlightened sight, kill Wizards simultaneously, and burst Ir Yût before the Liturgy finishes.",
        image: "https://www.paracausality.com/assets/img/guides/CE/CE-ShriekerHallway.webp",
        roles: [
          { role: "Scouts / Enlightened Killers", description: "Get Enlightened from Chalice, look into barrier rooms to find Wizards, enter and kill." },
          { role: "Chalice Juggler", description: "Keep Chalice swapping active in bottom mid." }
        ],
        steps: [
          "Charge Chalice and enlighten players.",
          "Enlightened players look through barriers to locate the active Wizards (3 in normal, up to 5).",
          "Kill all target Wizards simultaneously to drop Ir Yût's shield.",
          "DPS Ir Yût from the crystal room ledge or center tower.",
          "Repeat if not one-phased."
        ],
        mechanics: [
          { title: "Liturgy of Ruin", text: "45-second timer starts as soon as the first Wizard dies. All Wizards must be eliminated quickly to maximize DPS time." }
        ],
        dpsTips: "Thunderlord with Catalyst, Leviathan's Breath, Gjallarhorn + Apex Predator Rockets.",
        loot: {
          weapons: ["Word of Crota (Hand Cannon)", "Song of Ir Yût (LMG)"],
          armor: ["Helmet", "Leg Armor"]
        }
      },
      {
        name: "4. Crota, Son of Oryx",
        subtitle: "The Final Sunder",
        summary: "Charge Chalice to obtain Swords and Oversoul shooter buffs, break Crota's shield with 2 swords, and stagger the Oversoul during DPS.",
        image: "https://www.paracausality.com/assets/img/guides/CE/CE-05-00.webp",
        roles: [
          { role: "Sword Duelists (2x)", description: "Enlighten, grab sword from Swordbearer, perform Heavy-Heavy-Super combo on Crota." },
          { role: "Oversoul Sniper (1x)", description: "Enlighten and shoot the giant green Oversoul in the sky when timer reaches ~3 seconds." },
          { role: "Add & Boomer Clear", description: "Kill tower Knights and Ogres." }
        ],
        steps: [
          "Charge Chalice while clearing middle adds and Boomer Knights.",
          "Kill Swordbearer; 2 Enlightened players grab swords.",
          "Sword players slam Crota to strip his immune white shield.",
          "Drop Well of Radiance at Crota's feet and DPS with Swords / Shotguns / Fusion Rifles.",
          "Designated Oversoul shooter destroys Oversoul to extend damage phase."
        ],
        mechanics: [
          { title: "Oversoul Stagger", text: "Destroying the Oversoul prevents wipe and grants bonus damage window." }
        ],
        dpsTips: "Lament, Ergo Sum (Wolfpack), Falling Guillotine / Bequest swords, Tractor Cannon debuff + Well of Radiance.",
        loot: {
          weapons: ["Necrochasm (Exotic Auto)", "Word of Crota", "Abyss Defiant"],
          armor: ["Class Item", "All Armor Pieces"]
        }
      }
    ]
  },
  {
    id: "ron",
    name: "Root of Nightmares",
    tagline: "A sinister threat has taken root within the Witness's Pyramid.",
    location: "Neomuna Orbit (Pyramid Ship)",
    bannerImage: "https://www.paracausality.com/assets/img/guides/RON/ron_banner.webp",
    lootTableImage: "https://www.paracausality.com/assets/img/guides/RON/root-of-nightmares-loot-table-blueberries.webp",
    exotic: { name: "Conditional Finality", type: "Shotgun (Stasis / Solar Dual Barrel)" },
    redBorderPuzzle: {
      title: "Deepsight Red Border Chest Puzzle",
      summary: "At the start of the raid before heading down the stairs, look behind the 2 structures on the left to find a flower containing 3 nodes (Light or Darkness). Memorize their order from left to right (e.g. Dark - Light - Dark).",
      referenceImage: "https://www.paracausality.com/assets/img/guides/RON/destiny-2-nezarec-extra-chest-flower.webp",
      steps: [
        "Check the starting 3-node flower to get the 3-element pattern (Light/Dark).",
        "Connect the matching element in Node Room 1 (Before 1st encounter).",
        "Connect the matching element in Node Room 2 (During the chasm jumping puzzle).",
        "Connect the matching element in Node Room 3 (Right before Nezarec).",
        "Upon connecting all 3 successfully, 'A large harvest awaits' appears and the red border chest spawns at Nezarec."
      ],
      rooms: [
        {
          room: "Node Room 1 (Pre-1st Encounter)",
          location: "Before the first encounter, avoid the bright doorway; turn right into a door hidden behind bushes and descend into the cave.",
          image: "https://www.paracausality.com/assets/img/guides/RON/destiny-2-nezarec-extra-chest-node-room-1.webp",
          notes: "Connect the node matching symbol 1 of your starting flower."
        },
        {
          room: "Node Room 2 (Chasm Jumping Puzzle)",
          location: "During the jumping puzzle, do NOT take the catapult piston. Jump left across the chasm to a lower rooftop and enter the doorway on the left.",
          image: "https://www.paracausality.com/assets/img/guides/RON/destiny-2-nezarec-extra-chest-node-room-2.webp",
          notes: "Connect the node matching symbol 2 of your starting flower."
        },
        {
          room: "Node Room 3 (Pre-Nezarec)",
          location: "Before Nezarec, climb through the flower buds to the cube structure with golden blocks, jump to the statue, and look into the ceiling cavity.",
          image: "https://www.paracausality.com/assets/img/guides/RON/destiny-2-nezarec-extra-chest-node-room-3.webp",
          notes: "Connect the node matching symbol 3 of your starting flower."
        }
      ]
    },
    secretChests: [
      {
        title: "Secret Chest #1 (Cataclysm Traversal)",
        location: "Lower cliff cave after Encounter 1",
        image: "https://www.paracausality.com/assets/img/guides/RON/20230310185132_1.webp",
        guide: "After clearing Cataclysm, proceed along the cliffside. Drop down to the lower cliff ledge on the left before reaching the piston elevator to find the chest inside a glowing cave."
      },
      {
        title: "Secret Chest #2 (Chasm Traversal)",
        location: "Floating temple ruins before Explicator",
        image: "https://www.paracausality.com/assets/img/guides/RON/RoN.Jump2Nodes.webp",
        guide: "During the second jumping puzzle across the broken pyramid exterior, look for an isolated temple structure on the right side of the canyon."
      }
    ],
    encounters: [
      {
        name: "1. Cataclysm",
        subtitle: "Field of Light",
        summary: "Connect light seed nodes in sequence while killing Tormentors and Psions to delay Sweeping Terror.",
        image: "https://www.paracausality.com/assets/img/guides/RON/destiny-2-root-of-nightmares-cataclysm-node-beam.webp",
        roles: [
          { role: "Light Runner", description: "Step in aura, shoot light node, race to next dormant node, repeat." },
          { role: "Tormentor Hunters", description: "Kill Psions in bubbles, kill spawned Tormentors to gain +30s buff." }
        ],
        steps: [
          "Runner shoots golden orb to gain Field of Light buff.",
          "Follow helix trail to the glowing dormant node and shoot it.",
          "Repeat across all 4 plates before Sweeping Terror expires."
        ],
        loot: {
          weapons: ["Rufus's Fury (Auto)", "Koraxis's Distress (GL)", "Nessa's Oblation (Shotgun)"],
          armor: ["Helmet", "Gauntlets"]
        }
      },
      {
        name: "2. Scission",
        subtitle: "Light & Dark Ascent",
        summary: "Simultaneously connect Light nodes on one side and Dark nodes on the other, using man-cannons to cross the chasm.",
        image: "https://www.paracausality.com/assets/img/guides/RON/destiny-2-root-of-nightmares-scission-crossing-gap-node.webp",
        roles: [
          { role: "Light Runner", description: "Connect white seed nodes." },
          { role: "Dark Runner", description: "Connect orange seed nodes." },
          { role: "Chasm Cleansers", description: "Cross chasm to kill color-shielded barrier combatants." }
        ],
        steps: [
          "Start Light and Dark node chains concurrently.",
          "Cross to opposite side using catapult launchers to refresh aura buffs.",
          "Complete all 3 vertical tiers before wipe timer."
        ],
        loot: {
          weapons: ["Acasia's Dejection (Trace)", "Mykel's Reverence (Sidearm)"],
          armor: ["Chest Armor", "Gauntlets", "Legs"]
        }
      },
      {
        name: "3. Macrocosm (Zo'aurc)",
        subtitle: "Explicator of Planets",
        summary: "Move Light and Dark planets between triangle plates to match planetary alignment, then burn the Explicator on matching color plates.",
        image: "https://www.paracausality.com/assets/img/guides/RON/destiny-2-root-of-nightmares-explicator-damage-phase-planets.webp",
        roles: [
          { role: "Planet Runners (4x)", description: "Kill Centurions, read odd planet on plate, swap with partner plate." },
          { role: "Middle Add Clear (2x)", description: "Clear Colossus and boss aggro." }
        ],
        steps: [
          "Kill Centurions to get Planetary Insight buff.",
          "Look up: call out the single Dark planet on Left plates / single Light planet on Right plates.",
          "Grab odd planet and swap with opposite side partner.",
          "Check middle 3 plates (Light/Dark), grab matching planets, slam in middle.",
          "DPS boss from plate matching boss shield color (swap plates every ~8s)."
        ],
        dpsTips: "Rocket Launchers (Apex Predator, Crux Termination) with Gjallarhorn + Well of Radiance.",
        loot: {
          weapons: ["Briar's Contempt (LFR)", "Rufus's Fury (Auto)"],
          armor: ["Chest Armor", "Leg Armor"]
        }
      },
      {
        name: "4. Nezarec, Final God of Pain",
        subtitle: "The Subjugated Nightmare",
        summary: "Build Light and Dark seed chains, create refuge buffs to survive Nezarec's wipe pulse, and burst him down in the center platform.",
        image: "https://www.paracausality.com/assets/img/guides/RON/destiny-2-root-of-nightmares-nezarec-damage.webp",
        roles: [
          { role: "Light Runner", description: "Complete Light nodes on left." },
          { role: "Dark Runner", description: "Complete Dark nodes on right." },
          { role: "Nezarec Gaze Holder", description: "Shoot Nezarec chest and shoulders to hold aggro and read wipe color." },
          { role: "Add Clear", description: "Kill Colossi and barrier Champions." }
        ],
        steps: [
          "Gaze holder shoots chest/shoulders; glowing wings indicate Light (cyan) or Dark (orange) wipe pulse.",
          "Runner takes opposite buff and shoots an active node to create a Refuge bubble.",
          "All players stand in Refuge bubble when Nezarec unleashes wipe burst.",
          "Finish both Light and Dark node chains to trigger damage phase.",
          "DPS from flower plate or middle stage."
        ],
        dpsTips: "Apex Predator / Edge Transit with Bait & Switch, Whisper of the Worm, Grand Overture, Well of Radiance.",
        loot: {
          weapons: ["Conditional Finality (Exotic)", "All Raid Weapons"],
          armor: ["Class Item", "All Armor Pieces"]
        }
      }
    ]
  },
  {
    id: "kf",
    name: "King's Fall",
    tagline: "Long live the King. Slay the Taken King in the Ascendant Plane.",
    location: "Dreadnaught (Saturn Rings)",
    bannerImage: "https://www.paracausality.com/assets/img/guides/KF/kf_banner.webp",
    lootTableImage: "https://www.paracausality.com/assets/img/guides/KF/Destiny-2-Kings-Fall-Loot-table-infographic-v2.webp",
    exotic: { name: "Touch of Malice", type: "Scout Rifle (Kinetic Exotic Burst)" },
    redBorderPuzzle: {
      title: "Deepsight Red Border Chest Puzzle",
      summary: "Beneath the Court of Oryx entrance archway, three Hive runes will glow. Memorize their shapes (or order). You must shoot the 3 matching runes throughout the raid in a single run to unlock the extra Deepsight weapon chest upon defeating Oryx.",
      referenceImage: "https://www.paracausality.com/assets/img/guides/KF/kings-fall-red-border-chest.webp",
      steps: [
        "1. Court of Oryx Entrance: Look directly underneath the central entrance archway before starting to view your fireteam's 3 required runes.",
        "2. Locate each of the 3 corresponding runes hidden throughout the encounters/traversals.",
        "3. Shoot the rune once with any weapon until it glows and chimes.",
        "4. Shoot all 3 correct runes throughout the raid.",
        "5. Upon defeating Oryx, 'Oryx yields his spoils' appears and an extra Red Border chest spawns next to the normal chest."
      ],
      rooms: [
        {
          room: "Rune 1: Pendulum Chasm (Tombship Pre-Run)",
          location: "At the very start of the pendulum jumping area, look directly beneath the 1st swinging pendulum platform.",
          notes: "Look down and shoot the rune on the underside of the stone ledge."
        },
        {
          room: "Rune 2: Portico Tombship Dock",
          location: "In the large tombship jumping room, climb to the high left wall balcony before boarding the final ship.",
          notes: "Located inside a hidden side doorway high up on the left wall."
        },
        {
          room: "Rune 3: Basilica Entrance Doorway (Totems)",
          location: "In the Basilica (Totems room), look above the upper left doorway leading into the left totem room.",
          notes: "Positioned directly on the door archway."
        },
        {
          room: "Rune 4: Warpriest Balcony",
          location: "Inside the Warpriest arena, look high up on the upper right balcony above the right plate.",
          notes: "Visible from the right side platform looking up."
        },
        {
          room: "Rune 5: Golgoroth's Cellar Maze",
          location: "Inside the dark cellar maze, located on the wall inside the hidden plate door.",
          notes: "Shoot the rune inside the dark corridor alcove."
        },
        {
          room: "Rune 6: Golgoroth Exit Pit",
          location: "After defeating Golgoroth, drop down under the exit ledge before the transition corridor.",
          notes: "Tucked directly under the floor overhang."
        },
        {
          room: "Rune 7: Transept Piston Wall (Secret Chest)",
          location: "Inside the secret chest room accessed above the 3rd wall piston trap.",
          notes: "Shoot the rune located on the high wall inside the secret chest chamber."
        },
        {
          room: "Rune 8: Daughters / Sisters Ledge",
          location: "High above the entrance doorway when entering the Daughters of Oryx arena.",
          notes: "Turn around 180 degrees upon entering and look up at the ceiling arch."
        },
        {
          room: "Rune 9: Oryx Final Chamber (Back Arch)",
          location: "On the far back outer archway facing Saturn at the rear of the Oryx arena.",
          notes: "Walk to the far edge of the arena and look at the lower outside beam."
        }
      ]
    },
    secretChests: [
      {
        title: "Secret Chest #1 (Portico Tombships)",
        location: "Left wall of the large Tombship jumping arena",
        image: "https://www.paracausality.com/assets/img/guides/KF/portico.webp",
        guide: "Ride the first set of Hive Tombships across the chasm. Before boarding the final ship to the docking platform, jump left to the small docking ledge."
      },
      {
        title: "Secret Chest #2 (Golgoroth's Cellar)",
        location: "Plate puzzle inside the dark maze",
        image: "https://www.paracausality.com/assets/img/guides/KF/Kings-Fall-Gologoroths-Cellar-v3.webp",
        guide: "5 players step on the 5 numbered floor plates in order (A-B-C-D-E) to open the secret door in the center of the maze."
      },
      {
        title: "Secret Chest #3 (The Transept Piston Wall)",
        location: "Hidden doorway above the 3rd piston",
        image: "https://www.paracausality.com/assets/img/guides/KF/4029042-kingsfalltransepthiddenchest.webp",
        guide: "Stand on the small ledge near the floating pillars, pull out your Ghost to reveal invisible platforms, and jump up into the secret door."
      }
    ],
    encounters: [
      {
        name: "1. Basilica (Totems)",
        subtitle: "Brand of the Weaver & Annihilator Totems",
        summary: "Cycle Brand of the Weaver between Left and Right totems, bank Deathsinger's Power stacks in the central plate, and defend against Unstoppable Champions.",
        image: "https://www.paracausality.com/assets/img/guides/KF/Kings-Fall-Totem-E1-v6.webp",
        roles: [
          { role: "Left Totem Rotation (3x)", description: "Rotate between holding Left Totem aura, killing adds, and banking Deathsinger's Power on mid plate." },
          { role: "Right Totem Rotation (3x)", description: "Rotate between holding Right Totem aura, killing adds, and banking Deathsinger's Power on mid plate." }
        ],
        steps: [
          "Grab Brand of the Weaver on Left/Right and run to the totem.",
          "Kill Hive adds to accumulate Deathsinger's Power stacks (up to x10).",
          "Next player takes the Brand by standing in your aura; run to central plate to bank your power stacks.",
          "Bank 200 total stacks to open the Basilica gateway."
        ],
        mechanics: [
          { title: "Totem Annihilation", text: "If either totem is left unoccupied for more than 10 seconds, Annihilator Totem will wipe the entire fireteam." }
        ],
        loot: {
          weapons: ["Smite of Merain (Pulse)", "Doom of Chelchis (Scout)"],
          armor: ["Helmet", "Gauntlets"]
        }
      },
      {
        name: "2. Warpriest",
        subtitle: "Glyph Sequence Trial",
        summary: "Read monolith plates from behind to find sequence, claim Brand of the Initiate, juggle brand using Blightguard Knights, and DPS in aura.",
        image: "https://www.paracausality.com/assets/img/guides/KF/Kings-Fall-Warpriest-E2-v3.webp",
        roles: [
          { role: "Plate Steppers (3x)", description: "Step on Left/Center/Right plates in sequence read on back of monoliths." },
          { role: "Brand Claimer", description: "Last player on plate gets 20s aura for the team." },
          { role: "Knight Stealers (2x)", description: "Kill Blightguard Knights and claim Brand Stealer buff to refresh timer." }
        ],
        steps: [
          "Clear Wizards and Knights to trigger plate sequence.",
          "Look at back of pillars: glowing rune tells which plate steps first, second, third.",
          "Last player receives Brand of the Initiate. Group on brand holder to damage Warpriest.",
          "Knight stealers kill their Knight, take Brand Stealer, and steal brand with 2-3s left on timer.",
          "Hide in pillar shadow when Warpriest calls upon the Oculus wipe."
        ],
        loot: {
          weapons: ["Smite of Merain (Pulse)", "Defiance of Yasmin (Sniper)"],
          armor: ["Gauntlets", "Chest Armor"]
        }
      },
      {
        name: "3. Golgoroth",
        subtitle: "Gaze of the Pit",
        summary: "Drop ceiling light orbs to create DPS pools on the floor while two runners trade Golgoroth's Gaze.",
        image: "https://www.paracausality.com/assets/img/guides/KF/Kings-Fall-Golgoroth-E3-v6.webp",
        roles: [
          { role: "Gaze Holders (2x)", description: "Shoot glowing back crit to hold Gaze for 20s while dodging Axion Darts; trade back and forth." },
          { role: "Pool DPS Team (4x)", description: "Shoot down light bubbles, stand in pool of light, fire at Golgoroth's stomach crit." }
        ],
        steps: [
          "Clear Thrall and shoot down initial ceiling orb to start.",
          "Gaze 1 shoots Golgoroth's back crit; face boss toward damage pool.",
          "Damage team stands in light puddle under boss and fires at critical stomach.",
          "With 3s left, Gaze 2 shoots back crit to take gaze and drop next pool.",
          "Player with Unstable Light debuff steps away from team to explode safely."
        ],
        dpsTips: "Linear Fusion Rifles, Whisper of the Worm, Leviathan's Breath, Well of Radiance.",
        loot: {
          weapons: ["Doom of Chelchis (Scout)", "Midha's Reckoning (Fusion)", "Qullim's Terminus (LMG)"],
          armor: ["Helmet", "Leg Armor"]
        }
      },
      {
        name: "4. Daughters of Oryx",
        subtitle: "Ir Anûk & Ir Halak",
        summary: "Jump on platform sequence in the Ascendant Plane to collect the Blight piece, steal the Brand of Weaving, and burn down the Daughters.",
        image: "https://www.paracausality.com/assets/img/guides/KF/sisters_info.webp",
        roles: [
          { role: "Torn Runner", description: "Navigate floating Ascendant platforms to grab orb." },
          { role: "Plate Holders (4x)", description: "Step on plate with green flame first, then second plate indicated by runner." }
        ],
        steps: [
          "Player torn between dimensions climbs platform path.",
          "Plate holders stand on active platforms to solidify path.",
          "Runner slams piece above target Deathsong daughter.",
          "Group up on center platform, drop Well, and melt target Daughter with precision fire."
        ],
        dpsTips: "Wardcliff Coil, Rocket Launchers with Gjallarhorn, Touch of Malice + Well.",
        loot: {
          weapons: ["Zaouli's Bane (Hand Cannon)", "Smite of Merain"],
          armor: ["Chest Armor", "Gauntlets"]
        }
      },
      {
        name: "5. Oryx, the Taken King",
        subtitle: "The Final Shape of the Deep",
        summary: "Slam platform runner pieces, slay Light-Eater Ogres, prevent Knights from eating blights, detonate 4 corrupted blights simultaneously, and stagger Oryx.",
        image: "https://www.paracausality.com/assets/img/guides/KF/oryx_info.webp",
        roles: [
          { role: "Platform Runner", description: "Climb floating platforms to claim Brand Claimer." },
          { role: "Plate Holders (4x)", description: "Stand on designated plate and kill assigned Light-Eater Ogre + Knight." },
          { role: "Middle Floaters / DPS (2x)", description: "Kill Vessel of Oryx, clear shades, and assist ogres." }
        ],
        steps: [
          "Oryx slams a plate; torn player climbs platforms while plate holders hold plates.",
          "Kill all 4 Light-Eater Ogres at their spawn points, then kill Light-Eater Knights.",
          "Runner steals aura from Vessel of Oryx.",
          "Group in Vessel aura; shoot Oryx chest crit to stagger.",
          "All 4 plate holders run into their respective blight spheres (count to 3), step back to center aura, and detonate.",
          "DPS Oryx open glowing chest."
        ],
        dpsTips: "Whisper of the Worm, Still Hunt, Touch of Malice, Cataclysmic LFR.",
        loot: {
          weapons: ["Touch of Malice (Exotic)", "Zaouli's Bane", "All KF Weapons"],
          armor: ["Class Item", "All Armor Pieces"]
        }
      }
    ]
  },
  {
    id: "vow",
    name: "Vow of the Disciple",
    tagline: "The Disciple beckons. Venture into the sunken Pyramid of Savathûn's Throne World.",
    location: "Savathûn's Throne World (Sunken Pyramid)",
    bannerImage: "https://www.paracausality.com/assets/img/guides/VOW/vow_banner.webp",
    lootTableImage: "https://www.paracausality.com/assets/img/guides/VOW/szSZqku.webp",
    exotic: { name: "Collective Obligation", type: "Pulse Rifle (Void Leech)" },
    redBorderPuzzle: {
      title: "Deepsight Red Border Chest Puzzle",
      summary: "Right after dropping down into the pyramid, inspect the large totem pillar to see 3 displayed Glyphs. Enter the 3 corresponding hidden rooms throughout the raid and melee the symbol inside.",
      referenceImage: "https://www.paracausality.com/assets/img/guides/VOW/symbols.webp",
      steps: [
        "Memorize the 3 vertical symbols on the entrance obelisk pillar.",
        "Room 1 (Pyramid): Right before 1st encounter in the side drop.",
        "Room 2 (Give): Left room during 1st encounter transition.",
        "Room 3 (Darkness): Left side of Caretaker arena floor 1.",
        "Room 4 (Traveler): Top right of Caretaker arena floor 3.",
        "Room 5 (Worship): During Cathedral jumping puzzle.",
        "Room 6 (Stop): High window ledge before 3rd encounter.",
        "Room 7 (Guardian): Exhibition exit door on the left.",
        "Room 8 (Kill): Traversal path after Exhibition.",
        "Room 9 (Knowledge): Left alcove before Rhulk's arena.",
        "When all 3 are activated, the extra red border chest spawns after Rhulk."
      ]
    },
    secretChests: [
      {
        title: "Secret Chest #1 (Disciple's Bog 3 Cruxes)",
        location: "Marsh payload escort path behind locked stone door",
        image: "https://www.paracausality.com/assets/img/guides/VOW/destiny-2-vow-of-the-disciple-payload-hidden-chest-location.webp",
        guide: "During the initial payload escort across the bog, locate and destroy all 3 black floating darkness cruxes scattered in the marsh. Once destroyed, a heavy stone doorway opens containing the chest."
      },
      {
        title: "Secret Chest #2 (Cathedral Jumping Puzzle)",
        location: "Upper spire platforms after Caretaker",
        image: "https://www.paracausality.com/assets/img/guides/VOW/szSZqku.webp",
        guide: "In the giant cathedral chasm, shoot the darkness crux above the floating platform to extend horizontal bridges leading to the chest."
      }
    ],
    encounters: [
      {
        name: "1. Acquisition",
        subtitle: "Glyphkeeper Totem Defense",
        summary: "Read 3-glyph sequences across 3 obelisks (Totem Location, Glyphkeeper Alignment, Kill Symbol) and shoot matching glyphs before obelisk fills.",
        image: "https://www.paracausality.com/assets/img/guides/VOW/symbols.webp",
        roles: [
          { role: "Obelisk Defenders (3x)", description: "Defend obelisk from Abominations and shoot matching glyphs." },
          { role: "Room Runners (3x)", description: "Enter designated symbol room, slay Glyphkeeper, and call out revealed symbol." }
        ],
        steps: [
          "Check active obelisk to see target room icon (e.g. Gift, Darkness, Traveler).",
          "Runner enters room and kills Light & Dark Scorn Glyphkeepers.",
          "Defenders shoot the 3 matching symbols on the obelisk face simultaneously.",
          "Repeat across 3 complete rounds."
        ],
        loot: {
          weapons: ["Cataclysmic (LFR)", "Deliverance (Fusion)", "Submission (SMG)"],
          armor: ["Helmet", "Gauntlets"]
        }
      },
      {
        name: "2. The Caretaker",
        subtitle: "Ascent of the Sunken Spire",
        summary: "Collect glyphs inside dark room while stunners shoot Caretaker's back/face to keep him from reaching the obelisk, then DPS on glowing floor plates.",
        roles: [
          { role: "Obelisk Runners (2x)", description: "Enter dark room, memorize 3 symbols, shoot matching symbols on obelisk." },
          { role: "Boss Stunners (2x)", description: "Bait Caretaker slam, shoot yellow face crit + open back backpack to stun." },
          { role: "Add Clear (2x)", description: "Kill Taken Psions and shoot Caretaker homing swarm missiles." }
        ],
        steps: [
          "Runners grab 3 symbols inside room and input on obelisk (repeat twice).",
          "Stun team keeps Caretaker frozen in place.",
          "Once obelisk is filled, jump onto glowing floor plate and damage boss.",
          "Move from Plate 1 -> Plate 2 -> Plate 3 as they extinguish.",
          "Climb stairs to repeat for 3 total floors + Final Stand."
        ],
        dpsTips: "Grand Overture, Outbreak Perfected, Rockets with Gjallarhorn, Apex Predator.",
        loot: {
          weapons: ["Forbearance (Wave Frame GL)", "Cataclysmic", "Insidious (Pulse)"],
          armor: ["Gauntlets", "Chest Armor", "Legs"]
        }
      },
      {
        name: "3. Exhibition",
        subtitle: "Artifact Relic Gauntlet",
        summary: "Carry 3 relics (Laser Crystal, Taken Eye, Darkness Shield) through 4 time-limited rooms while cleansing resonance and shooting Glyphkeeper symbols.",
        roles: [
          { role: "Nut/Laser Relic", description: "Shoot glowing glyph knights to extend timer." },
          { role: "Taken Eye Relic", description: "Use grenade cleanse button to remove glowing blights." },
          { role: "Shield/Aegis Relic", description: "Cleanse teammates of Pervading Darkness stacks." }
        ],
        steps: [
          "Pick up relics and rush into room.",
          "Read Light & Dark glyphkeeper symbols and shoot the single shared symbol on exit doors.",
          "Cleanse stacks continuously with Aegis shield dome.",
          "Deposit relics on pedestals to unlock next area."
        ],
        loot: {
          weapons: ["Submission (SMG)", "Lubrae's Ruin (Glaive)", "Deliverance"],
          armor: ["Chest Armor", "Helmet"]
        }
      },
      {
        name: "4. Rhulk, First Disciple of the Witness",
        subtitle: "The Lustrous Disciple",
        summary: "Leach and transmute Emanating Force into 4 totems to remove Rhulk's arena forcefield, then dodge kicks/lasers in arena while bursting him down.",
        roles: [
          { role: "Buff Splitters (2x)", description: "Stand in Rhulk crystal laser to split and cycle Leeching Force." },
          { role: "Emanating Dunkers (2x)", description: "Step into Rhulk's laser beam with Leeching Force to convert to Emanating, dunk at designated totem." },
          { role: "Add & Crystal Shooters (2x)", description: "Shoot floating glaive crystals and clear Abominations." }
        ],
        steps: [
          "Shoot Rhulk's floating crux crystal to gain Leeching Force.",
          "Step into Rhulk's beam to upgrade to Emanating Force and slam into the matching column.",
          "Repeat 4 times to break barrier and climb to upper arena.",
          "Upper arena: shoot Rhulk's 4 weakpoints (shoulders & hips) when he dashes.",
          "DPS phase begins: Rhulk will actively sprint, kick, and fire quadruple laser beams. Kite and burn."
        ],
        dpsTips: "Grand Overture, Microcosm, Apex Predator / Edge Transit, Izanagi's Burden + Rocket swap.",
        loot: {
          weapons: ["Collective Obligation (Exotic)", "Lubrae's Ruin (Glaive)", "All Vow Weapons"],
          armor: ["Class Item", "All Armor Pieces"]
        }
      }
    ]
  },
  {
    id: "dsc",
    name: "Deep Stone Crypt",
    tagline: "The chains of legacy must be broken. Reclaim the birthplace of the Exos.",
    location: "Europa (Braytech Facility)",
    bannerImage: "https://www.paracausality.com/assets/img/guides/DSC/dsc_banner.webp",
    lootTableImage: "https://www.paracausality.com/assets/img/guides/DSC/dsc_droptable.webp",
    exotic: { name: "Eyes of Tomorrow", type: "Rocket Launcher (Solar Tracking Volley)" },
    secretChests: [
      {
        title: "Secret Chest #1 (Pike Sparrow Blizzard Run)",
        location: "Cave bubble #4 during the frozen storm",
        image: "https://www.paracausality.com/assets/img/guides/DSC/d2_beyondlight_deepstonecrypt_raid_05.webp",
        guide: "Ride Pikes through the freezing blizzard. At the 4th heat bubble near the fallen walker, look to the right cliff ledge to find the cave holding the chest."
      },
      {
        title: "Secret Chest #2 (Orbital Space Walk)",
        location: "Catwalk beam under the Morningstar station",
        image: "https://www.paracausality.com/assets/img/guides/DSC/d2_beyondlight_deepstonecrypt_raid_12.webp",
        guide: "During the orbital space station jumping puzzle, jump along the far left outer girder beam before reaching the airlock."
      }
    ],
    encounters: [
      {
        name: "1. Crypt Security",
        subtitle: "Fuse Matrix Reset",
        summary: "Scanner reads glowing keypads in basement; Operator shoots panels to open basement doors and reveal glowing central fuses for DPS.",
        image: "https://www.paracausality.com/assets/img/guides/DSC/Encounter 1_ Security - Top side map.webp",
        roles: [
          { role: "Operator (Top/Down)", description: "Shoot red glowing terminal panels in basement to unlock fuse tubes." },
          { role: "Scanner (Basement)", description: "Look through glass floor, call out 4 glowing yellow panels to Operator." },
          { role: "Top DPS Team", description: "Burst down glowing central fuse tubes called out by Scanner." }
        ],
        steps: [
          "Operator grabs red buff and enters basement.",
          "Scanner grabs yellow buff, looks through floor, and calls out 2 Dark and 2 Light panels.",
          "Operator shoots all 4 panels, deposits Scanner in terminal to send upstairs.",
          "Upstairs player takes Scanner, calls out which of the 6 center fuses is glowing, team destroys it."
        ],
        loot: {
          weapons: ["Trustee (Scout)", "Heritage (Slug Shotgun)"],
          armor: ["Helmet", "Gauntlets"]
        }
      },
      {
        name: "2. Atraks-1, Fallen Exo",
        subtitle: "Replication Duplication",
        summary: "Coordinate between Space and Ground floors using Scanner to identify the real Atraks clone, burst with high single-hit damage, and eject Replication buffs out the airlocks.",
        image: "https://www.paracausality.com/assets/img/guides/DSC/Encounter 2_ Atraks - Space.webp",
        roles: [
          { role: "Scanner (Space/Ground)", description: "Look at Atraks clones; call out the one glowing yellow." },
          { role: "Operator (Airload)", description: "Shoot teammates' glowing heads to drop Replication orb and open airlock doors." },
          { role: "Burst DPS Team", description: "Use instant burst weapons to chunk Atraks in 3 seconds." }
        ],
        steps: [
          "Kill Vandal to take Operator & Scanner buffs.",
          "Send 3 players to Space station via pods.",
          "Scanner finds glowing Atraks clone; countdown 3-2-1 and dump burst damage.",
          "Player who picked up Replication debuff runs to airlock; Operator shoots head to drop debuff into vacuum.",
          "Send Scanner back and forth between Ground and Space to wipe all health bars."
        ],
        dpsTips: "Parasite, The Lament, Falling Guillotine, Grand Overture, Nova Bomb / Thundercrash.",
        loot: {
          weapons: ["Succession (Sniper)", "Heritage (Shotgun)"],
          armor: ["Gauntlets", "Leg Armor"]
        }
      },
      {
        name: "3. Taniks Reborn (Descent)",
        subtitle: "Nuclear Core Overload & Rapture",
        summary: "Coordinate Scanner, Operator, and Suppressor to run nuclear cores across the 4 bins before the station de-orbits.",
        image: "https://www.paracausality.com/assets/img/guides/DSC/dsc-rapture-1024x816.webp",
        roles: [
          { role: "Scanner", description: "Call out the 2 active glowing yellow deposit bins." },
          { role: "Operator", description: "Shoot keypad terminals to release nuclear cores." },
          { role: "Suppressor", description: "Stun Taniks under 3 cameras to unlock bins." }
        ],
        steps: [
          "Claim augment buffs from Vandals.",
          "Operator shoots panels to deposit cores.",
          "Runners deposit into bins indicated by Scanner.",
          "Suppressor stuns Taniks under the 3 cameras.",
          "Sprint into safe bunker when alarm sounds."
        ],
        loot: {
          weapons: ["Posterity (Hand Cannon)", "Trustee (Scout)"],
          armor: ["Chest Armor", "Leg Armor"]
        }
      },
      {
        name: "4. Taniks, the Abomination",
        subtitle: "Nuclear Core Descent & Final Stand",
        summary: "Use Scanner (read deposit bins), Operator (shoot detainment bubbles), and Suppressor (stun boss under drones) to deposit nuclear cores and burn Taniks.",
        image: "https://www.paracausality.com/assets/img/guides/DSC/dsc-taniks.webp",
        roles: [
          { role: "Scanner", description: "Call out 2 active glowing yellow bins (Spawn, Blue, Orange)." },
          { role: "Operator", description: "Shoot red detainment cages to free trapped runners." },
          { role: "Suppressor", description: "Shoot Taniks while standing under all 3 blue floating drones." },
          { role: "Core Runners (4x)", description: "Shoot Taniks's thrusters to drop nuclear cores and run to active bins." }
        ],
        steps: [
          "Shoot 4 thrusters on Taniks's hover chassis to drop nuclear cores.",
          "Runners carry cores to bins called out by Scanner.",
          "Suppressor stuns Taniks under all 3 drones to open bins.",
          "Operator frees trapped runners immediately.",
          "After 4 cores are deposited, jump into the purple ring around Taniks and DPS."
        ],
        dpsTips: "Microcosm, Whisper of the Worm, Apex Predator, Linear Fusion Rifles, Well of Radiance.",
        loot: {
          weapons: ["Eyes of Tomorrow (Exotic)", "Commemoration (LMG)", "Bequest (Sword)", "Posterity (HC)"],
          armor: ["Class Item", "All Armor Pieces"]
        }
      }
    ]
  },
  {
    id: "vog",
    name: "Vault of Glass",
    tagline: "Beneath Venus, evil stirs in the ancient Vex time-vault.",
    location: "Venus (Ishtar Sink)",
    bannerImage: "https://www.paracausality.com/assets/img/guides/VOG/vog_banner.webp",
    lootTableImage: "https://www.paracausality.com/assets/img/guides/VOG/Vault-of-Glass-Loot-Table-2025-infographic-Destiny2.webp",
    exotic: { name: "Vex Mythoclast", type: "Fusion Rifle (Solar Exotic Auto/LFR)" },
    secretChests: [
      {
        title: "Secret Chest #1 (Entrance Spire Door)",
        location: "Directly inside after raising the Spire",
        image: "https://www.paracausality.com/assets/img/guides/VOG/Vault_of_Glass_Post_Raid_Launch_Compressed_004.webp",
        guide: "Immediately after defending the 3 plates to raise the Spire and open the vault, the chest sits in the center of the doorway."
      },
      {
        title: "Secret Chest #2 (Secret Vent Route to Templar)",
        location: "Under Templar's Well before Oracles",
        image: "https://www.paracausality.com/assets/img/guides/VOG/6cc78-16342948758409-1920.webp",
        guide: "Drop down through the alternate hidden vent path on the right side of the cliff before entering the Templar chamber."
      },
      {
        title: "Secret Chest #3 (Gorgon's Labyrinth - Puzzle)",
        location: "Shoot the 4 Vex boxes without alerting Gorgons",
        image: "https://www.paracausality.com/assets/img/guides/VOG/gorgon_map.webp",
        guide: "Navigate the maze without being spotted and shoot the 4 hidden Vex cubes with Scout/Sniper rifles to spawn the chest."
      },
      {
        title: "Secret Chest #4 (Gorgon's Labyrinth - Cliff)",
        location: "Right wall cave in Gorgon's Labyrinth",
        image: "https://www.paracausality.com/assets/img/guides/VOG/Vault_of_Glass_Post_Raid_Launch_Compressed_006.webp",
        guide: "Follow the right wall path past the first floating Gorgon to find the traditional D1 materials chest."
      }
    ],
    encounters: [
      {
        name: "1. Raise the Spire (Open the Vault)",
        subtitle: "Waking Ruins Plate Defense",
        summary: "Capture and defend Left, Middle, and Right sync plates from Praetorians to build the Vex Spire and open the Vault door.",
        image: "https://www.paracausality.com/assets/img/guides/VOG/vog_maps_waking-ruins_1.webp",
        roles: [
          { role: "Plate Teams (2x per plate)", description: "Hold Left, Center, and Right sync plates; prevent Praetorian Minotaurs from stepping onto plates." }
        ],
        steps: [
          "Split fireteam into 3 pairs: Left, Middle, Right.",
          "Step on the 3 sync plates to start forming the Spire.",
          "Prevent Praetorians from stepping onto plates (which resets construction).",
          "Hold all 3 plates until the Spire fully converges and opens the Vault."
        ],
        loot: {
          weapons: ["Vision of Confluence (Scout)", "Corrective Measure (LMG)"],
          armor: ["Gauntlets", "Leg Armor"]
        }
      },
      {
        name: "2. Defend the Confluxes",
        subtitle: "Templar's Well - Wave Defense",
        summary: "Defend Left, Right, and Middle confluxes across 3 progressive phases from Vex sacrifices and Wyverns.",
        image: "https://www.paracausality.com/assets/img/guides/VOG/vog_maps_templars-well-conflux-3.webp",
        roles: [
          { role: "Lane Defenders", description: "Defend Left, Mid, and Right lanes from Fanatics, Goblins, and Wyverns." }
        ],
        steps: [
          "Phase 1: Defend Middle Conflux.",
          "Phase 2: Defend Left and Right Confluxes simultaneously.",
          "Phase 3: Defend all 3 Confluxes (Left, Middle, Right).",
          "Cleanse in the central pool of light if marked by green Fanatic slime."
        ],
        loot: {
          weapons: ["Vision of Confluence (Scout)", "Found Verdict (Shotgun)"],
          armor: ["Helmet", "Gauntlets"]
        }
      },
      {
        name: "3. Destroy the Oracles",
        subtitle: "Templar's Well - Oracle Chimes",
        summary: "Memorize the chime positions and destroy all 7 musical Oracles across 5 rounds in the exact sequence they spawn.",
        image: "https://www.paracausality.com/assets/img/guides/VOG/vog_maps_templars-well-oracles.webp",
        roles: [
          { role: "Oracle Shooters (6x)", description: "Assign players to Left (L1, L2, L3), Mid (M1), and Right (R1, R2, R3) Oracle spots." }
        ],
        steps: [
          "Listen to Oracle chimes; call out positions 1 through 7.",
          "Destroy oracles in the exact order they sounded.",
          "Missing an oracle marks the team for negation (cleanse in central pool).",
          "Complete all 5 ascending waves."
        ],
        loot: {
          weapons: ["Praedyth's Revenge (Sniper)", "Corrective Measure (LMG)"],
          armor: ["Chest Armor", "Leg Armor"]
        }
      },
      {
        name: "4. The Templar",
        subtitle: "Shield of the Aegis",
        summary: "The Relic holder breaks the Templar's shield using super, blocks teleport rings to extend DPS, while team melts boss.",
        image: "https://www.paracausality.com/assets/img/guides/VOG/templar_map.webp",
        roles: [
          { role: "Relic Holder", description: "Cleanse allies, super boss shield, stand in red teleport circles to block escapes." },
          { role: "DPS Team", description: "Drop Well, melt boss, destroy glowing oracles if teleport is missed." }
        ],
        steps: [
          "Relic holder charges super and blasts Templar to drop shield.",
          "Team drops Well and fires heavy rockets / fusion rifles.",
          "Relic holder sprints to red ring on floor to block Templar teleport.",
          "Burn down boss in single extended phase."
        ],
        dpsTips: "Apex Predator, Gjallarhorn, Fusion Rifles, Rapid-fire Shotguns.",
        loot: {
          weapons: ["Fatebringer (Hand Cannon)", "Praedyth's Revenge (Sniper)"],
          armor: ["Chest Armor", "Helmet"]
        }
      },
      {
        name: "5. Gorgon's Labyrinth",
        subtitle: "The Stealth Maze",
        summary: "Sneak past the Gorgons without double-jumping or sprinting near them, or destroy 4 hidden Vex cubes to spawn the secret chest.",
        image: "https://www.paracausality.com/assets/img/guides/VOG/gorgon_map.webp",
        roles: [
          { role: "Guide / Path Leader", description: "Lead fireteam through the rock formations and caves without alerting Gorgons." }
        ],
        steps: [
          "Crouch and follow the boulder path behind the Gorgon patrol paths.",
          "Avoid using double-jumps or loud abilities.",
          "Reach the exit gate to unlock the chasm jumping puzzle."
        ],
        loot: {
          weapons: ["Raid Spoils"],
          armor: ["Materials & Raid Armor"]
        }
      },
      {
        name: "6. Gatekeeper & The Glass Throne",
        subtitle: "Mars & Venus Portal Relics",
        summary: "Hold Mars (Past) and Venus (Future) portal plates open, cycle Aegis Relic between portals to destroy shielded Minotaurs, and defend central conflux.",
        image: "https://www.paracausality.com/assets/img/guides/VOG/vog_throne_room_map.webp",
        roles: [
          { role: "Plate Holders (2x)", description: "Keep Left (Mars) and Right (Venus) plates open." },
          { role: "Relic Runners (2x)", description: "Pass Aegis shield between portals to strip Minotaur shields." },
          { role: "Middle Conflux Defender", description: "Defend conflux against Wyverns." }
        ],
        steps: [
          "Kill Gatekeeper, pick up Aegis Relic.",
          "Open Left (Mars) and Right (Venus) portals.",
          "Relic holder runs inside portal to destroy immune Minotaur.",
          "Swap Relic at portal door to reset teleport lockout.",
          "Defend central glass conflux from final wave of Wyverns."
        ],
        loot: {
          weapons: ["Hezen Vengeance (Rocket)", "Found Verdict (Shotgun)"],
          armor: ["Helmet", "Class Item"]
        }
      },
      {
        name: "7. Atheon, Time's Conflux",
        subtitle: "Time's Vengeance",
        summary: "3 teleported players destroy 3 waves of Oracles matching outside callouts, exit portal with Time's Vengeance buff (infinite abilities), and DPS Atheon.",
        image: "https://www.paracausality.com/assets/img/guides/VOG/vog_atheon_teleport.webp",
        roles: [
          { role: "Portal Team (3x Teleported)", description: "Grab Relic, read or destroy 3 waves of 3 Oracles, exit portal." },
          { role: "Outside Team (3x Left Behind)", description: "Open portal plate, kill Supplicant suicide harpies, read Oracle sequence from outside." }
        ],
        steps: [
          "Atheon teleports 3 random players to Mars (Red) or Venus (Green).",
          "Inside: One grabs Relic and cleanses blindness. Outside: Read 3 red oracle positions (e.g. Far Left, Close Mid, Far Right).",
          "Inside shoots oracles in order.",
          "Exit portal with 'Time's Vengeance' 30-second buff: infinite super & ability regen.",
          "DPS Atheon from middle floating platform. Player with 'Imminent Detain' jumps away to avoid trapping allies."
        ],
        dpsTips: "Fusion Grenades (Starfire/Verity's), Grand Overture, Microcosm, Gjallarhorn + Rockets.",
        loot: {
          weapons: ["Vex Mythoclast (Exotic)", "Hezen Vengeance (Rocket)", "Fatebringer"],
          armor: ["Class Item", "All Armor Pieces"]
        }
      }
    ]
  },
  {
    id: "gos",
    name: "Garden of Salvation",
    tagline: "The Garden calls out to you. Cleanse the Black Garden of the Sol Divisive.",
    location: "Black Garden (Mars Gate)",
    bannerImage: "https://www.paracausality.com/assets/img/guides/GOS/gos_overlay.webp",
    lootTableImage: "https://www.paracausality.com/assets/img/guides/GOS/Garden-of-Salvation-Loot-Table-infographic-Destiny-2.webp",
    exotic: { name: "Divinity", type: "Trace Rifle (Arc Disruption Cage - Quest)" },
    secretChests: [
      {
        title: "Secret Chest #1 (Undergrowth Tree Root)",
        location: "Tree trunk cavity during the 1st jumping puzzle",
        image: "https://www.paracausality.com/assets/img/guides/GOS/3590146-destiny%202%20garden%20of%20salvation%20hidden%20chest%20undergrowth.webp",
        guide: "During the traversal through the Undergrowth before Encounter 2, jump into the hollowed tree root on the right side of the glowing blue flora path."
      },
      {
        title: "Secret Chest #2 (Boundless Horizon Tree)",
        location: "High tree branch before Sanctified Mind",
        image: "https://www.paracausality.com/assets/img/guides/GOS/3590159-destiny%202%20garden%20of%20salvation%20second%20chest%20location.webp",
        guide: "During the vertical climbing puzzle following Encounter 3, jump onto the high outer tree bough before the final boss arena."
      }
    ],
    encounters: [
      {
        name: "1. Evade the Consecrated Mind (Embrace)",
        subtitle: "Voltaic Overflow & Tether Gates",
        summary: "Chain players together to form laser tethers to open doors, pick up Voltaic Mote debuffs in rotation, and sprint through the overgrown garden.",
        image: "https://www.paracausality.com/assets/img/guides/GOS/embrace.webp",
        roles: [
          { role: "Tether Team (3x)", description: "Line up from cube node to lock door to open path." },
          { role: "Voltaic Runners (3x)", description: "Take boss spit orbs in rotation so no player takes two consecutively." }
        ],
        steps: [
          "Form human tether chain from glowing box to door lock.",
          "Pick up Voltaic Overflow spit before it explodes (60s cooldown per player).",
          "Sprint through the garden relay race to the final arena."
        ],
        loot: {
          weapons: ["Zealot's Reward (Fusion)", "Accrued Redemption (Bow)"],
          armor: ["Gauntlets", "Leg Armor"]
        }
      },
      {
        name: "2. Summon the Consecrated Mind (Undergrowth)",
        subtitle: "4-Relay Defense & Enlightened Rotation",
        summary: "Defend 4 separate conflux relays across the Undergrowth map using Enlightened buffs gained from tether boxes, and rotate along the perimeter to stop Vex sacrifices.",
        image: "https://www.paracausality.com/assets/img/guides/GOS/garden-of-salvation-undergrowth-map.webp",
        roles: [
          { role: "Relay Defenders (4x)", description: "Hold Relay 1, 2, 3, and 4; refresh Enlightened buff to break white Vex shields." },
          { role: "Tether Floaters (2x)", description: "Sprint along perimeter to link tethers and refresh teammates' Enlightened timers." }
        ],
        steps: [
          "Start at Relay 1: link tether from box to relay to gain 'Enlightened' (45s).",
          "Send runner down pathway to unlock Relay 2, 3, and 4 in sequence.",
          "Defenders kill shielded Goblins sacrificing at relays.",
          "Defeat Angelic Hydras to re-enable tether boxes.",
          "Once all 4 relays are charged, group in center to clear final wave of shielded combatants."
        ],
        loot: {
          weapons: ["Sacred Provenance (Pulse)", "Ancient Gospel (HC)"],
          armor: ["Chest Armor", "Gauntlets"]
        }
      },
      {
        name: "3. Consecrated Mind, Sol Inherent",
        subtitle: "Spire Relay & Eye Shooters",
        summary: "Deposit 30 Voltaic Motes at the central relay, send a team to follow the boss and shoot its inner/outer red eyes, and damage the Consecrated Mind as it flees.",
        image: "https://www.paracausality.com/assets/img/guides/GOS/garden-of-salvation-defeat-consecrated-mind-map.webp",
        roles: [
          { role: "Mote Team (3x)", description: "Kill Minotaurs, collect 5 or 10 motes, bank at central relay to gain Enlightened." },
          { role: "Boss Follower / Eye Shooters (3x)", description: "Follow Consecrated Mind, collect spit orb to reveal glowing red eyes, shoot inner/outer eyes simultaneously." }
        ],
        steps: [
          "Mote team banks 30 motes total at the central spire relay.",
          "Eye team follows boss down the hallway; one player collects the Voltaic Overflow debuff.",
          "Eye team destroys all red eyes (inner or outer) before the boss wipes the team.",
          "When 30 motes are banked, the boss flies to the center spire.",
          "Drop Well of Radiance and backpedal while precision DPSing the center eye."
        ],
        dpsTips: "Whisper of the Worm, Linear Fusion Rifles (Cataclysmic, Taipan), Still Hunt + Golden Gun.",
        loot: {
          weapons: ["Ancient Gospel (HC)", "Sacred Provenance (Pulse)"],
          armor: ["Helmet", "Leg Armor"]
        }
      },
      {
        name: "4. Sanctified Mind, Sol Inherent",
        subtitle: "The Final Vex Architect",
        summary: "Open Red and Blue portals by shooting shoulders/knees, collect motes from islands to fill relays, rebuild missing floor platforms, and tether boss for DPS.",
        image: "https://www.paracausality.com/assets/img/guides/GOS/garden-of-salvation-sanctified-mind-portals.webp",
        roles: [
          { role: "Mote Teams (Red & Blue)", description: "Enter portal, collect 10 motes from Harpies/Goblins, bank at matching relay." },
          { role: "Platform Builders", description: "Tether between node and missing floor tiles to rebuild arena ground." }
        ],
        steps: [
          "Shoot glowing knee/shoulder to open Red (Light) or Blue (Dark) portal.",
          "Teams collect 30 motes total per relay to unlock Enlightened shields and fill bank.",
          "Rebuild disintegrating floor tiles with 2-man tethers.",
          "When both relays are full, tether boss with matching color laser.",
          "DPS Sanctified Mind from central platform."
        ],
        dpsTips: "Whisper of the Worm, Enhanced Linear Fusion Rifles, Izanagi's Burden + Rocket swap.",
        loot: {
          weapons: ["Divinity (Quest Exotic)", "Sacred Provenance (Pulse)", "Ancient Gospel (HC)", "Omniscient Eye (Sniper)"],
          armor: ["All Armor Pieces"]
        }
      }
    ]
  },
  {
    id: "lw",
    name: "Last Wish",
    tagline: "The opportunity of a lifetime. Slay the Ahamkara Riven in the Dreaming City.",
    location: "Dreaming City (Keep of Voices)",
    bannerImage: "https://www.paracausality.com/assets/img/guides/LW/lw_banner.webp",
    lootTableImage: "https://www.paracausality.com/assets/img/guides/LW/Last-Wish-loot-table.webp",
    exotic: { name: "One Thousand Voices", type: "Fusion Rifle (Solar Beam Explosion)" },
    wishes: [
      {
        number: 4,
        name: "Wish to Help a Friend in Need (Shuro Chi Checkpoint)",
        category: "Checkpoint",
        effect: "Teleports the entire fireteam directly to Shuro Chi (Encounter 2).",
        description: "The most famous wish in Destiny 2! Teleports you instantly to the Shuro Chi boss arena. Used heavily for weapon catalyst farming, bounties, and backtracking across the broken bridge to open the free weekly secret chest without fighting any enemies.",
        shuroChiNote: "💡 Free Secret Chest Backtrack: After teleporting to Shuro Chi with Wish 4, do NOT start the encounter. Turn 180 degrees around, jump backwards across the giant broken bridge pillars, and open the secret chest under the tree root for free raid loot on all 3 characters every week!"
      },
      {
        number: 1,
        name: "Wish to Feed an Addiction (Ethereal Key)",
        category: "Loot / Key",
        effect: "Grants 1 free Ethereal Key for the final chest room.",
        description: "Provides an additional Ethereal Key to open an extra chest in the final treasure room after defeating Riven & completing Queenswalk (once per account)."
      },
      {
        number: 2,
        name: "Wish for Material Validation (Glittering Key Chest)",
        category: "Loot / Key",
        effect: "Spawns a secret chest between Morgeth and The Vault.",
        description: "Spawns a locked chest in the canyon between Morgeth and The Vault. Requires a 'Glittering Key' (random drop from Riven) to open and rewards the Ermine TAC-717 Exotic Ship."
      },
      {
        number: 3,
        name: "Wish for Others to Celebrate Your Success",
        category: "Loot / Key",
        effect: "Unlocks the 'Numbers of Power' Emblem.",
        description: "Immediately unlocks the exclusive Numbers of Power raid emblem for all fireteam members upon stepping on the plate."
      },
      {
        number: 5,
        name: "Wish to Help a Friend in Need (Morgeth Checkpoint)",
        category: "Checkpoint",
        effect: "Teleports the fireteam directly to Morgeth, the Spirekeeper (Encounter 3).",
        description: "Skip Kalli and Shuro Chi to start immediately at Morgeth the Spirekeeper in the courtyard."
      },
      {
        number: 6,
        name: "Wish to Help a Friend in Need (The Vault Checkpoint)",
        category: "Checkpoint",
        effect: "Teleports the fireteam directly to The Vault (Encounter 4).",
        description: "Teleports the fireteam straight into the Dreaming City Vault mechanism encounter."
      },
      {
        number: 7,
        name: "Wish to Help a Friend in Need (Riven Checkpoint)",
        category: "Checkpoint",
        effect: "Teleports the fireteam directly to Riven of a Thousand Voices (Encounter 5).",
        description: "Instant skip directly to the Ahamkara Riven boss room for quick 3x weekly boss completions and One Thousand Voices farming."
      },
      {
        number: 8,
        name: "Wish to Stay Here Forever (Song)",
        category: "Fun / Audio",
        effect: "Plays Paul McCartney's 'Hope for the Future' track.",
        description: "Replaces ambient background music with the iconic track 'Hope for the Future' throughout the raid."
      },
      {
        number: 9,
        name: "Wish to Stay Here Forever (Failsafe Voiceover)",
        category: "Fun / Audio",
        effect: "Replaces Riven's dialogue with Failsafe voice lines.",
        description: "Failsafe comments on your actions and takes over Riven's telepathic communications."
      },
      {
        number: 10,
        name: "Wish to Stay Here Forever (Drifter Voiceover)",
        category: "Fun / Audio",
        effect: "Replaces Riven's dialogue with The Drifter voice lines.",
        description: "The Drifter talks in your ear throughout the raid, calling you 'brother' and hyping up combat."
      },
      {
        number: 11,
        name: "Wish to Stay Here Forever (Grunt Birthday Party)",
        category: "Fun / Audio",
        effect: "Precision kills trigger Grunt Birthday Party confetti & cheers.",
        description: "Enables festive sound effects and colorful confetti explosions whenever you land precision final blows on enemies."
      },
      {
        number: 12,
        name: "Wish to Open Your Mind to a New Design",
        category: "Fun / Audio",
        effect: "Equips glowing crown / halo cosmetics on all fireteam heads.",
        description: "Gives all guardians glowing traveler / fallen crowns floating above their helmets for the duration of the raid."
      },
      {
        number: 13,
        name: "Wish for the Means to Feed an Addiction (Petra's Run)",
        category: "Challenge",
        effect: "Activates Petra's Run (Flawless Raid Challenge).",
        description: "Enables Flawless Mode: if any single guardian dies at any point during the entire raid, the whole fireteam is instantly returned to orbit. Required for the Rivensbane seal title."
      },
      {
        number: 14,
        name: "Wish to Support a Worthy Cause (Corrupted Eggs)",
        category: "Loot / Key",
        effect: "Spawns 5 Corrupted Ahamkara Eggs throughout the raid.",
        description: "Spawns Corrupted Eggs inside the raid that can only be destroyed with the Wish-Ender Exotic Bow. Required for the 'Corrupted Omelette' triumph and the Harbinger's Echo exotic sparrow."
      }
    ],
    secretChests: [
      {
        title: "Free Secret Chest #1 (Shuro Chi Backtrack - Solo Accessible!)",
        location: "Broken bridge before Shuro Chi (No fighting required)",
        image: "https://www.paracausality.com/assets/img/guides/LW/shuroChi_1.webp",
        guide: "1. Load into Last Wish solo. 2. Jump onto the secret wall ledges before Kalli to enter the Wall of Wishes room. 3. Input Wish 4 to teleport to Shuro Chi. 4. Turn around 180 degrees, jump across the broken bridge pillars, and open the chest under the tree root!"
      },
      {
        title: "Secret Chest #2 (Morgeth Tree Root)",
        location: "Tree branch in the chasm before Morgeth",
        image: "https://www.paracausality.com/assets/img/guides/LW/shuroChi_2.webp",
        guide: "During the traversal canyon before Morgeth, jump onto the high rock ledge on the right and climb the overgrown tree root."
      }
    ],
    encounters: [
      {
        name: "1. Kalli, the Corrupted",
        subtitle: "The Corrupted Techeun",
        summary: "Identify correct snake/bird/fish symbols, cleanse matching plates, defeat Knights, hide in safe room doors during wipe dirge, and burst Kalli.",
        image: "https://www.paracausality.com/assets/img/guides/LW/kalli.webp",
        roles: [
          { role: "Plate Solvers (6x)", description: "Stand on non-bomb sections of matching symbol plates and kill spawned Knights." }
        ],
        steps: [
          "Check center symbols (snakes/birds/dragons/fishes).",
          "Each player claims matching plate; dodge explosive bombs on plate.",
          "Kill Knight, group up in mid to DPS Kalli.",
          "When Kalli raises arms, run into your opened small door under the center arena.",
          "Repeat DPS across 3 door cycles."
        ],
        loot: {
          weapons: ["Apex Predator (Rocket)", "The Supremacy (Sniper)", "Techeun Force (Fusion)"],
          armor: ["Helmet", "Gauntlets"]
        }
      },
      {
        name: "2. Shuro Chi, the Corrupted",
        subtitle: "Song of Ruin & Prism Triangle",
        summary: "Speedrun through Shuro Chi's 4-minute timer, break her shield with 3 Prism crystals, burst 1/6th of her health, solve the 3x3 wall image puzzle on floors 1 and 2, and interrupt her wipe tempo.",
        image: "https://www.paracausality.com/assets/img/guides/LW/shuro_chi.webp",
        roles: [
          { role: "Prism Shieldbreakers (3x)", description: "Pick up the 3 crystals around Shuro Chi, jump on plates on 3-2-1 countdown, shoot crystal beams at teammate to your right in a triangle." },
          { role: "Wall Puzzle Jumpers (4x)", description: "Look at the 3x3 symbol paintings on the wall. Jump onto matching floor plates for the 4 missing tiles simultaneously (do not step on same plate twice)." },
          { role: "Eye of Riven Interrupt", description: "Grab the Taken orb dropped by the Captain. When Shuro Chi begins her wipe chant, press Super (F) while aiming at her to stagger and extend DPS." }
        ],
        steps: [
          "Clear adds; 3 players grab Prism crystals and shoot each other clockwise in a triangle to break Shuro Chi's shield.",
          "DPS Shuro Chi until 1/6th health bar is depleted; advance to next checkpoint.",
          "Repeat shield break and damage for the second bar.",
          "Enter Puzzle Room: 4 players jump on missing image floor tiles matching the 3 wall paintings.",
          "Climb platforms to Floor 2, repeat across all 6 health segments."
        ],
        dpsTips: "Swords (Falling Guillotine, Lament, Bequest), Lord of Wolves, Rapid-Fire Shotguns, Tractor Cannon + Well of Radiance.",
        loot: {
          weapons: ["Nation of Beasts (Hand Cannon)", "Age-Old Bond (Auto)", "Transfiguration (Scout)"],
          armor: ["Chest Armor", "Leg Armor"]
        }
      },
      {
        name: "3. Morgeth, the Spirekeeper",
        subtitle: "Taken Ogre of the Keep",
        summary: "Collect Taken Strength blights (up to x2 per player), cleanse immobilized teammates using Eye of Riven grenades, and burn Morgeth before his strength reaches 100%.",
        image: "https://www.paracausality.com/assets/img/guides/LW/morgeth.webp",
        roles: [
          { role: "Strength Collectors (4x)", description: "Collect 2 Taken Strength blights each." },
          { role: "Cleanser / Relic Holder (2x)", description: "Kill Eye of Riven Captain, pick up orb, press Grenade next to trapped ally to cleanse." }
        ],
        steps: [
          "Collect Taken Strength orbs (10 total spawn).",
          "When a player holding 2 strength is detained in a bubble, the Cleanser uses the relic grenade to free them.",
          "Pick up the final 10th blight to trigger damage phase.",
          "Drop Well of Radiance on the bridge and shoot Morgeth's giant glowing back sac.",
          "If Morgeth begins wipe at 90% strength, relic holder presses Super to interrupt."
        ],
        dpsTips: "Whisper of the Worm, Linear Fusion Rifles, Apex Predator with Gjallarhorn.",
        loot: {
          weapons: ["The Supremacy (Sniper)", "Nation of Beasts (HC)"],
          armor: ["Gauntlets", "Leg Armor"]
        }
      },
      {
        name: "4. The Vault",
        subtitle: "Ahamkara Security Mechanism",
        summary: "Decipher Antumbra (Light) and Penumbra (Dark) symbols across Trees, Stairs, and Rocks, retrieve Eye of Riven relics from side rooms, and cleanse matching plates.",
        image: "https://www.paracausality.com/assets/img/guides/LW/vault.webp",
        roles: [
          { role: "Plate Decipherers (3x)", description: "Stand on Trees, Stairs, and Rocks plates. Read middle symbol; determine if side rooms have matching symbol on Left (Antumbra) or Right (Penumbra)." },
          { role: "Relic Runners (2x)", description: "Kill Eye of Riven Captain inside open room, take relic through tunnel, slam into matching Antumbra/Penumbra plate." },
          { role: "Knight Hunters", description: "Instantly melt Might of Riven Knights before they slam plates." }
        ],
        steps: [
          "3 players step on plates: Trees reads middle symbol, Stairs reads if it's on left (Antumbra) or right (Penumbra).",
          "Kill Captain in active room to get Taken relic.",
          "Runner navigates through rock/stairs tunnel and slams relic into plate with matching Antumbra or Penumbra debuff.",
          "Kill 3 Might of Riven Knights per phase.",
          "Repeat across 3 total rounds."
        ],
        loot: {
          weapons: ["Tyranny of Heaven (Bow)", "Chattering Bone (Pulse)", "Transfiguration"],
          armor: ["Chest Armor", "Helmet"]
        }
      },
      {
        name: "5. Riven of a Thousand Voices & Queenswalk",
        subtitle: "Heart of the Dragon",
        summary: "Confront Riven either legitimately by reading eyes and using elevator crystals or via high burst DPS, destroy the glowing weakpoints, and carry Riven's Heart back through the Vault.",
        image: "https://www.paracausality.com/assets/img/guides/LW/riven.webp",
        roles: [
          { role: "Heart Carrier", description: "Carry Riven's Heart, call countdown (30s), use bubble aura to protect team from Creeping Darkness." },
          { role: "Inside Heart Cleansers", description: "Collect Taken Timekeeper orbs in Ascendant Realm to reset outside carrier timer." }
        ],
        steps: [
          "Drop down into crystal rooms; burst Riven's mouth with swords, heavy grenade launchers, or rockets before she wipes the room.",
          "Shoot glowing black pimples on Riven's chest during the vertical free-fall descent.",
          "Enter mouth, destroy the Blighted Heart inside her stomach.",
          "Queenswalk: The chosen carrier runs through the Vault towards the Techeuns. When swallowed, next player picks up heart.",
          "Dunk heart into the Techeun bowl to complete the raid."
        ],
        dpsTips: "Edge Transit (Envious + Bait and Switch), Apex Predator + Gjallarhorn, Bequest / Falling Guillotine + Tractor Cannon.",
        loot: {
          weapons: ["One Thousand Voices (Exotic)", "All Last Wish Weapons (Deepsight Craftable)"],
          armor: ["Class Item", "All Armor Pieces"]
        }
      }
    ]
  }
];
