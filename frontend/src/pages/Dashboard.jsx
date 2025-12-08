import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { StatCard } from '../components/StatCard';
import { Flame, Brain, BookMarked, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import axios from 'axios';

export default function Dashboard() {
  const { user } = useAuth();
  const [subjects, setSubjects] = useState([]);
  const [stats, setStats] = useState({ topicsMastered: 0, activeDoubts: 0, streak: 1 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
        try {
            const [syllabusRes, statsRes] = await Promise.all([
                axios.get('/syllabus'),
                axios.get('/progress/stats')
            ]);
            setSubjects(syllabusRes.data.subjects);
            setStats(statsRes.data);
        } catch (error) {
            console.error("Failed to fetch dashboard data", error);
        } finally {
            setLoading(false);
        }
    }
    fetchDashboardData();
  }, []);

  return (
    <div className="p-6 md:p-10 max-w-7xl mx-auto space-y-8 pb-24 md:pb-10">
      <header>
         <h1 className="text-3xl font-bold text-primary">
            Hello, {user?.name?.split(' ')[0]} 👋
         </h1>
         <p className="text-secondary mt-1">Ready to crush your 1st year exams?</p>
      </header>

      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard 
            title="Day Streak"
            value={stats.streak.toString()}
            subtitle="Keep the fire burning!"
            icon={Flame}
            className="md:col-span-1"
        />
        <StatCard 
            title="Topics Mastered"
            value={stats.topicsMastered.toString()}
            subtitle="Keep learning!"
            icon={Brain}
        />
        <StatCard 
            title="Active Doubts"
            value={stats.activeDoubts.toString()}
            subtitle="Topics to review"
            icon={BookMarked}
        />
      </div>

      {/* Today's Plan Section */}
      <section>
        <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-primary">Today's Focus</h2>
        </div>
        <div className="bg-card rounded-[2rem] p-6 shadow-soft border border-border-soft">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                 <div>
                    <span className="px-3 py-1 rounded-full bg-accent/10 text-accent text-xs font-semibold mb-2 inline-block">
                        Engineering Mechanics
                    </span>
                    <h3 className="text-lg font-semibold text-primary">Normal and Shear Stress</h3>
                    <p className="text-sm text-secondary">Unit 1 • Introduction to Mechanics of Solid</p>
                 </div>
                 <Link 
                    to={subjects.length > 0 ? `/syllabus/${subjects[0]._id}` : '#'} 
                    className="flex items-center justify-center px-6 py-3 bg-accent text-white rounded-2xl font-medium shadow-soft hover:shadow-strong transition-all"
                 >
                    Start Learning <ArrowRight className="w-4 h-4 ml-2" />
                 </Link>
            </div>
        </div>
      </section>

      {/* Subjects Grid */}
      <section>
        <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-primary">Your Subjects</h2>
            <Link to="/syllabus" className="text-sm font-medium text-accent hover:underline">View All</Link>
        </div>
        
        {loading ? (
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1,2,3].map(i => (
                    <div key={i} className="h-40 bg-border-soft rounded-[1.5rem] animate-pulse"></div>
                ))}
             </div>
        ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {subjects.slice(0, 3).map((subject) => (
                    <Link to={`/syllabus/${subject._id}`} key={subject._id} className="group block bg-card rounded-[1.5rem] p-6 shadow-soft hover:shadow-strong transition-all border border-border-soft hover:-translate-y-1">
                        <div className="flex items-start justify-between mb-4">
                            <div className="w-12 h-12 rounded-2xl bg-border-soft flex items-center justify-center overflow-hidden">
                                {subject.image ? (
                                    <img src={subject.image} alt="" className="w-full h-full object-cover" />
                                ) : (
                                    <span className="text-xl">📚</span>
                                )}
                            </div>
                            <span className="text-xs font-semibold text-secondary bg-border-soft px-2 py-1 rounded-lg">
                                {subject.code}
                            </span>
                        </div>
                        <h3 className="text-lg font-bold text-primary group-hover:text-accent transition-colors">{subject.name}</h3>
                        <div className="mt-4 w-full bg-border-soft h-2 rounded-full overflow-hidden">
                            <div className="bg-accent h-full w-[0%]" /> 
                        </div>
                        <p className="text-xs text-secondary mt-2">0% Completed</p>
                    </Link>
                ))}
            </div>
        )}
      </section>
    </div>
  );
}
