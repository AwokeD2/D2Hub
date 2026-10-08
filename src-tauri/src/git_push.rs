#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

#[cfg(target_os = "windows")]
use std::os::windows::process::CommandExt;

use std::io::{BufRead, BufReader};
use std::path::{Path, PathBuf};
use std::process::{Command, Stdio};
use std::sync::Mutex;
use std::thread;
use tauri::{Emitter, Manager, State};

const GITHUB_REPO: &str = "AwokeD2/D2Hub";
const PRIVATE_KEY: &str = "dW50cnVzdGVkIGNvbW1lbnQ6IHJzaWduIGVuY3J5cHRlZCBzZWNyZXQga2V5ClJXUlRZMEl5OU4xcEVhR0hBcGNyRkdUNUJLRHFhblJoMUkvWEZQUy9UUXEwTExOZE54c0FBQkFBQUFBQUFBQUFBQUlBQUFBQWRKMXdvUWFSV1d1Z2R4Y3RSelQvSVVZa3hScUhFYVppYXdLSnAvVUVMRU9iQlg1ZTVwM2gzblI5VzVvQVphblorOGpFNUFFNWdUcVJMUEkyOUNLSk9WWE5Pb3BSN3g1NThCMVlBSWRpbEdJUDFrVVpFYU1VcTdHbGFXNXhiT09vKzlLK0tWMU05eVU9Cg==";
const PRIVATE_KEY_PASS: &str = "667459zZ!";

struct PushAppState {
    active_child: Mutex<Option<u32>>,
    root_dir: PathBuf,
}

fn find_project_root() -> PathBuf {
    let mut dir = std::env::current_dir().unwrap_or_else(|_| PathBuf::from("."));
    for _ in 0..5 {
        if dir.join("package.json").exists() && dir.join("src-tauri").exists() {
            return dir;
        }
        if let Some(parent) = dir.parent() {
            dir = parent.to_path_buf();
        } else {
            break;
        }
    }
    if let Ok(exe) = std::env::current_exe() {
        let mut d = exe.parent().unwrap_or(Path::new(".")).to_path_buf();
        for _ in 0..5 {
            if d.join("package.json").exists() && d.join("src-tauri").exists() {
                return d;
            }
            if let Some(parent) = d.parent() {
                d = parent.to_path_buf();
            } else {
                break;
            }
        }
    }
    std::env::current_dir().unwrap_or_else(|_| PathBuf::from("."))
}

#[tauri::command]
fn is_git_push() -> bool {
    true
}

#[tauri::command]
fn get_status(state: State<'_, PushAppState>) -> Result<serde_json::Value, String> {
    let root = &state.root_dir;
    let pkg_path = root.join("package.json");
    let mut current = "1.0.4".to_string();
    if let Ok(content) = std::fs::read_to_string(&pkg_path) {
        if let Ok(json) = serde_json::from_str::<serde_json::Value>(&content) {
            if let Some(v) = json.get("version").and_then(|v| v.as_str()) {
                current = v.to_string();
            }
        }
    }

    let parts: Vec<u32> = current
        .split('.')
        .map(|s| s.parse::<u32>().unwrap_or(0))
        .collect();
    let (major, minor, patch) = (
        parts.get(0).copied().unwrap_or(1),
        parts.get(1).copied().unwrap_or(0),
        parts.get(2).copied().unwrap_or(0),
    );

    let next_patch = format!("{}.{}.{}", major, minor, patch + 1);
    let next_minor = format!("{}.{}.0", major, minor + 1);
    let next_major = format!("{}.0.0", major + 1);

    Ok(serde_json::json!({
        "current": current,
        "next": {
            "patch": next_patch,
            "minor": next_minor,
            "major": next_major
        },
        "repo": GITHUB_REPO
    }))
}

