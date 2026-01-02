import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Trophy, RotateCcw, BarChart3 } from 'lucide-react';
import { getLatestAttempt } from '../services/testServices';
import toast from 'react-hot-toast';

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
            <div className="w-10 h-10 border-4 border-accent border-t-transparent rounded-full animate-spin" />
        </div>
    );

    if (!result) return null;

    return (
        <div className="min-h-screen bg-main flex flex-col items-center">
            <header className="bg-card/90 backdrop-blur-md border-b border-border-soft sticky top-0 z-50 w-full">
                <div className="max-w-2xl mx-auto px-6 py-4 flex items-center justify-center relative min-h-[72px]">
                    <button
                        onClick={() => navigate(-1)}
                        className="absolute left-6 p-3 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 transition-all active:scale-95 group text-secondary hover:text-primary"
                    >
                        <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                    </button>

                    <div className="text-center max-w-[60%]">
                        <p className="text-[10px] font-black text-accent mb-0.5 uppercase tracking-[0.2em] opacity-80">
                            Test Summary
                        </p>
                        <h1 className="text-base md:text-xl font-bold text-primary truncate">
                            Performance Report
                        </h1>
                    </div>
                </div>
            </header>

            <motion.div 
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-2xl w-full px-4 py-12 space-y-8"
            >
                <div className="relative p-10 rounded-[3rem] bg-card/40 backdrop-blur-3xl border border-white/5 shadow-2xl overflow-hidden text-center">
                    <div className="absolute -top-24 -left-24 w-64 h-64 bg-accent/10 blur-[100px] rounded-full" />
                    
                    <div className="relative z-10 flex flex-col items-center">
                        <div className="w-24 h-24 rounded-full bg-accent/20 flex items-center justify-center mb-6 shadow-glow">
                            <Trophy className="w-12 h-12 text-accent" />
                        </div>
                        
                        <h2 className="text-5xl font-black text-white tracking-tight mb-2">
                            {result.score} / {result.totalQuestions}
                        </h2>
                        <p className="text-secondary/60 text-sm font-medium uppercase tracking-[0.2em] mb-8">
                            Your Performance
                        </p>

                        <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden mb-10">
                            <motion.div 
                                initial={{ width: 0 }}
                                animate={{ width: `${(result.score / result.totalQuestions) * 100}%` }}
                                className="h-full bg-accent"
                            />
                        </div>

                        <p className="text-lg text-primary/90 font-medium leading-relaxed mb-10 px-6">
                            "{result.analysis}"
                        </p>

                        <div className="flex flex-col md:flex-row gap-4 w-full">
                            <button 
                                onClick={() => navigate(`/test/take/${testId}`)}
                                className="flex-1 py-4 px-8 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/5 text-primary font-bold transition-all active:scale-95 flex items-center justify-center gap-2"
                            >
                                <RotateCcw className="w-4 h-4" />
                                Retake
                            </button>
                            <button 
                                onClick={() => navigate(`/test/take/${testId}/result/analyse`)}
                                className="flex-1 py-4 px-8 rounded-2xl bg-accent text-white font-bold transition-all shadow-[0_10px_20px_rgba(var(--accent-rgb),0.3)] hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2"
                            >
                                <BarChart3 className="w-4 h-4" />
                                Analyze
                            </button>
                        </div>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
