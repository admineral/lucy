/**
 * Header Component
 * Top header bar for the chat interface
 */

'use client';

import React, { memo } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { MessageSquare, Trash2, Zap, Menu } from 'lucide-react';
import { useChat } from '@/app/contexts/ChatContext';
import { useSelectedModel } from '@/app/contexts/ModelContext';
import { useUI } from '@/app/contexts/UIContext';
import { formatModelName } from '@/app/utils/formatters';

/**
 * Header component props
 */
interface HeaderProps {
  onMenuClick?: () => void;
}

/**
 * Header component
 * Displays app title, status, and controls
 */
export const Header: React.FC<HeaderProps> = memo(({ onMenuClick }) => {
  console.log('[Header] Rendering header');
  
  const { clearChat, isLoading } = useChat();
  const selectedModel = useSelectedModel();
  const { showThinking, toggleThinking } = useUI();
  
  return (
    <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-40">
      <div className="flex items-center justify-between p-4">
        {/* Left side */}
        <div className="flex items-center gap-3">
          {/* Mobile menu button */}
          {onMenuClick && (
            <Button 
              variant="ghost" 
              size="sm" 
              className="lg:hidden"
              onClick={onMenuClick}
            >
              <Menu className="h-4 w-4" />
            </Button>
          )}
          
          {/* App title */}
          <div className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            <h1 className="text-xl font-semibold">Lucy Chat</h1>
          </div>
          
          {/* Model status */}
          {selectedModel && (
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 bg-green-500 rounded-full animate-pulse" />
              <Badge variant="outline">
                {formatModelName(selectedModel)}
              </Badge>
            </div>
          )}
          
          {/* Loading indicator */}
          {isLoading && (
            <Badge variant="secondary" className="animate-pulse">
              <Zap className="h-3 w-3 mr-1" />
              Streaming...
            </Badge>
          )}
        </div>
        
        {/* Right side controls */}
        <div className="flex items-center gap-4">
          {/* Thinking toggle */}
          <div className="flex items-center space-x-2">
            <Switch
              id="thinking-mode"
              checked={showThinking}
              onCheckedChange={toggleThinking}
            />
            <Label htmlFor="thinking-mode" className="text-sm cursor-pointer">
              Show Thinking
            </Label>
          </div>
          
          {/* Clear chat button */}
          <Button 
            onClick={clearChat} 
            variant="outline" 
            size="sm"
            className="hidden sm:flex"
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Clear Chat
          </Button>
          
          {/* Mobile clear button (icon only) */}
          <Button 
            onClick={clearChat} 
            variant="outline" 
            size="sm"
            className="sm:hidden"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
});

Header.displayName = 'Header'; 