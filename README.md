# ⚡ NEXUS — AI-Powered Web Assistant

**NEXUS** is a browser-based conversational AI assistant designed with a modern futuristic interface, voice interaction, intelligent command handling, and AI-powered responses.

Originally inspired by a desktop AI assistant concept, NEXUS has been transformed into a **deployable full-stack web application** that can be accessed directly from a browser.

🔗 **Live Demo:** https://nexus-webb.vercel.app/

---

## ✨ Features

- 🎙️ **Voice Input & Output**  
  Interact with NEXUS using the browser's native Web Speech API without requiring an external voice library.

- 🤖 **AI-Powered Conversations**  
  Uses the Anthropic Claude API to handle open-ended questions and generate intelligent responses.

- ⚡ **Instant Commands**  
  Built-in commands such as:
  - Current time
  - Jokes
  - Website opening
  - Quick web search
  - Calculator
  - Other predefined actions

  These commands are processed locally without an AI API call, providing near-instant responses.

- 🎨 **Futuristic AI Dashboard**  
  Custom dark-themed interface with animated AI-core rings, system diagnostics, status indicators, glowing elements, and an interactive chat interface.

- 🌐 **Web-Based & Deployable**  
  The application is designed to run as a web application and can be accessed remotely without installing a desktop application.

- 📱 **Responsive Interface**  
  The interface adapts to different screen sizes, including desktop, tablet, and mobile devices.

- 🔐 **Backend API Architecture**  
  The frontend communicates with a FastAPI backend through HTTP requests, keeping the AI integration separated from the client-side application.

---

## 🧠 How NEXUS Works

NEXUS follows a simple full-stack architecture:

```text
                USER
                  │
                  ▼
        ┌──────────────────┐
        │    NEXUS UI      │
        │  HTML/CSS/JS     │
        │     Vercel       │
        └────────┬─────────┘
                 │
                 │ HTTPS / JSON
                 ▼
        ┌──────────────────┐
        │   FastAPI        │
        │    Backend       │
        │     Render       │
        └────────┬─────────┘
                 │
                 ▼
        ┌──────────────────┐
        │   Claude API     │
        │    Anthropic     │
        └──────────────────┘
```

### Request Flow

1. The user enters a message or speaks through the microphone.
2. NEXUS determines whether the request is a built-in command or an AI conversation.
3. Built-in commands are handled immediately by the backend.
4. Open-ended questions are sent to the Claude API.
5. The backend returns the response as JSON.
6. The frontend displays the response in the NEXUS interface.
7. When voice output is enabled, the browser converts the response into speech.

This architecture keeps the **frontend responsible for the user interface and browser actions**, while the backend handles API communication and application logic.

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Frontend | HTML5, CSS3, Vanilla JavaScript |
| Voice | Web Speech API |
| Backend | Python, FastAPI |
| AI | Anthropic Claude API |
| API Communication | REST / JSON |
| Frontend Hosting | Vercel |
| Backend Hosting | Render |
| Version Control | Git & GitHub |

---

## 📁 Project Structure

```text
nexus-ai/
│
├── backend/
│   ├── main.py
│   ├── command.py
│   ├── api_client.py
│   ├── requirements.txt
│   └── .env.example
│
├── frontend/
│   ├── index.html
│   ├── style.css
│   └── script.js
│
└── README.md
```

### Backend

**`main.py`**  
Main FastAPI application and API routes.

**`command.py`**  
Handles predefined commands such as time, jokes, calculator, website actions, and search.

**`api_client.py`**  
Responsible for communicating with the Anthropic Claude API.

**`requirements.txt`**  
Contains the Python dependencies required by the backend.

### Frontend

**`index.html`**  
Defines the structure of the NEXUS interface.

**`style.css`**  
Contains the complete futuristic dashboard design, animations, colors, responsive layout, and AI-core interface.

**`script.js`**  
Handles chat interaction, API communication, voice recognition, voice output, and browser-side actions.

---

# 🚀 Running NEXUS Locally

## 1. Clone the Repository

```bash
git clone https://github.com/yashi057/nexus-web.git
cd nexus-web
```

---

## 2. Setup the Backend

Navigate to the backend directory:

```bash
cd backend
```

Create a Python virtual environment:

### Windows

