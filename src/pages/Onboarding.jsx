import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../utils/supabase';

export default function Onboarding() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState(1);
  const [error, setError] = useState('');

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    mobile: '',
    country: 'Sri Lanka',
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

  useEffect(() => {
    // Pre-fill name if available from session
    const fetchUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate('/login');
        return;
      }
      
      const { data: profile } = await supabase
        .from('profiles')
        .select('status, name')
        .eq('id', session.user.id)
        .single();
        
      if (profile?.status === 'active') {
        navigate('/dashboard');
      } else if (profile?.name) {
        setFormData(prev => ({ ...prev, name: profile.name }));
      }
    };
    fetchUser();
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleNext = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.mobile || !formData.state || !formData.dob || !formData.maritalStatus || !formData.education) {
      setError('Please fill in all mandatory fields.');
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
      const { data, error: rpcError } = await supabase.rpc('complete_onboarding', {
        p_name: formData.name,
        p_mobile: formData.mobile,
        p_country: formData.country,
        p_state: formData.state,
        p_language: formData.language,
        p_dob: formData.dob,
        p_marital: formData.maritalStatus,
        p_family: formData.familyDetails,
        p_education: formData.education,
        p_interest: parseInt(formData.interest),
        p_current: parseInt(formData.currentDedication),
        p_potential: parseInt(formData.potentialDedication)
      });

      if (rpcError) throw rpcError;
      
      // Success, redirect to dashboard
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'An error occurred during onboarding. Make sure you have run the Supabase SQL reset script.');
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

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: 'var(--bg-main)', paddingTop: '100px', paddingBottom: '60px' }}>
      <div style={{ maxWidth: '600px', width: '100%', margin: '0 auto', padding: '0 24px' }}>
        
        <h1 style={{ fontSize: '2.5rem', color: 'var(--primary)', fontFamily: 'var(--font-serif)', marginBottom: '8px', textAlign: 'center' }}>
          Welcome to Kalyanamitta
        </h1>
        <p style={{ textAlign: 'center', color: 'var(--text-muted)', marginBottom: '40px' }}>
          Please complete your profile to generate your unique Kalyanamitta ID.
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
                <h3 style={{ fontSize: '1.2rem', fontWeight: '700', color: 'var(--text-main)' }}>Step 1: Personal Details</h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>This information is kept strictly confidential.</p>
              </div>

              <div>
                <label style={labelStyle}>Full Name (English) *</label>
                <input type="text" name="name" value={formData.name} onChange={handleChange} required style={inputStyle} placeholder="e.g. Nimal Perera" />
              </div>

              <div>
                <label style={labelStyle}>Mobile Number *</label>
                <input type="tel" name="mobile" value={formData.mobile} onChange={handleChange} required style={inputStyle} placeholder="+947XXXXXXXX" />
              </div>

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
                  <option value="Divorced">Divorced</option>
                  <option value="Widowed">Widowed</option>
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
                  {isLoading ? 'Processing...' : 'ගිණුම සක්‍රිය කරන්න (Activate)'}
                </button>
              </div>
            </form>
          )}

        </div>
      </div>
    </div>
  );
}
