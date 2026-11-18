import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  User, 
  ShieldCheck, 
  LogOut, 
  Edit3, 
  Compass, 
  BookOpen, 
  Award, 
  MapPin, 
  Calendar, 
  Mail, 
  Phone, 
  Heart,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { supabase } from '../utils/supabase';
import { signInWithGoogle, signOutUser, fetchUserProfile } from '../utils/auth';
import MemberIdCard from '../components/MemberIdCard/MemberIdCard';

export default function Profile() {
  const navigate = useNavigate();
  const [session, setSession] = useState(null);
  const [profile, setProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    async function loadProfile() {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!isMounted) return;
        setSession(session);

        if (session) {
          const profileData = await fetchUserProfile(session.user.id);
          if (!isMounted) return;
          if (!profileData || profileData.status !== 'active') {
            navigate('/onboarding', { replace: true });
            return;
          }
          setProfile(profileData);
        }
      } catch (err) {
        console.error('Error fetching profile:', err);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }

    loadProfile();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, newSession) => {
      if (!isMounted) return;
      setSession(newSession);
      if (newSession?.user) {
        const profileData = await fetchUserProfile(newSession.user.id);
        if (!isMounted) return;
        if (!profileData || profileData.status !== 'active') {
          navigate('/onboarding', { replace: true });
          return;
        }
        setProfile(profileData);
      } else {
        setProfile(null);
      }
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, [navigate]);

  const handleLogout = async () => {
    await signOutUser();
    setSession(null);
    setProfile(null);
    navigate('/');
  };

  if (isLoading) {
    return (
      <div style={{
        minHeight: '80vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'var(--bg-main)'
      }}>
        <div style={{ textAlign: 'center', color: 'var(--text-muted)' }}>
          <div style={{ fontSize: '1.8rem', marginBottom: '8px' }}>🪪</div>
          <p>සාමාජික තොරතුරු පූරණය වෙමින් පවතී...</p>
        </div>
      </div>
    );
  }

  // ========================================================
  // 1. UNREGISTERED / NOT LOGGED IN VIEW (PROMOTIONAL PREVIEW)
  // ========================================================
  if (!session) {
    return (
      <div style={{ minHeight: '90vh', background: 'var(--bg-main)', padding: '60px clamp(16px, 4vw, 40px) 120px clamp(16px, 4vw, 40px)' }}>
        <div style={{ maxWidth: '880px', margin: '0 auto', textAlign: 'center' }}>
          
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            fontSize: '0.8rem',
            fontWeight: '700',
            textTransform: 'uppercase',
            letterSpacing: '0.1em',
            color: '#8C1515',
            background: 'rgba(140, 21, 21, 0.08)',
            padding: '4px 12px',
            borderRadius: '20px',
            marginBottom: '16px'
          }}>
            <Sparkles size={14} />
            <span>Digital Seeker Identity</span>
          </div>

          <h1 style={{
            fontSize: 'clamp(2.2rem, 4vw, 3.2rem)',
            fontWeight: '700',
            fontFamily: 'var(--font-serif)',
            color: 'var(--text-main)',
            marginBottom: '14px',
            lineHeight: 1.2
          }}>
            ඔබේ නිල කල්‍යාණමිත්ත සාමාජික හැඳුනුම්පත
          </h1>

          <p style={{
            fontSize: '1.1rem',
            color: 'var(--text-muted)',
            lineHeight: 1.6,
            maxWidth: '680px',
            margin: '0 auto 36px auto'
          }}>
            කල්‍යාණමිත්ත ධර්ම සමාගම හා එක්ව ධර්මය හැදෑරීම, සටහන් පවත්වාගැනීම සහ ශාසනික සේවාවන් සඳහා නිල 3D ඩිජිටල් සාමාජික හැඳුනුම්පත (Official Seeker ID) නොමිලේ ලබාගන්න.
          </p>

          {/* Interactive 3D Preview Card */}
          <div style={{ marginBottom: '40px' }}>
            <MemberIdCard
              user={{ email: 'seeker@kalyanamitta.org' }}
              profile={{
                name: 'Kalyanamitta Seeker (ධර්ම ගවේෂක)',
                kalyanamitta_id: 'KM-2026-PREVIEW',
                country: 'Sri Lanka',
                state_district: 'Western Province'
              }}
              isPreview={true}
            />
          </div>

          {/* Sign In CTA Box */}
          <div style={{
            background: 'var(--bg-card)',
            border: '1px solid var(--border-color, rgba(0,0,0,0.1))',
            borderRadius: '16px',
            padding: '36px clamp(20px, 4vw, 48px)',
            maxWidth: '560px',
            margin: '0 auto',
            boxShadow: '0 10px 40px rgba(0,0,0,0.04)'
          }}>
            <h3 style={{ fontSize: '1.3rem', fontWeight: '700', color: 'var(--text-main)', marginBottom: '8px', fontFamily: 'var(--font-serif)' }}>
              දැන්ම ලියාපදිංචි වී හැඳුනුම්පත ලබාගන්න
            </h3>
            <p style={{ fontSize: '0.92rem', color: 'var(--text-muted)', marginBottom: '24px', lineHeight: 1.5 }}>
              තත්පර කිහිපයකින් Google ගිණුමෙන් නොමිලේ පිවිස ඔබේ සාමාජික අංකය ලබාගන්න.
            </p>

            <button
              onClick={() => signInWithGoogle()}
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '12px',
                padding: '12px 20px',
                borderRadius: '10px',
                background: '#FFFFFF',
                color: '#374151',
                border: '1px solid #D1D5DB',
                fontSize: '0.98rem',
                fontWeight: '600',
                cursor: 'pointer',
                boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
                marginBottom: '12px'
              }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
              </svg>
              <span>Google මඟින් 1-Click පිවිසෙන්න</span>
            </button>

            <Link
              to="/login"
              style={{
                display: 'block',
                fontSize: '0.88rem',
                color: '#8C1515',
                textDecoration: 'none',
                fontWeight: '600',
                marginTop: '12px'
              }}
            >
              Email මඟින් ඇතුල් වීමට →
            </Link>
          </div>

        </div>
      </div>
    );
  }

  // ========================================================
  // 2. LOGGED IN MEMBER PROFILE VIEW
  // ========================================================
  const memberName = profile?.name || session.user.user_metadata?.full_name || 'Dhamma Seeker';
  const memberId = profile?.kalyanamitta_id || `KM-2026-${session.user.id.slice(0, 4).toUpperCase()}`;
  const avatarUrl = session.user.user_metadata?.avatar_url || session.user.user_metadata?.picture || profile?.avatar_url;
  const memberSince = new Date(profile?.created_at || session.user.created_at).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });

  const detailItems = [
    { icon: Award, label: 'Kalyanamitta Member ID', value: memberId, mono: true, accent: true },
    { icon: User, label: 'සම්පූර්ණ නම (Full Name)', value: memberName },
    { icon: Mail, label: 'විද්‍යුත් තැපෑල (Email)', value: session.user.email },
    { icon: Phone, label: 'දුරකථන අංකය (Mobile)', value: profile?.mobile_number || 'නොදක්වා ඇත' },
    {
      icon: MapPin,
      label: 'රට හා දිස්ත්‍රික්කය (Location)',
      value: `${profile?.country || 'Sri Lanka'}${profile?.state_district ? ` · ${profile.state_district}` : ''}`
    },
    { icon: Calendar, label: 'ලියාපදිංචි දිනය (Member Since)', value: memberSince }
  ];

  const dedicationMetrics = [
    {
      label: 'ධර්මය හැදෑරීමේ උනන්දුව (Spiritual Interest)',
      value: profile?.spiritual_interest ?? profile?.interest_level ?? 50,
      color: 'var(--primary)'
    },
    {
      label: 'වත්මන් ධර්ම පුහුණුව (Current Practice)',
      value: profile?.current_dedication ?? 50,
      color: '#3B82F6'
    },
    {
      label: 'ඉදිරි කැපවීමේ සූදානම (Potential Dedication)',
      value: profile?.potential_dedication ?? 50,
      color: 'var(--accent-gold)'
    }
  ];

  return (
    <div style={{
      minHeight: '100vh',
      background: 'var(--bg-main)',
      padding: '36px clamp(16px, 4vw, 40px) 100px clamp(16px, 4vw, 40px)',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Subtle Ambient Background Glow */}
      <div style={{
        position: 'absolute',
        top: '-120px',
        left: '50%',
        transform: 'translateX(-50%)',
        width: 'min(900px, 95vw)',
        height: '380px',
        background: 'radial-gradient(ellipse at center, rgba(140, 21, 21, 0.12) 0%, rgba(212, 175, 55, 0.05) 45%, transparent 75%)',
        pointerEvents: 'none',
        zIndex: 0
      }} />

      <div style={{ maxWidth: '1040px', margin: '0 auto', position: 'relative', zIndex: 1 }}>

        {/* HERO PROFILE HEADER CARD */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          style={{
            background: 'var(--bg-card)',
            border: '1px solid var(--glass-border)',
            borderRadius: '24px',
            padding: 'clamp(22px, 3vw, 32px)',
            marginBottom: '24px',
            boxShadow: '0 12px 36px rgba(0, 0, 0, 0.08)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '20px'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '18px', flexWrap: 'wrap' }}>
            {avatarUrl ? (
              <img
                src={avatarUrl}
                alt={memberName}
                referrerPolicy="no-referrer"
                style={{
                  width: '68px',
                  height: '68px',
                  borderRadius: '20px',
                  objectFit: 'cover',
                  border: '2px solid var(--primary)',
                  boxShadow: '0 6px 18px rgba(140, 21, 21, 0.22)'
                }}
              />
            ) : (
              <div style={{
                width: '68px',
                height: '68px',
                borderRadius: '20px',
                background: 'linear-gradient(135deg, var(--primary) 0%, #5e0d0d 100%)',
                color: '#fff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.7rem',
                fontWeight: '700',
                fontFamily: 'var(--font-serif)',
                boxShadow: '0 6px 18px rgba(140, 21, 21, 0.25)'
              }}>
                {memberName[0]?.toUpperCase() || 'K'}
              </div>
            )}

            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', marginBottom: '6px' }}>
                <span style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '5px',
                  fontSize: '0.72rem',
                  fontWeight: '700',
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em',
                  color: 'var(--primary)',
                  background: 'rgba(179, 36, 36, 0.12)',
                  border: '1px solid rgba(179, 36, 36, 0.25)',
                  padding: '3px 10px',
                  borderRadius: '999px'
                }}>
                  <ShieldCheck size={13} />
                  <span>Verified Member</span>
                </span>
                <span style={{
                  fontFamily: 'monospace',
                  fontSize: '0.78rem',
                  fontWeight: '700',
                  color: 'var(--accent-gold)',
                  background: 'rgba(212, 175, 55, 0.12)',
                  border: '1px solid rgba(212, 175, 55, 0.28)',
                  padding: '3px 10px',
                  borderRadius: '999px'
                }}>
                  {memberId}
                </span>
              </div>

              <h1 style={{
                fontSize: 'clamp(1.6rem, 3vw, 2.2rem)',
                fontWeight: '700',
                fontFamily: 'var(--font-serif)',
                color: 'var(--text-main)',
                margin: '0 0 4px 0',
                lineHeight: 1.2
              }}>
                {memberName}
              </h1>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', margin: 0 }}>
                සාමාජික ගිණුම · Kalyanamitta Global Dhamma Fellowship
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
            <Link
              to="/dashboard"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '7px',
                padding: '10px 18px',
                borderRadius: '12px',
                border: '1px solid var(--glass-border)',
                background: 'var(--bg-secondary)',
                color: 'var(--text-main)',
                fontSize: '0.88rem',
                fontWeight: '600',
                textDecoration: 'none',
                transition: 'all 0.2s ease'
              }}
            >
              <Edit3 size={15} />
              <span>Edit Profile</span>
            </Link>

            <button
              onClick={handleLogout}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '7px',
                padding: '10px 18px',
                borderRadius: '12px',
                border: '1px solid rgba(220, 38, 38, 0.28)',
                background: 'rgba(220, 38, 38, 0.1)',
                color: '#ef4444',
                fontSize: '0.88rem',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              <LogOut size={15} />
              <span>Sign Out</span>
            </button>
          </div>
        </motion.div>

        {/* 3D MEMBER ID CARD SHOWCASE */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.08 }}
          style={{
            background: 'linear-gradient(145deg, rgba(140, 21, 21, 0.09) 0%, var(--bg-card) 48%, rgba(212, 175, 55, 0.08) 100%)',
            border: '1px solid var(--glass-border)',
            borderRadius: '24px',
            padding: 'clamp(24px, 4vw, 40px)',
            marginBottom: '24px',
            textAlign: 'center',
            boxShadow: '0 14px 40px rgba(0, 0, 0, 0.08)'
          }}
        >
          <div style={{ marginBottom: '22px' }}>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '0.75rem',
              fontWeight: '700',
              textTransform: 'uppercase',
              letterSpacing: '0.09em',
              color: 'var(--accent-gold)',
              marginBottom: '6px'
            }}>
              <Sparkles size={13} />
              <span>Official 3D Digital Pass</span>
            </div>
            <h2 style={{ fontSize: '1.35rem', fontWeight: '700', color: 'var(--text-main)', margin: '0 0 6px 0', fontFamily: 'var(--font-serif)' }}>
              නිල ඩිජිටල් සාමාජික හැඳුනුම්පත
            </h2>
            <p style={{ fontSize: '0.86rem', color: 'var(--text-muted)', margin: 0 }}>
              Hover or move cursor over the card to preview the 3D depth and metallic reflection.
            </p>
          </div>

          <MemberIdCard
            user={session.user}
            profile={profile}
            isPreview={false}
          />
        </motion.div>

        {/* BENTO GRID: ACCOUNT DETAILS + SPIRITUAL INDICATORS & QUICK ACCESS */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '24px',
          alignItems: 'start'
        }}>
          {/* ACCOUNT DETAILS CARD */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.14 }}
            style={{
              background: 'var(--bg-card)',
              border: '1px solid var(--glass-border)',
              borderRadius: '22px',
              padding: '28px',
              boxShadow: '0 8px 28px rgba(0, 0, 0, 0.05)'
            }}
          >
            <h3 style={{
              fontSize: '1.12rem',
              fontWeight: '700',
              color: 'var(--text-main)',
              marginBottom: '20px',
              paddingBottom: '14px',
              borderBottom: '1px solid var(--glass-border)',
              display: 'flex',
              alignItems: 'center',
              gap: '10px'
            }}>
              <User size={18} color="var(--primary)" />
              <span>සාමාජික ගිණුමේ විස්තර</span>
            </h3>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
              gap: '12px'
            }}>
              {detailItems.map((item) => {
                const Icon = item.icon;
                return (
                  <div
                    key={item.label}
                    style={{
                      background: 'var(--bg-secondary)',
                      border: '1px solid var(--glass-border)',
                      borderRadius: '14px',
                      padding: '14px 16px',
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: '12px'
                    }}
                  >
                    <div style={{
                      width: '34px',
                      height: '34px',
                      borderRadius: '10px',
                      background: item.accent ? 'rgba(179, 36, 36, 0.14)' : 'rgba(255, 255, 255, 0.04)',
                      border: '1px solid var(--glass-border)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                      marginTop: '2px'
                    }}>
                      <Icon size={16} color={item.accent ? 'var(--primary)' : 'var(--text-muted)'} />
                    </div>
                    <div style={{ minWidth: 0 }}>
                      <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)', display: 'block', marginBottom: '3px' }}>
                        {item.label}
                      </span>
                      <span style={{
                        fontFamily: item.mono ? 'monospace' : 'inherit',
                        fontWeight: item.accent ? '700' : '600',
                        color: item.accent ? 'var(--primary)' : 'var(--text-main)',
                        fontSize: '0.94rem',
                        wordBreak: 'break-word',
                        display: 'block'
                      }}>
                        {item.value}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>

          {/* RIGHT COLUMN: SPIRITUAL INDICATORS & QUICK LAB LINKS */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {profile && (profile.spiritual_interest || profile.current_dedication || profile.potential_dedication) && (
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45, delay: 0.2 }}
                style={{
                  background: 'var(--bg-card)',
                  border: '1px solid var(--glass-border)',
                  borderRadius: '22px',
                  padding: '28px',
                  boxShadow: '0 8px 28px rgba(0, 0, 0, 0.05)'
                }}
              >
                <h3 style={{
                  fontSize: '1.12rem',
                  fontWeight: '700',
                  color: 'var(--text-main)',
                  marginBottom: '20px',
                  paddingBottom: '14px',
                  borderBottom: '1px solid var(--glass-border)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px'
                }}>
                  <Heart size={18} color="var(--accent-gold)" />
                  <span>අධ්‍යාත්මික කැපවීම (Dedication)</span>
                </h3>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
                  {dedicationMetrics.map((metric) => (
                    <div key={metric.label}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.84rem', marginBottom: '8px', gap: '10px' }}>
                        <span style={{ color: 'var(--text-main)', fontWeight: '600' }}>{metric.label}</span>
                        <span style={{
                          color: metric.color,
                          fontWeight: '700',
                          fontSize: '0.8rem',
                          background: 'var(--bg-secondary)',
                          border: '1px solid var(--glass-border)',
                          padding: '2px 8px',
                          borderRadius: '999px'
                        }}>
                          {metric.value}%
                        </span>
                      </div>
                      <div style={{ height: '8px', borderRadius: '999px', background: 'var(--bg-secondary)', overflow: 'hidden', border: '1px solid var(--glass-border)' }}>
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${metric.value}%` }}
                          transition={{ duration: 0.8, ease: 'easeOut' }}
                          style={{ height: '100%', background: metric.color, borderRadius: '999px' }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* QUICK ACCESS TO DHAMMA LAB */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.25 }}
              style={{
                background: 'var(--bg-card)',
                border: '1px solid var(--glass-border)',
                borderRadius: '22px',
                padding: '24px 28px',
                boxShadow: '0 8px 28px rgba(0, 0, 0, 0.05)'
              }}
            >
              <h3 style={{
                fontSize: '1.05rem',
                fontWeight: '700',
                color: 'var(--text-main)',
                marginBottom: '14px'
              }}>
                ඉක්මන් පිවිසුම් (Quick Access)
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <Link
                  to="/lab/roadmap"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '14px 16px',
                    borderRadius: '14px',
                    background: 'var(--bg-secondary)',
                    border: '1px solid var(--glass-border)',
                    color: 'var(--text-main)',
                    textDecoration: 'none',
                    fontWeight: '600',
                    fontSize: '0.92rem'
                  }}
                >
                  <span style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <Compass size={17} color="var(--primary)" />
                    Personal Study Roadmap
                  </span>
                  <ArrowRight size={16} color="var(--text-muted)" />
                </Link>
                <Link
                  to="/lab/sutta"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '14px 16px',
                    borderRadius: '14px',
                    background: 'var(--bg-secondary)',
                    border: '1px solid var(--glass-border)',
                    color: 'var(--text-main)',
                    textDecoration: 'none',
                    fontWeight: '600',
                    fontSize: '0.92rem'
                  }}
                >
                  <span style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <BookOpen size={17} color="var(--accent-gold)" />
                    Sutta Study Workspace
                  </span>
                  <ArrowRight size={16} color="var(--text-muted)" />
                </Link>
              </div>
            </motion.div>
          </div>
        </div>

      </div>
    </div>
  );
}
