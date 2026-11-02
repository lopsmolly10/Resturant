import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ShoppingBag, AlertTriangle, CalendarCheck, Info, CheckCheck } from 'lucide-react';
import { useRestaurant } from '../context/RestaurantContext';
import { formatTimeAgo } from '../utils/formatCurrency';

export default function NotificationPanel({ onClose }) {
  const {
    notifications,
    markNotificationAsRead,
    markAllNotificationsAsRead
  } = useRestaurant();
  const navigate = useNavigate();

  const handleItemClick = (notif) => {
    markNotificationAsRead(notif.id);
    if (notif.link) {
      navigate(notif.link);
      onClose?.();
    }
  };

  const getIcon = (type) => {
    switch (type) {
      case 'order':
        return <ShoppingBag size={18} />;
      case 'warning':
        return <AlertTriangle size={18} />;
      case 'reservation':
        return <CalendarCheck size={18} />;
      default:
        return <Info size={18} />;
    }
  };

  return (
    <div className="notification-panel-dropdown" onClick={e => e.stopPropagation()}>
      <div className="notif-header">
        <h4>Notifications ({notifications.filter(n => !n.read).length} unread)</h4>
        <button
          className="btn btn-outline btn-sm"
          onClick={markAllNotificationsAsRead}
          title="Mark all as read"
        >
          <CheckCheck size={14} /> Read All
        </button>
      </div>

      <div className="notif-list">
        {notifications.length === 0 ? (
          <div style={{ padding: '24px', textAlign: 'center', color: 'var(--text-muted)' }}>
            No new notifications
          </div>
        ) : (
          notifications.map(notif => (
            <div
              key={notif.id}
              className={`notif-item ${!notif.read ? 'unread' : ''}`}
              onClick={() => handleItemClick(notif)}
            >
              <div className={`notif-icon-circle ${notif.type}`}>
                {getIcon(notif.type)}
              </div>
              <div className="notif-content-text">
                <div className="notif-content-title">{notif.title}</div>
                <div className="notif-content-desc">{notif.message}</div>
                <div className="notif-content-time">{formatTimeAgo(notif.timestamp)}</div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

