# 🚀 VoiceBot Pro - Quick Start Guide

Get started with VoiceBot Pro in 5 minutes!

## Prerequisites

- Node.js 18+ ([Download](https://nodejs.org))
- Python 3.11+ ([Download](https://python.org))
- OpenRouter API key ([Get Free Access](https://openrouter.ai))

## Step 1: Get Your API Key

1. Go to [openrouter.ai](https://openrouter.ai)
2. Sign up or log in
3. Navigate to API Keys
4. Copy your API key

## Step 2: Configure Backend

### Terminal 1 - Backend Setup

```bash
# Navigate to backend
cd voicebot-pro/backend

# Create .env file
cp .env.example .env

# Open .env and add your API key
# OPENROUTER_API_KEY=sk-or-xxxxxxxxxxxx
```

### Install and Run Backend

```bash
# Create virtual environment
python -m venv venv

# Activate virtual environment
source venv/bin/activate  # macOS/Linux
# or
venv\Scripts\activate     # Windows

# Install dependencies
pip install -r requirements.txt

# Run backend
uvicorn main:app --reload
```

✅ Backend running at `http://localhost:8000`

## Step 3: Configure Frontend

### Terminal 2 - Frontend Setup

```bash
# Navigate to frontend
cd voicebot-pro/frontend

# Create .env.local
cp .env.local.example .env.local
```

### Install and Run Frontend

```bash
# Install dependencies
npm install

# Run frontend
npm run dev
```

✅ Frontend running at `http://localhost:3000`

## Step 4: Test the Application

1. Open [http://localhost:3000](http://localhost:3000) in your browser
2. You should see the VoiceBot Pro dashboard
3. Click the microphone button and speak
4. Wait for the AI response
5. The response will be read aloud automatically

## Troubleshooting

### Backend Connection Error
- Make sure backend is running on `http://localhost:8000`
- Check the error message in the frontend console
- Verify `.env` has a valid `OPENROUTER_API_KEY`

### No API Key Errors
- Go to [openrouter.ai](https://openrouter.ai) and get a free API key
- Add it to `backend/.env`
- Restart the backend

### Microphone Not Working
- Check if your browser supports Web Speech API (Chrome, Edge, Safari)
- Grant microphone permissions when prompted
- Try in incognito mode

### Frontend Won't Start
- Clear `node_modules`: `rm -rf node_modules`
- Reinstall: `npm install`
- Clear Next.js cache: `rm -rf .next`

## API Endpoints

Test with curl:

```bash
# Health check
curl http://localhost:8000/health

# Chat (test message)
curl -X POST http://localhost:8000/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "Hello", "mode": "casual"}'

# Reset conversation
curl -X POST http://localhost:8000/reset
```

## Next Steps

1. ✅ Explore all 5 learning modes
2. ✅ Practice daily conversations
3. ✅ Check your grammar, fluency, and confidence scores
4. ✅ Try interview preparation mode
5. ✅ Share feedback and suggestions

## Need Help?

- Read the main [README.md](README.md)
- Check backend logs for errors
- Verify API key in OpenRouter dashboard
- Test the API endpoints manually

---

**Happy learning! 🎉**

