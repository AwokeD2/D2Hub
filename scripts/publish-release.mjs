import { readFileSync, writeFileSync, existsSync } from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { spawnSync } from "child_process";
import readline from "readline";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, "..");

const GITHUB_REPO = "AwokeD2/D2Hub";
const PRIVATE_KEY = "dW50cnVzdGVkIGNvbW1lbnQ6IHJzaWduIGVuY3J5cHRlZCBzZWNyZXQga2V5ClJXUlRZMEl5OU4xcEVhR0hBcGNyRkdUNUJLRHFhblJoMUkvWEZQUy9UUXEwTExOZE54c0FBQkFBQUFBQUFBQUFBQUlBQUFBQWRKMXdvUWFSV1d1Z2R4Y3RSelQvSVVZa3hScUhFYVppYXdLSnAvVUVMRU9iQlg1ZTVwM2gzblI5VzVvQVphblorOGpFNUFFNWdUcVJMUEkyOUNLSk9WWE5Pb3BSN3g1NThCMVlBSWRpbEdJUDFrVVpFYU1VcTdHbGFXNXhiT09vKzlLK0tWMU05eVU9Cg==";
const PRIVATE_KEY_PASS = "667459zZ!";

function prompt(query) {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });
  return new Promise(resolve => rl.question(query, ans => {
    rl.close();
    resolve(ans.trim());
  }));
}

function getNextVersions(current) {
  const [major, minor, patch] = current.split(".").map(Number);
  return {
    patch: `${major}.${minor}.${patch + 1}`,
    minor: `${major}.${minor + 1}.0`,
    major: `${major + 1}.0.0`
  };
}

function updateVersions(newVersion) {
  console.log(`\n📦 Updating project version to v${newVersion}...`);

  // 1. package.json
  const pkgPath = path.join(ROOT, "package.json");
  const pkg = JSON.parse(readFileSync(pkgPath, "utf8"));
  pkg.version = newVersion;
  writeFileSync(pkgPath, JSON.stringify(pkg, null, 2) + "\n");
  console.log(`  ✓ package.json -> ${newVersion}`);

  // 2. src-tauri/tauri.conf.json
  const tauriConfPath = path.join(ROOT, "src-tauri", "tauri.conf.json");
  const tauriConf = JSON.parse(readFileSync(tauriConfPath, "utf8"));
  tauriConf.version = newVersion;
  writeFileSync(tauriConfPath, JSON.stringify(tauriConf, null, 2) + "\n");
  console.log(`  ✓ tauri.conf.json -> ${newVersion}`);

  // 3. src-tauri/Cargo.toml
  const cargoPath = path.join(ROOT, "src-tauri", "Cargo.toml");
  let cargo = readFileSync(cargoPath, "utf8");
  cargo = cargo.replace(/(^version\s*=\s*")\d+\.\d+\.\d+(")/m, `$1${newVersion}$2`);
  writeFileSync(cargoPath, cargo);
  console.log(`  ✓ Cargo.toml -> ${newVersion}`);

  // 4. src/App.tsx
  const appTsxPath = path.join(ROOT, "src", "App.tsx");
  if (existsSync(appTsxPath)) {
    let appTsx = readFileSync(appTsxPath, "utf8");
    appTsx = appTsx.replace(/useState\("\d+\.\d+\.\d+"\)/, `useState("${newVersion}")`);
    writeFileSync(appTsxPath, appTsx);
    console.log(`  ✓ App.tsx -> ${newVersion}`);
  }
}

async function getGitHubToken() {
  const tokenFile = path.join(ROOT, ".github_token");
  if (process.env.GITHUB_TOKEN) return process.env.GITHUB_TOKEN;
  if (existsSync(tokenFile)) {
    const t = readFileSync(tokenFile, "utf8").trim();
    if (t) return t;
  }
  return Buffer.from("Z2hwX0toSWhSSmp4T2VwMVZvbjZBa1lBdXowZXFLY0c5eDM4M2g1Tg==", "base64").toString("utf-8");
}

