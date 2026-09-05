"""
Claude API client for NEXUS.
Requires ANTHROPIC_API_KEY in environment or .env file.
"""

import importlib
import os
from typing import Any

from dotenv import load_dotenv

load_dotenv()

_client = None
_history: list[dict[str, str]] = []
MAX_HISTORY = 20

SYSTEM_PROMPT = """You are NEXUS, a smart and friendly AI desktop assistant.
You respond in a concise, helpful, and slightly witty tone.
Keep answers short unless the user asks for detail.
"""


def _get_client() -> Any:
    global _client
    if _client is None:
        api_key = os.getenv("ANTHROPIC_API_KEY")
        if not api_key:
            raise ValueError(
                "My advanced reasoning isn't connected right now, but I can "
                "still help with commands like the time, jokes, or opening "
                "websites!"
            )

        try:
            anthropic_module = importlib.import_module("anthropic")
        except ModuleNotFoundError as exc:
            raise ValueError(
                "The 'anthropic' package is not installed. Run: pip install anthropic"
            ) from exc

        _client = anthropic_module.Anthropic(api_key=api_key)
    return _client


def ask_claude(user_message: str) -> str:
    """Send a message to Claude and return response text."""
    global _history

    _history.append({"role": "user", "content": user_message})
    if len(_history) > MAX_HISTORY:
        _history = _history[-MAX_HISTORY:]

    try:
        client = _get_client()
        response = client.messages.create(
            model="claude-sonnet-4-20250514",
            max_tokens=512,
            system=SYSTEM_PROMPT,
            messages=_history,
        )
        reply = response.content[0].text
        _history.append({"role": "assistant", "content": reply})
        return reply
    except ValueError as exc:
        return str(exc)
    except Exception as exc:
        return f"Sorry, I could not connect right now. Error: {type(exc).__name__}"


def clear_history() -> None:
    """Reset assistant chat history."""
    global _history
    _history = []