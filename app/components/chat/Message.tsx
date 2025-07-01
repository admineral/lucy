/**
 * Message Component
 * Displays a single chat message with appropriate styling
 */

'use client';

import React, { memo } from 'react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Bot, User, Zap } from 'lucide-react';
import { Message as MessageType } from '@/app/types/chat';
import { formatTimestamp } from '@/app/utils/formatters';
import { ThinkingDisplay } from './ThinkingDisplay';

/**
 * Message component props
 */
interface MessageProps {
  message: MessageType;
  showThinking: boolean;
}

/**
 * Message component
 * Displays a single chat message with avatar, content, and metadata
 */
export const Message: React.FC<MessageProps> = memo(({ message, showThinking }) => {
  console.log(`[Message] Rendering message ${message.id}, role: ${message.role}`);
  
  const isUser = message.role === 'user';
  const isError = message.content.startsWith('Error:');
  
  return (
    <div className="flex gap-4 mb-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
      {/* Avatar */}
      <Avatar className="h-8 w-8 shrink-0">
        <AvatarFallback className={isUser ? 'bg-blue-500 text-white' : 'bg-gray-500 text-white'}>
          {isUser ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
        </AvatarFallback>
      </Avatar>
      
      {/* Content */}
      <div className="flex-1 space-y-2">
        {/* Header */}
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">
            {isUser ? 'You' : 'Assistant'}
          </span>
          <span className="text-xs text-muted-foreground">
            {formatTimestamp(message.timestamp)}
          </span>
          {message.isStreaming && (
            <Badge variant="secondary" className="text-xs animate-pulse">
              <Zap className="h-3 w-3 mr-1" />
              Streaming
            </Badge>
          )}
        </div>
        
        {/* Thinking Content */}
        {!isUser && message.thinkingContent && showThinking && (
          <ThinkingDisplay 
            content={message.thinkingContent}
            isStreaming={message.isStreaming}
          />
        )}
        
        {/* Main Content */}
        <div className={`prose prose-sm max-w-none ${isError ? 'text-red-600' : ''}`}>
          <p className="whitespace-pre-wrap">
            {message.content}
            {message.isStreaming && message.content && (
              <span className="inline-block w-2 h-4 bg-gray-600 ml-1 animate-pulse" />
            )}
          </p>
        </div>
      </div>
    </div>
  );
});

Message.displayName = 'Message'; 