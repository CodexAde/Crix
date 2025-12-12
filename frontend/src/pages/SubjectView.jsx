import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Clock, ChevronRight, ArrowLeft, BookOpen, Play } from 'lucide-react';
import { PageLoader } from '../components/Spinner';

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
                    { _id: 'ch1', orderIndex: 1, title: 'Normal and Shear Stress', description: 'Understanding stress components in materials' },
                    { _id: 'ch2', orderIndex: 2, title: 'Strain and Deformation', description: 'Types of strain and material deformation' },
                    { _id: 'ch3', orderIndex: 3, title: 'Stress-Strain Relationship', description: 'Hookes law and material properties' },
                ]
            },
            {
                _id: 'unit2',
                unitNumber: 2,
                title: 'Centroid and Moment of Inertia',
                chapters: [
                    { _id: 'ch4', orderIndex: 1, title: 'Centroid of Areas', description: 'Finding center of gravity of shapes' },
                    { _id: 'ch5', orderIndex: 2, title: 'Moment of Inertia', description: 'Second moment of area calculations' },
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
                    { _id: 'ch1', orderIndex: 1, title: 'Wave-Particle Duality', description: 'Understanding dual nature of matter' },
                    { _id: 'ch2', orderIndex: 2, title: 'Schrodinger Wave Equation', description: 'Mathematical formulation of quantum mechanics' },
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
                    { _id: 'ch1', orderIndex: 1, title: 'Successive Differentiation', description: 'Higher order derivatives and Leibniz theorem' },
                    { _id: 'ch2', orderIndex: 2, title: 'Mean Value Theorems', description: 'Rolles and Lagranges theorems' },
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
                    { _id: 'ch1', orderIndex: 1, title: 'Verbal Communication', description: 'Effective speaking and presentation skills' },
                    { _id: 'ch2', orderIndex: 2, title: 'Non-Verbal Communication', description: 'Body language and visual cues' },
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
        return <PageLoader text="Loading subject..." />;
    }

    if (!subject) return <div className="p-10 text-center text-secondary">Subject not found</div>;

    return (
        <div className="min-h-screen bg-main pb-24 md:pb-10">
            {/* Sticky Header */}
<header className="bg-card/90 backdrop-blur-md border-b border-border-soft sticky top-0 z-20">
  <div className="relative max-w-3xl mx-auto px-6 py-4 flex items-center">
    
    {/* <button
      onClick={() => navigate(-1)}
      className="p-2 hover:bg-border-soft rounded-full transition-colors absolute left-6"
    >
      <ArrowLeft className="w-5 h-5 text-primary" />
    </button> */}

    <div className="flex-1 text-center pointer-events-none">
      <p className="text-xs font-medium text-accent mb-0.5">
        {subject.code}
      </p>
      <h1 className="text-lg font-bold text-primary truncate">
        {subject.name}
      </h1>
    </div>

  </div>
</header>

            <main className="max-w-3xl mx-auto px-6 py-8">
                {/* Unit Selector */}
                <div className="my-8">
                    {/* <p className="text-sm text-secondary mb-3">Select Unit</p> */}
                    <div className="flex gap-3 mt-4 mb-2 overflow-x-auto pb-2 -mx-6 px-6 no-scrollbar snap-x">
                        {subject.units.map((unit, index) => (
                            <button
                                key={unit._id}
                                onClick={() => setActiveUnit(index)}
                                className={`px-5 py-3 rounded-2xl font-medium transition-all whitespace-nowrap flex-shrink-0 snap-center ${activeUnit === index
                                        ? 'bg-accent text-white shadow-lg shadow-accent/25'
                                        : 'bg-card border border-border-soft text-secondary hover:border-accent/40 hover:text-primary'
                                    }`}
                            >
                                Unit {unit.unitNumber}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Active Unit Title */}
                <div className="my-6">
                    <h2 className="text-xl font-bold text-primary text-center">
                        {subject.units[activeUnit].title}
                    </h2>
                    <p className="text-sm text-secondary mt-1 text-center">
                        {subject.units[activeUnit].chapters.length} chapters
                    </p>
                </div>

                {/* Chapters List */}
                <div className="space-y-4">
                    {subject.units[activeUnit].chapters.map((chapter) => (
                        <Link
                            to={`/chapter/${subject._id}/${subject.units[activeUnit]._id}/${chapter._id}`}
                            key={chapter._id}
                            className="group block bg-card rounded-2xl border border-border-soft hover:border-accent/50 hover:shadow-soft transition-all overflow-hidden"
                        >
                            <div className="p-5 flex items-center gap-5">
                                {/* Chapter Number */}
                                <div className="w-14 h-14 rounded-2xl bg-accent/10 flex items-center justify-center shrink-0 group-hover:bg-accent transition-colors">
                                    <span className="text-xl font-bold text-accent group-hover:text-white transition-colors">
                                        {chapter.orderIndex}
                                    </span>
                                </div>

                                {/* Content */}
                                <div className="flex-1 min-w-0">
                                    <h3 className="text-base font-semibold text-primary group-hover:text-accent transition-colors mb-1">
                                        {chapter.title}
                                    </h3>
                                    <p className="text-sm text-secondary line-clamp-1">{chapter.description}</p>
                                </div>

                                {/* Play Icon */}
                                <div className="w-10 h-10 rounded-full bg-border-soft flex items-center justify-center shrink-0 group-hover:bg-accent transition-colors">
                                    <Play className="w-4 h-4 text-secondary group-hover:text-white transition-colors ml-0.5" />
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>

                {/* Progress Bar */}
                {/* <div className="mt-10 bg-card rounded-2xl border border-border-soft p-5">
          <div className="flex items-center justify-between mb-3">
            <p className="font-medium text-primary">Your Progress</p>
            <span className="text-sm font-bold text-accent">0%</span>
          </div>
          <div className="h-2 bg-border-soft rounded-full overflow-hidden">
            <div className="h-full bg-accent rounded-full w-0" />
          </div>
        </div> */}
            </main>
        </div>
    );
}
