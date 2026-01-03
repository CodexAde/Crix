import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
    ArrowLeft, 
    CheckCircle2, 
    XCircle, 
    Info, 
    ChevronRight,
    HelpCircle,
    Lightbulb
} from 'lucide-react';
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
            <div className="relative">
                <div className="w-12 h-12 border-4 border-accent/10 rounded-full" />
                <div className="absolute top-0 left-0 w-12 h-12 border-4 border-accent border-t-transparent rounded-full animate-spin" />
            </div>
        </div>
    );

    if (!test || !lastAttempt) return null;

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.15
            }
        }
    };

    const cardVariants = {
        hidden: { opacity: 0, y: 40 },
        visible: { 
            opacity: 1, 
            y: 0,
            transition: {
                type: "spring",
                damping: 20,
                stiffness: 100
            }
        }
    };

    return (
        <div className="min-h-screen bg-main relative overflow-x-hidden flex flex-col items-center">
            {/* Minimal Background Elements (No harsh gradients) */}
            <div className="fixed inset-0 pointer-events-none">
                <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-accent/5 blur-[120px] rounded-full" />
                <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-secondary/5 blur-[150px] rounded-full" />
            </div>

            <div className="max-w-4xl w-full px-4 md:px-6 pt-10">
                <motion.header initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mb-10 flex items-center justify-between">
                    <h1 className="text-2xl md:text-3xl font-bold text-primary">Detailed Analysis</h1>
                    <button 
                        onClick={() => navigate(-1)} 
                        className="text-secondary hover:text-accent text-sm font-bold px-4 py-2 rounded-xl bg-card border border-white/10 active:scale-95 transition-all flex items-center gap-2"
                    >
                        <ArrowLeft className="w-4 h-4" /> Back
                    </button>
                </motion.header>
            </div>

            <motion.main 
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="max-w-4xl w-full mx-auto px-4 md:px-6 py-10 space-y-10 pb-32 relative z-10"
            >
                {test.questions.map((q, qIdx) => {
                    const userAnsObj = lastAttempt.answers.find(a => a.questionId === q._id);
                    const userAns = userAnsObj?.answer;
                    const isCorrect = userAnsObj?.isCorrect;

                    return (
                        <motion.div 
                            key={q._id}
                            variants={cardVariants}
                            className="relative flex flex-col gap-4"
                        >
                            {/* Question Header */}
                            <div className="flex items-center gap-3 px-2">
                                <div className={clsx(
                                    "px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest",
                                    isCorrect ? "bg-green-500/10 text-green-500" : "bg-red-500/10 text-red-500"
                                )}>
                                    {isCorrect ? 'Correct Path' : 'Correction Needed'}
                                </div>
                                <div className="h-[1px] flex-1 bg-white/[0.03]" />
                                <div className="text-[10px] font-bold text-secondary/30 uppercase tracking-tighter">
                                    Q {qIdx + 1}
                                </div>
                            </div>

                            {/* Main Question Card */}
                            <div className="bg-card/20 backdrop-blur-3xl rounded-[2.5rem] p-6 md:p-10 shadow-2xl relative overflow-hidden">
                                <div className="relative z-10">
                                    <h2 className="text-lg md:text-xl font-bold text-white leading-relaxed tracking-tight mb-8">
                                        {q.question}
                                    </h2>

                                    {/* Options Section */}
                                    <div className="grid gap-3">
                                        {q.options.map((opt, optIdx) => {
                                            const isSelected = userAns === opt;
                                            const isCorrectOpt = q.correctAnswer === opt;
                                            
                                            return (
                                                <div 
                                                    key={optIdx}
                                                    className={clsx(
                                                        "relative p-4 rounded-2xl transition-all duration-300 flex items-center justify-between gap-4 overflow-hidden",
                                                        isCorrectOpt 
                                                            ? "bg-green-500/20 text-green-400" 
                                                            : isSelected && !isCorrect 
                                                                ? "bg-red-500/20 text-red-400"
                                                                : "bg-white/[0.02] text-secondary/50"
                                                    )}
                                                >
                                                    <div className="flex items-center gap-4 flex-1 min-w-0">
                                                        <div className={clsx(
                                                            "w-8 h-8 rounded-xl flex items-center justify-center text-[10px] font-black shrink-0",
                                                            isCorrectOpt ? "bg-green-500 text-white" : isSelected ? "bg-red-500 text-white" : "bg-white/5 text-secondary/40"
                                                        )}>
                                                            {String.fromCharCode(65 + optIdx)}
                                                        </div>
                                                        <span className="text-sm md:text-base font-medium leading-relaxed">
                                                            {opt}
                                                        </span>
                                                    </div>
                                                    
                                                    <div className="shrink-0">
                                                        {isCorrectOpt && <CheckCircle2 className="w-5 h-5" />}
                                                        {isSelected && !isCorrectOpt && <XCircle className="w-5 h-5" />}
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            </div>

                            {/* Integrated Smart Insight */}
                            {q.explanation && (
                                <motion.div 
                                    initial={{ opacity: 0, x: -10 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    className="mx-4 md:mx-8 p-6 md:p-8 rounded-b-[2.5rem] bg-accent/5 backdrop-blur-xl -mt-8 pt-12 border-t border-white/[0.02] relative"
                                >
                                    <div className="flex gap-4 items-start">
                                        <div className="p-2.5 rounded-xl bg-accent text-white shadow-lg shadow-accent/20 shrink-0">
                                            <Lightbulb className="w-4 h-4" />
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-[9px] font-black text-accent uppercase tracking-[0.2em] mb-2">
                                                Deep Insight
                                            </p>
                                            <p className="text-sm text-primary/70 leading-relaxed font-medium">
                                                {q.explanation}
                                            </p>
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </motion.div>
                    );
                })}
            </motion.main>
        </div>
    );
}
