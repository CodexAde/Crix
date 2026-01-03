import { motion } from 'framer-motion';
import { ChevronRight, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function RoadmapDetail({ roadmap, onBack }) {
  const navigate = useNavigate();

  if (!roadmap) return null;

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-24">
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-6 mb-10"
      >
        <button 
          onClick={onBack}
          className="p-4 bg-white/5 border border-white/10 rounded-[1.5rem] hover:bg-white/10 transition-all active:scale-95 group"
        >
          <ArrowLeft className="w-5 h-5 text-secondary group-hover:-translate-x-1 transition-transform" />
        </button>
        <div>
          <div className="flex items-center gap-3 mb-1">
             <span className="text-[10px] uppercase font-black tracking-widest text-accent bg-accent/10 px-2 py-0.5 rounded-md">Neural Path</span>
             <span className="text-[10px] uppercase font-black tracking-widest text-secondary opacity-50">{roadmap.subject}</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-primary tracking-tight line-clamp-2">{roadmap.name}</h1>
          <p className="text-secondary text-sm mt-1 opacity-70">{roadmap.description}</p>
        </div>
      </motion.div>

      <div className="space-y-6">
        {roadmap.days?.map((day, dayIndex) => (
          <motion.div
            key={day._id || dayIndex}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: dayIndex * 0.05 }}
            className="group relative p-8 rounded-[2.5rem] bg-card border border-white/5 hover:border-white/10 transition-all duration-500"
          >
            {/* Ambient Background Glow */}
            <div className="absolute -top-12 -right-12 w-32 h-32 bg-accent/5 blur-[60px] rounded-full pointer-events-none transition-opacity opacity-0 group-hover:opacity-100" />
            
            <div className="flex items-center gap-5 mb-8">
               <div className="w-14 h-14 rounded-2xl bg-accent/10 border border-accent/20 flex items-center justify-center text-accent font-bold text-xl shadow-lg shadow-accent/5">
                 {day.dayNumber}
               </div>
               <div>
                 <h3 className="text-xl font-bold text-primary group-hover:text-accent transition-colors">{day.title}</h3>
                 <p className="text-[10px] text-secondary/50 uppercase tracking-widest font-bold">Daily Milestone</p>
               </div>
            </div>
            
            <div className="grid gap-3 relative">
              {/* Connector Line */}
              <div className="absolute left-7 -top-4 bottom-0 w-px bg-gradient-to-b from-white/10 via-white/5 to-transparent -z-0" />
              
              <div className="space-y-3 z-10">
                {day.topics?.map((topic, topicIndex) => (
                  <motion.button
                    key={topic._id || topicIndex}
                    whileHover={{ x: 8 }}
                    onClick={() => {
                      if (!topic._id) {
                         // Fallback logic if IDs are missing (should not happen with actual data)
                         return;
                      }
                      navigate(`/roadmap/${roadmap._id}/${day._id}/${topic._id}`);
                    }}
                    className="w-full text-left p-5 pl-12 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-accent/20 hover:bg-accent/5 flex items-center justify-between group/topic transition-all relative overflow-hidden"
                  >
                    <div className="absolute left-6 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-secondary/30 group-hover/topic:bg-accent group-hover/topic:scale-125 transition-all shadow-[0_0_10px_transparent] group-hover/topic:shadow-accent/40" />
                    
                    <span className="text-secondary group-hover/topic:text-primary transition-colors font-semibold text-sm">
                      {topic.title}
                    </span>
                    <div className="p-2 rounded-xl bg-white/5 group-hover/topic:bg-accent group-hover/topic:text-white transition-all">
                      <ChevronRight className="w-4 h-4" />
                    </div>
                  </motion.button>
                ))}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
