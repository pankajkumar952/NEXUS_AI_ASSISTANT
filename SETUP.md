# NEXUS Web — Local testing guide

Follow these steps IN ORDER on your own computer (Windows CMD/PowerShell, since that's what you're used to).

## Step 1 — Set up the backend

```
cd nexus-web/backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
```

## Step 2 — Add your API key

1. Copy `.env.example` to a new file called `.env` (same folder).
2. Open `.env` and paste your real Anthropic API key:
   ```
   ANTHROPIC_API_KEY=sk-ant-xxxxxxxxxxxxx
   ```
3. Save. This file is already in `.gitignore` so it won't accidentally get pushed to GitHub.

## Step 3 — Start the backend

```
uvicorn main:app --reload
```

You should see:
```
Uvicorn running on http://127.0.0.1:8000
```

Leave this terminal running. Open `http://127.0.0.1:8000` in a browser — you should see
`{"status":"NEXUS backend is online"}`. If you see that, the backend works.

## Step 4 — Open the frontend

Just double-click `nexus-web/frontend/index.html` — it'll open in your default browser.
(Chrome or Edge recommended — voice input needs one of these, Firefox doesn't support
the Web Speech API well.)

## Step 5 — Test it

- Type "hello" and hit Transmit — you should get a NEXUS reply.
- Type "tell me a joke" — should get an instant joke (no Claude API call, it's a
  built-in command from command.py).
- Type "what is the capital of France" — this one isn't a built-in command, so it'll
  fall through to Claude and take a second longer.
- Click the 🎙 mic button and say "open youtube" — it should transcribe your voice,
  send it to the backend, get back an action, and open YouTube in a new tab.

## Troubleshooting

- **"Sorry, I couldn't reach the backend"** → Check Step 3's terminal is still running
  and didn't crash. Check `BACKEND_URL` in `script.js` matches your backend's address.
- **Mic button greyed out** → Your browser doesn't support Web Speech API. Use Chrome/Edge.
- **No sound on NEXUS replies** → Some browsers require a page click before allowing
  audio — click anywhere on the page once, then try again.
