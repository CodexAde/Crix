import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, CheckCircle2, XCircle, Info, ChevronRight, ChevronLeft, Send, Sparkles, Trophy, Clock, Target, AlertCircle } from 'lucide-react';
import { getTestById, submitTest, getLatestAttempt } from '../services/testServices';
import { clsx } from 'clsx';
import toast from 'react-hot-toast';

export default function TakeTest() {
    const { testId } = useParams();
    const navigate = useNavigate();
    
    const [test, setTest] = useState(null);
    const [loading, setLoading] = useState(true);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [answers, setAnswers] = useState({});
    const [submitting, setSubmitting] = useState(false);
    const [result, setResult] = useState(null);
    const [timeLeft, setTimeLeft] = useState(null);

    useEffect(() => {
        const fetchTest = async () => {
            const [testRes, attemptRes] = await Promise.all([
                getTestById(testId),
                getLatestAttempt(testId)
            ]);

            if (testRes.success) {
                // If already attempted, redirect to result
                if (attemptRes.success && attemptRes.data) {
                    navigate(`/test/take/${testId}/result`, { replace: true });
                    return;
                }

                setTest(testRes.data);
                if (testRes.data.duration) {
                    setTimeLeft(testRes.data.duration * 60);
                }
            } else {
                toast.error("Failed to load test");
                navigate(-1);
            }
            setLoading(false);
        };
        fetchTest();
    }, [testId, navigate]);

    useEffect(() => {
        if (timeLeft === null || timeLeft <= 0 || result) return;
        const timer = setInterval(() => {
            setTimeLeft(prev => prev - 1);
        }, 1000);
        return () => clearInterval(timer);
    }, [timeLeft, result]);

    useEffect(() => {
        if (timeLeft === 0 && !result) {
            handleSubmit();
        }
    }, [timeLeft]);

    const handleAnswerSelect = (questionId, answer) => {
        if (result) return;
        setAnswers(prev => ({ ...prev, [questionId]: answer }));
    };

    const handleSubmit = async () => {
        if (submitting || result) return;
        
        const formattedAnswers = test.questions.map(q => ({
            questionId: q._id,
            answer: answers[q._id] || ""
        }));

        setSubmitting(true);
        const res = await submitTest(testId, formattedAnswers);
        if (res.success) {
            toast.success("Test submitted!");
            navigate(`/test/take/${testId}/result`, { replace: true });
        } else {
            toast.error("Submission failed");
            setSubmitting(false);
        }
    };

    if (loading) return (
        <div className="min-h-screen bg-main flex items-center justify-center">
            <div className="w-10 h-10 border-4 border-accent border-t-transparent rounded-full animate-spin" />
        </div>
    );

    if (!test) return null;

    const currentQuestion = test.questions[currentQuestionIndex];
    const isFirst = currentQuestionIndex === 0;
    const isLast = currentQuestionIndex === test.questions.length - 1;

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };


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
                            {test.title}
                        </p>
                        <h1 className="text-base md:text-xl font-bold text-primary truncate">
                            Question {currentQuestionIndex + 1} of {test.questions.length}
                        </h1>
                    </div>

                    {timeLeft !== null && (
                        <div className={clsx(
                            "absolute right-6 flex items-center gap-2 px-3 py-2 rounded-xl border backdrop-blur-md transition-all font-mono text-xs md:text-sm font-bold",
                            timeLeft < 60 ? "bg-red-500/10 border-red-500/20 text-red-400 animate-pulse" : "bg-white/5 border-white/10 text-primary"
                        )}>
                            <Clock className="w-4 h-4" />
                            <span className="hidden sm:inline">{formatTime(timeLeft)}</span>
                            <span className="sm:hidden">{formatTime(timeLeft)}</span>
                        </div>
                    )}
                </div>
            </header>

            <div className="max-w-3xl w-full px-4 md:px-0 py-10">
                {/* Progress Dots */}
                <div className="flex gap-1.5 mb-10 overflow-x-auto no-scrollbar pb-2">
                    {test.questions.map((_, idx) => (
                        <div 
                            key={idx}
                            className={clsx(
                                "h-1.5 min-w-[20px] md:min-w-[30px] flex-1 rounded-full transition-all duration-500",
                                idx === currentQuestionIndex ? "bg-accent" : answers[test.questions[idx]._id] ? "bg-accent/40" : "bg-white/5"
                            )}
                        />
                    ))}
                </div>

                {/* Question Area */}
                <div className="relative min-h-[400px] pb-32">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={currentQuestionIndex}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            transition={{ duration: 0.3, ease: "easeOut" }}
                            className="w-full"
                        >
                            <div className="space-y-10">
                                <h2 className="text-2xl md:text-4xl font-bold text-primary leading-tight">
                                    {currentQuestion.question}
                                </h2>

                                <div className="grid gap-4">
                                    {currentQuestion.type === 'mcq' ? (
                                        currentQuestion.options.map((option, idx) => (
                                            <button
                                                key={idx}
                                                onClick={() => handleAnswerSelect(currentQuestion._id, option)}
                                                className={clsx(
                                                    "w-full text-left p-6 rounded-[1.5rem] border transition-all duration-300 group flex items-start gap-4",
                                                    answers[currentQuestion._id] === option 
                                                        ? "bg-accent/10 border-accent/30 shadow-[0_0_30px_rgba(var(--accent-rgb),0.1)] py-7" 
                                                        : "bg-white/[0.02] border-white/5 hover:border-white/10 hover:bg-white/[0.04]"
                                                )}
                                            >
                                                <div className={clsx(
                                                    "w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 mt-0.5 transition-all text-[10px] font-bold",
                                                    answers[currentQuestion._id] === option 
                                                        ? "border-accent bg-accent text-white" 
                                                        : "border-white/10 text-secondary/40 group-hover:border-white/20"
                                                )}>
                                                    {String.fromCharCode(65 + idx)}
                                                </div>
                                                <span className={clsx(
                                                    "text-base md:text-xl font-medium transition-colors",
                                                    answers[currentQuestion._id] === option ? "text-primary" : "text-secondary/80 group-hover:text-primary"
                                                )}>
                                                    {option}
                                                </span>
                                            </button>
                                        ))
                                    ) : (
                                        <textarea
                                            value={answers[currentQuestion._id] || ""}
                                            onChange={(e) => handleAnswerSelect(currentQuestion._id, e.target.value)}
                                            placeholder="Type your answer here..."
                                            className="w-full h-64 p-8 rounded-[2rem] bg-white/[0.02] border border-white/5 focus:border-accent/30 focus:bg-accent/5 transition-all outline-none text-primary placeholder:text-secondary/30 resize-none font-medium text-lg leading-relaxed shadow-inner"
                                        />
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    </AnimatePresence>
                </div>

                {/* Footer Controls - Now handled within the flow for mobile safety */}
                <div className="fixed bottom-0 left-0 right-0 p-6 md:p-12 z-50">
                    <div className="max-w-3xl mx-auto flex items-center justify-between gap-4">
                        <motion.button
                            whileTap={{ scale: 0.9 }}
                            onClick={() => setCurrentQuestionIndex(prev => Math.max(0, prev - 1))}
                            disabled={isFirst}
                            className={clsx(
                                "p-5 rounded-3xl bg-white/10 border border-white/10 text-primary backdrop-blur-2xl transition-all shadow-2xl disabled:opacity-20 disabled:pointer-events-none",
                                "hover:bg-white/20"
                            )}
                        >
                            <ChevronLeft className="w-6 h-6" />
                        </motion.button>

                        <div className="flex-1 flex justify-end">
                            {isLast ? (
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={handleSubmit}
                                    disabled={submitting}
                                    className="px-10 py-5 rounded-[2rem] bg-accent text-white font-bold text-lg shadow-[0_15px_35px_rgba(var(--accent-rgb),0.5)] transition-all flex items-center gap-3"
                                >
                                    {submitting ? "Submitting..." : "Submit Test"}
                                    {!submitting && <Sparkles className="w-5 h-5" />}
                                </motion.button>
                            ) : (
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => setCurrentQuestionIndex(prev => Math.min(test.questions.length - 1, prev + 1))}
                                    className="px-10 py-5 rounded-[2rem] bg-white text-black font-bold text-lg shadow-2xl shadow-white/10 transition-all flex items-center gap-3"
                                >
                                    Next
                                    <ChevronRight className="w-6 h-6" />
                                </motion.button>
                            )}
                        </div>
                    </div>
                    {/* Safe area spacer for mobile nav */}
                    <div className="h-16 md:hidden" />
                </div>
            </div>
        </div>
    );
}
