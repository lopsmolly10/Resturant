import React from 'react';
import { NavLink, useNavigate, Link } from 'react-router-dom';
import {
  LayoutDashboard,
  UtensilsCrossed,
  ShoppingBag,
  ChefHat,
  CalendarDays,
  Boxes,
  Receipt,
  Users,
  TrendingUp,
  UserCog,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Flame,
  Globe
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useRestaurant } from '../context/RestaurantContext';

export default function Sidebar({ collapsed, setCollapsed, mobileOpen, setMobileOpen }) {
  const { currentUser, logout } = useAuth();
  const { orders } = useRestaurant();
  const navigate = useNavigate();

  // Active counts for badges
  const pendingOrdersCount = orders.filter(o => o.status === 'Pending').length;
  const kitchenTicketsCount = orders.filter(o => o.status === 'Pending' || o.status === 'Preparing').length;

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  const navLinks = [
    { to: '/admin', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/admin/menu', label: 'Menu Management', icon: UtensilsCrossed },
    { to: '/admin/orders', label: 'Orders', icon: ShoppingBag, badge: pendingOrdersCount },
    { to: '/admin/kitchen', label: 'Kitchen Display', icon: ChefHat, badge: kitchenTicketsCount },
    { to: '/admin/reservations', label: 'Reservations', icon: CalendarDays },
    { to: '/admin/inventory', label: 'Inventory', icon: Boxes },
    { to: '/admin/payments', label: 'Payments', icon: Receipt },
    { to: '/admin/customers', label: 'Customers', icon: Users },
    { to: '/admin/reports', label: 'Sales Reports', icon: TrendingUp },
    { to: '/admin/users', label: 'User Management', icon: UserCog },
    { to: '/admin/settings', label: 'Settings', icon: Settings }
  ];

  return (
    <>
      {mobileOpen && (
        <div
          className="sidebar-backdrop"
          onClick={() => setMobileOpen(false)}
        />
      )}

      <aside className={`sidebar ${collapsed ? 'collapsed' : ''} ${mobileOpen ? 'mobile-open' : ''}`}>
        {/* Header with Logo */}
        <div className="sidebar-header">
          <div className="sidebar-brand">
            <div className="brand-icon-wrapper">
              <Flame size={22} />
            </div>
            {!collapsed && (
              <div className="brand-text">
                <h2>Dine<span>Point</span></h2>
                <p>Restaurant Ops</p>
              </div>
            )}
          </div>

          <button
            type="button"
            className="sidebar-toggle-btn"
            onClick={() => setCollapsed(!collapsed)}
            title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
          </button>
        </div>

        {/* Navigation Links */}
        <nav className="sidebar-nav">
          {!collapsed && <div className="nav-section-label">Operations</div>}

          {navLinks.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === '/admin'}
                className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
                onClick={() => setMobileOpen(false)}
                title={collapsed ? item.label : undefined}
              >
                <Icon className="nav-icon" />
                {!collapsed && <span>{item.label}</span>}
                {!collapsed && item.badge > 0 && (
                  <span className="nav-badge">{item.badge}</span>
                )}
              </NavLink>
            );
          })}

          {/* Quick link to Customer Ordering Interface */}
          <div style={{ marginTop: 'auto', paddingTop: '10px' }}>
            <Link
              to="/"
              className="nav-item"
              style={{
                backgroundColor: 'rgba(37, 99, 235, 0.18)',
                color: 'var(--light-blue)',
                border: '1px solid rgba(37, 99, 235, 0.35)'
              }}
              title="Open Customer Food Ordering Website"
            >
              <Globe className="nav-icon" />
              {!collapsed && <span>Customer Website</span>}
            </Link>
          </div>
        </nav>

        {/* Footer Profile & Logout */}
        <div className="sidebar-footer">
          {!collapsed && currentUser && (
            <div className="user-quick-profile">
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                className="user-quick-avatar"
              />
              <div className="user-quick-info">
                <div className="user-quick-name">{currentUser.name}</div>
                <div className="user-quick-role">{currentUser.role}</div>
              </div>
            </div>
          )}

          <button
            type="button"
            className="btn-logout"
            onClick={handleLogout}
            title="Log Out"
          >
            <LogOut size={18} />
            {!collapsed && <span>Log Out</span>}
          </button>
        </div>
      </aside>
    </>
  );
}
