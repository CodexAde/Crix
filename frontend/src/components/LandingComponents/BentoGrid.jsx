import React from 'react';
import { motion } from 'framer-motion';
import { 
  MessageSquare, 
  Map, 
  BookOpen, 
  Target, 
  Zap, 
  BrainCircuit,
  ArrowUpRight
} from 'lucide-react';

const Card = ({ children, className }) => (
  <div
    className={`
        relative overflow-hidden rounded-[32px] 
        bg-zinc-900/50 backdrop-blur-sm 
        border border-white/5 
        hover:border-red-500/20 hover:bg-zinc-900/80
        transition-all duration-500 group
        ${className}
    `}
  >
    {/* Noise Texture Overlay */}
    <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')] bg-repeat" />
    
    {/* Subtle Gradient Glow on Hover */}
    <div className="absolute -inset-full top-0 block bg-gradient-to-r from-transparent via-white/5 to-transparent -skew-x-12 group-hover:animate-shine" />

    {children}
  </div>
);

export default function BentoGrid() {
  return (
    <section className="py-24 px-4 md:px-6 max-w-7xl mx-auto min-h-screen flex flex-col justify-center">
      {/* Header */}
      <div className="mb-20 space-y-4">
        <motion.div 
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            className="flex items-center gap-2 text-red-500 font-mono text-sm tracking-wider uppercase"
        >
            <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
            System Architecture
        </motion.div>
        <motion.h2 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-5xl md:text-7xl font-bold tracking-tighter text-white"
        >
          Everything in <span className="text-zinc-500">Sync.</span>
        </motion.h2>
      </div>

      {/* Grid Layout - Mobile First Stack -> Desktop Grid */}
      <div className="grid grid-cols-1 md:grid-cols-6 md:grid-rows-3 gap-4 h-auto md:h-[900px]">
        
        {/* 1. HERO FEATURE: AI Chat (Large Span) */}
        <Card className="md:col-span-4 md:row-span-2 p-8 flex flex-col justify-between relative">
            <div className="absolute right-0 top-0 p-8 text-zinc-800 group-hover:text-red-900/40 transition-colors duration-500">
                <MessageSquare size={120} strokeWidth={1} />
            </div>
            
            <div className="relative z-10 space-y-4 max-w-lg">
                <div className="w-14 h-14 bg-red-600 rounded-2xl flex items-center justify-center shadow-lg shadow-red-900/20">
                    <BrainCircuit className="text-white" size={28} />
                </div>
                <h3 className="text-3xl font-bold text-white">Neural Chat Engine</h3>
                <p className="text-zinc-400 text-lg leading-relaxed">
                    Ask anything. Our AI contextualizes your query against your entire syllabus, previous test performance, and personal goals to give the perfect answer.
                </p>
                <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-white/5">
                    {['Explain Quantum tunneling', 'Generate 5 MCQ on Optics', 'Summarize Chapter 3'].map((tag, i) => (
                        <span key={i} className="px-3 py-1 rounded-full bg-white/5 text-xs text-zinc-300 border border-white/5 hover:bg-white/10 cursor-pointer transition-colors">
                            {tag}
                        </span>
                    ))}
                </div>
            </div>
        </Card>

        {/* 2. SECONDARY FEATURE: Roadmap (Vertical Tall) */}
        <Card className="md:col-span-2 md:row-span-2 p-8 flex flex-col relative bg-zinc-950" delay={0.2}>
             <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-red-900/20 to-transparent opacity-50" />
             <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center mb-6">
                <Map className="text-white" size={24} />
             </div>
             <h3 className="text-2xl font-bold mb-2">Dynamic Roadmap</h3>
             <p className="text-zinc-400 text-sm mb-8">Generated path to mastery. Adapts daily.</p>
             
             {/* Visual Timeline Mockup */}
             <div className="flex-1 space-y-4 relative z-10">
                {[1, 2, 3].map((step) => (
                    <div key={step} className="flex gap-4 items-center p-3 rounded-xl bg-white/5 border border-white/5">
                        <div className={`w-2 h-2 rounded-full ${step === 1 ? 'bg-green-500' : 'bg-zinc-700'}`} />
                        <div className="h-2 w-20 bg-zinc-700 rounded-full overflow-hidden">
                            <div className="h-full bg-zinc-500" style={{ width: step === 1 ? '100%' : '30%' }}></div>
                        </div>
                    </div>
                ))}
            </div>
        </Card>

        {/* 3. TERTIARY: Testing (Horizontal) */}
        <Card className="md:col-span-3 md:row-span-1 p-6 flex items-center gap-6" delay={0.4}>
             <div className="w-16 h-16 bg-zinc-800 rounded-full flex items-center justify-center flex-shrink-0 relative overflow-hidden">
                <Target className="text-red-500 relative z-10" />
                <div className="absolute inset-0 bg-red-500/20 animate-pulse" />
             </div>
             <div>
                <h3 className="text-2xl font-bold flex items-center gap-2">
                    Adaptive Testing 
                    <ArrowUpRight size={16} className="text-zinc-500" />
                </h3>
                <p className="text-zinc-400 text-sm mt-1">Difficulty scales with your competence.</p>
             </div>
        </Card>

        {/* 4. QUATERNARY: Syllabus (Horizontal) */}
        <Card className="md:col-span-3 md:row-span-1 p-6 flex flex-col justify-center relative overflow-hidden" delay={0.5}>
             <BookOpen className="absolute -right-4 -bottom-4 text-zinc-800/50 transform rotate-12" size={140} />
             <div className="relative z-10">
                <h3 className="text-2xl font-bold text-white mb-2">Syllabus Access</h3>
                <p className="text-zinc-400 text-sm max-w-[70%]">Full curriculum index with instant search and referencing.</p>
             </div>
        </Card>

      </div>
    </section>
  );
}
