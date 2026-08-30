import requests

from app.settings import settings

GROQ_CHAT_URL = "https://api.groq.com/openai/v1/chat/completions"
SYSTEM_PROMPT = (
    "You are Jarvis, an advanced and concise desktop voice assistant for Windows. "
    "Answer directly in plain text, normally within two to three short sentences. "
    "You can open allowlisted Windows desktop applications directly on command: Calculator, Notepad, File Explorer, and Visual Studio Code. "
    "You can also open any website or URL, perform Google web searches, search videos on YouTube, and find music on Spotify."
)


class GroqChatError(RuntimeError):
    def __init__(self, message: str, status_code: int = 503) -> None:
        super().__init__(message)
        self.status_code = status_code


def generate_reply(history: list[dict[str, str]], user_text: str) -> str:
    if not settings.groq_api_key:
        raise GroqChatError("Groq is not configured.")

    payload = {
        "model": settings.groq_chat_model,
        "messages": [
            {"role": "system", "content": SYSTEM_PROMPT},
            *history,
            {"role": "user", "content": user_text},
        ],
        "temperature": 0.4,
        "max_completion_tokens": 220,
    }
    headers = {
        "Authorization": f"Bearer {settings.groq_api_key}",
        "Content-Type": "application/json",
    }

    try:
        response = requests.post(GROQ_CHAT_URL, json=payload, headers=headers, timeout=20)
        if not response.ok:
            error = response.json().get("error", {}) if response.content else {}
            error_code = error.get("code", "")
            if response.status_code == 401:
                raise GroqChatError("Groq rejected the configured API key.")
            if error_code == "model_not_found":
                raise GroqChatError("The configured Groq model is unavailable.")
            if response.status_code == 429:
                raise GroqChatError("Groq rate limit reached. Please try again shortly.")
            raise GroqChatError("Groq could not complete the request.")
        data = response.json()
        reply = data["choices"][0]["message"]["content"].strip()
    except GroqChatError:
        raise
    except (requests.RequestException, KeyError, IndexError, TypeError, ValueError) as error:
        raise GroqChatError("Jarvis could not get a response from Groq.") from error

    if not reply:
        raise GroqChatError("Jarvis received an empty response from Groq.")
    return reply
