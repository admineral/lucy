/**
 * Formatting utility functions
 * Provides consistent formatting across the application
 */

/**
 * Format file size from bytes to human-readable format
 * @param bytes - Size in bytes
 * @returns Formatted size string (e.g., "1.5 MB")
 */
export const formatFileSize = (bytes: number): string => {
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  
  if (bytes === 0) {
    console.log('[formatFileSize] Received 0 bytes');
    return '0 Bytes';
  }
  
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  const formattedSize = Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
  
  console.log(`[formatFileSize] Formatted ${bytes} bytes to ${formattedSize}`);
  return formattedSize;
};

/**
 * Format model identifier to display name
 * @param identifier - Full model identifier (e.g., "meta/llama-3.1-8b")
 * @returns Display name (e.g., "llama-3.1-8b")
 */
export const formatModelName = (identifier: string): string => {
  const formatted = identifier.split('/').pop() || identifier;
  console.log(`[formatModelName] Formatted "${identifier}" to "${formatted}"`);
  return formatted;
};

/**
 * Format timestamp to locale time string
 * @param timestamp - ISO timestamp string
 * @returns Formatted time string
 */
export const formatTimestamp = (timestamp: string): string => {
  try {
    const formatted = new Date(timestamp).toLocaleTimeString();
    return formatted;
  } catch (error) {
    console.error('[formatTimestamp] Error formatting timestamp:', error);
    return 'Invalid time';
  }
};

/**
 * Truncate text with ellipsis
 * @param text - Text to truncate
 * @param maxLength - Maximum length before truncation
 * @returns Truncated text with ellipsis if needed
 */
export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  
  const truncated = text.substring(0, maxLength - 3) + '...';
  console.log(`[truncateText] Truncated text from ${text.length} to ${maxLength} characters`);
  return truncated;
};

/**
 * Format error message for display
 * @param error - Error object or string
 * @returns User-friendly error message
 */
export const formatErrorMessage = (error: unknown): string => {
  if (typeof error === 'string') {
    return error;
  }
  
  if (error instanceof Error) {
    console.error('[formatErrorMessage] Error object:', error);
    return error.message;
  }
  
  console.error('[formatErrorMessage] Unknown error type:', error);
  return 'An unexpected error occurred';
}; 