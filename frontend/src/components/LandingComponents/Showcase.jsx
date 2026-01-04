import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

const images = [
    '/chats.png',
    '/TestPage.png',
    '/library.png',
    '/dashboard.png',
];

export default function Showcase() {
    const container = useRef(null);
    const { scrollYProgress } = useScroll({
        target: container,
        offset: ['start end', 'end start']
    });

    const x1 = useTransform(scrollYProgress, [0, 1], [0, -200]);
    const x2 = useTransform(scrollYProgress, [0, 1], [0, 200]);

    return (
        <section id="showcase" ref={container} className="py-20 overflow-hidden bg-black">
            <div className="text-center mb-20">
                <h2 className="text-4xl font-bold text-white mb-4">Built for Performance</h2>
                <div className="h-1 w-20 bg-red-600 mx-auto rounded-full"></div>
            </div>

            <div className="flex flex-col gap-8 rotate-[-3deg] scale-110">
                <motion.div style={{ x: x1 }} className="flex gap-8 w-[200vw]">
                    {images.map((src, i) => (
                        <div key={i} className="w-[50vw] h-[300px] md:h-[400px] rounded-2xl overflow-hidden bg-zinc-900 border border-zinc-800 relative group">
                            <img src={src} alt="showcase" className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-opacity duration-500" />
                        </div>
                    ))}
                </motion.div>
                <motion.div style={{ x: x2 }} className="flex gap-8 w-[200vw] -ml-[50vw]">
                    {[...images].reverse().map((src, i) => (
                         <div key={i} className="w-[50vw] h-[300px] md:h-[400px] rounded-2xl overflow-hidden bg-zinc-900 border border-zinc-800 relative group">
                           <img src={src} alt="showcase" className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-opacity duration-500" />
                       </div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
}
