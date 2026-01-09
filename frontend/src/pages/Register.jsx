import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

// SVG Icons for social login
const GoogleIcon = () => (
  <svg viewBox="0 0 24 24" width="20" height="20">
    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
  </svg>
);

const GithubIcon = () => (
  <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
  </svg>
);

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await register(name, email, password);
      toast.success('Registration successful!');
      navigate('/pending-approval');
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    window.location.href = '/api/v1/users/auth/google';
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ backgroundColor: 'var(--bg-main)' }}>
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md rounded-[2rem] p-8 shadow-strong"
        style={{ backgroundColor: 'var(--bg-card)' }}
      >
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold tracking-tight mb-2" style={{ color: 'var(--text-primary)' }}>Create Account</h1>
          <p style={{ color: 'var(--text-secondary)' }}>Start your AI-powered learning journey.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Input
              type="text"
              placeholder="Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div>
            <Input
              type="email"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <Input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <Button type="submit" className="w-full" isLoading={loading}>
            Sign Up
          </Button>

          <div className="relative my-6">
             <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" style={{ borderColor: 'var(--border-soft)' }} />
             </div>
             <div className="relative flex justify-center text-xs uppercase">
                <span className="px-2" style={{ backgroundColor: 'var(--bg-card)', color: 'var(--text-secondary)' }}>Or continue with</span>
             </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <button 
                type="button" 
                onClick={handleGoogleLogin}
                className="flex items-center justify-center gap-2 h-11 rounded-2xl border transition-colors hover:bg-accent/5"
                style={{ borderColor: 'var(--border-soft)', color: 'var(--text-primary)' }}
            >
               <GoogleIcon />
               <span className="text-sm font-medium">Google</span>
            </button>
            <button 
              type="button" 
              className="flex items-center justify-center gap-2 h-11 rounded-2xl border transition-colors hover:bg-accent/5"
              style={{ borderColor: 'var(--border-soft)', color: 'var(--text-primary)' }}
              onClick={() => toast.error('GitHub login coming soon!')}
            >
               <GithubIcon />
               <span className="text-sm font-medium">Github</span>
            </button>
          </div>

          <p className="text-center text-sm mt-6" style={{ color: 'var(--text-secondary)' }}>
            Already have an account?{' '}
            <Link to="/login" className="font-medium hover:underline" style={{ color: 'var(--accent)' }}>
              Sign in
            </Link>
          </p>
        </form>
      </motion.div>
    </div>
  );
}
