import { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, X, Loader2, ShieldAlert, FileText, User, ChevronRight, Users, Settings } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function AdminDashboard() {
    const [activeTab, setActiveTab] = useState('updates'); // 'updates' | 'users'
    const [updates, setUpdates] = useState([]);
    const [pendingUsers, setPendingUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [actioning, setActioning] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        fetchData();
    }, [activeTab]);

    const fetchData = async () => {
        setLoading(true);
        try {
            if (activeTab === 'updates') {
                const { data } = await axios.get('/admin/pending');
                setUpdates(data.data || []);
            } else {
                const { data } = await axios.get('/admin/users/pending');
                setPendingUsers(data.data || []);
            }
        } catch (error) {
            console.error("Fetch data error:", error);
            if (error.response?.status === 403 || error.response?.status === 401) {
                toast.error("Unauthorized Access");
                navigate('/dashboard');
            } else {
                toast.error("Failed to load pending items");
            }
        } finally {
            setLoading(false);
        }
    };

    const handleAction = async (id, action, type) => {
        setActioning(id);
        try {
            const endpoint = type === 'user' 
                ? `/admin/users/${action === 'approve' ? 'approve' : 'reject'}/${id}`
                : `/admin/${action}/${id}`;
                
            const { data } = await axios.post(endpoint);
            if (data.success) {
                toast.success(`${type === 'user' ? 'User' : 'Request'} ${action === 'approve' ? 'approved' : 'rejected'} successfully`);
                if (type === 'user') {
                    setPendingUsers(prev => prev.filter(u => u._id !== id));
                } else {
                    setUpdates(prev => prev.filter(u => u._id !== id));
                }
            }
        } catch (error) {
            toast.error(error.response?.data?.message || `Failed to ${action}`);
        } finally {
            setActioning(null);
        }
    };

    if (loading && updates.length === 0 && pendingUsers.length === 0) return (
        <div className="min-h-screen bg-main flex items-center justify-center">
            <Loader2 className="w-8 h-8 text-primary animate-spin" />
        </div>
    );

    return (
        <div className="min-h-screen bg-main pb-20">
            {/* Header */}
            <header className="pt-12 pb-8 px-6 max-w-5xl mx-auto">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-red-500/10 flex items-center justify-center text-red-500 border border-red-500/20">
                            <ShieldAlert className="w-6 h-6" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold text-primary">Admin Control</h1>
                            <p className="text-secondary text-sm font-medium opacity-60">System management & approvals</p>
                        </div>
                    </div>

                    {/* Tabs */}
                    <div className="flex bg-card/40 backdrop-blur-xl border border-white/5 p-1.5 rounded-2xl">
                        <button 
                            onClick={() => setActiveTab('updates')}
                            className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all flex items-center gap-2 ${
                                activeTab === 'updates' ? 'bg-primary text-black' : 'text-secondary hover:text-primary'
                            }`}
                        >
                            <FileText className="w-4 h-4" />
                            Content Updates
                        </button>
                        <button 
                            onClick={() => setActiveTab('users')}
                            className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all flex items-center gap-2 ${
                                activeTab === 'users' ? 'bg-primary text-black' : 'text-secondary hover:text-primary'
                            }`}
                        >
                            <Users className="w-4 h-4" />
                            User Approvals
                        </button>
                    </div>
                </div>
            </header>

            <main className="max-w-5xl mx-auto px-6">
                {activeTab === 'updates' ? (
                    updates.length === 0 ? (
                        <EmptyState message="No pending content updates" />
                    ) : (
                        <div className="grid gap-6">
                            <AnimatePresence>
                                {updates.map((update) => (
                                    <RequestCard 
                                        key={update._id} 
                                        update={update} 
                                        onAction={(action) => handleAction(update._id, action, 'update')}
                                        actioning={actioning}
                                    />
                                ))}
                            </AnimatePresence>
                        </div>
                    )
                ) : (
                    pendingUsers.length === 0 ? (
                        <EmptyState message="No pending user registrations" />
                    ) : (
                        <div className="grid gap-6">
                            <AnimatePresence>
                                {pendingUsers.map((user) => (
                                    <UserCard 
                                        key={user._id} 
                                        user={user} 
                                        onAction={(action) => handleAction(user._id, action, 'user')}
                                        actioning={actioning}
                                    />
                                ))}
                            </AnimatePresence>
                        </div>
                    )
                )}
            </main>
        </div>
    );
}

function EmptyState({ message }) {
    return (
        <div className="flex flex-col items-center justify-center py-20 text-center space-y-4 opacity-50">
            <div className="w-20 h-20 rounded-3xl bg-white/5 flex items-center justify-center">
                <Check className="w-8 h-8 text-secondary" />
            </div>
            <p className="text-secondary font-medium">{message}</p>
        </div>
    );
}

