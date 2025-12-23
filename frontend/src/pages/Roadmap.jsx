import { motion } from 'framer-motion';
import { Calendar, Rocket, Timer, ChevronRight, Sparkles, CheckCircle2 } from 'lucide-react';

export default function Roadmap() {
  const scheduleOverview = [
    { title: "Quick Revision", duration: "7 Days", intensity: "High", icon: Rocket, color: "text-orange-500", bg: "bg-orange-500/10" },
    { title: "Standard Pace", duration: "15 Days", intensity: "Balanced", icon: Timer, color: "text-accent", bg: "bg-accent/10" },
    { title: "Deep Learning", duration: "30 Days", intensity: "Detailed", icon: Timer, color: "text-blue-500", bg: "bg-blue-500/10" }
  ];

  return (
    <div className="p-4 md:p-10 max-w-7xl mx-auto pb-24 md:pb-10 min-h-screen">
      {/* Minimal Header */}
      <motion.header 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-10 md:mb-12"
      >
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 md:w-12 md:h-12 rounded-2xl bg-accent/5 flex items-center justify-center">
            <Calendar className="w-5 h-5 md:w-6 md:h-6 text-accent" />
          </div>
          <div>
            <h1 className="text-xl md:text-3xl font-bold text-primary">Study Roadmap</h1>
            <p className="text-secondary text-xs md:text-sm">Personalized learning schedules</p>
          </div>
        </div>
      </motion.header>

      <div className="grid lg:grid-cols-12 gap-6 md:gap-10">
        {/* Main Hero Section - Simplified */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          className="lg:col-span-8 flex flex-col justify-center"
        >
          <div className="max-w-2xl px-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/5 mb-6">
              <Sparkles className="w-3 h-3 text-accent" />
              <span className="text-[10px] uppercase tracking-widest font-bold text-accent">Neural Scheduling</span>
            </div>
            
            <h2 className="text-3xl md:text-5xl lg:text-6xl font-extrabold text-primary mb-6 leading-[1.1]">
              Your Path to <br />
              <span className="text-accent">Academic Mastery.</span>
            </h2>
            
            <p className="text-secondary text-base md:text-xl mb-10 leading-relaxed opacity-80">
              Transform your syllabus into a manageable daily plan. 
              Our engine calculates the optimal study intervals based on your exam date.
            </p>

            <div className="grid sm:grid-cols-2 gap-4 mb-10">
              {[
                "Automatic Chapter Allocation",
                "Periodic Revision Milestones",
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-3">
                  <CheckCircle2 className="w-4 h-4 text-green-500/70" />
                  <span className="text-primary font-medium text-sm md:text-base">{item}</span>
                </div>
              ))}
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full sm:w-auto flex items-center justify-center gap-3 px-10 py-4 md:py-5 bg-accent text-white rounded-2xl font-bold shadow-xl shadow-accent/20 transition-all text-sm md:text-base"
            >
              Start Generating
              <ChevronRight className="w-4 h-4" />
            </motion.button>
          </div>
        </motion.div>

        {/* Timelines Sidebar - Cleaned Up */}
        <div className="lg:col-span-4 space-y-4">
          <p className="text-[10px] font-bold text-secondary uppercase tracking-[0.2em] mb-4 px-2">Selected Modes</p>
          
          {scheduleOverview.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 + i * 0.1 }}
              className="p-5 md:p-6 rounded-[2rem] bg-card hover:bg-surface transition-all duration-300 group cursor-default"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-2xl ${item.bg}`}>
                  <item.icon className={`w-5 h-5 ${item.color}`} />
                </div>
                <div className="flex items-center gap-1 text-accent font-bold text-sm">
                  <span>{item.duration}</span>
                </div>
              </div>
              <div>
                <h4 className="text-primary font-bold text-lg mb-1">{item.title}</h4>
                <p className="text-secondary text-xs font-medium opacity-70 uppercase tracking-wider">
                  {item.intensity} Intensity
                </p>
              </div>
            </motion.div>
          ))}

          {/* Minimal Status */}
          <div className="mt-8 p-6 rounded-[2rem] bg-accent/[0.03] border border-accent/5">
            <div className="flex items-center justify-between mb-3 text-[10px] font-bold uppercase tracking-widest">
              <span className="text-secondary">Engine Training</span>
              <span className="text-accent underline underline-offset-4">82%</span>
            </div>
            <div className="w-full bg-border-soft h-1 rounded-full overflow-hidden">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: "82%" }}
                transition={{ duration: 2 }}
                className="bg-accent h-full rounded-full shadow-[0_0_8px_rgba(var(--accent-rgb),0.5)]"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Subtle Background Gradients - No lines/borders */}
      <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
        <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-accent/[0.02] blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-accent/[0.02] blur-[120px] rounded-full" />
      </div>
    </div>
  );
}
