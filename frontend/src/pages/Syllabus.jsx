import { useEffect, useState, useContext } from 'react';
import { BookOpen, Search, ArrowRight, Book, Layers, ArrowLeft, MoreHorizontal, Plus, Check, Loader2 } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import toast from 'react-hot-toast';
import SubjectContext from '../context/Subject/SubjectContext';
import UserContext from '../context/User/UserContext';


export default function Syllabus() {
  const navigate = useNavigate();
  const { userSubjects, addUserSubject } = useContext(SubjectContext);
  const { fetchProfile } = useContext(UserContext);
  const [subjects, setSubjects] = useState([]);
  const [filteredSubjects, setFilteredSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [addingId, setAddingId] = useState(null);

  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        const response = await axios.get('/syllabus');
        const subjectsData = response.data.subjects || [];
        setSubjects(subjectsData);
        setFilteredSubjects(subjectsData);
      } catch (error) {
        console.error('Failed to fetch subjects:', error);
      } finally { 
        setLoading(false);
      }
    };
    fetchSubjects();
  }, []);

  useEffect(() => {
    let filtered = subjects;
    if (searchQuery.trim()) {
      filtered = filtered.filter(s => 
        s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.code.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    setFilteredSubjects(filtered);
  }, [searchQuery, subjects]);

  const handleAddSubject = async (e, subjectId) => {
    e.preventDefault();
    e.stopPropagation();
    if (isAdded(subjectId)) return;
    
    setAddingId(subjectId);
    await addUserSubject(subjectId);
    setAddingId(null);
    fetchProfile();
    navigate('/dashboard');
  };

  const isAdded = (id) => userSubjects.some(s => s._id === id);

  const handleCardClick = (subject) => {
    if (isAdded(subject._id)) {
      navigate(`/syllabus/${subject._id}`);
    } else {
      toast('Please add this subject first by clicking the + button', {
        // icon: '📚',
        duration: 3000,
      });
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.05 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, scale: 0.98, y: 10 },
    visible: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] } }
  };

  return (
    <div className="min-h-screen bg-main relative pb-20">
       {/* Header */}
      <div className="sticky top-0 z-40 bg-main">
        <div className="max-w-7xl mx-auto px-4 md:px-10 h-16 md:h-20 flex items-center justify-between">
           <div className="flex items-center gap-3">
                <button
                    onClick={() => navigate(-1)}
                    className="p-2 hover:bg-surface rounded-full transition-all text-secondary hover:text-primary active:scale-90"
                >
                    <ArrowLeft className="w-5 h-5" />
                </button>
                <h1 className="text-lg md:text-xl font-bold tracking-tight text-primary">Library</h1>
           </div>
           
           <div className="hidden md:flex relative w-80 group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-secondary/60 group-focus-within:text-accent transition-colors" />
              <input 
                type="text" 
                placeholder="Find a subject..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-surface border border-transparent rounded-[1.25rem] pl-11 pr-4 py-2.5 text-sm text-primary placeholder:text-secondary/40 focus:outline-none focus:ring-4 focus:ring-accent/5 transition-all shadow-inner"
              />
           </div>
        </div>
        
        {/* Mobile Search - Visible only on small screens */}
        <div className="md:hidden px-4 pb-4">
            <div className="relative group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-secondary/60 group-focus-within:text-accent transition-colors" />
                <input 
                    type="text" 
                    placeholder="Search subjects..." 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-surface border border-transparent rounded-[1.25rem] pl-11 pr-4 py-3 text-sm text-primary placeholder:text-secondary/40 focus:outline-none focus:ring-4 focus:ring-accent/5 transition-all"
                />
            </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-10 py-6 md:py-10">
        {loading ? (
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-10">
             {[1, 2, 3, 4, 5, 6].map(i => (
               <div key={i} className="h-64 bg-surface rounded-[2.5rem] animate-pulse" />
             ))}
           </div>
        ) : filteredSubjects.length === 0 ? (
           <div className="flex flex-col items-center justify-center py-32 text-center">
               <div className="w-20 h-20 bg-surface rounded-full flex items-center justify-center mb-6 shadow-inner">
                  <BookOpen className="w-8 h-8 text-secondary/20" />
               </div>
               <h3 className="text-xl font-bold text-primary mb-2 tracking-tight">No Results Found</h3>
               <p className="text-secondary/60 text-sm max-w-xs mx-auto leading-relaxed">Try adjusting your search query or check back later for new additions.</p>
           </div>
        ) : (
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-10"
          >
            {filteredSubjects.map((subject) => {
              const added = isAdded(subject._id);
              const isAdding = addingId === subject._id;

              return (
                <motion.div key={subject._id} variants={itemVariants} className="group">
                  <div 
                    onClick={() => handleCardClick(subject)}
                    className="block bg-card rounded-[2rem] p-6 md:p-8 hover:shadow-[0_20px_60px_-15px_rgba(0,0,0,0.06)] md:hover:shadow-[0_32px_80px_-20px_rgba(0,0,0,0.08)] transition-all duration-500 relative overflow-hidden group/card cursor-pointer shadow-[0_8px_30px_rgb(0,0,0,0.04)]"
                  >
                     <div className="flex items-start justify-between mb-6 md:mb-8">
                        <div className="flex items-center gap-3 md:gap-4">
                            <div className="w-12 h-12 md:w-14 md:h-14 rounded-2xl bg-surface flex items-center justify-center text-primary group-hover/card:scale-105 transition-all duration-500 shadow-sm">
                                <BookOpen className="w-6 h-6 md:w-7 md:h-7" />
                            </div>
                            <div>
                                <span className="text-[11px] font-bold text-accent uppercase tracking-widest bg-accent/5 px-2.5 py-1 rounded-lg">{subject.code}</span>
                            </div>
                        </div>
                        
                        {/* Apple-style Add Button */}
                         <div className="relative z-10">
                            <button
                                onClick={(e) => handleAddSubject(e, subject._id)}
                                disabled={added || isAdding}
                                className={`w-10 h-10 md:w-11 md:h-11 rounded-full flex items-center justify-center transition-all duration-300 active:scale-90 ${
                                    added 
                                    ? ' text-white shadow-[0_10px_30px_rgba(0,0,0,0.2)] backdrop-blur-md'
                                    : 'bg-card text-secondary hover:bg-primary hover:text-white shadow-[0_4px_12px_rgba(0,0,0,0.12)] hover:shadow-primary/20'
                                }`}
                                title={added ? "Already in your library" : "Add to library"}
                            >
                                {isAdding ? (
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                ) : added ? (
                                    <Check className="w-5 h-5" />
                                ) : (
                                    <Plus disabled={added || isAdding} className="w-5 h-5 text-secondary" />
                                )}
                            </button>
                        </div>
                     </div>

                      <h3 className="text-xl md:text-2xl font-bold text-primary mb-2 md:mb-3 tracking-tight group-hover/card:text-accent transition-colors duration-300 line-clamp-1">{subject.name}</h3>
                     <p className="text-xs md:text-sm text-secondary/60 leading-relaxed mb-6 md:mb-8 line-clamp-2">{subject.description || `Comprehensive guide to ${subject.name}, covering fundamental concepts and advanced applications.`}</p>

                     <div className="flex items-center justify-between pt-6">
                        <div className="flex items-center gap-2.5 text-xs font-bold text-secondary uppercase tracking-wider">
                            <Layers className="w-4 h-4 text-accent/50" />
                            <span>{subject.units?.length || 5} Units</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-accent font-bold text-sm opacity-0 group-hover/card:opacity-100 group-hover/card:translate-x-0 -translate-x-3 transition-all duration-500">
                            Explore <ArrowRight className="w-4 h-4" />
                        </div>
                     </div>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        )}
      </div>
    </div>
  );
}
