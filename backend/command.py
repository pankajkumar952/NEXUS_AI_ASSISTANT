"""
Commands Module — Handles built-in commands before falling back to Claude API.

WEB VERSION NOTE (read this, it's the key change from the desktop version):
Instead of calling webbrowser.open() directly (which would try to open a
browser on the SERVER, not the user's machine — and servers don't have
browsers), each function now returns a dict:

    {"reply": "text to show/speak", "action": "open_url", "url": "..."}

The frontend JavaScript reads this dict and does the actual browser action.
If there's no special action, "action" is just None.
"""

import datetime
import platform


def process_command(query: str) -> dict | None:
    """
    Check query against built-in commands.
    Returns a dict {"reply": str, "action": str|None, "url": str|None},
    or None if no command matched (caller should fall back to Claude).
    """
    q = query.lower().strip()

    # Greetings
    if any(w in q for w in ("hello", "hi ", "hey", "what's up")):
        return _reply(_greeting())

    # Time / Date
    if "time" in q:
        return _reply("The current time is " + datetime.datetime.now().strftime("%I:%M %p"))
    if "date" in q or "today" in q:
        return _reply("Today is " + datetime.datetime.now().strftime("%A, %d %B %Y"))

    # System info — note: this now describes the SERVER, not the user's PC,
    # so it's a bit misleading on the web. Keeping it but you may want to
    # remove this command later since it doesn't make sense for a hosted app.
    if "my system" in q or "os version" in q or "operating system" in q:
        return _reply(f"Server is running {platform.system()} {platform.release()}.")

    # Web — open sites (returns an action for the frontend to perform)
    if "open youtube" in q or "youtube" in q:
        return _reply("Opening YouTube for you.", action="open_url", url="https://youtube.com")
    if "open google" in q or "open browser" in q:
        return _reply("Opening Google.", action="open_url", url="https://google.com")
    if "open github" in q:
        return _reply("Opening GitHub.", action="open_url", url="https://github.com")

    # Web — search
    if q.startswith("search ") or q.startswith("google "):
        term = q.replace("search ", "").replace("google ", "").strip()
        url = f"https://www.google.com/search?q={term}"
        return _reply(f'Searching Google for "{term}".', action="open_url", url=url)
    if q.startswith("youtube search ") or q.startswith("search youtube "):
        term = q.replace("youtube search ", "").replace("search youtube ", "").strip()
        url = f"https://www.youtube.com/results?search_query={term}"
        return _reply(f'Searching YouTube for "{term}".', action="open_url", url=url)

    # Calculator
    if "calculate" in q or (q.startswith("what is ") and any(c in q for c in "+-*/")):
        expr = q.replace("calculate", "").replace("what is", "").strip()
        result = _safe_eval(expr)
        if result:
            return _reply(result)
        return None  # let Claude handle it

    # Jokes
    if "joke" in q or "make me laugh" in q:
        return _reply(_random_joke())

    # Exit / Goodbye
    if any(w in q for w in ("exit", "bye", "goodbye", "quit", "shut down")):
        return _reply("Goodbye! Have a great day!")

    # No match — return None so caller falls back to Claude
    return None


# ── Helpers ───────────────────────────────────────────────────────────────────

def _reply(text: str, action: str | None = None, url: str | None = None) -> dict:
    return {"reply": text, "action": action, "url": url}


def _greeting() -> str:
    hour = datetime.datetime.now().hour
    if hour < 12:
        period = "morning"
    elif hour < 17:
        period = "afternoon"
    else:
        period = "evening"
    return f"Good {period}! I'm NEXUS. Ask me anything or give me a command."


def _safe_eval(expr: str) -> str | None:
    try:
        allowed = set("0123456789+-*/(). ")
        if not all(c in allowed for c in expr):
            return None  # Let Claude handle complex math questions
        result = eval(expr, {"__builtins__": {}})
        return f"The answer is {result}."
    except Exception:
        return None


def _random_joke() -> str:
    import random
    jokes = [
        "Why do programmers prefer dark mode? Because light attracts bugs!",
        "I told my computer I needed a break. Now it won't stop sending me Kit-Kat ads.",
        "Why did the Python developer go broke? Because they used all their cache.",
        "A SQL query walks into a bar, walks up to two tables and asks... 'Can I join you?'",
        "Why do Java developers wear glasses? Because they don't C#.",
    ]
    return random.choice(jokes)
