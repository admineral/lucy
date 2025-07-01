/**
 * Chat Context
 * Manages chat-related state and operations
 */

'use client';

import React, { createContext, useContext, useState, useCallback, useRef, ReactNode } from 'react';
import { ChatContextValue, Message, ChatHistoryItem } from '@/app/types/chat';
import { StreamEvent } from '@/app/types/streaming';
import * as chatService from '@/app/services/chatService';
import { useSelectedModel } from './ModelContext';

/**
 * Chat context
 */
const ChatContext = createContext<ChatContextValue | undefined>(undefined);

/**
 * Chat context provider props
 */
interface ChatProviderProps {
  children: ReactNode;
}

/**
 * Chat context provider component
 */
export const ChatProvider: React.FC<ChatProviderProps> = ({ children }) => {
  console.log('[ChatProvider] Initializing chat context');
  
  // State
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentStreamingMessage, setCurrentStreamingMessage] = useState<Message | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Refs
  const abortControllerRef = useRef<AbortController | null>(null);
  
  // Get selected model from model context
  const selectedModel = useSelectedModel();
  
  // Handle stream events
  const handleStreamEvent = useCallback((event: StreamEvent) => {
    console.log('[ChatProvider] Handling stream event:', event.type);
    
    switch (event.type) {
      case 'thinking_partial':
        setCurrentStreamingMessage(prev => {
          if (!prev) return prev;
          return {
            ...prev,
            thinkingContent: event.content || '',
          };
        });
        break;
      
      case 'thinking':
        setCurrentStreamingMessage(prev => {
          if (!prev) return prev;
          return {
            ...prev,
            thinkingContent: event.content || '',
          };
        });
        break;
      
      case 'response':
        setCurrentStreamingMessage(prev => {
          if (!prev) return prev;
          return {
            ...prev,
            content: prev.content + (event.content || ''),
          };
        });
        break;
      
      case 'complete':
        // Create final message
        const finalMessage: Message = {
          id: `msg-${Date.now()}`,
          content: event.fullContent || '',
          role: 'assistant',
          timestamp: event.timestamp,
          thinkingContent: event.thinkingContent || undefined,
          isStreaming: false,
        };
        
        // Add to messages and clear streaming
        setMessages(prev => [...prev, finalMessage]);
        setCurrentStreamingMessage(null);
        setIsLoading(false);
        break;
      
      case 'error':
        const errorMessage: Message = {
          id: `error-${Date.now()}`,
          content: `Error: ${event.error}${event.suggestion ? `\n${event.suggestion}` : ''}`,
          role: 'assistant',
          timestamp: event.timestamp,
          isStreaming: false,
        };
        
        setMessages(prev => [...prev, errorMessage]);
        setCurrentStreamingMessage(null);
        setIsLoading(false);
        setError(event.error);
        break;
    }
  }, []);
  
  // Send message
  const sendMessage = useCallback(async (content: string) => {
    // Validate
    const validation = chatService.validateChatRequest({
      message: content,
      model: selectedModel,
      chatHistory: []
    });
    
    if (!validation.isValid) {
      console.error('[ChatProvider] Invalid request:', validation.error);
      setError(validation.error || 'Invalid request');
      return;
    }
    
    console.log('[ChatProvider] Sending message:', content);
    
    // Clear error
    setError(null);
    
    // Add user message
    const userMessage: Message = {
      id: `user-${Date.now()}`,
      content,
      role: 'user',
      timestamp: new Date().toISOString(),
    };
    
    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);
    
    // Create streaming message
    const streamingMessage: Message = {
      id: `streaming-${Date.now()}`,
      content: '',
      role: 'assistant',
      timestamp: new Date().toISOString(),
      thinkingContent: '',
      isStreaming: true,
    };
    
    setCurrentStreamingMessage(streamingMessage);
    
    // Prepare chat history
    const chatHistory: ChatHistoryItem[] = messages.map(msg => ({
      role: msg.role,
      content: msg.content
    }));
    
    try {
      // Cancel any existing request
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      
      // Send message
      const abortController = await chatService.sendChatMessage(
        {
          message: content,
          model: selectedModel,
          chatHistory
        },
        handleStreamEvent
      );
      
      abortControllerRef.current = abortController;
      
    } catch (error) {
      console.error('[ChatProvider] Error sending message:', error);
      setIsLoading(false);
      setCurrentStreamingMessage(null);
      setError('Failed to send message');
    }
  }, [selectedModel, messages, handleStreamEvent]);
  
  // Clear chat
  const clearChat = useCallback(() => {
    console.log('[ChatProvider] Clearing chat');
    
    // Cancel any ongoing request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    
    setMessages([]);
    setCurrentStreamingMessage(null);
    setIsLoading(false);
    setError(null);
  }, []);
  
  // Context value
  const value: ChatContextValue = {
    // State
    messages,
    currentStreamingMessage,
    isLoading,
    error,
    // Actions
    sendMessage,
    clearChat,
    setError
  };
  
  return (
    <ChatContext.Provider value={value}>
      {children}
    </ChatContext.Provider>
  );
};

/**
 * Hook to use chat context
 * @returns Chat context value
 * @throws Error if used outside of ChatProvider
 */
export const useChat = (): ChatContextValue => {
  const context = useContext(ChatContext);
  
  if (!context) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  
  return context;
};

/**
 * Hook to get all messages including streaming
 * @returns All messages including current streaming message
 */
export const useAllMessages = (): Message[] => {
  const { messages, currentStreamingMessage } = useChat();
  
  if (currentStreamingMessage) {
    return [...messages, currentStreamingMessage];
  }
  
  return messages;
};

/**
 * Hook to check if chat is ready
 * @returns Whether chat is ready (model selected and not loading)
 */
export const useChatReady = (): boolean => {
  const { isLoading } = useChat();
  const selectedModel = useSelectedModel();
  
  return !!selectedModel && !isLoading;
}; 