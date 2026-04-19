import { ForecastResult, DataPoint } from '@/types';

export function arima(
  data: number[],
  periods: number = 30,
  confidence: number = 0.95
): ForecastResult {
  const diffData = difference(data, 1);
  const params = simpleFitARIMA(diffData);
  const forecasts = simpleForecast(data, params, periods, confidence);
  
  return {
    model: 'arima',
    predictions: forecasts.predictions,
    lower_bound: forecasts.lower_bound,
    upper_bound: forecasts.upper_bound,
    metrics: calculateMetrics(data, forecasts.predictions),
    parameters: { p: 1, d: 1, q: 1 },
    trainingSize: data.length
  };
}

function difference(values: number[], d: number): number[] {
  let result = [...values];
  for (let i = 0; i < d; i++) {
    const newResult: number[] = [];
    for (let j = 1; j < result.length; j++) {
      const curr = result[j];
      const prev = result[j - 1];
      if (curr !== undefined && prev !== undefined) {
        newResult.push(curr - prev);
      }
    }
    result = newResult;
  }
  return result;
}

interface ARIMAParams {
  ar: number;
  ma: number;
  drift: number;
  sigma2: number;
}

function simpleFitARIMA(data: number[]): ARIMAParams {
  const n = data.length;
  if (n < 10) {
    return { ar: 0.3, ma: 0.2, drift: data[0] ?? 0, sigma2: calculateVariance(data) };
  }
  
  const mean = data.reduce((a, b) => a + b, 0) / n;
  const sumDiff = data.slice(1).reduce((sum, v, i) => {
    const prev = data[i];
    return sum + (prev !== undefined ? v - prev : 0);
  }, 0);
  const drift = sumDiff / (n - 1);
  
  const residuals: number[] = [];
  for (let t = 1; t < n; t++) {
    const curr = data[t];
    const prev = data[t - 1];
    if (curr !== undefined && prev !== undefined) {
      residuals.push(curr - (prev + drift));
    }
  }
  
  const sigma2 = residuals.length > 0 
    ? residuals.reduce((s, r) => s + r * r, 0) / residuals.length 
    : calculateVariance(data);
  
  const acf = new Array(Math.min(3, n)).fill(0);
  for (let l = 0; l < acf.length; l++) {
    let sum = 0;
    for (let i = 0; i < n - l - 1; i++) {
      const curr = data[i];
      const next = data[i + l + 1];
      if (curr !== undefined && next !== undefined) {
        sum += (curr - mean) * (next - mean);
      }
    }
    acf[l] = sum / n;
  }
  
  const ar = acf.length > 0 && acf[0] !== 0 ? acf[1]! / acf[0] : 0.3;
  const ma = residuals.length > 0 ? (residuals[residuals.length - 1] ?? 0) : 0.2;
  
  return {
    ar: Math.max(-1, Math.min(1, ar)),
    ma: Math.max(-1, Math.min(1, ma)),
    drift,
    sigma2: sigma2 || 1
  };
}

function simpleForecast(
  data: number[],
  params: ARIMAParams,
  periods: number,
  confidence: number
): { predictions: number[]; lower_bound: number[]; upper_bound: number[] } {
  const n = data.length;
  const mean = data.reduce((a, b) => a + b, 0) / n;
  const std = Math.sqrt(params.sigma2);
  const zScore = confidence >= 0.99 ? 2.576 : confidence >= 0.95 ? 1.96 : 1.645;
  
  const predictions: number[] = [];
  const lastValues = data.slice(-3);
  
  for (let h = 1; h <= periods; h++) {
    let forecast = mean + params.drift * h;
    
    for (let i = 0; i < lastValues.length; i++) {
      const val = lastValues[lastValues.length - 1 - i];
      if (val !== undefined) {
        forecast += params.ar * val;
      }
    }
    
    predictions.push(forecast);
  }
  
  const predictionsLen = predictions.length;
  const lower_bound: number[] = [];
  const upper_bound: number[] = [];
  
  for (let i = 0; i < predictionsLen; i++) {
    const pred = predictions[i];
    if (pred === undefined) continue;
    const margin = zScore * std * Math.sqrt(1 + i * 0.15);
    lower_bound.push(pred - margin);
    upper_bound.push(pred + margin);
  }
  
  return { predictions, lower_bound, upper_bound };
}

function calculateVariance(values: number[]): number {
  if (values.length === 0) return 0;
  const mean = values.reduce((a, b) => a + b, 0) / values.length;
  return values.reduce((sum, v) => sum + (v - mean) ** 2, 0) / values.length;
}

function calculateMetrics(
  actual: number[],
  predictions: number[]
): { rmse: number; mae: number; mape: number; r2?: number } {
  const testSize = Math.min(predictions.length, Math.floor(actual.length * 0.2));
  if (testSize === 0) {
    return { rmse: 0, mae: 0, mape: 0 };
  }
  
  const actualSlice = actual.slice(-testSize);
  const predSlice = predictions.slice(0, testSize);
  
  let sumSquaredError = 0;
  let sumAbsoluteError = 0;
  let sumAbsolutePercentError = 0;
  
  for (let i = 0; i < testSize; i++) {
    const actualVal = actualSlice[i];
    const predVal = predSlice[i];
    if (actualVal === undefined || predVal === undefined) continue;
    
    const error = actualVal - predVal;
    sumSquaredError += error * error;
    sumAbsoluteError += Math.abs(error);
    
    if (actualVal !== 0) {
      sumAbsolutePercentError += Math.abs(error / actualVal);
    }
  }
  
  const mean = actualSlice.reduce((a, b) => a + b, 0) / testSize;
  let sumSquaredMean = 0;
  for (let i = 0; i < testSize; i++) {
    const actualVal = actualSlice[i];
    if (actualVal !== undefined) {
      sumSquaredMean += (actualVal - mean) ** 2;
    }
  }
  
  const r2 = sumSquaredMean !== 0 ? 1 - sumSquaredError / sumSquaredMean : undefined;
  
  return {
    rmse: Math.sqrt(sumSquaredError / testSize),
    mae: sumAbsoluteError / testSize,
    mape: (sumAbsolutePercentError / testSize) * 100,
    r2
  };
}

export function crossValidate(
  data: number[],
  config: { periods: number; confidence: number }
): number[] {
  const validationSize = Math.min(30, Math.floor(data.length * 0.2));
  const scores: number[] = [];
  
  for (let i = 0; i < 3; i++) {
    const trainEnd = data.length - validationSize * (i + 1);
    if (trainEnd < validationSize || trainEnd < 10) break;
    
    const trainData = data.slice(0, trainEnd);
    const testData = data.slice(trainEnd, trainEnd + validationSize);
    
    const result = arima(trainData, validationSize, config.confidence);
    
    let sumSquaredError = 0;
    for (let j = 0; j < testData.length; j++) {
      const pred = result.predictions[j];
      const actual = testData[j];
      if (pred === undefined || actual === undefined) continue;
      const error = actual - pred;
      sumSquaredError += error * error;
    }
    
    scores.push(Math.sqrt(sumSquaredError / testData.length));
  }
  
  return scores;
}