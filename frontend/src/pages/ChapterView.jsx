import { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import TopicGraph from '../components/TopicGraph';
import { ArrowLeft } from 'lucide-react';

const mockChaptersData = {
  ch1: { 
    _id: 'ch1', 
    title: 'Normal and Shear Stress', 
    topics: [
      { _id: 't1', title: 'Introduction to Stress', orderIndex: 1 },
      { _id: 't2', title: 'Normal Stress Analysis', orderIndex: 2 },
      { _id: 't3', title: 'Shear Stress Basics', orderIndex: 3 },
    ]
  },
  ch2: { 
    _id: 'ch2', 
    title: 'Strain and Deformation', 
    topics: [
      { _id: 't4', title: 'Types of Strain', orderIndex: 1 },
      { _id: 't5', title: 'Deformation Concepts', orderIndex: 2 },
    ]
  },
  ch3: { 
    _id: 'ch3', 
    title: 'Stress-Strain Relationship', 
    topics: [
      { _id: 't6', title: 'Hookes Law', orderIndex: 1 },
      { _id: 't7', title: 'Elastic Constants', orderIndex: 2 },
    ]
  },
};

export default function ChapterView() {
  const { subjectId, unitId, chapterId } = useParams();
  const [chapter, setChapter] = useState(null);
  const [progressMap, setProgressMap] = useState({});
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchData = useCallback(async () => {
    if (subjectId.startsWith('mock') || mockChaptersData[chapterId]) {
      setChapter(mockChaptersData[chapterId] || null);
      setProgressMap({});
      setLoading(false);
      return;
    }

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

  const handleTopicClick = (topic) => {
    navigate(`/chat/${subjectId}/${chapterId}/${topic._id}`);
  };

  if (loading) return <div className="p-10 text-center text-secondary">Loading chapter...</div>;
  if (!chapter) return <div className="p-10 text-center text-secondary">Chapter not found</div>;

  const topicsWithStatus = chapter.topics.map(t => ({
      ...t,
      status: progressMap[t._id] || 'not_started'
  }));

  return (
    <div className="relative h-full flex flex-col bg-main">
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
