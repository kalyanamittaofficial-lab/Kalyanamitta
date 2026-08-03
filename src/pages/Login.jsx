import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '../utils/supabase';

export default function Login() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState({ text: '', type: '' });

  const handleAuth = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage({ text: '', type: '' });

    try {
      if (isSignUp) {
        const { error } = await supabase.auth.signUp({
          email,
          password,
        });
        if (error) throw error;
        setMessage({ text: 'ගිණුම සෑදීම සාර්ථකයි! කරුණාකර ඔබගේ විද්‍යුත් තැපෑල (Email) පරීක්ෂා කරන්න.', type: 'success' });
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        navigate('/dashboard');
      }
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
    });
    
    if (error) {
      setMessage({ text: error.message, type: 'error' });
      setIsLoading(false);
    }
  };

  return (
    <div className="flex-center" style={{ minHeight: 'calc(100vh - 100px)', padding: '24px' }}>
      <div className="glass-panel" style={{ width: '100%', maxWidth: '400px', padding: '32px', textAlign: 'center' }}>
        <h1 style={{ marginBottom: '8px', fontSize: '2rem', fontWeight: 'bold', color: 'var(--primary)', fontFamily: 'var(--font-serif)' }}>
          Kalyanamitta
        </h1>
        <p style={{ marginBottom: '32px', color: 'var(--text-muted)' }}>
          {isSignUp ? 'නව ගිණුමක් සාදන්න' : 'ඔබගේ ගිණුමට පිවිසෙන්න'}
        </p>
        
        {message.text && (
          <div style={{
            marginBottom: '16px',
            padding: '12px',
            borderRadius: '6px',
            fontSize: '0.85rem',
            background: message.type === 'error' ? '#fef2f2' : '#f0fdf4',
            color: message.type === 'error' ? '#991b1b' : '#166534',
            border: `1px solid ${message.type === 'error' ? '#fecaca' : '#bbf7d0'}`
          }}>
            {message.text}
          </div>
        )}

        <form onSubmit={handleAuth} style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '24px' }}>
          <input
            type="email"
            placeholder="විද්‍යුත් තැපෑල (Email)"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{
              width: '100%',
              padding: '12px 16px',
              borderRadius: '6px',
              border: '1px solid rgba(0,0,0,0.1)',
              fontFamily: 'var(--font-sinhala)',
              outline: 'none',
              transition: 'border-color 0.2s',
              background: '#fff',
              color: 'var(--text-main)'
            }}
            onFocus={(e) => e.target.style.borderColor = 'var(--primary)'}
            onBlur={(e) => e.target.style.borderColor = 'rgba(0,0,0,0.1)'}
          />
          <input
            type="password"
            placeholder="මුරපදය (Password)"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{
              width: '100%',
              padding: '12px 16px',
              borderRadius: '6px',
              border: '1px solid rgba(0,0,0,0.1)',
              fontFamily: 'var(--font-sinhala)',
              outline: 'none',
              transition: 'border-color 0.2s',
              background: '#fff',
              color: 'var(--text-main)'
            }}
            onFocus={(e) => e.target.style.borderColor = 'var(--primary)'}
            onBlur={(e) => e.target.style.borderColor = 'rgba(0,0,0,0.1)'}
          />
          <button
            type="submit"
            disabled={isLoading}
            style={{
              width: '100%',
              padding: '12px',
              borderRadius: '6px',
              background: 'var(--primary)',
              color: '#fff',
              fontFamily: 'var(--font-sinhala)',
              fontWeight: '600',
              border: 'none',
              cursor: isLoading ? 'not-allowed' : 'pointer',
              opacity: isLoading ? 0.7 : 1,
              transition: 'all 0.2s'
            }}
          >
            {isLoading ? 'කරුණාකර රැඳී සිටින්න...' : (isSignUp ? 'ලියාපදිංචි වන්න' : 'ඇතුල් වන්න')}
          </button>
        </form>

        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
          <div style={{ flex: 1, height: '1px', background: 'rgba(0,0,0,0.1)' }}></div>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Or</span>
          <div style={{ flex: 1, height: '1px', background: 'rgba(0,0,0,0.1)' }}></div>
        </div>

        <button
          onClick={handleGoogleLogin}
          disabled={isLoading}
          type="button"
          style={{
            display: 'flex',
            width: '100%',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '12px',
            borderRadius: '6px',
            background: '#fff',
            padding: '12px',
            fontSize: '0.85rem',
            fontWeight: '500',
            border: '1px solid rgba(0,0,0,0.1)',
            cursor: isLoading ? 'not-allowed' : 'pointer',
            opacity: isLoading ? 0.7 : 1,
            color: 'var(--text-main)',
            transition: 'background 0.2s'
          }}
          onMouseEnter={(e) => { if(!isLoading) e.currentTarget.style.background = '#f9fafb' }}
          onMouseLeave={(e) => { e.currentTarget.style.background = '#fff' }}
        >
          <svg viewBox="0 0 24 24" style={{ height: '20px', width: '20px' }}>
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
          </svg>
          Google හරහා පිවිසෙන්න
        </button>

        <p style={{ marginTop: '32px', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
          {isSignUp ? 'දැනටමත් ගිණුමක් තිබේද?' : 'නව ගිණුමක් අවශ්‍යද?'}
          <button 
            onClick={() => setIsSignUp(!isSignUp)} 
            style={{
              marginLeft: '8px',
              background: 'none',
              border: 'none',
              color: 'var(--primary)',
              fontWeight: '600',
              cursor: 'pointer',
              textDecoration: 'none'
            }}
            onMouseEnter={(e) => e.currentTarget.style.textDecoration = 'underline'}
            onMouseLeave={(e) => e.currentTarget.style.textDecoration = 'none'}
          >
            {isSignUp ? 'ඇතුල් වන්න' : 'ලියාපදිංචි වන්න'}
          </button>
        </p>
      </div>
    </div>
  );
}
