/**
 * Model helper utility functions
 * Provides utilities for model categorization and metadata
 */

import { Model, ModelProvider } from '@/app/types/models';

/**
 * Provider configuration with icons and display names
 */
const PROVIDER_CONFIG: Record<string, { name: string; icon: string; keywords: string[] }> = {
  qwen: { name: 'Qwen', icon: '🔴', keywords: ['qwen', 'alibaba'] },
  meta: { name: 'Meta', icon: '🔵', keywords: ['llama', 'meta'] },
  mistral: { name: 'Mistral', icon: '🟠', keywords: ['mistral'] },
  deepseek: { name: 'DeepSeek', icon: '🟣', keywords: ['deepseek'] },
  microsoft: { name: 'Microsoft', icon: '🔷', keywords: ['phi', 'microsoft'] },
  google: { name: 'Google', icon: '🟢', keywords: ['gemma', 'google'] },
  anthropic: { name: 'Anthropic', icon: '🟦', keywords: ['claude', 'anthropic'] },
  openai: { name: 'OpenAI', icon: '🟩', keywords: ['gpt', 'openai'] },
  yi: { name: '01.AI', icon: '🩷', keywords: ['yi', '01-ai'] },
  code: { name: 'Code Models', icon: '⚫', keywords: ['codestral', 'codellama'] },
  other: { name: 'Other', icon: '⚪', keywords: [] }
};

/**
 * Get model provider based on identifier
 * @param identifier - Model identifier
 * @returns Provider name
 */
export const getModelProvider = (identifier: string): string => {
  const lowerIdentifier = identifier.toLowerCase();
  
  for (const [key, config] of Object.entries(PROVIDER_CONFIG)) {
    if (key === 'other') continue;
    
    const hasKeyword = config.keywords.some(keyword => 
      lowerIdentifier.includes(keyword)
    );
    
    if (hasKeyword) {
      console.log(`[getModelProvider] Identified "${identifier}" as ${config.name}`);
      return config.name;
    }
  }
  
  console.log(`[getModelProvider] No provider match for "${identifier}", defaulting to Other`);
  return PROVIDER_CONFIG.other.name;
};

/**
 * Get provider icon
 * @param provider - Provider name
 * @returns Provider icon emoji
 */
export const getProviderIcon = (provider: string): string => {
  const config = Object.values(PROVIDER_CONFIG).find(c => c.name === provider);
  const icon = config?.icon || PROVIDER_CONFIG.other.icon;
  
  console.log(`[getProviderIcon] Icon for ${provider}: ${icon}`);
  return icon;
};

/**
 * Check if model supports reasoning/thinking
 * @param identifier - Model identifier
 * @returns True if model supports reasoning
 */
export const supportsReasoning = (identifier: string): boolean => {
  const lowerIdentifier = identifier.toLowerCase();
  const hasReasoning = lowerIdentifier.includes('qwen') || 
                      lowerIdentifier.includes('thinking') ||
                      lowerIdentifier.includes('reasoning');
  
  console.log(`[supportsReasoning] Model "${identifier}" supports reasoning: ${hasReasoning}`);
  return hasReasoning;
};

/**
 * Group models by provider
 * @param models - Array of models
 * @returns Models grouped by provider
 */
export const groupModelsByProvider = (
  loaded: Model[], 
  available: Model[]
): Record<string, ModelProvider> => {
  console.log(`[groupModelsByProvider] Grouping ${loaded.length} loaded and ${available.length} available models`);
  
  // Create a unique set of models by identifier
  const uniqueModels = new Map<string, Model>();
  
  // Add loaded models first (they take precedence)
  loaded.forEach(model => {
    uniqueModels.set(model.identifier, model);
  });
  
  // Add available models only if not already present
  available.forEach(model => {
    if (!uniqueModels.has(model.identifier)) {
      uniqueModels.set(model.identifier, model);
    }
  });
  
  const allModels = Array.from(uniqueModels.values());
  
  // Group by provider
  const grouped = allModels.reduce((acc, model) => {
    const provider = getModelProvider(model.identifier);
    const isLoaded = loaded.some(m => m.identifier === model.identifier);
    
    if (!acc[provider]) {
      acc[provider] = {
        name: provider,
        icon: getProviderIcon(provider),
        models: { loaded: [], available: [] }
      };
    }
    
    if (isLoaded) {
      acc[provider].models.loaded.push(model);
    } else {
      acc[provider].models.available.push(model);
    }
    
    return acc;
  }, {} as Record<string, ModelProvider>);
  
  console.log(`[groupModelsByProvider] Created ${Object.keys(grouped).length} provider groups`);
  return grouped;
};

/**
 * Sort providers with active provider first
 * @param providers - Array of provider names
 * @param activeProvider - Currently active provider name
 * @returns Sorted array of provider names
 */
export const sortProviders = (providers: string[], activeProvider: string | null): string[] => {
  return providers.sort((a, b) => {
    if (a === activeProvider) return -1;
    if (b === activeProvider) return 1;
    return a.localeCompare(b);
  });
};

/**
 * Calculate total model size
 * @param models - Array of models
 * @returns Total size in bytes
 */
export const calculateTotalSize = (models: Model[]): number => {
  const total = models.reduce((sum, model) => sum + model.size, 0);
  console.log(`[calculateTotalSize] Total size of ${models.length} models: ${total} bytes`);
  return total;
}; 