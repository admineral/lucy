/**
 * Streaming-related type definitions
 * Provides comprehensive types for SSE streaming and real-time updates
 */

/**
 * Server-sent event types
 */
export type StreamEventType = 
  | 'thinking' 
  | 'thinking_partial' 
  | 'response' 
  | 'complete' 
  | 'error';

/**
 * Base stream event structure
 */
export interface BaseStreamEvent {
  type: StreamEventType;
  timestamp: string;
}

/**
 * Thinking event - contains thinking content
 */
export interface ThinkingEvent extends BaseStreamEvent {
  type: 'thinking' | 'thinking_partial';
  content: string;
}

/**
 * Response event - contains response content chunk
 */
export interface ResponseEvent extends BaseStreamEvent {
  type: 'response';
  content: string;
}

/**
 * Complete event - signals stream completion
 */
export interface CompleteEvent extends BaseStreamEvent {
  type: 'complete';
  model: string;
  fullContent: string;
  thinkingContent: string;
}

/**
 * Error event - contains error information
 */
export interface ErrorEvent extends BaseStreamEvent {
  type: 'error';
  error: string;
  suggestion?: string;
}

/**
 * Union type for all stream events
 */
export type StreamEvent = 
  | ThinkingEvent 
  | ResponseEvent 
  | CompleteEvent 
  | ErrorEvent;

/**
 * Stream parsing result
 */
export interface StreamParseResult {
  events: StreamEvent[];
  remainingBuffer: string;
}

/**
 * Streaming state for UI
 */
export interface StreamingState {
  isStreaming: boolean;
  thinkingContent: string;
  responseContent: string;
  error: string | null;
} 