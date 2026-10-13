import React, { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import {
  Shield, Fingerprint, Info, CheckCircle2, Loader2,
  Users, UserPlus, Trash2, Edit3, Copy, ShieldAlert,
  ShieldCheck, AlertTriangle, Check
} from 'lucide-react';
import { supabase } from '../../utils/supabase';

export default function TeamManager() {
  const { userRole, showToast, openConfirmModal } = useOutletContext() || {};
  const [teamMembers, setTeamMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [targetUid, setTargetUid] = useState('');
  const [role, setRole] = useState('editor');
  const [assigning, setAssigning] = useState(false);

  useEffect(() => {
    if (userRole === 'superadmin') {
      fetchTeamMembers();
    }
  }, [userRole]);

  const fetchTeamMembers = async () => {
    setLoading(true);
    try {
      // 1. Fetch user roles
      const { data: rolesData, error: rolesError } = await supabase
        .from('user_roles')
        .select('*')
        .order('created_at', { ascending: false });

      if (rolesError) throw rolesError;

      // 2. Fetch profiles to match names & KM IDs
      const { data: profilesData } = await supabase
        .from('profiles')
        .select('id, name, kalyanamitta_id, mobile_number');

      const profilesMap = (profilesData || []).reduce((acc, p) => {
        acc[p.id] = p;
        return acc;
      }, {});

      const combined = (rolesData || []).map((r) => ({
        ...r,
        profile: profilesMap[r.id] || null,
      }));

      setTeamMembers(combined);
    } catch (err) {
      showToast?.('error', 'Error loading team roster: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  if (userRole !== 'superadmin') {
    return (
      <div className="adm-card" style={{ textAlign: 'center', padding: '60px 24px', maxWidth: '500px', margin: '40px auto' }}>
        <ShieldAlert size={48} color="var(--adm-live)" style={{ margin: '0 auto 16px auto' }} />
        <h2 style={{ fontSize: '1.4rem', color: 'var(--adm-text-main)', margin: '0 0 8px 0' }}>Access Restricted</h2>
        <p style={{ color: 'var(--adm-text-muted)', margin: 0, fontSize: '0.9rem' }}>
          Only Super Administrators hold security clearance to view and manage team privileges.
        </p>
      </div>
    );
  }

  const handleAssignRole = async (e) => {
    e.preventDefault();
    const cleanUid = targetUid.trim();
    if (!cleanUid) return;

    setAssigning(true);
    try {
      // Try assigning via RPC first
      const { error: rpcError } = await supabase.rpc('assign_admin_role', {
        p_user_id: cleanUid,
        p_role: role,
      });

      if (rpcError) {
        // Fallback: direct upsert into user_roles
        const { error: directError } = await supabase
          .from('user_roles')
          .upsert({ id: cleanUid, role }, { onConflict: 'id' });

        if (directError) throw directError;
      }

      showToast?.('success', `Privileges granted! User assigned as ${role}.`);
      setTargetUid('');
      fetchTeamMembers();
    } catch (err) {
      showToast?.('error', `Failed to assign role: ${err.message}`);
    } finally {
      setAssigning(false);
    }
  };

  const handleChangeRole = (member, nextRole) => {
    openConfirmModal?.({
      title: 'Update Access Privileges?',
      message: `Change permission level for ${member.profile?.name || member.id} to ${nextRole.toUpperCase()}?`,
      confirmText: 'Change Role',
      onConfirm: async () => {
        const { error } = await supabase
          .from('user_roles')
          .update({ role: nextRole })
          .eq('id', member.id);

        if (error) throw error;
        showToast?.('success', `Role updated to ${nextRole}.`);
        fetchTeamMembers();
      },
    });
  };

  const handleRevokeRole = (member) => {
    openConfirmModal?.({
      title: 'Revoke Administrator Access?',
      message: `Are you sure you want to revoke administrative clearance for ${member.profile?.name || member.id}? They will no longer be able to log in to this portal.`,
      confirmText: 'Revoke Access',
      danger: true,
      onConfirm: async () => {
        const { error } = await supabase
          .from('user_roles')
          .delete()
          .eq('id', member.id);

        if (error) throw error;
        showToast?.('success', 'Admin access successfully revoked.');
        fetchTeamMembers();
      },
    });
  };

  const copyToClipboard = (text, label) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
      showToast?.('success', `${label} copied to clipboard!`);
    }
  };

  return (
    <div style={{ maxWidth: '1240px', margin: '0 auto', paddingBottom: '60px' }}>
      
      {/* ── Page Header ── */}
      <div style={{ marginBottom: '32px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
          <span className="adm-badge adm-badge-info">
            <ShieldCheck size={13} /> SUPERADMIN SECURITY GOVERNANCE
          </span>
        </div>
        <h1
          style={{
            fontSize: '2rem',
            fontWeight: 800,
            margin: '0 0 6px 0',
            color: 'var(--adm-text-main)',
            letterSpacing: '-0.5px',
          }}
        >
          Team & Access Governance
        </h1>
        <p style={{ color: 'var(--adm-text-muted)', margin: 0, fontSize: '0.95rem' }}>
          Grant or revoke operational privileges, audit active administrators, and manage portal security.
        </p>
      </div>

      {/* ── Grid: Assign Form & Instructions ── */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
          gap: '24px',
          marginBottom: '36px',
        }}
      >
        {/* Assignment Form */}
        <div className="adm-card" style={{ padding: '28px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
            <UserPlus size={20} color="var(--adm-primary)" />
            <h3 style={{ margin: 0, fontSize: '1.15rem', color: 'var(--adm-text-main)', fontWeight: 700 }}>
              Grant Admin Clearance
            </h3>
          </div>

          <form onSubmit={handleAssignRole} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div className="adm-input-group">
              <label className="adm-label">
                <Fingerprint size={16} color="var(--adm-text-muted)" /> Target User UID *
              </label>
              <input
                type="text"
                className="adm-input"
                value={targetUid}
                onChange={(e) => setTargetUid(e.target.value)}
                placeholder="e.g. 550e8400-e29b-41d4-a716-446655440000"
                required
                style={{ fontFamily: 'monospace', fontSize: '0.9rem' }}
              />
            </div>

            <div className="adm-input-group">
              <label className="adm-label">
                <Shield size={16} color="var(--adm-text-muted)" /> Security Clearance Level
              </label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="adm-select"
              >
                <option value="editor">Editor (Can manage Notices & Live Broadcast)</option>
                <option value="superadmin">Super Admin (Full clearance + Team Governance)</option>
              </select>
            </div>

            <button
              type="submit"
              disabled={assigning}
              className="adm-btn adm-btn-primary"
              style={{ padding: '13px', marginTop: '6px' }}
            >
              {assigning ? (
                <><Loader2 size={16} className="adm-spin" /> Authorizing…</>
              ) : (
                'Grant Privileges'
              )}
            </button>
          </form>
        </div>

        {/* Instructions Guide */}
        <div
          className="adm-card"
          style={{
            padding: '28px',
            background: 'linear-gradient(135deg, rgba(196, 152, 79, 0.06) 0%, rgba(20, 20, 24, 0.95) 100%)',
            border: '1px solid rgba(196, 152, 79, 0.25)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
            <Info size={20} color="var(--adm-gold)" />
            <h3 style={{ margin: 0, fontSize: '1.15rem', color: 'var(--adm-gold)', fontWeight: 700 }}>
              How to Provision a New Admin
            </h3>
          </div>

          <ol
            style={{
              paddingLeft: '20px',
              color: 'var(--adm-text-muted)',
              fontSize: '0.88rem',
              lineHeight: 1.8,
              margin: 0,
              display: 'flex',
              flexDirection: 'column',
              gap: '6px',
            }}
          >
            <li>
              Open your <strong>Supabase Project Dashboard</strong> &rarr; <strong>Authentication &rarr; Users</strong>.
            </li>
            <li>Click <strong>"Add User"</strong> &rarr; <strong>"Create New User"</strong>.</li>
            <li>
              For Email, follow the internal ID pattern:{' '}
              <code style={{ background: 'rgba(255,255,255,0.08)', padding: '2px 6px', borderRadius: '4px', color: '#fff' }}>
                KM-123@admin.km
              </code>
            </li>
            <li>Assign a secure Key (Password) and confirm user creation.</li>
            <li>
              Copy their newly created <strong>User UID</strong> and paste it into the form on the left.
            </li>
          </ol>
        </div>
      </div>

      {/* ── Active Personnel Roster ── */}
      <div className="adm-card" style={{ padding: '28px' }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '22px',
            flexWrap: 'wrap',
            gap: '12px',
          }}
        >
          <div>
            <h3 style={{ margin: '0 0 4px 0', fontSize: '1.2rem', color: 'var(--adm-text-main)', fontWeight: 700 }}>
              Active Personnel Roster
            </h3>
            <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--adm-text-muted)' }}>
              All accounts currently granted access to the Kalyanamitta Portal Ops.
            </p>
          </div>

          <span className="adm-badge adm-badge-info">
            {teamMembers.length} {teamMembers.length === 1 ? 'Administrator' : 'Administrators'}
          </span>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '40px', color: 'var(--adm-text-muted)' }}>
            <Loader2 size={26} className="adm-spin" style={{ margin: '0 auto 10px auto' }} />
            <div>Loading team directory…</div>
          </div>
        ) : teamMembers.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px', color: 'var(--adm-text-muted)' }}>
            No authorized members found.
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {teamMembers.map((member) => (
              <div
                key={member.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '16px 20px',
                  borderRadius: '12px',
                  background: 'rgba(255, 255, 255, 0.02)',
                  border: '1px solid var(--adm-border-subtle)',
                  flexWrap: 'wrap',
                  gap: '14px',
                }}
              >
                {/* User Info */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px', minWidth: '280px', flex: 1 }}>
                  <div
                    style={{
                      width: '42px',
                      height: '42px',
                      borderRadius: '10px',
                      background:
                        member.role === 'superadmin'
                          ? 'rgba(163, 28, 28, 0.2)'
                          : 'rgba(59, 130, 246, 0.15)',
                      border: `1px solid ${
                        member.role === 'superadmin'
                          ? 'rgba(163, 28, 28, 0.4)'
                          : 'rgba(59, 130, 246, 0.3)'
                      }`,
                      color: member.role === 'superadmin' ? 'var(--adm-primary)' : 'var(--adm-info)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 800,
                      fontSize: '1rem',
                      flexShrink: 0,
                    }}
                  >
                    {member.profile?.name?.[0]?.toUpperCase() ||
                      member.profile?.kalyanamitta_id?.[0]?.toUpperCase() ||
                      'A'}
                  </div>

                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ fontSize: '0.96rem', fontWeight: 700, color: 'var(--adm-text-main)' }}>
                        {member.profile?.name || member.profile?.kalyanamitta_id || 'Portal Admin'}
                      </span>
                      <span
                        className={`adm-badge ${
                          member.role === 'superadmin' ? 'adm-badge-live' : 'adm-badge-info'
                        }`}
                        style={{ fontSize: '0.68rem', padding: '2px 8px' }}
                      >
                        {member.role === 'superadmin' ? 'Super Admin' : 'Editor'}
                      </span>
                    </div>

                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        fontSize: '0.78rem',
                        color: 'var(--adm-text-dim)',
                        marginTop: '3px',
                      }}
                    >
                      <span style={{ fontFamily: 'monospace' }}>
                        UID: {member.id.slice(0, 12)}…{member.id.slice(-6)}
                      </span>
                      <button
                        onClick={() => copyToClipboard(member.id, 'User UID')}
                        title="Copy full UID"
                        style={{ background: 'none', border: 'none', color: 'var(--adm-text-dim)', cursor: 'pointer', padding: '2px' }}
                      >
                        <Copy size={12} />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Role Switcher & Revoke */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <select
                    value={member.role}
                    onChange={(e) => handleChangeRole(member, e.target.value)}
                    className="adm-select"
                    style={{ padding: '8px 12px', fontSize: '0.82rem', width: 'auto' }}
                  >
                    <option value="editor">Editor</option>
                    <option value="superadmin">Super Admin</option>
                  </select>

                  <button
                    onClick={() => handleRevokeRole(member)}
                    className="adm-btn adm-btn-danger"
                    style={{ padding: '8px 14px', fontSize: '0.82rem' }}
                    title="Revoke Admin Access"
                  >
                    <Trash2 size={14} /> Revoke
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}
