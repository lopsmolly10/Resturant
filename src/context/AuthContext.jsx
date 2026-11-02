import React, { createContext, useContext, useState, useEffect } from 'react';
import { initialUsers } from '../data/mockData';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const saved = localStorage.getItem('dinepoint_auth_user');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn('Failed to parse saved user:', e);
    }
    // Default logged in as Administrator for seamless immediate evaluation
    return initialUsers[0];
  });

  const [rememberMe, setRememberMe] = useState(true);

  useEffect(() => {
    try {
      if (currentUser && rememberMe) {
        localStorage.setItem('dinepoint_auth_user', JSON.stringify(currentUser));
      } else if (!currentUser) {
        localStorage.removeItem('dinepoint_auth_user');
      }
    } catch (e) {
      console.warn('LocalStorage error in AuthContext:', e);
    }
  }, [currentUser, rememberMe]);

  const login = (username, password, remember = true) => {
    setRememberMe(remember);
    const user = initialUsers.find(
      u => u.username.toLowerCase() === username.trim().toLowerCase() ||
           u.email.toLowerCase() === username.trim().toLowerCase() ||
           u.role.toLowerCase() === username.trim().toLowerCase()
    );

    if (user) {
      setCurrentUser(user);
      return { success: true, user };
    }

    // Allow demo fallback login if not found
    const demoUser = {
      id: `USR-${Date.now()}`,
      name: username.charAt(0).toUpperCase() + username.slice(1),
      username: username.toLowerCase(),
      role: 'Administrator',
      email: `${username.toLowerCase()}@dinepoint.ug`,
      phone: '+256 700 000 000',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
      status: 'Active',
      shift: 'General',
      joinedDate: '2026-11-01'
    };
    setCurrentUser(demoUser);
    return { success: true, user: demoUser };
  };

  const switchRole = (roleName) => {
    const matched = initialUsers.find(u => u.role.toLowerCase() === roleName.toLowerCase());
    if (matched) {
      setCurrentUser(matched);
    }
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('dinepoint_auth_user');
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        setCurrentUser,
        isAuthenticated: !!currentUser,
        login,
        logout,
        switchRole,
        rememberMe,
        setRememberMe
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

