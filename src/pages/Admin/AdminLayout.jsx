import React, { useEffect, useState } from 'react';
import { Outlet, Navigate, Link, useLocation } from 'react-router-dom';
import { supabase } from '../../utils/supabase';
import {
  LayoutDashboard, BellRing, Users, LogOut, Radio,
  ChevronRight, Loader2, Menu, X
} from 'lucide-react';

export default function AdminLayout() {
  const [loading, setLoading]   = useState(true);
  const [isAdmin, setIsAdmin]   = useState(false);
  const [userRole, setUserRole] = useState(null);
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  useEffect(() => { checkAdmin(); }, [location.pathname]);

  const checkAdmin = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) { setIsAdmin(false); setLoading(false); return; }

      const { data: roleData, error } = await supabase
        .from('user_roles').select('role').eq('id', session.user.id).single();

      if (error || !roleData) {
        setIsAdmin(false);
      } else if (roleData.role === 'superadmin' || roleData.role === 'editor') {
        setIsAdmin(true);
        setUserRole(roleData.role);
      } else {
        setIsAdmin(false);
      }
    } catch { setIsAdmin(false); }
    finally  { setLoading(false); }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = '/';
  };

  if (loading) {
    return (
      <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0d0d0f', color: '#fff', gap: '12px' }}>
        <Loader2 size={24} style={{ animation: 'spin 1s linear infinite' }} />
        <style>{`@keyframes spin{100%{transform:rotate(360deg)}}`}</style>
        <span style={{ fontSize: '0.95rem', color: '#666' }}>Verifying access…</span>
      </div>
    );
  }

  if (!isAdmin) return <Navigate to="/portal-ops/login" replace />;

  const navItems = [
    { name: 'Dashboard',      path: '/portal-ops',         icon: <LayoutDashboard size={18} />, exact: true },
    { name: 'Live Broadcast', path: '/portal-ops/live',    icon: <Radio size={18} /> },
    { name: 'Notices',        path: '/portal-ops/notices', icon: <BellRing size={18} /> },
    ...(userRole === 'superadmin'
      ? [{ name: 'Team', path: '/portal-ops/team', icon: <Users size={18} /> }]
      : [])
  ];

  const isActive = (item) =>
    item.exact ? location.pathname === item.path : location.pathname.startsWith(item.path);

  const SidebarContent = () => (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>

      {/* Logo */}
      <div style={{ padding: collapsed ? '24px 0' : '28px 24px', borderBottom: '1px solid rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', gap: '12px', justifyContent: collapsed ? 'center' : 'space-between' }}>
        {!collapsed && (
          <div>
            <div style={{ fontSize: '1rem', fontWeight: 800, color: '#fff', letterSpacing: '1.5px', fontFamily: 'var(--font-serif)' }}>KM PORTAL</div>
            <div style={{ fontSize: '0.68rem', color: '#8c1515', textTransform: 'uppercase', letterSpacing: '2px', fontWeight: 700, marginTop: '3px' }}>{userRole}</div>
          </div>
        )}
        <button
          onClick={() => setCollapsed(c => !c)}
          style={{ background: 'rgba(255,255,255,0.05)', border: 'none', color: '#888', cursor: 'pointer', padding: '8px', borderRadius: '8px', display: 'flex', transition: 'all 0.2s' }}
          onMouseEnter={e => e.currentTarget.style.color = '#fff'}
          onMouseLeave={e => e.currentTarget.style.color = '#888'}
        >
          {collapsed ? <ChevronRight size={16} /> : <Menu size={16} />}
        </button>
      </div>

      {/* Nav Items */}
      <nav style={{ flex: 1, padding: '20px 12px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
        {navItems.map(item => {
          const active = isActive(item);
          return (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => setMobileOpen(false)}
              title={collapsed ? item.name : undefined}
              style={{
                display: 'flex', alignItems: 'center',
                gap: collapsed ? 0 : '12px',
                justifyContent: collapsed ? 'center' : 'flex-start',
                padding: collapsed ? '12px' : '11px 14px',
                borderRadius: '10px',
                textDecoration: 'none',
                color: active ? '#fff' : '#888',
                background: active ? 'rgba(140,21,21,0.25)' : 'transparent',
                border: `1px solid ${active ? 'rgba(140,21,21,0.4)' : 'transparent'}`,
                fontWeight: active ? 600 : 400,
                fontSize: '0.9rem',
                transition: 'all 0.15s',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
              }}
              onMouseEnter={e => { if (!active) { e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; e.currentTarget.style.color = '#ccc'; }}}
              onMouseLeave={e => { if (!active) { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#888'; }}}
            >
              <span style={{ color: active ? '#c0392b' : 'inherit', flexShrink: 0 }}>{item.icon}</span>
              {!collapsed && item.name}
              {active && !collapsed && (
                <div style={{ marginLeft: 'auto', width: 6, height: 6, borderRadius: '50%', background: '#c0392b', flexShrink: 0 }} />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Logout */}
      <div style={{ padding: '16px 12px', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
        <button
          onClick={handleLogout}
          title={collapsed ? 'Logout' : undefined}
          style={{
            display: 'flex', alignItems: 'center',
            gap: collapsed ? 0 : '10px',
            justifyContent: collapsed ? 'center' : 'flex-start',
            width: '100%', background: 'transparent', border: 'none',
            color: '#666', cursor: 'pointer', padding: collapsed ? '12px' : '10px 14px',
            borderRadius: '10px', fontSize: '0.9rem',
            transition: 'all 0.2s',
          }}
          onMouseEnter={e => { e.currentTarget.style.background = 'rgba(220,38,38,0.08)'; e.currentTarget.style.color = '#ef4444'; }}
          onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#666'; }}
        >
          <LogOut size={18} />
          {!collapsed && 'Sign out'}
        </button>
      </div>
    </div>
  );

  const sidebarW = collapsed ? '64px' : '240px';

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#0d0d0f', color: '#e5e5e5', fontFamily: 'system-ui, -apple-system, sans-serif' }}>

      {/* ── Desktop Sidebar ── */}
      <aside style={{
        width: sidebarW, flexShrink: 0,
        background: '#111113', borderRight: '1px solid rgba(255,255,255,0.06)',
        display: 'flex', flexDirection: 'column',
        position: 'sticky', top: 0, height: '100vh',
        transition: 'width 0.25s cubic-bezier(0.4,0,0.2,1)',
        overflow: 'hidden',
      }}>
        <SidebarContent />
      </aside>

      {/* ── Mobile Overlay ── */}
      {mobileOpen && (
        <>
          <div
            onClick={() => setMobileOpen(false)}
            style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', zIndex: 998 }}
          />
          <aside style={{
            position: 'fixed', top: 0, left: 0, height: '100vh', width: '240px',
            background: '#111113', borderRight: '1px solid rgba(255,255,255,0.06)',
            zIndex: 999, display: 'flex', flexDirection: 'column',
          }}>
            <SidebarContent />
          </aside>
        </>
      )}

      {/* ── Main Content ── */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>

        {/* Top Bar */}
        <header style={{
          height: '60px', borderBottom: '1px solid rgba(255,255,255,0.06)',
          display: 'flex', alignItems: 'center', padding: '0 28px',
          gap: '16px', background: '#111113', position: 'sticky', top: 0, zIndex: 100,
        }}>
          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileOpen(o => !o)}
            style={{ background: 'none', border: 'none', color: '#888', cursor: 'pointer', display: 'none', padding: '4px' }}
            className="km-mobile-hamburger"
          >
            <Menu size={20} />
          </button>

          {/* Breadcrumb */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', color: '#555' }}>
            <span>Portal</span>
            <ChevronRight size={14} />
            <span style={{ color: '#ccc', fontWeight: 500 }}>
              {navItems.find(n => isActive(n))?.name ?? 'Dashboard'}
            </span>
          </div>

          <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'rgba(22,163,74,0.1)', color: '#4ade80', border: '1px solid rgba(22,163,74,0.2)', padding: '4px 10px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.5px' }}>
              <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#4ade80' }} />
              SECURE
            </div>
            <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'rgba(140,21,21,0.2)', border: '1px solid rgba(140,21,21,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: 700, color: '#c0392b' }}>
              {userRole?.[0]?.toUpperCase()}
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main style={{ flex: 1, padding: '36px 36px', overflowY: 'auto' }}>
          <Outlet context={{ userRole }} />
        </main>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .km-mobile-hamburger { display: flex !important; }
        }
      `}</style>
    </div>
  );
}
