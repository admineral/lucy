/**
 * EmptyState Component
 * Displays when there are no messages in the chat
 */

'use client';

import React, { memo } from 'react';
import { Card, CardContent, CardDescription, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Bot, MessageSquare, Brain } from 'lucide-react';
import { useSelectedModel } from '@/app/contexts/ModelContext';
import { formatModelName } from '@/app/utils/formatters';
import { supportsReasoning } from '@/app/utils/modelHelpers';

/**
 * EmptyState component
 * Shows helpful information when chat is empty
 */
export const EmptyState: React.FC = memo(() => {
  console.log('[EmptyState] Rendering empty state');
  
  const selectedModel = useSelectedModel();
  const hasReasoning = selectedModel ? supportsReasoning(selectedModel) : false;
  
  return (
    <div className="flex items-center justify-center h-[60vh]">
      <Card className="max-w-md">
        <CardContent className="p-8 text-center">
          {!selectedModel ? (
            <>
              <Bot className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
              <CardTitle className="mb-2">Select a Model</CardTitle>
              <CardDescription>
                Choose from the available models in the sidebar to start chatting.
              </CardDescription>
            </>
          ) : (
            <>
              <MessageSquare className="h-16 w-16 mx-auto mb-4 text-primary" />
              <CardTitle className="mb-2">Ready to Chat!</CardTitle>
              <CardDescription className="mb-4">
                Your model {formatModelName(selectedModel)} is loaded and ready for conversation.
              </CardDescription>
              {hasReasoning && (
                <Badge variant="outline" className="text-xs">
                  <Brain className="h-3 w-3 mr-1" />
                  This model supports reasoning
                </Badge>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
});

EmptyState.displayName = 'EmptyState'; 