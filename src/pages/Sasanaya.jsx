import React from 'react';
import { motion } from 'framer-motion';
import { 
  Calendar, 
  MapPin, 
  Heart, 
  Sparkles, 
  MessageCircle, 
  ChevronRight,
  BookOpen,
  Award,
  ExternalLink,
  ShieldCheck,
  Clock,
  CheckCircle2,
  PhoneCall
} from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Sasanaya() {
  // Direct WhatsApp contact with pre-filled message for donor inquiries
  const contactWhatsApp = () => {
    const text = encodeURIComponent(
      `තෙරුවන් සරණයි! 2026 ඔක්තෝබර් 17 වන දින පැපොල්ගස්දෙණිය විහාරස්ථානයේ පැවැත්වෙන මහා සම්බුද්ධ පූජාව සඳහා ආධාර හෝ පූජා ද්‍රව්‍ය ලබාදීමට කැමැත්තෙමු. වැඩිදුර තොරතුරු ලබාදෙන්න.`
    );
    window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
  };

  return (
    <div style={{ minHeight: '100vh', width: '100%', background: 'var(--bg-main)', overflowX: 'clip', transition: 'background-color 0.3s ease, color 0.3s ease' }}>
      <style>{`
        /* Hero Section */
        .sn-page-header {
          padding: clamp(60px, 9vh, 90px) 24px 24px;
          text-align: center;
          max-width: 920px;
          margin: 0 auto;
          position: relative;
        }

        .sn-eyebrow {
          font-family: var(--font-sinhala);
          font-size: 0.85rem;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: var(--accent-gold);
          background: rgba(196, 152, 79, 0.1);
          border: 1px solid rgba(196, 152, 79, 0.3);
          padding: 6px 16px;
          border-radius: 999px;
          font-weight: 700;
          margin-bottom: 16px;
          display: inline-flex;
          align-items: center;
          gap: 8px;
        }

        .sn-hero-title {
          font-family: var(--font-serif);
          font-size: clamp(2.6rem, 5.2vw, 4.2rem);
          color: var(--text-main);
          font-weight: 800;
          letter-spacing: -0.02em;
          margin: 0 0 14px 0;
          line-height: 1.2;
        }

        .sn-divider {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 16px;
          margin: 14px auto 20px;
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
          font-size: clamp(1.05rem, 1.8vw, 1.22rem);
          color: var(--text-main);
          line-height: 1.85;
          margin: 0 auto 24px;
          max-width: 820px;
          opacity: 0.92;
        }

        .sn-motto-badge {
          display: inline-flex;
          flex-direction: column;
          align-items: center;
          padding: 14px 32px;
          border-radius: 18px;
          background: var(--bg-secondary);
          border: 1px solid var(--glass-border);
          box-shadow: 0 8px 24px rgba(0,0,0,0.03);
          margin-top: 8px;
        }

        .sn-motto-pali {
          font-family: var(--font-serif);
          font-size: 1.38rem;
          font-weight: 700;
          color: var(--primary);
          letter-spacing: 0.02em;
        }

        .sn-motto-si {
          font-family: var(--font-sinhala);
          font-size: 0.96rem;
          color: var(--text-muted);
          margin-top: 4px;
        }

        /* Container */
        .sn-container {
          max-width: 1280px;
          margin: 0 auto;
          padding: 0 24px 100px;
          display: flex;
          flex-direction: column;
          gap: 56px;
        }

        /* Mission Spotlight Card */
        .sn-mission-card {
          background: var(--bg-secondary);
          border: 1px solid var(--glass-border);
          border-radius: 28px;
          padding: clamp(28px, 5vw, 52px);
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
          padding: 30px 24px;
          display: flex;
          flex-direction: column;
          gap: 14px;
          transition: transform 0.25s cubic-bezier(0.16, 1, 0.3, 1), border-color 0.25s, box-shadow 0.25s;
        }

        .sn-offering-box:hover {
          transform: translateY(-4px);
          border-color: rgba(140, 21, 21, 0.35);
          box-shadow: 0 14px 32px rgba(0,0,0,0.06);
        }

        .sn-offering-icon {
          width: 56px;
          height: 56px;
          border-radius: 18px;
          background: rgba(196, 152, 79, 0.12);
          color: var(--accent-gold);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.75rem;
        }

        /* Grand Event Feature Card */
        .sn-event-banner {
          background: linear-gradient(135deg, rgba(140, 21, 21, 0.08) 0%, rgba(196, 152, 79, 0.14) 100%);
          border: 2px solid rgba(196, 152, 79, 0.45);
          border-radius: 28px;
          padding: clamp(28px, 5vw, 56px);
          position: relative;
          overflow: hidden;
          box-shadow: 0 20px 50px rgba(0,0,0,0.05);
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
          border-radius: 18px;
          padding: 22px;
          display: flex;
          flex-direction: column;
          gap: 6px;
          transition: transform 0.2s ease;
        }

        .sn-time-slot:hover {
          transform: translateY(-2px);
          border-color: rgba(196, 152, 79, 0.4);
        }

        /* Digital Punyanumodana Showcase */
        .sn-cert-spotlight {
          background: var(--bg-secondary);
          border: 1px solid var(--glass-border);
          border-radius: 28px;
          padding: clamp(28px, 5vw, 52px);
          display: flex;
          flex-direction: column;
          gap: 32px;
        }

        @media (min-width: 992px) {
          .sn-cert-spotlight {
            flex-direction: row;
            align-items: center;
            gap: 48px;
          }
        }

        .sn-btn-whatsapp {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          padding: 15px 28px;
          border-radius: 14px;
          background: #25d366;
          color: #ffffff;
          font-family: var(--font-sinhala);
          font-size: 1.02rem;
          font-weight: 700;
          border: none;
          cursor: pointer;
          transition: all 0.2s;
          box-shadow: 0 8px 22px rgba(37, 211, 102, 0.35);
          text-decoration: none;
        }

        .sn-btn-whatsapp:hover {
          filter: brightness(1.08);
          transform: translateY(-2px);
        }

        /* Future Projects */
        .sn-projects-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 20px;
        }
        @media (min-width: 640px) {
          .sn-projects-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        .sn-project-card {
          background: var(--bg-secondary);
          border: 1px solid var(--glass-border);
          border-radius: 20px;
          padding: 26px;
          display: flex;
          align-items: flex-start;
          gap: 18px;
          transition: all 0.25s ease;
        }
        .sn-project-card:hover {
          border-color: var(--primary);
          transform: translateY(-3px);
          box-shadow: 0 12px 28px rgba(0,0,0,0.05);
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
          <p style={{ fontFamily: 'var(--font-sinhala)', fontSize: '1.08rem', lineHeight: 1.85, color: 'var(--text-main)', opacity: 0.92, maxWidth: '960px' }}>
            ප්‍රතිපත්ති පූජාවෙන් යුක්තව ධර්මයෙහි හැසිරීම ශාසනය සුරැකීමේ උතුම්ම ක්‍රමයයි. ධර්මය හදාරමින්, ඒ අනුව ජීවිතය හැඩගස්වා ගැනීමෙන් අපි සැබෑම ශාසන මාමකයෝ වෙමු. මෙම පිටුව හරහා ශාසනයේ උන්නතිය වෙනුවෙන් කළ හැකි කාර්යයන්, ධර්ම දානමය පුණ්‍යකර්ම සහ ඉදිරි සැලසුම් පිළිබඳව ඔබව දැනුවත් කිරීමට අපි බලාපොරොත්තු වෙමු.
          </p>

          <div className="sn-offerings-grid">
            <div className="sn-offering-box">
              <div className="sn-offering-icon">🥣</div>
              <h3 style={{ fontFamily: 'var(--font-sinhala)', fontSize: '1.25rem', fontWeight: 800, margin: 0, color: 'var(--text-main)' }}>
                උදෑසන කිරි ආහාර පූජාව
              </h3>
              <p style={{ fontFamily: 'var(--font-sinhala)', fontSize: '0.96rem', color: 'var(--text-muted)', lineHeight: 1.65, margin: 0 }}>
                අති පාරිශුද්ධ එළකිරි, මීපැණි සහ සුවඳැල් සහලින් පිළියෙල කරන ලද උතුම් කිරිපිඬු මහා සම්බුද්ධ පූජාව අලුයම සම්බුදු සිරිපා අභියස පූජා කිරීම.
              </p>
            </div>

            <div className="sn-offering-box">
              <div className="sn-offering-icon">🍛</div>
              <h3 style={{ fontFamily: 'var(--font-sinhala)', fontSize: '1.25rem', fontWeight: 800, margin: 0, color: 'var(--text-main)' }}>
                දහවල් දෙතිස් ව්‍යංජන පූජාව
              </h3>
              <p style={{ fontFamily: 'var(--font-sinhala)', fontSize: '0.96rem', color: 'var(--text-muted)', lineHeight: 1.65, margin: 0 }}>
                සම්බුදු සිරිපා අභියස දෙතිස් ව්‍යංජන, කැවිලි හා අතුරුපස සහිත මහා දහවල් සම්බුද්ධ පූජාව සහ මහා සංඝරත්නය විෂයෙහි පිරිනැමෙන සඟසතු දක්ෂිණාව.
              </p>
            </div>

            <div className="sn-offering-box">
              <div className="sn-offering-icon">🌸</div>
              <h3 style={{ fontFamily: 'var(--font-sinhala)', fontSize: '1.25rem', fontWeight: 800, margin: 0, color: 'var(--text-main)' }}>
                සුවිශේෂී පූජාවන්
              </h3>
              <p style={{ fontFamily: 'var(--font-sinhala)', fontSize: '0.96rem', color: 'var(--text-muted)', lineHeight: 1.65, margin: 0 }}>
                සුවඳ මල්, සුගන්ධ ධූප, අසූහාරදහසේ පහන් ආලෝක, සිසිල් පැන්, ගිලන්පස සහ පූජනීය චීවර මෙන්ම සිවුපස පූජාවන් සංවිධානය කිරීම.
              </p>
            </div>
          </div>
        </section>

        {/* ── Section 2: Grand Upcoming Event Spotlight ── */}
        <section className="sn-event-banner">
          <div className="sn-event-badge">
            <Calendar size={15} /> ඉදිරි විශේෂ මහා පුණ්‍යකර්මය
          </div>
          
          <h2 style={{ fontFamily: 'var(--font-sinhala)', fontSize: 'clamp(2rem, 3.8vw, 3rem)', fontWeight: 800, color: 'var(--text-main)', margin: '0 0 12px 0', lineHeight: 1.25 }}>
            පැපොල්ගස්දෙණිය විහාරස්ථානයේ මහා සම්බුද්ධ පූජාව
          </h2>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '24px', flexWrap: 'wrap', marginBottom: '22px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--primary)', fontWeight: 800, fontSize: '1.1rem', fontFamily: 'var(--font-sinhala)' }}>
              <Calendar size={20} /> 2026 ඔක්තෝබර් 17 වන දින (සෙනසුරාදා)
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-main)', fontWeight: 700, fontSize: '1.05rem', fontFamily: 'var(--font-sinhala)' }}>
              <MapPin size={20} color="var(--accent-gold)" /> පැපොල්ගස්දෙණිය විහාරස්ථානය
            </div>
          </div>

          <p style={{ fontFamily: 'var(--font-sinhala)', fontSize: '1.08rem', color: 'var(--text-main)', lineHeight: 1.85, maxWidth: '900px', marginBottom: '28px' }}>
            උතුම් සම්බුදු සසුනේ චිරස්ථිතිය උදෙසා උදෑසන කිරි ආහාර පූජාව, දහවල් දෙතිස් ව්‍යංජන සහිත මහා සම්බුද්ධ පූජාව සහ සුවිශේෂී ආමිස-ප්‍රතිපත්ති පූජාවන් රැසක් පැපොල්ගස්දෙණිය විහාරස්ථානයේදී පැවැත්වේ. <strong>මෙම පුණ්‍යකර්මය උදෙසා මේ වන විටත් මුදල් ආධාර මෙන්ම නොයෙක් පූජා ද්‍රව්‍යවලින් සැදැහැවතුන්ගේ සහය නොමඳව ලැබෙමින් පවතී.</strong> ඔබටද ශක්ති පමණින් මෙම උතුම් පුණ්‍යකර්මයට දායක විය හැක.
          </p>

          <div className="sn-event-schedule">
            <div className="sn-time-slot">
              <span style={{ fontSize: '0.82rem', color: 'var(--primary)', fontWeight: 800, letterSpacing: '0.04em' }}>පෙරවරු 06:00</span>
              <strong style={{ fontFamily: 'var(--font-sinhala)', fontSize: '1.15rem', color: 'var(--text-main)' }}>කිරි ආහාර පූජාව</strong>
              <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)', fontFamily: 'var(--font-sinhala)' }}>අසිරිමත් උදෑසන කිරිපිඬු හා මීපැණි පූජාව</span>
            </div>

            <div className="sn-time-slot">
              <span style={{ fontSize: '0.82rem', color: 'var(--primary)', fontWeight: 800, letterSpacing: '0.04em' }}>පෙරවරු 10:30</span>
              <strong style={{ fontFamily: 'var(--font-sinhala)', fontSize: '1.15rem', color: 'var(--text-main)' }}>දෙතිස් ව්‍යංජන පූජාව</strong>
              <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)', fontFamily: 'var(--font-sinhala)' }}>දහවල් සම්බුද්ධ පූජාව සහ මහා සංඝගත දක්ෂිණාව</span>
            </div>

            <div className="sn-time-slot">
              <span style={{ fontSize: '0.82rem', color: 'var(--primary)', fontWeight: 800, letterSpacing: '0.04em' }}>පස්වරු 06:00</span>
              <strong style={{ fontFamily: 'var(--font-sinhala)', fontSize: '1.15rem', color: 'var(--text-main)' }}>සුවිශේෂී පූජාවන්</strong>
              <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)', fontFamily: 'var(--font-sinhala)' }}>අසූහාරදහසේ පහන් ආලෝක හා සුවඳ මල් පූජාව</span>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '18px', flexWrap: 'wrap' }}>
            <button onClick={contactWhatsApp} className="sn-btn-whatsapp">
              <MessageCircle size={20} />
              <span>පූජාවට ආධාර/සහය දැක්වීමට සම්බන්ධ වන්න (WhatsApp)</span>
            </button>
            <span style={{ fontSize: '0.92rem', color: 'var(--text-muted)', fontFamily: 'var(--font-sinhala)' }}>
              (මුදල් ආධාර හෝ පූජා ද්‍රව්‍ය සම්බන්ධීකරණය සඳහා)
            </span>
          </div>
        </section>

        {/* ── Section 3: Official Certified Digital Punyanumodana Notice ── */}
        <section className="sn-cert-spotlight">
          <div style={{ flex: 1.2 }}>
            <div className="sn-section-tag">
              <Award size={14} /> කල්‍යාණමිත්ත ගෞරවනීය උපහාරය
            </div>
            <h2 className="sn-section-h2" style={{ margin: '0 0 16px 0' }}>
              රාජකීය ඩිජිටල් පුණ්‍යානුමෝදනා පත්‍රිකාව
            </h2>
            <p style={{ fontFamily: 'var(--font-sinhala)', fontSize: '1.08rem', color: 'var(--text-main)', opacity: 0.9, lineHeight: 1.85, margin: '0 0 20px 0' }}>
              පැපොල්ගස්දෙණිය විහාරස්ථානයේ මහා සම්බුද්ධ පූජාව ඇතුළු ශාසනික කටයුතුවලට දායක වන සෑම සැදැහැවතෙකු උදෙසාම, <strong>ඔවුන්ගේ නමින්ම සැකසූ සුවිශේෂී, රාජකීය ඩිජිටල් පුණ්‍යානුමෝදනා පත්‍රිකාවක් සහ අද්විතීය Webview සබැඳියක් (Unique Link)</strong> කල්‍යාණමිත්ත ශාසනික මෙහෙවර මණ්ඩලය විසින් සෘජුවම ඔවුන්ගේ WhatsApp හෝ Email වෙත පිරිනමනු ලැබේ.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '26px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.95rem', color: 'var(--text-main)' }}>
                <CheckCircle2 size={18} color="#25d366" />
                <span>සෑම දායකයෙකුටම හිමිවන අද්විතීය Webview පිටුව (Full Screen Sacred Blessing)</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.95rem', color: 'var(--text-main)' }}>
                <CheckCircle2 size={18} color="#25d366" />
                <span>9:16 Full HD WhatsApp Status Card එක 1-Click එකකින් බාගත කිරීමේ හැකියාව</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.95rem', color: 'var(--text-main)' }}>
                <CheckCircle2 size={18} color="#25d366" />
                <span>නම, පූජාමය දායකත්වය සහ පින් අනුමෝදනා ප්‍රාර්ථනාව සහිත නිල සහතිකය</span>
              </div>
            </div>

            <a 
              href="/anumodana/km-bless-01" 
              target="_blank" 
              rel="noopener noreferrer"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '12px 24px',
                borderRadius: '12px',
                background: 'var(--bg-main)',
                border: '1px solid var(--primary)',
                color: 'var(--primary)',
                fontWeight: 700,
                textDecoration: 'none',
                fontSize: '0.95rem',
                fontFamily: 'var(--font-sinhala)',
                transition: 'all 0.2s'
              }}
              onMouseEnter={e => { e.currentTarget.style.background = 'var(--primary)'; e.currentTarget.style.color = '#fff'; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'var(--bg-main)'; e.currentTarget.style.color = 'var(--primary)'; }}
            >
              <span>ආදර්ශ පුණ්‍යානුමෝදනා Webview එක බලන්න</span>
              <ExternalLink size={16} />
            </a>
          </div>

          {/* Certificate Miniature Showcase Card */}
          <div style={{ flex: 0.9, display: 'flex', justifyContent: 'center' }}>
            <div style={{
              width: '100%',
              maxWidth: '380px',
              background: '#130303',
              border: '2.5px solid #d4af37',
              borderRadius: '20px',
              padding: '28px 24px',
              textAlign: 'center',
              boxShadow: '0 20px 50px rgba(0,0,0,0.35)',
              position: 'relative'
            }}>
              <div style={{ fontSize: '2.2rem', color: '#d4af37', marginBottom: '6px' }}>☸</div>
              <div style={{ fontSize: '0.75rem', color: '#fef08a', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                කල්‍යාණමිත්ත ශාසනික මෙහෙවර
              </div>
              <div style={{ fontFamily: 'var(--font-serif)', fontSize: '1.25rem', color: '#ffffff', fontWeight: 800, margin: '6px 0 14px 0' }}>
                මහා සම්බුද්ධ පූජා පුණ්‍යානුමෝදනාව
              </div>
              <div style={{ background: 'rgba(140,21,21,0.5)', padding: '6px 12px', borderRadius: '8px', fontSize: '0.78rem', color: '#facc15', marginBottom: '14px' }}>
                පැපොල්ගස්දෙණිය විහාරස්ථානය · 2026 ඔක්තෝබර් 17
              </div>
              <div style={{ fontSize: '0.8rem', color: '#d4af37' }}>උතුම් දායකත්වය:</div>
              <div style={{ fontSize: '1.15rem', color: '#ffffff', fontWeight: 800, marginBottom: '10px' }}>
                ශ්‍රද්ධාසම්පන්න දායක පවුල
              </div>
              <div style={{ fontSize: '0.8rem', color: '#facc15', fontStyle: 'italic', borderTop: '1px solid rgba(212,175,55,0.3)', paddingTop: '10px' }}>
                "භවතු සබ්බ මංගලං රක්ඛන්තු සබ්බ දේවතා"
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
              <div style={{ width: '52px', height: '52px', borderRadius: '16px', background: 'rgba(140, 21, 21, 0.08)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.6rem', flexShrink: 0 }}>
                🏛️
              </div>
              <div>
                <h4 style={{ fontFamily: 'var(--font-sinhala)', fontSize: '1.2rem', color: 'var(--text-main)', fontWeight: 800, margin: '0 0 6px 0' }}>
                  සංඝාවාස හා විහාරස්ථාන සංවර්ධනය
                </h4>
                <p style={{ fontFamily: 'var(--font-sinhala)', fontSize: '0.94rem', color: 'var(--text-muted)', margin: 0, lineHeight: 1.6 }}>
                  අවශ්‍යතා සහිත දුෂ්කර ආරණ්‍ය සේනාසන හා විහාරස්ථානවල භෞතික හා ආධ්‍යාත්මික පහසුකම් සංවර්ධනයට සහයවීම.
                </p>
              </div>
            </div>

            <div className="sn-project-card">
              <div style={{ width: '52px', height: '52px', borderRadius: '16px', background: 'rgba(140, 21, 21, 0.08)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.6rem', flexShrink: 0 }}>
                📚
              </div>
              <div>
                <h4 style={{ fontFamily: 'var(--font-sinhala)', fontSize: '1.2rem', color: 'var(--text-main)', fontWeight: 800, margin: '0 0 6px 0' }}>
                  දහම් පාසල් දරුවන්ගේ අධ්‍යාපනය නංවාලීම
                </h4>
                <p style={{ fontFamily: 'var(--font-sinhala)', fontSize: '0.94rem', color: 'var(--text-muted)', margin: 0, lineHeight: 1.6 }}>
                  හෙට දවසේ ශාසනය සුරකින දරු පරපුර වෙනුවෙන් දහම් පාසල් පොත්පත්, උපකරණ හා ඇගයීම් සම්මාන වැඩසටහන්.
                </p>
              </div>
            </div>

            <div className="sn-project-card">
              <div style={{ width: '52px', height: '52px', borderRadius: '16px', background: 'rgba(140, 21, 21, 0.08)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.6rem', flexShrink: 0 }}>
                🌿
              </div>
              <div>
                <h4 style={{ fontFamily: 'var(--font-sinhala)', fontSize: '1.2rem', color: 'var(--text-main)', fontWeight: 800, margin: '0 0 6px 0' }}>
                  දුෂ්කර පළාත්වල ධර්ම ප්‍රචාරක කටයුතු
                </h4>
                <p style={{ fontFamily: 'var(--font-sinhala)', fontSize: '0.94rem', color: 'var(--text-muted)', margin: 0, lineHeight: 1.6 }}>
                  දුෂ්කර ගම්මාන කරා පිරිසිදු ශ්‍රී සද්ධර්මය රැගෙන යාම, ධර්ම දානමය පුස්තකාල පිහිටුවීම සහ දේශනා වැඩසටහන් පැවැත්වීම.
                </p>
              </div>
            </div>

            <div className="sn-project-card">
              <div style={{ width: '52px', height: '52px', borderRadius: '16px', background: 'rgba(140, 21, 21, 0.08)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.6rem', flexShrink: 0 }}>
                ☸️
              </div>
              <div>
                <h4 style={{ fontFamily: 'var(--font-sinhala)', fontSize: '1.2rem', color: 'var(--text-main)', fontWeight: 800, margin: '0 0 6px 0' }}>
                  විශේෂ පුණ්‍යානුමෝදනා වැඩසටහන්
                </h4>
                <p style={{ fontFamily: 'var(--font-sinhala)', fontSize: '0.94rem', color: 'var(--text-muted)', margin: 0, lineHeight: 1.6 }}>
                  ශාසනික මෙහෙවරට දායක වන සියලු සැදැහැවතුන් උදෙසා සංවිධානය කෙරෙන සුවිශේෂී ආශිර්වාදාත්මක පුණ්‍ය මහෝත්සවයන්.
                </p>
              </div>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
}
