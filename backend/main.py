"""
NEXUS Web Backend — FastAPI

This backend handles the AI assistant's brain logic.

POST /chat
{
    "message": "open youtube"
}

Response:
{
    "reply": "Opening YouTube for you.",
    "action": "open_url",
    "url": "https://youtube.com"
}

The frontend calls this endpoint and decides what to do with
the response, including speaking the reply or opening a URL.
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from command import process_command
from api_client import ask_claude


# ─────────────────────────────────────────────────────────────
# FastAPI Application
# ─────────────────────────────────────────────────────────────

app = FastAPI(title="NEXUS Web Backend")


# ─────────────────────────────────────────────────────────────
# CORS Configuration
# ─────────────────────────────────────────────────────────────

# The frontend and backend may be hosted on different domains.
# CORS allows the frontend to communicate with this backend.

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)


# ─────────────────────────────────────────────────────────────
# Request / Response Models
# ─────────────────────────────────────────────────────────────

class ChatRequest(BaseModel):
    message: str


class ChatResponse(BaseModel):
    reply: str
    action: str | None = None
    url: str | None = None


# ─────────────────────────────────────────────────────────────
# Health Check
# ─────────────────────────────────────────────────────────────

@app.get("/")
def health_check():
    """
    Simple endpoint to check whether the backend is running.
    """
    return {"status": "NEXUS backend is online"}


# ─────────────────────────────────────────────────────────────
# Chat Endpoint
# ─────────────────────────────────────────────────────────────

@app.post("/chat", response_model=ChatResponse)
def chat(req: ChatRequest):
    """
    Process a user message.

    1. Try built-in commands first.
    2. If no command matches, send the message to Claude.
    """

    query = req.message.strip()

    # First try built-in commands.
    # These are fast, free, and do not require an AI API call.
    result = process_command(query)

    # If no built-in command matched,
    # send the query to Claude.
    if result is None:
        reply_text = ask_claude(query)

        result = {
            "reply": reply_text,
            "action": None,
            "url": None,
        }

    return result