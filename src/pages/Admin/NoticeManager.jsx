import React, { useState, useEffect } from 'react';
import { supabase } from '../../utils/supabase';
import { Plus, Trash2, Edit } from 'lucide-react';

export default function NoticeManager() {
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Dummy data for now, in a real scenario we fetch from Supabase
  useEffect(() => {
    fetchNotices();
  }, []);

  const fetchNotices = async () => {
    // const { data } = await supabase.from('notices').select('*').order('created_at', { ascending: false });
    // setNotices(data || []);
    setLoading(false);
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '40px' }}>
        <div>
          <h1 style={{ fontSize: '2rem', fontFamily: 'var(--font-serif)', fontWeight: '400', marginBottom: '8px' }}>Notices & Events</h1>
          <p style={{ color: 'var(--text-muted)' }}>Manage all upcoming, live, and archived events.</p>
        </div>
        <button style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'var(--primary)', color: 'white', border: 'none', padding: '10px 20px', fontWeight: '600', cursor: 'pointer' }}>
          <Plus size={18} /> Add New
        </button>
      </div>

      <div style={{ background: 'var(--bg-main)', border: '1px solid var(--glass-border)', padding: '32px', textAlign: 'center' }}>
        <p style={{ color: 'var(--text-muted)' }}>Database connection required to load notices.</p>
      </div>
    </div>
  );
}
