import React, { useState, useEffect } from 'react';
import { useOutletContext, Link } from 'react-router-dom';
import { BellRing, Users, Database, ShieldCheck, ArrowRight, Loader2 } from 'lucide-react';
import { supabase } from '../../utils/supabase';

export default function AdminDashboard() {
  const { userRole } = useOutletContext();
  const [stats, setStats] = useState({ notices: 0, loading: true });

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const { count } = await supabase.from('notices').select('*', { count: 'exact', head: true });
      setStats({ notices: count || 0, loading: false });
    } catch (err) {
      setStats({ notices: 0, loading: false });
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '48px' }}>
        <div>
          <h1 style={{ fontSize: '2.5rem', fontFamily: 'var(--font-serif)', fontWeight: '400', marginBottom: '8px' }}>Command Center</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem' }}>Manage your website content securely from here.</p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'rgba(46, 125, 50, 0.1)', color: '#2e7d32', padding: '8px 16px', borderRadius: '30px', fontSize: '0.85rem', fontWeight: 'bold' }}>
          <ShieldCheck size={16} /> SYSTEM SECURE
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
        
        <div style={{ background: 'var(--bg-main)', border: '1px solid var(--glass-border)', padding: '32px', borderRadius: '4px', position: 'relative', overflow: 'hidden' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div style={{ padding: '12px', background: 'rgba(212, 175, 55, 0.1)', color: 'var(--primary)', borderRadius: '50%' }}>
                <BellRing size={24} />
              </div>
              <h3 style={{ fontSize: '1.2rem', margin: 0, fontFamily: 'var(--font-serif)' }}>Notices & Events</h3>
            </div>
            {stats.loading ? <Loader2 size={24} className="spin" color="var(--text-muted)" /> : <span style={{ fontSize: '2rem', fontFamily: 'var(--font-serif)', color: 'var(--primary)' }}>{stats.notices}</span>}
          </div>
          <p style={{ color: 'var(--text-muted)', marginBottom: '24px', lineHeight: 1.5, minHeight: '45px' }}>Publish new live sessions, upcoming sermons, and archive past recordings.</p>
          <Link to="/portal-ops/notices" style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 20px', background: 'var(--text-main)', color: 'var(--bg-main)', textDecoration: 'none', fontSize: '0.9rem', fontWeight: '600', width: 'fit-content' }}>
            Manage Notices <ArrowRight size={16} />
          </Link>
        </div>

        {userRole === 'superadmin' && (
          <div style={{ background: 'var(--bg-main)', border: '1px solid var(--glass-border)', padding: '32px', borderRadius: '4px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
              <div style={{ padding: '12px', background: 'rgba(140, 21, 21, 0.1)', color: '#8c1515', borderRadius: '50%' }}>
                <Users size={24} />
              </div>
              <h3 style={{ fontSize: '1.2rem', margin: 0, fontFamily: 'var(--font-serif)' }}>Team Management</h3>
            </div>
            <p style={{ color: 'var(--text-muted)', marginBottom: '24px', lineHeight: 1.5, minHeight: '45px' }}>Add new admins, assign roles, and control who has access to this portal.</p>
            <Link to="/portal-ops/team" style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 20px', background: 'var(--text-main)', color: 'var(--bg-main)', textDecoration: 'none', fontSize: '0.9rem', fontWeight: '600', width: 'fit-content' }}>
              Manage Team <ArrowRight size={16} />
            </Link>
          </div>
        )}

      </div>
      <style>{`
        .spin { animation: spin 1s linear infinite; }
        @keyframes spin { 100% { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}
