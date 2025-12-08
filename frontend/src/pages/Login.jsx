import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { motion } from 'framer-motion';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(email, password);
      // Once logged in, check if onboarding is complete or not
      // For now, let's just go to dashboard or onboarding
      // We will handle redirect logic in App.jsx or here later
      navigate('/dashboard'); 
    } catch (error) {
      console.error(error);
      alert('Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-[#f5f6f8]">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-white rounded-[2rem] p-8 shadow-strong"
      >
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold tracking-tight text-primary mb-2">Welcome back</h1>
          <p className="text-secondary">Enter your details to continue your journey.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
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
          <div className="flex justify-end">
             <Link to="/forgot-password" class="text-sm text-accent hover:underline">Forgot password?</Link>
          </div>

          <Button type="submit" className="w-full" isLoading={loading}>
            Sign In
          </Button>

          <div className="relative my-6">
             <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-gray-200" />
             </div>
             <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-2 text-gray-500">Or continue with</span>
             </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <button 
                type="button" 
                onClick={() => window.location.href = `${import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000/api/v1'}/users/auth/google`}
                className="flex items-center justify-center h-11 rounded-2xl border border-gray-200 hover:bg-gray-50 transition-colors"
            >
               Google
            </button>
            <button type="button" className="flex items-center justify-center h-11 rounded-2xl border border-gray-200 hover:bg-gray-50 transition-colors">
               Github
            </button>
          </div>

          <p className="text-center text-sm text-secondary mt-6">
            Don't have an account?{' '}
            <Link to="/register" className="text-accent font-medium hover:underline">
              Create account
            </Link>
          </p>
        </form>
      </motion.div>
    </div>
  );
}
