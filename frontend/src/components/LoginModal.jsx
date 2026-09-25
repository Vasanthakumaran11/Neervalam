import React, { useState } from 'react';
import {
  Mail, ShieldCheck, ArrowRight, Loader2, X,
  Sprout, Building2, ChevronLeft, User, MapPin,
  LogIn, UserPlus,
} from 'lucide-react';
import { sendOTP, verifyOTP, checkUser } from '../services/apiService';
import { useAuth } from '../context/AuthContext';

// ─── Step Constants ──────────────────────────────────────────────────────────
const STEP = {
  MODE:    'mode',    // Login / Sign Up choice
  ROLE:    'role',    // Pick role (farmer / govt)
  SIGNUP:  'signup',  // Signup form (name, email, district)
  EMAIL:   'email',   // Login: enter email
  OTP:     'otp',     // Enter OTP
  SUCCESS: 'success', // Done
};

const TAMIL_DISTRICTS = [
  'Ariyalur','Chengalpattu','Chennai','Coimbatore','Cuddalore','Dharmapuri',
  'Dindigul','Erode','Kallakurichi','Kancheepuram','Kanyakumari','Karur',
  'Krishnagiri','Madurai','Nagapattinam','Namakkal','Nilgiris','Perambalur',
  'Pudukkottai','Ramanathapuram','Ranipet','Salem','Sivaganga','Tenkasi',
  'Thanjavur','Theni','Thoothukudi','Tiruchirappalli','Tirunelveli',
  'Tirupathur','Tiruppur','Tiruvallur','Tiruvannamalai','Tiruvarur',
  'Vellore','Viluppuram','Virudhunagar',
];

// ─── Shared Styles ────────────────────────────────────────────────────────────
const css = {
  overlay: {
    position: 'fixed', inset: 0, zIndex: 9999,
    background: 'rgba(0,0,0,0.6)',
    backdropFilter: 'blur(8px)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    padding: '1rem',
    animation: 'nvFadeIn 0.2s ease',
  },
  card: {
    background: '#ffffff',
    borderRadius: '22px',
    width: '100%', maxWidth: '430px',
    boxShadow: '0 32px 100px rgba(0,0,0,0.22)',
    overflow: 'hidden',
    animation: 'nvSlideUp 0.28s cubic-bezier(.22,.68,0,1.2)',
  },
  header: (color = 'green') => ({
    background: color === 'blue'
      ? 'linear-gradient(135deg, #0c2e4a 0%, #0369a1 60%, #0284c7 100%)'
      : 'linear-gradient(135deg, #0f3b2e 0%, #196342 60%, #15803d 100%)',
    padding: '1.75rem 1.75rem 1.5rem',
    color: '#fff',
    position: 'relative',
  }),
  body: {
    padding: '1.5rem 1.75rem 1.75rem',
  },
  input: {
    width: '100%', boxSizing: 'border-box',
    border: '1.5px solid #e2e8f0', borderRadius: '12px',
    padding: '0.75rem 1rem', fontSize: '0.95rem',
    color: '#0f172a', outline: 'none',
    transition: 'border-color 0.2s, box-shadow 0.2s',
    fontFamily: 'inherit', background: '#fff',
  },
  label: {
    display: 'block', fontWeight: '600',
    fontSize: '0.8rem', color: '#475569', marginBottom: '0.4rem',
  },
  btnPrimary: (color = 'green') => ({
    width: '100%',
    background: color === 'blue'
      ? 'linear-gradient(135deg, #0369a1 0%, #0284c7 100%)'
      : 'linear-gradient(135deg, #196342 0%, #15803d 100%)',
    color: '#fff', border: 'none', borderRadius: '12px',
    padding: '0.85rem 1rem', fontSize: '1rem', fontWeight: '700',
    cursor: 'pointer',
    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
    transition: 'all 0.2s ease', marginTop: '0.25rem',
    boxShadow: color === 'blue'
      ? '0 4px 14px rgba(3,105,161,0.3)'
      : '0 4px 14px rgba(25,99,66,0.28)',
  }),
  iconBtn: {
    background: 'rgba(255,255,255,0.15)', border: 'none',
    borderRadius: '8px', color: '#fff', cursor: 'pointer',
    padding: '0.35rem 0.5rem', display: 'flex',
  },
  error: {
    background: '#fef2f2', border: '1px solid #fecaca',
    borderRadius: '10px', padding: '0.65rem 0.9rem',
    fontSize: '0.82rem', color: '#dc2626',
  },
  devHint: {
    background: '#fefce8', border: '1px solid #fde68a',
    borderRadius: '10px', padding: '0.65rem 0.9rem',
    fontSize: '0.78rem', color: '#92400e',
    display: 'flex', gap: '0.4rem', marginBottom: '1rem',
  },
};