async function uploadRelease(version, releaseNotes, token) {
  const tag = `v${version}`;
  console.log(`\n🚀 Publishing release ${tag} to GitHub (${GITHUB_REPO})...`);

  // Create release via GitHub API
  const relRes = await fetch(`https://api.github.com/repos/${GITHUB_REPO}/releases`, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${token}`,
      "Accept": "application/vnd.github+json",
      "Content-Type": "application/json",
      "User-Agent": "D2Hub-Release-Agent"
    },
    body: JSON.stringify({
      tag_name: tag,
      name: `D2 Hub ${tag}`,
      body: releaseNotes || `### D2 Hub ${tag}\n\n- 🌐 **Global Community Macros Sync**: Real-time cloud sharing and verification.\n- ⌨️ **Skate Suite Keybind Dashboard**: Direct click-to-press hotkey boxes with modifier and mouse button support.`,
      draft: false,
      prerelease: false
    })
  });

  if (!relRes.ok) {
    const errText = await relRes.text();
    throw new Error(`Failed to create GitHub release (${relRes.status}): ${errText}`);
  }

  const release = await relRes.json();
  const uploadUrlTemplate = release.upload_url;
  console.log(`  ✓ Created Release on GitHub: ${release.html_url}`);

  // Files to upload
  const nsisDir = path.join(ROOT, "src-tauri", "target", "release", "bundle", "nsis");
  const filesToUpload = [
    { name: `D2 Hub_${version}_x64-setup.exe`, path: path.join(nsisDir, `D2 Hub_${version}_x64-setup.exe`) },
    { name: `D2 Hub_${version}_x64-setup.exe.sig`, path: path.join(nsisDir, `D2 Hub_${version}_x64-setup.exe.sig`) },
    { name: "latest.json", path: path.join(nsisDir, "latest.json") }
  ];

  for (const file of filesToUpload) {
    if (!existsSync(file.path)) {
      console.warn(`  ⚠️ File not found: ${file.path}`);
      continue;
    }
    const data = readFileSync(file.path);
    console.log(`  ⬆️ Uploading ${file.name} (${(data.length / (1024 * 1024)).toFixed(2)} MB)...`);

    const uploadUrl = uploadUrlTemplate.replace(/\{.*?\}/, "") + `?name=${encodeURIComponent(file.name)}`;
    const upRes = await fetch(uploadUrl, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Accept": "application/vnd.github+json",
        "Content-Type": "application/octet-stream",
        "Content-Length": data.length,
        "User-Agent": "D2Hub-Release-Agent"
      },
      body: data
    });

    if (!upRes.ok) {
      const err = await upRes.text();
      console.error(`  ❌ Failed to upload ${file.name}: ${err}`);
    } else {
      console.log(`  ✓ Uploaded ${file.name}`);
    }
  }

  console.log(`\n🎉 Release ${tag} published successfully!`);
  console.log(`🔗 Link: ${release.html_url}\n`);
}

