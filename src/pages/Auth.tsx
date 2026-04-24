import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { BrandIcon, Btn, Input,  } from '../components/ui';
import { api } from '../api';
import { signInWithGoogle, getGoogleRedirectResult,  } from '../firebase';


type AuthTab = 'login' | 'signup';
type Page = 'auth' | 'forgot';

function isEmail(v: string) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v); }

function GoogleIcon() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
    </svg>
  );
}



// Shared social buttons
// Replace SocialBtns entirely:
function SocialBtns({ mode }: { mode: 'login' | 'signup' }) {
  const verb = mode === 'login' ? 'Continue' : 'Sign up';
  const btnStyle: React.CSSProperties = {
    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 9,
    padding: '10px 16px', border: '1px solid var(--border-dark)', borderRadius: 8,
    background: 'var(--white)', color: 'var(--text)', fontSize: 14, fontWeight: 400,
    fontFamily: 'var(--ff-sans)', cursor: 'pointer',
    transition: 'background .15s, border-color .15s', width: '100%',
  };
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
      <button style={btnStyle}
        onMouseEnter={e => { e.currentTarget.style.background = 'var(--bg)'; }}
        onMouseLeave={e => { e.currentTarget.style.background = 'var(--white)'; }}
        onClick={() => signInWithGoogle()}>
        <GoogleIcon /> {verb} with Google
      </button>
    </div>
  );
}

function Divider() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12, margin: '20px 0' }}>
      <div style={{ flex: 1, height: 1, background: 'var(--border)' }} />
      <span style={{ fontSize: 12, color: 'var(--text-3)', fontFamily: 'var(--ff-mono)', whiteSpace: 'nowrap' }}>or continue with email</span>
      <div style={{ flex: 1, height: 1, background: 'var(--border)' }} />
    </div>
  );
}

