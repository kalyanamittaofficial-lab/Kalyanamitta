import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../utils/supabase';
import { ShieldCheck, Eye, EyeOff, Loader2, AlertCircle } from 'lucide-react';

export default function AdminLogin() {
  const navigate = useNavigate();
  const [kmId,      setKmId]      = useState('');
  const [password,  setPassword]  = useState('');
  const [showPass,  setShowPass]  = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error,     setError]     = useState('');
  const [focusId,   setFocusId]   = useState(false);
  const [focusPw,   setFocusPw]   = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    const formattedId    = kmId.trim().toUpperCase();
    const internalEmail  = `${formattedId}@admin.km`;

    try {
      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email: internalEmail, password,
      });
      if (authError) throw authError;

      const { data: roleData, error: roleError } = await supabase
        .from('user_roles').select('role').eq('id', data.user.id).single();

      if (roleError) {
        await supabase.auth.signOut();
        throw new Error(`Role check failed: ${roleError.message}`);
      }
      if (!roleData || (roleData.role !== 'superadmin' && roleData.role !== 'editor')) {
        await supabase.auth.signOut();
        throw new Error('Unauthorized. Your ID does not have admin access.');
      }

      navigate('/portal-ops');
    } catch (err) {
      setError(err.message.includes('Invalid login credentials')
        ? 'Invalid Kalyanamitta ID or Security Key.'
        : err.message
      );
    } finally {
      setIsLoading(false);
    }
  };

  const inputStyle = (focused) => ({
    width: '100%', padding: '12px 16px',
    borderRadius: '10px',
    border: `1px solid ${focused ? 'rgba(140,21,21,0.6)' : 'rgba(255,255,255,0.08)'}`,
    background: focused ? 'rgba(140,21,21,0.05)' : '#18181b',
    color: '#fff', fontSize: '0.95rem', outline: 'none',
    transition: 'all 0.2s', boxSizing: 'border-box',
  });

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: '#0d0d0f', padding: '24px',
      backgroundImage: 'radial-gradient(ellipse at 50% 0%, rgba(140,21,21,0.08) 0%, transparent 60%)',
    }}>
      <div style={{ width: '100%', maxWidth: '400px' }}>

        {/* Brand mark */}
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
            width: '56px', height: '56px', borderRadius: '16px',
            background: 'rgba(140,21,21,0.15)', border: '1px solid rgba(140,21,21,0.3)',
            marginBottom: '20px',
          }}>
            <ShieldCheck size={26} color="#c0392b" />
          </div>
          <h1 style={{ color: '#fff', fontSize: '1.5rem', fontWeight: 800, margin: '0 0 6px 0', letterSpacing: '-0.5px' }}>
            KM Portal Ops
          </h1>
          <p style={{ color: '#555', fontSize: '0.85rem', margin: 0, textTransform: 'uppercase', letterSpacing: '1.5px', fontWeight: 600 }}>
            Authorized Access Only
          </p>
        </div>

        {/* Error banner */}
        {error && (
          <div style={{
            display: 'flex', alignItems: 'flex-start', gap: '10px',
            background: 'rgba(220,38,38,0.08)', border: '1px solid rgba(220,38,38,0.25)',
            borderRadius: '10px', padding: '12px 16px',
            color: '#ef4444', fontSize: '0.875rem', marginBottom: '24px', lineHeight: 1.5,
          }}>
            <AlertCircle size={16} style={{ flexShrink: 0, marginTop: '2px' }} />
            {error}
          </div>
        )}

        {/* Form card */}
        <div style={{
          background: '#111113', border: '1px solid rgba(255,255,255,0.07)',
          borderRadius: '16px', padding: '32px',
        }}>
          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

            {/* KM ID */}
            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', color: '#555', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 700, marginBottom: '8px' }}>
                Kalyanamitta ID
              </label>
              <input
                type="text" required
                placeholder="e.g., KM-001"
                value={kmId}
                onChange={e => setKmId(e.target.value)}
                onFocus={() => setFocusId(true)}
                onBlur={() => setFocusId(false)}
                style={inputStyle(focusId)}
                autoComplete="username"
              />
            </div>

            {/* Password */}
            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', color: '#555', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 700, marginBottom: '8px' }}>
                Security Key
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showPass ? 'text' : 'password'} required
                  placeholder="••••••••••"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  onFocus={() => setFocusPw(true)}
                  onBlur={() => setFocusPw(false)}
                  style={{ ...inputStyle(focusPw), paddingRight: '44px' }}
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPass(s => !s)}
                  style={{
                    position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)',
                    background: 'none', border: 'none', color: '#555', cursor: 'pointer',
                    padding: '4px', display: 'flex', transition: 'color 0.2s',
                  }}
                  onMouseEnter={e => e.currentTarget.style.color = '#fff'}
                  onMouseLeave={e => e.currentTarget.style.color = '#555'}
                >
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isLoading}
              style={{
                marginTop: '4px',
                width: '100%', padding: '14px',
                borderRadius: '10px', border: 'none',
                background: isLoading ? 'rgba(140,21,21,0.4)' : '#8c1515',
                color: '#fff', fontWeight: 700, fontSize: '0.9rem',
                letterSpacing: '0.5px', cursor: isLoading ? 'not-allowed' : 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                transition: 'all 0.2s',
                boxShadow: isLoading ? 'none' : '0 4px 20px rgba(140,21,21,0.3)',
              }}
              onMouseEnter={e => { if (!isLoading) e.currentTarget.style.background = '#a01818'; }}
              onMouseLeave={e => { if (!isLoading) e.currentTarget.style.background = '#8c1515'; }}
            >
              {isLoading
                ? <><Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} /> Verifying…</>
                : 'Access Portal'
              }
            </button>
          </form>
        </div>

        <p style={{ textAlign: 'center', color: '#333', fontSize: '0.78rem', marginTop: '24px' }}>
          This portal is restricted to authorized Kalyanamitta administrators only.
        </p>
      </div>

      <style>{`@keyframes spin { 100% { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
