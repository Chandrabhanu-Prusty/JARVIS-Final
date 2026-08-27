from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.chat import router as chat_router
from app.api.speech import router as speech_router
from app.api.actions import router as actions_router

app = FastAPI(title="Jarvis Backend", version="0.1.0")

# Vite is permitted only for local development. The packaged WebView remains local.
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:1420", "http://127.0.0.1:1420", "tauri://localhost"],
    allow_credentials=False,
    allow_methods=["GET", "POST"],
    allow_headers=["Content-Type"],
)
app.include_router(chat_router)
app.include_router(speech_router)
app.include_router(actions_router)


@app.get("/api/health")
async def health() -> dict[str, str]:
    return {"status": "ok"}
