/*
NEXUS Frontend Logic
====================

IMPORTANT:
BACKEND_URL points to your FastAPI backend.

For local testing:
const BACKEND_URL = "http://127.0.0.1:8000";

For the deployed backend:
use your Render/Railway backend URL.
*/

const BACKEND_URL = "https://jarvis-web-mrdw.onrender.com";

// ─────────────────────────────────────────────────────────────
// Elements
// ─────────────────────────────────────────────────────────────

const chatScroll = document.getElementById("chatScroll");
const messageInput = document.getElementById("messageInput");
const transmitBtn = document.getElementById("transmitBtn");
const voiceBtn = document.getElementById("voiceBtn");
const clearBtn = document.getElementById("clearBtn");
const typingIndicator = document.getElementById("typingIndicator");
const typingDots = document.getElementById("typingDots");
const statusText = document.getElementById("statusText");
const modeText = document.getElementById("modeText");
const clockEl = document.getElementById("clock");
const dateEl = document.getElementById("date");

const cpuFill = document.getElementById("cpuFill");
const ramFill = document.getElementById("ramFill");
const batFill = document.getElementById("batFill");

const cpuValue = document.getElementById("cpuValue");
const ramValue = document.getElementById("ramValue");
const batValue = document.getElementById("batValue");


// ─────────────────────────────────────────────────────────────
// Clock
// ─────────────────────────────────────────────────────────────

function updateClock() {
    const now = new Date();

    clockEl.textContent = now.toLocaleTimeString("en-GB");

    const days = [
        "SUNDAY",
        "MONDAY",
        "TUESDAY",
        "WEDNESDAY",
        "THURSDAY",
        "FRIDAY",
        "SATURDAY"
    ];

    const months = [
        "JAN",
        "FEB",
        "MAR",
        "APR",
        "MAY",
        "JUN",
        "JUL",
        "AUG",
        "SEP",
        "OCT",
        "NOV",
        "DEC"
    ];

    dateEl.textContent =
        `${days[now.getDay()]} // ` +
        `${String(now.getDate()).padStart(2, "0")} ` +
        `${months[now.getMonth()]} ` +
        `${now.getFullYear()}`;
}

updateClock();
setInterval(updateClock, 1000);


// ─────────────────────────────────────────────────────────────
// Decorative System Statistics
// ─────────────────────────────────────────────────────────────

function animateStatBar(fillEl, valueEl, base) {
    const value = Math.max(
        5,
        Math.min(95, base + (Math.random() * 10 - 5))
    );

    fillEl.style.width = value + "%";
    valueEl.textContent = Math.round(value) + "%";
}

setInterval(() => {
    animateStatBar(cpuFill, cpuValue, 20);
    animateStatBar(ramFill, ramValue, 55);
    animateStatBar(batFill, batValue, 80);
}, 2000);


// ─────────────────────────────────────────────────────────────
// Chat Rendering
// ─────────────────────────────────────────────────────────────

function addMessage(sender, text) {
    const wrapper = document.createElement("div");

    wrapper.className =
        sender === "NEXUS"
            ? "msg msg-jarvis"
            : "msg msg-you";

    const header = document.createElement("div");
    header.className = "msg-header";

    const time = new Date().toLocaleTimeString("en-GB", {
        hour: "2-digit",
        minute: "2-digit"
    });

    header.textContent = `[${time}] ${sender}`;

    const body = document.createElement("div");
    body.textContent = text;

    wrapper.appendChild(header);
    wrapper.appendChild(body);

    chatScroll.insertBefore(wrapper, typingIndicator);

    chatScroll.scrollTop = chatScroll.scrollHeight;
}


function addSystemLine(text) {
    const line = document.createElement("div");

    line.className = "msg-system";
    line.textContent = `// ${text}`;

    chatScroll.insertBefore(line, typingIndicator);

    chatScroll.scrollTop = chatScroll.scrollHeight;
}


// ─────────────────────────────────────────────────────────────
// Typing Indicator
// ─────────────────────────────────────────────────────────────

function showTyping() {
    typingIndicator.style.display = "block";

    let dots = 0;

    window._typingInterval = setInterval(() => {
        dots = (dots + 1) % 4;
        typingDots.textContent = ".".repeat(dots);
    }, 400);
}


function hideTyping() {
    typingIndicator.style.display = "none";

    clearInterval(window._typingInterval);
}


// ─────────────────────────────────────────────────────────────
// System Status
// ─────────────────────────────────────────────────────────────

function setStatus(mode) {
    const modes = {
        STANDBY: [
            "[ SYSTEM ONLINE ]",
            "MODE: STANDBY"
        ],

        PROCESSING: [
            "[ PROCESSING ... ]",
            "MODE: NEURAL ACTIVE"
        ],

        VOICE: [
            "[ LISTENING ... ]",
            "MODE: VOICE INPUT"
        ]
    };

    const [status, sub] = modes[mode] || modes.STANDBY;

    statusText.textContent = status;
    modeText.textContent = sub;
}


// ─────────────────────────────────────────────────────────────
// Text-to-Speech
// ─────────────────────────────────────────────────────────────