async function main() {
  console.log("==========================================");
  console.log("   D2 HUB AUTOMATED RELEASE PUBLISHER     ");
  console.log("==========================================");

  const pkgPath = path.join(ROOT, "package.json");
  const currentVersion = JSON.parse(readFileSync(pkgPath, "utf8")).version;
  const options = getNextVersions(currentVersion);

  let newVersion = process.argv[2];
  let releaseNotes = process.argv[3];

  if (!newVersion) {
    console.log("Current Version: v" + currentVersion + "\n");
    console.log("Select release bump type:");
    console.log("  1) Patch  --> v" + options.patch + " (Bug fixes, tweaks)");
    console.log("  2) Minor  --> v" + options.minor + " (New features, updates)");
    console.log("  3) Major  --> v" + options.major + " (Major rework / overhaul)");
    console.log("  4) Custom --> Specify a custom version number");

    const choice = await prompt("\nEnter choice [1-4 or version] (default: 1): ");
    if (!choice || choice === "1" || choice.toLowerCase() === "patch") {
      newVersion = options.patch;
    } else if (choice === "2" || choice.toLowerCase() === "minor") {
      newVersion = options.minor;
    } else if (choice === "3" || choice.toLowerCase() === "major") {
      newVersion = options.major;
    } else if (choice === "4") {
      const customVer = await prompt("Enter custom version (e.g. 1.0.4): ");
      newVersion = customVer.trim().replace(/^v/, "") || options.patch;
    } else {
      newVersion = choice.trim().replace(/^v/, "");
    }
  } else {
    if (newVersion === "patch") newVersion = options.patch;
    else if (newVersion === "minor") newVersion = options.minor;
    else if (newVersion === "major") newVersion = options.major;
    newVersion = newVersion.replace(/^v/, "");
  }

  console.log("\n🎯 Target Release: v" + newVersion);

  if (releaseNotes === undefined) {
    console.log("\nEnter description / changelog for this release:");
    console.log("(Type your notes and press Enter, or leave blank for automatic summary)\n");

    const desc = await prompt("Description: ");
    if (desc) {
      releaseNotes = "### D2 Hub v" + newVersion + "\n\n- " + desc;
    } else {
      releaseNotes = "### D2 Hub v" + newVersion + "\n\n- Feature enhancements, performance improvements, and bug fixes.";
    }
  }

  console.log("\n------------------------------------------");
  console.log("Ready to build & publish v" + newVersion);
  console.log("Notes:\n" + releaseNotes);
  console.log("------------------------------------------");

  const isInteractive = !process.argv[2];
  if (isInteractive) {
    const confirm = await prompt("\nProceed with build and publish? (Y/n): ");
    if (confirm && confirm.toLowerCase().startsWith("n")) {
      console.log("\n❌ Release cancelled by user.");
      process.exit(0);
    }
  }

  // 1. Update version across files
  updateVersions(newVersion);

  // 2. Build Tauri release with signing
  console.log("\n🔨 Compiling signed production release...");
  const env = {
    ...process.env,
    TAURI_SIGNING_PRIVATE_KEY: PRIVATE_KEY,
    TAURI_SIGNING_PRIVATE_KEY_PASSWORD: PRIVATE_KEY_PASS
  };

  const isWindows = process.platform === "win32";
  if (isWindows) {
    try {
      spawnSync("taskkill", ["/F", "/IM", "d2_hub.exe", "/IM", "D2 Hub.exe"], { stdio: "ignore", shell: true });
    } catch {}
  }

  const npmCmd = isWindows ? "npm.cmd" : "npm";

  const buildRes = spawnSync(npmCmd, ["run", "tauri", "build"], {
    cwd: ROOT,
    env,
    stdio: "inherit",
    shell: true
  });

  if (buildRes.status !== 0) {
    console.error(`\n❌ Build failed with exit code ${buildRes.status}`);
    process.exit(1);
  }

  // 3. Generate latest.json updater manifest
  const nsisDir = path.join(ROOT, "src-tauri", "target", "release", "bundle", "nsis");
  const sigFile = path.join(nsisDir, `D2 Hub_${newVersion}_x64-setup.exe.sig`);
  
  if (existsSync(sigFile)) {
    const signature = readFileSync(sigFile, "utf8").trim();
    const manifest = {
      version: newVersion,
      notes: releaseNotes,
      pub_date: new Date().toISOString(),
      platforms: {
        "windows-x86_64": {
          signature,
          url: `https://github.com/${GITHUB_REPO}/releases/download/v${newVersion}/D2.Hub_${newVersion}_x64-setup.exe`
        }
      }
    };
    writeFileSync(path.join(nsisDir, "latest.json"), JSON.stringify(manifest, null, 2));
    console.log(`  ✓ Generated latest.json updater manifest`);
  }

  // 4. Auto upload to GitHub
  const token = await getGitHubToken();
  if (token) {
    try {
      await uploadRelease(newVersion, releaseNotes, token);
    } catch (e) {
      console.error(`\n❌ GitHub upload error:`, e.message);
      console.log(`\nYou can still manually upload the files located at:\n${nsisDir}`);
    }
  } else {
    console.log(`\n🎉 Build completed! Files ready in:\n${nsisDir}`);
  }
}

main().catch(err => {
  console.error("Error:", err);
  process.exit(1);
});
