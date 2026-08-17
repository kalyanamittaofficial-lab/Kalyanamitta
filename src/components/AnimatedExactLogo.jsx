import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

export default function AnimatedExactLogo({ className, style }) {
  const [svgData, setSvgData] = useState({ paths: [], viewBox: '0 0 500 500', width: 500, height: 500 });

  useEffect(() => {
    fetch('/kalyanamitta-logo.svg')
      .then(res => res.text())
      .then(text => {
        const parser = new DOMParser();
        const doc = parser.parseFromString(text, 'image/svg+xml');
        const svgEl = doc.querySelector('svg');
        const pathElements = Array.from(doc.querySelectorAll('path'));
        
        const viewBox = svgEl?.getAttribute('viewBox') || `0 0 ${svgEl?.getAttribute('width') || 500} ${svgEl?.getAttribute('height') || 500}`;
        const width = svgEl?.getAttribute('width') || 500;
        const height = svgEl?.getAttribute('height') || 500;

        const extracted = pathElements.map(p => ({
          d: p.getAttribute('d'),
          fill: p.getAttribute('fill') || 'currentColor',
          transform: p.getAttribute('transform') || ''
        }));
        
        setSvgData({ paths: extracted, viewBox, width, height });
      })
      .catch(err => console.error('Failed to load SVG:', err));
  }, []);

  if (svgData.paths.length === 0) {
    return <div style={{ width: '180px', height: '180px', ...style }} className={className} />;
  }

  const draw = {
    hidden: { pathLength: 0, fillOpacity: 0, opacity: 0 },
    visible: (i) => {
      // Stagger the drawing of paths to make it look organic
      const delay = i * (1.5 / Math.max(svgData.paths.length, 1)); 
      return {
        pathLength: 1,
        opacity: 1,
        transition: {
          pathLength: { delay, type: "tween", duration: 3, ease: "easeInOut" },
          opacity: { delay, duration: 0.1 }
        }
      };
    },
    fillIn: (i) => {
      const delay = 3 + (i * (1 / Math.max(svgData.paths.length, 1)));
      return {
        fillOpacity: 1,
        transition: { delay, duration: 1.5, ease: "easeIn" }
      }
    }
  };

  return (
    <motion.svg
      width="180px"
      height="180px"
      viewBox={svgData.viewBox}
      className={className}
      style={{ overflow: 'visible', ...style }}
      initial="hidden"
      animate={["visible", "fillIn"]}
    >
      {svgData.paths.map((p, i) => (
        <motion.path
          key={i}
          d={p.d}
          transform={p.transform}
          fill={p.fill}
          stroke="var(--gold-primary)"
          strokeWidth="0.5"
          custom={i}
          variants={draw}
          style={{ transformOrigin: 'center' }}
        />
      ))}
    </motion.svg>
  );
}