#[tauri::command]
fn start_publish(version: String, notes: String, app_handle: tauri::AppHandle, state: State<'_, PushAppState>) -> Result<(), String> {
    let root = state.root_dir.clone();
    let script_path = root.join("scripts").join("publish-release.mjs");
    if !script_path.exists() {
        let _ = app_handle.emit("build-log", format!("[ERROR] publish-release.mjs not found at {}", script_path.display()));
        return Err("publish-release.mjs not found".into());
    }

    let _ = app_handle.emit("build-log", format!("[INFO] Starting release build for v{}...", version));

    let mut cmd = Command::new("node");
    cmd.arg(&script_path)
        .arg(&version)
        .arg(&notes)
        .current_dir(&root)
        .env("TAURI_SIGNING_PRIVATE_KEY", PRIVATE_KEY)
        .env("TAURI_SIGNING_PRIVATE_KEY_PASSWORD", PRIVATE_KEY_PASS)
        .stdout(Stdio::piped())
        .stderr(Stdio::piped());

    #[cfg(target_os = "windows")]
    cmd.creation_flags(0x08000000); // CREATE_NO_WINDOW

    let mut child = cmd.spawn().map_err(|e| format!("Failed to spawn build process: {}", e))?;
    let pid = child.id();
    {
        let mut lock = state.active_child.lock().unwrap();
        *lock = Some(pid);
    }

    let stdout = child.stdout.take();
    let stderr = child.stderr.take();
    let app_h1 = app_handle.clone();
    let app_h2 = app_handle.clone();

    thread::spawn(move || {
        if let Some(out) = stdout {
            let reader = BufReader::new(out);
            for line in reader.lines() {
                if let Ok(l) = line {
                    let _ = app_h1.emit("build-log", l);
                }
            }
        }
    });

    thread::spawn(move || {
        if let Some(err) = stderr {
            let reader = BufReader::new(err);
            for line in reader.lines() {
                if let Ok(l) = line {
                    let _ = app_h2.emit("build-log", format!("[WARN] {}", l));
                }
            }
        }
    });

    let app_finish = app_handle.clone();
    thread::spawn(move || {
        let status = child.wait();
        match status {
            Ok(st) if st.success() => {
                let _ = app_finish.emit("build-log", format!("[SUCCESS] Release v{} successfully built, signed & published to GitHub!", version));
            }
            Ok(st) => {
                let _ = app_finish.emit("build-log", format!("[ERROR] Process exited with status code: {}", st));
            }
            Err(e) => {
                let _ = app_finish.emit("build-log", format!("[ERROR] Execution error: {}", e));
            }
        }
        let _ = app_finish.emit("build-finished", true);
    });

    Ok(())
}

#[tauri::command]
fn cancel_publish(state: State<'_, PushAppState>, app_handle: tauri::AppHandle) -> Result<(), String> {
    let mut lock = state.active_child.lock().unwrap();
    if let Some(pid) = *lock {
        let _ = Command::new("taskkill").args(["/F", "/T", "/PID", &pid.to_string()]).output();
        *lock = None;
        let _ = app_handle.emit("build-log", "[ERROR] Build aborted by user.".to_string());
        let _ = app_handle.emit("build-finished", true);
    }
    Ok(())
}

#[tauri::command]
fn open_url(url: String) -> Result<(), String> {
    let _ = opener::open(url);
    Ok(())
}

fn main() {
    let root = find_project_root();

    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .manage(PushAppState {
            active_child: Mutex::new(None),
            root_dir: root,
        })
        .invoke_handler(tauri::generate_handler![
            is_git_push,
            get_status,
            start_publish,
            cancel_publish,
            open_url
        ])
        .setup(|app| {
            if let Some(window) = app.get_webview_window("main") {
                let _ = window.set_title("D2 Hub // GIT-PUSH & Release Suite");
                let _ = window.set_decorations(true);
                let _ = window.set_size(tauri::Size::Logical(tauri::LogicalSize { width: 980.0, height: 740.0 }));
                let _ = window.set_min_size(Some(tauri::Size::Logical(tauri::LogicalSize { width: 840.0, height: 600.0 })));
                let _ = window.center();
                let _ = window.eval("window.location.hash = '#publisher';");
                let _ = window.show();
                let _ = window.set_focus();
            }
            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running D2 Hub GIT-PUSH");
}
