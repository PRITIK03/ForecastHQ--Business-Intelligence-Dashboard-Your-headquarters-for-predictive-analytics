'use client';

import { DataPoint } from '@/types';
import { BarChart, Bar, ResponsiveContainer, XAxis, YAxis } from 'recharts';

interface MicroBarChartProps {
  data: DataPoint[];
  color?: string;
  height?: number;
}

export function MicroBarChart({ data, color = '#6366f1', height = 40 }: MicroBarChartProps) {
  // Take the last 7 data points for the micro bar chart
  const chartData = data.slice(-7).map(point => ({
    value: point.value,
    date: point.date.slice(-5) // Last 5 chars of date
  }));

  if (chartData.length < 2) return null;

  return (
    <div className="w-full h-10">
      <ResponsiveContainer width="100%" height={height}>
        <BarChart data={chartData} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
          <Bar dataKey="value" fill={color} radius={[2, 2, 0, 0]} />
          <XAxis
            dataKey="date"
            hide
          />
          <YAxis hide />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}