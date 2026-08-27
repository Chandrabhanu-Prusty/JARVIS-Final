from dataclasses import dataclass
import os

from dotenv import load_dotenv

load_dotenv()


@dataclass(frozen=True)
class Settings:
    backend_host: str = os.getenv("JARVIS_BACKEND_HOST", "127.0.0.1")
    backend_port: int = int(os.getenv("JARVIS_BACKEND_PORT", "8765"))
    groq_api_key: str = os.getenv("GROQ_API_KEY", "")
    groq_chat_model: str = os.getenv("GROQ_CHAT_MODEL", "openai/gpt-oss-20b")


settings = Settings()
