# VoiceBot Pro — AI English Fluency Coach

🎤 An AI-powered English speaking tutor designed specifically for Spanish speakers. Practice your English fluency through natural voice conversations with intelligent, real-time feedback.

---

## ✨ Features

- **🎤 Voice Interaction**: Speak naturally using your microphone with Web Speech API
- **🤖 AI-Powered Tutoring**: Get responses from advanced language models via OpenRouter
- **📊 Real-time Feedback**: Grammar, fluency, and confidence scores for every interaction
- **🌍 Multiple Learning Modes**:
  - Casual Conversation
  - Job Interview Preparation
  - Travel English
  - Tech Workplace English
  - Daily Practice
- **🔊 Voice Response**: AI responses are automatically read aloud
- **💬 Gentle Corrections**: Grammar mistakes are corrected naturally and constructively
- **🎨 Premium UI/UX**: Modern, responsive interface with smooth animations
- **⚡ Real-time Conversation History**: Maintains context across the conversation

---

## 🛠️ Tech Stack

### Frontend
- **Next.js 14** - App Router for modern React development
- **React 18** - Component-based UI
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first styling
- **Lucide Icons** - Beautiful icon library
- **Web Speech API** - Browser-native speech recognition and synthesis

### Backend
- **FastAPI** - High-performance Python web framework
- **Python 3.11+** - Latest Python runtime
- **Pydantic** - Data validation with Python type hints
- **Uvicorn** - ASGI server
- **OpenRouter API** - Access to free language models

### AI Model
- **DeepSeek Chat v3** (Free via OpenRouter) - Advanced conversation model

---

## 📋 Prerequisites

