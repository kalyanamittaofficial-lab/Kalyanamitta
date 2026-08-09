import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { getBlogs } from '../services/blogService';
import { Calendar, User, Search, ArrowRight, ArrowDownAZ, ArrowUpZA } from 'lucide-react';
import OptimizedImage from '../components/OptimizedImage';

export default function BlogArchive() {
  const [blogs, setBlogs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOrder, setSortOrder] = useState('newest'); // 'newest' | 'oldest'

  useEffect(() => {
    const fetchBlogs = async () => {
      const data = await getBlogs();
      setBlogs(data);
      setIsLoading(false);
    };
    fetchBlogs();
  }, []);

  // Filter and Sort Logic
  const filteredAndSortedBlogs = blogs
    .filter(blog => 
      blog.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
      (blog.author && blog.author.toLowerCase().includes(searchQuery.toLowerCase()))
    )
    .sort((a, b) => {
      const dateA = new Date(a.date || 0).getTime();
      const dateB = new Date(b.date || 0).getTime();
      if (sortOrder === 'newest') return dateB - dateA;
      if (sortOrder === 'oldest') return dateA - dateB;
      return 0;
    });

  if (isLoading) {
    return (
      <div className="flex-center" style={{ minHeight: '100vh', background: 'var(--bg-main)' }}>
        <div style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-sinhala)', fontSize: '1rem', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
          Loading Archive...
        </div>
      </div>
    );
  }

  return (
    <div className="academic-archive-page">
      <div className="academic-container">
        
        {/* Header Section */}
        <header className="academic-header">
          <div className="academic-header-content">
            <h1 className="academic-title">ජීවිතයට ධර්මය</h1>
            <p className="academic-subtitle">
              The Kalyanamitta Journal of Buddhist Philosophy and Practice.
            </p>
          </div>
        </header>

        {/* Toolbar: Search and Sort */}
        <div className="academic-toolbar">
          <div className="academic-search-wrapper">
            <Search size={18} className="academic-search-icon" />
            <input 
              type="text" 
              className="academic-search-input" 
              placeholder="Search by title or author..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="academic-sort-wrapper">
            <label className="academic-sort-label">Sort by:</label>
            <button 
              className={`academic-sort-btn ${sortOrder === 'newest' ? 'active' : ''}`}
              onClick={() => setSortOrder('newest')}
              title="Newest First"
            >
              <ArrowDownAZ size={16} /> Newest
            </button>
            <button 
              className={`academic-sort-btn ${sortOrder === 'oldest' ? 'active' : ''}`}
              onClick={() => setSortOrder('oldest')}
              title="Oldest First"
            >
              <ArrowUpZA size={16} /> Oldest
            </button>
          </div>
        </div>

        {/* Main Content Area */}
        <main className="academic-main">
          {filteredAndSortedBlogs.length === 0 ? (
            <div className="academic-empty-state">
              <p>No articles found matching your criteria.</p>
              <button className="academic-reset-btn" onClick={() => setSearchQuery('')}>Clear Search</button>
            </div>
          ) : (
            <div className="academic-grid">
              {filteredAndSortedBlogs.map((blog, idx) => (
                <motion.article
                  key={blog.id}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: idx * 0.05 }}
                  className="academic-card"
                >
                  <Link to={`/life/${blog.slug}`} className="academic-card-link">
                    <div className="academic-card-image">
                      {blog.cover ? (
                        <OptimizedImage src={blog.cover} alt={blog.title} className="academic-img" />
                      ) : (
                        <div className="academic-no-image flex-center">No Image Available</div>
                      )}
                    </div>
                    
                    <div className="academic-card-content">
                      <div className="academic-meta">
                        {blog.date && (
                          <span className="academic-meta-item">
                            {new Date(blog.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                          </span>
                        )}
                        {blog.date && blog.author && <span className="academic-meta-divider">•</span>}
                        {blog.author && (
                          <span className="academic-meta-item author">{blog.author}</span>
                        )}
                      </div>
                      
                      <h2 className="academic-card-title">{blog.title}</h2>
                      
                      <div className="academic-read-more">
                        Read Article <ArrowRight size={14} className="academic-arrow" />
                      </div>
                    </div>
                  </Link>
                </motion.article>
              ))}
            </div>
          )}
        </main>

      </div>

      <style>{`
        /* Elite Academic UI Styles */
        .academic-archive-page {
          min-height: 100vh;
          width: 100%;
          background-color: var(--bg-main);
          padding: 140px 24px 100px;
          color: var(--text-main);
        }

        .academic-container {
          max-width: 1100px;
          margin: 0 auto;
        }

        .academic-header {
          margin-bottom: 3rem;
          border-bottom: 2px solid var(--text-main);
          padding-bottom: 2rem;
        }

        .academic-title {
          font-family: var(--font-serif);
          font-size: clamp(2.5rem, 5vw, 4rem);
          font-weight: 700;
          color: var(--text-main);
          margin: 0 0 1rem 0;
          line-height: 1.1;
          letter-spacing: -0.02em;
        }

        .academic-subtitle {
          font-family: var(--font-sans);
          font-size: 1.1rem;
          color: var(--text-muted);
          margin: 0;
          font-weight: 400;
          letter-spacing: 0.02em;
        }

        .academic-toolbar {
          display: flex;
          flex-wrap: wrap;
          justify-content: space-between;
          align-items: center;
          gap: 1.5rem;
          margin-bottom: 3rem;
        }

        .academic-search-wrapper {
          position: relative;
          flex: 1;
          min-width: 250px;
          max-width: 400px;
        }

        .academic-search-icon {
          position: absolute;
          left: 14px;
          top: 50%;
          transform: translateY(-50%);
          color: var(--text-muted);
        }

        .academic-search-input {
          width: 100%;
          padding: 12px 16px 12px 42px;
          background: transparent;
          border: 1px solid var(--glass-border);
          border-radius: 4px;
          color: var(--text-main);
          font-family: var(--font-sans);
          font-size: 0.95rem;
          transition: border-color 0.2s ease;
        }

        .academic-search-input:focus {
          outline: none;
          border-color: var(--text-main);
        }

        .academic-sort-wrapper {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .academic-sort-label {
          font-family: var(--font-sans);
          font-size: 0.85rem;
          color: var(--text-muted);
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .academic-sort-btn {
          display: flex;
          align-items: center;
          gap: 6px;
          background: transparent;
          border: 1px solid transparent;
          padding: 6px 12px;
          border-radius: 4px;
          color: var(--text-muted);
          font-family: var(--font-sans);
          font-size: 0.9rem;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .academic-sort-btn:hover {
          color: var(--text-main);
        }

        .academic-sort-btn.active {
          border-color: var(--text-main);
          color: var(--text-main);
          background: rgba(128, 128, 128, 0.05);
        }

        .academic-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
          gap: 3rem 2rem;
        }

        .academic-card {
          border: 1px solid var(--glass-border);
          border-radius: 4px;
          background: transparent;
          transition: border-color 0.3s ease;
        }

        .academic-card:hover {
          border-color: var(--text-muted);
        }

        .academic-card-link {
          text-decoration: none;
          color: inherit;
          display: flex;
          flex-direction: column;
          height: 100%;
        }

        .academic-card-image {
          width: 100%;
          height: 200px;
          border-bottom: 1px solid var(--glass-border);
          overflow: hidden;
          background: rgba(128,128,128,0.05);
        }

        .academic-img {
          transition: transform 0.5s ease !important;
        }

        .academic-card:hover .academic-img {
          transform: scale(1.02) !important;
        }

        .academic-no-image {
          width: 100%;
          height: 100%;
          color: var(--text-muted);
          font-family: var(--font-serif);
          font-style: italic;
          font-size: 0.9rem;
        }

        .academic-card-content {
          padding: 24px;
          display: flex;
          flex-direction: column;
          flex: 1;
        }

        .academic-meta {
          display: flex;
          align-items: center;
          flex-wrap: wrap;
          gap: 8px;
          margin-bottom: 12px;
          font-family: var(--font-sans);
          font-size: 0.75rem;
          color: var(--text-muted);
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .academic-meta-divider {
          opacity: 0.5;
        }

        .academic-meta-item.author {
          font-weight: 600;
          color: var(--text-main);
        }

        .academic-card-title {
          font-family: var(--font-sinhala);
          font-size: 1.4rem;
          font-weight: 600;
          color: var(--text-main);
          line-height: 1.4;
          margin: 0 0 20px 0;
        }

        .academic-read-more {
          margin-top: auto;
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-family: var(--font-sans);
          font-size: 0.85rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          color: var(--text-main);
          transition: gap 0.2s ease;
        }

        .academic-arrow {
          transition: transform 0.2s ease;
        }

        .academic-card:hover .academic-arrow {
          transform: translateX(4px);
        }

        .academic-empty-state {
          text-align: center;
          padding: 4rem 2rem;
          border: 1px dashed var(--text-muted);
          border-radius: 4px;
        }

        .academic-empty-state p {
          font-family: var(--font-sans);
          color: var(--text-muted);
          margin-bottom: 1.5rem;
        }

        .academic-reset-btn {
          background: var(--text-main);
          color: var(--bg-main);
          border: none;
          padding: 10px 20px;
          border-radius: 4px;
          font-family: var(--font-sans);
          font-weight: 600;
          cursor: pointer;
          transition: opacity 0.2s ease;
        }

        .academic-reset-btn:hover {
          opacity: 0.9;
        }

        /* Responsive */
        @media (max-width: 768px) {
          .academic-title {
            font-size: 2.2rem;
          }
          .academic-toolbar {
            flex-direction: column;
            align-items: flex-start;
          }
          .academic-search-wrapper {
            max-width: 100%;
            width: 100%;
          }
          .academic-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
}
