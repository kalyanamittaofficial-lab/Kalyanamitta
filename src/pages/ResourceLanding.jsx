import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { BookOpen, Headphones, ExternalLink, ArrowLeft, Star, Share2 } from 'lucide-react';
import { supabase } from '../utils/supabase';

// Mock DB for Resources
const libraryResources = {
  'dhammapadaya': {
    id: 'dhammapadaya',
    title: 'ධම්මපදය',
    category: 'සූත්‍ර පිටකය',
    description: 'බුදුරජාණන් වහන්සේ දේශනා කළ ගාථා 423කින් සමන්විත, බෞද්ධ ජීවන දර්ශනයේ හදවත බඳු වූ උත්තරීතර ග්‍රන්ථය.',
    image: '/sutta_pitaka.png',
    links: [
      { type: 'text', name: 'ත්‍රිපිටක පාළි සහ සිංහල තේරුම (Pitaka.lk)', url: 'https://pitaka.lk/main?n=19', icon: <BookOpen size={20} /> },
      { type: 'explanation', name: 'ධම්මපද විවරණය (මහමෙව්නාව)', url: '#', icon: <BookOpen size={20} /> },
      { type: 'audio', name: 'ධම්මපද ශ්‍රවණය', url: '#', icon: <Headphones size={20} /> },
      { type: 'translation', name: 'English Translation (AccessToInsight)', url: 'https://www.accesstoinsight.org/tipitaka/kn/dhp/index.html', icon: <ExternalLink size={20} /> }
    ]
  },
  'satipatthana': {
    id: 'satipatthana',
    title: 'මහා සතිපට්ඨාන සූත්‍රය',
    category: 'සූත්‍ර පිටකය',
    description: 'නිවන් මඟ සඳහා ඇති එකම මාර්ගය ලෙස බුදුරජාණන් වහන්සේ පෙන්වා දුන් සතිපට්ඨාන භාවනාව ඇතුළත් සූත්‍ර දේශනාව.',
    image: '/buddha_ananda_hero.png',
    links: [
      { type: 'text', name: 'මූලික සූත්‍රය (Pitaka.lk)', url: 'https://pitaka.lk/main?n=11119', icon: <BookOpen size={20} /> },
      { type: 'audio', name: 'සූත්‍ර ශ්‍රවණය', url: '#', icon: <Headphones size={20} /> }
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
        // Check if in collections (only if user_collections table exists, wrapping in try/catch to prevent breaking if SQL isn't run yet)
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
      // Remove
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
      // Add
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
      <div className="mobile-padding" style={{ position: 'relative', zIndex: 20, paddingTop: '100px', maxWidth: '1200px', margin: '0 auto', display: 'flex', justifyContent: 'flex-start' }}>
        <Link to="/words" style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-muted)', textDecoration: 'none', fontFamily: 'var(--font-sinhala)', fontWeight: '600', padding: '12px 0' }}>
          <ArrowLeft size={18} /> පුස්තකාලය වෙත
        </Link>
      </div>

      {resource && (
        <div className="mobile-padding" style={{ position: 'relative', zIndex: 10, padding: '40px 5vw 120px 5vw', maxWidth: '1200px', margin: '0 auto' }}>
          
          <div style={{ display: 'flex', flexDirection: 'row', gap: '60px', flexWrap: 'wrap' }}>
            
            {/* Left Column: Image & Quick Actions */}
            <div style={{ flex: '1 1 300px', maxWidth: '400px' }}>
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                style={{
                  width: '100%',
                  aspectRatio: '3/4',
                  background: 'var(--bg-secondary)',
                  borderRadius: '12px',
                  boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
                  position: 'relative',
                  overflow: 'hidden',
                  border: '1px solid rgba(0,0,0,0.05)',
                  marginBottom: '24px'
                }}
              >
                <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundImage: `url(${resource.image})`, backgroundSize: 'cover', backgroundPosition: 'center', opacity: 0.9 }}></div>
                <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.9), transparent)' }}></div>
                <div style={{ position: 'absolute', bottom: '20px', left: '20px', color: '#fff', textShadow: '0 2px 10px rgba(0,0,0,0.5)' }}>
                   <div style={{ fontSize: '0.8rem', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '8px', opacity: 0.8, fontWeight: '600' }}>{resource.category}</div>
                   <h2 style={{ fontSize: '1.8rem', fontFamily: 'var(--font-serif)', fontWeight: '700' }}>{resource.title}</h2>
                </div>
              </motion.div>

              <div style={{ display: 'flex', gap: '12px' }}>
                <button 
                  onClick={toggleFavorite}
                  style={{
                    flex: 1,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    padding: '14px 20px',
                    background: isFavorite ? 'rgba(184, 134, 11, 0.1)' : 'var(--primary)',
                    color: isFavorite ? 'var(--primary)' : '#fff',
                    border: isFavorite ? '1px solid var(--primary)' : '1px solid var(--primary)',
                    borderRadius: '8px',
                    fontFamily: 'var(--font-sinhala)',
                    fontWeight: '600',
                    fontSize: '1rem',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease'
                  }}
                >
                  <Star size={18} fill={isFavorite ? 'currentColor' : 'none'} />
                  {isFavorite ? 'එකතුවට එක් කර ඇත' : 'එකතුවට එක් කරන්න'}
                </button>
                <button style={{
                    padding: '14px',
                    background: 'var(--bg-secondary)',
                    color: 'var(--text-main)',
                    border: '1px solid rgba(0,0,0,0.1)',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}>
                  <Share2 size={20} />
                </button>
              </div>
            </div>

            {/* Right Column: Details & Links */}
            <div style={{ flex: '2 1 500px', display: 'flex', flexDirection: 'column', paddingTop: '10px' }}>
              <h1 style={{ fontSize: 'clamp(2.5rem, 4vw, 3.5rem)', color: 'var(--text-main)', fontFamily: 'var(--font-serif)', fontWeight: '700', marginBottom: '16px', lineHeight: '1.2' }}>
                {resource.title}
              </h1>
              <div style={{ fontSize: '1.1rem', color: 'var(--primary)', fontWeight: '600', letterSpacing: '0.05em', marginBottom: '32px' }}>
                {resource.category}
              </div>
              
              <p style={{ fontSize: '1.15rem', color: 'var(--text-muted)', lineHeight: '1.8', fontFamily: 'var(--font-sinhala)', marginBottom: '48px', maxWidth: '700px' }}>
                {resource.description}
              </p>

              {/* Resources List */}
              <h3 style={{ fontSize: '1.4rem', color: 'var(--text-main)', fontFamily: 'var(--font-serif)', fontWeight: '700', marginBottom: '24px' }}>
                මූලාශ්‍ර (External Resources)
              </h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {resource.links.map((link, idx) => (
                  <a 
                    key={idx}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '20px 24px',
                      background: 'var(--bg-secondary)',
                      border: '1px solid rgba(0,0,0,0.05)',
                      borderRadius: '12px',
                      textDecoration: 'none',
                      transition: 'all 0.3s ease',
                      boxShadow: '0 4px 15px rgba(0,0,0,0.02)'
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 10px 25px rgba(0,0,0,0.05)'; e.currentTarget.style.borderColor = 'var(--primary)'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 15px rgba(0,0,0,0.02)'; e.currentTarget.style.borderColor = 'rgba(0,0,0,0.05)'; }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                      <div style={{ color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', width: '40px', height: '40px', background: 'rgba(184, 134, 11, 0.1)', borderRadius: '50%' }}>
                        {link.icon}
                      </div>
                      <span style={{ fontSize: '1.1rem', color: 'var(--text-main)', fontWeight: '600', fontFamily: 'var(--font-sinhala)' }}>
                        {link.name}
                      </span>
                    </div>
                    <ExternalLink size={20} color="var(--text-muted)" />
                  </a>
                ))}
              </div>

            </div>
          </div>
        </div>
      )}
    </div>
  );
}
