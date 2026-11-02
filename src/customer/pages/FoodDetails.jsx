import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  ShoppingBag,
  Star,
  Clock,
  CheckCircle,
  Plus,
  Minus,
  Utensils
} from 'lucide-react';
import { useRestaurant } from '../../context/RestaurantContext';
import { useCart } from '../context/CartContext';
import { formatCurrency } from '../../utils/formatCurrency';
import FoodCard from '../components/FoodCard';

export default function FoodDetails() {
  const { id } = useParams();
  const { menuItems } = useRestaurant();
  const { addToCart } = useCart();
  const navigate = useNavigate();

  const item = menuItems.find(m => m.id === id);

  const [quantity, setQuantity] = useState(1);
  const [specialInstructions, setSpecialInstructions] = useState('');
  const [addedSuccess, setAddedSuccess] = useState(false);

  if (!item) {
    return (
      <div className="customer-section" style={{ textAlign: 'center', padding: '80px 24px' }}>
        <h2>Dish Not Found</h2>
        <p>The culinary dish you are looking for does not exist or has been removed.</p>
        <Link to="/customer/menu" className="btn btn-primary" style={{ marginTop: '20px' }}>
          Back to Menu
        </Link>
      </div>
    );
  }

  // Related items from same category
  const relatedItems = menuItems
    .filter(m => m.category === item.category && m.id !== item.id)
    .slice(0, 3);

  const handleAddToCart = () => {
    if (!item.available) return;
    addToCart(item, quantity, specialInstructions);
    setAddedSuccess(true);
    setTimeout(() => setAddedSuccess(false), 2000);
  };

  const isAvailable = item.available !== false && item.status !== 'Out of Stock';

  // Sample realistic ingredients based on dish
  const ingredientsList = [
    'Locally sourced produce from Nakasero market',
    'Cold-pressed virgin cooking oils',
    'Fresh herb seasoning & garden garlic',
    'Authentic East African table spices'
  ];

  return (
    <div className="customer-food-details-page">
      <div className="customer-section">
        {/* Back Link */}
        <Link
          to="/customer/menu"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            color: 'var(--primary-forest)',
            fontWeight: 600,
            fontSize: '0.92rem',
            marginBottom: '28px',
            textDecoration: 'none'
          }}
        >
          <ArrowLeft size={18} /> Back to Food Menu
        </Link>

        {/* Food Detail Main Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
            gap: '48px',
            alignItems: 'start',
            backgroundColor: 'var(--card-ivory)',
            border: '1px solid var(--border-grey)',
            borderRadius: 'var(--radius-lg)',
            padding: '36px',
            boxShadow: 'var(--shadow-sm)',
            marginBottom: '60px'
          }}
        >
          {/* Large Food Image */}
          <div style={{ position: 'relative', borderRadius: 'var(--radius-lg)', overflow: 'hidden' }}>
            <img
              src={item.image}
              alt={item.name}
              style={{
                width: '100%',
                maxHeight: '460px',
                objectFit: 'cover',
                borderRadius: 'var(--radius-lg)',
                boxShadow: 'var(--shadow-md)'
              }}
            />
            <span className="food-badge-category" style={{ fontSize: '0.82rem', padding: '6px 14px' }}>
              {item.category}
            </span>
          </div>

          {/* Details & Actions */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <div style={{ display: 'flex', color: '#ecc94b' }}>
                <Star size={16} fill="#ecc94b" stroke="#ecc94b" />
              </div>
              <span style={{ fontWeight: 700, fontSize: '0.9rem' }}>{item.rating || '4.9'}</span>
              <span style={{ color: 'var(--text-light)', fontSize: '0.82rem' }}>• {item.ordersCount || 250}+ Ordered</span>
            </div>

            <h1
              style={{
                fontSize: '2.4rem',
                fontFamily: 'Playfair Display, serif',
                color: 'var(--primary-forest)',
                margin: '0 0 12px',
                lineHeight: 1.2
              }}
            >
              {item.name}
            </h1>

            <div
              style={{
                fontSize: '1.85rem',
                fontWeight: 800,
                color: 'var(--primary-forest)',
                marginBottom: '16px'
              }}
            >
              {formatCurrency(item.price)}
            </div>

            <p style={{ fontSize: '1rem', color: 'var(--text-muted)', lineHeight: '1.7', marginBottom: '24px' }}>
              {item.description}
            </p>

            {/* Preparation time & Availability */}
            <div
              style={{
                display: 'flex',
                gap: '24px',
                padding: '14px 18px',
                backgroundColor: 'var(--surface-alt)',
                borderRadius: 'var(--radius-md)',
                marginBottom: '24px',
                fontSize: '0.88rem'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Clock size={16} color="var(--primary-forest)" />
                <span>Prep Time: <strong>{item.prepTime || '15-20 mins'}</strong></span>
              </div>
              <div>
                Availability: <strong style={{ color: isAvailable ? '#276749' : '#c53030' }}>
                  {isAvailable ? 'In Stock (Ready to cook)' : 'Sold Out for Today'}
                </strong>
              </div>
            </div>

            {/* Ingredients */}
            <div style={{ marginBottom: '24px' }}>
              <h4 style={{ fontSize: '1rem', color: 'var(--primary-forest)', marginBottom: '8px' }}>
                Ingredients & Accompaniments:
              </h4>
              <ul style={{ paddingLeft: '20px', color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: '1.6' }}>
                {ingredientsList.map((ing, i) => (
                  <li key={i}>{ing}</li>
                ))}
              </ul>
            </div>

            {/* Special Instructions */}
            <div className="form-group">
              <label className="form-label" style={{ fontSize: '0.9rem' }}>
                Special Cooking Instructions (Optional):
              </label>
              <textarea
                className="form-control"
                placeholder="e.g. Mild spice, dressing on the side, well-done, allergy notes..."
                rows="2"
                value={specialInstructions}
                onChange={(e) => setSpecialInstructions(e.target.value)}
              />
            </div>

            {/* Quantity Selector & Add to Cart */}
            <div style={{ display: 'flex', gap: '16px', alignItems: 'center', marginTop: '24px' }}>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  border: '1px solid var(--border-grey)',
                  borderRadius: 'var(--radius-md)',
                  padding: '6px 14px',
                  backgroundColor: 'var(--white)'
                }}
              >
                <button
                  type="button"
                  className="btn-icon"
                  style={{ width: '28px', height: '28px' }}
                  onClick={() => setQuantity(prev => Math.max(1, prev - 1))}
                >
                  <Minus size={15} />
                </button>
                <span style={{ fontSize: '1.1rem', fontWeight: 800, minWidth: '24px', textAlign: 'center' }}>
                  {quantity}
                </span>
                <button
                  type="button"
                  className="btn-icon"
                  style={{ width: '28px', height: '28px' }}
                  onClick={() => setQuantity(prev => prev + 1)}
                >
                  <Plus size={15} />
                </button>
              </div>

              <button
                type="button"
                className={`btn btn-lg ${addedSuccess ? 'btn-gold' : 'btn-primary'}`}
                style={{ flex: 1, padding: '14px 28px', fontSize: '1rem' }}
                disabled={!isAvailable}
                onClick={handleAddToCart}
              >
                {addedSuccess ? (
                  <>
                    <CheckCircle size={18} /> Added to Cart!
                  </>
                ) : (
                  <>
                    <ShoppingBag size={18} /> Add {quantity} to Cart • {formatCurrency(item.price * quantity)}
                  </>
                )}
              </button>
            </div>

            {addedSuccess && (
              <div style={{ marginTop: '14px', textAlign: 'center' }}>
                <Link to="/cart" style={{ color: 'var(--primary-forest)', fontWeight: 700, fontSize: '0.88rem' }}>
                  Proceed to Shopping Cart ➔
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Related Dishes */}
        {relatedItems.length > 0 && (
          <div>
            <div className="section-head" style={{ textAlign: 'left', margin: '0 0 24px' }}>
              <h3 style={{ fontSize: '1.6rem', color: 'var(--primary-forest)' }}>
                You Might Also Enjoy
              </h3>
            </div>
            <div className="customer-food-grid">
              {relatedItems.map(rel => (
                <FoodCard key={rel.id} item={rel} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

