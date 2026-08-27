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

## Checkpoint discipline

Implementation proceeds one approved checkpoint at a time. The current state and verification record live in `progress.md`.
