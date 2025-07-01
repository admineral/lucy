/**
 * Stream parsing utility functions
 * Provides utilities for parsing Server-Sent Events (SSE) streams
 */

import { StreamEvent, StreamParseResult } from '@/app/types/streaming';

/**
 * Parse SSE data line into a stream event
 * @param line - SSE data line
 * @returns Parsed stream event or null if invalid
 */
export const parseSSELine = (line: string): StreamEvent | null => {
  if (!line.startsWith('data: ')) {
    return null;
  }
  
  try {
    const jsonStr = line.slice(6); // Remove 'data: ' prefix
    const event = JSON.parse(jsonStr) as StreamEvent;
    
    console.log(`[parseSSELine] Parsed event type: ${event.type}`);
    return event;
  } catch (error) {
    console.error('[parseSSELine] Failed to parse SSE line:', error, 'Line:', line);
    return null;
  }
};

/**
 * Parse streaming buffer into events
 * @param buffer - Current buffer content
 * @returns Parsed events and remaining buffer
 */
export const parseStreamBuffer = (buffer: string): StreamParseResult => {
  const lines = buffer.split('\n');
  const events: StreamEvent[] = [];
  
  // Keep the last line if it's incomplete (doesn't end with newline)
  const remainingBuffer = lines[lines.length - 1];
  const completeLines = lines.slice(0, -1);
  
  for (const line of completeLines) {
    if (line.trim() === '') continue; // Skip empty lines
    
    const event = parseSSELine(line);
    if (event) {
      events.push(event);
    }
  }
  
  console.log(`[parseStreamBuffer] Parsed ${events.length} events, remaining buffer: ${remainingBuffer.length} chars`);
  
  return {
    events,
    remainingBuffer
  };
};

/**
 * Extract thinking content from text
 * @param text - Text containing thinking tags
 * @returns Object with thinking content and remaining text
 */
export const extractThinkingContent = (text: string): {
  thinkingContent: string;
  responseContent: string;
} => {
  const thinkStartTag = '<think>';
  const thinkEndTag = '</think>';
  
  const startIndex = text.indexOf(thinkStartTag);
  const endIndex = text.indexOf(thinkEndTag);
  
  if (startIndex === -1 || endIndex === -1 || startIndex > endIndex) {
    return {
      thinkingContent: '',
      responseContent: text
    };
  }
  
  const thinkingContent = text.substring(startIndex + thinkStartTag.length, endIndex);
  const responseContent = text.substring(0, startIndex) + text.substring(endIndex + thinkEndTag.length);
  
  console.log('[extractThinkingContent] Extracted thinking content:', thinkingContent.length, 'chars');
  
  return {
    thinkingContent: thinkingContent.trim(),
    responseContent: responseContent.trim()
  };
};

/**
 * Create an error event
 * @param error - Error object or message
 * @param suggestion - Optional suggestion for fixing the error
 * @returns Error stream event
 */
export const createErrorEvent = (error: unknown, suggestion?: string): StreamEvent => {
  let errorMessage = 'Unknown error occurred';
  
  if (typeof error === 'string') {
    errorMessage = error;
  } else if (error instanceof Error) {
    errorMessage = error.message;
    
    // Add specific suggestions based on error type
    if (errorMessage.includes('connection refused') || errorMessage.includes('ECONNREFUSED')) {
      suggestion = suggestion || 'Please ensure LM Studio is running and the local server is enabled';
    } else if (errorMessage.includes('model not found') || errorMessage.includes('not loaded')) {
      suggestion = suggestion || 'Please load the model first using the model panel';
    }
  }
  
  console.error('[createErrorEvent] Creating error event:', errorMessage, 'Suggestion:', suggestion);
  
  return {
    type: 'error',
    error: errorMessage,
    suggestion,
    timestamp: new Date().toISOString()
  };
};

/**
 * Check if stream is complete
 * @param event - Stream event
 * @returns True if stream is complete or errored
 */
export const isStreamComplete = (event: StreamEvent): boolean => {
  const isComplete = event.type === 'complete' || event.type === 'error';
  
  if (isComplete) {
    console.log(`[isStreamComplete] Stream completed with type: ${event.type}`);
  }
  
  return isComplete;
}; 