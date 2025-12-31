import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform, useMotionValue, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { Sparkles, ArrowRight, CheckCircle2, Zap, Brain, Shield, ChevronDown, Rocket, X, Check, GraduationCap } from 'lucide-react';
import Lenis from 'lenis';
import { Canvas, useFrame } from '@react-three/fiber';
import { LandingLoader } from '../components/Spinner';
import { Stars, Float, PerspectiveCamera, Environment } from '@react-three/drei';
import * as THREE from 'three';

// --- Three.js Components ---
function FloatingParticles() {
  const ref = useRef();
  
  useFrame((state) => {
    const { x, y } = state.mouse;
    const scrollY = window.scrollY;
    
    // Amplify scroll effect for more "moments"
    ref.current.rotation.x = THREE.MathUtils.lerp(ref.current.rotation.x, (y * 0.2) + (scrollY * 0.001), 0.05);
    ref.current.rotation.y = THREE.MathUtils.lerp(ref.current.rotation.y, (x * 0.2) + (scrollY * 0.0005), 0.05);
    ref.current.position.z = THREE.MathUtils.lerp(ref.current.position.z, scrollY * 0.002, 0.05);
  });
  return (
    <group ref={ref}>
      <Stars radius={50} depth={50} count={5000} factor={4} saturation={0} fade speed={2} />
    </group>
  );
}

function Mascot() {
    const group = useRef();
    const eyes = useRef();

    useFrame((state) => {
        const { x, y } = state.mouse;
        // Head subtle follow
        if(group.current) {
            group.current.rotation.y = THREE.MathUtils.lerp(group.current.rotation.y, x * 0.6, 0.1);
            group.current.rotation.x = THREE.MathUtils.lerp(group.current.rotation.x, -y * 0.6, 0.1);
        }
        // Eyes tracking more intensely
        if(eyes.current) {
            eyes.current.position.x = THREE.MathUtils.lerp(eyes.current.position.x, x * 0.3, 0.2);
            eyes.current.position.y = THREE.MathUtils.lerp(eyes.current.position.y, y * 0.3, 0.2);
        }
    });

    return (
        <Float speed={2} rotationIntensity={0.2} floatIntensity={0.5}>
            <group ref={group}>
                {/* Head */}
                <mesh>
                    <boxGeometry args={[1.2, 1, 1]} />
                    <meshStandardMaterial color="#1a1a1a" roughness={0.3} metalness={0.8} />
                </mesh>
                {/* Face Screen */}
                <mesh position={[0, 0, 0.51]}>
                    <planeGeometry args={[1, 0.8]} />
                    <meshBasicMaterial color="#000000" />
                </mesh>
                {/* Glowing Eyes Group */}
                <group ref={eyes} position={[0, 0.1, 0.52]}>
                    {/* Left Eye */}
                    <mesh position={[-0.25, 0, 0]}>
                        <circleGeometry args={[0.08, 32]} />
                        <meshBasicMaterial color="#007aff" toneMapped={false} />
                    </mesh>
                    <mesh position={[-0.25, 0, 0]}>
                         <ringGeometry args={[0.08, 0.12, 32]} />
                         <meshBasicMaterial color="#007aff" opacity={0.5} transparent toneMapped={false} />
                    </mesh>
                    
                    {/* Right Eye */}
                    <mesh position={[0.25, 0, 0]}>
                        <circleGeometry args={[0.08, 32]} />
                        <meshBasicMaterial color="#007aff" toneMapped={false} />
                    </mesh>
                    <mesh position={[0.25, 0, 0]}>
                         <ringGeometry args={[0.08, 0.12, 32]} />
                         <meshBasicMaterial color="#007aff" opacity={0.5} transparent toneMapped={false} />
                    </mesh>
                </group>
                {/* Antenna */}
                <mesh position={[0, 0.6, 0]}>
                    <cylinderGeometry args={[0.05, 0.05, 0.4]} />
                    <meshStandardMaterial color="#333" />
                </mesh>
                <mesh position={[0, 0.85, 0]}>
                    <sphereGeometry args={[0.1]} />
                    <meshStandardMaterial color="#ff453a" emissive="#ff453a" emissiveIntensity={2} toneMapped={false} />
                </mesh>
            </group>
        </Float>
    );
}

