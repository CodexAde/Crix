import { useState, useRef, useEffect } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { Home, BookOpen, MessageCircle,MessageSquare, LogOut, User, Moon, Sun, Sparkles, PlusCircle } from 'lucide-react';
import { clsx } from 'clsx';

export default function Layout() {
  const { user, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const location = useLocation();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const userMenuRef = useRef(null);

  const handleLogout = () => {
      setShowUserMenu(false);
      logout();
  };

  // Close menu when clicking outside
  useEffect(() => {
      const handleClickOutside = (event) => {
          if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
              setShowUserMenu(false);
          }
      };

      document.addEventListener('mousedown', handleClickOutside);
      return () => {
          document.removeEventListener('mousedown', handleClickOutside);
      };
  }, []);

  const mainRef = useRef(null);

  // Scroll to top on route change
  useEffect(() => {
    if (mainRef.current) {
        mainRef.current.scrollTo(0, 0);
    }
  }, [location.pathname]);

  const navItems = [
    { icon: Home, label: 'Dashboard', path: '/dashboard' },
    { icon: BookOpen, label: 'Syllabus', path: '/syllabus' },
    { icon: PlusCircle, label: 'Add', path: '/add-chapters' },
    { icon: MessageSquare, label: 'Doubts', path: '/doubts' },
    { icon: User, label: 'Profile', path: '/user-profile' }
  ];

  // Auto-hide bottom nav on scroll logic
  const [isNavVisible, setIsNavVisible] = useState(true);
  const lastScrollY = useRef(0);

  useEffect(() => {
    const mainElement = mainRef.current;
    
    const handleScroll = () => {
        // Robust check: Look at both window and main element scroll positions
        const winScroll = window.scrollY;
        const mainScroll = mainElement ? mainElement.scrollTop : 0;
        
        // Use the value that is actually changing/active (usually the larger one if the other is 0)
        const currentScrollY = Math.max(winScroll, mainScroll);
        
        // Threshold check (5px for responsiveness)
        if (currentScrollY > lastScrollY.current + 5) {
            setIsNavVisible(false);
        } else if (currentScrollY < lastScrollY.current - 5) {
            setIsNavVisible(true);
        }
        
        lastScrollY.current = currentScrollY;
    };

    // Attach to both possible scroll containers to be absolutely sure
    window.addEventListener('scroll', handleScroll, { passive: true });
    if (mainElement) {
        mainElement.addEventListener('scroll', handleScroll, { passive: true });
    }
    
    return () => {
        window.removeEventListener('scroll', handleScroll);
        if (mainElement) {
            mainElement.removeEventListener('scroll', handleScroll);
        }
    };
  }, []);

  return (
    <div className="min-h-screen bg-main flex flex-col md:flex-row">
      {/* Sidebar for Desktop */}
      <aside className="hidden md:flex flex-col w-64 bg-card border-r border-border-soft h-screen sticky top-0 p-6">
        <div className="flex items-center gap-2 mb-10 text-primary">
            <div className="w-9 h-9 rounded-xl bg-accent flex items-center justify-center shadow-lg shadow-accent/20">
                <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold tracking-tight">Crix</span>
        </div>

        <nav className="flex-1 space-y-1">
            {navItems.filter(item => item.label !== 'Profile').map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname.startsWith(item.path);
                return (
                    <Link 
                        key={item.path} 
                        to={item.path}
                        className={clsx(
                            "flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-200 font-medium",
                            isActive 
                                ? "bg-accent/10 text-accent" 
                                : "text-secondary hover:bg-border-soft hover:text-primary"
                        )}
                    >
                        <Icon className="w-5 h-5" />
                        {item.label}
                    </Link>
                )
            })}
        </nav>

        <div className="border-t border-border-soft pt-6 mt-6 space-y-4">
            {/* User Profile Dropdown */}
            <div className="relative" ref={userMenuRef}>
                <button 
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className="flex w-full items-center gap-3 px-2 mb-4 text-left hover:bg-surface/50 p-2 rounded-xl transition-colors"
                >
                    <div className="w-10 h-10 rounded-full bg-border-soft flex items-center justify-center text-secondary font-semibold overflow-hidden shrink-0">
                        {user?.avatar ? (
                            <img src={user.avatar} alt="User" className="w-full h-full object-cover" />
                        ) : (
                            user?.name?.charAt(0) || 'U'
                        )}
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-primary truncate">{user?.name}</p>
                        <p className="text-xs text-secondary truncate">{user?.email}</p>
                    </div>
                </button>
                {showUserMenu && (
                    <div className="absolute bottom-full left-0 w-56 bg-card border border-border-soft rounded-xl shadow-xl py-1 z-50 mb-2 overflow-hidden">
                        <Link 
                            to="/user-profile" 
                            className="flex items-center gap-2 px-4 py-2.5 text-sm text-secondary hover:text-primary hover:bg-surface/50 transition-colors border-b border-border-soft"
                            onClick={() => setShowUserMenu(false)}
                        >
                            <User className="w-4 h-4" />
                            Profile
                        </Link>
                        
                        <button
                            onClick={() => {
                                toggleTheme();
                            }}
                            className="flex items-center justify-between w-full px-4 py-2.5 text-sm text-secondary hover:text-primary hover:bg-surface/50 transition-colors border-b border-border-soft"
                        >
                            <div className="flex items-center gap-2">
                                {isDark ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
                                Theme
                            </div>
                            <span className="text-xs font-medium text-accent bg-accent/10 px-2 py-0.5 rounded-full">
                                {isDark ? 'Dark' : 'Light'}
                            </span>
                        </button>

                        <button
                            onClick={handleLogout}
                            className="flex items-center gap-2 w-full text-left px-4 py-2.5 text-sm text-red-500 hover:text-red-400 hover:bg-surface/50 transition-colors"
                        >
                            <LogOut className="w-4 h-4" />
                            Sign Out
                        </button>
                    </div>
                )}
            </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 min-w-0 overflow-y-auto" ref={mainRef}>
        <Outlet />
      </main>

      {/* Mobile Bottom Dock */}
      <nav className={clsx(
          "md:hidden fixed bottom-6 left-1/2 -translate-x-1/2 w-[85%] max-w-[360px]", // Floating & Centered
          "bg-[#0f0f13]/80 backdrop-blur-xl border border-white/5", // Glassmorphism
          "rounded-[2rem] shadow-2xl shadow-black/50", // Pill shape & Deep shadow
          "flex justify-between items-center px-6 py-3.5 z-50",
          "transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)]", // Smooth spring-like easing
          !isNavVisible && "translate-y-[150%] opacity-0", // Hide animation
          isNavVisible && "translate-y-0 opacity-100"
      )}>
        {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname.startsWith(item.path);
            return (
                <Link 
                    key={item.path} 
                    to={item.path}
                    className={clsx(
                        "relative flex items-center justify-center w-12 h-12 rounded-full transition-all duration-300",
                        isActive ? "text-white" : "text-gray-400 hover:text-white"
                    )}
                >
                    {isActive && (
                        <span className="absolute inset-0 bg-accent/20 rounded-full blur-md" />
                    )}
                    {isActive && (
                         <span className="absolute inset-0 bg-gradient-to-tr from-accent to-accent/80 rounded-full opacity-60 scale-75" />
                    )}
                    
                    <Icon className={clsx(
                        "relative w-5 h-5 transition-transform duration-300 z-10", 
                        isActive && "scale-110",
                        !isActive && "group-hover:scale-110"
                    )} />
                    
                    {/* Active Reflector/Dot */}
                    {isActive && (
                        <span className="absolute -bottom-1 w-1 h-1 bg-white rounded-full shadow-[0_0_8px_rgba(255,255,255,0.8)]" />
                    )}
                </Link>
            )
        })}
      </nav>
    </div>
  );
}
