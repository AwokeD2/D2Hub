# D2 Hub - Post-Format Quick Setup Guide

This backup contains the entire source code, assets, scripts, data, and configurations for **D2 Hub**, excluding large build caches (`src-tauri/target` and `node_modules`) to keep the backup lightweight and fast to transfer.

---

## 🛠️ Step 1: Install Required Tools on Fresh Windows

Before running the project on a freshly formatted PC, ensure you install:

1. **Node.js** (v20+ recommended or LTS):
   - Download & Install from [nodejs.org](https://nodejs.org)
   - (Optional) Enable PNPM if preferred: `corepack enable` or `npm install -g pnpm`

2. **Rust & Cargo** (for Tauri backend):
   - Download & run `rustup-init.exe` from [rustup.rs](https://rustup.rs)
   - Choose default installation (option 1).

3. **C++ Build Tools** (Required by Rust/Tauri on Windows):
   - Install **Visual Studio 2022 Community** or **Visual Studio Build Tools**:
   - Check the **"Desktop development with C++"** workload during installation.

4. **Git** (Optional, for version control):
   - Download from [git-scm.com](https://git-scm.com)

---

## 🚀 Step 2: Restore & Run the Project

You can either double-click **`setup.bat`** or run the commands manually in a terminal:

### Quick Method:
Double-click `setup.bat` in this folder.

### Manual Method (Terminal inside this folder):
```bash
# 1. Install frontend dependencies
npm install
# (or if using pnpm: pnpm install)

# 2. Run the frontend only (for UI dev)
npm run dev

# 3. Run the full desktop app in development mode
npm run tauri dev

# 4. Build a release binary
npm run build:release
```

---

## 📂 Project Structure Overview
- `src/` — React frontend application
- `src-tauri/` — Rust Tauri backend & configuration
- `data/` — Game weapon definitions & data
- `scripts/` — Build and release automation scripts
- `public/` & `icons/` — Static assets and app icons
