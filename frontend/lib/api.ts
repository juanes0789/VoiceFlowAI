declare global {
  interface Window {
    __RUNTIME_CONFIG__?: {
      NEXT_PUBLIC_API_URL?: string
    }
  }
}

function getApiUrl(): string {
  const envUrl = (globalThis as { process?: { env?: Record<string, string | undefined> } })
    .process?.env?.NEXT_PUBLIC_API_URL?.trim()

  if (typeof window !== 'undefined') {
    const runtimeUrl = window.__RUNTIME_CONFIG__?.NEXT_PUBLIC_API_URL?.trim()
    if (runtimeUrl) return runtimeUrl
  }
  return envUrl || 'http://localhost:8000'
}

export interface ChatRequest {
  message: string
  mode: string
}

export interface Score {
  grammar: number
  fluency: number
  confidence: number
}

export interface ChatResponse {
  reply: string
  correction?: string
  score: Score
}

export async function chat(request: ChatRequest): Promise<ChatResponse> {
  try {
    const apiUrl = getApiUrl()
    const response = await fetch(`${apiUrl}/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    })

    if (!response.ok) {
      throw new Error(`API error: ${response.statusText}`)
    }

    return await response.json()
  } catch (error) {
    console.error('Chat error:', error)
    throw error
  }
}

export async function resetConversation(): Promise<void> {
  try {
    const apiUrl = getApiUrl()
    const response = await fetch(`${apiUrl}/reset`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      throw new Error(`API error: ${response.statusText}`)
    }
  } catch (error) {
    console.error('Reset error:', error)
    throw error
  }
}

export async function healthCheck(): Promise<boolean> {
  try {
    const apiUrl = getApiUrl()
    const response = await fetch(`${apiUrl}/health`)
    return response.ok
  } catch {
    return false
  }
}

