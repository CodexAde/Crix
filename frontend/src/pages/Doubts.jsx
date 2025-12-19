import { motion } from 'framer-motion';
import { MessageSquareText, Sparkles, Clock, Bell, Rocket } from 'lucide-react';

export default function Doubts() {
  return (
    <div className="p-6 md:p-10 max-w-7xl mx-auto pb-24 md:pb-10">
      {/* Header */}
      <motion.header 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="flex items-center gap-3 mb-2">
          <div className="w-12 h-12 rounded-2xl bg-accent/10 flex items-center justify-center">
            <MessageSquareText className="w-6 h-6 text-accent" />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-primary">Doubts Hub</h1>
            <p className="text-secondary text-sm">Get your questions answered instantly</p>
          </div>
        </div>
      </motion.header>

      {/* Coming Soon Board */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.1 }}
        className="relative overflow-hidden bg-card rounded-[2rem] border border-border-soft shadow-soft"
      >
        {/* Background Neural Grid (The 'Mast' Grid) */}
        <div className="absolute inset-0 opacity-[0.05] pointer-events-none">
          <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="mast-grid-doubts" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="1"/>
                <circle cx="0" cy="0" r="1.5" fill="currentColor" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#mast-grid-doubts)" />
          </svg>
        </div>

        {/* Content */}
        <div className="relative z-10 flex flex-col items-center justify-center py-16 md:py-24 px-6">
          {/* Animated Icon */}
          <motion.div 
            className="relative mb-8"
            initial={{ y: 0 }}
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          >
            {/* Glow Effect */}
            <div className="absolute inset-0 bg-accent/30 blur-3xl rounded-full scale-150" />
            
            {/* Icon Container */}
            <div className="relative w-28 h-28 md:w-36 md:h-36 rounded-[2rem] bg-gradient-to-br from-accent/20 to-accent/5 border border-accent/20 flex items-center justify-center">
              <Rocket className="w-14 h-14 md:w-18 md:h-18 text-accent" />
              
              {/* Orbiting Sparkles */}
              <motion.div
                className="absolute -top-2 -right-2"
                animate={{ rotate: 360 }}
                transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
              >
                <Sparkles className="w-6 h-6 text-yellow-400" />
              </motion.div>
            </div>
          </motion.div>

          {/* Text */}
          <motion.div 
            className="text-center max-w-md"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-primary mb-3">
              Coming Soon
            </h2>
            <p className="text-secondary text-base md:text-lg mb-6">
              We're building something amazing! The Doubts Hub will allow you to ask questions, 
              get instant AI-powered answers, and connect with peers.
            </p>

            {/* Features Preview */}
            <div className="flex flex-wrap justify-center gap-3 mb-8">
              {[
                { icon: Sparkles, label: "AI Answers" },
                { icon: Clock, label: "24/7 Support" },
                { icon: Bell, label: "Instant Notifications" }
              ].map((feature, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.3 + i * 0.1 }}
                  className="flex items-center gap-2 px-4 py-2 bg-accent/10 rounded-xl border border-accent/20"
                >
                  <feature.icon className="w-4 h-4 text-accent" />
                  <span className="text-sm font-medium text-primary">{feature.label}</span>
                </motion.div>
              ))}
            </div>

            {/* Notify Button */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="inline-flex items-center gap-2 px-8 py-4 bg-accent text-white rounded-2xl font-semibold shadow-lg shadow-accent/30 hover:opacity-90 transition-all"
            >
              <Bell className="w-5 h-5" />
              Notify Me When Ready
            </motion.button>
          </motion.div>

          {/* Progress Indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-12 w-full max-w-xs"
          >
            <div className="flex items-center justify-between text-xs text-secondary mb-2">
              <span>Development Progress</span>
              <span className="font-semibold text-accent">68%</span>
            </div>
            <div className="w-full bg-border-soft h-2 rounded-full overflow-hidden">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: "68%" }}
                transition={{ duration: 1.5, delay: 0.6, ease: "easeOut" }}
                className="bg-accent h-full rounded-full"
              />
            </div>
          </motion.div>
        </div>

        {/* Decorative Elements */}
        <div className="absolute top-8 left-8 w-20 h-20 bg-accent/5 rounded-full blur-2xl" />
        <div className="absolute bottom-8 right-8 w-32 h-32 bg-accent/5 rounded-full blur-3xl" />
      </motion.div>
    </div>
  );
}
