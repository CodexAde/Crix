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
    <div className="p-4 md:p-10 max-w-7xl mx-auto min-h-screen">
      <div className="flex flex-col gap-8 pb-24 md:pb-10">
        
        {/* Header Section - Minimal */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-2">
            <h1 className="text-4xl md:text-5xl font-bold text-primary tracking-tight">Library</h1>
            <p className="text-secondary text-lg">Your academic collection.</p>
          </div>

          <div className="relative w-full md:w-96">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-secondary" />
            <input 
              type="text" 
              placeholder="Search by name or code..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-card border border-border-soft rounded-2xl pl-12 pr-4 py-4 text-primary focus:outline-none focus:border-accent transition-colors"
            />
          </div>
        </div>

        {/* Subjects Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-64 bg-card rounded-3xl animate-pulse border border-border-soft" />
            ))}
          </div>
        ) : filteredSubjects.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
             <div className="w-20 h-20 bg-card rounded-full flex items-center justify-center mb-4 border border-border-soft">
                <Book className="w-8 h-8 text-secondary" />
             </div>
             <h3 className="text-xl font-bold text-primary">No subjects found</h3>
             <p className="text-secondary mt-2">Try adjusting your search terms.</p>
          </div>
        ) : (
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6"
          >
            {filteredSubjects.map((subject) => (
              <motion.div key={subject._id} variants={itemVariants} className="group h-full">
                <Link 
                  to={`/syllabus/${subject._id}`}
                  className="flex flex-col h-full bg-card rounded-[2rem] p-6 border border-border-soft transition-all hover:border-accent/40 hover:shadow-lg active:scale-[0.99]"
                >
                  {/* Card Header */}
                  <div className="flex items-start justify-between mb-6">
                     <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-2xl bg-surface border border-border-soft flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-main transition-colors duration-300">
                           <BookOpen className="w-6 h-6" />
                        </div>
                        <div>
                           <span className="block text-xs font-bold text-secondary uppercase tracking-wider mb-0.5">{subject.code}</span>
                           <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-surface text-secondary border border-border-soft">Year {subject.year}</span>
                        </div>
                     </div>
                     <div className="w-8 h-8 rounded-full flex items-center justify-center text-secondary opacity-0 group-hover:opacity-100 transition-all -translate-x-2 group-hover:translate-x-0">
                        <ArrowRight className="w-5 h-5" />
                     </div>
                  </div>

                  {/* Content */}
                  <div className="flex-1 mb-8">
                    <h3 className="text-2xl font-bold text-primary leading-tight mb-2 group-hover:text-accent transition-colors">
                      {subject.name}
                    </h3>
                    <div className="flex items-center gap-2 text-sm text-secondary">
                      <Layers className="w-4 h-4" />
                      <span>{subject.units ? subject.units.length : 0} Units</span>
                    </div>
                  </div>

                  {/* Footer / Progress */}
                  <div className="mt-auto">
                    <div className="flex items-center justify-between text-xs font-semibold mb-2">
                       <span className="text-secondary">Progress</span>
                       <span className="text-primary">{subject.progress || 0}%</span>
                    </div>
                    <div className="w-full h-3 bg-surface rounded-full overflow-hidden border border-border-soft">
                       <div 
                          className="h-full bg-primary rounded-full"
                          style={{ width: `${subject.progress || 0}%` }}
                       />
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
}