// ── Login Form ────────────────────────────────────────────────────────────────
function LoginForm({ onForgot, onSwitchSignup }: { onForgot: () => void; onSwitchSignup: () => void }) {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [pw, setPw] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  async function submit() {
    const errs: Record<string, string> = {};
    if (!isEmail(email)) errs.email = 'Please enter a valid email.';
    if (!pw) errs.pw = 'Password is required.';
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setLoading(true);
    try {
      const res = await api.login({ email, pw });
      localStorage.setItem('auth_token', res.token);
      navigate('/dashboard');
    } catch (e: any) {
      setErrors({ general: e.message });
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <div style={{ width: 44, height: 44, background: 'var(--bg)', border: '1px solid var(--border-dark)', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 18 }}>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--orange)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/><polyline points="10 17 15 12 10 7"/><line x1="15" y1="12" x2="3" y2="12"/>
        </svg>
      </div>
      <h1 style={{ fontFamily: 'var(--ff-serif)', fontSize: 28, fontWeight: 400, color: 'var(--text)', marginBottom: 6 }}>
        Welcome <em style={{ fontStyle: 'italic', color: 'var(--orange)' }}>back</em>
      </h1>
      <p style={{ fontSize: 14, color: 'var(--text-2)', fontWeight: 300, marginBottom: 24, lineHeight: 1.55 }}>
        Log in to your campaigns and insights.
      </p>

      <SocialBtns mode="login" />
      <Divider />

      {errors.general && <div style={{ background: 'var(--red-bg)', border: '1px solid var(--red-border)', borderRadius: 8, padding: '10px 13px', fontSize: 13, color: 'var(--red)', marginBottom: 14 }}>{errors.general}</div>}

      <Input label="Email address" type="email" placeholder="you@company.com" value={email} onChange={e => setEmail(e.target.value)} error={errors.email} />

      <div style={{ marginBottom: 18 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
          <label style={{ fontSize: 13, fontWeight: 500, color: 'var(--text)' }}>Password</label>
          <button onClick={onForgot} style={{ fontSize: 12, color: 'var(--text-3)', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'var(--ff-sans)' }}>Forgot password?</button>
        </div>
        <div style={{ position: 'relative' }}>
          <input type={showPw ? 'text' : 'password'} placeholder="Your password" value={pw} onChange={e => setPw(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && submit()}
            style={{ width: '100%', padding: '10px 40px 10px 13px', border: `1px solid ${errors.pw ? 'var(--red)' : 'var(--border-dark)'}`, borderRadius: 8, background: 'var(--white)', color: 'var(--text)', fontSize: 14, fontWeight: 300, outline: 'none', fontFamily: 'var(--ff-sans)' }} />
          <button onClick={() => setShowPw(v => !v)} style={{ position: 'absolute', right: 11, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-3)', display: 'flex', alignItems: 'center' }}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              {showPw ? <><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></> : <><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></>}
            </svg>
          </button>
        </div>
        {errors.pw && <p style={{ fontSize: 12, color: 'var(--red)', marginTop: 4 }}>{errors.pw}</p>}
      </div>

      <Btn onClick={submit} loading={loading} style={{ width: '100%', fontSize: 14, padding: '11px 20px', borderRadius: 8, justifyContent: 'center' }}>
        {!loading && 'Log in'}
      </Btn>
      <p style={{ textAlign: 'center', marginTop: 18, fontSize: 13, color: 'var(--text-3)' }}>
        No account?{' '}
        <button onClick={onSwitchSignup} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-2)', fontWeight: 500, fontSize: 13, fontFamily: 'var(--ff-sans)' }}>
          Sign up free →
        </button>
      </p>
    </>
  );
}

// ── Signup Form ───────────────────────────────────────────────────────────────
function SignupForm({ onSwitchLogin }: { onSwitchLogin: () => void }) {
  const navigate = useNavigate();
  const [form, setForm] = useState({ fn: '', ln: '', email: '', pw: '' });
  const [terms, setTerms] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [strength, setStrength] = useState(0);

  function calcStrength(v: string) {
    let s = 0;
    if (v.length >= 8) s++;
    if (v.length >= 12) s++;
    if (/[A-Z]/.test(v) && /[0-9]/.test(v)) s++;
    if (/[^A-Za-z0-9]/.test(v)) s++;
    return s;
  }

  const strengthLabels = ['', 'Weak', 'Fair', 'Good', 'Strong'];
  const strengthColors = ['', '#EF4444', '#F59E0B', '#10B981', '#059669'];

  async function submit() {
    const errs: Record<string, string> = {};
    if (!form.fn.trim()) errs.fn = 'Required';
    if (!form.ln.trim()) errs.ln = 'Required';
    if (!isEmail(form.email)) errs.email = 'Please enter a valid email.';
    if (form.pw.length < 8) errs.pw = 'Must be at least 8 characters.';
    if (!terms) errs.terms = 'Please accept the terms to continue.';
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setLoading(true);
    try {
      const res = await api.signup({
        first_name: form.fn,
        last_name: form.ln,
        email: form.email,
        pw: form.pw
      });
      localStorage.setItem('auth_token', res.token);
      navigate('/dashboard');
    } catch (e: any) {
      setErrors({ general: e.message });
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <div style={{ width: 44, height: 44, background: 'var(--bg)', border: '1px solid var(--border-dark)', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 18 }}>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--orange)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
        </svg>
      </div>
      <h1 style={{ fontFamily: 'var(--ff-serif)', fontSize: 28, fontWeight: 400, color: 'var(--text)', marginBottom: 6 }}>
        Start <em style={{ fontStyle: 'italic', color: 'var(--orange)' }}>crawling</em>
      </h1>
      <p style={{ fontSize: 14, color: 'var(--text-2)', fontWeight: 300, marginBottom: 24 }}>Free account. No credit card required.</p>

      <SocialBtns mode="signup" />
      <Divider />

      {errors.general && <div style={{ background: 'var(--red-bg)', border: '1px solid var(--red-border)', borderRadius: 8, padding: '10px 13px', fontSize: 13, color: 'var(--red)', marginBottom: 14 }}>{errors.general}</div>}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
        <Input label="First name" placeholder="John" value={form.fn} onChange={e => setForm(f => ({ ...f, fn: e.target.value }))} error={errors.fn} />
        <Input label="Last name" placeholder="Smith" value={form.ln} onChange={e => setForm(f => ({ ...f, ln: e.target.value }))} error={errors.ln} />
      </div>
      <Input label="Work email" type="email" placeholder="you@company.com" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} error={errors.email} />

      <div style={{ marginBottom: 14 }}>
        <label style={{ fontSize: 13, fontWeight: 500, color: 'var(--text)', display: 'block', marginBottom: 5 }}>Password</label>
        <input type="password" placeholder="Create a strong password" value={form.pw}
          onChange={e => { setForm(f => ({ ...f, pw: e.target.value })); setStrength(calcStrength(e.target.value)); }}
          style={{ width: '100%', padding: '10px 13px', border: `1px solid ${errors.pw ? 'var(--red)' : 'var(--border-dark)'}`, borderRadius: 8, background: 'var(--white)', color: 'var(--text)', fontSize: 14, fontWeight: 300, outline: 'none', fontFamily: 'var(--ff-sans)' }} />
        {errors.pw && <p style={{ fontSize: 12, color: 'var(--red)', marginTop: 4 }}>{errors.pw}</p>}
        {form.pw && (
          <div style={{ marginTop: 7 }}>
            <div style={{ display: 'flex', gap: 4, marginBottom: 3 }}>
              {[1,2,3,4].map(i => <div key={i} style={{ flex: 1, height: 3, borderRadius: 100, background: i <= strength ? strengthColors[strength] : 'var(--bg-2)', transition: 'background .3s' }} />)}
            </div>
            <span style={{ fontSize: 11, fontFamily: 'var(--ff-mono)', color: strengthColors[strength] }}>{strengthLabels[strength]}</span>
          </div>
        )}
      </div>

      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 9, marginBottom: 18 }}>
        <input type="checkbox" checked={terms} onChange={e => setTerms(e.target.checked)} style={{ width: 15, height: 15, marginTop: 2, accentColor: 'var(--orange)', cursor: 'pointer', flexShrink: 0 }} />
        <label style={{ fontSize: 13, color: 'var(--text-2)', fontWeight: 300, lineHeight: 1.5, cursor: 'pointer' }} onClick={() => setTerms(v => !v)}>
          I agree to the{' '}
          <a href="#" style={{ color: 'var(--text)', fontWeight: 400, borderBottom: '1px solid var(--border-dark)' }}>Terms of Service</a>
          {' '}and{' '}
          <a href="#" style={{ color: 'var(--text)', fontWeight: 400, borderBottom: '1px solid var(--border-dark)' }}>Privacy Policy</a>
        </label>
      </div>
      {errors.terms && <p style={{ fontSize: 12, color: 'var(--red)', marginBottom: 12, marginTop: -10 }}>{errors.terms}</p>}

      <Btn onClick={submit} loading={loading} style={{ width: '100%', fontSize: 14, padding: '11px 20px', borderRadius: 8, justifyContent: 'center' }}>
        {!loading && 'Create account'}
      </Btn>
      <p style={{ textAlign: 'center', marginTop: 18, fontSize: 13, color: 'var(--text-3)' }}>
        Already have an account?{' '}
        <button onClick={onSwitchLogin} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-2)', fontWeight: 500, fontSize: 13, fontFamily: 'var(--ff-sans)' }}>Log in →</button>
      </p>
    </>
  );
}

