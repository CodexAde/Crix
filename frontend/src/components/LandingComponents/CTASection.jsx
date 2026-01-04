import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

export default function CTASection() {
  return (
    <section className="py-32 px-6 flex items-center justify-center bg-black relative overflow-hidden">
      {/* Background Gradient Blob */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-red-900/20 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="relative z-10 text-center max-w-4xl mx-auto">
        <motion.h2 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-5xl md:text-8xl font-bold tracking-tighter mb-8 text-white"
        >
          Ready to get started?
        </motion.h2>
        <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="text-xl md:text-2xl text-zinc-400 mb-12 max-w-2xl mx-auto"
        >
          Join thousands of students transforming their academic journey with Crix today.
        </motion.p>
        
        <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="flex flex-col md:flex-row items-center justify-center gap-4"
        >
            <Link to="/login" className="group bg-white text-black px-8 py-4 rounded-full text-lg font-bold hover:bg-red-600 hover:text-white transition-all duration-300 flex items-center gap-2">
                Start Learning Now
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link to="/demo" className="px-8 py-4 rounded-full text-lg font-medium text-white border border-white/20 hover:bg-white/10 transition-colors">
                View Pricing
            </Link>
        </motion.div>
      </div>
    </section>
  );
}
