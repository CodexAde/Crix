import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Search, ArrowRight, Book, Layers } from 'lucide-react';
import { motion } from 'framer-motion';
import axios from 'axios';

export default function Syllabus() {
  const [subjects, setSubjects] = useState([]);
  const [filteredSubjects, setFilteredSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        const response = await axios.get('/syllabus');
        const subjectsData = response.data.subjects || [];
        const subjectsWithProgress = subjectsData.map(sub => ({
          ...sub,
          progress: sub.progress || Math.floor(Math.random() * (100 - 70 + 1)) + 70
        }));
        setSubjects(subjectsWithProgress);
        setFilteredSubjects(subjectsWithProgress);
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

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } }
  };

  return (
    <div className="min-h-screen bg-main overflow-x-hidden">
      {/* Hero Section */}
      <div className="relative h-[350px] md:h-[450px] flex items-center justify-center overflow-hidden bg-[#050505] border-b border-white/5">
        {/* Neural Network Background Effect */}
        <div className="absolute inset-0 opacity-20 pointer-events-none">
          <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="syllabus-grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="red" strokeWidth="0.5" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#syllabus-grid)" />
          </svg>
        </div>

        {/* Premium Red Gradient & Ambient Glows */}
        <div className="absolute inset-0 bg-gradient-to-b from-red-600/10 via-[#050505]/80 to-[#050505]" />
        <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-red-600/20 blur-[120px] rounded-full pointer-events-none" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-red-900/10 blur-[120px] rounded-full pointer-events-none" />

        {/* Hero Content */}
        <div className="relative z-10 text-center px-6 max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-accent/10 border border-accent/20 text-accent text-sm font-bold mb-6 tracking-wide uppercase">
              Academic Library
            </span>
            <h1 className="text-5xl md:text-7xl font-black text-white mb-6 tracking-tight">
              Master Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent to-accent/60">Curriculum</span>
            </h1>
            <p className="text-lg md:text-xl text-secondary max-w-2xl mx-auto leading-relaxed">
              Access verified resources, structured notes, and priority-focused roadmaps for every subject in your engineering journey.
            </p>
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-10 pb-24 -mt-20 relative z-20">
        <div className="flex flex-col gap-10">
          
          {/* Search & Tool Bar Area */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-card/50 backdrop-blur-xl p-6 rounded-[2.5rem] border border-border-soft shadow-2xl">
            <div className="flex items-center gap-4">
               <div className="w-12 h-12 rounded-2xl bg-accent flex items-center justify-center text-white shadow-lg shadow-accent/20">
                  <Book className="w-6 h-6" />
               </div>
               <div>
                  <h2 className="text-xl font-bold text-primary tracking-tight">Browse Subjects</h2>
                  <p className="text-xs text-secondary font-medium">Find your course materials</p>
               </div>
            </div>

            <div className="relative w-full md:w-96">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-secondary" />
              <input 
                type="text" 
                placeholder="Search by name or code..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-surface border border-border-soft rounded-2xl pl-12 pr-4 py-4 text-primary focus:outline-none focus:border-accent transition-all shadow-inner"
              />
            </div>
          </div>

          {/* Subjects Grid */}
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3, 4, 5, 6].map(i => (
                <div key={i} className="h-[320px] bg-card/50 rounded-[2.5rem] animate-pulse border border-border-soft" />
              ))}
            </div>
          ) : filteredSubjects.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center bg-card/30 rounded-[3rem] border border-dashed border-border-soft">
               <div className="w-24 h-24 bg-surface rounded-full flex items-center justify-center mb-6 border border-border-soft shadow-xl">
                  <Search className="w-10 h-10 text-secondary/30" />
               </div>
               <h3 className="text-2xl font-bold text-primary">No subjects found</h3>
               <p className="text-secondary mt-2 max-w-xs mx-auto">We couldn't find any subjects matching your search. Try different keywords.</p>
            </div>
          ) : (
            <motion.div 
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              {filteredSubjects.map((subject) => (
                <motion.div key={subject._id} variants={itemVariants} className="group h-full">
                  <Link 
                    to={`/syllabus/${subject._id}`}
                    className="flex flex-col h-full bg-card rounded-[2.5rem] p-8 border border-border-soft transition-all duration-500 hover:border-accent/50 hover:shadow-[0_20px_50px_rgba(0,122,255,0.15)] hover:-translate-y-2 relative overflow-hidden active:scale-[0.98]"
                  >
                    {/* Glossy Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    
                    {/* Card Header */}
                    <div className="relative z-10 flex items-start justify-between mb-8">
                       <div className="flex items-center gap-4">
                          <div className="w-16 h-16 rounded-[1.5rem] bg-surface border border-border-soft flex items-center justify-center text-primary group-hover:bg-accent group-hover:text-white transition-all duration-500 shadow-xl group-hover:shadow-accent/40">
                             <BookOpen className="w-8 h-8" />
                          </div>
                          <div>
                             <span className="block text-xs font-black text-accent uppercase tracking-widest mb-1">{subject.code}</span>
                             <div className="flex items-center gap-2">
                                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-accent/10 text-accent border border-accent/20 uppercase">Year {subject.year}</span>
                                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white/5 text-secondary border border-white/5 uppercase">Eng.</span>
                             </div>
                          </div>
                       </div>
                    </div>

                    {/* Content */}
                    <div className="relative z-10 flex-1 mb-10">
                      <h3 className="text-2xl font-bold text-white leading-tight mb-4 group-hover:text-accent transition-colors">
                        {subject.name}
                      </h3>
                      <div className="flex items-center gap-3 text-secondary group-hover:text-primary transition-colors">
                        <div className="p-1.5 rounded-lg bg-surface border border-border-soft">
                          <Layers className="w-4 h-4" />
                        </div>
                        <span className="text-sm font-semibold">{subject.units ? subject.units.length : 0} Comprehensive Units</span>
                      </div>
                    </div>

                    {/* Footer / Progress */}
                    <div className="relative z-10 mt-auto pt-6 border-t border-white/5">
                      <div className="flex items-center justify-between text-xs font-bold mb-3 uppercase tracking-wider">
                         <span className="text-secondary">Course Progress</span>
                         <span className="text-accent">{subject.progress || 0}%</span>
                      </div>
                      <div className="w-full h-2.5 bg-surface rounded-full overflow-hidden border border-white/5 shadow-inner p-0.5">
                         <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: `${subject.progress || 0}%` }}
                            transition={{ duration: 1, ease: "easeOut" }}
                            className="h-full bg-gradient-to-r from-accent to-accent/60 rounded-full shadow-[0_0_10px_rgba(0,122,255,0.5)]"
                         />
                      </div>
                      
                      <div className="mt-6 flex items-center justify-center gap-2 text-xs font-bold text-accent opacity-0 group-hover:opacity-100 transition-all transform translate-y-2 group-hover:translate-y-0">
                        <span>START LEARNING</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
