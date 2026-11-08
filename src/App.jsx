import React, { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { supabase } from './utils/supabase';
import Layout from './components/Layout';
import Home from './pages/Home';
import Live from './pages/Live';
import Meditation from './pages/Meditation';
import Words from './pages/Words';
import Sermons from './pages/Sermons';
import Path from './pages/Path';
import BlogArchive from './pages/BlogArchive';
import SingleBlog from './pages/SingleBlog';
import Community from './pages/Community';
import Profile from './pages/Profile';
import DharmaDhana from './pages/DharmaDhana';
import BookReader from './components/BookReader';
import OtherChantings from './pages/OtherChantings';
import LifeCycle from './pages/LifeCycle';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import ResourceLanding from './pages/ResourceLanding';
import Onboarding from './pages/Onboarding';
import AuthCallback from './pages/AuthCallback';
import History from './pages/History';
import HistoryChapter from './pages/HistoryChapter';
import Sasanaya from './pages/Sasanaya';
import Notices from './pages/Notices';
import PracticeGuide from './pages/PracticeGuide';
import ComingSoon from './pages/ComingSoon';
import CommunityJoin from './pages/CommunityJoin';
import LabLayout from './pages/Lab/LabLayout';
import SuttaStudy from './pages/SuttaStudy';
import PersonalRoadmap from './pages/PersonalRoadmap';

const AdminLayout = React.lazy(() => import('./pages/Admin/AdminLayout'));
const AdminDashboard = React.lazy(() => import('./pages/Admin/AdminDashboard'));
const AdminLogin = React.lazy(() => import('./pages/Admin/AdminLogin'));
const NoticeManager = React.lazy(() => import('./pages/Admin/NoticeManager'));
const TeamManager = React.lazy(() => import('./pages/Admin/TeamManager'));
const LiveBroadcastManager = React.lazy(() => import('./pages/Admin/LiveBroadcastManager'));
const CommunityManager = React.lazy(() => import('./pages/Admin/CommunityManager'));
const AnumodanaManager = React.lazy(() => import('./pages/Admin/AnumodanaManager'));
const AnumodanaWebView = React.lazy(() => import('./pages/AnumodanaWebView'));

function ProtectedRoute({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(null);

  useEffect(() => {
    // Check if user is logged in
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setIsAuthenticated(!!session);
    };

    checkAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsAuthenticated(!!session);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (isAuthenticated === null) return (
    <div className="flex-center" style={{ minHeight: '100vh', background: 'var(--bg-main)', color: 'var(--text-muted)' }}>
      කරුණාකර රැඳී සිටින්න...
    </div>
  );
  return isAuthenticated ? children : <Navigate to="/login" replace />;
}

function App() {
  useEffect(() => {
    // Initialize theme from local storage or default to light
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      document.documentElement.setAttribute('data-theme', savedTheme);
    } else {
      document.documentElement.setAttribute('data-theme', 'light');
      localStorage.setItem('theme', 'light');
    }
  }, []);

  return (
    <BrowserRouter>
      <React.Suspense fallback={<div style={{height: '100vh', background: 'var(--bg-main)'}} />}>
        <Routes>
          {/* SECURE ADMIN PORTAL */}
          <Route path="/portal-ops/login" element={<AdminLogin />} />
          <Route path="/portal-ops" element={<AdminLayout />}>
            <Route index element={<AdminDashboard />} />
            <Route path="notices" element={<NoticeManager />} />
            <Route path="community" element={<CommunityManager />} />
            <Route path="anumodana" element={<AnumodanaManager />} />
            <Route path="team" element={<TeamManager />} />
            <Route path="live" element={<LiveBroadcastManager />} />
          </Route>

          {/* STANDALONE IMMERSIVE UI */}
          <Route path="/live" element={<Live />} />
          <Route path="/join" element={<CommunityJoin />} />
          <Route path="/community-join" element={<CommunityJoin />} />
          <Route path="/anumodana/:id" element={<AnumodanaWebView />} />

          {/* STANDALONE KALYANAMITTA LAB (Academic Research & Sutta Workspace) */}
          <Route path="/lab" element={<LabLayout />}>
            <Route index element={<PersonalRoadmap />} />
            <Route path="roadmap" element={<PersonalRoadmap />} />
            <Route path="sutta" element={<SuttaStudy />} />
            <Route path="sutta/:suttaId" element={<SuttaStudy />} />
          </Route>

          {/* MAIN PUBLIC WEBSITE */}
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="words" element={<Words />} />
            <Route path="history" element={<History />} />
            <Route path="history/:chapterId" element={<HistoryChapter />} />
            <Route path="sermons" element={<Sermons />} />
            <Route path="meditation" element={<Meditation />} />
            <Route path="path" element={<Path />} />
            <Route path="practice/:factorId/:stepId" element={<PracticeGuide />} />
            <Route path="life" element={<BlogArchive />} />
            <Route path="life/:slug" element={<SingleBlog />} />
            <Route path="lifecycle" element={<LifeCycle />} />
            <Route path="community" element={<Community />} />
            <Route path="dharmadhana" element={<DharmaDhana />} />
            <Route path="sasanaya" element={<Sasanaya />} />
            <Route path="notices" element={<Notices />} />
            <Route path="profile" element={<Profile />} />
            <Route path="other-chantings" element={<OtherChantings />} />
            <Route path="library/:id" element={<ResourceLanding />} />
            
            {/* User Auth Routes */}
            <Route path="login" element={<Login />} />
            <Route path="register" element={<Register />} />
            <Route path="auth/callback" element={<AuthCallback />} />
            
            <Route 
              path="onboarding" 
              element={
                <ProtectedRoute>
                  <Onboarding />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="dashboard" 
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } 
            />

            {/* Under Development / Coming Soon Pages on Public Web */}
            <Route path="layman" element={<ComingSoon />} />
            <Route path="wellness" element={<ComingSoon />} />
            <Route path="discussions" element={<ComingSoon />} />
            <Route path="pali" element={<ComingSoon />} />
            <Route path="sutta" element={<ComingSoon defaultTitle="සූත්‍ර අධ්‍යයනය (Sutta Study)" defaultSubtitle="සූත්‍ර පිටකය සහ අධ්‍යයන මෙවලම් දැනට සංවර්ධනය වෙමින් පවතී." defaultCategory="දහම් අධ්‍යයනය" />} />
            <Route path="sutta/:suttaId" element={<ComingSoon defaultTitle="සූත්‍ර අධ්‍යයනය (Sutta Study)" defaultSubtitle="සූත්‍ර පිටකය සහ අධ්‍යයන මෙවලම් දැනට සංවර්ධනය වෙමින් පවතී." defaultCategory="දහම් අධ්‍යයනය" />} />
            <Route path="roadmap" element={<ComingSoon defaultTitle="ධර්ම අධ්‍යයන ගමන්මඟ (Personal Roadmap)" defaultSubtitle="ධර්ම අධ්‍යයන ගමන්මඟ පද්ධතිය දැනට සංවර්ධනය වෙමින් පවතී." defaultCategory="දහම් අධ්‍යයනය" />} />
            <Route path="pdf-books" element={<ComingSoon />} />
            <Route path="magazines" element={<ComingSoon />} />
            <Route path="temple-dev" element={<ComingSoon />} />
            <Route path="kids" element={<ComingSoon />} />
            <Route path="social" element={<ComingSoon />} />
            <Route path="coming-soon" element={<ComingSoon />} />

            {/* Fallback */}
            <Route path="*" element={<Home />} />
          </Route>
          {/* Standalone Fullscreen Routes */}
          <Route path="/read/:bookId" element={<BookReader />} />
        </Routes>
      </React.Suspense>
    </BrowserRouter>
  );
}

export default App;
