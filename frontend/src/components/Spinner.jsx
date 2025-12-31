import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';


// Spinner sizes
const sizes = {
  sm: 'w-4 h-4',
  md: 'w-6 h-6',
  lg: 'w-8 h-8',
  xl: 'w-12 h-12',
};

// Spinner component with Apple-style animation
export function Spinner({ size = 'md', className = '' }) {
  return (
    <div className={`${sizes[size]} ${className}`}>
      <motion.div
        className="w-full h-full rounded-full border-2 border-accent/20 border-t-accent"
        animate={{ rotate: 360 }}
        transition={{
          duration: 0.8,
          repeat: Infinity,
          ease: 'linear',
        }}
      />
    </div>
  );
}

// Full page loading spinner
export function PageLoader() {
  const [index, setIndex] = useState(0);
  
  const messages = [
    "Syncing Neural Pathways...",
    "Calibrating Learning Engine...",
    "Fetching Global Wisdom...",
    "Optimizing Study Patterns...",
    "Connecting to Crix Core...",
    "Preparing Your Workspace...",
    "Synthesizing Knowledge...",
    "Loading Smart Insights..."
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % messages.length);
    }, 2000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-main relative overflow-hidden">
        {/* Ambient Background Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-accent/5 rounded-full blur-[100px] pointer-events-none" />

      <motion.div
        className="flex flex-col items-center relative z-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        {/* Breathing/Floating Crix Logo */}
        <motion.h1 
            className="text-7xl md:text-7xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-primary to-primary/60 mb-8 select-none"
            animate={{ 
                y: [0, -20, 0],
                scale: [1, 1.02, 1],
            }}
            transition={{
                duration: 1,
                ease: "easeInOut",
                repeat: Infinity,
            }}
        >
            CRIX
        </motion.h1>

        {/* Loading Bar */}
        <div className="w-48 h-1 bg-border-soft rounded-full overflow-hidden mb-8">
            <motion.div 
               className="h-full bg-accent"
               initial={{ x: '-100%' }}
               animate={{ x: '100%' }}
               transition={{ 
                   repeat: Infinity, 
                   duration: 1.5, 
                   ease: "easeInOut" 
               }}
            />
        </div>

        {/* Rotating Text Messages */}
        <div className="h-8 relative w-full flex justify-center items-center">
            <AnimatePresence mode="wait">
                <motion.p
                    key={index}
                    initial={{ opacity: 0, y: 10, filter: 'blur(10px)' }}
                    animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                    exit={{ opacity: 0, y: -10, filter: 'blur(10px)' }}
                    transition={{ duration: 0.4 }}
                    className="text-secondary font-medium tracking-widest text-sm uppercase absolute whitespace-nowrap"
                >
                    {messages[index]}
                </motion.p>
            </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}

// Inline loading with dots animation
export function DotsLoader({ className = '' }) {
  return (
    <div className={`flex items-center gap-1 ${className}`}>
      {[0, 1, 2].map((i) => (
        <motion.span
          key={i}
          className="w-1.5 h-1.5 bg-accent rounded-full"
          animate={{ y: [0, -4, 0] }}
          transition={{
            duration: 0.5,
            repeat: Infinity,
            delay: i * 0.1,
          }}
        />
      ))}
    </div>
  );
}

// Skeleton loader for content
export function Skeleton({ className = '', variant = 'text' }) {
  const baseClasses = 'animate-pulse bg-border-soft rounded';
  
  const variants = {
    text: 'h-4 w-full',
    title: 'h-6 w-3/4',
    avatar: 'h-10 w-10 rounded-full',
    card: 'h-32 w-full rounded-xl',
    button: 'h-10 w-24 rounded-lg',
  };

  return <div className={`${baseClasses} ${variants[variant]} ${className}`} />;
}

// Card skeleton for dashboard
export function CardSkeleton() {
  return (
    <div className="bg-card rounded-2xl p-5 border border-border-soft">
      <div className="flex items-center gap-3 mb-4">
        <Skeleton variant="avatar" />
        <div className="flex-1 space-y-2">
          <Skeleton variant="title" className="w-1/2" />
          <Skeleton variant="text" className="w-1/3" />
        </div>
      </div>
      <Skeleton variant="text" className="mb-2" />
      <Skeleton variant="text" className="w-2/3" />
    </div>
  );
}

// New Landing Page Loader
export function LandingLoader() {
  return (
    <div className="fixed inset-0 bg-black flex flex-col items-center justify-center z-[9999] p-4">
       
       <div className="relative flex flex-col items-center justify-center mb-12">
          {/* Bouncing CRIX Text */}
          <motion.h1 
            className="text-8xl md:text-9xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-primary to-primary/60 select-none"
            animate={{ 
                y: [0, -20, 0],
                scale: [1, 1.02, 1],
            }}
            transition={{
                duration: 2,
                ease: "easeInOut",
                repeat: Infinity,
            }}
          >
            CRIX
          </motion.h1>
          
          {/* Shadow underneath */}
          <motion.div 
            className="h-4 w-40 bg-accent/20 rounded-[100%] blur-xl mt-2"
            animate={{ 
                scale: [1, 1.2, 1],
                opacity: [0.3, 0.6, 0.3] 
            }}
            transition={{
                duration: 2,
                ease: "easeInOut",
                repeat: Infinity,
            }}
          />
       </div>
       
       <div className="flex flex-col items-center gap-2 text-center relative z-10">
            <p className="text-white/40 text-sm font-medium tracking-[0.2em] uppercase">
                Redefining the way you learn
            </p>
            <div className="flex items-center gap-2">
                <div className="h-px w-8 bg-white/10"></div>
                <p className="text-white/20 text-xs font-mono tracking-widest uppercase">
                    Powered by Codevern LLP Ltd
                </p>
                <div className="h-px w-8 bg-white/10"></div>
            </div>
       </div>
    </div>
  );
}

