import React, { useState } from 'react';
import {
  Settings as SettingsIcon,
  Store,
  Receipt,
  Clock,
  Shield,
  Save,
  RotateCcw,
  Check
} from 'lucide-react';
import PageHeader from '../components/PageHeader';
import { useRestaurant } from '../context/RestaurantContext';
import { restaurantDetails } from '../data/mockData';

export default function Settings() {
  const { showToast } = useRestaurant();

  const [restaurantName, setRestaurantName] = useState(restaurantDetails.name);
  const [address, setAddress] = useState(restaurantDetails.address);
  const [phone, setPhone] = useState(restaurantDetails.phone);
  const [email, setEmail] = useState(restaurantDetails.email);
  const [tin, setTin] = useState(restaurantDetails.tin);
  const [vatRate, setVatRate] = useState('18');
  const [currency, setCurrency] = useState('UGX (Ugandan Shilling)');
  const [openingTime, setOpeningTime] = useState('07:30');
  const [closingTime, setClosingTime] = useState('23:00');

  const handleSave = (e) => {
    e.preventDefault();
    showToast('Restaurant settings saved successfully!');
  };

  const handleResetData = () => {
    if (window.confirm('Reset all demo local storage data back to original state?')) {
      localStorage.clear();
      window.location.reload();
    }
  };

  return (
    <div className="settings-page">
      <PageHeader
        title="Restaurant Settings & Configuration"
        subtitle="Configure business details, tax rates, operating hours and POS parameters."
      >
        <button className="btn btn-outline" onClick={handleResetData}>
          <RotateCcw size={16} /> Reset Demo Data
        </button>
        <button className="btn btn-primary" onClick={handleSave}>
          <Save size={16} /> Save Changes
        </button>
      </PageHeader>

      <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        {/* Business Profile */}
        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '18px', borderBottom: '1px solid var(--border-grey)', paddingBottom: '12px' }}>
            <Store size={22} color="var(--royal-blue)" />
            <h3 style={{ margin: 0, fontSize: '1.25rem' }}>Restaurant Business Profile</h3>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Restaurant Name</label>
              <input
                type="text"
                className="form-control"
                value={restaurantName}
                onChange={e => setRestaurantName(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Tax Identification Number (TIN)</label>
              <input
                type="text"
                className="form-control"
                value={tin}
                onChange={e => setTin(e.target.value)}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Physical Address</label>
            <input
              type="text"
              className="form-control"
              value={address}
              onChange={e => setAddress(e.target.value)}
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Contact Phone(s)</label>
              <input
                type="text"
                className="form-control"
                value={phone}
                onChange={e => setPhone(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Official Email</label>
              <input
                type="email"
                className="form-control"
                value={email}
                onChange={e => setEmail(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Financial & Taxation Configuration */}
        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '18px', borderBottom: '1px solid var(--border-grey)', paddingBottom: '12px' }}>
            <Receipt size={22} color="var(--primary-blue)" />
            <h3 style={{ margin: 0, fontSize: '1.25rem' }}>Taxation & Currency Settings</h3>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Default Operating Currency</label>
              <input
                type="text"
                className="form-control"
                disabled
                value={currency}
              />
            </div>
            <div className="form-group">
              <label className="form-label">VAT Rate (%)</label>
              <input
                type="number"
                className="form-control"
                value={vatRate}
                onChange={e => setVatRate(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Operating Hours */}
        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '18px', borderBottom: '1px solid var(--border-grey)', paddingBottom: '12px' }}>
            <Clock size={22} color="var(--medium-blue)" />
            <h3 style={{ margin: 0, fontSize: '1.25rem' }}>Kitchen & Dining Service Hours</h3>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Opening Time</label>
              <input
                type="time"
                className="form-control"
                value={openingTime}
                onChange={e => setOpeningTime(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Closing Time</label>
              <input
                type="time"
                className="form-control"
                value={closingTime}
                onChange={e => setClosingTime(e.target.value)}
              />
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}

