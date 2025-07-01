/**
 * ChatContainer Component
 * Main container for the chat interface
 */

'use client';

import React, { memo } from 'react';
import { useAllMessages } from '@/app/contexts/ChatContext';
import { MessageList } from './MessageList';
import { MessageInput } from './MessageInput';
import { EmptyState } from '../layout/EmptyState';

/**
 * ChatContainer component
 * Combines message list, input, and empty state
 */
export const ChatContainer: React.FC = memo(() => {
  console.log('[ChatContainer] Rendering chat container');
  
  const messages = useAllMessages();
  const hasMessages = messages.length > 0;
  
  return (
    <div className="flex-1 flex flex-col">
      {hasMessages ? (
        <MessageList />
      ) : (
        <EmptyState />
      )}
      <MessageInput />
    </div>
  );
});

ChatContainer.displayName = 'ChatContainer'; 