'use client'

import React, { useState } from 'react'
import { ChevronDown } from 'lucide-react'

interface ModeSelectorProps {
  onModeChange: (mode: string) => void
}

export function ModeSelector({ onModeChange }: ModeSelectorProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [selectedMode, setSelectedMode] = useState('casual')

  const modes = [
    { id: 'casual', label: 'Casual Conversation' },
    { id: 'interview', label: 'Job Interview' },
    { id: 'travel', label: 'Travel English' },
    { id: 'tech', label: 'Tech English' },
    { id: 'daily', label: 'Daily Practice' },
  ]

  const handleModeChange = (mode: string) => {
    setSelectedMode(mode)
    onModeChange(mode)
    setIsOpen(false)
  }

  const currentModeLabel = modes.find((m) => m.id === selectedMode)?.label || 'Casual Conversation'

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-4 py-2 rounded-lg bg-card border border-gray-700 text-left flex items-center justify-between hover:border-accent transition-smooth text-sm"
      >
        <span className="text-white">{currentModeLabel}</span>
        <ChevronDown
          className={`w-4 h-4 text-accent transition-transform ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-card border border-gray-700 rounded-lg shadow-lg z-50">
          {modes.map((mode) => (
            <button
              key={mode.id}
              onClick={() => handleModeChange(mode.id)}
              className={`w-full px-4 py-2 text-left text-sm transition-smooth ${
                selectedMode === mode.id
                  ? 'bg-accent text-white'
                  : 'text-muted hover:bg-gray-800'
              } first:rounded-t-lg last:rounded-b-lg`}
            >
              {mode.label}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

