import { motion } from 'framer-motion';
import { Sparkles, CheckCircle2, Brain, Calendar, Target, Zap, Clock, BookOpen } from 'lucide-react';

export default function RoadmapHero({ onStart }) {
  const features = [
    { icon: Brain, text: 'AI-Powered Scheduling', desc: 'Neural algorithms optimize your study path' },
    { icon: Calendar, text: 'Customizable Plans', desc: 'Modify steps to fit your pace' },
    { icon: Target, text: 'Milestone Tracking', desc: 'Built-in revision checkpoints' },
    { icon: Clock, text: '30-Day Max Duration', desc: 'Focused, achievable goals' },
  ];

  const stats = [
    { value: '30', label: 'Days Max', icon: Calendar },
    { value: 'AI', label: 'Powered', icon: Zap },
    { value: '100%', label: 'Customizable', icon: BookOpen },
  ];

  return (
    <div className="space-y-12">
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex flex-col items-center text-center py-8 md:py-12"
      >
        <div className="max-w-3xl px-4">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 mb-8 border border-accent/20">
            <Sparkles className="w-4 h-4 text-accent" />
            <span className="text-xs uppercase tracking-widest font-bold text-accent">
              Neural Scheduling Engine
            </span>
          </div>

          <h2 className="text-4xl md:text-6xl font-extrabold text-primary mb-6 leading-[1.1]">
            Your Path to <br />
            <span className="text-accent">Academic Mastery.</span>
          </h2>

          <p className="text-secondary text-lg md:text-xl mb-10 leading-relaxed max-w-2xl mx-auto">
            Transform your entire syllabus into a manageable daily plan. Our AI-powered
            engine analyzes every chapter and topic to calculate the optimal study intervals.
          </p>

          <div className="flex justify-center gap-6 md:gap-12 mb-12">
            {stats.map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + i * 0.1 }}
                className="text-center"
              >
                <div className="w-14 h-14 md:w-16 md:h-16 mx-auto mb-2 rounded-2xl bg-card border border-white/10 flex items-center justify-center">
                  <stat.icon className="w-6 h-6 text-accent" />
                </div>
                <p className="text-2xl md:text-3xl font-bold text-primary">{stat.value}</p>
                <p className="text-xs text-secondary uppercase tracking-wider">{stat.label}</p>
              </motion.div>
            ))}
          </div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onStart}
            className="px-12 py-5 bg-accent text-white rounded-2xl font-bold shadow-lg shadow-accent/30 transition-all text-lg"
          >
            Create Your Roadmap
          </motion.button>
        </div>
      </motion.div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 px-4 md:px-0">
        {features.map((feature, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 + i * 0.1 }}
            className="p-6 rounded-3xl bg-card border border-white/5"
          >
            <div className="w-12 h-12 rounded-2xl bg-accent/10 flex items-center justify-center mb-4">
              <feature.icon className="w-6 h-6 text-accent" />
            </div>
            <h4 className="text-primary font-bold text-lg mb-2">{feature.text}</h4>
            <p className="text-secondary text-sm">{feature.desc}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
