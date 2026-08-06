import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { BookOpen, Headphones, ExternalLink, ArrowLeft, Star, Share2, Info } from 'lucide-react';
import { supabase } from '../utils/supabase';

// Mock DB for Resources (Images removed)
const libraryResources = {
  'dhammapadaya': {
    id: 'dhammapadaya',
    title: 'ධම්මපදය',
    category: 'සූත්‍ර පිටකය',
    description: 'බුදුරජාණන් වහන්සේ දේශනා කළ ගාථා 423කින් සමන්විත, බෞද්ධ ජීවන දර්ශනයේ හදවත බඳු වූ උත්තරීතර ග්‍රන්ථය.',
    type: 'Text',
    links: [
      { type: 'text', name: 'ත්‍රිපිටක පාළි සහ සිංහල තේරුම (Pitaka.lk)', url: 'https://pitaka.lk/main?n=19', icon: <BookOpen size={18} /> },
      { type: 'explanation', name: 'ධම්මපද විවරණය (මහමෙව්නාව)', url: '#', icon: <BookOpen size={18} /> },
      { type: 'audio', name: 'ධම්මපද ශ්‍රවණය', url: '#', icon: <Headphones size={18} /> },
      { type: 'translation', name: 'English Translation (AccessToInsight)', url: 'https://www.accesstoinsight.org/tipitaka/kn/dhp/index.html', icon: <ExternalLink size={18} /> }
    ]
  },
  'satipatthana': {
    id: 'satipatthana',
    title: 'මහා සතිපට්ඨාන සූත්‍රය',
    category: 'සූත්‍ර පිටකය',
    description: 'නිවන් මඟ සඳහා ඇති එකම මාර්ගය ලෙස බුදුරජාණන් වහන්සේ පෙන්වා දුන් සතිපට්ඨාන භාවනාව ඇතුළත් සූත්‍ර දේශනාව.',
    type: 'Audio',
    links: [
      { type: 'text', name: 'මූලික සූත්‍රය (Pitaka.lk)', url: 'https://pitaka.lk/main?n=11119', icon: <BookOpen size={18} /> },
      { type: 'audio', name: 'සූත්‍ර ශ්‍රවණය', url: '#', icon: <Headphones size={18} /> }
    ]
  }
};