function speak(text) {
    if (!("speechSynthesis" in window)) {
        return;
    }

    window.speechSynthesis.cancel();

    const utter = new SpeechSynthesisUtterance(text);

    utter.rate = 1.05;
    utter.pitch = 1;

    window.speechSynthesis.speak(utter);
}


// ─────────────────────────────────────────────────────────────
// Backend Communication
// ─────────────────────────────────────────────────────────────

async function sendToBackend(message) {
    const response = await fetch(`${BACKEND_URL}/chat`, {
        method: "POST",

        headers: {
            "Content-Type": "application/json"
        },

        body: JSON.stringify({
            message: message
        })
    });

    if (!response.ok) {
        throw new Error(
            `Backend returned ${response.status}`
        );
    }

    return response.json();
}


// ─────────────────────────────────────────────────────────────
// Handle User Query
// ─────────────────────────────────────────────────────────────

async function handleQuery(query) {
    setStatus("PROCESSING");
    showTyping();

    try {
        const data = await sendToBackend(query);

        hideTyping();

        addMessage("NEXUS", data.reply);

        speak(data.reply);

        // If the backend tells us to open a URL,
        // the frontend opens it in the user's browser.
        if (data.action === "open_url" && data.url) {
            window.open(data.url, "_blank");
        }

    } catch (err) {
        hideTyping();

        addMessage(
            "NEXUS",
            "Sorry, I couldn't reach the backend. Please check whether the server is running."
        );

        console.error("Backend Error:", err);
    }

    setStatus("STANDBY");
}


// ─────────────────────────────────────────────────────────────
// Text Input
// ─────────────────────────────────────────────────────────────

function sendText() {
    const query = messageInput.value.trim();

    if (!query) {
        return;
    }

    messageInput.value = "";

    addMessage("YOU", query);

    handleQuery(query);
}


transmitBtn.addEventListener("click", sendText);


messageInput.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
        sendText();
    }
});


// ─────────────────────────────────────────────────────────────
// Voice Input
// ─────────────────────────────────────────────────────────────

const SpeechRecognition =
    window.SpeechRecognition ||
    window.webkitSpeechRecognition;

let recognition = null;


if (SpeechRecognition) {
    recognition = new SpeechRecognition();

    recognition.lang = "en-IN";
    recognition.continuous = false;
    recognition.interimResults = false;


    recognition.onstart = () => {
        voiceBtn.classList.add("listening");

        setStatus("VOICE");
    };


    recognition.onresult = (event) => {
        const transcript =
            event.results[0][0].transcript;

        addMessage(
            "YOU (VOICE)",
            transcript
        );

        handleQuery(transcript);
    };


    recognition.onerror = (event) => {
        console.error(
            "Speech recognition error:",
            event.error
        );

        addSystemLine(
            `VOICE ERROR: ${event.error}`
        );

        voiceBtn.classList.remove("listening");

        setStatus("STANDBY");
    };


    recognition.onend = () => {
        voiceBtn.classList.remove("listening");

        setStatus("STANDBY");
    };

} else {
    voiceBtn.disabled = true;

    voiceBtn.title =
        "Voice input is not supported in this browser. Try Chrome or Edge.";
}


// Prevent multiple recognition sessions
voiceBtn.addEventListener("click", () => {
    if (!recognition) {
        return;
    }

    try {
        recognition.start();
    } catch (error) {
        console.log(
            "Voice recognition is already active."
        );
    }
});


// ─────────────────────────────────────────────────────────────
// Clear Chat Log
// ─────────────────────────────────────────────────────────────

clearBtn.addEventListener("click", () => {
    document
        .querySelectorAll(".msg, .msg-system")
        .forEach((element) => element.remove());

    addSystemLine("LOG CLEARED");
});


// ─────────────────────────────────────────────────────────────
// Boot Sequence
// ─────────────────────────────────────────────────────────────

function bootSequence() {
    const lines = [
        [
            "INITIALIZING N.E.X.U.S // MARK VII ...",
            0
        ],

        [
            "LOADING NEURAL PATHWAYS ...",
            300
        ],

        [
            "VOICE ENGINE: ONLINE",
            600
        ],

        [
            "SPEECH RECOGNITION: ONLINE",
            900
        ],

        [
            "AI CORE: CONNECTING ...",
            1200
        ],

        [
            "ALL SYSTEMS NOMINAL. WELCOME BACK.",
            1800
        ]
    ];

    lines.forEach(([text, delay]) => {
        setTimeout(() => {
            addSystemLine(text);
        }, delay);
    });

    setTimeout(bootGreet, 2200);
}


// ─────────────────────────────────────────────────────────────
// Boot Greeting
// ─────────────────────────────────────────────────────────────

function bootGreet() {
    const hour = new Date().getHours();

    let greet;

    if (hour < 12) {
        greet = "Good morning";
    } else if (hour >= 17) {
        greet = "Good evening";
    } else {
        greet = "Good afternoon";
    }

    const msg =
        `${greet}. All systems online. ` +
        "How can I assist you today?";

    addMessage("NEXUS", msg);

    speak(msg);
}


// ─────────────────────────────────────────────────────────────
// Start NEXUS
// ─────────────────────────────────────────────────────────────

bootSequence();