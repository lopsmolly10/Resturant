import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Flame,
  Lock,
  User,
  Eye,
  EyeOff,
  ShieldCheck,
  ArrowRight,
  Sparkles
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { initialUsers } from '../data/mockData';

export default function Login() {
  const { login, rememberMe, setRememberMe } = useAuth();
  const navigate = useNavigate();

  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('password123');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSignIn = (e) => {
    e.preventDefault();
    if (!username.trim()) {
      setErrorMsg('Please enter your username');
      return;
    }

    const res = login(username, password, rememberMe);
    if (res.success) {
      navigate('/');
    } else {
      setErrorMsg('Invalid login credentials');
    }
  };

  const handleQuickLoginAs = (user) => {
    setUsername(user.username);
    setPassword('demoPass123');
    login(user.username, 'demoPass123', true);
    navigate('/');
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'var(--bg-cream)',
        padding: '24px',
        position: 'relative'
      }}
    >
      <div
        className="card"
        style={{
          width: '100%',
          maxWidth: '460px',
          padding: '40px 36px',
          boxShadow: 'var(--shadow-xl)',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--border-grey)'
        }}
      >
        {/* Brand Header */}
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <div
            style={{
              width: '56px',
              height: '56px',
              margin: '0 auto 14px',
              borderRadius: '16px',
              background: 'linear-gradient(135deg, var(--accent-gold), #997837)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--primary-forest)',
              boxShadow: '0 4px 12px rgba(198, 161, 91, 0.35)'
            }}
          >
            <Flame size={32} />
          </div>
          <h1 style={{ fontSize: '1.85rem', margin: '0 0 6px', color: 'var(--primary-forest)', fontFamily: 'Playfair Display, serif' }}>
            Dine<span style={{ color: 'var(--accent-gold)' }}>Point</span>
          </h1>
          <p style={{ margin: 0, fontSize: '0.88rem', color: 'var(--text-muted)' }}>
            Restaurant Management & Information System
          </p>
        </div>

        {errorMsg && (
          <div
            style={{
              background: 'var(--status-cancelled-bg)',
              color: 'var(--status-cancelled-text)',
              border: '1px solid var(--status-cancelled-border)',
              padding: '10px 14px',
              borderRadius: '8px',
              fontSize: '0.85rem',
              marginBottom: '18px',
              textAlign: 'center'
            }}
          >
            {errorMsg}
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSignIn}>
          <div className="form-group">
            <label className="form-label">Username or Staff ID</label>
            <div style={{ position: 'relative' }}>
              <User
                size={18}
                style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}
              />
              <input
                type="text"
                className="form-control"
                style={{ paddingLeft: '42px' }}
                placeholder="Enter username (e.g. admin)"
                value={username}
                onChange={e => setUsername(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <div style={{ position: 'relative' }}>
              <Lock
                size={18}
                style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}
              />
              <input
                type={showPassword ? 'text' : 'password'}
                className="form-control"
                style={{ paddingLeft: '42px', paddingRight: '42px' }}
                placeholder="Enter password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: 'absolute',
                  right: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: 'var(--text-muted)',
                  padding: '4px'
                }}
                title={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '22px' }}>
            <label className="form-checkbox" style={{ fontSize: '0.85rem' }}>
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={e => setRememberMe(e.target.checked)}
              />
              <span>Remember me</span>
            </label>
            <a
              href="#forgot"
              onClick={(e) => { e.preventDefault(); alert('Demo: Use any staff role below for immediate login.'); }}
              style={{ fontSize: '0.82rem', color: 'var(--primary-olive)', fontWeight: 600 }}
            >
              Need help?
            </a>
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            style={{ width: '100%', padding: '12px', fontSize: '0.98rem' }}
          >
            Sign In to DinePoint <ArrowRight size={18} />
          </button>
        </form>

        {/* Quick Demo Staff Logins */}
        <div style={{ marginTop: '30px', borderTop: '1px solid var(--border-grey)', paddingTop: '20px' }}>
          <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '12px', textAlign: 'center' }}>
            Quick Demo Logins by Role
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px' }}>
            {initialUsers.slice(0, 4).map(u => (
              <button
                key={u.id}
                type="button"
                className="btn btn-outline btn-sm"
                style={{ justifyContent: 'flex-start', fontSize: '0.78rem', padding: '8px' }}
                onClick={() => handleQuickLoginAs(u)}
              >
                <ShieldCheck size={14} color="var(--primary-olive)" />
                <span style={{ fontWeight: 600 }}>{u.role}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

