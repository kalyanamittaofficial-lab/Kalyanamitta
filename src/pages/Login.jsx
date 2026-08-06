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

  return (
    <div className="flex-center" style={{ minHeight: 'calc(100vh - 100px)', padding: '24px', background: 'radial-gradient(circle at top, var(--bg-secondary) 0%, var(--bg-main) 100%)' }}>
      <div 
        className="glass-panel" 
        style={{ 
          width: '100%', maxWidth: '420px', padding: '48px 40px', textAlign: 'center',
          boxShadow: '0 20px 40px rgba(0,0,0,0.08), 0 1px 3px rgba(0,0,0,0.05)', borderRadius: '24px',
          transition: 'transform 0.4s cubic-bezier(0.165, 0.84, 0.44, 1)'
        }}
        onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-4px)'}
        onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
      >
        <h1 style={{ marginBottom: '12px', fontSize: '2.25rem', fontWeight: '800', color: 'var(--primary)', fontFamily: 'var(--font-serif)', letterSpacing: '-0.02em' }}>
          Kalyanamitta
        </h1>
        <p style={{ marginBottom: '36px', color: 'var(--text-muted)', fontSize: '0.95rem', fontFamily: 'var(--font-sinhala)' }}>
          ඔබගේ ගිණුමට පිවිසෙන්න
        </p>
        
        {message.text && (
          <div style={{
            marginBottom: '20px', padding: '14px', borderRadius: '12px', fontSize: '0.85rem', fontFamily: 'var(--font-sinhala)',
            background: message.type === 'error' ? '#fff1f2' : '#f0fdf4', color: message.type === 'error' ? '#9f1239' : '#166534',
            border: `1px solid ${message.type === 'error' ? '#fecdd3' : '#bbf7d0'}`, animation: 'fadeIn 0.3s ease-out'
          }}>
            {message.text}
          </div>
        )}

        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginBottom: '28px' }}>
          <div style={{ position: 'relative' }}>
            <input type="email" placeholder="විද්‍යුත් තැපෑල (Email)" value={email} onChange={(e) => setEmail(e.target.value)} required
              style={{
                width: '100%', padding: '14px 18px', borderRadius: '12px',
                border: `2px solid ${focusedInput === 'email' ? 'var(--primary)' : 'var(--glass-border)'}`,
                fontFamily: 'var(--font-sinhala)', fontSize: '0.95rem', outline: 'none', transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                background: focusedInput === 'email' ? '#fff' : 'rgba(255, 255, 255, 0.5)', color: 'var(--text-main)',
                boxShadow: focusedInput === 'email' ? '0 4px 12px rgba(153, 27, 27, 0.1)' : 'none'
              }}
              onFocus={() => setFocusedInput('email')} onBlur={() => setFocusedInput(null)}
            />
          </div>
          <div style={{ position: 'relative' }}>
            <input type="password" placeholder="මුරපදය (Password)" value={password} onChange={(e) => setPassword(e.target.value)} required
              style={{
                width: '100%', padding: '14px 18px', borderRadius: '12px',
                border: `2px solid ${focusedInput === 'password' ? 'var(--primary)' : 'var(--glass-border)'}`,
                fontFamily: 'var(--font-sinhala)', fontSize: '0.95rem', outline: 'none', transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                background: focusedInput === 'password' ? '#fff' : 'rgba(255, 255, 255, 0.5)', color: 'var(--text-main)',
                boxShadow: focusedInput === 'password' ? '0 4px 12px rgba(153, 27, 27, 0.1)' : 'none'
              }}
              onFocus={() => setFocusedInput('password')} onBlur={() => setFocusedInput(null)}
            />
          </div>
          <button type="submit" disabled={isLoading}
            style={{
              width: '100%', padding: '14px', marginTop: '4px', borderRadius: '12px', background: 'var(--primary)', color: '#fff',
              fontFamily: 'var(--font-sinhala)', fontSize: '1rem', fontWeight: '600', border: 'none',
              cursor: isLoading ? 'not-allowed' : 'pointer', opacity: isLoading ? 0.7 : 1, transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              boxShadow: '0 8px 20px rgba(153, 27, 27, 0.25)'
            }}
            onMouseEnter={(e) => { if(!isLoading) { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 12px 24px rgba(153, 27, 27, 0.35)'; } }}
            onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 8px 20px rgba(153, 27, 27, 0.25)'; }}
          >
            {isLoading ? 'කරුණාකර රැඳී සිටින්න...' : 'ඇතුල් වන්න'}
          </button>
        </form>

        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '28px' }}>
          <div style={{ flex: 1, height: '1px', background: 'var(--glass-border)' }}></div>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: '500' }}>Or continue with</span>
          <div style={{ flex: 1, height: '1px', background: 'var(--glass-border)' }}></div>
        </div>

        <button onClick={handleGoogleLogin} disabled={isLoading} type="button"
          style={{
            display: 'flex', width: '100%', alignItems: 'center', justifyContent: 'center', gap: '12px',
            borderRadius: '12px', background: '#fff', padding: '14px', fontSize: '0.95rem', fontFamily: 'var(--font-sinhala)',
            fontWeight: '600', border: '2px solid var(--glass-border)', cursor: isLoading ? 'not-allowed' : 'pointer',
            opacity: isLoading ? 0.7 : 1, color: 'var(--text-main)', transition: 'all 0.3s ease', boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
          }}
          onMouseEnter={(e) => { if(!isLoading) { e.currentTarget.style.background = '#f9fafb'; e.currentTarget.style.borderColor = 'rgba(0,0,0,0.1)'; e.currentTarget.style.transform = 'translateY(-1px)'; } }}
          onMouseLeave={(e) => { e.currentTarget.style.background = '#fff'; e.currentTarget.style.borderColor = 'var(--glass-border)'; e.currentTarget.style.transform = 'translateY(0)'; }}
        >
          <svg viewBox="0 0 24 24" style={{ height: '22px', width: '22px' }}>
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
          </svg>
          Google හරහා පිවිසෙන්න
        </button>

        <p style={{ marginTop: '36px', fontSize: '0.9rem', color: 'var(--text-muted)', fontFamily: 'var(--font-sinhala)' }}>
          නව ගිණුමක් අවශ්‍යද?
          <button 
            onClick={() => navigate('/register')} 
            style={{
              marginLeft: '8px', background: 'none', border: 'none', color: 'var(--primary)',
              fontWeight: '600', cursor: 'pointer', textDecoration: 'none', transition: 'color 0.2s', fontFamily: 'var(--font-sinhala)'
            }}
            onMouseEnter={(e) => { e.currentTarget.style.textDecoration = 'underline'; e.currentTarget.style.color = 'var(--primary-hover)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.textDecoration = 'none'; e.currentTarget.style.color = 'var(--primary)'; }}
          >
            ලියාපදිංචි වන්න
          </button>
        </p>
      </div>
    </div>
  );
}
