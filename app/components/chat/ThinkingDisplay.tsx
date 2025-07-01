/**
 * ThinkingDisplay Component
 * Displays the thinking/reasoning process of the AI
 */

'use client';

import React, { memo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Brain } from 'lucide-react';

/**
 * ThinkingDisplay component props
 */
interface ThinkingDisplayProps {
  content: string;
  isStreaming?: boolean;
}

/**
 * ThinkingDisplay component
 * Shows AI's reasoning process in a styled card
 */
export const ThinkingDisplay: React.FC<ThinkingDisplayProps> = memo(({ 
  content, 
  isStreaming = false 
}) => {
  console.log('[ThinkingDisplay] Rendering thinking content, streaming:', isStreaming);
  
  if (!content) return null;
  
  return (
    <Card className="bg-amber-50 border-amber-200 animate-in fade-in duration-300">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm flex items-center gap-2">
          <Brain className="h-4 w-4 text-amber-600 animate-pulse" />
          {isStreaming ? 'Thinking...' : 'Reasoning Process'}
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <p className="text-sm text-amber-800 whitespace-pre-wrap italic">
          {content}
          {isStreaming && (
            <span className="inline-block w-2 h-4 bg-amber-600 ml-1 animate-pulse" />
          )}
        </p>
      </CardContent>
    </Card>
  );
});

ThinkingDisplay.displayName = 'ThinkingDisplay'; 