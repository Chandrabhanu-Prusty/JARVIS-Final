import json
import re
from typing import Literal
from urllib.parse import quote_plus, urlparse, urlunparse

import requests

from app.settings import settings

PlanKind = Literal["web_search", "youtube_search", "spotify_search"]

PLANNER_PROMPT = """Classify a browser-navigation request. Return JSON only:
{"kind":"web_search|youtube_search|spotify_search","query":"short search text"}.
Use youtube_search for requests to find a YouTube video, song, audio, or channel.
Use spotify_search for requests to find music, an artist, album, podcast, or playlist on Spotify.
Use web_search for every other website/search request. Never return a URL, command,
file path, app name, or explanation."""


def _explicit_http_url(text: str) -> str | None:
    candidate = re.search(r"(?:https?://)?(?:www\.)?[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?(?:\.[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?)+(?:/[^\s]*)?", text, re.IGNORECASE)
    if not candidate:
        return None
    raw = candidate.group(0).rstrip(".,!?)\]")
    parsed = urlparse(raw if raw.lower().startswith(("http://", "https://")) else f"https://{raw}")
    if parsed.scheme not in {"http", "https"} or not parsed.hostname or parsed.username or parsed.password:
        return None
    return urlunparse((parsed.scheme, parsed.netloc, parsed.path or "/", "", parsed.query, ""))


def _fallback_classification(text: str) -> tuple[PlanKind, str]:
    lowered = text.lower()
    query = re.sub(r"\b(?:please|can you|could you|would you|open|launch|start|go to|play|find|search|on)\b", " ", text, flags=re.IGNORECASE)
    query = " ".join(query.split()) or text.strip()
    if "youtube" in lowered or "you tube" in lowered:
        return "youtube_search", query.replace("YouTube", "").replace("youtube", "").strip() or "YouTube"
    if "spotify" in lowered:
        return "spotify_search", query.replace("Spotify", "").replace("spotify", "").strip() or "Spotify"
    return "web_search", query


def _model_classification(text: str) -> tuple[PlanKind, str] | None:
    if not settings.groq_api_key:
        return None
    payload = {
        "model": settings.groq_chat_model,
        "messages": [{"role": "system", "content": PLANNER_PROMPT}, {"role": "user", "content": text}],
        "temperature": 0,
        "max_completion_tokens": 120,
        "response_format": {"type": "json_object"},
    }
    try:
        response = requests.post(
            "https://api.groq.com/openai/v1/chat/completions",
            json=payload,
            headers={"Authorization": f"Bearer {settings.groq_api_key}", "Content-Type": "application/json"},
            timeout=12,
        )
        content = response.json()["choices"][0]["message"]["content"] if response.ok else ""
        parsed = json.loads(content)
        kind = parsed.get("kind")
        query = parsed.get("query")
        if kind in {"web_search", "youtube_search", "spotify_search"} and isinstance(query, str) and query.strip():
            return kind, query.strip()[:300]
    except (requests.RequestException, KeyError, IndexError, TypeError, ValueError, json.JSONDecodeError):
        pass
    return None


def make_web_action_plan(text: str) -> dict[str, str]:
    explicit_url = _explicit_http_url(text)
    if explicit_url:
        return {"kind": "open_website", "label": urlparse(explicit_url).hostname or "Website", "url": explicit_url}

    kind, query = _model_classification(text) or _fallback_classification(text)
    if kind == "youtube_search":
        return {"kind": kind, "label": f"YouTube search: {query}", "url": f"https://www.youtube.com/results?search_query={quote_plus(query)}"}
    if kind == "spotify_search":
        return {"kind": kind, "label": f"Spotify search: {query}", "url": f"https://open.spotify.com/search/{quote_plus(query)}"}
    return {"kind": kind, "label": f"Web search: {query}", "url": f"https://www.google.com/search?q={quote_plus(query)}"}
