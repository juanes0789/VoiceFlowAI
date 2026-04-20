'use client'

import React, { useState } from 'react'
import { Volume2, VolumeX } from 'lucide-react'
import { speakText } from '@/lib/speech'

interface ChatMessageProps {
  role: 'user' | 'assistant'
  content: string
  score?: {
    grammar: number
    fluency: number
    confidence: number
  }
  onSpeak?: (text: string) => void
  speechLang?: string
}

export function ChatMessage({ role, content, score, onSpeak, speechLang = 'en-US' }: ChatMessageProps) {
  const [isPlaying, setIsPlaying] = useState(false)

  const handleSpeak = () => {
    if (isPlaying) {
      window.speechSynthesis.cancel()
      setIsPlaying(false)
    } else {
      setIsPlaying(true)
      speakText(content, {
        lang: speechLang,
        onEnd: () => setIsPlaying(false),
        onError: () => setIsPlaying(false),
      })
      onSpeak?.(content)
    }
  }

  const isUser = role === 'user'

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4 animate-bounce-gentle`}>
      <div
        className={`max-w-xs lg:max-w-md px-4 py-3 rounded-2xl transition-smooth ${
          isUser
            ? 'bg-accent text-white rounded-br-none'
            : 'bg-card border border-gray-700 text-white rounded-bl-none'
        }`}
      >
        <p className="text-sm leading-relaxed">{content}</p>

        {!isUser && (
          <div className="mt-3 flex items-center gap-3">
            <button
              onClick={handleSpeak}
              className="text-accent hover:text-accent/80 transition-smooth"
              title={isPlaying ? 'Stop speaking' : 'Speak'}
            >
              {isPlaying ? (
                <VolumeX className="w-4 h-4" />
              ) : (
                <Volume2 className="w-4 h-4" />
              )}
            </button>

            {score && (
              <div className="flex gap-2 text-xs text-muted">
                <span>G: {score.grammar}</span>
                <span>F: {score.fluency}</span>
                <span>C: {score.confidence}</span>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

