/**
 * UI Context
 * Manages UI-related state and preferences
 */

'use client';

import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';

/**
 * UI context state interface
 */
interface UIState {
  showThinking: boolean;
  collapsedProviders: Set<string>;
  isMobileSidebarOpen: boolean;
}

/**
 * UI context actions interface
 */
interface UIActions {
  toggleThinking: () => void;
  toggleProvider: (provider: string) => void;
  toggleMobileSidebar: () => void;
  collapseAllProviders: (providers: string[]) => void;
}

/**
 * Combined UI context value
 */
interface UIContextValue extends UIState, UIActions {}

/**
 * UI context
 */
const UIContext = createContext<UIContextValue | undefined>(undefined);

/**
 * UI context provider props
 */
interface UIProviderProps {
  children: ReactNode;
}

/**
 * UI context provider component
 */
export const UIProvider: React.FC<UIProviderProps> = ({ children }) => {
  console.log('[UIProvider] Initializing UI context');
  
  // State
  const [showThinking, setShowThinking] = useState(true);
  const [collapsedProviders, setCollapsedProviders] = useState<Set<string>>(new Set());
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  
  // Actions
  const toggleThinking = useCallback(() => {
    setShowThinking(prev => {
      const newValue = !prev;
      console.log('[UIProvider] Toggled thinking display:', newValue);
      return newValue;
    });
  }, []);
  
  const toggleProvider = useCallback((provider: string) => {
    setCollapsedProviders(prev => {
      const newSet = new Set(prev);
      if (newSet.has(provider)) {
        newSet.delete(provider);
        console.log('[UIProvider] Expanded provider:', provider);
      } else {
        newSet.add(provider);
        console.log('[UIProvider] Collapsed provider:', provider);
      }
      return newSet;
    });
  }, []);
  
  const toggleMobileSidebar = useCallback(() => {
    setIsMobileSidebarOpen(prev => {
      const newValue = !prev;
      console.log('[UIProvider] Toggled mobile sidebar:', newValue);
      return newValue;
    });
  }, []);
  
  const collapseAllProviders = useCallback((providers: string[]) => {
    console.log('[UIProvider] Collapsing all providers:', providers.length);
    setCollapsedProviders(new Set(providers));
  }, []);
  
  // Context value
  const value: UIContextValue = {
    // State
    showThinking,
    collapsedProviders,
    isMobileSidebarOpen,
    // Actions
    toggleThinking,
    toggleProvider,
    toggleMobileSidebar,
    collapseAllProviders
  };
  
  return (
    <UIContext.Provider value={value}>
      {children}
    </UIContext.Provider>
  );
};

/**
 * Hook to use UI context
 * @returns UI context value
 * @throws Error if used outside of UIProvider
 */
export const useUI = (): UIContextValue => {
  const context = useContext(UIContext);
  
  if (!context) {
    throw new Error('useUI must be used within a UIProvider');
  }
  
  return context;
};

/**
 * Hook to get collapsed state of a provider
 * @param provider - Provider name
 * @returns Whether the provider is collapsed
 */
export const useProviderCollapsed = (provider: string): boolean => {
  const { collapsedProviders } = useUI();
  return collapsedProviders.has(provider);
}; 