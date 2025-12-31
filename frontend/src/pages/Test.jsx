import { motion } from 'framer-motion';
import { Check, Star, Lock, Zap, Shield, Infinity, Crown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function TestPage() {
  const navigate = useNavigate();

  const features = [
    { icon: Zap, title: "AI-Powered Analysis", desc: "Get deep insights into your weak areas." },
    { icon: Infinity, title: "Unlimited Attempts", desc: "Practice as much as you want without limits." },
    { icon: Shield, title: "Verified Question Bank", desc: "Questions curated from top university exams." },
    { icon: Star, title: "Smart Recommendations", desc: "Personalized question sets based on performance." }
  ];

  return (
    <div className="min-h-full bg-main flex flex-col items-center p-4 md:p-12 pb-24">
      <div className="max-w-4xl w-full flex flex-col items-center text-center space-y-8 md:space-y-12">
        
        {/* Header */}
        <div className="space-y-4 md:space-y-6">
            <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="inline-flex items-center gap-2 px-4 py-1.5 md:px-5 md:py-2 rounded-full bg-accent/10 text-accent text-xs md:text-sm font-bold uppercase tracking-widest shadow-lg shadow-accent/5 backdrop-blur-md"
            >
                <Crown className="w-3 h-3 md:w-4 md:h-4 fill-accent" /> Premium Feature
            </motion.div>
            <h1 className="text-4xl md:text-6xl font-black tracking-tight text-white leading-[1.1]">
                Unlock Your Full <br/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">
                    Potential.
                </span>
            </h1>
            <p className="text-base md:text-xl text-gray-400 max-w-xl mx-auto leading-relaxed px-4">
                Experience the ultimate preparation tool. Analyze, practice, and master every concept.
            </p>
        </div>

        {/* Pricing Card mimicking Apple's glass style - NO BORDERS, shadows only */}
        <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="w-full max-w-md relative group"
        >
            {/* Ambient Glow behind */}
            <div className="absolute -inset-4 bg-gradient-to-b from-blue-500/20 to-purple-600/20 rounded-[2.5rem] blur-3xl opacity-30 group-hover:opacity-50 transition-opacity duration-700" />
            
            <div className="relative bg-[#1a1a1a] backdrop-blur-3xl p-6 md:p-8 rounded-[2rem] shadow-2xl flex flex-col gap-6 ring-1 ring-white/5">
                <div className="flex items-center justify-between pb-6 border-b border-white/5">
                     <div className="text-left">
                        <h3 className="text-2xl font-bold text-white tracking-tight">Pro Access</h3>
                        <p className="text-gray-400 text-xs mt-1">Everything you need to top.</p>
                     </div>
                     <div className="text-right">
                        <span className="text-4xl font-black text-white">$9.99</span>
                        <span className="text-gray-500 text-xs block font-medium">/month</span>
                     </div>
                </div>

                <div className="space-y-5">
                    {features.map((f, i) => (
                        <div key={i} className="flex items-start gap-4">
                             <div className="w-10 h-10 rounded-xl bg-[#252525] flex items-center justify-center shrink-0 shadow-inner">
                                <f.icon className="w-5 h-5 text-accent" />
                             </div>
                             <div className="text-left pt-0.5">
                                <h4 className="font-bold text-white text-base">{f.title}</h4>
                                <p className="text-xs text-gray-400 leading-relaxed">{f.desc}</p>
                             </div>
                        </div>
                    ))}
                </div>

                <button className="w-full py-4 rounded-xl bg-white text-black font-bold text-lg hover:scale-[1.02] active:scale-[0.98] transition-all shadow-xl shadow-white/5 mt-2">
                    Get Started
                </button>
                <p className="text-[10px] text-center text-gray-500 font-medium">
                    Secure payment • Cancel anytime
                </p>
            </div>
        </motion.div>
        
        {/* Trusted By / Social Proof */}
        <div className="pt-8 opacity-60">
             <p className="text-sm font-medium text-gray-500 uppercase tracking-widest mb-4">Trusted by top students from</p>
             <div className="flex justify-center gap-8 grayscale opacity-50">
                {/* Placeholders for logos if needed, or just text */}
                <span className="font-bold text-white/20">NITs</span>
                <span className="font-bold text-white/20">IITs</span>
                <span className="font-bold text-white/20">BITS</span>
             </div>
        </div>

      </div>
    </div>
  );
}
