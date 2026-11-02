import React from 'react';
import { Outlet } from 'react-router-dom';
import CustomerNavbar from '../components/CustomerNavbar';
import CustomerFooter from '../components/CustomerFooter';

export default function CustomerLayout() {
  return (
    <div className="customer-site">
      <CustomerNavbar />
      <main className="customer-content">
        <Outlet />
      </main>
      <CustomerFooter />
    </div>
  );
}

