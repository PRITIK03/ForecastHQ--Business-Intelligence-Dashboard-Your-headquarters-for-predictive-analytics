'use client';

import { motion } from 'framer-motion';

interface GaugeChartProps {
  value: number;
  max: number;
  title: string;
  color?: string;
  size?: number;
  showPercentage?: boolean;
}

export function GaugeChart({
  value,
  max,
  title,
  color = '#6366f1',
  size = 200,
  showPercentage = true
}: GaugeChartProps) {
  const percentage = Math.min((value / max) * 100, 100);
  const angle = (percentage / 100) * 180 - 90; // -90 to +90 degrees

  const radius = size / 2 - 20;
  const centerX = size / 2;
  const centerY = size / 2 + 20;

  // Calculate needle end point
  const needleX = centerX + Math.cos((angle * Math.PI) / 180) * (radius - 10);
  const needleY = centerY + Math.sin((angle * Math.PI) / 180) * (radius - 10);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6 }}
      className="flex flex-col items-center"
    >
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
          {/* Background arc */}
          <path
            d={`M ${centerX - radius} ${centerY} A ${radius} ${radius} 0 0 1 ${centerX + radius} ${centerY}`}
            fill="none"
            stroke="#374151"
            strokeWidth="12"
            strokeLinecap="round"
          />

          {/* Progress arc */}
          <motion.path
            d={`M ${centerX - radius} ${centerY} A ${radius} ${radius} 0 0 1 ${centerX + radius} ${centerY}`}
            fill="none"
            stroke={color}
            strokeWidth="12"
            strokeLinecap="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: percentage / 100 }}
            transition={{ duration: 1.5, ease: "easeOut" }}
          />

          {/* Needle */}
          <motion.line
            x1={centerX}
            y1={centerY}
            x2={needleX}
            y2={needleY}
            stroke="#ffffff"
            strokeWidth="3"
            strokeLinecap="round"
            initial={{ x2: centerX, y2: centerY }}
            animate={{ x2: needleX, y2: needleY }}
            transition={{ duration: 1, delay: 0.5, ease: "easeOut" }}
          />

          {/* Center dot */}
          <circle
            cx={centerX}
            cy={centerY}
            r="8"
            fill="#ffffff"
            stroke="#374151"
            strokeWidth="2"
          />

          {/* Tick marks */}
          {Array.from({ length: 11 }, (_, i) => {
            const tickAngle = (i * 18) - 90;
            const tickX1 = centerX + Math.cos((tickAngle * Math.PI) / 180) * (radius - 15);
            const tickY1 = centerY + Math.sin((tickAngle * Math.PI) / 180) * (radius - 15);
            const tickX2 = centerX + Math.cos((tickAngle * Math.PI) / 180) * (radius - 5);
            const tickY2 = centerY + Math.sin((tickAngle * Math.PI) / 180) * (radius - 5);

            return (
              <line
                key={i}
                x1={tickX1}
                y1={tickY1}
                x2={tickX2}
                y2={tickY2}
                stroke="#6b7280"
                strokeWidth="2"
                strokeLinecap="round"
              />
            );
          })}
        </svg>

        {/* Value display */}
        <div className="absolute inset-0 flex flex-col items-center justify-end pb-8">
          <motion.div
            className="text-center"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1 }}
          >
            {showPercentage ? (
              <>
                <div className="text-3xl font-bold text-white">
                  {percentage.toFixed(0)}%
                </div>
                <div className="text-sm text-zinc-400">of target</div>
              </>
            ) : (
              <>
                <div className="text-3xl font-bold text-white">
                  {value.toLocaleString()}
                </div>
                <div className="text-sm text-zinc-400">current value</div>
              </>
            )}
          </motion.div>
        </div>
      </div>

      <motion.h3
        className="text-lg font-semibold text-white mt-4 text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        {title}
      </motion.h3>
    </motion.div>
  );
}