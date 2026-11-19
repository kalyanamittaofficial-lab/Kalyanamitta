import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Network, Users, Sparkles, Lock, ArrowRight, Save } from 'lucide-react';
import {
  getMyPublicProfile,
  saveMyPublicProfile,
  fetchPublicCommunityData
} from '../../services/communityExploreStore';

export default function ExploreCommunity() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('maps'); // 'maps' | 'profiles' | 'anumodana' | 'privacy'
  const [community, setCommunity] = useState({ maps: [], profiles: [], dedications: [] });
  const [loading, setLoading] = useState(true);

  const [profileForm, setProfileForm] = useState(() => getMyPublicProfile());
  const [profileSavedMsg, setProfileSavedMsg] = useState('');

  useEffect(() => {
    let cancelled = false;
    const refresh = () => {
      fetchPublicCommunityData()
        .then(data => {
          if (!cancelled) setCommunity(data);
        })
        .finally(() => {
          if (!cancelled) setLoading(false);
        });
    };

    refresh();
    window.addEventListener('labCommunityUpdated', refresh);
    window.addEventListener('labKnowledgeMapUpdated', refresh);
    window.addEventListener('labPracticeUpdated', refresh);
    return () => {
      cancelled = true;
      window.removeEventListener('labCommunityUpdated', refresh);
      window.removeEventListener('labKnowledgeMapUpdated', refresh);
      window.removeEventListener('labPracticeUpdated', refresh);
    };
  }, []);

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    await saveMyPublicProfile(profileForm);
    setProfileSavedMsg('Privacy & profile settings saved.');
    setTimeout(() => setProfileSavedMsg(''), 3000);
  };

  const tabBtn = (id, label, Icon) => {
    const active = activeTab === id;
    return (
      <button
        onClick={() => setActiveTab(id)}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '6px',
          padding: '8px 15px',
          borderRadius: '999px',
          border: `1px solid ${active ? 'var(--lab-accent)' : 'var(--lab-border)'}`,
          background: active ? 'var(--lab-accent-soft)' : 'var(--lab-bg-elevated)',
          color: active ? 'var(--lab-accent)' : 'var(--lab-text-muted)',
          fontSize: '0.84rem',
          fontWeight: '600',
          cursor: 'pointer'
        }}
      >
        <Icon size={14} />
        <span>{label}</span>
      </button>
    );
  };

  return (
    <div className="km-lab-page">
      {/* Tabs */}
      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '20px' }}>
        {tabBtn('maps', `පොදු සිතියම් (${community.maps.length})`, Network)}
        {tabBtn('profiles', `පැතිකඩ (${community.profiles.length})`, Users)}
        {tabBtn('anumodana', `පුණ්‍යානුමෝදනා (${community.dedications.length})`, Sparkles)}
        {tabBtn('privacy', 'මගේ පෞද්ගලිකත්වය', Lock)}
      </div>

      {loading && activeTab !== 'privacy' ? (
        <div className="km-lab-card" style={{ padding: '36px', textAlign: 'center', color: 'var(--lab-text-muted)' }}>
          පූරණය වෙමින් පවතී...
        </div>
      ) : activeTab === 'maps' ? (
        community.maps.length === 0 ? (
          <div className="km-lab-card" style={{ padding: '40px 24px', textAlign: 'center', color: 'var(--lab-text-muted)' }}>
            තවමත් පොදු සිතියම් බෙදාගෙන නොමැත. <button onClick={() => navigate('/lab/map')} style={{ border: 'none', background: 'transparent', color: 'var(--lab-accent)', fontWeight: '700', cursor: 'pointer', textDecoration: 'underline' }}>මගේ සිතියම</button> වෙතින් සිතියමක් පළ කළ හැක.
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(310px, 1fr))', gap: '14px' }}>
            {community.maps.map(m => (
              <div
                key={m.id}
                onClick={() => navigate(`/lab/maps/${m.id}`)}
                className="km-lab-card km-lab-card-interactive"
                style={{ overflow: 'hidden', cursor: 'pointer', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}
              >
                {/* Mini SVG Map Preview matching 06-explore-maps.png */}
                <div style={{ background: 'var(--lab-bg-subtle)', borderBottom: '1px solid var(--lab-border)', padding: '12px', display: 'flex', justifyContent: 'center' }}>
                  <svg viewBox="0 0 300 95" style={{ width: '100%', maxWidth: '280px', height: '82px' }}>
                    <line x1="65" y1="22" x2="150" y2="48" stroke="var(--lab-text-muted)" strokeWidth="1.2" opacity="0.6" />
                    <line x1="235" y1="22" x2="150" y2="48" stroke="var(--lab-text-muted)" strokeWidth="1.2" opacity="0.6" />
                    <line x1="65" y1="74" x2="150" y2="48" stroke="var(--lab-text-muted)" strokeWidth="1.2" opacity="0.6" />
                    <line x1="235" y1="74" x2="150" y2="48" stroke="var(--lab-text-muted)" strokeWidth="1.2" opacity="0.6" />
                    <rect x="25" y="10" width="70" height="22" rx="3" fill="var(--lab-bg-elevated)" stroke="var(--lab-border)" />
                    <text x="60" y="24" textAnchor="middle" fontSize="8" fill="var(--lab-text-muted)" fontWeight="600">NOTE</text>
                    <rect x="205" y="10" width="70" height="22" rx="3" fill="var(--lab-bg-elevated)" stroke="var(--lab-border)" />
                    <text x="240" y="24" textAnchor="middle" fontSize="8" fill="var(--lab-text-muted)" fontWeight="600">PASSAGE</text>
                    <rect x="115" y="36" width="70" height="24" rx="3" fill="var(--lab-bg-subtle)" stroke="var(--lab-text-muted)" />
                    <text x="150" y="51" textAnchor="middle" fontSize="8" fill="var(--lab-text)" fontWeight="700">SOURCE</text>
                    <rect x="25" y="64" width="70" height="22" rx="3" fill="var(--lab-bg-elevated)" stroke="var(--lab-border)" />
                    <text x="60" y="78" textAnchor="middle" fontSize="8" fill="var(--lab-text-muted)" fontWeight="600">QUESTION</text>
                    <rect x="205" y="64" width="70" height="22" rx="3" fill="var(--lab-bg-elevated)" stroke="var(--lab-border)" />
                    <text x="240" y="78" textAnchor="middle" fontSize="8" fill="var(--lab-text-muted)" fontWeight="600">REF</text>
                  </svg>
                </div>

                <div style={{ padding: '16px 18px', display: 'flex', flexDirection: 'column', gap: '8px', flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span className="km-lab-tag">පොදු සිතියම</span>
                    <span style={{ fontSize: '0.74rem', color: 'var(--lab-text-muted)' }}>{m.authorName}</span>
                  </div>
                  <h3 style={{ fontSize: '1rem', fontWeight: '700', color: 'var(--lab-text)', margin: 0 }}>
                    {m.title}
                  </h3>
                  {m.description && (
                    <p style={{ fontSize: '0.83rem', color: 'var(--lab-text-muted)', margin: 0, lineHeight: 1.5 }}>
                      {m.description}
                    </p>
                  )}
                  <div style={{ marginTop: 'auto', paddingTop: '8px' }}>
                    <span className="km-lab-btn" style={{ padding: '6px 12px', fontSize: '0.78rem' }}>
                      <span>සිතියම බලන්න</span>
                      <ArrowRight size={12} />
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )
      ) : activeTab === 'profiles' ? (
        community.profiles.length === 0 ? (
          <div className="km-lab-card" style={{ padding: '40px 24px', textAlign: 'center', color: 'var(--lab-text-muted)' }}>
            No public seeker profiles yet. Opt in via the "My Privacy & Profile" tab if you wish to share your study focus.
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(270px, 1fr))', gap: '14px' }}>
            {community.profiles.map(p => (
              <div key={p.userId} className="km-lab-card" style={{ padding: '18px 20px' }}>
                <div style={{ fontWeight: '700', fontSize: '1.02rem', color: 'var(--lab-text)', marginBottom: '4px' }}>
                  {p.displayName}
                </div>
                {p.studyFocus && (
                  <div style={{ fontSize: '0.78rem', fontWeight: '600', color: 'var(--lab-accent)', marginBottom: '8px' }}>
                    Focus: {p.studyFocus}
                  </div>
                )}
                {p.bio && (
                  <p style={{ fontSize: '0.84rem', color: 'var(--lab-text-muted)', margin: 0, lineHeight: 1.55 }}>
                    {p.bio}
                  </p>
                )}
              </div>
            ))}
          </div>
        )
      ) : activeTab === 'anumodana' ? (
        community.dedications.length === 0 ? (
          <div className="km-lab-card" style={{ padding: '40px 24px', textAlign: 'center', color: 'var(--lab-text-muted)' }}>
            No public Anumodanā offerings shared yet.
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {community.dedications.map(d => (
              <div key={d.id} className="km-lab-card" style={{ padding: '16px 20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                  <strong style={{ fontSize: '0.96rem', color: 'var(--lab-text)', fontFamily: 'var(--font-sinhala)' }}>{d.title}</strong>
                  <span style={{ fontSize: '0.76rem', color: 'var(--lab-text-muted)' }}>By {d.authorName}</span>
                </div>
                <p style={{ fontSize: '0.86rem', color: 'var(--lab-text-muted)', margin: 0, lineHeight: 1.65, fontFamily: 'var(--font-sinhala)' }}>
                  {d.dedicationText}
                </p>
              </div>
            ))}
          </div>
        )
      ) : (
        <form onSubmit={handleSaveProfile} className="km-lab-card" style={{ padding: '22px', maxWidth: '580px' }}>
          <h2 style={{ fontSize: '1.08rem', fontWeight: '700', margin: '0 0 6px 0', color: 'var(--lab-text)' }}>
            Privacy & Public Profile Controls
          </h2>
          <p style={{ fontSize: '0.84rem', color: 'var(--lab-text-muted)', margin: '0 0 16px 0', lineHeight: 1.55 }}>
            Your personal notes, highlights, and Pin Potha are always private by default. Enabling a public profile only shares your chosen display name, study focus, and bio below.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 12px', borderRadius: '10px', background: 'var(--lab-bg-subtle)', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={profileForm.isPublic}
                onChange={(e) => setProfileForm(prev => ({ ...prev, isPublic: e.target.checked }))}
              />
              <span style={{ fontSize: '0.86rem', fontWeight: '600', color: 'var(--lab-text)' }}>
                Make my Seeker Profile discoverable in Community Explore
              </span>
            </label>

            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '600', marginBottom: '4px' }}>Display Name</label>
              <input
                type="text"
                required
                value={profileForm.displayName}
                onChange={(e) => setProfileForm(prev => ({ ...prev, displayName: e.target.value }))}
                style={{ width: '100%', padding: '9px 12px', borderRadius: '10px', border: '1px solid var(--lab-border)', background: 'var(--lab-bg-subtle)', color: 'var(--lab-text)', fontSize: '0.88rem' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '600', marginBottom: '4px' }}>Primary Study Focus</label>
              <input
                type="text"
                value={profileForm.studyFocus}
                onChange={(e) => setProfileForm(prev => ({ ...prev, studyFocus: e.target.value }))}
                placeholder="e.g., Sutta Nipāta, Satipaṭṭhāna, Pāli Grammar"
                style={{ width: '100%', padding: '9px 12px', borderRadius: '10px', border: '1px solid var(--lab-border)', background: 'var(--lab-bg-subtle)', color: 'var(--lab-text)', fontSize: '0.88rem' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '600', marginBottom: '4px' }}>Bio</label>
              <textarea
                rows={3}
                value={profileForm.bio}
                onChange={(e) => setProfileForm(prev => ({ ...prev, bio: e.target.value }))}
                style={{ width: '100%', padding: '9px 12px', borderRadius: '10px', border: '1px solid var(--lab-border)', background: 'var(--lab-bg-subtle)', color: 'var(--lab-text)', fontSize: '0.88rem', resize: 'vertical' }}
              />
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <button
                type="submit"
                style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '10px 16px', borderRadius: '10px', border: 'none', background: 'var(--lab-accent)', color: '#fff', fontWeight: '600', fontSize: '0.86rem', cursor: 'pointer' }}
              >
                <Save size={14} />
                <span>Save Settings</span>
              </button>
              {profileSavedMsg && (
                <span style={{ fontSize: '0.82rem', color: '#059669', fontWeight: '600' }}>{profileSavedMsg}</span>
              )}
            </div>
          </div>
        </form>
      )}
    </div>
  );
}
