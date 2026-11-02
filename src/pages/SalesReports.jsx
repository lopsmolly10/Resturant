import React, { useState } from 'react';
import {
  TrendingUp,
  Calendar,
  Download,
  Printer,
  DollarSign,
  ShoppingBag,
  Percent,
  Award,
  Filter,
  BarChart3,
  PieChart as PieIcon
} from 'lucide-react';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import PageHeader from '../components/PageHeader';
import StatCard from '../components/StatCard';
import { useRestaurant } from '../context/RestaurantContext';
import { formatCurrency } from '../utils/formatCurrency';
import {
  revenueDataHourly,
  revenueDataWeekly,
  salesByCategoryData,
  paymentMethodsData
} from '../data/mockData';

export default function SalesReports() {
  const { menuItems, orders, payments } = useRestaurant();
  const [timeRange, setTimeRange] = useState('week'); // 'today' | 'week' | 'month'

  const activeRevenueData = timeRange === 'today' ? revenueDataHourly : revenueDataWeekly;

  const topDishes = [...menuItems]
    .sort((a, b) => b.ordersCount - a.ordersCount)
    .slice(0, 5)
    .map(d => ({
      name: d.name.length > 18 ? d.name.substring(0, 18) + '...' : d.name,
      orders: d.ordersCount,
      revenue: d.ordersCount * d.price
    }));

  const handlePrint = () => {
    window.print();
  };

  const handleExportCSV = () => {
    // Generate simple CSV content for download
    const headers = 'TransactionID,OrderID,Customer,Amount(UGX),PaymentMethod,Date\n';
    const rows = payments
      .map(p => `${p.id},${p.orderId},"${p.customerName}",${p.amount},${p.paymentMethod},${p.date}`)
      .join('\n');
    const blob = new Blob([headers + rows], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `DinePoint_Sales_Report_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="sales-reports-page">
      <PageHeader
        title="Sales Reports & Executive Analytics"
        subtitle="Revenue reconciliation, dish popularity metrics, and payment method summaries."
      >
        <button className="btn btn-outline" onClick={handleExportCSV}>
          <Download size={16} /> Export CSV
        </button>
        <button className="btn btn-primary" onClick={handlePrint}>
          <Printer size={16} /> Print Report
        </button>
      </PageHeader>

      {/* Date Filter Bar */}
      <div className="card" style={{ padding: '16px 24px', marginBottom: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '14px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Calendar size={18} color="var(--primary-forest)" />
            <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>Report Period:</span>
          </div>

          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              className={`btn btn-sm ${timeRange === 'today' ? 'btn-primary' : 'btn-outline'}`}
              onClick={() => setTimeRange('today')}
            >
              Today (Daily)
            </button>
            <button
              className={`btn btn-sm ${timeRange === 'week' ? 'btn-primary' : 'btn-outline'}`}
              onClick={() => setTimeRange('week')}
            >
              This Week (Weekly)
            </button>
            <button
              className={`btn btn-sm ${timeRange === 'month' ? 'btn-primary' : 'btn-outline'}`}
              onClick={() => setTimeRange('month')}
            >
              This Month (Monthly)
            </button>
          </div>
        </div>
      </div>

      {/* 4 Summary Stat Cards */}
      <div className="stat-cards-grid" style={{ marginBottom: '28px' }}>
        <StatCard
          title="Daily Average Revenue"
          value={formatCurrency(4850000)}
          icon={DollarSign}
          colorTheme="green"
          trend={{ value: '+12.4%', isUp: true, label: 'vs last week' }}
        />
        <StatCard
          title="Weekly Projected Revenue"
          value={formatCurrency(38250000)}
          icon={TrendingUp}
          colorTheme="gold"
          trend={{ value: '+6.8%', isUp: true, label: 'exceeds quota' }}
        />
        <StatCard
          title="Monthly Gross Sales"
          value={formatCurrency(148600000)}
          icon={Award}
          colorTheme="terracotta"
          trend={{ value: '+18.2%', isUp: true, label: 'MoM growth' }}
        />
        <StatCard
          title="Total Orders Completed"
          value="984 orders"
          icon={ShoppingBag}
          colorTheme="charcoal"
          trend={{ value: '4.8 rating avg', isUp: true }}
        />
      </div>

      {/* Revenue Trend Over Time */}
      <div className="card" style={{ marginBottom: '28px' }}>
        <div className="analytics-card-header">
          <div>
            <h3>Revenue Trend Over Time</h3>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', margin: 0 }}>
              Gross turnover progression in Ugandan Shillings (UGX)
            </p>
          </div>
        </div>

        <div style={{ width: '100%', height: '320px' }}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={activeRevenueData} margin={{ top: 10, right: 20, left: 20, bottom: 0 }}>
              <defs>
                <linearGradient id="revenueFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#183D32" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#183D32" stopOpacity={0.05}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e9e7e0" vertical={false} />
              <XAxis dataKey={timeRange === 'today' ? 'time' : 'day'} stroke="#6c736e" />
              <YAxis
                stroke="#6c736e"
                tickFormatter={(val) => `${(val / 1000).toLocaleString()}k`}
              />
              <Tooltip
                formatter={(val) => [formatCurrency(val), 'Revenue']}
                contentStyle={{
                  backgroundColor: '#FFFDF8',
                  border: '1px solid #E9E7E0',
                  borderRadius: '8px'
                }}
              />
              <Area
                type="monotone"
                dataKey="revenue"
                stroke="#183D32"
                strokeWidth={3}
                fillOpacity={1}
                fill="url(#revenueFill)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Two Column Grid: Popular Dishes & Category Breakdown */}
      <div className="dashboard-analytics-grid" style={{ marginBottom: '28px' }}>
        {/* Top 5 Dishes Bar Chart */}
        <div className="analytics-card">
          <div className="analytics-card-header">
            <div>
              <h3>Most Popular Dishes</h3>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: 0 }}>
                Top 5 ordered dishes by volume
              </p>
            </div>
            <BarChart3 size={20} color="var(--primary-forest)" />
          </div>

          <div style={{ width: '100%', height: '260px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={topDishes} margin={{ top: 10, right: 10, left: 0, bottom: 25 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e9e7e0" vertical={false} />
                <XAxis dataKey="name" stroke="#6c736e" angle={-15} textAnchor="end" fontSize={11} />
                <YAxis stroke="#6c736e" fontSize={11} />
                <Tooltip
                  formatter={(val, name) => [
                    name === 'orders' ? `${val} orders` : formatCurrency(val),
                    name === 'orders' ? 'Total Orders' : 'Revenue'
                  ]}
                  contentStyle={{
                    backgroundColor: '#FFFDF8',
                    border: '1px solid #E9E7E0',
                    borderRadius: '8px'
                  }}
                />
                <Bar dataKey="orders" fill="#C66B45" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Sales By Category Pie Chart */}
        <div className="analytics-card">
          <div className="analytics-card-header">
            <div>
              <h3>Sales by Category</h3>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: 0 }}>
                Share of overall menu consumption
              </p>
            </div>
            <PieIcon size={20} color="var(--primary-forest)" />
          </div>

          <div style={{ width: '100%', height: '200px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={salesByCategoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {salesByCategoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(val) => [`${val}%`, 'Share']} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="category-distribution-list">
            {salesByCategoryData.map(cat => (
              <div key={cat.name} className="category-dist-item">
                <div className="dist-meta">
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: cat.color }}></span>
                    {cat.name}
                  </span>
                  <span>{cat.value}%</span>
                </div>
                <div className="dist-bar-bg">
                  <div
                    className="dist-bar-fill"
                    style={{ width: `${cat.value}%`, backgroundColor: cat.color }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Payment Channel Breakdown Table */}
      <div className="card">
        <div className="analytics-card-header">
          <div>
            <h3>Payment Method Summaries</h3>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', margin: 0 }}>
              Settlement distribution across Mobile Money, Card and Cash
            </p>
          </div>
        </div>

        <div className="table-responsive">
          <table className="data-table">
            <thead>
              <tr>
                <th>Payment Channel</th>
                <th>Share of Sales</th>
                <th>Total Volume (UGX)</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {paymentMethodsData.map(pm => (
                <tr key={pm.name}>
                  <td>
                    <strong style={{ color: 'var(--primary-forest)' }}>{pm.name}</strong>
                  </td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <div style={{ width: '100px', height: '6px', background: 'var(--surface-alt)', borderRadius: '3px', overflow: 'hidden' }}>
                        <div style={{ width: `${pm.percentage}%`, height: '100%', background: pm.color }}></div>
                      </div>
                      <span style={{ fontWeight: 700 }}>{pm.percentage}%</span>
                    </div>
                  </td>
                  <td style={{ fontWeight: 800, color: 'var(--primary-forest)' }}>
                    {formatCurrency(pm.amount)}
                  </td>
                  <td>
                    <span className="status-badge active">Settled Active</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