- Node.js 18+ and npm/yarn
- Python 3.11+
- OpenRouter API key (free at https://openrouter.ai)
- Modern browser with Web Speech API support

---

## 🚀 Setup Instructions

### Backend Setup

1. Navigate to the backend directory:
```bash
cd voicebot-pro/backend
```

2. Create a Python virtual environment:
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

3. Install dependencies:
```bash
pip install -r requirements.txt
```

4. Create `.env` file from example:
```bash
cp .env.example .env
```

5. Add your OpenRouter API key to `.env`:
```
OPENROUTER_API_KEY=your_actual_api_key_here
```

6. Run the backend server:
```bash
uvicorn main:app --reload
```

The backend will start at `http://localhost:8000`

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd voicebot-pro/frontend
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Create `.env.local` from example:
```bash
cp .env.local.example .env.local
```

4. Run the development server:
```bash
npm run dev
# or
yarn dev
```

The frontend will start at `http://localhost:3000`

---

## 🎯 Running the Full Application

### Terminal 1 - Backend
```bash
cd voicebot-pro/backend
source venv/bin/activate
uvicorn main:app --reload
```

### Terminal 2 - Frontend
```bash
cd voicebot-pro/frontend
npm run dev
```

Then open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🐳 Docker Deployment (Portfolio Ready)

This project is ready to run as a full containerized stack for demos and portfolio presentations.

### 1) Prepare environment

```bash
cd voicebot-pro
cp backend/.env.example backend/.env
cp .env.docker.example .env.docker
```

Edit `backend/.env` and set your real key:

```env
OPENROUTER_API_KEY=your_real_openrouter_api_key
```

### 2) Build and run with Docker Compose

```bash
cd voicebot-pro
docker compose --env-file .env.docker up --build
```

### 3) Access the app

- Frontend: `http://localhost:3000`
- Backend health: `http://localhost:8000/health`

### 4) Stop containers

```bash
cd voicebot-pro
docker compose --env-file .env.docker down
```

### Why this is useful for your AI voice portfolio

- Reproducible startup in one command.
- Clear separation between `frontend` and `backend` services.
- Environment-driven configuration (`OPENROUTER_API_KEY`, CORS, API URL).
- Easy to deploy later to cloud VMs or container platforms.

---

## ☁️ Public URL Deployment (Render Blueprint)

If you want a public URL so recruiters can test the app immediately, use `render.yaml`.

### 1) Push repository to GitHub

Make sure only templates are committed (`.env.example` files), not real secrets.

### 2) Create Render Blueprint

1. Go to Render Dashboard.
2. New → Blueprint.
3. Select this repository and branch.
4. Render reads `render.yaml` and creates:
   - `voicebot-backend`
   - `voicebot-frontend`

### 3) Set environment variables in Render

For `voicebot-backend`:

- `OPENROUTER_API_KEY` = your real key
- `CORS_ORIGINS` = frontend public URL (for example `https://voicebot-frontend.onrender.com`)

For `voicebot-frontend`:

- `NEXT_PUBLIC_API_URL` = backend public URL (for example `https://voicebot-backend.onrender.com`)

### 4) Deploy and validate

- Backend health: `GET /health`
- Frontend loads at Render URL
- Send one chat message and confirm response + voice flow

### 5) Share portfolio URL

Use the frontend Render URL as your demo link in CV, LinkedIn, and GitHub profile.

---

## 🧠 Portfolio Showcase: AI Voice Architecture

Use this section in interviews to explain the engineering value of the project.

### System Architecture

```text
Browser (Next.js)
  ├─ SpeechRecognition (STT, en-US/en-GB)
  ├─ Voice UX (audio level, transcript preview, auto-listen)
  ├─ Chat UI + scoring display
  └─ SpeechSynthesis (TTS accent selector)
          │
          ▼
FastAPI Backend
  ├─ /chat endpoint
  ├─ in-memory context (last turns)
  ├─ mode-aware tutoring prompt
  └─ fallback model strategy + error handling
          │
          ▼
OpenRouter API
  └─ DeepSeek / fallback models
```

### Voice Interaction Loop

1. User speaks in English using browser microphone.
2. Frontend transcribes speech in real time and shows editable preview.
3. Frontend sends the final message to `POST /chat`.
4. Backend enriches prompt with tutoring rules + conversation context.
5. Backend calls OpenRouter and returns concise feedback + score.
6. Frontend renders response and plays TTS in selected accent.
7. Auto-listen starts again after bot speech for fluent conversation.

### Engineering Highlights (What to mention in interviews)

- Real-time voice UX with STT + TTS in the browser.
- Prompt engineering for concise tutoring behavior and correction style.
- Backend resilience with model fallback and controlled error responses.
- End-to-end Dockerized stack (`frontend` + `backend`) for reproducible demos.
- Clean separation of concerns: UI, speech utilities, API client, and service layer.

### 2-Minute Demo Script (Interview Ready)

1. **Problem**: "Spanish speakers need low-friction speaking practice in English."
2. **Solution**: "I built a full-stack AI voice tutor with real-time conversation."
3. **Live Flow**:
   - Select accent and mode (Casual / Interview / Tech).
   - Speak a prompt in English.
   - Show transcript preview before send.
   - Receive concise AI correction + score.
   - Let TTS answer and auto-listen continue the conversation.
4. **Architecture**: "Next.js handles voice UX, FastAPI orchestrates prompt + context, OpenRouter serves model inference."
5. **Production mindset**: "Containerized with Docker Compose, env-based config, CORS control, health checks, and modular codebase."

---

## 📡 API Endpoints

### Health Check
```
GET /health
```
Response:
```json
{
  "status": "ok",
  "service": "VoiceBot Pro"
}
```

### Chat
```
POST /chat
```
Request:
```json
{
  "message": "Hello, how are you?",
  "mode": "casual"
}
```
Response:
```json
{
  "reply": "I'm doing great! How are you?",
  "correction": null,
  "score": {
    "grammar": 8,
    "fluency": 7,
    "confidence": 8
  }
}
```

### Reset Conversation
```
POST /reset
```
Response:
```json
{
  "status": "success",
  "message": "Conversation history cleared"
}
```

---

## 🎨 UI/UX Design

### Color Scheme
- **Background**: `#0a0a0f` - Deep dark
- **Card**: `#111118` - Slightly lighter dark
- **Accent**: `#7c6af7` - Purple accent
- **Text**: White - High contrast
- **Muted**: Gray - Secondary text

### Typography
- **Headings**: Space Mono (monospace)
- **Body**: DM Sans (sans-serif)

### Components
- Rounded cards with subtle borders
- Smooth animations and transitions
- Hover effects with accent color
- Responsive design for mobile and desktop
- Loading indicators and typing animations

---

## 📱 Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Requires Web Speech API support

---

## 🔐 Environment Variables

### Backend (.env)
```
OPENROUTER_API_KEY=your_key_here
```

### Frontend (.env.local)
```
NEXT_PUBLIC_API_URL=http://localhost:8000
```

### Public GitHub Safety Checklist

- Keep real secrets only in local files (`backend/.env`, `.env.docker`) and never commit them.
- Commit only example templates (`backend/.env.example`, `frontend/.env.local.example`, `.env.docker.example`).
- Rotate API keys immediately if they were ever copied into logs, screenshots, or commits.
- Verify `.gitignore` before pushing (`.env`, `node_modules`, `.next`, `venv`, build artifacts).

---

## 📦 Project Structure

```
voicebot-pro/
│
├── frontend/
│   ├── app/
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   └── globals.css
│   ├── components/
│   │   ├── Button.tsx
│   │   ├── ChatMessage.tsx
│   │   ├── Header.tsx
│   │   ├── MicrophoneButton.tsx
│   │   ├── ModeSelector.tsx
│   │   ├── TypingIndicator.tsx
│   │   └── WelcomeState.tsx
│   ├── lib/
│   │   └── api.ts
│   ├── package.json
│   ├── tsconfig.json
│   ├── tailwind.config.ts
│   └── next.config.js
│
├── backend/
│   ├── main.py
│   ├── requirements.txt
│   ├── models/
│   │   └── __init__.py
│   ├── services/
│   │   └── __init__.py
│   ├── prompts/
│   │   └── __init__.py
│   └── routes/
│       └── __init__.py
│
└── README.md
```

---

## 🚀 Future Roadmap

- [ ] User authentication and profiles
- [ ] Conversation history database
- [ ] Progress tracking and statistics
- [ ] Pronunciation analysis
- [ ] Video lessons
- [ ] Vocabulary builder with spaced repetition
- [ ] Gamification and achievements
- [ ] Mobile native apps (iOS/Android)
- [ ] Advanced metrics dashboard
- [ ] Custom AI model fine-tuning

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

---

## 📄 License

MIT License - feel free to use this project for personal or commercial use.

---

## 💬 Support

For issues or questions:
- Check the documentation
- Review the API endpoints
- Ensure environment variables are set correctly
- Verify backend and frontend are running

---

## 🙏 Acknowledgments

- OpenRouter for free access to advanced language models
- Next.js team for the excellent React framework
- Tailwind CSS for utility-first styling
- The open-source community

---

**Happy learning! 🎉**

