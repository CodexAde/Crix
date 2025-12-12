import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
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
    Image as ImageIcon
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

    // Input mode state - DEFAULT TO TEXT as requested
    const [inputMode, setInputMode] = useState('text'); 
    const [syllabusText, setSyllabusText] = useState('');

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
                toast.success('✨ Chapters generated! Review below');
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
                toast.success(`🎉 ${data.data.addedChapters} chapter(s) saved!`);
                navigate(`/syllabus/${selectedSubject._id}`);
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to save chapters');
        } finally {
            setSaving(false);
        }
    };

    const handleReset = () => {
        setGeneratedData(null);
        setImage(null);
        setImagePreview(null);
        setSyllabusText('');
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
                    <h1 className="text-3xl md:text-4xl font-bold text-primary tracking-tight">Generator</h1>
                </div>
            </header>

            <main className="max-w-5xl mx-auto px-6 space-y-8">
                
                {/* Step 1: Context */}
                <div className="space-y-4">
                     <h2 className="text-lg font-semibold text-primary px-1">1. Select Context</h2>
                     <div className="bg-card border border-border-soft rounded-[2rem] p-6 md:p-8 shadow-sm">
                        <div className="grid md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-secondary uppercase tracking-wider pl-1">Subject</label>
                                <div className="relative">
                                    <select
                                        value={selectedSubject?._id || ''}
                                        onChange={(e) => {
                                            if (e.target.value === 'new') { setShowAddSubject(true); return; }
                                            const subj = subjects.find(s => s._id === e.target.value);
                                            setSelectedSubject(subj || null);
                                            setSelectedUnit(null);
                                        }}
                                        className="w-full h-14 bg-surface border border-border-soft rounded-2xl px-4 text-primary font-medium appearance-none focus:outline-none focus:border-accent transition-all cursor-pointer"
                                    >
                                        <option value="">Select a subject...</option>
                                        {subjects.map(subj => (
                                            <option key={subj._id} value={subj._id}>{subj.name} ({subj.code})</option>
                                        ))}
                                        <option value="new">+ Create New Subject</option>
                                    </select>
                                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-secondary pointer-events-none" />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-bold text-secondary uppercase tracking-wider pl-1">Unit</label>
                                <div className="relative">
                                    <select
                                        value={selectedUnit?.unitNumber || ''}
                                        onChange={(e) => {
                                            if (e.target.value === 'new') {
                                                setNewUnit({ title: '', unitNumber: (selectedSubject?.units?.length || 0) + 1 });
                                                setShowAddUnit(true);
                                                return;
                                            }
                                            const unit = selectedSubject?.units?.find(u => u.unitNumber === parseInt(e.target.value));
                                            setSelectedUnit(unit || null);
                                        }}
                                        disabled={!selectedSubject}
                                        className="w-full h-14 bg-surface border border-border-soft rounded-2xl px-4 text-primary font-medium appearance-none focus:outline-none focus:border-accent transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        <option value="">Select a unit...</option>
                                        {selectedSubject?.units?.map(unit => (
                                            <option key={unit.unitNumber} value={unit.unitNumber}>Unit {unit.unitNumber}: {unit.title}</option>
                                        ))}
                                        {selectedSubject && <option value="new">+ Add New Unit</option>}
                                    </select>
                                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-secondary pointer-events-none" />
                                </div>
                            </div>
                        </div>
                     </div>
                </div>

                {/* Step 2: Content Input */}
                <div className="space-y-4">
                     <div className="flex items-center justify-between px-1">
                        <h2 className="text-lg font-semibold text-primary">2. Provide Content</h2>
                        <div className="flex bg-card p-1 rounded-xl border border-border-soft">
                            <button
                                onClick={() => setInputMode('text')}
                                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all ${
                                    inputMode === 'text' ? 'bg-primary text-main shadow-md' : 'text-secondary hover:text-primary'
                                }`}
                            >
                                <AlignLeft className="w-4 h-4" />
                                Text
                            </button>
                            <button
                                onClick={() => setInputMode('image')}
                                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all ${
                                    inputMode === 'image' ? 'bg-primary text-main shadow-md' : 'text-secondary hover:text-primary'
                                }`}
                            >
                                <ImageIcon className="w-4 h-4" />
                                Image
                            </button>
                        </div>
                     </div>

                     <div className="bg-card border border-border-soft rounded-[2rem] p-1 overflow-hidden shadow-sm">
                        {inputMode === 'text' ? (
                            <div className="relative group">
                                <textarea
                                    value={syllabusText}
                                    onChange={(e) => setSyllabusText(e.target.value)}
                                    placeholder="Paste your syllabus chapters/topics here..."
                                    className="w-full h-80 bg-surface rounded-[1.8rem] p-6 text-primary font-mono text-sm leading-relaxed focus:outline-none resize-none placeholder:text-secondary/50"
                                />
                                {syllabusText && (
                                    <button 
                                        onClick={() => setSyllabusText('')}
                                        className="absolute top-4 right-4 p-2 bg-card hover:bg-border-soft rounded-xl text-secondary hover:text-red-500 transition-colors shadow-sm"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                )}
                            </div>
                        ) : (
                             <div className="bg-surface rounded-[1.8rem] p-6 min-h-[20rem] flex flex-col items-center justify-center border-2 border-dashed border-border-soft hover:border-accent/50 transition-all text-center relative"
                                onDragEnter={handleDrag} onDragLeave={handleDrag} onDragOver={handleDrag} onDrop={handleDrop}
                             >
                                <input type="file" accept="image/*" onChange={(e) => handleFileChange(e.target.files?.[0])} className="absolute inset-0 opacity-0 cursor-pointer" />
                                {imagePreview ? (
                                    <div className="relative w-full h-full max-h-80">
                                        <img src={imagePreview} alt="Preview" className="w-full h-full object-contain rounded-xl" />
                                        <button onClick={() => { setImage(null); setImagePreview(null); }} className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-xl shadow-lg hover:scale-105 transition-transform"><X className="w-4 h-4" /></button>
                                    </div>
                                ) : (
                                    <div className="space-y-4 pointer-events-none">
                                        <div className="w-16 h-16 rounded-3xl bg-card border border-border-soft flex items-center justify-center mx-auto shadow-sm">
                                            <Upload className="w-8 h-8 text-secondary" />
                                        </div>
                                        <div>
                                            <p className="text-primary font-bold">Click or Drop Image</p>
                                            <p className="text-secondary text-sm">PNG, JPG up to 10MB</p>
                                        </div>
                                    </div>
                                )}
                             </div>
                        )}
                     </div>

                     {/* Generate Action */}
                     <div className="pt-2">
                        <button
                            onClick={handleGenerate}
                            disabled={loading}
                            className={`w-full py-3.5 bg-primary text-main text-base font-bold rounded-2xl hover:opacity-90 active:scale-[0.99] transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-primary/20 flex items-center justify-center gap-2 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                            {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : <Sparkles className="w-6 h-6" />}
                            {loading ? 'Analyzing Content...' : 'Generate Chapters'}
                        </button>
                     </div>
                </div>

                {/* Step 3: Review */}
                {generatedData && (
                     <div className="space-y-4 animate-in fade-in slide-in-from-bottom-8 duration-500">
                        <div className="flex items-center justify-between px-1">
                             <h2 className="text-lg font-semibold text-primary">3. Review & Save</h2>
                             <span className="bg-accent/10 text-accent px-3 py-1 rounded-full text-xs font-bold">{generatedData.chapters.length} Chapters Found</span>
                        </div>
                        
                        <div className="bg-card border border-border-soft rounded-[2rem] p-6 space-y-4">
                            {generatedData.chapters.map((chapter, i) => (
                                <div key={i} className="bg-surface rounded-2xl p-4 border border-border-soft space-y-3">
                                    <div className="flex items-start gap-4">
                                        <div className="w-8 h-8 rounded-lg bg-card border border-border-soft flex items-center justify-center shrink-0 text-secondary">
                                            {i + 1}
                                        </div>
                                        <div className="flex-1 space-y-2">
                                            <input 
                                                value={chapter.title} 
                                                onChange={(e) => updateChapterTitle(i, e.target.value)}
                                                className="w-full bg-transparent text-primary font-bold text-lg focus:outline-none border-b border-transparent focus:border-border-soft"
                                            />
                                            <div className="pl-4 border-l-2 border-border-soft space-y-2">
                                                {chapter.topics.map((topic, ti) => (
                                                    <div key={ti} className="flex items-center gap-2 group">
                                                        <div className="w-1.5 h-1.5 rounded-full bg-secondary/50"></div>
                                                        <input 
                                                            value={topic.title}
                                                            onChange={(e) => updateTopicTitle(i, ti, e.target.value)}
                                                            className="flex-1 bg-transparent text-secondary text-sm focus:outline-none focus:text-primary transition-colors"
                                                        />
                                                        <button onClick={() => deleteTopic(i, ti)} className="opacity-0 group-hover:opacity-100 text-red-400 hover:text-red-500 transition-opacity"><X className="w-3 h-3" /></button>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                        <button onClick={() => deleteChapter(i)} className="text-secondary hover:text-red-500 transition-colors"><Trash2 className="w-5 h-5" /></button>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="flex gap-4">
                            <button onClick={handleReset} className="flex-1 py-4 bg-card border border-border-soft text-secondary font-bold rounded-2xl hover:bg-border-soft/50 transition-colors">Discard</button>
                            <button 
                                onClick={handleConfirm}
                                disabled={saving}
                                className="flex-[2] py-4 bg-green-500 text-white font-bold rounded-2xl hover:bg-green-600 shadow-lg shadow-green-500/20 transition-all flex items-center justify-center gap-2"
                            >
                                {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Check className="w-5 h-5" />}
                                Confirm & Save to Library
                            </button>
                        </div>
                     </div>
                )}
            </main>

            {/* Modals remain mostly functional, styled inline if needed or can be separated. Keeping simpler for this prompt limit */}
            {/* Add Subject Modal */}
            {showAddSubject && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-card w-full max-w-md p-6 rounded-[2rem] space-y-6">
                        <div className="flex justify-between items-center">
                            <h3 className="text-xl font-bold text-primary">New Subject</h3>
                            <button onClick={() => setShowAddSubject(false)}><X className="text-secondary" /></button>
                        </div>
                        <div className="space-y-4">
                            <input value={newSubject.name} onChange={e => setNewSubject(p => ({...p, name: e.target.value}))} placeholder="Subject Name" className="w-full h-12 bg-surface rounded-xl px-4 focus:outline-none border border-border-soft focus:border-accent" />
                            <div className="grid grid-cols-2 gap-4">
                                <input value={newSubject.code} onChange={e => setNewSubject(p => ({...p, code: e.target.value}))} placeholder="Code" className="w-full h-12 bg-surface rounded-xl px-4 focus:outline-none border border-border-soft focus:border-accent" />
                                <select value={newSubject.year} onChange={e => setNewSubject(p => ({...p, year: parseInt(e.target.value)}))} className="w-full h-12 bg-surface rounded-xl px-4 focus:outline-none border border-border-soft focus:border-accent">
                                    {[1,2,3,4].map(y => <option key={y} value={y}>Year {y}</option>)}
                                </select>
                            </div>
                        </div>
                        <button onClick={handleCreateSubject} className="w-full py-4 bg-accent text-white font-bold rounded-xl">Create Subject</button>
                    </div>
                </div>
            )}

            {/* Add Unit Modal */}
            {showAddUnit && (
                 <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-card w-full max-w-md p-6 rounded-[2rem] space-y-6">
                        <div className="flex justify-between items-center">
                            <h3 className="text-xl font-bold text-primary">New Unit</h3>
                             <button onClick={() => setShowAddUnit(false)}><X className="text-secondary" /></button>
                        </div>
                        <div className="space-y-4">
                            <input type="number" value={newUnit.unitNumber} onChange={e => setNewUnit(p => ({...p, unitNumber: parseInt(e.target.value)}))} placeholder="Unit Number" className="w-full h-12 bg-surface rounded-xl px-4 focus:outline-none border border-border-soft focus:border-accent" />
                            <input value={newUnit.title} onChange={e => setNewUnit(p => ({...p, title: e.target.value}))} placeholder="Unit Title" className="w-full h-12 bg-surface rounded-xl px-4 focus:outline-none border border-border-soft focus:border-accent" />
                        </div>
                        <button onClick={handleAddUnit} className="w-full py-4 bg-accent text-white font-bold rounded-xl">Add Unit</button>
                    </div>
                </div>
            )}
        </div>
    );
}
