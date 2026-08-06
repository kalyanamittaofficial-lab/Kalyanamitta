import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, Book, Headphones, Grid, ChevronRight } from 'lucide-react';

// Mock DB for Search
const libraryResources = [
  { id: 'dhammapadaya', title: 'ධම්මපදය', category: 'සූත්‍ර පිටකය', type: 'book', image: '/sutta_pitaka.png' },
  { id: 'satipatthana', title: 'මහා සතිපට්ඨාන සූත්‍රය', category: 'සූත්‍ර පිටකය', type: 'audio', image: '/buddha_ananda_hero.png' }
];

export default function Words() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');

  const filteredResources = libraryResources.filter(res => 
    res.title.includes(searchQuery) || res.category.includes(searchQuery)
  );

  return (
    <div style={{ position: 'relative', minHeight: '100vh', width: '100%', overflowX: 'hidden', background: 'var(--bg-main)' }}>
      {/* Main Content Wrapper */}
      <div className="mobile-padding" style={{ position: 'relative', zIndex: 10, padding: '5vh 5vw 120px 5vw', maxWidth: '1400px', margin: '0 auto' }}>
        
        {/* Hero & Search */}
        <div style={{ maxWidth: '800px', margin: '0 auto 60px auto', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
          <h1 style={{
            fontSize: 'clamp(2.5rem, 5vw, 4.5rem)', fontWeight: '700',
            color: 'var(--primary)', fontFamily: 'var(--font-serif)',
            marginBottom: '16px', letterSpacing: '-0.02em'
          }}>කල්‍යාණමිත්ත පුස්තකාලය</h1>
          
          <p style={{ fontSize: '1.2rem', color: 'var(--text-main)', marginBottom: '40px', letterSpacing: '0.05em', fontWeight: '600', fontFamily: 'var(--font-sinhala)' }}>
            විස්තීරණ ධර්ම ග්‍රන්ථ හා දේශනා එකතුව
          </p>

          <div style={{ 
            width: '100%', 
            maxWidth: '600px', 
            position: 'relative',
            display: 'flex',
            alignItems: 'center'
          }}>
            <Search size={20} color="var(--text-muted)" style={{ position: 'absolute', left: '20px' }} />
            <input 
              type="text" 
              placeholder="ධර්ම ග්‍රන්ථ, සූත්‍ර, හෝ දේශනා සොයන්න..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: '100%',
                padding: '18px 20px 18px 56px',
                fontSize: '1.1rem',
                border: '1px solid rgba(0,0,0,0.1)',
                borderRadius: '50px',
                background: 'var(--bg-secondary)',
                fontFamily: 'var(--font-sinhala)',
                color: 'var(--text-main)',
                outline: 'none',
                boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
                transition: 'all 0.3s ease'
              }}
              onFocus={(e) => { e.currentTarget.style.borderColor = 'var(--primary)'; e.currentTarget.style.boxShadow = '0 8px 30px rgba(184, 134, 11, 0.15)'; }}
              onBlur={(e) => { e.currentTarget.style.borderColor = 'rgba(0,0,0,0.1)'; e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.05)'; }}
            />
          </div>
        </div>

        {/* Search Results / Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '32px' }}>
          {filteredResources.map((res) => (
            <div 
              key={res.id}
              onClick={() => navigate(`/library/${res.id}`)}
              style={{
                background: 'var(--bg-secondary)',
                borderRadius: '16px',
                border: '1px solid rgba(0,0,0,0.05)',
                overflow: 'hidden',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                boxShadow: '0 10px 30px rgba(0,0,0,0.02)',
                display: 'flex',
                flexDirection: 'column'
              }}
              onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 20px 40px rgba(0,0,0,0.08)'; e.currentTarget.style.borderColor = 'var(--primary)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 10px 30px rgba(0,0,0,0.02)'; e.currentTarget.style.borderColor = 'rgba(0,0,0,0.05)'; }}
            >
              <div style={{ width: '100%', height: '200px', backgroundImage: `url(${res.image})`, backgroundSize: 'cover', backgroundPosition: 'center' }}></div>
              <div style={{ padding: '24px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                <div style={{ fontSize: '0.8rem', color: 'var(--primary)', fontWeight: '700', letterSpacing: '0.05em', marginBottom: '8px' }}>
                  {res.category}
                </div>
                <h3 style={{ fontSize: '1.4rem', color: 'var(--text-main)', fontFamily: 'var(--font-serif)', fontWeight: '700', marginBottom: '16px' }}>
                  {res.title}
                </h3>
                <div style={{ marginTop: 'auto', display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-muted)', fontSize: '0.9rem', fontFamily: 'var(--font-sinhala)', fontWeight: '600' }}>
                  {res.type === 'book' ? <Book size={16} /> : <Headphones size={16} />}
                  <span>{res.type === 'book' ? 'කියවීම සඳහා' : 'ශ්‍රවණය සඳහා'}</span>
                  <ChevronRight size={16} style={{ marginLeft: 'auto' }} />
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredResources.length === 0 && (
          <div style={{ textAlign: 'center', padding: '60px', color: 'var(--text-muted)', fontFamily: 'var(--font-sinhala)', fontSize: '1.2rem' }}>
            සෙවුම් ප්‍රතිඵල හමු නොවීය. (No results found)
          </div>
        )}

      </div>
    </div>
  );
}
