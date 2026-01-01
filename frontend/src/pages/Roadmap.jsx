import { useState, useEffect } from 'react';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Calendar, Rocket, Timer, ChevronRight, Sparkles, CheckCircle2, FolderOpen, Plus, Loader2, ArrowLeft } from 'lucide-react';
import toast from 'react-hot-toast';
import RoadmapGenerator from '../components/RoadmapComponents/RoadmapGenerator';
import RoadmapEditor from '../components/RoadmapComponents/RoadmapEditor';
import RoadmapDetail from '../components/RoadmapComponents/RoadmapDetail';
import {
  generateRoadmapAI,
  saveRoadmapService,
  getMyRoadmaps,
  getRoadmapById,
} from '../services/roadmapServices';

export default function Roadmap() {
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams(); 
  
  const getInitialView = () => {
    if (id) return 'detail';
    if (location.pathname === '/roadmap/my') return 'my-roadmaps';
    if (location.pathname === '/roadmap/add' || location.pathname === '/roadmap/generate') return 'generator';
    return 'hero';
  };
  
  const [view, setView] = useState(getInitialView());
  const [loading, setLoading] = useState(false);
  const [generatedRoadmap, setGeneratedRoadmap] = useState(null);
  const [myRoadmaps, setMyRoadmaps] = useState([]);
  const [fetchingRoadmaps, setFetchingRoadmaps] = useState(false);
  const [selectedRoadmap, setSelectedRoadmap] = useState(null);
  const [isFetchingDetail, setIsFetchingDetail] = useState(false);

  const scheduleOverview = [
    { title: "Sprint Mode", duration: "4 Days", intensity: "Very High", icon: Rocket, color: "text-orange-500", bg: "bg-orange-500/10" },
    { title: "Standard Pace", duration: "5 Days", intensity: "High", icon: Timer, color: "text-accent", bg: "bg-accent/10" },
    { title: "Deep Focus", duration: "7 Days", intensity: "Detailed", icon: Timer, color: "text-blue-500", bg: "bg-blue-500/10" }
  ];

  useEffect(() => {
    if (id) {
      setView('detail');
      fetchRoadmapDetail(id);
    } else {
      setView(getInitialView());
    }
  }, [id, location.pathname]);

  useEffect(() => {
    if (view === 'my-roadmaps') {
      fetchRoadmaps();
    }
  }, [view]);

  const fetchRoadmapDetail = async (roadmapId) => {
    setIsFetchingDetail(true);
    try {
      const data = await getRoadmapById(roadmapId);
      setSelectedRoadmap(data.roadmap);
    } catch (error) {
      console.error("Error fetching roadmap detail:", error);
      toast.error("Failed to load roadmap");
      navigate('/roadmap/my');
    } finally {
      setIsFetchingDetail(false);
    }
  };

  const fetchRoadmaps = async () => {
    setFetchingRoadmaps(true);
    try {
      const data = await getMyRoadmaps();
      setMyRoadmaps(data || []);
    } catch (error) {
      console.error("Error fetching roadmaps:", error);
    } finally {
      setFetchingRoadmaps(false);
    }
  };

  const handleGenerate = async (subject, duration, selectedChapters, selectedTopics) => {
    setLoading(true);
    try {
      const data = await generateRoadmapAI(subject, duration, selectedChapters, selectedTopics);
      setGeneratedRoadmap({ ...data, subject, duration });
      setView('editor');
      toast.success('Neural path generated!');
    } catch (error) {
      console.error('Generation Error:', error);
      toast.error(error.response?.data?.message || 'Failed to generate roadmap.');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (roadmapData) => {
    try {
      await saveRoadmapService(roadmapData);
      toast.success('Roadmap saved!');
      navigate('/roadmap/my');
    } catch (error) {
      console.error('Save Error:', error);
      toast.error('Failed to save roadmap.');
    }
  };

  if (view === 'generator') {
    return (
      <div className="p-4 md:p-10 max-w-7xl mx-auto pb-24 md:pb-10 min-h-screen relative overflow-x-hidden">
        <motion.header initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mb-10 flex items-center justify-between">
          <h1 className="text-2xl md:text-3xl font-bold text-primary">Generate Roadmap</h1>
          <button onClick={() => navigate('/roadmap')} className="text-secondary hover:text-accent text-sm font-bold px-4 py-2 rounded-xl bg-card border border-white/10 active:scale-95 transition-all">
            <ArrowLeft className="w-4 h-4 inline mr-2" /> Back
          </button>
        </motion.header>
        <RoadmapGenerator onGenerate={handleGenerate} loading={loading} />
      </div>
    );
  }

  if (view === 'detail') {
    return (
      <div className="p-4 md:p-10 max-w-7xl mx-auto pb-24 md:pb-10 min-h-screen relative overflow-x-hidden">
        {isFetchingDetail ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
             <Loader2 className="w-10 h-10 text-accent animate-spin" />
             <p className="text-secondary font-bold">Loading Path...</p>
          </div>
        ) : (
          <RoadmapDetail 
            roadmap={selectedRoadmap} 
            onBack={() => navigate('/roadmap/my')} 
          />
        )}
      </div>
    );
  }

  if (view === 'editor') {
    return (
      <div className="p-4 md:p-10 max-w-7xl mx-auto pb-24 md:pb-10 min-h-screen relative overflow-x-hidden">
        <RoadmapEditor
          initialData={generatedRoadmap}
          onSave={handleSave}
          onCancel={() => setView('hero')}
        />
      </div>
    );
  }

  if (view === 'my-roadmaps') {
    return (
      <div className="p-4 md:p-10 max-w-7xl mx-auto pb-24 md:pb-10 min-h-screen relative overflow-x-hidden">
        <motion.header initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mb-10">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-primary">My Roadmaps</h1>
              <p className="text-secondary text-sm">Your saved study plans</p>
            </div>
            <button onClick={() => navigate(-1)} className="text-secondary hover:text-accent text-sm font-bold px-4 py-2 rounded-xl bg-card border border-white/10 active:scale-95 transition-all">
                <ArrowLeft className="w-4 h-4 inline mr-2" /> Back
            </button>
          </div>
        </motion.header>

        {fetchingRoadmaps ? (
          <div className="text-center py-20 text-secondary">Loading...</div>
        ) : myRoadmaps.length === 0 ? (
          <div className="text-center py-20">
            <FolderOpen className="w-16 h-16 mx-auto text-secondary/30 mb-4" />
            <p className="text-secondary">No roadmaps yet. Create one!</p>
            <button onClick={() => navigate('/roadmap/add')} className="mt-4 px-6 py-3 bg-accent text-white rounded-xl font-bold">
              Create Roadmap
            </button>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {myRoadmaps.map((rm) => (
              <motion.div
                key={rm._id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                onClick={() => navigate(`/roadmap/${rm._id}`)}
                className="p-6 rounded-3xl bg-card border border-white/10 cursor-pointer hover:border-accent/30 hover:bg-accent/5 transition-all"
              >
                <h3 className="text-lg font-bold text-primary line-clamp-1">{rm.name || rm.title}</h3>
                <p className="text-secondary text-sm line-clamp-2 mt-1">{rm.description}</p>
                <div className="mt-4 flex items-center justify-between">
                  <span className="text-xs text-secondary">{rm.days?.length || rm.steps?.length || 0} Days</span>
                  <span className="text-xs text-accent font-bold">{rm.subject}</span>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="p-4 md:p-10 max-w-7xl mx-auto pb-24 md:pb-10 min-h-screen relative overflow-x-hidden">
      <motion.header 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-10 md:mb-12"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 md:w-12 md:h-12 rounded-2xl bg-accent/5 flex items-center justify-center">
              <Calendar className="w-5 h-5 md:w-6 md:h-6 text-accent" />
            </div>
            <div>
              <h1 className="text-xl md:text-3xl font-bold text-primary">Study Roadmap</h1>
              <p className="text-secondary text-xs md:text-sm">Personalized learning schedules</p>
            </div>
          </div>
          <button
            onClick={() => navigate('/roadmap/add')}
            className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-card flex items-center justify-center text-primary shadow-[0_4px_12px_rgba(0,0,0,0.1)] hover:scale-105 active:scale-95 transition-all"
            title="Create New Roadmap"
          >
            <Plus className="w-5 h-5 md:w-6 md:h-6" />
          </button>
        </div>
      </motion.header>

      <div className="grid lg:grid-cols-12 gap-6 md:gap-10">
        <motion.div 
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          className="lg:col-span-8 flex flex-col justify-center"
        >
          <div className="max-w-2xl px-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/5 mb-6">
              <Sparkles className="w-3 h-3 text-accent" />
              <span className="text-[10px] uppercase tracking-widest font-bold text-accent">Neural Scheduling</span>
            </div>
            
            <h2 className="text-3xl md:text-5xl lg:text-6xl font-extrabold text-primary mb-6 leading-[1.1]">
              Your Path to <br />
              <span className="text-accent">Academic Mastery.</span>
            </h2>
            
            <p className="text-secondary text-base md:text-xl mb-10 leading-relaxed opacity-80">
              Transform your syllabus into a manageable daily plan. 
              Our engine calculates the optimal study intervals based on your exam date.
            </p>

            <div className="grid sm:grid-cols-2 gap-4 mb-10">
              {[
                "Automatic Chapter Allocation",
                "Periodic Revision Milestones",
                "Day-wise Topic Planning",
                "AI-Powered Optimization",
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-3">
                  <CheckCircle2 className="w-4 h-4 text-green-500/70" />
                  <span className="text-primary font-medium text-sm md:text-base">{item}</span>
                </div>
              ))}
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate('/roadmap/my')}
              className="w-full sm:w-auto flex items-center justify-center gap-3 px-10 py-4 md:py-5 bg-accent text-white rounded-2xl font-bold shadow-xl shadow-accent/20 transition-all text-sm md:text-base"
            >
              <FolderOpen className="w-5 h-5" />
              My Roadmaps
              <ChevronRight className="w-4 h-4" />
            </motion.button>
          </div>
        </motion.div>

        <div className="lg:col-span-4 space-y-4">
          <p className="text-[10px] font-bold text-secondary uppercase tracking-[0.2em] mb-4 px-2">Schedule Modes</p>
          
          {scheduleOverview.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 + i * 0.1 }}
              className="p-5 md:p-6 rounded-[2rem] bg-card border border-white/5 hover:border-white/10 transition-all duration-300"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-2xl ${item.bg}`}>
                  <item.icon className={`w-5 h-5 ${item.color}`} />
                </div>
                <div className="flex items-center gap-1 text-accent font-bold text-sm">
                  <span>{item.duration}</span>
                </div>
              </div>
              <div>
                <h4 className="text-primary font-bold text-lg mb-1">{item.title}</h4>
                <p className="text-secondary text-xs font-medium opacity-70 uppercase tracking-wider">
                  {item.intensity} Intensity
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
