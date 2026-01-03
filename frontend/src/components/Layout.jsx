import { useState, useRef, useEffect, useContext } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import SyllabusContext from '../context/Syllabus/SyllabusContext';
import UserContext from '../context/User/UserContext';
import { Home, BookOpen, MessageCircle, Calendar, LogOut, User, Moon, Sun, Sparkles, PlusCircle } from 'lucide-react';
import { clsx } from 'clsx';

export default function Layout() {
  const { user, logout } = useAuth();
  const { loading: userLoading, userProfile } = useContext(UserContext);
  const { loadingSubject, activeSubjectData } = useContext(SyllabusContext);
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
    window.scrollTo(0, 0);
  }, [location.pathname]);

  const navItems = [
    { icon: Home, label: 'Dashboard', path: '/dashboard' },
    { icon: BookOpen, label: 'Syllabus', path: '/syllabus' },
    { icon: PlusCircle, label: 'Add', path: '/community-deploy' },
    { icon: Calendar, label: 'Roadmap', path: '/roadmap' },
    { icon: User, label: 'Profile', path: '/user-profile' }
  ];


  const isFullPageLoading = (loadingSubject && !activeSubjectData) || (userLoading && !userProfile);
  
  // Hide UI during test taking, results, and analysis
  const isTakingTest = location.pathname.includes('/test/take/');
  const hideMobileNav = location.pathname.startsWith('/chapter') || 
                         location.pathname.startsWith('/roadmap/my') || 
                         location.pathname.startsWith('/syllabus/');

  if (isTakingTest) {
      return (
          <div className="min-h-screen bg-main">
              <main className="w-full" ref={mainRef}>
                  <Outlet />
              </main>
          </div>
      );
  }

  return (
    <div className="min-h-screen bg-main flex flex-col md:flex-row">
      {/* Sidebar for Desktop */}
      <aside className="hidden md:flex flex-col w-56 bg-card border-r border-border-soft h-screen sticky top-0 p-5">
        <div className="flex items-center gap-2.5 mb-10 overflow-hidden">
            <div className="w-8 h-8 rounded-lg bg-accent flex items-center justify-center shadow-lg shadow-accent/20 shrink-0">
                <Sparkles className="w-4 h-4 text-white" />
            </div>
            <div>
                    <h2 className="text-xl font-bold text-primary tracking-tight">Crix</h2>
                <p className="text-[8px] text-accent font-bold uppercase tracking-widest opacity-70">Neural Engine</p>
            </div>
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
      <main className="flex-1 min-w-0" ref={mainRef}>
        <Outlet />
      </main>

      {/* Mobile Bottom Taskbar */}
      {!isFullPageLoading && !hideMobileNav && (
        <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-card border-t border-border-soft px-6 py-3 flex justify-between items-center z-50 transition-transform duration-300 ease-in-out">

        {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname.startsWith(item.path);
            return (
                <Link 
                    key={item.path} 
                    to={item.path}
                    className={clsx(
                        "flex flex-col items-center gap-1.5 min-w-[4rem]",
                        isActive ? "text-accent" : "text-secondary hover:text-primary"
                    )}
                >
                    <Icon className={clsx("w-6 h-6 transition-all", isActive && "scale-110")} />
                    <span className="text-[10px] font-medium tracking-wide">{item.label}</span>
                </Link>
            )
        })}
      </nav>
      )}
    </div>
  );
}
