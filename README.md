# InsightFlow - AI-Powered Analytics Dashboard

<p align="center">
  <img src="https://img.shields.io/badge/Next.js-16-black?style=for-the-badge&logo=next.js" alt="Next.js">
  <img src="https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript" alt="TypeScript">
  <img src="https://img.shields.io/badge/Tailwind-4.0-38bdf8?style=for-the-badge&logo=tailwind-css" alt="Tailwind">
  <img src="https://img.shields.io/badge/Recharts-3.8-orange?style=for-the-badge" alt="Recharts">
  <img src="https://img.shields.io/badge/License-MIT-green?style=for-the-badge" alt="License">
</p>

<p align="center">
  A production-grade AI analytics dashboard with real-time forecasting algorithms, synthetic data generation, and interactive visualizations.
</p>

---

## Features

### Forecasting Engine
- **Holt-Winters Exponential Smoothing** - Best for seasonal data with trend
- **Linear Regression** - Polynomial features with engineered attributes
- **Weighted Moving Average** - Simple but effective smoothing
- **Ensemble Model** - Weighted combination of all algorithms

### Metrics & Visualization
- RMSE, MAE, and MAPE performance metrics
- Confidence intervals (80%, 95%)
- Interactive time-series charts with zoom/pan
- Anomaly detection with visual highlighting

### Data Capabilities
- Built-in synthetic data generator
- Configurable seasonality, trend, and noise
- CSV export functionality
- Data aggregation (daily/weekly/monthly)

---

## Quick Start

```bash
# Clone and navigate
cd insightflow

# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the dashboard.

---

## Project Structure

```
insightflow/
├── app/
│   ├── layout.tsx          # Root layout with dark mode
│   ├── page.tsx            # Main dashboard page
│   └── globals.css         # Global styles
├── components/
│   ├── ui/                 # Card, Button components
│   ├── charts/             # TimeSeriesChart
│   ├── forecast/           # ForecastPanel
│   └── dashboard/         # KPICard, Sidebar
├── lib/
│   ├── algorithms/         # ML algorithms
│   │   ├── forecast.ts    # Main forecasting module
│   │   ├── exponential-smoothing.ts
│   │   ├── linear-regression.ts
│   │   └── moving-average.ts
│   ├── data/               # Data generation
│   │   └── generator.ts
│   └── store.ts            # Zustand state management
├── types/
│   └── index.ts            # TypeScript definitions
└── package.json
```

---

## Tech Stack

| Category | Technology |
|----------|------------|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript (strict) |
| Styling | Tailwind CSS v4 |
| Charts | Recharts |
| Animation | Framer Motion |
| State | Zustand |
| Icons | Lucide React |

---

## Available Scripts

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run start    # Start production server
npm run lint     # Run ESLint
```

---

## Key Algorithms

### Exponential Smoothing (Holt-Winters)
Implements triple exponential smoothing with:
- Level, trend, and seasonal components
- Automatic seasonality detection
- Optimized alpha, beta, gamma parameters

### Linear Regression
Feature-rich polynomial regression:
- Time-based features (day, month cycles)
- Lag features (7-day, 30-day)
- Rolling statistics (moving averages)

### Moving Average
Weighted moving average with:
- Exponential smoothing option
- Seasonality factor calculation
- Trend detection

---

## License

MIT License - feel free to use for personal and commercial projects.

---

## Acknowledgments

Built with inspiration from [Tremor](https://tremor.so) and [Recharts](https://recharts.org) patterns for dashboard design.