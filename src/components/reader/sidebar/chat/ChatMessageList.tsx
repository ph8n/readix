"use client"

import { useEffect, useRef } from 'react'
import type { ChatMessage } from './types'

interface ChatMessageListProps {
  messages: ChatMessage[]
  isLoading?: boolean
}

export function ChatMessageList({ messages, isLoading = false }: ChatMessageListProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages, isLoading])

  if (messages.length === 0 && !isLoading) {
    return (
      <div className="text-center py-12 space-y-4">
        <div className="text-6xl">💬</div>
        <div className="space-y-2">
          <h4 className="font-serif text-lg font-semibold text-foreground">
            Start a conversation
          </h4>
          <p className="text-sm text-muted-foreground">
            Ask questions about this document and get AI-powered answers.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4 max-h-[400px] overflow-y-auto">
      {messages.map((message) => (
        <div
          key={message.id}
          className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
        >
          <div
            className={`max-w-[80%] rounded-lg px-3 py-2 text-sm ${
              message.role === 'user'
                ? 'bg-primary text-primary-foreground'
                : 'bg-muted text-muted-foreground'
            }`}
          >
            {message.content}
          </div>
        </div>
      ))}
      {isLoading && (
        <div className="flex justify-start">
          <div className="bg-muted text-muted-foreground rounded-lg px-3 py-2 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-current rounded-full animate-pulse" />
              <div className="w-2 h-2 bg-current rounded-full animate-pulse delay-75" />
              <div className="w-2 h-2 bg-current rounded-full animate-pulse delay-150" />
            </div>
          </div>
        </div>
      )}
      <div ref={messagesEndRef} />
    </div>
  )
}