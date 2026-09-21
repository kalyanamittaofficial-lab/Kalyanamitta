import React, { useEffect, useState } from 'react';
import { Outlet, Navigate, Link, useLocation } from 'react-router-dom';
import { supabase } from '../../utils/supabase';
import { LayoutDashboard, BellRing, Users, LogOut, Settings } from 'lucide-react';

export default function AdminLayout() {
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const location = useLocation();

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

      // Check if user has an admin role in user_roles table
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
      } else {
        setIsAdmin(false);
      }
    } catch (err) {
      console.error('Auth check error:', err);
      setIsAdmin(false);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = '/';
  };

  if (loading) {
    return <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-main)', color: 'var(--text-main)' }}>Loading Secure Portal...</div>;
  }

  // If not admin, redirect to dedicated admin login
  if (!isAdmin) {
    return <Navigate to="/portal-ops/login" replace />;
  }

  const navItems = [
    { name: 'Dashboard', path: '/portal-ops', icon: <LayoutDashboard size={18} /> },
    { name: 'Manage Notices', path: '/portal-ops/notices', icon: <BellRing size={18} /> },
    ...(userRole === 'superadmin' ? [{ name: 'Team Management', path: '/portal-ops/team', icon: <Users size={18} /> }] : [])
  ];

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg-secondary)', color: 'var(--text-main)' }}>
      {/* Sidebar */}
      <div style={{ width: '280px', background: 'var(--bg-main)', borderRight: '1px solid var(--glass-border)', display: 'flex', flexDirection: 'column' }}>
        <div style={{ padding: '32px 24px', borderBottom: '1px solid var(--glass-border)' }}>
          <h2 style={{ fontSize: '1.2rem', fontFamily: 'var(--font-serif)', fontWeight: '600', margin: 0, letterSpacing: '1px' }}>KM PORTAL</h2>
          <span style={{ fontSize: '0.75rem', color: 'var(--primary)', textTransform: 'uppercase', fontWeight: '700', letterSpacing: '2px' }}>{userRole}</span>
        </div>
        
        <div style={{ padding: '24px 16px', flex: 1, display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '12px 16px',
                borderRadius: '6px',
                textDecoration: 'none',
                color: location.pathname === item.path ? 'var(--bg-main)' : 'var(--text-main)',
                backgroundColor: location.pathname === item.path ? 'var(--text-main)' : 'transparent',
                fontFamily: 'var(--font-sinhala)',
                fontSize: '0.95rem',
                fontWeight: location.pathname === item.path ? '600' : '400',
                transition: 'all 0.2s'
              }}
            >
              {item.icon} {item.name}
            </Link>
          ))}
        </div>

        <div style={{ padding: '24px', borderTop: '1px solid var(--glass-border)' }}>
          <button 
            onClick={handleLogout}
            style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'transparent', border: 'none', color: '#8c1515', cursor: 'pointer', fontFamily: 'var(--font-sinhala)', fontSize: '0.95rem', fontWeight: '500' }}
          >
            <LogOut size={18} /> Logout
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div style={{ flex: 1, padding: '40px', overflowY: 'auto' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <Outlet context={{ userRole }} />
        </div>
      </div>
    </div>
  );
}
