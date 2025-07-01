/**
 * Auto-scroll hook
 * Provides automatic scrolling functionality for chat messages
 */

import { useEffect, useRef } from 'react';
import { useAllMessages } from '@/app/contexts/ChatContext';

/**
 * Hook for auto-scrolling to bottom of messages
 * @returns Ref to attach to scroll target element
 */
export const useAutoScroll = () => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const messages = useAllMessages();
  
  useEffect(() => {
    if (scrollRef.current) {
      console.log('[useAutoScroll] Scrolling to bottom');
      scrollRef.current.scrollIntoView({ 
        behavior: 'smooth',
        block: 'end'
      });
    }
  }, [messages]);
  
  return scrollRef;
};

/**
 * Hook for conditional auto-scroll (only if near bottom)
 * @param threshold - Distance from bottom to trigger auto-scroll (default: 100px)
 * @returns Object with scroll ref and manual scroll function
 */
export const useSmartAutoScroll = (threshold: number = 100) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const shouldScrollRef = useRef(true);
  const messages = useAllMessages();
  
  // Check if user is near bottom
  const checkIfNearBottom = () => {
    if (!containerRef.current) return true;
    
    const { scrollTop, scrollHeight, clientHeight } = containerRef.current;
    const distanceFromBottom = scrollHeight - scrollTop - clientHeight;
    
    shouldScrollRef.current = distanceFromBottom <= threshold;
    console.log('[useSmartAutoScroll] Near bottom:', shouldScrollRef.current, 'Distance:', distanceFromBottom);
  };
  
  // Scroll to bottom if appropriate
  useEffect(() => {
    if (scrollRef.current && shouldScrollRef.current) {
      console.log('[useSmartAutoScroll] Auto-scrolling to bottom');
      scrollRef.current.scrollIntoView({ 
        behavior: 'smooth',
        block: 'end'
      });
    }
  }, [messages]);
  
  // Manual scroll function
  const scrollToBottom = () => {
    if (scrollRef.current) {
      console.log('[useSmartAutoScroll] Manual scroll to bottom');
      scrollRef.current.scrollIntoView({ 
        behavior: 'smooth',
        block: 'end'
      });
      shouldScrollRef.current = true;
    }
  };
  
  return {
    scrollRef,
    containerRef,
    scrollToBottom,
    onScroll: checkIfNearBottom
  };
}; 