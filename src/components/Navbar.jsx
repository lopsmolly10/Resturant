import React, { useState, useRef, useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import {
  Bell,
  Calendar,
  Menu as MenuIcon,
  Search,
  ShieldCheck,
  ChevronDown,
  Globe
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useRestaurant } from '../context/RestaurantContext';
import SearchBar from './SearchBar';
import NotificationPanel from './NotificationPanel';

export default function Navbar({ onMobileMenuToggle }) {
  const { currentUser, switchRole } = useAuth();
  const { notifications, searchQuery, setSearchQuery } = useRestaurant();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showRoleMenu, setShowRoleMenu] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const notifRef = useRef(null);
  const roleRef = useRef(null);

  const unreadCount = notifications.filter(n => !n.read).length;

  // Derive page title from current route
  const getPageInfo = () => {
    const path = location.pathname;
    if (path === '/admin' || path === '/') {
      return { title: 'Executive Dashboard', subtitle: 'Overview & Real-time Operations' };
    }
    if (path.includes('/menu')) {
      return { title: 'Menu Management', subtitle: 'Catalog, Pricing & Kitchen Recipes' };
    }
    if (path.includes('/orders')) {
      return { title: 'Order Management', subtitle: 'Live Tables & Takeaway Tracker' };
    }
    if (path.includes('/kitchen')) {
      return { title: 'Kitchen Display (KDS)', subtitle: 'Real-time Cook Station Tickets' };
    }
    if (path.includes('/reservations')) {
      return { title: 'Table Reservations', subtitle: 'Floor Layout & Booking Schedule' };
    }
    if (path.includes('/inventory')) {
      return { title: 'Inventory & Stock', subtitle: 'Ingredients, Batches & Reorder Levels' };
    }
    if (path.includes('/payments')) {
      return { title: 'Payments & POS Receipts', subtitle: 'Transactions, Cash & Mobile Money' };
    }
    if (path.includes('/customers')) {
      return { title: 'Customer Directory', subtitle: 'Guest History, VIP Tiers & Loyalty' };
    }
    if (path.includes('/reports')) {
      return { title: 'Sales & Analytics', subtitle: 'Revenue Performance & Food Reports' };
    }
    if (path.includes('/users')) {
      return { title: 'User & Staff Management', subtitle: 'Roles, Access Control & Shifts' };
    }
    if (path.includes('/settings')) {
      return { title: 'Restaurant Settings', subtitle: 'Profile, Taxation & System Config' };
    }
    return { title: 'DinePoint Management', subtitle: 'Operations Portal' };
  };

  const pageInfo = getPageInfo();

  // Current formatted date
  const todayFormatted = new Date().toLocaleDateString('en-GB', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notifRef.current && !notifRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
      if (roleRef.current && !roleRef.current.contains(event.target)) {
        setShowRoleMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const rolesList = ['Administrator', 'Manager', 'Chef', 'Waiter', 'Cashier'];

  return (
    <header className="navbar">
      {/* Left: Mobile hamburger & Page Title */}
      <div className="navbar-left">
        <button
          type="button"
          className="btn-icon sidebar-mobile-toggle"
          onClick={onMobileMenuToggle}
          style={{ display: 'none' }}
          aria-label="Open Navigation Menu"
        >
          <MenuIcon size={20} />
        </button>

        <div className="navbar-page-title">
          <h1>{pageInfo.title}</h1>
          <p>{pageInfo.subtitle}</p>
        </div>
      </div>

      {/* Center: Search Field */}
      <div className="navbar-center">
        <SearchBar
          value={searchQuery}
          onChange={setSearchQuery}
          placeholder="Global search across DinePoint..."
        />
      </div>

      {/* Right: Storefront, Date, Notifications, Profile & Role Switcher */}
      <div className="navbar-right">
        {/* Customer Storefront Link */}
        <Link
          to="/"
          className="btn btn-outline btn-sm"
          style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem' }}
          title="Open Customer Food Ordering Website"
        >
          <Globe size={14} color="var(--primary-forest)" />
          <span>Customer Site</span>
        </Link>

        {/* Date Display */}
        <div className="date-badge">
          <Calendar size={15} color="var(--primary-olive)" />
          <span>{todayFormatted}</span>
        </div>

        {/* Notification Bell */}
        <div style={{ position: 'relative' }} ref={notifRef}>
          <button
            type="button"
            className="navbar-action-btn"
            onClick={() => setShowNotifications(!showNotifications)}
            title="Notifications"
          >
            <Bell size={19} />
            {unreadCount > 0 && (
              <span className="notif-badge-count">{unreadCount}</span>
            )}
          </button>

          {showNotifications && (
            <NotificationPanel onClose={() => setShowNotifications(false)} />
          )}
        </div>

        {/* User Profile Avatar with Quick Role Switcher */}
        {currentUser && (
          <div style={{ position: 'relative' }} ref={roleRef}>
            <div
              className="user-profile-badge"
              onClick={() => setShowRoleMenu(!showRoleMenu)}
              title="Click to switch role or view profile"
            >
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                className="user-avatar-img"
              />
              <div className="user-meta-text">
                <span className="user-meta-name">{currentUser.name}</span>
                <span className="user-meta-role">{currentUser.role}</span>
              </div>
              <ChevronDown size={14} color="var(--text-muted)" />
            </div>

            {/* Quick Switch Role Dropdown */}
            {showRoleMenu && (
              <div
                className="notification-panel-dropdown"
                style={{ width: '220px', right: 0 }}
              >
                <div className="notif-header" style={{ padding: '10px 16px' }}>
                  <h4 style={{ fontSize: '0.85rem' }}>Switch Active Role</h4>
                </div>
                <div style={{ padding: '6px' }}>
                  {rolesList.map(r => (
                    <button
                      key={r}
                      type="button"
                      className="btn"
                      style={{
                        width: '100%',
                        justifyContent: 'flex-start',
                        fontSize: '0.85rem',
                        padding: '8px 12px',
                        background: currentUser.role === r ? 'var(--primary-olive-light)' : 'transparent',
                        color: currentUser.role === r ? 'var(--primary-forest)' : 'var(--text-charcoal)',
                        fontWeight: currentUser.role === r ? '700' : '500'
                      }}
                      onClick={() => {
                        switchRole(r);
                        setShowRoleMenu(false);
                      }}
                    >
                      <ShieldCheck size={16} /> {r}
                    </button>
                  ))}
                  <div style={{ borderTop: '1px solid var(--border-grey)', margin: '6px 0' }} />
                  <button
                    type="button"
                    className="btn"
                    style={{
                      width: '100%',
                      justifyContent: 'flex-start',
                      fontSize: '0.85rem',
                      padding: '8px 12px',
                      color: 'var(--text-muted)'
                    }}
                    onClick={() => {
                      setShowRoleMenu(false);
                      navigate('/admin/users');
                    }}
                  >
                    View All Staff
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  );
}
