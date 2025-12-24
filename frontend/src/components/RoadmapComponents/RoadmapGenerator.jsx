import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Loader2, Wand2, ChevronDown } from 'lucide-react';
import { getSyllabusSubjects } from '../../services/roadmapServices';

export default function RoadmapGenerator({ onGenerate, loading }) {
  const [subject, setSubject] = useState('');
  const [duration, setDuration] = useState(30);
  const [subjects, setSubjects] = useState([]);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        const data = await getSyllabusSubjects();
        setSubjects(data || []);
      } catch (error) {
        console.error("Error fetching subjects:", error);
      } finally {
        setFetching(false);
      }
    };
    fetchSubjects();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    onGenerate(subject, duration);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-xl mx-auto p-6 md:p-10 rounded-[2rem] bg-card border border-white/10"
    >
      <div className="mb-8 text-center">
        <h3 className="text-2xl md:text-3xl font-bold text-primary mb-2">
          Configure Roadmap
        </h3>
        <p className="text-secondary text-sm md:text-base">
          Select a subject from your syllabus to generate a detailed path.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        <div>
          <label className="block text-xs font-bold text-secondary uppercase tracking-widest mb-3 ml-1">
            Syllabus Subject
          </label>
          <div className="relative">
            <select
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="w-full px-6 py-4 rounded-2xl bg-white border-2 border-white/20 focus:border-accent focus:outline-none text-black font-semibold transition-all appearance-none cursor-pointer"
              required
              disabled={fetching}
            >
              <option value="" disabled>
                {fetching ? "Loading subjects..." : "Select a subject"}
              </option>
              {subjects.map((sub) => (
                <option key={sub._id} value={sub.name}>
                  {sub.name}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-black/50 pointer-events-none" />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-secondary uppercase tracking-widest mb-3 ml-1">
            Duration (Days)
          </label>
          <div className="flex items-center gap-4">
            <input
              type="range"
              min="7"
              max="30"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              className="flex-1 h-3 bg-surface rounded-lg appearance-none cursor-pointer accent-accent"
            />
            <span className="w-20 text-center font-bold text-accent bg-accent/10 py-3 rounded-xl text-lg">
              {duration} Days
            </span>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading || !subject}
          className="w-full flex items-center justify-center gap-3 py-5 bg-accent text-white rounded-2xl font-bold shadow-lg shadow-accent/30 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed text-lg"
        >
          {loading ? (
            <Loader2 className="w-6 h-6 animate-spin" />
          ) : (
            <Wand2 className="w-6 h-6" />
          )}
          {loading ? 'Generating Neural Path...' : 'Generate AI Roadmap'}
        </button>
      </form>
    </motion.div>
  );
}