// ── Forgot Password ───────────────────────────────────────────────────────────
function ForgotForm({ onBack }: { onBack: () => void }) {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');

  async function submit() {
    if (!isEmail(email)) { setError('Please enter a valid email.'); return; }
    setLoading(true);
    try {
      await api.forgotPassword(email);
      setSent(true);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  if (sent) return (
    <div style={{ textAlign: 'center' }}>
      <div style={{ width: 52, height: 52, background: 'var(--green-bg)', border: '1px solid var(--green-border)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#166534" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
      </div>
      <h2 style={{ fontFamily: 'var(--ff-serif)', fontSize: 26, fontWeight: 400, color: 'var(--text)', marginBottom: 8 }}>
        Check your <em style={{ fontStyle: 'italic', color: 'var(--orange)' }}>inbox</em>
      </h2>
      <p style={{ fontSize: 14, color: 'var(--text-2)', fontWeight: 300, lineHeight: 1.6, marginBottom: 24 }}>
        We sent a reset link to <strong>{email}</strong>. It expires in 15 minutes.
      </p>
      <Btn onClick={onBack} style={{ width: '100%', fontSize: 14, padding: '11px 20px', borderRadius: 8, justifyContent: 'center' }}>Back to login</Btn>
    </div>
  );

  return (
    <>
      <button onClick={onBack} style={{ display: 'inline-flex', alignItems: 'center', gap: 5, fontSize: 13, color: 'var(--text-3)', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'var(--ff-sans)', marginBottom: 20, padding: 0 }}>
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
        Back to login
      </button>
      <div style={{ width: 44, height: 44, background: 'var(--bg)', border: '1px solid var(--border-dark)', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 18 }}>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--orange)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
        </svg>
      </div>
      <h1 style={{ fontFamily: 'var(--ff-serif)', fontSize: 28, fontWeight: 400, color: 'var(--text)', marginBottom: 6 }}>
        Reset your <em style={{ fontStyle: 'italic', color: 'var(--orange)' }}>password</em>
      </h1>
      <p style={{ fontSize: 14, color: 'var(--text-2)', fontWeight: 300, marginBottom: 24 }}>Enter your email and we'll send a reset link right away.</p>
      <Input label="Email address" type="email" placeholder="you@company.com" value={email} onChange={e => setEmail(e.target.value)} error={error} onKeyDown={(e: React.KeyboardEvent) => e.key === 'Enter' && submit()} />
      <Btn onClick={submit} loading={loading} style={{ width: '100%', fontSize: 14, padding: '11px 20px', borderRadius: 8, justifyContent: 'center' }}>
        {!loading && 'Send reset link'}
      </Btn>
    </>
  );
}

// ── Auth Page ─────────────────────────────────────────────────────────────────
export default function Auth() {
  const [tab, setTab] = useState<AuthTab>('login');
  const [page, setPage] = useState<Page>('auth');
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    if (searchParams.get('tab') === 'signup') setTab('signup');
    if (searchParams.get('page') === 'forgot') setPage('forgot');
  }, [searchParams]);

  useEffect(() => {
    getGoogleRedirectResult().then(async (result) => {
      if (!result?.user) return;
      const firebaseToken = await result.user.getIdToken();
      try {
        const res = await api.authFirebase({
          firebase_token: firebaseToken,
          first_name: result.user.displayName?.split(' ')[0] || 'User',
          last_name: result.user.displayName?.split(' ').slice(1).join(' ') || '',
          email: result.user.email || '',
        });
        localStorage.setItem('auth_token', res.token);
        navigate('/dashboard');
      } catch (e: any) {
        console.error('Auth failed:', e.message);
      }
    }).catch(() => {});
  }, [navigate]);

  const cardStyle: React.CSSProperties = {
    background: 'var(--white)', border: '1px solid var(--border)', borderRadius: 16,
    width: '100%', maxWidth: 420, padding: 40,
    boxShadow: '0 2px 24px rgba(0,0,0,0.04)',
    animation: 'fadeUp .4s cubic-bezier(.22,1,.36,1)',
  };

  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh', position: 'relative' }}>
      <div className="grid-bg" />

      {/* Nav */}
      <nav style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100, background: 'rgba(247,246,242,0.9)', backdropFilter: 'blur(16px)', borderBottom: '1px solid var(--border)', height: 60, display: 'flex', alignItems: 'center', padding: '0 32px', justifyContent: 'space-between' }}>
        <a href="/" style={{ display: 'flex', alignItems: 'center', gap: 8, textDecoration: 'none', color: 'var(--text)', fontWeight: 600, fontSize: 15 }}>
          <BrandIcon size={28} /> Campaign Intelligence
        </a>
        <button onClick={() => navigate('/')} style={{ fontSize: 13, color: 'var(--text-3)', background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4, fontFamily: 'var(--ff-sans)' }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
          Back to home
        </button>
      </nav>

      {/* Card */}
      <div style={{ position: 'relative', zIndex: 1, minHeight: '100vh', display: 'flex', alignItems: 'flex-start', justifyContent: 'center', padding: '100px 24px 60px' }}>
        <div style={cardStyle}>
          {page === 'forgot' ? (
            <ForgotForm onBack={() => setPage('auth')} />
          ) : (
            <>
              {/* Tab row */}
              <div style={{ display: 'flex', background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 10, padding: 4, marginBottom: 28, gap: 4 }}>
                {(['login', 'signup'] as AuthTab[]).map(t => (
                  <button key={t} onClick={() => setTab(t)} style={{
                    flex: 1, padding: 8, borderRadius: 7,
                    border: tab === t ? '1px solid var(--border)' : '1px solid transparent',
                    background: tab === t ? 'var(--white)' : 'transparent',
                    fontSize: 13, fontWeight: tab === t ? 500 : 400,
                    color: tab === t ? 'var(--text)' : 'var(--text-2)',
                    cursor: 'pointer', fontFamily: 'var(--ff-sans)',
                    boxShadow: tab === t ? '0 1px 3px rgba(0,0,0,0.08)' : 'none',
                    transition: 'all .15s',
                  }}>
                    {t === 'login' ? 'Log in' : 'Sign up'}
                  </button>
                ))}
              </div>

              {tab === 'login'
                ? <LoginForm onForgot={() => setPage('forgot')} onSwitchSignup={() => setTab('signup')} />
                : <SignupForm onSwitchLogin={() => setTab('login')} />
              }
            </>
          )}
        </div>
      </div>
    </div>
  );
}