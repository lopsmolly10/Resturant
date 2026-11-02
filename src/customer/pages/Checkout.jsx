import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  ArrowLeft,
  ArrowRight,
  Utensils,
  Package,
  Truck,
  CheckCircle,
  ShieldCheck,
  MapPin,
  Phone,
  User,
  Mail
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useCustomerAuth } from '../context/CustomerAuthContext';
import { formatCurrency } from '../../utils/formatCurrency';

export default function Checkout() {
  const { cartItems, subtotal, deliveryFee, grandTotal, deliveryType, setDeliveryType } = useCart();
  const { customerUser } = useCustomerAuth();
  const navigate = useNavigate();

  // Form State initialized with logged-in user profile if present
  const [fullName, setFullName] = useState(customerUser?.name || 'Brian Kasule');
  const [phone, setPhone] = useState(customerUser?.phone || '+256 701 452 890');
  const [email, setEmail] = useState(customerUser?.email || 'bkasule@yahoo.com');
  const [tableNumber, setTableNumber] = useState('Table 4');
  const [reservationRef, setReservationRef] = useState('');
  const [deliveryAddress, setDeliveryAddress] = useState(customerUser?.address || 'Plot 28, Kira Road, Kamwokya, Kampala');
  const [specialInstructions, setSpecialInstructions] = useState('');

  if (cartItems.length === 0) {
    navigate('/cart');
    return null;
  }

  const handleProceedToPayment = (e) => {
    e.preventDefault();
    if (!fullName || !phone) {
      alert('Please fill in your name and phone number');
      return;
    }

    // Pass checkout details to Payment page
    const checkoutDetails = {
      fullName,
      phone,
      email,
      orderType: deliveryType,
      tableNumber: deliveryType === 'Dine-In' ? (reservationRef ? `${tableNumber} (Ref: ${reservationRef})` : tableNumber) : deliveryType,
      deliveryAddress: deliveryType === 'Delivery' ? deliveryAddress : '',
      specialInstructions,
      items: cartItems,
      subtotal,
      deliveryFee,
      grandTotal
    };

    sessionStorage.setItem('dinepoint_pending_checkout', JSON.stringify(checkoutDetails));
    navigate('/payment');
  };

  return (
    <div className="customer-checkout-page">
      <div className="customer-section">
        <Link
          to="/cart"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            color: 'var(--primary-blue)',
            fontWeight: 600,
            fontSize: '0.92rem',
            marginBottom: '24px',
            textDecoration: 'none'
          }}
        >
          <ArrowLeft size={18} /> Back to Cart
        </Link>

        <h1 style={{ fontSize: '2.4rem', fontFamily: 'Playfair Display, serif', color: 'var(--deep-blue)', marginBottom: '8px' }}>
          Checkout & Dining Information
        </h1>
        <p style={{ color: 'var(--text-muted)', marginBottom: '32px' }}>
          Provide your contact details and dining preferences to complete your meal order.
        </p>

        <form onSubmit={handleProceedToPayment}>
          <div className="checkout-grid">
            {/* Form Fields Card */}
            <div className="checkout-form-card">
              {/* Dining Mode Selection */}
              <div style={{ marginBottom: '24px' }}>
                <label className="form-label" style={{ fontSize: '1rem', marginBottom: '12px' }}>
                  1. Select Order Type <span className="required">*</span>
                </label>
                <div className="dining-type-selector">
                  <div
                    className={`dining-type-btn ${deliveryType === 'Dine-In' ? 'active' : ''}`}
                    onClick={() => setDeliveryType('Dine-In')}
                  >
                    <Utensils size={24} />
                    <span>Dine-In</span>
                    <small style={{ fontWeight: 400, fontSize: '0.75rem', opacity: 0.85 }}>Serve at table</small>
                  </div>

                  <div
                    className={`dining-type-btn ${deliveryType === 'Takeaway' ? 'active' : ''}`}
                    onClick={() => setDeliveryType('Takeaway')}
                  >
                    <Package size={24} />
                    <span>Takeaway</span>
                    <small style={{ fontWeight: 400, fontSize: '0.75rem', opacity: 0.85 }}>Counter pickup</small>
                  </div>

                  <div
                    className={`dining-type-btn ${deliveryType === 'Delivery' ? 'active' : ''}`}
                    onClick={() => setDeliveryType('Delivery')}
                  >
                    <Truck size={24} />
                    <span>Delivery</span>
                    <small style={{ fontWeight: 400, fontSize: '0.75rem', opacity: 0.85 }}>Kampala doorstep (+5k)</small>
                  </div>
                </div>
              </div>

              {/* Conditional Location Details */}
              {deliveryType === 'Dine-In' && (
                <div style={{ backgroundColor: 'var(--surface-alt)', padding: '18px', borderRadius: 'var(--radius-md)', marginBottom: '24px' }}>
                  <h4 style={{ fontSize: '0.95rem', color: 'var(--deep-blue)', marginBottom: '12px' }}>
                    Table Location:
                  </h4>
                  <div className="form-row">
                    <div className="form-group" style={{ margin: 0 }}>
                      <label className="form-label">Table Number</label>
                      <select
                        className="form-control"
                        value={tableNumber}
                        onChange={e => setTableNumber(e.target.value)}
                      >
                        <option value="Table 1">Table 1 (Main Hall)</option>
                        <option value="Table 2">Table 2 (Main Hall)</option>
                        <option value="Table 3">Table 3 (Main Hall)</option>
                        <option value="Table 4">Table 4 (Garden Terrace)</option>
                        <option value="Table 5">Table 5 (Garden Terrace)</option>
                        <option value="Table 6">Table 6 (Garden Terrace)</option>
                        <option value="Table 7">Table 7 (VIP Lounge)</option>
                        <option value="Table 8">Table 8 (VIP Lounge)</option>
                        <option value="Table 9">Table 9 (Balcony)</option>
                        <option value="Table 10">Table 10 (Balcony)</option>
                      </select>
                    </div>

                    <div className="form-group" style={{ margin: 0 }}>
                      <label className="form-label">Reservation Reference (Optional)</label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="e.g. RES-401"
                        value={reservationRef}
                        onChange={e => setReservationRef(e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              )}

              {deliveryType === 'Delivery' && (
                <div style={{ backgroundColor: 'var(--surface-alt)', padding: '18px', borderRadius: 'var(--radius-md)', marginBottom: '24px' }}>
                  <h4 style={{ fontSize: '0.95rem', color: 'var(--deep-blue)', marginBottom: '12px' }}>
                    Delivery Destination:
                  </h4>
                  <div className="form-group" style={{ margin: 0 }}>
                    <label className="form-label">Street Address & Landmark <span className="required">*</span></label>
                    <input
                      type="text"
                      className="form-control"
                      required
                      placeholder="e.g. Plot 12, Clement Hill Road, Nakasero (Near Jubilee Insurance)"
                      value={deliveryAddress}
                      onChange={e => setDeliveryAddress(e.target.value)}
                    />
                  </div>
                </div>
              )}

              {/* Customer Contact Details */}
              <div style={{ marginBottom: '24px' }}>
                <label className="form-label" style={{ fontSize: '1rem', marginBottom: '12px' }}>
                  2. Contact & Billing Information
                </label>

                <div className="form-group">
                  <label className="form-label">Full Name <span className="required">*</span></label>
                  <input
                    type="text"
                    className="form-control"
                    required
                    placeholder="e.g. Brian Kasule"
                    value={fullName}
                    onChange={e => setFullName(e.target.value)}
                  />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Phone Number (MTN / Airtel) <span className="required">*</span></label>
                    <input
                      type="tel"
                      className="form-control"
                      required
                      placeholder="+256 700 000 000"
                      value={phone}
                      onChange={e => setPhone(e.target.value)}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Email Address (For receipt)</label>
                    <input
                      type="email"
                      className="form-control"
                      placeholder="customer@domain.com"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                    />
                  </div>
                </div>
              </div>

              {/* Special Instructions */}
              <div className="form-group">
                <label className="form-label">3. Special Dining Instructions (Optional)</label>
                <textarea
                  className="form-control"
                  placeholder="e.g. Serve drinks first, extra napkins, cutlery required, allergy to peanuts..."
                  rows="3"
                  value={specialInstructions}
                  onChange={e => setSpecialInstructions(e.target.value)}
                />
              </div>
            </div>

            {/* Order Review Sidebar */}
            <div className="cart-summary-card">
              <h3 className="cart-summary-title">Review Items ({cartItems.length})</h3>

              <div style={{ maxHeight: '240px', overflowY: 'auto', marginBottom: '16px' }}>
                {cartItems.map((it, idx) => (
                  <div
                    key={idx}
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      padding: '8px 0',
                      borderBottom: '1px solid rgba(0,0,0,0.06)',
                      fontSize: '0.88rem'
                    }}
                  >
                    <div>
                      <strong>{it.quantity}x {it.name}</strong>
                      {it.notes && (
                        <div style={{ fontSize: '0.74rem', color: 'var(--royal-blue)', fontWeight: 600 }}>
                          {it.notes}
                        </div>
                      )}
                    </div>
                    <span>{formatCurrency(it.price * it.quantity)}</span>
                  </div>
                ))}
              </div>

              <div className="summary-row">
                <span style={{ color: 'var(--text-muted)' }}>Subtotal:</span>
                <span>{formatCurrency(subtotal)}</span>
              </div>

              <div className="summary-row">
                <span style={{ color: 'var(--text-muted)' }}>Order Type:</span>
                <span>{deliveryType}</span>
              </div>

              <div className="summary-row">
                <span style={{ color: 'var(--text-muted)' }}>Delivery Fee:</span>
                <span>{deliveryFee > 0 ? formatCurrency(deliveryFee) : 'UGX 0'}</span>
              </div>

              <div className="summary-total-row">
                <span>Total to Pay:</span>
                <span>{formatCurrency(grandTotal)}</span>
              </div>

              <button
                type="submit"
                className="btn btn-primary btn-lg"
                style={{ width: '100%', marginTop: '24px', padding: '14px', fontSize: '1.05rem' }}
              >
                Proceed to Payment <ArrowRight size={18} />
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

