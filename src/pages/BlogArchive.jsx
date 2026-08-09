import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { getBlogs } from '../services/blogService';
import { Calendar, User, ArrowRight, BookOpen } from 'lucide-react';
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
      <div className="flex-center" style={{ minHeight: '100vh', background: 'var(--bg-main)' }}>
        <motion.div 
          animate={{ opacity: [0.5, 1, 0.5], scale: [0.98, 1.02, 0.98] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.5rem' }}
        >
          <BookOpen size={48} color="var(--gold-primary)" style={{ opacity: 0.8 }} />
          <div style={{ color: 'var(--gold-primary)', fontFamily: 'var(--font-sinhala)', fontSize: '1.2rem', letterSpacing: '0.1em' }}>සද්ධර්ම ග්‍රන්ථ විවෘත වෙමින් පවතී...</div>
        </motion.div>
      </div>
    );
  }

  const featuredBlog = blogs.length > 0 ? blogs[0] : null;
  const standardBlogs = blogs.length > 1 ? blogs.slice(1) : [];

  return (
    <div style={{ minHeight: '100vh', width: '100%', background: 'var(--bg-main)', paddingBottom: '100px', overflowX: 'hidden' }}>
      
      {/* Elite Cinematic Hero Section */}
      <section style={{ 
        position: 'relative', 
        padding: '180px 24px 80px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center'
      }}>
        <div style={{ 
          position: 'absolute', 
          top: 0, left: 0, right: 0, height: '100%', 
          background: 'radial-gradient(circle at 50% 0%, rgba(212,175,55,0.08) 0%, transparent 70%)',
          pointerEvents: 'none'
        }} />
        
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
          style={{ position: 'relative', zIndex: 2, maxWidth: '800px' }}
        >
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            style={{ 
              display: 'inline-flex', 
              alignItems: 'center', 
              gap: '12px',
              padding: '8px 20px', 
              background: 'rgba(212,175,55,0.1)', 
              border: '1px solid rgba(212,175,55,0.2)', 
              borderRadius: '100px',
              color: 'var(--gold-primary)', 
              letterSpacing: '0.2em', 
              fontSize: '0.8rem', 
              textTransform: 'uppercase', 
              marginBottom: '2rem', 
              fontWeight: 600 
            }}
          >
            <BookOpen size={14} /> Kalyanamitta Journal
          </motion.div>
          <h1 style={{ 
            fontFamily: 'var(--font-serif)', 
            fontSize: 'clamp(3rem, 8vw, 5.5rem)', 
            color: 'var(--primary)', 
            margin: 0,
            lineHeight: 1.1,
            textShadow: '0 10px 30px rgba(0,0,0,0.5)'
          }}>
            ජීවිතයට <span style={{ color: 'var(--gold-primary)', fontStyle: 'italic' }}>ධර්මය</span>
          </h1>
          <p style={{ 
            fontFamily: 'var(--font-sinhala)', 
            color: 'var(--text-muted)', 
            fontSize: 'clamp(1.1rem, 3vw, 1.3rem)', 
            marginTop: '1.5rem', 
            lineHeight: 1.6,
            fontWeight: 300
          }}>
            සදහම් දැනුමෙන් සිත සනසන, ජීවිතය සාර්ථක කරගන්නට මඟ පෙන්වන විශේෂාංග ලිපි එකතුව. නිවන් මඟට පියවර තබන්න.
          </p>
        </motion.div>
      </section>

      {/* Main Content Area */}
      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 24px' }}>
        {blogs.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            style={{ textAlign: 'center', padding: '6rem 2rem', background: 'var(--glass-bg)', borderRadius: '32px', border: '1px solid var(--glass-border)' }}
          >
            <BookOpen size={48} color="var(--text-muted)" style={{ opacity: 0.3, margin: '0 auto 1.5rem' }} />
            <p style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-sinhala)', fontSize: '1.2rem' }}>දැනට ලිපි කිසිවක් පළ කර නොමැත.</p>
          </motion.div>
        ) : (
          <div className="blog-grid-container">
            {/* Featured Article (Magazine Style) */}
            {featuredBlog && (
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.3 }}
                style={{ marginBottom: '4rem' }}
              >
                <Link to={`/life/${featuredBlog.slug}`} className="elite-featured-card">
                  <div className="elite-featured-image-wrapper">
                    {featuredBlog.cover ? (
                      <OptimizedImage src={featuredBlog.cover} alt={featuredBlog.title} className="elite-image" />
                    ) : (
                      <div className="elite-no-image flex-center">No Image</div>
                    )}
                    <div className="elite-image-overlay"></div>
                  </div>
                  
                  <div className="elite-featured-content">
                    <div className="elite-meta-tags">
                      <span className="elite-tag featured-tag">Featured</span>
                      {featuredBlog.date && (
                        <span className="elite-tag"><Calendar size={12} /> {featuredBlog.date}</span>
                      )}
                    </div>
                    
                    <h2 className="elite-featured-title">{featuredBlog.title}</h2>
                    
                    <div className="elite-featured-footer">
                      {featuredBlog.author && (
                        <div className="elite-author">
                          <User size={16} /> <span>{featuredBlog.author}</span>
                        </div>
                      )}
                      <div className="elite-read-more">
                        කියවන්න <ArrowRight size={18} className="arrow-icon" />
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            )}

            {/* Standard Articles Grid */}
            {standardBlogs.length > 0 && (
              <div className="elite-grid">
                {standardBlogs.map((blog, idx) => (
                  <motion.div
                    key={blog.id}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 + (idx * 0.1) }}
                  >
                    <Link to={`/life/${blog.slug}`} className="elite-card">
                      <div className="elite-card-image-wrapper">
                        {blog.cover ? (
                          <OptimizedImage src={blog.cover} alt={blog.title} className="elite-image" />
                        ) : (
                          <div className="elite-no-image flex-center">No Image</div>
                        )}
                      </div>
                      
                      <div className="elite-card-content">
                        <div className="elite-meta-tags small">
                          {blog.date && (
                            <span className="elite-tag"><Calendar size={12} /> {blog.date}</span>
                          )}
                        </div>
                        
                        <h3 className="elite-card-title">{blog.title}</h3>
                        
                        <div className="elite-card-footer">
                          {blog.author && (
                            <div className="elite-author small">
                              <User size={14} /> <span>{blog.author}</span>
                            </div>
                          )}
                          <div className="elite-read-more small">
                            කියවන්න <ArrowRight size={16} className="arrow-icon" />
                          </div>
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      <style>{`
        /* Elite Blog UI Styles */
        .elite-featured-card {
          display: grid;
          grid-template-columns: 1.2fr 1fr;
          background: rgba(20, 20, 22, 0.6);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.05);
          border-radius: 32px;
          overflow: hidden;
          text-decoration: none;
          color: inherit;
          min-height: 500px;
          transition: all 0.5s cubic-bezier(0.22, 1, 0.36, 1);
          box-shadow: 0 30px 60px rgba(0,0,0,0.2);
        }

        .elite-featured-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 40px 80px rgba(0,0,0,0.4), 0 0 0 1px rgba(212,175,55,0.3);
        }

        .elite-featured-image-wrapper {
          position: relative;
          overflow: hidden;
          height: 100%;
          min-height: 400px;
        }

        .elite-image {
          transition: transform 0.8s cubic-bezier(0.22, 1, 0.36, 1) !important;
        }

        .elite-featured-card:hover .elite-image,
        .elite-card:hover .elite-image {
          transform: scale(1.05) !important;
        }

        .elite-image-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(to right, transparent, rgba(20,20,22,0.8));
          pointer-events: none;
        }

        .elite-featured-content {
          padding: 60px 50px;
          display: flex;
          flex-direction: column;
          justify-content: center;
          position: relative;
        }

        .elite-meta-tags {
          display: flex;
          align-items: center;
          flex-wrap: wrap;
          gap: 12px;
          margin-bottom: 24px;
        }

        .elite-tag {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 6px 14px;
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 100px;
          font-size: 0.8rem;
          color: var(--text-muted);
          font-family: var(--font-sans);
          letter-spacing: 0.05em;
        }

        .elite-tag.featured-tag {
          background: rgba(212,175,55,0.15);
          color: var(--gold-primary);
          border-color: rgba(212,175,55,0.3);
          font-weight: 600;
          text-transform: uppercase;
        }

        .elite-featured-title {
          font-family: var(--font-sinhala);
          font-size: clamp(2rem, 4vw, 3rem);
          color: var(--text-main);
          line-height: 1.3;
          margin: 0 0 40px 0;
          font-weight: 500;
        }

        .elite-featured-footer {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-top: auto;
          border-top: 1px solid rgba(255,255,255,0.05);
          padding-top: 24px;
        }

        .elite-author {
          display: flex;
          align-items: center;
          gap: 10px;
          color: var(--text-main);
          font-family: var(--font-sinhala);
          font-size: 1.1rem;
        }

        .elite-read-more {
          display: flex;
          align-items: center;
          gap: 8px;
          color: var(--gold-primary);
          font-family: var(--font-sinhala);
          font-size: 1.2rem;
          font-weight: 600;
          transition: gap 0.3s ease;
        }

        .elite-featured-card:hover .elite-read-more,
        .elite-card:hover .elite-read-more {
          gap: 14px;
        }

        .arrow-icon {
          transition: transform 0.3s ease;
        }

        .elite-featured-card:hover .arrow-icon,
        .elite-card:hover .arrow-icon {
          transform: translateX(4px);
        }

        .elite-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
          gap: 2.5rem;
        }

        .elite-card {
          display: flex;
          flex-direction: column;
          background: rgba(20, 20, 22, 0.4);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.05);
          border-radius: 24px;
          overflow: hidden;
          text-decoration: none;
          color: inherit;
          height: 100%;
          transition: all 0.4s cubic-bezier(0.22, 1, 0.36, 1);
        }

        .elite-card:hover {
          transform: translateY(-6px);
          background: rgba(30, 30, 35, 0.6);
          border-color: rgba(212,175,55,0.2);
          box-shadow: 0 20px 40px rgba(0,0,0,0.3);
        }

        .elite-card-image-wrapper {
          width: 100%;
          height: 250px;
          position: relative;
          overflow: hidden;
          background: rgba(0,0,0,0.2);
        }

        .elite-card-content {
          padding: 30px;
          display: flex;
          flex-direction: column;
          flex: 1;
        }

        .elite-card-title {
          font-family: var(--font-sinhala);
          font-size: 1.5rem;
          color: var(--text-main);
          line-height: 1.4;
          margin: 0 0 24px 0;
          font-weight: 500;
        }

        .elite-card-footer {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-top: auto;
          border-top: 1px solid rgba(255,255,255,0.05);
          padding-top: 20px;
        }

        .elite-author.small {
          font-size: 0.95rem;
          color: var(--text-muted);
        }

        .elite-read-more.small {
          font-size: 1rem;
        }

        .elite-no-image {
          width: 100%;
          height: 100%;
          color: var(--text-muted);
          font-family: var(--font-serif);
          font-style: italic;
          background: linear-gradient(135deg, rgba(20,20,22,1) 0%, rgba(30,30,35,1) 100%);
        }

        /* Responsive */
        @media (max-width: 992px) {
          .elite-featured-card {
            grid-template-columns: 1fr;
            min-height: auto;
          }
          .elite-image-overlay {
            background: linear-gradient(to top, rgba(20,20,22,1), transparent);
          }
          .elite-featured-content {
            padding: 40px 30px;
          }
          .elite-featured-title {
            font-size: 2.2rem;
          }
        }

        @media (max-width: 600px) {
          .elite-grid {
            grid-template-columns: 1fr;
          }
          .elite-featured-image-wrapper {
            height: 250px;
            min-height: 250px;
          }
          .elite-featured-title {
            font-size: 1.8rem;
          }
        }
      `}</style>
    </div>
  );
}
