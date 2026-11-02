import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  Flame,
  User,
  Lock,
  ArrowRight,
  ShieldCheck,
  Eye,
  EyeOff
} from 'lucide-react';
import { useCustomerAuth } from '../context/CustomerAuthContext';

export default function CustomerLogin() {
  const { customerLogin, demoCustomers } = useCustomerAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [emailOrPhone, setEmailOrPhone] = useState('bkasule@yahoo.com');
  const [password, setPassword] = useState('password123');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const from = location.state?.from?.pathname || '/my-orders';

  const handleLogin = (e) => {
    e.preventDefault();
    if (!emailOrPhone) {
      setErrorMsg('Please enter your email or phone number');
      return;
    }

    const res = customerLogin(emailOrPhone, password);
    if (res.success) {
      navigate(from, { replace: true });
    } else {
      setErrorMsg(res.message || 'Login failed');
    }
  };

  const handleQuickLogin = (demo) => {
    customerLogin(demo.email, demo.password);
    navigate(from, { replace: true });
  };

  return (
    <div
      style={{
        minHeight: '80vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '40px 24px'
      }}
    >
      <div
        className="card"
        style={{
          width: '100%',
          maxWidth: '460px',
          padding: '36px',
          boxShadow: 'var(--shadow-lg)'
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <div
            style={{
              width: '52px',
              height: '52px',
              borderRadius: '14px',
              background: 'linear-gradient(135deg, var(--accent-gold), #997837)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--primary-forest)',
              margin: '0 auto 12px'
            }}
          >
            <Flame size={28} />
          </div>
          <h2 style={{ fontSize: '1.8rem', fontFamily: 'Playfair Display, serif', color: 'var(--primary-forest)', margin: '0 0 6px' }}>
            Customer Sign In
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', margin: 0 }}>
            Track your meals, view receipts & re-order easily.
          </p>
        </div>

        {errorMsg && (
          <div
            style={{
              backgroundColor: 'var(--status-cancelled-bg)',
              color: 'var(--status-cancelled-text)',
              padding: '10px 14px',
              borderRadius: '8px',
              fontSize: '0.85rem',
              marginBottom: '18px'
            }}
          >
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleLogin}>
          <div className="form-group">
            <label className="form-label">Email or Phone Number</label>
            <div style={{ position: 'relative' }}>
              <User size={18} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input
                type="text"
                className="form-control"
                style={{ paddingLeft: '42px' }}
                placeholder="bkasule@yahoo.com or +256..."
                value={emailOrPhone}
                onChange={e => setEmailOrPhone(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <div style={{ position: 'relative' }}>
              <Lock size={18} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input
                type={showPassword ? 'text' : 'password'}
                className="form-control"
                style={{ paddingLeft: '42px', paddingRight: '42px' }}
                placeholder="Enter your password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', padding: '2px' }}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            style={{ width: '100%', padding: '12px', fontSize: '0.98rem', marginTop: '10px' }}
          >
            Sign In to DinePoint <ArrowRight size={18} />
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '20px', fontSize: '0.88rem' }}>
          Don't have an account?{' '}
          <Link to="/customer/register" style={{ color: 'var(--primary-forest)', fontWeight: 700 }}>
            Register here
          </Link>
        </div>

        {/* Demo Fast Login Buttons */}
        <div style={{ marginTop: '28px', borderTop: '1px solid var(--border-grey)', paddingTop: '18px' }}>
          <div style={{ fontSize: '0.78rem', textTransform: 'uppercase', color: 'var(--text-muted)', textAlign: 'center', fontWeight: 700, marginBottom: '10px' }}>
            One-Click Demo Customers
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {demoCustomers.slice(0, 2).map(demo => (
              <button
                key={demo.id}
                type="button"
                className="btn btn-outline btn-sm"
                style={{ justifyContent: 'space-between', fontSize: '0.82rem' }}
                onClick={() => handleQuickLogin(demo)}
              >
                <span>👤 {demo.name} ({demo.tier} Member)</span>
                <span style={{ color: 'var(--primary-olive)', fontWeight: 700 }}>Login ➔</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

