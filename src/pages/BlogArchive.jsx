import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { getBlogs } from '../services/blogService';
import { Calendar, User } from 'lucide-react';
import OptimizedImage from '../components/OptimizedImage';

export default function BlogArchive() {
  const [blogs, setBlogs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchBlogs = async () => {
      const data = await getBlogs();
      setBlogs(data);
      setIsLoading(false);
    };
    fetchBlogs();
  }, []);

  if (isLoading) {
    return (
      <div className="flex-center" style={{ minHeight: '80vh', background: 'var(--bg-main)' }}>
        <div style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-sinhala)', fontSize: '1.1rem' }}>ලිපි කියවමින් පවතී... (Loading...)</div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', width: '100%', background: 'var(--bg-main)', padding: '120px 24px 60px' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          style={{ textAlign: 'center', marginBottom: '4rem' }}
        >
          <div style={{ color: 'var(--gold-primary)', letterSpacing: '0.2em', fontSize: '0.9rem', textTransform: 'uppercase', marginBottom: '1rem', fontWeight: 600 }}>Kalyanamitta Blogs</div>
          <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(2.5rem, 6vw, 4.5rem)', color: 'var(--primary)', margin: 0 }}>ජීවිතයට ධර්මය</h1>
          <p style={{ fontFamily: 'var(--font-sinhala)', color: 'var(--text-muted)', fontSize: '1.2rem', marginTop: '1rem', maxWidth: '600px', margin: '1rem auto 0' }}>
            සදහම් දැනුමෙන් සිත සනසන, ජීවිතය සාර්ථක කරගන්නට මඟ පෙන්වන විශේෂාංග ලිපි එකතුව
          </p>
        </motion.div>

        {blogs.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '4rem', background: 'var(--glass-bg)', borderRadius: '24px', border: '1px solid var(--glass-border)' }}>
            <p style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-sinhala)' }}>දැනට ලිපි කිසිවක් පළ කර නොමැත.</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '2rem' }}>
            {blogs.map((blog, idx) => (
              <motion.div
                key={blog.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
              >
                <Link 
                  to={`/life/${blog.slug}`} 
                  style={{ textDecoration: 'none', color: 'inherit', display: 'block', height: '100%' }}
                >
                  <div style={{
                    background: 'var(--glass-bg)',
                    border: '1px solid var(--glass-border)',
                    borderRadius: '20px',
                    overflow: 'hidden',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-5px)';
                    e.currentTarget.style.boxShadow = '0 15px 30px rgba(0,0,0,0.08)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                  >
                  <div style={{ width: '100%', height: '220px', background: 'rgba(0,0,0,0.05)', position: 'relative', overflow: 'hidden' }}>
                      {blog.cover ? (
                        <OptimizedImage src={blog.cover} alt={blog.title} />
                      ) : (
                        <div className="flex-center" style={{ width: '100%', height: '100%', color: 'var(--text-muted)', fontFamily: 'var(--font-serif)' }}>No Image</div>
                      )}
                    </div>
                    
                    <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', flex: 1 }}>
                      <div style={{ display: 'flex', gap: '16px', marginBottom: '12px', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                        {blog.date && (
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <Calendar size={14} /> <span>{blog.date}</span>
                          </div>
                        )}
                        {blog.author && (
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <User size={14} /> <span>{blog.author}</span>
                          </div>
                        )}
                      </div>
                      
                      <h3 style={{ fontFamily: 'var(--font-sinhala)', fontSize: '1.4rem', color: 'var(--text-main)', marginBottom: '16px', lineHeight: 1.4 }}>
                        {blog.title}
                      </h3>
                      
                      <div style={{ marginTop: 'auto', color: 'var(--primary)', fontFamily: 'var(--font-sinhala)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px' }}>
                        ලිපිය කියවන්න <span style={{ fontSize: '1.2rem' }}>→</span>
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
