import { useEffect, useRef, useState, useContext, useMemo } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { Clock, ChevronRight, ArrowLeft, BookOpen, Play, ClipboardCheck, Sparkles, Plus, Loader2 } from 'lucide-react';
import SyllabusContext from '../context/Syllabus/SyllabusContext';
import UserContext from '../context/User/UserContext';
import SubjectContext from '../context/Subject/SubjectContext';
import { FastPageSpinner } from '../components/Spinner';

export default function SubjectView() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { userProfile, loading: loadingProfile } = useContext(UserContext);
    const { userSubjects, addUserSubject } = useContext(SubjectContext);
    const { activeUnitData, activeSubjectData, loadingUnit, loadingSubject, fetchUnitContent, fetchSubjectData, clearActiveUnit } = useContext(SyllabusContext);

    const [activeUnitIndex, setActiveUnitIndex] = useState(0);
    const [addingSubject, setAddingSubject] = useState(false); // State for loading when adding subject

    const subject = activeSubjectData;

    // Fetch subject data using centralized context
    useEffect(() => {
        if (!activeSubjectData || activeSubjectData._id !== id) {
            fetchSubjectData(id);
        }
    }, [id, activeSubjectData, fetchSubjectData]);

    // Local isAdded helper
    const isAdded = userProfile?.subjects?.includes(id);

    // Robust data fetching: Ensure we always have data for the active unit
    useEffect(() => {
        if (!subject?.units?.length) return;

        const targetUnit = subject.units[activeUnitIndex];
        const targetUnitId = targetUnit._id;

        // If no data loaded OR loaded data is for different unit, fetch it!
        // We also check !loadingUnit to prevent spamming if it's already in flight (though context dedups too)
        if (targetUnitId && (!activeUnitData || activeUnitData._id !== targetUnitId)) {
            if (!loadingUnit) {
                console.log(`[SubjectView] Auto-fetching unit: ${targetUnitId} (Current: ${activeUnitData?._id})`);
                fetchUnitContent(id, targetUnitId);
            }
        }
    }, [activeUnitIndex, subject, activeUnitData, loadingUnit, id, fetchUnitContent]);

    const handleUnitChange = (index) => {
        if (activeUnitIndex === index) return;
        setActiveUnitIndex(index);
        // No manual fetch needed - useEffect will handle it safely
    };

    const handleAddSubject = async () => {
        setAddingSubject(true);
        await addUserSubject(id);
        navigate('/syllabus');
        setAddingSubject(false);
    };

    if ((loadingProfile || loadingSubject) && !subject) {
        return <FastPageSpinner />;
    }

    if (!subject) return (
        <div className="min-h-screen bg-main flex items-center justify-center p-10">
            <div className="text-center space-y-4">
                <div className="w-16 h-16 bg-surface rounded-full flex items-center justify-center mx-auto shadow-inner">
                    <BookOpen className="w-8 h-8 text-secondary/30" />
                </div>
                <p className="text-secondary font-medium">Bhai, subject nahi mila!</p>
                <button
                    onClick={() => navigate('/syllabus')}
                    className="text-accent font-bold hover:underline"
                >
                    Go to Library
                </button>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-main pb-10">
            {/* Sticky Header */}
            <header className="bg-card/90 backdrop-blur-md border-b border-border-soft sticky top-0 z-50">
                <div className="mx-auto px-6 py-4 flex items-center justify-center relative min-h-[72px]">
                    <button
                        onClick={() => navigate('/syllabus')}
                        className="absolute left-6 p-3 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 transition-all active:scale-95 group"
                    >
                        <ArrowLeft className="w-5 h-5 text-primary group-hover:-translate-x-1 transition-transform" />
                    </button>

                    <div className="text-center max-w-[60%]">
                        <p className="text-[10px] font-black text-accent mb-0.5 uppercase tracking-[0.2em] opacity-80">
                            {subject.code}
                        </p>
                        <h1 className="text-base md:text-xl font-bold text-primary truncate">
                            {subject.name}
                        </h1>
                    </div>

                    <button
                        onClick={() => navigate('/tests')}
                        className="absolute right-6 flex items-center gap-2 px-4 py-2.5 bg-white/5  hover:text-accent border border-white/10 rounded-xl hover:bg-accent/10 transition-all active:scale-95 group text-primary shadow-xl shadow-primary/5"
                    >
                        <span className="text-[10px] text-secondary/80 font-black uppercase tracking-widest hidden sm:inline  hover:bg-accent/10 hover:transition-colors hover:text-accent">Tests</span>
                        <ClipboardCheck className="w-4 h-4 transition-colors group-hover:text-accent" />
                    </button>
                </div>
            </header>

            <main className="max-w-3xl mx-auto px-6 py-8">
                {/* Add to Library Prompt */}
                <AnimatePresence>
                    {!isAdded && (
                        <motion.div
                            initial={{ opacity: 0, y: -16 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.97 }}
                            className="mb-10 rounded-[2.5rem] p-7 md:p-8 relative overflow-hidden
      bg-gradient-to-br from-white/10 via-white/5 to-transparent
      backdrop-blur-xl
      shadow-[0_25px_80px_rgba(0,0,0,0.35)]
      hover:shadow-[0_35px_120px_rgba(0,0,0,0.45)]
      transition-all duration-700"
                        >
                            <div className="absolute -top-10 -right-10 opacity-[0.08] rotate-12 pointer-events-none">
                                <Sparkles className="w-40 h-40 text-white" />
                            </div>

                            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
                                <div className="space-y-1.5">
                                    <h3 className="text-lg md:text-xl font-semibold text-primary tracking-tight">
                                        Syllabus not added
                                    </h3>
                                    <p className="text-sm text-secondary/60 leading-relaxed">
                                        Bhai, add this subject to start exploring and track progress.
                                    </p>
                                </div>

                                <button
                                    onClick={handleAddSubject}
                                    disabled={addingSubject}
                                    className="px-7 py-3 rounded-full text-sm font-semibold text-white
          bg-gradient-to-br from-accent to-accent/80
          shadow-[0_12px_35px_rgba(0,0,0,0.35)]
          hover:shadow-[0_18px_55px_rgba(0,0,0,0.45)]
          active:scale-95 transition-all flex items-center gap-2"
                                >
                                    {addingSubject ? (
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                    ) : (
                                        <Plus className="w-4 h-4" />
                                    )}
                                    Add to Library
                                </button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>


                <div className="my-6">
                    <div className="flex gap-2.5 mb-2 overflow-x-auto pb-4 no-scrollbar snap-x px-4 md:justify-center">
                        {subject?.units?.map((unit, index) => (
                            <button
                                key={unit._id}
                                onClick={() => handleUnitChange(index)}
                                className={`px-5 py-2.5 rounded-xl font-bold transition-all whitespace-nowrap flex-shrink-0 snap-center text-xs ${activeUnitIndex === index
                                    ? 'bg-accent text-white shadow-lg shadow-accent/30 scale-105'
                                    : 'bg-card border border-border-soft text-secondary hover:border-accent/40 hover:text-primary'
                                    }`}
                            >
                                Unit {unit.unitNumber}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="mb-12 text-center">
                    <h2 className="text-2xl md:text-3xl font-black text-primary mb-2 tracking-tight">
                        {subject?.units?.[activeUnitIndex]?.title || 'Loading...'}
                    </h2>
                    <div className="flex items-center justify-center gap-2 text-secondary/60">
                        <span className="w-8 h-[1px] bg-border-soft" />
                        <p className="text-xs font-bold uppercase tracking-widest">
                            {activeUnitData ? `${activeUnitData.chapters?.length || 0} chapter${activeUnitData.chapters?.length === 1 ? '' : 's'}` : 'Loading...'}
                        </p>
                        <span className="w-8 h-[1px] bg-border-soft" />
                    </div>
                </div>

                <div className="space-y-4">
                    {loadingUnit ? (
                        <div className="space-y-4">
                            {[1, 2, 3].map(i => (
                                <div key={i} className="h-28 bg-card rounded-[2rem] border border-border-soft animate-pulse" />
                            ))}
                        </div>
                    ) : activeUnitData?.chapters?.length > 0 ? (
                        activeUnitData.chapters.map((chapter) => (
                            <Link
                                to={isAdded ? `/chapter/${subject._id}/${activeUnitData._id}/${chapter._id}` : '#'}
                                onClick={(e) => !isAdded && (e.preventDefault(), handleAddSubject())}
                                key={chapter._id}
                                className={`group block bg-card rounded-[2rem] border border-border-soft hover:border-accent/40 hover:shadow-2xl hover:shadow-black/5 transition-all overflow-hidden ${!isAdded ? 'opacity-80' : ''}`}
                            >
                                <div className="p-6 flex items-center gap-6">
                                    <div className="w-14 h-14 rounded-2xl bg-accent flex items-center justify-center shrink-0 shadow-lg shadow-accent/20 group-hover:scale-110 transition-all duration-500">
                                        <BookOpen className="w-6 h-6 text-white" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h3 className="text-lg font-bold text-primary group-hover:text-accent transition-colors mb-1 truncate tracking-tight">
                                            {chapter.title}
                                        </h3>
                                        <p className="text-sm text-secondary truncate opacity-70">{chapter.description}</p>
                                    </div>
                                    <div className="w-12 h-12 rounded-full bg-surface border border-border-soft flex items-center justify-center shrink-0 group-hover:bg-accent group-hover:border-accent transition-all duration-300">
                                        <Play className="w-5 h-5 text-secondary group-hover:text-white transition-colors ml-0.5" />
                                    </div>
                                </div>
                            </Link>
                        ))
                    ) : (
                        <div className="py-20 text-center space-y-4">
                            <div className="w-20 h-20 bg-accent/5 rounded-full flex items-center justify-center mx-auto">
                                <Sparkles className="w-10 h-10 text-accent/20" />
                            </div>
                            <p className="text-secondary font-medium">No chapters generated for this unit yet.</p>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}
