import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

const MorphCard = ({ children, progress, range, targetScale, backgroundColor, zIndex }) => {
  const container = useRef(null);
  
  // Transform mapped to the scroll progress of the parent container
  const scale = useTransform(progress, range, [0.8, 1]);
  const width = useTransform(progress, range, ['80%', '100%']);
  const height = useTransform(progress, range, ['60vh', '100vh']);
  const borderRadius = useTransform(progress, range, ['40px', '0px']);
  const opacity = useTransform(progress, range, [0.5, 1]); // Fade in slightly as it expands

  return (
    <div ref={container} className="h-screen w-full sticky top-0 flex items-center justify-center overflow-hidden" style={{ zIndex }}>
        <motion.div 
            style={{ 
                width, 
                height, 
                backgroundColor, 
                borderRadius,
                scale
            }}
            className="relative overflow-hidden shadow-2xl flex flex-col items-center justify-center"
        >
            {children}
        </motion.div>
    </div>
  );
};

export default function ScrollMorph() {
  const container = useRef(null);
  const { scrollYProgress } = useScroll({
    target: container,
    offset: ['start start', 'end end']
  });

  return (
    <div ref={container} className="relative h-[250vh]">
        {/* Card 1: Solid White with Dashboard */}
        <MorphCard 
            progress={scrollYProgress} 
            range={[0, 0.3]} 
            backgroundColor="#ffffff" // Solid White
            zIndex={10}
        >
             <div className="w-full h-full flex flex-col md:flex-row items-center justify-center p-8 md:p-20 gap-8 md:gap-16">
                 <div className="flex-1 text-center md:text-left">
                     <motion.span className="text-red-500 font-bold tracking-widest uppercase text-sm mb-2 block">
                         Control Center
                     </motion.span>
                     <h2 className="text-4xl md:text-6xl font-black text-black mb-6 tracking-tighter">
                         YOUR ENTIRE <br/> DEGREE. <br/> IN ONE VIEW.
                     </h2>
                     <p className="text-zinc-500 text-lg md:text-xl font-medium max-w-md">
                         Track current CGPA, attendance, and syllabus completion in real-time. No more spreadsheets.
                     </p>
                 </div>
                 <div className="flex-1 w-full max-w-2xl relative">
                     <img 
                        src="/dashboard.png" 
                        alt="Dashboard" 
                        className="w-full h-auto object-cover rounded-xl shadow-2xl border border-zinc-200"
                     />
                 </div>
             </div>
        </MorphCard>

        {/* Card 2: Dark/Red with Roadmap/Another UI */}
        <MorphCard 
            progress={scrollYProgress} 
            range={[0.4, 0.7]} 
            backgroundColor="#18181b" // Zinc-900
            zIndex={20}
        >
             <div className="w-full h-full flex flex-col-reverse md:flex-row items-center justify-center p-8 md:p-20 gap-8 md:gap-16">
                 <div className="flex-1 w-full max-w-2xl relative">
                     <div className="bg-zinc-800 w-full aspect-video rounded-xl shadow-2xl border border-zinc-700 flex items-center justify-center overflow-hidden">
                        {/* Placeholder or another image if available */}
                        <img 
                            src="/roadmap.png" 
                            alt="Roadmap" 
                            className="w-full h-full object-cover opacity-90"
                        />
                     </div>
                 </div>
                 <div className="flex-1 text-center md:text-left">
                     <motion.span className="text-red-500 font-bold tracking-widest uppercase text-sm mb-2 block">
                         Smart Planning
                     </motion.span>
                     <h2 className="text-4xl md:text-6xl font-black text-white mb-6 tracking-tighter">
                         AUTOMATED <br/> ROADMAPS.
                     </h2>
                     <p className="text-zinc-400 text-lg md:text-xl font-medium max-w-md">
                         From "I haven't started" to "I'm ready" in one click. We generate the schedule, you do the learning.
                     </p>
                 </div>
             </div>
        </MorphCard>
    </div>
  );
}