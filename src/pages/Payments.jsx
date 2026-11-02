import React, { useState, useMemo } from 'react';
import {
  Receipt,
  Plus,
  Search,
  Filter,
  Printer,
  CreditCard,
  Smartphone,
  Banknote,
  CheckCircle2,
  DollarSign,
  Eye
} from 'lucide-react';
import PageHeader from '../components/PageHeader';
import StatusBadge from '../components/StatusBadge';
import Modal from '../components/Modal';
import SearchBar from '../components/SearchBar';
import DataTable from '../components/DataTable';
import { useRestaurant } from '../context/RestaurantContext';
import { useAuth } from '../context/AuthContext';
import { formatCurrency, formatDate } from '../utils/formatCurrency';
import { restaurantDetails } from '../data/mockData';

export default function Payments() {
  const { payments, recordPayment, orders } = useRestaurant();
  const { currentUser } = useAuth();

  const [searchTerm, setSearchTerm] = useState('');
  const [methodFilter, setMethodFilter] = useState('All');

  // Modals
  const [isRecordModalOpen, setIsRecordModalOpen] = useState(false);
  const [activeReceipt, setActiveReceipt] = useState(null);

  // Record Payment Form
  const [recordOrderId, setRecordOrderId] = useState('');
  const [recordCustomer, setRecordCustomer] = useState('');
  const [recordAmount, setRecordAmount] = useState('');
  const [recordMethod, setRecordMethod] = useState('Mobile Money');
  const [recordProvider, setRecordProvider] = useState('MTN MoMo');

  // Unpaid orders list for quick select
  const unpaidOrders = orders.filter(o => o.paymentStatus !== 'Paid' && o.status !== 'Cancelled');

  // Filtered payments
  const filteredPayments = useMemo(() => {
    return payments.filter(p => {
      const matchSearch =
        p.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.orderId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.paymentMethod.toLowerCase().includes(searchTerm.toLowerCase());
      const matchMethod = methodFilter === 'All' || p.paymentMethod === methodFilter;
      return matchSearch && matchMethod;
    });
  }, [payments, searchTerm, methodFilter]);

  // Aggregate Payment Metrics
  const metrics = useMemo(() => {
    const totalCollected = payments.reduce((sum, p) => sum + p.amount, 0);
    const momoCollected = payments.filter(p => p.paymentMethod === 'Mobile Money').reduce((sum, p) => sum + p.amount, 0);
    const cardCollected = payments.filter(p => p.paymentMethod === 'Card').reduce((sum, p) => sum + p.amount, 0);
    const cashCollected = payments.filter(p => p.paymentMethod === 'Cash').reduce((sum, p) => sum + p.amount, 0);
    return { totalCollected, momoCollected, cardCollected, cashCollected };
  }, [payments]);

  const handleSelectOrderToPay = (orderId) => {
    setRecordOrderId(orderId);
    const matched = orders.find(o => o.id === orderId);
    if (matched) {
      setRecordCustomer(matched.customerName);
      setRecordAmount(matched.totalAmount);
    }
  };

  const handleRecordSubmit = (e) => {
    e.preventDefault();
    if (!recordAmount) return;

    const newTxn = recordPayment({
      orderId: recordOrderId || `ORD-${Math.floor(9000 + Math.random() * 900)}`,
      customerName: recordCustomer || 'Walk-in Guest',
      amount: Number(recordAmount),
      paymentMethod: recordMethod,
      provider: recordProvider,
      cashier: currentUser?.name || 'Cashier Desk'
    });

    setIsRecordModalOpen(false);

    // Open receipt immediately for the newly paid transaction!
    handleViewReceipt(newTxn);
  };

  const handleViewReceipt = (payment) => {
    const linkedOrder = orders.find(o => o.id === payment.orderId);
    setActiveReceipt({
      payment,
      order: linkedOrder || {
        id: payment.orderId,
        customerName: payment.customerName,
        tableNumber: 'Front Counter',
        items: [
          { name: 'Restaurant Dining Service', price: payment.amount, quantity: 1 }
        ]
      }
    });
  };

  const handlePrint = () => {
    window.print();
  };

  const columns = [
    {
      key: 'id',
      label: 'Transaction ID',
      width: '140px',
      render: (r) => (
        <span style={{ fontWeight: 700, color: 'var(--primary-blue)' }}>
          {r.id}
        </span>
      )
    },
    {
      key: 'orderId',
      label: 'Order ID',
      width: '120px',
      render: (r) => (
        <span style={{ fontWeight: 600, color: 'var(--royal-blue)' }}>
          {r.orderId}
        </span>
      )
    },
    {
      key: 'customer',
      label: 'Customer',
      render: (r) => <strong>{r.customerName}</strong>
    },
    {
      key: 'method',
      label: 'Payment Method',
      render: (r) => {
        let icon = <Banknote size={14} />;
        if (r.paymentMethod === 'Mobile Money') icon = <Smartphone size={14} />;
        if (r.paymentMethod === 'Card') icon = <CreditCard size={14} />;

        return (
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            {icon}
            <span>{r.paymentMethod}</span>
            {r.provider && (
              <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                ({r.provider})
              </span>
            )}
          </div>
        );
      }
    },
    {
      key: 'amount',
      label: 'Amount Paid',
      render: (r) => (
        <span style={{ fontWeight: 800, color: 'var(--royal-blue)', fontSize: '0.95rem' }}>
          {formatCurrency(r.amount)}
        </span>
      )
    },
    {
      key: 'date',
      label: 'Date & Time',
      render: (r) => (
        <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
          {formatDate(r.date, true)}
        </span>
      )
    },
    {
      key: 'status',
      label: 'Status',
      render: (r) => <StatusBadge status={r.status} />
    },
    {
      key: 'actions',
      label: 'Receipt',
      align: 'right',
      render: (r) => (
        <button
          className="btn btn-outline btn-sm"
          onClick={() => handleViewReceipt(r)}
          title="View & Print Customer Receipt"
        >
          <Printer size={14} /> Receipt
        </button>
      )
    }
  ];

  return (
    <div className="payments-page">
      <PageHeader
        title="Payments & POS Receipts"
        subtitle="Process bills, track transaction settlements, and print official fiscal receipts."
      >
        <button
          className="btn btn-primary"
          onClick={() => {
            setRecordOrderId(unpaidOrders[0]?.id || '');
            setRecordCustomer(unpaidOrders[0]?.customerName || '');
            setRecordAmount(unpaidOrders[0]?.totalAmount || '');
            setIsRecordModalOpen(true);
          }}
        >
          <Plus size={18} /> Record Payment
        </button>
      </PageHeader>

      {/* Aggregate Metric Cards */}
      <div className="stat-cards-grid" style={{ marginBottom: '24px' }}>
        <div className="stat-card">
          <div className="stat-card-header">
            <span className="stat-card-title">Total Revenue Collected</span>
            <div className="stat-icon-wrapper green">
              <DollarSign size={22} />
            </div>
          </div>
          <div className="stat-card-value">{formatCurrency(metrics.totalCollected)}</div>
          <div className="stat-card-footer">
            <span className="stat-trend-label">{payments.length} settled transactions</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-card-header">
            <span className="stat-card-title">Mobile Money (MTN / Airtel)</span>
            <div className="stat-icon-wrapper gold">
              <Smartphone size={22} />
            </div>
          </div>
          <div className="stat-card-value">{formatCurrency(metrics.momoCollected)}</div>
          <div className="stat-card-footer">
            <span className="stat-trend-label">Primary payment channel (56%)</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-card-header">
            <span className="stat-card-title">Card (Visa / Mastercard)</span>
            <div className="stat-icon-wrapper terracotta">
              <CreditCard size={22} />
            </div>
          </div>
          <div className="stat-card-value">{formatCurrency(metrics.cardCollected)}</div>
          <div className="stat-card-footer">
            <span className="stat-trend-label">POS terminal settlements</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-card-header">
            <span className="stat-card-title">Cash on Hand</span>
            <div className="stat-icon-wrapper charcoal">
              <Banknote size={22} />
            </div>
          </div>
          <div className="stat-card-value">{formatCurrency(metrics.cashCollected)}</div>
          <div className="stat-card-footer">
            <span className="stat-trend-label">Register cash float balance</span>
          </div>
        </div>
      </div>

      {/* Filters and Search Bar */}
      <div className="card" style={{ padding: '18px 24px', marginBottom: '24px' }}>
        <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ flex: '1', minWidth: '240px', maxWidth: '380px' }}>
            <SearchBar
              value={searchTerm}
              onChange={setSearchTerm}
              placeholder="Search by Transaction ID, Order #, Guest..."
            />
          </div>

          <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)' }}>Payment Channel:</span>
            {['All', 'Mobile Money', 'Card', 'Cash'].map(method => (
              <button
                key={method}
                type="button"
                className={`btn btn-sm ${methodFilter === method ? 'btn-primary' : 'btn-outline'}`}
                onClick={() => setMethodFilter(method)}
                style={{ borderRadius: 'var(--radius-full)' }}
              >
                {method}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Payments Data Table */}
      <DataTable
        columns={columns}
        data={filteredPayments}
        keyField="id"
        pageSize={8}
        emptyTitle="No payment records found"
        emptyMessage="No transaction logs match the selected search criteria."
      />

      {/* Record Payment Modal */}
      <Modal
        isOpen={isRecordModalOpen}
        onClose={() => setIsRecordModalOpen(false)}
        title="Record Bill Payment"
        size="md"
        footer={
          <>
            <button
              type="button"
              className="btn btn-outline"
              onClick={() => setIsRecordModalOpen(false)}
            >
              Cancel
            </button>
            <button
              type="button"
              className="btn btn-primary"
              onClick={handleRecordSubmit}
            >
              Confirm Settlement & Print
            </button>
          </>
        }
      >
        <form onSubmit={handleRecordSubmit}>
          {unpaidOrders.length > 0 && (
            <div className="form-group">
              <label className="form-label">Quick Select Pending Unpaid Order</label>
              <select
                className="form-control"
                value={recordOrderId}
                onChange={e => handleSelectOrderToPay(e.target.value)}
              >
                <option value="">-- Choose an open order --</option>
                {unpaidOrders.map(o => (
                  <option key={o.id} value={o.id}>
                    {o.id} — {o.customerName} ({o.tableNumber}) — {formatCurrency(o.totalAmount)}
                  </option>
                ))}
              </select>
            </div>
          )}

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Order Reference ID</label>
              <input
                type="text"
                className="form-control"
                placeholder="ORD-9025"
                value={recordOrderId}
                onChange={e => setRecordOrderId(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Customer Name</label>
              <input
                type="text"
                className="form-control"
                placeholder="Walk-in Guest"
                value={recordCustomer}
                onChange={e => setRecordCustomer(e.target.value)}
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Amount in UGX <span className="required">*</span></label>
              <input
                type="number"
                min="0"
                step="500"
                required
                className="form-control"
                placeholder="e.g. 80000"
                value={recordAmount}
                onChange={e => setRecordAmount(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Payment Channel</label>
              <select
                className="form-control"
                value={recordMethod}
                onChange={e => {
                  const m = e.target.value;
                  setRecordMethod(m);
                  if (m === 'Mobile Money') setRecordProvider('MTN MoMo');
                  else if (m === 'Card') setRecordProvider('Visa Platinum');
                  else setRecordProvider('UGX Cash');
                }}
              >
                <option value="Mobile Money">Mobile Money</option>
                <option value="Card">Credit / Debit Card</option>
                <option value="Cash">Cash (UGX)</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Payment Provider / Reference</label>
            <input
              type="text"
              className="form-control"
              placeholder="e.g. MTN MoMo, Airtel Money, Visa, Stanbic POS"
              value={recordProvider}
              onChange={e => setRecordProvider(e.target.value)}
            />
          </div>
        </form>
      </Modal>

      {/* Official Printable Receipt Modal */}
      {activeReceipt && (
        <Modal
          isOpen={!!activeReceipt}
          onClose={() => setActiveReceipt(null)}
          title="Printable Customer Receipt"
          size="md"
          footer={
            <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
              <button
                type="button"
                className="btn btn-outline"
                onClick={() => setActiveReceipt(null)}
              >
                Close
              </button>
              <button
                type="button"
                className="btn btn-primary"
                onClick={handlePrint}
              >
                <Printer size={16} /> Print Receipt Now
              </button>
            </div>
          }
        >
          {/* Receipt Printable Card */}
          <div className="receipt-printable">
            <div className="receipt-header">
              <h2>{restaurantDetails.name}</h2>
              <div style={{ fontSize: '0.75rem', color: '#555' }}>
                {restaurantDetails.address}
              </div>
              <div style={{ fontSize: '0.75rem', color: '#555' }}>
                Tel: {restaurantDetails.phone}
              </div>
              <div style={{ fontSize: '0.75rem', fontWeight: 700, marginTop: '2px' }}>
                TIN: {restaurantDetails.tin}
              </div>
            </div>

            <div className="receipt-meta-grid">
              <div><strong>Receipt #:</strong> {activeReceipt.payment.id}</div>
              <div><strong>Order #:</strong> {activeReceipt.order.id}</div>
              <div><strong>Date:</strong> {formatDate(activeReceipt.payment.date)}</div>
              <div><strong>Time:</strong> {new Date(activeReceipt.payment.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
              <div><strong>Customer:</strong> {activeReceipt.order.customerName}</div>
              <div><strong>Location:</strong> {activeReceipt.order.tableNumber || 'Table'}</div>
              <div><strong>Cashier:</strong> {activeReceipt.payment.cashier || 'Front Desk'}</div>
              <div><strong>Status:</strong> PAID</div>
            </div>

            <table className="receipt-table">
              <thead>
                <tr>
                  <th>Item</th>
                  <th style={{ textAlign: 'center' }}>Qty</th>
                  <th style={{ textAlign: 'right' }}>Price</th>
                  <th style={{ textAlign: 'right' }}>Total</th>
                </tr>
              </thead>
              <tbody>
                {activeReceipt.order.items.map((it, idx) => (
                  <tr key={idx}>
                    <td>{it.name}</td>
                    <td style={{ textAlign: 'center' }}>{it.quantity}</td>
                    <td style={{ textAlign: 'right' }}>{it.price?.toLocaleString()}</td>
                    <td style={{ textAlign: 'right' }}>{(it.price * it.quantity)?.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="receipt-totals">
              <div className="receipt-total-row">
                <span>Subtotal (Net):</span>
                <span>UGX {Math.round(activeReceipt.payment.amount * 0.82).toLocaleString()}</span>
              </div>
              <div className="receipt-total-row">
                <span>VAT (18% Included):</span>
                <span>UGX {Math.round(activeReceipt.payment.amount * 0.18).toLocaleString()}</span>
              </div>
              <div className="receipt-total-row receipt-grand-total">
                <span>GRAND TOTAL:</span>
                <span>{formatCurrency(activeReceipt.payment.amount)}</span>
              </div>
            </div>

            <div style={{ marginTop: '10px', fontSize: '0.8rem', textAlign: 'center' }}>
              <div><strong>Paid via:</strong> {activeReceipt.payment.paymentMethod} ({activeReceipt.payment.provider})</div>
              <div style={{ letterSpacing: '2px', margin: '4px 0', fontSize: '0.7rem' }}>
                ★ ★ ★ PAID IN FULL ★ ★ ★
              </div>
            </div>

            <div className="receipt-footer">
              <div>Thank you for dining with DinePoint!</div>
              <div>Exquisite Hospitality in Kampala</div>
              <div>{restaurantDetails.website}</div>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}

