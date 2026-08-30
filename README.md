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

![JARVIS Architecture Diagram](app/frontend/src/assets/Architect%20Diagram.png)

---

## 🔄 Execution Workflows

![JARVIS Workflow Diagram](app/frontend/src/assets/WorkFlow%20Diagram.png)

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