function RequestCard({ update, onAction, actioning }) {
    return (
        <motion.div 
            layout
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-card/40 backdrop-blur-xl border border-white/5 rounded-[2rem] p-6 md:p-8 flex flex-col md:flex-row gap-6 md:items-center justify-between group hover:border-white/10 transition-all"
        >
            <div className="space-y-4 flex-1">
                <div className="flex items-center gap-3">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                        update.type === 'ADD_CHAPTERS' ? 'bg-accent/10 text-accent' : 'bg-white/10 text-secondary'
                    }`}>
                        {update.type.replace('_', ' ')}
                    </span>
                    <span className="text-secondary text-xs font-medium opacity-50">
                        {new Date(update.createdAt).toLocaleDateString()}
                    </span>
                </div>
                
                <div>
                    {update.type === 'ADD_CHAPTERS' ? (
                        <div className="space-y-1">
                            <h3 className="text-xl font-bold text-primary flex items-center gap-2">
                                <FileText className="w-5 h-5 text-secondary" />
                                Add {update.data.chapters?.length} Chapters
                            </h3>
                            <p className="text-secondary text-sm pl-7">
                                to Unit {update.data.unitNumber}
                            </p>
                        </div>
                    ) : (
                        <h3 className="text-lg font-bold text-primary">Unknown Request</h3>
                    )}
                </div>

                <div className="flex items-center gap-2 text-xs font-bold text-secondary bg-white/5 w-fit px-3 py-1.5 rounded-xl">
                    <User className="w-3 h-3" />
                    {update.requestedBy?.name || 'Unknown User'}
                    <span className="opacity-40 font-normal">({update.requestedBy?.email})</span>
                </div>
            </div>

            <div className="flex items-center gap-3 md:border-l md:border-white/5 md:pl-6">
                <button 
                    onClick={() => onAction('reject')}
                    disabled={!!actioning}
                    className="px-5 py-3 rounded-2xl bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white font-bold transition-all disabled:opacity-50 text-sm flex items-center gap-2"
                >
                    <X className="w-4 h-4" />
                    Reject
                </button>
                <button 
                    onClick={() => onAction('approve')}
                    disabled={!!actioning}
                    className="px-6 py-3 rounded-2xl bg-green-500 text-white font-bold shadow-lg shadow-green-500/20 hover:scale-105 transition-all disabled:opacity-50 disabled:scale-100 flex items-center gap-2"
                >
                    {actioning === update._id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                    Approve
                </button>
            </div>
        </motion.div>
    );
}

function UserCard({ user, onAction, actioning }) {
    return (
        <motion.div 
            layout
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-card/40 backdrop-blur-xl border border-white/5 rounded-[2rem] p-6 md:p-8 flex flex-col md:flex-row gap-6 md:items-center justify-between group hover:border-white/10 transition-all"
        >
            <div className="flex items-center gap-6 flex-1">
                <div className="w-16 h-16 rounded-3xl bg-primary/10 flex items-center justify-center text-primary font-bold text-2xl border border-primary/20">
                    {user.name?.charAt(0) || 'U'}
                </div>
                <div className="space-y-1">
                    <h3 className="text-xl font-bold text-primary">{user.name}</h3>
                    <p className="text-secondary text-sm font-medium opacity-60">{user.email}</p>
                    <div className="flex items-center gap-3 mt-2">
                        <span className="text-secondary text-[10px] font-black uppercase tracking-widest bg-white/5 px-2.5 py-1 rounded-lg border border-white/5">
                            New Registration
                        </span>
                        <span className="text-secondary/40 text-[10px] uppercase font-bold tracking-tighter">
                            Joined {new Date(user.createdAt).toLocaleDateString()}
                        </span>
                    </div>
                </div>
            </div>

            <div className="flex items-center gap-3 md:border-l md:border-white/5 md:pl-6">
                <button 
                    onClick={() => onAction('reject')}
                    disabled={!!actioning}
                    className="px-5 py-3 rounded-2xl bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white font-bold transition-all disabled:opacity-50 text-sm flex items-center gap-2"
                >
                    <X className="w-4 h-4" />
                    Reject
                </button>
                <button 
                    onClick={() => onAction('approve')}
                    disabled={!!actioning}
                    className="px-6 py-3 rounded-2xl bg-primary text-black font-bold shadow-lg shadow-primary/20 hover:scale-105 transition-all disabled:opacity-50 disabled:scale-100 flex items-center gap-2"
                >
                    {actioning === user._id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                    Approve Access
                </button>
            </div>
        </motion.div>
    );
}
