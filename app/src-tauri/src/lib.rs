use std::sync::Mutex;

use tauri::{Manager, RunEvent};
use tauri_plugin_shell::{process::CommandChild, ShellExt};

struct BackendSidecar(Mutex<Option<CommandChild>>);

pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_shell::init())
        .setup(|app| {
            let (_events, child) = app.handle().shell().sidecar("jarvis-backend")
                .map_err(|error| format!("Jarvis backend sidecar configuration failed: {error}"))?
                .spawn().map_err(|error| format!("Jarvis backend could not start: {error}"))?;
            app.manage(BackendSidecar(Mutex::new(Some(child))));
            Ok(())
        })
        .run(tauri::generate_context!(), |app, event| {
            if let RunEvent::Exit = event {
                if let Some(sidecar) = app.try_state::<BackendSidecar>() {
                    if let Ok(mut child) = sidecar.0.lock() {
                        if let Some(child) = child.take() { let _ = child.kill(); }
                    }
                }
            }
        })
        .expect("error while running Jarvis");
}
