from pydantic import BaseModel
from typing import Optional, List


class ChatRequest(BaseModel):
    message: str
    mode: str = "casual"


class Score(BaseModel):
    grammar: int
    fluency: int
    confidence: int


class ChatResponse(BaseModel):
    reply: str
    correction: Optional[str] = None
    score: Score


class HealthResponse(BaseModel):
    status: str
    service: str


class ConversationMessage(BaseModel):
    role: str  # "user" or "assistant"
    content: str

