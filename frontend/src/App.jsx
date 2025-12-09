import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { Toaster } from 'react-hot-toast';
import { PageLoader } from './components/Spinner';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';

// Protected Route Wrapper
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <PageLoader />;
  if (!user) return <Navigate to="/login" replace />;
  return children;
};

// Onboarding Guard
const RequireOnboarding = ({ children }) => {
    const { user, loading } = useAuth();
    if (loading) return <PageLoader />;
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
import Doubts from './pages/Doubts';
import Syllabus from './pages/Syllabus';
import AddChapters from './pages/AddChapters';

function AppRoutes() {
  const { user, loading } = useAuth();

  if(loading) return <PageLoader />

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
      <Route element={
        <ProtectedRoute>
            <RequireOnboarding>
                <Layout />
            </RequireOnboarding>
        </ProtectedRoute>
      }>
          <Route path="/dashboard" element={<Dashboard />} />
          
           <Route path="/syllabus" element={<Syllabus />} />

          <Route path="/syllabus/:id" element={<SubjectView />} />

          <Route path="/chapter/:subjectId/:unitId/:chapterId" element={<ChapterView />} />
          
          <Route path="/doubts" element={<Doubts />} />

          <Route path="/add-chapters" element={<AddChapters />} />
      </Route>
      
      {/* Chat Routes - Full Screen (Outside Layout) */}
      <Route path="/chat/:subjectId/:chapterId/:topicId" element={
        <ProtectedRoute>
            <RequireOnboarding>
                <ChatInterface />
            </RequireOnboarding>
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
          <Toaster 
            position="top-center"
            toastOptions={{
              duration: 3000,
              style: {
                background: '#1e1e2e',
                color: '#fff',
                borderRadius: '1rem',
                padding: '12px 20px',
                fontFamily: 'Inter, sans-serif',
                fontSize: '14px',
              },
              success: {
                iconTheme: {
                  primary: '#10B981',
                  secondary: '#fff',
                },
              },
              error: {
                iconTheme: {
                  primary: '#EF4444',
                  secondary: '#fff',
                },
              },
            }}
          />
          <AppRoutes />
        </AuthProvider>
      </ThemeProvider>
    </Router>
  );
}
