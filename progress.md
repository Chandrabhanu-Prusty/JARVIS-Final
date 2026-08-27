# Jarvis Progress

## Current state

**Architecture:** web-first React + Vite frontend and deployable FastAPI API. The former Tauri, Rust, PyInstaller sidecar, Windows action endpoint, global-shortcut plan, and installer artifacts were intentionally removed on 2026-08-27 with user approval.

This file is the durable handoff. Update it after every material change and before ending a context-limited session.

## Delivered

1. React/Vite cyberpunk HUD with responsive glass chat, audio-reactive SVG signal field, orbiting moon, local briefing, and honest browser/service status tiles.
2. Text chat via Groq with a six-turn, process-memory-only context limit.
3. Browser on-screen hold-to-talk, Groq Whisper transcription, selectable Edge TTS voices, and text fallback if speech fails.
4. Backend safety: keys stay server-side; recordings are not stored; strict size/audio-format validation; no local action or command-execution API remains.
5. Web deployment readiness: frontend API URL is build-time configurable with `VITE_API_BASE_URL`; FastAPI CORS uses exact origins from `JARVIS_ALLOWED_ORIGINS` and never permits `*`.

## Removed by approved web migration

- `app/src-tauri/` and all generated installer/sidecar resources.
- `app/scripts/build-sidecar.ps1` and `app/backend/sidecar.py`.
- Tauri npm packages/scripts and the Windows Calculator/Notepad/File Explorer endpoint.

## Run locally

1. From the project root, run `./app/backend/run-dev.ps1`.
2. In another terminal, run `cd app/frontend; npm run dev`.
3. Open the Vite address, normally `http://localhost:1420`.

## Next approved checkpoint

**Current checkpoint:** constrained browser action planner (complete). Jarvis can prepare direct user-provided HTTP(S) websites and web/YouTube/Spotify searches, displaying the generated destination before a confirmation click.

After this checkpoint, choose a hosting target and deploy the existing web API and static frontend. Required production configuration:

```text
GROQ_API_KEY=...
GROQ_CHAT_MODEL=openai/gpt-oss-20b
JARVIS_ALLOWED_ORIGINS=https://your-frontend-domain.example
VITE_API_BASE_URL=https://your-api-domain.example/api
```

No web-only deployment may launch local applications, read arbitrary files, execute commands, or register a global shortcut. Those require a separately installed and explicitly approved local bridge.

## Verification log

- Historical desktop build succeeded before the intentional migration; it is no longer part of this project.
- 2026-08-27: Web-migration validation passed: `npm run lint`, `npm run build`, `python -m compileall -q app`, and `python -m pytest tests -q` (7 passed). Pytest emitted the pre-existing cache-path warning only.
- 2026-08-27: Replaced the four-site hardcoded launcher with `POST /api/web-actions/plan`. Direct user-provided HTTP(S) domains are normalized and shown for confirmation; natural requests become constrained web, YouTube, or Spotify search plans. Groq can classify a plan but never provide a URL; the API generates every destination and the browser opens it only after a click.
- 2026-08-27: Planner verification passed: `python -m compileall -q app`, `python -m pytest tests -q` (10 passed), `npm run lint`, and `npm run build`. The known pytest cache warning remains non-failing.
