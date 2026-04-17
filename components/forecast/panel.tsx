'use client';

import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useInsightStore, useDataMetrics } from '@/lib/store';
import { ModelType, ForecastResult } from '@/types';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, RefreshCw, Sparkles, BarChart3, TrendingUp, Activity } from 'lucide-react';

interface ModelOption {
  value: ModelType;
  label: string;
  description: string;
  icon: React.ElementType;
}

const modelOptions: ModelOption[] = [
  { 
    value: 'exponential-smoothing', 
    label: 'Holt-Winters', 
    description: 'Best for seasonal data with trend',
    icon: TrendingUp 
  },
  { 
    value: 'linear-regression', 
    label: 'Linear Regression', 
    description: 'Feature-rich polynomial model',
    icon: Activity 
  },
  { 
    value: 'moving-average', 
    label: 'Moving Average', 
    description: 'Simple weighted average',
    icon: BarChart3 
  },
  { 
    value: 'ensemble', 
    label: 'Ensemble', 
    description: 'Combination of all models',
    icon: Sparkles 
  }
];

export function ForecastPanel() {
  const { 
    data, 
    forecast, 
    models, 
    config, 
    isLoading,
    selectedModel,
    generateData, 
    runForecast, 
    compareAllModels,
    setSelectedModel 
  } = useInsightStore();
  
  const metrics = useDataMetrics();
  
  const handleGenerate = () => {
    generateData();
  };
  
  const handleRunForecast = () => {
    runForecast({ model: selectedModel });
  };
  
  const handleCompare = () => {
    compareAllModels();
  };
  
  return (
    <Card className="space-y-4">
      <div className="flex items-center justify-between">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-indigo-500" />
            Forecast Engine
          </CardTitle>
        </CardHeader>
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={handleGenerate}
          disabled={isLoading}
        >
          <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
          Generate
        </Button>
      </div>
      
      <div className="space-y-3">
        <p className="text-xs text-zinc-500 mb-2">Select Model</p>
        <div className="grid grid-cols-2 gap-2">
          {modelOptions.map((model) => {
            const Icon = model.icon;
            const isSelected = selectedModel === model.value;
            const modelResult = models.find(m => m.model === model.value);
            const error = modelResult?.metrics.rmse;
            
            return (
              <motion.button
                key={model.value}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setSelectedModel(model.value)}
                className={`p-3 rounded-lg text-left transition-all ${
                  isSelected 
                    ? 'bg-indigo-600/20 border-indigo-500 border' 
                    : 'bg-zinc-800/30 border border-zinc-800 hover:bg-zinc-800/50'
                }`}
              >
                <div className="flex items-center gap-2 mb-1">
                  <Icon className={`w-4 h-4 ${isSelected ? 'text-indigo-400' : 'text-zinc-500'}`} />
                  <span className={`text-sm font-medium ${isSelected ? 'text-indigo-300' : 'text-zinc-300'}`}>
                    {model.label}
                  </span>
                </div>
                <p className="text-xs text-zinc-500 truncate">{model.description}</p>
                {error !== undefined && (
                  <p className="text-xs text-zinc-600 mt-1">RMSE: {error.toFixed(2)}</p>
                )}
              </motion.button>
            );
          })}
        </div>
      </div>
      
      <div className="flex gap-2 pt-2">
        <Button 
          onClick={handleRunForecast} 
          disabled={data.length === 0 || isLoading}
          className="flex-1"
        >
          <Play className="w-4 h-4 mr-2" />
          Run
        </Button>
        <Button 
          variant="secondary" 
          onClick={handleCompare}
          disabled={data.length === 0 || isLoading}
          className="flex-1"
        >
          Compare All
        </Button>
      </div>
      
      <AnimatePresence>
        {forecast && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="space-y-3 pt-3 border-t border-zinc-800"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-zinc-500">Model</p>
                <p className="text-sm text-zinc-200 capitalize">{forecast.model.replace('-', ' ')}</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-zinc-500">Next {config.periods} days</p>
                <p className="text-sm text-emerald-400 font-medium">
                  ${forecast.predictions[0]?.toFixed(0)}
                </p>
              </div>
            </div>
            
            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="bg-zinc-800/30 rounded p-2">
                <p className="text-xs text-zinc-500">RMSE</p>
                <p className="text-sm text-zinc-200">{forecast.metrics.rmse.toFixed(2)}</p>
              </div>
              <div className="bg-zinc-800/30 rounded p-2">
                <p className="text-xs text-zinc-500">MAE</p>
                <p className="text-sm text-zinc-200">{forecast.metrics.mae.toFixed(2)}</p>
              </div>
              <div className="bg-zinc-800/30 rounded p-2">
                <p className="text-xs text-zinc-500">MAPE</p>
                <p className="text-sm text-zinc-200">{forecast.metrics.mape.toFixed(1)}%</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </Card>
  );
}