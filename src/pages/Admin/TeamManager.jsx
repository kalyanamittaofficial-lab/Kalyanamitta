import React, { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { Shield, Fingerprint, Info, CheckCircle2, Loader2 } from 'lucide-react';
import { supabase } from '../../utils/supabase';

export default function TeamManager() {
  const { userRole } = useOutletContext();
  const [targetUid, setTargetUid] = useState('');
  const [role, setRole] = useState('editor');
  const [status, setStatus] = useState({ loading: false, message: '', type: '' });

  if (userRole !== 'superadmin') {
    return (
      <div style={{ textAlign: 'center', padding: '60px', color: '#8c1515' }}>
        <h2>Access Denied</h2>
        <p>Only Super Admins can access Team Management.</p>
      </div>
    );
  }

  const handleAssignRole = async (e) => {
    e.preventDefault();
    if (!targetUid.trim()) return;

    setStatus({ loading: true, message: '', type: '' });
    
    try {
      // Call the secure RPC function we created in SQL
      const { error } = await supabase.rpc('assign_admin_role', {
        p_user_id: targetUid.trim(),
        p_role: role
      });

      if (error) throw error;

      setStatus({ loading: false, message: 'Admin role assigned successfully!', type: 'success' });
      setTargetUid('');
    } catch (err) {
      setStatus({ loading: false, message: err.message, type: 'error' });
    }
  };

  return (
    <div>
      <h1 style={{ fontSize: '2rem', fontFamily: 'var(--font-serif)', fontWeight: '400', marginBottom: '8px' }}>Team Management</h1>
      <p style={{ color: 'var(--text-muted)', marginBottom: '40px' }}>Securely assign admin privileges to specific users.</p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '32px' }}>
        
        {/* Instructions Panel */}
        <div style={{ background: 'rgba(212, 175, 55, 0.05)', border: '1px solid rgba(212, 175, 55, 0.3)', padding: '32px', borderRadius: '4px' }}>
          <h3 style={{ fontSize: '1.2rem', fontFamily: 'var(--font-serif)', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--primary)' }}>
            <Info size={20} /> How to Add an Admin
          </h3>
          <ol style={{ paddingLeft: '20px', color: 'var(--text-muted)', lineHeight: '1.8', margin: 0 }}>
            <li>Go to your <strong>Supabase Dashboard</strong> (Authentication &gt; Users).</li>
            <li>Click "Add User" &gt; "Create New User".</li>
            <li>For Email, use their Kalyanamitta ID like this: <br/><code>KM-123@admin.km</code></li>
            <li>Set a strong Security Key (Password).</li>
            <li>Copy their new <strong>User UID</strong> and paste it here.</li>
          </ol>
        </div>

        {/* Assignment Form */}
        <div style={{ background: 'var(--bg-main)', border: '1px solid var(--glass-border)', padding: '32px', borderRadius: '4px' }}>
          <h3 style={{ fontSize: '1.2rem', fontFamily: 'var(--font-serif)', marginBottom: '24px' }}>Assign Role</h3>
          
          {status.message && (
            <div style={{ padding: '12px', marginBottom: '20px', background: status.type === 'error' ? '#ffebee' : '#e8f5e9', color: status.type === 'error' ? '#c62828' : '#2e7d32', border: `1px solid ${status.type === 'error' ? '#ef9a9a' : '#a5d6a7'}`, display: 'flex', alignItems: 'center', gap: '8px' }}>
              {status.type === 'success' && <CheckCircle2 size={18} />}
              {status.message}
            </div>
          )}

          <form onSubmit={handleAssignRole} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: '600', marginBottom: '8px', color: 'var(--text-muted)' }}>Target User UID</label>
              <div style={{ display: 'flex', alignItems: 'center', border: '1px solid var(--glass-border)', background: 'var(--bg-secondary)', padding: '12px' }}>
                <Fingerprint size={18} color="var(--text-muted)" style={{ marginRight: '12px' }} />
                <input 
                  type="text" 
                  value={targetUid}
                  onChange={(e) => setTargetUid(e.target.value)}
                  placeholder="e.g. 550e8400-e29b-41d4-a716-446655440000" 
                  required
                  style={{ background: 'transparent', border: 'none', width: '100%', color: 'var(--text-main)', outline: 'none', fontFamily: 'monospace' }} 
                />
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: '600', marginBottom: '8px', color: 'var(--text-muted)' }}>Access Level</label>
              <div style={{ display: 'flex', alignItems: 'center', border: '1px solid var(--glass-border)', background: 'var(--bg-secondary)', padding: '12px' }}>
                <Shield size={18} color="var(--text-muted)" style={{ marginRight: '12px' }} />
                <select 
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  style={{ background: 'transparent', border: 'none', width: '100%', color: 'var(--text-main)', outline: 'none', appearance: 'none' }}
                >
                  <option value="editor">Editor (Can manage notices only)</option>
                  <option value="superadmin">Super Admin (Full access)</option>
                </select>
              </div>
            </div>

            <button type="submit" disabled={status.loading} style={{ background: 'var(--text-main)', color: 'var(--bg-main)', border: 'none', padding: '14px', fontWeight: '600', cursor: 'pointer', marginTop: '12px', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px' }}>
              {status.loading ? <><Loader2 size={18} className="spin" /> ASSIGNING...</> : 'ASSIGN ROLE'}
            </button>
          </form>
        </div>
      </div>
      <style>{`
        .spin { animation: spin 1s linear infinite; }
        @keyframes spin { 100% { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}
