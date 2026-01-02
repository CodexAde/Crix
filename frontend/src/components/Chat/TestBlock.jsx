import { motion } from 'framer-motion';
import { ClipboardCheck, ArrowRight, RotateCcw, Trophy } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { getTestByReference } from '../../services/testServices';

export default function TestBlock({ referenceId, type }) {
    const navigate = useNavigate();
    const [testData, setTestData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTest = async () => {
            if (!referenceId) return;
            const res = await getTestByReference(referenceId);
            if (res.success && res.data) {
                setTestData(res.data);
            }
            setLoading(false);
        };
        fetchTest();
    }, [referenceId]);

    if (loading) return null;
    if (!testData?.test) return null;

    const { test, lastAttempt } = testData;

    return (
        <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full my-6 p-6 rounded-[2rem] bg-card/40 backdrop-blur-xl border border-white/5 shadow-[0_20px_50px_rgba(0,0,0,0.3)] transition-all overflow-hidden relative group"
        >
            {/* Glossy Overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/[0.05] to-transparent pointer-events-none" />
            
            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="flex items-center gap-5">
                    <div className="w-14 h-14 rounded-2xl bg-accent/15 flex items-center justify-center shadow-inner">
                        {lastAttempt ? (
                            <Trophy className="w-7 h-7 text-accent" />
                        ) : (
                            <ClipboardCheck className="w-7 h-7 text-accent" />
                        )}
                    </div>
                    <div className="text-left">
                        <h3 className="text-lg font-bold text-primary tracking-tight leading-tight">
                            {test.title}
                        </h3>
                        <p className="text-xs text-secondary/60 mt-1 font-medium">
                            {lastAttempt 
                                ? `Last score: ${lastAttempt.score}/${lastAttempt.totalQuestions}`
                                : `${test.questions.length} Questions • ${test.duration} mins`
                            }
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-3 w-full md:w-auto">
                    {lastAttempt ? (
                        <button 
                            onClick={() => navigate(`/test/take/${test._id}/result`)}
                            className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-white/5 hover:bg-white/10 text-primary text-sm font-bold transition-all border border-white/5 active:scale-95"
                        >
                            <RotateCcw className="w-4 h-4" />
                            Analyse
                        </button>
                    ) : (
                        <button 
                            onClick={() => navigate(`/test/take/${test._id}`)}
                            className="flex-1 md:flex-none flex items-center justify-center gap-2 px-8 py-3.5 rounded-2xl bg-accent text-white text-sm font-bold transition-all shadow-[0_10px_20px_rgba(var(--accent-rgb),0.3)] hover:scale-[1.02] active:scale-[0.98]"
                        >
                            Start Test
                            <ArrowRight className="w-4 h-4" />
                        </button>
                    )}
                </div>
            </div>
            
            {/* Progress Bar for last attempt if exists */}
            {lastAttempt && (
                <div className="mt-5 w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                    <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${(lastAttempt.score / lastAttempt.totalQuestions) * 100}%` }}
                        className="h-full bg-accent shadow-[0_0_10px_rgba(var(--accent-rgb),0.5)]"
                    />
                </div>
            )}
        </motion.div>
    );
}
