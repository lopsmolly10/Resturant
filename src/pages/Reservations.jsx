import React, { useState, useMemo } from 'react';
import {
  CalendarDays,
  Plus,
  Users,
  Clock,
  Phone,
  Mail,
  CheckCircle,
  XCircle,
  Trash2,
  LayoutGrid,
  Sparkles
} from 'lucide-react';
import PageHeader from '../components/PageHeader';
import StatusBadge from '../components/StatusBadge';
import Modal from '../components/Modal';
import SearchBar from '../components/SearchBar';
import DataTable from '../components/DataTable';
import { useRestaurant } from '../context/RestaurantContext';
import { formatDate } from '../utils/formatCurrency';

export default function Reservations() {
  const {
    reservations,
    tables,
    addReservation,
    updateReservationStatus,
    deleteReservation,
    updateTableStatus
  } = useRestaurant();

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [selectedTableFilter, setSelectedTableFilter] = useState('All');

  // Modal State
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [deleteConfirmRes, setDeleteConfirmRes] = useState(null);

  // New Reservation Form
  const [formData, setFormData] = useState({
    customerName: '',
    phone: '',
    email: '',
    date: '2026-11-02',
    time: '19:00',
    guests: 2,
    tableNumber: 'Table 3',
    notes: ''
  });

  // Filtered reservations
  const filteredReservations = useMemo(() => {
    return reservations.filter(r => {
      const matchSearch =
        r.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.phone.includes(searchTerm) ||
        r.tableNumber.toLowerCase().includes(searchTerm.toLowerCase());
      const matchStatus = statusFilter === 'All' || r.status === statusFilter;
      const matchTable = selectedTableFilter === 'All' || r.tableNumber === selectedTableFilter;
      return matchSearch && matchStatus && matchTable;
    });
  }, [reservations, searchTerm, statusFilter, selectedTableFilter]);

  const handleOpenAdd = (prefillTable = null) => {
    setFormData({
      customerName: '',
      phone: '',
      email: '',
      date: new Date().toISOString().split('T')[0],
      time: '19:30',
      guests: 2,
      tableNumber: prefillTable ? prefillTable.name : (tables.find(t => t.status === 'Available')?.name || 'Table 1'),
      notes: ''
    });
    setIsAddModalOpen(true);
  };

  const handleAddSubmit = (e) => {
    e.preventDefault();
    if (!formData.customerName || !formData.phone) return;

    addReservation({
      customerName: formData.customerName,
      phone: formData.phone,
      email: formData.email,
      date: formData.date,
      time: formData.time,
      guests: Number(formData.guests) || 2,
      tableNumber: formData.tableNumber,
      notes: formData.notes
    });

    setIsAddModalOpen(false);
  };

  const getTableStatusColor = (status) => {
    switch (status) {
      case 'Available':
        return '#38a169'; // Green
      case 'Occupied':
        return '#dd6b20'; // Terracotta / Orange
      case 'Reserved':
        return '#805ad5'; // Purple
      default:
        return '#718096';
    }
  };

  const columns = [
    {
      key: 'id',
      label: 'ID',
      width: '100px',
      render: (r) => (
        <span style={{ fontWeight: 700, color: 'var(--primary-forest)' }}>
          {r.id}
        </span>
      )
    },
    {
      key: 'customer',
      label: 'Guest Info',
      render: (r) => (
        <div>
          <strong style={{ display: 'block', fontSize: '0.92rem' }}>{r.customerName}</strong>
          <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
            <Phone size={12} style={{ display: 'inline', marginRight: '3px' }} />
            {r.phone}
          </span>
        </div>
      )
    },
    {
      key: 'datetime',
      label: 'Date & Time',
      render: (r) => (
        <div>
          <span style={{ fontWeight: 600 }}>{formatDate(r.date)}</span>
          <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
            <Clock size={12} style={{ display: 'inline', marginRight: '3px' }} />
            {r.time}
          </div>
        </div>
      )
    },
    {
      key: 'table',
      label: 'Assigned Table',
      render: (r) => (
        <div>
          <span style={{ fontWeight: 700, color: 'var(--primary-forest)' }}>
            {r.tableNumber}
          </span>
          <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
            <Users size={12} style={{ display: 'inline', marginRight: '3px' }} />
            {r.guests} Guests
          </div>
        </div>
      )
    },
    {
      key: 'notes',
      label: 'Special Request',
      render: (r) => (
        <span style={{ fontSize: '0.82rem', color: r.notes ? 'var(--text-charcoal)' : 'var(--text-light)' }}>
          {r.notes || 'No special requests'}
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
      label: 'Actions',
      align: 'right',
      render: (r) => (
        <div style={{ display: 'flex', gap: '6px', justifyContent: 'flex-end' }}>
          {r.status === 'Confirmed' && (
            <button
              className="btn btn-primary btn-sm"
              onClick={() => updateReservationStatus(r.id, 'Seated')}
              title="Seat Guest at Table"
            >
              Seat Guests
            </button>
          )}

          {r.status === 'Seated' && (
            <button
              className="btn btn-gold btn-sm"
              onClick={() => updateReservationStatus(r.id, 'Completed')}
              title="Mark Finished"
            >
              Complete
            </button>
          )}

          {r.status !== 'Cancelled' && r.status !== 'Completed' && (
            <button
              className="btn btn-outline btn-sm"
              onClick={() => updateReservationStatus(r.id, 'Cancelled')}
              title="Cancel Booking"
              style={{ color: '#c53030' }}
            >
              Cancel
            </button>
          )}

          <button
            className="btn btn-outline btn-sm btn-icon"
            onClick={() => setDeleteConfirmRes(r)}
            title="Delete Record"
            style={{ color: '#e53e3e' }}
          >
            <Trash2 size={15} />
          </button>
        </div>
      )
    }
  ];

  return (
    <div className="reservations-page">
      <PageHeader
        title="Table Reservations & Floor Plan"
        subtitle={`Managing dining bookings and capacity for 12 restaurant tables.`}
      >
        <button className="btn btn-primary" onClick={() => handleOpenAdd()}>
          <Plus size={18} /> New Reservation
        </button>
      </PageHeader>

      {/* Visual Table Availability Section */}
      <div className="card" style={{ marginBottom: '28px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px', flexWrap: 'wrap', gap: '10px' }}>
          <div>
            <h3 style={{ margin: 0, fontSize: '1.25rem', fontFamily: 'Playfair Display, serif' }}>
              Restaurant Floor Plan & Live Availability
            </h3>
            <p style={{ margin: '3px 0 0', fontSize: '0.82rem', color: 'var(--text-muted)' }}>
              Click any available table to book an instant reservation.
            </p>
          </div>

          {/* Legend */}
          <div style={{ display: 'flex', gap: '16px', fontSize: '0.82rem', alignItems: 'center' }}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ width: '12px', height: '12px', borderRadius: '3px', background: '#38a169' }}></span>
              Available ({tables.filter(t => t.status === 'Available').length})
            </span>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ width: '12px', height: '12px', borderRadius: '3px', background: '#dd6b20' }}></span>
              Occupied ({tables.filter(t => t.status === 'Occupied').length})
            </span>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ width: '12px', height: '12px', borderRadius: '3px', background: '#805ad5' }}></span>
              Reserved ({tables.filter(t => t.status === 'Reserved').length})
            </span>
          </div>
        </div>

        {/* 12 Tables Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))',
            gap: '14px'
          }}
        >
          {tables.map(table => {
            const isAvail = table.status === 'Available';
            const color = getTableStatusColor(table.status);

            return (
              <div
                key={table.id}
                onClick={() => {
                  if (isAvail) handleOpenAdd(table);
                }}
                style={{
                  background: 'var(--surface-alt)',
                  border: `2px solid ${color}`,
                  borderRadius: '12px',
                  padding: '14px',
                  cursor: isAvail ? 'pointer' : 'default',
                  transition: 'all var(--transition-fast)',
                  position: 'relative',
                  overflow: 'hidden'
                }}
                title={isAvail ? `Click to reserve ${table.name}` : `${table.name} is ${table.status}`}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <span style={{ fontWeight: 800, fontSize: '0.95rem', color: 'var(--primary-forest)' }}>
                    {table.name}
                  </span>
                  <span
                    style={{
                      fontSize: '0.72rem',
                      fontWeight: 700,
                      color: '#fff',
                      backgroundColor: color,
                      padding: '2px 6px',
                      borderRadius: '4px'
                    }}
                  >
                    {table.status}
                  </span>
                </div>

                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                  Section: <strong>{table.section}</strong>
                </div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                  Capacity: <strong>{table.capacity} Persons</strong>
                </div>

                {isAvail && (
                  <div style={{ marginTop: '8px', fontSize: '0.74rem', color: 'var(--primary-forest)', fontWeight: 600 }}>
                    + Book Table
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Reservation Filter and List */}
      <div className="card" style={{ padding: '18px 24px', marginBottom: '24px' }}>
        <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ flex: '1', minWidth: '240px', maxWidth: '380px' }}>
            <SearchBar
              value={searchTerm}
              onChange={setSearchTerm}
              placeholder="Search by guest name, phone, table..."
            />
          </div>

          <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)' }}>Filter:</span>
            {['All', 'Confirmed', 'Seated', 'Completed', 'Cancelled'].map(st => (
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
      </div>

      {/* Reservations Table */}
      <DataTable
        columns={columns}
        data={filteredReservations}
        keyField="id"
        pageSize={8}
        emptyTitle="No reservations found"
        emptyMessage="No guest reservations match your current filter."
      />

      {/* Add Reservation Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Reserve a Table"
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
              Confirm Reservation
            </button>
          </>
        }
      >
        <form onSubmit={handleAddSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Guest Full Name <span className="required">*</span></label>
              <input
                type="text"
                className="form-control"
                required
                placeholder="e.g. Samuel Mukasa"
                value={formData.customerName}
                onChange={e => setFormData({ ...formData, customerName: e.target.value })}
              />
            </div>
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
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Email Address</label>
              <input
                type="email"
                className="form-control"
                placeholder="guest@domain.com"
                value={formData.email}
                onChange={e => setFormData({ ...formData, email: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Number of Guests</label>
              <input
                type="number"
                min="1"
                max="20"
                className="form-control"
                value={formData.guests}
                onChange={e => setFormData({ ...formData, guests: e.target.value })}
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Reservation Date <span className="required">*</span></label>
              <input
                type="date"
                className="form-control"
                required
                value={formData.date}
                onChange={e => setFormData({ ...formData, date: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Reservation Time <span className="required">*</span></label>
              <input
                type="time"
                className="form-control"
                required
                value={formData.time}
                onChange={e => setFormData({ ...formData, time: e.target.value })}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Assign Table</label>
            <select
              className="form-control"
              value={formData.tableNumber}
              onChange={e => setFormData({ ...formData, tableNumber: e.target.value })}
            >
              {tables.map(t => (
                <option key={t.id} value={t.name}>
                  {t.name} — {t.section} ({t.capacity} seats, {t.status})
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Special Occasion & Requests</label>
            <textarea
              className="form-control"
              placeholder="e.g. Birthday champagne toast, quiet corner booth, wheelchair access..."
              value={formData.notes}
              onChange={e => setFormData({ ...formData, notes: e.target.value })}
            />
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation */}
      {deleteConfirmRes && (
        <Modal
          isOpen={!!deleteConfirmRes}
          onClose={() => setDeleteConfirmRes(null)}
          title="Delete Reservation"
          footer={
            <>
              <button
                className="btn btn-outline"
                onClick={() => setDeleteConfirmRes(null)}
              >
                Keep Record
              </button>
              <button
                className="btn btn-danger"
                onClick={() => {
                  deleteReservation(deleteConfirmRes.id);
                  setDeleteConfirmRes(null);
                }}
              >
                Delete
              </button>
            </>
          }
        >
          <p>
            Are you sure you want to delete reservation <strong>{deleteConfirmRes.id}</strong> for {deleteConfirmRes.customerName}?
          </p>
        </Modal>
      )}
    </div>
  );
}

