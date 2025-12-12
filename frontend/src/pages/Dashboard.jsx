import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Flame, Brain, BookMarked, ArrowRight, Sparkles, Clock, Target, TrendingUp, BookOpen, GraduationCap, Zap, ChevronRight, Lightbulb } from 'lucide-react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';

const mockSubjects = [
  { _id: 'mock1', name: 'Engineering Mechanics', code: 'KME101', progress: 75 },
  { _id: 'mock2', name: 'Engineering Physics', code: 'KAS101', progress: 50 },
  { _id: 'mock3', name: 'Mathematics-I', code: 'KAS103', progress: 25 },
  { _id: 'mock4', name: 'Professional Communication', code: 'KAS107', progress: 10 },
];

export default function Dashboard() {
  const { user } = useAuth();
  const [subjects, setSubjects] = useState(mockSubjects);
  const [stats, setStats] = useState({ topicsMastered: 0, activeDoubts: 0, streak: 1 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
        try {
            const [syllabusRes, statsRes] = await Promise.all([
                axios.get('/syllabus'),
                axios.get('/progress/stats')
            ]);
            if (syllabusRes.data.subjects && syllabusRes.data.subjects.length > 0) {
              const subjectsData = syllabusRes.data.subjects || [];
              // Add random progress > 70% for UI demo
              const subjectsWithProgress = subjectsData.map(sub => ({
                ...sub,
                progress: sub.progress || Math.floor(Math.random() * (100 - 70 + 1)) + 70
              }));
              setSubjects(subjectsWithProgress);
            }
            setStats(statsRes.data);
        } catch (error) {
            console.error("Failed to fetch dashboard data", error);
        } finally {
            setLoading(false);
        }
    }
    fetchDashboardData();
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
            <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity">
                <Target className="w-32 h-32 text-primary" />
            </div>
            
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-4">
               <span className="px-3 py-1 bg-accent text-white text-[10px] font-bold uppercase tracking-wider rounded-full">
                  Today's Focus
               </span>
               <span className="text-xs text-secondary font-medium">• 25 min remaining</span>
            </div>

            <h2 className="text-3xl md:text-4xl font-bold text-primary leading-tight mb-2">
              Normal and Shear Stress
            </h2>
            <p className="text-secondary text-sm md:text-base mb-6 max-w-lg">
              Engineering Mechanics • Unit 1 • Introduction to Mechanics of Solid
            </p>

            <Link 
              to={subjects[0]?._id ? `/syllabus/${subjects[0]._id}` : '#'} 
              className="inline-flex items-center gap-2 px-8 py-4 bg-primary text-main rounded-2xl font-bold text-sm hover:opacity-90 active:scale-[0.98] transition-all"
            >
              Continue Learning <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </motion.section>

      {/* Action Row */}
      <motion.div variants={itemVariants} className="flex items-center justify-around md:grid md:grid-cols-3 md:gap-6 px-2 md:px-0">
         {/* Generate */}
         <Link to="/add-chapters" className="flex flex-col md:flex-row items-center md:justify-start gap-2 md:gap-4 group md:bg-card md:p-4 md:rounded-2xl md:border md:border-border-soft md:hover:border-accent/50 md:transition-all md:shadow-sm">
            <div className="w-16 h-16 md:w-12 md:h-12 rounded-[1.2rem] md:rounded-xl bg-card md:bg-accent/10 border border-border-soft md:border-transparent flex items-center justify-center shadow-sm md:shadow-none group-hover:border-accent/50 group-hover:scale-105 md:group-hover:scale-100 transition-all text-accent">
               <Sparkles className="w-7 h-7 md:w-6 md:h-6" />
            </div>
            <div className="text-center md:text-left">
                <span className="text-xs md:text-base font-bold text-secondary md:text-primary group-hover:text-primary md:group-hover:text-accent transition-colors block">Generate</span>
                <span className="hidden md:block text-xs text-secondary">Create new chapters</span>
            </div>
         </Link>

         {/* Library */}
         <Link to="/syllabus" className="flex flex-col md:flex-row items-center md:justify-start gap-2 md:gap-4 group md:bg-card md:p-4 md:rounded-2xl md:border md:border-border-soft md:hover:border-accent/50 md:transition-all md:shadow-sm">
            <div className="w-16 h-16 md:w-12 md:h-12 rounded-[1.2rem] md:rounded-xl bg-card md:bg-blue-500/10 border border-border-soft md:border-transparent flex items-center justify-center shadow-sm md:shadow-none group-hover:border-accent/50 group-hover:scale-105 md:group-hover:scale-100 transition-all text-blue-500">
               <BookOpen className="w-7 h-7 md:w-6 md:h-6" />
            </div>
             <div className="text-center md:text-left">
                <span className="text-xs md:text-base font-bold text-secondary md:text-primary group-hover:text-primary md:group-hover:text-blue-500 transition-colors block">Library</span>
                <span className="hidden md:block text-xs text-secondary">Browse your subjects</span>
            </div>
         </Link>

         {/* Profile */}
         <Link to="/user-profile" className="flex flex-col md:flex-row items-center md:justify-start gap-2 md:gap-4 group md:bg-card md:p-4 md:rounded-2xl md:border md:border-border-soft md:hover:border-accent/50 md:transition-all md:shadow-sm">
            <div className="w-16 h-16 md:w-12 md:h-12 rounded-[1.2rem] md:rounded-xl bg-card md:bg-purple-500/10 border border-border-soft md:border-transparent flex items-center justify-center shadow-sm md:shadow-none group-hover:border-accent/50 group-hover:scale-105 md:group-hover:scale-100 transition-all text-purple-500">
               <GraduationCap className="w-7 h-7 md:w-6 md:h-6" />
            </div>
             <div className="text-center md:text-left">
                <span className="text-xs md:text-base font-bold text-secondary md:text-primary group-hover:text-primary md:group-hover:text-purple-500 transition-colors block">Profile</span>
                <span className="hidden md:block text-xs text-secondary">View progress & stats</span>
            </div>
         </Link>
      </motion.div>

      {/* Subjects Section */}
      <motion.section variants={itemVariants}>
        <div className="flex items-center justify-between mb-4 px-1">
          <h2 className="text-lg font-bold text-primary">Your Subjects</h2>
          <Link to="/syllabus" className="text-xs font-semibold text-accent hover:underline">
            View All
          </Link>
        </div>
        
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
            {[1,2,3,4].map(i => (
              <div key={i} className="h-32 bg-border-soft rounded-[1.5rem] animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
            {subjects.slice(0, 4).map((subject) => (
              <Link 
                to={`/syllabus/${subject._id}`} 
                key={subject._id} 
                className="group flex flex-col justify-between bg-card rounded-[1.5rem] p-5 shadow-sm border border-border-soft hover:border-accent/30 active:scale-[0.98] transition-all"
              >
                <div>
                  <div className="flex items-start justify-between mb-3">
                     <span className="text-[10px] font-bold text-secondary bg-surface border border-border-soft px-2 py-1 rounded-lg uppercase tracking-wider">
                       {subject.code}
                     </span>
                     <div className="w-8 h-8 rounded-full bg-surface border border-border-soft flex items-center justify-center text-secondary group-hover:text-primary transition-colors">
                        <ChevronRight className="w-4 h-4" />
                     </div>
                  </div>
                  <h3 className="text-base font-bold text-primary group-hover:text-accent transition-colors line-clamp-2">{subject.name}</h3>
                </div>
                
                <div className="mt-4">
                  <div className="w-full bg-surface h-1.5 rounded-full overflow-hidden border border-border-soft/50">
                    <div 
                      className="bg-primary h-full rounded-full transition-all duration-300" 
                      style={{ width: `${subject.progress || 80}%` }}
                    />
                  </div>
                </div>
              </Link>
            ))}            
          </div>
        )}
      </motion.section>
    </motion.div>
  );
}
