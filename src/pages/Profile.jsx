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
import { signInWithGoogle, signOutUser } from '../utils/auth';
import MemberIdCard from '../components/MemberIdCard/MemberIdCard';

export default function Profile() {
  const navigate = useNavigate();
  const [session, setSession] = useState(null);
  const [profile, setProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadProfile() {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        setSession(session);

        if (session) {
          const { data: profileData } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .maybeSingle();

          if (profileData) {
            setProfile(profileData);
          }
        }
      } catch (err) {
        console.error('Error fetching profile:', err);
      } finally {
        setIsLoading(false);
      }
    }

    loadProfile();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

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
  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-main)', padding: '40px clamp(16px, 4vw, 40px) 120px clamp(16px, 4vw, 40px)' }}>
      <div style={{ maxWidth: '960px', margin: '0 auto' }}>
        
        {/* Top Header */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '16px',
          marginBottom: '32px'
        }}>
          <div>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '0.78rem',
              fontWeight: '700',
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
              color: '#8C1515',
              background: 'rgba(140, 21, 21, 0.08)',
              padding: '4px 10px',
              borderRadius: '6px',
              marginBottom: '10px'
            }}>
              <ShieldCheck size={14} />
              <span>Verified Member Profile</span>
            </div>
            <h1 style={{
              fontSize: 'clamp(2rem, 3.5vw, 2.8rem)',
              fontWeight: '700',
              fontFamily: 'var(--font-serif)',
              color: 'var(--text-main)',
              margin: '0 0 6px 0',
              lineHeight: 1.2
            }}>
              සාමාජික ගිණුම (My Dhamma Fellowship)
            </h1>
            <p style={{ fontSize: '0.98rem', color: 'var(--text-muted)', margin: 0 }}>
              කල්‍යාණමිත්ත ගෝලීය ධර්ම සාමාජිකත්ව තොරතුරු සහ නිල ඩිජිටල් හැඳුනුම්පත.
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Link
              to="/dashboard"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '8px 16px',
                borderRadius: '8px',
                border: '1px solid var(--border-color, rgba(0,0,0,0.12))',
                background: 'var(--bg-card)',
                color: 'var(--text-main)',
                fontSize: '0.86rem',
                fontWeight: '600',
                textDecoration: 'none'
              }}
            >
              <Edit3 size={15} />
              <span>Edit Details</span>
            </Link>

            <button
              onClick={handleLogout}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '8px 16px',
                borderRadius: '8px',
                border: '1px solid rgba(220, 38, 38, 0.25)',
                background: 'rgba(220, 38, 38, 0.06)',
                color: '#DC2626',
                fontSize: '0.86rem',
                fontWeight: '600',
                cursor: 'pointer'
              }}
            >
              <LogOut size={15} />
              <span>Sign Out</span>
            </button>
          </div>
        </div>

        {/* 3D MEMBER ID CARD SHOWCASE */}
        <div style={{
          background: 'linear-gradient(135deg, rgba(140, 21, 21, 0.04) 0%, rgba(212, 175, 55, 0.04) 100%)',
          border: '1px solid var(--border-color, rgba(0,0,0,0.08))',
          borderRadius: '24px',
          padding: 'clamp(24px, 4vw, 40px)',
          marginBottom: '36px',
          textAlign: 'center'
        }}>
          <div style={{ marginBottom: '18px' }}>
            <h2 style={{ fontSize: '1.3rem', fontWeight: '700', color: 'var(--text-main)', margin: '0 0 4px 0', fontFamily: 'var(--font-serif)' }}>
              නිල ඩිජිටල් සාමාජික පත (Official 3D Pass)
            </h2>
            <p style={{ fontSize: '0.86rem', color: 'var(--text-muted)', margin: 0 }}>
              Hover or move cursor over the card to experience the 3D depth and metallic sheen reflection.
            </p>
          </div>

          <MemberIdCard
            user={session.user}
            profile={profile}
            isPreview={false}
          />
        </div>

        {/* PROFILE DETAILS GRID */}
        <div style={{
          background: 'var(--bg-card)',
          border: '1px solid var(--border-color, rgba(0,0,0,0.08))',
          borderRadius: '16px',
          padding: '32px',
          boxShadow: '0 4px 20px rgba(0,0,0,0.03)',
          marginBottom: '32px'
        }}>
          <h3 style={{
            fontSize: '1.15rem',
            fontWeight: '700',
            color: 'var(--text-main)',
            marginBottom: '20px',
            paddingBottom: '12px',
            borderBottom: '1px solid var(--border-color, rgba(0,0,0,0.06))',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <User size={18} color="#8C1515" />
            <span>සාමාජික ගිණුමේ විස්තර (Account Details)</span>
          </h3>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
            gap: '20px'
          }}>
            <div>
              <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', display: 'block', marginBottom: '2px' }}>
                Kalyanamitta Member ID
              </span>
              <span style={{ fontFamily: 'monospace', fontWeight: '700', color: '#8C1515', fontSize: '1.05rem' }}>
                {profile?.kalyanamitta_id || `KM-2026-${session.user.id.slice(0, 4).toUpperCase()}`}
              </span>
            </div>

            <div>
              <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', display: 'block', marginBottom: '2px' }}>
                සම්පූර්ණ නම (Full Name)
              </span>
              <span style={{ fontWeight: '600', color: 'var(--text-main)', fontSize: '1rem' }}>
                {profile?.name || session.user.user_metadata?.full_name || 'Dhamma Seeker'}
              </span>
            </div>

            <div>
              <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', display: 'block', marginBottom: '2px' }}>
                විද්‍යුත් තැපෑල (Email)
              </span>
              <span style={{ color: 'var(--text-main)', fontSize: '0.95rem' }}>
                {session.user.email}
              </span>
            </div>

            <div>
              <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', display: 'block', marginBottom: '2px' }}>
                දුරකථන අංකය (Mobile)
              </span>
              <span style={{ color: 'var(--text-main)', fontSize: '0.95rem' }}>
                {profile?.mobile_number || 'නොදක්වා ඇත'}
              </span>
            </div>

            <div>
              <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', display: 'block', marginBottom: '2px' }}>
                රට හා දිස්ත්‍රික්කය (Location)
              </span>
              <span style={{ color: 'var(--text-main)', fontSize: '0.95rem' }}>
                {profile?.country || 'Sri Lanka'}{profile?.state_district ? ` · ${profile.state_district}` : ''}
              </span>
            </div>

            <div>
              <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', display: 'block', marginBottom: '2px' }}>
                ලියාපදිංචි දිනය (Member Since)
              </span>
              <span style={{ color: 'var(--text-main)', fontSize: '0.95rem' }}>
                {new Date(profile?.created_at || session.user.created_at).toLocaleDateString()}
              </span>
            </div>
          </div>
        </div>

        {/* DEDICATION & SPIRITUAL PROGRESS BARS */}
        {profile && (profile.spiritual_interest || profile.current_dedication) && (
          <div style={{
            background: 'var(--bg-card)',
            border: '1px solid var(--border-color, rgba(0,0,0,0.08))',
            borderRadius: '16px',
            padding: '28px 32px'
          }}>
            <h3 style={{
              fontSize: '1.1rem',
              fontWeight: '700',
              color: 'var(--text-main)',
              marginBottom: '18px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <Heart size={18} color="#D97706" />
              <span>අධ්‍යාත්මික කැපවීම (Spiritual Dedication Indicators)</span>
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '6px' }}>
                  <span style={{ color: 'var(--text-main)', fontWeight: '600' }}>ධර්මය හැදෑරීමේ උනන්දුව (Spiritual Interest)</span>
                  <span style={{ color: '#8C1515', fontWeight: '700' }}>{profile.spiritual_interest || profile.interest_level || 50}%</span>
                </div>
                <div style={{ height: '8px', borderRadius: '4px', background: 'var(--bg-main)', overflow: 'hidden' }}>
                  <div style={{ width: `${profile.spiritual_interest || profile.interest_level || 50}%`, height: '100%', background: '#8C1515', borderRadius: '4px' }} />
                </div>
              </div>

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '6px' }}>
                  <span style={{ color: 'var(--text-main)', fontWeight: '600' }}>වත්මන් ධර්ම පුහුණුව (Current Practice)</span>
                  <span style={{ color: '#2563EB', fontWeight: '700' }}>{profile.current_dedication || 50}%</span>
                </div>
                <div style={{ height: '8px', borderRadius: '4px', background: 'var(--bg-main)', overflow: 'hidden' }}>
                  <div style={{ width: `${profile.current_dedication || 50}%`, height: '100%', background: '#2563EB', borderRadius: '4px' }} />
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
