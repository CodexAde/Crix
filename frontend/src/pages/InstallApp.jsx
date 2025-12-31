import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Download, ChevronRight, X, Sparkles, CheckCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function InstallApp({ deferredPrompt, installApp }) {
    const [isInstalled, setIsInstalled] = useState(false);
    const [isIOS, setIsIOS] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        // Check if already in standalone mode
        const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
        console.log('InstallApp: Mounted. isStandalone:', isStandalone);

        if (isStandalone) {
            setIsInstalled(true);
            navigate('/dashboard');
        }

        // Detect iOS
        const ios = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
        setIsIOS(ios);

    }, [navigate]);

    const handleInstallClick = () => {
        if (deferredPrompt) {
            installApp();
        }
    };

    const handleSkip = () => {
        sessionStorage.setItem('skipInstall', 'true');
        navigate('/dashboard');
    }

    return (
        <div className="min-h-screen bg-black flex flex-col items-center justify-center p-6 relative overflow-hidden">
            {/* Background Effects */}
            <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] bg-accent/20 rounded-full blur-[120px] pointer-events-none opacity-40" />
            <div className="absolute bottom-[-20%] right-[-10%] w-[400px] h-[400px] bg-purple-500/20 rounded-full blur-[120px] pointer-events-none opacity-30" />

            <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="w-full max-w-md bg-white/5 backdrop-blur-2xl border border-white/10 p-8 rounded-[2.5rem] shadow-[0_0_80px_rgba(0,0,0,0.5)] relative z-10 flex flex-col items-center text-center"
            >
                <div className="w-24 h-24 bg-gradient-to-br from-accent to-purple-600 rounded-[1.8rem] flex items-center justify-center shadow-2xl shadow-accent/20 mb-8 relative group">
                    <Sparkles className="w-12 h-12 text-white fill-white" />
                    <div className="absolute inset-0 bg-white/20 rounded-[1.8rem] opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>

                <h1 className="text-3xl font-bold text-white mb-3 tracking-tight">
                    Install Crix
                </h1>

                <p className="text-gray-400 mb-8 leading-relaxed text-sm">
                    Get the full experience. Crix works better as a native app with fullscreen focus, offline access, and instant performance.
                </p>

                {deferredPrompt ? (
                    <button
                        onClick={handleInstallClick}
                        className="w-full py-4 bg-white text-black font-bold text-lg rounded-2xl mb-4 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 group"
                    >
                        <Download className="w-5 h-5 group-hover:-translate-y-0.5 transition-transform" />
                        Download Web App
                    </button>
                ) : (
                    <div className="bg-white/5 border border-white/10 rounded-2xl p-4 mb-6 w-full flex flex-col items-center text-center">
                        <h3 className="text-white font-medium mb-2 flex items-center gap-2 justify-center">
                            <CheckCircle className="w-4 h-4 text-green-400" />
                            App Already Installed
                        </h3>

                        <p className="text-xs text-gray-400 mb-3">
                            This app is already installed on your device. Please lauch manually from your home screen.
                        </p>

                        {isIOS && (
                            <div className="flex justify-center py-2">
                                <div className="w-6 h-8 border-2 border-blue-500 rounded-sm relative flex items-center justify-center">
                                    <div className="absolute -top-2 w-[2px] h-4 bg-blue-500"></div>
                                    <div className="absolute -top-2 w-2 h-2 border-t-2 border-r-2 border-blue-500 -rotate-45"></div>
                                </div>
                            </div>
                        )}
                    </div>

                )}

                <button
                    onClick={handleSkip}
                    className="text-gray-500 text-sm font-medium hover:text-white transition-colors flex items-center gap-1 group/skip py-2"
                >
                    Continue in Browser
                    <ChevronRight className="w-4 h-4 group-hover/skip:translate-x-0.5 transition-transform" />
                </button>
            </motion.div>

            <div className="mt-8 text-center space-y-2">
                <p className="text-white/40 text-[10px] font-bold tracking-[0.2em] uppercase">Private • Secure • Fast</p>
            </div>
        </div>
    );
}
