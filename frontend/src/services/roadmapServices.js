import axios from 'axios';

export const generateRoadmapAI = async (subject, duration, targetExam) => {
  const { data } = await axios.post('/roadmaps/generate-ai', {
    subject,
    duration,
    targetExam,
  });
  return data.data;
};

export const saveRoadmapService = async (roadmapData) => {
  const { data } = await axios.post('/roadmaps/save', roadmapData);
  return data.data;
};

export const getMyRoadmaps = async () => {
  const { data } = await axios.get('/roadmaps/my-roadmaps');
  return data.data;
};

export const deleteRoadmap = async (id) => {
  const { data } = await axios.delete(`/roadmaps/${id}`);
  return data;
};

export const getSyllabusSubjects = async () => {
  const { data } = await axios.get('/syllabus');
  return data.subjects;
};
