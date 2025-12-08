import { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import TopicGraph from '../components/TopicGraph';
import { ArrowLeft } from 'lucide-react';

export default function ChapterView() {
  const { subjectId, unitId, chapterId } = useParams();
  const [chapter, setChapter] = useState(null);
  const [progressMap, setProgressMap] = useState({});
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

  // Navigate directly to chat when topic is clicked
  const handleTopicClick = (topic) => {
    navigate(`/chat/${subjectId}/${chapterId}/${topic._id}`);
  };

  if (loading) return <div className="p-10 text-center text-secondary">Loading chapter...</div>;
  if (!chapter) return <div className="p-10 text-center text-secondary">Chapter not found</div>;

  // Merge topic data with status
  const topicsWithStatus = chapter.topics.map(t => ({
      ...t,
      status: progressMap[t._id] || 'not_started'
  }));

  return (
    <div className="relative h-full flex flex-col bg-main">
       {/* Header */}
       <div className="bg-card/80 backdrop-blur-md sticky top-0 z-20 px-6 py-4 border-b border-border-soft flex items-center justify-between">
           <button onClick={() => navigate(-1)} className="p-2 hover:bg-border-soft rounded-full transition-colors">
               <ArrowLeft className="w-5 h-5 text-secondary" />
           </button>
           <h1 className="text-lg font-bold text-primary truncate mx-4">{chapter.title}</h1>
           <div className="w-9" /> 
       </div>
       
       <div className="flex-1 overflow-y-auto">
           <TopicGraph topics={topicsWithStatus} onSelectTopic={handleTopicClick} />
       </div>
    </div>
  );
}
