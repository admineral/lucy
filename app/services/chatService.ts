/**
 * Chat Service
 * Handles all chat-related API communications
 */

import { ChatRequest, ChatErrorResponse } from '@/app/types/chat';
import { StreamEvent } from '@/app/types/streaming';
import { parseStreamBuffer, createErrorEvent } from '@/app/utils/streamParser';

/**
 * Send a chat message and handle streaming response
 * @param request - Chat request payload
 * @param onEvent - Callback for stream events
 * @returns Abort controller for cancelling the request
 */
export const sendChatMessage = async (
  request: ChatRequest,
  onEvent: (event: StreamEvent) => void
): Promise<AbortController> => {
  console.log('[chatService] Sending chat message:', {
    model: request.model,
    messageLength: request.message.length,
    historyLength: request.chatHistory.length
  });
  
  const abortController = new AbortController();
  
  try {
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
      signal: abortController.signal
    });

    if (!response.ok) {
      const errorData: ChatErrorResponse = await response.json();
      console.error('[chatService] API error response:', errorData);
      
      onEvent(createErrorEvent(errorData.error, errorData.suggestion));
      return abortController;
    }

    const reader = response.body?.getReader();
    if (!reader) {
      console.error('[chatService] No response body reader available');
      onEvent(createErrorEvent('No response body available'));
      return abortController;
    }

    // Start reading the stream
    readStream(reader, onEvent, abortController);
    
  } catch (error) {
    console.error('[chatService] Error sending message:', error);
    
    if (error instanceof Error && error.name === 'AbortError') {
      console.log('[chatService] Request was aborted');
    } else {
      onEvent(createErrorEvent(error));
    }
  }
  
  return abortController;
};

/**
 * Read and parse the streaming response
 * @param reader - Response body reader
 * @param onEvent - Callback for stream events
 * @param abortController - Abort controller for cancellation
 */
const readStream = async (
  reader: ReadableStreamDefaultReader<Uint8Array>,
  onEvent: (event: StreamEvent) => void,
  abortController: AbortController
): Promise<void> => {
  const decoder = new TextDecoder();
  let buffer = '';
  
  console.log('[chatService] Starting stream reading');
  
  try {
    while (!abortController.signal.aborted) {
      const { done, value } = await reader.read();
      
      if (done) {
        console.log('[chatService] Stream reading completed');
        break;
      }

      buffer += decoder.decode(value, { stream: true });
      const { events, remainingBuffer } = parseStreamBuffer(buffer);
      buffer = remainingBuffer;

      // Process parsed events
      for (const event of events) {
        onEvent(event);
        
        // Check if stream is complete
        if (event.type === 'complete' || event.type === 'error') {
          console.log('[chatService] Stream ended with event:', event.type);
          reader.releaseLock();
          return;
        }
      }
    }
  } catch (error) {
    console.error('[chatService] Error reading stream:', error);
    onEvent(createErrorEvent(error));
  } finally {
    try {
      reader.releaseLock();
    } catch {
      // Reader might already be released
      console.log('[chatService] Reader already released');
    }
  }
};

/**
 * Validate chat request
 * @param request - Chat request to validate
 * @returns Validation result with error message if invalid
 */
export const validateChatRequest = (request: Partial<ChatRequest>): {
  isValid: boolean;
  error?: string;
} => {
  if (!request.message?.trim()) {
    return { isValid: false, error: 'Message cannot be empty' };
  }
  
  if (!request.model) {
    return { isValid: false, error: 'No model selected' };
  }
  
  if (!Array.isArray(request.chatHistory)) {
    return { isValid: false, error: 'Invalid chat history format' };
  }
  
  console.log('[chatService] Chat request validated successfully');
  return { isValid: true };
}; 