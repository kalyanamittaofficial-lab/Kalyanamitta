import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Calendar, 
  MapPin, 
  Share2, 
  Download, 
  CheckCircle, 
  Heart, 
  Sparkles, 
  MessageCircle, 
  ChevronRight,
  BookOpen
} from 'lucide-react';

export default function Sasanaya() {
  // Interactive Anumodana State
  const [donorName, setDonorName] = useState('සුනිල් පෙරේරා සහ පවුලේ සැම');
  const [pujaType, setPujaType] = useState('උදෑසන කිරි ආහාර පූජාව');
  const [dedication, setDedication] = useState('මියපරලොව ගිය ඤාතීන්ට පින් පිණිස සහ පවුලේ සැමට සෙත් ශාන්තිය උදෙසා');
  const [isGenerating, setIsGenerating] = useState(false);
  const [copiedNotification, setCopiedNotification] = useState(false);

  // Native Canvas Download for 9:16 / HD WhatsApp Status Card
  const downloadStatusCard = () => {
    setIsGenerating(true);
    const canvas = document.createElement('canvas');
    canvas.width = 1080;
    canvas.height = 1920;
    const ctx = canvas.getContext('2d');

    // Rich Sacred Gradient Background
    const bgGradient = ctx.createRadialGradient(540, 960, 100, 540, 960, 1100);
    bgGradient.addColorStop(0, '#2d0a0a');
    bgGradient.addColorStop(0.5, '#190505');
    bgGradient.addColorStop(1, '#0c0202');
    ctx.fillStyle = bgGradient;
    ctx.fillRect(0, 0, 1080, 1920);

    // Subtle Gold Border Frame
    ctx.strokeStyle = '#d4af37';
    ctx.lineWidth = 6;
    ctx.strokeRect(60, 60, 960, 1800);

    ctx.strokeStyle = 'rgba(212, 175, 55, 0.4)';
    ctx.lineWidth = 2;
    ctx.strokeRect(76, 76, 928, 1768);

    // Corner Ornaments
    const drawCorner = (x, y) => {
      ctx.fillStyle = '#d4af37';
      ctx.beginPath();
      ctx.arc(x, y, 14, 0, Math.PI * 2);
      ctx.fill();
    };
    drawCorner(76, 76);
    drawCorner(1004, 76);
    drawCorner(76, 1844);
    drawCorner(1004, 1844);

    // Header Emblem
    ctx.fillStyle = '#d4af37';
    ctx.font = '72px serif';
    ctx.textAlign = 'center';
    ctx.fillText('☸', 540, 240);

    // Brand Header
    ctx.fillStyle = '#fef08a';
    ctx.font = 'bold 36px sans-serif';
    ctx.letterSpacing = '4px';
    ctx.fillText('කල්‍යාණමිත්ත ශාසනික මෙහෙවර', 540, 310);

    // Sub Title
    ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
    ctx.font = '28px sans-serif';
    ctx.fillText('මහා සම්බුද්ධ පූජා පුණ්‍යානුමෝදනාව', 540, 360);

    // Horizontal Rule
    ctx.strokeStyle = 'rgba(212, 175, 55, 0.5)';
    ctx.beginPath();
    ctx.moveTo(340, 400);
    ctx.lineTo(740, 400);
    ctx.stroke();

    // Event Info Badge
    ctx.fillStyle = 'rgba(140, 21, 21, 0.6)';
    ctx.roundRect(140, 440, 800, 140, 20);
    ctx.fill();
    ctx.strokeStyle = '#d4af37';
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 34px sans-serif';
    ctx.fillText('පැපොල්ගස්දෙණිය විහාරස්ථානය', 540, 500);
    ctx.fillStyle = '#facc15';
    ctx.font = '28px sans-serif';
    ctx.fillText('2026 ඔක්තෝබර් 17 වන දින පැවැත්වෙන මහා පූජෝත්සවය', 540, 545);

    // Donor Recognition Label
    ctx.fillStyle = '#d4af37';
    ctx.font = '30px sans-serif';
    ctx.fillText('උතුම් දායකත්වය පිරිනැමූ ගෞරවනීය', 540, 680);

    // Donor Name (Hero)
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 52px sans-serif';
    ctx.fillText(donorName || 'ශ්‍රද්ධාසම්පන්න දායක පවුල', 540, 760);

    // Puja Type Card
    ctx.fillStyle = 'rgba(255, 255, 255, 0.05)';
    ctx.roundRect(140, 840, 800, 160, 20);
    ctx.fill();
    ctx.strokeStyle = 'rgba(212, 175, 55, 0.3)';
    ctx.stroke();

    ctx.fillStyle = '#fef08a';
    ctx.font = 'bold 32px sans-serif';
    ctx.fillText('පූජාමය දායකත්වය:', 540, 900);
    ctx.fillStyle = '#ffffff';
    ctx.font = '36px sans-serif';
    ctx.fillText(pujaType, 540, 955);

    // Dedication Purpose
    ctx.fillStyle = '#d4af37';
    ctx.font = '28px sans-serif';
    ctx.fillText('පින් අනුමෝදනා ප්‍රාර්ථනාව:', 540, 1080);

    ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
    ctx.font = '32px sans-serif';
    // Wrap text if needed
    ctx.fillText(dedication, 540, 1140);

    // Sacred Gatha Blessing Card
    ctx.fillStyle = 'rgba(212, 175, 55, 0.08)';
    ctx.roundRect(140, 1260, 800, 360, 24);
    ctx.fill();
    ctx.strokeStyle = '#d4af37';
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.fillStyle = '#facc15';
    ctx.font = 'bold 34px serif';
    ctx.fillText('භවතු සබ්බ මංගලං — රක්ඛන්තු සබ්බ දේවතා', 540, 1360);
    ctx.fillText('සබ්බ බුද්ධානුභාවේන — සදා සොත්ථි භවන්තු තේ!', 540, 1430);

    ctx.fillStyle = 'rgba(255, 255, 255, 0.85)';
    ctx.font = '28px sans-serif';
    ctx.fillText('මෙම උතුම් කුසල බලයෙන් ඔබ සැමට සෙත් ශාන්තිය උදාවේවා!', 540, 1520);
    ctx.fillText('චතුරාරිය සත්‍යාවබෝධය පිණිසම හේතු වාසනා වේවා!', 540, 1565);

    // Footer Motto
    ctx.fillStyle = '#d4af37';
    ctx.font = 'italic 30px serif';
    ctx.fillText('"ධම්මෝ හවේ රක්ඛති ධම්මචාරී"', 540, 1730);

    ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
    ctx.font = '22px sans-serif';
    ctx.fillText('Kalyanamitta Buddhist Portal · kalyanamitta.org', 540, 1780);

    // Trigger Download
    setTimeout(() => {
      const dataUrl = canvas.toDataURL('image/png');
      const a = document.createElement('a');
      a.href = dataUrl;
      a.download = `Punyanumodana_${donorName.replace(/\s+/g, '_')}.png`;
      a.click();
      setIsGenerating(false);
    }, 400);
  };

  // WhatsApp Share Trigger with Prefilled Blessing Message
  const shareToWhatsApp = () => {
    const text = encodeURIComponent(
      `☸️ *කල්‍යාණමිත්ත උතුම් ශාසනික මෙහෙවර*\n` +
      `*පැපොල්ගස්දෙණිය විහාරස්ථානයේ මහා සම්බුද්ධ පූජාව — 2026 ඔක්තෝබර් 17*\n\n` +
      `ගෞරවනීය *${donorName}* විසින් සිදුකළ උතුම් *${pujaType}* දායකත්වය වෙනුවෙන් පිරිනැමෙන විශේෂිත ඩිජිටල් පුණ්‍යානුමෝදනාවයි.\n\n` +
      `✨ *ප්‍රාර්ථනාව:* ${dedication}\n\n` +
      `🌸 *භවතු සබ්බ මංගලං රක්ඛන්තු සබ්බ දේවතා*\n` +
      `*සබ්බ බුද්ධානුභාවේන සදා සොත්ථි භවන්තු තේ!*\n\n` +
      `විස්තර බලන්න: https://kalyanamitta.vercel.app/sasanaya`
    );
    window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
  };

  // WhatsApp Coordinator Direct Contact
  const contactWhatsApp = () => {
    const text = encodeURIComponent(
      `තෙරුවන් සරණයි! 2026 ඔක්තෝබර් 17 වන දින පැපොල්ගස්දෙණිය විහාරස්ථානයේ පැවැත්වෙන මහා සම්බුද්ධ පූජාව සඳහා ආධාර/පූජා ද්‍රව්‍ය ලබාදීමට කැමැත්තෙමු.`
    );
    window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
  };

  return (
    <div style={{ minHeight: '100vh', width: '100%', background: 'var(--bg-main)', overflowX: 'clip' }}>
      <style>{`
        /* Hero Section */
        .sn-page-header {
          padding: clamp(90px, 12vh, 120px) 24px 30px;
          text-align: center;
          max-width: 900px;
          margin: 0 auto;
          position: relative;
        }

        .sn-eyebrow {
          font-family: var(--font-sinhala);
          font-size: 0.85rem;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: var(--primary);
          font-weight: 700;
          margin-bottom: 12px;
          display: inline-flex;
          align-items: center;
          gap: 8px;
        }

        .sn-hero-title {
          font-family: var(--font-serif);
          font-size: clamp(2.5rem, 5.5vw, 4.2rem);
          color: var(--text-main);
          font-weight: 800;
          letter-spacing: -0.01em;
          margin: 0 0 14px 0;
          line-height: 1.2;
        }

        .sn-divider {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 16px;
          margin: 14px auto 18px;
          max-width: 280px;
        }

        .sn-divider-line {
          flex: 1;
          height: 1px;
          background: linear-gradient(90deg, transparent, var(--accent-gold), transparent);
          opacity: 0.7;
        }

        .sn-divider-icon {
          color: var(--accent-gold);
          font-size: 1.3rem;
          line-height: 1;
        }

        .sn-lead-desc {
          font-family: var(--font-sinhala);
          font-size: clamp(1.05rem, 1.8vw, 1.2rem);
          color: var(--text-main);
          line-height: 1.85;
          margin: 0 auto 24px;
          max-width: 820px;
          opacity: 0.9;
        }

        .sn-motto-badge {
          display: inline-flex;
          flex-direction: column;
          align-items: center;
          padding: 14px 28px;
          border-radius: 16px;
          background: var(--bg-secondary);
          border: 1px solid var(--glass-border);
          box-shadow: 0 8px 24px rgba(0,0,0,0.03);
          margin-top: 10px;
        }

        .sn-motto-pali {
          font-family: var(--font-serif);
          font-size: 1.35rem;
          font-weight: 700;
          color: var(--primary);
          letter-spacing: 0.02em;
        }

        .sn-motto-si {
          font-family: var(--font-sinhala);
          font-size: 0.95rem;
          color: var(--text-muted);
          margin-top: 4px;
        }

        /* Container */
        .sn-container {
          max-width: 1300px;
          margin: 0 auto;
          padding: 0 24px 100px;
          display: flex;
          flex-direction: column;
          gap: 70px;
        }

        /* Mission Spotlight Card */
        .sn-mission-card {
          background: var(--bg-secondary);
          border: 1px solid var(--glass-border);
          border-radius: 28px;
          padding: clamp(28px, 5vw, 56px);
          box-shadow: 0 16px 40px rgba(0,0,0,0.03);
        }

        .sn-section-tag {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 4px 14px;
          border-radius: 20px;
          background: rgba(140, 21, 21, 0.08);
          color: var(--primary);
          font-size: 0.82rem;
          font-weight: 700;
          text-transform: uppercase;
          margin-bottom: 12px;
        }

        .sn-section-h2 {
          font-family: var(--font-sinhala);
          font-size: clamp(1.8rem, 3.2vw, 2.5rem);
          color: var(--text-main);
          font-weight: 800;
          margin: 0 0 16px 0;
          line-height: 1.3;
        }

        /* 3 Offerings Grid */
        .sn-offerings-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 20px;
          margin-top: 36px;
        }

        @media (min-width: 768px) {
          .sn-offerings-grid {
            grid-template-columns: repeat(3, 1fr);
          }
        }

        .sn-offering-box {
          background: var(--bg-main);
          border: 1px solid var(--glass-border);
          border-radius: 20px;
          padding: 28px 24px;
          display: flex;
          flex-direction: column;
          gap: 12px;
          transition: transform 0.2s cubic-bezier(0.16, 1, 0.3, 1), border-color 0.2s, box-shadow 0.2s;
        }

        .sn-offering-box:hover {
          transform: translateY(-4px);
          border-color: rgba(140, 21, 21, 0.35);
          box-shadow: 0 12px 30px rgba(0,0,0,0.05);
        }

        .sn-offering-icon {
          width: 52px;
          height: 52px;
          border-radius: 16px;
          background: rgba(196, 152, 79, 0.12);
          color: var(--accent-gold);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.6rem;
        }

        /* Grand Event Feature Card */
        .sn-event-banner {
          background: linear-gradient(135deg, rgba(140, 21, 21, 0.08) 0%, rgba(196, 152, 79, 0.12) 100%);
          border: 2px solid rgba(196, 152, 79, 0.4);
          border-radius: 28px;
          padding: clamp(28px, 5vw, 56px);
          position: relative;
          overflow: hidden;
        }

        .sn-event-badge {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 6px 16px;
          border-radius: 30px;
          background: var(--primary);
          color: #ffffff;
          font-size: 0.85rem;
          font-weight: 700;
          letter-spacing: 0.05em;
          text-transform: uppercase;
          margin-bottom: 18px;
        }

        .sn-event-schedule {
          display: grid;
          grid-template-columns: 1fr;
          gap: 16px;
          margin: 32px 0;
        }

        @media (min-width: 640px) {
          .sn-event-schedule {
            grid-template-columns: repeat(3, 1fr);
          }
        }

        .sn-time-slot {
          background: var(--bg-main);
          border: 1px solid var(--glass-border);
          border-radius: 16px;
          padding: 20px;
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        /* Interactive Anumodana Section */
        .sn-anumodana-wrapper {
          display: flex;
          flex-direction: column;
          gap: 32px;
        }

        @media (min-width: 1024px) {
          .sn-anumodana-wrapper {
            flex-direction: row;
            align-items: flex-start;
            gap: 48px;
          }
        }

        .sn-form-side {
          flex: 1;
          background: var(--bg-secondary);
          border: 1px solid var(--glass-border);
          border-radius: 24px;
          padding: clamp(24px, 4vw, 40px);
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .sn-preview-side {
          flex: 1.15;
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        /* Sacred Digital Certificate */
        .sn-digital-certificate {
          width: 100%;
          max-width: 520px;
          background: #140404;
          color: #ffffff;
          border: 4px solid #d4af37;
          border-radius: 24px;
          padding: 40px 32px;
          text-align: center;
          position: relative;
          box-shadow: 0 25px 60px rgba(0,0,0,0.35);
          overflow: hidden;
        }

        .sn-cert-inner-border {
          position: absolute;
          inset: 10px;
          border: 1px dashed rgba(212, 175, 55, 0.4);
          border-radius: 16px;
          pointer-events: none;
        }

        .sn-input-field {
          width: 100%;
          padding: 12px 16px;
          border-radius: 12px;
          background: var(--bg-main);
          border: 1px solid var(--glass-border);
          color: var(--text-main);
          font-family: var(--font-sinhala);
          font-size: 0.98rem;
          outline: none;
          transition: border-color 0.2s;
        }
        .sn-input-field:focus {
          border-color: var(--primary);
        }

        .sn-btn-primary {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          padding: 14px 24px;
          border-radius: 14px;
          background: var(--primary);
          color: #ffffff;
          font-family: var(--font-sinhala);
          font-size: 1rem;
          font-weight: 700;
          border: none;
          cursor: pointer;
          transition: all 0.2s;
          box-shadow: 0 8px 20px rgba(140, 21, 21, 0.3);
        }
        .sn-btn-primary:hover {
          filter: brightness(1.1);
          transform: translateY(-1px);
        }

        .sn-btn-whatsapp {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          padding: 14px 24px;
          border-radius: 14px;
          background: #25d366;
          color: #ffffff;
          font-family: var(--font-sinhala);
          font-size: 1rem;
          font-weight: 700;
          border: none;
          cursor: pointer;
          transition: all 0.2s;
          box-shadow: 0 8px 20px rgba(37, 211, 102, 0.3);
        }
        .sn-btn-whatsapp:hover {
          filter: brightness(1.08);
          transform: translateY(-1px);
        }

        /* Future Projects */
        .sn-projects-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 18px;
        }
        @media (min-width: 640px) {
          .sn-projects-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        .sn-project-card {
          background: var(--bg-secondary);
          border: 1px solid var(--glass-border);
          border-radius: 18px;
          padding: 24px;
          display: flex;
          align-items: center;
          gap: 16px;
          transition: all 0.2s;
        }
        .sn-project-card:hover {
          border-color: var(--primary);
          transform: translateY(-2px);
          box-shadow: 0 10px 24px rgba(0,0,0,0.04);
        }
      `}</style>

      {/* ── Sacred Header ── */}
      <header className="sn-page-header">
        <div className="sn-eyebrow">
          <Sparkles size={16} /> කල්‍යාණමිත්ත ශාසනික මෙහෙවර
        </div>
        <h1 className="sn-hero-title">ශාසනය සුරකිමු</h1>
        <div className="sn-divider">
          <span className="sn-divider-line" />
          <span className="sn-divider-icon">☸</span>
          <span className="sn-divider-line" />
        </div>
        <p className="sn-lead-desc">
          බුදුරජාණන් වහන්සේගේ ශ්‍රී සද්ධර්මය ලෝක සත්වයාගේ හිත සුව පිණිස අද දක්වාම නොනැසී පවතින්නේ මහා සංඝරත්නය ඇතුළු සිව්වනක් පිරිසේ අප්‍රතිහත ධෛර්යය නිසාවෙනි.
        </p>
        
        <div className="sn-motto-badge">
          <span className="sn-motto-pali">"ධම්මෝ හවේ රක්ඛති ධම්මචාරී"</span>
          <span className="sn-motto-si">ධර්මයෙහි හැසිරෙන්නාව ධර්මය විසින්ම රකියි.</span>
        </div>
      </header>

      <div className="sn-container">

        {/* ── Section 1: Core Mission - Maha Sambuddha Pujawan ── */}
        <section className="sn-mission-card">
          <div className="sn-section-tag">
            <Heart size={14} /> අපගේ ප්‍රමුඛතම මෙහෙවර
          </div>
          <h2 className="sn-section-h2">
            සැබෑ ශාසන මාමකත්වය හා මහා සම්බුද්ධ පූජාවන්
          </h2>
          <p style={{ fontFamily: 'var(--font-sinhala)', fontSize: '1.08rem', lineHeight: 1.85, color: 'var(--text-main)', opacity: 0.9, maxWidth: '920px' }}>
            ප්‍රතිපත්ති පූජාවෙන් යුක්තව ධර්මයෙහි හැසිරීම ශාසනය සුරැකීමේ උතුම්ම ක්‍රමයයි. ධර්මය හදාරමින්, ඒ අනුව ජීවිතය හැඩගස්වා ගැනීමෙන් අපි සැබෑම ශාසන මාමකයෝ වෙමු. මෙම පිටුව හරහා ශාසනයේ උන්නතිය වෙනුවෙන් කළ හැකි කාර්යයන්, ධර්ම දානමය පුණ්‍යකර්ම සහ ඉදිරි සැලසුම් පිළිබඳව ඔබව දැනුවත් කිරීමට අපි බලාපොරොත්තු වෙමු.
          </p>

          <div className="sn-offerings-grid">
            <div className="sn-offering-box">
              <div className="sn-offering-icon">🥣</div>
              <h3 style={{ fontFamily: 'var(--font-sinhala)', fontSize: '1.25rem', fontWeight: 700, margin: 0, color: 'var(--text-main)' }}>
                උදෑසන කිරි ආහාර පූජාව
              </h3>
              <p style={{ fontFamily: 'var(--font-sinhala)', fontSize: '0.95rem', color: 'var(--text-muted)', lineHeight: 1.6, margin: 0 }}>
                අති පාරිශුද්ධ එළකිරි, මීපැණි සහ සුවඳැල් සහලින් පිළියෙල කරන ලද උතුම් කිරිපිඬු මහා සම්බුද්ධ පූජාව.
              </p>
            </div>

            <div className="sn-offering-box">
              <div className="sn-offering-icon">🍛</div>
              <h3 style={{ fontFamily: 'var(--font-sinhala)', fontSize: '1.25rem', fontWeight: 700, margin: 0, color: 'var(--text-main)' }}>
                දෙතිස් ව්‍යංජන පූජාව
              </h3>
              <p style={{ fontFamily: 'var(--font-sinhala)', fontSize: '0.95rem', color: 'var(--text-muted)', lineHeight: 1.6, margin: 0 }}>
                සම්බුදු සිරිපා අභියස දෙතිස් ව්‍යංජන, කැවිලි හා අතුරුපස සහිත මහා දහවල් සම්බුද්ධ පූජාව සහ මහා සංඝරත්නය විෂයෙහි පිරිනැමෙන දක්ෂිණාව.
              </p>
            </div>

            <div className="sn-offering-box">
              <div className="sn-offering-icon">🌸</div>
              <h3 style={{ fontFamily: 'var(--font-sinhala)', fontSize: '1.25rem', fontWeight: 700, margin: 0, color: 'var(--text-main)' }}>
                සුවිශේෂී පූජාවන්
              </h3>
              <p style={{ fontFamily: 'var(--font-sinhala)', fontSize: '0.95rem', color: 'var(--text-muted)', lineHeight: 1.6, margin: 0 }}>
                සුවඳ මල්, සුගන්ධ ධූප, අසූහාරදහසේ පහන් ආලෝක, සිසිල් පැන්, ගිලන්පස සහ පූජනීය චීවර පූජාවන්.
              </p>
            </div>
          </div>
        </section>

        {/* ── Section 2: Grand Upcoming Event Spotlight ── */}
        <section className="sn-event-banner">
          <div className="sn-event-badge">
            <Calendar size={15} /> ඉදිරි විශේෂ මහා පුණ්‍යකර්මය
          </div>
          
          <h2 style={{ fontFamily: 'var(--font-sinhala)', fontSize: 'clamp(2rem, 3.8vw, 2.9rem)', fontWeight: 800, color: 'var(--text-main)', margin: '0 0 10px 0' }}>
            පැපොල්ගස්දෙණිය විහාරස්ථානයේ මහා සම්බුද්ධ පූජාව
          </h2>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px', flexWrap: 'wrap', marginBottom: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--primary)', fontWeight: 700, fontSize: '1.05rem', fontFamily: 'var(--font-sinhala)' }}>
              <Calendar size={18} /> 2026 ඔක්තෝබර් 17 වන දින (සෙනසුරාදා)
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-main)', fontWeight: 600, fontSize: '1.05rem', fontFamily: 'var(--font-sinhala)' }}>
              <MapPin size={18} /> පැපොල්ගස්දෙණිය විහාරස්ථානය
            </div>
          </div>

          <p style={{ fontFamily: 'var(--font-sinhala)', fontSize: '1.05rem', color: 'var(--text-main)', lineHeight: 1.8, maxWidth: '880px', marginBottom: '28px' }}>
            උතුම් සම්බුදු සසුනේ චිරස්ථිතිය උදෙසා උදෑසන කිරි ආහාර පූජාව, දහවල් දෙතිස් ව්‍යංජන සහිත මහා සම්බුද්ධ පූජාව සහ සුවිශේෂී ආමිස-ප්‍රතිපත්ති පූජාවන් රැසක් පැපොල්ගස්දෙණිය විහාරස්ථානයේදී පැවැත්වේ. මෙම පුණ්‍යකර්මය උදෙසා මේ වන විටත් මුදල් ආධාර මෙන්ම නොයෙක් පූජා ද්‍රව්‍යවලින් සැදැහැවතුන්ගේ සහය නොමඳව ලැබෙමින් පවතී.
          </p>

          <div className="sn-event-schedule">
            <div className="sn-time-slot">
              <span style={{ fontSize: '0.85rem', color: 'var(--primary)', fontWeight: 800 }}>පෙරවරු 06:00</span>
              <strong style={{ fontFamily: 'var(--font-sinhala)', fontSize: '1.1rem', color: 'var(--text-main)' }}>කිරි ආහාර පූජාව</strong>
              <span style={{ fontSize: '0.88rem', color: 'var(--text-muted)', fontFamily: 'var(--font-sinhala)' }}>අසිරිමත් උදෑසන කිරිපිඬු හා මීපැණි පූජාව</span>
            </div>

            <div className="sn-time-slot">
              <span style={{ fontSize: '0.85rem', color: 'var(--primary)', fontWeight: 800 }}>පෙරවරු 10:30</span>
              <strong style={{ fontFamily: 'var(--font-sinhala)', fontSize: '1.1rem', color: 'var(--text-main)' }}>දෙතිස් ව්‍යංජන පූජාව</strong>
              <span style={{ fontSize: '0.88rem', color: 'var(--text-muted)', fontFamily: 'var(--font-sinhala)' }}>දහවල් සම්බුද්ධ පූජාව සහ මහා සංඝගත දක්ෂිණාව</span>
            </div>

            <div className="sn-time-slot">
              <span style={{ fontSize: '0.85rem', color: 'var(--primary)', fontWeight: 800 }}>පස්වරු 06:00</span>
              <strong style={{ fontFamily: 'var(--font-sinhala)', fontSize: '1.1rem', color: 'var(--text-main)' }}>සුවිශේෂී පූජාවන්</strong>
              <span style={{ fontSize: '0.88rem', color: 'var(--text-muted)', fontFamily: 'var(--font-sinhala)' }}>අසූහාරදහසේ පහන් ආලෝක හා සුවඳ මල් පූජාව</span>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
            <button onClick={contactWhatsApp} className="sn-btn-whatsapp">
              <MessageCircle size={18} /> පූජාවට දායක වීමට සම්බන්ධ වන්න (WhatsApp)
            </button>
            <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)', fontFamily: 'var(--font-sinhala)' }}>
              (මුදල් ආධාර හෝ පූජා ද්‍රව්‍ය සම්බන්ධීකරණය සඳහා)
            </span>
          </div>
        </section>

        {/* ── Section 3: Digital Anumodana & WhatsApp Status Experience ── */}
        <section>
          <div style={{ textAlign: 'center', maxWidth: '780px', margin: '0 auto 40px' }}>
            <div className="sn-section-tag">
              <Sparkles size={14} /> සුවිශේෂී ඩිජිටල් අත්දැකීම
            </div>
            <h2 className="sn-section-h2">
              ඩිජිටල් පුණ්‍යානුමෝදනා පත්‍රිකාව සහ WhatsApp Status
            </h2>
            <p style={{ fontFamily: 'var(--font-sinhala)', fontSize: '1.05rem', color: 'var(--text-muted)', lineHeight: 1.7 }}>
              පූජාවට දායක වන සෑම සැදැහැවතෙකුටම ඔවුන්ගේ නමින්ම සැකසූ සුවිශේෂී ඩිජිටල් පුණ්‍යානුමෝදනා පත්‍රිකාවක් හිමිවන අතර, තනි ක්ලික් එකකින් WhatsApp Status එකක් ලෙසද පළ කළ හැක.
            </p>
          </div>

          <div className="sn-anumodana-wrapper">
            
            {/* Input Side */}
            <div className="sn-form-side">
              <h3 style={{ fontFamily: 'var(--font-sinhala)', fontSize: '1.25rem', color: 'var(--text-main)', fontWeight: 700, margin: 0 }}>
                පුණ්‍යානුමෝදනා තොරතුරු සකසන්න
              </h3>

              <div>
                <label style={{ display: 'block', fontSize: '0.88rem', fontWeight: 600, color: 'var(--text-main)', marginBottom: '6px', fontFamily: 'var(--font-sinhala)' }}>
                  දායක මහතාගේ / පවුලේ නම:
                </label>
                <input 
                  type="text" 
                  value={donorName} 
                  onChange={(e) => setDonorName(e.target.value)} 
                  className="sn-input-field"
                  placeholder="උදා: සුනිල් පෙරේරා සහ පවුලේ සැම"
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.88rem', fontWeight: 600, color: 'var(--text-main)', marginBottom: '6px', fontFamily: 'var(--font-sinhala)' }}>
                  දායකත්වය දැක්වූ පූජාව:
                </label>
                <select 
                  value={pujaType} 
                  onChange={(e) => setPujaType(e.target.value)} 
                  className="sn-input-field"
                >
                  <option value="උදෑසන කිරි ආහාර පූජාව">උදෑසන කිරි ආහාර පූජාව</option>
                  <option value="දහවල් දෙතිස් ව්‍යංජන පූජාව">දහවල් දෙතිස් ව්‍යංජන පූජාව</option>
                  <option value="සුවිශේෂී පූජා ද්‍රව්‍ය දායකත්වය">සුවිශේෂී පූජා ද්‍රව්‍ය දායකත්වය</option>
                  <option value="මහා සම්බුද්ධ පූජා මූල්‍යමය දායකත්වය">මහා සම්බුද්ධ පූජා මූල්‍යමය දායකත්වය</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.88rem', fontWeight: 600, color: 'var(--text-main)', marginBottom: '6px', fontFamily: 'var(--font-sinhala)' }}>
                  පින් අනුමෝදනා ප්‍රාර්ථනාව:
                </label>
                <textarea 
                  rows={3}
                  value={dedication} 
                  onChange={(e) => setDedication(e.target.value)} 
                  className="sn-input-field"
                  placeholder="උදා: මියපරලොව ගිය ඤාතීන්ට පින් පිණිස..."
                  style={{ resize: 'vertical' }}
                />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '10px' }}>
                <button 
                  onClick={downloadStatusCard} 
                  className="sn-btn-primary"
                  disabled={isGenerating}
                >
                  <Download size={18} />
                  <span>{isGenerating ? 'පත්‍රිකාව නිර්මාණය වෙමින් පවතී...' : 'WhatsApp Status Card එක බාගත කරන්න (HD)'}</span>
                </button>

                <button 
                  onClick={shareToWhatsApp} 
                  className="sn-btn-whatsapp"
                >
                  <Share2 size={18} />
                  <span>WhatsApp Status එකට Share කරන්න</span>
                </button>
              </div>
            </div>

            {/* Live Visual Certificate Preview Side */}
            <div className="sn-preview-side">
              <div className="sn-digital-certificate">
                <div className="sn-cert-inner-border" />
                
                {/* Emblem */}
                <div style={{ fontSize: '2.5rem', color: '#d4af37', marginBottom: '8px' }}>
                  ☸
                </div>

                <div style={{ color: '#fef08a', fontSize: '0.85rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '4px' }}>
                  කල්‍යාණමිත්ත ශාසනික මෙහෙවර
                </div>

                <h4 style={{ fontFamily: 'var(--font-sinhala)', fontSize: '1.5rem', color: '#ffffff', fontWeight: 700, margin: '0 0 16px 0' }}>
                  මහා සම්බුද්ධ පූජා පුණ්‍යානුමෝදනාව
                </h4>

                <div style={{ width: '80px', height: '2px', background: '#d4af37', margin: '0 auto 20px', opacity: 0.6 }} />

                <div style={{ background: 'rgba(140, 21, 21, 0.4)', padding: '10px 16px', borderRadius: '12px', marginBottom: '20px', border: '1px solid rgba(212, 175, 55, 0.3)' }}>
                  <div style={{ fontSize: '0.82rem', color: '#facc15' }}>පැපොල්ගස්දෙණිය විහාරස්ථානය</div>
                  <div style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.8)' }}>2026 ඔක්තෝබර් 17 වන දින</div>
                </div>

                <div style={{ fontSize: '0.85rem', color: '#d4af37', marginBottom: '6px' }}>
                  ගෞරවනීය දායකත්වය:
                </div>

                <div style={{ fontFamily: 'var(--font-sinhala)', fontSize: '1.4rem', fontWeight: 800, color: '#ffffff', marginBottom: '16px', wordBreak: 'break-word' }}>
                  {donorName || 'ශ්‍රද්ධාසම්පන්න දායක පවුල'}
                </div>

                <div style={{ background: 'rgba(255,255,255,0.06)', padding: '12px', borderRadius: '12px', marginBottom: '20px' }}>
                  <div style={{ fontSize: '0.78rem', color: '#fef08a', fontWeight: 700, marginBottom: '4px' }}>පූජාමය දායකත්වය</div>
                  <div style={{ fontSize: '1rem', color: '#ffffff' }}>{pujaType}</div>
                </div>

                <div style={{ fontSize: '0.82rem', color: 'rgba(255,255,255,0.85)', lineHeight: 1.6, marginBottom: '24px', fontStyle: 'italic' }}>
                  "{dedication}"
                </div>

                {/* Blessing Gatha Box */}
                <div style={{ borderTop: '1px solid rgba(212,175,55,0.3)', paddingTop: '16px' }}>
                  <div style={{ fontFamily: 'var(--font-serif)', fontSize: '1rem', color: '#facc15', lineHeight: 1.6, fontWeight: 700 }}>
                    භවතු සබ්බ මංගලං රක්ඛන්තු සබ්බ දේවතා<br />
                    සබ්බ බුද්ධානුභාවේන සදා සොත්ථි භවන්තු තේ!
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.6)', marginTop: '8px' }}>
                    "ධම්මෝ හවේ රක්ඛති ධම්මචාරී"
                  </div>
                </div>
              </div>

              <div style={{ marginTop: '16px', display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                <CheckCircle size={15} color="#25d366" />
                <span>ඉහත පත්‍රිකාව 9:16 WhatsApp Status ගුණාත්මක බවින් බාගත වේ</span>
              </div>
            </div>

          </div>
        </section>

        {/* ── Section 4: Future Sasana Projects ── */}
        <section>
          <div style={{ textAlign: 'center', maxWidth: '780px', margin: '0 auto 36px' }}>
            <div className="sn-section-tag">
              <BookOpen size={14} /> ඉදිරි සැලසුම්
            </div>
            <h2 className="sn-section-h2">
              ඉදිරියේදී බලාපොරොත්තු වන්න
            </h2>
            <p style={{ fontFamily: 'var(--font-sinhala)', fontSize: '1.05rem', color: 'var(--text-muted)', lineHeight: 1.7 }}>
              සම්බුදු සසුනේ චිරස්ථිතිය උදෙසා අප විසින් ක්‍රියාත්මක කිරීමට සැලසුම් කර ඇති ඉදිරි ශාසනික ව්‍යාපෘතීන්.
            </p>
          </div>

          <div className="sn-projects-grid">
            <div className="sn-project-card">
              <div style={{ width: '48px', height: '48px', borderRadius: '14px', background: 'rgba(140, 21, 21, 0.08)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.4rem', flexShrink: 0 }}>
                🏛️
              </div>
              <div>
                <h4 style={{ fontFamily: 'var(--font-sinhala)', fontSize: '1.15rem', color: 'var(--text-main)', fontWeight: 700, margin: '0 0 4px 0' }}>
                  සංඝාවාස හා විහාරස්ථාන සංවර්ධනය
                </h4>
                <p style={{ fontFamily: 'var(--font-sinhala)', fontSize: '0.9rem', color: 'var(--text-muted)', margin: 0, lineHeight: 1.5 }}>
                  අවශ්‍යතා සහිත දුෂ්කර ආරණ්‍ය සේනාසන හා විහාරස්ථානවල භෞතික හා ආධ්‍යාත්මික පහසුකම් සංවර්ධනය.
                </p>
              </div>
            </div>

            <div className="sn-project-card">
              <div style={{ width: '48px', height: '48px', borderRadius: '14px', background: 'rgba(140, 21, 21, 0.08)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.4rem', flexShrink: 0 }}>
                📚
              </div>
              <div>
                <h4 style={{ fontFamily: 'var(--font-sinhala)', fontSize: '1.15rem', color: 'var(--text-main)', fontWeight: 700, margin: '0 0 4px 0' }}>
                  දහම් පාසල් දරුවන්ගේ අධ්‍යාපනය නංවාලීම
                </h4>
                <p style={{ fontFamily: 'var(--font-sinhala)', fontSize: '0.9rem', color: 'var(--text-muted)', margin: 0, lineHeight: 1.5 }}>
                  හෙට දවසේ ශාසනය සුරකින දරු පරපුර වෙනුවෙන් දහම් පාසල් පොත්පත්, උපකරණ හා ඇගයීම් වැඩසටහන්.
                </p>
              </div>
            </div>

            <div className="sn-project-card">
              <div style={{ width: '48px', height: '48px', borderRadius: '14px', background: 'rgba(140, 21, 21, 0.08)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.4rem', flexShrink: 0 }}>
                🌿
              </div>
              <div>
                <h4 style={{ fontFamily: 'var(--font-sinhala)', fontSize: '1.15rem', color: 'var(--text-main)', fontWeight: 700, margin: '0 0 4px 0' }}>
                  දුෂ්කර පළාත්වල ධර්ම ප්‍රචාරක කටයුතු
                </h4>
                <p style={{ fontFamily: 'var(--font-sinhala)', fontSize: '0.9rem', color: 'var(--text-muted)', margin: 0, lineHeight: 1.5 }}>
                  දුෂ්කර ගම්මාන කරා පිරිසිදු ශ්‍රී සද්ධර්මය රැගෙන යාම සහ ධර්ම දානමය පුස්තකාල පිහිටුවීම.
                </p>
              </div>
            </div>

            <div className="sn-project-card">
              <div style={{ width: '48px', height: '48px', borderRadius: '14px', background: 'rgba(140, 21, 21, 0.08)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.4rem', flexShrink: 0 }}>
                ☸️
              </div>
              <div>
                <h4 style={{ fontFamily: 'var(--font-sinhala)', fontSize: '1.15rem', color: 'var(--text-main)', fontWeight: 700, margin: '0 0 4px 0' }}>
                  විශේෂ පුණ්‍යානුමෝදනා වැඩසටහන්
                </h4>
                <p style={{ fontFamily: 'var(--font-sinhala)', fontSize: '0.9rem', color: 'var(--text-muted)', margin: 0, lineHeight: 1.5 }}>
                  ශාසනික මෙහෙවරට දායක වන සියලු සැදැහැවතුන් උදෙසා සංවිධානය කෙරෙන සුවිශේෂී ආශිර්වාදාත්මක පුණ්‍ය මහෝත්සව.
                </p>
              </div>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
}
