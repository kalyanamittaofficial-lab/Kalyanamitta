import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '../utils/supabase';

export default function Register() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState(1);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Form State
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    mobile: '',
    country: 'Sri Lanka',
    otherCountry: '',
    state: '',
    language: 'Sinhala',
    dob: '',
    maritalStatus: '',
    familyDetails: '',
    education: '',
    interest: 50,
    currentDedication: 50,
    potentialDedication: 50
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleNext = (e) => {
    e.preventDefault();
    if (!formData.email || !formData.password || !formData.name || !formData.mobile || !formData.state || !formData.dob || !formData.maritalStatus || !formData.education) {
      setError('Please fill in all mandatory fields.');
      return;
    }
    if (formData.country === 'Other' && !formData.otherCountry) {
      setError('Please specify your country.');
      return;
    }
    setError('');
    setStep(2);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const { data, error: signUpError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            full_name: formData.name,
            mobile: formData.mobile,
            country: formData.country === 'Other' ? formData.otherCountry : formData.country,
            state: formData.state,
            language: formData.language,
            dob: formData.dob,
            maritalStatus: formData.maritalStatus,
            familyDetails: formData.familyDetails,
            education: formData.education,
            interest: parseInt(formData.interest),
            currentDedication: parseInt(formData.currentDedication),
            potentialDedication: parseInt(formData.potentialDedication)
          }
        }
      });

      if (signUpError) throw signUpError;
      
      // If email confirmation is required, there won't be a session.
      if (data.session) {
        navigate('/dashboard');
      } else {
        setSuccess('ගිණුම සෑදීම සාර්ථකයි! කරුණාකර ඔබගේ විද්‍යුත් තැපෑල (Email) පරීක්ෂා කර ගිණුම සක්‍රිය කරන්න.');
      }
    } catch (err) {
      setError(err.message || 'An error occurred during registration.');
    } finally {
      setIsLoading(false);
    }
  };

  // Input styles (academic, minimalist)
  const getInputStyle = (isFocused) => ({
    width: '100%',
    padding: '16px 0',
    backgroundColor: 'transparent',
    border: 'none',
    borderBottom: `2px solid ${isFocused ? '#8b1818' : '#e5e7eb'}`,
    color: '#111827',
    fontSize: '1rem',
    fontFamily: 'var(--font-sinhala), sans-serif',
    outline: 'none',
    transition: 'border-color 0.3s ease',
    marginBottom: '8px' // Reduced margin for cleaner look
  });

  const getSelectStyle = () => ({
    ...getInputStyle(false),
    cursor: 'pointer'
  });

  const labelStyle = { display: 'block', fontSize: '0.85rem', color: '#6b7280', fontWeight: '500', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.05em' };

  // Inline styling for the split-screen layout
  const containerStyle = {
    display: 'flex',
    minHeight: '100vh',
    width: '100vw',
    backgroundColor: '#ffffff'
  };

  const leftPaneStyle = {
    flex: '1',
    backgroundColor: '#8b1818', // Deep Crimson / Burgundy
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    padding: '60px',
    color: '#ffffff',
    position: 'relative',
    overflow: 'hidden'
  };

  const rightPaneStyle = {
    flex: '1',
    display: 'flex',
    flexDirection: 'column',
    padding: '60px 40px',
    backgroundColor: '#ffffff',
    overflowY: 'auto'
  };

  const formContainerStyle = {
    width: '100%',
    maxWidth: '520px',
    margin: '0 auto'
  };

  const [focusedInput, setFocusedInput] = useState(null);

  if (success) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#ffffff', padding: '24px' }}>
        <div style={{ textAlign: 'center', maxWidth: '400px' }}>
          <h2 style={{ color: '#166534', marginBottom: '16px', fontFamily: 'var(--font-sinhala)', fontSize: '2rem' }}>සාර්ථකයි!</h2>
          <p style={{ color: '#6b7280', fontFamily: 'var(--font-sinhala)', lineHeight: '1.6', marginBottom: '32px', fontSize: '1.1rem' }}>{success}</p>
          <button onClick={() => navigate('/login')} style={{ width: '100%', padding: '16px', backgroundColor: '#8b1818', color: '#ffffff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '600', fontSize: '1.05rem', fontFamily: 'var(--font-sinhala)' }}>
            Login පිටුවට යන්න
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={containerStyle} className="auth-container">
      {/* CSS for responsiveness */}
      <style>
        {`
          @media (max-width: 900px) {
            .auth-container {
              flex-direction: column !important;
            }
            .left-pane {
              flex: none !important;
              padding: 40px 24px !important;
              min-height: 200px !important;
              justify-content: flex-end !important;
            }
            .right-pane {
              padding: 40px 24px !important;
            }
            .quote-text {
              font-size: 1.5rem !important;
            }
          }
          /* Custom range slider */
          input[type=range] {
            -webkit-appearance: none;
            width: 100%;
            background: transparent;
            margin-top: 12px;
          }
          input[type=range]::-webkit-slider-thumb {
            -webkit-appearance: none;
            height: 20px;
            width: 20px;
            border-radius: 50%;
            background: #8b1818;
            cursor: pointer;
            margin-top: -8px;
            box-shadow: 0 2px 6px rgba(139,24,24,0.4);
          }
          input[type=range]::-webkit-slider-runnable-track {
            width: 100%;
            height: 4px;
            cursor: pointer;
            background: #e5e7eb;
            border-radius: 2px;
          }
        `}
      </style>

      {/* LEFT PANE (Branding) */}
      <div style={leftPaneStyle} className="left-pane">
        <div style={{ zIndex: 2, position: 'relative' }}>
          <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '2.5rem', fontWeight: '700', marginBottom: '8px', letterSpacing: '-0.02em' }}>
            Kalyanamitta
          </h1>
          <p style={{ fontFamily: 'var(--font-sinhala)', fontSize: '1.1rem', opacity: 0.8, marginBottom: '60px' }}>
            කල්‍යාණමිත්ත පුස්තකාලය
          </p>
          
          <blockquote style={{ borderLeft: '3px solid rgba(255,255,255,0.3)', paddingLeft: '24px', margin: 0 }}>
            <p className="quote-text" style={{ fontFamily: 'var(--font-sinhala)', fontSize: '1.75rem', lineHeight: 1.4, fontWeight: '300', marginBottom: '16px' }}>
              "සියලු පව් නොකිරීමද කුසල් දහම්හි යෙදීමද සිත දමනය කිරීමද යන මෙය බුදුවරුන්ගේ අනුශාසනයයි."
            </p>
            <footer style={{ fontFamily: 'var(--font-sinhala)', opacity: 0.7, fontSize: '1rem' }}>
              — ධම්ම පදය
            </footer>
          </blockquote>
        </div>
      </div>

      {/* RIGHT PANE (Form) */}
      <div style={rightPaneStyle} className="right-pane">
        <div style={formContainerStyle}>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
            <h2 style={{ fontSize: '2rem', color: '#111827', fontFamily: 'var(--font-serif)', fontWeight: '700', margin: 0 }}>
              Create Account
            </h2>
            <Link to="/login" style={{ color: '#8b1818', fontWeight: '600', textDecoration: 'none', fontFamily: 'var(--font-sinhala)' }}>
              ඇතුල් වන්න
            </Link>
          </div>

          {error && (
            <div style={{ padding: '16px', backgroundColor: '#fef2f2', color: '#991b1b', borderRadius: '8px', marginBottom: '32px', fontSize: '0.9rem', border: '1px solid #fecaca' }}>
              {error}
            </div>
          )}

          {step === 1 ? (
            <form onSubmit={handleNext} style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
              <div style={{ marginBottom: '8px' }}>
                <h3 style={{ fontSize: '1.2rem', fontWeight: '600', color: '#374151', margin: '0 0 8px 0' }}>Step 1: Account Details</h3>
                <div style={{ height: '2px', backgroundColor: '#e5e7eb', width: '100%' }}><div style={{ height: '2px', backgroundColor: '#8b1818', width: '50%' }}></div></div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                <div>
                  <label style={labelStyle}>Email Address *</label>
                  <input type="email" name="email" value={formData.email} onChange={handleChange} required style={getInputStyle(focusedInput === 'email')} placeholder="name@example.com" onFocus={() => setFocusedInput('email')} onBlur={() => setFocusedInput(null)} />
                </div>
                <div>
                  <label style={labelStyle}>Password *</label>
                  <input type="password" name="password" value={formData.password} onChange={handleChange} required style={getInputStyle(focusedInput === 'password')} minLength="6" placeholder="අකුරු 6 කට වඩා ලබාදෙන්න" onFocus={() => setFocusedInput('password')} onBlur={() => setFocusedInput(null)} />
                  {focusedInput === 'password' && (
                    <span style={{ fontSize: '0.75rem', color: '#8b1818', marginTop: '4px', display: 'block', animation: 'fadeIn 0.3s' }}>
                      * ඉලක්කම් සහ අකුරු මිශ්‍ර කර ශක්තිමත් මුරපදයක් (Strong Password) ලබා දෙන්න.
                    </span>
                  )}
                </div>
              </div>

              <div>
                <label style={labelStyle}>Full Name (English) *</label>
                <input type="text" name="name" value={formData.name} onChange={handleChange} required style={getInputStyle(focusedInput === 'name')} placeholder="e.g. Nimal Perera" onFocus={() => setFocusedInput('name')} onBlur={() => setFocusedInput(null)} />
              </div>

              <div>
                <label style={labelStyle}>Mobile Number *</label>
                <input type="tel" name="mobile" value={formData.mobile} onChange={handleChange} required style={getInputStyle(focusedInput === 'mobile')} placeholder="+947XXXXXXXX" onFocus={() => setFocusedInput('mobile')} onBlur={() => setFocusedInput(null)} />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                <div>
                  <label style={labelStyle}>Country *</label>
                  <select name="country" value={formData.country} onChange={handleChange} style={getSelectStyle()}>
                    <option value="Sri Lanka">Sri Lanka</option>
                    <option value="Australia">Australia</option>
                    <option value="UK">United Kingdom</option>
                    <option value="USA">United States</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div>
                  <label style={labelStyle}>State / District *</label>
                  <input type="text" name="state" value={formData.state} onChange={handleChange} required style={getInputStyle(focusedInput === 'state')} placeholder="e.g. Colombo" onFocus={() => setFocusedInput('state')} onBlur={() => setFocusedInput(null)} />
                </div>
              </div>

              {formData.country === 'Other' && (
                <div style={{ marginTop: '-12px' }}>
                  <label style={labelStyle}>Specify Your Country *</label>
                  <input type="text" name="otherCountry" value={formData.otherCountry} onChange={handleChange} required style={getInputStyle(focusedInput === 'otherCountry')} placeholder="e.g. Canada" onFocus={() => setFocusedInput('otherCountry')} onBlur={() => setFocusedInput(null)} />
                </div>
              )}

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                <div>
                  <label style={labelStyle}>Native Language</label>
                  <select name="language" value={formData.language} onChange={handleChange} style={getSelectStyle()}>
                    <option value="Sinhala">Sinhala</option>
                    <option value="English">English</option>
                    <option value="Tamil">Tamil</option>
                  </select>
                </div>
                <div>
                  <label style={labelStyle}>Date of Birth *</label>
                  <input type="date" name="dob" value={formData.dob} onChange={handleChange} required style={getInputStyle(focusedInput === 'dob')} onFocus={() => setFocusedInput('dob')} onBlur={() => setFocusedInput(null)} />
                </div>
              </div>

              <div>
                <label style={labelStyle}>Marital Status *</label>
                <select name="maritalStatus" value={formData.maritalStatus} onChange={handleChange} required style={getSelectStyle()}>
                  <option value="">Select Status</option>
                  <option value="Single">Single / Unmarried</option>
                  <option value="Married">Married</option>
                </select>
              </div>

              <div>
                <label style={labelStyle}>Family Details</label>
                <input type="text" name="familyDetails" value={formData.familyDetails} onChange={handleChange} style={getInputStyle(focusedInput === 'familyDetails')} placeholder="e.g. Living with parents / 2 Kids" onFocus={() => setFocusedInput('familyDetails')} onBlur={() => setFocusedInput(null)} />
              </div>

              <div>
                <label style={labelStyle}>Education / Profession *</label>
                <input type="text" name="education" value={formData.education} onChange={handleChange} required style={getInputStyle(focusedInput === 'education')} placeholder="e.g. Software Engineer / BSc Degree" onFocus={() => setFocusedInput('education')} onBlur={() => setFocusedInput(null)} />
              </div>

              <button type="submit" style={{ marginTop: '24px', padding: '16px', backgroundColor: '#8b1818', color: '#ffffff', border: 'none', borderRadius: '8px', fontSize: '1.05rem', fontWeight: '600', cursor: 'pointer', transition: 'background-color 0.2s ease' }} onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#7a1515'} onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#8b1818'}>
                Continue to Final Step
              </button>
            </form>
          ) : (
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '40px' }}>
              <div style={{ marginBottom: '8px' }}>
                <h3 style={{ fontSize: '1.2rem', fontWeight: '600', color: '#374151', margin: '0 0 8px 0', fontFamily: 'var(--font-sinhala)' }}>පියවර 2: ආධ්‍යාත්මික පසුබිම</h3>
                <div style={{ height: '2px', backgroundColor: '#e5e7eb', width: '100%' }}><div style={{ height: '2px', backgroundColor: '#8b1818', width: '100%' }}></div></div>
                <p style={{ fontSize: '0.85rem', color: '#6b7280', marginTop: '12px', fontFamily: 'var(--font-sinhala)' }}>කරුණාකර පහත ප්‍රශ්න සඳහා අවංකව පිළිතුරු සපයන්න.</p>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '1.05rem', color: '#111827', fontFamily: 'var(--font-sinhala)', marginBottom: '16px', fontWeight: '500' }}>
                  1. නිවන් දකින්න කොච්චර උනන්දුවක් තියෙනවද?
                </label>
                <input type="range" min="0" max="100" name="interest" value={formData.interest} onChange={handleChange} />
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', color: '#6b7280', fontFamily: 'var(--font-sinhala)', marginTop: '8px' }}>
                  <span>අඩුයි</span><span>වැඩියි</span>
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '1.05rem', color: '#111827', fontFamily: 'var(--font-sinhala)', marginBottom: '16px', fontWeight: '500' }}>
                  2. ඒ වෙනුවෙන් තමන් කරන කැපකිරීම කොච්චරක් කියලා තමන්ට දැනෙනවද?
                </label>
                <input type="range" min="0" max="100" name="currentDedication" value={formData.currentDedication} onChange={handleChange} />
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', color: '#6b7280', fontFamily: 'var(--font-sinhala)', marginTop: '8px' }}>
                  <span>අඩුයි</span><span>වැඩියි</span>
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '1.05rem', color: '#111827', fontFamily: 'var(--font-sinhala)', marginBottom: '16px', fontWeight: '500' }}>
                  3. හරි මඟ පෙන්වීමක් ලැබුණොත් තමන්ට කොච්චර කැපකිරීමක් කරන්න සූදානම්ද?
                </label>
                <input type="range" min="0" max="100" name="potentialDedication" value={formData.potentialDedication} onChange={handleChange} />
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', color: '#6b7280', fontFamily: 'var(--font-sinhala)', marginTop: '8px' }}>
                  <span>අඩුයි</span><span>වැඩියි</span>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '16px', marginTop: '16px' }}>
                <button type="button" onClick={() => setStep(1)} style={{ flex: 1, padding: '16px', backgroundColor: 'transparent', color: '#374151', border: '1px solid #d1d5db', borderRadius: '8px', fontSize: '1.05rem', fontWeight: '600', cursor: 'pointer', fontFamily: 'var(--font-sinhala)' }}>
                  ආපසු (Back)
                </button>
                <button type="submit" disabled={isLoading} style={{ flex: 2, padding: '16px', backgroundColor: '#8b1818', color: '#ffffff', border: 'none', borderRadius: '8px', fontSize: '1.05rem', fontWeight: '600', cursor: isLoading ? 'not-allowed' : 'pointer', opacity: isLoading ? 0.7 : 1, fontFamily: 'var(--font-sinhala)', transition: 'background-color 0.2s ease' }} onMouseEnter={(e) => { if(!isLoading) e.currentTarget.style.backgroundColor = '#7a1515'; }} onMouseLeave={(e) => { if(!isLoading) e.currentTarget.style.backgroundColor = '#8b1818'; }}>
                  {isLoading ? 'Processing...' : 'ලියාපදිංචි වන්න'}
                </button>
              </div>
            </form>
          )}

        </div>
      </div>
    </div>
  );
}
