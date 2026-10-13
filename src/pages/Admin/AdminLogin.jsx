import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '../../utils/supabase';
import { ShieldCheck, Eye, EyeOff, Loader2, AlertCircle, ArrowLeft } from 'lucide-react';
import './adminTheme.css';

export default function AdminLogin() {
  const navigate = useNavigate();
  const [kmId, setKmId] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    const formattedId = kmId.trim().toUpperCase();
    const internalEmail = `${formattedId}@admin.km`;

    try {
      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email: internalEmail,
        password,
      });
      if (authError) throw authError;

      const { data: roleData, error: roleError } = await supabase
        .from('user_roles')
        .select('role')
        .eq('id', data.user.id)
        .single();

      if (roleError) {
        await supabase.auth.signOut();
        throw new Error(`Role check failed: ${roleError.message}`);
      }
      if (!roleData || (roleData.role !== 'superadmin' && roleData.role !== 'editor')) {
        await supabase.auth.signOut();
        throw new Error('Unauthorized. Your ID does not hold administrative access.');
      }

      navigate('/portal-ops');
    } catch (err) {
      setError(
        err.message.includes('Invalid login credentials')
          ? 'Invalid Kalyanamitta ID or Security Key.'
          : err.message
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="admin-portal-root"
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'var(--adm-bg-canvas)',
        padding: '24px',
        position: 'relative',
        backgroundImage:
          'radial-gradient(circle at 50% 15%, rgba(163, 28, 28, 0.12) 0%, transparent 60%)',
      }}
    >
      {/* Return to website */}
      <Link
        to="/"
        className="adm-btn adm-btn-ghost"
        style={{
          position: 'absolute',
          top: '24px',
          left: '24px',
          fontSize: '0.86rem',
          gap: '6px',
        }}
      >
        <ArrowLeft size={16} /> Back to Public Website
      </Link>

      <div style={{ width: '100%', maxWidth: '420px' }}>
        {/* Brand mark */}
        <div style={{ textAlign: 'center', marginBottom: '36px' }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '60px',
              height: '60px',
              borderRadius: '18px',
              background: 'linear-gradient(135deg, rgba(163, 28, 28, 0.25) 0%, rgba(107, 15, 15, 0.4) 100%)',
              border: '1px solid rgba(163, 28, 28, 0.4)',
              boxShadow: '0 8px 24px var(--adm-primary-glow)',
              marginBottom: '18px',
            }}
          >
            <ShieldCheck size={30} color="var(--adm-primary)" />
          </div>

          <h1
            style={{
              color: 'var(--adm-text-main)',
              fontSize: '1.65rem',
              fontWeight: 800,
              margin: '0 0 6px 0',
              letterSpacing: '-0.5px',
            }}
          >
            KM Portal Ops
          </h1>
          <p
            style={{
              color: 'var(--adm-text-muted)',
              fontSize: '0.82rem',
              margin: 0,
              textTransform: 'uppercase',
              letterSpacing: '1.8px',
              fontWeight: 700,
            }}
          >
            Authorized Personnel Access
          </p>
        </div>

        {/* Error banner */}
        {error && (
          <div
            style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: '10px',
              background: 'rgba(239, 68, 68, 0.12)',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              borderRadius: '12px',
              padding: '12px 16px',
              color: '#f87171',
              fontSize: '0.875rem',
              marginBottom: '20px',
              lineHeight: 1.5,
              animation: 'admModalPop 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
            }}
          >
            <AlertCircle size={16} style={{ flexShrink: 0, marginTop: '2px' }} />
            <span>{error}</span>
          </div>
        )}

        {/* Form card */}
        <div
          className="adm-card"
          style={{
            padding: '34px 30px',
            boxShadow: '0 20px 50px rgba(0,0,0,0.5)',
          }}
        >
          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {/* KM ID */}
            <div className="adm-input-group">
              <label className="adm-label" style={{ fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.8px' }}>
                Kalyanamitta Admin ID
              </label>
              <input
                type="text"
                required
                placeholder="e.g. KM-001"
                value={kmId}
                onChange={(e) => setKmId(e.target.value)}
                className="adm-input"
                autoComplete="username"
                style={{ height: '46px' }}
              />
            </div>

            {/* Password */}
            <div className="adm-input-group">
              <label className="adm-label" style={{ fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.8px' }}>
                Security Key
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showPass ? 'text' : 'password'}
                  required
                  placeholder="••••••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="adm-input"
                  style={{ paddingRight: '44px', height: '46px' }}
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPass((s) => !s)}
                  style={{
                    position: 'absolute',
                    right: '12px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    color: 'var(--adm-text-dim)',
                    cursor: 'pointer',
                    padding: '4px',
                    display: 'flex',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = '#fff')}
                  onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--adm-text-dim)')}
                >
                  {showPass ? <EyeOff size={17} /> : <Eye size={17} />}
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isLoading}
              className="adm-btn adm-btn-primary"
              style={{
                marginTop: '6px',
                width: '100%',
                padding: '14px',
                fontSize: '0.92rem',
                letterSpacing: '0.5px',
              }}
            >
              {isLoading ? (
                <>
                  <Loader2 size={16} className="adm-spin" /> Verifying Security Clearance…
                </>
              ) : (
                'Access Operations Portal'
              )}
            </button>
          </form>
        </div>

        <p
          style={{
            textAlign: 'center',
            color: 'var(--adm-text-dim)',
            fontSize: '0.78rem',
            marginTop: '24px',
            lineHeight: 1.5,
          }}
        >
          Administrative operations are monitored. Unauthorized access attempts are logged and restricted.
        </p>
      </div>
    </div>
  );
}
