import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';

// Protected Route Wrapper
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <div>Loading...</div>;
  if (!user) return <Navigate to="/login" replace />;
  return children;
};

// Onboarding Guard
const RequireOnboarding = ({ children }) => {
    const { user, loading } = useAuth();
    if (loading) return <div>Loading...</div>;
    if (user && !user.academicInfo?.isOnboarded) {
        return <Navigate to="/onboarding" replace />;
    }
    return children;
}

import Onboarding from './pages/Onboarding';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import SubjectView from './pages/SubjectView';
import ChapterView from './pages/ChapterView';
import ChatInterface from './pages/ChatInterface';

function AppRoutes() {
  const { user, loading } = useAuth();

  if(loading) return <div className="min-h-screen flex items-center justify-center bg-main text-primary">Loading...</div>

  return (
    <Routes>
      <Route path="/" element={user ? <Navigate to="/dashboard" /> : <Landing />} />
      <Route path="/login" element={user ? <Navigate to="/dashboard" /> : <Login />} />
      <Route path="/register" element={user ? <Navigate to="/onboarding" /> : <Register />} />
      
      <Route path="/onboarding" element={
        <ProtectedRoute>
            <Onboarding />
        </ProtectedRoute>
      } />
      
      {/* Protected Routes inside Main Layout */}
      <Route element={<Layout />}>
          <Route path="/dashboard" element={
            <ProtectedRoute>
                 <Dashboard />
            </ProtectedRoute>
          } />
          
           <Route path="/syllabus" element={
             <ProtectedRoute>
                <div className="p-10 text-center">All Subjects List (Use Dashboard for now)</div>
             </ProtectedRoute>
          } />

          <Route path="/syllabus/:id" element={
             <ProtectedRoute>
                <SubjectView />
             </ProtectedRoute>
          } />

          <Route path="/chapter/:subjectId/:unitId/:chapterId" element={
             <ProtectedRoute>
                <ChapterView />
             </ProtectedRoute>
          } />
      </Route>
      
      {/* Chat Routes - Full Screen (Outside Layout) */}
      <Route path="/chat/:subjectId/:chapterId/:topicId" element={
        <ProtectedRoute>
            <ChatInterface />
        </ProtectedRoute>
      } />
    </Routes>
  );
}

export default function App() {
  return (
    <Router>
      <ThemeProvider>
        <AuthProvider>
          <AppRoutes />
        </AuthProvider>
      </ThemeProvider>
    </Router>
  );
}
