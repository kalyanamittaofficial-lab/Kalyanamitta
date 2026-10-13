import React, { useState, useEffect } from 'react';
import { useOutletContext, Link } from 'react-router-dom';
import {
  BellRing, Users, Radio, ArrowUpRight,
  TrendingUp, Activity, Loader2, ShieldCheck,
  Clock, Zap, ExternalLink, Copy, Calendar,
  CheckCircle2, Play, Plus, Video
} from 'lucide-react';
import { supabase } from '../../utils/supabase';

function StatCard({ icon, label, value, loading, badge, badgeType = 'neutral' }) {
  return (
    <div className="adm-card" style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div
          style={{
            padding: '10px',
            background: 'rgba(255, 255, 255, 0.05)',
            borderRadius: '10px',
            color: 'var(--adm-text-main)',
            display: 'flex',
          }}
        >
          {icon}
        </div>
        {badge && (
          <span className={`adm-badge adm-badge-${badgeType}`}>
            {badge}
          </span>
        )}
      </div>

      <div>
        <div
          style={{
            fontSize: '1.9rem',
            fontWeight: 800,
            color: 'var(--adm-text-main)',
            lineHeight: 1.1,
            letterSpacing: '-0.5px',
          }}
        >
          {loading ? (
            <Loader2 size={22} className="adm-spin" style={{ opacity: 0.4 }} />
          ) : (
            value
          )}
        </div>
        <div
          style={{
            fontSize: '0.8rem',
            color: 'var(--adm-text-muted)',
            marginTop: '6px',
            fontWeight: 600,
            textTransform: 'uppercase',
            letterSpacing: '0.6px',
          }}
        >
          {label}
        </div>
      </div>
    </div>
  );
}

