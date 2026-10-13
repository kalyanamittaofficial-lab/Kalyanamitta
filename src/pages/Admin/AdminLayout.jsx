import React, { useEffect, useState, useRef, useCallback } from 'react';
import { Outlet, Navigate, Link, useLocation } from 'react-router-dom';
import { supabase } from '../../utils/supabase';
import {
  LayoutDashboard, BellRing, Users, LogOut, Radio,
  ChevronRight, Loader2, Menu, X, ExternalLink, ShieldCheck,
  CheckCircle, AlertCircle, Info, Bell
} from 'lucide-react';
import AdminConfirmModal from '../../components/Admin/AdminConfirmModal';
import './adminTheme.css';

export default function AdminLayout() {
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  
  // Real-time broadcast telemetry for Header Beacon
  const [liveTelemetry, setLiveTelemetry] = useState({ isLive: false, viewers: 0, title: '' });

  // Global Toast Stack
  const [toast, setToast] = useState(null);
  const toastTimeoutRef = useRef(null);

  // Global Confirm Modal state
  const [confirmModal, setConfirmModal] = useState({
    isOpen: false,
    title: '',
    message: '',
    danger: false,
    confirmText: 'Confirm',
    cancelText: 'Cancel',
    onConfirm: null,
    loading: false,
  });

  const location = useLocation();

  const showToast = useCallback((type, message) => {
    if (toastTimeoutRef.current) clearTimeout(toastTimeoutRef.current);
    setToast({ type, message, id: Date.now() });
    toastTimeoutRef.current = setTimeout(() => {
      setToast(null);
    }, 4000);
  }, []);

  const openConfirmModal = useCallback(({
    title = 'Confirm Action',
    message = 'Are you sure you want to proceed?',
    danger = false,
    confirmText = 'Confirm',
    cancelText = 'Cancel',
    onConfirm,
  }) => {
    setConfirmModal({
      isOpen: true,
      title,
      message,
      danger,
      confirmText,
      cancelText,
      loading: false,
      onConfirm: async () => {
        try {
          setConfirmModal((prev) => ({ ...prev, loading: true }));
          await onConfirm?.();
          setConfirmModal((prev) => ({ ...prev, isOpen: false, loading: false }));
        } catch (err) {
          setConfirmModal((prev) => ({ ...prev, loading: false }));
          showToast('error', err.message || 'Operation failed');
        }
      },
    });
  }, [showToast]);

  const closeConfirmModal = useCallback(() => {
    setConfirmModal((prev) => ({ ...prev, isOpen: false, loading: false }));
  }, []);

  // Check user authentication and roles
  useEffect(() => {
    checkAdmin();
  }, [location.pathname]);

  const checkAdmin = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        setIsAdmin(false);
        setLoading(false);
        return;
      }

      const { data: roleData, error } = await supabase
        .from('user_roles')
        .select('role')
        .eq('id', session.user.id)
        .single();

      if (error || !roleData) {
        setIsAdmin(false);
      } else if (roleData.role === 'superadmin' || roleData.role === 'editor') {
        setIsAdmin(true);
        setUserRole(roleData.role);

        // Fetch optional profile details
        const { data: profile } = await supabase
          .from('profiles')
          .select('name, kalyanamitta_id')
          .eq('id', session.user.id)
          .maybeSingle();

        setUserProfile(profile || { kalyanamitta_id: session.user.email?.split('@')[0] });
      } else {
        setIsAdmin(false);
      }
    } catch {
      setIsAdmin(false);
    } finally {
      setLoading(false);
    }
  };

  // Real-time live broadcast telemetry subscription
  useEffect(() => {
    // 1. Initial fetch
    supabase
      .from('live_broadcast')
      .select('is_live, sermon_title')
      .eq('id', 1)
      .single()
      .then(({ data }) => {
        if (data) {
          setLiveTelemetry((prev) => ({
            ...prev,
            isLive: data.is_live,
            title: data.sermon_title || '',
          }));
        }
      });

    // 2. Real-time broadcast status change
    const broadcastSub = supabase
      .channel('admin_global_broadcast_status')
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'live_broadcast', filter: 'id=eq.1' },
        (payload) => {
          if (payload.new) {
            setLiveTelemetry((prev) => ({
              ...prev,
              isLive: payload.new.is_live,
              title: payload.new.sermon_title || '',
            }));
          }
        }
      )
      .subscribe();

    // 3. Real-time viewer presence count
    const presenceChannel = supabase.channel('live_broadcast_presence');
    presenceChannel
      .on('presence', { event: 'sync' }, () => {
        const state = presenceChannel.presenceState();
        let total = 0;
        for (const key in state) {
          total += state[key]?.length || 1;
        }
        setLiveTelemetry((prev) => ({ ...prev, viewers: total }));
      })
      .subscribe();

    return () => {
      supabase.removeChannel(broadcastSub);
      supabase.removeChannel(presenceChannel);
    };
  }, []);

  const handleLogout = async () => {
    openConfirmModal({
      title: 'Sign Out of Operations Portal',
      message: 'Are you sure you want to end your administrative session?',
      confirmText: 'Sign Out',
      danger: true,
      onConfirm: async () => {
        await supabase.auth.signOut();
        window.location.href = '/portal-ops/login';
      },
    });
  };

  if (loading) {
    return (
      <div
        className="admin-portal-root"
        style={{
          height: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '16px',
        }}
      >
        <div style={{ position: 'relative' }}>
          <Loader2 size={36} color="var(--adm-primary)" className="adm-spin" />
        </div>
        <div style={{ fontSize: '0.95rem', color: 'var(--adm-text-muted)', fontWeight: 500 }}>
          Verifying security clearance…
        </div>
      </div>
    );
  }

  if (!isAdmin) return <Navigate to="/portal-ops/login" replace />;

  const navItems = [
    {
      name: 'Overview',
      path: '/portal-ops',
      icon: <LayoutDashboard size={19} />,
      exact: true,
    },
    {
      name: 'Live Studio',
      path: '/portal-ops/live',
      icon: <Radio size={19} />,
      badge: liveTelemetry.isLive ? 'LIVE' : null,
      badgeType: 'live',
    },
    {
      name: 'Notices & Sermons',
      path: '/portal-ops/notices',
      icon: <BellRing size={19} />,
    },
    ...(userRole === 'superadmin'
      ? [
          {
            name: 'Team & Access',
            path: '/portal-ops/team',
            icon: <Users size={19} />,
          },
        ]
      : []),
  ];

  const isActive = (item) =>
    item.exact ? location.pathname === item.path : location.pathname.startsWith(item.path);

  const SidebarContent = () => (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* Brand Header */}
      <div
        style={{
          padding: collapsed ? '22px 12px' : '22px 24px',
          borderBottom: '1px solid var(--adm-border)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: collapsed ? 'center' : 'space-between',
          gap: '12px',
        }}
      >
        {!collapsed && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '10px',
                background: 'linear-gradient(135deg, var(--adm-primary) 0%, #6b0f0f 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#fff',
                fontWeight: 900,
                fontSize: '1rem',
                boxShadow: '0 4px 14px var(--adm-primary-glow)',
                flexShrink: 0,
              }}
            >
              KM
            </div>
            <div>
              <div
                style={{
                  fontSize: '0.98rem',
                  fontWeight: 800,
                  color: 'var(--adm-text-main)',
                  letterSpacing: '1px',
                  fontFamily: 'var(--adm-font-sans)',
                  lineHeight: 1.2,
                }}
              >
                PORTAL OPS
              </div>
              <div
                style={{
                  fontSize: '0.68rem',
                  color: 'var(--adm-text-muted)',
                  textTransform: 'uppercase',
                  letterSpacing: '1.5px',
                  fontWeight: 700,
                  marginTop: '2px',
                }}
              >
                {userRole === 'superadmin' ? 'Super Admin' : 'Editor'}
              </div>
            </div>
          </div>
        )}

        <button
          onClick={() => setCollapsed((c) => !c)}
          title={collapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
          className="adm-btn adm-btn-ghost"
          style={{ padding: '8px', borderRadius: '8px' }}
        >
          {collapsed ? <ChevronRight size={18} /> : <Menu size={18} />}
        </button>
      </div>

      {/* Nav List */}
      <nav
        style={{
          flex: 1,
          padding: '20px 12px',
          display: 'flex',
          flexDirection: 'column',
          gap: '6px',
        }}
      >
        {navItems.map((item) => {
          const active = isActive(item);
          return (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => setMobileOpen(false)}
              title={collapsed ? item.name : undefined}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: collapsed ? 0 : '14px',
                justifyContent: collapsed ? 'center' : 'flex-start',
                padding: collapsed ? '12px' : '11px 16px',
                borderRadius: '12px',
                textDecoration: 'none',
                color: active ? '#fff' : 'var(--adm-text-muted)',
                background: active ? 'var(--adm-primary-surface)' : 'transparent',
                border: `1px solid ${active ? 'rgba(163, 28, 28, 0.4)' : 'transparent'}`,
                fontWeight: active ? 600 : 500,
                fontSize: '0.92rem',
                transition: 'all 0.15s ease',
                position: 'relative',
              }}
              onMouseEnter={(e) => {
                if (!active) {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.04)';
                  e.currentTarget.style.color = '#fff';
                }
              }}
              onMouseLeave={(e) => {
                if (!active) {
                  e.currentTarget.style.background = 'transparent';
                  e.currentTarget.style.color = 'var(--adm-text-muted)';
                }
              }}
            >
              <span
                style={{
                  color: active ? 'var(--adm-primary)' : 'inherit',
                  display: 'flex',
                  alignItems: 'center',
                  flexShrink: 0,
                }}
              >
                {item.icon}
              </span>

              {!collapsed && <span>{item.name}</span>}

              {/* Status Badge */}
              {!collapsed && item.badge && (
                <span
                  className="adm-badge adm-badge-live"
                  style={{
                    marginLeft: 'auto',
                    padding: '2px 8px',
                    fontSize: '0.65rem',
                  }}
                >
                  <span
                    style={{
                      width: 5,
                      height: 5,
                      borderRadius: '50%',
                      background: 'currentColor',
                      display: 'inline-block',
                    }}
                    className="adm-pulse"
                  />
                  {item.badge}
                </span>
              )}

              {/* Collapsed dot for live */}
              {collapsed && item.badge && (
                <span
                  style={{
                    position: 'absolute',
                    top: '8px',
                    right: '8px',
                    width: '7px',
                    height: '7px',
                    borderRadius: '50%',
                    background: 'var(--adm-live)',
                    boxShadow: '0 0 8px var(--adm-live)',
                  }}
                  className="adm-pulse"
                />
              )}
            </Link>
          );
        })}
      </nav>

      {/* User & Sign Out Footer */}
      <div
        style={{
          padding: '16px 14px',
          borderTop: '1px solid var(--adm-border)',
          display: 'flex',
          flexDirection: 'column',
          gap: '8px',
        }}
      >
        {!collapsed && (
          <div
            style={{
              padding: '10px 12px',
              borderRadius: '10px',
              background: 'rgba(255, 255, 255, 0.03)',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
            }}
          >
            <div
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '8px',
                background: 'rgba(255, 255, 255, 0.08)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '0.85rem',
                fontWeight: 700,
                color: '#fff',
                flexShrink: 0,
              }}
            >
              {userProfile?.kalyanamitta_id?.[0]?.toUpperCase() || 'A'}
            </div>
            <div style={{ flex: 1, minWidth: 0, overflow: 'hidden' }}>
              <div
                style={{
                  fontSize: '0.82rem',
                  fontWeight: 600,
                  color: 'var(--adm-text-main)',
                  whiteSpace: 'nowrap',
                  textOverflow: 'ellipsis',
                  overflow: 'hidden',
                }}
              >
                {userProfile?.name || userProfile?.kalyanamitta_id || 'Administrator'}
              </div>
              <div
                style={{
                  fontSize: '0.7rem',
                  color: 'var(--adm-text-dim)',
                  whiteSpace: 'nowrap',
                }}
              >
                {userRole?.toUpperCase()}
              </div>
            </div>
          </div>
        )}

        <button
          onClick={handleLogout}
          title={collapsed ? 'Sign Out' : undefined}
          className="adm-btn adm-btn-ghost"
          style={{
            width: '100%',
            justifyContent: collapsed ? 'center' : 'flex-start',
            padding: collapsed ? '12px' : '10px 14px',
            borderRadius: '10px',
            color: 'var(--adm-text-muted)',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = '#ef4444';
            e.currentTarget.style.background = 'rgba(239, 68, 68, 0.08)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = 'var(--adm-text-muted)';
            e.currentTarget.style.background = 'transparent';
          }}
        >
          <LogOut size={18} />
          {!collapsed && <span>Sign out</span>}
        </button>
      </div>
    </div>
  );

  const sidebarW = collapsed ? '68px' : '260px';

  return (
    <div
      className="admin-portal-root"
      style={{
        display: 'flex',
        height: '100vh',
        maxHeight: '100vh',
        width: '100vw',
        overflow: 'hidden',
      }}
    >
      {/* ── Global Floating Toast ── */}
      {toast && (
        <div
          style={{
            position: 'fixed',
            top: '20px',
            right: '24px',
            zIndex: 10001,
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            background:
              toast.type === 'success'
                ? '#064e3b'
                : toast.type === 'error'
                ? '#7f1d1d'
                : '#1e293b',
            border: `1px solid ${
              toast.type === 'success'
                ? 'rgba(16, 185, 129, 0.4)'
                : toast.type === 'error'
                ? 'rgba(239, 68, 68, 0.4)'
                : 'rgba(255, 255, 255, 0.15)'
            }`,
            color: '#fff',
            padding: '12px 18px',
            borderRadius: '12px',
            boxShadow: '0 12px 36px rgba(0,0,0,0.5)',
            backdropFilter: 'blur(10px)',
            fontSize: '0.9rem',
            fontWeight: 500,
            maxWidth: '400px',
            animation: 'admModalPop 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
          }}
        >
          {toast.type === 'success' ? (
            <CheckCircle size={18} color="#34d399" />
          ) : toast.type === 'error' ? (
            <AlertCircle size={18} color="#f87171" />
          ) : (
            <Info size={18} color="#60a5fa" />
          )}
          <span style={{ flex: 1 }}>{toast.message}</span>
          <button
            onClick={() => setToast(null)}
            style={{
              background: 'transparent',
              border: 'none',
              color: 'rgba(255,255,255,0.6)',
              cursor: 'pointer',
              padding: '2px',
            }}
          >
            <X size={16} />
          </button>
        </div>
      )}

      {/* ── Global Confirm Modal ── */}
      <AdminConfirmModal
        isOpen={confirmModal.isOpen}
        title={confirmModal.title}
        message={confirmModal.message}
        danger={confirmModal.danger}
        confirmText={confirmModal.confirmText}
        cancelText={confirmModal.cancelText}
        loading={confirmModal.loading}
        onConfirm={confirmModal.onConfirm}
        onCancel={closeConfirmModal}
      />

      {/* ── Desktop Sidebar ── */}
      <aside
        style={{
          width: sidebarW,
          flexShrink: 0,
          background: 'var(--adm-bg-surface)',
          borderRight: '1px solid var(--adm-border)',
          display: 'flex',
          flexDirection: 'column',
          height: '100vh',
          transition: 'width 0.22s cubic-bezier(0.16, 1, 0.3, 1)',
          overflowY: 'auto',
          overflowX: 'hidden',
          zIndex: 40,
        }}
        className="admin-scroll"
      >
        <SidebarContent />
      </aside>

      {/* ── Mobile Overlay & Drawer ── */}
      {mobileOpen && (
        <>
          <div
            onClick={() => setMobileOpen(false)}
            style={{
              position: 'fixed',
              inset: 0,
              background: 'rgba(0,0,0,0.7)',
              backdropFilter: 'blur(4px)',
              zIndex: 998,
            }}
          />
          <aside
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              height: '100vh',
              width: '260px',
              background: 'var(--adm-bg-surface)',
              borderRight: '1px solid var(--adm-border)',
              zIndex: 999,
              display: 'flex',
              flexDirection: 'column',
              overflowY: 'auto',
              boxShadow: '0 0 50px rgba(0,0,0,0.8)',
            }}
            className="admin-scroll"
          >
            <SidebarContent />
          </aside>
        </>
      )}

      {/* ── Main Content Container ── */}
      <div
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          height: '100vh',
          minWidth: 0,
          overflow: 'hidden',
          background: 'var(--adm-bg-canvas)',
        }}
      >
        {/* Top Header Bar */}
        <header
          style={{
            height: '64px',
            flexShrink: 0,
            borderBottom: '1px solid var(--adm-border)',
            display: 'flex',
            alignItems: 'center',
            padding: '0 clamp(16px, 2.5vw, 32px)',
            gap: '16px',
            background: 'var(--adm-bg-surface)',
            zIndex: 30,
          }}
        >
          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileOpen((o) => !o)}
            className="adm-btn adm-btn-ghost km-mobile-hamburger"
            style={{ padding: '6px', display: 'none' }}
          >
            <Menu size={20} />
          </button>

          {/* Breadcrumb / Current View */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              fontSize: '0.88rem',
              color: 'var(--adm-text-dim)',
            }}
          >
            <span style={{ fontWeight: 500 }}>Portal</span>
            <ChevronRight size={14} color="var(--adm-text-dim)" />
            <span style={{ color: 'var(--adm-text-main)', fontWeight: 600 }}>
              {navItems.find((n) => isActive(n))?.name ?? 'Overview'}
            </span>
          </div>

          {/* Right Header Utilities */}
          <div
            style={{
              marginLeft: 'auto',
              display: 'flex',
              alignItems: 'center',
              gap: '14px',
            }}
          >
            {/* Live Stream Telemetry Beacon */}
            <Link
              to="/portal-ops/live"
              title="Jump to Live Broadcast Studio"
              style={{
                textDecoration: 'none',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '6px 12px',
                borderRadius: '20px',
                background: liveTelemetry.isLive
                  ? 'var(--adm-live-surface)'
                  : 'rgba(255, 255, 255, 0.04)',
                border: `1px solid ${
                  liveTelemetry.isLive ? 'rgba(239, 68, 68, 0.35)' : 'var(--adm-border)'
                }`,
                fontSize: '0.78rem',
                fontWeight: 700,
                color: liveTelemetry.isLive ? 'var(--adm-live)' : 'var(--adm-text-dim)',
                transition: 'all 0.2s',
              }}
            >
              <div
                style={{
                  width: 7,
                  height: 7,
                  borderRadius: '50%',
                  background: liveTelemetry.isLive ? 'var(--adm-live)' : '#71717a',
                  boxShadow: liveTelemetry.isLive ? '0 0 10px var(--adm-live)' : 'none',
                }}
                className={liveTelemetry.isLive ? 'adm-pulse' : ''}
              />
              {liveTelemetry.isLive ? (
                <>
                  <span>LIVE NOW</span>
                  <span style={{ color: 'var(--adm-text-main)', fontWeight: 500 }}>
                    ({liveTelemetry.viewers} {liveTelemetry.viewers === 1 ? 'viewer' : 'viewers'})
                  </span>
                </>
              ) : (
                <span>BROADCAST OFFLINE</span>
              )}
            </Link>

            {/* View Public Website */}
            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="adm-btn adm-btn-secondary"
              style={{
                padding: '7px 14px',
                fontSize: '0.82rem',
                borderRadius: '8px',
              }}
              title="Open public website in a new tab"
            >
              <ExternalLink size={14} />
              <span className="km-hide-mobile">View Site</span>
            </a>

            {/* Security clearance badge */}
            <div
              className="adm-badge adm-badge-success km-hide-mobile"
              style={{ padding: '5px 12px' }}
            >
              <ShieldCheck size={13} />
              <span>SECURE</span>
            </div>
          </div>
        </header>

        {/* Dynamic Outlet Main Area */}
        <main
          className="admin-scroll"
          style={{
            flex: 1,
            height: 'calc(100vh - 64px)',
            overflowY: 'auto',
            overflowX: 'hidden',
            padding: '32px clamp(20px, 3.5vw, 44px) 60px',
            scrollBehavior: 'smooth',
          }}
        >
          <Outlet
            context={{
              userRole,
              userProfile,
              liveTelemetry,
              showToast,
              openConfirmModal,
            }}
          />
        </main>
      </div>

      <style>{`
        /* Mobile responsive adjustments */
        @media (max-width: 768px) {
          .km-mobile-hamburger { display: flex !important; }
          .km-hide-mobile { display: none !important; }
        }
      `}</style>
    </div>
  );
}
