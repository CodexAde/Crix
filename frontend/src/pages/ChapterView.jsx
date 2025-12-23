import { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import TopicGraph from '../components/TopicGraph';
import { ArrowLeft, ClipboardCheck } from 'lucide-react';
import { PageLoader } from '../components/Spinner';

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
  const [subject, setSubject] = useState(null);
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

        const sj = syllabusRes.data.subject;
        setSubject(sj);
        const unit = sj.units.find(u => u._id === unitId);
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

  if (loading) return <PageLoader text="Loading chapter..." />;
  if (!chapter) return <div className="p-10 text-center text-secondary">Chapter not found</div>;

  const topicsWithStatus = chapter.topics.map(t => ({
      ...t,
      status: progressMap[t._id] || 'not_started'
  }));

  return (
    <div className="relative h-full flex flex-col bg-main">
       <header className="bg-card/80 backdrop-blur-md sticky top-0 z-50 px-6 py-4 border-b border-border-soft flex items-center justify-between gap-4">
            <button
                onClick={() => navigate(-1)}
                className="p-3 bg-white/10 backdrop-blur-md border border-white/10 rounded-2xl hover:bg-white/20 transition-all active:scale-95 group shrink-0"
            >
                <ArrowLeft className="w-5 h-5 text-primary group-hover:-translate-x-1 transition-transform" />
            </button>
            <div className="flex-1 text-center min-w-0 mx-4">
                <div className="flex items-center justify-center gap-2 mb-0.5">
                    <p className="text-[10px] font-bold text-accent uppercase tracking-widest line-clamp-1">
                        {subject?.name || 'Subject'}
                    </p>
                    {subject?.units?.find(u => u._id === unitId) && (
                        <>
                            <span className="w-1 h-1 rounded-full bg-border-soft" />
                            <p className="text-[10px] font-medium text-secondary line-clamp-1">
                                {subject.units.find(u => u._id === unitId).title}
                            </p>
                        </>
                    )}
                </div>
                <h1 className="text-lg font-bold text-primary line-clamp-1">{chapter.title}</h1>
            </div>
            <button
                onClick={() => navigate('/tests')}
                className="flex items-center gap-2.5 px-5 py-2.5 bg-white/10 backdrop-blur-md border border-white/10 rounded-full hover:bg-white/20 transition-all active:scale-95 group text-white shrink-0"
                title="Your Tests"
            >
                <span className="text-sm font-bold uppercase tracking-widest hidden sm:inline">Tests</span>
                <ClipboardCheck className="w-5 h-5 transition-colors group-hover:text-accent" />
            </button>
       </header>
       
       <div className="flex-1 pb-24 md:pb-4">
           <TopicGraph topics={topicsWithStatus} onSelectTopic={handleTopicClick} />
       </div>
    </div>
  );
}
