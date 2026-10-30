import React, { useState, useEffect, useMemo } from 'react';
import { 
  Award, 
  Plus, 
  ExternalLink, 
  Share2, 
  Copy, 
  Trash2, 
  Search, 
  Download, 
  Check, 
  Calendar, 
  MapPin, 
  Heart, 
  Sparkles,
  MessageCircle,
  FileSpreadsheet,
  Layers,
  X
} from 'lucide-react';
import { supabase } from '../../utils/supabase';

const INITIAL_RECORDS = [
  {
    id: 'km-bless-01',
    donor_name: 'සුනිල් පෙරේරා සහ පවුලේ සැම',
    donor_phone: '0771234567',
    puja_name: 'පැපොල්ගස්දෙණිය විහාරස්ථානයේ මහා සම්බුද්ධ පූජාව',
    puja_date: '2026 ඔක්තෝබර් 17 වන දින (සෙනසුරාදා)',
    puja_location: 'පැපොල්ගස්දෙණිය විහාරස්ථානය',
    puja_type: 'උදෑසන කිරි ආහාර පූජාව',
    contribution_details: 'උදෑසන කිරිපිඬු හා මීපැණි පූජාමය දායකත්වය',
    dedication: 'මියපරලොව ගිය දෙමාපියන්ට සහ ඤාතීන්ට උතුම් නිවන් සුව පිණිසත්, පවුලේ සැමට සෙත් ශාන්තිය උදෙසාත් සිදුකළ උතුම් පින්කමකි.',
    gatha_pali: 'භවතු සබ්බ මංගලං — රක්ඛන්තු සබ්බ දේවතා\nසබ්බ බුද්ධානුභාවේන — සදා සොත්ථි භවන්තු තේ!',
    gatha_meaning: 'සියලු මංගල්‍යයන් සිදුවේවා! සියලු දෙවියෝ ඔබ රකිත්වා! සියලු බුදුවරුන්ගේ අනුභාවයෙන් ඔබට සැමදා සෙතක්ම වේවා!',
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 4).toISOString(),
    certificate_no: 'KM-PUJA-2026-089'
  },
  {
    id: 'km-bless-02',
    donor_name: 'චාමර වික්‍රමසිංහ මහතා සහ දූ දරුවන්',
    donor_phone: '0714567890',
    puja_name: 'පැපොල්ගස්දෙණිය විහාරස්ථානයේ මහා සම්බුද්ධ පූජාව',
    puja_date: '2026 ඔක්තෝබර් 17 වන දින (සෙනසුරාදා)',
    puja_location: 'පැපොල්ගස්දෙණිය විහාරස්ථානය',
    puja_type: 'දහවල් දෙතිස් ව්‍යංජන පූජාව',
    contribution_details: 'මහා දහවල් සම්බුද්ධ පූජාව සහ මහා සංඝගත දක්ෂිණාව',
    dedication: 'දෙලොව යහපත පිණිසත්, නීරෝගී සුවය හා දූ දරුවන්ගේ අධ්‍යාපන කටයුතු සාර්ථක වීම පිණිසත් පිරිනමන ලද ආමිස-ප්‍රතිපත්ති පූජාවකි.',
    gatha_pali: 'සබ්බීතියෝ විවජ්ජන්තු — සබ්බ රෝගෝ විනස්සතු\nමා තේ භවත්‍වත්ථරායෝ — සුඛී දීඝායුකෝ භව!',
    gatha_meaning: 'සියලු උපද්‍රව දුරුවේවා! සියලු රෝග විනාශ වේවා! ඔබට කිසිදු අනතුරක් නොවේවා! සුවපත් වූ දීර්ඝායුෂ ඇත්තෙක් වේවා!',
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 20).toISOString(),
    certificate_no: 'KM-PUJA-2026-092'
  }
];

