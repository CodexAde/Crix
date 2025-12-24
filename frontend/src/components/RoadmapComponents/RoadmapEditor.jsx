import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Trash2, Save, Check, X, Edit2, AlertTriangle, ChevronDown, ChevronUp } from 'lucide-react';

const DRAFT_KEY = 'roadmap_draft';

function ExitModal({ onSave, onDiscard, onCancel }) {
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
      >
        <div
          className="absolute inset-0 bg-black/70 backdrop-blur-md"
          onClick={onCancel}
        />
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="relative bg-card border border-white/10 rounded-3xl p-8 max-w-md w-full shadow-2xl z-10"
        >
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 rounded-2xl bg-orange-500/10 flex items-center justify-center">
              <AlertTriangle className="w-6 h-6 text-orange-500" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-primary">Unsaved Changes</h3>
              <p className="text-secondary text-sm">Do you want to save your roadmap?</p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={onSave}
              className="flex-1 flex items-center justify-center gap-2 py-4 bg-accent text-white rounded-xl font-bold shadow-lg shadow-accent/20"
            >
              <Save className="w-5 h-5" />
              Save
            </button>
            <button
              onClick={onDiscard}
              className="flex-1 flex items-center justify-center gap-2 py-4 bg-red-500/10 text-red-500 rounded-xl font-bold border border-red-500/20"
            >
              <Trash2 className="w-5 h-5" />
              Discard
            </button>
          </div>
          <button
            onClick={onCancel}
            className="w-full mt-4 py-3 text-secondary hover:text-primary text-center font-semibold transition-colors"
          >
            Continue Editing
          </button>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

function DayCard({ step, index, onUpdate, onRemove }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <motion.div
      layout
      className="group relative p-4 md:p-5 rounded-2xl bg-card border border-white/5 hover:border-white/10 transition-all"
    >
      <div className="flex items-start gap-4">
        <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-accent/10 flex items-center justify-center text-accent font-bold text-sm shrink-0">
          Day {step.day}
        </div>

        <div className="flex-1 min-w-0">
          <input
            value={step.topic}
            onChange={(e) => onUpdate(index, 'topic', e.target.value)}
            className="w-full bg-transparent text-base font-bold text-primary focus:outline-none border-b border-transparent focus:border-accent/30 truncate"
            placeholder="Topic name"
          />
          
          <p
            className={`text-secondary text-sm mt-1 ${expanded ? '' : 'line-clamp-2'} cursor-pointer`}
            onClick={() => setExpanded(!expanded)}
          >
            {step.description || 'Click to add description...'}
          </p>

          {expanded && (
            <textarea
              value={step.description}
              onChange={(e) => onUpdate(index, 'description', e.target.value)}
              className="w-full bg-surface/50 text-secondary text-sm resize-none focus:outline-none mt-2 p-3 rounded-xl h-24"
              placeholder="Detailed description..."
            />
          )}
        </div>

        <div className="flex items-center gap-1 shrink-0">
          <button
            onClick={() => setExpanded(!expanded)}
            className="p-2 text-secondary hover:text-accent transition-colors"
          >
            {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
          <button
            onClick={() => onRemove(index)}
            className="p-2 text-secondary hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </motion.div>
  );
}

export default function RoadmapEditor({ initialData, onSave, onCancel }) {
  const [roadmap, setRoadmap] = useState(initialData);
  const [editingTitle, setEditingTitle] = useState(false);
  const [showExitModal, setShowExitModal] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    const draft = localStorage.getItem(DRAFT_KEY);
    if (draft) {
      try {
        setRoadmap(JSON.parse(draft));
      } catch (e) {
        console.error("Error loading draft:", e);
      }
    }
  }, []);

  useEffect(() => {
    if (hasChanges) {
      localStorage.setItem(DRAFT_KEY, JSON.stringify(roadmap));
    }
  }, [roadmap, hasChanges]);

  const handleChange = (newRoadmap) => {
    setRoadmap(newRoadmap);
    setHasChanges(true);
  };

  const addStep = () => {
    const newDay = roadmap.steps.length > 0 ? roadmap.steps[roadmap.steps.length - 1].day + 1 : 1;
    handleChange({
      ...roadmap,
      steps: [...roadmap.steps, { day: newDay, topic: 'New Topic', description: '', status: 'pending' }],
    });
  };

  const removeStep = (index) => {
    const newSteps = roadmap.steps.filter((_, i) => i !== index);
    handleChange({ ...roadmap, steps: newSteps });
  };

  const updateStep = (index, field, value) => {
    const newSteps = [...roadmap.steps];
    newSteps[index] = { ...newSteps[index], [field]: value };
    handleChange({ ...roadmap, steps: newSteps });
  };

  const handleSave = () => {
    localStorage.removeItem(DRAFT_KEY);
    onSave(roadmap);
  };

  const handleDiscard = () => {
    localStorage.removeItem(DRAFT_KEY);
    onCancel();
  };

  const handleBack = () => {
    if (hasChanges) {
      setShowExitModal(true);
    } else {
      onCancel();
    }
  };

  return (
    <>
      {showExitModal && (
        <ExitModal
          onSave={handleSave}
          onDiscard={handleDiscard}
          onCancel={() => setShowExitModal(false)}
        />
      )}

      <div className="max-w-4xl mx-auto space-y-4 pb-20">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-card p-5 rounded-2xl border border-white/10">
          <div className="flex-1 min-w-0">
            {editingTitle ? (
              <div className="flex items-center gap-2">
                <input
                  value={roadmap.title}
                  onChange={(e) => handleChange({ ...roadmap, title: e.target.value })}
                  className="bg-transparent border-b-2 border-accent text-xl font-bold text-primary focus:outline-none w-full"
                />
                <button onClick={() => setEditingTitle(false)} className="text-green-500 p-2">
                  <Check className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <h3 className="text-xl md:text-2xl font-bold text-primary truncate">{roadmap.title}</h3>
                <button onClick={() => setEditingTitle(true)} className="text-secondary hover:text-accent p-1">
                  <Edit2 className="w-4 h-4" />
                </button>
              </div>
            )}
            <p className="text-secondary mt-1 text-sm line-clamp-1">{roadmap.description}</p>
          </div>
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={handleBack}
              className="flex-1 sm:flex-none p-3 text-secondary hover:text-red-500 transition-colors border border-white/10 rounded-xl"
            >
              <X className="w-5 h-5 mx-auto" />
            </button>
            <button
              onClick={handleSave}
              className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-5 py-3 bg-accent text-white rounded-xl font-bold shadow-lg shadow-accent/20"
            >
              <Save className="w-4 h-4" />
              Save
            </button>
          </div>
        </div>

        <div className="grid gap-3">
          {roadmap.steps.map((step, index) => (
            <DayCard
              key={index}
              step={step}
              index={index}
              onUpdate={updateStep}
              onRemove={removeStep}
            />
          ))}

          <motion.button
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            onClick={addStep}
            className="w-full py-4 border-2 border-dashed border-white/10 rounded-2xl text-secondary hover:text-accent hover:border-accent/30 transition-all flex items-center justify-center gap-2 font-bold"
          >
            <Plus className="w-5 h-5" />
            Add Day
          </motion.button>
        </div>
      </div>
    </>
  );
}
