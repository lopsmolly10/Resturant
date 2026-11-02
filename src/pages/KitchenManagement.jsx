import React, { useState } from 'react';
import {
  ChefHat,
  Clock,
  CheckCircle2,
  AlertCircle,
  Play,
  Flame,
  Volume2,
  VolumeX,
  Utensils
} from 'lucide-react';
import PageHeader from '../components/PageHeader';
import StatusBadge from '../components/StatusBadge';
import { useRestaurant } from '../context/RestaurantContext';
import { formatTimeAgo, formatDate } from '../utils/formatCurrency';

export default function KitchenManagement() {
  const { orders, updateOrderStatus } = useRestaurant();
  const [activeFilter, setActiveFilter] = useState('All'); // 'All' | 'Pending' | 'Preparing' | 'Ready'
  const [soundEnabled, setSoundEnabled] = useState(true);

  // Kitchen tickets are relevant for Pending, Preparing, Ready
  const kitchenOrders = orders.filter(o =>
    o.status === 'Pending' || o.status === 'Preparing' || o.status === 'Ready'
  );

  const displayedOrders = kitchenOrders.filter(o =>
    activeFilter === 'All' ? true : o.status === activeFilter
  );

  const handleAdvance = (order) => {
    if (order.status === 'Pending') {
      updateOrderStatus(order.id, 'Preparing');
    } else if (order.status === 'Preparing') {
      updateOrderStatus(order.id, 'Ready');
    } else if (order.status === 'Ready') {
      updateOrderStatus(order.id, 'Served');
    }
  };

  return (
    <div className="kitchen-display-page">
      <PageHeader
        title="Kitchen Display System (KDS)"
        subtitle="Live cook station tickets, chef preparation timers and order fulfillment workflow."
      >
        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            type="button"
            className={`btn btn-sm ${soundEnabled ? 'btn-outline-primary' : 'btn-outline'}`}
            onClick={() => setSoundEnabled(!soundEnabled)}
            title="Audio Bell notification toggle"
          >
            {soundEnabled ? <Volume2 size={16} /> : <VolumeX size={16} />}
            Kitchen Chime: {soundEnabled ? 'ON' : 'OFF'}
          </button>
        </div>
      </PageHeader>

      {/* Filter Tabs & Ticket Counts */}
      <div className="card" style={{ padding: '16px 24px', marginBottom: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            <button
              type="button"
              className={`btn btn-sm ${activeFilter === 'All' ? 'btn-primary' : 'btn-outline'}`}
              onClick={() => setActiveFilter('All')}
            >
              All Active Tickets ({kitchenOrders.length})
            </button>
            <button
              type="button"
              className={`btn btn-sm ${activeFilter === 'Pending' ? 'btn-secondary' : 'btn-outline'}`}
              onClick={() => setActiveFilter('Pending')}
            >
              Queued / Pending ({kitchenOrders.filter(o => o.status === 'Pending').length})
            </button>
            <button
              type="button"
              className={`btn btn-sm ${activeFilter === 'Preparing' ? 'btn-primary' : 'btn-outline'}`}
              onClick={() => setActiveFilter('Preparing')}
            >
              Cooking / Preparing ({kitchenOrders.filter(o => o.status === 'Preparing').length})
            </button>
            <button
              type="button"
              className={`btn btn-sm ${activeFilter === 'Ready' ? 'btn-primary' : 'btn-outline'}`}
              onClick={() => setActiveFilter('Ready')}
            >
              Ready for Serving ({kitchenOrders.filter(o => o.status === 'Ready').length})
            </button>
          </div>

          <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            <Clock size={14} style={{ display: 'inline', marginRight: '4px' }} />
            Average Prep Time: <strong>16 mins</strong>
          </div>
        </div>
      </div>

      {/* Kitchen Ticket Cards Grid */}
      {displayedOrders.length === 0 ? (
        <div className="card">
          <div className="empty-state">
            <div className="empty-state-icon">
              <ChefHat size={36} />
            </div>
            <h3>Kitchen is All Caught Up!</h3>
            <p>No active kitchen tickets for this filter station. Orders will appear here automatically when submitted.</p>
          </div>
        </div>
      ) : (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
            gap: '20px'
          }}
        >
          {displayedOrders.map(order => {
            const isPending = order.status === 'Pending';
            const isPreparing = order.status === 'Preparing';
            const isReady = order.status === 'Ready';

            const cardBorderColor = isPending
              ? 'var(--primary-blue)'
              : isPreparing
              ? 'var(--royal-blue)'
              : 'var(--success)';

            return (
              <div
                key={order.id}
                className="card"
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  padding: '20px',
                  borderTop: `5px solid ${cardBorderColor}`,
                  boxShadow: isPreparing ? 'var(--shadow-md)' : 'var(--shadow-sm)'
                }}
              >
                {/* Ticket Header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                  <div>
                    <h3 style={{ margin: 0, fontSize: '1.25rem', color: 'var(--primary-blue)' }}>
                      {order.id}
                    </h3>
                    <div style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-charcoal)', marginTop: '2px' }}>
                      {order.tableNumber} {order.orderType ? `(${order.orderType})` : ''}
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <StatusBadge status={order.status} />
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                      <Clock size={12} style={{ display: 'inline', marginRight: '3px' }} />
                      {formatTimeAgo(order.orderTime)}
                    </div>
                  </div>
                </div>

                {/* Customer name */}
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '12px', borderBottom: '1px dashed var(--border-grey)', paddingBottom: '8px' }}>
                  Guest: <strong>{order.customerName}</strong> • Server: {order.serverName || 'Staff'}
                </div>

                {/* Items Breakdown */}
                <div style={{ flex: 1, marginBottom: '16px' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {order.items.map((item, idx) => (
                      <div
                        key={idx}
                        style={{
                          background: 'var(--surface-alt)',
                          padding: '8px 12px',
                          borderRadius: '6px',
                          display: 'flex',
                          flexDirection: 'column'
                        }}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <span style={{ fontWeight: 700, fontSize: '0.92rem', color: 'var(--primary-blue)' }}>
                            {item.quantity} × {item.name}
                          </span>
                        </div>
                        {item.notes && (
                          <span style={{ fontSize: '0.78rem', color: 'var(--royal-blue)', fontWeight: 600, marginTop: '2px' }}>
                            ★ {item.notes}
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Special Order Instructions Alert */}
                {order.specialNotes && (
                  <div
                    style={{
                      background: 'var(--pale-blue)',
                      borderLeft: '3px solid var(--royal-blue)',
                      padding: '8px 12px',
                      borderRadius: '4px',
                      fontSize: '0.78rem',
                      color: 'var(--deep-blue)',
                      marginBottom: '14px'
                    }}
                  >
                    <strong>Instruction:</strong> {order.specialNotes}
                  </div>
                )}

                {/* Action Button */}
                <div style={{ marginTop: 'auto', paddingTop: '10px' }}>
                  {isPending && (
                    <button
                      className="btn btn-primary"
                      style={{ width: '100%' }}
                      onClick={() => handleAdvance(order)}
                    >
                      <Flame size={16} /> Start Cooking (Preparing)
                    </button>
                  )}

                  {isPreparing && (
                    <button
                      className="btn btn-secondary"
                      style={{ width: '100%' }}
                      onClick={() => handleAdvance(order)}
                    >
                      <CheckCircle2 size={16} /> Mark as Ready
                    </button>
                  )}

                  {isReady && (
                    <button
                      className="btn btn-primary"
                      style={{ width: '100%' }}
                      onClick={() => handleAdvance(order)}
                    >
                      <Utensils size={16} /> Complete & Serve Table
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

