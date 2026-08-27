# Jarvis

Lightweight web-based voice assistant for workshop participants and ordinary student laptops.

## Development layout

- `app/frontend`: React + Vite browser interface.
- `app/backend`: FastAPI web API for Groq and Edge TTS calls.
- `progress.md`: durable checkpoint and handoff record. Update it after every material change.

## Security baseline

Copy `app/backend/.env.example` to `app/backend/.env` and supply your own Groq key. Never commit `.env`, credentials, or audio recordings.

Jarvis is a web app. It has no local application launcher, global keyboard hook, or arbitrary system-command capability. This keeps workshop use lightweight and safe.

## Browser action plans

For requests such as **open example.com**, Jarvis shows the exact HTTP(S) site
before opening it in a new tab. For natural requests such as **open a video
about orbital mechanics on YouTube** or **play lo-fi music on Spotify**, the API
creates a constrained search plan and shows its generated URL for confirmation.

The model may choose only `web_search`, `youtube_search`, or `spotify_search`
and provide search text. It never provides a raw URL. The backend builds the
destination URL and the browser opens it only after a visible click. YouTube and
Spotify playback still requires the user's interaction on those sites because
their providers and browsers enforce playback/login policies.

## Optional local-app bridge

Jarvis can optionally open four Windows applications: Calculator, Notepad,
File Explorer, and Visual Studio Code. This is disabled by default. To enable
it only for your local workshop machine, add this to `app/backend/.env` and
restart the backend:

```text
JARVIS_LOCAL_ACTIONS_ENABLED=true
```

The backend must stay bound to `127.0.0.1`. Jarvis always shows a confirmation
button before opening an application. The backend accepts only fixed allowlist
IDs; it never accepts a path, executable name, argument, shell command, or
model-generated program launch instruction.

This bridge is intentionally unavailable in a browser-only deployment. A
publicly hosted frontend must not be configured to access local applications.

## Run locally

Open two terminals from the project root.

1. Start FastAPI: `./app/backend/run-dev.ps1`
2. Start the frontend: `cd app/frontend; npm run dev`
3. Open the Vite URL shown in the second terminal, normally `http://localhost:1420`.

The API key is read only by FastAPI. If the UI shows **Jarvis service is unavailable**, confirm that `http://127.0.0.1:8765/api/health` returns `{ "status": "ok" }` before troubleshooting the key or Groq.

## Deploy as a web app

Deploy `app/backend` to a Python host and set these environment variables there:

```text
GROQ_API_KEY=your-key
GROQ_CHAT_MODEL=openai/gpt-oss-20b
JARVIS_ALLOWED_ORIGINS=https://your-frontend-domain.example
```

Build the frontend with its public API address:

```powershell
cd app/frontend
$env:VITE_API_BASE_URL = "https://your-api-domain.example/api"
npm run build
```

Deploy the generated `app/frontend/dist` directory to any static host. The
backend CORS allowlist must contain the exact frontend origin.

## Checkpoint discipline

Implementation proceeds one approved checkpoint at a time. The current state and verification record live in `progress.md`.
