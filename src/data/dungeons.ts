export interface DungeonEncounter {
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

export interface DungeonSecretChest {
  title: string;
  location: string;
  image?: string;
  guide: string;
}

export interface DungeonGuide {
  id: string;
  name: string;
  tagline: string;
  location: string;
  bannerImage?: string;
  lootTableImage?: string;
  exotic: { name: string; type: string };
  encounters: DungeonEncounter[];
  secretChests?: DungeonSecretChest[];
  collectibles?: { title: string; guide: string };
}

export const DUNGEONS_DATA: DungeonGuide[] = [
  {
    id: "sd",
    name: "Sundered Doctrine",
    tagline: "Venture beneath the shattered observatory to unearth ancient resonant knowledge.",
    location: "Mercurian Sub-Vaults",
    bannerImage: "https://www.paracausality.com/assets/img/guides/sd/sd_overlay.webp",
    lootTableImage: "https://www.paracausality.com/assets/img/guides/SD/Sundered-Doctrine-Loot-Table-infographic-Destiny-2.webp",
    exotic: { name: "Doctrine's Gaze", type: "Linear Fusion Rifle (Strand Resonance)" },
    secretChests: [
      {
        title: "Secret Chest #1 (Observatory Duct)",
        location: "Air duct before Encounter 1",
        image: "https://www.paracausality.com/assets/img/guides/SD/destiny-2-sundered-doctrine-dungeon-all-secret-chest-locations-5.webp",
        guide: "Drop down through the shattered glass dome and look behind the rusted vent shaft on the northern wall."
      },
      {
        title: "Secret Chest #2 (Babylon Archives)",
        location: "Between Encounter 1 and Encounter 2",
        image: "https://www.paracausality.com/assets/img/guides/SD/destiny-2-sundered-doctrine-dungeon-all-secret-chest-locations-3.webp",
        guide: "Navigate the floating debris across the archive chasm to find the chest on a high secluded ledge."
      },
      {
        title: "Secret Chest #3 (Calypso Descent)",
        location: "Pre-Boss traversal cavern",
        image: "https://www.paracausality.com/assets/img/guides/SD/destiny-2-sundered-doctrine-dungeon-all-secret-chest-locations-1.webp",
        guide: "Before dropping into Kerrev's arena, jump along the outer cliff scaffolding to locate the third chest."
      }
    ],
    encounters: [
      {
        name: "1. Flooded Inspection (Zoetic Lockset)",
        subtitle: "Solving the Glyph Riddle",
        summary: "Read paired Light and Dark Vow glyphs across the room, activate matching terminals in sequence, and clear Scorn abominations.",
        image: "https://www.paracausality.com/assets/img/guides/SD/destiny-2-sundered-doctrine-first-encounter-mechanics.webp",
        roles: [
          { role: "Glyph Readers", description: "Read symbol pairs and shoot matching terminals." }
        ],
        steps: [
          "Clear defending Scorn and Dread combatants.",
          "Identify matching symbols on archive obelisks.",
          "Unlock elevator descent into the central core."
        ],
        loot: {
          weapons: ["Resonant Voice (Pulse)", "Shattered Faith (Shotgun)"],
          armor: ["Helmet", "Gauntlets"]
        }
      },
      {
        name: "2. Isolate Preservation",
        subtitle: "The Central Vault",
        summary: "Navigate the shifting corridors, align the resonant prisms, and destroy the Hive Wardens.",
        image: "https://www.paracausality.com/assets/img/guides/SD/d2-sundereddoctrine-033.webp",
        roles: [
          { role: "Prism Aligners", description: "Rotate resonant crystals to direct light beams into central relays." }
        ],
        steps: [
          "Kill Scorn Chieftains to obtain elemental keys.",
          "Align light beams across the 3 perimeter pillars.",
          "Defeat the central Warden to open the boss portal."
        ],
        loot: {
          weapons: ["Sundered Thread (Bow)", "Resonant Voice (Pulse)"],
          armor: ["Chest Armor", "Leg Armor"]
        }
      },
      {
        name: "3. Kerrev, The Erased",
        subtitle: "Final Confrontation",
        summary: "Search outer rooms for hidden glyphs, coordinate simultaneous terminal triggers, and burst Kerrev in the central chamber.",
        image: "https://www.paracausality.com/assets/img/guides/SD/destiny-2-sundered-doctrine-final-encounter-search-rooms.webp",
        roles: [
          { role: "Room Searchers (2x)", description: "Enter side chambers to find illuminated glyphs." },
          { role: "DPS Anchor", description: "Drop Well in center platform and stagger boss attacks." }
        ],
        steps: [
          "Search side rooms for active glyph pairs.",
          "Shoot matching glyphs to strip Kerrev's immune shield.",
          "DPS Kerrev in the center while avoiding resonant floor waves."
        ],
        dpsTips: "Whisper of the Worm, Linear Fusion Rifles, Still Hunt + Nighthawk.",
        loot: {
          weapons: ["Doctrine's Gaze (Exotic)", "All Dungeon Weapons"],
          armor: ["Class Item", "All Armor Pieces"]
        }
      }
    ]
  },
  {
    id: "vh",
    name: "Vesper's Host",
    tagline: "Defy the algorithm. Cut through its web in the abandoned orbital station.",
    location: "Europa Orbit (Vesper Station)",
    bannerImage: "https://www.paracausality.com/assets/img/guides/vh/vh_overlay.webp",
    lootTableImage: "https://www.paracausality.com/assets/img/guides/VH/Vespers-Host-Loot-Table-infographic-Destiny-2.webp",
    exotic: { name: "Ice Breaker", type: "Sniper Rifle (Solar Exotic Ammo Regeneration)" },
    secretChests: [
      {
        title: "Secret Chest #1 (Elevator Shaft)",
        location: "Maintenance duct before Encounter 1",
        image: "https://www.paracausality.com/assets/img/guides/VH/0QN2rAK.webp",
        guide: "During the initial station descent, drop past the second spinning turbine fan and look for an illuminated vent grating on the right wall."
      },
      {
        title: "Secret Chest #2 (Coolant Airlock)",
        location: "Between Encounter 2 and Final Boss",
        image: "https://www.paracausality.com/assets/img/guides/VH/A9eTtSg.webp",
        guide: "In the frozen ventilation maze after defeating Raneiks, use the Operator augment to shoot the red panel above the locked maintenance bay."
      }
    ],
    encounters: [
      {
        name: "1. Station Reactor Activation",
        subtitle: "Augment Core Security",
        summary: "Utilize Scanner, Operator, and Suppressor augments to identify active panel codes, route emergency power, and purge corrupted station security.",
        image: "https://www.paracausality.com/assets/img/guides/VH/destiny-2-vespers-host-activation-operator.webp",
        roles: [
          { role: "Scanner Operator", description: "Pick up yellow Scanner augment to read the 4 glowing terminal numbers on computer screens." },
          { role: "Operator Shooter", description: "Pick up red Operator augment to shoot matching numbered keypads in order." },
          { role: "Core Carrier", description: "Deposit nuclear power cell into active circuit stations." }
        ],
        steps: [
          "Defeat the Augmented Vandals to spawn Operator (Red) and Scanner (Yellow) buffs.",
          "Scanner reads the 4-digit monitor code above the arena.",
          "Operator shoots the 4 glowing numbered keypad buttons in precise sequence.",
          "Deposit the charged reactor core into the unlocked generator room to open the elevator shaft."
        ],
        mechanics: [
          { title: "Radiation Protocol", text: "Holding a nuclear core accumulates Radiation stacks (1-10). At 10 stacks you die. Swap core with an ally or deposit quickly." }
        ],
        loot: {
          weapons: ["VS Chill Inhibitor (Heavy GL)", "VS Pyroelectric Propellant (Auto)"],
          armor: ["Helmet", "Gauntlets"]
        }
      },
      {
        name: "2. Raneiks Unified",
        subtitle: "The Amalgamated Servitor",
        summary: "Use Scanner and Operator to split Raneiks into mini-servitors, identify which mini-servitors have glowing numerical augments, and destroy matching clones.",
        image: "https://www.paracausality.com/assets/img/guides/VH/destiny-2-vespers-host-raneiks-numbers.webp",
        roles: [
          { role: "Scanner / Reader", description: "Check monitors to call out the active mini-servitor positions (1 through 9)." },
          { role: "Operator", description: "Shoot numbered control nodes around the room to trigger coolant vents." },
          { role: "Burst DPS", description: "Group at center and unload high burst damage into Raneiks when stunned." }
        ],
        steps: [
          "Defeat Vandals to get Operator and Scanner buffs.",
          "Operator shoots the 4 panels displayed by Scanner on the central wall.",
          "Raneiks splits into 9 mini-servitors. Scanner identifies the 2 glowing servitors.",
          "Kill the 2 matching mini-servitors to break Raneiks's immune shield.",
          "DPS Raneiks in the center room before he reconstructs."
        ],
        dpsTips: "Grand Overture, Apex Predator with Gjallarhorn, Dragons Breath, Nova Bomb / Thundercrash.",
        loot: {
          weapons: ["VS Gravitic Arrest (Fusion)", "VS Velocity Baton (Breech GL)"],
          armor: ["Chest Armor", "Leg Armor"]
        }
      },
      {
        name: "3. Corrupted Puppeteer",
        subtitle: "The Anomaly of Vesper",
        summary: "Navigate the upper observation deck and lower bunker, transport nuclear cores across airlocks, and stagger the Puppeteer's duplicate clones during DPS.",
        image: "https://www.paracausality.com/assets/img/guides/VH/destiny-2-vespers-host-deposit-core.webp",
        roles: [
          { role: "Scanner", description: "Look through viewing windows to find the real Puppeteer clone." },
          { role: "Operator", description: "Open lower floor airlocks and activate terminal transfer chutes." },
          { role: "Core Transporter", description: "Run cores through the lower reactor grid to overload the boss shield." }
        ],
        steps: [
          "Transfer nuclear cores through the lower airlock grid into reactor terminals.",
          "Scanner identifies which clone in the lower room is glowing yellow.",
          "Defeat the designated clone to drop the boss into the central DPS chamber.",
          "Jump to the upper platform; drop Well of Radiance / Ward of Dawn and burn the Puppeteer.",
          "Dodge lightning storms and clone dash attacks."
        ],
        dpsTips: "Whisper of the Worm, Microcosm, Still Hunt + Nighthawk, Linears with Bait and Switch.",
        loot: {
          weapons: ["Ice Breaker (Exotic Sniper)", "VS Chill Inhibitor", "All Dungeon Weapons"],
          armor: ["Class Item", "All Armor Pieces"]
        }
      }
    ]
  },
  {
    id: "wr",
    name: "Warlord's Ruin",
    tagline: "Nestled deep in the mountains of the EDZ, Scorn lay claim to a Dark Age castle containing dangerous relics.",
    location: "Earth (European Dead Zone)",
    bannerImage: "https://www.paracausality.com/assets/img/guides/wr/wr_overlay.webp",
    lootTableImage: "https://www.paracausality.com/assets/img/guides/WR/Warlords-Ruin-loot-table-Infographic-BlueberriesGG-v2.webp",
    exotic: { name: "Buried Bloodline", type: "Sidearm (Void Special Ammo Crossbow)" },
    secretChests: [
      {
        title: "Secret Chest #1 (Castle Prison Escape)",
        location: "Sewer tunnel under the torture dungeon",
        image: "https://www.paracausality.com/assets/img/guides/WR/WarlordsRuinGuide.PrisonKey.webp",
        guide: "After escaping the hanging cages and solving the number dial puzzle in the dungeon jail, look inside the drainage pipe before reaching the mountain courtyard."
      },
      {
        title: "Secret Chest #2 (Blizzard Peaks)",
        location: "Cliffside fortress ledge before Hefnd",
        image: "https://www.paracausality.com/assets/img/guides/WR/WarlordsRuinCollectables.SecretChest2.webp",
        guide: "During the mountain climb following the Locus encounter, jump across the crumbling wooden bridge to the hidden snow cave on the far left cliff."
      }
    ],
    encounters: [
      {
        name: "1. Rathil, First Broken Knight",
        subtitle: "Wrath of the Scorned",
        summary: "Cleanse corruption cages, capture Scorn totem beacons to reduce the Imminent Wish timer, and burn Rathil in the castle courtyard.",
        image: "https://www.paracausality.com/assets/img/guides/WR/rathil.webp",
        roles: [
          { role: "Totem Capturers", description: "Stand in glowing white totem rings spawned by Scorn lanterns." },
          { role: "Cage Escapers", description: "When trapped in the hanging iron cage, shoot the 3 glowing white eyes around your cage to break free." }
        ],
        steps: [
          "Shoot Rathil to trigger encounter; kill Scorn waves.",
          "Rathil teleports all 3 players into suspended iron cages in the air.",
          "Quickly look around outside your cage and shoot the 3 glowing talismans to drop.",
          "Stand inside the glowing totem circles to convert them from Dark (Orange) to Light (Blue).",
          "When Imminent Wish reaches 0, damage phase begins based on how many totems were converted."
        ],
        loot: {
          weapons: ["Indebted Kindness (Rocket Sidearm)", "Dragoncult Dagger (Strand Sword)"],
          armor: ["Helmet", "Gauntlets"]
        }
      },
      {
        name: "2. Locus of Wailing Grief",
        subtitle: "Blizzard of the Mountain",
        summary: "Slay Taken Blight Eyes, transfer fiery torches from Chieftains into braziers, and huddle around lit fires to survive the freezing blizzard during DPS.",
        image: "https://www.paracausality.com/assets/img/guides/WR/locus.webp",
        roles: [
          { role: "Blight Eye Shooters", description: "Destroy all floating Taken eyes spawned by the boss." },
          { role: "Torch Runners", description: "Kill Chieftains, collect Orange Flame buff, and ignite the 4 central braziers." }
        ],
        steps: [
          "Shoot floating Taken eyes around the perimeter.",
          "Kill Scorn Chieftains; pick up the glowing burning torch buff.",
          "Deposit torches into the 4 large braziers around the central circle.",
          "A freezing blizzard envelopes the mountain (Biting Cold x10 = death).",
          "Stand next to lit braziers to cleanse Biting Cold and DPS the boss as you move from fire to fire."
        ],
        dpsTips: "Dragons Breath + Fusion Rifles, Apex Predator, Edge Transit, Sunbracers / Celestial.",
        loot: {
          weapons: ["Naeem's Lance (Sniper)", "Indebted Kindness (Rocket Sidearm)"],
          armor: ["Chest Armor", "Leg Armor"]
        }
      },
      {
        name: "3. Hefnd's Vengeance, Blighted Chimerical",
        subtitle: "The Corrupted Ahamkara Bone",
        summary: "Ascend the 3 castle tower tiers, melee Scorn to pass Hex of the Vengeful Maiden before the timer expires, and destroy Taken Eyes on the peak.",
        image: "https://www.paracausality.com/assets/img/guides/WR/hefnd.webp",
        roles: [
          { role: "Hex Juggler", description: "When debuffed with 'Hex of the Vengeful Maiden' (15s timer), sprint to a Scorn melee add and punch them to transfer the death hex." },
          { role: "Totem Capturer", description: "Capture floating wish totems to extend DPS." },
          { role: "Peak Climbers", description: "Scale castle parapets to next platform tier." }
        ],
        steps: [
          "Damage Hefnd's eyes; capture Light totems.",
          "When Hex of the Vengeful Maiden appears on screen, immediately melee an enemy Scorn to transfer the hex (if you hold it when timer hits 0:00, you die).",
          "DPS Hefnd across Platform 1, Platform 2, and Platform 3.",
          "Ascend to the mountain peak floating platforms for Final Stand: shoot 3 floating eyes, jump between floating rocks, and dump all heavy ammo."
        ],
        dpsTips: "Dragons Breath, Apex Predator, Grand Overture, Still Hunt + Golden Gun, Well of Radiance.",
        loot: {
          weapons: ["Buried Bloodline (Exotic)", "All Warlord's Ruin Weapons"],
          armor: ["Class Item", "All Armor Pieces"]
        }
      }
    ]
  },
  {
    id: "god",
    name: "Ghosts of the Deep",
    tagline: "Drown in the deep, or rise from it. Slay the Lucent Hive resurrecting Oryx on Titan.",
    location: "Titan (Arcology Methane Ocean)",
    bannerImage: "https://www.paracausality.com/assets/img/guides/GOD/god_overlay.webp",
    lootTableImage: "https://www.paracausality.com/assets/img/guides/GOD/Ghost-of-the-Deep-loot-table-infographic.webp",
    exotic: { name: "The Navigator", type: "Trace Rifle (Strand Exotic Grapple Anchor)" },
    secretChests: [
      {
        title: "Secret Chest #1 (Underwater Methane Rig)",
        location: "Deep sea trench after Encounter 1",
        image: "https://www.paracausality.com/assets/img/guides/GOD/2023_Ghost_of_the_Deep_Press_Kit_Dungeon_COMPRESSED_008.webp",
        guide: "While diving down through the methane seabed, look for a side air-lock hatch built into the sunken sub-station wall."
      },
      {
        title: "Secret Chest #2 (Pre-Boss Coral Caves)",
        location: "High coral ledge before Şimmumah",
        image: "https://www.paracausality.com/assets/img/guides/GOD/2023_Ghost_of_the_Deep_Press_Kit_Dungeon_COMPRESSED_021.webp",
        guide: "During the coral cavern ascent preceding the final arena, double jump onto the high bioluminescent mushroom ledge."
      }
    ],
    encounters: [
      {
        name: "1. Hive Ritual Disruption",
        subtitle: "Methane Trench Run",
        summary: "Ride sparrows through the Arcology, kill Lucent Hive Lightbearers, crush their ghosts with Vestige of Light, and deposit symbols at the hive altar.",
        image: "https://www.paracausality.com/assets/img/guides/GOD/2023_Ghost_of_the_Deep_Press_Kit_Dungeon_COMPRESSED_002.webp",
        roles: [
          { role: "Symbol Runner", description: "Kill Lightbearer Wizard/Knight, crush ghost to gain Vestige of Light, slam at matching symbol totem." }
        ],
        steps: [
          "Follow green Hive ritual trails across the rig.",
          "Kill marked Hive Lightbearer, finish its Ghost to gain Vestige of Light (60s timer).",
          "Read rune on screen; find the matching underwater Hive rune statue and slam buff.",
          "Repeat 4 times to unlock the oceanic diving descent."
        ],
        loot: {
          weapons: ["Cold Comfort (Rocket)", "No Survivors (SMG)"],
          armor: ["Helmet", "Leg Armor"]
        }
      },
      {
        name: "2. Ecthar, Shield of Savathûn",
        subtitle: "The Submerged Behemoth",
        summary: "Dive into underwater methane chambers to collect 3 Hive runes, surface to kill Lucent Wizards, crush their ghosts to drop Ecthar's shield, and burst him.",
        image: "https://www.paracausality.com/assets/img/guides/GOD/Ecthar.webp",
        roles: [
          { role: "Methane Diver", description: "Dive underwater, collect oxygen bubbles, and interact with 3 matching wall runes." },
          { role: "Surface Add Clear", description: "Kill Knights and Ogres to spawn oxygen and Wizard acolytes." }
        ],
        steps: [
          "Kill 3 Lucent Knights on surface to activate diving hatch.",
          "Diver swims underwater, reads the 3 active Hive runes on room walls, and interacts with them.",
          "Surface: 3 Lucent Wizards spawn. Kill all 3 and finish their ghosts with finisher.",
          "Well of Radiance in center: Ecthar's massive white shield shatters. Burst boss in close quarters with swords or shotguns."
        ],
        dpsTips: "The Lament, Falling Guillotine, Bequest, Tractor Cannon + Legend of Acrius / Shotguns.",
        loot: {
          weapons: ["Cold Comfort (Rocket)", "Greasy Luck (Glaive)"],
          armor: ["Gauntlets", "Chest Armor"]
        }
      },
      {
        name: "3. Şimmumah ur-Nokru",
        subtitle: "Lucent Necromancer of Oryx",
        summary: "Connect Hive runes from Oryx's body parts (Head, Chest, Left/Right Arms, Knees), slay 3 Lucent Lightbearers, step in triangle ritual rings to drop shield, and DPS.",
        image: "https://www.paracausality.com/assets/img/guides/GOD/2023_Ghost_of_the_Deep_Press_Kit_Dungeon_COMPRESSED_025.webp",
        roles: [
          { role: "Rune Diver", description: "Dive underwater to read 3 active Hive symbols." },
          { role: "Lightbearer Slayers", description: "Kill marked Lightbearer at designated body part and crush ghost." },
          { role: "Ring Activator", description: "Stand in green circle that aligns with boss to break shield." }
        ],
        steps: [
          "Kill Lucent Knight to trigger Deepsight.",
          "Look at Oryx's body parts to reveal triangle rune links.",
          "Kill the 3 Lucent Lightbearers at matching body parts; finish ghosts to gain Vestige of Light.",
          "Deposit Vestige buffs into the 3 matching runes around Oryx's remains.",
          "Stand in green ritual pool that aligns with Şimmumah; fire Arbalest or burst weapons to strip her shield.",
          "DPS Şimmumah as she teleports across the arena."
        ],
        dpsTips: "Arbalest (instant shield break), Leviathan's Breath, Linear Fusion Rifles, Rockets with Tracking / Well.",
        loot: {
          weapons: ["The Navigator (Exotic)", "New Pacific Epitaph (Wave GL)", "All Dungeon Weapons"],
          armor: ["Class Item", "All Armor Pieces"]
        }
      }
    ]
  },
  {
    id: "sow",
    name: "Spire of the Watcher",
    tagline: "Machinations run wild in this dust-ridden Martian ruin. Bring them to heel.",
    location: "Mars (Seraph Complex)",
    bannerImage: "https://www.paracausality.com/assets/img/guides/SOW/sow_overlay.webp",
    lootTableImage: "https://www.paracausality.com/assets/img/guides/SOW/sow_drop_table.webp",
    exotic: { name: "Hierarchy of Needs", type: "Combat Bow (Solar Guidance Ring)" },
    secretChests: [
      {
        title: "Secret Chest #1 (Ascent Spire Vent)",
        location: "Climbing sequence between floors",
        image: "https://www.paracausality.com/assets/img/guides/SOW/sow_pillory2.webp",
        guide: "During the vertical climbing puzzle, jump inside the open vent shaft under the catwalk before the 2nd elevator lift."
      },
      {
        title: "Secret Chest #2 (Reactor Cooling Core)",
        location: "Behind pillar in the reactor maintenance bay",
        image: "https://www.paracausality.com/assets/img/guides/SOW/sow_persysnodes.webp",
        guide: "Before dropping into the Persys boss arena, check behind the large generator pillar on the right."
      }
    ],
    encounters: [
      {
        name: "1. Ascend the Spire",
        subtitle: "Arc Circuit Integration",
        summary: "Kill Arctrician Minotaurs to gain Arctrician buff, shoot wire nodes in sequential order to power elevators, and climb the tower exterior.",
        image: "https://www.paracausality.com/assets/img/guides/SOW/sow_entrance.webp",
        roles: [
          { role: "Node Shooters", description: "Kill Minotaur, follow yellow wire lines, shoot nodes within 30s." }
        ],
        steps: [
          "Kill Conduit Minotaur to obtain Arctrician buff (30s).",
          "Follow yellow wire cable from starting generator box to end terminal.",
          "Shoot all nodes along the line in sequence to activate elevator lift.",
          "Repeat across 3 vertical climbing tower stages."
        ],
        loot: {
          weapons: ["Terminus Horizon (LMG)", "Long Arm (Scout)"],
          armor: ["Helmet", "Gauntlets"]
        }
      },
      {
        name: "2. Akelous, Siren's Current",
        subtitle: "Harpy of the Spire",
        summary: "Charge 4 fuel rods across 4 catwalk wings, shoot Akelous's glowing eyes in a circle, and damage the center core as it retreats.",
        image: "https://www.paracausality.com/assets/img/guides/SOW/sow_pillory2.webp",
        roles: [
          { role: "Catwalk Runners (3x)", description: "Claim Arctrician, shoot all wire nodes on assigned wing out to fuel rod." }
        ],
        steps: [
          "Kill Minotaur, run down all 4 catwalks and shoot wire nodes to charge all 4 fuel rods.",
          "Akelous flies to the last completed rod; shoot all glowing red eye clusters around its chassis.",
          "Once all eyes pop, Akelous opens central critical core and slowly retreats backward down the catwalk.",
          "Walk forward in Well of Radiance dumping precision heavy damage."
        ],
        dpsTips: "Whisper of the Worm, Linear Fusion Rifles (Cataclysmic, Taipan), Still Hunt.",
        loot: {
          weapons: ["Terminus Horizon (LMG)", "Seventh Seraph Carbine"],
          armor: ["Chest Armor", "Leg Armor"]
        }
      },
      {
        name: "3. Persys, Primordial Ruin",
        subtitle: "The Reactive Wyvern",
        summary: "Trigger reactor lockdown by shooting 5 red open-door nodes, lure Persys inside the purge chamber, close the blast door, and blast during the reactor purge.",
        image: "https://www.paracausality.com/assets/img/guides/SOW/sow_persysnodes.webp",
        roles: [
          { role: "Reactor Room Team", description: "Shoot the 4 yellow wire chains to prime reactor." },
          { role: "Blast Door Operator", description: "Shoot the 5 red circuit nodes above pillar doors to lock Persys in." }
        ],
        steps: [
          "Shoot yellow wire cables in main room and reactor room to initiate purge cycle.",
          "When reactor alarm sounds, 5 red circuit nodes open above the heavy blast doors.",
          "Lure Persys inside the reactor chamber, shoot all 5 red nodes to seal the doors.",
          "Reactor purge blasts Persys, stripping his immune shield for 20 seconds.",
          "Blast doors reopen: drop Well and burst boss with rockets or heavy GLs."
        ],
        dpsTips: "Dragons Breath, Apex Predator, Edge Transit, Grand Overture, Nova Bomb.",
        loot: {
          weapons: ["Hierarchy of Needs (Exotic)", "Wilderflight (Double Fire GL)", "All Spire Weapons"],
          armor: ["Class Item", "All Armor Pieces (Cowboy Hats)"]
        }
      }
    ]
  },
  {
    id: "duality",
    name: "Duality",
    tagline: "Dive into the depths of the exiled Emperor Calus's mind in search of dark secrets.",
    location: "Derelict Leviathan (Mindscape)",
    bannerImage: "https://www.paracausality.com/assets/img/guides/Duality/duality_banner.webp",
    lootTableImage: "https://www.paracausality.com/assets/img/guides/Duality/Duality-dungeon-loot-table-Destiny-2-inforgraphic.webp",
    exotic: { name: "Heartshadow", type: "Sword (Void Invisibility Projectiles)" },
    secretChests: [
      {
        title: "Secret Chest #1 (Four Statues Chamber)",
        location: "Secret trapdoor behind the Cabal statues",
        image: "https://www.paracausality.com/assets/img/guides/Duality/2022_Season_17_Duality_Dungeon_Compressed_014.webp",
        guide: "Rotate the 4 Cabal warrior statues in the central chamber to match the puzzle configuration (facing inwards) to open the floor grate."
      },
      {
        title: "Secret Chest #2 (Leviathan Web Structure)",
        location: "Catwalk beam before Caiatl",
        image: "https://www.paracausality.com/assets/img/guides/Duality/585c285b-duality-dungeon-guide-11.webp",
        guide: "In the large purple crystal abyss before the Empress Caiatl fight, jump across the hanging beams along the right wall."
      }
    ],
    encounters: [
      {
        name: "1. Nightmare of Gahlran",
        subtitle: "Sorrow's Shadow",
        summary: "Ring Bells of Conquest to enter Nightmare Realm, collect 2 Standard Bearer symbols (War Beast, Chalice, Sun, Axes), slam at real-world banners, and kill Gahlran clones.",
        image: "https://www.paracausality.com/assets/img/guides/Duality/destiny-2-duality-dungeon-nightmare-of-gahlran-sorrow-bearer-colossus-side-room.webp",
        roles: [
          { role: "Standard Bearer Runners", description: "Enter Nightmare, kill marked Standard Bearers, pick up Standards, ring Bell to return." },
          { role: "Bell Keepers", description: "Kill Bellkeeper Incendiors to unlock Bells." }
        ],
        steps: [
          "Check which 2 Standard symbols are glowing on the wall (e.g. Dog + Axes).",
          "Stand near Bell and shoot it to enter the Nightmare Realm.",
          "Run into matching symbol rooms, kill Standard Bearers, pick up Standard buffs.",
          "Kill Bellkeepers to reopen Bell; stand near Bell and shoot to return to reality.",
          "Plant Standards to open side doors; kill Gahlran shades to trigger DPS."
        ],
        dpsTips: "The Lament, Falling Guillotine, Tractor Cannon + Fusion Rifles / Shotguns.",
        loot: {
          weapons: ["Lingering Dread (GL)", "Epicurean (Fusion)"],
          armor: ["Helmet", "Gauntlets"]
        }
      },
      {
        name: "2. Unlock the Vault",
        subtitle: "The Three Cabal Champions",
        summary: "Rotate between 3 vault statues in Nightmare Realm, gather all 6 standard symbols, and defeat the 3 mini-boss nightmares.",
        image: "https://www.paracausality.com/assets/img/guides/Duality/destiny-2-duality-dungeon-open-the-vault-symbols.webp",
        roles: [
          { role: "Standard Slayers", description: "Collect requested Standard symbols in Nightmare realm." }
        ],
        steps: [
          "Check glowing symbol on center floor.",
          "Ring bell to enter Nightmare, kill matching Standard Bearers, return to reality.",
          "Slam Standard to make mini-boss vulnerable; burst down boss.",
          "Repeat across all 3 vault faces."
        ],
        loot: {
          weapons: ["Stormchaser (3-Burst LFR)", "New Purpose (Pulse)"],
          armor: ["Chest Armor", "Leg Armor"]
        }
      },
      {
        name: "3. Nightmare of Princess Caiatl",
        subtitle: "The Empress Divided",
        summary: "Collect 4 Standard symbols, slam into pillars to spawn Bell chains, enter Nightmare Realm, intercept Caiatl before she reaches a Bell, and stun her with Bell resonance for DPS.",
        image: "https://www.paracausality.com/assets/img/guides/Duality/destiny-2-duality-caiatl-damage-phase.webp",
        roles: [
          { role: "Standard Runners (2x)", description: "Enter Nightmare, kill Standard Psions, collect symbols." },
          { role: "Bell Interceptor (1x)", description: "In Nightmare DPS phase, watch which of the 3 Bells Caiatl charges towards, kill Bellkeepers, and ring Bell when she approaches to stun." }
        ],
        steps: [
          "Collect all 4 Standard symbols in Nightmare and plant in real world.",
          "Shoot large chains to trigger damage phase; all 3 players get pulled into Nightmare Realm.",
          "Caiatl sprints toward Left, Mid, or Right Bell. Kill Bellkeepers immediately.",
          "Stand near Bell: when Caiatl gets close, shoot Bell to stun her and gain 'Wavelenght' 10s DPS buff.",
          "Repeat across 3 Bells to maximize damage."
        ],
        dpsTips: "LFRs (Taipan, Cataclysmic), Whisper of the Worm, Microcosm, Grand Overture, Well of Radiance.",
        loot: {
          weapons: ["Heartshadow (Exotic)", "Stormchaser", "All Duality Weapons"],
          armor: ["Class Item", "All Armor Pieces"]
        }
      }
    ]
  },
  {
    id: "goa",
    name: "Grasp of Avarice",
    tagline: "A cautionary tale for adventurers willing to trade their humanity for riches in the Cosmodrome.",
    location: "Cosmodrome (Loot Cave)",
    bannerImage: "https://www.paracausality.com/assets/img/guides/GOA/goa_banner.webp",
    lootTableImage: "https://www.paracausality.com/assets/img/guides/GOA/Grasp-of-Avarice-loot-table-Infographic-Destiny-2-v2.webp",
    exotic: { name: "Gjallarhorn", type: "Rocket Launcher (Solar Exotic Wolfpack Rounds)" },
    secretChests: [
      {
        title: "Secret Chest #1 (Trap Doors Corridor)",
        location: "Right tunnel alcove after the Loot Cave",
        image: "https://www.paracausality.com/assets/img/guides/GOA/destiny-2-grasp-of-avarice-flip-door-puzzle.webp",
        guide: "Avoid the pressure plate trap on the floor. Jump over the spike pit into the alcove on the right."
      },
      {
        title: "Secret Chest #2 (Sparrow Mine Race Skull)",
        location: "Inside the giant crystal eye socket",
        image: "https://www.paracausality.com/assets/img/guides/GOA/mike-poe-mpoe-spyglass-m.webp",
        guide: "During the Sparrow Mine defusal run, take the high launcher ramp into the left eye socket of the massive crystal skull before Mine D."
      }
    ],
    encounters: [
      {
        name: "1. Phry'zhia, the Insatiable",
        subtitle: "The Gluttonous Ogre",
        summary: "Collect Burden of Riches engrams from side bunker rooms, deposit into the center crystal to overload shield, and melt Phry'zhia.",
        image: "https://www.paracausality.com/assets/img/guides/GOA/destiny-2-grasp-of-avarice-phry-zhia-crystal.webp",
        roles: [
          { role: "Engram Collectors", description: "Kill Hive in side bunker, pick up Burden of Riches engrams (10-25)." },
          { role: "Crystal Banker", description: "Stand near white crystal in mid to bank engrams before timer reaches 0." }
        ],
        steps: [
          "Shoot Scorch Cannon Vandal, use Scorch Cannon to power the door generator.",
          "Enter side bunker, clear Thrall, pick up yellow glowing Burden of Riches engrams.",
          "Return to center white crystal: stand next to it to drain your Burden stacks.",
          "Bank 60 engrams total to strip Phry'zhia's immune shield.",
          "Drop Well of Radiance in center bunker and DPS."
        ],
        dpsTips: "Dragons Breath, Apex Predator, Whisper of the Worm, Linear Fusion Rifles.",
        loot: {
          weapons: ["Matador 64 (Shotgun)", "Hero of Ages (Sword)"],
          armor: ["Gauntlets", "Leg Armor"]
        }
      },
      {
        name: "2. Fallen Shield & Servitor Cannons",
        subtitle: "Island Man-Cannons",
        summary: "Overload island generators with Scorch Cannons, kill Servitors, roll servitor bomb cores into launch tubes, and destroy the central barrier shield.",
        image: "https://www.paracausality.com/assets/img/guides/GOA/destiny-2-grasp-of-avarice-servitor-shell-in-gravity-cannon.webp",
        roles: [
          { role: "Cannon Operator", description: "Use Scorch Cannon to charge numbered rotation motors." },
          { role: "Servitor Slayers", description: "Collect 20 engrams on each island, drain at crystal to strip Servitor shield, roll bomb into launch tube." }
        ],
        steps: [
          "Charge island launcher motors with fully charged Scorch Cannon shots (hold trigger until beep 3 times).",
          "Kill yellow-bar Servitor, roll bomb body into launcher, launch at center structure.",
          "Repeat across 4 island chains to overload the main shield."
        ],
        loot: {
          weapons: ["1000-Yard Stare (Sniper)", "Hero of Ages"],
          armor: ["Chest Armor", "Helmet"]
        }
      },
      {
        name: "3. Captain Avarokk, the Covetous",
        subtitle: "The Greedy Pirate",
        summary: "Collect Burden of Riches from the water and side sheds, deposit into the center treasure pod to trigger the gold shower, and burn Avarokk.",
        image: "https://www.paracausality.com/assets/img/guides/GOA/destiny-2-grasp-of-avarice-captain-avarokk-engrams.webp",
        roles: [
          { role: "Cannon / Motor Charger", description: "Shoot 3 overhead ceiling generators to drop engram caches." },
          { role: "Treasure Banker", description: "Collect Burden stacks (10-30), bank at center pod." }
        ],
        steps: [
          "Charge ceiling dispenser with Scorch Cannon; 3 engram showers drop on Left, Right, and Mid.",
          "Collect engrams while dodging boss sniper and Shank lasers.",
          "Stand near center golden crystal to bank 60 total engrams.",
          "Boss shield breaks: DPS from the water entrance or center pod.",
          "Watch out for barrel traps."
        ],
        dpsTips: "Linear Fusion Rifles, Grand Overture, Apex Predator with Gjallarhorn, Well of Radiance.",
        loot: {
          weapons: ["Gjallarhorn (Quest Exotic)", "Eyasluna (Hand Cannon)", "1000-Yard Stare"],
          armor: ["Class Item", "All Armor Pieces (Thorn Armor)"]
        }
      }
    ]
  },
  {
    id: "prophecy",
    name: "Prophecy",
    tagline: "Enter the realm of the Nine and ask the question: What is the nature of the Darkness?",
    location: "The Nine Realm (Unknown Space)",
    bannerImage: "https://www.paracausality.com/assets/img/guides/Prophecy/prophecy_banner.webp",
    lootTableImage: "https://www.paracausality.com/assets/img/guides/Prophecy/Destiny-2-Prophecy-Dungeon-Loot-Table-v3.webp",
    exotic: { name: "D2Foundry Weapons", type: "Curated High-Stat Endgame Armory" },
    secretChests: [
      {
        title: "Secret Chest #1 (Wasteland Sand Dunes)",
        location: "Ruined pyramid building in the sand sea",
        image: "https://www.paracausality.com/assets/img/guides/Prophecy/Destiny-2-Prophecy-Dugneon-Wasteland-Hidden-Chest.webp",
        guide: "In the open Wasteland area after Encounter 1, ride sparrows to the partially buried golden pyramid in the back corner."
      },
      {
        title: "Secret Chest #2 (Deadsea Ribbon Highway)",
        location: "Underneath the final diamond structure",
        image: "https://www.paracausality.com/assets/img/guides/Prophecy/Destiny-2-Prophecy-Dungeon-Hidden-Chest-2.webp",
        guide: "At the very end of the rainbow Ribbon Highway before Kell Echo, jump down into the bottom interior room of the floating polyhedron."
      }
    ],
    encounters: [
      {
        name: "1. Phalanx Echo",
        subtitle: "Light & Dark Mote Pillars",
        summary: "Stand in light or dark shadows while defeating Taken Knights to spawn Light (White) or Dark (Black) motes, slam into pillars to lower shield.",
        image: "https://www.paracausality.com/assets/img/guides/Prophecy/madison-parker-dungeon-prophecy-1.webp",
        roles: [
          { role: "Mote Slammer", description: "Stand in Light/Dark zones to generate matching motes, collect 5, jump onto pillar and slam." }
        ],
        steps: [
          "Stand in lighted area to make Knights drop White Light Motes (x5).",
          "Stand in shadowy area to make Knights drop Black Dark Motes (x5).",
          "Slam matching motes into the glowing smoke pillars (Light or Dark).",
          "Clear all 4 pillars to drop Phalanx Echo's shield and DPS."
        ],
        loot: {
          weapons: ["Prosecutor (Auto)", "Relentless (Pulse)"],
          armor: ["Helmet", "Gauntlets"]
        }
      },
      {
        name: "2. The Hexahedron",
        subtitle: "The Cube of the Nine",
        summary: "Rotate the giant room gravity by banking Light or Dark motes beneath the active Toland orb on the ceiling/walls until all 6 faces are cleansed.",
        image: "https://www.paracausality.com/assets/img/guides/Prophecy/Destiny-2-Prophecy-Dungeon-Hexahedron-Toland-Orb.webp",
        roles: [
          { role: "Cube Rotator", description: "Find floating gold Toland orb on ceiling/wall; bank matching motes directly below it to flip the room." },
          { role: "Hobgoblin Snipers", description: "Instantly snipe glowing snipers on high perches." }
        ],
        steps: [
          "Look for floating yellow Toland orb.",
          "Identify if the pillar directly below Toland requires Light or Dark motes.",
          "Kill Knights in appropriate light/shadow to collect 5 motes.",
          "Slam pillar, stand on center plate to flip the room gravity.",
          "Repeat across 6 sides; defeat 2 Centurion bosses on final floor."
        ],
        loot: {
          weapons: ["A Sudden Death (Shotgun)", "Adjudicator (SMG)"],
          armor: ["Chest Armor", "Leg Armor"]
        }
      },
      {
        name: "3. Kell Echo",
        subtitle: "The Mote Gauntlet & Ribbon Highway",
        summary: "Clear 3 corners of Light/Dark pillars in the arena, enter the dimensional tunnel, and chase Kell Echo down the long hallway while managing Dark Entropy.",
        image: "https://www.paracausality.com/assets/img/guides/Prophecy/madison-parker-dungeon-prophecy-19.webp",
        roles: [
          { role: "Pillar Cleansers", description: "Cleanse all 3 corner pillars in triangle room." },
          { role: "Hallway DPS", description: "Stay ahead of Dark Entropy x10 debuff, dodge teleport blasts, and DPS boss." }
        ],
        steps: [
          "Cleanse 3 pillars in triangle room to unlock central teleport pit.",
          "Drop down into hallway: Kell Echo teleports forward down the long path.",
          "Stay close to boss to prevent 'Dark Entropy' from reaching x10.",
          "Dodge slow-moving black teleportation orbs.",
          "Unload precision damage and rockets before boss teleports away at the end."
        ],
        dpsTips: "Dragons Breath, Apex Predator, Whisper of the Worm, Still Hunt + Nighthawk.",
        loot: {
          weapons: ["Judgement (Hand Cannon)", "Relentless", "Prosecutor", "All Prophecy Weapons"],
          armor: ["Class Item", "Moonfang-X7 Armor Set (Daito)"]
        }
      }
    ]
  },
  {
    id: "poh",
    name: "Pit of Heresy",
    tagline: "Deep beneath Sorrow's Harbor, the Hive keep their darkest rituals.",
    location: "Moon (Sorrow's Harbor)",
    bannerImage: "https://www.paracausality.com/assets/img/guides/POH/poh_banner.webp",
    lootTableImage: "https://www.paracausality.com/assets/img/guides/POH/How-to-unlock-the-Pit-of-Heresy-in-Destiny-2.webp",
    exotic: { name: "Xenophage (Quest)", type: "Machine Gun (Solar Explosive Heavy)" },
    secretChests: [
      {
        title: "Tunnels of Despair Map & Secret Chest",
        location: "Ogre cave network navigation",
        image: "https://www.paracausality.com/assets/img/guides/POH/pit-of-heresy-destiny-2-tunnels-of-despair-map-bloody-mando.webp",
        guide: "Use the cave network map to navigate past the invulnerable Hive Ogres and unlock the 3 stone doors to access the hidden chest."
      },
      {
        title: "The Harrow Map & Secret Chest",
        location: "Symbol chasms navigation",
        image: "https://www.paracausality.com/assets/img/guides/POH/pit-of-heresy-destiny-2-the-harrow-map-primo-pastafarian.webp",
        guide: "Follow the Harrow map to find the 3 glowing Hive symbols without falling into the spikes to reach the chest."
      }
    ],
    encounters: [
      {
        name: "1. The Necropolis",
        subtitle: "Hive Tower Sigils",
        summary: "Slay Hive Knights with Hive Cleaver Swords matching 3 symbol towers: Knight (Sword melee), Wizard (Sword projectile), Shrieker (Sword block reflect).",
        image: "https://www.paracausality.com/assets/img/guides/POH/pit-of-heresy-necropolis-the-broken-blade-miniboss-destiny-2.webp",
        roles: [
          { role: "Sword Duelist", description: "Kill Swordbearer Knight, take Hive Sword, defeat the 3 mini-bosses using matching sword attacks." }
        ],
        steps: [
          "Check 3 Hive runes hanging on chains in the starting chamber.",
          "Grapple/jump across the cliffside to the 3 matching tower towers.",
          "Use Hive Sword: Melee against Knight, Heavy Projectile against Wizard, Guard/Reflect against Shrieker turret.",
          "Defeat all 3 to open the Descent into the tunnels."
        ],
        loot: {
          weapons: ["Premonition (Pulse)", "Apostate (Sniper)"],
          armor: ["Helmet", "Gauntlets"]
        }
      },
      {
        name: "2. Chamber of Suffering",
        subtitle: "The Totem of Torment",
        summary: "Stand on the central Annihilator plate, kill Heretic Knights on upper balconies, collect Void Relic Orbs, and slam into the door 6 times.",
        image: "https://www.paracausality.com/assets/img/guides/POH/pit-of-heresy-chamber-of-suffering-destiny-2.webp",
        roles: [
          { role: "Plate Anchor", description: "Stay on center totem plate to prevent Annihilator wipe." },
          { role: "Orb Slammers (2x)", description: "Kill Heretic Knights, grab Void Orbs, slam into door." }
        ],
        steps: [
          "One player must stay on the center plate continuously.",
          "Kill Heretic Knights on Left and Right high ledges.",
          "Pick up dropped Void Orb and slam into the 6 receptacles on the main door.",
          "Defeat Boomer Knights with sniper/rocket fire immediately upon spawn.",
          "6 slams completes the encounter."
        ],
        loot: {
          weapons: ["Blasphemer (Slug Shotgun)", "Premonition"],
          armor: ["Chest Armor", "Leg Armor"]
        }
      },
      {
        name: "3. Zulmak, Instrument of Torment",
        subtitle: "The Eternal Flame",
        summary: "Collect Hive Sword, slay the 3 outer chamber bosses (Knight, Wizard, Shrieker), slam 3 Void Orbs into the center circle, and burst Zulmak.",
        image: "https://www.paracausality.com/assets/img/guides/POH/zulmak.webp",
        roles: [
          { role: "Sword Fighter", description: "Grab sword, clear the 3 outer side towers." },
          { role: "DPS Anchor", description: "Drop Well in center circle when shield drops." }
        ],
        steps: [
          "Kill Swordbearer; defeat outer Knight (melee), Wizard (projectile), Shrieker (reflect).",
          "Collect the 3 Void Orbs dropped by each outer boss; slam into center crystal.",
          "Zulmak's immune shield drops: stand inside the inner circle to damage boss.",
          "When Zulmak charges fiery sword slam, step outside the inner ring to avoid wipe blast.",
          "Repeat until Zulmak is defeated."
        ],
        dpsTips: "Grand Overture, Dragons Breath, Apex Predator with Gjallarhorn, Falling Guillotine.",
        loot: {
          weapons: ["Xenophage (Quest Step)", "Premonition", "High-Stat Masterworked Armor"],
          armor: ["Class Item", "All Dreambane Armor Pieces (Pinnacle Tier)"]
        }
      }
    ]
  }
];
