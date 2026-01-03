import { useEffect, useState, useContext } from 'react';
import { FastPageSpinner, PageLoader } from '../components/Spinner';
import SubjectContext from '../context/Subject/SubjectContext';
import UserContext from '../context/User/UserContext';
import { Flame,Calendar, Brain, BookMarked, ArrowRight, Sparkles, Clock, Target, TrendingUp, BookOpen, GraduationCap, Zap, ChevronRight, Lightbulb, Plus, GripVertical } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { motion, Reorder } from 'framer-motion';

import { getMyRoadmaps } from '../services/roadmapServices';
import { getUserTestStatsService } from '../services/testServices';

export default function Dashboard() {
  const { userProfile, loading: loadingProfile, stats: userStats, subjCount } = useContext(UserContext);
  const { reorderSubjects, userSubjects } = useContext(SubjectContext);
  const [stats, setStats] = useState({ topicsMastered: 0, activeDoubts: 0, streak: 1 });
  const [loadingStats, setLoadingStats] = useState(false);
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

  const loading = loadingProfile || loadingStats;
  
  if (loading) {
    return <PageLoader />
  }


  // Stats from User Profile
  const displayStats = {
    streak: userProfile?.streak || 1, // Default to 1 if new
    mastered: stats.topicsMastered || 0,
    accuracy: 94.8,
    velocity: 12.4
  };

  const weeklyActivity = [
    { day: 'M', hours: '2.4', height: 45 },
    { day: 'T', hours: '3.8', height: 65 },
    { day: 'W', hours: '1.2', height: 30 },
    { day: 'T', hours: '4.5', height: 85 },
    { day: 'F', hours: '2.8', height: 50 },
    { day: 'S', hours: '5.2', height: 95 },
    { day: 'S', hours: '4.2', height: 75 }
  ];

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
           <h1 className="text-2xl font-bold text-primary">{userProfile?.name?.split(' ')[0]}</h1>
        </div>
        <Link to="/user-profile" className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center border border-accent/20">
            {userProfile?.avatar ? (
                <img src={userProfile.avatar} alt="Profile" className="w-full h-full object-cover rounded-full" />
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
                 {lastSession ? "• 25 min remaining" : "• Instant Learning"}
               </span>
            </div>

            {!lastSession ? (
              <>
                <h2 className="text-4xl md:text-6xl font-extrabold text-primary leading-[1.1] mb-6 tracking-tighter">
                   Build your <span className="text-accent">Global Library</span>
                </h2>
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mb-10">
                  <p className="text-secondary text-base md:text-xl font-medium max-w-xl leading-relaxed opacity-80">
                    Discover subjects from the global database and start generating your neural paths.
                  </p>
                </div>
                
                <Link 
                  to='/syllabus' 
                  className="inline-flex items-center gap-3 px-10 py-5 bg-primary text-main rounded-[1.5rem] font-bold text-base hover:opacity-90 active:scale-[0.98] transition-all shadow-xl shadow-primary/10 group/btn"
                >
                  Explore Library
                  <ArrowRight className="w-5 h-5 group-hover/btn:translate-x-1 transition-transform" />
                </Link>
              </>
            ) : (
              <>
                <h2 className="text-4xl md:text-6xl font-extrabold text-primary leading-[1.1] mb-4 line-clamp-1 tracking-tighter">
                  {lastSession.topicTitle}
                </h2>
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mb-10">
                  <p className="text-primary font-bold text-lg md:text-2xl tracking-tight">
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
                  {lastSession.chapterTitle && (
                      <>
                      <span className="w-1.5 h-1.5 rounded-full bg-border-soft hidden md:block" />
                      <p className="text-accent text-lg md:text-xl font-medium tracking-tight opacity-70">
                        {lastSession.chapterTitle}
                      </p>
                      </>
                  )}
                </div>

                <Link 
                  to={lastSession.isRoadmap 
                      ? `/roadmap/${lastSession.subjectId}/${lastSession.chapterId}/${lastSession.topicId}`
                      : `/chat/${lastSession.subjectId}/${lastSession.chapterId}/${lastSession.topicId}`
                  }
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
         <Link to="/roadmap" className="flex flex-col md:flex-row items-center md:justify-start gap-2 md:gap-4 group md:bg-card md:p-4 md:rounded-2xl md:border md:border-border-soft md:hover:border-accent/40 md:hover:shadow-lg md:hover:shadow-accent/5 md:transition-all">
            <div className="w-16 h-16 md:w-12 md:h-12 rounded-[1.2rem] md:rounded-xl bg-card md:bg-accent/10 border border-border-soft md:border-transparent flex items-center justify-center shadow-sm md:shadow-none transition-all text-accent group-hover:scale-105">
               <Calendar className="w-7 h-7 md:w-6 md:h-6" />
            </div>
            <div className="text-center md:text-left">
                <span className="text-xs md:text-base font-bold text-secondary md:text-primary group-hover:text-accent transition-colors block leading-none">Roadmap</span>
                <span className="hidden md:block text-[10px] text-secondary mt-0.5">Your Path</span>
            </div>
         </Link>

         <Link to="/syllabus" className="flex flex-col md:flex-row items-center md:justify-start gap-2 md:gap-4 group md:bg-card md:p-4 md:rounded-2xl md:border md:border-border-soft md:hover:border-blue-500/40 md:hover:shadow-lg md:hover:shadow-blue-500/5 md:transition-all">
            <div className="w-16 h-16 md:w-12 md:h-12 rounded-[1.2rem] md:rounded-xl bg-card md:bg-blue-500/10 border border-border-soft md:border-transparent flex items-center justify-center shadow-sm md:shadow-none transition-all text-blue-500 group-hover:scale-105">
               <BookMarked className="w-7 h-7 md:w-6 md:h-6" />
            </div>
             <div className="text-center md:text-left">
                <span className="text-xs md:text-base font-bold text-secondary md:text-primary group-hover:text-blue-500 transition-colors block leading-none">Library</span>
                <span className="hidden md:block text-[10px] text-secondary mt-0.5">Explore Subjects</span>
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

      {/* Neural Growth Analytics */}
      <motion.section variants={itemVariants} className="space-y-6 pt-4">
        <div className="flex items-center justify-between px-1">
          <div className="flex flex-col">
            <h2 className="text-xl font-bold text-primary tracking-tight">Neural Growth</h2>
            <p className="text-[10px] text-secondary font-medium uppercase tracking-widest opacity-60">System Analytics</p>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1 bg-white/[0.03] backdrop-blur-md rounded-full border border-white/[0.08] shadow-[0_2px_10px_rgba(0,0,0,0.1)]">
             <div className="w-1 h-1 rounded-full bg-accent animate-pulse shadow-[0_0_8px_rgba(239,68,68,0.5)]" />
             <span className="text-[9px] font-bold text-secondary uppercase tracking-wider opacity-80">Live Sync</span>
          </div>
        </div>

        {/* Stat Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-card rounded-[2rem] p-5 border border-border-soft hover:shadow-xl transition-all group overflow-hidden relative">
             <div className="absolute -right-2 -top-2 w-16 h-16 bg-orange-500/5 rounded-full blur-2xl group-hover:bg-orange-500/10 transition-colors" />
             <div className="w-10 h-10 rounded-xl bg-orange-500/10 flex items-center justify-center text-orange-500 mb-4 group-hover:scale-110 transition-transform relative z-10">
                <Flame className="w-5 h-5" />
             </div>
             <p className="text-[10px] font-bold text-secondary uppercase tracking-widest mb-1 opacity-60 relative z-10">Active Streak</p>
             <div className="flex items-baseline gap-1 relative z-10">
                <span className="text-3xl font-black text-primary tracking-tighter">{displayStats.streak}</span>
                <span className="text-[10px] font-extrabold text-secondary opacity-50">DAYS</span>
             </div>
          </div>

          <div className="bg-card rounded-[2rem] p-5 border border-border-soft hover:shadow-xl transition-all group overflow-hidden relative">
             <div className="absolute -right-2 -top-2 w-16 h-16 bg-accent/5 rounded-full blur-2xl group-hover:bg-accent/10 transition-colors" />
             <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center text-accent mb-4 group-hover:scale-110 transition-transform relative z-10">
                <BookOpen className="w-5 h-5" />
             </div>
             <p className="text-[10px] font-bold text-secondary uppercase tracking-widest mb-1 opacity-60 relative z-10">Subjects</p>
             <div className="flex items-baseline gap-1 relative z-10">
                <span className="text-3xl font-black text-primary tracking-tighter">{subjCount}</span>
                <span className="text-[10px] font-extrabold text-secondary opacity-50">SUBJ</span>
             </div>
          </div>

          <div className="bg-card rounded-[2rem] p-5 border border-border-soft hover:shadow-xl transition-all group overflow-hidden relative">
             <div className="absolute -right-2 -top-2 w-16 h-16 bg-blue-500/5 rounded-full blur-2xl group-hover:bg-blue-500/10 transition-colors" />
             <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-500 mb-4 group-hover:scale-110 transition-transform relative z-10">
                <Target className="w-5 h-5" />
             </div>
             <p className="text-[10px] font-bold text-secondary uppercase tracking-widest mb-1 opacity-60 relative z-10">Tests Attempted</p>
             <div className="flex items-baseline gap-1 relative z-10">
                <span className="text-3xl font-black text-primary tracking-tighter">{userStats.testAttempts}</span>
                <span className="text-[10px] font-extrabold text-secondary opacity-50">TESTS</span>
             </div>
          </div>

          <div className="bg-card rounded-[2rem] p-5 border border-border-soft hover:shadow-xl transition-all group overflow-hidden relative">
             <div className="absolute -right-2 -top-2 w-16 h-16 bg-purple-500/5 rounded-full blur-2xl group-hover:bg-purple-500/10 transition-colors" />
             <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-500 mb-4 group-hover:scale-110 transition-transform relative z-10">
                <Calendar className="w-5 h-5" />
             </div>
             <p className="text-[10px] font-bold text-secondary uppercase tracking-widest mb-1 opacity-60 relative z-10">Active Roadmaps</p>
             <div className="flex items-baseline gap-1 relative z-10">
                <span className="text-3xl font-black text-primary tracking-tighter">{userStats.activeRoadmaps}</span>
                <span className="text-[10px] font-extrabold text-secondary opacity-50">PLANS</span>
             </div>
          </div>
        </div>

        {/* Weekly Activity Visualizer */}
        {/* <div className="bg-card rounded-[2.5rem] p-6 md:p-8 border border-border-soft relative overflow-hidden group">
           <div className="absolute top-0 right-0 p-8 opacity-[0.02] group-hover:scale-110 transition-transform duration-700">
              <TrendingUp className="w-32 h-32 text-primary" />
           </div>
           
           <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
              <div className="max-w-xs">
                <div className="flex items-center gap-2 mb-3">
                   <div className="w-1.5 h-1.5 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]" />
                   <h3 className="text-lg font-bold text-primary tracking-tight">Weekly Activity</h3>
                </div>
                <p className="text-sm text-secondary leading-relaxed opacity-70 mb-6 font-medium">
                  Your neural pathways are expanding rapidly. Activity peaks observed during the current session.
                </p>
                <div className="flex items-center gap-6">
                   <div>
                      <p className="text-[8px] font-bold text-secondary uppercase tracking-widest opacity-40 mb-1">Growth</p>
                      <p className="text-base font-black text-green-500">+12.4%</p>
                   </div>
                   <div className="w-px h-10 bg-border-soft" />
                   <div>
                      <p className="text-[8px] font-bold text-secondary uppercase tracking-widest opacity-40 mb-1">Focus</p>
                      <p className="text-base font-black text-primary">4.2 Hrs</p>
                   </div>
                </div>
              </div>

              <div className="flex-1 h-32 relative group/graph max-w-sm px-2">
                 <svg className="w-full h-full overflow-visible" preserveAspectRatio="none">
                  <defs>
                    <linearGradient id="graphGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="var(--color-accent)" stopOpacity="0.6" />
                      <stop offset="100%" stopColor="var(--color-accent)" stopOpacity="0.1" />
                    </linearGradient>
                  </defs>
                  
                   <motion.path
                    initial={{ pathLength: 0, opacity: 0
                      
                     }}
                    animate={{ pathLength: 1, opacity: 1 }}
                    transition={{ duration: 1.5, ease: "easeInOut" }}
                    d={`M ${weeklyActivity.map((item, i) => `${(i / (weeklyActivity.length - 1)) * 100}%,${100 - item.height}`).join(' L ')} L 100%,100 L 0%,100 Z`}
                    fill="url(#graphGradient)"
                    className="transition-all duration-700"
                  />

                  <motion.path
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 1.5, ease: "easeInOut" }}
                    d={`M ${weeklyActivity.map((item, i) => `${(i / (weeklyActivity.length - 1)) * 100}%,${100 - item.height}`).join(' L ')}`}
                    fill="none"
                    stroke="var(--color-accent)"
                    strokeWidth="4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="drop-shadow-[0_4px_12px_rgba(239,68,68,0.3)]"
                  />

                  {weeklyActivity.map((item, i) => (
                    <g key={i} className="group/node pointer-events-auto">
                       <foreignObject
                          x={`calc(${(i / (weeklyActivity.length - 1)) * 100}% - 15px)`}
                          y={`${100 - item.height - 30}%`}
                          width="30"
                          height="20"
                          className="transition-all duration-300"
                       >
                          <div className="text-[10px] font-black text-accent opacity-60 group-hover/node:opacity-100 text-center">
                             {item.hours}h
                          </div>
                       </foreignObject>

                       <circle
                          cx={`${(i / (weeklyActivity.length - 1)) * 100}%`}
                          cy={`${100 - item.height}%`}
                          r="5"
                          className={`fill-white stroke-[4] transition-all duration-300 ${
                             i === weeklyActivity.length - 1 ? 'stroke-accent' : 'stroke-accent/40 group-hover/node:stroke-accent'
                          }`}
                       />
                    </g>
                  ))}
                </svg>

                <div className="absolute -bottom-6 left-0 right-0 flex justify-between px-1">
                   {weeklyActivity.map((item, i) => (
                     <span key={i} className="text-[10px] font-black text-secondary tracking-tighter opacity-40 uppercase">
                        {item.day}
                     </span>
                   ))}
                </div>
              </div>
           </div>
        </div> */}
      </motion.section>    
      </motion.div>
  );
}
