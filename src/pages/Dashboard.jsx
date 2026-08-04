import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../utils/supabase';
import { Search, User, Bell, ArrowRight, Activity, BookOpen, Calendar } from 'lucide-react';

export default function Dashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [activeTasks, setActiveTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isHoveringLogout, setIsHoveringLogout] = useState(false);
  const [needsOnboarding, setNeedsOnboarding] = useState(false);
  
  // Onboarding Form State
  const [formData, setFormData] = useState({
    name: '',
    phone_number: '',
    district: '',
    age: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [onboardingError, setOnboardingError] = useState('');

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
          setProfile(profileData);
          
          // Check if onboarding is needed
          if (!profileData.name || !profileData.phone_number || !profileData.district || !profileData.age) {
            setNeedsOnboarding(true);
            setFormData({
              name: profileData.name || '',
              phone_number: profileData.phone_number || '',
              district: profileData.district || '',
              age: profileData.age || ''
            });
          }
        }

        const { data: tasksData } = await supabase
          .from('tasks')
          .select('*')
          .eq('is_active', true)
          .neq('is_deleted', true)
          .order('created_at', { ascending: false })
          .limit(3);

        if (tasksData) {
          setActiveTasks(tasksData);
        }

      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, [navigate]);

  const handleOnboardingSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setOnboardingError('');

    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          name: formData.name,
          phone_number: formData.phone_number,
          district: formData.district,
          age: parseInt(formData.age, 10)
        })
        .eq('id', user.id);

      if (error) throw error;

      // Update local state to dismiss onboarding
      setProfile({ ...profile, ...formData, age: parseInt(formData.age, 10) });
      setNeedsOnboarding(false);
    } catch (err) {
      console.error(err);
      setOnboardingError('තොරතුරු යාවත්කාලීන කිරීමේදී දෝෂයක් මතු විය. කරුණාකර නැවත උත්සාහ කරන්න.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex-center" style={{ minHeight: 'calc(100vh - 100px)', padding: '24px', background: 'var(--bg-main)' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', width: '100%', maxWidth: '1000px', margin: '0 auto' }}>
          <div style={{ height: '40px', width: '200px', background: 'var(--bg-secondary)', borderRadius: '8px', animation: 'pulse 1.5s infinite ease-in-out' }}></div>
          <div style={{ height: '24px', width: '300px', background: 'var(--bg-secondary)', borderRadius: '6px', animation: 'pulse 1.5s infinite ease-in-out', animationDelay: '0.2s' }}></div>
          <div style={{ height: '200px', width: '100%', background: 'var(--bg-secondary)', borderRadius: '16px', marginTop: '32px', animation: 'pulse 1.5s infinite ease-in-out', animationDelay: '0.4s' }}></div>
        </div>
      </div>
    );
  }

  if (needsOnboarding) {
    return (
      <div className="flex-center" style={{ minHeight: 'calc(100vh - 100px)', padding: '24px', background: 'radial-gradient(circle at top, var(--bg-secondary) 0%, var(--bg-main) 100%)' }}>
        <div className="glass-panel" style={{ width: '100%', maxWidth: '500px', padding: '48px 40px', borderRadius: '24px', boxShadow: '0 20px 40px rgba(0,0,0,0.08)', animation: 'fadeInUp 0.6s ease-out' }}>
          <h2 style={{ fontSize: '2rem', fontFamily: 'var(--font-serif)', color: 'var(--primary)', marginBottom: '16px', textAlign: 'center' }}>
            සාදරයෙන් පිළිගනිමු!
          </h2>
          <p style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-sinhala)', fontSize: '0.95rem', marginBottom: '32px', textAlign: 'center', lineHeight: '1.6' }}>
            කරුණාකර ඔබගේ ගිණුම සම්පූර්ණ කිරීම සඳහා පහත තොරතුරු ලබා දෙන්න.
          </p>

          {onboardingError && (
            <div style={{ marginBottom: '24px', padding: '14px', borderRadius: '12px', background: '#fff1f2', color: '#9f1239', border: '1px solid #fecdd3', fontSize: '0.85rem', fontFamily: 'var(--font-sinhala)' }}>
              {onboardingError}
            </div>
          )}

          <form onSubmit={handleOnboardingSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', color: 'var(--text-main)', fontFamily: 'var(--font-sinhala)', fontWeight: '600' }}>විද්‍යුත් තැපෑල (Email)</label>
              <input type="email" value={user.email} disabled style={{ width: '100%', padding: '14px', borderRadius: '12px', border: '1px solid var(--glass-border)', background: 'rgba(0,0,0,0.02)', color: 'var(--text-muted)', fontFamily: 'var(--font-sinhala)', outline: 'none' }} />
            </div>
            
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', color: 'var(--text-main)', fontFamily: 'var(--font-sinhala)', fontWeight: '600' }}>සම්පූර්ණ නම</label>
              <input required type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} placeholder="උදා: කසුන් පෙරේරා" style={{ width: '100%', padding: '14px', borderRadius: '12px', border: '2px solid var(--glass-border)', background: '#fff', color: 'var(--text-main)', fontFamily: 'var(--font-sinhala)', outline: 'none' }} />
            </div>

            <div style={{ display: 'flex', gap: '16px' }}>
              <div style={{ flex: 1 }}>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', color: 'var(--text-main)', fontFamily: 'var(--font-sinhala)', fontWeight: '600' }}>දුරකථන අංකය</label>
                <input required type="tel" value={formData.phone_number} onChange={e => setFormData({...formData, phone_number: e.target.value})} placeholder="07XXXXXXXX" style={{ width: '100%', padding: '14px', borderRadius: '12px', border: '2px solid var(--glass-border)', background: '#fff', color: 'var(--text-main)', fontFamily: 'var(--font-sinhala)', outline: 'none' }} />
              </div>
              <div style={{ width: '100px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', color: 'var(--text-main)', fontFamily: 'var(--font-sinhala)', fontWeight: '600' }}>වයස</label>
                <input required type="number" min="10" max="120" value={formData.age} onChange={e => setFormData({...formData, age: e.target.value})} placeholder="25" style={{ width: '100%', padding: '14px', borderRadius: '12px', border: '2px solid var(--glass-border)', background: '#fff', color: 'var(--text-main)', fontFamily: 'var(--font-sinhala)', outline: 'none' }} />
              </div>
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', color: 'var(--text-main)', fontFamily: 'var(--font-sinhala)', fontWeight: '600' }}>දිස්ත්‍රික්කය</label>
              <input required type="text" value={formData.district} onChange={e => setFormData({...formData, district: e.target.value})} placeholder="උදා: කොළඹ" style={{ width: '100%', padding: '14px', borderRadius: '12px', border: '2px solid var(--glass-border)', background: '#fff', color: 'var(--text-main)', fontFamily: 'var(--font-sinhala)', outline: 'none' }} />
            </div>

            <button type="submit" disabled={isSubmitting} style={{ width: '100%', padding: '16px', marginTop: '12px', borderRadius: '12px', background: 'var(--primary)', color: '#fff', fontFamily: 'var(--font-sinhala)', fontSize: '1.05rem', fontWeight: '600', border: 'none', cursor: isSubmitting ? 'not-allowed' : 'pointer', opacity: isSubmitting ? 0.7 : 1, transition: 'all 0.3s ease', boxShadow: '0 8px 20px rgba(153, 27, 27, 0.2)' }}>
              {isSubmitting ? 'සුරකිමින් පවතී...' : 'ඉදිරියට යන්න'}
            </button>
          </form>
        </div>
      </div>
    );
  }

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

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '32px' }}>
        
        {/* Account Information Card */}
        <div className="glass-panel" style={{ padding: '40px', borderRadius: '24px', animation: 'fadeInUp 0.6s ease-out', animationDelay: '0.1s', animationFillMode: 'both', borderTop: '4px solid var(--primary)' }}>
          <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold', fontFamily: 'var(--font-sinhala)', color: 'var(--text-main)', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '12px' }}>
            <User size={24} color="var(--primary)" /> ඔබගේ ගිණුමේ තොරතුරු
          </h3>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontFamily: 'var(--font-sinhala)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Kalyanamitta ID</span>
              <div style={{ fontSize: '1.2rem', color: 'var(--primary)', fontFamily: 'var(--font-serif)', fontWeight: 'bold' }}>{profile?.kalyanamitta_id || 'Generating...'}</div>
            </div>
            <div style={{ height: '1px', background: 'var(--glass-border)', width: '100%' }}></div>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
              <div>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontFamily: 'var(--font-sinhala)' }}>සම්පූර්ණ නම</span>
                <div style={{ fontSize: '1.05rem', color: 'var(--text-main)', fontFamily: 'var(--font-sinhala)', fontWeight: '500' }}>{profile?.name}</div>
              </div>
              <div>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontFamily: 'var(--font-sinhala)' }}>වයස</span>
                <div style={{ fontSize: '1.05rem', color: 'var(--text-main)', fontFamily: 'var(--font-sinhala)', fontWeight: '500' }}>{profile?.age}</div>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
              <div>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontFamily: 'var(--font-sinhala)' }}>දුරකථන අංකය</span>
                <div style={{ fontSize: '1.05rem', color: 'var(--text-main)', fontFamily: 'var(--font-sinhala)', fontWeight: '500' }}>{profile?.phone_number}</div>
              </div>
              <div>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontFamily: 'var(--font-sinhala)' }}>දිස්ත්‍රික්කය</span>
                <div style={{ fontSize: '1.05rem', color: 'var(--text-main)', fontFamily: 'var(--font-sinhala)', fontWeight: '500' }}>{profile?.district}</div>
              </div>
            </div>

            <div>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontFamily: 'var(--font-sinhala)' }}>විද්‍යුත් තැපෑල (Email)</span>
              <div style={{ fontSize: '1.05rem', color: 'var(--text-main)', fontFamily: 'var(--font-sinhala)', fontWeight: '500' }}>{user?.email}</div>
            </div>
          </div>
        </div>

        {/* Quick Access Portal */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', animation: 'fadeInUp 0.6s ease-out', animationDelay: '0.2s', animationFillMode: 'both' }}>
          <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold', fontFamily: 'var(--font-sinhala)', color: 'var(--text-main)', marginBottom: '8px', paddingLeft: '8px' }}>
            ඉක්මන් පිවිසුම්
          </h3>
          
          {[
            { title: 'භාවනා පුහුණුව', desc: 'භාවනා මාර්ගෝපදේශ සහ නිශ්ශබ්ද කාලය', icon: Activity, path: '/meditation' },
            { title: 'ධර්ම දේශනා', desc: 'සජීවී සහ පටිගත කළ දේශනා', icon: BookOpen, path: '/sermons' },
            { title: 'කල්‍යාණ මිත්‍රත්වය', desc: 'ප්‍රජාව සමඟ සම්බන්ධ වන්න', icon: User, path: '/community' }
          ].map((item, idx) => (
            <div 
              key={idx}
              onClick={() => navigate(item.path)}
              style={{
                background: '#fff',
                border: '1px solid var(--glass-border)',
                borderRadius: '16px',
                padding: '24px',
                display: 'flex',
                alignItems: 'center',
                gap: '20px',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                boxShadow: '0 4px 15px rgba(0,0,0,0.02)'
              }}
              onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 12px 24px rgba(0,0,0,0.06)'; e.currentTarget.style.borderColor = 'var(--primary)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 15px rgba(0,0,0,0.02)'; e.currentTarget.style.borderColor = 'var(--glass-border)'; }}
            >
              <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(140, 21, 21, 0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <item.icon size={24} color="var(--primary)" />
              </div>
              <div>
                <h4 style={{ fontSize: '1.1rem', fontWeight: 'bold', fontFamily: 'var(--font-sinhala)', color: 'var(--text-main)', marginBottom: '4px' }}>{item.title}</h4>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontFamily: 'var(--font-sinhala)' }}>{item.desc}</p>
              </div>
              <div style={{ marginLeft: 'auto', color: 'var(--text-muted)' }}>
                <ArrowRight size={20} />
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Sign Out */}
      <div style={{ marginTop: '64px', textAlign: 'center', paddingBottom: '32px', animation: 'fadeInUp 0.6s ease-out', animationDelay: '0.3s', animationFillMode: 'both' }}>
        <button 
          onClick={async () => { await supabase.auth.signOut(); navigate('/login'); }}
          style={{ 
            background: isHoveringLogout ? '#fff1f2' : 'transparent', 
            border: `1px solid ${isHoveringLogout ? '#fecdd3' : 'var(--glass-border)'}`, 
            padding: '12px 32px', 
            borderRadius: '12px', 
            color: isHoveringLogout ? '#be123c' : 'var(--text-muted)', 
            fontFamily: 'var(--font-sinhala)',
            fontWeight: '500',
            cursor: 'pointer',
            transition: 'all 0.3s ease'
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
