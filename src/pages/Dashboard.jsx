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

  return (
    <div style={{ padding: '40px 24px', maxWidth: '1100px', margin: '0 auto', width: '100%', minHeight: 'calc(100vh - 100px)' }}>
      {/* Top Navbar */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '16px', marginBottom: '48px' }}>
        {[Search, Bell, User].map((Icon, idx) => (
          <div 
            key={idx}
            style={{ 
              width: '44px', height: '44px', 
              borderRadius: '50%', 
              background: '#fff', 
              border: '1px solid var(--glass-border)', 
              display: 'flex', alignItems: 'center', justifyContent: 'center', 
              cursor: 'pointer',
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
            }}
            onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 6px 12px rgba(0,0,0,0.08)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.04)'; }}
          >
            <Icon size={20} strokeWidth={1.5} color="var(--text-main)" />
          </div>
        ))}
      </div>

      {/* Greeting Header */}
      <div style={{ marginBottom: '48px', animation: 'fadeInUp 0.6s ease-out' }}>
        <h2 style={{ fontSize: '2.5rem', fontFamily: 'var(--font-serif)', fontWeight: '800', color: 'var(--primary)', marginBottom: '12px', letterSpacing: '-0.02em' }}>
          ආයුබෝවන්, {profile?.name?.split(' ')[0] || 'මිත්‍රයා'}
        </h2>
        <p style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-sinhala)', fontSize: '1.1rem', maxWidth: '600px', lineHeight: '1.6' }}>
          ඔබගේ අධ්‍යාත්මික ගමනේ නවතම ප්‍රගතිය සහ සතියේ ප්‍රධාන කාර්යයන් පහතින් දැක්වේ.
        </p>
      </div>

      {/* Quick Stats Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px', marginBottom: '48px', animation: 'fadeInUp 0.6s ease-out', animationDelay: '0.1s', animationFillMode: 'both' }}>
        {[
          { title: 'භාවනා කාලය', value: 'පැය 4 යි', icon: Activity, color: '#f59e0b' },
          { title: 'කියවූ පොත්', value: '2', icon: BookOpen, color: '#3b82f6' },
          { title: 'සතිපතා දිනපොත', value: 'යාවත්කාලීනයි', icon: Calendar, color: '#10b981' }
        ].map((stat, idx) => (
          <div key={idx} className="glass-panel" style={{ padding: '24px', borderRadius: '20px', display: 'flex', alignItems: 'center', gap: '20px', transition: 'transform 0.3s ease', cursor: 'default' }}
            onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-4px)'}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
          >
            <div style={{ width: '56px', height: '56px', borderRadius: '16px', background: `${stat.color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <stat.icon size={24} color={stat.color} />
            </div>
            <div>
              <h4 style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '4px', fontFamily: 'var(--font-sinhala)' }}>{stat.title}</h4>
              <p style={{ fontSize: '1.25rem', fontWeight: 'bold', color: 'var(--text-main)', fontFamily: 'var(--font-sinhala)' }}>{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Tasks Panel */}
      <div className="glass-panel" style={{ padding: '40px', borderRadius: '24px', animation: 'fadeInUp 0.6s ease-out', animationDelay: '0.2s', animationFillMode: 'both' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
          <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold', fontFamily: 'var(--font-sinhala)', color: 'var(--text-main)' }}>
            මෙම සතියේ ප්‍රධාන කාර්යයන්
          </h3>
          <span style={{ fontSize: '0.95rem', color: 'var(--primary)', cursor: 'pointer', fontFamily: 'var(--font-sinhala)', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: '500', transition: 'color 0.2s' }}
            onMouseEnter={(e) => e.currentTarget.style.color = 'var(--primary-hover)'}
            onMouseLeave={(e) => e.currentTarget.style.color = 'var(--primary)'}
          >
            සියල්ල බලන්න <ArrowRight size={16} />
          </span>
        </div>

        {activeTasks.length > 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {activeTasks.map(task => (
              <div key={task.id} style={{ 
                background: '#fff', 
                padding: '24px', 
                borderRadius: '16px', 
                border: '1px solid var(--glass-border)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                transition: 'all 0.3s ease',
                boxShadow: '0 2px 8px rgba(0,0,0,0.02)'
              }}
              onMouseEnter={(e) => { e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.06)'; e.currentTarget.style.borderColor = 'rgba(153, 27, 27, 0.1)'; e.currentTarget.style.transform = 'scale(1.01)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.02)'; e.currentTarget.style.borderColor = 'var(--glass-border)'; e.currentTarget.style.transform = 'scale(1)'; }}
              >
                <div>
                  <h4 style={{ fontSize: '1.1rem', fontWeight: '600', fontFamily: 'var(--font-sinhala)', color: 'var(--text-main)', marginBottom: '8px' }}>
                    {task.title}
                  </h4>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontFamily: 'var(--font-sinhala)' }}>
                    {task.week_start} සිට {task.week_end}
                  </p>
                </div>
                <button style={{ 
                  padding: '10px 24px', 
                  background: 'var(--primary)', 
                  color: '#fff', 
                  border: 'none', 
                  borderRadius: '10px',
                  fontFamily: 'var(--font-sinhala)',
                  fontSize: '0.95rem',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'background 0.2s, transform 0.2s'
                }}
                onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--primary-hover)'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = 'var(--primary)'; e.currentTarget.style.transform = 'translateY(0)'; }}
                >
                  සම්පූර්ණ කරන්න
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div style={{ 
            background: 'rgba(255, 255, 255, 0.6)', 
            padding: '48px', 
            borderRadius: '16px', 
            border: '2px dashed var(--glass-border)',
            textAlign: 'center',
            color: 'var(--text-muted)',
            fontFamily: 'var(--font-sinhala)',
            fontSize: '1.1rem'
          }}>
            මෙම සතියට අදාළ කාර්යයන් තවම එක් කර නොමැත.
          </div>
        )}
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
