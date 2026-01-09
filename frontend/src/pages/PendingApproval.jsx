import React from 'react';
import { motion } from 'framer-motion';
import { Clock, ShieldCheck, Mail, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '../components/Button';

export default function PendingApproval() {
    return (
        <div className="min-h-screen flex items-center justify-center p-4 overflow-hidden" style={{ backgroundColor: 'var(--bg-main)' }}>
            {/* Animated Background Elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <motion.div 
                    animate={{ 
                        scale: [1, 1.2, 1],
                        rotate: [0, 90, 0],
                        opacity: [0.1, 0.2, 0.1]
                    }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                    className="absolute -top-1/4 -right-1/4 w-[600px] h-[600px] bg-primary/20 rounded-full blur-[120px]"
                />
                <motion.div 
                    animate={{ 
                        scale: [1.2, 1, 1.2],
                        rotate: [0, -90, 0],
                        opacity: [0.1, 0.15, 0.1]
                    }}
                    transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
                    className="absolute -bottom-1/4 -left-1/4 w-[500px] h-[500px] bg-accent/20 rounded-full blur-[100px]"
                />
            </div>

            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="relative w-full max-w-xl bg-card/40 backdrop-blur-2xl border border-white/5 rounded-[3rem] p-8 md:p-12 text-center shadow-2xl"
            >
                {/* Icon Section */}
                <div className="relative mb-10 inline-block">
                    <motion.div 
                        animate={{ scale: [1, 1.05, 1], rotate: [0, 5, -5, 0] }}
                        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                        className="w-24 h-24 rounded-[2rem] bg-accent/10 flex items-center justify-center relative z-10"
                    >
                        <Clock className="w-12 h-12 text-accent" />
                    </motion.div>
                    <motion.div 
                        animate={{ scale: [1, 1.5, 1], opacity: [0.2, 0.5, 0.2] }}
                        transition={{ duration: 4, repeat: Infinity }}
                        className="absolute inset-0 bg-accent/20 rounded-[2rem] blur-xl"
                    />
                </div>

                {/* Text Content */}
                <div className="space-y-4 mb-10">
                    <motion.h1 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="text-3xl md:text-4xl font-extrabold tracking-tight"
                        style={{ color: 'var(--text-primary)' }}
                    >
                        Review in Progress
                    </motion.h1>
                    <motion.p 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="text-lg font-medium leading-relaxed opacity-80"
                        style={{ color: 'var(--text-secondary)' }}
                    >
                        Your registration request is being reviewed by our administration team. To maintain our community standards and security, we manually verify every profile.
                    </motion.p>
                </div>

                {/* Steps/Info Grid */}
                <div className="grid grid-cols-1 gap-4 mb-10">
                    {[
                        { icon: ShieldCheck, title: "Identity Verified", status: "Done" },
                        { icon: Clock, title: "Admin Approval", status: "Pending", highlight: true },
                        { icon: Mail, title: "Notification", status: "Upcoming" }
                    ].map((step, i) => (
                        <motion.div 
                            key={step.title}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.4 + (i * 0.1) }}
                            className={`flex items-center justify-between p-5 rounded-3xl border transition-all ${
                                step.highlight ? 'bg-accent/5 border-accent/20 ring-1 ring-accent/10' : 'bg-white/5 border-white/5'
                            }`}
                        >
                            <div className="flex items-center gap-4">
                                <div className={`p-2.5 rounded-xl ${step.highlight ? 'bg-accent/20 text-accent' : 'bg-white/10 text-white/40'}`}>
                                    <step.icon className="w-5 h-5" />
                                </div>
                                <span className={`font-bold ${step.highlight ? 'text-white' : 'text-white/40'}`}>{step.title}</span>
                            </div>
                            <span className={`text-xs font-black uppercase tracking-widest px-3 py-1.5 rounded-lg ${
                                step.status === 'Done' ? 'bg-green-500/20 text-green-500' : 
                                step.status === 'Pending' ? 'bg-accent/20 text-accent animate-pulse' : 
                                'bg-white/10 text-white/30'
                            }`}>
                                {step.status}
                            </span>
                        </motion.div>
                    ))}
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col gap-3">
                    <p className="text-xs font-bold uppercase tracking-widest opacity-40 mb-2">Need help?</p>
                    <div className="flex gap-4">
                        <Link to="/login" className="flex-1">
                            <Button variant="outline" className="w-full h-14 rounded-2xl gap-2 font-bold group">
                                <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                                Back to Login
                            </Button>
                        </Link>
                        <a href="mailto:support@crix.ai" className="flex-1">
                            <Button className="w-full h-14 rounded-2xl gap-2 font-bold bg-white text-black hover:bg-white/90">
                                <Mail className="w-4 h-4" />
                                Contact Us
                            </Button>
                        </a>
                    </div>
                </div>

                <p className="mt-8 text-[11px] font-bold opacity-30 italic">
                    Usually takes 12-24 hours. Hang tight!
                </p>
            </motion.div>
        </div>
    );
}
