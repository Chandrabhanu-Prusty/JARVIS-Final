# Jarvis

Jarvis is a lightweight, web-first voice assistant built for a two-day student workshop. It runs as a React + Vite browser interface backed by a small FastAPI service. It deliberately avoids Electron, Docker, databases, and local AI models so it remains practical on ordinary laptops.

## What it does

- Text chat using Groq LLM responses with only the latest six turns held in memory.
- Browser hold-to-talk: Groq Whisper speech-to-text, selectable Edge TTS voices, and text-only fallback.
- A cyberpunk HUD with a muted looping video, audio-reactive signal field, movable panels, and a movable hold-to-talk orb.
- Safe browser action planning for arbitrary websites plus web, YouTube, and Spotify searches. Every destination is shown and requires a user confirmation click.
- An optional **local-only** Windows bridge for four allowlisted applications: Calculator, Notepad, File Explorer, and Visual Studio Code. It is disabled by default and never accepts a path, command, or LLM-generated executable.

## Architecture

```text
Browser (React + Vite)
  ├─ text / microphone capture / audio playback
  ├─ movable HUD, orb, local layout storage
  └─ confirmed navigation in a new browser tab
                  │ HTTP to /api
                  ▼
FastAPI
  ├─ Groq chat + six-turn in-memory context
  ├─ Groq Whisper transcription
  ├─ Edge TTS audio generation
  ├─ constrained browser-action planner
  └─ optional strict Windows allowlist bridge
```

The frontend never receives the Groq key. Audio is sent only for transcription and is not stored. The browser action planner generates permitted destinations; it does not execute arbitrary commands.

## Repository layout

```text
app/
  frontend/                 React + Vite application; can become its own repository
    README.md               frontend setup, build, and deployment guide
    src/
  backend/                  FastAPI API; can become its own repository
    README.md               backend setup, environment, and API guide
    app/
    tests/
docs/
  WORKSHOP.md               two-day workshop sequence and split-repository plan
DESIGN.md                   UI and interaction design context
progress.md                 durable implementation and verification record
```

## Fast local start

You need Node.js 20+ and Python 3.11+.

1. Read [the backend guide](app/backend/README.md), create `app/backend/.env` from `.env.example`, and add your Groq API key.
2. Start the API in PowerShell:

   ```powershell
   cd app/backend
   .\run-dev.ps1
   ```

3. In a second terminal, follow [the frontend guide](app/frontend/README.md) to run Vite:

   ```powershell
   cd app/frontend
   npm install
   npm run dev
   ```

4. Open the displayed Vite address, normally `http://localhost:1420`.

## Verification

```powershell
# terminal 1
cd app/backend
python -m pytest tests -q

# terminal 2
cd app/frontend
npm run lint
npm run build
```

## Deployment and safety

For a public web deployment, host the frontend static build and FastAPI API separately. Set `VITE_API_BASE_URL` to the deployed API's `/api` address at build time, and set `JARVIS_ALLOWED_ORIGINS` to the exact frontend origin. Do not enable the Windows local-app bridge in a public deployment.

See [docs/WORKSHOP.md](docs/WORKSHOP.md) for the workshop flow, repository split, and deployment notes. The complete implementation history is in [progress.md](progress.md).
