import React, { useState } from 'react';

export default function OptimizedImage({ src, alt, style, className }) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  return (
    <div style={{ width: '100%', height: '100%', position: 'relative', overflow: 'hidden', ...style }} className={className}>
      {/* Skeleton / Placeholder Background */}
      {!isLoaded && !hasError && (
        <div 
          style={{ 
            position: 'absolute', 
            top: 0, left: 0, right: 0, bottom: 0, 
            background: 'linear-gradient(90deg, var(--glass-bg) 0%, rgba(200,200,200,0.1) 50%, var(--glass-bg) 100%)',
            backgroundSize: '200% 100%',
            animation: 'shimmer 1.5s infinite',
            zIndex: 1
          }} 
        />
      )}
      
      {/* Actual Image */}
      {!hasError ? (
        <img
          src={src}
          alt={alt || "Image"}
          loading="lazy"
          onLoad={() => setIsLoaded(true)}
          onError={() => setHasError(true)}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            opacity: isLoaded ? 1 : 0,
            transition: 'opacity 0.5s ease-in-out',
            position: 'absolute',
            top: 0,
            left: 0,
            zIndex: 2
          }}
        />
      ) : (
        <div className="flex-center" style={{ width: '100%', height: '100%', color: 'var(--text-muted)', fontSize: '0.9rem', background: 'var(--glass-bg)' }}>
          Image Error
        </div>
      )}
      
      <style>{`
        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
      `}</style>
    </div>
  );
}
