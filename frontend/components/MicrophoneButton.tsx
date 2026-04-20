'use client'

import React, { useState, useEffect, useRef } from 'react'
import { Loader2, Mic, MicOff } from 'lucide-react'

interface MicrophoneButtonProps {
  onTranscript: (transcript: string, isFinal: boolean) => void
  disabled?: boolean
  language?: string
  autoStartSignal?: number
}

export function MicrophoneButton({
  onTranscript,
  disabled = false,
  language = 'en-US',
  autoStartSignal,
}: MicrophoneButtonProps) {
  const [isListening, setIsListening] = useState(false)
  const [isStarting, setIsStarting] = useState(false)
  const [isSupported, setIsSupported] = useState(true)
  const [audioLevel, setAudioLevel] = useState(0)
  const recognitionRef = useRef<any>(null)
  const onTranscriptRef = useRef(onTranscript)
  const finalTranscriptRef = useRef('')
  const liveTranscriptRef = useRef('')
  const sessionActiveRef = useRef(false)
  const restartTimerRef = useRef<number | null>(null)
  const audioContextRef = useRef<AudioContext | null>(null)
  const analyserRef = useRef<AnalyserNode | null>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const rafRef = useRef<number | null>(null)

  useEffect(() => {
    onTranscriptRef.current = onTranscript
  }, [onTranscript])

  const stopAudioMeter = () => {
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current)
      rafRef.current = null
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop())
      streamRef.current = null
    }
    if (audioContextRef.current) {
      audioContextRef.current.close()
      audioContextRef.current = null
    }
    analyserRef.current = null
    setAudioLevel(0)
  }

  const startAudioMeter = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      streamRef.current = stream

      const audioContext = new window.AudioContext()
      audioContextRef.current = audioContext

      const source = audioContext.createMediaStreamSource(stream)
      const analyser = audioContext.createAnalyser()
      analyser.fftSize = 256
      analyser.smoothingTimeConstant = 0.8
      analyserRef.current = analyser

      source.connect(analyser)

      const dataArray = new Uint8Array(analyser.frequencyBinCount)
      const updateLevel = () => {
        if (!analyserRef.current) return
        analyserRef.current.getByteFrequencyData(dataArray)
        let sum = 0
        for (let i = 0; i < dataArray.length; i++) {
          sum += dataArray[i]
        }
        const avg = sum / dataArray.length
        const normalized = Math.min(100, Math.max(0, Math.round((avg / 255) * 100 * 1.7)))
        setAudioLevel(normalized)
        rafRef.current = requestAnimationFrame(updateLevel)
      }

      updateLevel()
    } catch (error) {
      console.error('Audio meter error:', error)
      setAudioLevel(0)
    }
  }

  const startListening = () => {
    if (!recognitionRef.current || disabled || isListening || isStarting) return
    try {
      sessionActiveRef.current = true
      finalTranscriptRef.current = ''
      liveTranscriptRef.current = ''
      onTranscriptRef.current('', false)
      setIsStarting(true)
      recognitionRef.current.start()
    } catch (error) {
      console.error('Speech recognition start error:', error)
      setIsStarting(false)
    }
  }

  useEffect(() => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      console.warn('Speech Recognition API not supported')
      setIsSupported(false)
      return
    }

    const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition
    const recognitionLanguage = language === 'en-GB' ? 'en-GB' : 'en-US'
    recognitionRef.current = new SpeechRecognition()
    recognitionRef.current.continuous = true
    recognitionRef.current.interimResults = true
    recognitionRef.current.language = recognitionLanguage
    recognitionRef.current.maxAlternatives = 1

    recognitionRef.current.onstart = () => {
      setIsStarting(false)
      setIsListening(true)
      void startAudioMeter()
    }

    recognitionRef.current.onresult = (event: any) => {
      let finalizedChunk = ''
      let interimText = ''

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcriptSegment = event.results[i][0].transcript.trim()
        if (event.results[i].isFinal) {
          finalizedChunk += `${transcriptSegment} `
        } else {
          interimText += `${transcriptSegment} `
        }
      }

      if (finalizedChunk.trim()) {
        finalTranscriptRef.current = `${finalTranscriptRef.current} ${finalizedChunk}`.trim()
      }

      const combined = `${finalTranscriptRef.current} ${interimText}`.trim().replace(/\s+/g, ' ')
      liveTranscriptRef.current = combined
      onTranscriptRef.current(combined, false)
    }

    recognitionRef.current.onerror = (event: any) => {
      console.error('Speech recognition error:', event.error)
      const recoverableErrors = ['no-speech', 'aborted']
      const mustStopErrors = ['not-allowed', 'service-not-allowed', 'audio-capture']

      if (mustStopErrors.includes(event.error)) {
        sessionActiveRef.current = false
        setIsStarting(false)
        setIsListening(false)
        stopAudioMeter()
        return
      }

      if (sessionActiveRef.current && recoverableErrors.includes(event.error)) {
        setIsStarting(false)
        setIsListening(false)
        return
      }

      sessionActiveRef.current = false
      setIsStarting(false)
      setIsListening(false)
      stopAudioMeter()
    }

    recognitionRef.current.onend = () => {
      if (sessionActiveRef.current && !disabled) {
        restartTimerRef.current = window.setTimeout(() => {
          try {
            if (sessionActiveRef.current && recognitionRef.current) {
              setIsStarting(true)
              recognitionRef.current.start()
            }
          } catch (error) {
            console.error('Speech recognition restart error:', error)
            setIsStarting(false)
          }
        }, 120)
        return
      }

      const finalText = finalTranscriptRef.current.trim() || liveTranscriptRef.current.trim()
      if (finalText) onTranscriptRef.current(finalText, true)
      setIsStarting(false)
      setIsListening(false)
      stopAudioMeter()
    }

    return () => {
      sessionActiveRef.current = false
      if (restartTimerRef.current) {
        clearTimeout(restartTimerRef.current)
        restartTimerRef.current = null
      }
      if (recognitionRef.current) {
        recognitionRef.current.abort()
      }
      stopAudioMeter()
    }
  }, [disabled, language])

  useEffect(() => {
    if (typeof autoStartSignal === 'number' && autoStartSignal > 0) {
      startListening()
    }
  }, [autoStartSignal])

  const handleClick = () => {
    if (!recognitionRef.current) return

    if (isListening) {
      sessionActiveRef.current = false
      recognitionRef.current.stop()
      return
    }

    startListening()
  }

  return (
    <div className="flex flex-col items-center gap-2">
      <button
        onClick={handleClick}
        disabled={disabled || !recognitionRef.current || !isSupported}
        className={`relative p-4 rounded-full transition-smooth ${
          isListening || isStarting
            ? 'bg-red-500 hover:bg-red-600 shadow-lg shadow-red-500/50'
            : 'bg-accent hover:bg-accent/90 shadow-lg shadow-accent/50'
        } disabled:opacity-50 disabled:cursor-not-allowed`}
        title={isListening ? 'Stop listening' : isStarting ? 'Starting microphone...' : 'Start listening'}
      >
        {isStarting ? (
          <Loader2 className="w-6 h-6 text-white animate-spin" />
        ) : isListening ? (
          <>
            <MicOff className="w-6 h-6 text-white" />
            <span className="absolute inset-0 rounded-full animate-pulse-soft border-2 border-red-500" />
          </>
        ) : (
          <Mic className="w-6 h-6 text-white" />
        )}
      </button>

      <div className="w-16 h-1.5 rounded-full bg-gray-700 overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-green-400 via-yellow-400 to-red-500 transition-all duration-100"
          style={{ width: `${audioLevel}%` }}
        />
      </div>
    </div>
  )
}

