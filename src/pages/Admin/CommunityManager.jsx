import React, { useState, useEffect, useMemo } from 'react';
import { 
  Users, 
  MessageCircle, 
  Download, 
  Search, 
  Calendar, 
  TrendingUp, 
  Filter, 
  Trash2, 
  ExternalLink, 
  Save, 
  Check, 
  Loader2, 
  FileSpreadsheet, 
  Sparkles, 
  Activity,
  ArrowUpDown
} from 'lucide-react';
import { supabase } from '../../utils/supabase';

export default function CommunityManager() {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [timeFilter, setTimeFilter] = useState('all'); // 'today' | 'week' | 'month' | 'all'
  const [activeStatTab, setActiveStatTab] = useState('month'); // 'week' | 'month' | 'year'
  
  // WhatsApp Link Config
  const [groupLink, setGroupLink] = useState('https://chat.whatsapp.com/invite/kalyanamitta');
  const [linkSaving, setLinkSaving] = useState(false);
  const [linkSaved, setLinkSaved] = useState(false);

  useEffect(() => {
    fetchLeads();
    loadGroupLink();
  }, []);

  const loadGroupLink = async () => {
    try {
      const { data } = await supabase
        .from('community_settings')
        .select('whatsapp_group_url')
        .eq('id', 1)
        .single();
      if (data?.whatsapp_group_url) {
        setGroupLink(data.whatsapp_group_url);
      } else {
        const local = localStorage.getItem('km_whatsapp_group_url');
        if (local) setGroupLink(local);
      }
    } catch {
      const local = localStorage.getItem('km_whatsapp_group_url');
      if (local) setGroupLink(local);
    }
  };

  const handleSaveGroupLink = async () => {
    setLinkSaving(true);
    try {
      await supabase
        .from('community_settings')
        .upsert([{ id: 1, whatsapp_group_url: groupLink.trim(), updated_at: new Date().toISOString() }]);
      localStorage.setItem('km_whatsapp_group_url', groupLink.trim());
      setLinkSaved(true);
      setTimeout(() => setLinkSaved(false), 2500);
    } catch (err) {
      localStorage.setItem('km_whatsapp_group_url', groupLink.trim());
      setLinkSaved(true);
      setTimeout(() => setLinkSaved(false), 2500);
    } finally {
      setLinkSaving(false);
    }
  };

  const fetchLeads = async () => {
    setLoading(true);
    let allLeads = [];

    // 1. Fetch from Supabase
    try {
      const { data, error } = await supabase
        .from('community_leads')
        .select('*')
        .order('created_at', { ascending: false });

      if (!error && data && data.length > 0) {
        allLeads = data;
      }
    } catch (err) {
      console.warn('Supabase fetch notice, falling back to local storage:', err);
    }

    // 2. Merge with Local Storage backup (deduplicating by phone / id)
    try {
      const localLeads = JSON.parse(localStorage.getItem('km_community_leads') || '[]');
      if (localLeads.length > 0) {
        const existingPhones = new Set(allLeads.map(l => l.whatsapp_number));
        localLeads.forEach(l => {
          if (!existingPhones.has(l.whatsapp_number)) {
            allLeads.push(l);
          }
        });
      }
    } catch (e) {
      console.error(e);
    }

    // Default mock data for rich showcase if no leads exist yet
    if (allLeads.length === 0) {
      allLeads = [
        {
          id: 'mock_1',
          full_name: 'කසුන් ජයවර්ධන',
          whatsapp_number: '0774567890',
          district: 'කොළඹ (Colombo)',
          age_group: '25-34',
          interest: 'sermons',
          referral_source: 'tiktok',
          created_at: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
          status: 'joined'
        },
        {
          id: 'mock_2',
          full_name: 'නිලක්ෂි ප්‍රනාන්දු',
          whatsapp_number: '0712345678',
          district: 'ගම්පහ (Gampaha)',
          age_group: '18-24',
          interest: 'meditation',
          referral_source: 'tiktok',
          created_at: new Date(Date.now() - 1000 * 60 * 60 * 18).toISOString(),
          status: 'joined'
        },
        {
          id: 'mock_3',
          full_name: 'චාමර වික්‍රමසිංහ',
          whatsapp_number: '0769876543',
          district: 'මහනුවර (Kandy)',
          age_group: '35-49',
          interest: 'daily-life',
          referral_source: 'tiktok',
          created_at: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(),
          status: 'joined'
        },
        {
          id: 'mock_4',
          full_name: 'සුමනදාස බණ්ඩාර',
          whatsapp_number: '0781122334',
          district: 'කුරුණෑගල (Kurunegala)',
          age_group: '50+',
          interest: 'pujas',
          referral_source: 'tiktok',
          created_at: new Date(Date.now() - 1000 * 60 * 60 * 120).toISOString(),
          status: 'joined'
        }
      ];
    }

    setLeads(allLeads);
    setLoading(false);
  };

  const handleDeleteLead = async (id) => {
    if (!window.confirm('මෙම සාමාජික වාර්තාව ඉවත් කිරීමට අවශ්‍ය බව තහවුරු කරන්න?')) return;
    try {
      await supabase.from('community_leads').delete().eq('id', id);
    } catch {}

    const updated = leads.filter(l => l.id !== id);
    setLeads(updated);
    try {
      localStorage.setItem('km_community_leads', JSON.stringify(updated));
    } catch {}
  };

  // KPI Calculations
  const now = new Date();
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const startOfWeek = new Date(now.setDate(now.getDate() - now.getDay()));
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

  const stats = useMemo(() => {
    let todayCount = 0;
    let weekCount = 0;
    let monthCount = 0;

    leads.forEach(lead => {
      const leadDate = new Date(lead.created_at);
      if (leadDate >= startOfToday) todayCount++;
      if (leadDate >= startOfWeek) weekCount++;
      if (leadDate >= startOfMonth) monthCount++;
    });

    return {
      total: leads.length,
      today: todayCount,
      week: weekCount,
      month: monthCount
    };
  }, [leads]);

  // Time-Series Analytics (Week by Week / Month by Month / Year by Year)
  const timeBreakdown = useMemo(() => {
    if (activeStatTab === 'month') {
      const monthMap = {};
      leads.forEach(l => {
        const d = new Date(l.created_at);
        const key = d.toLocaleString('en-US', { month: 'short', year: 'numeric' });
        monthMap[key] = (monthMap[key] || 0) + 1;
      });
      return Object.entries(monthMap).map(([period, count]) => ({ period, count }));
    } else if (activeStatTab === 'year') {
      const yearMap = {};
      leads.forEach(l => {
        const d = new Date(l.created_at);
        const key = d.getFullYear().toString();
        yearMap[key] = (yearMap[key] || 0) + 1;
      });
      return Object.entries(yearMap).map(([period, count]) => ({ period, count }));
    } else {
      // Week by week
      const weekMap = {};
      leads.forEach(l => {
        const d = new Date(l.created_at);
        const weekNum = Math.ceil((d.getDate() - d.getDay() + 1) / 7);
        const key = `${d.toLocaleString('en-US', { month: 'short' })} W${weekNum}`;
        weekMap[key] = (weekMap[key] || 0) + 1;
      });
      return Object.entries(weekMap).map(([period, count]) => ({ period, count }));
    }
  }, [leads, activeStatTab]);

  // Filtered Leads Table
  const filteredLeads = useMemo(() => {
    return leads.filter(lead => {
      const matchesSearch = 
        lead.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        lead.whatsapp_number?.includes(searchQuery) ||
        lead.district?.toLowerCase().includes(searchQuery.toLowerCase());

      if (!matchesSearch) return false;

      const leadDate = new Date(lead.created_at);
      if (timeFilter === 'today') return leadDate >= startOfToday;
      if (timeFilter === 'week') return leadDate >= startOfWeek;
      if (timeFilter === 'month') return leadDate >= startOfMonth;
      return true;
    });
  }, [leads, searchQuery, timeFilter]);

  // 1-Click Excel / CSV Export with UTF-8 BOM
  const exportToExcel = () => {
    if (filteredLeads.length === 0) {
      alert('බාගත කිරීමට දත්ත නොමැත.');
      return;
    }

    const headers = [
      'ID',
      'Full Name (සම්පූර්ණ නම)',
      'WhatsApp Number (දුරකථන අංකය)',
      'District / City (දිස්ත්‍රික්කය)',
      'Age Group (වයස් කාණ්ඩය)',
      'Spiritual Interest (උනන්දුව)',
      'Referral Source (පැමිණි මාර්ගය)',
      'Joined Date (දිනය)',
      'Joined Time (වේලාව)',
      'Year (වසර)',
      'Month (මාසය)',
      'Week of Month (සතිය)',
      'Status (තත්ත්වය)'
    ];

    const rows = filteredLeads.map((l, index) => {
      const d = new Date(l.created_at);
      const weekNum = Math.ceil((d.getDate() - d.getDay() + 1) / 7);

      return [
        index + 1,
        `"${(l.full_name || '').replace(/"/g, '""')}"`,
        `"${(l.whatsapp_number || '').replace(/"/g, '""')}"`,
        `"${(l.district || '').replace(/"/g, '""')}"`,
        `"${(l.age_group || '').replace(/"/g, '""')}"`,
        `"${(l.interest || '').replace(/"/g, '""')}"`,
        `"${(l.referral_source || 'tiktok').replace(/"/g, '""')}"`,
        `"${d.toISOString().split('T')[0]}"`,
        `"${d.toLocaleTimeString('en-US', { hour12: true })}"`,
        `"${d.getFullYear()}"`,
        `"${d.toLocaleString('en-US', { month: 'long' })}"`,
        `"Week ${weekNum}"`,
        `"${l.status || 'joined'}"`
      ].join(',');
    });

    // Add UTF-8 Byte Order Mark (BOM) so Excel opens Sinhala fonts with 100% clarity
    const csvContent = '\uFEFF' + [headers.join(','), ...rows].join('\r\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Kalyanamitta_WhatsApp_Leads_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div style={{ maxWidth: '1240px', margin: '0 auto', color: '#fff' }}>
      
      {/* ── Top Header Bar ── */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '20px', marginBottom: '32px' }}>
        <div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(37, 211, 102, 0.1)', color: '#25d366', border: '1px solid rgba(37, 211, 102, 0.25)', padding: '4px 12px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '8px' }}>
            <MessageCircle size={14} /> WhatsApp Community Portal
          </div>
          <h1 style={{ fontSize: 'clamp(1.8rem, 3.5vw, 2.4rem)', fontWeight: 800, color: '#ffffff', margin: '0 0 6px 0', letterSpacing: '-0.02em' }}>
            WhatsApp ප්‍රජා සාමාජික කළමනාකරණය
          </h1>
          <p style={{ color: '#888', fontSize: '0.92rem', margin: 0 }}>
            Typeform portal හරහා එකතු වූ සාමාජික තොරතුරු, සතිපතා/මාසික සංඛ්‍යාලේඛන සහ Excel බාගත කිරීම් මෙතැනින් සිදු කරන්න.
          </p>
        </div>

        {/* 1-Click Excel Export Button */}
        <button
          onClick={exportToExcel}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '10px',
            background: '#16a34a',
            color: '#fff',
            border: 'none',
            padding: '12px 22px',
            borderRadius: '12px',
            fontWeight: 700,
            fontSize: '0.95rem',
            cursor: 'pointer',
            transition: 'all 0.2s',
            boxShadow: '0 4px 18px rgba(22, 163, 74, 0.35)'
          }}
          onMouseEnter={e => e.currentTarget.style.filter = 'brightness(1.1)'}
          onMouseLeave={e => e.currentTarget.style.filter = 'brightness(1)'}
        >
          <FileSpreadsheet size={18} />
          <span>Excel වාර්තාව බාගත කරන්න (.xlsx/csv)</span>
        </button>
      </div>

      {/* ── KPI Cards Row ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px', marginBottom: '32px' }}>
        <div style={{ background: '#18181b', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '16px', padding: '20px 24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: '#25d366', marginBottom: '12px' }}>
            <Users size={22} />
            <span style={{ fontSize: '0.75rem', fontWeight: 700, background: 'rgba(37,211,102,0.12)', padding: '2px 8px', borderRadius: '12px' }}>ALL TIME</span>
          </div>
          <div style={{ fontSize: '2.2rem', fontWeight: 800, color: '#fff', lineHeight: 1 }}>{stats.total}</div>
          <div style={{ fontSize: '0.82rem', color: '#888', marginTop: '6px', fontWeight: 600 }}>මුළු සාමාජිකයින් (Total Leads)</div>
        </div>

        <div style={{ background: '#18181b', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '16px', padding: '20px 24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: '#f59e0b', marginBottom: '12px' }}>
            <Calendar size={22} />
            <span style={{ fontSize: '0.75rem', fontWeight: 700, background: 'rgba(245,158,11,0.12)', padding: '2px 8px', borderRadius: '12px' }}>THIS MONTH</span>
          </div>
          <div style={{ fontSize: '2.2rem', fontWeight: 800, color: '#fff', lineHeight: 1 }}>{stats.month}</div>
          <div style={{ fontSize: '0.82rem', color: '#888', marginTop: '6px', fontWeight: 600 }}>මෙම මාසයේ එක්වූ පිරිස</div>
        </div>

        <div style={{ background: '#18181b', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '16px', padding: '20px 24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: '#3b82f6', marginBottom: '12px' }}>
            <TrendingUp size={22} />
            <span style={{ fontSize: '0.75rem', fontWeight: 700, background: 'rgba(59,130,246,0.12)', padding: '2px 8px', borderRadius: '12px' }}>THIS WEEK</span>
          </div>
          <div style={{ fontSize: '2.2rem', fontWeight: 800, color: '#fff', lineHeight: 1 }}>{stats.week}</div>
          <div style={{ fontSize: '0.82rem', color: '#888', marginTop: '6px', fontWeight: 600 }}>මේ සතියේ එක්වූ පිරිස</div>
        </div>

        <div style={{ background: '#18181b', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '16px', padding: '20px 24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: '#ec4899', marginBottom: '12px' }}>
            <Sparkles size={22} />
            <span style={{ fontSize: '0.75rem', fontWeight: 700, background: 'rgba(236,72,153,0.12)', padding: '2px 8px', borderRadius: '12px' }}>TODAY</span>
          </div>
          <div style={{ fontSize: '2.2rem', fontWeight: 800, color: '#fff', lineHeight: 1 }}>{stats.today}</div>
          <div style={{ fontSize: '0.82rem', color: '#888', marginTop: '6px', fontWeight: 600 }}>අද දිනයේ එක්වූ පිරිස</div>
        </div>
      </div>

      {/* ── WhatsApp Group Link Configuration ── */}
      <div style={{ background: '#18181b', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '16px', padding: '20px 24px', marginBottom: '32px' }}>
        <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#25d366', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '8px' }}>
          Official WhatsApp Group Invite Link
        </div>
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          <input
            type="text"
            value={groupLink}
            onChange={(e) => setGroupLink(e.target.value)}
            placeholder="https://chat.whatsapp.com/invite/..."
            style={{
              flex: 1,
              minWidth: '280px',
              background: '#0d0d0f',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '10px',
              padding: '10px 16px',
              color: '#fff',
              fontSize: '0.92rem',
              outline: 'none'
            }}
          />
          <button
            onClick={handleSaveGroupLink}
            disabled={linkSaving}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              background: linkSaved ? '#16a34a' : 'rgba(255,255,255,0.1)',
              color: '#fff',
              border: 'none',
              padding: '10px 20px',
              borderRadius: '10px',
              fontWeight: 700,
              fontSize: '0.9rem',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
          >
            {linkSaved ? <Check size={16} /> : <Save size={16} />}
            <span>{linkSaved ? 'Saved!' : 'Save Link'}</span>
          </button>
        </div>
        <div style={{ fontSize: '0.78rem', color: '#666', marginTop: '6px' }}>
          Typeform එක අවසානයේ පරිශීලකයින් එකතු වන්නේ මෙම WhatsApp සමූහයටයි.
        </div>
      </div>

      {/* ── Time-Series Analytics (Week by Week / Month by Month / Year by Year) ── */}
      <div style={{ background: '#18181b', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '16px', padding: '24px', marginBottom: '32px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px', marginBottom: '20px' }}>
          <div>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700, margin: 0, color: '#fff' }}>
              සාමාජික වර්ධන සංඛ්‍යාලේඛන (Growth Statistics)
            </h3>
            <span style={{ fontSize: '0.8rem', color: '#777' }}>සතියෙන් සතිය, මාසයෙන් මාසය හා වසරින් වසර ප්‍රගතිය</span>
          </div>

          {/* Time Tabs */}
          <div style={{ display: 'flex', gap: '6px', background: '#0d0d0f', padding: '4px', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.06)' }}>
            <button
              onClick={() => setActiveStatTab('week')}
              style={{
                background: activeStatTab === 'week' ? '#27272a' : 'transparent',
                color: activeStatTab === 'week' ? '#fff' : '#777',
                border: 'none',
                padding: '6px 14px',
                borderRadius: '8px',
                fontSize: '0.82rem',
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              Week by Week
            </button>
            <button
              onClick={() => setActiveStatTab('month')}
              style={{
                background: activeStatTab === 'month' ? '#27272a' : 'transparent',
                color: activeStatTab === 'month' ? '#fff' : '#777',
                border: 'none',
                padding: '6px 14px',
                borderRadius: '8px',
                fontSize: '0.82rem',
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              Month by Month
            </button>
            <button
              onClick={() => setActiveStatTab('year')}
              style={{
                background: activeStatTab === 'year' ? '#27272a' : 'transparent',
                color: activeStatTab === 'year' ? '#fff' : '#777',
                border: 'none',
                padding: '6px 14px',
                borderRadius: '8px',
                fontSize: '0.82rem',
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              Year by Year
            </button>
          </div>
        </div>

        {/* Visual Progress Bar Chart */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {timeBreakdown.length === 0 ? (
            <div style={{ color: '#666', fontSize: '0.88rem', padding: '20px 0', textAlign: 'center' }}>දත්ත නොමැත</div>
          ) : (
            timeBreakdown.map((item, idx) => {
              const maxCount = Math.max(...timeBreakdown.map(t => t.count), 1);
              const pct = Math.round((item.count / maxCount) * 100);
              return (
                <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                  <span style={{ width: '90px', fontSize: '0.82rem', color: '#999', fontWeight: 600, flexShrink: 0 }}>
                    {item.period}
                  </span>
                  <div style={{ flex: 1, height: '14px', background: '#0d0d0f', borderRadius: '8px', overflow: 'hidden', position: 'relative' }}>
                    <div style={{ width: `${pct}%`, height: '100%', background: 'linear-gradient(90deg, #16a34a, #25d366)', borderRadius: '8px', transition: 'width 0.4s ease' }} />
                  </div>
                  <span style={{ width: '40px', fontSize: '0.85rem', fontWeight: 800, color: '#fff', textAlign: 'right' }}>
                    {item.count}
                  </span>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* ── Table & Search Bar ── */}
      <div style={{ background: '#18181b', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '16px', padding: '24px', overflowX: 'auto' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px', marginBottom: '20px' }}>
          
          {/* Search Field */}
          <div style={{ position: 'relative', width: '100%', maxWidth: '340px' }}>
            <Search size={16} color="#666" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="නම, දුරකථන අංකය හෝ නගරය සෙවීම..."
              style={{
                width: '100%',
                background: '#0d0d0f',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '10px',
                padding: '9px 12px 9px 36px',
                color: '#fff',
                fontSize: '0.88rem',
                outline: 'none'
              }}
            />
          </div>

          {/* Time Filter Pills */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '0.82rem', color: '#666', marginRight: '4px' }}>Filter:</span>
            {['all', 'today', 'week', 'month'].map(f => (
              <button
                key={f}
                onClick={() => setTimeFilter(f)}
                style={{
                  background: timeFilter === f ? 'rgba(255,255,255,0.12)' : 'transparent',
                  color: timeFilter === f ? '#fff' : '#777',
                  border: '1px solid rgba(255,255,255,0.06)',
                  padding: '6px 12px',
                  borderRadius: '8px',
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  textTransform: 'capitalize'
                }}
              >
                {f === 'all' ? 'All Leads' : f === 'today' ? 'Today' : f === 'week' ? 'This Week' : 'This Month'}
              </button>
            ))}
          </div>
        </div>

        {/* Data Table */}
        {loading ? (
          <div style={{ padding: '60px 0', textAlign: 'center', color: '#666' }}>
            <Loader2 size={28} style={{ animation: 'spin 1s linear infinite', margin: '0 auto 12px' }} />
            <div>දත්ත පූරණය වෙමින් පවතී...</div>
          </div>
        ) : filteredLeads.length === 0 ? (
          <div style={{ padding: '40px 0', textAlign: 'center', color: '#666', fontSize: '0.95rem' }}>
            ගැළපෙන සාමාජික වාර්තා කිසිවක් හමු නොවීය.
          </div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.88rem' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.08)', color: '#777', textTransform: 'uppercase', fontSize: '0.75rem', letterSpacing: '0.5px' }}>
                <th style={{ padding: '12px 14px' }}>#</th>
                <th style={{ padding: '12px 14px' }}>නම (Full Name)</th>
                <th style={{ padding: '12px 14px' }}>WhatsApp අංකය</th>
                <th style={{ padding: '12px 14px' }}>දිස්ත්‍රික්කය</th>
                <th style={{ padding: '12px 14px' }}>වයස</th>
                <th style={{ padding: '12px 14px' }}>උනන්දුව</th>
                <th style={{ padding: '12px 14px' }}>ලියාපදිංචි දිනය</th>
                <th style={{ padding: '12px 14px', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredLeads.map((lead, idx) => {
                const joinDate = new Date(lead.created_at);
                const rawPhone = (lead.whatsapp_number || '').replace(/[^0-9]/g, '');
                const waLink = rawPhone.startsWith('0') 
                  ? `https://wa.me/94${rawPhone.slice(1)}` 
                  : `https://wa.me/${rawPhone}`;

                return (
                  <tr 
                    key={lead.id || idx}
                    style={{ borderBottom: '1px solid rgba(255,255,255,0.04)', transition: 'background 0.15s' }}
                    onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.02)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                  >
                    <td style={{ padding: '14px', color: '#555' }}>{idx + 1}</td>
                    
                    <td style={{ padding: '14px', fontWeight: 700, color: '#fff' }}>
                      {lead.full_name}
                      <span style={{ display: 'block', fontSize: '0.72rem', color: '#666', fontWeight: 500 }}>
                        via {lead.referral_source || 'tiktok'}
                      </span>
                    </td>

                    <td style={{ padding: '14px' }}>
                      <a 
                        href={waLink} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        style={{ color: '#25d366', textDecoration: 'none', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                      >
                        {lead.whatsapp_number}
                        <ExternalLink size={12} />
                      </a>
                    </td>

                    <td style={{ padding: '14px', color: '#ccc' }}>
                      {lead.district || 'නොදන්වා ඇත'}
                    </td>

                    <td style={{ padding: '14px' }}>
                      <span style={{ background: 'rgba(255,255,255,0.06)', padding: '2px 8px', borderRadius: '12px', fontSize: '0.75rem', color: '#aaa' }}>
                        {lead.age_group || '—'}
                      </span>
                    </td>

                    <td style={{ padding: '14px', color: '#bbb' }}>
                      {lead.interest === 'sermons' ? 'දේශනා හා සාකච්ඡා' :
                       lead.interest === 'meditation' ? 'භාවනා' :
                       lead.interest === 'daily-life' ? 'ජීවිතයට දහම' :
                       lead.interest === 'pujas' ? 'සම්බුද්ධ පූජා' : lead.interest || '—'}
                    </td>

                    <td style={{ padding: '14px', color: '#777', fontSize: '0.8rem' }}>
                      {joinDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      <div style={{ fontSize: '0.72rem', color: '#555' }}>
                        {joinDate.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </td>

                    <td style={{ padding: '14px', textAlign: 'right' }}>
                      <button
                        onClick={() => handleDeleteLead(lead.id)}
                        title="වාර්තාව ඉවත් කරන්න"
                        style={{ background: 'transparent', border: 'none', color: '#555', cursor: 'pointer', padding: '6px', borderRadius: '6px', transition: 'color 0.2s' }}
                        onMouseEnter={e => e.currentTarget.style.color = '#ef4444'}
                        onMouseLeave={e => e.currentTarget.style.color = '#555'}
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

    </div>
  );
}
