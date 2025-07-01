/**
 * MessageList Component
 * Displays a scrollable list of chat messages
 */

'use client';

import React, { memo } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Message } from './Message';
import { useAllMessages } from '@/app/contexts/ChatContext';
import { useUI } from '@/app/contexts/UIContext';
import { useAutoScroll } from '@/app/hooks/useAutoScroll';

/**
 * MessageList component
 * Renders all messages in a scrollable area with auto-scroll
 */
export const MessageList: React.FC = memo(() => {
  console.log('[MessageList] Rendering message list');
  
  const messages = useAllMessages();
  const { showThinking } = useUI();
  const scrollRef = useAutoScroll();
  
  return (
    <ScrollArea className="flex-1">
      <div className="p-6">
        <div className="max-w-4xl mx-auto">
          {messages.map((message, index) => (
            <Message 
              key={`${message.id}-${index}`}
              message={message}
              showThinking={showThinking}
            />
          ))}
          <div ref={scrollRef} />
        </div>
      </div>
    </ScrollArea>
  );
});

MessageList.displayName = 'MessageList'; 