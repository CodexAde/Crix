import { useEffect, useState, useContext } from 'react';
import { useAuth } from '../context/AuthContext';
import SubjectContext from '../context/Subject/SubjectContext';
import { Flame, Brain, BookMarked, ArrowRight, Sparkles, Clock, Target, TrendingUp, BookOpen, GraduationCap, Zap, ChevronRight, Lightbulb, Plus, GripVertical } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { motion, Reorder } from 'framer-motion';

export default function Dashboard() {
  const { user } = useAuth();
  const { userSubjects, loadingSubjects, reorderSubjects } = useContext(SubjectContext);
  const [stats, setStats] = useState({ topicsMastered: 0, activeDoubts: 0, streak: 1 });
  const [loadingStats, setLoadingStats] = useState(true);
  const [lastSession, setLastSession] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Load last session from localStorage
    const savedSession = localStorage.getItem('crix_last_session');
    if (savedSession) {
        try {
            setLastSession(JSON.parse(savedSession));
        } catch (e) {
            console.error("Failed to parse last session", e);
        }
    }

    const fetchStats = async () => {
        try {
            const statsRes = await axios.get('/progress/stats');
            setStats(statsRes.data);
        } catch (error) {
            console.error("Failed to fetch dashboard data", error);
        } finally {
            setLoadingStats(false);
        }
    }
    fetchStats();
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } }
  };

  const loading = loadingSubjects || loadingStats;

  const AddSubjectCard = () => (
    <motion.div
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => navigate('/syllabus')}
        className="w-full md:min-w-[280px] md:w-[280px] h-32 md:h-40 flex flex-col items-center justify-center bg-card rounded-[2rem] border-2 border-dashed border-border-soft hover:border-accent hover:bg-accent/5 cursor-pointer transition-all group shrink-0"
    >
        <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-surface border border-border-soft group-hover:border-accent group-hover:bg-accent group-hover:text-white flex items-center justify-center text-secondary transition-all mb-2 md:mb-3 shadow-sm">
            <Plus className="w-5 h-5 md:w-6 md:h-6" />
        </div>
        <span className="text-xs md:text-sm font-bold text-secondary group-hover:text-primary transition-colors">Add New Subject</span>
    </motion.div>
  );

  return (
    <motion.div 
      className="p-4 md:p-10 max-w-7xl mx-auto space-y-8 pb-28 md:pb-10"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Header */}
      <motion.header variants={itemVariants} className="flex items-center justify-between">
        <div>
           <p className="text-secondary text-sm font-medium mb-0.5">Welcome back,</p>
           <h1 className="text-2xl font-bold text-primary">{user?.name?.split(' ')[0]}</h1>
        </div>
        <Link to="/user-profile" className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center border border-accent/20">
            {user?.avatar ? (
                <img src={user.avatar} alt="Profile" className="w-full h-full object-cover rounded-full" />
            ) : (
                <Sparkles className="w-5 h-5 text-accent" />
            )}
        </Link>
      </motion.header>

      {/* HERO: Today's Focus */}
      <motion.section variants={itemVariants}>
        <div className="bg-card rounded-[2rem] p-6 md:p-8 shadow-sm border border-border-soft relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-6 opacity-[0.03] md:group-hover:opacity-[0.08] transition-opacity">
                <Target className="w-32 h-32 text-primary" />
            </div>
            
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-4">
               <span className="px-3 py-1 bg-accent text-white text-[10px] font-bold uppercase tracking-wider rounded-full">
                  Today's Focus
               </span>
               <span className="text-xs text-secondary font-medium">• 25 min remaining</span>
            </div>

            <h2 className="text-3xl md:text-5xl font-bold text-primary leading-tight mb-3 line-clamp-1 tracking-tight">
              {lastSession?.topicTitle || 'Calculus' /* Defaulting to something generic if no session */}
            </h2>
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mb-8">
              <p className="text-accent font-semibold text-sm md:text-base line-clamp-1">
                {lastSession?.subjectName || (userSubjects[0]?.name || 'Select a subject to start')}
              </p>
              {lastSession?.unitTitle && (
                  <>
                  <span className="w-1 h-1 rounded-full bg-border-soft hidden md:block" />
                  <p className="text-secondary text-sm md:text-base line-clamp-1">
                    {lastSession.unitTitle}
                  </p>
                  </>
              )}
            </div>

            <Link 
              to={lastSession ? `/chat/${lastSession.subjectId}/${lastSession.chapterId}/${lastSession.topicId}` : (userSubjects[0]?._id ? `/syllabus/${userSubjects[0]._id}` : '/syllabus')} 
              className="inline-flex items-center gap-2 px-8 py-4 bg-primary text-main rounded-2xl font-bold text-sm hover:opacity-90 active:scale-[0.98] transition-all shadow-lg shadow-primary/10"
            >
              {lastSession ? 'Resume Chat' : 'Start Learning'} <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </motion.section>

      {/* Action Row */}
      <motion.div variants={itemVariants} className="flex items-center justify-around md:grid md:grid-cols-3 md:gap-6 px-2 md:px-0">
         <Link to="/add-chapters" className="flex flex-col md:flex-row items-center md:justify-start gap-2 md:gap-4 group md:bg-card md:p-4 md:rounded-2xl md:border md:border-border-soft md:hover:border-accent/40 md:hover:shadow-lg md:hover:shadow-accent/5 md:transition-all">
            <div className="w-16 h-16 md:w-12 md:h-12 rounded-[1.2rem] md:rounded-xl bg-card md:bg-accent/10 border border-border-soft md:border-transparent flex items-center justify-center shadow-sm md:shadow-none transition-all text-accent group-hover:scale-105">
               <Sparkles className="w-7 h-7 md:w-6 md:h-6" />
            </div>
            <div className="text-center md:text-left">
                <span className="text-xs md:text-base font-bold text-secondary md:text-primary group-hover:text-accent transition-colors block leading-none">Generate</span>
                <span className="hidden md:block text-[10px] text-secondary mt-0.5">Explore new topics</span>
            </div>
         </Link>

         <Link to="/syllabus" className="flex flex-col md:flex-row items-center md:justify-start gap-2 md:gap-4 group md:bg-card md:p-4 md:rounded-2xl md:border md:border-border-soft md:hover:border-blue-500/40 md:hover:shadow-lg md:hover:shadow-blue-500/5 md:transition-all">
            <div className="w-16 h-16 md:w-12 md:h-12 rounded-[1.2rem] md:rounded-xl bg-card md:bg-blue-500/10 border border-border-soft md:border-transparent flex items-center justify-center shadow-sm md:shadow-none transition-all text-blue-500 group-hover:scale-105">
               <BookOpen className="w-7 h-7 md:w-6 md:h-6" />
            </div>
             <div className="text-center md:text-left">
                <span className="text-xs md:text-base font-bold text-secondary md:text-primary group-hover:text-blue-500 transition-colors block leading-none">Library</span>
                <span className="hidden md:block text-[10px] text-secondary mt-0.5">Your study materials</span>
            </div>
         </Link>

         <Link to="/user-profile" className="flex flex-col md:flex-row items-center md:justify-start gap-2 md:gap-4 group md:bg-card md:p-4 md:rounded-2xl md:border md:border-border-soft md:hover:border-purple-500/40 md:hover:shadow-lg md:hover:shadow-purple-500/5 md:transition-all">
            <div className="w-16 h-16 md:w-12 md:h-12 rounded-[1.2rem] md:rounded-xl bg-card md:bg-purple-500/10 border border-border-soft md:border-transparent flex items-center justify-center shadow-sm md:shadow-none transition-all text-purple-500 group-hover:scale-105">
               <GraduationCap className="w-7 h-7 md:w-6 md:h-6" />
            </div>
             <div className="text-center md:text-left">
                <span className="text-xs md:text-base font-bold text-secondary md:text-primary group-hover:text-purple-500 transition-colors block leading-none">Profile</span>
                <span className="hidden md:block text-[10px] text-secondary mt-0.5">Track your journey</span>
            </div>
         </Link>
      </motion.div>

      {/* Subjects Section */}
      <motion.section variants={itemVariants} className="overflow-hidden">
        <div className="flex items-center justify-between mb-4 px-1">
          <h2 className="text-lg font-bold text-primary">Your Subjects</h2>
          {userSubjects.length > 0 && (
            <Link to="/my-subjects" className="text-xs font-semibold text-accent hover:underline">
                View All
            </Link>
          )}
        </div>
        
        {loading ? (
          <div className="grid grid-cols-1 md:flex md:gap-4 gap-4 overflow-hidden md:overflow-x-auto pb-4 hide-scrollbar">
            {[1,2,3,4].map(i => (
              <div key={i} className="w-full md:min-w-[280px] h-32 md:h-40 bg-surface rounded-[2rem] animate-pulse border border-border-soft" />
            ))}
          </div>
        ) : (
          <div className="relative">
              {/* Desktop: Horizontal Scroll + Reorder */}
              <div className="hidden md:flex items-start gap-4 overflow-x-auto pb-4 hide-scrollbar md:mx-0 md:px-0">
                  <AddSubjectCard />
                   {userSubjects.length > 0 && (
                       <Reorder.Group 
                            axis="x" 
                            values={userSubjects} 
                            onReorder={reorderSubjects}
                            className="flex gap-4"
                        >
                            {userSubjects.map((subject) => (
                                <Reorder.Item key={subject._id} value={subject} className="shrink-0">
                                    <div 
                                        onClick={() => navigate(`/syllabus/${subject._id}`)}
                                        className="min-w-[280px] w-[280px] h-40 bg-card rounded-[2rem] p-6 border border-border-soft hover:border-accent/30 hover:shadow-lg hover:shadow-accent/5 transition-all relative group cursor-pointer"
                                    >
                                        <div className="flex items-start justify-between mb-4">
                                            <span className="text-[10px] font-bold text-accent bg-accent/10 border border-accent/20 px-2.5 py-1 rounded-full uppercase tracking-wider">
                                                {subject.code}
                                            </span>
                                            <div className="p-1 text-secondary/30 hover:text-secondary cursor-grab active:cursor-grabbing">
                                               <GripVertical className="w-4 h-4" />
                                            </div>
                                        </div>

                                        <h3 className="text-lg font-bold text-primary mb-1 line-clamp-1">{subject.name}</h3>
                                        <p className="text-xs text-secondary mb-4 line-clamp-1">{subject.branch} • Year {subject.year}</p>

                                        <div className="w-full bg-surface h-1.5 rounded-full overflow-hidden border border-border-soft/50">
                                            <div 
                                                className="bg-primary h-full rounded-full transition-all duration-300" 
                                                style={{ width: `${subject.progress || 0}%` }}
                                            />
                                        </div>
                                    </div>
                                </Reorder.Item>
                            ))}
                       </Reorder.Group>
                   )}
              </div>

              {/* Mobile: Vertical List (Simple) */}
              <div className="flex md:hidden flex-col gap-4 px-1">
                  <AddSubjectCard />
                  {userSubjects.map((subject) => (
                      <div 
                        key={subject._id}
                        onClick={() => navigate(`/syllabus/${subject._id}`)}
                        className="w-full bg-card rounded-[1.5rem] p-4 border border-border-soft active:scale-[0.98] transition-all shadow-sm flex items-center gap-4"
                      >
                          <div className="w-12 h-12 rounded-xl bg-surface flex items-center justify-center text-accent shrink-0 border border-border-soft">
                               <BookOpen className="w-6 h-6" />
                          </div>
                          <div className="flex-1 min-w-0">
                               <div className="flex items-center justify-between mb-0.5">
                                   <h3 className="text-sm font-bold text-primary truncate">{subject.name}</h3>
                                   <span className="text-[8px] font-bold text-accent px-1.5 py-0.5 bg-accent/10 rounded-full uppercase">{subject.code}</span>
                               </div>
                               <div className="flex items-center gap-2 mb-2">
                                    <p className="text-[10px] text-secondary truncate">{subject.branch} • Year {subject.year}</p>
                               </div>
                               <div className="w-full bg-surface h-1 rounded-full overflow-hidden border border-border-soft/30">
                                    <div 
                                        className="bg-primary h-full rounded-full transition-all duration-300" 
                                        style={{ width: `${subject.progress || 0}%` }}
                                    />
                                </div>
                          </div>
                          <ChevronRight className="w-4 h-4 text-secondary/40" />
                      </div>
                  ))}
              </div>
          </div>
        )}
      </motion.section>
    </motion.div>
  );
}
