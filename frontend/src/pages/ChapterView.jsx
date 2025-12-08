import { useEffect, useState, useCallback } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import TopicGraph from '../components/TopicGraph';
import { Button } from '../components/Button';
import { ArrowLeft, X, MessageCircle, Play, CheckCircle, HelpCircle } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';

export default function ChapterView() {
  const { subjectId, unitId, chapterId } = useParams();
  const [chapter, setChapter] = useState(null);
  const [progressMap, setProgressMap] = useState({});
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchData = useCallback(async () => {
    try {
        const [syllabusRes, progressRes] = await Promise.all([
            axios.get(`/syllabus/${subjectId}`),
            axios.get(`/progress/${subjectId}`)
        ]);

        const unit = syllabusRes.data.subject.units.find(u => u._id === unitId);
        if(unit) {
            const chap = unit.chapters.find(c => c._id === chapterId);
            setChapter(chap);
        }
        setProgressMap(progressRes.data.progressMap);
    } catch (error) {
        console.error(error);
    } finally {
        setLoading(false);
    }
  }, [subjectId, unitId, chapterId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleUpdateStatus = async (status) => {
      if(!selectedTopic) return;
      try {
          await axios.post('/progress', {
              subjectId,
              topicId: selectedTopic._id,
              status
          });
          // Optimistic update
          setProgressMap(prev => ({...prev, [selectedTopic._id]: status}));
          if (status === 'completed') setSelectedTopic(null); // Close panel on complete
      } catch (error) {
          console.error("Failed to update status", error);
      }
  };

  if (loading) return <div className="p-10 text-center">Loading chapter...</div>;
  if (!chapter) return <div className="p-10 text-center">Chapter not found</div>;

  // Merge topic data with status
  const topicsWithStatus = chapter.topics.map(t => ({
      ...t,
      status: progressMap[t._id] || 'not_started'
  }));

  return (
    <div className="relative h-full flex flex-col">
       {/* Header */}
       <div className="bg-white/80 backdrop-blur-md sticky top-0 z-20 px-6 py-4 border-b border-border-soft flex items-center justify-between">
           <button onClick={() => navigate(-1)} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
               <ArrowLeft className="w-5 h-5 text-secondary" />
           </button>
           <h1 className="text-lg font-bold text-primary truncate mx-4">{chapter.title}</h1>
           <div className="w-9" /> 
       </div>
       
       <div className="flex-1 overflow-y-auto bg-[#f5f6f8]">
           <TopicGraph topics={topicsWithStatus} onSelectTopic={setSelectedTopic} />
       </div>

       <AnimatePresence>
           {selectedTopic && (
               <>
                 <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 0.5 }}
                    exit={{ opacity: 0 }}
                    onClick={() => setSelectedTopic(null)}
                    className="fixed inset-0 bg-black z-40 md:hidden"
                 />
                 <motion.div 
                    initial={{ x: '100%' }}
                    animate={{ x: 0 }}
                    exit={{ x: '100%' }}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    className="fixed inset-y-0 right-0 w-full md:w-[480px] bg-white shadow-2xl z-50 p-8 flex flex-col overscroll-contain"
                 >
                    <div className="flex justify-between items-start mb-8">
                        <div>
                            <span className="text-xs font-bold text-accent uppercase tracking-wider">Topic {selectedTopic.orderIndex}</span>
                            <h2 className="text-3xl font-bold text-primary mt-2">{selectedTopic.title}</h2>
                        </div>
                        <button onClick={() => setSelectedTopic(null)} className="p-2 bg-gray-100 rounded-full hover:bg-gray-200">
                            <X className="w-5 h-5 text-secondary" />
                        </button>
                    </div>

                    <div className="prose prose-sm text-secondary mb-8">
                        <p>{selectedTopic.description}</p>
                    </div>
                    
                    <div className="mt-auto space-y-4">
                        <Button 
                            className="w-full text-lg h-14" 
                            onClick={() => navigate(`/chat/${subjectId}/${chapterId}/${selectedTopic._id}`)}
                        >
                            <MessageCircle className="w-5 h-5 mr-2" />
                            Start Learning with AI
                        </Button>
                        
                        <div className="grid grid-cols-2 gap-4">
                            <Button variant="secondary" onClick={() => handleUpdateStatus('completed')}>
                                <CheckCircle className="w-4 h-4 mr-2" />
                                Mark Done
                            </Button>
                            <Button variant="secondary" onClick={() => handleUpdateStatus('doubts')}>
                                <HelpCircle className="w-4 h-4 mr-2" />
                                Mark Doubt
                            </Button>
                        </div>
                    </div>
                 </motion.div>
               </>
           )}
       </AnimatePresence>
    </div>
  );
}
