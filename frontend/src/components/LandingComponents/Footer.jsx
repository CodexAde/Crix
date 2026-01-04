import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="relative bg-zinc-950 text-white pt-20 pb-10 px-6 overflow-hidden">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start gap-12 relative z-10">
            {/* Branding Section */}
            <div className="flex flex-col gap-4">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-red-600 flex items-center justify-center shadow-lg shadow-red-600/20 shrink-0">
                        <Sparkles className="w-4 h-4 text-white" />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-white tracking-tight">Crix</h2>
                    </div>
                </div>
                <p className="text-zinc-500 max-w-xs text-sm leading-relaxed">
                    Intelligent roadmaps, adaptive testing, and instant syllabus access. The future of learning is here.
                </p>
                <div className="text-zinc-600 text-xs mt-4">
                    © 2024 CodexAde. All rights reserved.
                </div>
            </div>

            {/* Links Section */}
            <div className="flex flex-wrap gap-12 md:gap-24">
                <div>
                    <h4 className="font-bold mb-4 text-white text-sm tracking-wider uppercase">Product</h4>
                    <ul className="space-y-3 text-zinc-400 text-sm">
                        <li className="hover:text-red-500 cursor-pointer transition-colors"><a href="#features">Features</a></li>
                        <li className="hover:text-red-500 cursor-pointer transition-colors"><Link to="/demo">Roadmap</Link></li>
                        <li className="hover:text-red-500 cursor-pointer transition-colors"><Link to="/demo">Pricing</Link></li>
                    </ul>
                </div>
                <div>
                    <h4 className="font-bold mb-4 text-white text-sm tracking-wider uppercase">Company</h4>
                    <ul className="space-y-3 text-zinc-400 text-sm">
                        <li className="hover:text-red-500 cursor-pointer transition-colors">About</li>
                        <li className="hover:text-red-500 cursor-pointer transition-colors">Blog</li>
                        <li className="hover:text-red-500 cursor-pointer transition-colors">Careers</li>
                    </ul>
                </div>
                <div>
                    <h4 className="font-bold mb-4 text-white text-sm tracking-wider uppercase">Legal</h4>
                    <ul className="space-y-3 text-zinc-400 text-sm">
                        <li className="hover:text-red-500 cursor-pointer transition-colors">Privacy</li>
                        <li className="hover:text-red-500 cursor-pointer transition-colors">Terms</li>
                    </ul>
                </div>
            </div>
        </div>
        
        {/* Background Decoration */}
        <div className="absolute bottom-0 left-0 w-full h-[50vh] bg-gradient-to-t from-red-900/10 to-transparent pointer-events-none"></div>
    </footer>
  );
}
