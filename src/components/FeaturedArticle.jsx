import React, { useEffect, useState } from 'react';
import { BookOpen, ArrowRight, Calendar, User } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { getBlogs } from '../services/blogService';
import OptimizedImage from './OptimizedImage';

export default function FeaturedArticle() {
  const [blogs, setBlogs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchBlogs = async () => {
      const data = await getBlogs();
      // Only take the first 5 for featured
      setBlogs(data.slice(0, 5));
      setIsLoading(false);
    };
    fetchBlogs();
  }, []);

  return (
    <div className="mobile-padding" style={{ padding: '0 48px', marginTop: '100px', width: '100%', maxWidth: '1400px', margin: '100px auto 0 auto' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '40px' }}>
        <h3 style={{ fontSize: '2rem', color: 'var(--primary)', fontWeight: '700', fontFamily: 'var(--font-serif)' }}>විශේෂාංග ලිපි</h3>
        <div style={{ flexGrow: 1, height: '1px', background: 'var(--glass-border)' }}></div>
        <Link to="/life" style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--primary)', textDecoration: 'none', fontFamily: 'var(--font-sinhala)', fontWeight: 600 }}>
          සියල්ල බලන්න <ArrowRight size={18} />
        </Link>
      </div>
      
      {isLoading ? (
        <div className="flex-center" style={{ minHeight: '200px' }}>
          <div style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-sinhala)' }}>ලිපි සොයමින් පවතී...</div>
        </div>
      ) : blogs.length === 0 ? (
        <div style={{ width: '100%', background: 'var(--bg-secondary)', border: '1px solid rgba(0,0,0,0.05)', borderRadius: '4px', padding: '80px 24px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', boxShadow: '0 10px 30px rgba(0,0,0,0.02)' }}>
          <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'rgba(140, 21, 21, 0.05)', border: '1px solid rgba(140, 21, 21, 0.1)', display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: '24px' }}>
            <BookOpen size={40} color="var(--primary)" />
          </div>
          <h4 style={{ color: 'var(--text-main)', fontSize: '1.6rem', marginBottom: '12px', fontFamily: 'var(--font-serif)', fontWeight: '700' }}>ඉදිරියේදී බලාපොරොත්තු වන්න</h4>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.05rem', maxWidth: '400px', lineHeight: '1.6', fontFamily: 'var(--font-sinhala)' }}>ධර්ම ලිපි සහ විශේෂාංග ඉතා ඉක්මනින් මෙහි පළ කරනු ලැබේ.</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '2rem' }}>
          {blogs.map((blog, idx) => (
            <motion.div
              key={blog.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
            >
              <Link 
                to={`/life/${blog.slug}`} 
                style={{ textDecoration: 'none', color: 'inherit', display: 'block', height: '100%' }}
              >
                <div style={{
                  background: 'var(--glass-bg)', border: '1px solid var(--glass-border)', borderRadius: '16px', overflow: 'hidden', height: '100%', display: 'flex', flexDirection: 'column', transition: 'all 0.3s ease',
                }}
                onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 10px 25px rgba(0,0,0,0.05)'; e.currentTarget.style.borderColor = 'var(--primary)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.borderColor = 'var(--glass-border)'; }}
                >
                  <div style={{ width: '100%', height: '180px', background: 'rgba(0,0,0,0.03)', position: 'relative', overflow: 'hidden' }}>
                    {blog.cover ? (
                      <OptimizedImage src={blog.cover} alt={blog.title} />
                    ) : (
                      <div className="flex-center" style={{ width: '100%', height: '100%', color: 'var(--text-muted)', fontSize: '0.9rem' }}>No Cover</div>
                    )}
                  </div>
                  
                  <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', flex: 1 }}>
                    <div style={{ display: 'flex', gap: '12px', marginBottom: '8px', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                      {blog.date && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <Calendar size={12} /> <span>{blog.date}</span>
                        </div>
                      )}
                      {blog.author && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <User size={12} /> <span>{blog.author}</span>
                        </div>
                      )}
                    </div>
                    
                    <h3 style={{ fontFamily: 'var(--font-sinhala)', fontSize: '1.2rem', color: 'var(--text-main)', marginBottom: '12px', lineHeight: 1.4 }}>
                      {blog.title}
                    </h3>
                    
                    <div style={{ marginTop: 'auto', color: 'var(--primary)', fontFamily: 'var(--font-sinhala)', fontWeight: 600, fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      කියවන්න <ArrowRight size={14} />
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
