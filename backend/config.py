import os


# Configuration constants
class Config:
    # Server
    HOST = "0.0.0.0"
    PORT = 8000
    RELOAD = True

    # API
    API_TIMEOUT = 30
    MAX_HISTORY = 20

    # Models
    DEFAULT_MODEL = "deepseek/deepseek-chat-v3-0324:free"
    FALLBACK_MODELS = [
        "deepseek/deepseek-chat:free",
        "openrouter/auto",
    ]
    TEMPERATURE = 0.7
    MAX_TOKENS = 120
    MAX_REPLY_CHARS = 260

    # CORS
    _CORS_FROM_ENV = os.getenv("CORS_ORIGINS", "").strip()
    ALLOWED_ORIGINS = [
        origin.strip()
        for origin in _CORS_FROM_ENV.split(",")
        if origin.strip()
    ] or [
        "http://localhost:3000",
        "http://localhost:8000",
        "http://127.0.0.1:3000",
        "http://127.0.0.1:8000",
    ]

