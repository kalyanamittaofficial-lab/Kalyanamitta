import React, { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { Mail, Shield } from 'lucide-react';

export default function TeamManager() {
  const { userRole } = useOutletContext();
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('editor');

  if (userRole !== 'superadmin') {
    return <div style={{ color: 'red' }}>Unauthorized Access</div>;
  }

  const handleInvite = (e) => {
    e.preventDefault();
    alert(`Invite sent to ${email} as ${role}. (Needs Supabase Admin API)`);
    setEmail('');
  };

  return (
    <div>
      <h1 style={{ fontSize: '2rem', fontFamily: 'var(--font-serif)', fontWeight: '400', marginBottom: '8px' }}>Team Management</h1>
      <p style={{ color: 'var(--text-muted)', marginBottom: '40px' }}>Invite new administrators to manage the portal.</p>

      <div style={{ background: 'var(--bg-main)', border: '1px solid var(--glass-border)', padding: '32px', maxWidth: '600px' }}>
        <h3 style={{ fontSize: '1.2rem', fontFamily: 'var(--font-serif)', marginBottom: '24px' }}>Invite Team Member</h3>
        
        <form onSubmit={handleInvite} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: '600', marginBottom: '8px', color: 'var(--text-muted)' }}>Email Address</label>
            <div style={{ display: 'flex', alignItems: 'center', border: '1px solid var(--glass-border)', background: 'var(--bg-secondary)', padding: '12px' }}>
              <Mail size={18} color="var(--text-muted)" style={{ marginRight: '12px' }} />
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@example.com" 
                required
                style={{ background: 'transparent', border: 'none', width: '100%', color: 'var(--text-main)', outline: 'none' }} 
              />
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: '600', marginBottom: '8px', color: 'var(--text-muted)' }}>Assign Role</label>
            <div style={{ display: 'flex', alignItems: 'center', border: '1px solid var(--glass-border)', background: 'var(--bg-secondary)', padding: '12px' }}>
              <Shield size={18} color="var(--text-muted)" style={{ marginRight: '12px' }} />
              <select 
                value={role}
                onChange={(e) => setRole(e.target.value)}
                style={{ background: 'transparent', border: 'none', width: '100%', color: 'var(--text-main)', outline: 'none', appearance: 'none' }}
              >
                <option value="editor">Editor (Can manage notices)</option>
                <option value="superadmin">Super Admin (Full access)</option>
              </select>
            </div>
          </div>

          <button type="submit" style={{ background: 'var(--text-main)', color: 'var(--bg-main)', border: 'none', padding: '14px', fontWeight: '600', cursor: 'pointer', marginTop: '12px' }}>
            Send Invite
          </button>
        </form>
      </div>
    </div>
  );
}
