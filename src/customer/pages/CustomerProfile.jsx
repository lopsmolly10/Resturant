import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  User,
  Mail,
  Phone,
  MapPin,
  Award,
  Calendar,
  Save,
  ShoppingBag,
  LogOut
} from 'lucide-react';
import { useCustomerAuth } from '../context/CustomerAuthContext';
import { useRestaurant } from '../../context/RestaurantContext';
import { formatDate } from '../../utils/formatCurrency';

export default function CustomerProfile() {
  const { customerUser, updateCustomerProfile, customerLogout } = useCustomerAuth();
  const { orders, showToast } = useRestaurant();

  const [name, setName] = useState(customerUser?.name || '');
  const [email, setEmail] = useState(customerUser?.email || '');
  const [phone, setPhone] = useState(customerUser?.phone || '');
  const [address, setAddress] = useState(customerUser?.address || '');

  if (!customerUser) {
    return (
      <div className="customer-section" style={{ textAlign: 'center', padding: '80px 24px' }}>
        <h2>Profile Access</h2>
        <p>Please sign in to view and edit your profile settings.</p>
        <Link to="/customer/login" className="btn btn-primary" style={{ marginTop: '16px' }}>
          Sign In
        </Link>
      </div>
    );
  }

  const customerOrders = orders.filter(
    o => o.customerName.toLowerCase().includes(customerUser.name.toLowerCase()) ||
         o.customerPhone.includes(customerUser.phone)
  );

  const handleSave = (e) => {
    e.preventDefault();
    updateCustomerProfile({ name, email, phone, address });
    showToast('Customer profile updated successfully!');
  };

  return (
    <div className="customer-profile-page">
      <div className="customer-section" style={{ maxWidth: '820px' }}>
        <h1 style={{ fontSize: '2.4rem', fontFamily: 'Playfair Display, serif', color: 'var(--deep-blue)', marginBottom: '8px' }}>
          My Guest Profile
        </h1>
        <p style={{ color: 'var(--text-muted)', marginBottom: '32px' }}>
          Manage your contact information, default delivery destination and dining preferences.
        </p>

        {/* Member Tier Card */}
        <div
          className="card"
          style={{
            background: 'linear-gradient(135deg, var(--deep-blue) 0%, var(--primary-blue) 100%)',
            color: 'var(--white)',
            padding: '28px 32px',
            marginBottom: '32px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '16px'
          }}
        >
          <div>
            <span
              style={{
                backgroundColor: 'rgba(37, 99, 235, 0.25)',
                color: 'var(--light-blue)',
                border: '1px solid rgba(147, 197, 253, 0.4)',
                padding: '4px 12px',
                borderRadius: 'var(--radius-full)',
                fontSize: '0.78rem',
                fontWeight: 700,
                textTransform: 'uppercase'
              }}
            >
              ★ {customerUser.tier || 'Silver'} Member
            </span>
            <h2 style={{ fontSize: '1.8rem', color: 'var(--white)', margin: '8px 0 4px', fontFamily: 'Playfair Display, serif' }}>
              {customerUser.name}
            </h2>
            <p style={{ margin: 0, opacity: 0.85, fontSize: '0.88rem' }}>
              Member since {formatDate(customerUser.joinedDate || '2025-01-15')}
            </p>
          </div>

          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--light-blue)' }}>
              {customerOrders.length} Orders
            </div>
            <Link to="/my-orders" style={{ color: 'var(--white)', fontSize: '0.85rem', textDecoration: 'underline' }}>
              View Complete History ➔
            </Link>
          </div>
        </div>

        {/* Edit Profile Form */}
        <div className="card" style={{ padding: '32px', marginBottom: '28px' }}>
          <h3 style={{ fontSize: '1.25rem', fontFamily: 'Playfair Display, serif', color: 'var(--deep-blue)', marginBottom: '20px' }}>
            Personal Details
          </h3>

          <form onSubmit={handleSave}>
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <input
                type="text"
                className="form-control"
                value={name}
                onChange={e => setName(e.target.value)}
                required
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Email Address</label>
                <input
                  type="email"
                  className="form-control"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Phone Contact</label>
                <input
                  type="tel"
                  className="form-control"
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Saved Delivery Address</label>
              <input
                type="text"
                className="form-control"
                value={address}
                onChange={e => setAddress(e.target.value)}
                placeholder="e.g. Plot 28, Kira Road, Kamwokya, Kampala"
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '24px' }}>
              <button
                type="button"
                className="btn btn-outline btn-sm"
                style={{ color: '#c53030' }}
                onClick={customerLogout}
              >
                <LogOut size={16} /> Log Out
              </button>

              <button type="submit" className="btn btn-primary">
                <Save size={16} /> Save Changes
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

