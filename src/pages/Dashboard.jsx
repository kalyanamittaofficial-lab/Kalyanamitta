import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../utils/supabase';
import { Search, User, Bell } from 'lucide-react';

export default function Dashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [activeTasks, setActiveTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        // Get session
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError || !session) {
          navigate('/login');
          return;
        }

        const currentUser = session.user;
        setUser(currentUser);

        // Fetch Profile
        const { data: profileData } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', currentUser.id)
          .single();
        
        if (profileData) {
          setProfile(profileData);
        }

        // Fetch Tasks
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
      <div className="flex-center" style={{ minHeight: 'calc(100vh - 100px)' }}>
        <div style={{ color: 'var(--primary)', fontFamily: 'var(--font-sinhala)' }}>Loading...</div>
      </div>
    );
  }

  return (
    <div style={{ padding: '24px 48px', maxWidth: '1200px', margin: '0 auto', width: '100%' }}>
      {/* Top Navbar */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '16px', marginBottom: '32px' }}>
        <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--bg-secondary)', border: '1px solid var(--glass-border)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
          <Search size={18} strokeWidth={1.5} color="var(--text-main)" />
        </div>
        <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--bg-secondary)', border: '1px solid var(--glass-border)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
          <Bell size={18} strokeWidth={1.5} color="var(--text-main)" />
        </div>
        <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--bg-secondary)', border: '1px solid var(--glass-border)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
          <User size={18} strokeWidth={1.5} color="var(--text-main)" />
        </div>
      </div>

      {/* Greeting */}
      <div style={{ marginBottom: '32px' }}>
        <h2 style={{ fontSize: '2rem', fontFamily: 'var(--font-serif)', fontWeight: 'bold', color: 'var(--primary)', marginBottom: '8px' }}>
          ආයුබෝවන්, {profile?.name?.split(' ')[0] || 'මිත්‍රයා'}
        </h2>
        <p style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-sinhala)' }}>
          ඔබගේ ප්‍රගතිය සහ කාර්යයන් පහතින් දැක්වේ.
        </p>
      </div>

      {/* Tasks Panel */}
      <div className="glass-panel" style={{ padding: '32px', borderRadius: '12px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', fontFamily: 'var(--font-sinhala)', color: 'var(--text-main)' }}>
            මෙම සතියේ ප්‍රධාන කාර්යයන්
          </h3>
          <span style={{ fontSize: '0.9rem', color: 'var(--primary)', cursor: 'pointer', fontFamily: 'var(--font-sinhala)' }}>
            සියල්ල බලන්න &rarr;
          </span>
        </div>

        {activeTasks.length > 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {activeTasks.map(task => (
              <div key={task.id} style={{ 
                background: 'var(--bg-secondary)', 
                padding: '16px', 
                borderRadius: '8px', 
                border: '1px solid var(--glass-border)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <div>
                  <h4 style={{ fontWeight: '500', fontFamily: 'var(--font-sinhala)', color: 'var(--text-main)', marginBottom: '4px' }}>
                    {task.title}
                  </h4>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontFamily: 'var(--font-sinhala)' }}>
                    {task.week_start} සිට {task.week_end}
                  </p>
                </div>
                <button style={{ 
                  padding: '8px 16px', 
                  background: 'var(--primary)', 
                  color: '#fff', 
                  border: 'none', 
                  borderRadius: '6px',
                  fontFamily: 'var(--font-sinhala)',
                  cursor: 'pointer'
                }}>
                  සම්පූර්ණ කරන්න
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div style={{ 
            background: 'var(--bg-secondary)', 
            padding: '32px', 
            borderRadius: '8px', 
            border: '1px solid var(--glass-border)',
            textAlign: 'center',
            color: 'var(--text-muted)',
            fontFamily: 'var(--font-sinhala)'
          }}>
            මෙම සතියට අදාළ කාර්යයන් තවම එක් කර නොමැත.
          </div>
        )}
      </div>
      
      {/* Sign Out */}
      <div style={{ marginTop: '48px', textAlign: 'center' }}>
        <button 
          onClick={async () => { await supabase.auth.signOut(); navigate('/login'); }}
          style={{ 
            background: 'transparent', 
            border: '1px solid rgba(0,0,0,0.1)', 
            padding: '8px 24px', 
            borderRadius: '6px', 
            color: 'var(--text-muted)', 
            fontFamily: 'var(--font-sinhala)',
            cursor: 'pointer'
          }}
        >
          ගිණුමෙන් ඉවත් වන්න
        </button>
      </div>
    </div>
  );
}
