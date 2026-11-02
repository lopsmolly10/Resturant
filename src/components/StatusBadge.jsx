import React from 'react';

/**
 * Standard Status Badge for orders, items, reservations, payments
 * @param {string} status - text like "Pending", "Preparing", "Ready", "Served", "Cancelled", "In Stock", "Low Stock", "Out of Stock", "Paid", "Unpaid"
 */
export default function StatusBadge({ status }) {
  if (!status) return null;

  const normalized = status.toLowerCase().replace(/\s+/g, '-');

  return (
    <span className={`status-badge ${normalized}`}>
      {status}
    </span>
  );
}

