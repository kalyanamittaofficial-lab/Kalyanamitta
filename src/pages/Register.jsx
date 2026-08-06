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

  // Common Input Style
  const inputStyle = {
    width: '100%', padding: '14px', borderRadius: '8px', border: '1px solid var(--glass-border)',
    fontSize: '0.95rem', outline: 'none', background: 'rgba(255,255,255,0.8)', color: 'var(--text-main)',
    fontFamily: 'system-ui, -apple-system, sans-serif'
  };

  const labelStyle = { display: 'block', marginBottom: '6px', fontSize: '0.9rem', color: 'var(--text-muted)', fontWeight: '600' };

  if (success) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-main)', padding: '24px' }}>
        <div style={{ background: '#fff', borderRadius: '16px', padding: '40px', maxWidth: '500px', textAlign: 'center', boxShadow: '0 10px 40px rgba(0,0,0,0.05)' }}>
          <h2 style={{ color: '#166534', marginBottom: '16px', fontFamily: 'var(--font-sinhala)' }}>සාර්ථකයි!</h2>
          <p style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-sinhala)', lineHeight: '1.6', marginBottom: '24px' }}>{success}</p>
          <button onClick={() => navigate('/login')} style={{ padding: '12px 24px', background: 'var(--primary)', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '600' }}>
            Login පිටුවට යන්න
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: 'var(--bg-main)', paddingTop: '100px', paddingBottom: '60px' }}>
      <div style={{ maxWidth: '600px', width: '100%', margin: '0 auto', padding: '0 24px' }}>
        
        <h1 style={{ fontSize: '2.5rem', color: 'var(--primary)', fontFamily: 'var(--font-serif)', marginBottom: '8px', textAlign: 'center' }}>
          Kalyanamitta Registration
        </h1>
        <p style={{ textAlign: 'center', color: 'var(--text-muted)', marginBottom: '40px' }}>
          දැනටමත් ගිණුමක් තිබේද? <Link to="/login" style={{ color: 'var(--primary)', fontWeight: '600', textDecoration: 'none' }}>ඇතුල් වන්න</Link>
        </p>

        {error && (
          <div style={{ padding: '12px', background: '#fff1f2', color: '#9f1239', borderRadius: '8px', marginBottom: '24px', fontSize: '0.9rem', border: '1px solid #fecdd3' }}>
            {error}
          </div>
        )}

        <div style={{ background: '#fff', borderRadius: '16px', padding: '40px', boxShadow: '0 10px 40px rgba(0,0,0,0.05)', border: '1px solid rgba(0,0,0,0.05)' }}>
          
          {step === 1 ? (
            <form onSubmit={handleNext} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div style={{ borderBottom: '1px solid rgba(0,0,0,0.05)', paddingBottom: '16px', marginBottom: '8px' }}>
                <h3 style={{ fontSize: '1.2rem', fontWeight: '700', color: 'var(--text-main)' }}>Step 1: Account Details</h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>This information is kept strictly confidential.</p>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <label style={labelStyle}>Email Address *</label>
                  <input type="email" name="email" value={formData.email} onChange={handleChange} required style={inputStyle} placeholder="name@example.com" />
                </div>
                <div>
                  <label style={labelStyle}>Password *</label>
                  <input type="password" name="password" value={formData.password} onChange={handleChange} required style={inputStyle} minLength="6" placeholder="අකුරු 6 කට වඩා ලබාදෙන්න" />
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px', display: 'block' }}>
                    * ඉලක්කම් සහ අකුරු මිශ්‍ර කර ශක්තිමත් මුරපදයක් (Strong Password) ලබා දෙන්න.
                  </span>
                </div>
              </div>

              <div style={{ height: '1px', background: 'rgba(0,0,0,0.05)', margin: '8px 0' }}></div>

              <div>
                <label style={labelStyle}>Full Name (English) *</label>
                <input type="text" name="name" value={formData.name} onChange={handleChange} required style={inputStyle} placeholder="e.g. Nimal Perera" />
              </div>

              <div>
                <label style={labelStyle}>Mobile Number *</label>
                <input type="tel" name="mobile" value={formData.mobile} onChange={handleChange} required style={inputStyle} placeholder="+947XXXXXXXX" />
              </div>

              <div style={{ display: 'flex', gap: '16px', flexDirection: 'column' }}>
                <div style={{ display: 'flex', gap: '16px' }}>
                  <div style={{ flex: 1 }}>
                    <label style={labelStyle}>Country *</label>
                    <select name="country" value={formData.country} onChange={handleChange} style={inputStyle}>
                      <option value="Sri Lanka">Sri Lanka</option>
                      <option value="Australia">Australia</option>
                      <option value="UK">United Kingdom</option>
                      <option value="USA">United States</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  <div style={{ flex: 1 }}>
                    <label style={labelStyle}>State / District *</label>
                    <input type="text" name="state" value={formData.state} onChange={handleChange} required style={inputStyle} placeholder="e.g. Colombo" />
                  </div>
                </div>
                
                {formData.country === 'Other' && (
                  <div>
                    <label style={labelStyle}>Specify Your Country *</label>
                    <input type="text" name="otherCountry" value={formData.otherCountry} onChange={handleChange} required style={inputStyle} placeholder="e.g. Canada" />
                  </div>
                )}
              </div>

              <div style={{ display: 'flex', gap: '16px' }}>
                <div style={{ flex: 1 }}>
                  <label style={labelStyle}>Native Language</label>
                  <select name="language" value={formData.language} onChange={handleChange} style={inputStyle}>
                    <option value="Sinhala">Sinhala</option>
                    <option value="English">English</option>
                    <option value="Tamil">Tamil</option>
                  </select>
                </div>
                <div style={{ flex: 1 }}>
                  <label style={labelStyle}>Date of Birth *</label>
                  <input type="date" name="dob" value={formData.dob} onChange={handleChange} required style={inputStyle} />
                </div>
              </div>

              <div>
                <label style={labelStyle}>Marital Status *</label>
                <select name="maritalStatus" value={formData.maritalStatus} onChange={handleChange} required style={inputStyle}>
                  <option value="">Select Status</option>
                  <option value="Single">Single / Unmarried</option>
                  <option value="Married">Married</option>
                </select>
              </div>

              <div>
                <label style={labelStyle}>Family Details</label>
                <input type="text" name="familyDetails" value={formData.familyDetails} onChange={handleChange} style={inputStyle} placeholder="e.g. Living with parents / 2 Kids" />
              </div>

              <div>
                <label style={labelStyle}>Education / Profession *</label>
                <input type="text" name="education" value={formData.education} onChange={handleChange} required style={inputStyle} placeholder="e.g. Software Engineer / BSc Degree" />
              </div>

              <button type="submit" style={{ marginTop: '16px', padding: '16px', background: 'var(--primary)', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '1rem', fontWeight: '600', cursor: 'pointer' }}>
                Continue to Final Step
              </button>
            </form>
          ) : (
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
              <div style={{ borderBottom: '1px solid rgba(0,0,0,0.05)', paddingBottom: '16px' }}>
                <h3 style={{ fontSize: '1.2rem', fontWeight: '700', color: 'var(--text-main)', fontFamily: 'var(--font-sinhala)' }}>පියවර 2: ආධ්‍යාත්මික පසුබිම</h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontFamily: 'var(--font-sinhala)' }}>කරුණාකර පහත ප්‍රශ්න සඳහා අවංකව පිළිතුරු සපයන්න.</p>
              </div>

              <div>
                <label style={{ ...labelStyle, fontSize: '1rem', color: 'var(--text-main)', fontFamily: 'var(--font-sinhala)', marginBottom: '12px' }}>
                  1. නිවන් දකින්න කොච්චර උනන්දුවක් තියෙනවද?
                </label>
                <input type="range" min="0" max="100" name="interest" value={formData.interest} onChange={handleChange} style={{ width: '100%', cursor: 'pointer' }} />
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: 'var(--text-muted)', fontFamily: 'var(--font-sinhala)', marginTop: '4px' }}>
                  <span>අඩුයි</span><span>වැඩියි</span>
                </div>
              </div>

              <div>
                <label style={{ ...labelStyle, fontSize: '1rem', color: 'var(--text-main)', fontFamily: 'var(--font-sinhala)', marginBottom: '12px' }}>
                  2. ඒ වෙනුවෙන් තමන් කරන කැපකිරීම කොච්චරක් කියලා තමන්ට දැනෙනවද?
                </label>
                <input type="range" min="0" max="100" name="currentDedication" value={formData.currentDedication} onChange={handleChange} style={{ width: '100%', cursor: 'pointer' }} />
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: 'var(--text-muted)', fontFamily: 'var(--font-sinhala)', marginTop: '4px' }}>
                  <span>අඩුයි</span><span>වැඩියි</span>
                </div>
              </div>

              <div>
                <label style={{ ...labelStyle, fontSize: '1rem', color: 'var(--text-main)', fontFamily: 'var(--font-sinhala)', marginBottom: '12px' }}>
                  3. හරි මඟ පෙන්වීමක් ලැබුණොත් තමන්ට කොච්චර කැපකිරීමක් කරන්න සූදානම්ද?
                </label>
                <input type="range" min="0" max="100" name="potentialDedication" value={formData.potentialDedication} onChange={handleChange} style={{ width: '100%', cursor: 'pointer' }} />
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: 'var(--text-muted)', fontFamily: 'var(--font-sinhala)', marginTop: '4px' }}>
                  <span>අඩුයි</span><span>වැඩියි</span>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '16px', marginTop: '16px' }}>
                <button type="button" onClick={() => setStep(1)} style={{ flex: 1, padding: '16px', background: 'transparent', color: 'var(--text-main)', border: '1px solid rgba(0,0,0,0.2)', borderRadius: '8px', fontSize: '1rem', fontWeight: '600', cursor: 'pointer' }}>
                  ආපසු (Back)
                </button>
                <button type="submit" disabled={isLoading} style={{ flex: 2, padding: '16px', background: 'var(--primary)', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '1rem', fontWeight: '600', cursor: isLoading ? 'not-allowed' : 'pointer', opacity: isLoading ? 0.7 : 1 }}>
                  {isLoading ? 'Processing...' : 'ලියාපදිංචි වන්න (Register)'}
                </button>
              </div>
            </form>
          )}

        </div>
      </div>
    </div>
  );
}
