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
        <div className="bg-card rounded-[2.5rem] p-8 md:p-12 shadow-sm border border-border-soft relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-8 opacity-[0.03] md:group-hover:opacity-[0.08] transition-opacity">
                <Target className="w-40 h-40 text-primary" />
            </div>
            
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-6">
               <span className="px-3 py-1 bg-accent text-white text-[10px] font-bold uppercase tracking-wider rounded-full shadow-lg shadow-accent/20">
                  {lastSession ? "Today's Focus" : "Start Your Journey"}
               </span>
               <span className="text-xs text-secondary font-medium tracking-tight opacity-70">
                 {lastSession ? "• 25 min remaining" : "• Instant Learning Available"}
               </span>
            </div>

            {!lastSession ? (
              <>
                <h2 className="text-4xl md:text-6xl font-extrabold text-primary leading-[1.1] mb-6 tracking-tighter">
                  {userSubjects.length > 0 
                    ? <>Dive into <span className="text-accent">{userSubjects[0].name.split(' ')[0]}</span></>
                    : <>Build your <span className="text-accent">Global Library</span></>
                  }
                </h2>
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mb-10">
                  <p className="text-secondary text-base md:text-xl font-medium max-w-xl leading-relaxed opacity-80">
                    {userSubjects.length > 0 
                      ? "You have subjects ready. Pick a topic and start your AI-powered interactive learning session now."
                      : "Your library is empty. Discover subjects from the global database and start generating your neural paths."
                    }
                  </p>
                </div>
                
                <Link 
                  to={userSubjects.length > 0 ? `/syllabus/${userSubjects[0]._id}` : '/syllabus'} 
                  className="inline-flex items-center gap-3 px-10 py-5 bg-primary text-main rounded-[1.5rem] font-bold text-base hover:opacity-90 active:scale-[0.98] transition-all shadow-xl shadow-primary/10 group/btn"
                >
                  {userSubjects.length > 0 ? 'Start Learning' : 'Explore Library'} 
                  <ArrowRight className="w-5 h-5 group-hover/btn:translate-x-1 transition-transform" />
                </Link>
              </>
            ) : (
              <>
                <h2 className="text-4xl md:text-6xl font-extrabold text-primary leading-[1.1] mb-4 line-clamp-1 tracking-tighter">
                  {lastSession.topicTitle}
                </h2>
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mb-10">
                  <p className="text-accent font-bold text-lg md:text-2xl tracking-tight">
                    {lastSession.subjectName}
                  </p>
                  {lastSession.unitTitle && (
                      <>
                      <span className="w-1.5 h-1.5 rounded-full bg-border-soft hidden md:block" />
                      <p className="text-secondary text-lg md:text-xl font-medium tracking-tight opacity-70">
                        {lastSession.unitTitle}
                      </p>
                      </>
                  )}
                </div>

                <Link 
                  to={`/chat/${lastSession.subjectId}/${lastSession.chapterId}/${lastSession.topicId}`} 
                  className="inline-flex items-center gap-3 px-10 py-5 bg-primary text-main rounded-[1.5rem] font-bold text-base hover:opacity-90 active:scale-[0.98] transition-all shadow-xl shadow-primary/10 group/btn"
                >
                  Resume Chat <ArrowRight className="w-5 h-5 group-hover/btn:translate-x-1 transition-transform" />
                </Link>
              </>
            )}
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
        <div className="flex items-center justify-between mb-4 md:mb-6 px-1">
          <div className="flex flex-col">
            <h2 className="text-xl font-bold text-primary tracking-tight">Your Subjects</h2>
            <p className="text-[10px] text-secondary font-medium uppercase tracking-widest opacity-60">Neural Library</p>
          </div>
          
          <div className="flex items-center gap-3">
            {userSubjects.length > 0 && (
              <Link to="/my-subjects" className="text-xs font-bold text-secondary hover:text-primary transition-colors">
                  View All
              </Link>
            )}
            <button 
                onClick={() => navigate('/syllabus')}
                className="w-10 h-10 rounded-full bg-card flex items-center justify-center text-primary shadow-[0_4px_12px_rgba(0,0,0,0.1)] hover:scale-105 active:scale-95 transition-all"
                title="Add New Subject"
            >
                <Plus className="w-5 h-5" />
            </button>
          </div>
        </div>
        
        {loading ? (
          <div className="grid grid-cols-1 md:flex md:gap-4 gap-4 overflow-hidden md:overflow-x-auto pb-4 hide-scrollbar">
            {[1,2,3,4].map(i => (
              <div key={i} className="w-full md:min-w-[280px] h-32 md:h-40 bg-surface rounded-[2rem] animate-pulse border border-border-soft" />
            ))}
          </div>
        ) : userSubjects.length === 0 ? (
            <div 
                onClick={() => navigate('/syllabus')}
                className="bg-card rounded-[2.5rem] p-10 flex flex-col items-center justify-center text-center border border-border-soft hover:border-accent/30 transition-all cursor-pointer group"
            >
                <div className="w-20 h-20 rounded-full bg-surface flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                    <BookOpen className="w-10 h-10 text-secondary/30" />
                </div>
                <h3 className="text-xl font-bold text-primary mb-2">No Subjects Added</h3>
                <p className="text-sm text-secondary/60 max-w-xs mx-auto mb-8 leading-relaxed">Your library is empty. Start your journey by adding subjects from the global database.</p>
                <div className="px-8 py-3 bg-accent text-white rounded-full font-bold text-sm shadow-lg shadow-accent/20 group-hover:shadow-accent/30 transition-all">
                    Browse Library
                </div>
            </div>
        ) : (
          <div className="relative">
              {/* Desktop: Horizontal Scroll + Reorder */}
              <div className="hidden md:flex items-start gap-4 overflow-x-auto pb-4 hide-scrollbar md:mx-0 md:px-0">
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
                                        className="min-w-[280px] w-[280px] h-40 bg-card rounded-[2.5rem] p-6 border border-border-soft hover:border-accent/30 hover:shadow-lg hover:shadow-accent/5 transition-all relative group cursor-pointer"
                                    >
                                        <div className="flex items-start justify-between mb-4">
                                            <div className="flex flex-col gap-1">
                                                <span className="text-[10px] font-black text-white bg-accent px-2.5 py-1 rounded-md uppercase tracking-wider shadow-sm">
                                                    {subject.code}
                                                </span>
                                            </div>
                                            <div className="p-1 text-secondary/30 hover:text-secondary cursor-grab active:cursor-grabbing">
                                               <GripVertical className="w-4 h-4" />
                                            </div>
                                        </div>

                                        <h3 className="text-lg font-bold text-primary mb-1 line-clamp-1">{subject.name}</h3>
                                        <p className="text-xs text-secondary/60 font-semibold mb-4 line-clamp-1">{subject.branch || 'B.Tech'} • Year {subject.year || 1}</p>

                                        {/* <div className="w-full bg-surface h-2 rounded-full overflow-hidden border border-border-soft/50 shadow-inner">
                                            <motion.div 
                                                initial={{ width: 0 }}
                                                animate={{ width: `${subject.progress || 0}%` }}
                                                transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                                                className="bg-gradient-to-r from-accent to-accent-hover h-full rounded-full transition-all duration-300 shadow-[0_0_12px_rgba(239,68,68,0.2)]" 
                                            />
                                        </div> */}
                                    </div>
                                </Reorder.Item>
                            ))}
                       </Reorder.Group>
                   )}
              </div>

              {/* Mobile: Vertical List (Simple) */}
              <div className="flex md:hidden flex-col gap-4 px-1">
                  {userSubjects.map((subject) => (
                      <div 
                        key={subject._id}
                        onClick={() => navigate(`/syllabus/${subject._id}`)}
                        className="w-full bg-card rounded-[2rem] p-5 border border-border-soft active:scale-[0.98] transition-all shadow-sm flex items-center gap-5"
                      >
                          <div className="w-14 h-14 rounded-2xl bg-surface flex items-center justify-center text-accent shrink-0 border border-border-soft shadow-inner">
                               <BookOpen className="w-7 h-7" />
                          </div>
                           <div className="flex-1 min-w-0">
                               <div className="flex items-start justify-between mb-1">
                                   <h3 className="text-base font-bold text-primary truncate tracking-tight pr-2">
                                       {subject.name}
                                   </h3>
                                   <span className="shrink-0 text-[8px] font-black text-white px-2 py-0.5 bg-accent rounded-md uppercase tracking-wider shadow-sm">
                                       {subject.code}
                                   </span>
                               </div>
                               <div className="flex items-center gap-2 mb-3">
                                    <p className="text-[10px] text-secondary/70 font-semibold tracking-tight truncate">
                                        {subject.branch || 'General'} • Year {subject.year || 1}
                                    </p>
                               </div>
                               {/* <div className="w-full bg-surface h-2.5 rounded-full overflow-hidden border border-border-soft/20 shadow-inner">
                                    <motion.div 
                                        initial={{ width: 0 }}
                                        animate={{ width: `${subject.progress || 0}%` }}
                                        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                                        className="bg-gradient-to-r from-accent to-accent-hover h-full rounded-full transition-all duration-300 shadow-[0_0_10px_rgba(239,68,68,0.25)]" 
                                    />
                                </div> */}
                          </div>
                          <ChevronRight className="w-5 h-5 text-secondary/20 mr-1" />
                      </div>
                  ))}
              </div>
          </div>
        )}
      </motion.section>
    </motion.div>
  );
}
