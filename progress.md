# Jarvis Progress

## Current state

**Architecture:** web-first React + Vite frontend and deployable FastAPI API. The former Tauri, Rust, PyInstaller sidecar, Windows action endpoint, global-shortcut plan, and installer artifacts were intentionally removed on 2026-08-27 with user approval.

This file is the durable handoff. Update it after every material change and before ending a context-limited session.

**Cleanup checkpoint (2026-08-27):** Added a workshop-ready root README, self-contained `app/frontend/README.md` and `app/backend/README.md`, plus `docs/WORKSHOP.md`. Simplified the frontend build command so it no longer creates TypeScript build-output files beside source. Backend tests passed (16); frontend lint and production build passed. Permanent deletion of the unused `refrences/` archive, historical desktop build outputs, duplicate source video, and obsolete tool metadata is pending explicit confirmation because it is irreversible.

## Delivered

1. React/Vite cyberpunk HUD with responsive glass chat, user-supplied looping video background, audio-reactive SVG signal field, local briefing, activity monitor, and honest browser/service status tiles.
2. Text chat via Groq with a six-turn, process-memory-only context limit.
3. Browser on-screen hold-to-talk, Groq Whisper transcription, selectable Edge TTS voices, and text fallback if speech fails.
4. Backend safety: keys stay server-side; recordings are not stored; strict size/audio-format validation; the optional local bridge permits only four fixed Windows app IDs and never command execution.
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
- 2026-08-27: Chat usability refinement: new messages, action confirmations, and state changes now smoothly follow the latest conversation; the message scrollbar is functional but visually hidden. Browser-action plans are spoken before their confirmation controls appear. The right chat panel is smaller and flush-right; the header now uses a larger standalone `JARVIS` mark, a smaller title, and green online/status text. `npm run lint` and `npm run build` passed.
- 2026-08-27: Replaced the still background with the supplied 4.6 MB MP4 bundled by Vite. It is muted, preloaded, auto-playing, inline, and looping; the revolving moon and its HUD grid were removed while the bottom audio-reactive signal field remains. `npm run lint` and `npm run build` passed; the production video bundle is 4,659.58 kB.
- 2026-08-27: Completed the approved movable-HUD redesign. Added a durable `DESIGN.md`, a reusable desktop `MovablePanel` wrapper with a right-click Move/Fix position menu, pointer drag, keyboard nudging, and local-only saved positions. Reworked the visual layout into compact chat, system, local briefing, and activity-monitor modules while retaining the background video and audio field. Verification passed: strict UI audit (0 findings), `npm run lint`, and `npm run build`. Browser smoke testing confirmed all four panels render, the Move context menu appears, the drag handle activates, and no relevant console errors occur. Browser viewport emulation did not take effect in the available in-app browser, so manual narrow-screen verification remains required.
- 2026-08-27: Implemented the approved optional local-app bridge. It is disabled by default and only available when FastAPI is configured for `127.0.0.1` plus `JARVIS_LOCAL_ACTIONS_ENABLED=true`. A deterministic registry accepts only Calculator, Notepad, File Explorer, and Visual Studio Code IDs; no LLM/user path, program name, command, or arguments reach the Windows launcher. The UI now plans and speaks a local-app request, then requires a visible confirmation click. Local-action routes additionally reject non-local browser origins, preventing a public frontend from using the bridge even if it is accidentally listed in general CORS configuration. Verification passed: `python -m compileall -q app`, `python -m pytest tests -q` (16 passed; known pytest cache warning only), `npm run lint`, `npm run build`, and strict UI audit (0 findings).
- 2026-08-27: Added the approved central Jarvis voice orb using CSS only. It shares the existing hold-to-talk capture path, supports the reusable right-click Move/Fix behavior, and records its position locally. Browser verification confirmed the orb renders, has no console errors, and exposes the expected Move menu and drag handle; `npm run lint`, `npm run build`, and strict UI audit (0 findings) passed. Automatic opening remains intentionally excluded because Jarvis requires user confirmation before external navigation or app launch.
- 2026-08-27: Removed the orb-minimization behavior at user request. The orb now remains in its current fixed/moved position after all website and local-app actions. `npm run lint` and `npm run build` passed.
