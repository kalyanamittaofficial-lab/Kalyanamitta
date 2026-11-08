import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Download, 
  Share2, 
  RotateCw, 
  Check, 
  Copy, 
  Sparkles, 
  ShieldCheck, 
  QrCode, 
  ExternalLink,
  Award
} from 'lucide-react';

export default function MemberIdCard({ user, profile, isPreview = false }) {
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);
  const [glarePosition, setGlarePosition] = useState({ x: 50, y: 50, opacity: 0 });
  const [isFlipped, setIsFlipped] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  const cardRef = useRef(null);

  // Fallback defaults for preview / unregistered users
  const name = profile?.name || user?.user_metadata?.full_name || user?.user_metadata?.name || 'Dhamma Seeker (ධර්ම ගවේෂක)';
  const email = profile?.email || user?.email || 'seeker@kalyanamitta.org';
  const avatarUrl = profile?.avatar_url || user?.user_metadata?.avatar_url || user?.user_metadata?.picture;
  
  // Format Member ID
  const kmId = profile?.kalyanamitta_id || (user?.id ? `KM-2026-${user.id.slice(0, 4).toUpperCase()}` : 'KM-2026-8842');
  
  // Member since date
  const memberDate = profile?.created_at || user?.created_at 
    ? new Date(profile?.created_at || user?.created_at).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
    : 'Nov 2026';
    
  const locationText = profile?.country 
    ? `${profile.country}${profile.state_district ? ` · ${profile.state_district}` : ''}`
    : 'Sri Lanka · Global Fellowship';

  // Mouse move 3D Tilt calculation
  const handleMouseMove = (e) => {
    if (!cardRef.current || isFlipped) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    const rotX = ((y - centerY) / centerY) * -12; // tilt angle
    const rotY = ((x - centerX) / centerX) * 12;
    
    setRotateX(rotX);
    setRotateY(rotY);

    // Glare position
    setGlarePosition({
      x: (x / rect.width) * 100,
      y: (y / rect.height) * 100,
      opacity: 0.25
    });
  };

  const handleMouseLeave = () => {
    setRotateX(0);
    setRotateY(0);
    setGlarePosition(prev => ({ ...prev, opacity: 0 }));
  };

  // 1-Click Copy Member ID & Link
  const handleCopy = () => {
    const textToCopy = `Kalyanamitta Member ID: ${kmId} (${name}) · https://kalyanamitta.org/profile`;
    navigator.clipboard.writeText(textToCopy).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    });
  };

  // WhatsApp Share
  const handleWhatsAppShare = () => {
    const message = encodeURIComponent(
      `✨ මම කල්‍යාණමිත්ත ධර්ම සාමාජිකයෙකු (Dhamma Seeker) ලෙස ලියාපදිංචි වුණා!\n🪪 මගේ සාමාජික අංකය: ${kmId}\n👤 නම: ${name}\n\nඔබත් ධර්ම ගවේෂක සාමාජිකත්වය ලබාගන්න: https://kalyanamitta.org/profile`
    );
    window.open(`https://api.whatsapp.com/send?text=${message}`, '_blank');
  };

  // Native Mobile Share or Copy Link
  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Kalyanamitta Seeker ID Card',
          text: `My Kalyanamitta Dhamma Seeker ID: ${kmId} (${name})`,
          url: window.location.origin + '/profile'
        });
      } catch (err) {
        handleCopy();
      }
    } else {
      handleCopy();
    }
  };

  // High-Resolution PNG Canvas Generator & Downloader
  const handleDownloadCard = () => {
    setIsDownloading(true);

    try {
      const canvas = document.createElement('canvas');
      canvas.width = 1200;
      canvas.height = 760;
      const ctx = canvas.getContext('2d');

      // 1. Base Gradient Background (Deep Royal Crimson)
      const bgGrad = ctx.createLinearGradient(0, 0, 1200, 760);
      bgGrad.addColorStop(0, '#420707');
      bgGrad.addColorStop(0.5, '#731212');
      bgGrad.addColorStop(1, '#240303');
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, 1200, 760);

      // 2. Gold Border Framing
      ctx.strokeStyle = '#D4AF37';
      ctx.lineWidth = 6;
      ctx.strokeRect(30, 30, 1140, 700);

      ctx.strokeStyle = 'rgba(212, 175, 55, 0.4)';
      ctx.lineWidth = 2;
      ctx.strokeRect(44, 44, 1112, 672);

      // Corner Accents
      const drawCorner = (cx, cy) => {
        ctx.fillStyle = '#D4AF37';
        ctx.fillRect(cx - 10, cy - 10, 20, 20);
      };
      drawCorner(30, 30);
      drawCorner(1170, 30);
      drawCorner(30, 730);
      drawCorner(1170, 730);

      // 3. Watermark Dharmachakra in background
      ctx.save();
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.04)';
      ctx.lineWidth = 8;
      ctx.beginPath();
      ctx.arc(880, 380, 260, 0, Math.PI * 2);
      ctx.stroke();
      for (let i = 0; i < 24; i++) {
        const angle = (i * Math.PI) / 12;
        ctx.beginPath();
        ctx.moveTo(880, 380);
        ctx.lineTo(880 + Math.cos(angle) * 260, 380 + Math.sin(angle) * 260);
        ctx.stroke();
      }
      ctx.restore();

      // 4. Header Titles
      ctx.fillStyle = '#D4AF37';
      ctx.font = 'bold 36px "Cinzel", "Georgia", serif';
      ctx.fillText('KALYANAMITTA DHAMMA FELLOWSHIP', 80, 110);

      ctx.fillStyle = '#E5E7EB';
      ctx.font = '500 20px "Noto Sans Sinhala", sans-serif';
      ctx.fillText('කල්‍යාණමිත්ත ගෝලීය ධර්ම සාමාජිකත්වය · GLOBAL DHAMMA SANGHA', 80, 146);

      // Gold Chip Graphic
      ctx.fillStyle = '#C59B27';
      ctx.fillRect(80, 190, 90, 65);
      ctx.strokeStyle = '#936F10';
      ctx.lineWidth = 3;
      ctx.strokeRect(80, 190, 90, 65);
      // Chip lines
      ctx.strokeStyle = '#705105';
      ctx.beginPath();
      ctx.moveTo(110, 190); ctx.lineTo(110, 255);
      ctx.moveTo(140, 190); ctx.lineTo(140, 255);
      ctx.moveTo(80, 222); ctx.lineTo(170, 222);
      ctx.stroke();

      // 5. User Details
      ctx.fillStyle = '#FFFFFF';
      ctx.font = 'bold 50px "Abhaya Libre", "Georgia", serif';
      ctx.fillText(name.slice(0, 28), 80, 360);

      ctx.fillStyle = '#D4AF37';
      ctx.font = 'bold 32px monospace';
      ctx.fillText(kmId, 80, 420);

      ctx.fillStyle = '#FBBF24';
      ctx.font = 'bold 22px sans-serif';
      ctx.fillText('VERIFIED DHAMMA SEEKER · ධර්ම ගවේෂක', 80, 470);

      ctx.fillStyle = '#D1D5DB';
      ctx.font = '22px "Noto Sans Sinhala", sans-serif';
      ctx.fillText(`ප්‍රදේශය: ${locationText}`, 80, 520);
      ctx.fillText(`සාමාජික දිනය: ${memberDate}`, 80, 560);

      // 6. Footer Seal & Barcode
      ctx.fillStyle = 'rgba(212, 175, 55, 0.8)';
      ctx.font = 'italic 26px "Abhaya Libre", serif';
      ctx.fillText('"සන්තුට්ඨි පරමං ධනං" (Contentment is supreme wealth)', 80, 680);

      // Barcode simulation on right
      ctx.fillStyle = '#FFFFFF';
      const startX = 850;
      for (let i = 0; i < 40; i++) {
        const w = (i % 3 === 0 ? 5 : 2);
        ctx.fillRect(startX + i * 7, 580, w, 60);
      }
      ctx.font = '14px monospace';
      ctx.fillStyle = '#D1D5DB';
      ctx.fillText('AUTH · DIGITAL PASS', 880, 665);

      // Download triggered
      const imgData = canvas.toDataURL('image/png');
      const a = document.createElement('a');
      a.href = imgData;
      a.download = `kalyanamitta-id-${kmId}.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } catch (err) {
      console.error('Download error:', err);
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%', maxWidth: '560px', margin: '0 auto' }}>
      
      {/* 3D CARD CONTAINER */}
      <div
        style={{
          perspective: '1200px',
          width: '100%',
          padding: '10px 0'
        }}
      >
        <motion.div
          ref={cardRef}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          animate={{
            rotateX: isFlipped ? 0 : rotateX,
            rotateY: isFlipped ? 180 : rotateY,
            scale: 1
          }}
          transition={{ type: 'spring', stiffness: 300, damping: 25 }}
          style={{
            position: 'relative',
            width: '100%',
            aspectRatio: '1.586 / 1',
            minHeight: '270px',
            transformStyle: 'preserve-3d',
            cursor: 'pointer',
            borderRadius: '20px',
            boxShadow: '0 25px 60px -15px rgba(0,0,0,0.45), 0 0 25px rgba(140, 21, 21, 0.25)'
          }}
        >
          {/* ================= FRONT FACE ================= */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              backfaceVisibility: 'hidden',
              borderRadius: '20px',
              background: 'linear-gradient(135deg, #3D0707 0%, #7A1212 50%, #200303 100%)',
              border: '2px solid #D4AF37',
              padding: 'clamp(18px, 4vw, 28px)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              overflow: 'hidden',
              color: '#FFFFFF'
            }}
          >
            {/* Dynamic Holographic Glare Reflection */}
            <div
              style={{
                position: 'absolute',
                inset: 0,
                background: `radial-gradient(circle at ${glarePosition.x}% ${glarePosition.y}%, rgba(255,255,255,${glarePosition.opacity}) 0%, transparent 60%)`,
                pointerEvents: 'none',
                zIndex: 4
              }}
            />

            {/* Background Watermark Dharmachakra */}
            <div
              style={{
                position: 'absolute',
                right: '-40px',
                bottom: '-40px',
                width: '260px',
                height: '260px',
                borderRadius: '50%',
                border: '6px solid rgba(255, 255, 255, 0.04)',
                pointerEvents: 'none',
                zIndex: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <div style={{ width: '180px', height: '180px', borderRadius: '50%', border: '2px dashed rgba(255, 255, 255, 0.05)' }} />
            </div>

            {/* Front Header */}
            <div style={{ position: 'relative', zIndex: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{
                    fontFamily: '"Cinzel", "Georgia", serif',
                    fontWeight: '800',
                    fontSize: 'clamp(0.95rem, 2vw, 1.15rem)',
                    color: '#D4AF37',
                    letterSpacing: '0.04em'
                  }}>
                    KALYANAMITTA
                  </span>
                  <span style={{
                    fontSize: '0.62rem',
                    fontWeight: '700',
                    padding: '2px 6px',
                    borderRadius: '4px',
                    background: '#D4AF37',
                    color: '#3D0707',
                    textTransform: 'uppercase'
                  }}>
                    FELLOWSHIP
                  </span>
                </div>
                <div style={{ fontSize: '0.68rem', color: 'rgba(255,255,255,0.7)', letterSpacing: '0.02em', marginTop: '2px' }}>
                  ගෝලීය ධර්ම සාමාජිකත්වය · GLOBAL SANGHA PASS
                </div>
              </div>

              {/* Holographic Chip */}
              <div
                style={{
                  width: '42px',
                  height: '32px',
                  borderRadius: '6px',
                  background: 'linear-gradient(135deg, #ECC94B 0%, #D69E2E 50%, #B7791F 100%)',
                  border: '1px solid #744210',
                  boxShadow: 'inset 0 1px 2px rgba(255,255,255,0.4)',
                  position: 'relative',
                  overflow: 'hidden'
                }}
              >
                <div style={{ position: 'absolute', left: '14px', top: 0, bottom: 0, width: '1px', background: '#744210' }} />
                <div style={{ position: 'absolute', right: '14px', top: 0, bottom: 0, width: '1px', background: '#744210' }} />
                <div style={{ position: 'absolute', top: '15px', left: 0, right: 0, height: '1px', background: '#744210' }} />
              </div>
            </div>

            {/* Front Middle: Avatar & User Identity */}
            <div style={{ position: 'relative', zIndex: 2, display: 'flex', alignItems: 'center', gap: '16px', margin: '14px 0' }}>
              {/* Photo Avatar with Gold Ring */}
              <div
                style={{
                  width: 'clamp(56px, 12vw, 72px)',
                  height: 'clamp(56px, 12vw, 72px)',
                  borderRadius: '50%',
                  border: '2px solid #D4AF37',
                  padding: '2px',
                  background: 'rgba(0,0,0,0.3)',
                  flexShrink: 0,
                  boxShadow: '0 4px 12px rgba(0,0,0,0.4)'
                }}
              >
                {avatarUrl ? (
                  <img
                    src={avatarUrl}
                    alt={name}
                    referrerPolicy="no-referrer"
                    style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }}
                  />
                ) : (
                  <div
                    style={{
                      width: '100%',
                      height: '100%',
                      borderRadius: '50%',
                      background: 'linear-gradient(135deg, #8C1515, #D4AF37)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '1.4rem',
                      fontWeight: '700',
                      color: '#FFFFFF'
                    }}
                  >
                    {name[0]?.toUpperCase() || 'K'}
                  </div>
                )}
              </div>

              {/* Name & ID numbers */}
              <div style={{ minWidth: 0, flex: 1 }}>
                <div style={{
                  fontSize: 'clamp(1.1rem, 2.5vw, 1.4rem)',
                  fontWeight: '700',
                  fontFamily: 'var(--font-serif)',
                  color: '#FFFFFF',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                  lineHeight: 1.2
                }}>
                  {name}
                </div>

                <div style={{
                  fontFamily: 'monospace',
                  fontSize: 'clamp(0.85rem, 1.8vw, 1.05rem)',
                  fontWeight: '700',
                  color: '#D4AF37',
                  letterSpacing: '0.08em',
                  margin: '3px 0'
                }}>
                  {kmId}
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
                  <span style={{
                    fontSize: '0.65rem',
                    fontWeight: '700',
                    color: '#FBBF24',
                    background: 'rgba(251, 191, 36, 0.12)',
                    border: '1px solid rgba(251, 191, 36, 0.3)',
                    padding: '2px 6px',
                    borderRadius: '4px'
                  }}>
                    VERIFIED SEEKER · ධර්ම ගවේෂක
                  </span>
                  <span style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.7)' }}>
                    Since {memberDate}
                  </span>
                </div>
              </div>
            </div>

            {/* Front Footer: Location & Pali Seal */}
            <div style={{
              position: 'relative',
              zIndex: 2,
              display: 'flex',
              alignItems: 'flex-end',
              justifyContent: 'space-between',
              borderTop: '1px solid rgba(212, 175, 55, 0.25)',
              paddingTop: '8px'
            }}>
              <div>
                <div style={{ fontSize: '0.68rem', color: 'rgba(255,255,255,0.6)' }}>
                  {locationText}
                </div>
                <div style={{
                  fontFamily: 'var(--font-serif)',
                  fontStyle: 'italic',
                  fontSize: '0.76rem',
                  color: '#D4AF37',
                  marginTop: '1px'
                }}>
                  "සන්තුට්ඨි පරමං ධනං"
                </div>
              </div>

              {/* Barcode graphic */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                <div style={{ display: 'flex', gap: '2px', height: '18px', alignItems: 'center' }}>
                  {[2, 1, 3, 1, 2, 4, 1, 3, 2, 1, 4, 2, 1, 3, 2].map((w, idx) => (
                    <div key={idx} style={{ width: `${w}px`, height: '100%', background: '#FFFFFF', opacity: 0.85 }} />
                  ))}
                </div>
                <span style={{ fontSize: '0.55rem', fontFamily: 'monospace', color: 'rgba(255,255,255,0.5)', marginTop: '2px' }}>
                  AUTHENTIC DIGITAL PASS
                </span>
              </div>
            </div>
          </div>

          {/* ================= BACK FACE ================= */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              backfaceVisibility: 'hidden',
              transform: 'rotateY(180deg)',
              borderRadius: '20px',
              background: 'linear-gradient(135deg, #200303 0%, #4D0909 50%, #150202 100%)',
              border: '2px solid #D4AF37',
              padding: 'clamp(16px, 3.5vw, 24px)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              overflow: 'hidden',
              color: '#FFFFFF'
            }}
          >
            {/* Magnetic Stripe */}
            <div style={{
              position: 'absolute',
              top: '20px',
              left: 0,
              right: 0,
              height: '38px',
              background: 'linear-gradient(180deg, #111827 0%, #000000 100%)',
              borderTop: '1px solid rgba(212,175,55,0.3)',
              borderBottom: '1px solid rgba(212,175,55,0.3)'
            }} />

            {/* Back Content Spacer */}
            <div style={{ marginTop: '54px' }}>
              {/* Signature Strip */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                <div style={{
                  flex: 1,
                  background: '#FFFFFF',
                  color: '#111827',
                  padding: '6px 12px',
                  borderRadius: '4px',
                  fontFamily: '"Brush Script MT", cursive, sans-serif',
                  fontSize: '1.1rem',
                  letterSpacing: '0.05em'
                }}>
                  {name}
                </div>
                <div style={{
                  fontFamily: 'monospace',
                  fontSize: '0.8rem',
                  fontWeight: '700',
                  color: '#D4AF37',
                  background: 'rgba(0,0,0,0.5)',
                  padding: '6px 10px',
                  borderRadius: '4px',
                  border: '1px solid rgba(212,175,55,0.3)'
                }}>
                  {kmId.slice(-4)}
                </div>
              </div>

              {/* Fellowship Charter & Pañcasīla Commitment */}
              <div style={{
                fontSize: '0.72rem',
                color: 'rgba(255,255,255,0.75)',
                lineHeight: 1.45,
                background: 'rgba(0,0,0,0.25)',
                padding: '8px 10px',
                borderRadius: '6px',
                borderLeft: '3px solid #D4AF37'
              }}>
                <strong>Pañcasīla Commitment (පංචසීල අධිෂ්ඨානය):</strong> මෙම සාමාජික පත දරන්නා බුද්ධ ශාසනයේ උන්නතිය, පුද්ගලික සදාචාර සම්පන්න බව සහ කල්‍යාණමිත්‍ර ධර්ම සමාගමේ ප්‍රතිපත්ති ගරුකව ක්‍රියා කිරීමට කැපවී සිටී.
              </div>
            </div>

            {/* Back Footer: Verification URI & Seal */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              borderTop: '1px solid rgba(212, 175, 55, 0.25)',
              paddingTop: '6px'
            }}>
              <div>
                <div style={{ fontSize: '0.68rem', color: '#D4AF37', fontWeight: '700' }}>
                  VERIFY AUTHENTICITY
                </div>
                <div style={{ fontSize: '0.62rem', color: 'rgba(255,255,255,0.6)' }}>
                  https://kalyanamitta.org/profile
                </div>
              </div>

              <div style={{
                fontSize: '0.62rem',
                color: '#D4AF37',
                border: '1px solid #D4AF37',
                padding: '2px 6px',
                borderRadius: '4px'
              }}>
                SEEKER CHARTER v1.0
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* CARD ACTION BUTTONS */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '10px',
        marginTop: '18px',
        flexWrap: 'wrap',
        width: '100%'
      }}>
        {/* Flip Card Button */}
        <button
          onClick={() => setIsFlipped(!isFlipped)}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            padding: '8px 14px',
            borderRadius: '8px',
            border: '1px solid var(--border-color, rgba(0,0,0,0.12))',
            background: 'var(--bg-card)',
            color: 'var(--text-main)',
            fontSize: '0.84rem',
            fontWeight: '600',
            cursor: 'pointer'
          }}
        >
          <RotateCw size={14} />
          <span>{isFlipped ? 'Show Front' : 'Flip Card (පිටුපස)'}</span>
        </button>

        {/* Download Image Button */}
        <button
          onClick={handleDownloadCard}
          disabled={isDownloading}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            padding: '8px 16px',
            borderRadius: '8px',
            border: 'none',
            background: '#8C1515',
            color: '#FFFFFF',
            fontSize: '0.84rem',
            fontWeight: '600',
            cursor: 'pointer',
            boxShadow: '0 2px 8px rgba(140, 21, 21, 0.25)'
          }}
        >
          <Download size={14} />
          <span>{isDownloading ? 'Generating...' : 'Download ID Card (PNG)'}</span>
        </button>

        {/* WhatsApp Share Button */}
        <button
          onClick={handleWhatsAppShare}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            padding: '8px 14px',
            borderRadius: '8px',
            border: '1px solid rgba(37, 211, 102, 0.4)',
            background: 'rgba(37, 211, 102, 0.1)',
            color: '#059669',
            fontSize: '0.84rem',
            fontWeight: '600',
            cursor: 'pointer'
          }}
        >
          <Share2 size={14} />
          <span>Share WhatsApp</span>
        </button>

        {/* Copy Link Button */}
        <button
          onClick={handleNativeShare}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            padding: '8px 14px',
            borderRadius: '8px',
            border: '1px solid var(--border-color, rgba(0,0,0,0.12))',
            background: 'var(--bg-card)',
            color: 'var(--text-main)',
            fontSize: '0.84rem',
            fontWeight: '600',
            cursor: 'pointer'
          }}
        >
          {copied ? <Check size={14} color="#059669" /> : <Copy size={14} />}
          <span>{copied ? 'Copied!' : 'Copy ID Link'}</span>
        </button>
      </div>

    </div>
  );
}
