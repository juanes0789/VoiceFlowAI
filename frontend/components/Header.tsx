'use client'

import React from 'react'
import { Brain } from 'lucide-react'

export function Header() {
  return (
    <div className="bg-gradient-to-b from-card to-background border-b border-gray-800 px-6 py-4 mb-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-accent rounded-lg">
            <Brain className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold font-mono text-gradient">VoiceBot Pro</h1>
            <p className="text-xs text-muted">AI English Tutor</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-card px-3 py-1.5 rounded-full border border-gray-700">
            <span className="inline-block w-2 h-2 rounded-full bg-green-400 animate-pulse-soft" />
            <span className="text-xs text-muted">Online</span>
          </div>

          <div className="flex gap-2">
            <span className="px-2 py-1 bg-accent/20 text-accent text-xs rounded-full border border-accent/30">
              Voice Enabled
            </span>
            <span className="px-2 py-1 bg-purple-500/20 text-purple-300 text-xs rounded-full border border-purple-500/30">
              AI Tutor
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

