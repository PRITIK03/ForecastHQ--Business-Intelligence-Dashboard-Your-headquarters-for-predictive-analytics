import { ForecastResult } from '@/types';

export function movingAverage(
  data: number[],
  periods: number,
  confidence: number = 0.95,
  windowSize: number = 7
): ForecastResult {
  const n = data.length;
  if (n < windowSize) {
    return createEmptyForecast('moving-average', periods);
  }

  const simpleMA = calculateSMA(data, windowSize);
  const ema = calculateEMA(data, windowSize);
  
  const trend = detectTrend(data, windowSize);
  const seasonality = calculateSeasonalityFactor(data, 7);
  
  const variance = calculateVariance(data, simpleMA);
  const se = Math.sqrt(variance);
  const z = confidenceInterval(confidence);
  
  const forecast: number[] = [];
  const lower_bound: number[] = [];
  const upper_bound: number[] = [];
  
  const weights = calculateWeights(windowSize);
  const lastValues = data.slice(-windowSize);
  const baseMA = weightedAverage(lastValues, weights);
  
  const recentGrowth = (data[n - 1] - data[Math.max(0, n - windowSize)]) / windowSize;
  
  for (let h = 1; h <= periods; h++) {
    const seasonFactor = seasonality[(h - 1) % seasonality.length];
    const trendAdjust = recentGrowth * h * 0.5;
    
    const pred = baseMA * seasonFactor + trendAdjust;
    forecast.push(pred);
    
    const forecastError = se * Math.sqrt(h / windowSize);
    lower_bound.push(pred - z * forecastError);
    upper_bound.push(pred + z * forecastError);
  }
  
  const metrics = calculateMetrics(data, simpleMA);
  
  return {
    model: 'moving-average',
    predictions: forecast,
    lower_bound,
    upper_bound,
    metrics
  };
}

function calculateSMA(data: number[], windowSize: number): number[] {
  const sma: number[] = new Array(data.length).fill(0);
  
  for (let i = windowSize - 1; i < data.length; i++) {
    let sum = 0;
    for (let j = 0; j < windowSize; j++) {
      sum += data[i - j];
    }
    sma[i] = sum / windowSize;
  }
  
  for (let i = 0; i < windowSize - 1; i++) {
    sma[i] = data[i];
  }
  
  return sma;
}

function calculateEMA(data: number[], windowSize: number): number[] {
  const ema: number[] = new Array(data.length).fill(0);
  const alpha = 2 / (windowSize + 1);
  
  ema[0] = data[0];
  for (let i = 1; i < data.length; i++) {
    ema[i] = alpha * data[i] + (1 - alpha) * ema[i - 1];
  }
  
  return ema;
}

function detectTrend(data: number[], windowSize: number): number {
  const recentData = data.slice(-windowSize);
  const first = recentData.slice(0, Math.floor(windowSize / 2));
  const second = recentData.slice(Math.floor(windowSize / 2));
  
  const firstAvg = first.reduce((a, b) => a + b, 0) / first.length;
  const secondAvg = second.reduce((a, b) => a + b, 0) / second.length;
  
  return (secondAvg - firstAvg) / windowSize;
}

function calculateSeasonalityFactor(data: number[], period: number): number[] {
  const factors: number[] = new Array(period).fill(0);
  const counts: number[] = new Array(period).fill(0);
  
  const detrended = removeTrend(data, period);
  
  for (let i = 0; i < data.length; i++) {
    const idx = i % period;
    factors[idx] += detrended[i];
    counts[idx]++;
  }
  
  const avg = factors.reduce((a, b) => a + b, 0) / data.length;
  
  for (let i = 0; i < period; i++) {
    factors[i] = counts[i] > 0 ? factors[i] / counts[i] / avg : 1;
  }
  
  return factors;
}

function removeTrend(data: number[], windowSize: number): number[] {
  const detrended: number[] = new Array(data.length).fill(0);
  
  for (let i = windowSize; i < data.length; i++) {
    let sum = 0;
    for (let j = 0; j < windowSize; j++) {
      sum += data[i - j];
    }
    const ma = sum / windowSize;
    detrended[i] = ma > 0 ? data[i] / ma : 1;
  }
  
  for (let i = 0; i < windowSize; i++) {
    detrended[i] = 1;
  }
  
  return detrended;
}

function calculateWeights(windowSize: number): number[] {
  const weights: number[] = new Array(windowSize).fill(0);
  let total = 0;
  
  for (let i = 0; i < windowSize; i++) {
    weights[i] = windowSize - i;
    total += weights[i];
  }
  
  return weights.map(w => w / total);
}

function weightedAverage(values: number[], weights: number[]): number {
  let sum = 0;
  let total = 0;
  
  for (let i = 0; i < values.length && i < weights.length; i++) {
    sum += values[i] * weights[i];
    total += weights[i];
  }
  
  return total > 0 ? sum / total : 0;
}

function calculateVariance(actual: number[], fitted: number[]): number {
  let sum = 0;
  let count = 0;
  
  const startIdx = fitted.findIndex(v => v !== 0);
  for (let i = Math.max(0, startIdx); i < actual.length; i++) {
    sum += Math.pow(actual[i] - fitted[i], 2);
    count++;
  }
  
  return count > 0 ? sum / count : 1;
}

function confidenceInterval(confidence: number): number {
  if (confidence >= 0.99) return 2.576;
  if (confidence >= 0.95) return 1.96;
  if (confidence >= 0.90) return 1.645;
  if (confidence >= 0.80) return 1.28;
  return 1.0;
}

function calculateMetrics(actual: number[], fitted: number[]): { rmse: number; mae: number; mape: number } {
  let rmseSum = 0;
  let maeSum = 0;
  let mapeSum = 0;
  let count = 0;
  
  for (let i = 0; i < actual.length && i < fitted.length; i++) {
    if (fitted[i] !== 0) {
      rmseSum += Math.pow(actual[i] - fitted[i], 2);
      maeSum += Math.abs(actual[i] - fitted[i]);
      if (actual[i] !== 0) {
        mapeSum += Math.abs((actual[i] - fitted[i]) / actual[i]);
      }
      count++;
    }
  }
  
  return {
    rmse: count > 0 ? Math.sqrt(rmseSum / count) : 0,
    mae: count > 0 ? maeSum / count : 0,
    mape: count > 0 ? (mapeSum / count) * 100 : 0
  };
}

function createEmptyForecast(model: ForecastResult['model'], periods: number): ForecastResult {
  return {
    model,
    predictions: new Array(periods).fill(0),
    lower_bound: new Array(periods).fill(0),
    upper_bound: new Array(periods).fill(0),
    metrics: { rmse: 0, mae: 0, mape: 0 }
  };
}