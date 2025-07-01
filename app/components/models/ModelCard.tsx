/**
 * ModelCard Component
 * Displays a single model with its information and actions
 */

'use client';

import React, { memo } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  CheckCircle, 
  Circle, 
  Brain, 
  RefreshCw, 
  Power, 
  Download 
} from 'lucide-react';
import { Model } from '@/app/types/models';
import { useModels, useSelectedModel, useIsModelLoaded } from '@/app/contexts/ModelContext';
import { formatModelName, formatFileSize } from '@/app/utils/formatters';
import { supportsReasoning } from '@/app/utils/modelHelpers';

/**
 * ModelCard component props
 */
interface ModelCardProps {
  model: Model;
}

/**
 * ModelCard component
 * Shows model details and provides load/unload/select actions
 */
export const ModelCard: React.FC<ModelCardProps> = memo(({ model }) => {
  console.log('[ModelCard] Rendering model:', model.identifier);
  
  const { 
    loadModel, 
    unloadModel, 
    selectModel, 
    modelActionLoading, 
    loadingProgress 
  } = useModels();
  const selectedModel = useSelectedModel();
  const isLoaded = useIsModelLoaded(model.identifier);
  
  const isSelected = selectedModel === model.identifier;
  const isActionLoading = modelActionLoading === model.identifier;
  const currentProgress = loadingProgress[model.identifier];
  const isLoadingWithProgress = isActionLoading && currentProgress !== undefined;
  const hasReasoning = supportsReasoning(model.identifier);
  
  return (
    <Card className={`transition-all duration-200 ${
      isSelected ? 'ring-2 ring-blue-500 bg-blue-50' : 
      isLoaded ? 'bg-green-50 border-green-200' : ''
    }`}>
      <CardContent className="p-4">
        {/* Model info */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <h4 className="font-medium text-sm mb-1" title={model.identifier}>
              {formatModelName(model.identifier)}
            </h4>
            <div className="flex items-center gap-2 mb-2">
              <Badge variant={isLoaded ? 'default' : 'secondary'} className="text-xs">
                {isLoaded ? <CheckCircle className="h-3 w-3 mr-1" /> : <Circle className="h-3 w-3 mr-1" />}
                {isLoaded ? 'Loaded' : 'Available'}
              </Badge>
              <span className="text-xs text-muted-foreground">
                {formatFileSize(model.size)}
              </span>
            </div>
            {hasReasoning && (
              <Badge variant="outline" className="text-xs">
                <Brain className="h-3 w-3 mr-1" />
                Reasoning
              </Badge>
            )}
          </div>
          {isSelected && (
            <Badge className="bg-blue-500">Active</Badge>
          )}
        </div>
        
        {/* Loading Progress Bar */}
        {isLoadingWithProgress && (
          <div className="mb-3">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs text-muted-foreground">Loading model...</span>
              <span className="text-xs text-muted-foreground">{Math.round(currentProgress)}%</span>
            </div>
            <Progress value={currentProgress} className="h-2" />
          </div>
        )}
        
        {/* Action buttons */}
        <div className="flex flex-col gap-2">
          {isLoaded ? (
            <>
              <Button
                onClick={() => selectModel(model.identifier)}
                disabled={isSelected}
                variant={isSelected ? 'default' : 'outline'}
                size="sm"
                className="w-full"
              >
                {isSelected ? 'Selected' : 'Select'}
              </Button>
              <Button
                onClick={() => unloadModel(model.identifier)}
                disabled={isActionLoading}
                variant="destructive"
                size="sm"
                className="w-full"
              >
                {isActionLoading ? (
                  <RefreshCw className="h-3 w-3 mr-2 animate-spin" />
                ) : (
                  <Power className="h-3 w-3 mr-2" />
                )}
                {isActionLoading ? 'Unloading...' : 'Unload'}
              </Button>
            </>
          ) : (
            <Button
              onClick={() => loadModel(model.identifier)}
              disabled={isActionLoading}
              variant="outline"
              size="sm"
              className="w-full"
            >
              {isActionLoading ? (
                <RefreshCw className="h-3 w-3 mr-2 animate-spin" />
              ) : (
                <Download className="h-3 w-3 mr-2" />
              )}
              {isActionLoading ? 'Loading...' : 'Load'}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
});

ModelCard.displayName = 'ModelCard';

 