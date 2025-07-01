/**
 * Model-related type definitions
 * Provides comprehensive types for model management and operations
 */

/**
 * Represents a single model
 */
export interface Model {
  identifier: string;
  path: string;
  size: number;
}

/**
 * API response for model listing
 */
export interface ModelsResponse {
  loaded: Model[];
  available: Model[];
  timestamp: string;
  error?: string;
  suggestion?: string;
}

/**
 * Model loading progress state
 */
export interface ModelLoadingProgress {
  [modelIdentifier: string]: number;
}

/**
 * Model context state
 */
export interface ModelState {
  models: ModelsResponse | null;
  selectedModel: string;
  modelActionLoading: string | null;
  loadingProgress: ModelLoadingProgress;
  modelsLoading: boolean;
}

/**
 * Model context actions
 */
export interface ModelActions {
  fetchModels: () => Promise<void>;
  loadModel: (modelIdentifier: string) => Promise<void>;
  unloadModel: (modelIdentifier: string) => Promise<void>;
  selectModel: (modelIdentifier: string) => void;
}

/**
 * Combined model context value
 */
export interface ModelContextValue extends ModelState, ModelActions {}

/**
 * Model action request payload
 */
export interface ModelActionRequest {
  action: 'load' | 'unload';
  modelIdentifier: string;
}

/**
 * Model action response
 */
export interface ModelActionResponse {
  success: boolean;
  message: string;
  timestamp: string;
  error?: string;
}

/**
 * Model provider metadata
 */
export interface ModelProvider {
  name: string;
  icon: string;
  models: {
    loaded: Model[];
    available: Model[];
  };
} 