import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Download, 
  Share2, 
  Copy, 
  Check, 
  Calendar, 
  MapPin, 
  Heart, 
  Sparkles, 
  ArrowLeft,
  Volume2,
  VolumeX,
  ExternalLink,
  ShieldCheck,
  Award
} from 'lucide-react';
import { supabase } from '../utils/supabase';

// Default mock blessing records for instant fallback / offline resilience
const DEFAULT_RECORDS = {
  'km-bless-01': {
    id: 'km-bless-01',
    donor_name: 'සුනිල් පෙරේරා සහ පවුලේ සැම',
    puja_name: 'පැපොල්ගස්දෙණිය විහාරස්ථානයේ මහා සම්බුද්ධ පූජාව',
    puja_date: '2026 ඔක්තෝබර් 17 වන දින (සෙනසුරාදා)',
    puja_location: 'පැපොල්ගස්දෙණිය විහාරස්ථානය',
    puja_type: 'උදෑසන කිරි ආහාර පූජාව',
    contribution_details: 'උදෑසන කිරිපිඬු හා මීපැණි පූජාමය දායකත්වය',
    dedication: 'මියපරලොව ගිය දෙමාපියන්ට සහ ඤාතීන්ට උතුම් නිවන් සුව පිණිසත්, පවුලේ සැමට සෙත් ශාන්තිය උදෙසාත් සිදුකළ උතුම් පින්කමකි.',
    gatha_pali: 'භවතු සබ්බ මංගලං — රක්ඛන්තු සබ්බ දේවතා\nසබ්බ බුද්ධානුභාවේන — සදා සොත්ථි භවන්තු තේ!',
    gatha_meaning: 'සියලු මංගල්‍යයන් සිදුවේවා! සියලු දෙවියෝ ඔබ රකිත්වා! සියලු බුදුවරුන්ගේ අනුභාවයෙන් ඔබට සැමදා සෙතක්ම වේවා!',
    created_at: '2026-10-30T10:00:00Z',
    certificate_no: 'KM-PUJA-2026-089'
  },
  'km-bless-02': {
    id: 'km-bless-02',
    donor_name: 'චාමර වික්‍රමසිංහ මහතා සහ දූ දරුවන්',
    puja_name: 'පැපොල්ගස්දෙණිය විහාරස්ථානයේ මහා සම්බුද්ධ පූජාව',
    puja_date: '2026 ඔක්තෝබර් 17 වන දින (සෙනසුරාදා)',
    puja_location: 'පැපොල්ගස්දෙණිය විහාරස්ථානය',
    puja_type: 'දහවල් දෙතිස් ව්‍යංජන පූජාව',
    contribution_details: 'මහා දහවල් සම්බුද්ධ පූජාව සහ මහා සංඝගත දක්ෂිණාව',
    dedication: 'දෙලොව යහපත පිණිසත්, නීරෝගී සුවය හා දූ දරුවන්ගේ අධ්‍යාපන කටයුතු සාර්ථක වීම පිණිසත් පිරිනමන ලද ආමිස-ප්‍රතිපත්ති පූජාවකි.',
    gatha_pali: 'සබ්බීතියෝ විවජ්ජන්තු — සබ්බ රෝගෝ විනස්සතු\nමා තේ භවත්‍වත්ථරායෝ — සුඛී දීඝායුකෝ භව!',
    gatha_meaning: 'සියලු උපද්‍රව දුරුවේවා! සියලු රෝග විනාශ වේවා! ඔබට කිසිදු අනතුරක් නොවේවා! සුවපත් වූ දීර්ඝායුෂ ඇත්තෙක් වේවා!',
    created_at: '2026-10-30T11:00:00Z',
    certificate_no: 'KM-PUJA-2026-092'
  }
};

