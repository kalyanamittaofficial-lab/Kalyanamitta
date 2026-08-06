import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, Book, Headphones, ArrowRight } from 'lucide-react';

// Mock DB for Search (Images removed, Singlish aliases added)
const libraryResources = [
  { 
    id: 'dhammapadaya', 
    title: 'ධම්මපදය', 
    category: 'සූත්‍ර පිටකය', 
    type: 'book',
    aliases: ['dhammapadaya', 'dammapadaya', 'dhammapada', 'dhamma padaya']
  },
  { 
    id: 'satipatthana', 
    title: 'මහා සතිපට්ඨාන සූත්‍රය', 
    category: 'සූත්‍ර පිටකය', 
    type: 'audio',
    aliases: ['satipatthana', 'maha satipattana', 'satipattana', 'sathipatthana', 'sathipattana']
  }
];

export default function Words() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');

  const filteredResources = libraryResources.filter(res => {
    const query = searchQuery.toLowerCase();
    return (
      res.title.toLowerCase().includes(query) || 
      res.category.toLowerCase().includes(query) ||
      (res.aliases && res.aliases.some(alias => alias.toLowerCase().includes(query)))
    );
  });

  return (
    <div style={{ position: 'relative', minHeight: '100vh', width: '100%', overflowX: 'hidden', background: 'var(--bg-main)' }}>
      {/* Main Content Wrapper */}
      <div className="mobile-padding" style={{ position: 'relative', zIndex: 10, padding: '10vh 5vw 120px 5vw', maxWidth: '1000px', margin: '0 auto' }}>
        
        {/* Academic Header & Search */}
        <div style={{ marginBottom: '60px', display: 'flex', flexDirection: 'column' }}>
          <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', letterSpacing: '0.15em', textTransform: 'uppercase', fontWeight: '600', marginBottom: '16px' }}>
            Kalyanamitta Pusthakalaya
          </div>
          <h1 style={{
            fontSize: 'clamp(2.5rem, 5vw, 4rem)', fontWeight: '700',
            color: 'var(--text-main)', fontFamily: 'var(--font-serif)',
            marginBottom: '16px', letterSpacing: '-0.02em', lineHeight: '1.1'
          }}>කල්‍යාණමිත්ත පුස්තකාලය</h1>
          
          <p style={{ fontSize: '1.2rem', color: 'var(--text-muted)', marginBottom: '40px', lineHeight: '1.6', fontFamily: 'var(--font-sinhala)', maxWidth: '700px' }}>
            විස්තීරණ ධර්ම ග්‍රන්ථ, අටුවා සහ දේශනා ඇතුළත් කේන්ද්‍රීය ඩිජිටල් සංරක්ෂිතය.
          </p>

          <div style={{ 
            width: '100%', 
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
            borderBottom: '1px solid rgba(0,0,0,0.1)',
            paddingBottom: '8px'
          }}>
            <Search size={22} color="var(--text-muted)" style={{ position: 'absolute', left: '0' }} />
            <input 
              type="text" 
              placeholder="ග්‍රන්ථයක් හෝ මූලාශ්‍රයක් සොයන්න..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: '100%',
                padding: '16px 20px 16px 40px',
                fontSize: '1.2rem',
                border: 'none',
                background: 'transparent',
                fontFamily: 'var(--font-sinhala)',
                color: 'var(--text-main)',
                outline: 'none',
              }}
            />
          </div>
        </div>

        {/* Academic Index List */}
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          {filteredResources.map((res) => (
            <div 
              key={res.id}
              onClick={() => navigate(`/library/${res.id}`)}
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr auto',
                alignItems: 'center',
                padding: '24px 0',
                borderBottom: '1px solid rgba(0,0,0,0.06)',
                cursor: 'pointer',
                transition: 'background 0.2s ease, padding-left 0.2s ease',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(0,0,0,0.01)'; e.currentTarget.style.paddingLeft = '12px'; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.paddingLeft = '0'; }}
            >
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <h3 style={{ fontSize: '1.4rem', color: 'var(--text-main)', fontFamily: 'var(--font-serif)', fontWeight: '700', margin: 0 }}>
                    {res.title}
                  </h3>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px', color: 'var(--text-muted)', fontSize: '0.9rem', fontFamily: 'var(--font-sinhala)' }}>
                  <span style={{ fontWeight: '600', letterSpacing: '0.05em', color: 'var(--primary)' }}>{res.category}</span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    {res.type === 'book' ? <Book size={14} /> : <Headphones size={14} />}
                    {res.type === 'book' ? 'Text' : 'Audio'}
                  </span>
                </div>
              </div>
              
              <div style={{ color: 'var(--text-muted)', display: 'flex', alignItems: 'center' }}>
                <ArrowRight size={20} />
              </div>
            </div>
          ))}
        </div>

        {filteredResources.length === 0 && (
          <div style={{ padding: '60px 0', color: 'var(--text-muted)', fontFamily: 'var(--font-sinhala)', fontSize: '1.1rem' }}>
            අදාළ ප්‍රතිඵල හමු නොවීය.
          </div>
        )}

      </div>
    </div>
  );
}
