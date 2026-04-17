'use client';

import { useInsightStore, useDataMetrics } from '@/lib/store';
import { Sidebar } from '@/components/dashboard/sidebar';
import { KPICard } from '@/components/dashboard/kpi-card';
import { ForecastPanel } from '@/components/forecast/panel';
import { TimeSeriesChart } from '@/components/charts/time-series';
import { Card } from '@/components/ui/card';
import { motion } from 'framer-motion';
import { useEffect } from 'react';
import { Sparkles, Database, Clock, DollarSign } from 'lucide-react';

export default function Dashboard() {
  const { data, forecast, generateData } = useInsightStore();
  const metrics = useDataMetrics();
  
  useEffect(() => {
    if (data.length === 0) {
      generateData();
    }
  }, []);
  
  return (
    <div className="flex min-h-screen bg-zinc-950">
      <Sidebar />
      
      <main className="flex-1 p-6 overflow-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-6xl mx-auto space-y-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-semibold text-zinc-100">Sales Analytics</h1>
              <p className="text-zinc-500 text-sm">Real-time forecasting dashboard</p>
            </div>
            <div className="flex items-center gap-2 text-sm text-zinc-500">
              <Sparkles className="w-4 h-4 text-indigo-500" />
              AI-Powered
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <KPICard 
              title="Total Revenue" 
              value={metrics.total} 
              prefix="$"
              change={metrics.growth}
            />
            <KPICard 
              title="Avg. Daily" 
              value={metrics.average} 
              prefix="$"
            />
            <KPICard 
              title="Peak Value" 
              value={metrics.max} 
              prefix="$"
            />
            <KPICard 
              title="Growth Trend" 
              value={metrics.trend} 
              prefix={metrics.trend >= 0 ? '+' : ''}
              change={metrics.growth / 10}
            />
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="lg:col-span-2"
            >
              <Card title="Revenue Forecast">
                <div className="h-[350px]">
                  <TimeSeriesChart 
                    data={data} 
                    forecast={forecast || undefined}
                    height={320}
                    showConfidence={true}
                  />
                </div>
                {forecast && (
                  <div className="flex items-center justify-center gap-6 mt-4 text-xs text-zinc-500">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-0.5 bg-indigo-500" />
                      Actual
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-0.5 bg-violet-500 border-dash" style={{ borderStyle: 'dashed' }} />
                      Forecast
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-indigo-500/20" />
                      Confidence
                    </div>
                  </div>
                )}
              </Card>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <ForecastPanel />
            </motion.div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-indigo-600/20 rounded-lg flex items-center justify-center">
                  <Database className="w-5 h-5 text-indigo-400" />
                </div>
                <div>
                  <p className="text-xs text-zinc-500">Data Points</p>
                  <p className="text-lg font-medium text-zinc-200">{data.length}</p>
                </div>
              </div>
            </Card>
            
            <Card className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-violet-600/20 rounded-lg flex items-center justify-center">
                  <Clock className="w-5 h-5 text-violet-400" />
                </div>
                <div>
                  <p className="text-xs text-zinc-500">Time Range</p>
                  <p className="text-lg font-medium text-zinc-200">365 days</p>
                </div>
              </div>
            </Card>
            
            <Card className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-emerald-600/20 rounded-lg flex items-center justify-center">
                  <DollarSign className="w-5 h-5 text-emerald-400" />
                </div>
                <div>
                  <p className="text-xs text-zinc-500">Confidence</p>
                  <p className="text-lg font-medium text-zinc-200">95%</p>
                </div>
              </div>
            </Card>
          </div>
        </motion.div>
      </main>
    </div>
  );
}