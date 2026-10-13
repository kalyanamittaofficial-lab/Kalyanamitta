import React, { useState, useEffect, useMemo } from 'react';
import { useOutletContext, Link } from 'react-router-dom';
import { supabase } from '../../utils/supabase';
import {
  Plus, Trash2, Edit, Calendar, Clock, Loader2,
  Radio, Video, User, Search, Filter, ExternalLink,
  Link as LinkIcon, Sparkles, X, Check, Eye
} from 'lucide-react';

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
  link_text: 'Join Live Session',
};

export default function NoticeManager() {
  const { userRole, showToast, openConfirmModal } = useOutletContext();
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [saving, setSaving] = useState(false);
  const [liveStatus, setLiveStatus] = useState(null);
  const [formData, setFormData] = useState(EMPTY_FORM);

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTypeFilter, setSelectedTypeFilter] = useState('all');

  useEffect(() => {
    fetchNotices();
    fetchLiveStatus();
  }, []);

  const fetchLiveStatus = async () => {
    try {
      const { data } = await supabase
        .from('live_broadcast')
        .select('is_live, sermon_title, next_title, speaker_name, next_scheduled_time')
        .eq('id', 1)
        .single();
      if (data) setLiveStatus(data);
    } catch (err) {
      console.warn('Failed to fetch live broadcast status:', err);
    }
  };

  const fetchNotices = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('notices')
        .select('*')
        .order('date', { ascending: false });

      if (error) throw error;
      setNotices(data || []);
    } catch (err) {
      showToast?.('error', 'Error fetching notices: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleOpenAdd = () => {
    setEditingId(null);
    setFormData({
      ...EMPTY_FORM,
      date: new Date().toISOString().split('T')[0],
    });
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
      link_text: notice.link_text || 'Join Live Session',
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      showToast?.('error', 'Please enter a notice / sermon title.');
      return;
    }

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
        link_text: formData.link_text?.trim() || 'Join Live Session',
        created_by: user?.id || null,
      };

      if (editingId) {
        const { error } = await supabase
          .from('notices')
          .update(payload)
          .eq('id', editingId);
        if (error) throw error;
        showToast?.('success', 'Notice updated successfully!');
      } else {
        const { error } = await supabase
          .from('notices')
          .insert([payload]);
        if (error) throw error;
        showToast?.('success', 'Notice scheduled and published successfully!');
      }

      setIsModalOpen(false);
      setEditingId(null);
      setFormData(EMPTY_FORM);
      fetchNotices();
    } catch (error) {
      showToast?.('error', 'Error saving notice: ' + error.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = (id, title) => {
    openConfirmModal?.({
      title: 'Delete Scheduled Notice?',
      message: `Are you sure you want to permanently remove "${title || 'this notice'}" from the notice board?`,
      confirmText: 'Delete Notice',
      danger: true,
      onConfirm: async () => {
        const { error } = await supabase.from('notices').delete().eq('id', id);
        if (error) throw error;
        showToast?.('success', 'Notice deleted successfully.');
        fetchNotices();
      },
    });
  };

  // Filtered notices
  const filteredNotices = useMemo(() => {
    return notices.filter((item) => {
      // Type Filter
      if (selectedTypeFilter !== 'all' && item.type !== selectedTypeFilter) {
        return false;
      }
      // Search Query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesTitle = item.title?.toLowerCase().includes(q);
        const matchesSpeaker = item.speaker?.toLowerCase().includes(q);
        const matchesDesc = item.description?.toLowerCase().includes(q);
        const matchesPlatform = item.platform?.toLowerCase().includes(q);
        return matchesTitle || matchesSpeaker || matchesDesc || matchesPlatform;
      }
      return true;
    });
  }, [notices, selectedTypeFilter, searchQuery]);

  return (
    <div style={{ maxWidth: '1240px', margin: '0 auto', paddingBottom: '60px' }}>
      
      {/* ── Page Header ── */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          marginBottom: '28px',
          flexWrap: 'wrap',
          gap: '16px',
        }}
      >
        <div>
          <h1
            style={{
              fontSize: '2rem',
              fontWeight: 800,
              margin: '0 0 6px 0',
              color: 'var(--adm-text-main)',
              letterSpacing: '-0.5px',
            }}
          >
            Notices & Scheduled Sermons
          </h1>
          <p style={{ color: 'var(--adm-text-muted)', margin: 0, fontSize: '0.95rem' }}>
            Publish upcoming Dhamma Deshana, Zoom/Teams sessions, and live announcements to the Home Notice Board.
          </p>
        </div>

        <button onClick={handleOpenAdd} className="adm-btn adm-btn-primary" style={{ padding: '12px 22px' }}>
          <Plus size={18} /> Schedule New Sermon / Notice
        </button>
      </div>

      {/* ── Live Broadcast Sync Status Banner ── */}
      <div
        className="adm-card"
        style={{
          marginBottom: '28px',
          padding: '20px 24px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '16px',
          background: liveStatus?.is_live
            ? 'linear-gradient(135deg, rgba(239, 68, 68, 0.12) 0%, rgba(20, 20, 24, 0.95) 100%)'
            : 'var(--adm-bg-card)',
          border: `1px solid ${liveStatus?.is_live ? 'rgba(239, 68, 68, 0.35)' : 'var(--adm-border)'}`,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px', minWidth: '260px' }}>
          <div
            style={{
              width: 10,
              height: 10,
              borderRadius: '50%',
              background: liveStatus?.is_live ? 'var(--adm-live)' : '#71717a',
              boxShadow: liveStatus?.is_live ? '0 0 10px var(--adm-live)' : 'none',
            }}
            className={liveStatus?.is_live ? 'adm-pulse' : ''}
          />
          <div>
            <h4 style={{ margin: '0 0 4px 0', fontSize: '0.98rem', color: liveStatus?.is_live ? 'var(--adm-live)' : 'var(--adm-text-main)', fontWeight: 700 }}>
              {liveStatus?.is_live ? '🔴 Broadcast is LIVE NOW on Main Notice Board' : '⚪ Live Broadcast is Currently Offline'}
            </h4>
            <p style={{ margin: 0, fontSize: '0.84rem', color: 'var(--adm-text-muted)' }}>
              {liveStatus?.is_live
                ? `Featured Card on the Home Page displays: "${liveStatus.sermon_title || 'සජීවී ධර්ම දේශනාව'}"`
                : 'When Live is switched ON in Live Studio, it dynamically overrides the top card as "LIVE NOW".'}
            </p>
          </div>
        </div>

        <Link to="/portal-ops/live" className="adm-btn adm-btn-secondary" style={{ padding: '8px 16px', fontSize: '0.85rem' }}>
          <Radio size={15} color="var(--adm-primary)" /> Go to Live Studio
        </Link>
      </div>

      {/* ── Search & Filter Toolbar ── */}
      <div
        className="adm-card"
        style={{
          padding: '16px 20px',
          marginBottom: '24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '14px',
        }}
      >
        {/* Search Input */}
        <div style={{ position: 'relative', flex: 1, minWidth: '260px' }}>
          <Search size={16} color="var(--adm-text-dim)" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
          <input
            type="text"
            className="adm-input"
            placeholder="Search notices by title, monk name, or platform…"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ paddingLeft: '38px', height: '42px', fontSize: '0.9rem' }}
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--adm-text-dim)', cursor: 'pointer' }}
            >
              <X size={15} />
            </button>
          )}
        </div>

        {/* Filter Pills */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
          {[
            { id: 'all', label: 'All Notices' },
            { id: 'live', label: '🔴 Live Events' },
            { id: 'upcoming', label: '📅 Upcoming' },
            { id: 'special', label: '⭐ Special' },
            { id: 'past', label: 'Archive' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setSelectedTypeFilter(tab.id)}
              style={{
                padding: '8px 14px',
                borderRadius: '8px',
                border: 'none',
                background: selectedTypeFilter === tab.id ? 'var(--adm-primary)' : 'rgba(255, 255, 255, 0.05)',
                color: selectedTypeFilter === tab.id ? '#fff' : 'var(--adm-text-muted)',
                fontSize: '0.82rem',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.15s ease',
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* ── Notices Cards List ── */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '60px', color: 'var(--adm-text-muted)' }}>
          <Loader2 size={32} className="adm-spin" style={{ margin: '0 auto 12px auto' }} />
          <div>Loading scheduled notices…</div>
        </div>
      ) : filteredNotices.length === 0 ? (
        <div className="adm-card" style={{ padding: '60px 24px', textAlign: 'center' }}>
          <Calendar size={48} style={{ opacity: 0.2, margin: '0 auto 16px auto', color: 'var(--adm-primary)' }} />
          <h3 style={{ margin: '0 0 8px 0', fontSize: '1.2rem', color: 'var(--adm-text-main)' }}>
            {searchQuery ? 'No Matching Notices Found' : 'No Notices Scheduled Yet'}
          </h3>
          <p style={{ color: 'var(--adm-text-muted)', margin: '0 0 20px 0', maxWidth: '460px', marginInline: 'auto', fontSize: '0.9rem' }}>
            {searchQuery
              ? `No notices matched your search query "${searchQuery}". Try a different keyword.`
              : 'Click "Schedule New Sermon" to publish your first Dhamma Deshana notice to the home board.'}
          </p>
          <button onClick={handleOpenAdd} className="adm-btn adm-btn-primary">
            + Create First Notice
          </button>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {filteredNotices.map((notice) => (
            <div
              key={notice.id}
              className="adm-card"
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '22px 26px',
                flexWrap: 'wrap',
                gap: '16px',
              }}
            >
              <div style={{ flex: 1, minWidth: '300px' }}>
                {/* Meta pills */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px', flexWrap: 'wrap' }}>
                  <span className={`adm-badge ${notice.type === 'live' ? 'adm-badge-live' : 'adm-badge-warning'}`}>
                    {notice.type}
                  </span>
                  <span style={{ color: 'var(--adm-text-muted)', fontSize: '0.82rem', display: 'flex', alignItems: 'center', gap: '5px' }}>
                    <Calendar size={13} color="var(--adm-primary)" /> {notice.date}
                  </span>
                  <span style={{ color: 'var(--adm-text-muted)', fontSize: '0.82rem', display: 'flex', alignItems: 'center', gap: '5px' }}>
                    <Clock size={13} color="var(--adm-primary)" /> {notice.time}
                  </span>
                  {notice.platform && (
                    <span style={{ color: 'var(--adm-text-muted)', fontSize: '0.82rem', display: 'flex', alignItems: 'center', gap: '5px' }}>
                      <Video size={13} color="var(--adm-gold)" /> {notice.platform}
                    </span>
                  )}
                </div>

                {/* Title */}
                <h3
                  style={{
                    fontSize: '1.25rem',
                    fontFamily: 'var(--adm-font-sinhala)',
                    margin: '0 0 6px 0',
                    fontWeight: 700,
                    color: 'var(--adm-text-main)',
                  }}
                >
                  {notice.title}
                </h3>

                {/* Monk Name */}
                {notice.speaker && (
                  <p
                    style={{
                      margin: '0 0 8px 0',
                      fontSize: '0.9rem',
                      color: 'var(--adm-gold)',
                      fontFamily: 'var(--adm-font-sinhala)',
                      fontWeight: 600,
                    }}
                  >
                    {notice.speaker}
                  </p>
                )}

                {/* Description */}
                <p
                  style={{
                    margin: 0,
                    fontSize: '0.88rem',
                    color: 'var(--adm-text-muted)',
                    fontFamily: 'var(--adm-font-sinhala)',
                    lineHeight: 1.5,
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                  }}
                >
                  {notice.description}
                </p>
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                <button
                  onClick={() => handleEdit(notice)}
                  className="adm-btn adm-btn-secondary"
                  title="Edit Notice"
                  style={{ padding: '8px 14px', fontSize: '0.84rem' }}
                >
                  <Edit size={15} /> Edit
                </button>

                <button
                  onClick={() => handleDelete(notice.id, notice.title)}
                  className="adm-btn adm-btn-danger"
                  title="Delete Notice"
                  style={{ padding: '8px 14px', fontSize: '0.84rem' }}
                >
                  <Trash2 size={15} /> Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── High-End Create & Edit Modal with Live Card Preview ── */}
      {isModalOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.8)',
            backdropFilter: 'blur(8px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
            padding: '20px',
            animation: 'admModalFade 0.2s ease-out',
          }}
          onClick={(e) => {
            if (e.target === e.currentTarget && !saving) setIsModalOpen(false);
          }}
        >
          <div
            style={{
              background: '#131317',
              border: '1px solid var(--adm-border)',
              borderRadius: '16px',
              width: '100%',
              maxWidth: '920px',
              maxHeight: '90vh',
              overflowY: 'auto',
              boxShadow: '0 24px 60px rgba(0,0,0,0.7)',
              animation: 'admModalPop 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
            }}
            className="admin-scroll"
          >
            {/* Modal Topbar */}
            <div
              style={{
                padding: '20px 28px',
                borderBottom: '1px solid var(--adm-border)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <div>
                <h3 style={{ margin: '0 0 2px 0', fontSize: '1.25rem', color: 'var(--adm-text-main)', fontWeight: 700 }}>
                  {editingId ? 'Edit Sermon Notice' : 'Schedule New Sermon / Notice'}
                </h3>
                <p style={{ margin: 0, fontSize: '0.82rem', color: 'var(--adm-text-muted)' }}>
                  Configure all details below. Preview on the right updates live.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="adm-btn adm-btn-ghost"
                style={{ padding: '6px' }}
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Form Grid: 2 Columns (Form on left, Preview on right) */}
            <form onSubmit={handleSubmit} style={{ padding: '24px 28px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '28px' }}>
                
                {/* Form Inputs (Left) */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
                  
                  {/* Type Selection */}
                  <div className="adm-input-group">
                    <label className="adm-label">Notice Type</label>
                    <select
                      name="type"
                      value={formData.type}
                      onChange={handleInputChange}
                      className="adm-select"
                    >
                      <option value="upcoming">Upcoming Session (ඉදිරි ධර්ම දේශනාව)</option>
                      <option value="live">Live Event (සජීවී විකාශය)</option>
                      <option value="special">Special Event (විශේෂ වැඩසටහන)</option>
                      <option value="past">Archived Session</option>
                    </select>
                  </div>

                  {/* Sermon Title */}
                  <div className="adm-input-group">
                    <label className="adm-label">Sermon Title (දේශනාවේ මාතෘකාව) *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. නිවන් දැකීමේ අවශ්‍යතාවය සහ කල්‍යාණ මිත්‍රත්වය"
                      name="title"
                      value={formData.title}
                      onChange={handleInputChange}
                      className="adm-input"
                      style={{ fontFamily: 'var(--adm-font-sinhala)' }}
                    />
                  </div>

                  {/* Speaker Monk */}
                  <div className="adm-input-group">
                    <label className="adm-label">Venerable Speaker (දේශකයාණන් වහන්සේ)</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. පූජ්‍ය අගලකඩ සිරිසුමන නාහිමි"
                      name="speaker"
                      value={formData.speaker}
                      onChange={handleInputChange}
                      className="adm-input"
                      style={{ fontFamily: 'var(--adm-font-sinhala)' }}
                    />
                  </div>

                  {/* Date & Time Row */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                    <div className="adm-input-group">
                      <label className="adm-label">Date (දිනය)</label>
                      <input
                        type="date"
                        required
                        name="date"
                        value={formData.date}
                        onChange={handleInputChange}
                        className="adm-input"
                      />
                    </div>
                    <div className="adm-input-group">
                      <label className="adm-label">Time (වේලාව)</label>
                      <input
                        type="text"
                        required
                        placeholder="07:00 PM"
                        name="time"
                        value={formData.time}
                        onChange={handleInputChange}
                        className="adm-input"
                      />
                    </div>
                  </div>

                  {/* Platform */}
                  <div className="adm-input-group">
                    <label className="adm-label">Platform / Medium (මාධ්‍යය)</label>
                    <input
                      type="text"
                      placeholder="e.g. Kalyanamitta Live Portal, Microsoft Teams, Zoom"
                      name="platform"
                      value={formData.platform}
                      onChange={handleInputChange}
                      className="adm-input"
                    />
                  </div>

                  {/* Description */}
                  <div className="adm-input-group">
                    <label className="adm-label">Description (කෙටි විස්තරය)</label>
                    <textarea
                      rows={3}
                      placeholder="දේශනාව පිළිබඳ කෙටි හැඳින්වීමක්..."
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      className="adm-textarea"
                      style={{ fontFamily: 'var(--adm-font-sinhala)', lineHeight: 1.6 }}
                    />
                  </div>

                  {/* Link & Button Text */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                    <div className="adm-input-group">
                      <label className="adm-label">Button Link URL</label>
                      <input
                        type="text"
                        placeholder="/live"
                        name="link_url"
                        value={formData.link_url}
                        onChange={handleInputChange}
                        className="adm-input"
                      />
                    </div>
                    <div className="adm-input-group">
                      <label className="adm-label">Button Text</label>
                      <input
                        type="text"
                        placeholder="Join Live Session"
                        name="link_text"
                        value={formData.link_text}
                        onChange={handleInputChange}
                        className="adm-input"
                      />
                    </div>
                  </div>

                </div>

                {/* Live Card Preview (Right) */}
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                    <Eye size={16} color="var(--adm-gold)" />
                    <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--adm-text-main)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                      Home Page Notice Card Preview
                    </span>
                  </div>

                  {/* Preview Card Shell */}
                  <div
                    style={{
                      background: 'rgba(255, 255, 255, 0.03)',
                      border: '1px solid rgba(255, 255, 255, 0.12)',
                      borderRadius: '16px',
                      padding: '24px',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '14px',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px' }}>
                      <span className={`adm-badge ${formData.type === 'live' ? 'adm-badge-live' : 'adm-badge-warning'}`}>
                        {formData.type === 'live' ? '🔴 LIVE EVENT' : '📅 ' + formData.type.toUpperCase()}
                      </span>
                      <span style={{ fontSize: '0.78rem', color: 'var(--adm-gold)', fontWeight: 600 }}>
                        {formData.platform || 'Kalyanamitta Portal'}
                      </span>
                    </div>

                    <div>
                      <h4
                        style={{
                          margin: '0 0 6px 0',
                          fontSize: '1.2rem',
                          color: '#fff',
                          fontFamily: 'var(--adm-font-sinhala)',
                          fontWeight: 700,
                          lineHeight: 1.4,
                        }}
                      >
                        {formData.title || 'දේශනාවේ මාතෘකාව මෙතන දිස්වේ'}
                      </h4>
                      <p
                        style={{
                          margin: '0 0 10px 0',
                          fontSize: '0.88rem',
                          color: 'var(--adm-gold)',
                          fontFamily: 'var(--adm-font-sinhala)',
                          fontWeight: 600,
                        }}
                      >
                        {formData.speaker || 'පූජ්‍ය දේශකයාණන් වහන්සේගේ නම'}
                      </p>
                      <p
                        style={{
                          margin: 0,
                          fontSize: '0.84rem',
                          color: 'var(--adm-text-muted)',
                          fontFamily: 'var(--adm-font-sinhala)',
                          lineHeight: 1.5,
                        }}
                      >
                        {formData.description || 'දේශනාව පිළිබඳ විස්තරය මෙහි දර්ශනය වේ...'}
                      </p>
                    </div>

                    <div
                      style={{
                        paddingTop: '12px',
                        borderTop: '1px solid rgba(255, 255, 255, 0.08)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                      }}
                    >
                      <div style={{ fontSize: '0.8rem', color: 'var(--adm-text-muted)' }}>
                        🗓️ {formData.date || 'YYYY-MM-DD'} at {formData.time || '07:00 PM'}
                      </div>
                      <div
                        style={{
                          padding: '6px 14px',
                          borderRadius: '8px',
                          background: 'var(--adm-primary)',
                          color: '#fff',
                          fontSize: '0.8rem',
                          fontWeight: 700,
                        }}
                      >
                        {formData.link_text || 'Join Session'}
                      </div>
                    </div>
                  </div>

                  <p style={{ fontSize: '0.8rem', color: 'var(--adm-text-dim)', marginTop: '14px', lineHeight: 1.6 }}>
                    💡 When published, this notice will be immediately visible to all site visitors on the Home Page Notice Board and the Dedicated Notices Archive.
                  </p>
                </div>

              </div>

              {/* Modal Buttons Footer */}
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'flex-end',
                  gap: '12px',
                  marginTop: '28px',
                  paddingTop: '20px',
                  borderTop: '1px solid var(--adm-border)',
                }}
              >
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="adm-btn adm-btn-secondary"
                  disabled={saving}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="adm-btn adm-btn-primary"
                  style={{ padding: '11px 24px' }}
                >
                  {saving ? (
                    <><Loader2 size={16} className="adm-spin" /> Saving…</>
                  ) : (
                    editingId ? 'Update Notice' : 'Publish Notice'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
