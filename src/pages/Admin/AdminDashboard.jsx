import React, { useState, useEffect } from 'react';
import { useOutletContext, Link } from 'react-router-dom';
import {
  BellRing, Users, Radio, ArrowUpRight,
  TrendingUp, Activity, Loader2, ShieldCheck,
  Clock, Zap
} from 'lucide-react';
import { supabase } from '../../utils/supabase';

function StatCard({ icon, label, value, loading, color = '#c0392b' }) {
  return (
    <div style={{
      background: '#18181b', border: '1px solid rgba(255,255,255,0.06)',
      borderRadius: '14px', padding: '24px',
      display: 'flex', flexDirection: 'column', gap: '12px',
      transition: 'border-color 0.2s',
    }}
      onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)'}
      onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)'}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ padding: '8px', background: `${color}18`, borderRadius: '8px', color }}>
          {icon}
        </div>
        <TrendingUp size={14} color="#444" />
      </div>
      <div>
        <div style={{ fontSize: '2rem', fontWeight: 800, color: '#fff', lineHeight: 1 }}>
          {loading ? <Loader2 size={20} style={{ animation: 'spin 1s linear infinite', opacity: 0.4 }} /> : value}
        </div>
        <div style={{ fontSize: '0.8rem', color: '#555', marginTop: '6px', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.5px' }}>{label}</div>
      </div>
    </div>
  );
}

function QuickLink({ to, icon, title, description, badge, color = '#c0392b' }) {
  const [hovered, setHovered] = useState(false);
  return (
    <Link
      to={to}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        textDecoration: 'none',
        display: 'flex', flexDirection: 'column', gap: '16px',
        background: hovered ? '#1e1e22' : '#18181b',
        border: `1px solid ${hovered ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.06)'}`,
        borderRadius: '14px', padding: '24px',
        transition: 'all 0.2s', cursor: 'pointer',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ padding: '10px', background: `${color}15`, borderRadius: '10px', color, flexShrink: 0 }}>
            {icon}
          </div>
          <div>
            <div style={{ color: '#fff', fontWeight: 700, fontSize: '0.95rem' }}>{title}</div>
            {badge && (
              <div style={{ marginTop: '4px', display: 'inline-flex', alignItems: 'center', gap: '5px', background: 'rgba(220,38,38,0.12)', color: '#ef4444', fontSize: '0.7rem', fontWeight: 700, padding: '2px 8px', borderRadius: '20px', letterSpacing: '0.5px' }}>
                <div style={{ width: 5, height: 5, borderRadius: '50%', background: '#ef4444' }} />
                {badge}
              </div>
            )}
          </div>
        </div>
        <ArrowUpRight size={16} color={hovered ? '#fff' : '#444'} style={{ transition: 'color 0.2s', flexShrink: 0 }} />
      </div>
      <p style={{ color: '#555', fontSize: '0.85rem', lineHeight: 1.6, margin: 0 }}>{description}</p>
    </Link>
  );
}

