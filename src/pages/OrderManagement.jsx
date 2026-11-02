import React, { useState, useMemo } from 'react';
import {
  Plus,
  Search,
  Filter,
  Eye,
  Trash2,
  CheckCircle2,
  Clock,
  Printer,
  ShoppingBag,
  CreditCard,
  User
} from 'lucide-react';
import PageHeader from '../components/PageHeader';
import StatusBadge from '../components/StatusBadge';
import Modal from '../components/Modal';
import SearchBar from '../components/SearchBar';
import DataTable from '../components/DataTable';
import { useRestaurant } from '../context/RestaurantContext';
import { useAuth } from '../context/AuthContext';
import { formatCurrency, formatDate } from '../utils/formatCurrency';

export default function OrderManagement() {
  const {
    orders,
    createOrder,
    updateOrderStatus,
    updateOrderPaymentStatus,
    deleteOrder,
    menuItems,
    tables
  } = useRestaurant();
  const { currentUser } = useAuth();

  const [statusFilter, setStatusFilter] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');

  // Modals
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [viewingOrder, setViewingOrder] = useState(null);
  const [deleteConfirmOrder, setDeleteConfirmOrder] = useState(null);

  // New Order Form state
  const [newOrderCustomer, setNewOrderCustomer] = useState('');
  const [newOrderPhone, setNewOrderPhone] = useState('');
  const [newOrderTable, setNewOrderTable] = useState('Table 1');
  const [newOrderType, setNewOrderType] = useState('Dine-In');
  const [newOrderNotes, setNewOrderNotes] = useState('');
  const [selectedItems, setSelectedItems] = useState([
    { menuItemId: menuItems[0]?.id || '', quantity: 1, notes: '' }
  ]);
  const [paymentMethod, setPaymentMethod] = useState('Cash');
  const [paymentStatus, setPaymentStatus] = useState('Unpaid');

  // Filtered orders list
  const filteredOrders = useMemo(() => {
    return orders.filter(order => {
      const matchStatus = statusFilter === 'All' || order.status === statusFilter;
      const matchSearch =
        order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.tableNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.items.some(i => i.name.toLowerCase().includes(searchTerm.toLowerCase()));

      return matchStatus && matchSearch;
    });
  }, [orders, statusFilter, searchTerm]);

  // Calculate total for new order form
  const computedTotal = useMemo(() => {
    return selectedItems.reduce((sum, item) => {
      const dish = menuItems.find(m => m.id === item.menuItemId);
      return sum + (dish ? dish.price * (Number(item.quantity) || 1) : 0);
    }, 0);
  }, [selectedItems, menuItems]);

  const handleAddItemRow = () => {
    setSelectedItems(prev => [
      ...prev,
      { menuItemId: menuItems[0]?.id || '', quantity: 1, notes: '' }
    ]);
  };

  const handleRemoveItemRow = (index) => {
    if (selectedItems.length > 1) {
      setSelectedItems(prev => prev.filter((_, idx) => idx !== index));
    }
  };

  const handleItemChange = (index, field, value) => {
    setSelectedItems(prev => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  };

  const handleCreateOrderSubmit = (e) => {
    e.preventDefault();
    if (!newOrderCustomer) return;

    const formattedItems = selectedItems.map(si => {
      const dish = menuItems.find(m => m.id === si.menuItemId) || menuItems[0];
      return {
        id: dish.id,
        name: dish.name,
        price: dish.price,
        quantity: Number(si.quantity) || 1,
        notes: si.notes || ''
      };
    });

    createOrder({
      customerName: newOrderCustomer,
      customerPhone: newOrderPhone,
      tableNumber: newOrderType === 'Takeaway' ? 'Takeaway' : newOrderTable,
      orderType: newOrderType,
      items: formattedItems,
      totalAmount: computedTotal,
      paymentMethod,
      paymentStatus,
      serverName: currentUser?.name || 'Staff',
      specialNotes: newOrderNotes
    });

    setIsCreateModalOpen(false);
    // Reset form
    setNewOrderCustomer('');
    setNewOrderPhone('');
    setNewOrderNotes('');
    setSelectedItems([{ menuItemId: menuItems[0]?.id || '', quantity: 1, notes: '' }]);
  };

  // Table Columns Definition
  const columns = [
    {
      key: 'id',
      label: 'Order ID',
      width: '120px',
      render: (row) => (
        <span style={{ fontWeight: 700, color: 'var(--primary-forest)' }}>
          {row.id}
        </span>
      )
    },
    {
      key: 'customer',
      label: 'Customer & Table',
      render: (row) => (
        <div>
          <div style={{ fontWeight: 600 }}>{row.customerName}</div>
          <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
            {row.tableNumber} {row.orderType ? `• ${row.orderType}` : ''}
          </div>
        </div>
      )
    },
    {
      key: 'items',
      label: 'Dishes Ordered',
      render: (row) => (
        <div style={{ maxWidth: '300px', fontSize: '0.84rem' }}>
          {row.items.map(item => `${item.name} (x${item.quantity})`).join(', ')}
        </div>
      )
    },
    {
      key: 'amount',
      label: 'Total (UGX)',
      render: (row) => (
        <span style={{ fontWeight: 800, color: 'var(--primary-forest)' }}>
          {formatCurrency(row.totalAmount)}
        </span>
      )
    },
    {
      key: 'payment',
      label: 'Payment',
      render: (row) => (
        <div>
          <StatusBadge status={row.paymentStatus} />
          <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', marginTop: '2px' }}>
            {row.paymentMethod}
          </div>
        </div>
      )
    },
    {
      key: 'orderTime',
      label: 'Time Placed',
      render: (row) => (
        <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
          {formatDate(row.orderTime, true)}
        </span>
      )
    },
    {
      key: 'status',
      label: 'Order Status',
      render: (row) => <StatusBadge status={row.status} />
    },
    {
      key: 'actions',
      label: 'Actions',
      align: 'right',
      render: (row) => (
        <div style={{ display: 'flex', gap: '6px', justifyContent: 'flex-end' }}>
          <button
            className="btn btn-outline btn-sm btn-icon"
            onClick={() => setViewingOrder(row)}
            title="View Details"
          >
            <Eye size={15} />
          </button>
          <button
            className="btn btn-outline btn-sm btn-icon"
            onClick={() => setDeleteConfirmOrder(row)}
            title="Cancel / Delete Order"
            style={{ color: '#e53e3e' }}
          >
            <Trash2 size={15} />
          </button>
        </div>
      )
    }
  ];

  const statusTabs = ['All', 'Pending', 'Preparing', 'Ready', 'Served', 'Cancelled'];

  return (
    <div className="orders-page">
      <PageHeader
        title="Order Management"
        subtitle={`Live overview of all ${orders.length} customer orders, billing and preparation stages.`}
      >
        <button
          className="btn btn-primary"
          onClick={() => setIsCreateModalOpen(true)}
        >
          <Plus size={18} /> Create New Order
        </button>
      </PageHeader>

      {/* Filter Tabs & Search Header */}
      <div className="card" style={{ padding: '18px 24px', marginBottom: '24px' }}>
        <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ flex: '1', minWidth: '240px', maxWidth: '380px' }}>
            <SearchBar
              value={searchTerm}
              onChange={setSearchTerm}
              placeholder="Search by Order ID, customer, table..."
            />
          </div>

          {/* Status Tabs */}
          <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
            {statusTabs.map(st => (
              <button
                key={st}
                type="button"
                className={`btn btn-sm ${statusFilter === st ? 'btn-primary' : 'btn-outline'}`}
                onClick={() => setStatusFilter(st)}
                style={{ borderRadius: 'var(--radius-full)' }}
              >
                {st}
                {st !== 'All' && (
                  <span style={{ marginLeft: '4px', opacity: 0.8 }}>
                    ({orders.filter(o => o.status === st).length})
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Orders Table */}
      <DataTable
        columns={columns}
        data={filteredOrders}
        keyField="id"
        pageSize={8}
        emptyTitle="No orders found"
        emptyMessage="No customer orders match the selected filter or search keyword."
      />

      {/* Create New Order Modal */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Create New Restaurant Order"
        size="lg"
        footer={
          <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center' }}>
            <div>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Estimated Total: </span>
              <strong style={{ fontSize: '1.2rem', color: 'var(--primary-forest)' }}>
                {formatCurrency(computedTotal)}
              </strong>
            </div>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                type="button"
                className="btn btn-outline"
                onClick={() => setIsCreateModalOpen(false)}
              >
                Cancel
              </button>
              <button
                type="button"
                className="btn btn-primary"
                onClick={handleCreateOrderSubmit}
              >
                Confirm & Send to Kitchen
              </button>
            </div>
          </div>
        }
      >
        <form onSubmit={handleCreateOrderSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Customer Name <span className="required">*</span></label>
              <input
                type="text"
                className="form-control"
                required
                placeholder="e.g. Juliet Namaganda"
                value={newOrderCustomer}
                onChange={e => setNewOrderCustomer(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Customer Phone</label>
              <input
                type="text"
                className="form-control"
                placeholder="+256 700 000 000"
                value={newOrderPhone}
                onChange={e => setNewOrderPhone(e.target.value)}
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Order Type</label>
              <select
                className="form-control"
                value={newOrderType}
                onChange={e => setNewOrderType(e.target.value)}
              >
                <option value="Dine-In">Dine-In</option>
                <option value="Takeaway">Takeaway</option>
                <option value="Delivery">Delivery</option>
              </select>
            </div>

            {newOrderType === 'Dine-In' && (
              <div className="form-group">
                <label className="form-label">Table Number</label>
                <select
                  className="form-control"
                  value={newOrderTable}
                  onChange={e => setNewOrderTable(e.target.value)}
                >
                  {tables.map(t => (
                    <option key={t.id} value={t.name}>
                      {t.name} ({t.capacity} seats - {t.status})
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>

          {/* Items Selector */}
          <div className="form-group">
            <label className="form-label">Select Food Dishes & Quantities <span className="required">*</span></label>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {selectedItems.map((item, idx) => {
                const dish = menuItems.find(m => m.id === item.menuItemId);
                return (
                  <div
                    key={idx}
                    style={{
                      display: 'flex',
                      gap: '10px',
                      alignItems: 'center',
                      background: 'var(--surface-alt)',
                      padding: '10px 14px',
                      borderRadius: '8px'
                    }}
                  >
                    <div style={{ flex: 2 }}>
                      <select
                        className="form-control"
                        value={item.menuItemId}
                        onChange={e => handleItemChange(idx, 'menuItemId', e.target.value)}
                      >
                        {menuItems.map(m => (
                          <option key={m.id} value={m.id}>
                            {m.name} ({formatCurrency(m.price)})
                          </option>
                        ))}
                      </select>
                    </div>

                    <div style={{ width: '80px' }}>
                      <input
                        type="number"
                        min="1"
                        max="20"
                        className="form-control"
                        value={item.quantity}
                        onChange={e => handleItemChange(idx, 'quantity', e.target.value)}
                      />
                    </div>

                    <div style={{ flex: 1.5 }}>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Instructions (e.g. no onions)"
                        value={item.notes}
                        onChange={e => handleItemChange(idx, 'notes', e.target.value)}
                      />
                    </div>

                    <div style={{ width: '100px', textAlign: 'right', fontWeight: 700, fontSize: '0.88rem' }}>
                      {dish ? formatCurrency(dish.price * item.quantity) : 'UGX 0'}
                    </div>

                    {selectedItems.length > 1 && (
                      <button
                        type="button"
                        className="btn btn-outline btn-sm"
                        style={{ color: '#e53e3e', padding: '6px' }}
                        onClick={() => handleRemoveItemRow(idx)}
                      >
                        <Trash2 size={16} />
                      </button>
                    )}
                  </div>
                );
              })}
            </div>

            <button
              type="button"
              className="btn btn-outline-primary btn-sm"
              style={{ marginTop: '10px' }}
              onClick={handleAddItemRow}
            >
              <Plus size={14} /> Add Another Dish
            </button>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Payment Method</label>
              <select
                className="form-control"
                value={paymentMethod}
                onChange={e => setPaymentMethod(e.target.value)}
              >
                <option value="Cash">Cash (UGX)</option>
                <option value="Mobile Money">Mobile Money (MTN / Airtel)</option>
                <option value="Card">Card (Visa / Mastercard)</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Initial Payment Status</label>
              <select
                className="form-control"
                value={paymentStatus}
                onChange={e => setPaymentStatus(e.target.value)}
              >
                <option value="Unpaid">Unpaid (Pay Later)</option>
                <option value="Paid">Paid Immediately</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Special Order Instructions</label>
            <textarea
              className="form-control"
              placeholder="e.g. Dietary restrictions, customer birthday celebration, urgent express serving..."
              value={newOrderNotes}
              onChange={e => setNewOrderNotes(e.target.value)}
            />
          </div>
        </form>
      </Modal>

      {/* View Individual Order Details Modal */}
      {viewingOrder && (
        <Modal
          isOpen={!!viewingOrder}
          onClose={() => setViewingOrder(null)}
          title={`Order #${viewingOrder.id} Overview`}
          size="md"
          footer={
            <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center' }}>
              <div style={{ display: 'flex', gap: '8px' }}>
                <select
                  className="form-control"
                  style={{ width: 'auto', padding: '6px 10px', fontSize: '0.85rem' }}
                  value={viewingOrder.status}
                  onChange={(e) => {
                    const newSt = e.target.value;
                    updateOrderStatus(viewingOrder.id, newSt);
                    setViewingOrder({ ...viewingOrder, status: newSt });
                  }}
                >
                  <option value="Pending">Status: Pending</option>
                  <option value="Preparing">Status: Preparing</option>
                  <option value="Ready">Status: Ready</option>
                  <option value="Served">Status: Served</option>
                  <option value="Cancelled">Status: Cancelled</option>
                </select>

                {viewingOrder.paymentStatus !== 'Paid' && (
                  <button
                    className="btn btn-gold btn-sm"
                    onClick={() => {
                      updateOrderPaymentStatus(viewingOrder.id, 'Paid', viewingOrder.paymentMethod);
                      setViewingOrder({ ...viewingOrder, paymentStatus: 'Paid' });
                    }}
                  >
                    Mark Paid
                  </button>
                )}
              </div>

              <button
                className="btn btn-outline btn-sm"
                onClick={() => setViewingOrder(null)}
              >
                Close
              </button>
            </div>
          }
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-grey)', paddingBottom: '12px' }}>
              <div>
                <h4 style={{ margin: 0, fontSize: '1.1rem' }}>{viewingOrder.customerName}</h4>
                <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                  {viewingOrder.tableNumber} • {viewingOrder.orderType}
                </div>
                <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                  Phone: {viewingOrder.customerPhone || 'N/A'}
                </div>
              </div>

              <div style={{ textAlign: 'right' }}>
                <StatusBadge status={viewingOrder.status} />
                <div style={{ marginTop: '4px' }}>
                  <StatusBadge status={viewingOrder.paymentStatus} />
                </div>
              </div>
            </div>

            {/* Items list */}
            <div>
              <h5 style={{ fontSize: '0.9rem', marginBottom: '8px', color: 'var(--primary-forest)' }}>Items Summary:</h5>
              <div style={{ background: 'var(--surface-alt)', borderRadius: '8px', padding: '12px' }}>
                {viewingOrder.items.map((it, idx) => (
                  <div
                    key={idx}
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      padding: '6px 0',
                      borderBottom: idx === viewingOrder.items.length - 1 ? 'none' : '1px solid rgba(0,0,0,0.06)'
                    }}
                  >
                    <div>
                      <strong>{it.quantity}x {it.name}</strong>
                      {it.notes && (
                        <div style={{ fontSize: '0.76rem', color: 'var(--accent-terracotta)' }}>
                          Note: {it.notes}
                        </div>
                      )}
                    </div>
                    <span>{formatCurrency(it.price * it.quantity)}</span>
                  </div>
                ))}
              </div>
            </div>

            {viewingOrder.specialNotes && (
              <div style={{ background: '#fffaf0', border: '1px solid #feebc8', padding: '10px 14px', borderRadius: '8px', fontSize: '0.84rem' }}>
                <strong>Special Request:</strong> {viewingOrder.specialNotes}
              </div>
            )}

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '10px', borderTop: '1px solid var(--border-grey)' }}>
              <span style={{ fontSize: '1rem', fontWeight: 700 }}>Total Order Value:</span>
              <span style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--primary-forest)' }}>
                {formatCurrency(viewingOrder.totalAmount)}
              </span>
            </div>
          </div>
        </Modal>
      )}

      {/* Delete / Cancel Order Confirmation */}
      {deleteConfirmOrder && (
        <Modal
          isOpen={!!deleteConfirmOrder}
          onClose={() => setDeleteConfirmOrder(null)}
          title="Cancel / Delete Order"
          footer={
            <>
              <button
                className="btn btn-outline"
                onClick={() => setDeleteConfirmOrder(null)}
              >
                Back
              </button>
              <button
                className="btn btn-danger"
                onClick={() => {
                  deleteOrder(deleteConfirmOrder.id);
                  setDeleteConfirmOrder(null);
                }}
              >
                Delete Order
              </button>
            </>
          }
        >
          <p>
            Are you sure you want to delete order <strong>{deleteConfirmOrder.id}</strong> for {deleteConfirmOrder.customerName}?
          </p>
        </Modal>
      )}
    </div>
  );
}

