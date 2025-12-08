import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { ChevronRight, PlayCircle, Lock } from 'lucide-react';
import { motion } from 'framer-motion';

export default function SubjectView() {
  const { id } = useParams();
  const [subject, setSubject] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSubject = async () => {
        try {
            const { data } = await axios.get(`/syllabus/${id}`);
            setSubject(data.subject);
        } catch (error) {
            console.error("Failed to fetch subject", error);
        } finally {
            setLoading(false);
        }
    }
    fetchSubject();
  }, [id]);

  if (loading) return <div className="p-10 text-center">Loading syllabus...</div>;
  if (!subject) return <div className="p-10 text-center">Subject not found</div>;

  return (
    <div className="p-6 md:p-10 max-w-5xl mx-auto pb-24 md:pb-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row gap-6 items-start md:items-center mb-10">
         <div className="w-20 h-20 rounded-2xl bg-white shadow-soft flex items-center justify-center overflow-hidden border border-border-soft">
            {subject.image ? <img src={subject.image} className="w-full h-full object-cover" /> : <span className="text-3xl">📚</span>}
         </div>
         <div>
            <div className="flex items-center gap-3 mb-2">
                <span className="px-3 py-1 rounded-full bg-gray-100 text-secondary text-xs font-semibold">{subject.code}</span>
                <span className="px-3 py-1 rounded-full bg-blue-50 text-blue-600 text-xs font-semibold">Unit 1 Active</span>
            </div>
            <h1 className="text-3xl font-bold text-primary">{subject.name}</h1>
         </div>
      </div>

      {/* Units List */}
      <div className="space-y-8">
        {subject.units.map((unit, index) => (
            <div key={unit._id || index} className={`relative pl-8 border-l-2 ${index === 0 ? 'border-accent' : 'border-gray-200'}`}>
                {/* Unit Dot */}
                <div className={`absolute -left-[9px] top-0 w-4 h-4 rounded-full border-2 ${index === 0 ? 'bg-white border-accent' : 'bg-gray-100 border-gray-300'}`} />
                
                <h2 className={`text-xl font-bold mb-4 ${index === 0 ? 'text-primary' : 'text-gray-400'}`}>
                    Unit {unit.unitNumber}: {unit.title}
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {unit.chapters.map((chapter) => (
                        <Link 
                            to={index === 0 ? `/chapter/${subject._id}/${unit._id}/${chapter._id}` : '#'} 
                            key={chapter._id}
                            className={`group p-5 rounded-2xl border transition-all ${
                                index === 0 
                                ? 'bg-white border-border-soft hover:shadow-soft hover:border-accent/30 cursor-pointer' 
                                : 'bg-gray-50 border-transparent opacity-60 cursor-not-allowed'
                            }`}
                        >
                            <div className="flex justify-between items-start mb-2">
                                <span className="text-xs font-medium text-gray-400">Chapter {chapter.orderIndex}</span>
                                {index === 0 ? (
                                    <PlayCircle className="w-5 h-5 text-accent opacity-0 group-hover:opacity-100 transition-opacity" />
                                ) : (
                                    <Lock className="w-4 h-4 text-gray-400" />
                                )}
                            </div>
                            <h3 className="font-semibold text-primary mb-1">{chapter.title}</h3>
                            <p className="text-sm text-secondary line-clamp-2">{chapter.description}</p>
                        </Link>
                    ))}
                    {unit.chapters.length === 0 && (
                        <div className="p-4 rounded-2xl bg-gray-50 text-sm text-gray-400 italic">No chapters added yet.</div>
                    )}
                </div>
            </div>
        ))}
      </div>
    </div>
  );
}