export default function AdminDashboard() {
  const { userRole } = useOutletContext();
  const [stats, setStats] = useState({ notices: 0, isLive: false, loading: true });
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    fetchStats();
    const tick = setInterval(() => setNow(new Date()), 60000);
    return () => clearInterval(tick);
  }, []);

  const fetchStats = async () => {
    try {
      const [{ count }, { data: liveData }] = await Promise.all([
        supabase.from('notices').select('*', { count: 'exact', head: true }),
        supabase.from('live_broadcast').select('is_live').eq('id', 1).single(),
      ]);
      setStats({ notices: count || 0, isLive: liveData?.is_live || false, loading: false });
    } catch {
      setStats(prev => ({ ...prev, loading: false }));
    }
  };

  const greeting = () => {
    const h = now.getHours();
    if (h < 12) return 'Good morning';
    if (h < 17) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <div style={{ maxWidth: '1000px' }}>

      {/* ── Header ── */}
      <div style={{ marginBottom: '40px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'rgba(22,163,74,0.08)', color: '#4ade80', border: '1px solid rgba(22,163,74,0.15)', padding: '4px 12px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.5px' }}>
            <ShieldCheck size={12} /> ACCESS GRANTED · {userRole?.toUpperCase()}
          </div>
        </div>
        <h1 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.5rem)', fontWeight: 800, color: '#fff', margin: '0 0 8px 0', letterSpacing: '-0.5px' }}>
          {greeting()}, Admin
        </h1>
        <p style={{ color: '#555', fontSize: '0.95rem', margin: 0 }}>
          {now.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
        </p>
      </div>

      {/* ── Stats Row ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '16px', marginBottom: '40px' }}>
        <StatCard
          icon={<BellRing size={18} />}
          label="Active Notices"
          value={stats.notices}
          loading={stats.loading}
          color="#f59e0b"
        />
        <StatCard
          icon={<Radio size={18} />}
          label="Broadcast Status"
          loading={stats.loading}
          color={stats.isLive ? '#ef4444' : '#555'}
          value={
            <span style={{ fontSize: '1rem', fontWeight: 700, color: stats.isLive ? '#ef4444' : '#666' }}>
              {stats.isLive ? '🔴 LIVE NOW' : '⚫ Offline'}
            </span>
          }
        />
        <StatCard
          icon={<Activity size={18} />}
          label="Portal Status"
          value={<span style={{ fontSize: '1rem', fontWeight: 700, color: '#4ade80' }}>Online</span>}
          color="#4ade80"
        />
        <StatCard
          icon={<Clock size={18} />}
          label="Local Time"
          value={<span style={{ fontSize: '1.1rem', fontWeight: 700 }}>{now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}</span>}
          color="#818cf8"
        />
      </div>

      {/* ── Divider ── */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
        <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#444', textTransform: 'uppercase', letterSpacing: '1px', whiteSpace: 'nowrap' }}>
          Quick Access
        </div>
        <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.06)' }} />
      </div>

      {/* ── Quick Access Cards ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '16px', marginBottom: '40px' }}>
        <QuickLink
          to="/portal-ops/live"
          icon={<Radio size={20} />}
          title="Live Broadcast"
          description="Start or schedule a live session. Set the YouTube video, speaker name, and sync watch-party playback for all viewers."
          badge={stats.isLive ? 'LIVE' : null}
          color="#ef4444"
        />
        <QuickLink
          to="/portal-ops/notices"
          icon={<BellRing size={20} />}
          title="Manage Notices"
          description="Publish upcoming events, dhamma programs, and announcements visible to all site visitors."
          color="#f59e0b"
        />
        {userRole === 'superadmin' && (
          <QuickLink
            to="/portal-ops/team"
            icon={<Users size={20} />}
            title="Team Management"
            description="Add or remove portal admins, assign editor and superadmin roles, and control access."
            color="#818cf8"
          />
        )}
      </div>

      {/* ── Getting Started tip ── */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(140,21,21,0.08) 0%, rgba(140,21,21,0.02) 100%)',
        border: '1px solid rgba(140,21,21,0.15)',
        borderRadius: '14px', padding: '22px 26px',
        display: 'flex', alignItems: 'flex-start', gap: '14px',
      }}>
        <Zap size={20} color="#c0392b" style={{ flexShrink: 0, marginTop: '2px' }} />
        <div>
          <div style={{ color: '#fff', fontWeight: 600, fontSize: '0.9rem', marginBottom: '6px' }}>Quick Start Guide</div>
          <ol style={{ color: '#555', fontSize: '0.85rem', margin: 0, paddingLeft: '18px', lineHeight: 2 }}>
            <li>Go to <strong style={{ color: '#888' }}>Live Broadcast</strong> → enter the YouTube Video ID, Sermon Title, and Speaker Name</li>
            <li>Optionally add a <strong style={{ color: '#888' }}>PDF download URL</strong> for the related sutta</li>
            <li>Click <strong style={{ color: '#888' }}>Save All Settings</strong>, then flip the <strong style={{ color: '#888' }}>Live switch ON</strong></li>
            <li>Visitors at <code style={{ color: '#c0392b', background: 'rgba(140,21,21,0.1)', padding: '1px 6px', borderRadius: '4px' }}>/live</code> will see the stream instantly</li>
          </ol>
        </div>
      </div>

      <style>{`@keyframes spin { 100% { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
