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

  // Fetch missing data
  useEffect(() => {
    let isMounted = true;
    const fetchMissingData = async () => {
        try {
            // Parallel fetch for progress and unit content for better performance
            const fetchPromises = [axios.get(`/progress/${subjectId}`)];
            
            if (!activeUnitData || activeUnitData._id !== unitId) {
                fetchPromises.push(fetchUnitContent(subjectId, unitId));
            }

            const [progressRes] = await Promise.all(fetchPromises);
            if (isMounted) {
                setProgressMap(progressRes.data.progressMap);
                setLoadingProgress(false);
            }
        } catch (error) {
            console.error(error);
            if (isMounted) setLoadingProgress(false);
        }
    };
    fetchMissingData();
    return () => { isMounted = false; };
  }, [subjectId, unitId, fetchUnitContent]);

  // Derived chapter state - very careful about ID matching to prevent showing stale/wrong unit data
  const chapter = useMemo(() => {
    if (activeUnitData?._id === unitId) {
        return activeUnitData.chapters?.find(c => c._id === chapterId);
    }
    return null;
  }, [activeUnitData, unitId, chapterId]);

  if (loadingProfile || loadingUnit || loadingProgress) return <PageLoader text="Loading chapter details..." />;
  
  // Show loader if we have a unitId but context hasn't loaded/matched it yet
  // This prevents the "Not Found" flash while the effect is kicking in
  if (unitId && activeUnitData?._id !== unitId) {
      return <PageLoader text="Loading..." />;
  }
  
  if (!chapter) {
    return (
        <div className="min-h-screen bg-main flex items-center justify-center p-10">
            <div className="text-center space-y-4">
                <div className="w-16 h-16 bg-surface rounded-full flex items-center justify-center mx-auto shadow-inner">
                    <ClipboardCheck className="w-8 h-8 text-secondary/30" />
                </div>
                <p className="text-secondary font-medium">Chapter content not found.</p>
                <button 
                  onClick={() => navigate(-1)}
                  className="text-accent font-bold hover:underline"
                >
                  Go Back
                </button>
            </div>
        </div>
    );
  }

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
