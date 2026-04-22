'use client';

import { useInsightStore, useDataMetrics } from '@/lib/store';
import { Sidebar } from '@/components/dashboard/sidebar';
import { KPICard } from '@/components/dashboard/kpi-card';
import { ForecastPanel } from '@/components/forecast/panel';
import { TimeSeriesChart } from '@/components/charts/time-series';
import { MicroBarChart } from '@/components/charts/micro-bar-chart';
import { Card } from '@/components/ui/card';
import { KPICardSkeleton, ChartSkeleton } from '@/components/ui/skeleton';
import { motion } from 'framer-motion';
import { useEffect, useRef } from 'react';
import { Sparkles, Database, Clock, DollarSign } from 'lucide-react';

export default function Dashboard() {
  const { data, forecast, generateData, isLoading } = useInsightStore();
  const metrics = useDataMetrics();
  const hasGeneratedData = useRef(false);

  useEffect(() => {
    if (data.length === 0 && !hasGeneratedData.current) {
      hasGeneratedData.current = true;
      generateData();
    }
  }, [data.length, generateData]);
  
  return (
    <div className="flex min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-indigo-950 relative overflow-hidden">
      {/* Dynamic Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Primary gradient orbs */}
        <motion.div
          className="absolute top-10 right-10 w-[500px] h-[500px] bg-gradient-to-br from-pink-500/20 via-purple-500/15 to-indigo-500/10 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.3, 0.8, 0.3],
            rotate: [0, 180, 360]
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute bottom-20 left-20 w-[450px] h-[450px] bg-gradient-to-tl from-cyan-500/25 via-teal-500/20 to-emerald-500/15 rounded-full blur-3xl"
          animate={{
            scale: [1.2, 0.8, 1.2],
            opacity: [0.4, 0.9, 0.4],
            rotate: [360, 180, 0]
          }}
          transition={{ duration: 25, repeat: Infinity, ease: "easeInOut", delay: 3 }}
        />
        <motion.div
          className="absolute top-1/3 right-1/3 w-[350px] h-[350px] bg-gradient-to-r from-orange-500/20 via-red-500/15 to-pink-500/10 rounded-full blur-3xl"
          animate={{
            scale: [0.8, 1.5, 0.8],
            opacity: [0.2, 0.7, 0.2],
            x: [0, 80, -60, 0],
            y: [0, -60, 80, 0]
          }}
          transition={{ duration: 22, repeat: Infinity, ease: "easeInOut", delay: 6 }}
        />

        {/* Secondary floating elements */}
        <motion.div
          className="absolute top-1/4 left-1/4 w-[200px] h-[200px] bg-gradient-to-br from-yellow-500/15 to-amber-500/10 rounded-full blur-2xl"
          animate={{
            scale: [1, 1.4, 1],
            opacity: [0.1, 0.5, 0.1],
            rotate: [0, 270, 180, 0]
          }}
          transition={{ duration: 18, repeat: Infinity, ease: "easeInOut", delay: 8 }}
        />
        <motion.div
          className="absolute bottom-1/3 right-1/4 w-[300px] h-[300px] bg-gradient-to-tl from-blue-500/18 via-indigo-500/12 to-purple-500/8 rounded-full blur-3xl"
          animate={{
            scale: [1.3, 0.7, 1.3],
            opacity: [0.25, 0.6, 0.25],
            rotate: [180, 0, 180]
          }}
          transition={{ duration: 24, repeat: Infinity, ease: "easeInOut", delay: 10 }}
        />

        {/* Colorful floating particles */}
        {Array.from({ length: 8 }, (_, i) => (
          <motion.div
            key={i}
            className="absolute w-3 h-3 rounded-full blur-sm"
            style={{
              top: `${15 + i * 10}%`,
              left: `${10 + i * 12}%`,
              background: `linear-gradient(45deg, ${[
                '#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#feca57',
                '#ff9ff3', '#54a0ff', '#5f27cd'
              ][i % 8]}, ${[
                '#ff3838', '#26d0ce', '#3498db', '#78e08f', '#ffb142',
                '#fd79a8', '#3742fa', '#341f97'
              ][i % 8]})`
            }}
            animate={{
              y: [0, -30, 0],
              x: [0, 20, -10, 0],
              opacity: [0.3, 0.8, 0.3],
              scale: [0.5, 1.2, 0.5]
            }}
            transition={{
              duration: 6 + i * 0.5,
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 0.8
            }}
          />
        ))}

        {/* Mesh gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-transparent via-purple-500/5 to-cyan-500/5 mix-blend-overlay" />
      </div>

      <Sidebar />

      <main className="flex-1 p-6 overflow-auto relative z-10">
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
          
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            {data.length === 0 || isLoading ? (
              // Loading skeletons
              [...Array(4)].map((_, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    delay: 0.3 + index * 0.1,
                    duration: 0.3
                  }}
                >
                  <KPICardSkeleton />
                </motion.div>
              ))
            ) : (
              // Actual KPI cards
              [
                {
                  title: "Total Revenue",
                  value: metrics.total,
                  prefix: "$",
                  change: metrics.growth,
                  data: data,
                  chartColor: "#6366f1"
                },
                {
                  title: "Avg. Daily",
                  value: metrics.average,
                  prefix: "$",
                  data: data,
                  chartColor: "#10b981"
                },
                {
                  title: "Peak Value",
                  value: metrics.max,
                  prefix: "$",
                  data: data,
                  chartColor: "#f59e0b"
                },
                {
                  title: "Growth Trend",
                  value: metrics.trend,
                  prefix: metrics.trend >= 0 ? '+' : '',
                  change: metrics.growth / 10,
                  data: data,
                  chartColor: "#8b5cf6"
                }
              ].map((card, index) => (
                <motion.div
                  key={card.title}
                  initial={{ opacity: 0, y: 30, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{
                    delay: 0.3 + index * 0.1,
                    duration: 0.5,
                    type: "spring",
                    stiffness: 100
                  }}
                >
                  <KPICard {...card} />
                </motion.div>
              ))
            )}
          </motion.div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="lg:col-span-2"
            >
              <Card title="Revenue Forecast" hover>
                <div className="h-[350px]">
                  {data.length === 0 || isLoading ? (
                    <ChartSkeleton />
                  ) : (
                    <TimeSeriesChart
                      data={data}
                      forecast={forecast || undefined}
                      height={320}
                      showConfidence={true}
                    />
                  )}
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
          
          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            {[
              {
                icon: Database,
                gradient: "from-orange-500 via-red-500 to-pink-500",
                glow: "shadow-orange-500/25",
                title: "Data Points",
                value: data.length.toString(),
                subtitle: "Total records",
                chartColor: "#ff6b6b"
              },
              {
                icon: Clock,
                gradient: "from-cyan-500 via-blue-500 to-indigo-500",
                glow: "shadow-cyan-500/25",
                title: "Time Range",
                value: "365 days",
                subtitle: "Historical data",
                chartColor: "#4ecdc4"
              },
              {
                icon: DollarSign,
                gradient: "from-emerald-500 via-teal-500 to-cyan-500",
                glow: "shadow-emerald-500/25",
                title: "Confidence",
                value: "95%",
                subtitle: "Model accuracy",
                chartColor: "#45b7d1"
              }
            ].map((item, index) => {
              const IconComponent = item.icon;
              return (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{
                    delay: 0.7 + index * 0.1,
                    duration: 0.6,
                    type: "spring",
                    stiffness: 120
                  }}
                  whileHover={{
                    scale: 1.03,
                    rotateY: 2,
                    transition: { duration: 0.3 }
                  }}
                  className="group"
                >
                  <div className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${item.gradient} p-[1px] transition-all duration-300 hover:shadow-2xl hover:${item.glow}`}>
                    <div className="relative bg-slate-900/95 backdrop-blur-xl rounded-2xl p-6">
                      {/* Animated background */}
                      <div className={`absolute inset-0 bg-gradient-to-br ${item.gradient} opacity-5 group-hover:opacity-10 transition-opacity duration-300`} />

                      <div className="relative z-10 flex items-center gap-4">
                        <motion.div
                          className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${item.gradient} p-3 shadow-lg group-hover:shadow-xl transition-shadow duration-300`}
                          whileHover={{
                            rotate: [0, -5, 5, 0],
                            scale: 1.1
                          }}
                          transition={{ duration: 0.4 }}
                        >
                          <IconComponent className="w-8 h-8 text-white" />
                        </motion.div>

                        <div className="flex-1 min-w-0">
                          <motion.p
                            className="text-sm text-slate-400 font-medium"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.8 + index * 0.1 }}
                          >
                            {item.title}
                          </motion.p>
                          <motion.p
                            className="text-2xl font-bold bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.9 + index * 0.1, duration: 0.3 }}
                          >
                            {item.value}
                          </motion.p>
                          <motion.p
                            className="text-xs text-slate-500 mt-1"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 1.0 + index * 0.1 }}
                          >
                            {item.subtitle}
                          </motion.p>
                        </div>
                      </div>

                      {/* Real micro graph */}
                      <motion.div
                        className="mt-4"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 1.1 + index * 0.1, duration: 0.4 }}
                      >
                        <MicroChart
                          data={data}
                          color={item.chartColor}
                          height={30}
                        />
                      </motion.div>

                      {/* Floating accent elements */}
                      <div className="absolute -top-2 -right-2 w-4 h-4 bg-gradient-to-br from-white/20 to-transparent rounded-full blur-sm" />
                      <div className="absolute -bottom-1 -left-1 w-3 h-3 bg-gradient-to-tr from-white/10 to-transparent rounded-full blur-sm" />
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
                      <div className="flex-1">
                        <motion.p
                          className="text-xs text-zinc-500"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 0.8 + index * 0.1 }}
                        >
                          {item.title}
                        </motion.p>
                        <motion.p
                          className="text-lg font-medium text-zinc-200"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.9 + index * 0.1, duration: 0.3 }}
                        >
                          {item.value}
                        </motion.p>
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            {data.length === 0 || isLoading ? (
              // Loading skeletons
              [...Array(4)].map((_, index) => (
                <motion.div key={index} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 * index }}>
                  <KPICardSkeleton />
                </motion.div>
              ))
            ) : (
              // Enhanced KPI cards with vibrant colors
              [
                {
                  title: "Total Revenue",
                  value: `$${metrics.total.toLocaleString()}`,
                  change: metrics.growth,
                  data: data,
                  chartColor: "#ff6b6b",
                  gradient: "from-pink-500 via-red-500 to-rose-500",
                  bgGlow: "shadow-pink-500/25"
                },
                {
                  title: "Avg. Daily",
                  value: `$${metrics.average.toFixed(0)}`,
                  data: data,
                  chartColor: "#4ecdc4",
                  gradient: "from-teal-400 via-cyan-500 to-emerald-500",
                  bgGlow: "shadow-teal-500/25"
                },
                {
                  title: "Peak Value",
                  value: `$${metrics.max.toFixed(0)}`,
                  data: data,
                  chartColor: "#45b7d1",
                  gradient: "from-blue-400 via-sky-500 to-cyan-500",
                  bgGlow: "shadow-blue-500/25"
                },
                {
                  title: "Growth Trend",
                  value: `${metrics.trend >= 0 ? '+' : ''}${metrics.trend.toFixed(1)}`,
                  change: metrics.growth / 10,
                  data: data,
                  chartColor: "#a855f7",
                  gradient: "from-purple-500 via-violet-500 to-indigo-500",
                  bgGlow: "shadow-purple-500/25"
                }
              ].map((card, index) => (
                <motion.div
                  key={card.title}
                  initial={{ opacity: 0, y: 30, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{
                    delay: 0.5 + index * 0.1,
                    duration: 0.6,
                    type: "spring",
                    stiffness: 120
                  }}
                  whileHover={{
                    scale: 1.05,
                    y: -8,
                    transition: { duration: 0.2 }
                  }}
                  className="group"
                >
                  <div className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${card.gradient} p-[1px] transition-all duration-300 hover:shadow-2xl hover:${card.bgGlow}`}>
                    <div className="relative bg-slate-900/90 backdrop-blur-xl rounded-2xl p-6 h-full">
                      {/* Animated background gradient */}
                      <div className={`absolute inset-0 bg-gradient-to-br ${card.gradient} opacity-10 group-hover:opacity-20 transition-opacity duration-300`} />

                      {/* Content */}
                      <div className="relative z-10">
                        <div className="flex items-center justify-between mb-4">
                          <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${card.gradient} p-3 shadow-lg`}>
                            {index === 0 && <DollarSign className="w-6 h-6 text-white" />}
                            {index === 1 && <TrendingUp className="w-6 h-6 text-white" />}
                            {index === 2 && <BarChart3 className="w-6 h-6 text-white" />}
                            {index === 3 && <Activity className="w-6 h-6 text-white" />}
                          </div>
                          {card.change !== undefined && (
                            <motion.div
                              className={`px-3 py-1 rounded-full text-xs font-bold ${
                                card.change >= 0
                                  ? 'bg-emerald-500/20 text-emerald-300'
                                  : 'bg-red-500/20 text-red-300'
                              }`}
                              animate={card.change >= 0 ? { scale: [1, 1.1, 1] } : {}}
                              transition={{ duration: 2, repeat: card.change >= 0 ? Infinity : 0 }}
                            >
                              {card.change >= 0 ? '↗' : '↘'} {Math.abs(card.change).toFixed(1)}%
                            </motion.div>
                          )}
                        </div>

                        <div className="space-y-3">
                          <div>
                            <p className="text-sm text-slate-400 font-medium">{card.title}</p>
                            <p className="text-3xl font-bold bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
                              {card.value}
                            </p>
                          </div>

                          {/* Real micro graph */}
                          {card.data && (
                            <motion.div
                              className="mt-4"
                              initial={{ opacity: 0, scale: 0.8 }}
                              animate={{ opacity: 1, scale: 1 }}
                              transition={{ delay: 0.7 + index * 0.1 }}
                            >
                              <MicroChart
                                data={card.data}
                                color={card.chartColor}
                                height={35}
                              />
                            </motion.div>
                          )}
                        </div>

                        {/* Animated particles */}
                        <div className="absolute top-4 right-4 w-20 h-20 overflow-hidden pointer-events-none">
                          {Array.from({ length: 3 }, (_, i) => (
                            <motion.div
                              key={i}
                              className={`absolute w-1 h-1 rounded-full bg-gradient-to-r ${card.gradient}`}
                              style={{
                                top: `${20 + i * 15}%`,
                                right: `${10 + i * 20}%`,
                              }}
                              animate={{
                                y: [0, -15, 0],
                                opacity: [0.3, 1, 0.3],
                                scale: [0.5, 1, 0.5]
                              }}
                              transition={{
                                duration: 3 + i * 0.5,
                                repeat: Infinity,
                                delay: i * 0.8
                              }}
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))
            )}
          </motion.div>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              );
            })}
          </motion.div>
        </motion.div>
      </main>
    </div>
  );
}