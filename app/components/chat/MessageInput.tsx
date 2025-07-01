/**
 * MessageInput Component
 * Handles user input for sending messages
 */

'use client';

import React, { memo, useState, useCallback, KeyboardEvent } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Send } from 'lucide-react';
import { useChat, useChatReady } from '@/app/contexts/ChatContext';
import { useSelectedModel } from '@/app/contexts/ModelContext';
import { formatModelName } from '@/app/utils/formatters';

/**
 * MessageInput component
 * Provides input field and send button for chat messages
 */
export const MessageInput: React.FC = memo(() => {
  console.log('[MessageInput] Rendering message input');
  
  const [input, setInput] = useState('');
  const { sendMessage, isLoading } = useChat();
  const selectedModel = useSelectedModel();
  const isChatReady = useChatReady();
  
  // Handle send message
  const handleSend = useCallback(async () => {
    if (!input.trim() || !isChatReady) {
      console.log('[MessageInput] Cannot send: empty input or chat not ready');
      return;
    }
    
    console.log('[MessageInput] Sending message:', input);
    const messageToSend = input;
    setInput(''); // Clear input immediately for better UX
    
    try {
      await sendMessage(messageToSend);
    } catch (error) {
      console.error('[MessageInput] Error sending message:', error);
      // Restore input on error
      setInput(messageToSend);
    }
  }, [input, isChatReady, sendMessage]);
  
  // Handle key press
  const handleKeyPress = useCallback((e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }, [handleSend]);
  
  return (
    <div className="border-t bg-background p-6">
      <div className="max-w-4xl mx-auto">
        <div className="relative">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={selectedModel ? "Plan, search, build anything..." : "Select a model first..."}
            disabled={isLoading || !selectedModel}
            className="w-full pl-6 pr-16 py-4 text-base rounded-full border-2 border-muted focus:border-primary transition-colors bg-background/50 backdrop-blur-sm"
          />
          <Button
            onClick={handleSend}
            disabled={isLoading || !input.trim() || !selectedModel}
            size="sm"
            className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full h-10 w-10 p-0 bg-primary hover:bg-primary/90"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
        
        {/* Model status indicator */}
        {selectedModel && (
          <div className="flex items-center justify-center mt-3 text-xs text-muted-foreground">
            <div className="flex items-center gap-1">
              <div className="h-1.5 w-1.5 bg-green-500 rounded-full animate-pulse" />
              <span>{formatModelName(selectedModel)} is ready</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
});

MessageInput.displayName = 'MessageInput'; 