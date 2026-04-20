'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';

interface TooltipProps {
  content: string;
  children: React.ReactNode;
}

export function Tooltip({ content, children }: TooltipProps) {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <div
      className="relative inline-block"
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
    >
      {children}
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 5 }}
          className="absolute z-50 px-3 py-2 text-sm text-zinc-100 bg-zinc-800 border border-zinc-700 rounded-lg shadow-lg whitespace-nowrap bottom-full left-1/2 transform -translate-x-1/2 mb-2"
        >
          {content}
          <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-zinc-800" />
        </motion.div>
      )}
    </div>
  );
}