const globalAnim = `
  @keyframes nvFadeIn  { from{opacity:0}  to{opacity:1} }
  @keyframes nvSlideUp { from{opacity:0;transform:translateY(22px)} to{opacity:1;transform:translateY(0)} }
  @keyframes nvSpin    { to{transform:rotate(360deg)} }
`;

// ─── Reusable sub-components ──────────────────────────────────────────────────
function CloseBtn({ onClick }) {
  return (
    <button onClick={onClick} style={{ ...css.iconBtn, position: 'absolute', top: '1rem', right: '1rem' }}>
      <X size={18} />
    </button>
  );
}

function BackBtn({ onClick }) {
  return (
    <button onClick={onClick} style={{ ...css.iconBtn, position: 'absolute', top: '1rem', left: '1rem' }}>
      <ChevronLeft size={18} />
    </button>
  );
}

function ModalHeader({ title, subtitle, icon, color, onBack, onClose }) {
  return (
    <div style={css.header(color)}>
      {onBack  && <BackBtn onClick={onBack} />}
      {onClose && <CloseBtn onClick={onClose} />}
      <div style={{ paddingTop: onBack || onClose ? '0.25rem' : 0 }}>
        {icon}
        <div style={{ fontSize: '1.1rem', fontWeight: '800', marginTop: icon ? '0.4rem' : 0 }}>{title}</div>
        {subtitle && <div style={{ fontSize: '0.8rem', opacity: 0.75, marginTop: '0.2rem' }}>{subtitle}</div>}
      </div>
    </div>
  );
}

function RoleCard({ icon, title, desc, accentColor, bgColor, onClick }) {
  const [hov, setHov] = useState(false);
  return (
    <button
      onClick={onClick}
      onMouseOver={() => setHov(true)}
      onMouseOut={() => setHov(false)}
      style={{
        display: 'flex', alignItems: 'center', gap: '1rem',
        border: `2px solid ${hov ? accentColor : '#e2e8f0'}`,
        borderRadius: '14px', padding: '1rem 1.25rem', cursor: 'pointer',
        background: hov ? bgColor : '#fff',
        textAlign: 'left', transition: 'all 0.2s ease', width: '100%',
      }}
    >
      <div style={{ width: 46, height: 46, borderRadius: '12px', background: bgColor, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
        {icon}
      </div>
      <div style={{ flex: 1 }}>
        <div style={{ fontWeight: '700', color: '#0f172a', fontSize: '0.95rem' }}>{title}</div>
        <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '0.15rem' }}>{desc}</div>
      </div>
      <ArrowRight size={17} color="#94a3b8" />
    </button>
  );
}

