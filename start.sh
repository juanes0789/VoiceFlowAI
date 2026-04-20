#!/bin/bash

# VoiceBot Pro - Quick Start Script

echo "========================================="
echo "VoiceBot Pro - Quick Start"
echo "========================================="
echo ""

# Check if we're in the right directory
if [ ! -d "voicebot-pro" ]; then
    echo "❌ Error: voicebot-pro directory not found"
    echo "Please run this script from the parent directory"
    exit 1
fi

# Function to start backend
start_backend() {
    echo ""
    echo "🔧 Starting Backend..."
    cd voicebot-pro/backend

    # Check if .env exists
    if [ ! -f ".env" ]; then
        echo "⚠️  .env file not found. Creating from .env.example..."
        cp .env.example .env
        echo "⚠️  Please add your OPENROUTER_API_KEY to .env"
    fi

    # Check if venv exists
    if [ ! -d "venv" ]; then
        echo "📦 Creating virtual environment..."
        python -m venv venv
        source venv/bin/activate
        pip install -r requirements.txt
    else
        source venv/bin/activate
    fi

    echo "✅ Backend starting at http://localhost:8000"
    uvicorn main:app --reload
}

# Function to start frontend
start_frontend() {
    echo ""
    echo "⚛️  Starting Frontend..."
    cd voicebot-pro/frontend

    # Check if .env.local exists
    if [ ! -f ".env.local" ]; then
        echo "⚠️  .env.local file not found. Creating from .env.local.example..."
        cp .env.local.example .env.local
    fi

    # Check if node_modules exists
    if [ ! -d "node_modules" ]; then
        echo "📦 Installing dependencies..."
        npm install
    fi

    echo "✅ Frontend starting at http://localhost:3000"
    npm run dev
}

# Show usage
if [ "$1" == "backend" ]; then
    start_backend
elif [ "$1" == "frontend" ]; then
    start_frontend
else
    echo "Usage: $0 [backend|frontend]"
    echo ""
    echo "Examples:"
    echo "  $0 backend    - Start the FastAPI backend"
    echo "  $0 frontend   - Start the Next.js frontend"
    echo ""
    echo "Note: Run these commands in separate terminal windows"
fi

