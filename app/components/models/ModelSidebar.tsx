/**
 * ModelSidebar Component
 * Sidebar for model selection and management
 */

'use client';

import React, { memo, useEffect, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { RefreshCw, Bot } from 'lucide-react';
import { useModels, useSelectedModel } from '@/app/contexts/ModelContext';
import { useUI } from '@/app/contexts/UIContext';
import { groupModelsByProvider, getModelProvider, sortProviders } from '@/app/utils/modelHelpers';
import { ModelProviderGroup } from './ModelProviderGroup';

/**
 * ModelSidebar component
 * Displays available models grouped by provider
 */
export const ModelSidebar: React.FC = memo(() => {
  console.log('[ModelSidebar] Rendering model sidebar');
  
  const { models, modelsLoading, fetchModels } = useModels();
  const selectedModel = useSelectedModel();
  const { collapseAllProviders } = useUI();
  
  // Group models by provider
  const groupedModels = useMemo(() => {
    if (!models) return {};
    return groupModelsByProvider(models.loaded, models.available);
  }, [models]);
  
  // Get active provider and sort providers
  const activeProvider = selectedModel ? getModelProvider(selectedModel) : null;
  const sortedProviders = useMemo(() => {
    return sortProviders(Object.keys(groupedModels), activeProvider);
  }, [groupedModels, activeProvider]);
  
  // Auto-collapse providers on first load
  useEffect(() => {
    if (sortedProviders.length > 0 && models) {
      console.log('[ModelSidebar] Auto-collapsing all providers');
      collapseAllProviders(sortedProviders);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [models]); // Only on models change, not sortedProviders
  
  // Calculate total models
  const totalModels = useMemo(() => {
    return Object.values(groupedModels).reduce((sum, provider) => {
      return sum + provider.models.loaded.length + provider.models.available.length;
    }, 0);
  }, [groupedModels]);
  
  return (
    <div className="w-80 border-r bg-background h-full flex flex-col">
      {/* Header */}
      <div className="p-4 border-b">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Models</h2>
          <Button
            onClick={fetchModels}
            disabled={modelsLoading}
            variant="ghost"
            size="sm"
          >
            <RefreshCw className={`h-4 w-4 ${modelsLoading ? 'animate-spin' : ''}`} />
          </Button>
        </div>
      </div>

      {/* Models List */}
      <ScrollArea className="flex-1">
        <div className="p-4">
          {models?.error ? (
            <Card className="border-red-200 bg-red-50">
              <CardContent className="p-4">
                <p className="text-sm text-red-600">{models.error}</p>
                {models.suggestion && (
                  <p className="text-xs text-muted-foreground mt-1">{models.suggestion}</p>
                )}
              </CardContent>
            </Card>
          ) : totalModels === 0 ? (
            <Card>
              <CardContent className="p-6 text-center">
                <Bot className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <p className="text-sm text-muted-foreground mb-2">No models found</p>
                <p className="text-xs text-muted-foreground">
                  Download models using:<br />
                  <code className="bg-muted px-2 py-1 rounded mt-1 inline-block">
                    lms get model-name
                  </code>
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {sortedProviders.map((providerName) => {
                const provider = groupedModels[providerName];
                if (!provider) return null;
                
                return (
                  <ModelProviderGroup
                    key={providerName}
                    provider={provider}
                    isActiveProvider={providerName === activeProvider}
                  />
                );
              })}
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
});

ModelSidebar.displayName = 'ModelSidebar'; 