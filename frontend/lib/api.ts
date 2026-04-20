declare global {
  interface Window {
    __RUNTIME_CONFIG__?: {
      NEXT_PUBLIC_API_URL?: string
    }
  }
}

function getApiUrl(): string {
  const envUrl = process.env.NEXT_PUBLIC_API_URL?.trim()

  const isLocalBrowser = typeof window !== 'undefined' && (
    window.location.hostname === 'localhost' ||
    window.location.hostname === '127.0.0.1'
  )

  const normalizeApiUrl = (value?: string): string => {
    if (!value) return ''
    const candidate = value.trim().replace(/\/$/, '')
    const pointsToLocalhost = /localhost|127\.0\.0\.1/i.test(candidate)

    // Protect cloud deployments from accidental localhost env/runtime values.
    if (!isLocalBrowser && pointsToLocalhost) {
      return ''
    }

    return candidate
  }

  if (typeof window !== 'undefined') {
    const runtimeUrl = normalizeApiUrl(window.__RUNTIME_CONFIG__?.NEXT_PUBLIC_API_URL)
    if (runtimeUrl) return runtimeUrl

    // Only use localhost fallback during local development.
    if (isLocalBrowser) {
      return normalizeApiUrl(envUrl) || 'http://localhost:8000'
    }
  }

  return normalizeApiUrl(envUrl)
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
    if (!apiUrl) {
      throw new Error('Backend API URL is not configured. Set NEXT_PUBLIC_API_URL in Vercel.')
    }
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
    if (!apiUrl) {
      throw new Error('Backend API URL is not configured. Set NEXT_PUBLIC_API_URL in Vercel.')
    }
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
    if (!apiUrl) {
      console.warn('Backend API URL is empty. Configure NEXT_PUBLIC_API_URL in Vercel.')
      return false
    }
    const response = await fetch(`${apiUrl}/health`)
    return response.ok
  } catch {
    return false
  }
}

