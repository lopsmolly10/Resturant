import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ShoppingBag,
  Clock,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Receipt,
  UtensilsCrossed,
  ArrowRight,
  ExternalLink
} from 'lucide-react';
import OrderTracker from '../components/OrderTracker';
import StatusBadge from '../../components/StatusBadge';
import { useRestaurant } from '../../context/RestaurantContext';
import { useCustomerAuth } from '../context/CustomerAuthContext';
import { formatCurrency, formatDate } from '../../utils/formatCurrency';

export default function MyOrders() {
  const { orders } = useRestaurant();
  const { customerUser } = useCustomerAuth();

  const [expandedOrderId, setExpandedOrderId] = useState(null);
  const [filterTab, setFilterTab] = useState('All'); // 'All' | 'Active' | 'Completed'

  // Filter orders:
  // If user is logged in, show orders matching their name or phone, or all recent orders for demo testing
  const customerOrders = orders.filter(order => {
    if (!customerUser) return true; // Show demo orders if guest
    const matchUser =
      order.customerName.toLowerCase().includes(customerUser.name.toLowerCase()) ||
      order.customerPhone.includes(customerUser.phone) ||
      order.serverName === 'Online Web Order';

    return matchUser;
  });

  const displayedOrders = customerOrders.filter(o => {
    if (filterTab === 'Active') {
      return o.status === 'Pending' || o.status === 'Confirmed' || o.status === 'Preparing' || o.status === 'Ready';
    }
    if (filterTab === 'Completed') {
      return o.status === 'Served' || o.status === 'Completed' || o.status === 'Cancelled';
    }
    return true;
  });

  const toggleExpand = (id) => {
    setExpandedOrderId(prev => (prev === id ? null : id));
  };

  return (
    <div className="customer-my-orders-page">
      <div className="customer-section">
        {/* Header Row */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <h1 style={{ fontSize: '2.4rem', fontFamily: 'Playfair Display, serif', color: 'var(--primary-forest)', margin: 0 }}>
              My Order History & Live Tracking
            </h1>
            <p style={{ color: 'var(--text-muted)', margin: '4px 0 0' }}>
              Real-time synchronization with kitchen stations and restaurant floor service.
            </p>
          </div>

          <Link to="/customer/menu" className="btn btn-primary btn-sm">
            <UtensilsCrossed size={16} /> Order New Meal
          </Link>
        </div>

        {/* Filter Tabs */}
        <div className="card" style={{ padding: '14px 20px', marginBottom: '24px' }}>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              type="button"
              className={`btn btn-sm ${filterTab === 'All' ? 'btn-primary' : 'btn-outline'}`}
              onClick={() => setFilterTab('All')}
            >
              All Orders ({customerOrders.length})
            </button>
            <button
              type="button"
              className={`btn btn-sm ${filterTab === 'Active' ? 'btn-gold' : 'btn-outline'}`}
              onClick={() => setFilterTab('Active')}
            >
              Active Orders ({customerOrders.filter(o => o.status === 'Pending' || o.status === 'Preparing' || o.status === 'Ready').length})
            </button>
            <button
              type="button"
              className={`btn btn-sm ${filterTab === 'Completed' ? 'btn-secondary' : 'btn-outline'}`}
              onClick={() => setFilterTab('Completed')}
            >
              Completed / History ({customerOrders.filter(o => o.status === 'Served' || o.status === 'Completed' || o.status === 'Cancelled').length})
            </button>
          </div>
        </div>

        {/* Orders List */}
        {displayedOrders.length === 0 ? (
          <div className="card" style={{ padding: '60px 24px', textAlign: 'center' }}>
            <div className="empty-state-icon" style={{ margin: '0 auto 16px' }}>
              <ShoppingBag size={36} color="var(--accent-gold)" />
            </div>
            <h3 style={{ fontSize: '1.25rem', color: 'var(--primary-forest)' }}>No orders found</h3>
            <p style={{ color: 'var(--text-muted)', marginBottom: '20px' }}>
              You don't have any orders matching the "{filterTab}" category.
            </p>
            <Link to="/customer/menu" className="btn btn-primary btn-sm">
              Explore Our Menu
            </Link>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {displayedOrders.map(order => {
              const isExpanded = expandedOrderId === order.id;

              return (
                <div
                  key={order.id}
                  className="card"
                  style={{
                    padding: '24px',
                    transition: 'all var(--transition-fast)',
                    borderLeft: `5px solid ${
                      order.status === 'Ready'
                        ? '#38a169'
                        : order.status === 'Preparing'
                        ? 'var(--accent-gold)'
                        : order.status === 'Cancelled'
                        ? '#e53e3e'
                        : 'var(--primary-forest)'
                    }`
                  }}
                >
                  {/* Order Card Header */}
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'flex-start',
                      cursor: 'pointer',
                      flexWrap: 'wrap',
                      gap: '12px'
                    }}
                    onClick={() => toggleExpand(order.id)}
                  >
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <span style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--primary-forest)' }}>
                          #{order.id}
                        </span>
                        <StatusBadge status={order.status} />
                        <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                          • {order.orderType || 'Dine-In'} ({order.tableNumber})
                        </span>
                      </div>

                      <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                        <Clock size={13} style={{ display: 'inline', marginRight: '4px' }} />
                        Placed on {formatDate(order.orderTime, true)}
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--primary-forest)' }}>
                          {formatCurrency(order.totalAmount)}
                        </div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                          {order.paymentMethod} • <span style={{ fontWeight: 600, color: order.paymentStatus === 'Paid' ? '#276749' : '#c05621' }}>{order.paymentStatus}</span>
                        </div>
                      </div>

                      <button
                        type="button"
                        className="btn-icon btn-outline"
                        style={{ width: '36px', height: '36px' }}
                        title={isExpanded ? 'Collapse' : 'Expand order tracking'}
                      >
                        {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                      </button>
                    </div>
                  </div>

                  {/* Summary of items on collapsed view */}
                  {!isExpanded && (
                    <div style={{ marginTop: '12px', fontSize: '0.88rem', color: 'var(--text-charcoal)', borderTop: '1px solid var(--border-grey)', paddingTop: '10px' }}>
                      <strong>Items: </strong>
                      {order.items.map(it => `${it.name} (x${it.quantity})`).join(', ')}
                    </div>
                  )}

                  {/* Expanded Detailed View with Live OrderTracker */}
                  {isExpanded && (
                    <div style={{ marginTop: '20px', borderTop: '1px solid var(--border-grey)', paddingTop: '20px' }}>
                      <h4 style={{ fontSize: '1rem', color: 'var(--primary-forest)', marginBottom: '14px' }}>
                        Live Kitchen Progress Tracker:
                      </h4>

                      <OrderTracker status={order.status} orderType={order.orderType} />

                      <div style={{ marginTop: '20px', backgroundColor: 'var(--surface-alt)', borderRadius: 'var(--radius-md)', padding: '16px' }}>
                        <h5 style={{ margin: '0 0 10px', fontSize: '0.9rem', color: 'var(--primary-forest)' }}>
                          Ordered Dishes Breakdown:
                        </h5>
                        {order.items.map((it, idx) => (
                          <div
                            key={idx}
                            style={{
                              display: 'flex',
                              justifyContent: 'space-between',
                              padding: '6px 0',
                              borderBottom: idx === order.items.length - 1 ? 'none' : '1px solid rgba(0,0,0,0.06)',
                              fontSize: '0.88rem'
                            }}
                          >
                            <div>
                              <strong>{it.quantity}x {it.name}</strong>
                              {it.notes && (
                                <span style={{ color: 'var(--accent-terracotta)', fontSize: '0.78rem', marginLeft: '8px' }}>
                                  ({it.notes})
                                </span>
                              )}
                            </div>
                            <span>{formatCurrency(it.price * it.quantity)}</span>
                          </div>
                        ))}
                      </div>

                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '14px' }}>
                        <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                          Recipient: <strong>{order.customerName}</strong> ({order.customerPhone})
                        </div>
                        <div style={{ display: 'flex', gap: '8px' }}>
                          <Link
                            to={`/order-confirmation/${order.id}`}
                            className="btn btn-outline btn-sm"
                          >
                            View Receipt Confirmation
                          </Link>
                          <Link
                            to="/admin/kitchen"
                            className="btn btn-outline-primary btn-sm"
                            title="See how this order ticket looks on the Chef's KDS board"
                          >
                            <ExternalLink size={14} /> View in Staff KDS
                          </Link>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

