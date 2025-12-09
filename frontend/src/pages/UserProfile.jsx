import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import axios from 'axios';
import toast from 'react-hot-toast';
import { 
    User, 
    Mail, 
    BookOpen, 
    GraduationCap, 
    Calendar, 
    Sparkles, 
    Edit2, 
    Check, 
    X,
    Camera,
    Shield,
    Sun,
    Moon,
    Layers
} from 'lucide-react';

export default function UserProfile() {
    const { user, setUser } = useAuth();
    const { isDark, toggleTheme } = useTheme();
    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(false);
    
    // Form state
    const [formData, setFormData] = useState({
        name: '',
        college: '',
        branch: '',
        year: 1,
        targetExamDate: ''
    });

    const [persona, setPersona] = useState(null);

    // Initialize data
    useEffect(() => {
        if (user) {
            setFormData({
                name: user.name || '',
                college: user.academicInfo?.college || '',
                branch: user.academicInfo?.branch || '',
                year: user.academicInfo?.year || 1,
                targetExamDate: user.academicInfo?.targetExamDate ? new Date(user.academicInfo.targetExamDate).toISOString().split('T')[0] : ''
            });
            setPersona(user.personaProfile || null);
        }
    }, [user]);

    const handleSave = async () => {
        setLoading(true);
        try {
            const payload = {
                name: formData.name,
                academicInfo: {
                    college: formData.college,
                    branch: formData.branch,
                    year: parseInt(formData.year),
                    targetExamDate: formData.targetExamDate || null
                },
                personaProfile: persona // Include global persona state which might be modified in modal
            };

            const { data } = await axios.put('/users/profile', payload);
            console.log('Update Response:', data);
            
            if (data.success) {
                setUser(data.user);
                toast.success(data.message || 'Profile updated successfully!');
                setIsEditing(false);
            } else {
                toast.error(data.message || 'Update failed');
            }
        } catch (error) {
            console.error('Profile Update Error:', error);
            const errorMsg = error.response?.data?.message || error.message || 'Failed to update profile';
            toast.error(errorMsg);
        } finally {
            setLoading(false);
        }
    };

    const [showPersonaModal, setShowPersonaModal] = useState(false);

    return (
        <div className="min-h-screen bg-main pb-24 md:pb-10 p-6 md:p-8">
            <div className="max-w-4xl mx-auto space-y-8">
                
                {/* Header Section */}
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-primary flex items-center gap-3">
                            <span className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center">
                                <User className="w-6 h-6 text-accent" />
                            </span>
                            Your Profile
                        </h1>
                        <p className="text-secondary mt-1 ml-13">Manage your personal and academic details</p>
                    </div>
                    
                    <div className="flex items-center gap-3">
                        {/* Theme Toggle */}
                        <button 
                            onClick={toggleTheme}
                            className="p-2.5 bg-surface border border-border-soft hover:border-accent text-secondary hover:text-primary rounded-xl transition-all"
                            title="Toggle Theme"
                        >
                            {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                        </button>

                        {!isEditing ? (
                            <button 
                                onClick={() => setIsEditing(true)}
                                className="flex items-center gap-2 px-5 py-2.5 bg-surface border border-border-soft hover:border-accent text-primary rounded-xl transition-all"
                            >
                                <Edit2 className="w-4 h-4" />
                                <span className="hidden md:inline">Edit Profile</span>
                                <span className="md:hidden">Edit</span>
                            </button>
                        ) : (
                            <div className="flex items-center gap-3">
                                <button 
                                    onClick={() => setIsEditing(false)}
                                    className="px-5 py-2.5 text-secondary hover:text-primary transition-colors"
                                >
                                    Cancel
                                </button>
                                <button 
                                    onClick={handleSave}
                                    disabled={loading}
                                    className="flex items-center gap-2 px-6 py-2.5 bg-accent text-white rounded-xl hover:opacity-90 transition-all font-medium"
                                >
                                    {loading ? 'Saving...' : (
                                        <>
                                            <Check className="w-4 h-4" />
                                            <span className="hidden md:inline">Save Changes</span>
                                            <span className="md:hidden">Save</span>
                                        </>
                                    )}
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                {/* Main Content Grid */}
                <div className="grid md:grid-cols-3 gap-6">
                    
                    {/* Left Column: Avatar & Basic Info */}
                    <div className="md:col-span-1 space-y-6">
                        {/* User Card */}
                        <div className="bg-card rounded-3xl p-6 border border-border-soft flex flex-col items-center text-center">
                            <div className="relative mb-4">
                                <div className="w-24 h-24 rounded-full bg-surface border-4 border-main flex items-center justify-center overflow-hidden">
                                    {user?.avatar ? (
                                        <img src={user.avatar} alt="Profile" className="w-full h-full object-cover" />
                                    ) : (
                                        <span className="text-4xl font-bold text-secondary">
                                            {user?.name?.charAt(0).toUpperCase()}
                                        </span>
                                    )}
                                </div>
                                <button className="absolute bottom-0 right-0 p-2 bg-accent text-white rounded-full shadow-lg hover:scale-105 transition-transform">
                                    <Camera className="w-4 h-4" />
                                </button>
                            </div>
                            
                            {isEditing ? (
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                                    className="w-full bg-surface border border-border-soft rounded-lg px-3 py-2 text-primary text-center font-bold mb-1 focus:outline-none focus:border-accent"
                                />
                            ) : (
                                <h2 className="text-xl font-bold text-primary">{user?.name}</h2>
                            )}
                            
                            <p className="text-sm text-secondary flex items-center gap-1 mt-1">
                                <Mail className="w-3 h-3" />
                                {user?.email}
                            </p>

                            <div className="mt-6 w-full pt-6 border-t border-border-soft">
                                <div className="flex items-center justify-between text-sm mb-2">
                                    <span className="text-secondary">Plan</span>
                                    <span className="text-green-400 font-medium flex items-center gap-1">
                                        <Shield className="w-3 h-3" /> Free Tier
                                    </span>
                                </div>
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-secondary">Joined</span>
                                    <span className="text-primary font-medium">Dec 2025</span>
                                </div>
                            </div>
                        </div>

                        {/* Learning Style Card */}
                        <div 
                            onClick={() => persona && setShowPersonaModal(true)}
                            className={`bg-gradient-to-br from-indigo-900/20 to-purple-900/20 rounded-3xl p-6 border border-accent/20 transition-all ${persona ? 'cursor-pointer hover:border-accent/40 hover:shadow-lg hover:shadow-accent/5' : ''}`}
                        >
                            <h3 className="text-lg font-bold text-primary flex items-center gap-2 mb-4">
                                <Sparkles className="w-5 h-5 text-accent" />
                                AI Persona
                            </h3>
                            
                            {persona ? (
                                <div className="space-y-4">
                                    <div className="bg-surface/50 rounded-xl p-3 border border-white/5">
                                        <span className="text-xs text-secondary uppercase tracking-wider font-bold block mb-1">Teaching Tone</span>
                                        <p className="text-primary font-medium">{persona.tone || 'Friendly'}</p>
                                    </div>
                                    <div className="bg-surface/50 rounded-xl p-3 border border-white/5">
                                        <span className="text-xs text-secondary uppercase tracking-wider font-bold block mb-1">Pace</span>
                                        <p className="text-primary font-medium">{persona.pace || 'Moderate'}</p>
                                    </div>
                                    <div className="text-xs text-center text-accent/80 mt-2 font-medium flex items-center justify-center gap-1">
                                        Click to view full details
                                    </div>
                                </div>
                            ) : (
                                <div className="text-center py-4">
                                    <p className="text-sm text-secondary">No persona set yet. Take the quiz!</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Right Column: Academic Details */}
                    <div className="md:col-span-2 space-y-6">
                        <section className="bg-card rounded-3xl border border-border-soft p-6 md:p-8">
                            <h3 className="text-xl font-bold text-primary mb-6 flex items-center gap-2">
                                <GraduationCap className="w-6 h-6 text-accent" />
                                Academic Information
                            </h3>

                            <div className="grid md:grid-cols-2 gap-6">
                                {/* College Info */}
                                <div className="col-span-2">
                                    <label className="text-sm font-medium text-secondary mb-2 block">College / University</label>
                                    {isEditing ? (
                                        <div className="relative">
                                            <input
                                                type="text"
                                                value={formData.college}
                                                onChange={(e) => setFormData({...formData, college: e.target.value})}
                                                className="w-full bg-surface border border-border-soft rounded-xl px-4 py-3 pl-11 text-primary focus:outline-none focus:border-accent transition-colors"
                                                placeholder="Enter your college name"
                                            />
                                            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-secondary">
                                                <BookOpen className="w-5 h-5" />
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="bg-surface border border-border-soft rounded-xl px-4 py-3 text-primary flex items-center gap-3">
                                            <BookOpen className="w-5 h-5 text-secondary" />
                                            {formData.college || 'Not set'}
                                        </div>
                                    )}
                                </div>

                                {/* Branch Selection */}
                                <div>
                                    <label className="text-sm font-medium text-secondary mb-2 block">Branch</label>
                                    {isEditing ? (
                                        <div className="relative">
                                            <select
                                                value={formData.branch}
                                                onChange={(e) => setFormData({...formData, branch: e.target.value})}
                                                className="w-full bg-surface border border-border-soft rounded-xl px-4 py-3 pl-11 text-primary appearance-none focus:outline-none focus:border-accent cursor-pointer"
                                            >
                                                <option value="">Select Branch</option>
                                                <option value="CSE">CSE</option>
                                                <option value="ME">Mechanical</option>
                                                <option value="EE">Electrical</option>
                                                <option value="ECE">ECE</option>
                                                <option value="CE">Civil</option>
                                                <option value="IT">IT</option>
                                            </select>
                                            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-secondary">
                                                <Layers className="w-5 h-5" />
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="bg-surface border border-border-soft rounded-xl px-4 py-3 text-primary flex items-center gap-3">
                                            <Layers className="w-5 h-5 text-secondary" />
                                            {formData.branch || 'Not set'}
                                        </div>
                                    )}
                                </div>

                                {/* Year Selection */}
                                <div>
                                    <label className="text-sm font-medium text-secondary mb-2 block">Current Year</label>
                                    {isEditing ? (
                                        <div className="relative">
                                            <select
                                                value={formData.year}
                                                onChange={(e) => setFormData({...formData, year: e.target.value})}
                                                className="w-full bg-surface border border-border-soft rounded-xl px-4 py-3 pl-11 text-primary appearance-none focus:outline-none focus:border-accent cursor-pointer"
                                            >
                                                <option value="1">1st Year</option>
                                                <option value="2">2nd Year</option>
                                                <option value="3">3rd Year</option>
                                                <option value="4">4th Year</option>
                                            </select>
                                            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-secondary">
                                                <Calendar className="w-5 h-5" />
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="bg-surface border border-border-soft rounded-xl px-4 py-3 text-primary flex items-center gap-3">
                                            <Calendar className="w-5 h-5 text-secondary" />
                                            {formData.year ? `${formData.year}${getOrdinal(formData.year)} Year` : 'Not set'}
                                        </div>
                                    )}
                                </div>

                                {/* Exam Date */}
                                <div className="col-span-2">
                                    <label className="text-sm font-medium text-secondary mb-2 block">Target Exam Date</label>
                                    {isEditing ? (
                                        <div className="relative">
                                            <input
                                                type="date"
                                                value={formData.targetExamDate}
                                                onChange={(e) => setFormData({...formData, targetExamDate: e.target.value})}
                                                className="w-full bg-surface border border-border-soft rounded-xl px-4 py-3 pl-11 text-primary focus:outline-none focus:border-accent"
                                            />
                                            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-secondary">
                                                <Calendar className="w-5 h-5" />
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="bg-surface border border-border-soft rounded-xl px-4 py-3 text-primary flex items-center gap-3">
                                            <Calendar className="w-5 h-5 text-secondary" />
                                            {formData.targetExamDate ? new Date(formData.targetExamDate).toLocaleDateString('en-US', { dateStyle: 'long' }) : 'Not set'}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </section>

                        <div className="bg-blue-500/5 border border-blue-500/20 rounded-2xl p-4 flex gap-4">
                             <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center shrink-0">
                                <Shield className="w-5 h-5 text-blue-400" />
                            </div>
                            <div>
                                <h4 className="text-primary font-semibold mb-1">Data Privacy</h4>
                                <p className="text-sm text-secondary">
                                    Your academic data helps our AI tailor the learning experience specifically for your curriculum. We do not share this data with third parties.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Persona Detail Modal */}
            {showPersonaModal && persona && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                    <div className="bg-card w-full max-w-2xl rounded-3xl border border-border-soft shadow-2xl max-h-[90vh] overflow-y-auto">
                        <div className="sticky top-0 bg-card/90 backdrop-blur-md p-6 border-b border-border-soft flex items-center justify-between z-10">
                            <h2 className="text-2xl font-bold text-primary flex items-center gap-3">
                                <Sparkles className="w-6 h-6 text-accent" />
                                AI Persona Details
                                {isEditing && <span className="text-xs bg-accent/20 text-accent px-2 py-1 rounded-full border border-accent/20">Editing Mode</span>}
                            </h2>
                            <button 
                                onClick={() => setShowPersonaModal(false)}
                                className="p-2 hover:bg-surface rounded-full text-secondary hover:text-primary transition-colors"
                            >
                                <X className="w-6 h-6" />
                            </button>
                        </div>
                        
                        <div className="p-6 space-y-8">
                            {/* Core Preferences Grid */}
                            <div className="grid md:grid-cols-2 gap-6">
                                <EditableDetailItem isEditing={isEditing} label="Language" value={persona.language_preference} onChange={(val) => setPersona({...persona, language_preference: val})} />
                                <EditableDetailItem isEditing={isEditing} label="Script" value={persona.script_preference} onChange={(val) => setPersona({...persona, script_preference: val})} />
                                <EditableDetailItem isEditing={isEditing} label="Tone" value={persona.tone} onChange={(val) => setPersona({...persona, tone: val})} />
                                <EditableDetailItem isEditing={isEditing} label="Formality" value={persona.formality} onChange={(val) => setPersona({...persona, formality: val})} />
                                <EditableDetailItem isEditing={isEditing} label="Pacing" value={persona.pacing} onChange={(val) => setPersona({...persona, pacing: val})} />
                                <EditableDetailItem isEditing={isEditing} label="Emoji Usage" value={persona.emoji_usage} onChange={(val) => setPersona({...persona, emoji_usage: val})} />
                                <EditableDetailItem isEditing={isEditing} label="Explanation Depth" value={persona.explanation_depth} className="md:col-span-2" onChange={(val) => setPersona({...persona, explanation_depth: val})} />
                            </div>

                            {/* Detailed Sections */}
                            <div className="space-y-4">
                                <h3 className="text-lg font-semibold text-primary border-b border-border-soft pb-2">Teaching Style</h3>
                                <EditableTextArea isEditing={isEditing} label="How I Explain" value={persona.explanation_style} onChange={(val) => setPersona({...persona, explanation_style: val})} />
                                <EditableTextArea isEditing={isEditing} label="Examples I Use" value={persona.examples_preference} onChange={(val) => setPersona({...persona, examples_preference: val})} />
                                <EditableTextArea isEditing={isEditing} label="Motivation Style" value={persona.motivation_style} onChange={(val) => setPersona({...persona, motivation_style: val})} />
                            </div>

                            {/* Do's and Don'ts */}
                            {persona.do_and_dont && (
                                <div className="space-y-4">
                                    <h3 className="text-lg font-semibold text-primary border-b border-border-soft pb-2">Do's & Don'ts</h3>
                                    {isEditing ? (
                                        <div className="space-y-2">
                                            <p className="text-xs text-secondary">Enter rules separated by new lines. Start with "Do" or "Don't".</p>
                                            <textarea 
                                                value={Array.isArray(persona.do_and_dont) ? persona.do_and_dont.join('\n') : persona.do_and_dont}
                                                onChange={(e) => setPersona({...persona, do_and_dont: e.target.value.split('\n')})}
                                                className="w-full bg-surface border border-border-soft rounded-xl px-4 py-3 text-primary focus:outline-none focus:border-accent min-h-[150px]"
                                            />
                                        </div>
                                    ) : (
                                        <div className="grid gap-3">
                                            {Array.isArray(persona.do_and_dont) ? persona.do_and_dont.map((item, idx) => (
                                                <div key={idx} className="flex items-start gap-3 p-3 bg-surface/30 rounded-lg">
                                                    {item.toLowerCase().startsWith("do ") || item.toLowerCase().startsWith("do:") ? (
                                                        <Check className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
                                                    ) : (
                                                        <X className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                                                    )}
                                                    <span className="text-primary text-sm">{item}</span>
                                                </div>
                                            )) : (
                                                <p className="text-secondary italic">No specific rules set.</p>
                                            )}
                                        </div>
                                    )}
                                </div>
                            )}

                            {isEditing && (
                                <div className="mt-6 flex justify-end">
                                    <button 
                                        onClick={() => setShowPersonaModal(false)}
                                        className="bg-accent text-white px-6 py-2 rounded-xl font-medium hover:opacity-90"
                                    >
                                        Done Editing
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

function EditableDetailItem({ label, value, className = '', isEditing, onChange }) {
    return (
        <div className={`space-y-1 ${className}`}>
            <span className="text-xs font-semibold text-secondary uppercase tracking-wider">{label}</span>
            {isEditing ? (
                <input 
                    type="text"
                    value={value || ''}
                    onChange={(e) => onChange(e.target.value)}
                    className="w-full bg-surface border border-border-soft rounded-xl px-4 py-3 text-primary focus:outline-none focus:border-accent"
                />
            ) : (
                <p className="text-primary font-medium bg-surface border border-border-soft rounded-xl px-4 py-3">
                    {value || 'Not specified'}
                </p>
            )}
        </div>
    );
}

function EditableTextArea({ label, value, isEditing, onChange }) {
    return (
        <div className={isEditing ? "" : "bg-surface/50 rounded-xl p-4 border border-border-soft"}>
            <span className="text-sm font-medium text-accent block mb-2">{label}</span>
            {isEditing ? (
                <textarea 
                    value={value || ''}
                    onChange={(e) => onChange(e.target.value)}
                    className="w-full bg-surface border border-border-soft rounded-xl px-4 py-3 text-primary focus:outline-none focus:border-accent min-h-[100px]"
                />
            ) : (
                <p className="text-primary leading-relaxed">{value || 'Not specified'}</p>
            )}
        </div>
    );
}

// Utility for ordinals (1st, 2nd, etc)
function getOrdinal(n) {
    const s = ["th", "st", "nd", "rd"];
    const v = n % 100;
    return s[(v - 20) % 10] || s[v] || s[0];
}


