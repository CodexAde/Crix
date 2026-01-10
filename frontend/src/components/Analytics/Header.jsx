import React from 'react';
import { motion } from 'framer-motion';
import logo from '../../assets/crix.png';

const AnalyticsHeader = () => {
  return (
    <header className="sticky top-0 z-50 flex items-center justify-between px-6 py-4 bg-transparent backdrop-blur-xl border-b border-white/5">
      <div className="flex items-center gap-3">
        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center p-1"
        >
          <img src={logo} alt="Crix Logo" className="w-full h-full object-contain" />
        </motion.div>
        <div>
          <h1 className="text-xl font-bold tracking-tight text-white">Crix</h1>
          <p className="text-[10px] text-zinc-500 font-medium uppercase tracking-[0.2em]">Analytics Dashboard</p>
        </div>
      </div>
      
      <div className="flex items-center gap-4">
        <div className="px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-medium text-zinc-400">
          Admin Preview
        </div>
      </div>
    </header>
  );
};

export default AnalyticsHeader;
