# Jarvis Progress

## Handoff status

**Current checkpoint:** Tauri backend lifecycle and confirmed allowlisted actions (complete; native build blocked)

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
2. **Complete:** text-only Groq chat with six-turn volatile context.
3. **Complete:** fixed development connectivity feedback and built the lightweight cyberpunk UI foundation.
4. **Complete:** repaired the Groq model configuration and added Edge TTS, curated selectable voices, playback, and text-only fallback.
5. **Complete:** on-screen hold-to-talk, Groq Whisper, microphone errors, and live audio-level binding for the HUD signal lines.
6. **Pending:** Tauri FastAPI sidecar lifecycle and confirmed action allowlist.
7. Configurable Windows Ctrl+Space hold-to-talk with conflict fallback.
8. Security hardening, packaging, and integration verification.

## Latest change

- 2026-08-27: Created the React/Vite, FastAPI, and Tauri project scaffold. Added loopback-only backend defaults, explicit local CORS origins, CSP, minimal health endpoint/test, `.env.example`, `.gitignore`, and root documentation.
- 2026-08-27: No microphone, Groq chat, Edge TTS, global shortcut, sidecar, or native action behavior exists yet. Those remain intentionally deferred to their approved checkpoints.
- 2026-08-27: Installed declared frontend dependencies and generated `app/frontend/package-lock.json`. Installed `pytest` in the current user Python environment solely to run the backend test.
- 2026-08-27: Checkpoint 1 is complete. Do not begin checkpoint 2 without explicit user approval.
- 2026-08-27: User approved checkpoint 2. Implementing only text chat and six-turn volatile context; speech, microphone, shortcuts, sidecar startup, and actions remain out of scope for this checkpoint.
- 2026-08-27: Added a typed `POST /api/chat` endpoint, a bounded process-local conversation store (six user/assistant pairs, up to 32 active sessions), and a single Groq Chat Completions client. The backend has no capability to execute actions.
- 2026-08-27: Added the frontend text composer, thinking state, API error display, and one in-memory browser session ID. API keys remain backend-only.
- 2026-08-27: Checkpoint 2 is complete. Do not begin checkpoint 3 without explicit user approval.
- 2026-08-27: User approved continuing. Diagnosed the screenshot's `Failed to fetch`: `curl` confirmed connection refusal at `127.0.0.1:8765/api/health`; FastAPI was not running. The Groq key therefore was never sent to Groq.
- 2026-08-27: Added a local FastAPI launch script, Vite `/api` proxy, packaged API path handling, and an actionable client error: `Backend unavailable. Start app/backend/run-dev.ps1, then try again.`
- 2026-08-27: Replaced the temporary card with a CSS/SVG cyberpunk HUD using the inspected reference image. It includes a slowly orbiting moon, decorative grid, and low-cost SVG signal lines. Signal lines become active during requests and are prepared for real microphone levels in checkpoint 5.
- 2026-08-27: Checkpoint 3 is complete. The original order was adjusted at the user's request to deliver the visual foundation before speech. Do not begin checkpoint 4 without explicit user approval.
- 2026-08-27: User approved continuing. Provider diagnosis found a valid Groq key but an unavailable configured model: `llama-3.3-70b-versatile` returned `model_not_found`. The account's available general text models include `openai/gpt-oss-20b`; migrating the configuration to that supported model.
- 2026-08-27: Switched the configured Groq model to `openai/gpt-oss-20b`, restored `.env.example`, and replaced generic provider failures with safe messages for invalid keys, unavailable models, rate limits, and provider outages.
- 2026-08-27: Added curated Edge TTS voices, `GET /api/voices`, `POST /api/tts` MP3 output, browser playback, selectable voice UI, audio-reactive HUD state, and text-only fallback when speech cannot play.
- 2026-08-27: User asked to move ahead with the remaining voice work. Beginning checkpoint 5 immediately after checkpoint 4 verification.
- 2026-08-27: Added `POST /api/transcribe` using Groq Whisper Turbo with a strict 10 MB limit and an allowlist of browser audio formats. The backend never stores recordings.
- 2026-08-27: Added on-screen hold-to-talk. It requests microphone access only on press, records only while held, stops every track/audio context/animation loop on release, then transcribes and sends the resulting text through the existing chat and TTS path.
- 2026-08-27: The HUD signal lines now speed up and brighten from actual microphone amplitude during recording. Text input remains fully available after microphone, transcription, or speech failures.
- 2026-08-27: Checkpoint 5 is complete in automated verification. Manual microphone permission and recording verification remains required on this Windows machine.
- 2026-08-27: Investigated a live transcription failure. The Groq key, Whisper model access, and end-to-end Groq transcription pipeline are confirmed healthy; a generated MP3 transcribed successfully. The failure is therefore in the browser recording, most likely a very short press/release or pointer leaving the button.
- 2026-08-27: Updated hold-to-talk to capture the pointer, reject recordings shorter than 650 ms locally, and show an explicit provider message for short or unreadable recordings. This prevents the previous vague transcription error for an accidental tap.
- 2026-08-27: User approved a UI refinement pass: fixed right-side glass chat panel, shifted moon, robotic typography, and an honest left-side component-status panel.
- 2026-08-27: Reworked the desktop layout: the glass chat panel is fixed on the right with an internal scroll area; the reference background remains visible; the moon and grid moved into the open central area; typography now prioritizes Windows robotic/technical fonts.
- 2026-08-27: Added a left-side live system-status panel: Backend Link, Text Engine, Microphone, Speech to Text, and Text to Speech. Green means a successful real check, red means a failed attempt, and gray means not checked—no fabricated health state.
- 2026-08-27: UI refinement checkpoint complete. Do not begin the Tauri/action checkpoint without explicit user approval.
- 2026-08-27: Status-panel polish: vertically centered the left panel on desktop and made every legend light a fixed flex item, aligning the red error light with its label. Mobile positioning remains unchanged.
- 2026-08-27: User approved a compact Jarvis-style greeting plus local time, weather, and location. The location request will remain explicit and client-side; it will not be sent to the Jarvis backend or persisted.
- 2026-08-27: Added a compact bottom-left local briefing with a time-aware Jarvis greeting, local clock/date, weather condition, and location status. It does nothing beyond the clock until the user presses **Share location**. With permission, the browser sends rounded coordinates directly to Open-Meteo for current temperature and weather code; neither data point is persisted or sent to FastAPI/Groq.
- 2026-08-27: Added only `https://api.open-meteo.com` to the Tauri CSP `connect-src` allowlist, keeping external network access narrowly scoped to the opted-in weather lookup.
- 2026-08-27: User approved continuing toward the Windows desktop app. Beginning the Tauri backend lifecycle and strict-confirmation action checkpoint after the UI telemetry adjustment.
- 2026-08-27: Repositioned the local briefing toward the right-side HUD area, while preserving clearance from the fixed chat card. The system panel is now a two-column telemetry grid and its bottom edge is exactly aligned to the desktop viewport midpoint. It reports backend, browser network, text engine, Bluetooth capability, microphone, STT, and TTS states; unavailable checks remain gray instead of claiming success.
- 2026-08-27: Added the strict `POST /api/actions` service with exactly three Windows allowlisted IDs: Calculator, Notepad, and File Explorer. It requires `confirmed: true`, uses fixed argument tuples with `shell=False`, rejects all other values in schema validation, and remains entirely separate from Groq/LLM output.
- 2026-08-27: Added the Tauri shell sidecar lifecycle configuration. On a packaged Windows launch, Tauri starts only the bundled `jarvis-backend` binary and attempts to stop it as the app exits. A packaging script produces the target-triple-named binary using PyInstaller; source and generated binary remain separate.
- 2026-08-27: Added `tauri-plugin-shell = "2"`. This is the only new native dependency: Tauri's official mechanism for a narrowly scoped bundled sidecar, needed because a browser cannot own the local FastAPI process.
- 2026-08-27: Checkpoint 6 source implementation is complete. Do not begin configurable Ctrl+Space handling without explicit approval. Native package verification is blocked until Rust/Cargo, MSVC build tools, and the packaging-only PyInstaller command are available.

