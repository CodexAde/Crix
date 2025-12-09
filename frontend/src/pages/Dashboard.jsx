import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Flame, Brain, BookMarked, ArrowRight, Sparkles, Clock, Target, TrendingUp, BookOpen, GraduationCap, Zap, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';

const mockSubjects = [
  { _id: 'mock1', name: 'Engineering Mechanics', code: 'KME101', progress: 0 },
  { _id: 'mock2', name: 'Engineering Physics', code: 'KAS101', progress: 0 },
  { _id: 'mock3', name: 'Mathematics-I', code: 'KAS103', progress: 0 },
  { _id: 'mock4', name: 'Professional Communication', code: 'KAS107', progress: 0 },
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
              setSubjects(syllabusRes.data.subjects);
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
      className="p-6 md:p-10 max-w-7xl mx-auto space-y-8 pb-24 md:pb-10"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Header */}
      <motion.header variants={itemVariants} className="relative">
        <div className="flex items-center gap-4 mb-2">
          <div className="w-14 h-14 rounded-2xl bg-accent flex items-center justify-center shadow-lg shadow-accent/20 overflow-hidden">
            {user?.avatar ? (
                <img src={user.avatar} alt="Profile" className="w-full h-full object-cover" />
            ) : (
                <Sparkles className="w-7 h-7 text-white" />
            )}
          </div>
          <div>
            <h1 className="text-3xl font-bold text-primary">
              Welcome back, {user?.name?.split(' ')[0]}
            </h1>
            <p className="text-secondary mt-0.5 flex items-center gap-2">
              <Target className="w-4 h-4" />
              Ready to crush your 1st year exams?
            </p>
          </div>
        </div>
      </motion.header>

      {/* Stats Row */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="bg-card p-6 rounded-[1.5rem] border border-border-soft hover:border-accent/40 transition-all shadow-soft">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-secondary mb-1">Day Streak</p>
              <h3 className="text-4xl font-bold text-primary">{56}</h3>
              <p className="text-xs text-accent mt-2 flex items-center gap-1">
                <Flame className="w-3.5 h-3.5" /> Keep the fire burning!
              </p>
            </div>
            <div className="p-3 bg-accent/10 rounded-2xl">
              <Flame className="w-7 h-7 text-accent" />
            </div>
          </div>
        </div>

        <div className="bg-card p-6 rounded-[1.5rem] border border-border-soft hover:border-accent/40 transition-all shadow-soft">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-secondary mb-1">Topics Mastered</p>
              <h3 className="text-4xl font-bold text-primary">{65}</h3>
              <p className="text-xs text-accent mt-2 flex items-center gap-1">
                <TrendingUp className="w-3.5 h-3.5" /> Keep learning!
              </p>
            </div>
            <div className="p-3 bg-accent/10 rounded-2xl">
              <Brain className="w-7 h-7 text-accent" />
            </div>
          </div>
        </div>

        <div className="bg-card p-6 rounded-[1.5rem] border border-border-soft hover:border-accent/40 transition-all shadow-soft">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-secondary mb-1">Active Doubts</p>
              <h3 className="text-4xl font-bold text-primary">{12}</h3>
              <p className="text-xs text-accent mt-2 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" /> Topics to review
              </p>
            </div>
            <div className="p-3 bg-accent/10 rounded-2xl">
              <BookMarked className="w-7 h-7 text-accent" />
            </div>
          </div>
        </div>
      </motion.div>

      {/* Quick Add Chapters Card */}
      <motion.div variants={itemVariants}>
        <Link 
          to="/add-chapters"
          className="block bg-gradient-to-r from-accent/10 to-purple-500/10 rounded-[1.5rem] p-6 border border-accent/20 hover:border-accent/50 transition-all group"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-accent/20 rounded-2xl group-hover:bg-accent transition-colors">
                <Sparkles className="w-7 h-7 text-accent group-hover:text-white transition-colors" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-primary group-hover:text-accent transition-colors">Add Chapters with AI</h3>
                <p className="text-sm text-secondary">Upload syllabus image → Get chapters instantly</p>
              </div>
            </div>
            <ArrowRight className="w-6 h-6 text-accent group-hover:translate-x-1 transition-transform" />
          </div>
        </Link>
      </motion.div>

      {/* Today's Focus Section */}
      <motion.section variants={itemVariants}>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-accent" />
            <h2 className="text-xl font-bold text-primary">Today's Focus</h2>
          </div>
        </div>
        <div className="bg-card rounded-[2rem] p-6 md:p-8 shadow-soft border border-border-soft hover:border-accent/40 transition-all">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
            <div className="flex items-start gap-4">
              <div className="w-14 h-14 rounded-2xl bg-accent/10 flex items-center justify-center shrink-0">
                <GraduationCap className="w-7 h-7 text-accent" />
              </div>
              <div>
                <span className="px-3 py-1 rounded-full bg-accent/10 text-accent text-xs font-semibold mb-2 inline-block">
                  {subjects[0]?.name || 'Engineering Mechanics'}
                </span>
                <h3 className="text-xl font-bold text-primary">Normal and Shear Stress</h3>
                <p className="text-sm text-secondary mt-1">Unit 1 • Introduction to Mechanics of Solid</p>
              </div>
            </div>
            <Link 
              to={subjects[0]?._id ? `/syllabus/${subjects[0]._id}` : '#'} 
              className="flex items-center justify-center gap-2 px-6 py-3.5 bg-accent text-white rounded-2xl font-semibold shadow-lg shadow-accent/30 hover:opacity-90 active:scale-[0.98] transition-all"
            >
              Start Learning <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </motion.section>

      {/* Subjects Grid */}
      <motion.section variants={itemVariants}>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-accent" />
            <h2 className="text-xl font-bold text-primary">Your Subjects</h2>
          </div>
          <Link to="/syllabus" className="flex items-center gap-1 text-sm font-semibold text-accent hover:underline">
            View All <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
        
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {[1,2,3,4].map(i => (
              <div key={i} className="h-48 bg-border-soft rounded-[1.5rem] animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {subjects.slice(0, 4).map((subject) => (
              <Link 
                to={`/syllabus/${subject._id}`} 
                key={subject._id} 
                className="group block bg-card rounded-[1.5rem] p-5 shadow-soft hover:shadow-strong transition-all border border-border-soft hover:border-accent/30 hover:-translate-y-1"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center border border-accent/10">
                    <BookOpen className="w-5 h-5 text-accent" />
                  </div>
                  <span className="text-xs font-bold text-accent bg-accent/10 px-2.5 py-1 rounded-lg">
                    {subject.code}
                  </span>
                </div>
                <h3 className="text-base font-bold text-primary group-hover:text-accent transition-colors mb-1 line-clamp-2">{subject.name}</h3>
                <div className="mt-3">
                  <div className="flex items-center justify-between text-xs text-secondary mb-1.5">
                    <span>Progress</span>
                    <span className="font-semibold text-accent">{subject.progress || 0}%</span>
                  </div>
                  <div className="w-full bg-border-soft h-1.5 rounded-full overflow-hidden">
                    <div 
                      className="bg-accent h-full rounded-full transition-all" 
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
