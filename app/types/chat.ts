/**
 * Chat-related type definitions
 * Provides comprehensive types for messages, chat state, and operations
 */

/**
 * Represents a single chat message
 */
export interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: string;
  thinkingContent?: string;
  isStreaming?: boolean;
}

/**
 * Chat history item for API communication
 */
export interface ChatHistoryItem {
  role: 'user' | 'assistant';
  content: string;
}

/**
 * Chat context state
 */
export interface ChatState {
  messages: Message[];
  currentStreamingMessage: Message | null;
  isLoading: boolean;
  error: string | null;
}

/**
 * Chat context actions
 */
export interface ChatActions {
  sendMessage: (content: string) => Promise<void>;
  clearChat: () => void;
  setError: (error: string | null) => void;
}

/**
 * Combined chat context value
 */
export interface ChatContextValue extends ChatState, ChatActions {}

/**
 * Chat API request payload
 */
export interface ChatRequest {
  message: string;
  model: string;
  chatHistory: ChatHistoryItem[];
}

/**
 * Chat API error response
 */
export interface ChatErrorResponse {
  error: string;
  suggestion?: string;
} 