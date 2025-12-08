import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Clock, ChevronRight, ArrowLeft, Layers, FileText, Play, CheckCircle } from 'lucide-react';

const mockSubjectsData = {
  mock1: {
    _id: 'mock1',
    name: 'Engineering Mechanics',
    code: 'KME101',
    units: [
      {
        _id: 'unit1',
        unitNumber: 1,
        title: 'Introduction to Mechanics of Solid',
        chapters: [
          { _id: 'ch1', orderIndex: 1, title: 'Normal and Shear Stress', description: 'Understanding stress components in materials', duration: '45 min' },
          { _id: 'ch2', orderIndex: 2, title: 'Strain and Deformation', description: 'Types of strain and material deformation', duration: '30 min' },
          { _id: 'ch3', orderIndex: 3, title: 'Stress-Strain Relationship', description: 'Hookes law and material properties', duration: '40 min' },
        ]
      },
      {
        _id: 'unit2',
        unitNumber: 2,
        title: 'Centroid and Moment of Inertia',
        chapters: [
          { _id: 'ch4', orderIndex: 1, title: 'Centroid of Areas', description: 'Finding center of gravity of shapes', duration: '35 min' },
          { _id: 'ch5', orderIndex: 2, title: 'Moment of Inertia', description: 'Second moment of area calculations', duration: '50 min' },
        ]
      },
    ]
  },
  mock2: {
    _id: 'mock2',
    name: 'Engineering Physics',
    code: 'KAS101',
    units: [
      {
        _id: 'unit1',
        unitNumber: 1,
        title: 'Quantum Mechanics',
        chapters: [
          { _id: 'ch1', orderIndex: 1, title: 'Wave-Particle Duality', description: 'Understanding dual nature of matter', duration: '40 min' },
          { _id: 'ch2', orderIndex: 2, title: 'Schrodinger Wave Equation', description: 'Mathematical formulation of quantum mechanics', duration: '55 min' },
        ]
      },
    ]
  },
  mock3: {
    _id: 'mock3',
    name: 'Mathematics-I',
    code: 'KAS103',
    units: [
      {
        _id: 'unit1',
        unitNumber: 1,
        title: 'Differential Calculus',
        chapters: [
          { _id: 'ch1', orderIndex: 1, title: 'Successive Differentiation', description: 'Higher order derivatives and Leibniz theorem', duration: '45 min' },
          { _id: 'ch2', orderIndex: 2, title: 'Mean Value Theorems', description: 'Rolles and Lagranges theorems', duration: '35 min' },
        ]
      },
    ]
  },
  mock4: {
    _id: 'mock4',
    name: 'Professional Communication',
    code: 'KAS107',
    units: [
      {
        _id: 'unit1',
        unitNumber: 1,
        title: 'Communication Fundamentals',
        chapters: [
          { _id: 'ch1', orderIndex: 1, title: 'Verbal Communication', description: 'Effective speaking and presentation skills', duration: '30 min' },
          { _id: 'ch2', orderIndex: 2, title: 'Non-Verbal Communication', description: 'Body language and visual cues', duration: '25 min' },
        ]
      },
    ]
  },
};

