import React, { useState, useMemo } from 'react';
import {
  Plus,
  Edit2,
  Trash2,
  Search,
  Filter,
  Check,
  X,
  AlertTriangle,
  Clock,
  Sparkles
} from 'lucide-react';
import PageHeader from '../components/PageHeader';
import StatusBadge from '../components/StatusBadge';
import Modal from '../components/Modal';
import SearchBar from '../components/SearchBar';
import { useRestaurant } from '../context/RestaurantContext';
import { formatCurrency } from '../utils/formatCurrency';

export default function MenuManagement() {
  const {
    menuItems,
    addMenuItem,
    updateMenuItem,
    deleteMenuItem,
    toggleItemAvailability,
    categories
  } = useRestaurant();

  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [availabilityFilter, setAvailabilityFilter] = useState('All'); // 'All' | 'Available' | 'Out of Stock'

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('add'); // 'add' | 'edit'
  const [activeItem, setActiveItem] = useState(null);

  // Delete Confirmation State
  const [deleteConfirmItem, setDeleteConfirmItem] = useState(null);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    category: 'Main Course',
    description: '',
    price: '',
    prepTime: '15 mins',
    image: '',
    available: true
  });

  // Sample image presets for fast selection
  const imagePresets = [
    { label: 'Fish / Tilapia', url: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&w=600&q=80' },
    { label: 'Gourmet Burger', url: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=600&q=80' },
    { label: 'Meat / BBQ', url: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=600&q=80' },
    { label: 'Breakfast / Rolex', url: 'https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?auto=format&fit=crop&w=600&q=80' },
    { label: 'Pasta', url: 'https://images.unsplash.com/photo-1621996346565-e3d5d6281691?auto=format&fit=crop&w=600&q=80' },
    { label: 'Pizza', url: 'https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?auto=format&fit=crop&w=600&q=80' },
    { label: 'Cooler / Drink', url: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=600&q=80' },
    { label: 'Dessert Cake', url: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=600&q=80' }
  ];

  // Filtered menu items
  const filteredItems = useMemo(() => {
    return menuItems.filter(item => {
      const matchCat = selectedCategory === 'All' || item.category === selectedCategory;
      const matchSearch =
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchAvail =
        availabilityFilter === 'All'
          ? true
          : availabilityFilter === 'Available'
          ? item.available
          : !item.available;

      return matchCat && matchSearch && matchAvail;
    });
  }, [menuItems, selectedCategory, searchTerm, availabilityFilter]);

  const handleOpenAddModal = () => {
    setModalMode('add');
    setFormData({
      name: '',
      category: 'Main Course',
      description: '',
      price: '',
      prepTime: '20 mins',
      image: imagePresets[0].url,
      available: true
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (item) => {
    setModalMode('edit');
    setActiveItem(item);
    setFormData({
      name: item.name,
      category: item.category,
      description: item.description,
      price: item.price,
      prepTime: item.prepTime || '15 mins',
      image: item.image,
      available: item.available
    });
    setIsModalOpen(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.price) return;

    if (modalMode === 'add') {
      addMenuItem({
        name: formData.name,
        category: formData.category,
        description: formData.description,
        price: Number(formData.price),
        prepTime: formData.prepTime,
        image: formData.image || imagePresets[0].url,
        available: formData.available
      });
    } else {
      updateMenuItem(activeItem.id, {
        name: formData.name,
        category: formData.category,
        description: formData.description,
        price: Number(formData.price),
        prepTime: formData.prepTime,
        image: formData.image,
        available: formData.available
      });
    }
    setIsModalOpen(false);
  };

  const handleConfirmDelete = () => {
    if (deleteConfirmItem) {
      deleteMenuItem(deleteConfirmItem.id);
      setDeleteConfirmItem(null);
    }
  };

  return (
    <div className="menu-management-page">
      <PageHeader
        title="Menu Management"
        subtitle={`Managing ${menuItems.length} culinary dishes across ${categories.length - 1} categories.`}
      >
        <button className="btn btn-primary" onClick={handleOpenAddModal}>
          <Plus size={18} /> Add Food Item
        </button>
      </PageHeader>

      {/* Filter and Search Bar Row */}
      <div className="card" style={{ padding: '18px 24px', marginBottom: '24px' }}>
        <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ flex: '1', minWidth: '240px', maxWidth: '400px' }}>
            <SearchBar
              value={searchTerm}
              onChange={setSearchTerm}
              placeholder="Search by food name or ingredients..."
            />
          </div>

          <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
            <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)' }}>Status:</label>
            <select
              className="form-control"
              style={{ width: 'auto', padding: '6px 12px' }}
              value={availabilityFilter}
              onChange={(e) => setAvailabilityFilter(e.target.value)}
            >
              <option value="All">All Statuses</option>
              <option value="Available">Available Only</option>
              <option value="Out of Stock">Out of Stock</option>
            </select>
          </div>
        </div>

        {/* Category Filter Pills */}
        <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingTop: '16px', marginTop: '12px', borderTop: '1px solid var(--border-grey)' }}>
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              className={`btn btn-sm ${selectedCategory === cat ? 'btn-primary' : 'btn-outline'}`}
              onClick={() => setSelectedCategory(cat)}
              style={{ borderRadius: 'var(--radius-full)' }}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Menu Items Grid */}
      {filteredItems.length === 0 ? (
        <div className="card">
          <div className="empty-state">
            <div className="empty-state-icon">
              <Sparkles size={32} />
            </div>
            <h3>No menu items found</h3>
            <p>Try clearing your search query or choosing another category filter.</p>
            <button className="btn btn-outline-primary btn-sm" onClick={() => { setSearchTerm(''); setSelectedCategory('All'); setAvailabilityFilter('All'); }}>
              Reset Filters
            </button>
          </div>
        </div>
      ) : (
        <div className="popular-food-grid">
          {filteredItems.map(item => (
            <div key={item.id} className="food-card">
              <div className="food-card-img-wrapper">
                <img
                  src={item.image}
                  alt={item.name}
                  className="food-card-img"
                  loading="lazy"
                />
                <span className="food-card-category-tag">{item.category}</span>
                <span className="food-card-rating">★ {item.rating || '4.8'}</span>
              </div>

              <div className="food-card-body">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '6px' }}>
                  <h3 className="food-card-name">{item.name}</h3>
                  <StatusBadge status={item.available ? 'Available' : 'Out of Stock'} />
                </div>

                <p className="food-card-desc">{item.description}</p>

                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '14px' }}>
                  <Clock size={13} /> Prep time: {item.prepTime || '20 mins'}
                </div>

                <div className="food-card-footer">
                  <div>
                    <span className="food-card-price">{formatCurrency(item.price)}</span>
                  </div>

                  <div style={{ display: 'flex', gap: '6px' }}>
                    <button
                      className="btn btn-outline btn-sm btn-icon"
                      onClick={() => toggleItemAvailability(item.id)}
                      title={item.available ? 'Mark as Out of Stock' : 'Mark as Available'}
                      style={{
                        color: item.available ? 'var(--success)' : 'var(--danger)'
                      }}
                    >
                      {item.available ? <Check size={16} /> : <X size={16} />}
                    </button>
                    <button
                      className="btn btn-outline btn-sm btn-icon"
                      onClick={() => handleOpenEditModal(item)}
                      title="Edit Item"
                    >
                      <Edit2 size={16} />
                    </button>
                    <button
                      className="btn btn-outline btn-sm btn-icon"
                      onClick={() => setDeleteConfirmItem(item)}
                      title="Delete Item"
                      style={{ color: '#e53e3e' }}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add / Edit Menu Item Modal Form */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={modalMode === 'add' ? 'Add New Food Item' : `Edit Food Item – ${activeItem?.name}`}
        size="lg"
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
              {modalMode === 'add' ? 'Save Item to Menu' : 'Update Menu Item'}
            </button>
          </>
        }
      >
        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Food Item Name <span className="required">*</span></label>
              <input
                type="text"
                className="form-control"
                required
                placeholder="e.g. Pan-Seared Tilapia Fillet"
                value={formData.name}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Category <span className="required">*</span></label>
              <select
                className="form-control"
                value={formData.category}
                onChange={e => setFormData({ ...formData, category: e.target.value })}
              >
                {categories.filter(c => c !== 'All').map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Price in UGX <span className="required">*</span></label>
              <input
                type="number"
                min="0"
                step="500"
                className="form-control"
                required
                placeholder="e.g. 35000"
                value={formData.price}
                onChange={e => setFormData({ ...formData, price: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Estimated Preparation Time</label>
              <input
                type="text"
                className="form-control"
                placeholder="e.g. 15-20 mins"
                value={formData.prepTime}
                onChange={e => setFormData({ ...formData, prepTime: e.target.value })}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Description & Ingredients</label>
            <textarea
              className="form-control"
              placeholder="Describe flavors, cooking technique, side accompaniments..."
              value={formData.description}
              onChange={e => setFormData({ ...formData, description: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Image URL</label>
            <input
              type="url"
              className="form-control"
              placeholder="https://images.unsplash.com/..."
              value={formData.image}
              onChange={e => setFormData({ ...formData, image: e.target.value })}
            />
            {/* Quick preset selector */}
            <div style={{ marginTop: '8px' }}>
              <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Or pick a photo preset: </span>
              <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginTop: '4px' }}>
                {imagePresets.map(preset => (
                  <button
                    key={preset.label}
                    type="button"
                    className="btn btn-outline btn-sm"
                    style={{ fontSize: '0.75rem', padding: '3px 8px' }}
                    onClick={() => setFormData({ ...formData, image: preset.url })}
                  >
                    {preset.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="form-group" style={{ marginTop: '16px' }}>
            <label className="form-checkbox">
              <input
                type="checkbox"
                checked={formData.available}
                onChange={e => setFormData({ ...formData, available: e.target.checked })}
              />
              <span>Available for ordering immediately (In Stock)</span>
            </label>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Modal */}
      {deleteConfirmItem && (
        <Modal
          isOpen={!!deleteConfirmItem}
          onClose={() => setDeleteConfirmItem(null)}
          title="Confirm Menu Item Deletion"
          footer={
            <>
              <button
                type="button"
                className="btn btn-outline"
                onClick={() => setDeleteConfirmItem(null)}
              >
                Cancel
              </button>
              <button
                type="button"
                className="btn btn-danger"
                onClick={handleConfirmDelete}
              >
                Delete Item
              </button>
            </>
          }
        >
          <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
            <div
              style={{
                width: '48px',
                height: '48px',
                borderRadius: '50%',
                backgroundColor: '#fed7d7',
                color: '#c53030',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}
            >
              <AlertTriangle size={24} />
            </div>
            <div>
              <h4 style={{ margin: '0 0 6px', fontSize: '1rem' }}>
                Are you sure you want to remove "{deleteConfirmItem.name}"?
              </h4>
              <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                This item will be deleted from the active menu. Historical sales reports will retain past order records.
              </p>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}

