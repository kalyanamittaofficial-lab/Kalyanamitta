import React, { useState, useEffect } from 'react';
import { supabase } from '../../utils/supabase';
import { Plus, Trash2, Edit, Calendar, Clock, Loader2 } from 'lucide-react';

export default function NoticeManager() {
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  
  const [formData, setFormData] = useState({
    type: 'upcoming', // live, upcoming, past, special
    title: '',
    speaker: 'ගෞරවනීය ස්වාමීන් වහන්සේ',
    platform: 'Kalyanamitta Portal',
    description: '',
    date: '',
    time: '',
    duration: '',
    thumbnail: '',
    has_notes: false,
    link_url: '',
    link_text: 'Join Session'
  });

  useEffect(() => {
    fetchNotices();
  }, []);

  const fetchNotices = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('notices')
      .select('*')
      .order('created_at', { ascending: false });
      
    if (error) {
      console.error('Error fetching notices:', error);
    } else {
      setNotices(data || []);
    }
    setLoading(false);
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      const { error } = await supabase
        .from('notices')
        .insert([{ ...formData, created_by: user.id }]);

      if (error) throw error;

      setIsModalOpen(false);
      fetchNotices(); // Refresh list
      // Reset form
      setFormData({
        type: 'upcoming', title: '', speaker: 'ගෞරවනීය ස්වාමීන් වහන්සේ', platform: 'Kalyanamitta Portal',
        description: '', date: '', time: '', duration: '', thumbnail: '', has_notes: false, link_url: '', link_text: 'Join Session'
      });
    } catch (error) {
      alert('Error saving notice: ' + error.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this notice?')) {
      const { error } = await supabase.from('notices').delete().eq('id', id);
      if (error) {
        alert('Error deleting notice: ' + error.message);
      } else {
        fetchNotices();
      }
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '40px' }}>
        <div>
          <h1 style={{ fontSize: '2rem', fontFamily: 'var(--font-serif)', fontWeight: '400', marginBottom: '8px' }}>Notices & Events</h1>
          <p style={{ color: 'var(--text-muted)' }}>Manage all upcoming, live, and archived events.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'var(--primary)', color: 'white', border: 'none', padding: '10px 20px', fontWeight: '600', cursor: 'pointer' }}
        >
          <Plus size={18} /> Add New
        </button>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '60px', color: 'var(--text-muted)' }}><Loader2 className="spin" /> Loading...</div>
      ) : notices.length === 0 ? (
        <div style={{ background: 'var(--bg-main)', border: '1px solid var(--glass-border)', padding: '60px', textAlign: 'center' }}>
          <p style={{ color: 'var(--text-muted)' }}>No notices found. Click 'Add New' to create one.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {notices.map(notice => (
            <div key={notice.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--bg-main)', border: '1px solid var(--glass-border)', padding: '24px' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                  <span style={{ fontSize: '0.75rem', fontWeight: '700', textTransform: 'uppercase', color: 'var(--primary)', letterSpacing: '1px' }}>{notice.type}</span>
                  <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '4px' }}><Calendar size={14}/> {notice.date}</span>
                  <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '4px' }}><Clock size={14}/> {notice.time}</span>
                </div>
                <h3 style={{ fontSize: '1.2rem', fontFamily: 'var(--font-sinhala)', margin: 0, fontWeight: '500' }}>{notice.title}</h3>
              </div>
              <div style={{ display: 'flex', gap: '12px' }}>
                <button onClick={() => handleDelete(notice.id)} style={{ background: 'transparent', border: 'none', color: '#8c1515', cursor: 'pointer', padding: '8px' }}>
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Notice Modal */}
      {isModalOpen && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '20px' }}>
          <div style={{ background: 'var(--bg-main)', width: '100%', maxWidth: '600px', maxHeight: '90vh', overflowY: 'auto', padding: '32px', border: '1px solid var(--glass-border)' }}>
            <h2 style={{ fontSize: '1.5rem', fontFamily: 'var(--font-serif)', marginBottom: '24px' }}>Create New Notice</h2>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              
              <div>
                <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: '600', marginBottom: '8px' }}>Type</label>
                <select name="type" value={formData.type} onChange={handleInputChange} style={{ width: '100%', padding: '10px', background: 'var(--bg-secondary)', border: '1px solid var(--glass-border)', color: 'var(--text-main)', outline: 'none' }}>
                  <option value="live">Live Now (සජීවී)</option>
                  <option value="upcoming">Upcoming (ඉදිරි)</option>
                  <option value="past">Past/Archive (පටිගත කිරීම්)</option>
                  <option value="special">Special (විශේෂ)</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: '600', marginBottom: '8px' }}>Title (මාතෘකාව)</label>
                <input required type="text" name="title" value={formData.title} onChange={handleInputChange} style={{ width: '100%', padding: '10px', background: 'var(--bg-secondary)', border: '1px solid var(--glass-border)', color: 'var(--text-main)', outline: 'none' }} />
              </div>

              <div style={{ display: 'flex', gap: '16px' }}>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: '600', marginBottom: '8px' }}>Date (දිනය)</label>
                  <input required type="date" name="date" value={formData.date} onChange={handleInputChange} style={{ width: '100%', padding: '10px', background: 'var(--bg-secondary)', border: '1px solid var(--glass-border)', color: 'var(--text-main)', outline: 'none' }} />
                </div>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: '600', marginBottom: '8px' }}>Time (වේලාව)</label>
                  <input required type="text" placeholder="e.g. 06:00 PM" name="time" value={formData.time} onChange={handleInputChange} style={{ width: '100%', padding: '10px', background: 'var(--bg-secondary)', border: '1px solid var(--glass-border)', color: 'var(--text-main)', outline: 'none' }} />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: '600', marginBottom: '8px' }}>Description (විස්තරය)</label>
                <textarea required rows={3} name="description" value={formData.description} onChange={handleInputChange} style={{ width: '100%', padding: '10px', background: 'var(--bg-secondary)', border: '1px solid var(--glass-border)', color: 'var(--text-main)', outline: 'none' }} />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: '600', marginBottom: '8px' }}>Thumbnail Image URL</label>
                <input type="text" name="thumbnail" value={formData.thumbnail} onChange={handleInputChange} placeholder="https://..." style={{ width: '100%', padding: '10px', background: 'var(--bg-secondary)', border: '1px solid var(--glass-border)', color: 'var(--text-main)', outline: 'none' }} />
              </div>

              <div style={{ display: 'flex', gap: '16px', marginTop: '16px' }}>
                <button type="button" onClick={() => setIsModalOpen(false)} style={{ flex: 1, background: 'transparent', border: '1px solid var(--glass-border)', color: 'var(--text-main)', padding: '12px', cursor: 'pointer' }}>Cancel</button>
                <button type="submit" disabled={saving} style={{ flex: 1, background: 'var(--text-main)', border: 'none', color: 'var(--bg-main)', padding: '12px', fontWeight: '600', cursor: 'pointer' }}>
                  {saving ? 'Saving...' : 'Publish Notice'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      <style>{`
        .spin { animation: spin 1s linear infinite; }
        @keyframes spin { 100% { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}