export default function AnumodanaWebView() {
  const { id } = useParams();
  const [record, setRecord] = useState(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const audioRef = useRef(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchRecord();
  }, [id]);

  const fetchRecord = async () => {
    setLoading(true);

    // 1. Try Supabase
    try {
      const { data, error } = await supabase
        .from('punyanumodana')
        .select('*')
        .eq('id', id)
        .single();

      if (!error && data) {
        setRecord(data);
        setLoading(false);
        return;
      }
    } catch {
      // Fallback below
    }

    // 2. Try LocalStorage
    try {
      const localRecords = JSON.parse(localStorage.getItem('km_punyanumodana_records') || '{}');
      if (localRecords[id]) {
        setRecord(localRecords[id]);
        setLoading(false);
        return;
      }
    } catch {
      // Fallback below
    }

    // 3. Fallback to default mock or generated view
    if (DEFAULT_RECORDS[id]) {
      setRecord(DEFAULT_RECORDS[id]);
    } else {
      // Friendly fallback so any test link opens gracefully
      setRecord({
        id: id || 'km-sample',
        donor_name: 'ශ්‍රද්ධාසම්පන්න කල්‍යාණමිත්ත දායක පවුල',
        puja_name: 'පැපොල්ගස්දෙණිය විහාරස්ථානයේ මහා සම්බුද්ධ පූජාව',
        puja_date: '2026 ඔක්තෝබර් 17 වන දින (සෙනසුරාදා)',
        puja_location: 'පැපොල්ගස්දෙණිය විහාරස්ථානය',
        puja_type: 'මහා සම්බුද්ධ පූජාමය දායකත්වය',
        contribution_details: 'උදෑසන කිරි ආහාර හා දහවල් දෙතිස් ව්‍යංජන පූජා සම්මාදම',
        dedication: 'මියපරලොව ගිය ඤාතීන්ට පින් පිණිසත්, පවුලේ සැමට සෙත් ශාන්තිය හා උතුම් නිවන් සුව පිණිසත් පිරිනැමූ පින්කමකි.',
        gatha_pali: 'භවතු සබ්බ මංගලං — රක්ඛන්තු සබ්බ දේවතා\nසබ්බ බුද්ධානුභාවේන — සදා සොත්ථි භවන්තු තේ!',
        gatha_meaning: 'සියලු මංගල්‍යයන් සිදුවේවා! සියලු දෙවියෝ ඔබ රකිත්වා! සියලු බුදුවරුන්ගේ අනුභාවයෙන් ඔබට සැමදා සෙතක්ම වේවා!',
        created_at: new Date().toISOString(),
        certificate_no: `KM-PUJA-${(id || 'LIVE').toUpperCase().slice(0, 10)}`
      });
    }
    setLoading(false);
  };

  // 1-Click HD WhatsApp Status (1080x1920) Download
  const downloadStatusCard = () => {
    if (!record) return;
    setIsGenerating(true);

    const canvas = document.createElement('canvas');
    canvas.width = 1080;
    canvas.height = 1920;
    const ctx = canvas.getContext('2d');

    // Rich Sacred Gradient Background
    const bgGradient = ctx.createRadialGradient(540, 960, 80, 540, 960, 1100);
    bgGradient.addColorStop(0, '#2b0707');
    bgGradient.addColorStop(0.4, '#170404');
    bgGradient.addColorStop(1, '#080101');
    ctx.fillStyle = bgGradient;
    ctx.fillRect(0, 0, 1080, 1920);

    // Subtle Gold Border Frame
    ctx.strokeStyle = '#d4af37';
    ctx.lineWidth = 6;
    ctx.strokeRect(50, 50, 980, 1820);

    ctx.strokeStyle = 'rgba(212, 175, 55, 0.4)';
    ctx.lineWidth = 2;
    ctx.strokeRect(66, 66, 948, 1788);

    // Corner Ornaments
    const drawCorner = (x, y) => {
      ctx.fillStyle = '#d4af37';
      ctx.beginPath();
      ctx.arc(x, y, 14, 0, Math.PI * 2);
      ctx.fill();
    };
    drawCorner(66, 66);
    drawCorner(1014, 66);
    drawCorner(66, 1854);
    drawCorner(1014, 1854);

    // Header Emblem
    ctx.fillStyle = '#d4af37';
    ctx.font = '76px serif';
    ctx.textAlign = 'center';
    ctx.fillText('☸', 540, 220);

    // Brand Header
    ctx.fillStyle = '#fef08a';
    ctx.font = 'bold 36px sans-serif';
    ctx.fillText('කල්‍යාණමිත්ත ශාසනික මෙහෙවර', 540, 290);

    ctx.fillStyle = '#d4af37';
    ctx.font = '26px sans-serif';
    ctx.fillText(`නිල පුණ්‍යානුමෝදනා පත්‍රිකා අංක: ${record.certificate_no || 'KM-PUJA-OFFICIAL'}`, 540, 335);

    // Gold Divider
    ctx.strokeStyle = 'rgba(212, 175, 55, 0.6)';
    ctx.beginPath();
    ctx.moveTo(320, 370);
    ctx.lineTo(760, 370);
    ctx.stroke();

    // Event Info Badge
    ctx.fillStyle = 'rgba(140, 21, 21, 0.65)';
    ctx.roundRect(120, 410, 840, 140, 20);
    ctx.fill();
    ctx.strokeStyle = '#d4af37';
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 36px sans-serif';
    ctx.fillText(record.puja_name || 'පැපොල්ගස්දෙණිය විහාරස්ථානයේ මහා සම්බුද්ධ පූජාව', 540, 470);
    ctx.fillStyle = '#facc15';
    ctx.font = '28px sans-serif';
    ctx.fillText(record.puja_date || '2026 ඔක්තෝබර් 17 වන දින', 540, 515);

    // Donor Recognition Label
    ctx.fillStyle = '#d4af37';
    ctx.font = '30px sans-serif';
    ctx.fillText('උතුම් දායකත්වය පිරිනැමූ ගෞරවනීය', 540, 660);

    // Donor Name (Hero)
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 50px sans-serif';
    ctx.fillText(record.donor_name || 'ශ්‍රද්ධාසම්පන්න දායක පවුල', 540, 740);

    // Puja Type Card
    ctx.fillStyle = 'rgba(255, 255, 255, 0.06)';
    ctx.roundRect(120, 820, 840, 150, 20);
    ctx.fill();
    ctx.strokeStyle = 'rgba(212, 175, 55, 0.35)';
    ctx.stroke();

    ctx.fillStyle = '#fef08a';
    ctx.font = 'bold 30px sans-serif';
    ctx.fillText('පූජාමය දායකත්වය:', 540, 875);
    ctx.fillStyle = '#ffffff';
    ctx.font = '36px sans-serif';
    ctx.fillText(record.puja_type || 'මහා සම්බුද්ධ පූජා දායකත්වය', 540, 930);

    // Dedication Purpose
    ctx.fillStyle = '#d4af37';
    ctx.font = '28px sans-serif';
    ctx.fillText('පින් අනුමෝදනා ප්‍රාර්ථනාව:', 540, 1060);

    ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
    ctx.font = '32px sans-serif';
    ctx.fillText(`"${record.dedication || 'පවුලේ සැමට සෙත් ශාන්තිය පිණිස'}"`, 540, 1120);

    // Sacred Gatha Blessing Card
    ctx.fillStyle = 'rgba(212, 175, 55, 0.08)';
    ctx.roundRect(120, 1230, 840, 360, 24);
    ctx.fill();
    ctx.strokeStyle = '#d4af37';
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.fillStyle = '#facc15';
    ctx.font = 'bold 34px serif';
    const lines = (record.gatha_pali || 'භවතු සබ්බ මංගලං — රක්ඛන්තු සබ්බ දේවතා\nසබ්බ බුද්ධානුභාවේන — සදා සොත්ථි භවන්තු තේ!').split('\n');
    ctx.fillText(lines[0] || '', 540, 1320);
    ctx.fillText(lines[1] || '', 540, 1385);

    ctx.fillStyle = 'rgba(255, 255, 255, 0.88)';
    ctx.font = '28px sans-serif';
    ctx.fillText('මෙම උතුම් කුසල බලයෙන් ඔබ සැමට සෙත් ශාන්තිය උදාවේවා!', 540, 1475);
    ctx.fillText('චතුරාර්ය සත්‍යාවබෝධය පිණිසම හේතු වාසනා වේවා!', 540, 1525);

    // Monastic Seal Badge
    ctx.fillStyle = '#d4af37';
    ctx.font = '24px sans-serif';
    ctx.fillText('☸ ශ්‍රී කල්‍යාණමිත්ත මහා සංඝ සභාවේ ගෞරවනීය ආශිර්වාදයෙනි', 540, 1680);

    // Footer
    ctx.fillStyle = '#d4af37';
    ctx.font = 'italic 28px serif';
    ctx.fillText('"ධම්මෝ හවේ රක්ඛති ධම්මචාරී"', 540, 1750);

    ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
    ctx.font = '22px sans-serif';
    ctx.fillText('kalyanamitta.org · නිල ඩිජිටල් පුණ්‍යානුමෝදනාව', 540, 1795);

    setTimeout(() => {
      const dataUrl = canvas.toDataURL('image/png');
      const a = document.createElement('a');
      a.href = dataUrl;
      a.download = `Punyanumodana_${(record.donor_name || 'Blessing').replace(/\s+/g, '_')}.png`;
      a.click();
      setIsGenerating(false);
    }, 300);
  };

  // WhatsApp Share Trigger
  const shareToWhatsApp = () => {
    if (!record) return;
    const url = window.location.href;
    const text = encodeURIComponent(
      `☸️ *කල්‍යාණමිත්ත රාජකීය ධර්ම ප්‍රසාද පුණ්‍යානුමෝදනාව*\n\n` +
      `ගෞරවනීය *${record.donor_name}* විසින් 2026 ඔක්තෝබර් 17 වන දින පැපොල්ගස්දෙණිය විහාරස්ථානයේදී පැවැත්වෙන මහා සම්බුද්ධ පූජාව සඳහා සිදුකළ උතුම් *${record.puja_type}* දායකත්වය වෙනුවෙන් පිරිනැමෙන විශේෂිත ඩිජිටල් පුණ්‍යානුමෝදනා පත්‍රිකාවයි.\n\n` +
      `✨ *ප්‍රාර්ථනාව:* ${record.dedication}\n\n` +
      `🌸 *භවතු සබ්බ මංගලං රක්ඛන්තු සබ්බ දේවතා*\n` +
      `*සබ්බ බුද්ධානුභාවේන සදා සොත්ථි භවන්තු තේ!*\n\n` +
      `ඩිජිටල් පත්‍රිකාව මෙතැනින් විවෘත කර බලන්න:\n${url}`
    );
    window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
  };

  // Copy Link to Clipboard
  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  if (loading) {
    return (
      <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0d0202', color: '#d4af37', gap: '14px', fontFamily: 'var(--font-sinhala)' }}>
        <div style={{ width: 32, height: 32, border: '3px solid rgba(212, 175, 55, 0.3)', borderTopColor: '#d4af37', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
        <style>{`@keyframes spin{100%{transform:rotate(360deg)}}`}</style>
        <span>පුණ්‍යානුමෝදනා පත්‍රිකාව සූදානම් වෙමින් පවතී...</span>
      </div>
    );
  }

  return (
    <div style={{
      minHeight: '100vh',
      width: '100%',
      background: 'radial-gradient(ellipse at top, #230505 0%, #110202 50%, #060101 100%)',
      color: '#ffffff',
      display: 'flex',
      flexDirection: 'column',
      position: 'relative',
      overflowX: 'clip',
      fontFamily: 'var(--font-sinhala)'
    }}>
      
      {/* ── Top Navigation Bar ── */}
      <nav style={{
        width: '100%',
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '20px 24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        zIndex: 50,
        flexWrap: 'wrap',
        gap: '12px'
      }}>
        <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '10px', textDecoration: 'none', color: '#fef08a' }}>
          <img src="/kalyanamitta-logo.png" alt="Logo" style={{ height: '36px', width: 'auto' }} />
          <div>
            <div style={{ fontFamily: 'var(--font-serif)', fontSize: '1.15rem', fontWeight: 800, color: '#fff', lineHeight: 1 }}>
              Kalyanamitta
            </div>
            <div style={{ fontSize: '0.72rem', color: '#d4af37', letterSpacing: '0.04em' }}>
              රාජකීය ශාසනික මෙහෙවර
            </div>
          </div>
        </Link>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button
            onClick={handleCopyLink}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '8px 14px',
              borderRadius: '20px',
              background: 'rgba(255, 255, 255, 0.08)',
              border: '1px solid rgba(212, 175, 55, 0.3)',
              color: '#d4af37',
              fontSize: '0.82rem',
              fontWeight: 700,
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
          >
            {copied ? <Check size={14} color="#25d366" /> : <Copy size={14} />}
            <span>{copied ? 'Link එක Copy විය!' : 'Link එක Copy කරන්න'}</span>
          </button>

          <Link
            to="/sasanaya"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '8px 16px',
              borderRadius: '20px',
              background: 'var(--primary)',
              color: '#ffffff',
              fontSize: '0.82rem',
              fontWeight: 700,
              textDecoration: 'none'
            }}
          >
            <ArrowLeft size={14} />
            <span>ශාසනය සුරකිමු</span>
          </Link>
        </div>
      </nav>

      {/* ── Main Stage Showcase ── */}
      <main style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px 20px 80px',
        maxWidth: '760px',
        margin: '0 auto',
        width: '100%'
      }}>
        
        {/* Certificate Card Frame */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.35, ease: 'easeOut' }}
          style={{
            width: '100%',
            background: 'linear-gradient(180deg, #180303 0%, #0d0101 100%)',
            border: '3px solid #d4af37',
            borderRadius: '28px',
            padding: 'clamp(28px, 5vw, 48px) clamp(20px, 4vw, 36px)',
            boxShadow: '0 30px 80px rgba(0, 0, 0, 0.6), 0 0 50px rgba(212, 175, 55, 0.15)',
            position: 'relative',
            textAlign: 'center',
            overflow: 'hidden'
          }}
        >
          {/* Inner Dashed Border */}
          <div style={{
            position: 'absolute',
            inset: '10px',
            border: '1px dashed rgba(212, 175, 55, 0.35)',
            borderRadius: '20px',
            pointerEvents: 'none'
          }} />

          {/* Top Gold Corner Emblems */}
          <div style={{ position: 'absolute', top: 18, left: 20, color: '#d4af37', fontSize: '1rem', opacity: 0.7 }}>❖</div>
          <div style={{ position: 'absolute', top: 18, right: 20, color: '#d4af37', fontSize: '1rem', opacity: 0.7 }}>❖</div>
          <div style={{ position: 'absolute', bottom: 18, left: 20, color: '#d4af37', fontSize: '1rem', opacity: 0.7 }}>❖</div>
          <div style={{ position: 'absolute', bottom: 18, right: 20, color: '#d4af37', fontSize: '1rem', opacity: 0.7 }}>❖</div>

          {/* Rotating Dharma Chakra */}
          <div style={{
            width: '74px',
            height: '74px',
            margin: '0 auto 12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '3rem',
            color: '#d4af37',
            filter: 'drop-shadow(0 0 16px rgba(212, 175, 55, 0.5))',
            animation: 'spinSeal 80s linear infinite'
          }}>
            <style>{`@keyframes spinSeal{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}`}</style>
            ☸
          </div>

          <div style={{
            color: '#fef08a',
            fontSize: '0.82rem',
            fontWeight: 800,
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            marginBottom: '6px'
          }}>
            කල්‍යාණමිත්ත ශාසනික මෙහෙවර
          </div>

          <h1 style={{
            fontFamily: 'var(--font-serif)',
            fontSize: 'clamp(1.6rem, 3.5vw, 2.3rem)',
            color: '#ffffff',
            fontWeight: 800,
            margin: '0 0 14px 0',
            letterSpacing: '-0.01em',
            lineHeight: 1.25
          }}>
            මහා සම්බුද්ධ පූජා පුණ්‍යානුමෝදනාව
          </h1>

          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            background: 'rgba(212, 175, 55, 0.1)',
            border: '1px solid rgba(212, 175, 55, 0.3)',
            padding: '4px 14px',
            borderRadius: '20px',
            fontSize: '0.75rem',
            color: '#d4af37',
            marginBottom: '24px'
          }}>
            <ShieldCheck size={14} />
            <span>නිල ලියාපදිංචි සහතිකය: <strong>{record.certificate_no}</strong></span>
          </div>

          {/* Puja Event Details Box */}
          <div style={{
            background: 'rgba(140, 21, 21, 0.45)',
            border: '1px solid rgba(212, 175, 55, 0.4)',
            borderRadius: '16px',
            padding: '14px 20px',
            marginBottom: '26px'
          }}>
            <div style={{ fontSize: '1.05rem', fontWeight: 800, color: '#facc15', marginBottom: '4px' }}>
              {record.puja_name}
            </div>
            <div style={{ fontSize: '0.88rem', color: 'rgba(255, 255, 255, 0.85)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '16px', flexWrap: 'wrap' }}>
              <span>📅 {record.puja_date}</span>
              <span>📍 {record.puja_location}</span>
            </div>
          </div>

          {/* Donor Hero Section */}
          <div style={{ marginBottom: '24px' }}>
            <div style={{ fontSize: '0.88rem', color: '#d4af37', fontWeight: 600, marginBottom: '6px' }}>
              උතුම් දායකත්වය පිරිනැමූ ගෞරවනීය
            </div>
            <div style={{
              fontFamily: 'var(--font-serif)',
              fontSize: 'clamp(1.7rem, 4vw, 2.5rem)',
              fontWeight: 800,
              color: '#ffffff',
              lineHeight: 1.2,
              wordBreak: 'break-word',
              textShadow: '0 4px 20px rgba(212, 175, 55, 0.3)'
            }}>
              {record.donor_name}
            </div>
          </div>

          {/* Puja Type Chip */}
          <div style={{
            background: 'rgba(255, 255, 255, 0.05)',
            border: '1px solid rgba(212, 175, 55, 0.25)',
            borderRadius: '14px',
            padding: '14px 20px',
            marginBottom: '24px',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '0.78rem', color: '#fef08a', fontWeight: 700, textTransform: 'uppercase', marginBottom: '4px' }}>
              පූජාමය දායකත්වය
            </div>
            <div style={{ fontSize: '1.18rem', fontWeight: 800, color: '#ffffff' }}>
              {record.puja_type}
            </div>
            {record.contribution_details && (
              <div style={{ fontSize: '0.85rem', color: 'rgba(255, 255, 255, 0.7)', marginTop: '4px' }}>
                ({record.contribution_details})
              </div>
            )}
          </div>

          {/* Dedication Prayer Quote */}
          {record.dedication && (
            <div style={{
              background: 'rgba(212, 175, 55, 0.06)',
              borderLeft: '3px solid #d4af37',
              borderRadius: '0 12px 12px 0',
              padding: '14px 18px',
              marginBottom: '28px',
              textAlign: 'left'
            }}>
              <div style={{ fontSize: '0.78rem', color: '#d4af37', fontWeight: 700, marginBottom: '4px' }}>
                පින් අනුමෝදනා ප්‍රාර්ථනාව:
              </div>
              <div style={{ fontSize: '0.98rem', color: 'rgba(255, 255, 255, 0.92)', lineHeight: 1.7, fontStyle: 'italic' }}>
                "{record.dedication}"
              </div>
            </div>
          )}

          {/* Sacred Blessing Gatha Box */}
          <div style={{
            background: 'rgba(0, 0, 0, 0.35)',
            border: '1px solid rgba(212, 175, 55, 0.35)',
            borderRadius: '18px',
            padding: '20px 22px',
            marginBottom: '28px'
          }}>
            <div style={{
              fontFamily: 'var(--font-serif)',
              fontSize: '1.08rem',
              color: '#facc15',
              lineHeight: 1.75,
              fontWeight: 700,
              whiteSpace: 'pre-line',
              marginBottom: '10px'
            }}>
              {record.gatha_pali}
            </div>
            <div style={{ fontSize: '0.84rem', color: 'rgba(255, 255, 255, 0.7)', lineHeight: 1.6 }}>
              {record.gatha_meaning}
            </div>
          </div>

          {/* Monastic Seal / Blessing Footer */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderTop: '1px solid rgba(212, 175, 55, 0.25)',
            paddingTop: '20px',
            flexWrap: 'wrap',
            gap: '12px',
            fontSize: '0.82rem',
            color: 'rgba(255, 255, 255, 0.65)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#d4af37' }}>
              <Award size={16} />
              <span>කල්‍යාණමිත්ත මහා සංඝ සභාවේ ආශිර්වාදයෙනි</span>
            </div>
            <div style={{ fontStyle: 'italic', fontFamily: 'var(--font-serif)', color: '#fef08a' }}>
              "ධම්මෝ හවේ රක්ඛති ධම්මචාරී"
            </div>
          </div>
        </motion.div>

        {/* ── Action Toolbar (Download & Share) ── */}
        <div style={{
          width: '100%',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '14px',
          marginTop: '28px'
        }}>
          <button
            onClick={downloadStatusCard}
            disabled={isGenerating}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '10px',
              padding: '16px 22px',
              borderRadius: '14px',
              background: '#d4af37',
              color: '#1a0505',
              fontWeight: 800,
              fontSize: '0.98rem',
              border: 'none',
              cursor: 'pointer',
              transition: 'all 0.2s',
              boxShadow: '0 8px 24px rgba(212, 175, 55, 0.35)'
            }}
            onMouseEnter={e => e.currentTarget.style.filter = 'brightness(1.1)'}
            onMouseLeave={e => e.currentTarget.style.filter = 'brightness(1)'}
          >
            <Download size={18} />
            <span>{isGenerating ? 'පත්‍රිකාව බාගත වෙමින්...' : 'WhatsApp Status Card එක (HD)'}</span>
          </button>

          <button
            onClick={shareToWhatsApp}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '10px',
              padding: '16px 22px',
              borderRadius: '14px',
              background: '#25d366',
              color: '#ffffff',
              fontWeight: 800,
              fontSize: '0.98rem',
              border: 'none',
              cursor: 'pointer',
              transition: 'all 0.2s',
              boxShadow: '0 8px 24px rgba(37, 211, 102, 0.35)'
            }}
            onMouseEnter={e => e.currentTarget.style.filter = 'brightness(1.08)'}
            onMouseLeave={e => e.currentTarget.style.filter = 'brightness(1)'}
          >
            <Share2 size={18} />
            <span>WhatsApp Status එකේ පළකරන්න</span>
          </button>
        </div>

        <p style={{
          fontSize: '0.82rem',
          color: 'rgba(255, 255, 255, 0.45)',
          textAlign: 'center',
          marginTop: '20px',
          lineHeight: 1.6
        }}>
          ඉහත "WhatsApp Status Card" බොත්තම මගින් ඔබගේ දුරකථනයේ හෝ පරිගණකයේ WhatsApp Status සඳහා ගැළපෙන 9:16 Full HD ගුණාත්මක ඡායාරූපයක් (Image) ක්ෂණිකව බාගත වේ.
        </p>

      </main>
    </div>
  );
}
