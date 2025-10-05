"use client"

import { useState, useCallback } from 'react'
type ChatMessage = {
  id: string
  role: 'user' | 'assistant'
  content: string
  createdAt: number
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function useChat(_documentId: string) {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [isSending, setIsSending] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const sendMessage = useCallback(async (text: string) => {
    if (!text.trim()) return

    const userMessage: ChatMessage = {
      id: crypto.randomUUID(),
      role: 'user',
      content: text.trim(),
      createdAt: Date.now(),
    }

    setMessages(prev => [...prev, userMessage])
    setIsSending(true)
    setError(null)

    try {
      // TODO: Integrate with Gemini API
      // For now, simulate a response
      await new Promise(resolve => setTimeout(resolve, 1000))

      const assistantMessage: ChatMessage = {
        id: crypto.randomUUID(),
        role: 'assistant',
        content: `This is a placeholder response to: "${text}". AI integration coming soon!`,
        createdAt: Date.now(),
      }

      setMessages(prev => [...prev, assistantMessage])
    } catch (err) {
      setError('Failed to send message. Please try again.')
      console.error('Chat error:', err)
    } finally {
      setIsSending(false)
    }
  }, [])

  return {
    messages,
    isSending,
    error,
    sendMessage,
  }
}