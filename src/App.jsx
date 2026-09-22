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
import History from './pages/History';
import HistoryChapter from './pages/HistoryChapter';
import Sasanaya from './pages/Sasanaya';
import Notices from './pages/Notices';

const AdminLayout = React.lazy(() => import('./pages/Admin/AdminLayout'));
const AdminDashboard = React.lazy(() => import('./pages/Admin/AdminDashboard'));
const AdminLogin = React.lazy(() => import('./pages/Admin/AdminLogin'));
const NoticeManager = React.lazy(() => import('./pages/Admin/NoticeManager'));
const TeamManager = React.lazy(() => import('./pages/Admin/TeamManager'));
const LiveBroadcastManager = React.lazy(() => import('./pages/Admin/LiveBroadcastManager'));

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

  if (isAuthenticated === null) return <div className="flex-center" style={{minHeight: '100vh'}}>Loading...</div>;
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
            <Route path="team" element={<TeamManager />} />
            <Route path="live" element={<LiveBroadcastManager />} />
          </Route>

          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
          <Route path="words" element={<Words />} />
          <Route path="live" element={<Live />} />
          <Route path="history" element={<History />} />
          <Route path="history/:chapterId" element={<HistoryChapter />} />
          <Route path="sermons" element={<Sermons />} />
          <Route path="meditation" element={<Meditation />} />
          <Route path="path" element={<Path />} />
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
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
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
          {/* Fallback */}
          <Route path="*" element={<Home />} />
        </Route>
        {/* Standalone Fullscreen Routes */}
        <Route path="/read/:bookId" element={<BookReader />} />
        <Route path="/live" element={<Live />} />
      </Routes>
      </React.Suspense>
    </BrowserRouter>
  );
}

export default App;
