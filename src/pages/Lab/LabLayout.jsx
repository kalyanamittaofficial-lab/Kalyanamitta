import { useState, useEffect } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import {
  FlaskConical,
  Highlighter,
  BookOpen,
  ArrowLeft,
  Sun,
  Moon,
  LogOut,
  Menu,
  X,
  Home,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Network,
  Compass,
  BookHeart,
  Sparkles,
  Globe,
  FolderKanban,
  Plus,
  Search,
  User
} from 'lucide-react';
import { AnimatePresence } from 'framer-motion';
import { supabase } from '../../utils/supabase';
import { hydrateHighlightsFromCloud } from '../../services/highlightStore';
import { hydrateAnnotationsFromCloud } from '../../services/studyRoadmapStore';
import { hydrateReadingProgressFromCloud } from '../../services/readingProgressStore';
import { hydrateKnowledgeMapsFromCloud } from '../../services/knowledgeMapStore';
import { hydratePracticeEcosystemFromCloud } from '../../services/practiceEcosystemStore';
import { hydrateMyPublicProfileFromCloud } from '../../services/communityExploreStore';
import { t } from '../../services/labLangStore';
import { searchLabWorkspace } from '../../services/collectionsStore';
import { getLifeClockConfig, computeLifeClock, hydrateLifeClockFromCloud } from '../../services/lifeClockStore';
import { hydrateRoutineFromCloud } from '../../services/dailyRoutineStore';
import { searchSuttas, getNikayas, getTreeChildren, getBreadcrumbs } from '../../services/tipitakaService';
import LabLoadingScreen from './LabLoadingScreen';
import './labTheme.css';

