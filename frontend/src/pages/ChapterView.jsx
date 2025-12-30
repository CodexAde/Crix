import { useEffect, useState, useCallback, useContext, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import TopicGraph from '../components/TopicGraph';
import { ArrowLeft, ClipboardCheck } from 'lucide-react';
import UserContext from '../context/User/UserContext';
import SyllabusContext from '../context/Syllabus/SyllabusContext';
import SubjectContext from '../context/Subject/SubjectContext';
import { PageLoader } from '../components/Spinner';

export default function ChapterView() {
  const { subjectId, unitId, chapterId } = useParams();
  const { userProfile, loading: loadingProfile } = useContext(UserContext);
  const { userSubjects } = useContext(SubjectContext);
  const { activeUnitData, loadingUnit, fetchUnitContent } = useContext(SyllabusContext);

  const [progressMap, setProgressMap] = useState({});
  const [loadingProgress, setLoadingProgress] = useState(true);
  const navigate = useNavigate();

  // Find subject and unit in context
  const subject = useMemo(() => userSubjects?.find(s => s._id === subjectId), [userSubjects, subjectId]);
  const unitHeader = useMemo(() => subject?.units?.find(u => u._id === unitId), [subject, unitId]);

  // Use activeUnitData as source for chapters
  const chapter = useMemo(() => {
    return activeUnitData?.chapters?.find(c => c._id === chapterId);
  }, [activeUnitData, chapterId]);

  // Fetch missing data
  useEffect(() => {
    const fetchMissingData = async () => {
        try {
            // 1. Fetch unit content if not available and not loading
            if (!activeUnitData || activeUnitData._id !== unitId) {
                fetchUnitContent(subjectId, unitId);
            }
            // 2. Fetch progress
            const progressRes = await axios.get(`/progress/${subjectId}`);
            setProgressMap(progressRes.data.progressMap);
        } catch (error) {
            console.error(error);
        } finally {
            setLoadingProgress(false);
        }
    };
    fetchMissingData();
  }, [subjectId, unitId, fetchUnitContent]);

  if (loadingProfile || (loadingUnit && !chapter) || loadingProgress) return <PageLoader text="Loading chapter..." />;
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
                    {unitHeader && (
                        <>
                            <span className="w-1 h-1 rounded-full bg-border-soft" />
                            <p className="text-[10px] font-medium text-secondary line-clamp-1">
                                {unitHeader.title}
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
           <TopicGraph topics={topicsWithStatus} onSelectTopic={(topic) => navigate(`/chat/${subjectId}/${chapterId}/${topic._id}`)} />
       </div>
    </div>
  );
}
