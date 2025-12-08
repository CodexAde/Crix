import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';

export default function Onboarding() {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth(); // We might need to update user context after this
  const navigate = useNavigate();

  // Step 1: Academic Info
  const [academic, setAcademic] = useState({
    college: '',
    branch: 'CSE',
    year: '1',
    universitySchema: '',
    targetExamDate: ''
  });

  // Step 2: Persona JSON
  const [personaJson, setPersonaJson] = useState('');

  const handleAcademicSubmit = (e) => {
    e.preventDefault();
    setStep(2);
  };

  const handleFinalSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
        let parsedPersona = null;
        if(personaJson.trim()) {
            try {
                parsedPersona = JSON.parse(personaJson);
            } catch (err) {
                alert("Invalid JSON. Please copy exactly from the prompt result.");
                setLoading(false);
                return;
            }
        }

        const payload = {
            ...academic,
            year: parseInt(academic.year),
            personaProfile: parsedPersona
        };

        await axios.post('/users/onboarding', payload);
        
        // Force reload or redirect to dashboard (ideally we update context)
        window.location.href = '/dashboard'; 

    } catch (error) {
        console.error(error);
        alert('Onboarding failed. Please try again.');
    } finally {
        setLoading(false);
    }
  };

  const copyPrompt = () => {
    const promptText = `You are an assistant that will help configure how future AI tutors should talk to me.

1. First, ask me up to 5 quick questions to understand:
    - Which language I prefer (for example: Hindi but written in English letters),
    - How informal or formal I like the tone (e.g., very casual, using words like 'bhai', 'tu', 'tere'),
    - Whether I like emojis or not, and how often,
    - How deep and detailed explanations should be,
    - Whether I prefer step-by-step breakdowns or short summaries,
    - What kind of examples I like (real-life / exam-focused / coding / mechanical, etc.),
    - How much motivation / friendly talk I enjoy vs pure straight-to-the-point explanations.

2. Have a short conversation with me to observe my natural style and phrases.

3. At the end, DO NOT give a long essay. Instead, output a concise JSON object with fields like:
    {
      "language_preference": "...",
      "script_preference": "...",
      "tone": "...",
      "formality": "...",
      "emoji_usage": "...",
      "explanation_depth": "...",
      "explanation_style": "...",
      "pacing": "...",
      "examples_preference": "...",
      "motivation_style": "...",
      "do_and_dont": [...]
    }

4. Make the JSON self-contained so any AI tutor can use it as a system prompt to talk to me in my favourite style (for example: Hindi in English alphabets, casual 'tu/tere', with a few emojis, etc.).`;
    
    navigator.clipboard.writeText(promptText);
    alert('Prompt copied to clipboard! Paste it into ChatGPT/Gemini.');
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-[#f5f6f8]">
      <motion.div 
        layout
        className="w-full max-w-2xl bg-white rounded-[2rem] p-8 shadow-strong overflow-hidden"
      >
        <div className="flex justify-between items-center mb-8">
            <h1 className="text-2xl font-bold text-primary">
                {step === 1 ? 'Academic Profile' : 'Personalize AI'}
            </h1>
            <div className="text-sm font-medium text-secondary">
                Step {step} of 2
            </div>
        </div>

        <AnimatePresence mode="wait">
            {step === 1 ? (
                <motion.form
                    key="step1"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    onSubmit={handleAcademicSubmit}
                    className="space-y-6"
                >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                             <label className="text-sm font-medium text-secondary">College Name (Optional)</label>
                             <Input 
                                value={academic.college} 
                                onChange={e => setAcademic({...academic, college: e.target.value})}
                                placeholder="e.g. IIT Delhi"
                             />
                        </div>
                        <div className="space-y-2">
                             <label className="text-sm font-medium text-secondary">Branch</label>
                             <select 
                                className="flex h-12 w-full rounded-2xl border border-gray-200 bg-white px-4 py-2 text-sm text-primary focus:border-accent focus:outline-none"
                                value={academic.branch}
                                onChange={e => setAcademic({...academic, branch: e.target.value})}
                             >
                                <option value="CSE">Computer Science (CSE)</option>
                                <option value="IT">Information Tech (IT)</option>
                                <option value="ECE">Electronics (ECE)</option>
                                <option value="ME">Mechanical (ME)</option>
                                <option value="CE">Civil (CE)</option>
                             </select>
                        </div>
                        <div className="space-y-2">
                             <label className="text-sm font-medium text-secondary">Year</label>
                             <select disabled className="flex h-12 w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-2 text-sm text-secondary">
                                <option>1st Year (B.Tech)</option>
                             </select>
                        </div>
                        <div className="space-y-2">
                             <label className="text-sm font-medium text-secondary">University / Scheme</label>
                             <Input 
                                value={academic.universitySchema} 
                                onChange={e => setAcademic({...academic, universitySchema: e.target.value})}
                                placeholder="e.g. AKTU 2023"
                                required
                             />
                        </div>
                        <div className="md:col-span-2 space-y-2">
                             <label className="text-sm font-medium text-secondary">Target Exam Date</label>
                             <Input 
                                type="date"
                                value={academic.targetExamDate} 
                                onChange={e => setAcademic({...academic, targetExamDate: e.target.value})}
                                required
                             />
                        </div>
                    </div>
                    
                    <div className="flex justify-end pt-4">
                        <Button type="submit">Next Step</Button>
                    </div>
                </motion.form>
            ) : (
                <motion.form
                    key="step2"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    onSubmit={handleFinalSubmit}
                    className="space-y-6"
                >
                    <div className="bg-blue-50 border border-blue-100 rounded-2xl p-6 text-sm text-blue-900 leading-relaxed">
                        <p className="mb-4">
                            <strong>Want a highly personalized tutor?</strong> Use our special prompt with ChatGPT/Claude, then paste the result here.
                        </p>
                        <Button type="button" variant="secondary" size="sm" onClick={copyPrompt}>
                            Copy Persona Discovery Prompt
                        </Button>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-secondary">Paste Persona JSON here</label>
                        <textarea
                            className="w-full h-48 rounded-2xl border border-gray-200 bg-white p-4 text-sm font-mono focus:border-accent focus:outline-none resize-none"
                            placeholder='{ "language_preference": "Hindi english mix", ... }'
                            value={personaJson}
                            onChange={e => setPersonaJson(e.target.value)}
                        ></textarea>
                        <p className="text-xs text-gray-400">If you skip this, we will use a standard friendly academic tone.</p>
                    </div>

                    <div className="flex justify-between pt-4">
                        <Button type="button" variant="ghost" onClick={() => setStep(1)}>Back</Button>
                        <Button type="submit" isLoading={loading}>Complete Setup</Button>
                    </div>
                </motion.form>
            )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
