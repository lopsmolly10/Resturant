import React, { useState } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import {
  Flame,
  ShoppingBag,
  User,
  Shield,
  Menu as MenuIcon,
  X,
  LogOut,
  ChevronDown
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useCustomerAuth } from '../context/CustomerAuthContext';

export default function CustomerNavbar() {
  const { itemCount } = useCart();
  const { customerUser, customerLogout, isCustomerAuthenticated } = useCustomerAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <header className="customer-navbar">
      <div className="customer-nav-container">
        {/* Brand Logo */}
        <Link to="/" className="customer-brand">
          <div className="customer-brand-icon">
            <Flame size={24} />
          </div>
          <div className="customer-brand-text">
            <h1>Dine<span>Point</span></h1>
            <p>Fine Dining & Online Ordering</p>
          </div>
        </Link>

        {/* Navigation Links */}
        <nav className="customer-nav-links">
          <NavLink
            to="/"
            end
            className={({ isActive }) => `customer-nav-link ${isActive ? 'active' : ''}`}
          >
            Home
          </NavLink>
          <NavLink
            to="/customer/menu"
            className={({ isActive }) => `customer-nav-link ${isActive ? 'active' : ''}`}
          >
            Menu
          </NavLink>
          <a href="/#about" className="customer-nav-link">
            About Us
          </a>
          <NavLink
            to="/my-orders"
            className={({ isActive }) => `customer-nav-link ${isActive ? 'active' : ''}`}
          >
            My Orders
          </NavLink>
          <a href="/#contact" className="customer-nav-link">
            Contact
          </a>
        </nav>

        {/* Right Actions: Cart, Auth, Staff Portal */}
        <div className="customer-nav-actions">
          {/* Shopping Cart Icon */}
          <Link to="/cart" className="cart-btn-trigger" title="View Shopping Cart">
            <ShoppingBag size={20} />
            {itemCount > 0 && (
              <span className="cart-badge-pill">{itemCount}</span>
            )}
          </Link>

          {/* Customer Auth / Profile */}
          {isCustomerAuthenticated ? (
            <div style={{ position: 'relative' }}>
              <button
                type="button"
                className="btn btn-outline btn-sm"
                style={{ borderRadius: 'var(--radius-full)', padding: '6px 14px' }}
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
              >
                <User size={16} />
                <span>{customerUser.name.split(' ')[0]}</span>
                <ChevronDown size={14} />
              </button>

              {userDropdownOpen && (
                <div
                  style={{
                    position: 'absolute',
                    right: 0,
                    top: 'calc(100% + 8px)',
                    width: '200px',
                    backgroundColor: 'var(--white)',
                    border: '1px solid var(--border-grey)',
                    borderRadius: 'var(--radius-md)',
                    boxShadow: 'var(--shadow-lg)',
                    padding: '8px',
                    zIndex: 1000
                  }}
                >
                  <div style={{ padding: '8px 12px', borderBottom: '1px solid var(--border-grey)' }}>
                    <div style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--primary-blue)' }}>
                      {customerUser.name}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      {customerUser.phone}
                    </div>
                  </div>

                  <Link
                    to="/my-orders"
                    className="btn btn-sm"
                    style={{ width: '100%', justifyContent: 'flex-start', margin: '4px 0' }}
                    onClick={() => setUserDropdownOpen(false)}
                  >
                    My Orders
                  </Link>

                  <Link
                    to="/customer/profile"
                    className="btn btn-sm"
                    style={{ width: '100%', justifyContent: 'flex-start', margin: '4px 0' }}
                    onClick={() => setUserDropdownOpen(false)}
                  >
                    My Profile
                  </Link>

                  <div style={{ borderTop: '1px solid var(--border-grey)', margin: '4px 0' }} />

                  <button
                    type="button"
                    className="btn btn-sm"
                    style={{ width: '100%', justifyContent: 'flex-start', color: '#c53030' }}
                    onClick={() => {
                      customerLogout();
                      setUserDropdownOpen(false);
                      navigate('/');
                    }}
                  >
                    <LogOut size={14} /> Sign Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div style={{ display: 'flex', gap: '8px' }}>
              <Link to="/customer/login" className="btn btn-outline btn-sm">
                Sign In
              </Link>
              <Link to="/customer/register" className="btn btn-primary btn-sm">
                Register
              </Link>
            </div>
          )}

          {/* Direct Switcher to Staff / Admin Dashboard */}
          <Link
            to="/admin"
            className="staff-portal-btn"
            title="Open DinePoint Staff & Administrator Portal"
          >
            <Shield size={14} />
            <span>Staff Portal</span>
          </Link>

          {/* Mobile Menu Button */}
          <button
            type="button"
            className="btn-icon"
            style={{ display: 'none' }}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X size={20} /> : <MenuIcon size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div
          style={{
            backgroundColor: 'var(--white)',
            borderBottom: '1px solid var(--border-grey)',
            padding: '20px 24px',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px'
          }}
        >
          <Link
            to="/"
            className="customer-nav-link"
            onClick={() => setMobileMenuOpen(false)}
          >
            Home
          </Link>
          <Link
            to="/customer/menu"
            className="customer-nav-link"
            onClick={() => setMobileMenuOpen(false)}
          >
            Menu Catalog
          </Link>
          <Link
            to="/my-orders"
            className="customer-nav-link"
            onClick={() => setMobileMenuOpen(false)}
          >
            My Orders
          </Link>
          <Link
            to="/cart"
            className="customer-nav-link"
            onClick={() => setMobileMenuOpen(false)}
          >
            Shopping Cart ({itemCount})
          </Link>
          <Link
            to="/admin"
            className="staff-portal-btn"
            style={{ width: 'fit-content' }}
            onClick={() => setMobileMenuOpen(false)}
          >
            <Shield size={14} /> Staff / Admin Dashboard
          </Link>
        </div>
      )}
    </header>
  );
}

