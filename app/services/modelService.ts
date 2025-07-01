/**
 * Model Service
 * Handles all model-related API communications
 */

import { ModelsResponse, ModelActionRequest, ModelActionResponse } from '@/app/types/models';
import { formatErrorMessage } from '@/app/utils/formatters';

/**
 * Fetch available and loaded models
 * @returns Models response with loaded and available models
 */
export const fetchModels = async (): Promise<ModelsResponse> => {
  console.log('[modelService] Fetching models...');
  
  try {
    const response = await fetch('/api/models');
    const data: ModelsResponse = await response.json();
    
    if (!response.ok) {
      console.error('[modelService] Failed to fetch models:', data);
      throw new Error(data.error || 'Failed to fetch models');
    }
    
    console.log('[modelService] Fetched models:', {
      loaded: data.loaded.length,
      available: data.available.length
    });
    
    return data;
  } catch (error) {
    console.error('[modelService] Error fetching models:', error);
    
    const errorMessage = formatErrorMessage(error);
    let suggestion = '';
    
    if (errorMessage.includes('connection refused') || errorMessage.includes('ECONNREFUSED')) {
      suggestion = 'Start LM Studio desktop app and enable the local server';
    }
    
    return {
      loaded: [],
      available: [],
      timestamp: new Date().toISOString(),
      error: errorMessage,
      suggestion
    };
  }
};

/**
 * Load a model
 * @param modelIdentifier - Model identifier to load
 * @param onProgress - Optional progress callback
 * @returns Model action response
 */
export const loadModel = async (
  modelIdentifier: string,
  onProgress?: (progress: number) => void
): Promise<ModelActionResponse> => {
  console.log('[modelService] Loading model:', modelIdentifier);
  
  // Simulate progress updates since we can't get real-time progress from the API
  const progressInterval = onProgress ? setInterval(() => {
    const currentProgress = Math.random() * 10;
    onProgress(Math.min(90, currentProgress));
  }, 200) : null;
  
  try {
    const response = await fetch('/api/models', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        action: 'load',
        modelIdentifier
      } as ModelActionRequest),
    });

    const data: ModelActionResponse = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error || 'Failed to load model');
    }
    
    // Complete progress
    if (progressInterval) {
      clearInterval(progressInterval);
      onProgress?.(100);
    }
    
    console.log('[modelService] Model loaded successfully:', modelIdentifier);
    return data;
    
  } catch (error) {
    if (progressInterval) {
      clearInterval(progressInterval);
    }
    
    console.error('[modelService] Error loading model:', error);
    
    return {
      success: false,
      message: formatErrorMessage(error),
      timestamp: new Date().toISOString(),
      error: formatErrorMessage(error)
    };
  }
};

/**
 * Unload a model
 * @param modelIdentifier - Model identifier to unload
 * @returns Model action response
 */
export const unloadModel = async (
  modelIdentifier: string
): Promise<ModelActionResponse> => {
  console.log('[modelService] Unloading model:', modelIdentifier);
  
  try {
    const response = await fetch('/api/models', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        action: 'unload',
        modelIdentifier
      } as ModelActionRequest),
    });

    const data: ModelActionResponse = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error || 'Failed to unload model');
    }
    
    console.log('[modelService] Model unloaded successfully:', modelIdentifier);
    return data;
    
  } catch (error) {
    console.error('[modelService] Error unloading model:', error);
    
    return {
      success: false,
      message: formatErrorMessage(error),
      timestamp: new Date().toISOString(),
      error: formatErrorMessage(error)
    };
  }
};

/**
 * Check if model is loaded
 * @param models - Models response
 * @param modelIdentifier - Model identifier to check
 * @returns True if model is loaded
 */
export const isModelLoaded = (
  models: ModelsResponse | null,
  modelIdentifier: string
): boolean => {
  if (!models) return false;
  
  const isLoaded = models.loaded.some(model => model.identifier === modelIdentifier);
  console.log(`[modelService] Model ${modelIdentifier} loaded: ${isLoaded}`);
  
  return isLoaded;
}; 