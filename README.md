<div align="center">

# 🌌 D2 Hub

### The Ultimate Destiny 2 Endgame Companion & Live Overlay

[![Release](https://img.shields.io/github/v/release/AwokeD2/D2Hub?style=for-the-badge&color=06b6d4&label=Latest%20Release)](https://github.com/AwokeD2/D2Hub/releases/latest)
[![Platform](https://img.shields.io/badge/Platform-Windows%2010%20%2F%2011-blue?style=for-the-badge&logo=windows)](https://github.com/AwokeD2/D2Hub/releases/latest)
[![Tauri v2](https://img.shields.io/badge/Built%20With-Tauri%20v2-24C8DB?style=for-the-badge&logo=tauri)](https://tauri.app/)
[![React 19](https://img.shields.io/badge/Frontend-React%2019-61DAFB?style=for-the-badge&logo=react)](https://react.dev/)
[![Author](https://img.shields.io/badge/Author-Awoke-f59e0b?style=for-the-badge)](https://github.com/AwokeD2)

<p align="center">
  <b>D2 Hub</b> is a lightweight, all-in-one companion app for Destiny 2 players. Featuring an on-screen HUD overlay with live OCR weapon detection, exact PvE/PvP Godrolls from <b>D2 Reference List</b> and <b>Light.gg</b>, instant hardware loadout swapping, AutoHotkey macro management, multi-account DIM integration, and bulk code redeeming.
</p>

---

[📥 Download Latest Installer](https://github.com/AwokeD2/D2Hub/releases/latest) • [✨ Key Features](#-features) • [⌨️ Hotkeys](#️-default-hotkeys) • [🛠️ Building from Source](#️-building-from-source)

</div>

---

## ✨ Features

### 🎯 Live In-Game Weapon & Perk Overlay
- **Optical Character Recognition (OCR)** — Hover over or inspect any weapon in Destiny 2 to automatically identify it and display its stats, damage profiles, and Godrolls on a transparent on-screen HUD.
- **Multiple Curated & Live Data Sources**:
  - 🏆 **D2 Reference List (Default for PvE)**: Live synchronization with `d2referencelist.org` (749 endgame weapons) displaying curated godrolls, tier badges (`S-TIER`, `A-TIER`), and endgame analysis verdicts.
  - 📊 **Light.gg (Popularity & Godrolls)**: Live popularity usage percentages, Gold curator masterwork perks, PvE recommendations (Blue diamonds), and PvP recommendations (Red diamonds).
  - ⚔️ **D2TTK (PvP Mathematical)**: Sub-tick optimal TTK calculations, body TTK, resilience thresholds, and damage profile curves.
  - 👥 **Godroll.tv (Community)**: Decoded community favorite rolls.
- **Customizable Multi-Panel HUD**: Separate floating stats and perk recommendation panels with adjustable opacity and auto-snap.

---

### ⚡ Native Loadout Swapper (No AHK Required)
- Calibrate up to **20 loadout slots** across your Guardian's in-game inventory.
- High-precision **50ms hardware scancode emulation** via native Windows `SendInput` ensures 100% reliable execution even under intense frame drops.
- Quick single-key hotkey binding (supports alphanumeric, function keys, numpads, and menu keys).

---

### 📜 AutoHotkey Macro Manager
- Write, edit, and organize `.ahk` scripts inside an integrated code editor.
- Global execution hotkeys, active process tracking, and auto-backup versioning on save.
- Quick show/hide hotkey to toggle the macro dashboard.

---

### 🌐 Embedded Destiny 2 Web App Hub
- Embedded native browser panels with isolated cookies, persistent logins, and multi-account support:
  - 🛡️ **Destiny Item Manager (DIM)**
  - 📋 **D2 Reference List**
  - 💡 **Light.gg**
  - 🎯 **D2TTK**
  - 🥋 **D2ArmorPicker & Canary D2ArmorPicker**
  - 🏁 **D2Checkpoint**
  - ➕ **Custom Websites**: Add, edit, and locally persist any website.

---

### 🚀 Bungie.net Bulk Code Redeemer
- One-click bulk redemption for Destiny 2 emblem, shader, and grimoire codes directly through Bungie.net.
- Live progress tracking, batch history, and automatic retry queues.

---

### 🗔 System Tray & Clean Desktop Integration
- Hides inside the Windows **System Tray (`^`)** when closed or minimized without cluttering your taskbar.
- Native tray context menu to quickly toggle HUD overlays, show the main dashboard, or exit.
- Built-in **Auto-Updater** that silently checks and applies updates with a single click.

---

## ⌨️ Default Hotkeys

| Hotkey | Action | Description |
|---|---|---|
| `Alt + X` | **Toggle Overlay** | Show / Hide the on-screen weapon HUD |
| `Alt + Z` | **Show / Hide D2 Hub** | Quick-toggle the main companion window |
| `F9` | **Quick Detect** | Trigger a single OCR weapon scan |
| `Alt + C` | **Calibrate Region** | Recalibrate the weapon inspect screen capture box |

*All hotkeys can be customized or rebound in the Settings modal.*

---

## 📥 Installation

1. Go to the **[Latest Release](https://github.com/AwokeD2/D2Hub/releases/latest)** page.
2. Download **`D2 Hub_x.x.x_x64-setup.exe`**.
3. Run the installer and launch **D2 Hub**.

### Requirements
- **OS**: Windows 10 / 11 (64-bit)
- **WebView2 Runtime**: (Pre-installed on modern Windows 10 & 11)
- **AutoHotkey v1.1**: *(Optional, only required if using the Macros tab)*

---

## 🛠️ Building from Source

```bash
# 1. Clone repository
git clone https://github.com/AwokeD2/D2Hub.git
cd D2Hub

# 2. Install dependencies
npm install

# 3. Start development server
npm run dev

# 4. Start Tauri desktop app in development
npm run tauri dev
```

### 📦 1-Click Release & Auto-Updater Publishing

To build a signed release package and automatically upload it to GitHub:

```powershell
# Interactive version selection (Patch / Minor / Major)
npm run release

# Or run directly via batch file:
./release.bat
```

---

## 🔒 Privacy & Security

- **100% Local & Open Source**: All settings, macros, and profile credentials are saved locally on your machine (`localStorage` and local config files).
- **No Telemetry**: No user data or account tokens are tracked or sent to external servers.

---

## 🌟 Credits & Acknowledgements

- **Created by [Awoke](https://github.com/AwokeD2)**
- Built with [Tauri v2](https://tauri.app/) & [React](https://react.dev/)
- Weapon metadata & math powered by [D2TTK](https://d2ttk.com), [D2 Reference List](https://d2referencelist.org), and [Light.gg](https://www.light.gg)
- DIM integration powered by [Destiny Item Manager](https://destinyitemmanager.com)

---

<div align="center">
  <sub>Made with ❤️ for the Destiny 2 Community by <b>Awoke</b></sub>
</div>
