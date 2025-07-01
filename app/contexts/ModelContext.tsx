/**
 * Model Context
 * Manages model-related state and operations
 */

'use client';

import React, { createContext, useContext, useState, useCallback, useEffect, ReactNode } from 'react';
import { ModelContextValue, ModelsResponse, ModelLoadingProgress } from '@/app/types/models';
import * as modelService from '@/app/services/modelService';

/**
 * Model context
 */
const ModelContext = createContext<ModelContextValue | undefined>(undefined);

/**
 * Model context provider props
 */
interface ModelProviderProps {
  children: ReactNode;
}

/**
 * Model context provider component
 */
export const ModelProvider: React.FC<ModelProviderProps> = ({ children }) => {
  console.log('[ModelProvider] Initializing model context');
  
  // State
  const [models, setModels] = useState<ModelsResponse | null>(null);
  const [selectedModel, setSelectedModel] = useState<string>('');
  const [modelActionLoading, setModelActionLoading] = useState<string | null>(null);
  const [loadingProgress, setLoadingProgress] = useState<ModelLoadingProgress>({});
  const [modelsLoading, setModelsLoading] = useState(false);
  
  // Fetch models from API
  const fetchModels = useCallback(async () => {
    console.log('[ModelProvider] Fetching models');
    setModelsLoading(true);
    
    try {
      const data = await modelService.fetchModels();
      setModels(data);
      
      // Auto-select first loaded model if none selected
      if (!selectedModel && data.loaded && data.loaded.length > 0) {
        const firstModel = data.loaded[0].identifier;
        console.log('[ModelProvider] Auto-selecting first loaded model:', firstModel);
        setSelectedModel(firstModel);
      }
    } catch (error) {
      console.error('[ModelProvider] Error fetching models:', error);
      setModels({
        loaded: [],
        available: [],
        timestamp: new Date().toISOString(),
        error: 'Failed to fetch models'
      });
    } finally {
      setModelsLoading(false);
    }
  }, [selectedModel]);
  
  // Load a model
  const loadModel = useCallback(async (modelIdentifier: string) => {
    console.log('[ModelProvider] Loading model:', modelIdentifier);
    setModelActionLoading(modelIdentifier);
    
    // Initialize progress
    setLoadingProgress(prev => ({ ...prev, [modelIdentifier]: 0 }));
    
    try {
      const result = await modelService.loadModel(
        modelIdentifier,
        (progress) => {
          setLoadingProgress(prev => ({ ...prev, [modelIdentifier]: progress }));
        }
      );
      
      if (result.success) {
        // Wait a bit for progress animation
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Refresh models list
        await fetchModels();
        
        // Auto-select the loaded model
        setSelectedModel(modelIdentifier);
      } else {
        console.error('[ModelProvider] Failed to load model:', result.error);
      }
    } catch (error) {
      console.error('[ModelProvider] Error loading model:', error);
    } finally {
      setModelActionLoading(null);
      
      // Clean up progress after delay
      setTimeout(() => {
        setLoadingProgress(prev => {
          const newProgress = { ...prev };
          delete newProgress[modelIdentifier];
          return newProgress;
        });
      }, 1000);
    }
  }, [fetchModels]);
  
  // Unload a model
  const unloadModel = useCallback(async (modelIdentifier: string) => {
    console.log('[ModelProvider] Unloading model:', modelIdentifier);
    setModelActionLoading(modelIdentifier);
    
    try {
      const result = await modelService.unloadModel(modelIdentifier);
      
      if (result.success) {
        // Refresh models list
        await fetchModels();
        
        // Clear selection if unloading selected model
        if (selectedModel === modelIdentifier) {
          console.log('[ModelProvider] Clearing selected model');
          setSelectedModel('');
        }
      } else {
        console.error('[ModelProvider] Failed to unload model:', result.error);
      }
    } catch (error) {
      console.error('[ModelProvider] Error unloading model:', error);
    } finally {
      setModelActionLoading(null);
    }
  }, [fetchModels, selectedModel]);
  
  // Select a model
  const selectModel = useCallback((modelIdentifier: string) => {
    console.log('[ModelProvider] Selecting model:', modelIdentifier);
    setSelectedModel(modelIdentifier);
  }, []);
  
  // Initial fetch on mount
  useEffect(() => {
    fetchModels();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Empty dependency array for mount only
  
  // Context value
  const value: ModelContextValue = {
    // State
    models,
    selectedModel,
    modelActionLoading,
    loadingProgress,
    modelsLoading,
    // Actions
    fetchModels,
    loadModel,
    unloadModel,
    selectModel
  };
  
  return (
    <ModelContext.Provider value={value}>
      {children}
    </ModelContext.Provider>
  );
};

/**
 * Hook to use model context
 * @returns Model context value
 * @throws Error if used outside of ModelProvider
 */
export const useModels = (): ModelContextValue => {
  const context = useContext(ModelContext);
  
  if (!context) {
    throw new Error('useModels must be used within a ModelProvider');
  }
  
  return context;
};

/**
 * Hook to get current selected model
 * @returns Selected model identifier or empty string
 */
export const useSelectedModel = (): string => {
  const { selectedModel } = useModels();
  return selectedModel;
};

/**
 * Hook to check if a model is loaded
 * @param modelIdentifier - Model identifier to check
 * @returns Whether the model is loaded
 */
export const useIsModelLoaded = (modelIdentifier: string): boolean => {
  const { models } = useModels();
  return modelService.isModelLoaded(models, modelIdentifier);
}; 