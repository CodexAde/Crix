import { motion } from 'framer-motion';
import { Sparkles, Brain, Rocket, Shield, Zap, BookOpen, Globe, Cpu } from 'lucide-react';
import { Link } from 'react-router-dom';

const DemoShowcase = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  const features = [
    {
      title: "Neural Memory",
      description: "Crix remembers your learning style and tailors explanations to your existing knowledge base.",
      icon: Brain,
      color: "from-blue-500 to-indigo-600"
    },
    {
      title: "Quantum Search",
      description: "Find any topic across your entire syllabus in milliseconds with semantic understanding.",
      icon: Zap,
      color: "from-amber-400 to-orange-500"
    },
    {
      title: "Encrypted Core",
      description: "Your academic data is protected by military-grade end-to-end encryption protocols.",
      icon: Shield,
      color: "from-emerald-400 to-teal-600"
    },
    {
      title: "Priority Flow",
      description: "Smart algorithms highlight the most important topics based on frequency and difficulty.",
      icon: Cpu,
      color: "from-purple-500 to-pink-600"
    }
  ];

  return (
    <div className="min-h-screen bg-[#050505] text-white overflow-hidden relative">
      {/* Background Neural Network Effect (SVG) */}
      <div className="absolute inset-0 opacity-20 pointer-events-none">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      {/* Ambient Glows */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-accent/20 blur-[150px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-purple-500/10 blur-[150px] rounded-full pointer-events-none" />

      {/* Hero Section */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 pt-32 pb-20">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="text-center mb-24"
        >
          <motion.div
            animate={{ scale: [1, 1.05, 1], rotate: [0, 5, -5, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
            className="inline-flex items-center gap-2 px-6 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-xl mb-8"
          >
            <Sparkles className="w-4 h-4 text-accent" />
            <span className="text-xs font-black uppercase tracking-[0.3em] text-accent">Aurora Protocol Active</span>
          </motion.div>
          <h1 className="text-6xl md:text-8xl font-black mb-8 tracking-tighter leading-none italic">
            EXPERIENCE <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent via-blue-400 to-purple-500">
              AURORA NEURAL
            </span>
          </h1>
          <p className="text-lg md:text-xl text-secondary max-w-2xl mx-auto font-medium leading-relaxed opacity-80">
            The next evolution of academic intelligence. Crix isn't just a library; it's a living, breathing neural link to your curriculum.
          </p>
        </motion.div>

        {/* Feature Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-32"
        >
          {features.map((feature, idx) => (
            <motion.div
              key={idx}
              variants={itemVariants}
              whileHover={{ y: -10, transition: { duration: 0.3 } }}
              className="bg-[#111]/50 backdrop-blur-2xl p-8 rounded-[2.5rem] border border-white/5 relative group overflow-hidden"
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-10 transition-opacity duration-500`} />
              <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-6 shadow-lg shadow-black/50 overflow-hidden relative`}>
                <feature.icon className="w-7 h-7 text-white relative z-10" />
                <div className="absolute inset-0 bg-white/10 scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
              </div>
              <h3 className="text-xl font-bold mb-4 tracking-tight">{feature.title}</h3>
              <p className="text-sm text-secondary leading-relaxed font-medium group-hover:text-primary transition-colors">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </motion.div>

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1, duration: 0.8 }}
          className="text-center bg-gradient-to-r from-accent/10 via-purple-500/10 to-accent/10 p-12 md:p-20 rounded-[4rem] border border-white/10 relative overflow-hidden group"
        >
          {/* Animated Background Pulse */}
          <div className="absolute inset-0 bg-accent/5 animate-pulse" />
          
          <div className="relative z-10">
            <h2 className="text-4xl md:text-5xl font-black mb-8 tracking-tighter uppercase italic">
              Ready to transcend status quo?
            </h2>
            <div className="flex flex-col md:flex-row items-center justify-center gap-6">
              <Link
                to="/dashboard"
                className="px-10 py-5 bg-accent text-white rounded-full font-black uppercase tracking-[0.2em] shadow-[0_15px_40px_rgba(0,122,255,0.4)] hover:scale-105 active:scale-95 transition-all flex items-center gap-3 overflow-hidden relative group/btn"
              >
                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover/btn:translate-y-0 transition-transform duration-500" />
                <span className="relative z-10">Initialize Link</span>
                <Rocket className="w-5 h-5 relative z-10" />
              </Link>
              <Link
                to="/dashboard"
                className="px-10 py-5 bg-white/5 border border-white/10 rounded-full font-black uppercase tracking-[0.2em] hover:bg-white/10 transition-all backdrop-blur-xl"
              >
                View Documentation
              </Link>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Modern Grid Footer */}
      <div className="relative z-10 pt-20 pb-10 border-t border-white/5 bg-black/40">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-accent flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-black italic tracking-tighter">CRIX</span>
          </div>
          <div className="flex gap-10">
            {['Nexus', 'Aurora', 'Core', 'Vortex'].map(link => (
                <span key={link} className="text-[10px] font-black uppercase tracking-[0.3em] text-secondary hover:text-accent cursor-pointer transition-colors">
                    {link}
                </span>
            ))}
          </div>
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-secondary/40">
            © 2025 Crix Neural Systems
          </p>
        </div>
      </div>
    </div>
  );
};

export default DemoShowcase;