// ─── Main Modal ───────────────────────────────────────────────────────────────
export default function LoginModal({ isOpen, onClose, onSuccess }) {
  const { login } = useAuth();

  const [step,      setStep]      = useState(STEP.MODE);
  const [authMode,  setAuthMode]  = useState('login');   // 'login' | 'signup'
  const [role,      setRole]      = useState('');
  const [email,     setEmail]     = useState('');
  const [fullName,  setFullName]  = useState('');
  const [district,  setDistrict]  = useState('Erode');
  const [jobTitle,  setJobTitle]  = useState('');
  const [iotHubId,  setIotHubId]  = useState('IOT-ERD-102');
  const [otp,       setOtp]       = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error,     setError]     = useState('');
  const [resendTimer, setResendTimer] = useState(0);
  const [existingUserName, setExistingUserName] = useState('');

  if (!isOpen) return null;

  function isValidEmail(val) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val.trim());
  }

  function maskEmail(addr) {
    if (!addr || !addr.includes('@')) return addr;
    const [local, domain] = addr.split('@');
    if (local.length <= 2) return `${local[0]}*@${domain}`;
    const masked = local[0] + '*'.repeat(Math.max(1, local.length - 2)) + local.slice(-1);
    return `${masked}@${domain}`;
  }

  function startResendTimer() {
    setResendTimer(30);
    const iv = setInterval(() => {
      setResendTimer(prev => { if (prev <= 1) { clearInterval(iv); return 0; } return prev - 1; });
    }, 1000);
  }

  function reset() {
    setStep(STEP.MODE); setRole(''); setEmail(''); setOtp('');
    setFullName(''); setDistrict('Erode'); setJobTitle(''); setIotHubId('IOT-ERD-102'); setError('');
    setExistingUserName('');
  }

  function focusColor() { return role === 'government_official' ? '#0284c7' : '#059669'; }
  function headerColor() { return role === 'government_official' ? 'blue' : 'green'; }

  // ── LOGIN: Email Submit → check if registered → send OTP ──────────────────
  async function handleLoginEmail(e) {
    e.preventDefault();
    setError('');
    const normalized = email.trim().toLowerCase();
    if (!isValidEmail(normalized)) {
      setError('Please enter a valid email address (e.g. farmer.erode@gmail.com).');
      return;
    }
    setIsLoading(true);
    try {
      // Check if user exists
      const check = await checkUser(normalized);
      if (!check.exists) {
        setError('This email is not registered yet. Please click Sign Up first.');
        setIsLoading(false);
        return;
      }
      setExistingUserName(check.full_name || '');
      // Send OTP
      await sendOTP(normalized, check.role || role || 'farmer', 'login');
      setEmail(normalized);
      if (check.role) setRole(check.role);
      setStep(STEP.OTP);
      startResendTimer();
    } catch (err) {
      setError(err.message || 'Failed to send OTP to email. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }

  // ── SIGNUP: Form submit → send OTP ────────────────────────────────────────
  async function handleSignupSubmit(e) {
    e.preventDefault();
    setError('');
    if (!fullName.trim()) { setError('Please enter your full name.'); return; }
    const normalized = email.trim().toLowerCase();
    if (!isValidEmail(normalized)) {
      setError('Please enter a valid email address (e.g. farmer.erode@gmail.com).');
      return;
    }
    if (!district) { setError('Please select your district.'); return; }
    if (role === 'farmer' && !iotHubId.trim()) {
      setError('Please enter the installed IoT device ID for the farmer well.');
      return;
    }
    if (role === 'government_official' && !jobTitle.trim()) {
      setError('Please select the government job title.');
      return;
    }
    setIsLoading(true);
    try {
      const signupData = {
        full_name: fullName.trim(),
        district,
        ...(role === 'farmer' ? { iot_hub_id: iotHubId.trim() } : { job_title: jobTitle.trim() }),
      };
      await sendOTP(normalized, role, 'signup', signupData);
      setEmail(normalized);
      setStep(STEP.OTP);
      startResendTimer();
    } catch (err) {
      setError(err.message || 'Signup failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }

  // ── OTP Verify ────────────────────────────────────────────────────────────
  async function handleVerifyOTP(e) {
    e.preventDefault();
    setError('');
    if (otp.length !== 6) { setError('Please enter the 6-digit OTP.'); return; }
    setIsLoading(true);
    try {
      const signupData = authMode === 'signup'
        ? {
            full_name: fullName,
            district,
            ...(role === 'farmer' ? { iot_hub_id: iotHubId } : { job_title: jobTitle }),
          }
        : {};
      const normalized = email.trim().toLowerCase();
      const authData = await verifyOTP(normalized, otp, role || 'farmer', authMode, signupData);
      login(authData);
      setStep(STEP.SUCCESS);
      setTimeout(() => { onClose(); if (onSuccess) onSuccess(authData.user); }, 1200);
    } catch (err) {
      setError(err.message || 'Invalid OTP code. Please check and try again.');
    } finally {
      setIsLoading(false);
    }
  }

  // ── Resend ────────────────────────────────────────────────────────────────
  async function handleResend() {
    if (resendTimer > 0 || isLoading) return;
    setError('');
    setIsLoading(true);
    try {
      const signupData = authMode === 'signup'
        ? {
            full_name: fullName,
            district,
            ...(role === 'farmer' ? { iot_hub_id: iotHubId } : { job_title: jobTitle }),
          }
        : {};
      const normalized = email.trim().toLowerCase();
      await sendOTP(normalized, role || 'farmer', authMode, signupData);
      startResendTimer();
    } catch (err) { setError(err.message); }
    finally { setIsLoading(false); }
  }

  const LoadingSpinner = () => (
    <Loader2 size={18} style={{ animation: 'nvSpin 1s linear infinite' }} />
  );

  // ==========================================================================
  // STEP: MODE — Login vs Sign Up choice
  // ==========================================================================
  if (step === STEP.MODE) {
    return (
      <div style={css.overlay} onClick={e => e.target === e.currentTarget && onClose()}>
        <div style={css.card}>
          <ModalHeader
            title="Welcome to Neervalam"
            subtitle="Water Today, Harvest Tomorrow."
            icon={<div style={{ width: 38, height: 38, borderRadius: '10px', background: 'rgba(255,255,255,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.2"><path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"/></svg></div>}
            onClose={onClose}
          />
          <div style={css.body}>
            <div style={{ display: 'flex', gap: '0.6rem', marginBottom: '1.5rem', background: '#f1f5f9', borderRadius: '12px', padding: '0.3rem' }}>
              {[['login', 'Login', LogIn], ['signup', 'Sign Up', UserPlus]].map(([mode, label, Icon]) => (
                <button
                  key={mode}
                  onClick={() => setAuthMode(mode)}
                  style={{
                    flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem',
                    padding: '0.6rem 0', borderRadius: '9px', border: 'none', cursor: 'pointer',
                    fontWeight: '700', fontSize: '0.88rem',
                    background: authMode === mode ? '#fff' : 'transparent',
                    color: authMode === mode ? '#0f172a' : '#64748b',
                    boxShadow: authMode === mode ? '0 1px 4px rgba(0,0,0,0.1)' : 'none',
                    transition: 'all 0.2s',
                  }}
                >
                  <Icon size={15} /> {label}
                </button>
              ))}
            </div>

            {authMode === 'login' ? (
              <>
                <p style={{ fontSize: '0.85rem', color: '#475569', marginBottom: '1.25rem', lineHeight: '1.5' }}>
                  Enter your registered email address — we'll send a 6-digit OTP verification code to your inbox.
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                  <RoleCard
                    icon={<Sprout size={22} color="#059669" />}
                    title="Login as Farmer" desc="IoT dashboard, well telemetry & irrigation advisory"
                    accentColor="#10b981" bgColor="#d1fae5"
                    onClick={() => { setRole('farmer'); setAuthMode('login'); setStep(STEP.EMAIL); setError(''); }}
                  />
                  <RoleCard
                    icon={<Building2 size={22} color="#0284c7" />}
                    title="Login as Government Official" desc="State GIS map, district analytics & policy data"
                    accentColor="#0ea5e9" bgColor="#dbeafe"
                    onClick={() => { setRole('government_official'); setAuthMode('login'); setStep(STEP.EMAIL); setError(''); }}
                  />
                </div>
              </>
            ) : (
              <>
                <p style={{ fontSize: '0.85rem', color: '#475569', marginBottom: '1.25rem', lineHeight: '1.5' }}>
                  Create your Neervalam account. Choose your role to get started with instant Email OTP.
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                  <RoleCard
                    icon={<Sprout size={22} color="#059669" />}
                    title="Sign Up as Farmer" desc="Register with your farm & Erode IoT sensor details"
                    accentColor="#10b981" bgColor="#d1fae5"
                    onClick={() => { setRole('farmer'); setAuthMode('signup'); setStep(STEP.SIGNUP); setError(''); }}
                  />
                  <RoleCard
                    icon={<Building2 size={22} color="#0284c7" />}
                    title="Sign Up as Government Official" desc="Register with your official designation & district"
                    accentColor="#0ea5e9" bgColor="#dbeafe"
                    onClick={() => { setRole('government_official'); setAuthMode('signup'); setStep(STEP.SIGNUP); setError(''); }}
                  />
                </div>
              </>
            )}

            <p style={{ textAlign: 'center', fontSize: '0.72rem', color: '#94a3b8', marginTop: '1.25rem' }}>
              🔒 Secure Email OTP login · No password needed · Instant verification
            </p>
          </div>
        </div>
        <style>{globalAnim}</style>
      </div>
    );
  }

  // ==========================================================================
  // STEP: SIGNUP — Full registration form
  // ==========================================================================
  if (step === STEP.SIGNUP) {
    const roleLabel = role === 'farmer' ? 'Farmer' : 'Government Official';
    const RoleIcon  = role === 'farmer' ? Sprout : Building2;
    const hColor    = headerColor();
    const fColor    = focusColor();

    return (
      <div style={css.overlay} onClick={e => e.target === e.currentTarget && onClose()}>
        <div style={{ ...css.card, maxWidth: '460px' }}>
          <ModalHeader
            title={`Create ${roleLabel} Account`}
            subtitle="Fill in your details — 6-digit OTP will be sent to verify your email"
            icon={<div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(255,255,255,0.15)', borderRadius: '999px', padding: '0.3rem 0.85rem', marginBottom: '0.5rem' }}><RoleIcon size={14} /><span style={{ fontSize: '0.78rem', fontWeight: '600' }}>{roleLabel}</span></div>}
            color={hColor}
            onBack={() => { setStep(STEP.MODE); setError(''); }}
            onClose={onClose}
          />

          <div style={css.body}>
            <form onSubmit={handleSignupSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {/* Full Name */}
              <div>
                <label style={css.label}>Full Name <span style={{ color: '#ef4444' }}>*</span></label>
                <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                  <input
                    type="text" placeholder="e.g. Selvam Arumugam"
                    value={fullName}
                    onChange={e => setFullName(e.target.value)}
                    style={{ ...css.input, paddingRight: '2.5rem' }}
                    onFocus={e => { e.target.style.borderColor = fColor; e.target.style.boxShadow = `0 0 0 3px ${fColor}22`; }}
                    onBlur={e => { e.target.style.borderColor = '#e2e8f0'; e.target.style.boxShadow = 'none'; }}
                    autoFocus required
                  />
                  <User size={16} color="#94a3b8" style={{ position: 'absolute', right: '0.9rem', pointerEvents: 'none' }} />
                </div>
              </div>

              {/* Email Address */}
              <div>
                <label style={css.label}>Email Address <span style={{ color: '#ef4444' }}>*</span></label>
                <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                  <input
                    type="email"
                    placeholder="e.g. farmer.erode@gmail.com"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    style={{ ...css.input, paddingRight: '2.5rem' }}
                    onFocus={e => { e.target.style.borderColor = fColor; e.target.style.boxShadow = `0 0 0 3px ${fColor}22`; }}
                    onBlur={e => { e.target.style.borderColor = '#e2e8f0'; e.target.style.boxShadow = 'none'; }}
                    required
                  />
                  <Mail size={16} color="#94a3b8" style={{ position: 'absolute', right: '0.9rem', pointerEvents: 'none' }} />
                </div>
              </div>

              {/* District */}
              <div>
                <label style={css.label}>District <span style={{ color: '#ef4444' }}>*</span></label>
                <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                  <select
                    value={district}
                    onChange={e => setDistrict(e.target.value)}
                    style={{ ...css.input, paddingRight: '2.5rem', appearance: 'none', cursor: 'pointer', color: district ? '#0f172a' : '#94a3b8' }}
                    onFocus={e => { e.target.style.borderColor = fColor; e.target.style.boxShadow = `0 0 0 3px ${fColor}22`; }}
                    onBlur={e => { e.target.style.borderColor = '#e2e8f0'; e.target.style.boxShadow = 'none'; }}
                    required
                  >
                    <option value="">Select your district</option>
                    {TAMIL_DISTRICTS.map(d => <option key={d} value={d}>{d}</option>)}
                  </select>
                  <MapPin size={16} color="#94a3b8" style={{ position: 'absolute', right: '0.9rem', pointerEvents: 'none' }} />
                </div>
              </div>

              {role === 'farmer' ? (
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
                    <label style={{ ...css.label, marginBottom: 0 }}>Installed IoT Device ID <span style={{ color: '#ef4444' }}>*</span></label>
                    <button
                      type="button"
                      onClick={() => setIotHubId(`IOT-ERD-${Math.floor(101 + Math.random() * 90)}`)}
                      style={{
                        background: 'rgba(5, 150, 105, 0.1)',
                        border: '1px solid rgba(5, 150, 105, 0.3)',
                        borderRadius: '6px',
                        color: '#059669',
                        fontSize: '0.72rem',
                        fontWeight: '700',
                        cursor: 'pointer',
                        padding: '0.2rem 0.5rem',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.3rem'
                      }}
                      title="Generate a real Erode well IoT ID"
                    >
                      🎲 Randomize Erode IoT (e.g. IOT-ERD-102)
                    </button>
                  </div>
                  <input
                    type="text"
                    value={iotHubId}
                    onChange={e => setIotHubId(e.target.value)}
                    placeholder="e.g. IOT-ERD-102"
                    style={{ ...css.input }}
                    onFocus={e => { e.target.style.borderColor = fColor; e.target.style.boxShadow = `0 0 0 3px ${fColor}22`; }}
                    onBlur={e => { e.target.style.borderColor = '#e2e8f0'; e.target.style.boxShadow = 'none'; }}
                    required
                  />
                  <div style={{ fontSize: '0.72rem', color: '#64748b', marginTop: '0.35rem' }}>
                    Automatically binds your dashboard to one of Erode's 63 CGWB well monitoring stations.
                  </div>
                </div>
              ) : (
                <div>
                  <label style={css.label}>Government Job Title <span style={{ color: '#ef4444' }}>*</span></label>
                  <select
                    value={jobTitle}
                    onChange={e => setJobTitle(e.target.value)}
                    style={{ ...css.input, cursor: 'pointer' }}
                    onFocus={e => { e.target.style.borderColor = fColor; e.target.style.boxShadow = `0 0 0 3px ${fColor}22`; }}
                    onBlur={e => { e.target.style.borderColor = '#e2e8f0'; e.target.style.boxShadow = 'none'; }}
                    required
                  >
                    <option value="">Select your role</option>
                    {['Chief Engineer','Deputy Chief Engineer','Assistant Engineer','Research Scientist','Public Information Officer'].map(option => (
                      <option key={option} value={option}>{option}</option>
                    ))}
                  </select>
                </div>
              )}

              {error && <div style={css.error}>⚠️ {error}</div>}

              <button type="submit" disabled={isLoading} style={{ ...css.btnPrimary(hColor), opacity: isLoading ? 0.75 : 1, cursor: isLoading ? 'not-allowed' : 'pointer' }}>
                {isLoading ? <><LoadingSpinner /> Sending OTP...</> : <>Send Email OTP <ArrowRight size={17} /></>}
              </button>
            </form>

            <p style={{ textAlign: 'center', fontSize: '0.75rem', color: '#64748b', marginTop: '1rem' }}>
              Already registered?{' '}
              <button type="button" onClick={() => { setAuthMode('login'); setStep(STEP.MODE); setError(''); }}
                style={{ background: 'none', border: 'none', color: fColor, fontWeight: '700', cursor: 'pointer', fontSize: '0.75rem', padding: 0 }}>
                Login here
              </button>
            </p>
          </div>
        </div>
        <style>{globalAnim}</style>
      </div>
    );
  }

  // ==========================================================================
  // STEP: EMAIL — Login email entry
  // ==========================================================================
  if (step === STEP.EMAIL) {
    const roleLabel = role === 'farmer' ? 'Farmer' : 'Government Official';
    const RoleIcon  = role === 'farmer' ? Sprout : Building2;
    const hColor    = headerColor();
    const fColor    = focusColor();

    return (
      <div style={css.overlay} onClick={e => e.target === e.currentTarget && onClose()}>
        <div style={css.card}>
          <ModalHeader
            title="Enter Your Email Address"
            subtitle="We'll send a 6-digit verification code to your inbox"
            icon={<div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(255,255,255,0.15)', borderRadius: '999px', padding: '0.3rem 0.85rem', marginBottom: '0.5rem' }}><RoleIcon size={14} /><span style={{ fontSize: '0.78rem', fontWeight: '600' }}>{roleLabel}</span></div>}
            color={hColor}
            onBack={() => { setStep(STEP.MODE); setError(''); }}
            onClose={onClose}
          />

          <div style={css.body}>
            <form onSubmit={handleLoginEmail} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={css.label}>Registered Email Address</label>
                <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                  <input
                    type="email"
                    placeholder="e.g. farmer.erode@gmail.com"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    style={{ ...css.input, paddingRight: '2.5rem', fontSize: '0.95rem' }}
                    onFocus={e => { e.target.style.borderColor = fColor; e.target.style.boxShadow = `0 0 0 3px ${fColor}22`; }}
                    onBlur={e => { e.target.style.borderColor = '#e2e8f0'; e.target.style.boxShadow = 'none'; }}
                    autoFocus required
                  />
                  <Mail size={16} color="#94a3b8" style={{ position: 'absolute', right: '0.9rem', pointerEvents: 'none' }} />
                </div>
              </div>

              {error && <div style={css.error}>⚠️ {error}</div>}

              <button type="submit" disabled={isLoading} style={{ ...css.btnPrimary(hColor), opacity: isLoading ? 0.75 : 1, cursor: isLoading ? 'not-allowed' : 'pointer' }}>
                {isLoading ? <><LoadingSpinner /> Checking...</> : <>Send Email OTP <ArrowRight size={17} /></>}
              </button>
            </form>

            <p style={{ textAlign: 'center', fontSize: '0.75rem', color: '#64748b', marginTop: '1rem' }}>
              New to Neervalam?{' '}
              <button type="button" onClick={() => { setAuthMode('signup'); setStep(STEP.MODE); setError(''); }}
                style={{ background: 'none', border: 'none', color: fColor, fontWeight: '700', cursor: 'pointer', fontSize: '0.75rem', padding: 0 }}>
                Sign Up
              </button>
            </p>
          </div>
        </div>
        <style>{globalAnim}</style>
      </div>
    );
  }

  // ==========================================================================
  // STEP: OTP — Enter 6-digit OTP
  // ==========================================================================
  if (step === STEP.OTP) {
    const hColor = headerColor();
    const fColor = focusColor();
    const masked = maskEmail(email);

    return (
      <div style={css.overlay} onClick={e => e.target === e.currentTarget && onClose()}>
        <div style={css.card}>
          <ModalHeader
            title="Verify Email OTP"
            subtitle={<>Verification code sent to <strong>{masked}</strong>{existingUserName ? ` · Welcome back, ${existingUserName.split(' ')[0]}!` : ''}</>}
            icon={<ShieldCheck size={30} style={{ marginBottom: '0.4rem', opacity: 0.9 }} />}
            color={hColor}
            onBack={() => { setStep(authMode === 'signup' ? STEP.SIGNUP : STEP.EMAIL); setError(''); setOtp(''); }}
            onClose={onClose}
          />

          <div style={css.body}>
            <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '10px', padding: '0.75rem 0.9rem', fontSize: '0.8rem', color: '#166534', display: 'flex', alignItems: 'flex-start', gap: '0.5rem', marginBottom: '1rem' }}>
              <span style={{ fontSize: '1.1rem' }}>📩</span>
              <div>
                <strong>Check your email inbox:</strong> A 6-digit verification code has been dispatched. Valid for 5 minutes. If not seen, please check your Spam/Junk folder.
              </div>
            </div>

            <form onSubmit={handleVerifyOTP} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ ...css.label, textAlign: 'center', marginBottom: '0.6rem' }}>Enter 6-Digit Email OTP</label>
                <input
                  type="text" inputMode="numeric" maxLength={6}
                  placeholder="· · · · · ·"
                  value={otp}
                  onChange={e => setOtp(e.target.value.replace(/\D/g, ''))}
                  style={{ ...css.input, letterSpacing: '0.6em', fontSize: '1.6rem', textAlign: 'center', fontWeight: '800', paddingLeft: '1.5rem' }}
                  onFocus={e => { e.target.style.borderColor = fColor; e.target.style.boxShadow = `0 0 0 3px ${fColor}22`; }}
                  onBlur={e => { e.target.style.borderColor = '#e2e8f0'; e.target.style.boxShadow = 'none'; }}
                  autoFocus required
                />
              </div>

              {error && <div style={css.error}>⚠️ {error}</div>}

              <button type="submit" disabled={isLoading || otp.length !== 6}
                style={{ ...css.btnPrimary(hColor), opacity: (isLoading || otp.length !== 6) ? 0.65 : 1, cursor: (isLoading || otp.length !== 6) ? 'not-allowed' : 'pointer' }}>
                {isLoading
                  ? <><LoadingSpinner /> Verifying...</>
                  : <>{authMode === 'signup' ? 'Create Account' : 'Verify & Login'} <ShieldCheck size={17} /></>}
              </button>

              <div style={{ textAlign: 'center', fontSize: '0.8rem', color: '#64748b' }}>
                Didn't receive it?{' '}
                <button type="button" onClick={handleResend} disabled={resendTimer > 0 || isLoading}
                  style={{ background: 'none', border: 'none', color: resendTimer > 0 ? '#94a3b8' : fColor, fontWeight: '700', cursor: resendTimer > 0 ? 'default' : 'pointer', fontSize: '0.8rem', padding: 0 }}>
                  {resendTimer > 0 ? `Resend code in ${resendTimer}s` : 'Resend Email OTP'}
                </button>
              </div>
            </form>
          </div>
        </div>
        <style>{globalAnim}</style>
      </div>
    );
  }

  // ==========================================================================
  // STEP: SUCCESS
  // ==========================================================================
  return (
    <div style={css.overlay}>
      <div style={{ ...css.card, textAlign: 'center', padding: '2.5rem 1.75rem' }}>
        <div style={{ width: 70, height: 70, borderRadius: '50%', background: 'linear-gradient(135deg, #d1fae5, #6ee7b7)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem' }}>
          <ShieldCheck size={36} color="#059669" />
        </div>
        <div style={{ fontWeight: '800', fontSize: '1.25rem', color: '#0f172a' }}>
          {authMode === 'signup' ? '🎉 Account Created!' : '✅ Login Successful!'}
        </div>
        <div style={{ color: '#64748b', fontSize: '0.85rem', marginTop: '0.5rem' }}>
          {authMode === 'signup' ? `Welcome, ${fullName.split(' ')[0]}! Redirecting...` : 'Redirecting to your dashboard...'}
        </div>
      </div>
      <style>{globalAnim}</style>
    </div>
  );
}
