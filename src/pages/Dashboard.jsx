import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ShoppingBag,
  CircleDollarSign,
  Flame,
  LayoutGrid,
  PlusCircle,
  Clock,
  ArrowRight,
  AlertTriangle,
  Eye,
  CheckCircle,
  ExternalLink
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';
import StatCard from '../components/StatCard';
import StatusBadge from '../components/StatusBadge';
import Modal from '../components/Modal';
import { useAuth } from '../context/AuthContext';
import { useRestaurant } from '../context/RestaurantContext';
import { formatCurrency, formatDate, formatTimeAgo } from '../utils/formatCurrency';
import { revenueDataHourly, revenueDataWeekly } from '../data/mockData';

export default function Dashboard() {
  const { currentUser } = useAuth();
  const {
    dashboardStats,
    orders,
    menuItems,
    inventory,
    updateOrderStatus
  } = useRestaurant();
  const navigate = useNavigate();

  const [chartView, setChartView] = useState('hourly'); // 'hourly' | 'weekly'
  const [selectedOrder, setSelectedOrder] = useState(null);

  // Popular food items sorted by ordersCount
  const popularItems = [...menuItems]
    .sort((a, b) => b.ordersCount - a.ordersCount)
    .slice(0, 4);

  // Recent 5 orders
  const recentOrders = [...orders].slice(0, 5);

  // Low stock items
  const lowStockAlerts = inventory.filter(
    i => i.status === 'Low Stock' || i.status === 'Out of Stock'
  ).slice(0, 4);

  const activeChartData = chartView === 'hourly' ? revenueDataHourly : revenueDataWeekly;

  return (
    <div className="dashboard-page">
      {/* Welcome Banner */}
      <div className="welcome-banner">
        <div className="welcome-content">
          <div className="welcome-badge">
            <Flame size={14} /> Operations Live
          </div>
          <h2>Good morning, Welcome to DinePoint!</h2>
          <p>
            Hello {currentUser?.name || 'Manager'}, manage your restaurant operations, kitchen workflow,
            reservations and daily revenue from one place.
          </p>
          <div className="welcome-quick-actions">
            <button
              className="btn btn-gold"
              onClick={() => navigate('/admin/orders')}
            >
              <PlusCircle size={16} /> New Order
            </button>
            <button
              className="btn btn-outline"
              style={{ color: '#fff', borderColor: 'rgba(255,255,255,0.3)' }}
              onClick={() => navigate('/admin/kitchen')}
            >
              <Flame size={16} /> Kitchen Board
            </button>
            <button
              className="btn btn-outline"
              style={{ color: '#fff', borderColor: 'rgba(255,255,255,0.3)' }}
              onClick={() => navigate('/admin/reservations')}
            >
              <LayoutGrid size={16} /> Table Map
            </button>
          </div>
        </div>
      </div>

      {/* 4 Statistical Cards */}
      <div className="stat-cards-grid">
        <StatCard
          title="Total Orders Today"
          value={dashboardStats.totalOrdersToday}
          icon={ShoppingBag}
          colorTheme="green"
          trend={{ value: '+14.2%', isUp: true, label: 'vs yesterday' }}
        />
        <StatCard
          title="Total Revenue Today"
          value={formatCurrency(dashboardStats.revenueToday)}
          icon={CircleDollarSign}
          colorTheme="gold"
          trend={{ value: '+8.6%', isUp: true, label: 'vs target' }}
        />
        <StatCard
          title="Active Orders"
          value={dashboardStats.activeOrders}
          icon={Clock}
          colorTheme="terracotta"
          trend={{ value: 'In Kitchen & Ready', isUp: true }}
        />
        <StatCard
          title="Available Tables"
          value={`${dashboardStats.availableTables} / ${dashboardStats.totalTables}`}
          icon={LayoutGrid}
          colorTheme="charcoal"
          trend={{ value: `${Math.round((dashboardStats.availableTables / dashboardStats.totalTables) * 100)}% free`, isUp: true }}
        />
      </div>

      {/* Analytics Section & Category Distribution */}
      <div className="dashboard-analytics-grid">
        {/* Sales Analytics Chart */}
        <div className="analytics-card">
          <div className="analytics-card-header">
            <div>
              <h3>Sales & Revenue Analytics</h3>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: 0 }}>
                Real-time turnover in Ugandan Shillings (UGX)
              </p>
            </div>
            <div className="chart-controls">
              <button
                type="button"
                className={`chart-tab-btn ${chartView === 'hourly' ? 'active' : ''}`}
                onClick={() => setChartView('hourly')}
              >
                Today (Hourly)
              </button>
              <button
                type="button"
                className={`chart-tab-btn ${chartView === 'weekly' ? 'active' : ''}`}
                onClick={() => setChartView('weekly')}
              >
                This Week (Daily)
              </button>
            </div>
          </div>

          <div className="chart-wrapper">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={activeChartData} margin={{ top: 10, right: 20, left: 20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#183D32" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#183D32" stopOpacity={0.05}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e9e7e0" vertical={false} />
                <XAxis
                  dataKey={chartView === 'hourly' ? 'time' : 'day'}
                  stroke="#6c736e"
                  fontSize={12}
                  tickLine={false}
                />
                <YAxis
                  stroke="#6c736e"
                  fontSize={11}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(val) => `${(val / 1000).toLocaleString()}k`}
                />
                <Tooltip
                  formatter={(val) => [formatCurrency(val), 'Revenue']}
                  contentStyle={{
                    backgroundColor: '#FFFDF8',
                    border: '1px solid #E9E7E0',
                    borderRadius: '8px',
                    boxShadow: '0 4px 12px rgba(24, 61, 50, 0.1)',
                    fontFamily: 'inherit'
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke="#183D32"
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#colorRevenue)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Quick Operations & Low-Stock Alerts */}
        <div className="low-stock-card">
          <div className="analytics-card-header" style={{ marginBottom: '14px' }}>
            <div>
              <h3>Inventory Alerts</h3>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: 0 }}>
                {lowStockAlerts.length} items below minimum safety level
              </p>
            </div>
            <button
              className="btn btn-outline btn-sm"
              onClick={() => navigate('/admin/inventory')}
            >
              Manage <ArrowRight size={14} />
            </button>
          </div>

          <div className="low-stock-list">
            {lowStockAlerts.length === 0 ? (
              <div style={{ padding: '20px', textAlign: 'center', color: 'var(--text-muted)' }}>
                All inventory levels are optimal.
              </div>
            ) : (
              lowStockAlerts.map(item => (
                <div key={item.id} className="low-stock-item">
                  <div className="low-stock-info">
                    <h4>{item.name}</h4>
                    <p>Reorder at: {item.reorderLevel} {item.unit}</p>
                  </div>
                  <div className="low-stock-level">
                    <span className="low-stock-qty">
                      {item.quantity} {item.unit}
                    </span>
                    <div>
                      <StatusBadge status={item.status} />
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Popular Food Items Section */}
      <div className="popular-items-section">
        <div className="section-title-row">
          <div>
            <h3>Popular Menu Items</h3>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', margin: 0 }}>
              Top customer favorites ordered this month
            </p>
          </div>
          <button
            className="btn btn-outline btn-sm"
            onClick={() => navigate('/admin/menu')}
          >
            Full Menu Catalog <ArrowRight size={14} />
          </button>
        </div>

        <div className="popular-food-grid">
          {popularItems.map(item => (
            <div key={item.id} className="food-card">
              <div className="food-card-img-wrapper">
                <img
                  src={item.image}
                  alt={item.name}
                  className="food-card-img"
                  loading="lazy"
                />
                <span className="food-card-category-tag">{item.category}</span>
                <span className="food-card-rating">★ {item.rating}</span>
              </div>
              <div className="food-card-body">
                <div className="food-card-name">{item.name}</div>
                <div className="food-card-desc">{item.description}</div>
                <div className="food-card-footer">
                  <span className="food-card-price">{formatCurrency(item.price)}</span>
                  <span className="food-card-orders-count">{item.ordersCount} orders</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Orders Section */}
      <div className="card" style={{ marginBottom: '28px' }}>
        <div className="section-title-row" style={{ marginBottom: '16px' }}>
          <div>
            <h3>Recent Orders</h3>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', margin: 0 }}>
              Latest dine-in and takeaway tickets
            </p>
          </div>
          <button
            className="btn btn-primary btn-sm"
            onClick={() => navigate('/admin/orders')}
          >
            View All Orders <ArrowRight size={14} />
          </button>
        </div>

        <div className="table-responsive">
          <table className="data-table">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Customer Name</th>
                <th>Food Items</th>
                <th>Amount</th>
                <th>Order Time</th>
                <th>Order Status</th>
                <th style={{ textAlign: 'right' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {recentOrders.map(order => (
                <tr key={order.id}>
                  <td style={{ fontWeight: 700, color: 'var(--primary-forest)' }}>
                    {order.id}
                  </td>
                  <td>
                    <div><strong>{order.customerName}</strong></div>
                    <small style={{ color: 'var(--text-muted)' }}>{order.tableNumber}</small>
                  </td>
                  <td>
                    {order.items.map(i => `${i.name} (x${i.quantity})`).join(', ')}
                  </td>
                  <td style={{ fontWeight: 700, color: 'var(--primary-forest)' }}>
                    {formatCurrency(order.totalAmount)}
                  </td>
                  <td>{formatDate(order.orderTime, true)}</td>
                  <td>
                    <StatusBadge status={order.status} />
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <button
                      className="btn btn-outline btn-sm"
                      onClick={() => setSelectedOrder(order)}
                    >
                      <Eye size={14} /> View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Order Details Modal */}
      {selectedOrder && (
        <Modal
          isOpen={!!selectedOrder}
          onClose={() => setSelectedOrder(null)}
          title={`Order Details – ${selectedOrder.id}`}
          footer={
            <div style={{ display: 'flex', gap: '8px', width: '100%', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', gap: '8px' }}>
                {selectedOrder.status === 'Pending' && (
                  <button
                    className="btn btn-primary btn-sm"
                    onClick={() => {
                      updateOrderStatus(selectedOrder.id, 'Preparing');
                      setSelectedOrder({ ...selectedOrder, status: 'Preparing' });
                    }}
                  >
                    Start Preparing
                  </button>
                )}
                {selectedOrder.status === 'Preparing' && (
                  <button
                    className="btn btn-gold btn-sm"
                    onClick={() => {
                      updateOrderStatus(selectedOrder.id, 'Ready');
                      setSelectedOrder({ ...selectedOrder, status: 'Ready' });
                    }}
                  >
                    Mark Ready
                  </button>
                )}
                {selectedOrder.status === 'Ready' && (
                  <button
                    className="btn btn-primary btn-sm"
                    onClick={() => {
                      updateOrderStatus(selectedOrder.id, 'Served');
                      setSelectedOrder({ ...selectedOrder, status: 'Served' });
                    }}
                  >
                    <CheckCircle size={15} /> Mark Served
                  </button>
                )}
              </div>
              <button
                className="btn btn-outline btn-sm"
                onClick={() => setSelectedOrder(null)}
              >
                Close
              </button>
            </div>
          }
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-grey)', paddingBottom: '12px' }}>
              <div>
                <strong>Customer:</strong> {selectedOrder.customerName}
                <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                  Phone: {selectedOrder.customerPhone} | Location: {selectedOrder.tableNumber}
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <StatusBadge status={selectedOrder.status} />
                <div style={{ fontSize: '0.82rem', marginTop: '4px' }}>
                  Payment: <StatusBadge status={selectedOrder.paymentStatus} />
                </div>
              </div>
            </div>

            <div>
              <h4 style={{ fontSize: '0.95rem', marginBottom: '8px' }}>Ordered Items:</h4>
              <div style={{ background: 'var(--surface-alt)', borderRadius: '8px', padding: '12px' }}>
                {selectedOrder.items.map((item, idx) => (
                  <div
                    key={idx}
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      padding: '6px 0',
                      borderBottom: idx === selectedOrder.items.length - 1 ? 'none' : '1px solid rgba(0,0,0,0.06)'
                    }}
                  >
                    <div>
                      <strong>{item.quantity}x {item.name}</strong>
                      {item.notes && (
                        <div style={{ fontSize: '0.78rem', color: 'var(--accent-terracotta)' }}>
                          Note: {item.notes}
                        </div>
                      )}
                    </div>
                    <span>{formatCurrency(item.price * item.quantity)}</span>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '8px', borderTop: '1px solid var(--border-grey)' }}>
              <span style={{ fontSize: '1rem', fontWeight: 700 }}>Total Amount:</span>
              <span style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--primary-forest)' }}>
                {formatCurrency(selectedOrder.totalAmount)}
              </span>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}

