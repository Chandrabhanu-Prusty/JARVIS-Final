# Jarvis

Lightweight Windows desktop voice assistant for workshop participants and ordinary student laptops.

## Development layout

- `app/frontend`: React + Vite WebView interface.
- `app/backend`: FastAPI service for Groq and Edge TTS calls.
- `app/src-tauri`: Windows desktop wrapper and narrowly scoped native integration.
- `progress.md`: durable checkpoint and handoff record. Update it after every material change.

## Security baseline

Copy `app/backend/.env.example` to `app/backend/.env` and supply your own Groq key. Never commit `.env`, credentials, audio recordings, or generated sidecar binaries.

Jarvis never passes model-generated commands, paths, or program names to the operating system. Native actions will be fixed allowlist IDs and require user confirmation.

## Run locally

Open two terminals from the project root.

1. Start FastAPI: `./app/backend/run-dev.ps1`
2. Start the frontend: `cd app/frontend; npm run dev`
3. Open the Vite URL shown in the second terminal, normally `http://localhost:1420`.

The API key is read only by FastAPI. If the UI shows **Backend unavailable**, confirm that `http://127.0.0.1:8765/api/health` returns `{ "status": "ok" }` before troubleshooting the key or Groq.

## Build the Windows desktop app

The packaged Tauri app owns the FastAPI lifecycle through a loopback-only sidecar.
Before packaging, build that backend binary with PyInstaller (a packaging-only tool):

1. `python -m pip install pyinstaller`
2. `./app/scripts/build-sidecar.ps1`
3. `cd app/frontend; npm run tauri build`

The target triple in `build-sidecar.ps1` must match `rustc -vV` (normally
`x86_64-pc-windows-msvc`). Rust/Cargo and the Windows MSVC build tools must be
installed before the native package can be built.

## Checkpoint discipline

Implementation proceeds one approved checkpoint at a time. The current state and verification record live in `progress.md`.
