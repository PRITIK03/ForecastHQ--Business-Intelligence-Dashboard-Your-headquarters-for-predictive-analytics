'use client';

import {
  LayoutDashboard,
  LineChart,
  Zap,
  Settings,
  HelpCircle,
  Sparkles
} from 'lucide-react';
import { motion } from 'framer-motion';
import { DataImportExport } from '@/components/data/import-export';

interface NavItem {
  icon: React.ElementType;
  label: string;
  href: string;
  active?: boolean;
}

const navItems: NavItem[] = [
  { icon: LayoutDashboard, label: 'Dashboard', href: '#', active: true },
  { icon: LineChart, label: 'Analytics', href: '#' },
  { icon: Zap, label: 'Forecasts', href: '#' },
  { icon: Sparkles, label: 'AI Insights', href: '#' }
];

export function Sidebar() {
  return (
    <aside className="w-56 h-screen bg-zinc-900/50 border-r border-zinc-800/50 flex flex-col">
      <div className="p-4 border-b border-zinc-800/50">
        <div className="flex items-center gap-3">
          <motion.div
            className="w-9 h-9 bg-gradient-to-br from-indigo-500 to-violet-600 rounded-lg flex items-center justify-center shadow-lg shadow-indigo-500/25"
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.2 }}
          >
            <motion.div
              animate={{
                scale: [1, 1.1, 1],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              <Zap className="w-4 h-4 text-white" />
            </motion.div>
          </motion.div>
          <span className="text-lg font-semibold bg-gradient-to-r from-zinc-100 to-zinc-300 bg-clip-text text-transparent">
            InsightFlow
          </span>
        </div>
      </div>
      
      <nav className="flex-1 p-3 space-y-1">
        {navItems.map((item, index) => {
          const Icon = item.icon;
          return (
            <motion.button
              key={index}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all duration-200 ${
                item.active
                  ? 'bg-indigo-600/20 text-indigo-300 shadow-lg shadow-indigo-500/10'
                  : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50 hover:shadow-md'
              }`}
              whileHover={{ x: 4 }}
              transition={{ duration: 0.2 }}
            >
              <Icon className="w-4 h-4" />
              {item.label}
            </motion.button>
          );
        })}

        <div className="pt-4 mt-4 border-t border-zinc-800/50">
          <DataImportExport />
        </div>
      </nav>
      
      <div className="p-3 border-t border-zinc-800/50 space-y-1">
        <motion.button
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50 transition-all duration-200 hover:shadow-md"
          whileHover={{ x: 4 }}
          transition={{ duration: 0.2 }}
        >
          <HelpCircle className="w-4 h-4" />
          Help
        </motion.button>
        <motion.button
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50 transition-all duration-200 hover:shadow-md"
          whileHover={{ x: 4 }}
          transition={{ duration: 0.2 }}
        >
          <Settings className="w-4 h-4" />
          Settings
        </motion.button>
      </div>
    </aside>
  );
}