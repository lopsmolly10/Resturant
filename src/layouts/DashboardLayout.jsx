import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import { useRestaurant } from '../context/RestaurantContext';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export default function DashboardLayout() {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { toasts, removeToast } = useRestaurant();

  return (
    <div className="dashboard-layout">
      {/* Navigation Sidebar */}
      <Sidebar
        collapsed={collapsed}
        setCollapsed={setCollapsed}
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
      />

      {/* Main Content Area */}
      <div className="main-content-wrapper">
        <Navbar onMobileMenuToggle={() => setMobileOpen(!mobileOpen)} />

        <main className="page-container">
          <Outlet />
        </main>
      </div>

      {/* Global Toast Alerts */}
      <div className="toast-container">
        {toasts.map(toast => (
          <div key={toast.id} className={`toast toast-${toast.type}`}>
            {toast.type === 'error' ? (
              <AlertCircle size={18} color="#fc8181" />
            ) : toast.type === 'info' ? (
              <Info size={18} color="#63b3ed" />
            ) : (
              <CheckCircle2 size={18} color="#68d391" />
            )}
            <span style={{ flex: 1 }}>{toast.message}</span>
            <button
              onClick={() => removeToast(toast.id)}
              style={{ color: 'rgba(255,255,255,0.7)', padding: '2px' }}
            >
              <X size={15} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

