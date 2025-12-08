import { Link, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Home, BookOpen, MessageSquare, LogOut, User } from 'lucide-react';
import { clsx } from 'clsx';

export default function Layout() {
  const { user, logout } = useAuth();
  const location = useLocation();

  const navItems = [
    { icon: Home, label: 'Dashboard', path: '/dashboard' },
    { icon: BookOpen, label: 'Syllabus', path: '/syllabus' },
    { icon: MessageSquare, label: 'Doubts', path: '/doubts' },
  ];

  return (
    <div className="min-h-screen bg-[#f5f6f8] flex flex-col md:flex-row">
      {/* Sidebar for Desktop */}
      <aside className="hidden md:flex flex-col w-64 bg-white border-r border-border-soft h-screen sticky top-0 p-6">
        <div className="flex items-center gap-2 mb-10 text-primary">
            <div className="w-8 h-8 rounded-lg bg-accent flex items-center justify-center text-white font-bold">C</div>
            <span className="text-xl font-bold tracking-tight">Cerix</span>
        </div>

        <nav className="flex-1 space-y-1">
            {navItems.map((item) => {
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
                                : "text-secondary hover:bg-gray-50 hover:text-primary"
                        )}
                    >
                        <Icon className="w-5 h-5" />
                        {item.label}
                    </Link>
                )
            })}
        </nav>

        <div className="border-t border-border-soft pt-6 mt-6">
            <div className="flex items-center gap-3 px-2 mb-4">
                <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-secondary font-semibold">
                    {user?.name?.charAt(0) || 'U'}
                </div>
                <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-primary truncate">{user?.name}</p>
                    <p className="text-xs text-secondary truncate">{user?.email}</p>
                </div>
            </div>
            <button 
                onClick={logout}
                className="flex w-full items-center gap-3 px-4 py-2 text-sm font-medium text-red-500 hover:bg-red-50 rounded-2xl transition-colors"
            >
                <LogOut className="w-4 h-4" />
                Sign Out
            </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 min-w-0 overflow-y-auto">
        <Outlet />
      </main>

      {/* Mobile Bottom Nav */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-lg border-t border-border-soft px-6 py-3 flex justify-between items-center z-50">
        {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname.startsWith(item.path);
            return (
                <Link 
                    key={item.path} 
                    to={item.path}
                    className={clsx(
                        "flex flex-col items-center gap-1",
                        isActive ? "text-accent" : "text-gray-400"
                    )}
                >
                    <Icon className="w-6 h-6" />
                    <span className="text-[10px] font-medium">{item.label}</span>
                </Link>
            )
        })}
        <button onClick={logout} className="flex flex-col items-center gap-1 text-gray-400">
            <User className="w-6 h-6" />
            <span className="text-[10px] font-medium">Profile</span>
        </button>
      </nav>
    </div>
  );
}
