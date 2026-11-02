import React, { useState } from 'react';
import {
  UserCog,
  Plus,
  Shield,
  ShieldCheck,
  Phone,
  Mail,
  CheckCircle,
  XCircle,
  Trash2,
  Lock,
  UserCheck
} from 'lucide-react';
import PageHeader from '../components/PageHeader';
import StatusBadge from '../components/StatusBadge';
import Modal from '../components/Modal';
import DataTable from '../components/DataTable';
import { useRestaurant } from '../context/RestaurantContext';
import { formatDate } from '../utils/formatCurrency';

export default function UserManagement() {
  const { users, addUser, updateUser, toggleUserStatus, deleteUser } = useRestaurant();
  const [roleFilter, setRoleFilter] = useState('All');

  // Modals
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [deleteConfirmUser, setDeleteConfirmUser] = useState(null);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    username: '',
    role: 'Waiter',
    email: '',
    phone: '',
    shift: 'Full Time',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80'
  });

  const roles = ['All', 'Administrator', 'Manager', 'Chef', 'Waiter', 'Cashier'];

  const filteredUsers = users.filter(u =>
    roleFilter === 'All' ? true : u.role === roleFilter
  );

  const handleOpenAdd = () => {
    setFormData({
      name: '',
      username: '',
      role: 'Waiter',
      email: '',
      phone: '',
      shift: 'Morning Shift',
      avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=150&q=80'
    });
    setIsAddModalOpen(true);
  };

  const handleAddSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.username) return;

    addUser({
      name: formData.name,
      username: formData.username.toLowerCase(),
      role: formData.role,
      email: formData.email,
      phone: formData.phone,
      shift: formData.shift,
      avatar: formData.avatar
    });

    setIsAddModalOpen(false);
  };

  const columns = [
    {
      key: 'name',
      label: 'Staff Member',
      render: (r) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <img
            src={r.avatar}
            alt={r.name}
            style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover' }}
          />
          <div>
            <strong style={{ color: 'var(--primary-blue)', display: 'block' }}>{r.name}</strong>
            <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
              @{r.username}
            </span>
          </div>
        </div>
      )
    },
    {
      key: 'role',
      label: 'System Role',
      render: (r) => {
        let badgeColor = 'var(--primary-blue)';
        let badgeBg = 'var(--pale-blue)';
        if (r.role === 'Administrator') {
          badgeColor = 'var(--deep-blue)';
          badgeBg = 'var(--light-blue)';
        } else if (r.role === 'Manager') {
          badgeColor = 'var(--primary-blue)';
          badgeBg = 'var(--pale-blue)';
        } else if (r.role === 'Chef') {
          badgeColor = 'var(--royal-blue)';
          badgeBg = '#E0EDFE';
        } else if (r.role === 'Cashier') {
          badgeColor = 'var(--medium-blue)';
          badgeBg = 'var(--pale-blue)';
        }

        return (
          <span
            style={{
              padding: '4px 10px',
              borderRadius: 'var(--radius-full)',
              fontSize: '0.78rem',
              fontWeight: 700,
              backgroundColor: badgeBg,
              color: badgeColor,
              border: `1px solid var(--border-grey)`
            }}
          >
            <ShieldCheck size={12} style={{ display: 'inline', marginRight: '4px' }} />
            {r.role}
          </span>
        );
      }
    },
    {
      key: 'contact',
      label: 'Email & Phone',
      render: (r) => (
        <div style={{ fontSize: '0.82rem' }}>
          <div>{r.email}</div>
          <div style={{ color: 'var(--text-muted)' }}>{r.phone}</div>
        </div>
      )
    },
    {
      key: 'shift',
      label: 'Assigned Shift',
      render: (r) => (
        <span style={{ fontSize: '0.85rem' }}>{r.shift || 'Full Time'}</span>
      )
    },
    {
      key: 'status',
      label: 'Status',
      render: (r) => <StatusBadge status={r.status} />
    },
    {
      key: 'joinedDate',
      label: 'Date Joined',
      render: (r) => (
        <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
          {formatDate(r.joinedDate)}
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
            className="btn btn-outline btn-sm"
            onClick={() => toggleUserStatus(r.id)}
            title="Toggle Active / Inactive"
          >
            {r.status === 'Active' ? 'Deactivate' : 'Activate'}
          </button>
          <button
            className="btn btn-outline btn-sm btn-icon"
            onClick={() => setDeleteConfirmUser(r)}
            title="Remove Staff Account"
            style={{ color: '#e53e3e' }}
          >
            <Trash2 size={15} />
          </button>
        </div>
      )
    }
  ];

  return (
    <div className="users-page">
      <PageHeader
        title="User & Staff Management"
        subtitle={`System credentials, roles and shift schedules for ${users.length} restaurant employees.`}
      >
        <button className="btn btn-primary" onClick={handleOpenAdd}>
          <Plus size={18} /> Add Staff Account
        </button>
      </PageHeader>

      {/* Role Filter Bar */}
      <div className="card" style={{ padding: '16px 24px', marginBottom: '24px' }}>
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
          <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)' }}>Role Filter:</span>
          {roles.map(r => (
            <button
              key={r}
              type="button"
              className={`btn btn-sm ${roleFilter === r ? 'btn-primary' : 'btn-outline'}`}
              onClick={() => setRoleFilter(r)}
              style={{ borderRadius: 'var(--radius-full)' }}
            >
              {r} {r !== 'All' && `(${users.filter(u => u.role === r).length})`}
            </button>
          ))}
        </div>
      </div>

      {/* Staff Table */}
      <DataTable
        columns={columns}
        data={filteredUsers}
        keyField="id"
        pageSize={8}
        emptyTitle="No staff accounts found"
        emptyMessage="No employees found under this role filter."
      />

      {/* Permissions Matrix Info Card */}
      <div className="card" style={{ marginTop: '28px' }}>
        <h3 style={{ fontSize: '1.2rem', marginBottom: '14px', fontFamily: 'Playfair Display, serif' }}>
          Role & Access Control Permissions
        </h3>
        <div className="table-responsive">
          <table className="data-table" style={{ fontSize: '0.82rem' }}>
            <thead>
              <tr>
                <th>Role</th>
                <th>Menu & Pricing</th>
                <th>Order Creation & POS</th>
                <th>Kitchen Display</th>
                <th>Table Reservations</th>
                <th>Inventory Stock</th>
                <th>Sales Reports</th>
                <th>User Accounts</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><strong>Administrator</strong></td>
                <td>Full Edit</td>
                <td>Full Access</td>
                <td>Full Access</td>
                <td>Full Access</td>
                <td>Full Access</td>
                <td>Full Access</td>
                <td>Full Access</td>
              </tr>
              <tr>
                <td><strong>Manager</strong></td>
                <td>Full Edit</td>
                <td>Full Access</td>
                <td>Full Access</td>
                <td>Full Access</td>
                <td>Full Access</td>
                <td>Full Access</td>
                <td>View Only</td>
              </tr>
              <tr>
                <td><strong>Chef</strong></td>
                <td>View Recipes</td>
                <td>View Orders</td>
                <td>Cook & Advance Status</td>
                <td>View Headcount</td>
                <td>Update Quantities</td>
                <td>No Access</td>
                <td>No Access</td>
              </tr>
              <tr>
                <td><strong>Waiter</strong></td>
                <td>View Catalog</td>
                <td>Create & Serve</td>
                <td>View Ready Tickets</td>
                <td>Book & Seat Guests</td>
                <td>View Levels</td>
                <td>No Access</td>
                <td>No Access</td>
              </tr>
              <tr>
                <td><strong>Cashier</strong></td>
                <td>View Prices</td>
                <td>Process Payments & Receipts</td>
                <td>View Tickets</td>
                <td>View Bookings</td>
                <td>No Access</td>
                <td>Daily POS Report</td>
                <td>No Access</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Staff Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Add Staff Member"
        size="md"
        footer={
          <>
            <button
              type="button"
              className="btn btn-outline"
              onClick={() => setIsAddModalOpen(false)}
            >
              Cancel
            </button>
            <button
              type="button"
              className="btn btn-primary"
              onClick={handleAddSubmit}
            >
              Create Account
            </button>
          </>
        }
      >
        <form onSubmit={handleAddSubmit}>
          <div className="form-group">
            <label className="form-label">Full Name <span className="required">*</span></label>
            <input
              type="text"
              className="form-control"
              required
              placeholder="e.g. Christine Auma"
              value={formData.name}
              onChange={e => setFormData({ ...formData, name: e.target.value })}
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Username <span className="required">*</span></label>
              <input
                type="text"
                className="form-control"
                required
                placeholder="e.g. christine"
                value={formData.username}
                onChange={e => setFormData({ ...formData, username: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Role <span className="required">*</span></label>
              <select
                className="form-control"
                value={formData.role}
                onChange={e => setFormData({ ...formData, role: e.target.value })}
              >
                <option value="Administrator">Administrator</option>
                <option value="Manager">Manager</option>
                <option value="Chef">Chef</option>
                <option value="Waiter">Waiter</option>
                <option value="Cashier">Cashier</option>
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Email Address</label>
              <input
                type="email"
                className="form-control"
                placeholder="staff@dinepoint.ug"
                value={formData.email}
                onChange={e => setFormData({ ...formData, email: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Phone Contact</label>
              <input
                type="tel"
                className="form-control"
                placeholder="+256 700 000 000"
                value={formData.phone}
                onChange={e => setFormData({ ...formData, phone: e.target.value })}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Assigned Shift Schedule</label>
            <input
              type="text"
              className="form-control"
              placeholder="e.g. Morning Shift (07:00 - 15:00)"
              value={formData.shift}
              onChange={e => setFormData({ ...formData, shift: e.target.value })}
            />
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation */}
      {deleteConfirmUser && (
        <Modal
          isOpen={!!deleteConfirmUser}
          onClose={() => setDeleteConfirmUser(null)}
          title="Remove Staff Account"
          footer={
            <>
              <button
                className="btn btn-outline"
                onClick={() => setDeleteConfirmUser(null)}
              >
                Cancel
              </button>
              <button
                className="btn btn-danger"
                onClick={() => {
                  deleteUser(deleteConfirmUser.id);
                  setDeleteConfirmUser(null);
                }}
              >
                Delete Account
              </button>
            </>
          }
        >
          <p>
            Are you sure you want to delete staff account for <strong>{deleteConfirmUser.name}</strong> ({deleteConfirmUser.role})?
          </p>
        </Modal>
      )}
    </div>
  );
}

