import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import toast from 'react-hot-toast';

export default function Onboarding() {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  // Step 1: Academic Info
  const [academic, setAcademic] = useState({
    college: '',
    branch: 'CSE',
    year: '1'
  });
  const [referralCode, setReferralCode] = useState('');

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
                toast.error("Invalid JSON format. Please copy the exact JSON from ChatGPT/Gemini.");
                setLoading(false);
                return;
            }
        }

        const payload = {
            ...academic,
            year: parseInt(academic.year),
            personaProfile: parsedPersona,
            referralCode: referralCode || undefined
        };

        await axios.post('/users/onboarding', payload);
        toast.success('Profile setup complete! 🎉');
        
        // Force reload or redirect to dashboard
        window.location.href = '/dashboard'; 

    } catch (error) {
        console.error(error);
        toast.error(error.response?.data?.message || 'Onboarding failed. Please try again.');
    } finally {
        setLoading(false);
    }
  };

  const copyPrompt = () => {
    const promptText = `You are an assistant that will help configure how future AI tutors should talk to me.

5 quick questions to understand:
    - Which language I prefer (for example: Hindi but written in English letters),
    - How informal or formal I like the tone (e.g., very casual, using words like 'bhai', 'tu', 'tere'),
    - Whether I like emojis or not, and how often,
    - How deep and detailed explanations should be,
    - Whether I prefer step-by-step breakdowns or short summaries,
    - What kind of examples I like (real-life / exam-focused / coding / mechanical, etc.),
    - How much motivation / friendly talk I enjoy vs pure straight-to-the-point explanations.

 DO NOT give a long essay. Instead, output a concise JSON object with fields like:
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

4. Make the JSON self-contained so any AI tutor can use it as a system prompt to talk to me in my favourite style (for example: Hindi in English alphabets, casual 'tu/tere', with a few emojis, etc.).
-response should only be in JSON format and answer all my questions.`;
    
    navigator.clipboard.writeText(promptText);
    toast.success('Prompt copied! Paste it into ChatGPT or Gemini.');
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ backgroundColor: 'var(--bg-main)' }}>
      <motion.div 
        layout
        className="w-full max-w-2xl rounded-[2rem] p-8 shadow-strong overflow-hidden"
        style={{ backgroundColor: 'var(--bg-card)' }}
      >
        <div className="flex justify-between items-center mb-8">
            <h1 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>
                {step === 1 ? 'Academic Profile' : 'Personalize AI'}
            </h1>
            <div className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>
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
                             <label className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>College Name (Optional)</label>
                             <Input 
                                value={academic.college} 
                                onChange={e => setAcademic({...academic, college: e.target.value})}
                                placeholder="e.g. IIT Delhi"
                             />
                        </div>
                        <div className="space-y-2">
                             <label className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>Branch</label>
                             <select 
                                className="flex h-12 w-full rounded-2xl border px-4 py-2 text-sm focus:outline-none"
                                style={{ 
                                  backgroundColor: 'var(--bg-card)', 
                                  borderColor: 'var(--border-soft)',
                                  color: 'var(--text-primary)'
                                }}
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
                             <label className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>Year</label>
                             <select 
                                disabled 
                                className="flex h-12 w-full rounded-2xl border px-4 py-2 text-sm opacity-60"
                                style={{ 
                                  backgroundColor: 'var(--bg-surface)', 
                                  borderColor: 'var(--border-soft)',
                                  color: 'var(--text-secondary)'
                                }}
                             >
                                <option>1st Year (B.Tech)</option>
                             </select>
                        </div>
                        {!user?.referralCode && (
                            <div className="space-y-2">
                                <label className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>Referral Code</label>
                                <Input 
                                    value={referralCode} 
                                    onChange={e => setReferralCode(e.target.value.toUpperCase())}
                                    placeholder="Enter Referral Code"
                                    required
                                />
                            </div>
                        )}
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
                    <div className="rounded-2xl p-6 text-sm leading-relaxed" style={{ backgroundColor: 'rgba(0, 122, 255, 0.08)', border: '1px solid rgba(0, 122, 255, 0.2)', color: 'var(--accent)' }}>
                        <p className="mb-4">
                            <strong>Want a highly personalized tutor?</strong> Use our special prompt with ChatGPT/Claude, then paste the result here.
                        </p>
                        <Button type="button" variant="secondary" size="sm" onClick={copyPrompt}>
                            Copy Persona Discovery Prompt
                        </Button>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>Paste Persona JSON here</label>
                        <textarea
                            className="w-full h-48 rounded-2xl border p-4 text-sm font-mono focus:outline-none resize-none"
                            style={{ 
                              backgroundColor: 'var(--bg-card)', 
                              borderColor: 'var(--border-soft)',
                              color: 'var(--text-primary)'
                            }}
                            placeholder='{ "language_preference": "Hindi english mix", ... }'
                            value={personaJson}
                            onChange={e => setPersonaJson(e.target.value)}
                        ></textarea>
                        <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>If you skip this, we will use a standard friendly academic tone.</p>
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
