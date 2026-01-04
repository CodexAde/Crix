import React from 'react';
import { motion } from 'framer-motion';

const testimonials = [
  {
    name: "Alex M.",
    role: "Computer Science",
    text: "The roadmap feature is a lifesaver. It literally broke down my entire semester into manageable chunks.",
  },
  {
    name: "Sarah K.",
    role: "Medical Student",
    text: "I love how the tests adapt. It actually finds my weak spots and forces me to learn them.",
  },
  {
    name: "Rahul P.",
    role: "Engineering",
    text: "The chat feature references my exact syllabus files. No more hallucinated answers. Pure gold.",
  },
  {
    name: "Emily R.",
    role: "Data Science",
    text: "CRIX replaced 3 other apps for me. Notes, planning, and testing all in one place.",
  },
  {
    name: "Michael T.",
    role: "Physics",
    text: "The UI is just... chef's kiss. Makes me actually want to study.",
  },
];

const UnendingMarquee = () => {
  return (
    <div className="flex overflow-hidden py-10 relative">
        <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-black to-transparent z-10"></div>
        <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-black to-transparent z-10"></div>
        
        <motion.div 
            className="flex gap-8 flex-shrink-0"
            animate={{ x: "-50%" }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        >
            {[...testimonials, ...testimonials, ...testimonials].map((t, i) => (
                <div key={i} className="w-[400px] bg-zinc-900 border border-zinc-800 p-8 rounded-2xl flex-shrink-0 hover:border-red-600/50 transition-colors group">
                    <p className="text-xl text-zinc-300 mb-6 font-medium leading-relaxed">"{t.text}"</p>
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center font-bold text-zinc-500 group-hover:text-red-500 transition-colors">
                            {t.name[0]}
                        </div>
                        <div>
                            <h4 className="font-bold text-white">{t.name}</h4>
                            <p className="text-sm text-zinc-500">{t.role}</p>
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
    <section className="py-20 min-h-[50vh] bg-black flex flex-col justify-center">
        <div className="px-6 max-w-7xl mx-auto w-full mb-12 flex flex-col md:flex-row justify-between items-end gap-6">
            <div>
                <h2 className="text-5xl md:text-7xl font-bold tracking-tighter mb-4">
                    STUDENT<br />
                    <span className="text-red-600">STORIES.</span>
                </h2>
            </div>
            <p className="text-zinc-500 max-w-sm mb-2">Join thousands of students who have transformed their academic journey.</p>
        </div>
        
        <UnendingMarquee />
    </section>
  );
}