export default function LabLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const [session, setSession] = useState(null);
  const [isLabInitializing, setIsLabInitializing] = useState(true);
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'light');
  const lang = 'si';

  const [isSidebarOpenMobile, setIsSidebarOpenMobile] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [showQuickCreate, setShowQuickCreate] = useState(false);
  const [showGlobalSearch, setShowGlobalSearch] = useState(false);
  const [globalQuery, setGlobalQuery] = useState('');
  const [globalSuttaHits, setGlobalSuttaHits] = useState([]);
  const [nikayas, setNikayas] = useState([]);
  const [isSuttaTreeOpen, setIsSuttaTreeOpen] = useState(() => location.pathname.startsWith('/lab/sutta'));
  const [expandedKeys, setExpandedKeys] = useState({});
  const [treeCache, setTreeCache] = useState({});
  const [navClock, setNavClock] = useState(() => {
    const cfg = getLifeClockConfig();
    return computeLifeClock(cfg.dob, cfg.lifespan, cfg.mode);
  });

  useEffect(() => {
    getNikayas().then(list => setNikayas(list));
  }, []);

  useEffect(() => {
    if (!location.pathname.startsWith('/lab/sutta')) return undefined;

    const suttaSlug = location.pathname.startsWith('/lab/sutta/')
      ? decodeURIComponent(location.pathname.replace('/lab/sutta/', '').split('/')[0])
      : null;
    const branchParam = new URLSearchParams(location.search).get('branch');
    const targetKey = suttaSlug || branchParam;
    if (!targetKey) return undefined;

    let cancelled = false;
    getBreadcrumbs(targetKey)
      .then(async (crumbs) => {
        if (cancelled || !Array.isArray(crumbs)) return;
        const branchCrumbs = crumbs.filter((c) => c.key && c.key !== 'sp' && (c.hasChildren !== false || c.key === branchParam));
        const keysToExpand = {};
        const childEntries = {};

        await Promise.all(
          branchCrumbs.map(async (c) => {
            keysToExpand[c.key] = true;
            const children = await getTreeChildren(c.key).catch(() => []);
            if (Array.isArray(children) && children.length > 0) {
              childEntries[c.key] = children;
            }
          })
        );

        if (cancelled) return;
        setIsSuttaTreeOpen(true);
        setExpandedKeys((prev) => ({ ...prev, ...keysToExpand }));
        setTreeCache((prev) => ({ ...prev, ...childEntries }));
      })
      .catch(() => {});

    return () => {
      cancelled = true;
    };
  }, [location.pathname, location.search]);

  useEffect(() => {
    const update = () => {
      const cfg = getLifeClockConfig();
      setNavClock(computeLifeClock(cfg.dob, cfg.lifespan, cfg.mode));
    };
    const timer = setInterval(update, 1000);
    window.addEventListener('labLifeClockUpdated', update);
    return () => {
      clearInterval(timer);
      window.removeEventListener('labLifeClockUpdated', update);
    };
  }, []);

  useEffect(() => {
    let isMounted = true;
    const minSplash = new Promise((resolve) => setTimeout(resolve, 600));
    const hydrateAll = () => {
      hydrateHighlightsFromCloud();
      hydrateAnnotationsFromCloud();
      hydrateReadingProgressFromCloud();
      hydrateKnowledgeMapsFromCloud();
      hydratePracticeEcosystemFromCloud();
      hydrateMyPublicProfileFromCloud();
      hydrateRoutineFromCloud();
      hydrateLifeClockFromCloud();
    };

    const authCheck = supabase.auth.getSession().then(({ data: { session } }) => {
      if (isMounted) {
        setSession(session);
        if (session) hydrateAll();
      }
    });

    Promise.all([minSplash, authCheck]).finally(() => {
      if (isMounted) setIsLabInitializing(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      if (isMounted) {
        setSession(nextSession);
        if (nextSession) hydrateAll();
      }
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
  };

  const isDark = theme === 'dark';

  useEffect(() => {
    const q = globalQuery.trim();
    if (!showGlobalSearch || !q) {
      return;
    }
    let cancelled = false;
    const timer = setTimeout(() => {
      searchSuttas(q, 8).then(res => {
        if (!cancelled) setGlobalSuttaHits(res);
      });
    }, 150);
    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [globalQuery, showGlobalSearch]);

  const navGroups = [
    {
      titleSi: 'මගේ අධ්‍යයන අවකාශය',
      titleEn: 'My Study Space',
      items: [
        { to: '/lab', label: 'Dashboard', sinhalaLabel: 'ප්‍රධාන පුවරුව', icon: Home, exact: true },
        { to: '/lab/sutta', label: 'Sutta Library', sinhalaLabel: 'සූත්‍ර පුස්තකාලය', icon: BookOpen },
        { to: '/lab/map', label: 'My Map', sinhalaLabel: 'මගේ සිතියම', icon: Network },
        { to: '/lab/roadmap', label: 'My Notes', sinhalaLabel: 'මගේ සටහන්', icon: Highlighter },
        { to: '/lab/collections', label: 'Collections', sinhalaLabel: 'අධ්‍යයන එකතු', icon: FolderKanban }
      ]
    },
    {
      titleSi: 'මගේ ජීවිතය සහ ප්‍රතිපදාව',
      titleEn: 'My Life & Practice',
      items: [
        { to: '/lab/daily-routine', label: 'Daily Routine', sinhalaLabel: 'දෛනික දහම් රටාව', icon: Sun },
        { to: '/lab/pin-potha', label: 'Pin Potha', sinhalaLabel: 'පින් පොත', icon: BookHeart },
        { to: '/lab/compass', label: 'Path Compass', sinhalaLabel: 'මාර්ග දිශානතිය', icon: Compass },
        { to: '/lab/dedication', label: 'Dedication', sinhalaLabel: 'පුණ්‍යානුමෝදනා', icon: Sparkles }
      ]
    },
    {
      titleSi: 'ප්‍රජාව',
      titleEn: 'Community',
      items: [
        { to: '/lab/explore', label: 'Explore Maps', sinhalaLabel: 'සිතියම් ගවේෂණය', icon: Globe },
        { to: '/lab/onboarding', label: 'Starting Point', sinhalaLabel: 'ආරම්භක සටහන', icon: User }
      ]
    }
  ];

  const handleTreeNodeClick = async (node) => {
    const isBranch = node.hasChildren === undefined ? true : node.hasChildren;
    if (!isBranch) {
      setIsSidebarOpenMobile(false);
      navigate(`/lab/sutta/${node.key}`);
      return;
    }

    const isExpanded = Boolean(expandedKeys[node.key]);
    setExpandedKeys(prev => ({ ...prev, [node.key]: !isExpanded }));
    navigate(`/lab/sutta?branch=${encodeURIComponent(node.key)}`);

    if (!treeCache[node.key]) {
      const children = await getTreeChildren(node.key);
      setTreeCache(prev => ({ ...prev, [node.key]: children }));
    }
  };

  const activeBranchKey = new URLSearchParams(location.search).get('branch');

  const renderSidebarTree = (items, depth = 0) => {
    return items.map(item => {
      const isExpanded = Boolean(expandedKeys[item.key]);
      const isSelected = activeBranchKey === item.key || location.pathname === `/lab/sutta/${item.key}`;
      const children = treeCache[item.key] || [];
      const isBranch = item.hasChildren === undefined ? true : item.hasChildren;

      return (
        <div key={item.key}>
          <button
            type="button"
            onClick={() => handleTreeNodeClick({ ...item, hasChildren: isBranch })}
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '6px',
              padding: `6px 10px 6px ${10 + depth * 12}px`,
              borderRadius: '8px',
              border: 'none',
              background: isSelected ? 'var(--lab-sidebar-active-bg)' : 'transparent',
              color: isSelected ? 'var(--lab-sidebar-active-text)' : 'var(--lab-sidebar-text)',
              fontWeight: isSelected ? '700' : '500',
              fontSize: depth === 0 ? '0.82rem' : '0.78rem',
              fontFamily: 'var(--font-sinhala)',
              textAlign: 'left',
              cursor: 'pointer'
            }}
          >
            <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {item.sinhalaName}
            </span>
            {isBranch && (
              isExpanded
                ? <ChevronDown size={12} style={{ flexShrink: 0 }} />
                : <ChevronRight size={12} style={{ flexShrink: 0 }} />
            )}
          </button>

          {isBranch && isExpanded && children.length > 0 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', marginTop: '2px' }}>
              {renderSidebarTree(children, depth + 1)}
            </div>
          )}
        </div>
      );
    });
  };

  const isNavActive = (item) => {
    if (item.exact) return location.pathname === item.to;
    return location.pathname.startsWith(item.to);
  };

  const sidebarWidth = isSidebarCollapsed ? '72px' : '264px';

  return (
    <div
      className="km-lab-root"
      data-lab-theme={isDark ? 'dark' : 'light'}
      style={{ minHeight: '100vh', display: 'flex' }}
    >
      <AnimatePresence>
        {isLabInitializing && <LabLoadingScreen />}
      </AnimatePresence>

      {/* Mobile Backdrop */}
      {isSidebarOpenMobile && (
        <div
          onClick={() => setIsSidebarOpenMobile(false)}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.45)',
            backdropFilter: 'blur(4px)',
            zIndex: 998
          }}
        />
      )}

      {/* SIDEBAR */}
      <aside
        className={`lab-sidebar ${isSidebarOpenMobile ? 'mobile-open' : ''}`}
        style={{
          width: sidebarWidth,
          minWidth: sidebarWidth,
          height: '100vh',
          position: 'sticky',
          top: 0,
          background: 'var(--lab-sidebar-bg)',
          borderRight: '1px solid var(--lab-sidebar-border)',
          color: 'var(--lab-sidebar-text)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          transition: 'width 0.2s ease, min-width 0.2s ease, transform 0.25s ease',
          zIndex: 999,
          overflowY: 'auto',
          overflowX: 'hidden'
        }}
      >
        {/* Brand Header */}
        <div style={{
          padding: isSidebarCollapsed ? '18px 12px' : '18px 18px',
          borderBottom: '1px solid var(--lab-sidebar-border)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: isSidebarCollapsed ? 'center' : 'space-between',
          gap: '8px'
        }}>
          {!isSidebarCollapsed ? (
            <Link
              to="/lab"
              onClick={() => setIsSidebarOpenMobile(false)}
              style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none', color: 'var(--lab-sidebar-text)' }}
            >
              <div style={{
                width: '34px',
                height: '34px',
                borderRadius: '10px',
                background: 'var(--lab-gold)',
                color: '#FAF8F5',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}>
                <FlaskConical size={17} />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.2 }}>
                <span style={{ fontWeight: '700', fontSize: '0.96rem', fontFamily: 'var(--font-sinhala)', color: 'var(--lab-sidebar-text)' }}>
                  මගේ දහම් මඟ
                </span>
                <span style={{ fontSize: '0.69rem', color: 'var(--lab-sidebar-muted)', fontWeight: 500, fontFamily: 'var(--font-sinhala)' }}>
                  අත්තදීප · මා දකින මඟ
                </span>
              </div>
            </Link>
          ) : (
            <Link to="/lab" title="මගේ දහම් මඟ" style={{ color: 'var(--lab-gold)', display: 'flex' }}>
              <FlaskConical size={22} />
            </Link>
          )}

          <button
            onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
            className="desktop-only-btn"
            title={isSidebarCollapsed ? 'Expand' : 'Collapse'}
            style={{
              background: 'transparent',
              border: '1px solid var(--lab-sidebar-border)',
              borderRadius: '8px',
              width: '26px',
              height: '26px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--lab-sidebar-muted)',
              cursor: 'pointer'
            }}
          >
            {isSidebarCollapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
          </button>

          <button
            onClick={() => setIsSidebarOpenMobile(false)}
            className="mobile-only-btn"
            style={{ background: 'none', border: 'none', color: 'var(--lab-sidebar-muted)', cursor: 'pointer', padding: '4px' }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Navigation Body */}
        <div style={{ flex: 1, padding: isSidebarCollapsed ? '14px 10px' : '18px 12px', display: 'flex', flexDirection: 'column', gap: '22px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {navGroups.map(group => (
              <div key={group.titleEn} style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
                {!isSidebarCollapsed && (
                  <div style={{
                    fontSize: '0.68rem',
                    fontWeight: '700',
                    textTransform: 'uppercase',
                    letterSpacing: '0.06em',
                    color: 'var(--lab-sidebar-muted)',
                    padding: '0 10px',
                    marginBottom: '3px'
                  }}>
                    {lang === 'en' ? group.titleEn : group.titleSi}
                  </div>
                )}

                {group.items.map(item => {
                  const Icon = item.icon;
                  const active = isNavActive(item);
                  const isSuttaItem = item.to === '/lab/sutta';
                  return (
                    <div key={item.to}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <Link
                          to={item.to}
                          onClick={() => {
                            setIsSidebarOpenMobile(false);
                            if (isSuttaItem) setIsSuttaTreeOpen(true);
                          }}
                          title={isSidebarCollapsed ? (lang === 'en' ? item.label : item.sinhalaLabel) : undefined}
                          style={{
                            flex: 1,
                            display: 'flex',
                            alignItems: 'center',
                            gap: '10px',
                            padding: isSidebarCollapsed ? '10px 0' : '8px 12px',
                            justifyContent: isSidebarCollapsed ? 'center' : 'flex-start',
                            borderRadius: '10px',
                            textDecoration: 'none',
                            color: active ? 'var(--lab-sidebar-active-text)' : 'var(--lab-sidebar-text)',
                            background: active ? 'var(--lab-sidebar-active-bg)' : 'transparent',
                            fontWeight: active ? 600 : 500,
                            fontSize: '0.87rem',
                            transition: 'all 0.15s ease'
                          }}
                        >
                          <Icon size={17} color={active ? 'var(--lab-sidebar-active-text)' : 'var(--lab-sidebar-muted)'} />
                          {!isSidebarCollapsed && (
                            <span style={{ fontSize: '0.87rem', lineHeight: 1.25 }}>
                              {lang === 'en' ? item.label : item.sinhalaLabel}
                            </span>
                          )}
                        </Link>
                        {isSuttaItem && !isSidebarCollapsed && (
                          <button
                            type="button"
                            onClick={() => setIsSuttaTreeOpen(v => !v)}
                            aria-label="Toggle Nikāya menu"
                            style={{
                              border: 'none',
                              background: 'transparent',
                              color: 'var(--lab-sidebar-muted)',
                              cursor: 'pointer',
                              padding: '6px',
                              borderRadius: '6px',
                              display: 'flex',
                              alignItems: 'center'
                            }}
                          >
                            {isSuttaTreeOpen ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                          </button>
                        )}
                      </div>

                      {isSuttaItem && !isSidebarCollapsed && isSuttaTreeOpen && nikayas.length > 0 && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', paddingLeft: '14px', marginTop: '3px', marginBottom: '4px' }}>
                          {renderSidebarTree(nikayas, 0)}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div style={{
          padding: isSidebarCollapsed ? '12px 8px' : '14px 14px',
          borderTop: '1px solid var(--lab-sidebar-border)',
          display: 'flex',
          flexDirection: 'column',
          gap: '8px'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: isSidebarCollapsed ? 'center' : 'space-between',
            gap: '8px'
          }}>
            <button
              onClick={toggleTheme}
              title={isDark ? 'Switch to Light' : 'Switch to Dark'}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '7px 10px',
                borderRadius: '9px',
                border: '1px solid var(--lab-sidebar-border)',
                background: 'var(--lab-sidebar-subtle)',
                color: 'var(--lab-sidebar-text)',
                fontSize: '0.78rem',
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              {isDark ? <Sun size={14} color="#FBBF24" /> : <Moon size={14} />}
              {!isSidebarCollapsed && <span>{isDark ? 'ආලෝක' : 'අඳුරු'}</span>}
            </button>

            {!isSidebarCollapsed && (
              <Link
                to="/"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '5px',
                  fontSize: '0.78rem',
                  color: 'var(--lab-sidebar-muted)',
                  textDecoration: 'none',
                  padding: '6px 8px',
                  borderRadius: '8px'
                }}
              >
                <ArrowLeft size={13} />
                <span>ප්‍රධාන අඩවිය</span>
              </Link>
            )}
          </div>

          {!isSidebarCollapsed && (
            session ? (
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '8px',
                padding: '8px 10px',
                borderRadius: '10px',
                background: 'var(--lab-sidebar-subtle)',
                border: '1px solid var(--lab-sidebar-border)'
              }}>
                <Link
                  to="/profile"
                  style={{ display: 'flex', alignItems: 'center', gap: '8px', textDecoration: 'none', color: 'var(--lab-sidebar-text)', minWidth: 0 }}
                >
                  <div style={{
                    width: '26px',
                    height: '26px',
                    borderRadius: '50%',
                    background: 'var(--lab-gold)',
                    color: '#142B21',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '0.74rem',
                    fontWeight: 'bold',
                    flexShrink: 0
                  }}>
                    {(session.user?.user_metadata?.full_name || session.user?.email || 'U')[0].toUpperCase()}
                  </div>
                  <span style={{ fontSize: '0.8rem', fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {session.user?.user_metadata?.full_name?.split(' ')[0] || 'Member'}
                  </span>
                </Link>
                <button
                  onClick={async () => {
                    await supabase.auth.signOut();
                    setSession(null);
                  }}
                  title="Sign Out"
                  style={{ background: 'none', border: 'none', color: 'var(--lab-sidebar-muted)', cursor: 'pointer', padding: '4px' }}
                >
                  <LogOut size={14} />
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '9px',
                  borderRadius: '10px',
                  background: 'var(--lab-sidebar-active-bg)',
                  color: 'var(--lab-sidebar-active-text)',
                  textDecoration: 'none',
                  fontSize: '0.82rem',
                  fontWeight: 600
                }}
              >
                පිවිසෙන්න
              </Link>
            )
          )}
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column' }}>
        <header style={{
          height: '56px',
          padding: '0 clamp(16px, 3vw, 28px)',
          borderBottom: '1px solid var(--lab-border)',
          background: 'var(--lab-bg-glass)',
          backdropFilter: 'blur(14px)',
          WebkitBackdropFilter: 'blur(14px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          position: 'sticky',
          top: 0,
          zIndex: 30
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <button
              onClick={() => setIsSidebarOpenMobile(true)}
              className="mobile-only-btn"
              style={{
                background: 'none',
                border: '1px solid var(--lab-border)',
                borderRadius: '8px',
                padding: '6px',
                color: 'var(--lab-text)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center'
              }}
            >
              <Menu size={18} />
            </button>

            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.84rem', color: 'var(--lab-text-muted)' }}>
              <Link to="/lab" style={{ color: 'var(--lab-text-muted)', textDecoration: 'none', fontWeight: 500 }}>
                {t(lang, 'අධ්‍යයනාගාරය', 'Lab')}
              </Link>
              <span>/</span>
              <span style={{ color: 'var(--lab-text)', fontWeight: 600 }}>
                {location.pathname === '/lab' && t(lang, 'ප්‍රධාන පුවරුව', 'Dashboard')}
                {location.pathname.startsWith('/lab/sutta') && t(lang, 'සූත්‍ර කියවනය', 'Sutta Library & Reader')}
                {location.pathname.startsWith('/lab/roadmap') && t(lang, 'මගේ සටහන්', 'My Notes')}
                {location.pathname.startsWith('/lab/map') && t(lang, 'මගේ සිතියම', 'My Map')}
                {location.pathname.startsWith('/lab/collections') && t(lang, 'අධ්‍යයන එකතු', 'Collections')}
                {location.pathname.startsWith('/lab/compass') && t(lang, 'මාර්ග දිශානතිය', 'Path Compass')}
                {location.pathname.startsWith('/lab/pin-potha') && t(lang, 'පින් පොත', 'Pin Potha')}
                {location.pathname.startsWith('/lab/daily-routine') && 'දෛනික දහම් රටාව'}
                {location.pathname.startsWith('/lab/dedication') && t(lang, 'පුණ්‍යානුමෝදනා', 'Dedication')}
                {location.pathname.startsWith('/lab/explore') && t(lang, 'සිතියම් ගවේෂණය', 'Explore Maps')}
                {location.pathname.startsWith('/lab/maps/') && t(lang, 'ප්‍රජා සිතියම', 'Public Map')}
                {location.pathname.startsWith('/lab/onboarding') && t(lang, 'ආරම්භක සටහන', 'Starting Point')}
              </span>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', position: 'relative' }}>
            <Link
              to="/lab"
              title="දුල්ලභෝ මනුස්ස පටිලාභෝ · මිනිසත් බව ලැබීම දුර්ලභය"
              className="km-lab-nav-clock"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '5px 11px',
                borderRadius: '999px',
                border: '1px solid var(--lab-border)',
                background: 'var(--lab-bg-subtle)',
                color: 'var(--lab-text)',
                textDecoration: 'none',
                fontSize: '0.76rem',
                fontWeight: '700',
                fontVariantNumeric: 'tabular-nums',
                whiteSpace: 'nowrap'
              }}
            >
              <span>ව {String(navClock.years).padStart(2, '0')}</span>
              <span>:</span>
              <span>මා {String(navClock.months).padStart(2, '0')}</span>
              <span>:</span>
              <span>දි {String(navClock.days).padStart(2, '0')}</span>
              <span>:</span>
              <span>පැ {String(navClock.hours).padStart(2, '0')}</span>
              <span>:</span>
              <span>මි {String(navClock.minutes).padStart(2, '0')}</span>
              <span>:</span>
              <span>ත {String(navClock.seconds).padStart(2, '0')}</span>
            </Link>

            <button
              onClick={() => setShowGlobalSearch(true)}
              className="km-lab-btn"
              style={{ width: '32px', height: '32px', padding: 0, borderRadius: '50%' }}
              title={t(lang, 'සමස්ත සෙවුම', 'Global Search')}
              aria-label={t(lang, 'සමස්ත සෙවුම', 'Global Search')}
            >
              <Search size={14} />
            </button>

            <div style={{ position: 'relative' }}>
              <button
                onClick={() => setShowQuickCreate(v => !v)}
                className="km-lab-btn-primary"
                style={{ width: '32px', height: '32px', padding: 0, borderRadius: '50%' }}
                title={t(lang, 'ඉක්මන් නිර්මාණය', 'Quick Create')}
                aria-label={t(lang, 'ඉක්මන් නිර්මාණය', 'Quick Create')}
              >
                <Plus size={15} />
              </button>

              {showQuickCreate && (
                <div
                  className="km-lab-card"
                  style={{
                    position: 'absolute',
                    right: 0,
                    top: '42px',
                    width: '230px',
                    padding: '8px',
                    zIndex: 80,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '4px'
                  }}
                >
                  {[
                    { to: '/lab/sutta', label: t(lang, 'නව සූත්‍ර සටහනක්', 'New Sutta Note'), icon: Highlighter },
                    { to: '/lab/map', label: t(lang, 'නව සිතියම් අංගයක්', 'New Map Node'), icon: Network },
                    { to: '/lab/pin-potha', label: t(lang, 'පින් පොත සටහනක්', 'New Pin Potha Entry'), icon: BookHeart },
                    { to: '/lab/dedication', label: t(lang, 'දායකත්වයක් / පින් අනුමෝදනාවක්', 'New Contribution'), icon: Sparkles },
                    { to: '/lab/compass', label: t(lang, 'ප්‍රතිපදා අරමුණක්', 'New Practice Intention'), icon: Compass },
                    { to: '/lab/collections', label: t(lang, 'නව අධ්‍යයන එකතුවක්', 'New Collection'), icon: FolderKanban }
                  ].map(item => {
                    const Icon = item.icon;
                    return (
                      <button
                        key={item.to}
                        onClick={() => {
                          setShowQuickCreate(false);
                          navigate(item.to);
                        }}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '9px',
                          padding: '8px 10px',
                          borderRadius: '8px',
                          border: 'none',
                          background: 'transparent',
                          color: 'var(--lab-text)',
                          fontSize: '0.82rem',
                          fontWeight: 500,
                          textAlign: 'left',
                          cursor: 'pointer'
                        }}
                      >
                        <Icon size={14} color="var(--lab-accent)" />
                        <span>{item.label}</span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Global Search Modal */}
        {showGlobalSearch && (() => {
          const wsResults = searchLabWorkspace(globalQuery);
          return (
            <div
              onClick={() => setShowGlobalSearch(false)}
              style={{
                position: 'fixed',
                inset: 0,
                background: 'rgba(0,0,0,0.45)',
                backdropFilter: 'blur(4px)',
                zIndex: 1000,
                display: 'flex',
                alignItems: 'flex-start',
                justifyContent: 'center',
                padding: '72px 16px 24px'
              }}
            >
              <div
                onClick={(e) => e.stopPropagation()}
                className="km-lab-card"
                style={{ width: '100%', maxWidth: '640px', padding: '18px', maxHeight: '78vh', overflowY: 'auto' }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
                  <Search size={17} color="var(--lab-text-muted)" />
                  <input
                    autoFocus
                    className="km-lab-input"
                    value={globalQuery}
                    onChange={(e) => setGlobalQuery(e.target.value)}
                    placeholder={t(lang, 'සූත්‍ර, සටහන්, සිතියම්, පින් පොත හෝ එකතු සොයන්න...', 'Search suttas, notes, map nodes, collections, or Pin Potha...')}
                  />
                  <button
                    onClick={() => setShowGlobalSearch(false)}
                    className="km-lab-btn"
                    style={{ padding: '7px 10px' }}
                  >
                    <X size={15} />
                  </button>
                </div>

                {!globalQuery.trim() ? (
                  <p style={{ fontSize: '0.84rem', color: 'var(--lab-text-muted)', margin: 0, textAlign: 'center', padding: '18px 0' }}>
                    {t(lang, 'සෙවීම සඳහා වචනයක් ටයිප් කරන්න (උදා: මෙත්ත, සතිපට්ඨාන, දාන).', 'Type a Pāli, Sinhala, or English term to search across your workspace.')}
                  </p>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                    {globalSuttaHits.length > 0 && (
                      <div>
                        <div style={{ fontSize: '0.74rem', fontWeight: '700', color: 'var(--lab-accent)', marginBottom: '6px' }}>
                          {t(lang, 'ත්‍රිපිටක සූත්‍ර', 'Suttas')} ({globalSuttaHits.length})
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                          {globalSuttaHits.map(s => (
                            <button
                              key={s.key}
                              onClick={() => {
                                setShowGlobalSearch(false);
                                navigate(`/lab/sutta/${s.key}`);
                              }}
                              style={{ textAlign: 'left', padding: '8px 10px', borderRadius: '8px', border: '1px solid var(--lab-border)', background: 'var(--lab-bg-subtle)', color: 'var(--lab-text)', cursor: 'pointer' }}
                            >
                              <div style={{ fontWeight: '600', fontSize: '0.86rem' }}>{s.sinhalaName}</div>
                              <div style={{ fontSize: '0.75rem', color: 'var(--lab-text-muted)' }}>{s.paliName}</div>
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {wsResults.notes.length > 0 && (
                      <div>
                        <div style={{ fontSize: '0.74rem', fontWeight: '700', color: 'var(--lab-accent)', marginBottom: '6px' }}>
                          {t(lang, 'මගේ සටහන්', 'My Notes')} ({wsResults.notes.length})
                        </div>
                        {wsResults.notes.slice(0, 5).map(n => (
                          <button
                            key={n.id}
                            onClick={() => {
                              setShowGlobalSearch(false);
                              navigate(`/lab/sutta/${n.target?.source}`);
                            }}
                            style={{ width: '100%', textAlign: 'left', padding: '8px 10px', borderRadius: '8px', border: '1px solid var(--lab-border)', background: 'var(--lab-bg-subtle)', color: 'var(--lab-text)', cursor: 'pointer', marginBottom: '5px' }}
                          >
                            <div style={{ fontWeight: '600', fontSize: '0.84rem' }}>{n.target?.suttaTitleSinhala || n.target?.source}</div>
                          </button>
                        ))}
                      </div>
                    )}

                    {wsResults.nodes.length > 0 && (
                      <div>
                        <div style={{ fontSize: '0.74rem', fontWeight: '700', color: 'var(--lab-accent)', marginBottom: '6px' }}>
                          {t(lang, 'සිතියම් අංග', 'Map Nodes')} ({wsResults.nodes.length})
                        </div>
                        {wsResults.nodes.slice(0, 5).map(node => (
                          <button
                            key={node.id}
                            onClick={() => {
                              setShowGlobalSearch(false);
                              navigate('/lab/map');
                            }}
                            style={{ width: '100%', textAlign: 'left', padding: '8px 10px', borderRadius: '8px', border: '1px solid var(--lab-border)', background: 'var(--lab-bg-subtle)', color: 'var(--lab-text)', cursor: 'pointer', marginBottom: '5px' }}
                          >
                            <div style={{ fontWeight: '600', fontSize: '0.84rem' }}>{node.label}</div>
                          </button>
                        ))}
                      </div>
                    )}

                    {wsResults.pinPotha.length > 0 && (
                      <div>
                        <div style={{ fontSize: '0.74rem', fontWeight: '700', color: '#059669', marginBottom: '6px' }}>
                          {t(lang, 'පින් පොත (පෞද්ගලික)', 'Pin Potha (Private)')} ({wsResults.pinPotha.length})
                        </div>
                        {wsResults.pinPotha.slice(0, 5).map(p => (
                          <button
                            key={p.id}
                            onClick={() => {
                              setShowGlobalSearch(false);
                              navigate('/lab/pin-potha');
                            }}
                            style={{ width: '100%', textAlign: 'left', padding: '8px 10px', borderRadius: '8px', border: '1px solid var(--lab-border)', background: 'var(--lab-bg-subtle)', color: 'var(--lab-text)', cursor: 'pointer', marginBottom: '5px' }}
                          >
                            <div style={{ fontWeight: '600', fontSize: '0.84rem' }}>{p.title}</div>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          );
        })()}

        <main style={{ flex: 1, minWidth: 0 }}>
          <Outlet />
        </main>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .lab-sidebar {
            position: fixed !important;
            left: 0;
            top: 0;
            bottom: 0;
            transform: translateX(-100%);
            width: 264px !important;
            min-width: 264px !important;
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
