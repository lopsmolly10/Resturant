import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  CheckCircle2,
  Clock,
  ShoppingBag,
  ArrowRight,
  Printer,
  Utensils,
  MapPin,
  ExternalLink
} from 'lucide-react';
import OrderTracker from '../components/OrderTracker';
import { useRestaurant } from '../../context/RestaurantContext';
import { formatCurrency, formatDate } from '../../utils/formatCurrency';

export default function OrderConfirmation() {
  const { orderId } = useParams();
  const { orders } = useRestaurant();

  // Find order in central RestaurantContext
  const order = orders.find(o => o.id === orderId);

  // Fallback to latest order from sessionStorage if needed
  const [sessionOrder, setSessionOrder] = useState(() => {
    try {
      const saved = sessionStorage.getItem('dinepoint_latest_order');
      return saved ? JSON.parse(saved) : null;
    } catch (e) {
      return null;
    }
  });

  const activeOrder = order || sessionOrder;

  if (!activeOrder) {
    return (
      <div className="customer-section" style={{ textAlign: 'center', padding: '80px 24px' }}>
        <h2>Order Confirmation</h2>
        <p>No active order found. Please return to the menu.</p>
        <Link to="/customer/menu" className="btn btn-primary" style={{ marginTop: '16px' }}>
          Explore Menu
        </Link>
      </div>
    );
  }

  return (
    <div className="customer-order-confirmation-page">
      <div className="customer-section" style={{ maxWidth: '820px' }}>
        {/* Success Header Card */}
        <div
          className="card"
          style={{
            textAlign: 'center',
            padding: '40px 24px',
            marginBottom: '32px',
            borderTop: '6px solid var(--royal-blue)'
          }}
        >
          <div
            style={{
              width: '72px',
              height: '72px',
              borderRadius: '50%',
              backgroundColor: 'rgba(22, 163, 74, 0.12)',
              color: 'var(--success)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 18px',
              boxShadow: '0 4px 12px rgba(22, 163, 74, 0.2)'
            }}
          >
            <CheckCircle2 size={40} />
          </div>

          <span
            style={{
              display: 'inline-block',
              backgroundColor: 'var(--pale-blue)',
              color: 'var(--royal-blue)',
              padding: '4px 14px',
              borderRadius: 'var(--radius-full)',
              fontSize: '0.82rem',
              fontWeight: 800,
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
              marginBottom: '10px'
            }}
          >
            Order #{activeOrder.id} Placed Successfully!
          </span>

          <h1
            style={{
              fontSize: '2.4rem',
              fontFamily: 'Playfair Display, serif',
              color: 'var(--deep-blue)',
              marginBottom: '10px'
            }}
          >
            Thank You, {activeOrder.customerName}!
          </h1>

          <p style={{ color: 'var(--text-muted)', fontSize: '1.05rem', maxWidth: '560px', margin: '0 auto 24px' }}>
            We've received your order and sent the tickets directly to our kitchen station.
            You can track preparation progress in real time below.
          </p>

          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '12px',
              padding: '10px 20px',
              backgroundColor: 'var(--surface-alt)',
              borderRadius: 'var(--radius-md)',
              fontSize: '0.92rem'
            }}
          >
            <Clock size={18} color="var(--royal-blue)" />
            <span>Estimated Wait Time: <strong>20 – 30 Minutes</strong></span>
          </div>
        </div>

        {/* Live Visual Order Progress Tracker */}
        <div className="card" style={{ marginBottom: '32px', padding: '28px' }}>
          <h3 style={{ fontSize: '1.25rem', fontFamily: 'Playfair Display, serif', color: 'var(--deep-blue)', marginBottom: '16px' }}>
            Live Kitchen & Delivery Status
          </h3>
          <OrderTracker status={activeOrder.status || 'Pending'} orderType={activeOrder.orderType} />
        </div>

        {/* Order Details & Summary Breakdown */}
        <div className="card" style={{ padding: '28px', marginBottom: '32px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', borderBottom: '1px solid var(--border-grey)', paddingBottom: '14px' }}>
            <div>
              <h3 style={{ margin: 0, fontSize: '1.25rem', color: 'var(--deep-blue)' }}>
                Order Summary Breakdown
              </h3>
              <small style={{ color: 'var(--text-muted)' }}>
                Placed on {formatDate(activeOrder.orderTime, true)}
              </small>
            </div>
            <div style={{ textAlign: 'right' }}>
              <span className="status-badge preparing">{activeOrder.status}</span>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                Paid via {activeOrder.paymentMethod}
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '20px' }}>
            {activeOrder.items.map((it, idx) => (
              <div
                key={idx}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  padding: '8px 0',
                  borderBottom: '1px solid rgba(0,0,0,0.06)'
                }}
              >
                <div>
                  <strong>{it.quantity}x {it.name}</strong>
                  {it.notes && (
                    <div style={{ fontSize: '0.78rem', color: 'var(--royal-blue)', fontWeight: 600 }}>
                      Note: {it.notes}
                    </div>
                  )}
                </div>
                <span>{formatCurrency(it.price * it.quantity)}</span>
              </div>
            ))}
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '14px', borderTop: '2px dashed var(--border-grey)' }}>
            <span style={{ fontSize: '1.1rem', fontWeight: 800 }}>Grand Total:</span>
            <span style={{ fontSize: '1.45rem', fontWeight: 800, color: 'var(--royal-blue)' }}>
              {formatCurrency(activeOrder.totalAmount)}
            </span>
          </div>

          <div style={{ marginTop: '16px', fontSize: '0.85rem', color: 'var(--text-muted)', backgroundColor: 'var(--surface-alt)', padding: '12px', borderRadius: '8px' }}>
            <div><strong>Destination:</strong> {activeOrder.tableNumber} ({activeOrder.orderType})</div>
            {activeOrder.specialNotes && (
              <div style={{ marginTop: '4px' }}>
                <strong>Instructions:</strong> {activeOrder.specialNotes}
              </div>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', flexWrap: 'wrap' }}>
          <Link to="/my-orders" className="btn btn-primary btn-lg" style={{ padding: '12px 28px' }}>
            View in My Orders <ArrowRight size={18} />
          </Link>
          <Link to="/customer/menu" className="btn btn-outline btn-lg" style={{ padding: '12px 28px' }}>
            <Utensils size={18} /> Order More Food
          </Link>
          <Link to="/admin/kitchen" className="btn btn-secondary btn-lg" style={{ padding: '12px 28px' }} title="Check how this appears in Kitchen Display System">
            <ExternalLink size={18} /> View in Staff KDS
          </Link>
        </div>
      </div>
    </div>
  );
}

