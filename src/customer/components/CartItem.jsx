import React from 'react';
import { Plus, Minus, Trash2 } from 'lucide-react';
import { formatCurrency } from '../../utils/formatCurrency';
import { useCart } from '../context/CartContext';

export default function CartItem({ item }) {
  const { updateQuantity, removeFromCart } = useCart();

  return (
    <div className="cart-item-row">
      <img
        src={item.image}
        alt={item.name}
        className="cart-item-img"
      />

      <div className="cart-item-details">
        <h4 className="cart-item-name">{item.name}</h4>
        <div className="cart-item-price">{formatCurrency(item.price)} each</div>
        {item.notes && (
          <div className="cart-item-notes">
            ★ Note: {item.notes}
          </div>
        )}
      </div>

      <div className="cart-item-qty-controls">
        <button
          type="button"
          className="cart-qty-btn"
          onClick={() => updateQuantity(item.id, item.notes, item.quantity - 1)}
          title="Decrease quantity"
        >
          <Minus size={14} />
        </button>

        <span style={{ fontWeight: 800, minWidth: '24px', textAlign: 'center' }}>
          {item.quantity}
        </span>

        <button
          type="button"
          className="cart-qty-btn"
          onClick={() => updateQuantity(item.id, item.notes, item.quantity + 1)}
          title="Increase quantity"
        >
          <Plus size={14} />
        </button>
      </div>

      <div className="cart-item-total">
        {formatCurrency(item.price * item.quantity)}
      </div>

      <button
        type="button"
        className="btn-icon btn-outline"
        style={{ color: '#e53e3e', width: '34px', height: '34px' }}
        onClick={() => removeFromCart(item.id, item.notes)}
        title="Remove item"
      >
        <Trash2 size={16} />
      </button>
    </div>
  );
}

