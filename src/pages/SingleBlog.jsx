import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import { getBlogBySlug } from '../services/blogService';
import { Calendar, User, ArrowLeft } from 'lucide-react';

export default function SingleBlog() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [blog, setBlog] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchBlog = async () => {
      setIsLoading(true);
      setError(false);
      const data = await getBlogBySlug(slug);
      if (data) {
        setBlog(data);
      } else {
        setError(true);
      }
      setIsLoading(false);
    };
    fetchBlog();
  }, [slug]);

  if (isLoading) {
    return (
      <div className="flex-center" style={{ minHeight: '80vh', background: 'var(--bg-main)' }}>
        <div style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-sinhala)', fontSize: '1.1rem' }}>ලිපිය සකසමින් පවතී... (Loading...)</div>
      </div>
    );
  }

  if (error || !blog) {
    return (
      <div className="flex-center" style={{ minHeight: '80vh', background: 'var(--bg-main)', flexDirection: 'column', gap: '20px' }}>
        <div style={{ color: 'var(--text-main)', fontFamily: 'var(--font-sinhala)', fontSize: '1.2rem' }}>සමාවෙන්න, අදාළ ලිපිය සොයාගත නොහැක.</div>
        <button 
          onClick={() => navigate('/life')}
          style={{ background: 'var(--primary)', color: '#fff', border: 'none', padding: '10px 24px', borderRadius: '8px', fontFamily: 'var(--font-sinhala)', cursor: 'pointer' }}
        >
          ආපසු යන්න
        </button>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', width: '100%', background: 'var(--bg-main)', padding: '100px 24px 60px' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        
        <Link to="/life" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', color: 'var(--text-muted)', textDecoration: 'none', fontFamily: 'var(--font-sinhala)', marginBottom: '2rem', transition: 'color 0.2s' }} onMouseEnter={(e) => e.currentTarget.style.color = 'var(--primary)'} onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-muted)'}>
          <ArrowLeft size={18} /> ආපසු ලිපි ගොනුවට
        </Link>

        {blog.cover && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            style={{ width: '100%', height: '400px', borderRadius: '24px', overflow: 'hidden', marginBottom: '3rem', boxShadow: '0 20px 40px rgba(0,0,0,0.1)' }}
          >
            <img src={blog.cover} alt={blog.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </motion.div>
        )}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <h1 style={{ fontFamily: 'var(--font-sinhala)', fontSize: 'clamp(2rem, 5vw, 3.5rem)', color: 'var(--text-main)', marginBottom: '1.5rem', lineHeight: 1.3 }}>
            {blog.title}
          </h1>

          <div style={{ display: 'flex', gap: '24px', marginBottom: '3rem', fontSize: '0.95rem', color: 'var(--text-muted)', paddingBottom: '2rem', borderBottom: '1px solid var(--glass-border)' }}>
            {blog.date && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Calendar size={16} /> <span>{blog.date}</span>
              </div>
            )}
            {blog.author && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <User size={16} /> <span style={{ fontFamily: 'var(--font-sinhala)' }}>{blog.author}</span>
              </div>
            )}
          </div>

          {/* Render Markdown Content */}
          <div className="blog-content" style={{ fontFamily: 'var(--font-sinhala)', fontSize: '1.2rem', lineHeight: 1.8, color: 'var(--text-main)' }}>
            <ReactMarkdown
              components={{
                h1: ({node, ...props}) => <h1 style={{ fontSize: '2.5rem', marginTop: '2.5rem', marginBottom: '1rem', color: 'var(--primary)' }} {...props} />,
                h2: ({node, ...props}) => <h2 style={{ fontSize: '2rem', marginTop: '2rem', marginBottom: '1rem', color: 'var(--primary)' }} {...props} />,
                h3: ({node, ...props}) => <h3 style={{ fontSize: '1.5rem', marginTop: '1.5rem', marginBottom: '1rem', color: 'var(--text-main)' }} {...props} />,
                p: ({node, ...props}) => <p style={{ marginBottom: '1.5rem' }} {...props} />,
                ul: ({node, ...props}) => <ul style={{ marginBottom: '1.5rem', paddingLeft: '2rem' }} {...props} />,
                ol: ({node, ...props}) => <ol style={{ marginBottom: '1.5rem', paddingLeft: '2rem' }} {...props} />,
                li: ({node, ...props}) => <li style={{ marginBottom: '0.5rem' }} {...props} />,
                blockquote: ({node, ...props}) => (
                  <blockquote style={{ borderLeft: '4px solid var(--primary)', paddingLeft: '1.5rem', margin: '2rem 0', fontStyle: 'italic', opacity: 0.8 }} {...props} />
                ),
                img: ({node, ...props}) => (
                  <img style={{ maxWidth: '100%', borderRadius: '12px', margin: '2rem 0' }} {...props} />
                ),
              }}
            >
              {blog.content}
            </ReactMarkdown>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
