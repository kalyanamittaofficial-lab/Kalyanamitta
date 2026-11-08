import React, { useState, useEffect } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { FlaskConical, Compass, BookOpen, ArrowLeft, Sun, Moon, LogOut } from 'lucide-react';
import { supabase } from '../../utils/supabase';

export default function LabLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const [session, setSession] = useState(null);
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'light');

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
  };

  const isDark = theme === 'dark';
  const isRoadmap = location.pathname === '/lab' || location.pathname === '/lab/roadmap';
  const isSutta = location.pathname.startsWith('/lab/sutta');

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-main)', color: 'var(--text-main)', display: 'flex', flexDirection: 'column' }}>
      {/* Top Academic Lab Bar */}
      <header
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 900,
          background: isDark ? 'rgba(28, 25, 23, 0.95)' : 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(12px)',
          borderBottom: '1px solid var(--border-color, rgba(0,0,0,0.08))',
          padding: '0 clamp(16px, 3vw, 40px)',
          height: '64px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '16px'
        }}
      >
        {/* Left: Lab Brand & Back Link */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <Link
            to="/"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              textDecoration: 'none',
              color: 'var(--text-muted)',
              fontSize: '0.85rem',
              fontWeight: 600,
              padding: '6px 12px',
              borderRadius: '8px',
              background: isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.04)',
              transition: 'all 0.2s ease'
            }}
            title="Return to Main Website"
          >
            <ArrowLeft size={15} />
            <span>මුල් පිටුවට (Main Web)</span>
          </Link>

          <div style={{ height: '20px', width: '1px', background: 'var(--border-color, rgba(0,0,0,0.1))' }} />

          <Link
            to="/lab"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              textDecoration: 'none',
              color: 'var(--text-main)'
            }}
          >
            <div
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '8px',
                background: 'linear-gradient(135deg, #8C1515, #B32424)',
                color: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <FlaskConical size={18} />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontWeight: 800, fontSize: '1rem', letterSpacing: '-0.01em', fontFamily: 'var(--font-serif)' }}>
                  Kalyanamitta
                </span>
                <span
                  style={{
                    fontSize: '0.65rem',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    letterSpacing: '0.08em',
                    padding: '2px 6px',
                    borderRadius: '4px',
                    background: '#8C1515',
                    color: '#ffffff'
                  }}
                >
                  Lab
                </span>
              </div>
              <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', display: 'block', lineHeight: 1 }}>
                Academic Dhamma Research
              </span>
            </div>
          </Link>
        </div>

        {/* Center: Lab Switcher Tabs */}
        <nav style={{ display: 'flex', alignItems: 'center', gap: '6px', background: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.04)', padding: '4px', borderRadius: '10px' }}>
          <Link
            to="/lab/roadmap"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              textDecoration: 'none',
              padding: '6px 14px',
              borderRadius: '7px',
              fontSize: '0.85rem',
              fontWeight: isRoadmap ? 700 : 500,
              background: isRoadmap ? 'var(--bg-main)' : 'transparent',
              color: isRoadmap ? 'var(--primary)' : 'var(--text-muted)',
              boxShadow: isRoadmap ? '0 2px 8px rgba(0,0,0,0.06)' : 'none',
              transition: 'all 0.2s ease'
            }}
          >
            <Compass size={15} />
            <span>Study Roadmap</span>
          </Link>

          <Link
            to="/lab/sutta"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              textDecoration: 'none',
              padding: '6px 14px',
              borderRadius: '7px',
              fontSize: '0.85rem',
              fontWeight: isSutta ? 700 : 500,
              background: isSutta ? 'var(--bg-main)' : 'transparent',
              color: isSutta ? 'var(--primary)' : 'var(--text-muted)',
              boxShadow: isSutta ? '0 2px 8px rgba(0,0,0,0.06)' : 'none',
              transition: 'all 0.2s ease'
            }}
          >
            <BookOpen size={15} />
            <span>Sutta Study (3-Layer)</span>
          </Link>
        </nav>

        {/* Right: Theme Toggle & User Auth */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button
            onClick={toggleTheme}
            style={{
              background: 'transparent',
              border: 'none',
              color: 'var(--text-muted)',
              cursor: 'pointer',
              padding: '6px',
              borderRadius: '6px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
            title="Toggle Light/Dark Theme"
          >
            {isDark ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          {session ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Link
                to="/dashboard"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  textDecoration: 'none',
                  color: 'var(--text-main)',
                  padding: '4px 10px',
                  borderRadius: '16px',
                  background: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)',
                  fontSize: '0.82rem',
                  fontWeight: 600
                }}
              >
                {session.user?.user_metadata?.avatar_url || session.user?.user_metadata?.picture ? (
                  <img
                    src={session.user.user_metadata.avatar_url || session.user.user_metadata.picture}
                    alt="User"
                    referrerPolicy="no-referrer"
                    style={{ width: '20px', height: '20px', borderRadius: '50%', objectFit: 'cover' }}
                  />
                ) : (
                  <div
                    style={{
                      width: '20px',
                      height: '20px',
                      borderRadius: '50%',
                      background: 'var(--primary)',
                      color: '#fff',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '0.65rem'
                    }}
                  >
                    {(session.user?.user_metadata?.full_name || session.user?.email || 'U')[0].toUpperCase()}
                  </div>
                )}
                <span style={{ maxWidth: '90px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {session.user?.user_metadata?.full_name?.split(' ')[0] || 'ගිණුම'}
                </span>
              </Link>

              <button
                onClick={async () => {
                  await supabase.auth.signOut();
                  setSession(null);
                }}
                title="Sign Out"
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: 'var(--text-muted)',
                  cursor: 'pointer',
                  padding: '6px',
                  display: 'flex',
                  alignItems: 'center'
                }}
              >
                <LogOut size={16} />
              </button>
            </div>
          ) : (
            <Link
              to="/login"
              style={{
                fontSize: '0.82rem',
                fontWeight: 600,
                color: '#ffffff',
                background: 'var(--primary)',
                padding: '6px 14px',
                borderRadius: '8px',
                textDecoration: 'none'
              }}
            >
              Sign In
            </Link>
          )}
        </div>
      </header>

      {/* Main Outlet Workspace */}
      <main style={{ flex: 1 }}>
        <Outlet />
      </main>
    </div>
  );
}
