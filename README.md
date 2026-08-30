# JARVIS — Intelligent Windows Desktop & Voice Assistant

JARVIS is a lightweight, responsive, and secure desktop AI assistant engineered for Windows. Built with a modern **React + Vite** cyberpunk HUD on the frontend and an ultra-fast **FastAPI (Python)** backend, JARVIS provides real-time voice interaction, smart capability routing, instant web searches, and direct Windows desktop app automation.

---

## ⚡ Core Capabilities

- **🎙️ Real-Time Voice Interaction:** Hold-to-talk microphone capture with live audio level visualization, powered by **Groq Whisper** for rapid speech-to-text and **Microsoft Edge TTS** for natural voice synthesis.
- **💬 Smart Conversational Intelligence:** High-speed LLM chat powered by **Groq (Llama 3.3 / 3.1)** with an in-memory 6-turn sliding conversation window (no heavy databases or persistent tracking).
- **🚀 Direct Web Navigation & Search:** Automatically classifies intent to directly launch target websites, Google searches, YouTube videos, or Spotify tracks in the default browser without popup blockers or manual prompts.
- **💻 Native Windows App Launching:** Direct, allowlisted launching of Windows applications (*Calculator, Notepad, File Explorer, Visual Studio Code*) with native OS foreground focus management (`AllowSetForegroundWindow` + `WScript.Shell.AppActivate`).
- **🛡️ Clean & Isolated Architecture:** Strict security allowlists, local-only origin validation, zero hardcoded credentials, and minimal CPU/RAM footprint.

---

## 🏗️ System Architecture

```text
┌───────────────────────────────────────────────────────────────────────────────────┐
│                             JARVIS CLIENT LAYER (UI)                              │
│                                                                                   │
│   React 19 + TypeScript + Vite                                                    │
│   ├─ Cyberpunk Atmospheric HUD (Video Background + Audio Reactive Signal Field)   │
│   ├─ Movable Panels & Voice Orb (Custom coordinate positioning & persistence)     │
│   ├─ Web Audio API Analyzer (Real-time microphone volume & animation sync)        │
│   ├─ Audio Recorder (Opus/WebM Blob packaging)                                    │
│   └─ Intent Classifier & Capability Filter (Filters questions vs launch commands) │
└────────────────────────────────────────┬──────────────────────────────────────────┘
                                         │ REST API / JSON (Proxy on :1420 -> :8765)
                                         ▼
┌───────────────────────────────────────────────────────────────────────────────────┐
│                             JARVIS BACKEND CORE (API)                             │
│                                                                                   │
│   FastAPI (Python 3.11+) Service (:8765)                                          │
│   ├─ /api/chat           -> Groq Chat Engine (Bounded 6-Turn Sliding Memory)      │
│   ├─ /api/speech/stt     -> Groq Whisper Large v3 Transcription                   │
│   ├─ /api/speech/tts     -> Edge TTS Neural Voice Synthesizer                     │
│   ├─ /api/web-actions    -> Sanitized URL Generator & Default Browser Dispatcher  │
│   └─ /api/local-actions  -> Allowlist Bridge (Native Windows Process Launcher)    │
└───────────────────────┬───────────────────────────────────┬───────────────────────┘
                        │                                   │
       External Cloud Services                     Native Windows OS Bridge
                        │                                   │
        ┌───────────────┴───────────────┐           ┌───────┴───────────────────────┐
        │ • Groq Cloud (Llama / Whisper)│           │ • Windows ShellExecute        │
        │ • Microsoft Edge Speech API   │           │ • AllowSetForegroundWindow    │
        │ • Web / Google / YouTube /    │           │ • WScript.Shell.AppActivate   │
        │   Spotify External Search URLs│           │ • Notepad / Calc / VS Code    │
        └───────────────────────────────┘           └───────────────────────────────┘
```

---

## 🔄 Execution Workflows

### 1. Voice Interaction Pipeline
```text
User speaks (Hold Orb) ──► AudioContext (Opus/WebM) ──► POST /api/speech/stt (Groq Whisper)
                                                                    │
                                                            Transcript Returned
                                                                    │
                                                                    ▼
                                                            Intent Router
                                                            ├── Capability Query ──► /api/chat (Groq LLM) ──► Edge TTS
                                                            ├── Local App Action ──► /api/local-actions/execute
                                                            └── Web Search Action ──► /api/web-actions/open
```

