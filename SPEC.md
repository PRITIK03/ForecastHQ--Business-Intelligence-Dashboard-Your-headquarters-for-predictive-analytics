# InsightFlow - Technical Specification

## Overview

InsightFlow is a client-side sales forecasting dashboard built with Next.js 16, implementing multiple time-series forecasting algorithms with real-time visualization.

---

## Architecture

### State Management
- **Zustand** for global state with persist middleware
- LocalStorage for data and config persistence
- Reactive updates across components

### Rendering Strategy
- Server components for shell/layout
- Client components for interactive elements
- useMemo for expensive chart computations

---

## Algorithms

### 1. Exponential Smoothing (Holt-Winters)

**Parameters:**
- `alpha`: Level smoothing (0.1, 0.3, 0.5)
- `beta`: Trend smoothing (0.05, 0.1, 0.2)
- `gamma`: Seasonal smoothing (0.05, 0.1, 0.2)
- `seasonalPeriod`: Auto-detected or user-specified

**Process:**
1. Detect seasonality using autocorrelation
2. Grid search for optimal parameters
3. Calculate level, trend, seasonal components
4. Forecast with confidence bounds

### 2. Linear Regression

**Features:**
- Time: t, t²
- Seasonal: sin/cos(day), sin/cos(month)
- Lag: 7-day, 30-day
- Rolling: 7-day MA, 30-day MA

**Method:** Normal equation with matrix inversion

### 3. Moving Average

**Variants:**
- Simple Moving Average (SMA)
- Weighted Moving Average (WMA)
- Exponential Moving Average (EMA)

**Enhancements:**
- Seasonality factor adjustment
- Trend extrapolation

---

## Data Pipeline

### Generation
```
Config → Seasonality + Trend + Noise + Outliers → Raw Data
```

### Aggregation
```
Raw Data → Group by frequency → Sum/Average → Aggregated Data
```

### Anomaly Detection
```
Data → Z-score calculation → Threshold → Flagged anomalies
```

---

## UI/UX Decisions

### Color Palette
- Background: `#09090b` (zinc-950)
- Surface: `#18181b` (zinc-900)
- Primary: `#6366f1` (indigo-500)
- Accent: `#8b5cf6` (violet-500)
- Success: `#10b981` (emerald-500)
- Error: `#ef4444` (red-500)

### Dark Mode
- Forced dark theme via `className="dark"`
- Glass-morphism with backdrop-blur
- Subtle gradients for depth

### Animations
- Framer Motion for transitions
- Staggered entrance for cards
- Smooth number transitions

---

## Performance Considerations

- useMemo for chart data transformation
- Zustand selectors for minimal re-renders
- ResponsiveContainer for responsive charts
- Lazy forecast computation

---

## Future Enhancements

### Phase 2 Ideas
- CSV upload with parsing
- Multiple data series comparison
- Customizable forecast periods
- Export to CSV/PDF

### Phase 3 Ideas  
- Vercel AI SDK integration for natural language queries
- Real-time data simulation
- More chart types (candlestick, heatmap)
- Mobile responsive design

---

## Dependencies

```json
{
  "next": "^16.0.0",
  "react": "^19.0.0",
  "recharts": "^3.8.0",
  "zustand": "^5.0.0",
  "framer-motion": "^12.0.0",
  "lucide-react": "^1.0.0",
  "date-fns": "^4.0.0"
}
```