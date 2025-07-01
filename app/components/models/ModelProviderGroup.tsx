/**
 * ModelProviderGroup Component
 * Groups and displays models by their provider
 */

'use client';

import React, { memo } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ChevronDown, ChevronRight, CheckCircle, Circle } from 'lucide-react';
import { ModelProvider } from '@/app/types/models';
import { useUI, useProviderCollapsed } from '@/app/contexts/UIContext';
import { ModelCard } from './ModelCard';

/**
 * ModelProviderGroup component props
 */
interface ModelProviderGroupProps {
  provider: ModelProvider;
  isActiveProvider: boolean;
}

/**
 * ModelProviderGroup component
 * Displays a collapsible group of models from a single provider
 */
export const ModelProviderGroup: React.FC<ModelProviderGroupProps> = memo(({ 
  provider, 
  isActiveProvider 
}) => {
  console.log('[ModelProviderGroup] Rendering provider:', provider.name);
  
  const { toggleProvider } = useUI();
  const isCollapsed = useProviderCollapsed(provider.name);
  
  const totalModels = provider.models.loaded.length + provider.models.available.length;
  const isOpen = !isCollapsed;
  
  return (
    <div className={`rounded-lg ${isActiveProvider && isCollapsed ? 'border-2 border-green-500' : ''}`}>
      <Collapsible open={isOpen} onOpenChange={() => toggleProvider(provider.name)}>
        <CollapsibleTrigger asChild>
          <Button 
            variant="ghost" 
            className={`w-full justify-between p-2 h-auto ${
              isActiveProvider ? 'bg-green-50 hover:bg-green-100' : ''
            }`}
          >
            <div className="flex items-center gap-2">
              <span className="text-lg">{provider.icon}</span>
              <span className="font-medium">{provider.name}</span>
              <Badge variant="secondary" className="text-xs">
                {totalModels}
              </Badge>
              {isActiveProvider && (
                <Badge variant="default" className="text-xs bg-green-500">
                  Active
                </Badge>
              )}
            </div>
            {isOpen ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
          </Button>
        </CollapsibleTrigger>
        
        <CollapsibleContent className="space-y-3 mt-2">
          {/* Loaded Models */}
          {provider.models.loaded.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center gap-2 px-2">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <Label className="text-xs font-medium text-green-700">
                  Loaded ({provider.models.loaded.length})
                </Label>
              </div>
              {provider.models.loaded.map((model) => (
                <ModelCard key={`loaded-${model.identifier}`} model={model} />
              ))}
            </div>
          )}
          
          {/* Available Models */}
          {provider.models.available.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center gap-2 px-2">
                <Circle className="h-4 w-4 text-muted-foreground" />
                <Label className="text-xs font-medium text-muted-foreground">
                  Available ({provider.models.available.length})
                </Label>
              </div>
              {provider.models.available.map((model) => (
                <ModelCard key={`available-${model.identifier}`} model={model} />
              ))}
            </div>
          )}
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
});

ModelProviderGroup.displayName = 'ModelProviderGroup'; 