import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

const features = [
  {
    title: "AI Roadmaps",
    description: "Personalized learning paths generated instantly.",
    color: "#09090b", // zinc-950
    img: "/roadmap.png"
  },
  {
    title: "Smart Analytics", 
    description: "Deep insights into your strengths and weak spots.",
    color: "#18181b", // zinc-900
    img: "/dashboard.png"
  },
  {
    title: "Adaptive Testing",
    description: "Tests that evolve. The better you get, the harder they become.",
    color: "#27272a", // zinc-800
    img: "/TestPage.png"
  },
  {
    title: "Instant Doubts",
    description: "Chat with your syllabus. References provided instantly.",
    color: "#3f3f46", // zinc-700
    img: "/chats.png"
  }
];

const Card = ({ i, title, description, color, img, range, targetScale }) => {
  const container = useRef(null);
  const { scrollYProgress } = useScroll({
    target: container,
    offset: ['start end', 'start start']
  });

  const imageScale = useTransform(scrollYProgress, [0, 1], [1.5, 1]); // Zoom out effect for image
  const scale = useTransform(scrollYProgress, [0, 1], [1, targetScale]); // Scale down effect for card
  
  // Brightness/Filter effect - mimics what the user asked for logic-wise
  // As the card goes up (progress 0->1), it might get darker if we wanted, 
  // but here we want the *next* cards to cover it, and the *current* card to possibly scale down.
  // The user's snippet scales the specific card based on scroll.
  
  // We need the scroll relative to the viewport to scale *this* card when it's sticky.
  // Actually, standard sticky stacking behavior:
  // Card sticks at top. Next card comes and covers it.
  // To create the "stacking depth" effect: The card *underneath* should scale down as the next one arrives.
  // But Framer Motion `useScroll` is usually element-based.
  
  // Let's use the sticky container pattern.
  return (
    <div ref={container} className="h-screen flex items-center justify-center sticky top-0">
      <motion.div 
        style={{ 
            backgroundColor: color, 
            scale,
            top: `calc(${i * 2}vh + 20px)` // Slight offset so they stack visibly
        }} 
        className="flex flex-col md:flex-row relative h-[60vh] md:h-[500px] w-full max-w-[1000px] rounded-[30px] p-6 md:p-12 shadow-2xl border border-white/10 origin-top overflow-hidden"
      >
        <div className="flex flex-col justify-between h-full z-10 w-full md:w-[45%] mb-6 md:mb-0">
            <div>
                <h2 className="text-3xl md:text-5xl font-bold mb-4 md:mb-6 leading-tight">{title}</h2>
                <p className="text-lg md:text-xl text-zinc-400 font-light">{description}</p>
            </div>
            <div className="flex items-center gap-3 text-sm text-zinc-600 font-mono mt-4 md:mt-0">
                <span className="w-8 h-8 rounded-full border border-zinc-700 flex items-center justify-center">0{i + 1}</span>
                <span>FEATURE</span>
            </div>
        </div>
        
        <div className="w-full md:w-[55%] h-full relative flex items-center justify-center perspective-1000">
             {/* 3D Floating Card Container */}
            <motion.div 
                style={{ scale: imageScale }} 
                animate={{ 
                    y: [0, -10, 0],
                    rotateY: -12,
                    rotateX: 5,
                }}
                transition={{ 
                    y: { duration: 4, repeat: Infinity, ease: "easeInOut" },
                    rotateY: { type: "spring", stiffness: 50 },
                    rotateX: { type: "spring", stiffness: 50 }
                }}
                className="relative w-[90%] aspect-video rounded-xl bg-black border border-white/10 shadow-[0_20px_50px_-12px_rgba(0,0,0,0.5)] transform-style-3d group"
            >
                {/* Glossy Overlay */}
                <div className="absolute inset-0 bg-gradient-to-tr from-white/10 to-transparent rounded-xl z-20 pointer-events-none mix-blend-overlay" />
                
                {/* Screen Content */}
                <div className="absolute inset-1 bg-zinc-900 rounded-lg overflow-hidden">
                    <img 
                        src={img} 
                        alt={title} 
                        className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity duration-500" 
                    />
                </div>

                {/* Depth Layers (Fake 3D thickness) */}
                <div className="absolute inset-0 rounded-xl border-2 border-white/5 z-30" />
                <div className="absolute -inset-2 bg-gradient-to-r from-red-500/20 to-blue-500/20 blur-xl opacity-0 group-hover:opacity-40 transition-opacity duration-700 -z-10" />
            </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default function FeatureStack() {
  const container = useRef(null);
  const { scrollYProgress } = useScroll({
    target: container,
    offset: ['start start', 'end end']
  });

  return (
    <section id="features" ref={container} className="relative mt-[10vh] mb-[10vh] px-4">
        {/* Title Section */}
        <div className="sticky top-[10vh] text-center mb-20 z-0 opacity-100 transition-opacity duration-300">
            <h2 className="text-4xl md:text-6xl font-bold mb-4 tracking-tighter">Everything you need.</h2>
            <div className="h-1 w-20 bg-red-600 mx-auto rounded-full mt-4"></div>
        </div>
        
      {features.map((feature, i) => {
        // Calculate target scale: 1 -> 0.95 -> 0.9 -> ...
        const targetScale = 1 - ((features.length - 1 - i) * 0.05);
        return (
          <Card 
            key={i} 
            i={i} 
            {...feature} 
            range={[i * 0.25, 1]}
            targetScale={targetScale}
          />
        );
      })}
    </section>
  );
}
