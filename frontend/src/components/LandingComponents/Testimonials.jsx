import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

const testimonials = [
  {
    name: "Alex M.",
    role: "Computer Science",
    text: "Roadmap feature is a lifesaver. It actually adapts.",
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
    text: "Chat references exact syllabus files instantly.",
    img: "https://randomuser.me/api/portraits/men/86.jpg"
  },
  {
    name: "Emily R.",
    role: "Data Science",
    text: "Replaced 3 other apps for me. Total game changer.",
    img: "https://randomuser.me/api/portraits/women/65.jpg"
  },
  {
    name: "Michael T.",
    role: "Physics",
    text: "UI makes me want to study. It's so clean.",
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
    text: "Interactive diagrams are unbelievable.",
    img: "https://randomuser.me/api/portraits/women/33.jpg"
  },
  {
    name: "Kevin D.",
    role: "Aerospace",
    text: "Saved me before finals. Highly recommend.",
    img: "https://randomuser.me/api/portraits/men/76.jpg"
  },
  {
    name: "Laura W.",
    role: "Chemistry",
    text: "I actually look forward to studying now.",
    img: "https://randomuser.me/api/portraits/women/55.jpg"
  }
];

const VerticalColumn = ({ items, className, duration }) => (
    <div className={className}>
        <motion.div 
            animate={{ y: ["0%", "-50%"] }}
            transition={{ duration: duration || 20, repeat: Infinity, ease: "linear" }}
            className="flex flex-col gap-6"
        >
            {[...items, ...items, ...items].map((t, i) => (
                <div key={i} className="p-6 rounded-2xl bg-zinc-900/40 border border-white/5 backdrop-blur-sm hover:bg-zinc-800/60 hover:border-red-500/20 transition-all group">
                    <p className="text-zinc-300 text-sm leading-relaxed mb-4">"{t.text}"</p>
                    <div className="flex items-center gap-3">
                        <img src={t.img} alt={t.name} className="w-8 h-8 rounded-full border border-white/10" />
                        <div>
                            <h4 className="font-bold text-white text-xs">{t.name}</h4>
                            <p className="text-[10px] text-zinc-500">{t.role}</p>
                        </div>
                    </div>
                </div>
            ))}
        </motion.div>
    </div>
);

export default function Testimonials() {
  return (
    <section className="py-24 min-h-screen bg-black flex flex-col justify-center overflow-hidden relative">
        <div className="px-6 max-w-7xl mx-auto w-full mb-12 text-center relative z-10">
            <h2 className="text-5xl md:text-7xl font-bold tracking-tighter mb-4 text-white">
                WALL OF <span className="text-red-600">LOVE.</span>
            </h2>
             <p className="text-zinc-500 max-w-lg mx-auto">See what the brightest minds are saying.</p>
        </div>
        
        <div className="relative h-[800px] overflow-hidden">
            {/* Top Fade */}
            <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-black to-transparent z-20 pointer-events-none" />
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-7xl mx-auto px-4">
                <VerticalColumn items={testimonials.slice(0, 4)} duration={25} className="hidden md:block" />
                <VerticalColumn items={testimonials.slice(4, 8)} duration={35} className="" />
                <VerticalColumn items={testimonials.slice(8, 12)} duration={28} className="hidden md:block" />
            </div>

            {/* Bottom Fade */}
            <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black to-transparent z-20 pointer-events-none" />
        </div>
    </section>
  );
}
