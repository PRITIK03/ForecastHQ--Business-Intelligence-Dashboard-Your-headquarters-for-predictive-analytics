'use client';

import { DataPoint } from '@/types';
import { Sparklines, SparklinesLine, SparklinesSpots } from 'recharts';

interface MicroChartProps {
  data: DataPoint[];
  color?: string;
  height?: number;
}

export function MicroChart({ data, color = '#6366f1', height = 40 }: MicroChartProps) {
  // Take the last 30 data points for the micro chart
  const chartData = data.slice(-30).map(point => ({
    value: point.value
  }));

  if (chartData.length < 2) return null;

  return (
    <div className="w-full h-10">
      <Sparklines data={chartData} height={height}>
        <SparklinesLine
          color={color}
          style={{ strokeWidth: 2, fill: 'none' }}
        />
        <SparklinesSpots size={2} style={{ fill: color }} />
      </Sparklines>
    </div>
  );
}