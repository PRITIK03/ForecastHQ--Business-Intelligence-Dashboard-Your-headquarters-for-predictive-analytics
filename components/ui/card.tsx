import { ReactNode } from 'react';
import { motion } from 'framer-motion';

interface CardProps {
  children: ReactNode;
  className?: string;
  title?: string;
  hover?: boolean;
}

export function Card({ children, className = '', title, hover = false }: CardProps) {
  const cardClasses = `bg-zinc-900/60 backdrop-blur-sm border border-zinc-800/60 rounded-xl shadow-xl relative overflow-hidden ${
    hover ? 'transition-all duration-300 hover:shadow-2xl hover:shadow-indigo-500/10 hover:border-indigo-500/30 hover:bg-zinc-900/80' : ''
  } ${className}`;

  return (
    <motion.div
      className={cardClasses}
      whileHover={hover ? { y: -2 } : {}}
      transition={{ duration: 0.2 }}
    >
      {/* Subtle gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 via-transparent to-violet-500/5 pointer-events-none" />

      {title && (
        <div className="px-5 py-3 border-b border-zinc-800/60 relative">
          <h3 className="text-sm font-medium text-zinc-200">{title}</h3>
        </div>
      )}
      <div className="p-5 relative">{children}</div>
    </motion.div>
  );
}

export function CardHeader({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <div className={`px-5 py-3 border-b border-zinc-800/60 ${className}`}>{children}</div>;
}

export function CardTitle({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <h3 className={`text-sm font-medium text-zinc-200 ${className}`}>{children}</h3>;
}

export function CardContent({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <div className={`p-5 ${className}`}>{children}</div>;
}