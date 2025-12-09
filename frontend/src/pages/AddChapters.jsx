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
    Layers
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

    // Input mode state
    const [inputMode, setInputMode] = useState('image'); // 'image' or 'text'
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

    // Edit chapter title
    const updateChapterTitle = (chapterIndex, newTitle) => {
        setGeneratedData(prev => ({
            ...prev,
            chapters: prev.chapters.map((ch, i) => 
                i === chapterIndex ? { ...ch, title: newTitle } : ch
            )
        }));
    };

    // Edit topic title
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

    // Delete chapter
    const deleteChapter = (chapterIndex) => {
        setGeneratedData(prev => ({
            ...prev,
            chapters: prev.chapters.filter((_, i) => i !== chapterIndex)
        }));
    };

    // Delete topic
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

    // Confirm and save
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

    // Reset generated data
    const handleReset = () => {
        setGeneratedData(null);
        setImage(null);
        setImagePreview(null);
        setSyllabusText('');
    };

    return (
        <div className="min-h-screen bg-main pb-24 md:pb-10">
            {/* Header */}
            <header className="bg-card/90 backdrop-blur-md border-b border-border-soft sticky top-0 z-20">
                <div className="max-w-4xl mx-auto px-6 py-4 flex items-center gap-4">
                    <button
                        onClick={() => navigate(-1)}
                        className="p-2 hover:bg-border-soft rounded-full transition-colors"
                    >
                        <ArrowLeft className="w-5 h-5 text-primary" />
                    </button>
                    <div>
                        <h1 className="text-lg font-bold text-primary flex items-center gap-2">
                            <Sparkles className="w-5 h-5 text-accent" />
                            Add Chapters with AI
                        </h1>
                        <p className="text-sm text-secondary">Auto-generate from image or text</p>
                    </div>
                </div>
            </header>

            <main className="max-w-4xl mx-auto px-6 py-8 space-y-8">
                {/* Step 1: Subject & Unit Selection */}
                <section className="bg-card rounded-3xl border border-border-soft p-6 space-y-4">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center">
                            <span className="text-sm font-bold text-accent">1</span>
                        </div>
                        <h2 className="text-lg font-semibold text-primary">Select Subject & Unit</h2>
                    </div>
                    
                    <div className="grid md:grid-cols-2 gap-4">
                        {/* Subject Dropdown */}
                        <div className="relative">
                            <label className="text-sm text-secondary mb-2 block">Subject</label>
                            <div className="relative">
                                <select
                                    value={selectedSubject?._id || ''}
                                    onChange={(e) => {
                                        if (e.target.value === 'new') {
                                            setShowAddSubject(true);
                                            return;
                                        }
                                        const subj = subjects.find(s => s._id === e.target.value);
                                        setSelectedSubject(subj || null);
                                        setSelectedUnit(null);
                                    }}
                                    className="w-full bg-surface border border-border-soft rounded-xl px-4 py-3 text-primary appearance-none cursor-pointer focus:outline-none focus:border-accent"
                                >
                                    <option value="">Choose a subject...</option>
                                    {subjects.map(subj => (
                                        <option key={subj._id} value={subj._id}>
                                            {subj.name} ({subj.code})
                                        </option>
                                    ))}
                                    <option value="new">➕ Add New Subject</option>
                                </select>
                                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-secondary pointer-events-none" />
                            </div>
                        </div>

                        {/* Unit Dropdown */}
                        <div className="relative">
                            <label className="text-sm text-secondary mb-2 block">Unit</label>
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
                                    className="w-full bg-surface border border-border-soft rounded-xl px-4 py-3 text-primary appearance-none cursor-pointer focus:outline-none focus:border-accent disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <option value="">Choose a unit...</option>
                                    {selectedSubject?.units?.map(unit => (
                                        <option key={unit.unitNumber} value={unit.unitNumber}>
                                            Unit {unit.unitNumber}: {unit.title}
                                        </option>
                                    ))}
                                    {selectedSubject && <option value="new">➕ Add New Unit</option>}
                                </select>
                                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-secondary pointer-events-none" />
                            </div>
                        </div>
                    </div>
                </section>

                {/* Step 2: Input Method (Image or Text) */}
                <section className="bg-card rounded-3xl border border-border-soft p-6 space-y-4">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center">
                                <span className="text-sm font-bold text-accent">2</span>
                            </div>
                            <h2 className="text-lg font-semibold text-primary">Provide Syllabus Content</h2>
                        </div>
                        {/* Toggle Tabs */}
                        <div className="flex bg-surface p-1 rounded-xl border border-border-soft">
                            <button
                                onClick={() => setInputMode('image')}
                                className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${
                                    inputMode === 'image' 
                                        ? 'bg-accent text-white shadow-sm' 
                                        : 'text-secondary hover:text-primary'
                                }`}
                            >
                                Upload Image
                            </button>
                            <button
                                onClick={() => setInputMode('text')}
                                className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${
                                    inputMode === 'text' 
                                        ? 'bg-accent text-white shadow-sm' 
                                        : 'text-secondary hover:text-primary'
                                }`}
                            >
                                Paste Text
                            </button>
                        </div>
                    </div>

                    {inputMode === 'image' ? (
                        /* IMAGE UPLOAD UI */
                        !imagePreview ? (
                            <div
                                onDragEnter={handleDrag}
                                onDragLeave={handleDrag}
                                onDragOver={handleDrag}
                                onDrop={handleDrop}
                                className={`relative border-2 border-dashed rounded-2xl p-12 text-center transition-all ${
                                    dragActive 
                                        ? 'border-accent bg-accent/5' 
                                        : 'border-border-soft hover:border-accent/50'
                                }`}
                            >
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => handleFileChange(e.target.files?.[0])}
                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                />
                                <div className="space-y-4">
                                    <div className="w-16 h-16 mx-auto rounded-2xl bg-accent/10 flex items-center justify-center">
                                        <Upload className="w-8 h-8 text-accent" />
                                    </div>
                                    <div>
                                        <p className="text-primary font-medium">
                                            Drop your syllabus image here
                                        </p>
                                        <p className="text-sm text-secondary mt-1">
                                            or click to browse • JPEG, PNG, WebP up to 10MB
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="relative rounded-2xl overflow-hidden border border-border-soft">
                                <img 
                                    src={imagePreview} 
                                    alt="Syllabus preview" 
                                    className="w-full max-h-96 object-contain bg-surface"
                                />
                                <button
                                    onClick={() => {
                                        setImage(null);
                                        setImagePreview(null);
                                    }}
                                    className="absolute top-3 right-3 p-2 bg-red-500/90 hover:bg-red-500 rounded-xl text-white transition-colors"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>
                        )
                    ) : (
                        /* TEXT INPUT UI */
                        <div className="relative">
                           <textarea
                                value={syllabusText}
                                onChange={(e) => setSyllabusText(e.target.value)}
                                placeholder="Paste your syllabus content here... e.g. Chapter 1: Introduction to Mechanics..."
                                className="w-full h-64 bg-surface border border-border-soft rounded-2xl p-4 text-primary focus:outline-none focus:border-accent resize-none"
                            />
                            {syllabusText && (
                                <button
                                    onClick={() => setSyllabusText('')}
                                    className="absolute top-4 right-4 p-1.5 hover:bg-border-soft rounded-lg text-secondary hover:text-red-500 transition-colors"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            )}
                        </div>
                    )}

                    {/* Generate Button */}
                    {((inputMode === 'image' && imagePreview) || (inputMode === 'text' && syllabusText)) && !generatedData && (
                        <button
                            onClick={handleGenerate}
                            disabled={loading || !selectedSubject || !selectedUnit}
                            className="w-full py-4 bg-gradient-to-r from-accent to-purple-500 text-white font-semibold rounded-2xl flex items-center justify-center gap-3 hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                    AI is analyzing your content...
                                </>
                            ) : (
                                <>
                                    <Sparkles className="w-5 h-5" />
                                    Generate Chapters with AI
                                </>
                            )}
                        </button>
                    )}
                </section>

                {/* Step 3: Preview & Edit */}
                {generatedData && (
                    <section className="bg-card rounded-3xl border border-border-soft p-6 space-y-6">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-green-500/10 flex items-center justify-center">
                                    <Check className="w-5 h-5 text-green-500" />
                                </div>
                                <h2 className="text-lg font-semibold text-primary">
                                    Review Generated Chapters
                                </h2>
                            </div>
                            <span className="text-sm text-secondary bg-surface px-3 py-1 rounded-full">
                                {generatedData.chapters.length} chapters
                            </span>
                        </div>

                        {/* Chapters List */}
                        <div className="space-y-4">
                            {generatedData.chapters.map((chapter, chapterIndex) => (
                                <div 
                                    key={chapterIndex}
                                    className="bg-surface rounded-2xl border border-border-soft p-5 space-y-4"
                                >
                                    <div className="flex items-start gap-4">
                                        <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center shrink-0">
                                            <BookOpen className="w-5 h-5 text-accent" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <input
                                                type="text"
                                                value={chapter.title}
                                                onChange={(e) => updateChapterTitle(chapterIndex, e.target.value)}
                                                className="w-full bg-transparent text-primary font-semibold text-lg focus:outline-none border-b border-transparent focus:border-accent/50 pb-1"
                                            />
                                            <p className="text-sm text-secondary mt-1">{chapter.description}</p>
                                        </div>
                                        <button
                                            onClick={() => deleteChapter(chapterIndex)}
                                            className="p-2 text-red-400 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-colors"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>

                                    {/* Topics */}
                                    <div className="pl-14 space-y-2">
                                        {chapter.topics.map((topic, topicIndex) => (
                                            <div 
                                                key={topicIndex}
                                                className="flex items-center gap-3 bg-card rounded-xl px-4 py-3 group"
                                            >
                                                <FileText className="w-4 h-4 text-secondary shrink-0" />
                                                <input
                                                    type="text"
                                                    value={topic.title}
                                                    onChange={(e) => updateTopicTitle(chapterIndex, topicIndex, e.target.value)}
                                                    className="flex-1 bg-transparent text-primary text-sm focus:outline-none"
                                                />
                                                <button
                                                    onClick={() => deleteTopic(chapterIndex, topicIndex)}
                                                    className="p-1 text-red-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                                                >
                                                    <X className="w-4 h-4" />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-4 pt-4">
                            <button
                                onClick={handleReset}
                                className="flex-1 py-4 bg-surface border border-border-soft text-secondary font-medium rounded-2xl hover:border-accent/50 hover:text-primary transition-all"
                            >
                                Start Over
                            </button>
                            <button
                                onClick={handleConfirm}
                                disabled={saving || generatedData.chapters.length === 0}
                                className="flex-1 py-4 bg-green-500 text-white font-semibold rounded-2xl flex items-center justify-center gap-2 hover:bg-green-600 transition-colors disabled:opacity-50"
                            >
                                {saving ? (
                                    <>
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                        Saving...
                                    </>
                                ) : (
                                    <>
                                        <Check className="w-5 h-5" />
                                        Confirm & Save
                                    </>
                                )}
                            </button>
                        </div>
                    </section>
                )}
            </main>

            {/* Add Subject Modal */}
            {showAddSubject && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-card rounded-3xl border border-border-soft p-6 w-full max-w-md space-y-5">
                        <div className="flex items-center justify-between">
                            <h3 className="text-lg font-bold text-primary flex items-center gap-2">
                                <BookOpen className="w-5 h-5 text-accent" />
                                Add New Subject
                            </h3>
                            <button onClick={() => setShowAddSubject(false)} className="p-2 hover:bg-border-soft rounded-full">
                                <X className="w-5 h-5 text-secondary" />
                            </button>
                        </div>
                        
                        <div className="space-y-4">
                            <div>
                                <label className="text-sm text-secondary mb-2 block">Subject Name *</label>
                                <input
                                    type="text"
                                    value={newSubject.name}
                                    onChange={(e) => setNewSubject(p => ({ ...p, name: e.target.value }))}
                                    placeholder="e.g. Engineering Mathematics"
                                    className="w-full bg-surface border border-border-soft rounded-xl px-4 py-3 text-primary focus:outline-none focus:border-accent"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-sm text-secondary mb-2 block">Code</label>
                                    <input
                                        type="text"
                                        value={newSubject.code}
                                        onChange={(e) => setNewSubject(p => ({ ...p, code: e.target.value.toUpperCase() }))}
                                        placeholder="KAS101"
                                        className="w-full bg-surface border border-border-soft rounded-xl px-4 py-3 text-primary focus:outline-none focus:border-accent"
                                    />
                                </div>
                                <div>
                                    <label className="text-sm text-secondary mb-2 block">Year</label>
                                    <select
                                        value={newSubject.year}
                                        onChange={(e) => setNewSubject(p => ({ ...p, year: parseInt(e.target.value) }))}
                                        className="w-full bg-surface border border-border-soft rounded-xl px-4 py-3 text-primary focus:outline-none focus:border-accent"
                                    >
                                        <option value={1}>1st Year</option>
                                        <option value={2}>2nd Year</option>
                                        <option value={3}>3rd Year</option>
                                        <option value={4}>4th Year</option>
                                    </select>
                                </div>
                            </div>
                            <div>
                                <label className="text-sm text-secondary mb-2 block">Branch</label>
                                <select
                                    value={newSubject.branch}
                                    onChange={(e) => setNewSubject(p => ({ ...p, branch: e.target.value }))}
                                    className="w-full bg-surface border border-border-soft rounded-xl px-4 py-3 text-primary focus:outline-none focus:border-accent"
                                >
                                    <option value="ALL">All Branches</option>
                                    <option value="CSE">CSE</option>
                                    <option value="ME">Mechanical</option>
                                    <option value="EE">Electrical</option>
                                    <option value="ECE">ECE</option>
                                    <option value="CE">Civil</option>
                                </select>
                            </div>
                        </div>

                        <button
                            onClick={handleCreateSubject}
                            disabled={creatingSubject || !newSubject.name}
                            className="w-full py-3 bg-accent text-white font-semibold rounded-xl flex items-center justify-center gap-2 hover:opacity-90 disabled:opacity-50"
                        >
                            {creatingSubject ? <Loader2 className="w-5 h-5 animate-spin" /> : <Plus className="w-5 h-5" />}
                            Create Subject
                        </button>
                    </div>
                </div>
            )}

            {/* Add Unit Modal */}
            {showAddUnit && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-card rounded-3xl border border-border-soft p-6 w-full max-w-md space-y-5">
                        <div className="flex items-center justify-between">
                            <h3 className="text-lg font-bold text-primary flex items-center gap-2">
                                <Layers className="w-5 h-5 text-accent" />
                                Add New Unit
                            </h3>
                            <button onClick={() => setShowAddUnit(false)} className="p-2 hover:bg-border-soft rounded-full">
                                <X className="w-5 h-5 text-secondary" />
                            </button>
                        </div>
                        
                        <p className="text-sm text-secondary">
                            Adding to: <span className="text-accent font-medium">{selectedSubject?.name}</span>
                        </p>
                        
                        <div className="space-y-4">
                            <div className="grid grid-cols-3 gap-4">
                                <div>
                                    <label className="text-sm text-secondary mb-2 block">Unit #</label>
                                    <input
                                        type="number"
                                        min="1"
                                        value={newUnit.unitNumber}
                                        onChange={(e) => setNewUnit(p => ({ ...p, unitNumber: parseInt(e.target.value) || 1 }))}
                                        className="w-full bg-surface border border-border-soft rounded-xl px-4 py-3 text-primary focus:outline-none focus:border-accent"
                                    />
                                </div>
                                <div className="col-span-2">
                                    <label className="text-sm text-secondary mb-2 block">Unit Title *</label>
                                    <input
                                        type="text"
                                        value={newUnit.title}
                                        onChange={(e) => setNewUnit(p => ({ ...p, title: e.target.value }))}
                                        placeholder="e.g. Calculus"
                                        className="w-full bg-surface border border-border-soft rounded-xl px-4 py-3 text-primary focus:outline-none focus:border-accent"
                                    />
                                </div>
                            </div>
                        </div>

                        <button
                            onClick={handleAddUnit}
                            disabled={creatingUnit || !newUnit.title}
                            className="w-full py-3 bg-accent text-white font-semibold rounded-xl flex items-center justify-center gap-2 hover:opacity-90 disabled:opacity-50"
                        >
                            {creatingUnit ? <Loader2 className="w-5 h-5 animate-spin" /> : <Plus className="w-5 h-5" />}
                            Add Unit
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
