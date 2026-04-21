'use client';

import { motion } from 'framer-motion';

interface SkeletonProps {
  className?: string;
  animate?: boolean;
}

export function Skeleton({ className = '', animate = true }: SkeletonProps) {
  return (
    <div
      className={`bg-zinc-800/50 rounded-lg relative overflow-hidden ${className}`}
    >
      {animate && (
        <>
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-zinc-700/30 to-transparent rounded-lg"
            animate={{
              x: ['-100%', '100%']
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: 'easeInOut',
              repeatDelay: 0.5
            }}
          />
          <motion.div
            className="h-full w-full bg-gradient-to-r from-zinc-800/50 via-zinc-700/60 to-zinc-800/50 rounded-lg"
            animate={{
              opacity: [0.5, 0.8, 0.5]
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'easeInOut'
            }}
          />
        </>
      )}
    </div>
  );
}

interface KPICardSkeletonProps {
  className?: string;
}

export function KPICardSkeleton({ className = '' }: KPICardSkeletonProps) {
  return (
    <div className={`bg-zinc-900/60 backdrop-blur-sm border border-zinc-800/60 rounded-xl shadow-xl p-6 space-y-4 ${className}`}>
      <Skeleton className="h-3 w-20" />
      <Skeleton className="h-8 w-24" />
      <Skeleton className="h-4 w-16" />
      <Skeleton className="h-10 w-full" />
    </div>
  );
}

interface ChartSkeletonProps {
  className?: string;
}

export function ChartSkeleton({ className = '' }: ChartSkeletonProps) {
  return (
    <div className={`bg-zinc-900/60 backdrop-blur-sm border border-zinc-800/60 rounded-xl shadow-xl p-6 ${className}`}>
      <Skeleton className="h-4 w-32 mb-4" />
      <Skeleton className="h-64 w-full" />
    </div>
  );
}