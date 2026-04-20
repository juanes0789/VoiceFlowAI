type SpeakOptions = {
  lang?: string
  rate?: number
  pitch?: number
  volume?: number
  onStart?: () => void
  onEnd?: () => void
  onError?: () => void
}

const PREFERRED_VOICE_HINTS = [
  'Google US English',
  'Google UK English Female',
  'Google UK English Male',
  'Samantha',
  'Daniel',
  'Moira',
  'Karen',
  'Alex',
  'Serena',
]

function getBestEnglishVoice(lang: string): SpeechSynthesisVoice | undefined {
  const voices = window.speechSynthesis.getVoices()
  if (!voices.length) return undefined

  const normalized = lang.toLowerCase()
  const exact =
    voices.find((voice) => voice.lang.toLowerCase() === normalized && voice.localService) ??
    voices.find((voice) => voice.lang.toLowerCase() === normalized)
  if (exact) return exact

  const languageOnly = normalized.split('-')[0]
  const languageMatch =
    voices.find((voice) => voice.lang.toLowerCase().startsWith(languageOnly) && voice.localService) ??
    voices.find((voice) => voice.lang.toLowerCase().startsWith(languageOnly))
  if (languageMatch) return languageMatch

  const byHint = voices.find((voice) => PREFERRED_VOICE_HINTS.some((hint) => voice.name.includes(hint)))
  if (byHint) return byHint

  return voices[0]
}

function normalizeTextForSpeech(input: string): string {
  return input
    .replace(/`[^`]*`/g, ' ')
    .replace(/\*\*|__|[*_~]/g, ' ')
    .replace(/https?:\/\/\S+/g, ' ')
    .replace(/[\r\n]+/g, '. ')
    .replace(/\s+/g, ' ')
    .trim()
}

export function speakText(text: string, options?: SpeakOptions): void {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
    return
  }

  const lang = options?.lang ?? 'en-US'
  const cleanText = normalizeTextForSpeech(text)
  if (!cleanText) return

  const utterance = new SpeechSynthesisUtterance(cleanText)
  utterance.lang = lang
  utterance.rate = options?.rate ?? 0.9
  utterance.pitch = options?.pitch ?? 0.98
  utterance.volume = options?.volume ?? 1

  const selectedVoice = getBestEnglishVoice(lang)
  if (selectedVoice) {
    utterance.voice = selectedVoice
  }

  if (options?.onStart) utterance.onstart = options.onStart
  if (options?.onEnd) utterance.onend = options.onEnd
  if (options?.onError) utterance.onerror = options.onError

  // Avoid queue stacking so pronunciation stays clear and consistent.
  window.speechSynthesis.cancel()
  window.speechSynthesis.speak(utterance)
}

