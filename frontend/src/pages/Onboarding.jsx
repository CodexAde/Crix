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
  const [showSteps, setShowSteps] = useState(false);

  const handleAcademicSubmit = (e) => {
    e.preventDefault();
    if (!user?.referralCode) {
        if (!referralCode || referralCode.length < 4) {
            toast.error('Referral code required (minimum 4 characters)');
            return;
        }
    }
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
        className="w-full max-w-2xl rounded-[2.5rem] p-10 shadow-soft overflow-hidden"
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
                             <label className="text-xs font-semibold ml-1" style={{ color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>College Name (Optional)</label>
                             <Input 
                                value={academic.college} 
                                onChange={e => setAcademic({...academic, college: e.target.value})}
                                placeholder="e.g. IIT Delhi"
                                className="border-none shadow-sm h-12 rounded-2xl"
                                style={{ backgroundColor: 'var(--bg-card)' }}
                             />
                        </div>
                        <div className="space-y-2">
                             <label className="text-xs font-semibold ml-1" style={{ color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Branch</label>
                             <select 
                                className="flex h-12 w-full rounded-2xl border-none px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent/20 transition-all shadow-sm"
                                style={{ 
                                  backgroundColor: 'var(--bg-card)', 
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
                             <label className="text-xs font-semibold ml-1" style={{ color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Select Year</label>
                             <div className="grid grid-cols-4 gap-3">
                                {['1', '2', '3', '4'].map((year) => (
                                    <button
                                        key={year}
                                        type="button"
                                        onClick={() => setAcademic({ ...academic, year: year })}
                                        className={`h-12 rounded-2xl text-sm font-semibold transition-all duration-300 shadow-sm hover:translate-y-[-2px] active:scale-95 ${
                                            academic.year === year 
                                            ? 'bg-accent text-white shadow-md shadow-accent/20' 
                                            : 'bg-white dark:bg-white/5 text-text-primary hover:bg-white/80 dark:hover:bg-white/10'
                                        }`}
                                        style={{
                                          backgroundColor: academic.year === year ? 'var(--accent)' : undefined,
                                          color: academic.year === year ? 'white' : 'var(--text-primary)'
                                        }}
                                    >
                                        {year}{year === '1' ? 'st' : year === '2' ? 'nd' : year === '3' ? 'rd' : 'th'}
                                    </button>
                                ))}
                             </div>
                        </div>
                        {!user?.referralCode && (
                            <div className="space-y-2">
                                <label className="text-xs font-semibold ml-1" style={{ color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Referral Code</label>
                                <Input 
                                    value={referralCode} 
                                    onChange={e => setReferralCode(e.target.value.toUpperCase())}
                                    placeholder="Enter Referral Code"
                                    required
                                    className="border-none shadow-sm h-12 rounded-2xl"
                                    style={{ backgroundColor: 'var(--bg-card)' }}
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
                    <div className="rounded-[2rem] p-8 space-y-6 transition-all shadow-sm hover:shadow-md" style={{ backgroundColor: 'rgba(0, 122, 255, 0.03)' }}>
                        <div className="flex items-start gap-5">
                            <div className="w-12 h-12 rounded-[1.2rem] bg-accent/10 flex items-center justify-center flex-shrink-0">
                                <span className="text-2xl">✨</span>
                            </div>
                            <div className="space-y-1">
                                <h3 className="font-bold text-xl tracking-tight" style={{ color: 'var(--text-primary)' }}>Glorify Your AI Tutor</h3>
                                <p className={`text-[15px] leading-relaxed font-medium ${!showSteps ? 'line-clamp-1' : ''}`} style={{ color: 'var(--text-secondary)' }}>
                                    Want a highly personalized tutor? Use our special secret prompt with ChatGPT or Claude.
                                </p>
                                <button 
                                    type="button"
                                    onClick={() => setShowSteps(!showSteps)}
                                    className="text-[13px] font-bold text-accent hover:opacity-70 transition-opacity mt-1"
                                >
                                    {showSteps ? 'See Less' : 'See More...'}
                                </button>
                            </div>
                        </div>

                        <AnimatePresence>
                            {showSteps && (
                                <motion.div 
                                    initial={{ opacity: 0, height: 0, marginTop: 0 }}
                                    animate={{ 
                                        opacity: 1, 
                                        height: 'auto', 
                                        marginTop: 8,
                                        transition: {
                                            height: { type: 'spring', damping: 25, stiffness: 200 },
                                            opacity: { duration: 0.2, delay: 0.1 }
                                        }
                                    }}
                                    exit={{ 
                                        opacity: 0, 
                                        height: 0, 
                                        marginTop: 0,
                                        transition: {
                                            height: { type: 'spring', damping: 25, stiffness: 200 },
                                            opacity: { duration: 0.1 }
                                        }
                                    }}
                                    className="overflow-hidden space-y-4"
                                >
                                    <div className="grid grid-cols-1 gap-4 pt-2">
                                        {[
                                            { step: '1', text: 'Copy the secret prompt below' },
                                            { step: '2', text: 'Paste it into AI (ChatGPT/Claude)' },
                                            { step: '3', text: 'Answer few quick questions' },
                                            { step: '4', text: 'Paste the final JSON block here' }
                                        ].map((s) => (
                                            <div key={s.step} className="flex items-center gap-4 p-4 rounded-2xl bg-white dark:bg-black/20 shadow-sm border-none transition-transform hover:scale-[1.01]">
                                                <span className="w-7 h-7 rounded-[0.6rem] bg-accent text-white text-[12px] flex items-center justify-center font-bold">{s.step}</span>
                                                <span className="text-[14px] font-medium" style={{ color: 'var(--text-primary)' }}>{s.text}</span>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="bg-accent/5 p-4 rounded-2xl border border-accent/10">
                                        <p className="text-[11px] font-medium leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                                            This helps the AI understand your language (English/Hindi), tone (casual/formal), and how you like to be taught (bhai style or straight to point).
                                        </p>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        <div className="pt-2">
                            <Button type="button" variant="secondary" className="w-full rounded-[1.5rem] h-14 shadow-soft border-none hover:shadow-md transition-all font-bold" onClick={copyPrompt}>
                                📋 Copy Prompt
                            </Button>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <label className="text-xs font-semibold ml-1" style={{ color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Paste Persona JSON here</label>
                        <textarea
                            className="w-full h-40 rounded-3xl border-none p-6 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-accent/20 transition-all resize-none shadow-sm"
                            style={{ 
                              backgroundColor: 'var(--bg-card)', 
                              color: 'var(--text-primary)'
                            }}
                            placeholder='{ "language_preference": "Hindi english mix", ... }'
                            value={personaJson}
                            onChange={e => setPersonaJson(e.target.value)}
                        ></textarea>
                        <p className="text-[11px] ml-1 font-medium italic opacity-70" style={{ color: 'var(--text-secondary)' }}>If you skip this, we will use a standard friendly academic tone.</p>
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
