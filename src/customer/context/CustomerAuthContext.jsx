import React, { createContext, useContext, useState, useEffect } from 'react';

const CustomerAuthContext = createContext();

const initialDemoCustomers = [
  {
    id: 'CUST-001',
    name: 'Brian Kasule',
    email: 'bkasule@yahoo.com',
    phone: '+256 701 452 890',
    password: 'password123',
    address: 'Plot 28, Kira Road, Kamwokya, Kampala',
    tier: 'Platinum',
    joinedDate: '2025-04-10'
  },
  {
    id: 'CUST-002',
    name: 'Florence Tumusiime',
    email: 'tumusiime.f@gmail.com',
    phone: '+256 772 889 123',
    password: 'password123',
    address: 'Apartment 4B, Kololo Heights, Kampala',
    tier: 'Silver',
    joinedDate: '2025-08-15'
  }
];

export function CustomerAuthProvider({ children }) {
  const [customerList, setCustomerList] = useState(() => {
    try {
      const saved = localStorage.getItem('dinepoint_customer_accounts');
      return saved ? JSON.parse(saved) : initialDemoCustomers;
    } catch (e) {
      return initialDemoCustomers;
    }
  });

  const [customerUser, setCustomerUser] = useState(() => {
    try {
      const saved = localStorage.getItem('dinepoint_active_customer');
      return saved ? JSON.parse(saved) : initialDemoCustomers[0]; // Default logged in as Brian for instant evaluation
    } catch (e) {
      return initialDemoCustomers[0];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('dinepoint_customer_accounts', JSON.stringify(customerList));
    } catch (e) {
      console.warn('LocalStorage error:', e);
    }
  }, [customerList]);

  useEffect(() => {
    try {
      if (customerUser) {
        localStorage.setItem('dinepoint_active_customer', JSON.stringify(customerUser));
      } else {
        localStorage.removeItem('dinepoint_active_customer');
      }
    } catch (e) {
      console.warn('LocalStorage error:', e);
    }
  }, [customerUser]);

  const customerLogin = (emailOrPhone, password) => {
    const trimmed = emailOrPhone.trim().toLowerCase();
    const matched = customerList.find(
      c => (c.email.toLowerCase() === trimmed || c.phone.includes(trimmed))
    );

    if (matched) {
      setCustomerUser(matched);
      return { success: true, user: matched };
    }

    // Demo fallback for any testing email
    const fallbackUser = {
      id: `CUST-${Date.now()}`,
      name: emailOrPhone.split('@')[0] || 'Valued Guest',
      email: emailOrPhone.includes('@') ? emailOrPhone : `${emailOrPhone}@guest.dinepoint.ug`,
      phone: emailOrPhone.includes('+') ? emailOrPhone : '+256 700 123 456',
      address: 'Kampala, Uganda',
      tier: 'Bronze',
      joinedDate: new Date().toISOString().split('T')[0]
    };

    setCustomerList(prev => [...prev, fallbackUser]);
    setCustomerUser(fallbackUser);
    return { success: true, user: fallbackUser };
  };

  const customerRegister = ({ name, email, phone, password, address = '' }) => {
    const existing = customerList.find(c => c.email.toLowerCase() === email.trim().toLowerCase());
    if (existing) {
      return { success: false, message: 'An account with this email already exists.' };
    }

    const newUser = {
      id: `CUST-${Date.now()}`,
      name,
      email,
      phone,
      password,
      address: address || 'Kampala, Uganda',
      tier: 'Bronze',
      joinedDate: new Date().toISOString().split('T')[0]
    };

    setCustomerList(prev => [...prev, newUser]);
    setCustomerUser(newUser);
    return { success: true, user: newUser };
  };

  const customerLogout = () => {
    setCustomerUser(null);
    localStorage.removeItem('dinepoint_active_customer');
  };

  const updateCustomerProfile = (updatedFields) => {
    if (!customerUser) return;
    const updated = { ...customerUser, ...updatedFields };
    setCustomerUser(updated);
    setCustomerList(prev => prev.map(c => (c.id === updated.id ? updated : c)));
  };

  return (
    <CustomerAuthContext.Provider
      value={{
        customerUser,
        isCustomerAuthenticated: !!customerUser,
        customerLogin,
        customerRegister,
        customerLogout,
        updateCustomerProfile,
        demoCustomers: customerList
      }}
    >
      {children}
    </CustomerAuthContext.Provider>
  );
}

export function useCustomerAuth() {
  const context = useContext(CustomerAuthContext);
  if (!context) {
    throw new Error('useCustomerAuth must be used within a CustomerAuthProvider');
  }
  return context;
}