export default function AdminDashboard() {
  const { userRole, userProfile, liveTelemetry, showToast } = useOutletContext();
  const [stats, setStats] = useState({
    noticesCount: 0,
    teamCount: 0,
    broadcast: null,
    recentNotices: [],
    loading: true,
  });
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    fetchDashboardData();
    const tick = setInterval(() => setNow(new Date()), 60000);
    return () => clearInterval(tick);
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [
        { count: noticesCount },
        { count: teamCount },
        { data: broadcastData },
        { data: noticesList },
      ] = await Promise.all([
        supabase.from('notices').select('*', { count: 'exact', head: true }),
        supabase.from('user_roles').select('*', { count: 'exact', head: true }),
        supabase.from('live_broadcast').select('*').eq('id', 1).single(),
        supabase.from('notices').select('*').order('date', { ascending: false }).limit(3),
      ]);

      setStats({
        noticesCount: noticesCount || 0,
        teamCount: teamCount || 1,
        broadcast: broadcastData || null,
        recentNotices: noticesList || [],
        loading: false,
      });
    } catch (err) {
      console.warn('Dashboard fetch error:', err);
      setStats((prev) => ({ ...prev, loading: false }));
    }
  };

  const copyLiveLink = () => {
    const url = `${window.location.origin}/live`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(url);
      showToast?.('success', 'Live Stream link copied to clipboard!');
    }
  };

  const greeting = () => {
    const h = now.getHours();
    if (h < 12) return 'Good morning';
    if (h < 17) return 'Good afternoon';
    return 'Good evening';
  };

  const isLive = liveTelemetry?.isLive || stats.broadcast?.is_live;

  return (
    <div style={{ maxWidth: '1140px', margin: '0 auto' }}>
      {/* ── Welcome Header ── */}
      <div style={{ marginBottom: '36px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
          <span className="adm-badge adm-badge-success">
            <ShieldCheck size={13} />
            AUTHENTICATED · {userRole?.toUpperCase()}
          </span>
        </div>

        <h1
          style={{
            fontSize: 'clamp(1.8rem, 3.5vw, 2.4rem)',
            fontWeight: 800,
            color: 'var(--adm-text-main)',
            margin: '0 0 6px 0',
            letterSpacing: '-0.5px',
          }}
        >
          {greeting()}, {userProfile?.name?.split(' ')[0] || 'Administrator'}
        </h1>

        <p style={{ color: 'var(--adm-text-muted)', fontSize: '0.95rem', margin: 0 }}>
          {now.toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })}{' '}
          · Operations Command Center
        </p>
      </div>

      {/* ── Live Broadcast Hero Monitor ── */}
      <div
        className="adm-card"
        style={{
          background: isLive
            ? 'linear-gradient(135deg, rgba(239, 68, 68, 0.12) 0%, rgba(20, 20, 24, 0.95) 100%)'
            : 'var(--adm-bg-card)',
          border: `1px solid ${isLive ? 'rgba(239, 68, 68, 0.35)' : 'var(--adm-border)'}`,
          marginBottom: '32px',
          padding: '24px 28px',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '16px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', minWidth: '280px' }}>
            <div
              style={{
                width: '46px',
                height: '46px',
                borderRadius: '14px',
                background: isLive ? 'rgba(239, 68, 68, 0.2)' : 'rgba(255, 255, 255, 0.05)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: isLive ? 'var(--adm-live)' : 'var(--adm-text-muted)',
                flexShrink: 0,
              }}
            >
              <Radio size={24} className={isLive ? 'adm-pulse' : ''} />
            </div>

            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                <span className={`adm-badge ${isLive ? 'adm-badge-live' : 'adm-badge-neutral'}`}>
                  <span
                    style={{
                      width: 6,
                      height: 6,
                      borderRadius: '50%',
                      background: 'currentColor',
                    }}
                    className={isLive ? 'adm-pulse' : ''}
                  />
                  {isLive ? 'BROADCAST IS LIVE NOW' : 'BROADCAST IS CURRENTLY OFFLINE'}
                </span>
                {isLive && (
                  <span style={{ fontSize: '0.8rem', color: 'var(--adm-text-muted)' }}>
                    {liveTelemetry.viewers} live {liveTelemetry.viewers === 1 ? 'viewer' : 'viewers'}
                  </span>
                )}
              </div>

              <h3
                style={{
                  margin: 0,
                  fontSize: '1.15rem',
                  color: 'var(--adm-text-main)',
                  fontWeight: 700,
                  fontFamily: 'var(--adm-font-sinhala)',
                }}
              >
                {stats.broadcast?.sermon_title || stats.broadcast?.next_title || 'සජීවී ධර්ම දේශනාව'}
              </h3>
              {stats.broadcast?.speaker_name && (
                <p style={{ margin: '3px 0 0', fontSize: '0.85rem', color: 'var(--adm-gold)', fontFamily: 'var(--adm-font-sinhala)' }}>
                  {stats.broadcast.speaker_name}
                </p>
              )}
            </div>
          </div>

          {/* Quick Actions for broadcast */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <button
              onClick={copyLiveLink}
              className="adm-btn adm-btn-secondary"
              title="Copy live link"
            >
              <Copy size={16} /> Copy Link
            </button>

            <Link to="/portal-ops/live" className="adm-btn adm-btn-primary">
              <Video size={16} /> Enter Live Studio
            </Link>

            <a
              href="/live"
              target="_blank"
              rel="noopener noreferrer"
              className="adm-btn adm-btn-secondary"
              title="Open viewer page"
            >
              <ExternalLink size={16} />
            </a>
          </div>
        </div>
      </div>

      {/* ── KPI Telemetry Grid ── */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '16px',
          marginBottom: '36px',
        }}
      >
        <StatCard
          icon={<Radio size={20} color={isLive ? 'var(--adm-live)' : 'var(--adm-text-muted)'} />}
          label="Broadcast Status"
          value={isLive ? 'LIVE' : 'OFFLINE'}
          loading={stats.loading}
          badge={isLive ? 'ACTIVE' : 'STANDBY'}
          badgeType={isLive ? 'live' : 'neutral'}
        />

        <StatCard
          icon={<BellRing size={20} color="var(--adm-warning)" />}
          label="Scheduled Notices"
          value={stats.noticesCount}
          loading={stats.loading}
          badge="DATABASE"
          badgeType="warning"
        />

        <StatCard
          icon={<Users size={20} color="var(--adm-info)" />}
          label="Admin Personnel"
          value={stats.teamCount}
          loading={stats.loading}
          badge="ROLES"
          badgeType="info"
        />

        <StatCard
          icon={<Activity size={20} color="var(--adm-success)" />}
          label="Realtime Engine"
          value="Healthy"
          loading={false}
          badge="SUPABASE"
          badgeType="success"
        />
      </div>

      {/* ── Section: Quick Actions & Management ── */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
        <div
          style={{
            fontSize: '0.8rem',
            fontWeight: 700,
            color: 'var(--adm-text-muted)',
            textTransform: 'uppercase',
            letterSpacing: '1px',
          }}
        >
          Operations Management
        </div>
        <div style={{ flex: 1, height: '1px', background: 'var(--adm-border)' }} />
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '16px',
          marginBottom: '36px',
        }}
      >
        <Link to="/portal-ops/live" className="adm-card-interactive">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div
                style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '10px',
                  background: 'rgba(239, 68, 68, 0.12)',
                  color: 'var(--adm-live)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Radio size={20} />
              </div>
              <div>
                <div style={{ color: 'var(--adm-text-main)', fontWeight: 700, fontSize: '1rem' }}>
                  Live Broadcast Studio
                </div>
                <div style={{ color: 'var(--adm-text-muted)', fontSize: '0.82rem', marginTop: '2px' }}>
                  Sync player, stream YouTube, control viewers
                </div>
              </div>
            </div>
            <ArrowUpRight size={18} color="var(--adm-text-dim)" />
          </div>
          <p style={{ color: 'var(--adm-text-dim)', fontSize: '0.86rem', margin: 0, lineHeight: 1.5 }}>
            Master studio controls for sermon streaming, play/pause synchronization, and PDF sutta distribution.
          </p>
        </Link>

        <Link to="/portal-ops/notices" className="adm-card-interactive">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div
                style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '10px',
                  background: 'rgba(245, 158, 11, 0.12)',
                  color: 'var(--adm-warning)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <BellRing size={20} />
              </div>
              <div>
                <div style={{ color: 'var(--adm-text-main)', fontWeight: 700, fontSize: '1rem' }}>
                  Notices & Sermons
                </div>
                <div style={{ color: 'var(--adm-text-muted)', fontSize: '0.82rem', marginTop: '2px' }}>
                  Schedule upcoming deshana, publish notices
                </div>
              </div>
            </div>
            <ArrowUpRight size={18} color="var(--adm-text-dim)" />
          </div>
          <p style={{ color: 'var(--adm-text-dim)', fontSize: '0.86rem', margin: 0, lineHeight: 1.5 }}>
            Manage the Home Page Notice Board, set dates, add Zoom/Teams or Kalyanamitta Live Portal links.
          </p>
        </Link>

        {userRole === 'superadmin' && (
          <Link to="/portal-ops/team" className="adm-card-interactive">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div
                  style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '10px',
                    background: 'rgba(59, 130, 246, 0.12)',
                    color: 'var(--adm-info)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Users size={20} />
                </div>
                <div>
                  <div style={{ color: 'var(--adm-text-main)', fontWeight: 700, fontSize: '1rem' }}>
                    Team & Role Governance
                  </div>
                  <div style={{ color: 'var(--adm-text-muted)', fontSize: '0.82rem', marginTop: '2px' }}>
                    Manage administrators and permissions
                  </div>
                </div>
              </div>
              <ArrowUpRight size={18} color="var(--adm-text-dim)" />
            </div>
            <p style={{ color: 'var(--adm-text-dim)', fontSize: '0.86rem', margin: 0, lineHeight: 1.5 }}>
              Review the active administrator roster, assign editor privileges, or revoke access securely.
            </p>
          </Link>
        )}
      </div>

      {/* ── Recent Scheduled Notices Feed ── */}
      <div className="adm-card" style={{ marginBottom: '32px' }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '20px',
            flexWrap: 'wrap',
            gap: '12px',
          }}
        >
          <div>
            <h3 style={{ margin: '0 0 4px 0', fontSize: '1.1rem', color: 'var(--adm-text-main)', fontWeight: 700 }}>
              Recent Scheduled Notices & Sermons
            </h3>
            <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--adm-text-muted)' }}>
              Active announcements displayed across the main platform.
            </p>
          </div>

          <Link to="/portal-ops/notices" className="adm-btn adm-btn-secondary" style={{ padding: '7px 14px', fontSize: '0.84rem' }}>
            <Plus size={15} /> Schedule New
          </Link>
        </div>

        {stats.loading ? (
          <div style={{ textAlign: 'center', padding: '36px', color: 'var(--adm-text-muted)' }}>
            <Loader2 size={24} className="adm-spin" style={{ margin: '0 auto 8px auto' }} />
            <div>Loading notices…</div>
          </div>
        ) : stats.recentNotices.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '36px 20px', color: 'var(--adm-text-muted)' }}>
            <Calendar size={32} style={{ opacity: 0.3, margin: '0 auto 8px auto' }} />
            <p style={{ margin: 0, fontSize: '0.9rem' }}>No notices scheduled yet.</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {stats.recentNotices.map((n) => (
              <div
                key={n.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '14px 18px',
                  borderRadius: '10px',
                  background: 'rgba(255, 255, 255, 0.02)',
                  border: '1px solid var(--adm-border-subtle)',
                  flexWrap: 'wrap',
                  gap: '12px',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px', minWidth: '240px', flex: 1 }}>
                  <span className={`adm-badge ${n.type === 'live' ? 'adm-badge-live' : 'adm-badge-warning'}`}>
                    {n.type}
                  </span>
                  <div>
                    <div style={{ fontSize: '0.92rem', fontWeight: 600, color: 'var(--adm-text-main)', fontFamily: 'var(--adm-font-sinhala)' }}>
                      {n.title}
                    </div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--adm-text-muted)', marginTop: '2px' }}>
                      {n.speaker} · {n.date} at {n.time}
                    </div>
                  </div>
                </div>

                <Link
                  to="/portal-ops/notices"
                  className="adm-btn adm-btn-ghost"
                  style={{ padding: '6px 12px', fontSize: '0.8rem' }}
                >
                  Manage
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ── Operational Tip Card ── */}
      <div
        style={{
          background: 'linear-gradient(135deg, rgba(163, 28, 28, 0.08) 0%, rgba(20, 20, 24, 0.5) 100%)',
          border: '1px solid rgba(163, 28, 28, 0.2)',
          borderRadius: '14px',
          padding: '20px 24px',
          display: 'flex',
          alignItems: 'flex-start',
          gap: '14px',
        }}
      >
        <Zap size={22} color="var(--adm-primary)" style={{ flexShrink: 0, marginTop: '2px' }} />
        <div>
          <div style={{ color: 'var(--adm-text-main)', fontWeight: 700, fontSize: '0.92rem', marginBottom: '4px' }}>
            Live Stream Broadcasting Protocol
          </div>
          <p style={{ color: 'var(--adm-text-muted)', fontSize: '0.85rem', margin: 0, lineHeight: 1.6 }}>
            When starting a live session: first enter the YouTube Video ID and Sermon Details in the{' '}
            <strong style={{ color: '#fff' }}>Live Studio</strong>, click{' '}
            <strong style={{ color: '#fff' }}>Save All Settings</strong>, and then switch the Master{' '}
            <strong style={{ color: '#ef4444' }}>Live Toggle to ON</strong>. Viewers at{' '}
            <code style={{ background: 'rgba(255,255,255,0.06)', padding: '2px 6px', borderRadius: '4px', color: '#fff' }}>
              /live
            </code>{' '}
            and the Home Notice Board will sync instantly within milliseconds.
          </p>
        </div>
      </div>
    </div>
  );
}
