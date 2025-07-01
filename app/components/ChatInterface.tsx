/**
 * ChatInterface Component
 * Main orchestrator component that combines all chat functionality
 */

'use client';

import React from 'react';
import { Sheet, SheetContent } from '@/components/ui/sheet';
import { UIProvider, useUI } from '@/app/contexts/UIContext';
import { ModelProvider } from '@/app/contexts/ModelContext';
import { ChatProvider } from '@/app/contexts/ChatContext';
import { ModelSidebar } from './models/ModelSidebar';
import { ChatContainer } from './chat/ChatContainer';
import { Header } from './layout/Header';

/**
 * ChatInterfaceContent component
 * The actual interface content (needs to be inside providers)
 */
const ChatInterfaceContent: React.FC = () => {
  console.log('[ChatInterfaceContent] Rendering chat interface content');
  
  const { toggleMobileSidebar, isMobileSidebarOpen } = useUI();

  return (
    <div className="flex h-screen bg-background">
      {/* Desktop Sidebar */}
      <div className="hidden lg:block">
        <ModelSidebar />
      </div>

      {/* Mobile Sidebar */}
      <Sheet open={isMobileSidebarOpen} onOpenChange={toggleMobileSidebar}>
        <SheetContent side="left" className="w-80 p-0">
          <ModelSidebar />
        </SheetContent>
      </Sheet>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        <Header onMenuClick={toggleMobileSidebar} />
        <ChatContainer />
      </div>
    </div>
  );
};

/**
 * ChatInterface component
 * Wraps the interface with all necessary providers
 */
export default function ChatInterface() {
  console.log('[ChatInterface] Initializing chat interface with providers');
  
  return (
    <UIProvider>
      <ModelProvider>
        <ChatProvider>
          <ChatInterfaceContent />
        </ChatProvider>
      </ModelProvider>
    </UIProvider>
  );
} 