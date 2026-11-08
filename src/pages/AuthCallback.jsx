import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { supabase } from '../utils/supabase';
import { Loader2, AlertCircle } from 'lucide-react';

export default function AuthCallback() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [errorMessage, setErrorMessage] = useState(null);

  useEffect(() => {
    let isMounted = true;

    const handleCallback = async () => {
      // 1. Check for errors in query parameters (e.g. user canceled Google login)
      const error = searchParams.get('error') || searchParams.get('error_code');
      const errorDescription = searchParams.get('error_description');

      if (error) {
        if (isMounted) {
          setErrorMessage(
            errorDescription || 'ගූගල් ගිණුම මගින් පිවිසීම අවලංගු කරන ලදී හෝ දෝෂයක් සිදු විය. කරුණාකර නැවත උත්සාහ කරන්න.'
          );
        }
        return;
      }

      try {
        // 2. Fetch session (Supabase client automatically exchanges hash tokens/auth code)
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();

        if (sessionError) {
          throw sessionError;
        }

        if (session?.user) {
          await routeUser(session.user);
          return;
        }

        // If session is not immediately ready, listen for the SIGNED_IN event
        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, newSession) => {
          if (event === 'SIGNED_IN' && newSession?.user) {
            subscription.unsubscribe();
            if (isMounted) {
              await routeUser(newSession.user);
            }
          }
        });

        // 6 second timeout fallback
        const timeout = setTimeout(() => {
          subscription.unsubscribe();
          if (isMounted) {
            setErrorMessage('පිවිසීමේ කාලය ඉක්මවා ගියේය. කරුණාකර Login පිටුවට ගොස් නැවත උත්සාහ කරන්න.');
          }
        }, 6000);

        return () => {
          clearTimeout(timeout);
          subscription.unsubscribe();
        };

      } catch (err) {
        console.error('Auth Callback Error:', err);
        if (isMounted) {
          setErrorMessage(err.message || 'පිවිසීමේදී තාක්ෂණික දෝෂයක් මතු විය.');
        }
      }
    };

    const routeUser = async (user) => {
      try {
        // Check profile status
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('id, status')
          .eq('id', user.id)
          .maybeSingle();

        if (profileError) {
          console.warn('Profile fetch warning on callback:', profileError);
        }

        if (profile && profile.status === 'active') {
          navigate('/dashboard', { replace: true });
        } else {
          // New Google user or onboarding not finished yet
          navigate('/onboarding', { replace: true });
        }
      } catch (error) {
        console.error('Routing error after OAuth:', error);
        navigate('/onboarding', { replace: true });
      }
    };

    handleCallback();

    return () => {
      isMounted = false;
    };
  }, [navigate, searchParams]);

  return (
    <div
      style={{
        minHeight: 'calc(100vh - 85px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'var(--bg-main)',
        padding: '24px',
        fontFamily: 'var(--font-sinhala), sans-serif',
      }}
    >
      <div
        className="glass-panel"
        style={{
          maxWidth: '460px',
          width: '100%',
          padding: '40px',
          borderRadius: '20px',
          textAlign: 'center',
          boxShadow: '0 20px 40px rgba(0,0,0,0.06)',
          border: '1px solid var(--glass-border)',
          background: 'var(--bg-card, rgba(255,255,255,0.85))',
        }}
      >
        {errorMessage ? (
          <div>
            <div
              style={{
                width: '56px',
                height: '56px',
                borderRadius: '50%',
                backgroundColor: '#fee2e2',
                color: '#dc2626',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 20px auto',
              }}
            >
              <AlertCircle size={32} />
            </div>

            <h3
              style={{
                fontSize: '1.35rem',
                fontWeight: 700,
                color: 'var(--text-main)',
                marginBottom: '12px',
              }}
            >
              පිවිසීම අසාර්ථකයි
            </h3>

            <p
              style={{
                fontSize: '0.95rem',
                color: 'var(--text-muted)',
                lineHeight: '1.6',
                marginBottom: '28px',
              }}
            >
              {errorMessage}
            </p>

            <button
              onClick={() => navigate('/login', { replace: true })}
              style={{
                width: '100%',
                padding: '14px',
                borderRadius: '8px',
                backgroundColor: 'var(--primary)',
                color: '#ffffff',
                border: 'none',
                fontWeight: 600,
                fontSize: '1rem',
                cursor: 'pointer',
                transition: 'opacity 0.2s',
              }}
            >
              නැවත Login පිටුවට යන්න
            </button>
          </div>
        ) : (
          <div>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '24px',
                color: 'var(--primary)',
              }}
            >
              <Loader2 size={44} className="spin-animation" style={{ animation: 'spin 1s linear infinite' }} />
            </div>

            <h3
              style={{
                fontSize: '1.35rem',
                fontWeight: 700,
                color: 'var(--text-main)',
                marginBottom: '8px',
              }}
            >
              Google ගිණුම තහවුරු කරමින් පවතී...
            </h3>

            <p
              style={{
                fontSize: '0.92rem',
                color: 'var(--text-muted)',
                margin: 0,
              }}
            >
              කරුණාකර මොහොතක් රැඳී සිටින්න. ඔබව අවශ්‍ය පිටුව වෙත යොමු කරනු ඇත.
            </p>
          </div>
        )}
      </div>

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
