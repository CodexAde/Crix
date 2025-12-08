import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function Landing() {
  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden" style={{ backgroundColor: 'var(--bg-main)' }}>
      {/* Background Gradient Orbs */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-blue-400/20 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-400/20 rounded-full blur-3xl translate-x-1/2 translate-y-1/2"></div>

      {/* Navbar */}
      <nav className="w-full px-6 py-6 flex justify-between items-center relative z-10 max-w-7xl mx-auto">
        <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold" style={{ backgroundColor: 'var(--accent)' }}>C</div>
            <span className="text-xl font-bold tracking-tight" style={{ color: 'var(--text-primary)' }}>Cerix</span>
        </div>
        <div className="flex items-center gap-4">
            <Link to="/login" className="text-sm font-medium transition-colors hover:opacity-80" style={{ color: 'var(--text-secondary)' }}>Login</Link>
            <Link 
              to="/register" 
              className="px-5 py-2.5 rounded-full text-white text-sm font-medium hover:opacity-90 transition-all shadow-soft active:scale-95"
              style={{ backgroundColor: 'var(--text-primary)' }}
            >
              Get Started
            </Link>
        </div>
      </nav>

      {/* Hero */}
      <main className="flex-1 flex flex-col items-center justify-center text-center px-4 relative z-10 max-w-4xl mx-auto">
        <motion.div
           initial={{ opacity: 0, y: 30 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ duration: 0.6 }}
        >
            <span 
              className="px-4 py-1.5 rounded-full text-xs font-semibold shadow-sm mb-6 inline-block border"
              style={{ 
                backgroundColor: 'var(--bg-card)', 
                borderColor: 'var(--border-soft)',
                color: 'var(--accent)'
              }}
            >
                For B.Tech 1st Year Students
            </span>
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6 leading-[1.1]" style={{ color: 'var(--text-primary)' }}>
                Master your Syllabus <br/> <span style={{ color: 'var(--accent)' }}>with AI</span>
            </h1>
            <p className="text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                A personalized AI tutor that understands you. Complete your B.Tech 1st year syllabus faster, smarter, and with way less stress.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <Link 
                  to="/register" 
                  className="px-8 py-4 rounded-full text-white font-semibold text-lg shadow-strong hover:shadow-lg hover:-translate-y-0.5 transition-all w-full sm:w-auto"
                  style={{ backgroundColor: 'var(--accent)' }}
                >
                    Start Learning Free
                </Link>
                 <Link 
                   to="/demo" 
                   className="px-8 py-4 rounded-full font-semibold text-lg border shadow-soft hover:opacity-80 transition-all w-full sm:w-auto"
                   style={{ 
                     backgroundColor: 'var(--bg-card)', 
                     color: 'var(--text-primary)',
                     borderColor: 'var(--border-soft)'
                   }}
                 >
                    View Verified Syllabus
                </Link>
            </div>
        </motion.div>

        {/* Floating UI Mockup */}
        <motion.div 
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="mt-20 w-full max-w-5xl rounded-[2rem] shadow-strong border p-2 overflow-hidden"
            style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-soft)' }}
        >
            <div 
              className="w-full h-64 md:h-96 rounded-[1.5rem] flex items-center justify-center"
              style={{ backgroundColor: 'var(--bg-surface)', color: 'var(--text-secondary)' }}
            >
               {/* Placeholder for App Screenshot */}
               <span className="text-sm">App Dashboard Preview</span>
            </div>
        </motion.div>
      </main>
    </div>
  );
}
