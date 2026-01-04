import React from 'react';
import { motion } from 'framer-motion';

const testimonials = [
  {
    name: "Alex M.",
    role: "Computer Science",
    text: "Roadmap feature is a lifesaver.",
    img: "https://randomuser.me/api/portraits/men/32.jpg"
  },
  {
    name: "Sarah K.",
    role: "Medical Student",
    text: "Tests adapt to my weak spots perfectly.",
    img: "https://randomuser.me/api/portraits/women/44.jpg"
  },
  {
    name: "Rahul P.",
    role: "Engineering",
    text: "Chat references exact syllabus files.",
    img: "https://randomuser.me/api/portraits/men/86.jpg"
  },
  {
    name: "Emily R.",
    role: "Data Science",
    text: "Replaced 3 other apps for me.",
    img: "https://randomuser.me/api/portraits/women/65.jpg"
  },
  {
    name: "Michael T.",
    role: "Physics",
    text: "UI makes me want to study.",
    img: "https://randomuser.me/api/portraits/men/22.jpg"
  },
  {
    name: "Jessica L.",
    role: "Information Tech",
    text: "Finally, an AI that understands my curriculum.",
    img: "https://randomuser.me/api/portraits/women/28.jpg"
  },
  {
    name: "David B.",
    role: "Mechanical Eng",
    text: "The doubt solving is instant and accurate.",
    img: "https://randomuser.me/api/portraits/men/54.jpg"
  },
  {
    name: "Priya S.",
    role: "Civil Engineering",
    text: "My grades improved in just 2 weeks.",
    img: "https://randomuser.me/api/portraits/women/90.jpg"
  },
  {
    name: "James H.",
    role: "Electrical Eng",
    text: "Circuits concepts are explained so well.",
    img: "https://randomuser.me/api/portraits/men/11.jpg"
  },
  {
    name: "Anita R.",
    role: "Biotech",
    text: "Interactive diagrams are a game changer.",
    img: "https://randomuser.me/api/portraits/women/33.jpg"
  },
  {
    name: "Kevin D.",
    role: "Aerospace",
    text: "Saved me before finals.",
    img: "https://randomuser.me/api/portraits/men/76.jpg"
  },
  {
    name: "Laura W.",
    role: "Chemistry",
    text: "I actually look forward to studying now.",
    img: "https://randomuser.me/api/portraits/women/55.jpg"
  },
    {
    name: "Chris Evans",
    role: "Software Eng",
    text: "Documentation is super clear.",
    img: "https://randomuser.me/api/portraits/men/45.jpg"
  },
  {
    name: "Nina P.",
    role: "Mathematics",
    text: "Calculus helpers are amazing.",
    img: "https://randomuser.me/api/portraits/women/12.jpg"
  },
  {
    name: "Tom H.",
    role: "Robotics",
    text: "Great for visualizing mechanics.",
    img: "https://randomuser.me/api/portraits/men/67.jpg"
  },
  {
    name: "Zara M.",
    role: "Architecture",
    text: "History of architecture timeline is sick.",
    img: "https://randomuser.me/api/portraits/women/89.jpg"
  }
];

const MarqueeRow = ({ items, direction = "left", speed = 20 }) => {
  return (
    <div className="flex overflow-hidden relative w-full py-2">
      <motion.div 
        className="flex gap-4 min-w-full"
        animate={{ x: direction === "left" ? ["0%", "-50%"] : ["-50%", "0%"] }}
        transition={{ duration: speed, repeat: Infinity, ease: "linear" }}
      >
        {/* Triple the items to ensure smooth infinite scroll without gaps */}
        {[...items, ...items, ...items].map((t, i) => (
            <div key={i} className="flex-shrink-0 w-[220px] h-[140px] bg-zinc-900/50 border border-white/5 backdrop-blur-sm p-4 rounded-xl hover:bg-zinc-800/50 hover:border-red-500/30 transition-all flex flex-col justify-between">
                 <p className="text-zinc-300 text-xs font-medium leading-relaxed line-clamp-3">"{t.text}"</p>
                 
                 <div className="flex items-center gap-3 pt-3 border-t border-white/5">
                    <img 
                        src={t.img} 
                        alt={t.name}
                        className="w-8 h-8 rounded-full object-cover border border-white/10 shrink-0"
                    />
                    <div className="min-w-0">
                        <h4 className="font-bold text-white text-xs truncate">{t.name}</h4>
                        <p className="text-[10px] text-zinc-500 truncate">{t.role}</p>
                    </div>
                 </div>
            </div>
        ))}
      </motion.div>
    </div>
  );
};

export default function Testimonials() {
  return (
    <section className="py-24 min-h-screen bg-black flex flex-col justify-center overflow-hidden relative">
        <div className="px-6 max-w-7xl mx-auto w-full mb-16 text-center relative z-10">
            <h2 className="text-5xl md:text-7xl font-bold tracking-tighter mb-4 text-white">
                STUDENT <span className="text-red-600">STORIES.</span>
            </h2>
             <p className="text-zinc-500 max-w-lg mx-auto">Join thousands of students who have transformed their academic journey.</p>
        </div>
        
        {/* Tilted Container - Reduced tilt on mobile */}
        <div className="relative w-full md:-rotate-3 md:scale-110 space-y-4 opacity-100">
            {/* Split data into 4 rows */}
            <MarqueeRow items={testimonials.slice(0, 4)} direction="left" speed={20} />
            <MarqueeRow items={testimonials.slice(4, 8)} direction="right" speed={18} />
            <MarqueeRow items={testimonials.slice(8, 12)} direction="left" speed={22} />
            <MarqueeRow items={testimonials.slice(12, 16)} direction="right" speed={16} />
        </div>
    </section>
  );
}
