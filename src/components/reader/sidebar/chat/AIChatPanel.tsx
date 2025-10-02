"use client"

import { useChat } from '@/hooks/useChat'
import { ChatMessageList } from './ChatMessageList'
import { ChatInput } from './ChatInput'
import { SidebarSection } from '../SidebarSection'

interface AIChatPanelProps {
  documentId: string
}

export function AIChatPanel({ documentId }: AIChatPanelProps) {
  const { messages, isSending, error, sendMessage } = useChat(documentId)

  return (
    <SidebarSection title="AI Chat">
      <div className="space-y-4">
        <ChatMessageList messages={messages} isLoading={isSending} />
        {error && (
          <div className="text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-md px-3 py-2">
            {error}
          </div>
        )}
        <ChatInput
          onSend={sendMessage}
          disabled={isSending}
        />
      </div>
    </SidebarSection>
  )
}