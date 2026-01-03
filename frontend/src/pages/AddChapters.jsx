import { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import clsx from 'clsx';
import { 
    Upload, 
    Sparkles, 
    Check, 
    ChevronDown, 
    X, 
    BookOpen, 
    FileText, 
    Trash2, 
    Plus,
    ArrowLeft,
    Loader2,
    Layers,
    AlignLeft,
    Image as ImageIcon,
    CheckCircle2
} from 'lucide-react';

export default function AddChapters() {
    const navigate = useNavigate();
    const [subjects, setSubjects] = useState([]);
    const [selectedSubject, setSelectedSubject] = useState(null);
    const [selectedUnit, setSelectedUnit] = useState(null);
    const [image, setImage] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [loading, setLoading] = useState(false);
    const [generatedData, setGeneratedData] = useState(null);
    const [saving, setSaving] = useState(false);
    const [dragActive, setDragActive] = useState(false);

    // Modal states
    const [showAddSubject, setShowAddSubject] = useState(false);
    const [showAddUnit, setShowAddUnit] = useState(false);
    const [newSubject, setNewSubject] = useState({ name: '', code: '', branch: 'ALL', year: 1 });
    const [newUnit, setNewUnit] = useState({ title: '', unitNumber: 1 });
    const [creatingSubject, setCreatingSubject] = useState(false);
    const [creatingUnit, setCreatingUnit] = useState(false);
    const [showInsufficientInfoModal, setShowInsufficientInfoModal] = useState(false);
    const [insufficientInfoMessage, setInsufficientInfoMessage] = useState('');

    // Input mode state - DEFAULT TO TEXT as requested
    const [inputMode, setInputMode] = useState('text'); 
    const [syllabusText, setSyllabusText] = useState('');
    const [showDraftBtn, setShowDraftBtn] = useState(false);
    const reviewRef = useRef(null);

    // Fetch subjects
    const fetchSubjects = async () => {
        try {
            const { data } = await axios.get('/chapters/subjects');
            setSubjects(data.subjects || []);
        } catch (error) {
            toast.error('Failed to load subjects');
        }
    };

    useEffect(() => {
        fetchSubjects();
        
        // Check for existing draft
        const savedDraft = localStorage.getItem('crix_syllabus_draft');
        if (savedDraft) {
            setShowDraftBtn(true);
        }
    }, []);

    // Handle drag events
    const handleDrag = useCallback((e) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === 'dragenter' || e.type === 'dragover') {
            setDragActive(true);
        } else if (e.type === 'dragleave') {
            setDragActive(false);
        }
    }, []);

    // Handle drop
    const handleDrop = useCallback((e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            handleFileChange(e.dataTransfer.files[0]);
        }
    }, []);

    // Handle file selection
    const handleFileChange = (file) => {
        if (!file) return;
        
        const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
        if (!validTypes.includes(file.type)) {
            toast.error('Please upload a valid image (JPEG, PNG, WebP, GIF)');
            return;
        }
        
        if (file.size > 10 * 1024 * 1024) {
            toast.error('Image size must be under 10MB');
            return;
        }
        
        setImage(file);
        setImagePreview(URL.createObjectURL(file));
        setGeneratedData(null);
    };

    // Create new subject
    const handleCreateSubject = async () => {
        if (!newSubject.name) {
            toast.error('Subject name is required');
            return;
        }
        
        setCreatingSubject(true);
        try {
            const { data } = await axios.post('/chapters/subject', newSubject);
            if (data.success) {
                toast.success('✨ Subject created!');
                await fetchSubjects();
                setSelectedSubject(data.subject);
                setSelectedUnit(null);
                setShowAddSubject(false);
                setNewSubject({ name: '', code: '', branch: 'ALL', year: 1 });
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to create subject');
        } finally {
            setCreatingSubject(false);
        }
    };

    // Add new unit
    const handleAddUnit = async () => {
        if (!newUnit.title || !selectedSubject) {
            toast.error('Unit title is required');
            return;
        }
        
        setCreatingUnit(true);
        try {
            const { data } = await axios.post('/chapters/unit', {
                subjectId: selectedSubject._id,
                unitNumber: newUnit.unitNumber,
                title: newUnit.title
            });
            if (data.success) {
                toast.success('✨ Unit added!');
                await fetchSubjects();
                // Re-select the subject to get updated units
                const updated = subjects.find(s => s._id === selectedSubject._id);
                if (updated) {
                    setSelectedSubject({ ...updated, units: [...(updated.units || []), data.unit] });
                }
                setSelectedUnit(data.unit);
                setShowAddUnit(false);
                setNewUnit({ title: '', unitNumber: (selectedSubject?.units?.length || 0) + 1 });
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to add unit');
        } finally {
            setCreatingUnit(false);
        }
    };

    // Generate chapters from image OR text
    const handleGenerate = async () => {
        if (!selectedSubject || !selectedUnit) {
            toast.error('Please select subject and unit');
            return;
        }

        if (inputMode === 'image' && !image) {
            toast.error('Please upload an image');
            return;
        }

        if (inputMode === 'text' && !syllabusText.trim()) {
            toast.error('Please paste syllabus text');
            return;
        }
        
        setLoading(true);
        const formData = new FormData();
        formData.append('subjectId', selectedSubject._id);
        formData.append('unitNumber', selectedUnit.unitNumber);

        if (inputMode === 'image') {
             formData.append('image', image);
        } else {
             formData.append('syllabusText', syllabusText);
        }
        
        try {
            const { data } = await axios.post('/chapters/generate', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            
            if (data.success) {
                setGeneratedData(data.data);
                localStorage.setItem('crix_syllabus_draft', JSON.stringify({
                    data: data.data,
                    subject: selectedSubject,
                    unit: selectedUnit
                }));
                setShowDraftBtn(false);
                toast.success('✨ Chapters generated! Review below');
                
                // Auto scroll to review section
                setTimeout(() => {
                    reviewRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }, 100);
            } else if (data.isInsufficient) {
                setInsufficientInfoMessage(data.message);
                setShowInsufficientInfoModal(true);
            } else {
                toast.error(data.message || 'Generation failed');
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to generate chapters');
        } finally {
            setLoading(false);
        }
    };

    // Edit functions
    const updateChapterTitle = (chapterIndex, newTitle) => {
        setGeneratedData(prev => ({
            ...prev,
            chapters: prev.chapters.map((ch, i) => 
                i === chapterIndex ? { ...ch, title: newTitle } : ch
            )
        }));
    };

    const updateTopicTitle = (chapterIndex, topicIndex, newTitle) => {
        setGeneratedData(prev => ({
            ...prev,
            chapters: prev.chapters.map((ch, ci) => 
                ci === chapterIndex 
                    ? { 
                        ...ch, 
                        topics: ch.topics.map((t, ti) => 
                            ti === topicIndex ? { ...t, title: newTitle } : t
                        ) 
                    } 
                    : ch
            )
        }));
    };

    const deleteChapter = (chapterIndex) => {
        setGeneratedData(prev => ({
            ...prev,
            chapters: prev.chapters.filter((_, i) => i !== chapterIndex)
        }));
    };

    const deleteTopic = (chapterIndex, topicIndex) => {
        setGeneratedData(prev => ({
            ...prev,
            chapters: prev.chapters.map((ch, ci) => 
                ci === chapterIndex 
                    ? { ...ch, topics: ch.topics.filter((_, ti) => ti !== topicIndex) } 
                    : ch
            )
        }));
    };

    const handleConfirm = async () => {
        if (!generatedData || generatedData.chapters.length === 0) {
            toast.error('No chapters to save');
            return;
        }
        
        setSaving(true);
        try {
            const { data } = await axios.post('/chapters/confirm', {
                subjectId: generatedData.subjectId,
                unitNumber: generatedData.unitNumber,
                chapters: generatedData.chapters
            });
            
            if (data.success) {
                if (data.isPending) {
                    toast.success(data.message || 'Submitted for review! 📝');
                    localStorage.removeItem('crix_syllabus_draft');
                    navigate('/dashboard');
                } else {
                    toast.success(`🎉 ${data.data.addedChapters} chapter(s) saved!`);
                    localStorage.removeItem('crix_syllabus_draft');
                    navigate(`/syllabus/${selectedSubject._id}`);
                }
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to save chapters');
        } finally {
            setSaving(false);
        }
    };

    const handleRestoreDraft = () => {
        try {
            const savedDraft = localStorage.getItem('crix_syllabus_draft');
            if (savedDraft) {
                const { data, subject, unit } = JSON.parse(savedDraft);
                setGeneratedData(data);
                setSelectedSubject(subject);
                setSelectedUnit(unit);
                toast.success('✨ Draft restored successfully!');
                
                // Scroll to review
                setTimeout(() => {
                    reviewRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }, 100);
            }
        } catch (error) {
            console.error('Failed to restore draft:', error);
            toast.error('Failed to restore draft');
            localStorage.removeItem('crix_syllabus_draft');
            setShowDraftBtn(false);
        }
    };

    const handleReset = () => {
        setGeneratedData(null);
        setImage(null);
        setImagePreview(null);
        setSyllabusText('');
        localStorage.removeItem('crix_syllabus_draft');
        setShowDraftBtn(false);
    };

    return (
        <div className="min-h-screen bg-main pb-32 md:pb-10">
            {/* Minimal Header */}
            <header className="px-6 py-6 md:py-8 max-w-5xl mx-auto flex items-center justify-between">
                <div>
                     {/* <button onClick={() => navigate(-1)} className="group flex items-center gap-2 text-secondary hover:text-primary transition-colors mb-2">
                        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                        <span className="text-sm font-medium">Back</span>
                    </button> */}
                    <h1 className="text-3xl md:text-4xl font-bold text-primary tracking-tight">Add syllabus</h1>
                </div>
                {showDraftBtn && (
                    <button 
                        onClick={handleRestoreDraft}
                        className="flex items-center gap-2 px-4 py-2.5 bg-accent/10 hover:bg-accent/20 text-accent rounded-2xl text-sm font-bold transition-all"
                    >
                        <Sparkles className="w-4 h-4" />
                        Drafts
                    </button>
                )}
            </header>

            <main className="max-w-5xl mx-auto px-6 space-y-12">
                
                {/* Step 1: Context Redesign */}
                <div className="space-y-6">
                     {/* <div className="flex items-center justify-between px-1">
                        <h2 className="text-xl font-bold text-primary tracking-tight italic flex items-center gap-2">
                           <Layers className="w-5 h-5 text-accent" />
                           Selection Context
                        </h2>
                        {selectedSubject && (
                           <div className="text-[10px] font-black text-secondary uppercase tracking-[0.2em] bg-white/5 px-3 py-1 rounded-full border border-white/5">
                              Step 01
                           </div>
                        )}
                     </div> */}

                     <div className="space-y-8">
                        {/* Subject Selection Track */}
                        <div className="space-y-3">
                           <label className="text-[10px] font-black text-accent uppercase tracking-[0.3em] ml-2 opacity-70">Syllabus Subjects</label>
                           <div className="flex items-center gap-4 overflow-x-auto pb-4 scrollbar-hidden">
                              {/* Create New Card */}
                              <motion.button
                                 whileTap={{ scale: 0.98 }}
                                 onClick={() => setShowAddSubject(true)}
                                 className="flex-shrink-0 w-40 h-44 rounded-[2.5rem] bg-accent/5 border border-dashed border-accent/30 flex flex-col items-center justify-center gap-3 hover:bg-accent/10 hover:border-accent transition-all group"
                              >
                                 <div className="w-12 h-12 rounded-2xl bg-accent/20 flex items-center justify-center text-accent transition-transform">
                                    <Plus className="w-6 h-6" />
                                 </div>
                                 <span className="text-xs font-black text-accent uppercase tracking-widest">New Subject</span>
                              </motion.button>

                              {subjects.map(subj => {
                                 const isSelected = selectedSubject?._id === subj._id;
                                 return (
                                    <motion.button
                                       key={subj._id}
                                       whileTap={{ scale: 0.98 }}
                                       onClick={() => {
                                          setSelectedSubject(subj);
                                          setSelectedUnit(null);
                                       }}
                                       className={clsx(
                                          "flex-shrink-0 w-40 h-44 rounded-[2.5rem] p-5 flex flex-col justify-between text-left transition-all relative overflow-hidden",
                                          isSelected 
                                             ? "bg-accent border-2 border-accent shadow-xl shadow-accent/20" 
                                             : "bg-card/40 backdrop-blur-xl border border-white/5 hover:border-white/10"
                                       )}
                                    >
                                       {isSelected && (
                                          <div className="absolute -top-4 -right-4 w-12 h-12 bg-white/20 blur-xl rounded-full" />
                                       )}
                                       <div className={clsx(
                                          "w-10 h-10 rounded-2xl flex items-center justify-center",
                                          isSelected ? "bg-white/20 text-white" : "bg-white/5 text-secondary"
                                       )}>
                                          <BookOpen className="w-5 h-5" />
                                       </div>
                                       <div>
                                          <p className={clsx("text-[10px] font-black uppercase tracking-widest mb-1 opacity-70", isSelected ? "text-white" : "text-secondary")}>
                                             {subj.code}
                                          </p>
                                          <h4 className={clsx("text-sm font-bold leading-tight line-clamp-2", isSelected ? "text-white" : "text-primary")}>
                                             {subj.name}
                                          </h4>
                                       </div>
                                    </motion.button>
                                 );
                              })}
                           </div>
                        </div>

                        {/* Unit Selection Track */}
                        <AnimatePresence>
                           {selectedSubject && (
                              <motion.div 
                                 initial={{ opacity: 0, y: 10 }}
                                 animate={{ opacity: 1, y: 0 }}
                                 className="space-y-3"
                              >
                                 <label className="text-[10px] font-black text-accent uppercase tracking-[0.3em] ml-2 opacity-70">Module selection</label>
                                 <div className="flex flex-wrap items-center gap-3">
                                    {selectedSubject?.units?.map(unit => {
                                       const isSelected = selectedUnit?.unitNumber === unit.unitNumber;
                                       return (
                                          <button
                                             key={unit.unitNumber}
                                             onClick={() => setSelectedUnit(unit)}
                                             className={clsx(
                                                "px-6 py-3 rounded-2xl text-xs font-black uppercase tracking-widest transition-all",
                                                isSelected 
                                                   ? "bg-primary text-main shadow-lg" 
                                                   : "bg-card/40 backdrop-blur-md border border-white/5 text-secondary hover:text-primary hover:border-white/10"
                                             )}
                                          >
                                             Unit {unit.unitNumber}
                                          </button>
                                       );
                                    })}
                                    <button 
                                       onClick={() => {
                                          setNewUnit({ title: '', unitNumber: (selectedSubject?.units?.length || 0) + 1 });
                                          setShowAddUnit(true);
                                       }}
                                       className="w-10 h-10 rounded-2xl bg-accent/10 border border-accent/20 text-accent flex items-center justify-center hover:bg-accent/20 transition-all font-bold"
                                    >
                                       <Plus className="w-5 h-5" />
                                    </button>
                                 </div>
                                 {selectedUnit && (
                                    <p className="text-[10px] text-secondary font-bold px-2 italic opacity-60">
                                       Selected: <span className="text-primary">{selectedUnit.title}</span>
                                    </p>
                                 )}
                              </motion.div>
                           )}
                        </AnimatePresence>
                     </div>
                </div>

                {/* Step 2: Content Input Redesign */}
                <div className="space-y-6">
                     <div className="flex items-center justify-center px-1">
 
                        <div className="flex bg-white/5 p-1 rounded-2xl border border-white/5 backdrop-blur-md">
                            <button
                                onClick={() => setInputMode('text')}
                                className={clsx(
                                    "flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all",
                                    inputMode === 'text' ? 'bg-primary text-main shadow-lg' : 'text-secondary hover:text-primary'
                                )}
                            >
                                <AlignLeft className="w-4 h-4" />
                                Text
                            </button>
                            <button
                                onClick={() => setInputMode('image')}
                                className={clsx(
                                    "flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all",
                                    inputMode === 'image' ? 'bg-primary text-main shadow-lg' : 'text-secondary hover:text-primary'
                                )}
                            >
                                <ImageIcon className="w-4 h-4" />
                                Image
                            </button>
                        </div>
                     </div>

                     <div className="bg-card/40 backdrop-blur-2xl border border-white/5 rounded-[3rem] p-2 shadow-2xl relative overflow-hidden group/container">
                        {/* Subtle inner glow */}
                        <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-accent/10 blur-[100px] rounded-full pointer-events-none group-hover/container:bg-accent/20 transition-all duration-700" />

                        {inputMode === 'text' ? (
                            <div className="relative">
                                <textarea
                                    value={syllabusText}
                                    onChange={(e) => setSyllabusText(e.target.value)}
                                    placeholder="Paste your syllabus chapters/topics here..."
                                    className="w-full h-80 bg-white/5 rounded-[2.5rem] p-8 text-primary font-medium text-base leading-relaxed focus:outline-none focus:bg-white/[0.08] transition-all resize-none placeholder:text-secondary/30"
                                />
                                {syllabusText && (
                                    <button 
                                        onClick={() => setSyllabusText('')}
                                        className="absolute top-6 right-6 p-3 bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white rounded-2xl transition-all shadow-lg backdrop-blur-md border border-red-500/20"
                                    >
                                        <Trash2 className="w-5 h-5" />
                                    </button>
                                )}
                            </div>
                        ) : (
                             <div className="bg-white/5 rounded-[2.5rem] p-10 min-h-[20rem] flex flex-col items-center justify-center border-2 border-dashed border-white/10 hover:border-accent/40 hover:bg-white/[0.08] transition-all text-center relative group/upload"
                                onDragEnter={handleDrag} onDragLeave={handleDrag} onDragOver={handleDrag} onDrop={handleDrop}
                             >
                                <input type="file" accept="image/*" onChange={(e) => handleFileChange(e.target.files?.[0])} className="absolute inset-0 opacity-0 cursor-pointer z-10" />
                                {imagePreview ? (
                                    <div className="relative w-full h-full max-h-80 z-20">
                                        <img src={imagePreview} alt="Preview" className="w-full h-full object-contain rounded-2xl shadow-2xl" />
                                        <button onClick={(e) => { e.stopPropagation(); setImage(null); setImagePreview(null); }} className="absolute -top-2 -right-2 p-3 bg-red-500 text-white rounded-2xl shadow-xl hover:scale-110 transition-transform"><X className="w-5 h-5" /></button>
                                    </div>
                                ) : (
                                    <div className="space-y-6 pointer-events-none">
                                        <div className="w-20 h-20 rounded-[2rem] bg-accent/10 border border-accent/20 flex items-center justify-center mx-auto shadow-inner group-hover/upload:bg-accent/20 transition-all duration-500">
                                            <Upload className="w-10 h-10 text-accent" />
                                        </div>
                                        <div>
                                            <p className="text-primary font-black text-lg tracking-tight">Drop Syllabus Image</p>
                                            <p className="text-secondary text-sm font-medium opacity-60">PNG, JPG, WebP up to 10MB</p>
                                        </div>
                                    </div>
                                )}
                             </div>
                        )}
                     </div>

                     <div className="pt-4">
                        <motion.button
                            whileTap={{ scale: 0.99 }}
                            onClick={handleGenerate}
                            disabled={loading || !selectedSubject || !selectedUnit}
                            className="w-full py-5 bg-accent text-white text-lg font-black rounded-3xl shadow-2xl shadow-accent/20 flex items-center justify-center gap-3 disabled:opacity-30 disabled:grayscale transition-all"
                        >
                            {loading ? <Loader2 className="w-7 h-7 animate-spin" /> : <Sparkles className="w-7 h-7" />}
                            {loading ? 'Analyzing Content...' : 'Generate AI Syllabus'}
                        </motion.button>
                     </div>
                </div>

                {/* Step 3: Review Redesign */}
                {generatedData && (
                     <div ref={reviewRef} className="space-y-8 animate-in fade-in slide-in-from-bottom-12 duration-700 py-10">
                        <div className="flex items-center justify-between px-1">
                             <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-2xl bg-green-500/20 text-green-500 flex items-center justify-center">
                                    <Check className="w-5 h-5" />
                                </div>
                                <h2 className="text-xl font-bold text-primary italic">Final Review</h2>
                             </div>
                             <span className="bg-accent/10 text-accent px-4 py-1.5 rounded-2xl text-[10px] font-black uppercase tracking-widest">
                                {generatedData.chapters.length} Chapters Found
                             </span>
                        </div>
                        
                        <div className="grid gap-6">
                            {generatedData.chapters.map((chapter, i) => (
                                <motion.div 
                                    key={i} 
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: i * 0.1 }}
                                    className="bg-card/40 backdrop-blur-xl rounded-[2.5rem] p-8 border border-white/5 space-y-6 shadow-xl hover:border-white/10 transition-all group/chapter"
                                >
                                    <div className="flex items-start gap-3 md:gap-5">
                                        <div className="w-10 h-10 md:w-12 md:h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0 text-accent font-black text-xs md:text-sm group-hover/chapter:bg-accent group-hover/chapter:text-white transition-all duration-500">
                                            {(i + 1).toString().padStart(2, '0')}
                                        </div>
                                        <div className="flex-1 min-w-0 space-y-4">
                                            <input 
                                                value={chapter.title} 
                                                onChange={(e) => updateChapterTitle(i, e.target.value)}
                                                className="w-full bg-transparent text-primary font-black text-lg md:text-2xl focus:outline-none border-b border-white/5 focus:border-accent/40 transition-all py-1 truncate"
                                            />
                                            <div className="grid sm:grid-cols-2 gap-3 pl-2">
                                                {chapter.topics.map((topic, ti) => (
                                                    <div key={ti} className="flex items-center gap-3 p-3 rounded-2xl bg-white/5 border border-transparent hover:border-white/10 hover:bg-white/10 transition-all group/topic">
                                                        <div className="w-2 h-2 rounded-full bg-accent/40 transition-transform"></div>
                                                        <input 
                                                            value={topic.title}
                                                            onChange={(e) => updateTopicTitle(i, ti, e.target.value)}
                                                            className="flex-1 min-w-0 bg-transparent text-secondary text-[11px] md:text-sm font-medium focus:outline-none focus:text-primary transition-colors truncate"
                                                        />
                                                        <button onClick={() => deleteTopic(i, ti)} className="opacity-0 group-hover/topic:opacity-100 text-red-500 transition-opacity p-1"><X className="w-3 h-3" /></button>
                                                    </div>
                                                ))}
                                                <button className="flex items-center gap-2 p-3 rounded-2xl border border-dashed border-white/10 text-secondary hover:text-accent hover:border-accent/40 hover:bg-accent/5 transition-all text-xs font-bold">
                                                    <Plus className="w-3 h-3" /> Add Topic
                                                </button>
                                            </div>
                                        </div>
                                        <button onClick={() => deleteChapter(i)} className="p-2 md:p-3 bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white rounded-2xl transition-all border border-red-500/20 shrink-0">
                                            <Trash2 className="w-4 h-4 md:w-5 md:h-5" />
                                        </button>
                                    </div>
                                </motion.div>
                            ))}
                        </div>

                        <div className="flex flex-col sm:flex-row gap-4 pt-6">
                            <button onClick={handleReset} className="flex-1 py-5 bg-white/5 border border-white/10 text-secondary font-black uppercase tracking-widest rounded-3xl hover:bg-white/10 transition-all">Discard Draft</button>
                            <motion.button 
                                whileTap={{ scale: 0.98 }}
                                onClick={handleConfirm}
                                disabled={saving}
                                className="flex-[2] py-5 bg-green-500 text-white font-black uppercase tracking-widest rounded-3xl hover:bg-green-600 shadow-2xl shadow-green-500/20 transition-all flex items-center justify-center gap-3"
                            >
                                {saving ? <Loader2 className="w-6 h-6 animate-spin" /> : <CheckCircle2 className="w-6 h-6" />}
                                Confirm & Add to Library
                            </motion.button>
                        </div>
                     </div>
                )}
            </main>

            {/* Modals remain mostly functional, styled inline if needed or can be separated. Keeping simpler for this prompt limit */}
            {/* Premium Modals */}
            <AnimatePresence>
                {showAddSubject && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 overflow-y-auto">
                        <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setShowAddSubject(false)}
                            className="absolute inset-0 bg-black/60 backdrop-blur-md"
                        />
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            className="relative bg-card/90 backdrop-blur-3xl w-full max-w-md p-8 rounded-[3.5rem] border border-white/10 shadow-2xl space-y-8"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="flex justify-between items-center px-2">
                                <h3 className="text-2xl font-black text-primary italic tracking-tight">New Subject</h3>
                                <button onClick={() => setShowAddSubject(false)} className="p-2 hover:bg-white/5 rounded-xl transition-colors"><X className="w-5 h-5 text-secondary" /></button>
                            </div>
                            <div className="space-y-5">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-secondary uppercase tracking-widest ml-4 opacity-70">Subject Name</label>
                                    <input 
                                        value={newSubject.name} 
                                        onChange={e => setNewSubject(p => ({...p, name: e.target.value}))} 
                                        placeholder="Engineering Physics" 
                                        className="w-full h-14 bg-white/5 rounded-[1.5rem] px-6 text-primary font-bold focus:outline-none border border-white/5 focus:border-accent/40 focus:bg-white/10 transition-all placeholder:text-secondary/30" 
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-5">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-secondary uppercase tracking-widest ml-4 opacity-70">Syllabus Code</label>
                                        <input 
                                            value={newSubject.code} 
                                            onChange={e => setNewSubject(p => ({...p, code: e.target.value}))} 
                                            placeholder="PH101" 
                                            className="w-full h-14 bg-white/5 rounded-[1.5rem] px-6 text-primary font-bold focus:outline-none border border-white/5 focus:border-accent/40 focus:bg-white/10 transition-all placeholder:text-secondary/30" 
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-secondary uppercase tracking-widest ml-4 opacity-70">Academic Year</label>
                                        <div className="relative">
                                            <select 
                                                value={newSubject.year} 
                                                onChange={e => setNewSubject(p => ({...p, year: parseInt(e.target.value)}))} 
                                                className="w-full h-14 bg-white/5 rounded-[1.5rem] px-6 text-primary font-bold focus:outline-none border border-white/5 focus:border-accent/40 focus:bg-white/10 transition-all appearance-none"
                                            >
                                                {[1,2,3,4].map(y => <option key={y} value={y} className="bg-card text-primary font-bold">Year {y}</option>)}
                                            </select>
                                            <ChevronDown className="absolute right-5 top-1/2 -translate-y-1/2 w-4 h-4 text-secondary pointer-events-none" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <motion.button 
                                whileTap={{ scale: 0.98 }}
                                onClick={handleCreateSubject} 
                                disabled={creatingSubject}
                                className="w-full py-5 bg-accent text-white font-black uppercase tracking-[0.2em] rounded-[2rem] shadow-xl shadow-accent/20 flex items-center justify-center gap-3 disabled:opacity-50"
                            >
                                {creatingSubject ? <Loader2 className="w-5 h-5 animate-spin" /> : <Plus className="w-5 h-5" />}
                                Initialize Subject
                            </motion.button>
                        </motion.div>
                    </div>
                )}

                {showAddUnit && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 overflow-y-auto">
                        <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setShowAddUnit(false)}
                            className="absolute inset-0 bg-black/60 backdrop-blur-md"
                        />
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            className="relative bg-card/90 backdrop-blur-3xl w-full max-w-md p-8 rounded-[3.5rem] border border-white/10 shadow-2xl space-y-8"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="flex justify-between items-center px-2">
                                <h3 className="text-2xl font-black text-primary italic tracking-tight">Add Unit</h3>
                                <button onClick={() => setShowAddUnit(false)} className="p-2 hover:bg-white/5 rounded-xl transition-colors"><X className="w-5 h-5 text-secondary" /></button>
                            </div>
                            <div className="space-y-5">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-secondary uppercase tracking-widest ml-4 opacity-70">Unit Number</label>
                                    <input 
                                        type="number" 
                                        value={newUnit.unitNumber} 
                                        onChange={e => setNewUnit(p => ({...p, unitNumber: parseInt(e.target.value)}))} 
                                        placeholder="1" 
                                        className="w-full h-14 bg-white/5 rounded-[1.5rem] px-6 text-primary font-bold focus:outline-none border border-white/5 focus:border-accent/40 focus:bg-white/10 transition-all placeholder:text-secondary/30" 
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-secondary uppercase tracking-widest ml-4 opacity-70">Unit Title</label>
                                    <input 
                                        value={newUnit.title} 
                                        onChange={e => setNewUnit(p => ({...p, title: e.target.value}))} 
                                        placeholder="Wave Mechanics & Optics" 
                                        className="w-full h-14 bg-white/5 rounded-[1.5rem] px-6 text-primary font-bold focus:outline-none border border-white/5 focus:border-accent/40 focus:bg-white/10 transition-all placeholder:text-secondary/30" 
                                    />
                                </div>
                            </div>
                            <motion.button 
                                whileTap={{ scale: 0.98 }}
                                onClick={handleAddUnit} 
                                disabled={creatingUnit}
                                className="w-full py-5 bg-accent text-white font-black uppercase tracking-[0.2em] rounded-[2rem] shadow-xl shadow-accent/20 flex items-center justify-center gap-3 disabled:opacity-50"
                            >
                                {creatingUnit ? <Loader2 className="w-5 h-5 animate-spin" /> : <Plus className="w-5 h-5" />}
                                Add Module
                            </motion.button>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Insufficient Info Modal */}
            <AnimatePresence>
                {showInsufficientInfoModal && (
                    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
                        <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setShowInsufficientInfoModal(false)}
                            className="absolute inset-0 bg-black/80 backdrop-blur-xl"
                        />
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            className="relative bg-card/90 backdrop-blur-3xl w-full max-w-lg p-10 rounded-[3.5rem] border border-white/10 shadow-2xl space-y-8 overflow-hidden text-center"
                            onClick={(e) => e.stopPropagation()}
                        >
                            {/* Decorative Background Elements */}
                            <div className="absolute -top-24 -right-24 w-48 h-48 bg-accent/20 blur-[80px] rounded-full pointer-events-none" />
                            <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-red-500/10 blur-[80px] rounded-full pointer-events-none" />

                            <div className="relative space-y-6">
                                <div className="w-24 h-24 rounded-[2.5rem] bg-accent/10 border border-accent/20 flex items-center justify-center mx-auto shadow-inner group-hover:scale-110 transition-transform duration-500">
                                    <Sparkles className="w-12 h-12 text-accent" />
                                </div>
                                <div className="space-y-3">
                                    <h3 className="text-3xl font-black text-primary italic tracking-tight">Need More Depth</h3>
                                    <p className="text-secondary font-medium leading-relaxed px-4">
                                        {insufficientInfoMessage || "Bhai, the information provided seems a bit limited to generate a high-quality syllabus roadmap."}
                                    </p>
                                </div>
                            </div>

                            <div className="relative space-y-4 pt-4">
                                <div className="p-6 rounded-3xl bg-white/5 border border-white/5 text-left space-y-3">
                                    <p className="text-[10px] font-black text-accent uppercase tracking-widest">💡 Quick Tips</p>
                                    <ul className="space-y-2 text-xs text-secondary font-medium list-disc pl-4 opacity-70">
                                        <li>Try uploading a clearer image of your curriculum.</li>
                                        <li>Paste the complete text covering all modules/topics.</li>
                                        <li>Ensure the text includes chapter names explicitly.</li>
                                    </ul>
                                </div>

                                <div className="flex flex-col gap-3">
                                    <motion.button 
                                        whileTap={{ scale: 0.98 }}
                                        onClick={() => setShowInsufficientInfoModal(false)} 
                                        className="w-full py-5 bg-accent text-white font-black uppercase tracking-[0.2em] rounded-[2rem] shadow-xl shadow-accent/20 flex items-center justify-center gap-3"
                                    >
                                        Provide More Detail
                                    </motion.button>
                                    <button 
                                        onClick={() => setShowInsufficientInfoModal(false)}
                                        className="w-full py-4 text-xs font-black text-secondary uppercase tracking-widest hover:text-primary transition-colors"
                                    >
                                        I'll Try Later
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
