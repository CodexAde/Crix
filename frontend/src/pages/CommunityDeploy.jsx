import { motion } from 'framer-motion';
import { Sparkles, Globe, Users, Zap, Heart, ArrowRight, Plus, Info } from 'lucide-react';
import { Link } from 'react-router-dom';

const CommunityDeploy = () => {
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.15
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 30 },
        visible: { 
            opacity: 1, 
            y: 0,
            transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] }
        }
    };

    const sections = [
        {
            title: "Global Impact",
            description: "Deploy resources that reach students across the globe. Your contributions build a universal knowledge base.",
            icon: Globe,
            color: "text-blue-500",
            bg: "bg-blue-500/10"
        },
        {
            title: "Peer Empowerment",
            description: "Help your peers master complex topics by sharing high-quality, structured academic content.",
            icon: Users,
            color: "text-red-500",
            bg: "bg-red-500/10"
        },
        {
            title: "Neural Synergy",
            description: "Our AI optimizes your shared resources, making them interactive and easier to digest for everyone.",
            icon: Zap,
            color: "text-amber-500",
            bg: "bg-amber-500/10"
        }
    ];

    return (
        <div className="min-h-screen bg-main text-white overflow-hidden pb-32">
            {/* Background Neural Grid (The 'Mast' Grid) */}
            <div className="absolute inset-0 opacity-[0.05] pointer-events-none">
                <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
                    <defs>
                        <pattern id="mast-grid" width="40" height="40" patternUnits="userSpaceOnUse">
                            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="1" />
                            <circle cx="0" cy="0" r="1.5" fill="currentColor" />
                        </pattern>
                    </defs>
                    <rect width="100%" height="100%" fill="url(#mast-grid)" />
                </svg>
            </div>

            {/* Ambient Neural Glows */}
            <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-red-600/10 blur-[120px] rounded-full pointer-events-none animate-pulse" />
            <div className="absolute bottom-[0%] right-[-10%] w-[40%] h-[40%] bg-accent/10 blur-[120px] rounded-full pointer-events-none" />
            <div className="absolute top-[30%] right-[10%] w-[20%] h-[20%] bg-red-500/5 blur-[80px] rounded-full pointer-events-none" />

            {/* Hero Section */}
            <div className="relative z-10 max-w-5xl mx-auto px-6 pt-24 md:pt-32">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.8 }}
                    className="flex flex-col items-center text-center mb-16 md:mb-24"
                >
                    <div className="w-16 h-16 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center mb-8 shadow-2xl shadow-red-500/10">
                        <Heart className="w-8 h-8 text-red-500 fill-current" />
                    </div>
                    <h1 className="text-5xl md:text-7xl font-black mb-6 italic">
                        DEPLOY FOR THE <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-red-600 px-6 py-2">WORLD</span>
                    </h1>
                    <p className="text-lg md:text-xl text-secondary max-w-3xl font-medium leading-relaxed opacity-80 mb-12">
                        Join the elite circle of contributors. Crix isn't just a personal library—it's a community-driven neural ecosystem where shared knowledge accelerates collective growth.
                    </p>
                    <Link
                        to="/add-chapters"
                        className="inline-flex items-center gap-4 px-12 py-5 bg-red-600 text-white rounded-full font-black uppercase tracking-[0.2em] shadow-[0_15px_40px_rgba(220,38,38,0.3)] hover:scale-105 active:scale-95 transition-all group"
                    >
                        <span>Start Deploying</span>
                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </Link>
                </motion.div>

                {/* Info Cards */}
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-24"
                >
                    {sections.map((section, idx) => (
                        <motion.div
                            key={idx}
                            variants={itemVariants}
                            className="bg-card/50 backdrop-blur-xl border border-white/5 p-8 rounded-[2rem] hover:border-red-500/30 transition-all duration-500 group"
                        >
                            <div className={`w-12 h-12 rounded-xl ${section.bg} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                                <section.icon className={`w-6 h-6 ${section.color}`} />
                            </div>
                            <h3 className="text-xl font-bold mb-4">{section.title}</h3>
                            <p className="text-sm text-secondary leading-relaxed font-medium">
                                {section.description}
                            </p>
                        </motion.div>
                    ))}
                </motion.div>

                {/* How to Add Section */}
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="bg-white/[0.02] border border-white/5 rounded-[3rem] p-8 md:p-16 mb-24 relative overflow-hidden"
                >
                    <div className="absolute top-0 right-0 p-8 opacity-10">
                        <Info className="w-32 h-32" />
                    </div>
                    
                    <div className="relative z-10 max-w-2xl">
                        <h2 className="text-3xl font-black mb-8 italic tracking-tight">HOW TO CONTRIBUTE</h2>
                        <ul className="space-y-6">
                            {[
                                "Select a Subject from the global database or create a new one.",
                                "Define the Chapter structure and core topics.",
                                "Upload your resources or write content directly.",
                                "Our Neural Engine will sync and optimize it for everyone."
                            ].map((step, i) => (
                                <li key={i} className="flex gap-4">
                                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-red-500 flex items-center justify-center text-[10px] font-black">{i+1}</span>
                                    <p className="text-secondary font-medium leading-relaxed">{step}</p>
                                </li>
                            ))}
                        </ul>
                    </div>
                </motion.div>

                {/* Footer Branding */}
                <div className="text-center">
                    <p className="text-xs font-bold text-secondary tracking-widest uppercase opacity-40">
                        Aurora Protocol V1.0 • Knowledge Synergy
                    </p>
                </div>
            </div>
        </div>
    );
};

export default CommunityDeploy;
