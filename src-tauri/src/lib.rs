mod commands;
mod overlay;
mod loadout;

use commands::{
    list_macros, run_macro, get_running_macros, stop_macro, save_bindings, load_bindings, open_macros_folder, open_app_folder,
    read_macro_content, save_macro_content, delete_macro, register_hotkeys, start_file_watcher,
    HotkeyState, ensure_web_panel, set_web_panel_bounds, show_web_panel, hide_web_panel,
    close_web_panel, delete_profile, continue_signin, start_calibration_overlay, report_calibration_click,
    report_calibration_rect, cancel_calibration, redeem_codes, stop_redeem, RedeemState, open_url,
    set_web_panel_zoom, export_dim_login, import_dim_login, uninstall_app,
};
use overlay::{
    get_weapon_db, get_community_godroll, get_lightgg_godroll, get_d2reflist_db, show_overlay_panels, hide_overlay,
    reset_overlay_layout, set_overlay_opacity, get_overlay_data, set_overlay_hotkey,
    set_calibrate_hotkey, disable_all_hotkeys, set_overlay_settings, ocr_test_capture,
    start_weapon_detection, stop_weapon_detection, set_dim_search_hotkey, detect_once, set_detect_hotkey,
    set_app_hotkey, quit_app, toggle_verity_overlay, set_verity_hotkey,
    WeaponDbState, DetectionState,
    OverlayDataState, OverlayHotkeyState, CalibrateHotkeyState, OverlaySettingsState, DimSearchHotkeyState,
    DetectHotkeyState, AppHotkeyState, VerityHotkeyState,
};
use std::sync::Mutex;
use tauri::Manager;

#[cfg(target_os = "windows")]
pub fn trim_memory() {
    unsafe {
        use windows::Win32::System::Threading::{GetCurrentProcess, SetProcessWorkingSetSize};
        let _ = SetProcessWorkingSetSize(GetCurrentProcess(), usize::MAX, usize::MAX);
    }
}

#[cfg(not(target_os = "windows"))]
pub fn trim_memory() {}

pub fn restore_main_window(app: &tauri::AppHandle) {
    if let Some(win) = app.get_window("main") {
        let _ = win.unminimize();
        let _ = win.show();
        let _ = win.set_focus();
        #[cfg(target_os = "windows")]
        if let Ok(hwnd) = win.hwnd() {
            unsafe {
                use windows::Win32::Foundation::HWND;
                use windows::Win32::UI::WindowsAndMessaging::{
                    ShowWindow, SetForegroundWindow, BringWindowToTop, SetWindowPos,
                    HWND_TOPMOST, HWND_NOTOPMOST, SWP_NOMOVE, SWP_NOSIZE, SW_RESTORE, SW_SHOW,
                };
                let h = HWND(hwnd.0);
                let _ = ShowWindow(h, SW_RESTORE);
                let _ = ShowWindow(h, SW_SHOW);
                let _ = BringWindowToTop(h);
                let _ = SetWindowPos(h, Some(HWND_TOPMOST), 0, 0, 0, 0, SWP_NOMOVE | SWP_NOSIZE);
                let _ = SetWindowPos(h, Some(HWND_NOTOPMOST), 0, 0, 0, 0, SWP_NOMOVE | SWP_NOSIZE);
                let _ = SetForegroundWindow(h);
            }
        }
    }
}

