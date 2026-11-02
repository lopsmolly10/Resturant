import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useCustomerAuth } from '../context/CustomerAuthContext';

export default function CustomerProtectedRoute({ children }) {
  const { isCustomerAuthenticated } = useCustomerAuth();
  const location = useLocation();

  if (!isCustomerAuthenticated) {
    return <Navigate to="/customer/login" state={{ from: location }} replace />;
  }

  return children;
}

