import React from 'react';
import {
  CheckCircle2,
  Clock,
  ChefHat,
  BellRing,
  ShoppingBag,
  XCircle,
  Sparkles
} from 'lucide-react';

export default function OrderTracker({ status = 'Pending', orderType = 'Dine-In' }) {
  const steps = [
    { key: 'Pending', label: 'Order Placed', icon: ShoppingBag, desc: 'Received at counter' },
    { key: 'Confirmed', label: 'Confirmed', icon: CheckCircle2, desc: 'Verified by staff' },
    { key: 'Preparing', label: 'In Kitchen', icon: ChefHat, desc: 'Chef cooking meal' },
    {
      key: 'Ready',
      label: orderType === 'Delivery' ? 'Out for Delivery' : 'Ready',
      icon: BellRing,
      desc: orderType === 'Delivery' ? 'Rider on the way' : 'Ready for pickup / table'
    },
    { key: 'Completed', label: 'Completed', icon: Sparkles, desc: 'Served & enjoyed' }
  ];

  if (status === 'Cancelled') {
    return (
      <div
        style={{
          background: 'var(--status-cancelled-bg)',
          border: '1px solid var(--status-cancelled-border)',
          borderRadius: 'var(--radius-md)',
          padding: '16px 20px',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          color: 'var(--status-cancelled-text)'
        }}
      >
        <XCircle size={24} />
        <div>
          <strong>Order Cancelled</strong>
          <div style={{ fontSize: '0.85rem' }}>This order has been cancelled and cannot be fulfilled.</div>
        </div>
      </div>
    );
  }

  // Determine current active step index
  // Note: if status is 'Served', treat as 'Completed'
  const normalizedStatus = status === 'Served' ? 'Completed' : status;
  let activeIndex = steps.findIndex(s => s.key.toLowerCase() === normalizedStatus.toLowerCase());
  if (activeIndex === -1) {
    if (status === 'Pending') activeIndex = 0;
    else if (status === 'Preparing') activeIndex = 2;
    else if (status === 'Ready') activeIndex = 3;
    else activeIndex = 1;
  }

  const fillPercentage = (activeIndex / (steps.length - 1)) * 100;

  return (
    <div className="order-tracker-container">
      <div className="order-tracker-steps">
        <div className="order-tracker-line-bg"></div>
        <div
          className="order-tracker-line-fill"
          style={{ width: `calc(${fillPercentage}% - 60px)` }}
        ></div>

        {steps.map((step, idx) => {
          const isCompleted = idx < activeIndex;
          const isActive = idx === activeIndex;
          const Icon = step.icon;

          return (
            <div
              key={step.key}
              className={`tracker-step-node ${isCompleted ? 'completed' : ''} ${isActive ? 'active' : ''}`}
            >
              <div className="tracker-node-circle">
                <Icon size={18} />
              </div>
              <div className="tracker-step-label">{step.label}</div>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-light)', marginTop: '2px' }}>
                {step.desc}
              </div>
            </div>
          );
        })}
      </div>

      <div
        style={{
          backgroundColor: 'var(--surface-alt)',
          borderRadius: '8px',
          padding: '12px 18px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          fontSize: '0.86rem'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Clock size={16} color="var(--primary-forest)" />
          <span>Status: <strong style={{ color: 'var(--primary-forest)' }}>{status}</strong></span>
        </div>
        <div>
          Estimated Time: <strong>15 – 25 Minutes</strong>
        </div>
      </div>
    </div>
  );
}

