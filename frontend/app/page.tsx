'use client'

import React, { useState, useRef, useEffect } from 'react'
import { Header } from '@/components/Header'
import { ModeSelector } from '@/components/ModeSelector'
import { ChatMessage } from '@/components/ChatMessage'
import { MicrophoneButton } from '@/components/MicrophoneButton'
import { TypingIndicator } from '@/components/TypingIndicator'
import { WelcomeState } from '@/components/WelcomeState'
import { Button } from '@/components/Button'
import { chat, resetConversation, healthCheck } from '@/lib/api'
import { speakText } from '@/lib/speech'
import { Send, RotateCcw } from 'lucide-react'

interface Message {
  role: 'user' | 'assistant'
  content: string
  score?: {
    grammar: number
    fluency: number
    confidence: number
  }
}

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([])
  const [inputValue, setInputValue] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [mode, setMode] = useState('casual')
  const [apiConnected, setApiConnected] = useState(false)
  const [isVoiceDraft, setIsVoiceDraft] = useState(false)
  const [speechLang, setSpeechLang] = useState<'en-US' | 'en-GB' | 'en-AU'>('en-US')
  const [autoListenSignal, setAutoListenSignal] = useState(0)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    const checkConnection = async () => {
      const connected = await healthCheck()
      setApiConnected(connected)
    }
    checkConnection()
  }, [])

  useEffect(() => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return
    window.speechSynthesis.getVoices()
  }, [])

  const handleSendMessage = async (messageText?: string) => {
    const textToSend = messageText || inputValue.trim()

    if (!textToSend || isLoading || !apiConnected) return

    setInputValue('')
    setIsVoiceDraft(false)
    setMessages((prev) => [...prev, { role: 'user', content: textToSend }])
    setIsLoading(true)

    try {
      const response = await chat({ message: textToSend, mode })

      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: response.reply,
          score: response.score,
        },
      ])

      speakText(response.reply, {
        lang: speechLang,
        onEnd: () => {
          setAutoListenSignal((prev) => prev + 1)
        },
      })
    } catch (error) {
      console.error('Error sending message:', error)
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: 'Sorry, I encountered an error. Please try again.',
        },
      ])
    } finally {
      setIsLoading(false)
    }
  }

  const handleReset = async () => {
    try {
      await resetConversation()
      setMessages([])
      setInputValue('')
    } catch (error) {
      console.error('Error resetting conversation:', error)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const handleTranscript = (transcript: string, isFinal: boolean) => {
    setInputValue(transcript)
    setIsVoiceDraft(!isFinal)
  }

  return (
    <div className="h-screen bg-background flex flex-col">
      <Header />

      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Chat Area */}
        <div className="flex-1 overflow-y-auto px-4 lg:px-12 py-6">
          {messages.length === 0 ? (
            <WelcomeState />
          ) : (
            <div className="max-w-3xl mx-auto">
              {messages.map((msg, index) => (
                <ChatMessage
                  key={index}
                  role={msg.role}
                  content={msg.content}
                  score={msg.score}
                  speechLang={speechLang}
                />
              ))}
              {isLoading && (
                <div className="flex justify-start mb-4">
                  <div className="card-base px-4 py-3">
                    <TypingIndicator />
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        {/* Input Area */}
        <div className="border-t border-gray-800 bg-card/50 backdrop-blur px-4 lg:px-12 py-6">
          <div className="max-w-3xl mx-auto">
            {/* Mode Selector */}
            <div className="mb-4">
              <label className="text-xs text-muted mb-2 block">Learning Mode</label>
              <ModeSelector onModeChange={setMode} />
            </div>

            <div className="mb-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-muted mb-2 block">Accent</label>
                <select
                  value={speechLang}
                  onChange={(e) => setSpeechLang(e.target.value as 'en-US' | 'en-GB' | 'en-AU')}
                  className="w-full px-4 py-2 rounded-lg bg-card border border-gray-700 text-sm text-white hover:border-accent transition-smooth"
                >
                  <option value="en-US">English (US)</option>
                  <option value="en-GB">English (UK)</option>
                  <option value="en-AU">English (AU)</option>
                </select>
              </div>

              <div className="flex items-end">
                <div className="w-full px-4 py-2 rounded-lg border border-gray-700 bg-card text-sm text-muted">
                  Auto-listen: On after bot voice ends
                </div>
              </div>
            </div>

            {/* Input Controls */}
            <div className="flex gap-3 items-end">
              <MicrophoneButton
                onTranscript={handleTranscript}
                disabled={isLoading || !apiConnected}
                language={speechLang}
                autoStartSignal={autoListenSignal}
              />

              <textarea
                value={inputValue}
                onChange={(e) => {
                  setInputValue(e.target.value)
                  setIsVoiceDraft(false)
                }}
                onKeyDown={handleKeyDown}
                placeholder={apiConnected ? "Type or speak your message..." : "Backend not connected..."}
                disabled={!apiConnected}
                rows={2}
                className="flex-1 bg-background border border-gray-700 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent/50 resize-none disabled:opacity-50 disabled:cursor-not-allowed transition-smooth"
              />

              <Button
                onClick={() => handleSendMessage()}
                disabled={isLoading || !inputValue.trim() || !apiConnected}
                className="flex items-center gap-2"
              >
                <Send className="w-4 h-4" />
                <span className="hidden sm:inline">Send</span>
              </Button>
            </div>

            {inputValue && (
              <p className="mt-2 text-xs text-muted">
                {isVoiceDraft ? 'Listening... transcript preview (edit before sending).' : 'Transcript ready. Press Send when you are ready.'}
              </p>
            )}

            {/* Reset Button */}
            <div className="mt-3 flex justify-end">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleReset}
                className="text-xs flex items-center gap-1"
              >
                <RotateCcw className="w-3 h-3" />
                Reset
              </Button>
            </div>

            {!apiConnected && (
              <p className="text-xs text-red-400 mt-2">⚠️ Backend API is not connected. Make sure the backend is running.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

