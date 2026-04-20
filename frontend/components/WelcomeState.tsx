'use client'

import React from 'react'
import { Sparkles } from 'lucide-react'

export function WelcomeState() {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center px-6">
      <div className="mb-6">
        <Sparkles className="w-16 h-16 text-accent mx-auto" />
      </div>

      <h2 className="text-3xl font-bold font-mono mb-3 text-gradient">
        Welcome to VoiceBot Pro
      </h2>

      <p className="text-muted text-lg mb-8 max-w-md">
        Start your English learning journey. Speak naturally and improve your fluency with AI-powered feedback.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full max-w-2xl">
        <div className="card-base p-4">
          <div className="text-2xl mb-2">🎤</div>
          <h3 className="font-mono font-bold text-sm mb-1">Voice Enabled</h3>
          <p className="text-xs text-muted">Speak naturally, not type</p>
        </div>

        <div className="card-base p-4">
          <div className="text-2xl mb-2">🤖</div>
          <h3 className="font-mono font-bold text-sm mb-1">AI Feedback</h3>
          <p className="text-xs text-muted">Get instant corrections</p>
        </div>

        <div className="card-base p-4">
          <div className="text-2xl mb-2">📚</div>
          <h3 className="font-mono font-bold text-sm mb-1">Multiple Modes</h3>
          <p className="text-xs text-muted">Choose your learning style</p>
        </div>
      </div>

      <p className="text-xs text-muted mt-8">
        Click the microphone button or type to start learning
      </p>
    </div>
  )
}