## Verification log

- 2026-08-27: `python -m compileall -q app/backend/app` passed.
- 2026-08-27: `python -m pytest tests -q` passed: 1 test.
- 2026-08-27: `npm run lint` passed.
- 2026-08-27: `npm run build` passed.
- 2026-08-27: `python -m compileall -q app` passed after checkpoint 2.
- 2026-08-27: `python -m pytest tests -q` passed after checkpoint 2: 4 tests (health, valid chat, six-turn retention, validation/provider error).
- 2026-08-27: `npm run lint` and `npm run build` passed after checkpoint 2.
- Manual check pending: create `app/backend/.env` from `.env.example` with a valid Groq API key, run the backend locally, and submit a text message. No live Groq request was made during automated verification, preventing accidental key use and API cost.
- 2026-08-27: Temporary Uvicorn run returned `200 {"status":"ok"}` from `http://127.0.0.1:8765/api/health`; the temporary process was then stopped.
- 2026-08-27: `python -m pytest tests -q` passed: 4 tests.
- 2026-08-27: `npm run lint` and `npm run build` passed. The production build includes the cyberpunk background asset.
- 2026-08-27: `python -m compileall -q app` and `python -m pytest tests -q` passed after checkpoint 4: 6 tests.
- 2026-08-27: `npm run lint` and `npm run build` passed after checkpoint 4.
- 2026-08-27: Live Groq verification succeeded with HTTP 200 on the configured model; Edge TTS verification produced 13,392 bytes of MP3 audio. API keys and response content were not printed.
- 2026-08-27: `python -m compileall -q app` and `python -m pytest tests -q` passed after checkpoint 5: 7 tests.
- 2026-08-27: `npm run lint` and `npm run build` passed after checkpoint 5.
- Manual check required: start both local services, hold **Hold to talk**, grant microphone permission, say a short phrase, release, and confirm the transcript, text reply, Edge TTS playback, and moving signal lines. This check cannot be automated safely without accessing the user's microphone.
- 2026-08-27: Post-fix verification passed: `python -m pytest tests -q` (7 tests), `npm run lint`, and `npm run build`.
- 2026-08-27: UI refinement verification passed: `npm run lint` and `npm run build`.
- 2026-08-27: Status-panel polish verification passed: `npm run lint` and `npm run build`.
- 2026-08-27: Briefing-panel verification passed: `npm run lint` and `npm run build`.
- 2026-08-27: Telemetry-layout verification passed: `npm run lint` and `npm run build`.
- 2026-08-27: Allowlisted-action verification passed: `python -m compileall -q app` and `python -m pytest tests -q` (10 passed). Pytest emitted one cache-path warning for the pre-existing `.pytest_cache` state; no test failed.
- 2026-08-27: Sidecar source is not native-compiled: Cargo is still unavailable on this machine, and no generated sidecar binary is checked into the repository. After installing prerequisites, run the documented PyInstaller script, then `npm run tauri build` from `app/frontend`.
- Manual check required: press **Share location**, grant or deny the Windows/browser location prompt, and confirm the expected privacy state and (when granted) a time, rounded coordinates, and weather result. The request requires the user's local permission and network, so it is not automated.
- Blocked verification: `cargo` is not installed or on `PATH`, so the Tauri native build could not run. Install Rust/Cargo and the Windows MSVC build tools before the desktop wrapper/package checkpoint; do not fake this check.
