import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    ArrowLeft, 
    Trophy, 
    RotateCcw, 
    BarChart3, 
    Clock, 
    Target, 
    Sparkles,
    ChevronRight,
    Award,
    TrendingUp,
    Zap
} from 'lucide-react';
import { getLatestAttempt } from '../services/testServices';
import toast from 'react-hot-toast';
import clsx from 'clsx';

export default function TestResult() {
    const { testId } = useParams();
    const navigate = useNavigate();
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchResult = async () => {
            const res = await getLatestAttempt(testId);
            if (res.success && res.data) {
                setResult(res.data);
            } else {
                toast.error("Result not found. Start a new test!");
                navigate(`/test/take/${testId}`);
            }
            setLoading(false);
        };
        fetchResult();
    }, [testId, navigate]);

    if (loading) return (
        <div className="min-h-screen bg-main flex items-center justify-center">
            <div className="relative">
                <div className="w-16 h-16 border-4 border-accent/20 rounded-full" />
                <div className="absolute top-0 left-0 w-16 h-16 border-4 border-accent border-t-transparent rounded-full animate-spin" />
            </div>
        </div>
    );

    if (!result) return null;

    const formatTime = (seconds) => {
        if (!seconds) return "0s";
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return mins > 0 ? `${mins}m ${secs}s` : `${secs}s`;
    };

    const accuracy = Math.round((result.score / result.totalQuestions) * 100);
    const pace = result.timeTaken ? Math.round((result.timeTaken / result.totalQuestions) * 10) / 10 : 0;

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
                delayChildren: 0.2
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 }
    };

    return (
        <div className="min-h-screen bg-main relative overflow-hidden flex flex-col">
            {/* Immersive Background Glows */}
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-accent/10 blur-[120px] rounded-full animate-pulse" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-primary/5 blur-[150px] rounded-full animate-pulse" style={{ animationDelay: '1s' }} />

            <div className="relative z-10 flex-1 flex flex-col items-center">
                {/* Minimal Top Header */}
                <header className="w-full max-w-5xl mx-auto px-6 py-6 flex items-center justify-between">
                    <button
                        onClick={() => navigate(-1)}
                        className="p-3 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 transition-all active:scale-95 text-secondary"
                    >
                        <ArrowLeft className="w-5 h-5" />
                    </button>
                    
                    <div className="flex items-center gap-3">
                        <div className="px-4 py-2 rounded-xl bg-white/5 border border-white/5 backdrop-blur-md">
                            <span className="text-[10px] font-black text-accent uppercase tracking-widest">Test ID: {testId.slice(-6)}</span>
                        </div>
                    </div>
                </header>

                <motion.div 
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="max-w-4xl w-full px-6 flex flex-col items-center gap-8 pb-20 mt-4"
                >
                    {/* Hero Section: Massive Score */}
                    <motion.div variants={itemVariants} className="relative w-full">
                        <div className="relative p-12 md:p-16 rounded-[4rem] bg-card/30 backdrop-blur-3xl border border-white/5 shadow-3xl overflow-hidden flex flex-col items-center">
                            <div className="absolute top-0 right-0 p-8 opacity-10">
                                <Award className="w-32 h-32 text-accent rotate-12" />
                            </div>

                            <motion.div 
                                initial={{ scale: 0.8, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                transition={{ type: "spring", damping: 15 }}
                                className="relative mb-8"
                            >
                                <div className="absolute inset-0 bg-accent/20 blur-3xl rounded-full" />
                                <div className="relative w-40 h-40 md:w-48 md:h-48 rounded-full border-[10px] border-white/5 flex items-center justify-center">
                                    <svg className="absolute inset-0 w-full h-full -rotate-90">
                                        <circle
                                            cx="50%"
                                            cy="50%"
                                            r="45%"
                                            className="fill-none stroke-accent stroke-[10px]"
                                            strokeDasharray="283"
                                            strokeDashoffset={283 - (283 * accuracy) / 100}
                                            strokeLinecap="round"
                                        />
                                    </svg>
                                    <div className="text-center">
                                        <span className="text-5xl md:text-6xl font-black text-white">{result.score}</span>
                                        <div className="text-xs font-bold text-secondary/40 uppercase tracking-tighter">OF {result.totalQuestions}</div>
                                    </div>
                                </div>
                            </motion.div>

                            <h2 className="text-2xl md:text-3xl font-bold text-white mb-4 text-center">
                                Overall Performance
                            </h2>
                            <p className="text-secondary/60 text-center max-w-md italic text-lg leading-relaxed">
                                "{result.analysis}"
                            </p>
                        </div>
                    </motion.div>

                    {/* Highly Accessible Primary Action */}
                    <motion.div variants={itemVariants} className="w-full flex justify-center">
                        <button 
                            onClick={() => navigate(`/test/take/${testId}/result/analyse`)}
                            className="group relative w-full max-w-lg p-1 rounded-[2rem] bg-gradient-to-r from-accent to-[#6366f1] transition-all hover:scale-[1.02] active:scale-[0.98] shadow-2xl shadow-accent/20"
                        >
                            <div className="relative px-8 py-6 rounded-[1.8rem] bg-black/10 backdrop-blur-sm flex items-center justify-between overflow-hidden">
                                <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                                <div className="flex items-center gap-4">
                                    <div className="p-3 rounded-xl bg-white/10 backdrop-blur-md">
                                        <BarChart3 className="w-6 h-6 text-white" />
                                    </div>
                                    <div className="text-left">
                                        <p className="text-white font-black text-xl tracking-tight">Detailed Analysis</p>
                                        <p className="text-white/60 text-xs font-medium uppercase tracking-widest">Review Every Choice</p>
                                    </div>
                                </div>
                                <div className="p-3 rounded-full bg-white/10 group-hover:bg-white/20 transition-colors">
                                    <ChevronRight className="w-6 h-6 text-white" />
                                </div>
                            </div>
                        </button>
                    </motion.div>

                    {/* Metrics Grid */}
                    <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full">
                        <div className="p-8 rounded-[2.5rem] bg-card/40 backdrop-blur-2xl border border-white/5 flex flex-col items-center text-center group hover:bg-card/50 transition-all">
                            <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                <Clock className="w-6 h-6 text-secondary/40" />
                            </div>
                            <span className="text-2xl font-black text-white mb-1">{formatTime(result.timeTaken)}</span>
                            <span className="text-[10px] font-black text-secondary/40 uppercase tracking-[0.2em]">Total Duration</span>
                        </div>

                        <div className="p-8 rounded-[2.5rem] bg-card/40 backdrop-blur-2xl border border-white/5 flex flex-col items-center text-center group hover:bg-card/50 transition-all">
                            <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                <Target className="w-6 h-6 text-secondary/40" />
                            </div>
                            <span className="text-2xl font-black text-white mb-1">{accuracy}%</span>
                            <span className="text-[10px] font-black text-secondary/40 uppercase tracking-[0.2em]">Precision rate</span>
                        </div>

                        <div className="p-8 rounded-[2.5rem] bg-card/40 backdrop-blur-2xl border border-white/5 flex flex-col items-center text-center group hover:bg-card/50 transition-all">
                            <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                <Zap className="w-6 h-6 text-secondary/40" />
                            </div>
                            <span className="text-2xl font-black text-white mb-1">{pace}s</span>
                            <span className="text-[10px] font-black text-secondary/40 uppercase tracking-[0.2em]">Pace Per Q</span>
                        </div>
                    </motion.div>

                    {/* Secondary Action: Retake */}
                    <motion.div variants={itemVariants} className="w-full flex justify-center mt-4">
                        <button 
                            onClick={() => navigate(`/test/take/${testId}`)}
                            className="flex items-center gap-2 px-8 py-4 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/5 text-secondary font-bold transition-all active:scale-95 group"
                        >
                            <RotateCcw className="w-4 h-4 group-hover:rotate-[-45deg] transition-transform" />
                            <span>Retake this Test</span>
                        </button>
                    </motion.div>
                </motion.div>
            </div>
        </div>
    );
}
