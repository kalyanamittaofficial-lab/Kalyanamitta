import React, { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { supabase } from './utils/supabase';
import Layout from './components/Layout';
import Home from './pages/Home';
import Meditation from './pages/Meditation';
import Words from './pages/Words';
import Sermons from './pages/Sermons';
import Path from './pages/Path';
import Life from './pages/Life';
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

function ProtectedRoute({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setIsAuthenticated(!!session);
    });

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
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="words" element={<Words />} />
          <Route path="sermons" element={<Sermons />} />
          <Route path="meditation" element={<Meditation />} />
          <Route path="path" element={<Path />} />
          <Route path="life" element={<Life />} />
          <Route path="lifecycle" element={<LifeCycle />} />
          <Route path="community" element={<Community />} />
          <Route path="dharmadhana" element={<DharmaDhana />} />
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
        {/* Book Reader is outside the Layout so it can be truly full-screen and immersive without the main header/footer */}
        <Route path="/read/:bookId" element={<BookReader />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
