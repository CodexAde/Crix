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
        <div className="min-h-screen bg-main flex flex-col items-center p-4 md:p-12 overflow-x-hidden">
            <div className="max-w-3xl w-full">
                <header className="flex items-center gap-4 mb-12">
                    <button 
                        onClick={() => navigate(-1)} 
                        className="p-3 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 transition-all text-secondary hover:text-primary"
                    >
                        <ArrowLeft className="w-5 h-5" />
                    </button>
                    <div className="text-left">
                        <h1 className="text-xl font-bold text-primary">Detailed Analysis</h1>
                        <p className="text-sm text-secondary/50 font-medium">{test.title}</p>
                    </div>
                </header>

                <div className="space-y-12 pb-24">
                    {test.questions.map((q, qIdx) => {
                        const userAnsObj = lastAttempt.answers.find(a => a.questionId === q._id);
                        const userAns = userAnsObj?.answer;
                        const isCorrect = userAnsObj?.isCorrect;

                        return (
                            <motion.div 
                                key={q._id}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                className="space-y-6"
                            >
                                <div className="flex items-start gap-4">
                                    <span className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-secondary text-sm font-bold shrink-0 mt-1">
                                        {qIdx + 1}
                                    </span>
                                    <h2 className="text-xl font-bold text-primary leading-tight">
                                        {q.question}
                                    </h2>
                                </div>

                                <div className="grid gap-3 pl-12">
                                    {q.options.map((opt, optIdx) => {
                                        const isSelected = userAns === opt;
                                        const isCorrectOpt = q.correctAnswer === opt;
                                        
                                        let borderClass = "border-white/5 bg-white/[0.02]";
                                        let textClass = "text-secondary/60";
                                        let icon = null;

                                        if (isCorrectOpt) {
                                            borderClass = "border-green-500/30 bg-green-500/10 shadow-[0_0_20px_rgba(34,197,94,0.1)]";
                                            textClass = "text-green-400 font-bold";
                                            icon = <CheckCircle2 className="w-5 h-5 text-green-500" />;
                                        } else if (isSelected && !isCorrect) {
                                            borderClass = "border-red-500/30 bg-red-500/10";
                                            textClass = "text-red-400 font-bold";
                                            icon = <XCircle className="w-5 h-5 text-red-500" />;
                                        }

                                        return (
                                            <div 
                                                key={optIdx}
                                                className={clsx(
                                                    "p-5 rounded-2xl border transition-all flex items-center justify-between gap-4",
                                                    borderClass
                                                )}
                                            >
                                                <div className="flex items-center gap-4">
                                                    <div className={clsx(
                                                        "w-6 h-6 rounded-full border flex items-center justify-center text-[10px] font-bold",
                                                        isCorrectOpt ? "border-green-500 bg-green-500 text-white" : isSelected ? "border-red-500 bg-red-500 text-white" : "border-white/10 text-secondary/30"
                                                    )}>
                                                        {String.fromCharCode(65 + optIdx)}
                                                    </div>
                                                    <span className={clsx("text-base", textClass)}>
                                                        {opt}
                                                    </span>
                                                </div>
                                                {icon}
                                            </div>
                                        );
                                    })}
                                </div>

                                {q.explanation && (
                                    <div className="pl-12">
                                        <div className="p-6 rounded-3xl bg-white/5 border border-white/5 flex gap-4">
                                            <Info className="w-5 h-5 text-accent shrink-0 mt-0.5" />
                                            <div>
                                                <h4 className="text-xs font-bold text-accent uppercase tracking-widest mb-2">Explanation</h4>
                                                <p className="text-sm text-secondary/80 leading-relaxed font-medium">
                                                    {q.explanation}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </motion.div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
