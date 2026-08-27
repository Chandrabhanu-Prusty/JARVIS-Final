# Jarvis Progress

## Handoff status

**Current checkpoint:** 1 — project scaffold and documentation (complete; awaiting approval)

This file is the durable implementation handoff. Read it before making changes, then update it after every material edit and before ending a context-limited session.

## Constraints that must remain true

- React + Vite frontend; Tauri desktop wrapper; Python + FastAPI sidecar.
- Groq Whisper and Groq chat; Edge TTS; no local AI model, database, Docker, Electron, or Three.js.
- Keep only six recent conversation turns in RAM.
- No hard-coded credentials. Use `app/backend/.env`; commit only `.env.example`.
- Never execute LLM-generated shell commands, paths, or programs.
- Local actions are a fixed allowlist and require UI confirmation.
- Text input works if microphone, shortcut, STT, or TTS fails.
- Follow checkpoints in order. Do not start the next one until user approval.

## Checkpoint plan

1. **Complete:** scaffolded frontend, backend, Tauri configuration, `.env.example`, and docs. Focused frontend and backend checks passed; Tauri compilation is blocked because Cargo is unavailable.
2. **Next, pending approval:** text-only Groq chat with six-turn volatile context.
3. Edge TTS, curated selectable voices, playback, and text-only fallback.
4. On-screen hold-to-talk, Groq Whisper, audio validation, and microphone errors.
5. Lightweight CSS/SVG cyberpunk interface and audio-reactive visualizer.
6. Tauri FastAPI sidecar lifecycle and confirmed action allowlist.
7. Configurable Windows Ctrl+Space hold-to-talk with conflict fallback.
8. Security hardening, packaging, and integration verification.

## Latest change

- 2026-08-27: Created the React/Vite, FastAPI, and Tauri project scaffold. Added loopback-only backend defaults, explicit local CORS origins, CSP, minimal health endpoint/test, `.env.example`, `.gitignore`, and root documentation.
- 2026-08-27: No microphone, Groq chat, Edge TTS, global shortcut, sidecar, or native action behavior exists yet. Those remain intentionally deferred to their approved checkpoints.
- 2026-08-27: Installed declared frontend dependencies and generated `app/frontend/package-lock.json`. Installed `pytest` in the current user Python environment solely to run the backend test.
- 2026-08-27: Checkpoint 1 is complete. Do not begin checkpoint 2 without explicit user approval.

## Verification log

- 2026-08-27: `python -m compileall -q app/backend/app` passed.
- 2026-08-27: `python -m pytest tests -q` passed: 1 test.
- 2026-08-27: `npm run lint` passed.
- 2026-08-27: `npm run build` passed.
- Blocked verification: `cargo` is not installed or on `PATH`, so the Tauri native build could not run. Install Rust/Cargo and the Windows MSVC build tools before the desktop wrapper/package checkpoint; do not fake this check.
