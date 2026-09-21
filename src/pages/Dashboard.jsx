import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../utils/supabase';
import { User, Activity, BookOpen, ArrowRight, Edit2, Save, X } from 'lucide-react';

export default function Dashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isHoveringLogout, setIsHoveringLogout] = useState(false);
  
  // Edit Mode State
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({});
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError || !session) {
          navigate('/login');
          return;
        }

        const currentUser = session.user;
        setUser(currentUser);

        const { data: profileData } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', currentUser.id)
          .single();
        
        if (profileData) {
          if (profileData.status === 'pending_onboarding') {
            navigate('/onboarding');
            return;
          }
          setProfile(profileData);
          setEditForm(profileData);
        }

      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, [navigate]);

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          name: editForm.name,
          mobile_number: editForm.mobile_number,
          country: editForm.country,
          state_district: editForm.state_district,
          native_language: editForm.native_language,
          dob: editForm.dob,
          marital_status: editForm.marital_status,
          family_details: editForm.family_details,
          education_profession: editForm.education_profession
        })
        .eq('id', user.id);

      if (error) throw error;
      setProfile(editForm);
      setIsEditing(false);
    } catch (err) {
      alert("Error updating profile");
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex-center" style={{ minHeight: 'calc(100vh - 100px)', padding: '24px', background: 'var(--bg-main)' }}>
        <p style={{ color: 'var(--text-muted)' }}>Loading Dashboard...</p>
      </div>
    );
  }

  const InputOrText = ({ label, name, value, isReadOnly }) => (
    <div style={{ marginBottom: '16px' }}>
      <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontFamily: 'var(--font-sinhala)', display: 'block', marginBottom: '4px' }}>{label}</span>
      {isEditing && !isReadOnly ? (
        <input 
          type={name === 'dob' ? 'date' : 'text'}
          name={name}
          value={value || ''}
          onChange={handleEditChange}
          style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--primary)', background: '#fff', fontSize: '1rem', fontFamily: 'var(--font-sinhala)' }}
        />
      ) : (
        <div style={{ 
          fontSize: '1.05rem', 
          color: isReadOnly ? 'rgba(0,0,0,0.4)' : 'var(--text-main)', 
          fontFamily: 'var(--font-sinhala)', 
          fontWeight: isReadOnly ? '400' : '500',
          padding: '10px 0',
          borderBottom: '1px solid rgba(0,0,0,0.05)'
        }}>
          {value || '-'}
        </div>
      )}
    </div>
  );

  return (
    <div style={{ padding: '40px 24px', maxWidth: '1000px', margin: '0 auto', width: '100%', minHeight: 'calc(100vh - 100px)' }}>
      
      {/* Daily Dhamma Quote */}
      <div style={{ marginBottom: '48px', textAlign: 'center', animation: 'fadeInUp 0.6s ease-out' }}>
        <p style={{ color: 'var(--primary)', fontFamily: 'var(--font-serif)', fontSize: '1.4rem', fontStyle: 'italic', maxWidth: '800px', margin: '0 auto 12px auto', lineHeight: '1.6' }}>
          "යෝ ච වස්සසතං ජීවේ දුස්සීලෝ අසමාහිතෝ, ඒකාහං ජීවිතං සෙය්‍යෝ සීලවන්තස්ස ඣායිනෝ."
        </p>
        <p style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-sinhala)', fontSize: '0.95rem' }}>
          (දුස්සීලව, නොසන්සුන් සිතින් යුතුව අවුරුදු සීයක් ජීවත් වෙනවාට වඩා, සිල්වත්ව, ධ්‍යාන වඩමින් එක දවසක් ජීවත් වීම උතුම් ය.)
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '32px' }}>
        
        {/* Account Information Card */}
        <div className="glass-panel" style={{ padding: '40px', borderRadius: '24px', animation: 'fadeInUp 0.6s ease-out', borderTop: '4px solid var(--primary)', position: 'relative' }}>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
            <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold', fontFamily: 'var(--font-sinhala)', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '12px' }}>
              <User size={24} color="var(--primary)" /> ඔබගේ ගිණුමේ තොරතුරු
            </h3>
            {!isEditing ? (
              <button onClick={() => setIsEditing(true)} style={{ background: 'none', border: 'none', color: 'var(--primary)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', fontWeight: '600' }}>
                <Edit2 size={16} /> Edit
              </button>
            ) : (
              <div style={{ display: 'flex', gap: '8px' }}>
                <button onClick={() => { setIsEditing(false); setEditForm(profile); }} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <X size={16} /> Cancel
                </button>
                <button onClick={handleSave} disabled={isSaving} style={{ background: 'var(--primary)', color: '#fff', border: 'none', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', fontWeight: '600' }}>
                  <Save size={16} /> {isSaving ? 'Saving...' : 'Save'}
                </button>
              </div>
            )}
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <InputOrText label="Kalyanamitta ID (නොවෙනස්වන)" name="kalyanamitta_id" value={profile?.kalyanamitta_id} isReadOnly={true} />
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
              <InputOrText label="සම්පූර්ණ නම" name="name" value={isEditing ? editForm.name : profile?.name} />
              <InputOrText label="විද්‍යුත් තැපෑල (Email)" name="email" value={user?.email} isReadOnly={true} />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
              <InputOrText label="දුරකථන අංකය" name="mobile_number" value={isEditing ? editForm.mobile_number : profile?.mobile_number} />
              <InputOrText label="උපන් දිනය" name="dob" value={isEditing ? editForm.dob : profile?.dob} />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
              <InputOrText label="රට" name="country" value={isEditing ? editForm.country : profile?.country} />
              <InputOrText label="දිස්ත්‍රික්කය" name="state_district" value={isEditing ? editForm.state_district : profile?.state_district} />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
              <InputOrText label="විවාහක/අවිවාහක බව" name="marital_status" value={isEditing ? editForm.marital_status : profile?.marital_status} />
              <InputOrText label="මව්බස" name="native_language" value={isEditing ? editForm.native_language : profile?.native_language} />
            </div>

            <InputOrText label="අධ්‍යාපනය / රැකියාව" name="education_profession" value={isEditing ? editForm.education_profession : profile?.education_profession} />
            <InputOrText label="පවුලේ විස්තර" name="family_details" value={isEditing ? editForm.family_details : profile?.family_details} />
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
          {/* Read-Only Spiritual Ratings */}
          <div className="glass-panel" style={{ padding: '32px', borderRadius: '24px', background: 'rgba(255,255,255,0.4)' }}>
            <h4 style={{ fontSize: '1.2rem', fontWeight: 'bold', fontFamily: 'var(--font-sinhala)', color: 'rgba(0,0,0,0.5)', marginBottom: '24px' }}>
              ආධ්‍යාත්මික පසුබිම (Initial Assessment)
            </h4>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div>
                <span style={{ fontSize: '0.85rem', color: 'rgba(0,0,0,0.4)', fontFamily: 'var(--font-sinhala)', display: 'block', marginBottom: '8px' }}>නිවන් දකින්න ඇති උනන්දුව</span>
                <div style={{ width: '100%', height: '8px', background: 'rgba(0,0,0,0.05)', borderRadius: '4px', overflow: 'hidden' }}>
                  <div style={{ width: `${profile?.spiritual_interest || 0}%`, height: '100%', background: 'rgba(140, 21, 21, 0.3)' }}></div>
                </div>
              </div>
              
              <div>
                <span style={{ fontSize: '0.85rem', color: 'rgba(0,0,0,0.4)', fontFamily: 'var(--font-sinhala)', display: 'block', marginBottom: '8px' }}>දැනට කරන කැපකිරීම</span>
                <div style={{ width: '100%', height: '8px', background: 'rgba(0,0,0,0.05)', borderRadius: '4px', overflow: 'hidden' }}>
                  <div style={{ width: `${profile?.current_dedication || 0}%`, height: '100%', background: 'rgba(140, 21, 21, 0.3)' }}></div>
                </div>
              </div>

              <div>
                <span style={{ fontSize: '0.85rem', color: 'rgba(0,0,0,0.4)', fontFamily: 'var(--font-sinhala)', display: 'block', marginBottom: '8px' }}>ඉදිරියට කිරීමට සූදානම් කැපකිරීම</span>
                <div style={{ width: '100%', height: '8px', background: 'rgba(0,0,0,0.05)', borderRadius: '4px', overflow: 'hidden' }}>
                  <div style={{ width: `${profile?.potential_dedication || 0}%`, height: '100%', background: 'rgba(140, 21, 21, 0.3)' }}></div>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Access Portal */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <h3 style={{ fontSize: '1.3rem', fontWeight: 'bold', fontFamily: 'var(--font-sinhala)', color: 'var(--text-main)', paddingLeft: '8px' }}>
              ඉක්මන් පිවිසුම්
            </h3>
            
            {[
              { title: 'භාවනා පුහුණුව', desc: 'භාවනා මාර්ගෝපදේශ සහ නිශ්ශබ්ද කාලය', icon: Activity, path: '/meditation' },
              { title: 'ධර්ම දේශනා', desc: 'සජීවී සහ පටිගත කළ දේශනා', icon: BookOpen, path: '/sermons' }
            ].map((item, idx) => (
              <div 
                key={idx}
                onClick={() => navigate(item.path)}
                style={{
                  background: '#fff', border: '1px solid var(--glass-border)', borderRadius: '16px', padding: '20px',
                  display: 'flex', alignItems: 'center', gap: '20px', cursor: 'pointer', transition: 'all 0.3s ease',
                  boxShadow: '0 4px 15px rgba(0,0,0,0.02)'
                }}
                onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.borderColor = 'var(--primary)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.borderColor = 'var(--glass-border)'; }}
              >
                <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'rgba(140, 21, 21, 0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <item.icon size={20} color="var(--primary)" />
                </div>
                <div>
                  <h4 style={{ fontSize: '1.05rem', fontWeight: 'bold', fontFamily: 'var(--font-sinhala)', color: 'var(--text-main)', marginBottom: '4px' }}>{item.title}</h4>
                </div>
                <div style={{ marginLeft: 'auto', color: 'var(--text-muted)' }}><ArrowRight size={18} /></div>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* Sign Out */}
      <div style={{ marginTop: '64px', textAlign: 'center', paddingBottom: '32px' }}>
        <button 
          onClick={async () => { await supabase.auth.signOut(); navigate('/login'); }}
          style={{ 
            background: isHoveringLogout ? '#fff1f2' : 'transparent', 
            border: `1px solid ${isHoveringLogout ? '#fecdd3' : 'var(--glass-border)'}`, 
            padding: '12px 32px', 
            borderRadius: '12px', 
            color: isHoveringLogout ? '#be123c' : 'var(--text-muted)', 
            fontFamily: 'var(--font-sinhala)', fontWeight: '500', cursor: 'pointer', transition: 'all 0.3s ease'
          }}
          onMouseEnter={() => setIsHoveringLogout(true)}
          onMouseLeave={() => setIsHoveringLogout(false)}
        >
          ගිණුමෙන් ඉවත් වන්න
        </button>
      </div>
    </div>
  );
}
