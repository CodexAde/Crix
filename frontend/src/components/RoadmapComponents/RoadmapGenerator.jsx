import { useState, useEffect, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2, Wand2, ChevronDown, Check, X, Search, BookOpen, Layers, CheckCircle2 } from 'lucide-react';
import { getSyllabusSubjects } from '../../services/roadmapServices';
import SyllabusContext from '../../context/Syllabus/SyllabusContext';
import { clsx } from 'clsx';

export default function RoadmapGenerator({ onGenerate, loading }) {
  const [selectedSubjectId, setSelectedSubjectId] = useState('');
  const [duration, setDuration] = useState(7);
  const [subjects, setSubjects] = useState([]);
  const [fetching, setFetching] = useState(true);
  
  const { activeSubjectData, loadingSubject, fetchSubjectData } = useContext(SyllabusContext);
  
  const [showSelector, setShowSelector] = useState(false);
  const [selectedChapters, setSelectedChapters] = useState([]);
  const [selectedTopics, setSelectedTopics] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        const data = await getSyllabusSubjects();
        setSubjects(data || []);
      } catch (error) {
        console.error("Error fetching subjects:", error);
      } finally {
        setFetching(false);
      }
    };
    fetchSubjects();
  }, []);

  const handleSubjectChange = (e) => {
    const subName = e.target.value;
    const sub = subjects.find(s => s.name === subName);
    if (sub) {
      setSelectedSubjectId(sub._id);
      fetchSubjectData(sub._id);
      // Reset selections when subject changes
      setSelectedChapters([]);
      setSelectedTopics([]);
    }
  };

  const toggleChapter = (chapterId, topics) => {
    if (selectedChapters.includes(chapterId)) {
      setSelectedChapters(prev => prev.filter(id => id !== chapterId));
      // Also unselect all topics of this chapter
      const topicIds = topics.map(t => t._id);
      setSelectedTopics(prev => prev.filter(id => !topicIds.includes(id)));
    } else {
      setSelectedChapters(prev => [...prev, chapterId]);
      // Also select all topics of this chapter
      const topicIds = topics.map(t => t._id);
      setSelectedTopics(prev => [...new Set([...prev, ...topicIds])]);
    }
  };

  const toggleTopic = (topicId, chapterId, siblings) => {
    if (selectedTopics.includes(topicId)) {
      setSelectedTopics(prev => prev.filter(id => id !== topicId));
      // If no topics left in this chapter, unselect chapter
      const remainingSelected = selectedTopics.filter(id => id !== topicId && siblings.some(s => s._id === id));
      if (remainingSelected.length === 0) {
        setSelectedChapters(prev => prev.filter(id => id !== chapterId));
      }
    } else {
      setSelectedTopics(prev => [...prev, topicId]);
      // Select chapter if not selected
      if (!selectedChapters.includes(chapterId)) {
        setSelectedChapters(prev => [...prev, chapterId]);
      }
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const sub = subjects.find(s => s._id === selectedSubjectId);
    onGenerate(sub.name, duration, selectedChapters, selectedTopics);
  };

  const selectedSubjectName = subjects.find(s => s._id === selectedSubjectId)?.name || '';

  return (
    <div className="max-w-xl mx-auto space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-6 md:p-10 rounded-[2rem] bg-card/80 backdrop-blur-xl border border-white/10 shadow-2xl relative overflow-hidden"
      >
        {/* Decorative Glow */}
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-accent/20 blur-[100px] rounded-full pointer-events-none" />

        <div className="mb-8 text-center relative z-10">
          <h3 className="text-2xl md:text-3xl font-bold text-primary mb-2 tracking-tight">
            Configure Roadmap
          </h3>
          <p className="text-secondary text-sm md:text-base font-medium opacity-80">
            Select a subject and customize your learning path.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8 relative z-10">
          <div>
            <label className="block text-xs font-bold text-accent uppercase tracking-[0.2em] mb-3 ml-1">
              Syllabus Subject
            </label>
            <div className="relative group">
              <select
                value={selectedSubjectName}
                onChange={handleSubjectChange}
                className="w-full px-6 py-4 rounded-2xl bg-white border-2 border-white/10 group-hover:border-white/20 focus:border-accent focus:outline-none text-black font-semibold transition-all appearance-none cursor-pointer shadow-sm"
                required
                disabled={fetching}
              >
                <option value="" disabled>
                  {fetching ? "Loading subjects..." : "Select a subject"}
                </option>
                {subjects.map((sub) => (
                  <option key={sub._id} value={sub.name}>
                    {sub.name}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-black/50 pointer-events-none group-hover:text-black transition-colors" />
            </div>
          </div>

          {selectedSubjectId && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="space-y-4"
            >
               <div className="flex items-center justify-between px-1">
                  <label className="block text-xs font-bold text-accent uppercase tracking-[0.2em]">
                    Autonomy Mode
                  </label>
                  <span className="text-[10px] bg-accent/10 px-2 py-0.5 rounded-full text-accent font-black uppercase tracking-widest">v2.1</span>
               </div>
               
               <button
                  type="button"
                  onClick={() => setShowSelector(true)}
                  className="w-full flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/10 hover:border-accent/40 hover:bg-accent/5 transition-all text-sm group"
               >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-accent/10 flex items-center justify-center text-accent">
                        <Layers className="w-4 h-4" />
                    </div>
                    <div className="text-left">
                        <p className="text-primary font-bold">Selective Selection</p>
                        <p className="text-[10px] text-secondary font-medium">
                          {selectedTopics.length > 0 
                            ? `${selectedTopics.length} topics selected across ${selectedChapters.length} chapters`
                            : "Select specific chapters & topics"
                          }
                        </p>
                    </div>
                  </div>
                  <ChevronDown className="w-4 h-4 text-secondary group-hover:text-primary transition-colors" />
               </button>
            </motion.div>
          )}

          <div>
            <label className="block text-xs font-bold text-accent uppercase tracking-[0.2em] mb-3 ml-1">
              Duration (Days)
            </label>
            <div className="flex items-center gap-6">
              <input
                type="range"
                min="1"
                max="7"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                className="flex-1 h-2 bg-white/5 rounded-lg appearance-none cursor-pointer accent-accent"
              />
              <div className="w-24 text-center">
                <span className="block text-2xl font-black text-accent tracking-tighter">
                  {duration}
                </span>
                <span className="text-[10px] text-secondary font-bold uppercase tracking-widest">Days</span>
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading || !selectedSubjectId}
            className="w-full flex items-center justify-center gap-3 py-5 bg-accent text-white rounded-2xl font-bold shadow-xl shadow-accent/20 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed text-lg"
          >
            {loading ? (
              <Loader2 className="w-6 h-6 animate-spin" />
            ) : (
              <Wand2 className="w-6 h-6" />
            )}
            {loading ? 'Generating Neural Path...' : 'Generate AI Roadmap'}
          </button>
        </form>
      </motion.div>

      {/* Selective Selection Modal */}
      <AnimatePresence>
        {showSelector && (
          <div className="fixed inset-0 z-[999] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowSelector(false)}
              className="fixed inset-0 bg-black/80 backdrop-blur-xl"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-2xl max-h-[85vh] bg-card/90 backdrop-blur-2xl rounded-[2.5rem] border border-white/10 shadow-2xl flex flex-col overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-8 border-b border-white/5">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-accent flex items-center justify-center shadow-lg shadow-accent/20">
                      <BookOpen className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-primary tracking-tight">Select Content</h3>
                      <p className="text-secondary text-sm font-medium">{selectedSubjectName}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setShowSelector(false)}
                    className="p-3 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/5 text-secondary transition-all"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-secondary" />
                  <input 
                    type="text"
                    placeholder="Search chapters or topics..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-11 pr-4 py-3.5 rounded-2xl bg-white/5 border border-white/5 focus:border-accent/40 focus:outline-none text-primary text-sm transition-all"
                  />
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-4 md:p-8 space-y-6 scrollbar-thin scrollbar-thumb-accent/20">
                {loadingSubject ? (
                  <div className="flex flex-col items-center justify-center py-20 gap-4">
                    <Loader2 className="w-8 h-8 text-accent animate-spin" />
                    <p className="text-secondary font-bold text-sm tracking-widest uppercase opacity-70">Fetching Syllabus...</p>
                  </div>
                ) : activeSubjectData?.units?.length > 0 ? (
                  activeSubjectData.units.map(unit => (
                    <div key={unit._id} className="space-y-4">
                      <div className="flex items-center gap-3 px-2">
                        <div className="h-px flex-1 bg-white/5" />
                        <span className="text-[10px] font-black text-accent uppercase tracking-[0.3em]">Unit {unit.unitNumber}</span>
                        <div className="h-px flex-1 bg-white/5" />
                      </div>
                      
                      <div className="grid gap-3">
                        {unit.chapters.map(chapter => {
                          const isChapterSelected = selectedChapters.includes(chapter._id);
                          const hasSearchMatch = chapter.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                                              chapter.topics.some(t => t.title.toLowerCase().includes(searchQuery.toLowerCase()));
                          
                          if (searchQuery && !hasSearchMatch) return null;

                          return (
                            <div key={chapter._id} className="group/chapter">
                              <div 
                                onClick={() => toggleChapter(chapter._id, chapter.topics)}
                                className={clsx(
                                  "flex items-center justify-between p-4 rounded-2xl border transition-all cursor-pointer",
                                  isChapterSelected 
                                    ? "bg-accent/10 border-accent/30" 
                                    : "bg-white/5 border-white/5 hover:bg-white/[0.08] hover:border-white/10"
                                )}
                              >
                                <div className="flex items-center gap-3 min-w-0">
                                  <div className={clsx(
                                    "w-5 h-5 rounded-md flex items-center justify-center border transition-all",
                                    isChapterSelected ? "bg-accent border-accent text-white" : "border-white/20"
                                  )}>
                                    {isChapterSelected && <Check className="w-3.5 h-3.5" />}
                                  </div>
                                  <span className={clsx(
                                    "text-sm font-bold truncate transition-colors",
                                    isChapterSelected ? "text-primary" : "text-secondary group-hover/chapter:text-primary"
                                  )}>
                                    {chapter.title}
                                  </span>
                                </div>
                                <span className="text-[10px] font-bold text-secondary px-2 py-1 rounded-lg bg-white/5">
                                  {chapter.topics.length} Topics
                                </span>
                              </div>

                              <div className="mt-2 ml-10 space-y-2">
                                {chapter.topics.map(topic => {
                                  if (searchQuery && !topic.title.toLowerCase().includes(searchQuery.toLowerCase()) && !chapter.title.toLowerCase().includes(searchQuery.toLowerCase())) return null;
                                  
                                  const isTopicSelected = selectedTopics.includes(topic._id);
                                  return (
                                    <div 
                                      key={topic._id}
                                      onClick={() => toggleTopic(topic._id, chapter._id, chapter.topics)}
                                      className={clsx(
                                        "flex items-center gap-3 p-3 rounded-xl border transition-all cursor-pointer group/topic",
                                        isTopicSelected
                                          ? "bg-white/5 border-accent/20"
                                          : "hover:bg-white/[0.04] border-transparent"
                                      )}
                                    >
                                      <div className={clsx(
                                        "w-4 h-4 rounded-full flex items-center justify-center border transition-all",
                                        isTopicSelected ? "bg-accent/40 border-accent text-white" : "border-white/10"
                                      )}>
                                        {isTopicSelected && <CheckCircle2 className="w-3 h-3" />}
                                      </div>
                                      <span className={clsx(
                                        "text-xs transition-colors",
                                        isTopicSelected ? "text-primary font-medium" : "text-secondary group-hover/topic:text-primary"
                                      )}>
                                        {topic.title}
                                      </span>
                                    </div>
                                  );
                                })}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="py-20 text-center opacity-50">Syllabus content not found.</div>
                )}
              </div>

              <div className="p-8 bg-black/20 border-t border-white/5 flex items-center justify-between">
                <div>
                  <p className="text-sm font-bold text-primary">{selectedTopics.length} Topics</p>
                  <p className="text-[10px] text-secondary font-medium uppercase tracking-widest">Across {selectedChapters.length} Chapters</p>
                </div>
                <button
                  onClick={() => setShowSelector(false)}
                  className="px-10 py-4 bg-accent text-white rounded-2xl font-bold shadow-lg shadow-accent/20 active:scale-95 transition-all text-sm"
                >
                  Confirm Selection
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