export default function SubjectView() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [subject, setSubject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeUnit, setActiveUnit] = useState(0);

  useEffect(() => {
    const fetchSubject = async () => {
        if (id.startsWith('mock')) {
          setSubject(mockSubjectsData[id] || null);
          setLoading(false);
          return;
        }

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

  if (loading) {
    return (
      <div className="min-h-screen bg-main flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full mx-auto mb-3" style={{animation: 'spin 1s linear infinite'}} />
          <p className="text-secondary text-sm">Loading syllabus...</p>
        </div>
      </div>
    );
  }
  
  if (!subject) return <div className="p-10 text-center text-secondary">Subject not found</div>;

  const totalChapters = subject.units.reduce((acc, unit) => acc + unit.chapters.length, 0);

  return (
    <div className="min-h-screen bg-main pb-24 md:pb-10">
      {/* Hero Header */}
      <div className="bg-card border-b border-border-soft">
        <div className="max-w-4xl mx-auto px-6 py-6">
          <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-secondary hover:text-primary mb-4 text-sm font-medium">
            <ArrowLeft className="w-4 h-4" />
            Back
          </button>
          
          <div className="flex items-start gap-5">
            {/* Subject Icon */}
            <div className="w-16 h-16 rounded-2xl bg-accent flex items-center justify-center shrink-0">
              <span className="text-white text-2xl font-bold">{subject.code.charAt(0)}</span>
            </div>
            
            <div className="flex-1">
              <span className="inline-block px-2.5 py-1 rounded-lg bg-accent/10 text-accent text-xs font-bold mb-2">
                {subject.code}
              </span>
              <h1 className="text-2xl font-bold text-primary mb-3">{subject.name}</h1>
              
              {/* Stats */}
              <div className="flex items-center gap-4 text-sm">
                <div className="flex items-center gap-1.5 text-secondary">
                  <Layers className="w-4 h-4" />
                  <span>{subject.units.length} Units</span>
                </div>
                <div className="flex items-center gap-1.5 text-secondary">
                  <FileText className="w-4 h-4" />
                  <span>{totalChapters} Chapters</span>
                </div>
                <div className="flex items-center gap-1.5 text-secondary">
                  <Clock className="w-4 h-4" />
                  <span>~{totalChapters * 40} min</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-6">
        {/* Unit Selector */}
        <div className="flex gap-3 mb-6 overflow-x-auto pb-2 -mx-6 px-6">
          {subject.units.map((unit, index) => (
            <button
              key={unit._id}
              onClick={() => setActiveUnit(index)}
              className={`flex items-center gap-3 px-5 py-3 rounded-2xl text-sm font-semibold whitespace-nowrap transition-all shrink-0 ${
                activeUnit === index
                  ? 'bg-accent text-white shadow-lg shadow-accent/20'
                  : 'bg-card border border-border-soft text-secondary hover:text-primary hover:border-accent/30'
              }`}
            >
              <span className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold ${
                activeUnit === index ? 'bg-white/20' : 'bg-border-soft'
              }`}>
                {unit.unitNumber}
              </span>
              <span className="hidden sm:inline">{unit.title}</span>
              <span className="sm:hidden">Unit {unit.unitNumber}</span>
            </button>
          ))}
        </div>

        {/* Unit Title */}
        <div className="mb-5">
          <h2 className="text-lg font-bold text-primary">
            Unit {subject.units[activeUnit].unitNumber}: {subject.units[activeUnit].title}
          </h2>
          <p className="text-sm text-secondary mt-1">
            {subject.units[activeUnit].chapters.length} chapters in this unit
          </p>
        </div>

        {/* Chapters */}
        <div className="space-y-4">
          {subject.units[activeUnit].chapters.map((chapter, idx) => (
            <Link
              to={`/chapter/${subject._id}/${subject.units[activeUnit]._id}/${chapter._id}`}
              key={chapter._id}
              className="group block"
            >
              <div className="flex gap-4 p-5 bg-card rounded-2xl border border-border-soft hover:border-accent/40 hover:shadow-soft transition-all">
                {/* Number Badge */}
                <div className="relative">
                  <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center text-accent font-bold text-lg group-hover:bg-accent group-hover:text-white transition-all">
                    {chapter.orderIndex}
                  </div>
                  {idx < subject.units[activeUnit].chapters.length - 1 && (
                    <div className="absolute left-1/2 top-full w-0.5 h-4 bg-border-soft -translate-x-1/2" />
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h3 className="font-semibold text-primary text-base group-hover:text-accent transition-colors mb-1">
                        {chapter.title}
                      </h3>
                      <p className="text-sm text-secondary line-clamp-1">{chapter.description}</p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <span className="text-xs text-secondary bg-border-soft px-2 py-1 rounded-lg hidden sm:block">
                        {chapter.duration || '30 min'}
                      </span>
                      <div className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center text-accent group-hover:bg-accent group-hover:text-white transition-all">
                        <Play className="w-3.5 h-3.5 ml-0.5" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Progress Card */}
        <div className="mt-8 p-5 bg-card rounded-2xl border border-border-soft">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-primary">Your Progress</h3>
            <span className="text-sm font-bold text-accent">0%</span>
          </div>
          <div className="w-full h-2 bg-border-soft rounded-full overflow-hidden">
            <div className="h-full bg-accent rounded-full" style={{ width: '0%' }} />
          </div>
          <p className="text-xs text-secondary mt-2">Complete all chapters to master this subject</p>
        </div>
      </div>
    </div>
  );
}
