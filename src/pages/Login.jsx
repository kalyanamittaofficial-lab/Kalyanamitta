import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '../utils/supabase';

export default function Login() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState({ text: '', type: '' });
  const [focusedInput, setFocusedInput] = useState(null);

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage({ text: '', type: '' });

    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      navigate('/dashboard');
    } catch (error) {
      setMessage({ text: error.message, type: 'error' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${window.location.origin}/onboarding` }
    });
    
    if (error) {
      setMessage({ text: error.message, type: 'error' });
      setIsLoading(false);
    }
  };

  const containerStyle = {
    display: 'flex',
    height: 'calc(100vh - 100px)',
    width: '100%',
    backgroundColor: 'var(--bg-main)',
    overflow: 'hidden'
  };

  const leftPaneStyle = {
    flex: '1',
    backgroundColor: '#8b1818', // Deep Crimson / Burgundy
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    padding: '60px',
    color: '#ffffff',
    position: 'relative',
    overflow: 'hidden'
  };

  const rightPaneStyle = {
    flex: '1',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '40px',
    backgroundColor: 'var(--bg-main)',
    overflowY: 'auto'
  };

  const formContainerStyle = {
    width: '100%',
    maxWidth: '440px'
  };

  // Input styles (academic, minimalist)
  const getInputStyle = (isFocused) => ({
    width: '100%',
    padding: '16px 0',
    backgroundColor: 'transparent',
    border: 'none',
    borderBottom: `2px solid ${isFocused ? 'var(--primary)' : 'var(--glass-border)'}`,
    color: 'var(--text-main)',
    fontSize: '1rem',
    fontFamily: 'var(--font-sinhala), sans-serif',
    outline: 'none',
    transition: 'border-color 0.3s ease',
    marginBottom: '24px'
  });

  return (
    <div style={containerStyle} className="auth-container">
      {/* CSS for responsiveness */}
      <style>
        {`
          @media (max-width: 768px) {
            .auth-container {
              flex-direction: column !important;
              height: auto !important;
              min-height: calc(100vh - 100px) !important;
              overflow: visible !important;
            }
            .left-pane {
              flex: none !important;
              padding: 40px 24px !important;
              min-height: 250px !important;
              justify-content: flex-end !important;
            }
            .right-pane {
              padding: 40px 24px !important;
              align-items: flex-start !important;
              overflow-y: visible !important;
            }
            .quote-text {
              font-size: 1.5rem !important;
            }
          }
        `}
      </style>

      {/* LEFT PANE (Branding) */}
      <div style={leftPaneStyle} className="left-pane">
        {/* Subtle background overlay/pattern could go here */}
        <div style={{ zIndex: 2, position: 'relative' }}>
          <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '2.5rem', fontWeight: '700', marginBottom: '60px', letterSpacing: '-0.02em' }}>
            Kalyanamitta
          </h1>
          
          <blockquote style={{ borderLeft: '3px solid rgba(255,255,255,0.3)', paddingLeft: '24px', margin: 0 }}>
            <p className="quote-text" style={{ fontFamily: 'var(--font-sinhala)', fontSize: '1.75rem', lineHeight: 1.4, fontWeight: '300', marginBottom: '16px' }}>
              "ස්වල්පයක් වූවත්, ධර්මය අසා එය දරාගෙන පිළිපදින්නේ නම්, ඔහු ධර්මධරයෙකු වේ."
            </p>
            <footer style={{ fontFamily: 'var(--font-sinhala)', opacity: 0.7, fontSize: '1rem' }}>
              — ධම්ම පදය
            </footer>
          </blockquote>
        </div>
      </div>

      {/* RIGHT PANE (Form) */}
      <div style={rightPaneStyle} className="right-pane">
        <div style={formContainerStyle}>
          <h2 style={{ fontSize: '2rem', color: 'var(--text-main)', fontFamily: 'var(--font-serif)', fontWeight: '700', marginBottom: '12px' }}>
            Welcome Back
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '1rem', fontFamily: 'var(--font-sinhala)', marginBottom: '40px' }}>
            කරුණාකර ඔබගේ ගිණුමට පිවිසෙන්න
          </p>
          
          {message.text && (
            <div style={{
              marginBottom: '24px', padding: '16px', borderRadius: '8px', fontSize: '0.9rem', fontFamily: 'var(--font-sinhala)',
              backgroundColor: message.type === 'error' ? '#fef2f2' : '#f0fdf4', color: message.type === 'error' ? '#991b1b' : '#166534',
              border: `1px solid ${message.type === 'error' ? '#fecaca' : '#bbf7d0'}`
            }}>
              {message.text}
            </div>
          )}

          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column' }}>
            <div style={{ position: 'relative' }}>
              <input 
                type="email" 
                placeholder="විද්‍යුත් තැපෑල (Email)" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                required
                style={getInputStyle(focusedInput === 'email')}
                onFocus={() => setFocusedInput('email')} 
                onBlur={() => setFocusedInput(null)}
              />
            </div>
            
            <div style={{ position: 'relative' }}>
              <input 
                type="password" 
                placeholder="මුරපදය (Password)" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                required
                style={getInputStyle(focusedInput === 'password')}
                onFocus={() => setFocusedInput('password')} 
                onBlur={() => setFocusedInput(null)}
              />
            </div>

            <button type="submit" disabled={isLoading}
              style={{
                width: '100%', padding: '16px', marginTop: '12px', borderRadius: '8px', 
                backgroundColor: 'var(--primary)', color: '#ffffff',
                fontFamily: 'var(--font-sinhala), sans-serif', fontSize: '1.05rem', fontWeight: '600', border: 'none',
                cursor: isLoading ? 'not-allowed' : 'pointer', opacity: isLoading ? 0.8 : 1, transition: 'all 0.3s ease',
              }}
              onMouseEnter={(e) => { if(!isLoading) e.currentTarget.style.backgroundColor = 'var(--primary-hover)'; }}
              onMouseLeave={(e) => { if(!isLoading) e.currentTarget.style.backgroundColor = 'var(--primary)'; }}
            >
              {isLoading ? 'කරුණාකර රැඳී සිටින්න...' : 'ඇතුල් වන්න'}
            </button>
          </form>

          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', margin: '32px 0' }}>
            <div style={{ flex: 1, height: '1px', backgroundColor: 'var(--glass-border)' }}></div>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>OR</span>
            <div style={{ flex: 1, height: '1px', backgroundColor: 'var(--glass-border)' }}></div>
          </div>

          <button onClick={handleGoogleLogin} disabled={isLoading} type="button"
            style={{
              display: 'flex', width: '100%', alignItems: 'center', justifyContent: 'center', gap: '12px',
              borderRadius: '8px', backgroundColor: 'transparent', padding: '14px', fontSize: '1rem', fontFamily: 'var(--font-sinhala), sans-serif',
              fontWeight: '500', border: '1px solid var(--glass-border)', cursor: isLoading ? 'not-allowed' : 'pointer',
              color: 'var(--text-main)', transition: 'background-color 0.2s ease'
            }}
            onMouseEnter={(e) => { if(!isLoading) e.currentTarget.style.backgroundColor = 'var(--glass-border)'; }}
            onMouseLeave={(e) => { if(!isLoading) e.currentTarget.style.backgroundColor = 'transparent'; }}
          >
            <svg viewBox="0 0 24 24" style={{ height: '20px', width: '20px' }}>
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
            </svg>
            Google හරහා පිවිසෙන්න
          </button>

          <p style={{ marginTop: '40px', textAlign: 'center', fontSize: '0.95rem', color: 'var(--text-muted)', fontFamily: 'var(--font-sinhala)' }}>
            නව ගිණුමක් අවශ්‍යද?
            <button 
              onClick={() => navigate('/register')} 
              style={{
                marginLeft: '8px', background: 'none', border: 'none', color: 'var(--primary)',
                fontWeight: '600', cursor: 'pointer', textDecoration: 'none', transition: 'color 0.2s', fontFamily: 'var(--font-sinhala)'
              }}
              onMouseEnter={(e) => { e.currentTarget.style.textDecoration = 'underline'; }}
              onMouseLeave={(e) => { e.currentTarget.style.textDecoration = 'none'; }}
            >
              ලියාපදිංචි වන්න
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