static LAST_TRAY_CLICK: std::sync::atomic::AtomicU64 = std::sync::atomic::AtomicU64::new(0);

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    // Prevent WebView2 "Out of Memory" crashes on heavy web apps (like DIM with Destiny 2 manifest)
    // 1. Expand V8 JS heap limit to 4GB (--js-flags=--max-old-space-size=4096)
    // 2. Cap helper renderer processes to 4 to prevent RAM explosion across multiple tabs
    // 3. Disable occlusion tracking so background webviews are not aggressively discarded
    std::env::set_var(
        "WEBVIEW2_ADDITIONAL_BROWSER_ARGUMENTS",
        "--js-flags=--max-old-space-size=4096 --disable-features=TranslateUI,MediaRouter,CalculateNativeWinOcclusion --renderer-process-limit=4",
    );

    if let Ok(exe) = std::env::current_exe() {
        if let Some(dir) = exe.parent() {
            let _ = std::fs::create_dir_all(dir.join("macros"));
        }
    }

    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .plugin(tauri_plugin_updater::Builder::new().build())
        .plugin(tauri_plugin_global_shortcut::Builder::new().build())
        .plugin(tauri_plugin_process::init())
        .manage(Mutex::new(HotkeyState { ids: Vec::new() }))
        .manage(WeaponDbState { weapons: Mutex::new(Vec::new()) })
        .manage(DetectionState { running: Mutex::new(None) })
        .manage(OverlayDataState::default())
        .manage(OverlayHotkeyState::default())
        .manage(CalibrateHotkeyState::default())
        .manage(OverlaySettingsState::default())
        .manage(RedeemState::default())
        .manage(DimSearchHotkeyState::default())
        .manage(DetectHotkeyState::default())
        .manage(AppHotkeyState::default())
        .manage(VerityHotkeyState::default())
        .setup(|app| {
            start_file_watcher(app.handle().clone());

            // Automatically load and register all saved loadout and macro hotkeys on startup
            if let Ok(bindings) = commands::load_bindings() {
                if !bindings.is_empty() {
                    let _ = commands::register_hotkeys(app.handle().clone(), bindings);
                }
            }

            // Build system tray icon to hide inside the ^ on the taskbar
            use tauri::menu::{Menu, MenuItem};
            use tauri::tray::{MouseButton, MouseButtonState, TrayIconBuilder, TrayIconEvent};

            let show_item = MenuItem::with_id(app, "show_app", "Show D2 Hub", true, None::<&str>)?;
            let hide_item = MenuItem::with_id(app, "hide_app", "Hide to Tray", true, None::<&str>)?;
            let overlay_item = MenuItem::with_id(app, "toggle_overlay", "Toggle Overlay", true, None::<&str>)?;
            let quit_item = MenuItem::with_id(app, "quit", "Quit D2 Hub", true, None::<&str>)?;
            let tray_menu = Menu::with_items(app, &[&show_item, &hide_item, &overlay_item, &quit_item])?;

            let tray_icon = app.default_window_icon().cloned();

            if let Some(icon) = tray_icon {
                let _tray = TrayIconBuilder::new()
                    .icon(icon)
                    .tooltip("D2 Hub - Destiny 2 Companion")
                    .menu(&tray_menu)
                    .show_menu_on_left_click(false)
                    .on_menu_event(|app, event| {
                        match event.id.as_ref() {
                            "show_app" => {
                                restore_main_window(app);
                            }
                            "hide_app" => {
                                if let Some(win) = app.get_window("main") {
                                    let _ = win.hide();
                                    trim_memory();
                                }
                            }
                            "toggle_overlay" => {
                                overlay::toggle_overlay_cmd(app.clone());
                            }
                            "quit" => {
                                let _ = overlay::disable_all_hotkeys(app.clone());
                                app.exit(0);
                            }
                            _ => {}
                        }
                    })
                    .on_tray_icon_event(|tray, event| {
                        if let TrayIconEvent::Click {
                            button: MouseButton::Left,
                            button_state: MouseButtonState::Up,
                            ..
                        } = event {
                            let now = std::time::SystemTime::now()
                                .duration_since(std::time::UNIX_EPOCH)
                                .map(|d| d.as_millis() as u64)
                                .unwrap_or(0);
                            let prev = LAST_TRAY_CLICK.swap(now, std::sync::atomic::Ordering::SeqCst);
                            if now.saturating_sub(prev) < 250 {
                                return;
                            }
                            let app = tray.app_handle();
                            if let Some(win) = app.get_window("main") {
                                let is_visible = win.is_visible().unwrap_or(false);
                                let is_minimized = win.is_minimized().unwrap_or(false);
                                let is_focused = win.is_focused().unwrap_or(false);
                                if is_visible && !is_minimized && is_focused {
                                    let _ = win.hide();
                                    trim_memory();
                                } else {
                                    restore_main_window(app);
                                }
                            }
                        }
                    })
                    .build(app)?;
            }

            Ok(())
        })
        .on_window_event(|window, event| {
            if let tauri::WindowEvent::CloseRequested { api, .. } = event {
                if window.label() == "main" {
                    // Hide into system tray (inside the ^ on the taskbar) instead of exiting
                    api.prevent_close();
                    let _ = window.hide();
                    trim_memory();
                }
            }
        })
        .invoke_handler(tauri::generate_handler![
            app_version,
            list_macros, run_macro, get_running_macros, stop_macro,
            save_bindings, load_bindings,
            open_macros_folder,
            open_app_folder,
            read_macro_content, save_macro_content, delete_macro,
            register_hotkeys,
            ensure_web_panel, set_web_panel_bounds, show_web_panel, hide_web_panel,
            close_web_panel, delete_profile, continue_signin,
            set_web_panel_zoom, export_dim_login, import_dim_login,
            start_calibration_overlay, report_calibration_click, report_calibration_rect, cancel_calibration,
            redeem_codes, stop_redeem,
            get_weapon_db, get_community_godroll, get_lightgg_godroll, get_d2reflist_db, show_overlay_panels,
            hide_overlay, reset_overlay_layout, set_overlay_opacity, get_overlay_data,
            set_overlay_hotkey, set_calibrate_hotkey, disable_all_hotkeys, set_overlay_settings,
            ocr_test_capture, start_weapon_detection, stop_weapon_detection,
            set_dim_search_hotkey,
            detect_once, set_detect_hotkey,
            set_app_hotkey,
            toggle_verity_overlay, set_verity_hotkey,
            quit_app,
            open_url,
            uninstall_app,
        ])
        .run(tauri::generate_context!())
        .expect("error while running D2 Hub");
}

#[tauri::command]
fn app_version() -> String { env!("CARGO_PKG_VERSION").to_string() }