import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, CheckCircle2, XCircle, Info } from 'lucide-react';
import { getTestById, getLatestAttempt } from '../services/testServices';
import { clsx } from 'clsx';
import toast from 'react-hot-toast';

export default function TestAnalysis() {
    const { testId } = useParams();
    const navigate = useNavigate();
    const [test, setTest] = useState(null);
    const [lastAttempt, setLastAttempt] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            const [testRes, attemptRes] = await Promise.all([
                getTestById(testId),
                getLatestAttempt(testId)
            ]);

            if (testRes.success && attemptRes.success && attemptRes.data) {
                setTest(testRes.data);
                setLastAttempt(attemptRes.data);
            } else {
                toast.error("Data missing for analysis");
                navigate(-1);
            }
            setLoading(false);
        };
        fetchData();
    }, [testId, navigate]);

    if (loading) return (
        <div className="min-h-screen bg-main flex items-center justify-center">
            <div className="w-10 h-10 border-4 border-accent border-t-transparent rounded-full animate-spin" />
        </div>
    );

    if (!test || !lastAttempt) return null;

    return (
        <div className="min-h-screen bg-main flex flex-col items-center overflow-x-hidden">
            <header className="bg-card/90 backdrop-blur-md border-b border-border-soft sticky top-0 z-50 w-full">
                <div className="max-w-3xl mx-auto px-6 py-4 flex items-center justify-center relative min-h-[72px]">
                    <button
                        onClick={() => navigate(-1)}
                        className="absolute left-6 p-3 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 transition-all active:scale-95 group text-secondary hover:text-primary"
                    >
                        <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                    </button>

                    <div className="text-center max-w-[60%]">
                        <p className="text-[10px] font-black text-accent mb-0.5 uppercase tracking-[0.2em] opacity-80">
                            Detailed Analysis
                        </p>
                        <h1 className="text-base md:text-xl font-bold text-primary truncate">
                            {test.title}
                        </h1>
                    </div>
                </div>
            </header>

            <main className="max-w-3xl w-full px-4 md:px-6 py-12 space-y-10 pb-32">
                {test.questions.map((q, qIdx) => {
                    const userAnsObj = lastAttempt.answers.find(a => a.questionId === q._id);
                    const userAns = userAnsObj?.answer;
                    const isCorrect = userAnsObj?.isCorrect;

                    return (
                        <motion.div 
                            key={q._id}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-50px" }}
                            className="group relative"
                        >
                            {/* Question Card */}
                            <div className="bg-card/40 backdrop-blur-xl rounded-[2.5rem] border border-white/5 overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.3)] hover:border-white/10 transition-all duration-500">
                                {/* Glossy Header Section */}
                                <div className="p-8 md:p-10 border-b border-white/5 bg-gradient-to-br from-white/[0.03] to-transparent">
                                    <div className="flex items-start gap-5">
                                        <div className="w-12 h-12 rounded-2xl bg-accent/10 border border-accent/20 flex items-center justify-center text-accent text-lg font-black shrink-0 shadow-inner">
                                            {qIdx + 1}
                                        </div>
                                        <h2 className="text-xl md:text-2xl font-bold text-primary leading-snug tracking-tight pt-1">
                                            {q.question}
                                        </h2>
                                    </div>
                                </div>

                                {/* Options Section */}
                                <div className="p-6 md:p-10 bg-black/20">
                                    <div className="grid gap-3.5">
                                        {q.options.map((opt, optIdx) => {
                                            const isSelected = userAns === opt;
                                            const isCorrectOpt = q.correctAnswer === opt;
                                            
                                            let stateStyles = "border-white/5 bg-white/[0.02] text-secondary/60";
                                            let icon = null;

                                            if (isCorrectOpt) {
                                                stateStyles = "border-green-500/40 bg-green-500/10 text-green-400 ring-1 ring-green-500/20";
                                                icon = <CheckCircle2 className="w-5 h-5 text-green-400 shrink-0" />;
                                            } else if (isSelected && !isCorrect) {
                                                stateStyles = "border-red-500/40 bg-red-500/10 text-red-400 ring-1 ring-red-500/20";
                                                icon = <XCircle className="w-5 h-5 text-red-400 shrink-0" />;
                                            }

                                            return (
                                                <div 
                                                    key={optIdx}
                                                    className={clsx(
                                                        "p-5 rounded-2xl border transition-all flex items-center justify-between gap-4 group/opt shadow-sm",
                                                        stateStyles
                                                    )}
                                                >
                                                    <div className="flex items-center gap-4 flex-1 min-w-0">
                                                        <div className={clsx(
                                                            "w-7 h-7 rounded-lg border flex items-center justify-center text-[11px] font-black shrink-0 transition-transform group-hover/opt:scale-105",
                                                            isCorrectOpt ? "border-green-500 bg-green-500 text-white" : isSelected ? "border-red-500 bg-red-500 text-white" : "border-white/10 text-secondary/30 bg-white/5"
                                                        )}>
                                                            {String.fromCharCode(65 + optIdx)}
                                                        </div>
                                                        <span className="text-base md:text-lg font-medium leading-relaxed break-words">
                                                            {opt}
                                                        </span>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        {isSelected && !isCorrectOpt && (
                                                            <span className="text-[10px] font-black uppercase tracking-tighter opacity-60 px-2 py-0.5 rounded-md bg-red-500/20 text-red-400 border border-red-500/20">
                                                                Your Choice
                                                            </span>
                                                        )}
 
                                                     </div>
                                                </div>
                                            );
                                        })}
                                    </div>

                                    {/* Smart Insight (Explanation) */}
                                    {q.explanation && (
                                        <div className="mt-8 relative pt-8 border-t border-white/5">
                                            <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-accent text-[10px] font-black text-white uppercase tracking-[0.2em] shadow-lg shadow-accent/20">
                                                Smart Insight
                                            </div>
                                            <div className="p-6 rounded-[2rem] bg-accent/5 border border-accent/10 flex gap-5 group/insight hover:bg-accent/10 transition-colors duration-500">
                                                <div className="w-10 h-10 rounded-xl bg-accent/20 flex items-center justify-center shrink-0 shadow-inner">
                                                    <Info className="w-5 h-5 text-accent group-hover/insight:rotate-12 transition-transform" />
                                                </div>
                                                <div>
                                                    <p className="text-sm md:text-base text-primary/80 leading-relaxed font-medium italic">
                                                        "{q.explanation}"
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    );
                })}
            </main>
        </div>
    );
}
