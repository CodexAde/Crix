import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { Toaster } from 'react-hot-toast';
import { PageLoader, LandingLoader } from './components/Spinner';
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
import Roadmap from './pages/Roadmap';
import Syllabus from './pages/Syllabus';
import AddChapters from './pages/AddChapters';
import UserProfile from './pages/UserProfile';
import DemoShowcase from './pages/DemoShowcase';
import CommunityDeploy from './pages/CommunityDeploy';
import MySubjects from './pages/MySubjects';

function AppRoutes() {
  const { user, loading } = useAuth();

  if(loading) return <LandingLoader />

  return (
    <Routes>
      <Route path="/" element={user ? <Navigate to="/dashboard" /> : <Landing />} />
      <Route path="/login" element={user ? <Navigate to="/dashboard" /> : <Login />} />
      <Route path="/register" element={user ? <Navigate to="/onboarding" /> : <Register />} />
      <Route path="/demo" element={<DemoShowcase />} />
      
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
           <Route path="/tests" element={<TestPage />} />
           <Route path="/my-subjects" element={<MySubjects />} />

          <Route path="/syllabus/:id" element={<SubjectView />} />


          <Route path="/chapter/:subjectId/:unitId/:chapterId" element={<ChapterView />} />
          
          <Route path="/roadmap" element={<Roadmap />} />
          <Route path="/roadmap/my" element={<Roadmap />} />
          <Route path="/roadmap/add" element={<Roadmap />} />
          <Route path="/roadmap/generate" element={<Roadmap />} />
          <Route path="/roadmap/:id" element={<Roadmap />} />

          <Route path="/community-deploy" element={<CommunityDeploy />} />
          <Route path="/add-chapters" element={<AddChapters />} />
          <Route path="/user-profile" element={<UserProfile />} />
      </Route>
      
      {/* Chat Routes - Full Screen (Outside Layout) */}
      <Route path="/chat/:subjectId/:chapterId/:topicId" element={
        <ProtectedRoute>
            <RequireOnboarding>
                <ChatInterface />
            </RequireOnboarding>
        </ProtectedRoute>
      } />
      
      {/* Roadmap Chat Route */}
      <Route path="/roadmap/:roadmapId/:dayId/:topicId" element={
        <ProtectedRoute>
            <RequireOnboarding>
                <ChatInterface isRoadmap={true} />
            </RequireOnboarding>
        </ProtectedRoute>
      } />
    </Routes>
  );
}

// Scroll To Top Component
function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

import SubjectStates from './context/Subject/SubjectStates';
import UserStates from './context/User/UserStates';
import SyllabusStates from './context/Syllabus/SyllabusStates';
import TestPage from './pages/Test';

export default function App() {
  return (
    <Router>
      <ScrollToTop />
      <ThemeProvider>
        <AuthProvider>
          <UserStates>
            <SubjectStates>
              <SyllabusStates>
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
              </SyllabusStates>
            </SubjectStates>
          </UserStates>
        </AuthProvider>
      </ThemeProvider>
    </Router>
  );
}