### 2. Desktop App Launch Flow
```text
User: "Open Notepad" ──► isLocalActionRequest() ──► POST /api/local-actions/plan
                                                               │
                                                       Plan: appId="notepad"
                                                               │
                                                               ▼
                                                  POST /api/local-actions/execute
                                                               │
                                              AllowSetForegroundWindow(-1)
                                                               │
                                                os.startfile("notepad.exe")
                                                               │
                                                WScript.Shell.AppActivate()
                                                               │
                                                App pops up in front of Jarvis
```

### 3. Web Navigation & Search Flow
```text
User: "Open YouTube" ──► isWebActionRequest() ──► POST /api/web-actions/open
                                                               │
                                                Sanitize & Build Search URL
                                                               │
                                                os.startfile(url) on Windows
                                                               │
                                                Default Browser Opens URL
                                                               │
                                                Jarvis confirms via Speech
```

---

## 📁 Repository Structure

```text
jarvis/
├── app/
│   ├── frontend/               # React 19 + Vite + TypeScript Frontend
│   │   ├── src/
│   │   │   ├── api/            # REST API clients (chat, speech, system)
│   │   │   ├── components/     # HUD, Voice Orb, Movable Panels, Monitors
│   │   │   ├── styles/         # Cyberpunk design system & animations
│   │   │   ├── localActions.ts # Desktop allowlist intent matcher
│   │   │   ├── webActions.ts   # Web search & URL intent matcher
│   │   │   ├── App.tsx         # Main interactive application shell
│   │   │   └── main.tsx        # React root mount
│   │   └── package.json
│   └── backend/                # FastAPI Python Backend
│       ├── app/
│       │   ├── api/            # API Route definitions (chat, speech, actions)
│       │   ├── services/       # Core service logic (Groq, Edge TTS, Windows bridge)
│       │   ├── schemas.py      # Pydantic data schemas
│       │   ├── settings.py     # Environment & configuration loader
│       │   └── main.py         # FastAPI application initialization
│       ├── tests/              # Pytest test suite (17 unit tests)
│       └── requirements.txt
├── docs/                       # Workshop documentation and notes
└── README.md                   # Project overview and setup documentation
```

---

## 🚀 Getting Started

### Prerequisites
- **Node.js 20+** and **npm**
- **Python 3.11+**
- **Groq API Key** (Free from [console.groq.com](https://console.groq.com))

### 1. Backend Setup
1. Open PowerShell and navigate to `app/backend`:
   ```powershell
   cd app/backend
   ```
2. Copy `.env.example` to `.env` and enter your Groq API key:
   ```env
   GROQ_API_KEY=gsk_your_groq_api_key_here
   LOCAL_ACTIONS_ENABLED=true
   ```
3. Run the development server:
   ```powershell
   .\run-dev.ps1
   ```
   *The backend will start at `http://127.0.0.1:8765`.*

### 2. Frontend Setup
1. In a second terminal, navigate to `app/frontend`:
   ```powershell
   cd app/frontend
   ```
2. Install dependencies:
   ```powershell
   npm install
   ```
3. Start the Vite dev server:
   ```powershell
   npm run dev
   ```
4. Open the UI at `http://localhost:1420`.

---

## 🧪 Testing & Verification

```powershell
# Run Backend Pytest Suite
cd app/backend
python -m pytest

# Run Frontend Type Check & Build
cd app/frontend
npm run lint
npm run build
```

---

## 🔒 Security & Design Principles

- **No Secret Leakage:** The client never receives or stores the Groq API key.
- **Strict Allowlist Execution:** Local application execution is restricted strictly to a fixed tuple of safe Windows targets (`ms-calculator:`, `notepad.exe`, `explorer.exe`, `vscode://`). Model-generated commands, arbitrary paths, or shell scripts are never executed.
- **Ephemeral Context:** Chat context is stored in-memory and capped strictly at the 6 most recent conversation turns.

