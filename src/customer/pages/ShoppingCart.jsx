import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ShoppingBag,
  ArrowRight,
  Trash2,
  Utensils,
  Truck,
  Package,
  ArrowLeft
} from 'lucide-react';
import CartItem from '../components/CartItem';
import { useCart } from '../context/CartContext';
import { formatCurrency } from '../../utils/formatCurrency';

export default function ShoppingCart() {
  const {
    cartItems,
    itemCount,
    subtotal,
    deliveryFee,
    grandTotal,
    deliveryType,
    setDeliveryType,
    clearCart
  } = useCart();
  const navigate = useNavigate();

  if (cartItems.length === 0) {
    return (
      <div className="customer-section" style={{ textAlign: 'center', padding: '100px 24px' }}>
        <div
          style={{
            width: '84px',
            height: '84px',
            borderRadius: '50%',
            backgroundColor: 'var(--surface-alt)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 20px',
            color: 'var(--royal-blue)'
          }}
        >
          <ShoppingBag size={42} />
        </div>
        <h2 style={{ fontSize: '2rem', fontFamily: 'Playfair Display, serif', color: 'var(--deep-blue)' }}>
          Your Cart is Empty
        </h2>
        <p style={{ color: 'var(--text-muted)', maxWidth: '420px', margin: '10px auto 28px' }}>
          Looks like you haven't selected any dishes yet. Explore our freshly prepared menu to start your order!
        </p>
        <Link to="/customer/menu" className="btn btn-primary btn-lg" style={{ padding: '14px 32px' }}>
          Browse Menu Now <ArrowRight size={18} />
        </Link>
      </div>
    );
  }

  return (
    <div className="customer-cart-page">
      <div className="customer-section">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <h1 style={{ fontSize: '2.4rem', fontFamily: 'Playfair Display, serif', color: 'var(--deep-blue)', margin: 0 }}>
              Shopping Cart
            </h1>
            <p style={{ color: 'var(--text-muted)', margin: '4px 0 0' }}>
              You have {itemCount} delicious meal {itemCount === 1 ? 'item' : 'items'} in your cart.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '12px' }}>
            <Link to="/customer/menu" className="btn btn-outline btn-sm">
              <ArrowLeft size={16} /> Continue Shopping
            </Link>
            <button
              type="button"
              className="btn btn-outline btn-sm"
              style={{ color: '#e53e3e' }}
              onClick={clearCart}
            >
              <Trash2 size={16} /> Empty Cart
            </button>
          </div>
        </div>

        {/* Cart Grid: Items list & Summary Sidebar */}
        <div className="cart-layout-grid">
          {/* Items Card */}
          <div className="cart-items-card">
            {/* Dining Type Bar */}
            <div style={{ marginBottom: '20px', paddingBottom: '16px', borderBottom: '1px solid var(--border-grey)' }}>
              <span style={{ fontSize: '0.88rem', fontWeight: 700, color: 'var(--text-charcoal)', display: 'block', marginBottom: '10px' }}>
                How would you like to receive your food?
              </span>
              <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                <button
                  type="button"
                  className={`btn btn-sm ${deliveryType === 'Dine-In' ? 'btn-primary' : 'btn-outline'}`}
                  onClick={() => setDeliveryType('Dine-In')}
                >
                  <Utensils size={15} /> Dine-In (Table)
                </button>
                <button
                  type="button"
                  className={`btn btn-sm ${deliveryType === 'Takeaway' ? 'btn-primary' : 'btn-outline'}`}
                  onClick={() => setDeliveryType('Takeaway')}
                >
                  <Package size={15} /> Takeaway (Pick Up)
                </button>
                <button
                  type="button"
                  className={`btn btn-sm ${deliveryType === 'Delivery' ? 'btn-primary' : 'btn-outline'}`}
                  onClick={() => setDeliveryType('Delivery')}
                >
                  <Truck size={15} /> Doorstep Delivery (+5,000 UGX)
                </button>
              </div>
            </div>

            {/* Cart Items List */}
            <div>
              {cartItems.map((item, idx) => (
                <CartItem key={`${item.id}-${idx}`} item={item} />
              ))}
            </div>
          </div>

          {/* Cart Summary Card */}
          <div className="cart-summary-card">
            <h3 className="cart-summary-title">Order Summary</h3>

            <div className="summary-row">
              <span style={{ color: 'var(--text-muted)' }}>Items Subtotal:</span>
              <span style={{ fontWeight: 600 }}>{formatCurrency(subtotal)}</span>
            </div>

            <div className="summary-row">
              <span style={{ color: 'var(--text-muted)' }}>Dining Mode:</span>
              <span style={{ fontWeight: 600 }}>{deliveryType}</span>
            </div>

            <div className="summary-row">
              <span style={{ color: 'var(--text-muted)' }}>Estimated Delivery Fee:</span>
              <span style={{ fontWeight: 600, color: deliveryFee > 0 ? 'var(--text-charcoal)' : '#276749' }}>
                {deliveryFee > 0 ? formatCurrency(deliveryFee) : 'Free (Dine-in / Pickup)'}
              </span>
            </div>

            <div className="summary-row">
              <span style={{ color: 'var(--text-muted)' }}>VAT (18% Included):</span>
              <span style={{ fontWeight: 600 }}>{formatCurrency(Math.round(subtotal * 0.18))}</span>
            </div>

            <div className="summary-total-row">
              <span>Final Total:</span>
              <span>{formatCurrency(grandTotal)}</span>
            </div>

            <button
              type="button"
              className="btn btn-primary btn-lg"
              style={{ width: '100%', marginTop: '24px', padding: '14px', fontSize: '1.05rem' }}
              onClick={() => navigate('/checkout')}
            >
              Proceed to Checkout <ArrowRight size={18} />
            </button>

            <div style={{ marginTop: '16px', fontSize: '0.78rem', color: 'var(--text-light)', textAlign: 'center' }}>
              🔒 Safe & Secure Checkout • MTN MoMo, Card & Cash
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

