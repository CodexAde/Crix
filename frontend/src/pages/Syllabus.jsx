import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Search, LibraryBig, Sparkles, Zap, TrendingUp, Award, Clock, LayoutGrid, LayoutList } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';

export default function Syllabus() {
  const [subjects, setSubjects] = useState([]);
  const [filteredSubjects, setFilteredSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'

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
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.08 }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.4, ease: "easeOut" }
    }
  };

  return (
    <div className="p-6 md:p-10 max-w-[1600px] mx-auto space-y-8 pb-24 md:pb-10">
      {/* Header */}
      <motion.header 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative flex flex-col md:flex-row md:items-center justify-between gap-6"
      >
        <div className="flex items-start gap-5">
          <div className="w-16 h-16 rounded-2xl bg-accent/10 flex items-center justify-center border border-accent/20 shadow-lg">
            <LibraryBig className="w-8 h-8 text-accent" />
          </div>
          
          <div>
            <h1 className="text-4xl font-bold text-primary mb-2">
              Complete Syllabus
            </h1>
            <p className="text-secondary flex items-center gap-2">
              <Zap className="w-4 h-4 text-accent" />
              Master every subject with structured learning paths
            </p>
          </div>
        </div>

        {/* View Mode Toggle */}
        <div className="flex items-center gap-2 bg-card border border-border-soft rounded-2xl p-1.5 shadow-soft">
          <button
            onClick={() => setViewMode('grid')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium text-sm transition-all ${
              viewMode === 'grid'
                ? 'bg-accent text-white shadow-md'
                : 'text-secondary hover:text-primary hover:bg-accent/5'
            }`}
          >
            <LayoutGrid className="w-4 h-4" />
            Grid
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium text-sm transition-all ${
              viewMode === 'list'
                ? 'bg-accent text-white shadow-md'
                : 'text-secondary hover:text-primary hover:bg-accent/5'
            }`}
          >
            <LayoutList className="w-4 h-4" />
            List
          </button>
        </div>
      </motion.header>

      {/* Search Bar */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="max-w-2xl"
      >
        <div className="flex items-center bg-card border border-border-soft rounded-2xl overflow-hidden shadow-soft hover:border-accent/50 transition-all">
          <Search className="ml-5 w-5 h-5 text-accent" />
          <input
            type="text"
            placeholder="Search subjects, codes, or keywords..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 px-4 py-4 bg-transparent text-primary placeholder:text-secondary focus:outline-none"
          />
          {searchQuery && (
            <motion.button
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              onClick={() => setSearchQuery('')}
              className="mr-4 px-3 py-1 bg-accent/10 hover:bg-accent/20 text-accent rounded-lg text-sm font-medium transition-all"
            >
              Clear
            </motion.button>
          )}
        </div>
      </motion.div>

      {/* Stats Bar */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="flex flex-wrap gap-4"
      >
        {[
          { icon: BookOpen, label: 'Total Subjects', value: subjects.length, color: 'text-accent' },
          { icon: TrendingUp, label: 'In Progress', value: subjects.filter(s => s.progress > 0 && s.progress < 100).length, color: 'text-emerald-500' },
          { icon: Award, label: 'Completed', value: subjects.filter(s => s.progress === 100).length, color: 'text-purple-500' },
        ].map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 + i * 0.1 }}
            className="flex items-center gap-3 px-5 py-3 bg-card border border-border-soft rounded-2xl shadow-soft hover:shadow-md transition-all hover:-translate-y-0.5"
          >
            <div className="p-2 rounded-xl bg-accent/10">
              <stat.icon className={`w-5 h-5 ${stat.color}`} />
            </div>
            <div>
              <p className="text-xs text-secondary">{stat.label}</p>
              <p className="text-xl font-bold text-primary">{stat.value}</p>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Subjects Display */}
      {loading ? (
        <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-4'}>
          {[1, 2, 3, 4, 5, 6].map(i => (
            <div key={i} className={`rounded-2xl bg-border-soft/50 animate-pulse ${viewMode === 'grid' ? 'h-80' : 'h-32'}`} />
          ))}
        </div>
      ) : filteredSubjects.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center py-20"
        >
          <div className="w-24 h-24 rounded-full bg-accent/10 flex items-center justify-center mx-auto mb-6">
            <Search className="w-12 h-12 text-accent/50" />
          </div>
          <h3 className="text-2xl font-bold text-primary mb-2">No subjects found</h3>
          <p className="text-secondary">Try searching with different keywords</p>
        </motion.div>
      ) : (
        <AnimatePresence mode="wait">
          {viewMode === 'grid' ? (
            <motion.div
              key="grid"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {filteredSubjects.map((subject, index) => (
                <motion.div
                  key={subject._id}
                  variants={cardVariants}
                  whileHover={{ y: -6 }}
                  className="group"
                >
                  <Link
                    to={`/syllabus/${subject._id}`}
                    className="block h-full bg-card rounded-2xl border border-border-soft shadow-soft hover:shadow-strong hover:border-accent/30 transition-all overflow-hidden"
                  >
                    {/* Image Header */}
                    {subject.image && (
                      <div className="relative w-full h-48 overflow-hidden bg-accent/5">
                        <motion.img
                          src={subject.image}
                          alt={subject.name}
                          className="w-full h-full object-cover opacity-70 group-hover:opacity-90 group-hover:scale-105 transition-all duration-500"
                        />
                        <div className="absolute inset-0 bg-black/20" />
                        
                        {/* Code Badge */}
                        <div className="absolute top-4 right-4 px-3 py-1.5 bg-white/90 backdrop-blur-sm rounded-xl shadow-lg">
                          <span className="text-xs font-bold text-gray-900">{subject.code}</span>
                        </div>

                        {/* Year Badge */}
                        <div className="absolute top-4 left-4 px-3 py-1 bg-black/40 backdrop-blur-sm rounded-lg">
                          <span className="text-xs font-semibold text-white">Year {subject.year}</span>
                        </div>
                      </div>
                    )}

                    {/* Content */}
                    <div className="p-6 space-y-4">
                      <div>
                        <h3 className="text-xl font-bold text-primary group-hover:text-accent transition-colors line-clamp-2 mb-2">
                          {subject.name}
                        </h3>
                        
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="px-3 py-1 bg-accent/10 text-accent rounded-lg text-xs font-bold border border-accent/20">
                            {subject.branch}
                          </span>
                          {subject.units && (
                            <span className="px-3 py-1 bg-card border border-border-soft text-secondary rounded-lg text-xs font-semibold">
                              {subject.units.length} Units
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Progress */}
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs font-medium text-secondary">Progress</span>
                          <span className="text-sm font-bold text-accent">
                            {subject.progress || 0}%
                          </span>
                        </div>
                        <div className="h-2 rounded-full bg-border-soft overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${subject.progress || 0}%` }}
                            transition={{ duration: 1, ease: "easeOut", delay: index * 0.05 }}
                            className="h-full bg-accent rounded-full"
                          />
                        </div>
                      </div>

                      {/* CTA */}
                      <div className="flex items-center justify-between pt-3 border-t border-border-soft">
                        <span className="text-sm font-semibold text-secondary group-hover:text-accent transition-colors">
                          Explore Syllabus
                        </span>
                        <Sparkles className="w-5 h-5 text-accent opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <motion.div
              key="list"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="space-y-4"
            >
              {filteredSubjects.map((subject, index) => (
                <motion.div
                  key={subject._id}
                  variants={cardVariants}
                  whileHover={{ x: 4 }}
                >
                  <Link
                    to={`/syllabus/${subject._id}`}
                    className="group block"
                  >
                    <div className="flex items-center gap-6 p-6 bg-card rounded-2xl border border-border-soft shadow-soft hover:shadow-strong hover:border-accent/30 transition-all">
                      {/* Thumbnail */}
                      {subject.image && (
                        <div className="relative w-24 h-24 rounded-xl overflow-hidden shrink-0 bg-accent/5">
                          <img 
                            src={subject.image} 
                            alt={subject.name} 
                            className="w-full h-full object-cover opacity-70 group-hover:scale-110 group-hover:opacity-90 transition-all duration-500" 
                          />
                        </div>
                      )}

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-4 mb-3">
                          <div>
                            <h3 className="text-lg font-bold text-primary group-hover:text-accent transition-colors mb-1">
                              {subject.name}
                            </h3>
                            <div className="flex items-center gap-2 text-xs text-secondary">
                              <span className="px-2.5 py-1 bg-accent/10 text-accent rounded-lg font-semibold border border-accent/20">
                                {subject.code}
                              </span>
                              <span>•</span>
                              <span>{subject.branch}</span>
                              <span>•</span>
                              <span>Year {subject.year}</span>
                              {subject.units && (
                                <>
                                  <span>•</span>
                                  <span>{subject.units.length} Units</span>
                                </>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Progress Bar */}
                        <div className="flex items-center gap-4">
                          <div className="flex-1">
                            <div className="h-2 rounded-full bg-border-soft overflow-hidden">
                              <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${subject.progress || 0}%` }}
                                transition={{ duration: 1, delay: index * 0.03 }}
                                className="h-full bg-accent rounded-full"
                              />
                            </div>
                          </div>
                          <span className="text-sm font-bold text-accent min-w-[3rem] text-right">
                            {subject.progress || 0}%
                          </span>
                        </div>
                      </div>

                      {/* Action */}
                      <Sparkles className="w-6 h-6 text-accent opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                  </Link>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      )}
    </div>
  );
}
