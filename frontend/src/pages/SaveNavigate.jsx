import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { FastPageSpinner } from '../components/Spinner';

export default function SaveNavigate() {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const sessionData = {
      subjectId: params.get('subjectId'),
      chapterId: params.get('chapterId'),
      topicId: params.get('topicId'),
      topicTitle: params.get('topicTitle'),
      subjectName: params.get('subjectName'),
      unitTitle: params.get('unitTitle'),
      chapterTitle: params.get('chapterTitle'),
      isRoadmap: params.get('isRoadmap') === 'true'
    };

    // Only save if we have the essential IDs
    if (sessionData.subjectId && sessionData.chapterId && sessionData.topicId) {
      localStorage.setItem('crix_last_session', JSON.stringify(sessionData));
    }

    // Determine target path
    const targetPath = sessionData.isRoadmap
      ? `/roadmap/${sessionData.subjectId}/${sessionData.chapterId}/${sessionData.topicId}`
      : `/chat/${sessionData.subjectId}/${sessionData.chapterId}/${sessionData.topicId}`;

    // Redirect to the actual chat interface
    navigate(targetPath, { replace: true });
  }, [location, navigate]);

  return <FastPageSpinner />;
}
