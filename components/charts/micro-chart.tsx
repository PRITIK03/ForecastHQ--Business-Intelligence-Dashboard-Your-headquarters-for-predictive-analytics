'use client';

import { DataPoint } from '@/types';
import { Tooltip } from '@/components/ui/tooltip';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { motion } from 'framer-motion';

interface MicroChartProps {
  data: DataPoint[];
  color?: string;
  height?: number;
}

export function MicroChart({ data, color = '#6366f1', height = 40 }: MicroChartProps) {
  // Take the last 30 data points for the micro chart
  const chartData = data.slice(-30);

  if (chartData.length < 2) return null;

  // Calculate trend
  const firstValue = chartData[0].value;
  const lastValue = chartData[chartData.length - 1].value;
  const change = ((lastValue - firstValue) / firstValue) * 100;
  const isPositive = change > 0;
  const isNegative = change < 0;

  // Calculate SVG path
  const values = chartData.map(point => point.value);
  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min || 1;

  const width = 120; // Fixed width for consistency
  const svgHeight = height;

  // Create path points
  const points = chartData.map((point, index) => {
    const x = (index / (chartData.length - 1)) * width;
    const y = svgHeight - ((point.value - min) / range) * (svgHeight - 4) - 2; // 2px margin
    return `${x},${y}`;
  });

  const pathData = `M ${points.join(' L ')}`;

  // Create dots for start and end points
  const startPoint = points[0].split(',').map(Number);
  const endPoint = points[points.length - 1].split(',').map(Number);

  const tooltipContent = (
    <div className="space-y-1">
      <div className="flex items-center gap-2">
        {isPositive && <TrendingUp className="w-3 h-3 text-emerald-400" />}
        {isNegative && <TrendingDown className="w-3 h-3 text-red-400" />}
        {!isPositive && !isNegative && <Minus className="w-3 h-3 text-zinc-400" />}
        <span className="font-medium">
          {isPositive ? '+' : ''}{change.toFixed(1)}% trend
        </span>
      </div>
      <div className="text-xs text-zinc-400">
        Last 30 data points
      </div>
    </div>
  );

  return (
    <Tooltip content={<div>{tooltipContent}</div>}>
      <div className="w-full h-10 cursor-pointer transition-opacity hover:opacity-80 flex items-center justify-center">
        <motion.svg
          width={width}
          height={svgHeight}
          viewBox={`0 0 ${width} ${svgHeight}`}
          className="overflow-visible"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          {/* Gradient definition */}
          <defs>
            <linearGradient id={`sparklineGradient-${color.replace('#', '')}`} x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor={color} stopOpacity="0.8" />
              <stop offset="100%" stopColor={color} stopOpacity="0.4" />
            </linearGradient>
          </defs>

          {/* Background line for better visibility */}
          <path
            d={pathData}
            stroke="rgba(63, 63, 70, 0.3)"
            strokeWidth="1"
            fill="none"
            opacity="0.5"
          />

          {/* Main sparkline */}
          <motion.path
            d={pathData}
            stroke={color}
            strokeWidth="2"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1, ease: "easeInOut" }}
          />

          {/* Animated dots */}
          <motion.circle
            cx={startPoint[0]}
            cy={startPoint[1]}
            r="2"
            fill={color}
            opacity="0.6"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.5, duration: 0.3 }}
          />
          <motion.circle
            cx={endPoint[0]}
            cy={endPoint[1]}
            r="2"
            fill={color}
            opacity="0.8"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.7, duration: 0.3 }}
          />

          {/* Trend indicator dot */}
          <motion.circle
            cx={endPoint[0]}
            cy={endPoint[1]}
            r="3"
            fill="none"
            stroke={isPositive ? '#10b981' : isNegative ? '#ef4444' : '#6b7280'}
            strokeWidth="1"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.9, duration: 0.3 }}
          />
        </motion.svg>
      </div>
    </Tooltip>
  );
}