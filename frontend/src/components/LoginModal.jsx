import React, { useState } from 'react';
import { Phone, ShieldCheck, ArrowRight, Loader2, X, Sprout, Building2, ChevronLeft } from 'lucide-react';
import { sendOTP, verifyOTP } from '../services/apiService';
import { useAuth } from '../context/AuthContext';

const STEP = { ROLE: 'role', PHONE: 'phone', OTP: 'otp', SUCCESS: 'success' };

export default function LoginModal({ isOpen, onClose, onSuccess }) {
  const { login } = useAuth();

  const [step, setStep]           = useState(STEP.ROLE);
  const [role, setRole]           = useState('');
  const [phone, setPhone]         = useState('');
  const [otp, setOtp]             = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError]         = useState('');
  const [resendTimer, setResendTimer] = useState(0);

  if (!isOpen) return null;

  // ── Format phone to E.164 ──────────────────────────────────────────────────
  function normalizePhone(raw) {
    const digits = raw.replace(/\D/g, '');
    if (digits.startsWith('91') && digits.length === 12) return `+${digits}`;
    if (digits.length === 10) return `+91${digits}`;
    return `+${digits}`;
  }

  // ── Start resend countdown ─────────────────────────────────────────────────
  function startResendTimer() {
    setResendTimer(30);
    const iv = setInterval(() => {
      setResendTimer(prev => {
        if (prev <= 1) { clearInterval(iv); return 0; }
        return prev - 1;
      });
    }, 1000);
  }

  // ── Step 2: Send OTP ───────────────────────────────────────────────────────
  async function handleSendOTP(e) {
    e.preventDefault();
    setError('');
    const normalized = normalizePhone(phone);
    if (normalized.length < 10) {
      setError('Please enter a valid 10-digit mobile number.');
      return;
    }
    setIsLoading(true);
    try {
      await sendOTP(normalized, role);
      setPhone(normalized);
      setStep(STEP.OTP);
      startResendTimer();
    } catch (err) {
      setError(err.message || 'Failed to send OTP. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }

  // ── Step 3: Verify OTP ────────────────────────────────────────────────────
  async function handleVerifyOTP(e) {
    e.preventDefault();
    setError('');
    if (otp.length !== 6) {
      setError('Please enter the 6-digit OTP.');
      return;
    }
    setIsLoading(true);
    try {
      const authData = await verifyOTP(phone, otp, role);
      login(authData);
      setStep(STEP.SUCCESS);
      setTimeout(() => {
        onClose();
        if (onSuccess) onSuccess(authData.user);
      }, 1200);
    } catch (err) {
      setError(err.message || 'Invalid OTP. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }

  // ── Resend OTP ────────────────────────────────────────────────────────────
  async function handleResend() {
    if (resendTimer > 0) return;
    setError('');
    setIsLoading(true);
    try {
      await sendOTP(phone, role);
      startResendTimer();
    } catch (err) {
      setError(err.message || 'Could not resend OTP.');
    } finally {
      setIsLoading(false);
    }
  }

  // ── Reset to start ────────────────────────────────────────────────────────
  function resetModal() {
    setStep(STEP.ROLE); setRole(''); setPhone(''); setOtp(''); setError('');
  }

  // ─── Styles ───────────────────────────────────────────────────────────────
  const overlayStyle = {
    position: 'fixed', inset: 0, zIndex: 9999,
    background: 'rgba(0,0,0,0.55)',
    backdropFilter: 'blur(6px)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    padding: '1rem',
    animation: 'fadeIn 0.2s ease',
  };

  const cardStyle = {
    background: '#ffffff',
    borderRadius: '20px',
    width: '100%', maxWidth: '420px',
    boxShadow: '0 24px 80px rgba(0,0,0,0.18)',
    overflow: 'hidden',
    animation: 'slideUp 0.3s cubic-bezier(.22,.68,0,1.2)',
  };

  const headerStyle = {
    background: 'linear-gradient(135deg, #0f3b2e 0%, #196342 60%, #15803d 100%)',
    padding: '1.75rem 1.75rem 1.5rem',
    color: '#fff',
    position: 'relative',
  };

  const inputStyle = {
    width: '100%', boxSizing: 'border-box',
    border: '1.5px solid #e2e8f0',
    borderRadius: '12px',
    padding: '0.75rem 1rem',
    fontSize: '1rem',
    color: '#0f172a',
    outline: 'none',
    transition: 'border-color 0.2s',
    fontFamily: 'inherit',
  };

  const btnPrimaryStyle = {
    width: '100%',
    background: 'linear-gradient(135deg, #196342 0%, #15803d 100%)',
    color: '#fff',
    border: 'none', borderRadius: '12px',
    padding: '0.85rem 1rem',
    fontSize: '1rem', fontWeight: '700',
    cursor: isLoading ? 'not-allowed' : 'pointer',
    opacity: isLoading ? 0.75 : 1,
    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
    transition: 'all 0.2s ease',
    marginTop: '0.25rem',
  };

  // ─── ROLE SELECTION STEP ──────────────────────────────────────────────────
  if (step === STEP.ROLE) {
    return (
      <div style={overlayStyle} onClick={(e) => e.target === e.currentTarget && onClose()}>
        <div style={cardStyle}>
          <div style={headerStyle}>
            <button onClick={onClose} style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'rgba(255,255,255,0.15)', border: 'none', borderRadius: '8px', color: '#fff', cursor: 'pointer', padding: '0.35rem 0.5rem', display: 'flex' }}>
              <X size={18} />
            </button>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.5rem' }}>
              <div style={{ width: 36, height: 36, borderRadius: '10px', background: 'rgba(255,255,255,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.2"><path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"/></svg>
              </div>
              <span style={{ fontWeight: '800', fontSize: '1.2rem', letterSpacing: '-0.01em' }}>Neervalam</span>
            </div>
            <div style={{ fontSize: '1rem', fontWeight: '700', marginTop: '0.25rem' }}>Welcome back 👋</div>
            <div style={{ fontSize: '0.8rem', opacity: 0.75, marginTop: '0.25rem' }}>Who are you logging in as?</div>
          </div>

          <div style={{ padding: '1.5rem 1.75rem 1.75rem' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              {/* Farmer Option */}
              <button
                onClick={() => { setRole('farmer'); setStep(STEP.PHONE); setError(''); }}
                style={{
                  display: 'flex', alignItems: 'center', gap: '1rem',
                  border: '2px solid #e2e8f0', borderRadius: '14px',
                  padding: '1rem 1.25rem', cursor: 'pointer', background: '#fff',
                  textAlign: 'left', transition: 'all 0.2s ease',
                }}
                onMouseOver={e => { e.currentTarget.style.borderColor = '#10b981'; e.currentTarget.style.background = '#f0fdf4'; }}
                onMouseOut={e => { e.currentTarget.style.borderColor = '#e2e8f0'; e.currentTarget.style.background = '#fff'; }}
              >
                <div style={{ width: 46, height: 46, borderRadius: '12px', background: 'linear-gradient(135deg, #d1fae5, #a7f3d0)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Sprout size={22} color="#059669" />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: '700', color: '#0f172a', fontSize: '0.95rem' }}>Farmer</div>
                  <div style={{ fontSize: '0.78rem', color: '#64748b', marginTop: '0.15rem' }}>IoT dashboard, pump control, irrigation advisory</div>
                </div>
                <ArrowRight size={18} color="#94a3b8" />
              </button>

              {/* Government Option */}
              <button
                onClick={() => { setRole('government_official'); setStep(STEP.PHONE); setError(''); }}
                style={{
                  display: 'flex', alignItems: 'center', gap: '1rem',
                  border: '2px solid #e2e8f0', borderRadius: '14px',
                  padding: '1rem 1.25rem', cursor: 'pointer', background: '#fff',
                  textAlign: 'left', transition: 'all 0.2s ease',
                }}
                onMouseOver={e => { e.currentTarget.style.borderColor = '#0ea5e9'; e.currentTarget.style.background = '#f0f9ff'; }}
                onMouseOut={e => { e.currentTarget.style.borderColor = '#e2e8f0'; e.currentTarget.style.background = '#fff'; }}
              >
                <div style={{ width: 46, height: 46, borderRadius: '12px', background: 'linear-gradient(135deg, #dbeafe, #bfdbfe)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Building2 size={22} color="#0284c7" />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: '700', color: '#0f172a', fontSize: '0.95rem' }}>Government Official</div>
                  <div style={{ fontSize: '0.78rem', color: '#64748b', marginTop: '0.15rem' }}>State-level GIS map, district analytics, policy data</div>
                </div>
                <ArrowRight size={18} color="#94a3b8" />
              </button>
            </div>

            <p style={{ textAlign: 'center', fontSize: '0.72rem', color: '#94a3b8', marginTop: '1.25rem' }}>
              Secure OTP login · No password needed · Data encrypted
            </p>
          </div>
        </div>
        <style>{`
          @keyframes fadeIn { from { opacity:0 } to { opacity:1 } }
          @keyframes slideUp { from { opacity:0; transform:translateY(20px) } to { opacity:1; transform:translateY(0) } }
        `}</style>
      </div>
    );
  }

  // ─── PHONE NUMBER STEP ────────────────────────────────────────────────────
  if (step === STEP.PHONE) {
    const roleLabel = role === 'farmer' ? 'Farmer' : 'Government Official';
    const roleColor = role === 'farmer' ? '#059669' : '#0284c7';
    const roleBg = role === 'farmer' ? '#d1fae5' : '#dbeafe';
    const RoleIcon = role === 'farmer' ? Sprout : Building2;

    return (
      <div style={overlayStyle} onClick={(e) => e.target === e.currentTarget && onClose()}>
        <div style={cardStyle}>
          <div style={headerStyle}>
            <button onClick={resetModal} style={{ position: 'absolute', top: '1rem', left: '1rem', background: 'rgba(255,255,255,0.15)', border: 'none', borderRadius: '8px', color: '#fff', cursor: 'pointer', padding: '0.35rem 0.5rem', display: 'flex' }}>
              <ChevronLeft size={18} />
            </button>
            <button onClick={onClose} style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'rgba(255,255,255,0.15)', border: 'none', borderRadius: '8px', color: '#fff', cursor: 'pointer', padding: '0.35rem 0.5rem', display: 'flex' }}>
              <X size={18} />
            </button>
            <div style={{ paddingTop: '0.25rem' }}>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(255,255,255,0.15)', borderRadius: '999px', padding: '0.3rem 0.85rem', marginBottom: '0.6rem' }}>
                <RoleIcon size={14} />
                <span style={{ fontSize: '0.78rem', fontWeight: '600' }}>{roleLabel}</span>
              </div>
              <div style={{ fontSize: '1.1rem', fontWeight: '800' }}>Enter your mobile number</div>
              <div style={{ fontSize: '0.8rem', opacity: 0.75, marginTop: '0.25rem' }}>We'll send a one-time password via SMS</div>
            </div>
          </div>

          <div style={{ padding: '1.5rem 1.75rem 1.75rem' }}>
            <form onSubmit={handleSendOTP} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontWeight: '600', fontSize: '0.82rem', color: '#475569', marginBottom: '0.4rem' }}>
                  Mobile Number
                </label>
                <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                  <span style={{
                    position: 'absolute', left: '1rem',
                    fontWeight: '700', fontSize: '0.95rem', color: '#334155',
                    pointerEvents: 'none', userSelect: 'none'
                  }}>+91</span>
                  <input
                    type="tel"
                    inputMode="numeric"
                    maxLength={10}
                    placeholder="98765 43210"
                    value={phone.replace('+91', '')}
                    onChange={e => setPhone(e.target.value.replace(/\D/g, ''))}
                    style={{ ...inputStyle, paddingLeft: '3.25rem', letterSpacing: '0.1em' }}
                    onFocus={e => e.target.style.borderColor = roleColor}
                    onBlur={e => e.target.style.borderColor = '#e2e8f0'}
                    autoFocus
                    required
                  />
                  <Phone size={17} color="#94a3b8" style={{ position: 'absolute', right: '1rem', pointerEvents: 'none' }} />
                </div>
              </div>

              {error && (
                <div style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '10px', padding: '0.65rem 0.9rem', fontSize: '0.82rem', color: '#dc2626', display: 'flex', gap: '0.4rem', alignItems: 'flex-start' }}>
                  ⚠️ {error}
                </div>
              )}

              <button type="submit" style={{ ...btnPrimaryStyle, background: role === 'government_official' ? 'linear-gradient(135deg, #0369a1 0%, #0284c7 100%)' : btnPrimaryStyle.background }}>
                {isLoading ? <><Loader2 size={18} style={{ animation: 'spin 1s linear infinite' }} /> Sending OTP...</> : <>Send OTP <ArrowRight size={17} /></>}
              </button>
            </form>
          </div>
        </div>
        <style>{`
          @keyframes fadeIn { from { opacity:0 } to { opacity:1 } }
          @keyframes slideUp { from { opacity:0; transform:translateY(20px) } to { opacity:1; transform:translateY(0) } }
          @keyframes spin { to { transform: rotate(360deg) } }
        `}</style>
      </div>
    );
  }

  // ─── OTP ENTRY STEP ───────────────────────────────────────────────────────
  if (step === STEP.OTP) {
    const roleColor = role === 'farmer' ? '#059669' : '#0284c7';

    return (
      <div style={overlayStyle} onClick={(e) => e.target === e.currentTarget && onClose()}>
        <div style={cardStyle}>
          <div style={headerStyle}>
            <button onClick={() => setStep(STEP.PHONE)} style={{ position: 'absolute', top: '1rem', left: '1rem', background: 'rgba(255,255,255,0.15)', border: 'none', borderRadius: '8px', color: '#fff', cursor: 'pointer', padding: '0.35rem 0.5rem', display: 'flex' }}>
              <ChevronLeft size={18} />
            </button>
            <button onClick={onClose} style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'rgba(255,255,255,0.15)', border: 'none', borderRadius: '8px', color: '#fff', cursor: 'pointer', padding: '0.35rem 0.5rem', display: 'flex' }}>
              <X size={18} />
            </button>
            <div style={{ paddingTop: '0.25rem' }}>
              <ShieldCheck size={30} style={{ marginBottom: '0.4rem', opacity: 0.9 }} />
              <div style={{ fontSize: '1.1rem', fontWeight: '800' }}>Verify OTP</div>
              <div style={{ fontSize: '0.8rem', opacity: 0.75, marginTop: '0.25rem' }}>
                Sent to <strong>{phone}</strong>
              </div>
            </div>
          </div>

          <div style={{ padding: '1.5rem 1.75rem 1.75rem' }}>
            {/* Dev mode hint */}
            <div style={{ background: '#fefce8', border: '1px solid #fde68a', borderRadius: '10px', padding: '0.65rem 0.9rem', fontSize: '0.78rem', color: '#92400e', marginBottom: '1rem', display: 'flex', gap: '0.4rem' }}>
              🧪 <span><strong>Dev mode:</strong> OTP is always <code style={{ background: '#fef3c7', padding: '0.1rem 0.35rem', borderRadius: '4px', fontWeight: '700' }}>123456</code></span>
            </div>

            <form onSubmit={handleVerifyOTP} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontWeight: '600', fontSize: '0.82rem', color: '#475569', marginBottom: '0.4rem' }}>
                  6-Digit OTP
                </label>
                <input
                  type="text"
                  inputMode="numeric"
                  maxLength={6}
                  placeholder="1 2 3 4 5 6"
                  value={otp}
                  onChange={e => setOtp(e.target.value.replace(/\D/g, ''))}
                  style={{ ...inputStyle, letterSpacing: '0.45em', fontSize: '1.35rem', textAlign: 'center', fontWeight: '700', color: '#0f172a' }}
                  onFocus={e => e.target.style.borderColor = roleColor}
                  onBlur={e => e.target.style.borderColor = '#e2e8f0'}
                  autoFocus
                  required
                />
              </div>

              {error && (
                <div style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '10px', padding: '0.65rem 0.9rem', fontSize: '0.82rem', color: '#dc2626' }}>
                  ⚠️ {error}
                </div>
              )}

              <button type="submit" style={{ ...btnPrimaryStyle, background: role === 'government_official' ? 'linear-gradient(135deg, #0369a1 0%, #0284c7 100%)' : btnPrimaryStyle.background }}>
                {isLoading ? <><Loader2 size={18} style={{ animation: 'spin 1s linear infinite' }} /> Verifying...</> : <>Verify & Login <ShieldCheck size={17} /></>}
              </button>

              <div style={{ textAlign: 'center', fontSize: '0.8rem', color: '#64748b' }}>
                Didn't receive it?{' '}
                <button
                  type="button"
                  onClick={handleResend}
                  disabled={resendTimer > 0 || isLoading}
                  style={{ background: 'none', border: 'none', color: resendTimer > 0 ? '#94a3b8' : roleColor, fontWeight: '700', cursor: resendTimer > 0 ? 'default' : 'pointer', fontSize: '0.8rem', padding: 0 }}
                >
                  {resendTimer > 0 ? `Resend in ${resendTimer}s` : 'Resend OTP'}
                </button>
              </div>
            </form>
          </div>
        </div>
        <style>{`
          @keyframes fadeIn { from { opacity:0 } to { opacity:1 } }
          @keyframes slideUp { from { opacity:0; transform:translateY(20px) } to { opacity:1; transform:translateY(0) } }
          @keyframes spin { to { transform: rotate(360deg) } }
        `}</style>
      </div>
    );
  }

  // ─── SUCCESS STEP ─────────────────────────────────────────────────────────
  return (
    <div style={overlayStyle}>
      <div style={{ ...cardStyle, textAlign: 'center', padding: '2.5rem 1.75rem' }}>
        <div style={{ width: 68, height: 68, borderRadius: '50%', background: 'linear-gradient(135deg, #d1fae5, #6ee7b7)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem' }}>
          <ShieldCheck size={34} color="#059669" />
        </div>
        <div style={{ fontWeight: '800', fontSize: '1.2rem', color: '#0f172a' }}>Login Successful!</div>
        <div style={{ color: '#64748b', fontSize: '0.85rem', marginTop: '0.4rem' }}>Redirecting you now...</div>
      </div>
    </div>
  );
}
