import React, { useState, useMemo } from 'react';
import {
  Users,
  Plus,
  Search,
  Phone,
  Mail,
  Award,
  Calendar,
  DollarSign,
  Heart,
  Edit2
} from 'lucide-react';
import PageHeader from '../components/PageHeader';
import SearchBar from '../components/SearchBar';
import DataTable from '../components/DataTable';
import Modal from '../components/Modal';
import { useRestaurant } from '../context/RestaurantContext';
import { formatCurrency, formatDate } from '../utils/formatCurrency';

export default function Customers() {
  const { customers, addCustomer, updateCustomer } = useRestaurant();
  const [searchTerm, setSearchTerm] = useState('');
  const [tierFilter, setTierFilter] = useState('All');

  // Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('add');
  const [activeCustomer, setActiveCustomer] = useState(null);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    tier: 'Silver',
    totalVisits: 1,
    totalSpent: '',
    favoriteDish: ''
  });

  const filteredCustomers = useMemo(() => {
    return customers.filter(c => {
      const matchSearch =
        c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.phone.includes(searchTerm) ||
        c.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.favoriteDish.toLowerCase().includes(searchTerm.toLowerCase());
      const matchTier = tierFilter === 'All' || c.tier === tierFilter;
      return matchSearch && matchTier;
    });
  }, [customers, searchTerm, tierFilter]);

  const handleOpenAdd = () => {
    setModalMode('add');
    setFormData({
      name: '',
      phone: '',
      email: '',
      tier: 'Silver',
      totalVisits: 1,
      totalSpent: '',
      favoriteDish: 'Grilled Tilapia Fillet'
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (c) => {
    setModalMode('edit');
    setActiveCustomer(c);
    setFormData({
      name: c.name,
      phone: c.phone,
      email: c.email,
      tier: c.tier,
      totalVisits: c.totalVisits,
      totalSpent: c.totalSpent,
      favoriteDish: c.favoriteDish
    });
    setIsModalOpen(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.phone) return;

    if (modalMode === 'add') {
      addCustomer({
        name: formData.name,
        phone: formData.phone,
        email: formData.email,
        tier: formData.tier,
        totalVisits: Number(formData.totalVisits) || 1,
        totalSpent: Number(formData.totalSpent) || 0,
        favoriteDish: formData.favoriteDish
      });
    } else {
      updateCustomer(activeCustomer.id, {
        name: formData.name,
        phone: formData.phone,
        email: formData.email,
        tier: formData.tier,
        totalVisits: Number(formData.totalVisits),
        totalSpent: Number(formData.totalSpent),
        favoriteDish: formData.favoriteDish
      });
    }

    setIsModalOpen(false);
  };

  const columns = [
    {
      key: 'name',
      label: 'Customer Name',
      render: (r) => (
        <div>
          <div style={{ fontWeight: 700, color: 'var(--primary-forest)' }}>{r.name}</div>
          <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
            <Mail size={12} style={{ display: 'inline', marginRight: '3px' }} />
            {r.email || 'No email provided'}
          </span>
        </div>
      )
    },
    {
      key: 'phone',
      label: 'Phone Contact',
      render: (r) => (
        <span style={{ fontSize: '0.85rem' }}>
          <Phone size={12} style={{ display: 'inline', marginRight: '3px' }} />
          {r.phone}
        </span>
      )
    },
    {
      key: 'tier',
      label: 'VIP Tier',
      render: (r) => {
        let badgeStyle = { backgroundColor: '#e2e8f0', color: '#4a5568' };
        if (r.tier === 'Platinum') badgeStyle = { backgroundColor: '#e9d8fd', color: '#6b46c1' };
        if (r.tier === 'Gold') badgeStyle = { backgroundColor: '#fefcbf', color: '#b7791f' };

        return (
          <span
            style={{
              padding: '3px 10px',
              borderRadius: 'var(--radius-full)',
              fontSize: '0.75rem',
              fontWeight: 700,
              ...badgeStyle
            }}
          >
            ★ {r.tier}
          </span>
        );
      }
    },
    {
      key: 'visits',
      label: 'Total Visits',
      render: (r) => (
        <span style={{ fontWeight: 700 }}>
          {r.totalVisits} visits
        </span>
      )
    },
    {
      key: 'spent',
      label: 'Total Spend (UGX)',
      render: (r) => (
        <span style={{ fontWeight: 800, color: 'var(--primary-forest)' }}>
          {formatCurrency(r.totalSpent)}
        </span>
      )
    },
    {
      key: 'favorite',
      label: 'Preferred Dish',
      render: (r) => (
        <span style={{ fontSize: '0.82rem', color: 'var(--accent-terracotta)' }}>
          <Heart size={12} style={{ display: 'inline', marginRight: '3px' }} />
          {r.favoriteDish || '—'}
        </span>
      )
    },
    {
      key: 'lastVisit',
      label: 'Last Dining Date',
      render: (r) => (
        <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
          {formatDate(r.lastVisit)}
        </span>
      )
    },
    {
      key: 'actions',
      label: 'Edit',
      align: 'right',
      render: (r) => (
        <button
          className="btn btn-outline btn-sm btn-icon"
          onClick={() => handleOpenEdit(r)}
          title="Edit Customer Details"
        >
          <Edit2 size={15} />
        </button>
      )
    }
  ];

  return (
    <div className="customers-page">
      <PageHeader
        title="Customer Directory & VIP Loyalty"
        subtitle={`Registered ${customers.length} dining guests, loyalty tiers and order histories.`}
      >
        <button className="btn btn-primary" onClick={handleOpenAdd}>
          <Plus size={18} /> Add Customer
        </button>
      </PageHeader>

      {/* Filter and Search Bar */}
      <div className="card" style={{ padding: '18px 24px', marginBottom: '24px' }}>
        <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ flex: '1', minWidth: '240px', maxWidth: '380px' }}>
            <SearchBar
              value={searchTerm}
              onChange={setSearchTerm}
              placeholder="Search by customer name, phone, email..."
            />
          </div>

          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)' }}>VIP Tier:</span>
            {['All', 'Platinum', 'Gold', 'Silver'].map(tier => (
              <button
                key={tier}
                type="button"
                className={`btn btn-sm ${tierFilter === tier ? 'btn-primary' : 'btn-outline'}`}
                onClick={() => setTierFilter(tier)}
                style={{ borderRadius: 'var(--radius-full)' }}
              >
                {tier}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Customers Table */}
      <DataTable
        columns={columns}
        data={filteredCustomers}
        keyField="id"
        pageSize={8}
        emptyTitle="No customer profiles found"
        emptyMessage="Try searching with a different name or phone number."
      />

      {/* Add / Edit Customer Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={modalMode === 'add' ? 'Register New Customer' : `Edit ${activeCustomer?.name}`}
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
              {modalMode === 'add' ? 'Save Customer' : 'Update Profile'}
            </button>
          </>
        }
      >
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Full Name <span className="required">*</span></label>
            <input
              type="text"
              className="form-control"
              required
              placeholder="e.g. Florence Tumusiime"
              value={formData.name}
              onChange={e => setFormData({ ...formData, name: e.target.value })}
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Phone Number <span className="required">*</span></label>
              <input
                type="tel"
                className="form-control"
                required
                placeholder="+256 700 000 000"
                value={formData.phone}
                onChange={e => setFormData({ ...formData, phone: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Email Address</label>
              <input
                type="email"
                className="form-control"
                placeholder="customer@domain.com"
                value={formData.email}
                onChange={e => setFormData({ ...formData, email: e.target.value })}
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Membership Tier</label>
              <select
                className="form-control"
                value={formData.tier}
                onChange={e => setFormData({ ...formData, tier: e.target.value })}
              >
                <option value="Silver">Silver (Standard)</option>
                <option value="Gold">Gold (Frequent Diner)</option>
                <option value="Platinum">Platinum (VIP Executive)</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Total Restaurant Visits</label>
              <input
                type="number"
                min="1"
                className="form-control"
                value={formData.totalVisits}
                onChange={e => setFormData({ ...formData, totalVisits: e.target.value })}
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Estimated Lifetime Spend (UGX)</label>
              <input
                type="number"
                min="0"
                step="5000"
                className="form-control"
                placeholder="e.g. 750000"
                value={formData.totalSpent}
                onChange={e => setFormData({ ...formData, totalSpent: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Favorite Dish</label>
              <input
                type="text"
                className="form-control"
                placeholder="e.g. Grilled Tilapia Fillet"
                value={formData.favoriteDish}
                onChange={e => setFormData({ ...formData, favoriteDish: e.target.value })}
              />
            </div>
          </div>
        </form>
      </Modal>
    </div>
  );
}