export default function ResourceLanding() {
  const { id } = useParams();
  const [resource, setResource] = useState(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [session, setSession] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate Fetch
    if (libraryResources[id]) {
      setResource(libraryResources[id]);
    }
    
    // Check Auth & Favorite Status
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setSession(session);
      
      if (session && libraryResources[id]) {
        try {
          const { data, error } = await supabase
            .from('user_collections')
            .select('id')
            .eq('user_id', session.user.id)
            .eq('resource_id', id)
            .single();
            
          if (data && !error) setIsFavorite(true);
        } catch (e) {
          console.log("Collections table might not exist yet.");
        }
      }
      setIsLoading(false);
    };
    
    checkAuth();
  }, [id]);

  const toggleFavorite = async () => {
    if (!session) {
      alert("කරුණාකර පළමුව ගිණුමට පිවිසෙන්න. (Please login first)");
      return;
    }
    
    if (isFavorite) {
      try {
        await supabase
          .from('user_collections')
          .delete()
          .eq('user_id', session.user.id)
          .eq('resource_id', id);
        setIsFavorite(false);
      } catch (e) {
        alert("Error removing from favorites.");
      }
    } else {
      try {
        const { error } = await supabase
          .from('user_collections')
          .insert({
            user_id: session.user.id,
            resource_id: id,
            resource_type: 'book',
            title: resource.title
          });
        if (error) throw error;
        setIsFavorite(true);
      } catch (e) {
        alert("Error adding to favorites. Ensure the Supabase SQL migration has been run.");
      }
    }
  };

  if (!resource && !isLoading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-main)' }}>
        <h2 style={{ color: 'var(--text-main)', fontFamily: 'var(--font-serif)' }}>ග්‍රන්ථය සොයාගත නොහැක (Resource Not Found)</h2>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', width: '100%', background: 'var(--bg-main)', position: 'relative' }}>
      
      {/* Back to Library */}
      <div className="mobile-padding" style={{ position: 'relative', zIndex: 20, paddingTop: '100px', maxWidth: '900px', margin: '0 auto', display: 'flex', justifyContent: 'flex-start' }}>
        <Link to="/words" style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-muted)', textDecoration: 'none', fontFamily: 'var(--font-sinhala)', fontWeight: '600', padding: '12px 0' }}>
          <ArrowLeft size={16} /> ආපසු පුස්තකාලයට (Back to Index)
        </Link>
      </div>

      {resource && (
        <div className="mobile-padding" style={{ position: 'relative', zIndex: 10, padding: '40px 5vw 120px 5vw', maxWidth: '900px', margin: '0 auto' }}>
          
          {/* Header Section (Typography Focused) */}
          <div style={{ borderBottom: '2px solid var(--text-main)', paddingBottom: '32px', marginBottom: '32px' }}>
            <div style={{ fontSize: '0.9rem', color: 'var(--primary)', fontWeight: '700', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '16px' }}>
              {resource.category}
            </div>
            
            <h1 style={{ fontSize: 'clamp(2.5rem, 5vw, 4.5rem)', color: 'var(--text-main)', fontFamily: 'var(--font-serif)', fontWeight: '700', marginBottom: '24px', lineHeight: '1.1', letterSpacing: '-0.02em' }}>
              {resource.title}
            </h1>
            
            <p style={{ fontSize: '1.2rem', color: 'var(--text-muted)', lineHeight: '1.8', fontFamily: 'var(--font-sinhala)', maxWidth: '750px', margin: '0' }}>
              {resource.description}
            </p>
          </div>

          {/* Academic Metadata Grid & Actions */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '40px', marginBottom: '60px', alignItems: 'flex-start', justifyContent: 'space-between' }}>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'auto 1fr', columnGap: '32px', rowGap: '12px', fontSize: '0.95rem', fontFamily: 'var(--font-sinhala)' }}>
              <div style={{ color: 'var(--text-muted)', fontWeight: '500' }}>වර්ගය (Format)</div>
              <div style={{ color: 'var(--text-main)', fontWeight: '600' }}>{resource.type}</div>
              
              <div style={{ color: 'var(--text-muted)', fontWeight: '500' }}>මූලාශ්‍ර (Sources)</div>
              <div style={{ color: 'var(--text-main)', fontWeight: '600' }}>{resource.links.length} Available</div>
            </div>

            <div style={{ display: 'flex', gap: '12px' }}>
              <button 
                onClick={toggleFavorite}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '10px 20px',
                  background: 'transparent',
                  color: 'var(--text-main)',
                  border: isFavorite ? '1px solid var(--primary)' : '1px solid rgba(0,0,0,0.15)',
                  borderRadius: '4px',
                  fontFamily: 'var(--font-sinhala)',
                  fontWeight: '600',
                  fontSize: '0.95rem',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--text-main)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = isFavorite ? 'var(--primary)' : 'rgba(0,0,0,0.15)'; }}
              >
                <Star size={16} fill={isFavorite ? 'var(--primary)' : 'none'} color={isFavorite ? 'var(--primary)' : 'currentColor'} />
                {isFavorite ? 'එකතුවේ ඇත (Saved)' : 'එකතුවට එක් කරන්න (Save)'}
              </button>
              
              <button style={{
                  padding: '10px 16px',
                  background: 'transparent',
                  color: 'var(--text-main)',
                  border: '1px solid rgba(0,0,0,0.15)',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--text-main)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'rgba(0,0,0,0.15)'; }}>
                <Share2 size={16} />
              </button>
            </div>
          </div>

          {/* Resources List (Citation Style) */}
          <div>
            <h3 style={{ fontSize: '1.2rem', color: 'var(--text-main)', fontFamily: 'var(--font-serif)', fontWeight: '700', marginBottom: '24px', borderBottom: '1px solid rgba(0,0,0,0.08)', paddingBottom: '12px' }}>
              බාහිර මූලාශ්‍ර (External References)
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column' }}>
              {resource.links.map((link, idx) => (
                <a 
                  key={idx}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'auto 1fr auto',
                    alignItems: 'center',
                    gap: '16px',
                    padding: '20px 0',
                    borderBottom: '1px solid rgba(0,0,0,0.06)',
                    textDecoration: 'none',
                    transition: 'padding-left 0.2s ease',
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.paddingLeft = '8px'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.paddingLeft = '0'; }}
                >
                  <div style={{ color: 'var(--text-muted)' }}>
                    {link.icon}
                  </div>
                  <span style={{ fontSize: '1.05rem', color: 'var(--text-main)', fontWeight: '500', fontFamily: 'var(--font-sinhala)' }}>
                    {link.name}
                  </span>
                  <ExternalLink size={16} color="var(--text-muted)" />
                </a>
              ))}
            </div>
            
            <div style={{ marginTop: '40px', display: 'flex', gap: '12px', padding: '16px', background: 'rgba(0,0,0,0.02)', borderRadius: '4px', color: 'var(--text-muted)', fontSize: '0.9rem', fontFamily: 'var(--font-sinhala)' }}>
              <Info size={18} style={{ flexShrink: 0 }} />
              <div>
                මෙම සබැඳි වෙනත් ආයතන සහ වෙබ් අඩවි මගින් නඩත්තු කෙරේ. ඒවායේ අන්තර්ගතය සහ බුද්ධිමය දේපළ අයිතිය අදාළ පාර්ශවයන් සතු වේ. (External links belong to their respective owners).
              </div>
            </div>

          </div>

        </div>
      )}
    </div>
  );
}
