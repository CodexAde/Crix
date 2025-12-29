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

function DayCard({ day, dayIndex, onUpdateDay, onRemoveDay, onAddTopic, onUpdateTopic, onRemoveTopic }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <motion.div
      layout
      className="group relative p-4 md:p-5 rounded-2xl bg-card border border-white/5 hover:border-white/10 transition-all"
    >
      <div className="flex items-start gap-4">
        <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-accent/10 flex items-center justify-center text-accent font-bold text-sm shrink-0">
          Day {day.dayNumber}
        </div>

        <div className="flex-1 min-w-0">
          <input
            value={day.title}
            onChange={(e) => onUpdateDay(dayIndex, 'title', e.target.value)}
            className="w-full bg-transparent text-base font-bold text-primary focus:outline-none border-b border-transparent focus:border-accent/30 truncate"
            placeholder="Day title..."
          />
          
          <p className="text-secondary text-xs mt-1">
            {day.topics?.length || 0} topics
          </p>
        </div>

        <div className="flex items-center gap-1 shrink-0">
          <button
            onClick={() => setExpanded(!expanded)}
            className="p-2 text-secondary hover:text-accent transition-colors"
          >
            {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
          <button
            onClick={() => onRemoveDay(dayIndex)}
            className="p-2 text-secondary hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="mt-4 space-y-3 pl-4 border-l-2 border-white/10">
              {day.topics?.map((topic, topicIndex) => (
                <div key={topicIndex} className="group/topic flex gap-3 p-3 rounded-xl bg-surface/50">
                  <div className="flex-1 space-y-2">
                    <input
                      value={topic.title}
                      onChange={(e) => onUpdateTopic(dayIndex, topicIndex, 'title', e.target.value)}
                      className="w-full bg-transparent text-sm font-semibold text-primary focus:outline-none"
                      placeholder="Topic title..."
                    />
                    <textarea
                      value={topic.description || ''}
                      onChange={(e) => onUpdateTopic(dayIndex, topicIndex, 'description', e.target.value)}
                      className="w-full bg-transparent text-xs text-secondary resize-none focus:outline-none h-12"
                      placeholder="Description..."
                    />
                  </div>
                  <button
                    onClick={() => onRemoveTopic(dayIndex, topicIndex)}
                    className="p-1 text-secondary hover:text-red-500 transition-colors opacity-0 group-hover/topic:opacity-100"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              ))}
              <button
                onClick={() => onAddTopic(dayIndex)}
                className="w-full py-2 text-xs text-secondary hover:text-accent border border-dashed border-white/10 rounded-xl"
              >
                + Add Topic
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
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

  const addDay = () => {
    const newDayNumber = roadmap.days?.length > 0 ? roadmap.days[roadmap.days.length - 1].dayNumber + 1 : 1;
    handleChange({
      ...roadmap,
      days: [...(roadmap.days || []), { dayNumber: newDayNumber, title: `Day ${newDayNumber}`, topics: [] }],
    });
  };

  const removeDay = (dayIndex) => {
    const newDays = roadmap.days.filter((_, i) => i !== dayIndex);
    handleChange({ ...roadmap, days: newDays });
  };

  const updateDay = (dayIndex, field, value) => {
    const newDays = [...roadmap.days];
    newDays[dayIndex] = { ...newDays[dayIndex], [field]: value };
    handleChange({ ...roadmap, days: newDays });
  };

  const addTopic = (dayIndex) => {
    const newDays = [...roadmap.days];
    const topics = newDays[dayIndex].topics || [];
    newDays[dayIndex] = {
      ...newDays[dayIndex],
      topics: [...topics, { title: 'New Topic', description: '', orderIndex: topics.length }],
    };
    handleChange({ ...roadmap, days: newDays });
  };

  const removeTopic = (dayIndex, topicIndex) => {
    const newDays = [...roadmap.days];
    newDays[dayIndex].topics = newDays[dayIndex].topics.filter((_, i) => i !== topicIndex);
    handleChange({ ...roadmap, days: newDays });
  };

  const updateTopic = (dayIndex, topicIndex, field, value) => {
    const newDays = [...roadmap.days];
    newDays[dayIndex].topics[topicIndex] = { ...newDays[dayIndex].topics[topicIndex], [field]: value };
    handleChange({ ...roadmap, days: newDays });
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
                  value={roadmap.name}
                  onChange={(e) => handleChange({ ...roadmap, name: e.target.value })}
                  className="bg-transparent border-b-2 border-accent text-xl font-bold text-primary focus:outline-none w-full"
                />
                <button onClick={() => setEditingTitle(false)} className="text-green-500 p-2">
                  <Check className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <h3 className="text-xl md:text-2xl font-bold text-primary truncate">{roadmap.name}</h3>
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
          {roadmap.days?.map((day, dayIndex) => (
            <DayCard
              key={dayIndex}
              day={day}
              dayIndex={dayIndex}
              onUpdateDay={updateDay}
              onRemoveDay={removeDay}
              onAddTopic={addTopic}
              onUpdateTopic={updateTopic}
              onRemoveTopic={removeTopic}
            />
          ))}

          <motion.button
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            onClick={addDay}
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