// --- UI Components ---
function Marquee({ items, speed = 20 }) {
  return (
    <div className="flex overflow-hidden relative z-10 py-10 bg-white/[0.02] border-y border-white/5 backdrop-blur-sm -rotate-1 origin-left scale-105">
      <motion.div 
        className="flex gap-16 min-w-full px-8 whitespace-nowrap"
        animate={{ x: ["0%", "-50%"] }}
        transition={{ duration: speed, repeat: Infinity, ease: "linear" }}
      >
        {[...items, ...items].map((item, i) => (
           <span key={i} className="text-3xl font-black text-white/10 uppercase tracking-widest hover:text-white/30 transition-colors cursor-default">
             {item}
           </span>
        ))}
      </motion.div>
    </div>
  )
}

function FloatingShape({ delay, duration, color, top, left, size }) {
    return (
        <motion.div 
            className={`absolute rounded-full filter blur-[100px] opacity-20 z-0 pointer-events-none ${color}`}
            style={{ top, left, width: size, height: size }}
            animate={{ 
                y: [0, 50, 0], 
                x: [0, 30, 0],
                scale: [1, 1.2, 1] 
            }}
            transition={{ 
                duration: duration, 
                repeat: Infinity, 
                ease: "easeInOut", 
                delay: delay 
            }}
        />
    )
}

// --- Restored Components ---
function FeatureCard({ icon: Icon, title, desc, delay }) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay }}
      className="p-6 rounded-3xl bg-secondary/5 border border-white/5 hover:border-accent/30 hover:bg-secondary/10 transition-all group"
    >
      <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform text-accent">
        <Icon className="w-6 h-6" />
      </div>
      <h3 className="text-lg font-bold mb-2 text-white">{title}</h3>
      <p className="text-gray-400 text-sm leading-relaxed">{desc}</p>
    </motion.div>
  )
}

