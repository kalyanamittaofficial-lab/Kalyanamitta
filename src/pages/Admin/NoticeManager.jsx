import React, { useState, useEffect } from 'react';
import { supabase } from '../../utils/supabase';
import { Plus, Trash2, Edit, Calendar, Clock, Loader2, Radio, Video, User, ExternalLink, Link as LinkIcon } from 'lucide-react';
import { Link } from 'react-router-dom';

const EMPTY_FORM = {
  type: 'upcoming', // live, upcoming, past, special
  title: '',
  speaker: 'පූජ්‍ය අගලකඩ සිරිසුමන නාහිමි',
  platform: 'Kalyanamitta Live Portal',
  description: '',
  date: '',
  time: '07:00 PM',
  duration: '',
  thumbnail: '',
  has_notes: false,
  link_url: '/live',
  link_text: 'Join Live Session'
};

export default function NoticeManager() {
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [saving, setSaving] = useState(false);
  const [liveStatus, setLiveStatus] = useState(null);
  const [formData, setFormData] = useState(EMPTY_FORM);

  useEffect(() => {
    fetchNotices();
    fetchLiveStatus();
  }, []);

  const fetchLiveStatus = async () => {
    const { data } = await supabase
      .from('live_broadcast')
      .select('is_live, sermon_title, next_title, speaker_name, next_scheduled_time')
      .eq('id', 1)
      .single();
    if (data) setLiveStatus(data);
  };

  const fetchNotices = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('notices')
      .select('*')
      .order('date', { ascending: false });
      
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

  const handleOpenAdd = () => {
    setEditingId(null);
    setFormData(EMPTY_FORM);
    setIsModalOpen(true);
  };

  const handleEdit = (notice) => {
    setEditingId(notice.id);
    setFormData({
      type: notice.type || 'upcoming',
      title: notice.title || '',
      speaker: notice.speaker || 'ගෞරවනීය ස්වාමීන් වහන්සේ',
      platform: notice.platform || 'Kalyanamitta Live Portal',
      description: notice.description || '',
      date: notice.date || '',
      time: notice.time || '07:00 PM',
      duration: notice.duration || '',
      thumbnail: notice.thumbnail || '',
      has_notes: notice.has_notes || false,
      link_url: notice.link_url || '/live',
      link_text: notice.link_text || 'Join Session'
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      const payload = {
        type: formData.type,
        title: formData.title.trim(),
        speaker: formData.speaker.trim(),
        platform: formData.platform.trim(),
        description: formData.description.trim(),
        date: formData.date,
        time: formData.time.trim(),
        duration: formData.duration?.trim() || null,
        thumbnail: formData.thumbnail?.trim() || null,
        has_notes: formData.has_notes,
        link_url: formData.link_url?.trim() || '/live',
        link_text: formData.link_text?.trim() || 'Join Session',
        created_by: user?.id || null
      };

      if (editingId) {
        const { error } = await supabase
          .from('notices')
          .update(payload)
          .eq('id', editingId);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('notices')
          .insert([payload]);
        if (error) throw error;
      }

      setIsModalOpen(false);
      setEditingId(null);
      setFormData(EMPTY_FORM);
      fetchNotices();
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
    <div style={{ maxWidth: '1200px', margin: '0 auto', paddingBottom: '60px' }}>
      
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '32px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '2rem', fontFamily: 'var(--font-serif)', fontWeight: '400', margin: '0 0 8px 0', color: 'var(--text-main)' }}>
            Notices & Scheduled Sermons
          </h1>
          <p style={{ color: 'var(--text-muted)', margin: 0, fontSize: '0.95rem' }}>
            Manage upcoming dharma deshana, schedule dates, and publish event notices to the Home Notice Board.
          </p>
        </div>
        <button 
          onClick={handleOpenAdd}
          style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'var(--primary)', color: 'white', border: 'none', padding: '12px 22px', borderRadius: '8px', fontWeight: '600', cursor: 'pointer', transition: 'all 0.2s' }}
        >
          <Plus size={18} /> Schedule New Sermon / Notice
        </button>
      </div>

      {/* Live Broadcast Sync Card */}
      <div style={{
        background: 'var(--bg-secondary)', border: '1px solid var(--glass-border)',
        borderRadius: '12px', padding: '20px 24px', marginBottom: '32px',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{ width: 10, height: 10, borderRadius: '50%', background: liveStatus?.is_live ? '#dc2626' : '#666', boxShadow: liveStatus?.is_live ? '0 0 10px #dc2626' : 'none' }} />
          <div>
            <h4 style={{ margin: '0 0 4px 0', fontSize: '1rem', color: liveStatus?.is_live ? '#dc2626' : 'var(--text-main)', fontWeight: 700 }}>
              {liveStatus?.is_live ? '🔴 Broadcast is LIVE NOW' : '⚪ Broadcast is OFFLINE'}
            </h4>
            <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              {liveStatus?.is_live 
                ? `Currently spotlights on the Home Notice Board as 'LIVE NOW': "${liveStatus.sermon_title || liveStatus.next_title || 'සජීවී ධර්ම දේශනාව'}"`
                : 'When Live is ON in Control Panel, it automatically spotlights as LIVE NOW on the Home Notice Board.'}
            </p>
          </div>
        </div>
        <Link
          to="/portal-ops/live"
          style={{
            display: 'flex', alignItems: 'center', gap: '8px',
            background: 'rgba(255, 255, 255, 0.08)', border: '1px solid var(--glass-border)',
            color: 'var(--text-main)', padding: '8px 18px', borderRadius: '8px',
            textDecoration: 'none', fontSize: '0.85rem', fontWeight: 600, transition: 'all 0.2s'
          }}
        >
          <Radio size={16} color="var(--primary)" /> Go to Live Control Panel
        </Link>
      </div>

      {/* Notices List */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '60px', color: 'var(--text-muted)' }}>
          <Loader2 size={32} style={{ animation: 'spin 1s linear infinite', margin: '0 auto 12px auto' }} />
          <div>Loading scheduled notices…</div>
        </div>
      ) : notices.length === 0 ? (
        <div style={{ background: 'var(--bg-secondary)', border: '1px solid var(--glass-border)', borderRadius: '12px', padding: '60px 24px', textAlign: 'center' }}>
          <Calendar size={48} style={{ opacity: 0.2, margin: '0 auto 16px auto', color: 'var(--primary)' }} />
          <h3 style={{ margin: '0 0 8px 0', fontSize: '1.2rem', color: 'var(--text-main)' }}>No Scheduled Notices Yet</h3>
          <p style={{ color: 'var(--text-muted)', margin: '0 0 20px 0', maxWidth: '500px', marginInline: 'auto' }}>
            Click 'Schedule New Sermon' to add an upcoming deshana, date, and description. It will appear on the Home page Notice Board.
          </p>
          <button 
            onClick={handleOpenAdd}
            style={{ background: 'var(--primary)', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: '8px', fontWeight: 600, cursor: 'pointer' }}
          >
            + Create First Notice
          </button>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {notices.map(notice => (
            <div 
              key={notice.id} 
              style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                background: 'var(--bg-secondary)', border: '1px solid var(--glass-border)',
                borderRadius: '12px', padding: '24px', flexWrap: 'wrap', gap: '16px'
              }}
            >
              <div style={{ flex: 1, minWidth: '280px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px', flexWrap: 'wrap' }}>
                  <span style={{
                    fontSize: '0.72rem', fontWeight: '700', textTransform: 'uppercase',
                    color: notice.type === 'live' ? '#dc2626' : 'var(--primary)',
                    background: notice.type === 'live' ? 'rgba(220, 38, 38, 0.1)' : 'rgba(140, 21, 21, 0.08)',
                    padding: '3px 10px', borderRadius: '12px', letterSpacing: '1px'
                  }}>
                    {notice.type}
                  </span>
                  <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '5px' }}>
                    <Calendar size={14} color="var(--primary)" /> {notice.date}
                  </span>
                  <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '5px' }}>
                    <Clock size={14} color="var(--primary)" /> {notice.time}
                  </span>
                  {notice.platform && (
                    <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '5px' }}>
                      <Video size={14} color="var(--primary)" /> {notice.platform}
                    </span>
                  )}
                </div>

                <h3 style={{ fontSize: '1.25rem', fontFamily: 'var(--font-sinhala)', margin: '0 0 6px 0', fontWeight: '600', color: 'var(--text-main)' }}>
                  {notice.title}
                </h3>

                {notice.speaker && (
                  <p style={{ margin: '0 0 8px 0', fontSize: '0.9rem', color: 'var(--primary)', fontFamily: 'var(--font-sinhala)', fontWeight: 500 }}>
                    {notice.speaker}
                  </p>
                )}

                <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text-muted)', fontFamily: 'var(--font-sinhala)', lineHeight: 1.5, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                  {notice.description}
                </p>
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                <button 
                  onClick={() => handleEdit(notice)}
                  title="Edit Notice"
                  style={{
                    display: 'flex', alignItems: 'center', gap: '6px',
                    background: 'rgba(255, 255, 255, 0.06)', border: '1px solid var(--glass-border)',
                    color: 'var(--text-main)', padding: '8px 14px', borderRadius: '8px',
                    cursor: 'pointer', fontSize: '0.85rem', fontWeight: 600
                  }}
                >
                  <Edit size={16} /> Edit
                </button>

                <button 
                  onClick={() => handleDelete(notice.id)} 
                  title="Delete Notice"
                  style={{
                    display: 'flex', alignItems: 'center', gap: '6px',
                    background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.25)',
                    color: '#ef4444', padding: '8px 14px', borderRadius: '8px',
                    cursor: 'pointer', fontSize: '0.85rem', fontWeight: 600
                  }}
                >
                  <Trash2 size={16} /> Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add / Edit Notice Modal */}
      {isModalOpen && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(6px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '20px' }}>
          <div style={{ background: 'var(--bg-secondary)', width: '100%', maxWidth: '640px', maxHeight: '90vh', overflowY: 'auto', padding: '32px', borderRadius: '16px', border: '1px solid var(--glass-border)', boxShadow: '0 20px 50px rgba(0,0,0,0.5)' }}>
            
            <h2 style={{ fontSize: '1.6rem', fontFamily: 'var(--font-serif)', margin: '0 0 8px 0', color: 'var(--text-main)' }}>
              {editingId ? 'Edit Sermon Notice' : 'Schedule New Sermon Notice'}
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', margin: '0 0 24px 0' }}>
              Fill in the details below. This will appear on the Home Page Notice Board and the Notices archive.
            </p>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
              
              {/* Type Selection */}
              <div>
                <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: 600, marginBottom: '8px', color: 'var(--text-main)' }}>Notice Type</label>
                <select 
                  name="type" 
                  value={formData.type} 
                  onChange={handleInputChange} 
                  style={{ width: '100%', padding: '12px', borderRadius: '8px', background: 'var(--bg-main)', border: '1px solid var(--glass-border)', color: 'var(--text-main)', outline: 'none' }}
                >
                  <option value="upcoming">Upcoming Sermon (ඉදිරි ධර්ම දේශනා)</option>
                  <option value="live">Live Stream Announcement (සජීවී)</option>
                  <option value="special">Special Event (විශේෂ පින්කම්)</option>
                  <option value="past">Past / Recording Archive (පටිගත කිරීම්)</option>
                </select>
              </div>

              {/* Title */}
              <div>
                <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: 600, marginBottom: '8px', color: 'var(--text-main)' }}>Sermon Title (දේශනා මාතෘකාව)</label>
                <input 
                  required 
                  type="text" 
                  placeholder="e.g. නිවන් දැකීමේ අවශ්‍යතාවය සහ කල්‍යාණ මිත්‍රත්වය"
                  name="title" 
                  value={formData.title} 
                  onChange={handleInputChange} 
                  style={{ width: '100%', padding: '12px', borderRadius: '8px', background: 'var(--bg-main)', border: '1px solid var(--glass-border)', color: 'var(--text-main)', outline: 'none', fontFamily: 'var(--font-sinhala)', fontSize: '0.95rem' }} 
                />
              </div>

              {/* Speaker / Monk */}
              <div>
                <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: 600, marginBottom: '8px', color: 'var(--text-main)' }}>Speaker / Monk (දේශකයාණන් වහන්සේ)</label>
                <input 
                  required 
                  type="text" 
                  placeholder="e.g. පූජ්‍ය අගලකඩ සිරිසුමන නාහිමි"
                  name="speaker" 
                  value={formData.speaker} 
                  onChange={handleInputChange} 
                  style={{ width: '100%', padding: '12px', borderRadius: '8px', background: 'var(--bg-main)', border: '1px solid var(--glass-border)', color: 'var(--text-main)', outline: 'none', fontFamily: 'var(--font-sinhala)', fontSize: '0.95rem' }} 
                />
              </div>

              {/* Date & Time */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: 600, marginBottom: '8px', color: 'var(--text-main)' }}>Date (දිනය)</label>
                  <input 
                    required 
                    type="date" 
                    name="date" 
                    value={formData.date} 
                    onChange={handleInputChange} 
                    style={{ width: '100%', padding: '12px', borderRadius: '8px', background: 'var(--bg-main)', border: '1px solid var(--glass-border)', color: 'var(--text-main)', outline: 'none' }} 
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: 600, marginBottom: '8px', color: 'var(--text-main)' }}>Time (වේලාව)</label>
                  <input 
                    required 
                    type="text" 
                    placeholder="e.g. 07:00 PM" 
                    name="time" 
                    value={formData.time} 
                    onChange={handleInputChange} 
                    style={{ width: '100%', padding: '12px', borderRadius: '8px', background: 'var(--bg-main)', border: '1px solid var(--glass-border)', color: 'var(--text-main)', outline: 'none' }} 
                  />
                </div>
              </div>

              {/* Platform */}
              <div>
                <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: 600, marginBottom: '8px', color: 'var(--text-main)' }}>Platform / Medium (මාධ්‍යය)</label>
                <input 
                  type="text" 
                  placeholder="e.g. Kalyanamitta Live Portal, Microsoft Teams, Zoom"
                  name="platform" 
                  value={formData.platform} 
                  onChange={handleInputChange} 
                  style={{ width: '100%', padding: '12px', borderRadius: '8px', background: 'var(--bg-main)', border: '1px solid var(--glass-border)', color: 'var(--text-main)', outline: 'none' }} 
                />
              </div>

              {/* Description */}
              <div>
                <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: 600, marginBottom: '8px', color: 'var(--text-main)' }}>Description (විස්තරය)</label>
                <textarea 
                  required 
                  rows={3} 
                  placeholder="දේශනාව පිළිබඳ කෙටි හැඳින්වීමක්..."
                  name="description" 
                  value={formData.description} 
                  onChange={handleInputChange} 
                  style={{ width: '100%', padding: '12px', borderRadius: '8px', background: 'var(--bg-main)', border: '1px solid var(--glass-border)', color: 'var(--text-main)', outline: 'none', fontFamily: 'var(--font-sinhala)', fontSize: '0.95rem' }} 
                />
              </div>

              {/* Action Link & Text */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: 600, marginBottom: '8px', color: 'var(--text-main)' }}>Button Link URL</label>
                  <input 
                    type="text" 
                    placeholder="/live" 
                    name="link_url" 
                    value={formData.link_url} 
                    onChange={handleInputChange} 
                    style={{ width: '100%', padding: '12px', borderRadius: '8px', background: 'var(--bg-main)', border: '1px solid var(--glass-border)', color: 'var(--text-main)', outline: 'none' }} 
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: 600, marginBottom: '8px', color: 'var(--text-main)' }}>Button Text</label>
                  <input 
                    type="text" 
                    placeholder="Join Live Session" 
                    name="link_text" 
                    value={formData.link_text} 
                    onChange={handleInputChange} 
                    style={{ width: '100%', padding: '12px', borderRadius: '8px', background: 'var(--bg-main)', border: '1px solid var(--glass-border)', color: 'var(--text-main)', outline: 'none' }} 
                  />
                </div>
              </div>

              {/* Modal Buttons */}
              <div style={{ display: 'flex', gap: '16px', marginTop: '16px' }}>
                <button 
                  type="button" 
                  onClick={() => setIsModalOpen(false)} 
                  style={{ flex: 1, background: 'transparent', border: '1px solid var(--glass-border)', color: 'var(--text-main)', padding: '14px', borderRadius: '8px', cursor: 'pointer', fontWeight: 600 }}
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  disabled={saving} 
                  style={{ flex: 1, background: 'var(--primary)', border: 'none', color: '#fff', padding: '14px', borderRadius: '8px', fontWeight: 700, cursor: saving ? 'not-allowed' : 'pointer', opacity: saving ? 0.7 : 1 }}
                >
                  {saving ? 'Saving…' : (editingId ? 'Update Notice' : 'Publish Notice')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <style>{`
        @keyframes spin { 100% { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}
