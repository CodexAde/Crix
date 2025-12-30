import { useContext } from 'react';
import SubjectContext from '../context/Subject/SubjectContext';
import { ArrowLeft, BookOpen, ChevronRight, Plus } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function MySubjects() {
  const { userSubjects, loadingSubjects, fetchUserSubjects } = useContext(SubjectContext);
  const navigate = useNavigate();

  useEffect(() => {
    fetchUserSubjects();
  }, [fetchUserSubjects]);

  return (
    <div className="min-h-screen bg-main p-4 md:p-10 pb-20">
       <header className="flex items-center gap-4 mb-8">
            <button
                onClick={() => navigate(-1)}
                className="p-2 hover:bg-surface rounded-full transition-colors border border-transparent hover:border-border-soft text-secondary hover:text-primary"
            >
                <ArrowLeft className="w-5 h-5" />
            </button>
            <h1 className="text-2xl font-bold text-primary">Your Subjects</h1>
       </header>

       {loadingSubjects ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
            {[1,2,3,4,5,6,7,8].map(i => (
              <div key={i} className="h-32 bg-border-soft rounded-[1.5rem] animate-pulse" />
            ))}
          </div>
       ) : (
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
             {/* List User Subjects */}
             {userSubjects.map((subject) => (
                <Link 
                    to={`/syllabus/${subject._id}`} 
                    key={subject._id} 
                    className="group flex flex-col justify-between bg-card rounded-[1.5rem] p-5 shadow-sm border border-border-soft hover:border-accent/30 active:scale-[0.98] transition-all min-h-[140px]"
                >
                    <div>
                    <div className="flex items-start justify-between mb-3">
                        <span className="text-[10px] font-bold text-secondary bg-surface border border-border-soft px-2 py-1 rounded-lg uppercase tracking-wider">
                        {subject.code}
                        </span>
                        <div className="w-8 h-8 rounded-full bg-surface border border-border-soft flex items-center justify-center text-secondary group-hover:text-primary transition-colors">
                            <ChevronRight className="w-4 h-4" />
                        </div>
                    </div>
                    <h3 className="text-base font-bold text-primary group-hover:text-accent transition-colors line-clamp-1">{subject.name}</h3>
                    </div>
                    
                    <div className="mt-4">
                    <div className="w-full bg-surface h-1.5 rounded-full overflow-hidden border border-border-soft/50">
                        <div 
                        className="bg-primary h-full rounded-full transition-all duration-300" 
                        style={{ width: `${subject.progress || 0}%` }}
                        />
                    </div>
                    </div>
                </Link>
             ))}

             {/* Add More Card */}
             <div 
                onClick={() => navigate('/syllabus')}
                className="group flex flex-col items-center justify-center h-available min-h-[140px] cursor-pointer border-2 border-dashed border-border-soft rounded-[1.5rem] hover:border-accent hover:bg-accent/5 transition-all text-secondary hover:text-accent"
            >
                <Plus className="w-6 h-6 mb-2" />
                <span className="text-xs font-bold uppercase tracking-wider">Add New Subject</span>
            </div>
           </div>
       )}
    </div>
  );
}
