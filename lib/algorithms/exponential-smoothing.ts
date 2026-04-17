import { ForecastResult } from '@/types';

interface HoltWintersParams {
  alpha: number;
  beta: number;
  gamma: number;
  seasonalPeriod: number;
}

export function exponentialSmoothing(
  data: number[],
  periods: number,
  confidence: number = 0.95
): ForecastResult {
  const n = data.length;
  if (n < 2) {
    return createEmptyForecast('exponential-smoothing', periods);
  }

  const seasonalPeriod = detectSeasonality(data);
  const params = optimizeHoltWinters(data, seasonalPeriod);
  
  const { alpha, beta, gamma } = params;
  const level: number[] = new Array(n).fill(0);
  const trend: number[] = new Array(n).fill(0);
  const seasonal: number[] = new Array(n).fill(0);
  
  level[0] = data[0];
  trend[0] = data[1] - data[0];
  for (let i = 0; i < seasonalPeriod; i++) {
    seasonal[i] = data[i] - level[0];
  }

  for (let t = seasonalPeriod; t < n; t++) {
    const lastLevel = level[t - 1];
    const lastTrend = trend[t - 1];
    const s = seasonal[t - seasonalPeriod];
    
    level[t] = alpha * (data[t] - s) + (1 - alpha) * (lastLevel + lastTrend);
    trend[t] = beta * (level[t] - lastLevel) + (1 - beta) * lastTrend;
    seasonal[t] = gamma * (data[t] - level[t]) + (1 - gamma) * seasonal[t - seasonalPeriod];
  }

  const forecast: number[] = new Array(periods).fill(0);
  const lower_bound: number[] = new Array(periods).fill(0);
  const upper_bound: number[] = new Array(periods).fill(0);

  const lastLevel = level[n - 1];
  const lastTrend = trend[n - 1];
  const seasonIdx = (n - seasonalPeriod) % seasonalPeriod;

  const variance = calculateVariance(data, level);
  const se = Math.sqrt(variance);

  for (let h = 1; h <= periods; h++) {
    const season = seasonal[n - seasonalPeriod + ((h + seasonIdx) % seasonalPeriod)];
    forecast[h - 1] = lastLevel + h * lastTrend + season;
    
    const z = confidenceIntervals(confidence);
    const forecastError = se * Math.sqrt(h);
    lower_bound[h - 1] = forecast[h - 1] - z * forecastError;
    upper_bound[h - 1] = forecast[h - 1] + z * forecastError;
  }

  const metrics = calculateMetrics(data, level);
  
  return {
    model: 'exponential-smoothing',
    predictions: forecast,
    lower_bound,
    upper_bound,
    metrics
  };
}

function detectSeasonality(data: number[]): number {
  const n = data.length;
  if (n < 14) return 7;
  
  const autocorr = new Array(Math.min(12, n >> 1)).fill(0);
  const mean = data.reduce((a, b) => a + b, 0) / n;
  
  for (let lag = 1; lag <= autocorr.length; lag++) {
    let sum = 0;
    for (let i = lag; i < n; i++) {
      sum += (data[i] - mean) * (data[i - lag] - mean);
    }
    autocorr[lag - 1] = sum;
  }

  let maxCorr = 0;
  let period = 7;
  for (let i = 1; i < autocorr.length; i++) {
    if (autocorr[i] > maxCorr) {
      maxCorr = autocorr[i];
      period = i + 1;
    }
  }
  
  return period;
}

function optimizeHoltWinters(data: number[], seasonalPeriod: number): HoltWintersParams {
  const testSize = Math.min(20, data.length - seasonalPeriod * 2);
  const trainData = data.slice(0, data.length - testSize);
  
  let bestParams: HoltWintersParams = { alpha: 0.3, beta: 0.1, gamma: 0.1, seasonalPeriod };
  let bestError = Infinity;
  
  const alphas = [0.1, 0.3, 0.5];
  const betas = [0.05, 0.1, 0.2];
  const gammas = [0.05, 0.1, 0.2];
  
  for (const alpha of alphas) {
    for (const beta of betas) {
      for (const gamma of gammas) {
        const params = { alpha, beta, gamma, seasonalPeriod };
        try {
          const forecast = holtWintersForecast(trainData, data.length - trainData.length + 1, params);
          const actual = data.slice(trainData.length);
          let error = 0;
          for (let i = 0; i < forecast.length; i++) {
            error += Math.pow(forecast[i] - actual[i], 2);
          }
          error = Math.sqrt(error / forecast.length);
          
          if (error < bestError) {
            bestError = error;
            bestParams = params;
          }
        } catch {
          continue;
        }
      }
    }
  }
  
  return bestParams;
}

function holtWintersForecast(data: number[], periods: number, params: HoltWintersParams): number[] {
  const { alpha, beta, gamma, seasonalPeriod } = params;
  const n = data.length;
  
  const level: number[] = new Array(n).fill(0);
  const trend: number[] = new Array(n).fill(0);
  const seasonal: number[] = new Array(n).fill(0);
  
  level[0] = data[0];
  trend[0] = data[1] - data[0];
  for (let i = 0; i < seasonalPeriod; i++) {
    seasonal[i] = data[i] - level[0];
  }
  
  for (let t = seasonalPeriod; t < n; t++) {
    level[t] = alpha * (data[t] - seasonal[t - seasonalPeriod]) + (1 - alpha) * (level[t - 1] + trend[t - 1]);
    trend[t] = beta * (level[t] - level[t - 1]) + (1 - beta) * trend[t - 1];
    seasonal[t] = gamma * (data[t] - level[t]) + (1 - gamma) * seasonal[t - seasonalPeriod];
  }
  
  const forecast: number[] = new Array(periods).fill(0);
  const lastLevel = level[n - 1];
  const lastTrend = trend[n - 1];
  const seasonIdx = (n - seasonalPeriod) % seasonalPeriod;
  
  for (let h = 1; h <= periods; h++) {
    const season = seasonal[n - seasonalPeriod + ((h + seasonIdx) % seasonalPeriod)];
    forecast[h - 1] = lastLevel + h * lastTrend + season;
  }
  
  return forecast;
}

function calculateVariance(data: number[], level: number[]): number {
  let sum = 0;
  let count = 0;
  for (let i = 0; i < data.length; i++) {
    const residual = data[i] - level[i];
    sum += residual * residual;
    count++;
  }
  return count > 0 ? sum / count : 1;
}

function confidenceIntervals(confidence: number): number {
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
    rmseSum += Math.pow(actual[i] - fitted[i], 2);
    maeSum += Math.abs(actual[i] - fitted[i]);
    if (actual[i] !== 0) {
      mapeSum += Math.abs((actual[i] - fitted[i]) / actual[i]);
    }
    count++;
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