function FaqItem({ question, answer, i }) {
    const [isOpen, setIsOpen] = useState(false);
    return (
        <motion.div 
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className="border-b border-white/10"
        >
            <button 
                onClick={() => setIsOpen(!isOpen)} 
                className="w-full py-6 flex items-center justify-between text-left hover:text-accent transition-colors text-white"
            >
                <span className="text-lg font-medium">{question}</span>
                <ChevronDown className={`w-5 h-5 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </button>
            <motion.div 
                initial={false}
                animate={{ height: isOpen ? 'auto' : 0, opacity: isOpen ? 1 : 0 }}
                className="overflow-hidden"
            >
                <p className="pb-6 text-gray-400 leading-relaxed">{answer}</p>
            </motion.div>
        </motion.div>
    )
}

// --- Main Component ---
export default function Landing() {
  const containerRef = useRef(null);
  const { loading: authLoading } = useAuth();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate initial loading for the "premium" feel
    const timer = setTimeout(() => {
        setLoading(false);
    }, 2500);
    return () => clearTimeout(timer);
  }, []);
  
  useEffect(() => {
    const lenis = new Lenis({
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smoothWheel: true,
    });
    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);
    return () => lenis.destroy();
  }, []);

  if (loading || authLoading) return <LandingLoader />;

  return (
    <div ref={containerRef} className="dark bg-[#000000] min-h-screen relative overflow-hidden text-white selection:bg-accent selection:text-white pb-20">
      
      {/* 3D Background - Always Dark */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <Canvas 
            camera={{ position: [0, 0, 5], fov: 75 }} 
            gl={{ antialias: true, alpha: true }}
            eventSource={document.body}
        >
             <PerspectiveCamera makeDefault position={[0, 0, 5]} />
             <ambientLight intensity={0.5} />
             <pointLight position={[10, 10, 10]} intensity={1} />
             <FloatingParticles />
        </Canvas>
      </div>

       {/* Floating Shapes for 'Movement' */}
       <FloatingShape color="bg-blue-600" top="-10%" left="-10%" size="600px" duration={20} delay={0} />
       <FloatingShape color="bg-purple-600" top="40%" left="80%" size="500px" duration={25} delay={5} />

      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 px-6 py-6 md:px-12 backdrop-blur-md border-b border-white/5 bg-black/50">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
            <Link to="/" className="flex items-center gap-2 group">
                <div className="w-10 h-10 rounded-xl bg-accent flex items-center justify-center text-white shadow-lg shadow-accent/40 group-hover:scale-110 transition-transform">
                    <Sparkles className="w-6 h-6 fill-white" />
                </div>
                <span className="text-2xl font-bold tracking-tight text-white">Cerix</span>
            </Link>
            <div className="flex items-center gap-8">
                <div className="hidden md:flex items-center gap-6 text-sm font-medium text-gray-400">
                    <a href="#features" className="hover:text-white transition-colors">Features</a>
                    <a href="#how-it-works" className="hover:text-white transition-colors">How it Works</a>
                </div>
                <div className="flex items-center gap-4">
                    <Link to="/login" className="text-sm font-medium text-gray-400 hover:text-white transition-colors">Login</Link>
                    <Link 
                    to="/login"
                    className="px-6 py-2.5 rounded-full bg-white text-black text-sm font-bold hover:bg-gray-200 transition-all active:scale-95"
                    >
                    Get Started
                    </Link>
                </div>
            </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-40 pb-20 px-6 overflow-hidden z-10 min-h-[90vh] flex flex-col justify-center">
        <div className="max-w-7xl mx-auto w-full grid md:grid-cols-2 gap-12 items-center">
            
            {/* Left: Content */}
            <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="text-left"
            >
                <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-white text-sm font-medium mb-6">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                    </span>
                    AI-Powered Personal Tutor
                </span>
                
                <h1 className="text-6xl md:text-8xl font-black tracking-tighter leading-[1] mb-6">
                    LEARN <br/>
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 animate-gradient-x">FASTER.</span>
                </h1>
                
                <p className="text-xl text-gray-400 max-w-xl mb-10 leading-relaxed">
                    The only engineering companion you'll ever need. Personalized roadmaps, verified notes, and an AI that actually teaches you.
                </p>
                
                <div className="flex flex-wrap gap-4">
                    <Link to="/login" className="px-8 py-4 rounded-full bg-accent text-white font-bold text-lg hover:scale-105 transition-all shadow-lg shadow-accent/25 flex items-center gap-2">
                        <Rocket className="w-5 h-5" /> Start Learning
                    </Link>
                    <Link to="/demo" className="px-8 py-4 rounded-full bg-white/5 border border-white/10 text-white font-medium text-lg hover:bg-white/10 transition-all backdrop-blur-sm">
                        View Syllabus
                    </Link>
                </div>
            </motion.div>

            {/* Right: 3D Mascot */}
            <motion.div 
                 initial={{ opacity: 0, scale: 0.5 }}
                 animate={{ opacity: 1, scale: 1 }}
                 transition={{ duration: 1 }}
                 className="h-[500px] w-full relative"
            >
                <Canvas>
                    <PerspectiveCamera makeDefault position={[0, 0, 4]} />
                    <ambientLight intensity={0.5} />
                    <pointLight position={[10, 10, 10]} intensity={1} />
                    <pointLight position={[-10, -10, -10]} color="blue" intensity={0.5} />
                    <Mascot />
                    <Environment preset="city" />
                </Canvas>
            </motion.div>
        </div>
      </section>

      <Marquee items={["AKTU", "GTU", "MUMBAI UNIVERSITY", "VTU", "JNTU", "PUNE UNIVERSITY", "RTU", "RGPV"]} />

      {/* Product Showcase (Dashboard) */}
      <section className="py-24 px-6 relative z-10">
        <div className="max-w-7xl mx-auto text-center mb-12">
            <h2 className="text-3xl md:text-5xl font-bold mb-6">Your Personal Study Headquarters</h2>
            <p className="text-gray-400 max-w-2xl mx-auto">Everything you need to ace your exams, organize your resources, and track your progress in one beautiful dashboard.</p>
        </div>
        <div className="max-w-6xl mx-auto">
             <motion.div 
                initial={{ opacity: 0, y: 50, rotateX: 10 }}
                whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
                transition={{ duration: 1 }}
                viewport={{ once: true }}
                className="relative rounded-[2rem] border border-white/10 p-2 bg-white/5 backdrop-blur-xl shadow-2xl overflow-hidden group perspective-1000"
            >
                <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 opacity-20 blur-xl group-hover:opacity-40 transition-opacity" />
                <img 
                    src="/dashboard.png" 
                    alt="Cerix Dashboard" 
                    className="relative w-full rounded-2xl shadow-2xl border border-white/5" 
                />
            </motion.div>
        </div>
      </section>

      {/* Comparison Section */}
      <section id="comparison" className="py-32 px-6 relative z-10">
        <div className="max-w-7xl mx-auto">
             <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
                <div className="p-10 rounded-3xl bg-red-500/5 border border-red-500/10 hover:bg-red-500/10 transition-colors">
                    <h3 className="text-2xl font-bold text-red-400 mb-8 flex items-center gap-3">
                        <X className="w-8 h-8" /> Manual Study
                    </h3>
                    <ul className="space-y-4">
                        {["Hours searching YouTube", "Outdated PDFs", "Confusing Syllabus", "Zero Feedback"].map((item, i) => (
                            <li key={i} className="flex items-center gap-3 text-gray-400"><X className="w-4 h-4 text-red-500/50" /> {item}</li>
                        ))}
                    </ul>
                </div>
                <div className="p-10 rounded-3xl bg-accent/10 border border-accent/20 relative overflow-hidden group">
                     <div className="absolute inset-0 bg-accent/5 blur-3xl group-hover:bg-accent/10 transition-all opacity-50" />
                     <h3 className="text-2xl font-bold text-accent mb-8 flex items-center gap-3 relative z-10">
                        <Check className="w-8 h-8" /> The Cerix Way
                    </h3>
                    <ul className="space-y-4 relative z-10">
                        {["Instant AI Explanations", "Verified Notes", "Exam-Focused Roadmaps", "24/7 Doubt Solving"].map((item, i) => (
                            <li key={i} className="flex items-center gap-3 text-white font-medium"><CheckCircle2 className="w-4 h-4 text-accent" /> {item}</li>
                        ))}
                    </ul>
                </div>
             </div>
        </div>
      </section>

      {/* How It Works (Restored) */}
      <section id="how-it-works" className="py-24 px-6 relative z-10 bg-white/[0.02]">
         <div className="max-w-7xl mx-auto">
            <div className="text-center mb-20">
                <span className="text-accent font-bold tracking-wider uppercase text-sm mb-4 block">Workflow</span>
                <h2 className="text-4xl md:text-5xl font-bold text-white">From Setup to Success</h2>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8 relative">
                 <div className="hidden md:block absolute top-12 left-1/6 right-1/6 h-0.5 bg-gradient-to-r from-transparent via-accent/30 to-transparent z-0" />
                 {[
                    { step: "01", title: "Select Syllabus", desc: "Choose your University, Branch, and current Semester.", icon: GraduationCap },
                    { step: "02", title: "Get Your Roadmap", desc: "Cerix generates a priority-based study plan for you.", icon: Rocket },
                    { step: "03", title: "Start Learning", desc: "Watch summaries, read notes, and quiz yourself.", icon: Zap }
                 ].map((item, i) => (
                    <motion.div 
                        key={i}
                        className="relative z-10 bg-[#0a0a0a] text-center p-8 rounded-3xl border border-white/5 hover:border-accent/30 transition-all group"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.2 }}
                    >
                        <div className="w-20 h-20 mx-auto bg-white/5 rounded-full flex items-center justify-center mb-6 shadow-soft group-hover:scale-110 transition-transform">
                            <span className="text-3xl font-black text-white/5 absolute">{item.step}</span>
                            <item.icon className="w-8 h-8 text-accent relative z-10" />
                        </div>
                        <h3 className="text-xl font-bold mb-3 text-white">{item.title}</h3>
                        <p className="text-gray-400">{item.desc}</p>
                    </motion.div>
                 ))}
            </div>
         </div>
      </section>

{/* Features: Persona, Assistant, Syllabus */}
      <section id="features" className="space-y-32 py-24 px-6 relative z-10">
         {/* Persona */}
         <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-16">
            <div className="flex-1 space-y-8">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-purple-500/20">
                    <Brain className="w-7 h-7" />
                </div>
                <h2 className="text-4xl md:text-5xl font-bold leading-tight">It Knows <br/> How You Learn</h2>
                <div className="grid grid-cols-2 gap-4">
                    <FeatureCard icon={CheckCircle2} title="Adaptive Pace" desc="Slows down on hard topics, speeds up on easy ones." delay={0.1} />
                    <FeatureCard icon={Shield} title="Exam Focus" desc="Highlights questions that have appeared in previous years." delay={0.2} />
                </div>
            </div>
            <motion.div 
                className="flex-1 relative"
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
            >
                <div className="absolute -inset-4 bg-gradient-to-r from-purple-500/20 to-blue-500/20 blur-2xl rounded-full -z-10" />
                <img src="/persona.png" alt="Persona" className="rounded-3xl shadow-2xl border border-white/10 relative z-10" />
            </motion.div>
         </div>

         {/* Assistant */}
         <div className="max-w-7xl mx-auto flex flex-col md:flex-row-reverse items-center gap-16">
            <div className="flex-1 space-y-8">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-400 to-cyan-500 flex items-center justify-center text-white shadow-lg shadow-blue-500/20">
                    <Zap className="w-7 h-7" />
                </div>
                <h2 className="text-4xl md:text-5xl font-bold leading-tight">24/7 AI Tutor</h2>
                <p className="text-xl text-gray-400">
                    Don't wait for office hours. The Cerix AI assistant explains concepts instantly, using analogies you'll actually understand.
                </p>
                <div className="p-6 rounded-2xl bg-[#111] border border-white/5">
                    <div className="flex items-start gap-4 mb-4">
                        <div className="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center text-accent font-bold">U</div>
                        <div className="bg-white/5 p-3 rounded-2xl rounded-tl-none text-sm text-gray-300">Explain Entropy like I'm 5</div>
                    </div>
                    <div className="flex items-start gap-4">
                        <div className="w-8 h-8 rounded-lg bg-accent flex items-center justify-center text-white font-bold">C</div>
                        <div className="bg-accent/10 p-3 rounded-2xl rounded-tl-none text-sm text-white">Imagine your room. If you don't clean it, it gets messy naturally. That messiness is Entropy!</div>
                    </div>
                </div>
            </div>
            <motion.div 
                className="flex-1 relative"
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
            >
                <div className="absolute -inset-4 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 blur-2xl rounded-full -z-10" />
                <img src="/assitant.png" alt="Assistant" className="rounded-3xl shadow-2xl border border-white/10 relative z-10" />
            </motion.div>
         </div>

         {/* Chapters */}
         <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-16">
            <div className="flex-1 space-y-8">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center text-white shadow-lg shadow-green-500/20">
                    <Check className="w-7 h-7" />
                </div>
                <h2 className="text-4xl md:text-5xl font-bold leading-tight">Complete Syllabus Coverage</h2>
                <p className="text-xl text-gray-400">
                    From Unit 1 to Unit 5, we cover every topic in your official university syllabus. No more, no less.
                </p>
            </div>
            <motion.div 
                className="flex-1 relative"
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
            >
                 <div className="absolute -inset-4 bg-gradient-to-r from-green-500/20 to-emerald-500/20 blur-2xl rounded-full -z-10" />
                <img src="/chapters.png" alt="Syllabus" className="rounded-3xl shadow-2xl border border-white/10 relative z-10" />
            </motion.div>
         </div>
      </section>


{/* FAQ Section (New) */}
      <section className="py-24 px-6 relative z-10 bg-secondary/5">
        <div className="max-w-3xl mx-auto">
            <h2 className="text-4xl font-bold text-center mb-16 text-white">Frequently Asked Questions</h2>
            <div className="space-y-4">
                {[
                    { q: "Is Cerix really free?", a: "Yes! The core learning features are free specifically for 1st Year B.Tech students." },
                    { q: "Does it cover my university?", a: "We support major technical universities including AKTU, GTU, VTU, and more." },
                    { q: "Is the AI reliable?", a: "Our AI is trained specifically on standard academic textbooks and verified engineering curriculum." }
                ].map((item, i) => (
                    <FaqItem key={i} question={item.q} answer={item.a} i={i} />
                ))}
            </div>
        </div>
      </section>

      {/* Stats Section (Restored) */}
      <section className="py-20 border-y border-white/5 bg-white/[0.02]">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 px-6 text-center">
            {[{ n: "10k+", l: "Students" }, { n: "50+", l: "Universities" }, { n: "1M+", l: "Doubts Solved" }, { n: "4.9", l: "Rating" }].map((s, i) => (
                <div key={i}>
                    <div className="text-4xl font-black text-white mb-2">{s.n}</div>
                    <div className="text-gray-500">{s.l}</div>
                </div>
            ))}
        </div>
      </section>

      {/* CTA Section (Restored) */}
      <section className="py-32 px-6 text-center relative overflow-hidden z-10">
        <div className="absolute inset-0 bg-gradient-to-b from-accent/10 to-transparent pointer-events-none" />
        <div className="max-w-4xl mx-auto relative z-10">
            <h2 className="text-5xl md:text-7xl font-bold mb-8 tracking-tight text-white">Ready to ace your exams?</h2>
            <p className="text-xl text-gray-400 mb-12">
                Join that top 1% of students who study smarter.
            </p>
            <Link 
                to="/login"
                className="px-12 py-6 rounded-full bg-white text-black font-bold text-xl hover:scale-105 transition-transform shadow-2xl inline-block"
            >
                Get Started For Free
            </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="pt-32 pb-10 px-6 border-t border-white/10 bg-black relative overflow-hidden">
        <div className="max-w-7xl mx-auto flex flex-col items-center">
             {/* Logo in Footer */}
             <div className="flex items-center gap-3 mb-10">
                <div className="w-12 h-12 rounded-2xl bg-accent flex items-center justify-center text-white shadow-lg shadow-accent/40">
                    <Sparkles className="w-7 h-7 fill-white" />
                </div>
                <span className="text-3xl font-bold text-white tracking-tight">Cerix</span>
             </div>

             <div className="flex justify-center gap-8 text-gray-500 mb-20 font-medium">
                 <Link to="#" className="hover:text-white transition-colors">Privacy Policy</Link>
                 <Link to="#" className="hover:text-white transition-colors">Terms of Service</Link>
                 <Link to="#" className="hover:text-white transition-colors">Contact Support</Link>
             </div>
             
             <h1 className="text-[18vw] font-black text-[#ffffff24] leading-none select-none tracking-tighter text-center">CERIX</h1>
        </div>
      </footer>
    </div>
  );
}