```bash
python -m venv venv
venv\Scripts\activate
```

### macOS / Linux

```bash
python3 -m venv venv
source venv/bin/activate
```

Install dependencies:

```bash
pip install -r requirements.txt
```

---

## 3. Configure Environment Variables

Create a `.env` file inside the `backend` directory.

```env
ANTHROPIC_API_KEY=your_api_key_here
```

Do not commit your API key to GitHub.

Make sure `.env` is included in `.gitignore`.

---

## 4. Start the Backend

Run:

```bash
uvicorn main:app --reload
```

The FastAPI server will normally be available at:

```text
http://localhost:8000
```

---

## 5. Start the Frontend

Open:

```text
frontend/index.html
```

in a modern browser.

For the best voice experience, use:

- Google Chrome
- Microsoft Edge

If your backend is running on a different address, update the backend URL inside:

```text
frontend/script.js
```

---

# 🎙️ Voice Interaction

NEXUS uses the browser's built-in **Web Speech API**.

### Voice Input

The browser's speech recognition system converts your voice into text.

```text
Your Voice
     ↓
Microphone
     ↓
Web Speech API
     ↓
Text
     ↓
NEXUS
```

### Voice Output

AI responses can be converted back into speech using browser speech synthesis.

```text
NEXUS Response
      ↓
Speech Synthesis
      ↓
Your Speakers
```

No separate voice-processing library is required.

---

# ⚡ Built-In Commands

NEXUS can process common commands without calling the AI API.

Examples include:

```text
What time is it?

Tell me a joke.

Open YouTube.

Open Google.

Search for Python tutorials.

Calculate 25 * 18.
```

These commands are handled directly by the application, reducing unnecessary API requests and providing faster responses.

---

# 🤖 AI Conversation

For requests that are not recognized as built-in commands, NEXUS sends the request to the backend.

The backend communicates with the **Anthropic Claude API** and returns the generated response.

```text
User
 ↓
NEXUS Frontend
 ↓
FastAPI Backend
 ↓
Claude API
 ↓
FastAPI Backend
 ↓
NEXUS Frontend
 ↓
User
```

---

# 🌐 Deployment

NEXUS uses a separated deployment architecture.

### Frontend

The frontend can be deployed using:

**Vercel**

### Backend

The FastAPI backend can be deployed using:

**Render**

The frontend communicates with the deployed backend using HTTPS requests.

```text
Browser
   │
   │ HTTPS
   ▼
Vercel
   │
   │ API Request
   ▼
Render
   │
   ▼
Claude API
```

---

# 🔒 Security Considerations

The Claude API key should **never be placed inside frontend JavaScript**.

Instead:

```text
Frontend
   │
   ▼
FastAPI Backend
   │
   ▼
Environment Variable
   │
   ▼
Claude API
```

The API key should be stored securely as an environment variable on the backend server.

---

# 💡 Future Improvements

Possible future enhancements for NEXUS include:

- 🧠 Persistent conversation memory
- 👤 User authentication
- 💾 Conversation history
- 🗣️ Multiple voice options
- 🌍 Multi-language voice support
- 📄 Document/PDF analysis
- 🔎 AI-powered web search
- 📅 Calendar integration
- 📧 Email assistance
- 🖥️ System monitoring dashboard
- 🧩 Plugin/tool integration
- 🎯 Personalized AI responses
- 📱 Progressive Web App support

---

# 🎯 Project Goals

The main goals of NEXUS are to demonstrate how a conversational AI system can combine:

- Artificial Intelligence
- Natural Language Processing
- Voice Interaction
- REST APIs
- FastAPI
- Modern frontend development
- Cloud deployment
- Browser automation

into a single practical web application.

---

# 📸 Interface

NEXUS features a futuristic AI dashboard containing:

- Animated AI core
- System status indicators
- Resource monitoring
- Real-time clock
- Conversational interface
- Voice controls
- Interactive command input
- Responsive layout

---

# 👨‍💻 Author

**Er. Pankaj Kumar**

🔗 GitHub: https://github.com/pankajkumar952

---

## ⭐ Support

If you find **NEXUS** interesting or useful, consider giving the repository a ⭐ on GitHub.

---

## 📜 License

This project is intended for educational and demonstration purposes.