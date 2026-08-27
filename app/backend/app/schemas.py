from uuid import UUID

from pydantic import BaseModel, Field


class ChatRequest(BaseModel):
    session_id: UUID = Field(alias="sessionId")
    text: str = Field(min_length=1, max_length=2_000)


class ChatResponse(BaseModel):
    session_id: UUID = Field(alias="sessionId")
    reply: str
    turns_retained: int = Field(alias="turnsRetained", ge=0, le=6)


class Voice(BaseModel):
    id: str
    label: str


class VoicesResponse(BaseModel):
    voices: list[Voice]


class TtsRequest(BaseModel):
    text: str = Field(min_length=1, max_length=2_000)
    voice_id: str = Field(alias="voiceId")


class TranscriptResponse(BaseModel):
    transcript: str
