from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
import os
from models import ChatRequest, ChatResponse, HealthResponse
from services import OpenRouterService
from config import Config

# Load environment variables
load_dotenv()

# Initialize FastAPI app
app = FastAPI(
    title="VoiceBot Pro API",
    description="AI-powered English speaking tutor for Spanish speakers",
    version="1.0.0"
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=Config.ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize OpenRouter service
chat_service = OpenRouterService()


@app.get("/health", response_model=HealthResponse)
async def health_check():
    """Health check endpoint"""
    return HealthResponse(
        status="ok",
        service="VoiceBot Pro"
    )


@app.post("/chat", response_model=ChatResponse)
async def chat(request: ChatRequest):
    """Chat endpoint - receives user message and returns AI response"""
    response = chat_service.get_chat_response(request.message, request.mode)
    return ChatResponse(**response)


@app.post("/reset")
async def reset_conversation():
    """Reset conversation history"""
    chat_service.clear_history()
    return {"status": "success", "message": "Conversation history cleared"}


@app.get("/")
async def root():
    """Root endpoint"""
    return {
        "message": "Welcome to VoiceBot Pro API",
        "endpoints": {
            "health": "GET /health",
            "chat": "POST /chat",
            "reset": "POST /reset"
        }
    }


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)


