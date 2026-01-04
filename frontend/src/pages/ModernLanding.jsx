import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import Hero from '../components/LandingComponents/Hero';
import FeatureStack from '../components/LandingComponents/FeatureStack';
import ScrollMorph from '../components/LandingComponents/ScrollMorph';
import Showcase from '../components/LandingComponents/Showcase';
import Testimonials from '../components/LandingComponents/Testimonials';
import Footer from '../components/LandingComponents/Footer';
import BentoGrid from '../components/LandingComponents/BentoGrid';
import CTASection from '../components/LandingComponents/CTASection';
import { Sparkles } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';

export default function ModernLanding() {
  const [scrolled, setScrolled] = useState(false);
  const [navVisible, setNavVisible] = useState(true);
  const morphSectionRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);

      // Logic to hide navbar during ScrollMorph section
      if (morphSectionRef.current) {
        const rect = morphSectionRef.current.getBoundingClientRect();
        const topThreshold = 100; // Buffer for when it starts appearing
        const bottomThreshold = -100; // Buffer for when it's leaving
        
        // If the morph section matches these conditions, we hide the nav
        // We want it to be hidden effectively while the user is "inside" the experience of that section
        const isNeedToHide = rect.top < window.innerHeight && rect.bottom > 0;
        
        // However, user said "baad mein mast tarike se aa jaye".
        // Let's refine based on user requested flow:
        // Visible initially -> User scrolls -> Morph Section Comes -> Hide Nav -> Morph Section Ends -> Show Nav
        
        if (isNeedToHide) {
             setNavVisible(false);
        } else {
             setNavVisible(true);
        }
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-black text-white selection:bg-red-500 selection:text-white font-sans">
      <AnimatePresence>
        {navVisible && (
            <motion.nav 
                initial={{ y: -100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -100, opacity: 0 }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
                className={`fixed top-0 w-full z-50 px-6 py-6 flex justify-between items-center max-w-7xl mx-auto left-0 right-0 transition-colors duration-300 ${
                scrolled ? 'bg-black/80 backdrop-blur-md border-b border-white/10' : 'mix-blend-difference'
                }`}
            >
                <Link to="/" className="flex items-center gap-2 group">
                    <div className="w-8 h-8 rounded-lg bg-red-600 flex items-center justify-center shadow-lg shadow-red-600/20 shrink-0 group-hover:scale-110 transition-transform">
                        <Sparkles className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-xl font-bold tracking-tight text-white">Crix</span>
                </Link>

                {/* <div className="hidden md:flex items-center gap-8">
                     <a href="#features" className="text-sm font-medium text-zinc-400 hover:text-white transition-colors">Features</a>
                     <a href="#showcase" className="text-sm font-medium text-zinc-400 hover:text-white transition-colors">Showcase</a>
                </div> */}

                <div className="flex items-center gap-4">
                    <Link to="/login" className="text-sm font-medium text-white hover:text-red-500 transition-colors hidden md:block">Login</Link>
                    <Link to="/register" className="bg-white text-black px-6 py-2 rounded-full font-medium hover:bg-red-600 hover:text-white transition-all duration-300">
                        Get Started
                    </Link>
                </div>
            </motion.nav>
        )}
      </AnimatePresence>

      <Hero />
      <Showcase />
      {/* Wrapper to attach ref for intersection/scroll detection */}
      <div ref={morphSectionRef}>
         <ScrollMorph />
      </div>
            <BentoGrid />      

      <FeatureStack />


      <Testimonials />
      <CTASection />
      
      <Footer />
    </div>
  );
}
