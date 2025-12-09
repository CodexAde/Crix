import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Search, Filter, LibraryBig, ChevronRight, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import axios from 'axios';

export default function Syllabus() {
  const [subjects, setSubjects] = useState([]);
  const [filteredSubjects, setFilteredSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBranch, setSelectedBranch] = useState('ALL');

  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        const response = await axios.get('/syllabus');
        setSubjects(response.data.subjects || []);
        setFilteredSubjects(response.data.subjects || []);
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

    // Branch filter
    if (selectedBranch !== 'ALL') {
      filtered = filtered.filter(s => s.branch === selectedBranch);
    }

    // Search filter
    if (searchQuery.trim()) {
      filtered = filtered.filter(s => 
        s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.code.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredSubjects(filtered);
  }, [searchQuery, selectedBranch, subjects]);

  const branches = ['ALL', ...new Set(subjects.map(s => s.branch))];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.08 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } }
  };

  return (
    <div className="p-6 md:p-10 max-w-7xl mx-auto space-y-8 pb-24 md:pb-10">
      {/* Header */}
      <motion.header 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative"
      >
        <div className="flex items-center gap-4 mb-2">
          <div className="w-14 h-14 rounded-2xl bg-accent/10 flex items-center justify-center border border-accent/20">
            <LibraryBig className="w-7 h-7 text-accent" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-primary">Complete Syllabus</h1>
            <p className="text-secondary mt-0.5">Explore all subjects and their detailed curriculum</p>
          </div>
        </div>
      </motion.header>

      {/* Search & Filter Bar */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="flex flex-col md:flex-row gap-4"
      >
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-secondary" />
          <input
            type="text"
            placeholder="Search subjects by name or code..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3.5 bg-card border border-border-soft rounded-2xl text-primary placeholder:text-secondary focus:outline-none focus:border-accent/50 transition-all"
          />
        </div>

        {/* Branch Filter */}
        {/* <div className="flex items-center gap-2 bg-card border border-border-soft rounded-2xl p-1.5 overflow-x-auto">
          {branches.map((branch) => (
            <button
              key={branch}
              onClick={() => setSelectedBranch(branch)}
              className={`px-4 py-2 rounded-xl font-medium text-sm transition-all whitespace-nowrap ${
                selectedBranch === branch
                  ? 'bg-accent text-white shadow-md'
                  : 'text-secondary hover:text-primary hover:bg-accent/5'
              }`}
            >
              {branch}
            </button>
          ))}
        </div> */}
      </motion.div>

      {/* Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="flex items-center gap-6 text-sm"
      >
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-accent" />
          <span className="text-secondary">
            Showing <span className="font-bold text-primary">{filteredSubjects.length}</span> of{' '}
            <span className="font-bold text-primary">{subjects.length}</span> subjects
          </span>
        </div>
      </motion.div>

      {/* Subjects Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <div key={i} className="h-64 bg-border-soft rounded-[1.5rem] animate-pulse" />
          ))}
        </div>
      ) : filteredSubjects.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center py-16"
        >
          <div className="w-20 h-20 rounded-full bg-accent/10 flex items-center justify-center mx-auto mb-4">
            <Search className="w-10 h-10 text-accent/50" />
          </div>
          <h3 className="text-xl font-bold text-primary mb-2">No subjects found</h3>
          <p className="text-secondary">Try adjusting your search or filters</p>
        </motion.div>
      ) : (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {filteredSubjects.map((subject) => (
<motion.div
  key={subject._id}
  variants={itemVariants}
  whileHover={{ scale: 1.02 }}
  className="relative h-full"
>
  <Link
    to={`/syllabus/${subject._id}`}
    className="group relative block h-full bg-card/90 backdrop-blur-xl rounded-[1.75rem] p-6 border border-border-soft shadow-soft hover:shadow-strong transition-all overflow-hidden hover:-translate-y-1.5"
  >
    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity bg-gradient-to-br from-accent/10 via-transparent to-accent/5" />

    {subject.image && (
      <div className="relative w-full h-36 rounded-2xl overflow-hidden mb-4 bg-gradient-to-br from-accent/30 to-accent/10">
        <img
          src={subject.image}
          alt={subject.name}
          className="w-full h-full object-cover scale-105 opacity-70 group-hover:scale-110 group-hover:opacity-90 transition-all duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
        <span className="absolute top-3 right-3 text-xs font-bold text-white bg-accent/90 px-3 py-1 rounded-xl shadow-xl backdrop-blur">
          {subject.code}
        </span>
      </div>
    )}

    <div className="space-y-4 relative z-10">
      <div>
        <h3 className="text-lg font-bold text-primary group-hover:text-accent transition-colors line-clamp-2 mb-1 tracking-tight">
          {subject.name}
        </h3>
        <div className="flex flex-wrap items-center gap-2 text-xs text-secondary">
          <span className="px-2.5 py-1 bg-accent/10 text-accent rounded-lg font-semibold">
            {subject.branch}
          </span>
          <span className="opacity-50">•</span>
          <span>Year {subject.year}</span>
          {subject.units && (
            <>
              <span className="opacity-50">•</span>
              <span>{subject.units.length} Units</span>
            </>
          )}
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between text-xs mb-2">
          <span className="text-secondary">Progress</span>
          <span className="font-bold text-accent">
            {subject.progress || 0}%
          </span>
        </div>
        <div className="w-full h-2 rounded-full bg-border-soft overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${subject.progress || 0}%` }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="h-full bg-gradient-to-r from-accent to-accent/70 rounded-full shadow-[0_0_12px_rgba(99,102,241,0.5)]"
          />
        </div>
      </div>

      <div className="flex items-center justify-between pt-3 border-t border-border-soft">
        <span className="text-xs font-semibold text-secondary group-hover:text-accent transition-colors">
          View Details
        </span>
        <ChevronRight className="w-4 h-4 text-accent transition-transform group-hover:translate-x-1.5" />
      </div>
    </div>
  </Link>
</motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
}
