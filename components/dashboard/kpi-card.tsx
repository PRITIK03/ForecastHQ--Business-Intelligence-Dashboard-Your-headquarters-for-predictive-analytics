'use client';

import { DataPoint } from '@/types';
import { Card } from '@/components/ui/card';
import { MicroChart } from '@/components/charts/micro-chart';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { motion } from 'framer-motion';

interface KPICardProps {
  title: string;
  value: string | number;
  change?: number;
  prefix?: string;
  suffix?: string;
  data?: DataPoint[];
  chartColor?: string;
}

export function KPICard({
  title,
  value,
  change,
  prefix = '',
  suffix = '',
  data,
  chartColor = '#6366f1'
}: KPICardProps) {
  const isPositive = change !== undefined && change > 0;
  const isNegative = change !== undefined && change < 0;
  const isNeutral = change === undefined || change === 0;

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.2 }}
    >
      <Card hover className="relative overflow-hidden h-full">
        {/* Animated background gradient */}
        <div className="absolute top-0 right-0 w-32 h-32 opacity-10">
          <motion.div
            className="w-full h-full bg-gradient-to-br from-indigo-500 to-violet-600 rounded-bl-full"
            animate={{
              scale: [1, 1.1, 1],
              opacity: [0.1, 0.15, 0.1]
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        </div>

        <div className="space-y-3 relative">
          <motion.p
            className="text-xs text-zinc-500 uppercase tracking-wider font-medium"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
          >
            {title}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="text-3xl font-bold text-zinc-100 bg-gradient-to-r from-zinc-100 to-zinc-300 bg-clip-text text-transparent"
          >
            {prefix}{typeof value === 'number' ? value.toLocaleString() : value}{suffix}
          </motion.div>

          {change !== undefined && (
            <motion.div
              className={`flex items-center gap-1.5 text-sm font-medium ${
                isPositive ? 'text-emerald-400' :
                isNegative ? 'text-red-400' :
                'text-zinc-500'
              }`}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              {isPositive && <TrendingUp className="w-4 h-4" />}
              {isNegative && <TrendingDown className="w-4 h-4" />}
              {isNeutral && <Minus className="w-4 h-4" />}
              <span className="font-semibold">{isPositive ? '+' : ''}{change.toFixed(1)}%</span>
              <span className="text-zinc-600 text-xs">vs last period</span>
            </motion.div>
          )}

          {data && data.length > 0 && (
            <motion.div
              className="pt-2"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4 }}
            >
              <MicroChart data={data} color={chartColor} />
            </motion.div>
          )}
        </div>
      </Card>
    </motion.div>
  );
}