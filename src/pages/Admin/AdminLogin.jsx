import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../utils/supabase';

export default function AdminLogin() {
  const navigate = useNavigate();
  const [kmId, setKmId] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    // Transform KM ID into a hidden, secure internal email for Supabase Auth
    const formattedId = kmId.trim().toUpperCase();
    const internalEmail = `${formattedId}@admin.km`;

    try {
      const { data, error: authError } = await supabase.auth.signInWithPassword({ 
        email: internalEmail, 
        password 
      });
      
      if (authError) throw authError;

      // Check if they are actually an admin
      const { data: roleData, error: roleError } = await supabase
        .from('user_roles')
        .select('role')
        .eq('id', data.user.id)
        .single();

      if (roleError) {
        await supabase.auth.signOut();
        throw new Error(`Role Check Error: ${roleError.message} (Code: ${roleError.code})`);
      }
      
      if (!roleData || (roleData.role !== 'superadmin' && roleData.role !== 'editor')) {
        await supabase.auth.signOut();
        throw new Error("Unauthorized access. Your ID is not in the Admin list.");
      }

      navigate('/portal-ops');
    } catch (err) {
      if (err.message.includes('Invalid login credentials')) {
        setError('Invalid Kalyanamitta ID or Security Key.');
      } else {
        setError(err.message);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-main)', color: 'var(--text-main)', padding: '20px' }}>
      <div style={{ width: '100%', maxWidth: '400px', background: 'var(--bg-secondary)', padding: '40px', border: '1px solid var(--glass-border)' }}>
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <h2 style={{ fontSize: '1.5rem', fontFamily: 'var(--font-serif)', margin: '0 0 8px 0', letterSpacing: '1px' }}>KM PORTAL OPS</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Authorized Personnel Only</p>
        </div>

        {error && <div style={{ background: '#ffebee', color: '#c62828', padding: '12px', marginBottom: '20px', fontSize: '0.9rem', textAlign: 'center', border: '1px solid #ef9a9a' }}>{error}</div>}

        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px' }}>Kalyanamitta ID</label>
            <input 
              type="text" 
              required
              placeholder="e.g. KM-001"
              value={kmId}
              onChange={(e) => setKmId(e.target.value)}
              style={{ width: '100%', padding: '12px', background: 'var(--bg-main)', border: '1px solid var(--glass-border)', color: 'var(--text-main)', outline: 'none' }}
            />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px' }}>Security Key (Password)</label>
            <input 
              type="password" 
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{ width: '100%', padding: '12px', background: 'var(--bg-main)', border: '1px solid var(--glass-border)', color: 'var(--text-main)', outline: 'none' }}
            />
          </div>
          <button 
            type="submit" 
            disabled={isLoading}
            style={{ width: '100%', padding: '14px', background: 'var(--text-main)', color: 'var(--bg-main)', border: 'none', cursor: 'pointer', fontWeight: 'bold', marginTop: '10px' }}
          >
            {isLoading ? 'VERIFYING...' : 'ACCESS PORTAL'}
          </button>
        </form>
      </div>
    </div>
  );
}
