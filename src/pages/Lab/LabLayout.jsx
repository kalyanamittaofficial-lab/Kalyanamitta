import React, { useState, useEffect } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  FlaskConical, 
  Compass, 
  BookOpen, 
  ArrowLeft, 
  Sun, 
  Moon, 
  LogOut, 
  Menu, 
  X, 
  Home, 
  Quote, 
  Bookmark, 
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  Search,
  Sparkles
} from 'lucide-react';
import { supabase } from '../../utils/supabase';
import AcademicCitationModal from '../../components/SuttaStudy/AcademicCitationModal';

export default function LabLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const [session, setSession] = useState(null);
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'light');
  
  // Sidebar state: collapsed or expanded on desktop, open/close drawer on mobile
  const [isSidebarOpenMobile, setIsSidebarOpenMobile] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  
  // Global Citation Modal from Sidebar
  const [isGlobalCitationOpen, setIsGlobalCitationOpen] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Close mobile sidebar on route change
  useEffect(() => {
    setIsSidebarOpenMobile(false);
  }, [location.pathname]);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
  };

  const isDark = theme === 'dark';

  // Navigation Links
  const navItems = [
    {
      to: '/lab',
      label: 'Lab Overview',
      sinhalaLabel: 'ප්‍රධාන පුවරුව',
      icon: Home,
      exact: true
    },
    {
      to: '/lab/roadmap',
      label: 'Study Roadmap',
      sinhalaLabel: 'අධ්‍යයන ගමන්මඟ',
      icon: Compass
    },
    {
      to: '/lab/sutta',
      label: 'Sutta Study',
      sinhalaLabel: 'සූත්‍ර අධ්‍යයනය',
      icon: BookOpen
    }
  ];

  // Quick Sutta Corpus Links
  const quickSuttas = [
    {
      id: 'snp1.8',
      ref: 'Snp 1.8',
      name: 'Karaṇīya Mettā Sutta',
      sinhala: 'කරණීය මෙත්ත සූත්‍රය'
    },
    {
      id: 'dhp1-20',
      ref: 'Dhp 1-20',
      name: 'Dhammapada Yamakavagga',
      sinhala: 'යමක වග්ගය'
    }
  ];

  const sidebarWidth = isSidebarCollapsed ? '72px' : '260px';

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-main)', color: 'var(--text-main)', display: 'flex' }}>
      
      {/* MOBILE BACKDROP OVERLAY */}
      {isSidebarOpenMobile && (
        <div
          onClick={() => setIsSidebarOpenMobile(false)}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.5)',
            backdropFilter: 'blur(3px)',
            zIndex: 998,
            display: 'block'
          }}
        />
      )}

      {/* LEFT SIDEBAR NAVIGATION */}
      <aside
        style={{
          width: sidebarWidth,
          minWidth: sidebarWidth,
          background: isDark ? 'rgba(24, 24, 27, 0.98)' : 'rgba(255, 255, 255, 0.98)',
          borderRight: '1px solid var(--border-color, rgba(0,0,0,0.08))',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          position: 'sticky',
          top: 0,
          height: '100vh',
          zIndex: 999,
          transition: 'width 0.25s ease, transform 0.25s ease',
          boxShadow: isDark ? '2px 0 16px rgba(0,0,0,0.4)' : '2px 0 16px rgba(0,0,0,0.03)'
        }}
        className={`lab-sidebar ${isSidebarOpenMobile ? 'mobile-open' : ''}`}
      >
        {/* SIDEBAR HEADER / BRAND */}
        <div style={{ padding: isSidebarCollapsed ? '16px 12px' : '18px 20px', borderBottom: '1px solid var(--border-color, rgba(0,0,0,0.06))' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px' }}>
            <Link
              to="/lab"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                textDecoration: 'none',
                color: 'var(--text-main)',
                overflow: 'hidden'
              }}
            >
              <div
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '9px',
                  background: 'linear-gradient(135deg, #8C1515, #B32424)',
                  color: '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  boxShadow: '0 2px 8px rgba(140, 21, 21, 0.25)'
                }}
              >
                <FlaskConical size={19} />
              </div>

              {!isSidebarCollapsed && (
                <div style={{ whiteSpace: 'nowrap' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{ fontWeight: 800, fontSize: '0.98rem', fontFamily: 'var(--font-serif)', letterSpacing: '-0.01em' }}>
                      Kalyanamitta
                    </span>
                    <span
                      style={{
                        fontSize: '0.62rem',
                        fontWeight: 700,
                        textTransform: 'uppercase',
                        padding: '1px 5px',
                        borderRadius: '4px',
                        background: '#8C1515',
                        color: '#ffffff'
                      }}
                    >
                      Lab
                    </span>
                  </div>
                  <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', display: 'block', marginTop: '1px' }}>
                    Academic Research
                  </span>
                </div>
              )}
            </Link>

            {/* Desktop Collapse Toggle Button */}
            <button
              onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
              className="desktop-only-btn"
              title={isSidebarCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
              style={{
                background: 'transparent',
                border: 'none',
                color: 'var(--text-muted)',
                cursor: 'pointer',
                padding: '4px',
                borderRadius: '6px',
                display: isSidebarCollapsed ? 'none' : 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <ChevronLeft size={16} />
            </button>
          </div>
        </div>

        {/* SIDEBAR MAIN MENU (SCROLLABLE) */}
        <div style={{ flex: 1, overflowY: 'auto', padding: isSidebarCollapsed ? '14px 8px' : '16px 14px' }}>
          
          {/* Section: Main Workspace Navigation */}
          <div style={{ marginBottom: '22px' }}>
            {!isSidebarCollapsed && (
              <div style={{
                fontSize: '0.68rem',
                fontWeight: '700',
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                color: 'var(--text-muted)',
                padding: '0 8px',
                marginBottom: '8px'
              }}>
                Workspace
              </div>
            )}

            <nav style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              {navItems.map((item) => {
                const isActive = item.exact 
                  ? location.pathname === item.to 
                  : location.pathname.startsWith(item.to);

                return (
                  <Link
                    key={item.to}
                    to={item.to}
                    title={isSidebarCollapsed ? item.label : undefined}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      padding: isSidebarCollapsed ? '10px 0' : '9px 12px',
                      justifyContent: isSidebarCollapsed ? 'center' : 'flex-start',
                      borderRadius: '8px',
                      textDecoration: 'none',
                      fontSize: '0.86rem',
                      fontWeight: isActive ? 700 : 500,
                      background: isActive ? 'rgba(140, 21, 21, 0.08)' : 'transparent',
                      color: isActive ? '#8C1515' : 'var(--text-main)',
                      transition: 'all 0.15s ease'
                    }}
                    onMouseEnter={e => {
                      if (!isActive) e.currentTarget.style.background = isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.03)';
                    }}
                    onMouseLeave={e => {
                      if (!isActive) e.currentTarget.style.background = 'transparent';
                    }}
                  >
                    <item.icon size={17} color={isActive ? '#8C1515' : 'var(--text-muted)'} />
                    {!isSidebarCollapsed && (
                      <div style={{ lineHeight: 1.2 }}>
                        <div>{item.label}</div>
                        <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{item.sinhalaLabel}</div>
                      </div>
                    )}
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Section: Canonical Corpus (Quick Sutta Links) */}
          <div style={{ marginBottom: '22px' }}>
            {!isSidebarCollapsed && (
              <div style={{
                fontSize: '0.68rem',
                fontWeight: '700',
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                color: 'var(--text-muted)',
                padding: '0 8px',
                marginBottom: '8px'
              }}>
                Canonical Suttas
              </div>
            )}

            <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
              {quickSuttas.map(s => {
                const isCurrent = location.pathname === `/lab/sutta/${s.id}`;
                return (
                  <Link
                    key={s.id}
                    to={`/lab/sutta/${s.id}`}
                    title={isSidebarCollapsed ? `${s.ref} - ${s.name}` : undefined}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      padding: isSidebarCollapsed ? '8px 0' : '7px 10px',
                      justifyContent: isSidebarCollapsed ? 'center' : 'flex-start',
                      borderRadius: '6px',
                      textDecoration: 'none',
                      fontSize: '0.8rem',
                      fontWeight: isCurrent ? 700 : 500,
                      background: isCurrent ? 'rgba(140, 21, 21, 0.08)' : 'transparent',
                      color: isCurrent ? '#8C1515' : 'var(--text-muted)',
                      transition: 'all 0.15s ease'
                    }}
                    onMouseEnter={e => {
                      if (!isCurrent) e.currentTarget.style.color = 'var(--text-main)';
                    }}
                    onMouseLeave={e => {
                      if (!isCurrent) e.currentTarget.style.color = 'var(--text-muted)';
                    }}
                  >
                    <span style={{
                      fontFamily: 'monospace',
                      fontSize: '0.68rem',
                      padding: '1px 5px',
                      borderRadius: '4px',
                      background: isCurrent ? '#8C1515' : 'rgba(0,0,0,0.05)',
                      color: isCurrent ? '#FFFFFF' : 'inherit'
                    }}>
                      {s.ref}
                    </span>
                    {!isSidebarCollapsed && (
                      <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {s.name}
                      </span>
                    )}
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Section: Academic Utilities */}
          <div>
            {!isSidebarCollapsed && (
              <div style={{
                fontSize: '0.68rem',
                fontWeight: '700',
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                color: 'var(--text-muted)',
                padding: '0 8px',
                marginBottom: '8px'
              }}>
                Tools
              </div>
            )}

            <button
              onClick={() => setIsGlobalCitationOpen(true)}
              title="Academic Citation Generator"
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: isSidebarCollapsed ? '9px 0' : '8px 10px',
                justifyContent: isSidebarCollapsed ? 'center' : 'flex-start',
                borderRadius: '6px',
                border: 'none',
                background: 'transparent',
                color: 'var(--text-main)',
                fontSize: '0.82rem',
                fontWeight: 500,
                cursor: 'pointer',
                textAlign: 'left'
              }}
              onMouseEnter={e => e.currentTarget.style.background = isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.03)'}
              onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
            >
              <Quote size={15} color="#8C1515" />
              {!isSidebarCollapsed && <span>Citation Tool</span>}
            </button>
          </div>

        </div>

        {/* SIDEBAR FOOTER */}
        <div style={{
          padding: isSidebarCollapsed ? '12px 8px' : '14px 16px',
          borderTop: '1px solid var(--border-color, rgba(0,0,0,0.06))',
          display: 'flex',
          flexDirection: 'column',
          gap: '10px'
        }}>
          {/* User Profile or Sign In */}
          {session ? (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: isSidebarCollapsed ? 'center' : 'space-between',
              gap: '8px'
            }}>
              <Link
                to="/dashboard"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  textDecoration: 'none',
                  color: 'var(--text-main)',
                  overflow: 'hidden'
                }}
              >
                {session.user?.user_metadata?.avatar_url || session.user?.user_metadata?.picture ? (
                  <img
                    src={session.user.user_metadata.avatar_url || session.user.user_metadata.picture}
                    alt="User"
                    referrerPolicy="no-referrer"
                    style={{ width: '26px', height: '26px', borderRadius: '50%', objectFit: 'cover' }}
                  />
                ) : (
                  <div
                    style={{
                      width: '26px',
                      height: '26px',
                      borderRadius: '50%',
                      background: 'var(--primary)',
                      color: '#fff',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '0.75rem',
                      fontWeight: '700'
                    }}
                  >
                    {(session.user?.user_metadata?.full_name || session.user?.email || 'U')[0].toUpperCase()}
                  </div>
                )}
                {!isSidebarCollapsed && (
                  <div style={{ overflow: 'hidden' }}>
                    <div style={{ fontSize: '0.8rem', fontWeight: 600, textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {session.user?.user_metadata?.full_name?.split(' ')[0] || 'Seeker'}
                    </div>
                    <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>
                      Personal Lab
                    </div>
                  </div>
                )}
              </Link>

              {!isSidebarCollapsed && (
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
                    padding: '4px'
                  }}
                >
                  <LogOut size={15} />
                </button>
              )}
            </div>
          ) : (
            <Link
              to="/login"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
                fontSize: '0.8rem',
                fontWeight: 600,
                color: '#ffffff',
                background: '#8C1515',
                padding: '7px 12px',
                borderRadius: '6px',
                textDecoration: 'none'
              }}
            >
              <span>{isSidebarCollapsed ? 'Sign In' : 'Sign In with Google'}</span>
            </Link>
          )}

          {/* Theme & Back to Main Web */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: isSidebarCollapsed ? 'center' : 'space-between',
            gap: '6px',
            paddingTop: '6px'
          }}>
            <Link
              to="/"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '5px',
                textDecoration: 'none',
                color: 'var(--text-muted)',
                fontSize: '0.76rem',
                fontWeight: 500
              }}
              title="Return to Main Website"
            >
              <ArrowLeft size={13} />
              {!isSidebarCollapsed && <span>Main Website</span>}
            </Link>

            <button
              onClick={toggleTheme}
              style={{
                background: 'transparent',
                border: 'none',
                color: 'var(--text-muted)',
                cursor: 'pointer',
                padding: '4px',
                borderRadius: '4px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
              title="Toggle Light/Dark Theme"
            >
              {isDark ? <Sun size={15} /> : <Moon size={15} />}
            </button>
          </div>
        </div>
      </aside>

      {/* RIGHT CANVAS: MAIN CONTENT AREA */}
      <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column' }}>
        
        {/* Sleek Minimalist Topbar */}
        <header
          style={{
            position: 'sticky',
            top: 0,
            zIndex: 100,
            background: isDark ? 'rgba(28, 25, 23, 0.95)' : 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(10px)',
            borderBottom: '1px solid var(--border-color, rgba(0,0,0,0.06))',
            height: '52px',
            padding: '0 clamp(16px, 3vw, 36px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '12px'
          }}
        >
          {/* Left: Mobile hamburger & breadcrumbs */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            {/* Mobile Sidebar Hamburger Toggle */}
            <button
              onClick={() => setIsSidebarOpenMobile(!isSidebarOpenMobile)}
              className="mobile-only-btn"
              style={{
                background: 'transparent',
                border: 'none',
                color: 'var(--text-main)',
                cursor: 'pointer',
                padding: '4px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              {isSidebarOpenMobile ? <X size={20} /> : <Menu size={20} />}
            </button>

            {/* Breadcrumb Indicator */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.82rem', color: 'var(--text-muted)' }}>
              <Link to="/lab" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>Lab</Link>
              <span>/</span>
              <span style={{ fontWeight: 600, color: 'var(--text-main)' }}>
                {location.pathname === '/lab' && 'Overview'}
                {location.pathname.startsWith('/lab/roadmap') && 'Study Roadmap'}
                {location.pathname.startsWith('/lab/sutta') && 'Sutta Study'}
              </span>
            </div>
          </div>

          {/* Right: Methodological badge */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{
              fontSize: '0.74rem',
              fontWeight: 600,
              color: '#8C1515',
              background: 'rgba(140, 21, 21, 0.06)',
              padding: '3px 8px',
              borderRadius: '6px'
            }}>
              W3C Stand-off Canonical Edition
            </span>
          </div>
        </header>

        {/* WORKSPACE OUTLET CANVAS */}
        <main style={{ flex: 1, minWidth: 0 }}>
          <Outlet />
        </main>
      </div>

      {/* GLOBAL CITATION MODAL */}
      <AcademicCitationModal
        isOpen={isGlobalCitationOpen}
        onClose={() => setIsGlobalCitationOpen(false)}
        sutta={{
          id: 'snp1.8',
          titlePali: 'Karaṇīya Mettā Sutta',
          titleEnglish: 'Discourse on Loving-Kindness',
          canonicalRef: 'Snp 1.8 / Khp 9'
        }}
        activeSegment={null}
      />

      {/* RESPONSIVE STYLES */}
      <style>{`
        @media (max-width: 768px) {
          .lab-sidebar {
            position: fixed !important;
            left: 0;
            top: 0;
            bottom: 0;
            transform: translateX(-100%);
            width: 270px !important;
            min-width: 270px !important;
          }
          .lab-sidebar.mobile-open {
            transform: translateX(0) !important;
          }
          .desktop-only-btn {
            display: none !important;
          }
          .mobile-only-btn {
            display: flex !important;
          }
        }
        @media (min-width: 769px) {
          .mobile-only-btn {
            display: none !important;
          }
        }
      `}</style>
    </div>
  );
}
