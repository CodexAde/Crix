import { motion } from 'framer-motion';

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
export function PageLoader({ text = 'Loading...' }) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-main gap-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex flex-col items-center gap-4"
      >
        {/* Animated rings spinner */}
        <div className="relative w-16 h-16">
          <motion.div
            className="absolute inset-0 rounded-full border-2 border-accent/30"
            animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.2, 0.5] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
          />
          <motion.div
            className="absolute inset-2 rounded-full border-2 border-accent/50"
            animate={{ scale: [1, 1.1, 1], opacity: [0.7, 0.3, 0.7] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut', delay: 0.2 }}
          />
          <motion.div
            className="absolute inset-4 rounded-full border-2 border-accent"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          />
        </div>
        {text && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-secondary text-sm font-medium"
          >
            {text}
          </motion.p>
        )}
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
