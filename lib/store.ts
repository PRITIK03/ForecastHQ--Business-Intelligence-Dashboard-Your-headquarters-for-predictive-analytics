import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { shallow } from 'zustand/shallow';
import { useMemo } from 'react';
import { DataPoint, ForecastResult, ForecastConfig, ModelType } from '@/types';
import { runForecast, compareModels, getBestModel } from '@/lib/algorithms/forecast';
import { generateSampleData, calculateMetrics } from '@/lib/data/generator';

interface InsightStore {
  data: DataPoint[];
  forecast: ForecastResult | null;
  models: ForecastResult[];
  config: ForecastConfig;
  isLoading: boolean;
  selectedModel: ModelType;
  
  setData: (data: DataPoint[]) => void;
  generateData: () => void;
  runForecast: (config?: Partial<ForecastConfig>) => void;
  compareAllModels: () => void;
  setSelectedModel: (model: ModelType) => void;
  setConfig: (config: Partial<ForecastConfig>) => void;
  clearForecast: () => void;
}

export const useInsightStore = create<InsightStore>()(
  persist(
    (set, get) => ({
      data: [],
      forecast: null,
      models: [],
      config: {
        model: 'exponential-smoothing',
        periods: 30,
        confidence: 0.95
      },
      isLoading: false,
      selectedModel: 'exponential-smoothing',

      setData: (data) => set({ data }),

      generateData: () => {
        set({ isLoading: true });
        // Use setTimeout to prevent synchronous state updates
        setTimeout(() => {
          const data = generateSampleData('sales');
          set({ data, isLoading: false });
        }, 0);
      },
      
      runForecast: (configOverride) => {
        const { data, config } = get();
        if (data.length === 0) return;

        set({ isLoading: true });

        const newConfig = { ...config, ...configOverride };

        // Use setTimeout to prevent synchronous state updates
        setTimeout(() => {
          const result = runForecast(data, newConfig);
          set({
            forecast: result,
            config: newConfig,
            isLoading: false
          });
        }, 0);
      },
      
      compareAllModels: () => {
        const { data, config } = get();
        if (data.length === 0) return;

        set({ isLoading: true });

        // Use setTimeout to prevent synchronous state updates
        setTimeout(() => {
          const models = compareModels(data, config);
          const best = getBestModel(models);

          set({
            models,
            forecast: best,
            isLoading: false
          });
        }, 0);
      },
      
      setSelectedModel: (model) => {
        set({ selectedModel: model });
      },
      
      setConfig: (configUpdate) => {
        const { config } = get();
        set({ config: { ...config, ...configUpdate } });
      },
      
      clearForecast: () => set({ forecast: null, models: [] })
    }),
    {
      name: 'insightflow-storage',
      partialize: (state) => ({ data: state.data, config: state.config })
    }
  )
);

export function useDataMetrics() {
  const data = useInsightStore((state) => state.data, shallow);

  return useMemo(() => {
    if (!Array.isArray(data) || data.length === 0) {
      return {
        total: 0,
        average: 0,
        min: 0,
        max: 0,
        trend: 0,
        growth: 0
      };
    }
    return calculateMetrics(data);
  }, [data]); // Shallow comparison should prevent unnecessary recalculations
}