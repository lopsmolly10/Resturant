import React, { useState, useMemo } from 'react';
import {
  Boxes,
  Plus,
  Search,
  Filter,
  AlertTriangle,
  Edit2,
  Trash2,
  PlusCircle,
  MinusCircle,
  Truck,
  ArrowUpDown
} from 'lucide-react';
import PageHeader from '../components/PageHeader';
import StatusBadge from '../components/StatusBadge';
import Modal from '../components/Modal';
import SearchBar from '../components/SearchBar';
import DataTable from '../components/DataTable';
import { useRestaurant } from '../context/RestaurantContext';
import { formatCurrency, formatDate } from '../utils/formatCurrency';

export default function Inventory() {
  const {
    inventory,
    addInventoryItem,
    updateInventoryItem,
    adjustInventoryQuantity,
    deleteInventoryItem
  } = useRestaurant();

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All'); // 'All' | 'Low Stock' | 'Out of Stock' | 'In Stock'
  const [categoryFilter, setCategoryFilter] = useState('All');

  // Modals
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('add'); // 'add' | 'edit'
  const [activeItem, setActiveItem] = useState(null);
  const [deleteConfirmItem, setDeleteConfirmItem] = useState(null);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    category: 'Produce',
    quantity: '',
    unit: 'kg',
    reorderLevel: 10,
    costPerUnit: '',
    supplier: ''
  });

  const inventoryCategories = [
    'All',
    'Produce',
    'Seafood & Meats',
    'Dairy',
    'Baking & Pastry',
    'Oils & Sauces',
    'Beverage Supplies'
  ];

  // Filtered inventory
  const filteredInventory = useMemo(() => {
    return inventory.filter(item => {
      const matchSearch =
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.supplier.toLowerCase().includes(searchTerm.toLowerCase());
      const matchStatus = statusFilter === 'All' || item.status === statusFilter;
      const matchCat = categoryFilter === 'All' || item.category === categoryFilter;
      return matchSearch && matchStatus && matchCat;
    });
  }, [inventory, searchTerm, statusFilter, categoryFilter]);

  const lowStockCount = inventory.filter(i => i.status === 'Low Stock' || i.status === 'Out of Stock').length;

  const handleOpenAdd = () => {
    setModalMode('add');
    setFormData({
      name: '',
      category: 'Produce',
      quantity: '',
      unit: 'kg',
      reorderLevel: 15,
      costPerUnit: '',
      supplier: ''
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item) => {
    setModalMode('edit');
    setActiveItem(item);
    setFormData({
      name: item.name,
      category: item.category,
      quantity: item.quantity,
      unit: item.unit,
      reorderLevel: item.reorderLevel,
      costPerUnit: item.costPerUnit,
      supplier: item.supplier
    });
    setIsModalOpen(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name) return;

    if (modalMode === 'add') {
      addInventoryItem(formData);
    } else {
      updateInventoryItem(activeItem.id, formData);
    }
    setIsModalOpen(false);
  };

  const columns = [
    {
      key: 'name',
      label: 'Ingredient / Item',
      render: (r) => (
        <div>
          <div style={{ fontWeight: 700, color: 'var(--primary-forest)' }}>{r.name}</div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            Category: {r.category}
          </div>
        </div>
      )
    },
    {
      key: 'quantity',
      label: 'Available Quantity',
      render: (r) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <button
            type="button"
            className="btn btn-outline btn-sm btn-icon"
            style={{ width: '26px', height: '26px' }}
            onClick={() => adjustInventoryQuantity(r.id, -1)}
            title="Deduct 1 unit"
          >
            <MinusCircle size={14} />
          </button>
          <span style={{ fontWeight: 800, minWidth: '40px', textAlign: 'center', fontSize: '0.95rem' }}>
            {r.quantity} {r.unit}
          </span>
          <button
            type="button"
            className="btn btn-outline btn-sm btn-icon"
            style={{ width: '26px', height: '26px' }}
            onClick={() => adjustInventoryQuantity(r.id, 1)}
            title="Add 1 unit"
          >
            <PlusCircle size={14} />
          </button>
        </div>
      )
    },
    {
      key: 'reorderLevel',
      label: 'Reorder Level',
      render: (r) => (
        <span style={{ fontSize: '0.85rem' }}>
          {r.reorderLevel} {r.unit}
        </span>
      )
    },
    {
      key: 'cost',
      label: 'Unit Cost',
      render: (r) => (
        <span style={{ fontWeight: 600 }}>
          {formatCurrency(r.costPerUnit)}
        </span>
      )
    },
    {
      key: 'supplier',
      label: 'Supplier',
      render: (r) => (
        <span style={{ fontSize: '0.82rem', color: 'var(--text-charcoal)' }}>
          {r.supplier || 'Local Market'}
        </span>
      )
    },
    {
      key: 'status',
      label: 'Stock Status',
      render: (r) => <StatusBadge status={r.status} />
    },
    {
      key: 'lastUpdated',
      label: 'Last Restocked',
      render: (r) => (
        <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
          {formatDate(r.lastUpdated)}
        </span>
      )
    },
    {
      key: 'actions',
      label: 'Actions',
      align: 'right',
      render: (r) => (
        <div style={{ display: 'flex', gap: '6px', justifyContent: 'flex-end' }}>
          <button
            className="btn btn-outline btn-sm btn-icon"
            onClick={() => handleOpenEdit(r)}
            title="Edit Stock Item"
          >
            <Edit2 size={15} />
          </button>
          <button
            className="btn btn-outline btn-sm btn-icon"
            onClick={() => setDeleteConfirmItem(r)}
            title="Delete Item"
            style={{ color: '#e53e3e' }}
          >
            <Trash2 size={15} />
          </button>
        </div>
      )
    }
  ];

  return (
    <div className="inventory-page">
      <PageHeader
        title="Inventory & Stock Management"
        subtitle={`Monitoring ${inventory.length} kitchen ingredients, spices, beverages and supplies.`}
      >
        <button className="btn btn-primary" onClick={handleOpenAdd}>
          <Plus size={18} /> Add Stock Item
        </button>
      </PageHeader>

      {/* Low-stock Warning Banner */}
      {lowStockCount > 0 && (
        <div
          style={{
            background: 'var(--status-lowstock-bg)',
            border: '1px solid var(--status-lowstock-border)',
            borderRadius: 'var(--radius-lg)',
            padding: '16px 20px',
            marginBottom: '24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '12px'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                background: '#feebc8',
                color: '#c05621',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <AlertTriangle size={22} />
            </div>
            <div>
              <h4 style={{ margin: 0, color: '#9c4221', fontSize: '0.98rem' }}>
                Inventory Reorder Alert: {lowStockCount} items need attention!
              </h4>
              <p style={{ margin: '2px 0 0', fontSize: '0.82rem', color: '#7b341e' }}>
                Supplies have dipped below defined minimum thresholds. Review stock to prevent kitchen shortages.
              </p>
            </div>
          </div>

          <button
            className="btn btn-secondary btn-sm"
            onClick={() => setStatusFilter('Low Stock')}
          >
            View Low Stock Items
          </button>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="card" style={{ padding: '18px 24px', marginBottom: '24px' }}>
        <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ flex: '1', minWidth: '240px', maxWidth: '380px' }}>
            <SearchBar
              value={searchTerm}
              onChange={setSearchTerm}
              placeholder="Search ingredient or supplier..."
            />
          </div>

          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center' }}>
            <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)' }}>Status:</label>
            {['All', 'In Stock', 'Low Stock', 'Out of Stock'].map(st => (
              <button
                key={st}
                type="button"
                className={`btn btn-sm ${statusFilter === st ? 'btn-primary' : 'btn-outline'}`}
                onClick={() => setStatusFilter(st)}
                style={{ borderRadius: 'var(--radius-full)' }}
              >
                {st}
              </button>
            ))}
          </div>
        </div>

        {/* Category Pills */}
        <div style={{ display: 'flex', gap: '6px', overflowX: 'auto', paddingTop: '14px', marginTop: '12px', borderTop: '1px solid var(--border-grey)' }}>
          {inventoryCategories.map(cat => (
            <button
              key={cat}
              type="button"
              className={`btn btn-sm ${categoryFilter === cat ? 'btn-gold' : 'btn-outline'}`}
              onClick={() => setCategoryFilter(cat)}
              style={{ borderRadius: 'var(--radius-full)', fontSize: '0.78rem' }}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Inventory Table */}
      <DataTable
        columns={columns}
        data={filteredInventory}
        keyField="id"
        pageSize={9}
        emptyTitle="No inventory records found"
        emptyMessage="Try adjusting your search criteria or category filter."
      />

      {/* Add / Edit Inventory Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={modalMode === 'add' ? 'Add Inventory Ingredient' : `Edit ${activeItem?.name}`}
        size="md"
        footer={
          <>
            <button
              type="button"
              className="btn btn-outline"
              onClick={() => setIsModalOpen(false)}
            >
              Cancel
            </button>
            <button
              type="button"
              className="btn btn-primary"
              onClick={handleSubmit}
            >
              {modalMode === 'add' ? 'Save Stock Item' : 'Update Stock Item'}
            </button>
          </>
        }
      >
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Ingredient / Item Name <span className="required">*</span></label>
            <input
              type="text"
              className="form-control"
              required
              placeholder="e.g. Fresh Tilapia Fillet"
              value={formData.name}
              onChange={e => setFormData({ ...formData, name: e.target.value })}
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Category</label>
              <select
                className="form-control"
                value={formData.category}
                onChange={e => setFormData({ ...formData, category: e.target.value })}
              >
                {inventoryCategories.filter(c => c !== 'All').map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Measurement Unit</label>
              <select
                className="form-control"
                value={formData.unit}
                onChange={e => setFormData({ ...formData, unit: e.target.value })}
              >
                <option value="kg">Kilograms (kg)</option>
                <option value="Liters">Liters (L)</option>
                <option value="g">Grams (g)</option>
                <option value="boxes">Boxes</option>
                <option value="bags">Bags</option>
                <option value="bottles">Bottles</option>
                <option value="cans">Cans</option>
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Current Available Quantity <span className="required">*</span></label>
              <input
                type="number"
                min="0"
                step="any"
                className="form-control"
                required
                value={formData.quantity}
                onChange={e => setFormData({ ...formData, quantity: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Minimum Reorder Level <span className="required">*</span></label>
              <input
                type="number"
                min="1"
                className="form-control"
                required
                value={formData.reorderLevel}
                onChange={e => setFormData({ ...formData, reorderLevel: e.target.value })}
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Cost Per Unit (UGX)</label>
              <input
                type="number"
                min="0"
                step="500"
                className="form-control"
                placeholder="e.g. 15000"
                value={formData.costPerUnit}
                onChange={e => setFormData({ ...formData, costPerUnit: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Vendor / Supplier</label>
              <input
                type="text"
                className="form-control"
                placeholder="e.g. Nakasero Fresh Market"
                value={formData.supplier}
                onChange={e => setFormData({ ...formData, supplier: e.target.value })}
              />
            </div>
          </div>
        </form>
      </Modal>

      {/* Delete Item Confirmation */}
      {deleteConfirmItem && (
        <Modal
          isOpen={!!deleteConfirmItem}
          onClose={() => setDeleteConfirmItem(null)}
          title="Delete Inventory Item"
          footer={
            <>
              <button
                className="btn btn-outline"
                onClick={() => setDeleteConfirmItem(null)}
              >
                Cancel
              </button>
              <button
                className="btn btn-danger"
                onClick={() => {
                  deleteInventoryItem(deleteConfirmItem.id);
                  setDeleteConfirmItem(null);
                }}
              >
                Delete Item
              </button>
            </>
          }
        >
          <p>
            Are you sure you want to remove <strong>{deleteConfirmItem.name}</strong> from restaurant inventory?
          </p>
        </Modal>
      )}
    </div>
  );
}

