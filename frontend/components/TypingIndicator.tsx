'use client'

export function TypingIndicator() {
  return (
    <div className="flex items-center gap-1">
      <div className="w-2 h-2 rounded-full bg-accent animate-bounce" style={{ animationDelay: '0s' }} />
      <div className="w-2 h-2 rounded-full bg-accent animate-bounce" style={{ animationDelay: '0.2s' }} />
      <div className="w-2 h-2 rounded-full bg-accent animate-bounce" style={{ animationDelay: '0.4s' }} />
    </div>
  )
}

