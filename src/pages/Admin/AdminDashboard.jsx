import React from 'react';
import { useOutletContext, Link } from 'react-router-dom';
import { BellRing, Users, Activity } from 'lucide-react';

export default function AdminDashboard() {
  const { userRole } = useOutletContext();

  return (
    <div>
      <h1 style={{ fontSize: '2.5rem', fontFamily: 'var(--font-serif)', fontWeight: '400', marginBottom: '8px' }}>Welcome back.</h1>
      <p style={{ color: 'var(--text-muted)', marginBottom: '48px', fontSize: '1.1rem' }}>Manage your website content securely from here.</p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
        
        <div style={{ background: 'var(--bg-main)', border: '1px solid var(--glass-border)', padding: '32px', borderRadius: '4px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
            <div style={{ padding: '12px', background: 'rgba(212, 175, 55, 0.1)', color: 'var(--primary)', borderRadius: '50%' }}>
              <BellRing size={24} />
            </div>
            <h3 style={{ fontSize: '1.2rem', margin: 0, fontFamily: 'var(--font-serif)' }}>Notices & Events</h3>
          </div>
          <p style={{ color: 'var(--text-muted)', marginBottom: '24px', lineHeight: 1.5 }}>Publish new live sessions, upcoming sermons, and archive past recordings.</p>
          <Link to="/portal-ops/notices" style={{ display: 'inline-block', padding: '10px 20px', background: 'var(--text-main)', color: 'var(--bg-main)', textDecoration: 'none', fontSize: '0.9rem', fontWeight: '600' }}>Manage Notices</Link>
        </div>

        {userRole === 'superadmin' && (
          <div style={{ background: 'var(--bg-main)', border: '1px solid var(--glass-border)', padding: '32px', borderRadius: '4px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
              <div style={{ padding: '12px', background: 'rgba(140, 21, 21, 0.1)', color: '#8c1515', borderRadius: '50%' }}>
                <Users size={24} />
              </div>
              <h3 style={{ fontSize: '1.2rem', margin: 0, fontFamily: 'var(--font-serif)' }}>Team Management</h3>
            </div>
            <p style={{ color: 'var(--text-muted)', marginBottom: '24px', lineHeight: 1.5 }}>Add new admins, assign roles, and control who has access to this portal.</p>
            <Link to="/portal-ops/team" style={{ display: 'inline-block', padding: '10px 20px', background: 'var(--text-main)', color: 'var(--bg-main)', textDecoration: 'none', fontSize: '0.9rem', fontWeight: '600' }}>Manage Team</Link>
          </div>
        )}

      </div>
    </div>
  );
}