export default function AnumodanaManager() {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [copiedId, setCopiedId] = useState(null);

  // Form State for New Anumodana Card
  const [formData, setFormData] = useState({
    donor_name: '',
    donor_phone: '',
    puja_name: 'පැපොල්ගස්දෙණිය විහාරස්ථානයේ මහා සම්බුද්ධ පූජාව',
    puja_date: '2026 ඔක්තෝබර් 17 වන දින (සෙනසුරාදා)',
    puja_location: 'පැපොල්ගස්දෙණිය විහාරස්ථානය',
    puja_type: 'උදෑසන කිරි ආහාර පූජාව',
    contribution_details: '',
    dedication: 'මියපරලොව ගිය ඤාතීන්ට පින් පිණිසත්, පවුලේ සැමට සෙත් ශාන්තිය හා නිවන් සුව පිණිසත්...',
    gatha_pali: 'භවතු සබ්බ මංගලං — රක්ඛන්තු සබ්බ දේවතා\nසබ්බ බුද්ධානුභාවේන — සදා සොත්ථි භවන්තු තේ!',
    gatha_meaning: 'සියලු මංගල්‍යයන් සිදුවේවා! සියලු දෙවියෝ ඔබ රකිත්වා! සියලු බුදුවරුන්ගේ අනුභාවයෙන් ඔබට සැමදා සෙතක්ම වේවා!'
  });

  useEffect(() => {
    fetchRecords();
  }, []);

  const fetchRecords = async () => {
    setLoading(true);
    let allRecords = [];

    // 1. Try Supabase
    try {
      const { data, error } = await supabase
        .from('punyanumodana')
        .select('*')
        .order('created_at', { ascending: false });

      if (!error && data && data.length > 0) {
        allRecords = data;
      }
    } catch (e) {
      console.warn('Supabase fetch notice:', e);
    }

    // 2. LocalStorage merge
    try {
      const localData = JSON.parse(localStorage.getItem('km_punyanumodana_records_list') || '[]');
      if (localData.length > 0) {
        const existingIds = new Set(allRecords.map(r => r.id));
        localData.forEach(r => {
          if (!existingIds.has(r.id)) allRecords.push(r);
        });
      }
    } catch (e) {
      console.error(e);
    }

    // Default mock data if empty
    if (allRecords.length === 0) {
      allRecords = INITIAL_RECORDS;
      try {
        localStorage.setItem('km_punyanumodana_records_list', JSON.stringify(INITIAL_RECORDS));
        const map = {};
        INITIAL_RECORDS.forEach(r => { map[r.id] = r; });
        localStorage.setItem('km_punyanumodana_records', JSON.stringify(map));
      } catch {}
    }

    setRecords(allRecords);
    setLoading(false);
  };

  const handleCreateRecord = async (e) => {
    e.preventDefault();
    if (!formData.donor_name.trim()) {
      alert('කරුණාකර දායක මහතාගේ හෝ පවුලේ නම ඇතුළත් කරන්න.');
      return;
    }

    const uniqueId = `km-bless-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 6)}`;
    const certNumber = `KM-PUJA-2026-${Math.floor(100 + Math.random() * 900)}`;

    const newRecord = {
      id: uniqueId,
      ...formData,
      certificate_no: certNumber,
      created_at: new Date().toISOString()
    };

    // 1. Insert to Supabase if available
    try {
      await supabase.from('punyanumodana').insert([newRecord]);
    } catch (err) {
      console.warn('Supabase insert notice:', err);
    }

    // 2. Save to resilient localStorage
    const updated = [newRecord, ...records];
    setRecords(updated);
    try {
      localStorage.setItem('km_punyanumodana_records_list', JSON.stringify(updated));
      const map = JSON.parse(localStorage.getItem('km_punyanumodana_records') || '{}');
      map[uniqueId] = newRecord;
      localStorage.setItem('km_punyanumodana_records', JSON.stringify(map));
    } catch (err) {
      console.error(err);
    }

    // Reset Form
    setFormData({
      donor_name: '',
      donor_phone: '',
      puja_name: 'පැපොල්ගස්දෙණිය විහාරස්ථානයේ මහා සම්බුද්ධ පූජාව',
      puja_date: '2026 ඔක්තෝබර් 17 වන දින (සෙනසුරාදා)',
      puja_location: 'පැපොල්ගස්දෙණිය විහාරස්ථානය',
      puja_type: 'උදෑසන කිරි ආහාර පූජාව',
      contribution_details: '',
      dedication: 'මියපරලොව ගිය ඤාතීන්ට පින් පිණිසත්, පවුලේ සැමට සෙත් ශාන්තිය හා නිවන් සුව පිණිසත්...',
      gatha_pali: 'භවතු සබ්බ මංගලං — රක්ඛන්තු සබ්බ දේවතා\nසබ්බ බුද්ධානුභාවේන — සදා සොත්ථි භවන්තු තේ!',
      gatha_meaning: 'සියලු මංගල්‍යයන් සිදුවේවා! සියලු දෙවියෝ ඔබ රකිත්වා! සියලු බුදුවරුන්ගේ අනුභාවයෙන් ඔබට සැමදා සෙතක්ම වේවා!'
    });

    setShowModal(false);
  };

  const handleDeleteRecord = async (id) => {
    if (!window.confirm('මෙම පුණ්‍යානුමෝදනා පත්‍රිකාව ඉවත් කිරීමට අවශ්‍ය බව තහවුරු කරන්න?')) return;
    try {
      await supabase.from('punyanumodana').delete().eq('id', id);
    } catch {}

    const updated = records.filter(r => r.id !== id);
    setRecords(updated);
    try {
      localStorage.setItem('km_punyanumodana_records_list', JSON.stringify(updated));
      const map = JSON.parse(localStorage.getItem('km_punyanumodana_records') || '{}');
      delete map[id];
      localStorage.setItem('km_punyanumodana_records', JSON.stringify(map));
    } catch {}
  };

  const handleCopyLink = (id) => {
    const url = `${window.location.origin}/anumodana/${id}`;
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  const handleSendWhatsApp = (record) => {
    const cleanPhone = (record.donor_phone || '').replace(/[^0-9]/g, '');
    const phoneParam = cleanPhone ? (cleanPhone.startsWith('94') ? cleanPhone : `94${cleanPhone.replace(/^0/, '')}`) : '';
    const webviewUrl = `${window.location.origin}/anumodana/${record.id}`;

    const text = encodeURIComponent(
      `තෙරුවන් සරණයි! ගෞරවනීය ${record.donor_name},\n\n` +
      `2026 ඔක්තෝබර් 17 වන දින පැපොල්ගස්දෙණිය විහාරස්ථානයේ පැවැත්වෙන මහා සම්බුද්ධ පූජාව සඳහා ඔබ විසින් සිදුකළ උතුම් *${record.puja_type}* දායකත්වය වෙනුවෙන් කල්‍යාණමිත්ත ශාසනික මණ්ඩලය විසින් පිරිනමන විශේෂිත රාජකීය ඩිජිටල් පුණ්‍යානුමෝදනා පත්‍රිකාව පහත සබැඳියෙන් (Link) විවෘත කර බලන්න:\n\n` +
      `👉 ${webviewUrl}\n\n` +
      `🌸 *භවතු සබ්බ මංගලං රක්ඛන්තු සබ්බ දේවතා*\n` +
      `*සබ්බ බුද්ධානුභාවේන සදා සොත්ථි භවන්තු තේ!*\n\n` +
      `- කල්‍යාණමිත්ත ශාසනික මෙහෙවර කමිටුව`
    );

    const waUrl = phoneParam 
      ? `https://api.whatsapp.com/send?phone=${phoneParam}&text=${text}`
      : `https://api.whatsapp.com/send?text=${text}`;
    
    window.open(waUrl, '_blank');
  };

  const filteredRecords = useMemo(() => {
    return records.filter(r => 
      r.donor_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.puja_type?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.donor_phone?.includes(searchQuery) ||
      r.certificate_no?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [records, searchQuery]);

  return (
    <div style={{ maxWidth: '1240px', margin: '0 auto', color: '#fff', fontFamily: 'var(--font-sinhala)' }}>
      
      {/* ── Top Header ── */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '20px', marginBottom: '32px' }}>
        <div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(212, 175, 55, 0.12)', color: '#d4af37', border: '1px solid rgba(212, 175, 55, 0.3)', padding: '4px 12px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', marginBottom: '8px' }}>
            <Award size={14} /> Official Punyanumodana Engine
          </div>
          <h1 style={{ fontSize: 'clamp(1.8rem, 3.5vw, 2.4rem)', fontWeight: 800, color: '#ffffff', margin: '0 0 6px 0', letterSpacing: '-0.02em' }}>
            පුණ්‍යානුමෝදනා පත්‍රිකා කළමනාකරණය
          </h1>
          <p style={{ color: '#888', fontSize: '0.92rem', margin: 0 }}>
            පූජාවන්ට දායක වන සැදැහැවතුන් සඳහා සුවිශේෂී ඩිජිටල් පත්‍රිකා සකසා, අද්විතීය Webview Links නිර්මාණය කර WhatsApp/Email මගින් යවන්න.
          </p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            background: 'var(--primary)',
            color: '#fff',
            border: 'none',
            padding: '12px 22px',
            borderRadius: '12px',
            fontWeight: 700,
            fontSize: '0.95rem',
            cursor: 'pointer',
            boxShadow: '0 4px 18px rgba(140, 21, 21, 0.4)'
          }}
        >
          <Plus size={18} />
          <span>නව පුණ්‍යානුමෝදනාවක් සාදන්න</span>
        </button>
      </div>

      {/* ── Search & Filter Bar ── */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', background: '#18181b', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '16px', padding: '12px 20px', marginBottom: '24px' }}>
        <Search size={18} color="#888" />
        <input 
          type="text"
          placeholder="දායක නම, දුරකථන අංකය හෝ සහතික අංකය මගින් සොයන්න..."
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          style={{
            background: 'transparent',
            border: 'none',
            color: '#fff',
            outline: 'none',
            width: '100%',
            fontSize: '0.92rem',
            fontFamily: 'var(--font-sinhala)'
          }}
        />
      </div>

      {/* ── Records Table ── */}
      <div style={{ background: '#18181b', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '20px', overflow: 'hidden' }}>
        <div style={{ padding: '20px 24px', borderBottom: '1px solid rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ fontWeight: 700, fontSize: '1rem', color: '#fff' }}>
            නිකුත් කළ පුණ්‍යානුමෝදනා ලැයිස්තුව ({filteredRecords.length})
          </div>
          <div style={{ fontSize: '0.82rem', color: '#888' }}>
            සෑම record එකකටම අද්විතීය Webview එකක් ස්වයංක්‍රීයව ක්‍රියාත්මක වේ
          </div>
        </div>

        {loading ? (
          <div style={{ padding: '60px', textAlign: 'center', color: '#888' }}>
            දත්ත ලබාගනිමින් පවතී...
          </div>
        ) : filteredRecords.length === 0 ? (
          <div style={{ padding: '60px', textAlign: 'center', color: '#888' }}>
            පුණ්‍යානුමෝදනා වාර්තා කිසිවක් හමු නොවීය.
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
              <thead>
                <tr style={{ background: 'rgba(255,255,255,0.02)', borderBottom: '1px solid rgba(255,255,255,0.06)', color: '#888', fontSize: '0.8rem', textTransform: 'uppercase' }}>
                  <th style={{ padding: '16px 20px' }}>සහතික අංකය</th>
                  <th style={{ padding: '16px 20px' }}>දායක නම</th>
                  <th style={{ padding: '16px 20px' }}>දායකත්වය</th>
                  <th style={{ padding: '16px 20px' }}>WhatsApp අංකය</th>
                  <th style={{ padding: '16px 20px' }}>දිනය</th>
                  <th style={{ padding: '16px 20px', textAlign: 'right' }}>ක්‍රියාමාර්ග (Actions)</th>
                </tr>
              </thead>
              <tbody>
                {filteredRecords.map(r => (
                  <tr key={r.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                    <td style={{ padding: '16px 20px', color: '#d4af37', fontWeight: 700 }}>
                      {r.certificate_no}
                    </td>
                    <td style={{ padding: '16px 20px' }}>
                      <div style={{ fontWeight: 700, color: '#fff' }}>{r.donor_name}</div>
                      <div style={{ fontSize: '0.78rem', color: '#888', marginTop: '2px', maxWidth: '240px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {r.dedication}
                      </div>
                    </td>
                    <td style={{ padding: '16px 20px' }}>
                      <span style={{ background: 'rgba(140,21,21,0.2)', color: '#ff8a8a', padding: '4px 10px', borderRadius: '12px', fontSize: '0.78rem', fontWeight: 600 }}>
                        {r.puja_type}
                      </span>
                    </td>
                    <td style={{ padding: '16px 20px', color: '#aaa' }}>
                      {r.donor_phone || 'සටහන් කර නැත'}
                    </td>
                    <td style={{ padding: '16px 20px', color: '#888', fontSize: '0.82rem' }}>
                      {new Date(r.created_at).toLocaleDateString()}
                    </td>
                    <td style={{ padding: '16px 20px', textAlign: 'right' }}>
                      <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                        
                        {/* Open in Dedicated New Tab Webview */}
                        <a
                          href={`/anumodana/${r.id}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '4px',
                            background: 'rgba(212, 175, 55, 0.15)',
                            color: '#facc15',
                            border: '1px solid rgba(212, 175, 55, 0.3)',
                            padding: '6px 12px',
                            borderRadius: '8px',
                            textDecoration: 'none',
                            fontSize: '0.8rem',
                            fontWeight: 700
                          }}
                          title="නව Tab එකකින් Webview එක විවෘත කරන්න"
                        >
                          <ExternalLink size={14} />
                          <span>Webview</span>
                        </a>

                        {/* WhatsApp Direct Send */}
                        <button
                          onClick={() => handleSendWhatsApp(r)}
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '4px',
                            background: '#25d366',
                            color: '#fff',
                            border: 'none',
                            padding: '6px 12px',
                            borderRadius: '8px',
                            cursor: 'pointer',
                            fontSize: '0.8rem',
                            fontWeight: 700
                          }}
                          title="WhatsApp මගින් යවන්න"
                        >
                          <MessageCircle size={14} />
                          <span>WhatsApp</span>
                        </button>

                        {/* Copy Link */}
                        <button
                          onClick={() => handleCopyLink(r.id)}
                          style={{
                            background: 'rgba(255,255,255,0.05)',
                            border: 'none',
                            color: copiedId === r.id ? '#25d366' : '#888',
                            padding: '7px',
                            borderRadius: '8px',
                            cursor: 'pointer'
                          }}
                          title="Webview Link එක Copy කරන්න"
                        >
                          {copiedId === r.id ? <Check size={16} /> : <Copy size={16} />}
                        </button>

                        {/* Delete */}
                        <button
                          onClick={() => handleDeleteRecord(r.id)}
                          style={{
                            background: 'rgba(255,0,0,0.1)',
                            border: 'none',
                            color: '#ff6b6b',
                            padding: '7px',
                            borderRadius: '8px',
                            cursor: 'pointer'
                          }}
                          title="ඉවත් කරන්න"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ── Create New Anumodana Modal ── */}
      {showModal && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0,0,0,0.85)',
          backdropFilter: 'blur(8px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '20px'
        }}>
          <div style={{
            background: '#18181b',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: '24px',
            width: '100%',
            maxWidth: '680px',
            maxHeight: '90vh',
            overflowY: 'auto',
            padding: '32px',
            position: 'relative'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
              <div>
                <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#fff', margin: 0 }}>
                  නව පුණ්‍යානුමෝදනා පත්‍රිකාවක් සාදන්න
                </h3>
                <p style={{ fontSize: '0.85rem', color: '#888', margin: '4px 0 0 0' }}>
                  දායක තොරතුරු ඇතුළත් කළ සැනින් අද්විතීය Webview Link එකක් සහ Status Card එකක් සැකසේ.
                </p>
              </div>
              <button 
                onClick={() => setShowModal(false)}
                style={{ background: 'transparent', border: 'none', color: '#888', cursor: 'pointer' }}
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleCreateRecord} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', color: '#ccc', marginBottom: '6px' }}>
                  දායක මහතාගේ / පවුලේ නම *
                </label>
                <input 
                  type="text"
                  required
                  placeholder="උදා: සුනිල් පෙරේරා සහ පවුලේ සැම"
                  value={formData.donor_name}
                  onChange={e => setFormData({ ...formData, donor_name: e.target.value })}
                  style={{ width: '100%', padding: '12px 16px', background: '#27272a', border: '1px solid #3f3f46', borderRadius: '10px', color: '#fff', outline: 'none', fontFamily: 'var(--font-sinhala)' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', color: '#ccc', marginBottom: '6px' }}>
                    WhatsApp දුරකථන අංකය
                  </label>
                  <input 
                    type="text"
                    placeholder="0771234567"
                    value={formData.donor_phone}
                    onChange={e => setFormData({ ...formData, donor_phone: e.target.value })}
                    style={{ width: '100%', padding: '12px 16px', background: '#27272a', border: '1px solid #3f3f46', borderRadius: '10px', color: '#fff', outline: 'none' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', color: '#ccc', marginBottom: '6px' }}>
                    පූජාමය දායකත්වය *
                  </label>
                  <select 
                    value={formData.puja_type}
                    onChange={e => setFormData({ ...formData, puja_type: e.target.value })}
                    style={{ width: '100%', padding: '12px 16px', background: '#27272a', border: '1px solid #3f3f46', borderRadius: '10px', color: '#fff', outline: 'none', fontFamily: 'var(--font-sinhala)' }}
                  >
                    <option value="උදෑසන කිරි ආහාර පූජාව">උදෑසන කිරි ආහාර පූජාව</option>
                    <option value="දහවල් දෙතිස් ව්‍යංජන පූජාව">දහවල් දෙතිස් ව්‍යංජන පූජාව</option>
                    <option value="සුවිශේෂී ආලෝක හා මල් පූජාව">සුවිශේෂී ආලෝක හා මල් පූජාව</option>
                    <option value="මූල්‍යමය සම්මාදම">මූල්‍යමය සම්මාදම</option>
                    <option value="පූජා භාණ්ඩ දායකත්වය">පූජා භාණ්ඩ දායකත්වය</option>
                  </select>
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', color: '#ccc', marginBottom: '6px' }}>
                  පූජාවේ නම සහ දිනය
                </label>
                <input 
                  type="text"
                  value={formData.puja_name}
                  onChange={e => setFormData({ ...formData, puja_name: e.target.value })}
                  style={{ width: '100%', padding: '12px 16px', background: '#27272a', border: '1px solid #3f3f46', borderRadius: '10px', color: '#fff', outline: 'none', fontFamily: 'var(--font-sinhala)' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', color: '#ccc', marginBottom: '6px' }}>
                  සම්මාදම් විස්තරය (විකල්ප)
                </label>
                <input 
                  type="text"
                  placeholder="උදා: රු. 10,000 ක මූල්‍ය පරිත්‍යාගය / පූජා ද්‍රව්‍ය සම්මාදම"
                  value={formData.contribution_details}
                  onChange={e => setFormData({ ...formData, contribution_details: e.target.value })}
                  style={{ width: '100%', padding: '12px 16px', background: '#27272a', border: '1px solid #3f3f46', borderRadius: '10px', color: '#fff', outline: 'none', fontFamily: 'var(--font-sinhala)' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', color: '#ccc', marginBottom: '6px' }}>
                  පින් අනුමෝදනා ප්‍රාර්ථනාව *
                </label>
                <textarea 
                  rows={3}
                  required
                  value={formData.dedication}
                  onChange={e => setFormData({ ...formData, dedication: e.target.value })}
                  style={{ width: '100%', padding: '12px 16px', background: '#27272a', border: '1px solid #3f3f46', borderRadius: '10px', color: '#fff', outline: 'none', fontFamily: 'var(--font-sinhala)', resize: 'vertical' }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '12px' }}>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  style={{ padding: '12px 20px', borderRadius: '10px', background: 'transparent', border: '1px solid #3f3f46', color: '#ccc', cursor: 'pointer' }}
                >
                  අවලංගු කරන්න
                </button>
                <button
                  type="submit"
                  style={{ padding: '12px 24px', borderRadius: '10px', background: 'var(--primary)', border: 'none', color: '#fff', fontWeight: 700, cursor: 'pointer' }}
                >
                  පුණ්‍යානුමෝදනාව සකසන්න
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
