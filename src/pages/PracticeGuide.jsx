import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, BookOpen, CheckCircle, Clock, Target, Shield, Heart } from 'lucide-react';
import { bodhiFactors } from '../data/bodhiFactors';

export default function PracticeGuide() {
  const { factorId, stepId } = useParams();
  const navigate = useNavigate();
  const [completed, setCompleted] = useState(false);

  const factor = bodhiFactors.find(f => f.id === parseInt(factorId));
  const step = factor?.items[parseInt(stepId)];

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [factorId, stepId]);

  if (!factor || !step) {
    return <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-main)', background: 'var(--bg-main)' }}>කාරණාව සොයාගත නොහැකි විය.</div>;
  }

  const isLastStep = parseInt(stepId) === factor.items.length - 1;
  const isFirstStep = parseInt(stepId) === 0;

  return (
    <div style={{ background: 'var(--bg-main)', minHeight: '100vh', padding: '120px 20px 60px' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        
        {/* Breadcrumb / Back Navigation */}
        <button 
          onClick={() => navigate('/path')} 
          style={{ background: 'none', border: 'none', color: 'var(--primary)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', padding: 0, marginBottom: '2rem', fontSize: '1rem', fontFamily: 'var(--font-sinhala)' }}
        >
          <ArrowLeft size={18} /> ආපසු මෙනුවට
        </button>

        {/* Header Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ background: 'var(--glass-bg)', border: '1px solid var(--glass-border)', borderRadius: '24px', padding: '40px', marginBottom: '32px', boxShadow: '0 20px 50px rgba(0,0,0,0.02)' }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
            <span style={{ background: 'rgba(140, 21, 21, 0.1)', color: 'var(--primary)', padding: '6px 16px', borderRadius: '20px', fontSize: '0.85rem', fontWeight: 700, letterSpacing: '0.1em' }}>
              පියවර 0{parseInt(stepId) + 1}
            </span>
            <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem', fontFamily: 'var(--font-sinhala)' }}>
              {factor.title}
            </span>
          </div>
          
          <h1 style={{ fontFamily: 'var(--font-sinhala)', fontSize: 'clamp(2rem, 4vw, 2.8rem)', color: 'var(--text-main)', fontWeight: 800, margin: '0 0 16px 0', lineHeight: 1.3 }}>
            {step.name}
          </h1>
          <p style={{ fontFamily: 'var(--font-sinhala)', fontSize: '1.2rem', color: 'var(--text-muted)', margin: 0, lineHeight: 1.6 }}>
            {step.desc}
          </p>
        </motion.div>

        {/* Detailed Guide Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          style={{ background: 'var(--bg-secondary)', border: '1px solid var(--glass-border)', borderRadius: '24px', padding: '40px', marginBottom: '40px' }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px', color: 'var(--primary)' }}>
            <BookOpen size={24} />
            <h2 style={{ fontFamily: 'var(--font-sinhala)', fontSize: '1.5rem', fontWeight: 700, margin: 0 }}>
              ප්‍රායෝගික පුහුණු මාර්ගෝපදේශය
            </h2>
          </div>
          
          <p style={{ fontFamily: 'var(--font-sinhala)', fontSize: '1.15rem', color: 'var(--text-main)', lineHeight: 2, opacity: 0.9 }}>
            {step.guide}
          </p>

          <div style={{ marginTop: '32px', background: 'rgba(140, 21, 21, 0.05)', borderLeft: '4px solid var(--primary)', padding: '24px', borderRadius: '0 16px 16px 0' }}>
            <h3 style={{ fontFamily: 'var(--font-sinhala)', fontSize: '1.2rem', color: 'var(--primary)', margin: '0 0 12px 0', fontWeight: 700 }}>දෛනික අභ්‍යාසය:</h3>
            <ul style={{ margin: 0, paddingLeft: '24px', color: 'var(--text-main)', fontFamily: 'var(--font-sinhala)', fontSize: '1.05rem', lineHeight: 1.8 }}>
              <li>අවම වශයෙන් දිනකට විනාඩි 15 ක් මෙම අභ්‍යාසය සඳහා වෙන් කරන්න.</li>
              <li>සෑම දිනකම නින්දට පෙර අද දින මෙම ධර්මතාවය ප්‍රගුණ කළේදැයි විමසා බලන්න.</li>
            </ul>
          </div>
        </motion.div>

        {/* Navigation & Completion */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', justifyContent: 'space-between', alignItems: 'center' }}>
          
          <label style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer', background: completed ? 'var(--primary)' : 'var(--bg-secondary)', padding: '16px 24px', borderRadius: '16px', border: completed ? '1px solid var(--primary)' : '1px solid var(--glass-border)', transition: 'all 0.3s', flex: 1, minWidth: '280px' }}>
            <input 
              type="checkbox" 
              checked={completed}
              onChange={(e) => setCompleted(e.target.checked)}
              style={{ width: '24px', height: '24px', accentColor: completed ? '#fff' : 'var(--primary)', cursor: 'pointer' }} 
            />
            <span style={{ fontSize: '1.1rem', fontWeight: 700, color: completed ? '#fff' : 'var(--text-main)', fontFamily: 'var(--font-sinhala)' }}>
              අද දින මෙම පුහුණුව සම්පූර්ණ කළෙමි
            </span>
          </label>

          <div style={{ display: 'flex', gap: '12px', flex: 1, justifyContent: 'flex-end', minWidth: '280px' }}>
            {!isFirstStep && (
              <Link to={`/practice/${factorId}/${parseInt(stepId) - 1}`} style={{ textDecoration: 'none', flex: 1 }}>
                <button style={{ width: '100%', padding: '16px', background: 'var(--bg-main)', border: '1px solid var(--glass-border)', borderRadius: '12px', color: 'var(--text-main)', fontFamily: 'var(--font-sinhala)', fontSize: '1.1rem', fontWeight: 600, cursor: 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px' }}>
                  ← පෙර පියවර
                </button>
              </Link>
            )}
            
            {!isLastStep ? (
              <Link to={`/practice/${factorId}/${parseInt(stepId) + 1}`} style={{ textDecoration: 'none', flex: 1 }}>
                <button style={{ width: '100%', padding: '16px', background: 'var(--primary)', border: 'none', borderRadius: '12px', color: '#fff', fontFamily: 'var(--font-sinhala)', fontSize: '1.1rem', fontWeight: 600, cursor: 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px' }}>
                  මීළඟ පියවර →
                </button>
              </Link>
            ) : (
              <Link to={`/path`} style={{ textDecoration: 'none', flex: 1 }}>
                <button style={{ width: '100%', padding: '16px', background: 'var(--primary)', border: 'none', borderRadius: '12px', color: '#fff', fontFamily: 'var(--font-sinhala)', fontSize: '1.1rem', fontWeight: 600, cursor: 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px' }}>
                  සම්පූර්ණයි ✓
                </button>
              </Link>
            )}
          </div>

        </div>

      </div>
    </div>
  );
}
