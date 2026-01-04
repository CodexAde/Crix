import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const letterAnimation = {
  initial: { y: 100, opacity: 0 },
  animate: { y: 0, opacity: 1, transition: { duration: 1, ease: [0.6, 0.01, -0.05, 0.9] } }
};

export default function Hero() {
  return (
    <section className="min-h-screen flex flex-col justify-center px-6 max-w-7xl mx-auto pt-20">
      <div>
        <div className="overflow-hidden">
            <motion.h1 
                initial={{ y: 100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="text-[12vw] md:text-[8vw] font-bold tracking-tighter leading-[0.85] text-white"
            >
              INTELLIGENT
            </motion.h1>
        </div>
        <div className="overflow-hidden">
            <motion.h1 
                initial={{ y: 100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.1, ease: "easeOut" }}
                className="text-[12vw] md:text-[8vw] font-bold tracking-tighter leading-[0.85] text-white"
            >
              LEARNING
            </motion.h1>
        </div>
        <div className="overflow-hidden">
            <motion.h1 
                initial={{ y: 100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
                className="text-[12vw] md:text-[8vw] font-bold tracking-tighter leading-[0.85]"
            >
              <span className="text-red-600">EVOLVED.</span>
            </motion.h1>
        </div>
      </div>

      <motion.p 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8, duration: 1 }}
        className="mt-12 text-xl md:text-2xl text-zinc-400 max-w-xl"
      >
        The AI-powered academic assistant that crafts personalized roadmaps, generates intelligent tests, and adapts to your unique learning style.
      </motion.p>
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1, duration: 1 }}
        className="mt-12 flex flex-col md:flex-row gap-4 w-full md:w-auto"
      >
        <Link to="/login" className="bg-red-600 text-white px-8 py-4 rounded-full text-lg font-medium hover:bg-red-700 transition-all hover:scale-105 active:scale-95 w-full md:w-auto shadow-lg shadow-red-900/20 text-center flex items-center justify-center">
            Start Learning Free
        </Link>
         <Link to="/demo" className="bg-zinc-900 border border-zinc-800 text-white px-8 py-4 rounded-full text-lg font-medium hover:bg-zinc-800 transition-all w-full md:w-auto text-center flex items-center justify-center">
            View Components
        </Link>
      </motion.div>
    </section>
  );
}
