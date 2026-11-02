import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, Eye, Check, Star } from 'lucide-react';
import { formatCurrency } from '../../utils/formatCurrency';
import { useCart } from '../context/CartContext';

export default function FoodCard({ item }) {
  const { addToCart } = useCart();
  const [added, setAdded] = useState(false);

  const handleQuickAdd = () => {
    if (!item.available) return;
    addToCart(item, 1, '');
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  const isAvailable = item.available !== false && item.status !== 'Out of Stock';

  return (
    <div className="customer-food-card">
      <div className="food-card-media">
        <img
          src={item.image}
          alt={item.name}
          loading="lazy"
        />
        <span className="food-badge-category">{item.category}</span>
        <span className="food-badge-rating">
          <Star size={12} fill="#f6e05e" stroke="#f6e05e" />
          {item.rating || '4.9'}
        </span>
      </div>

      <div className="customer-food-card-content">
        <h3 className="food-card-title">{item.name}</h3>
        <p className="food-card-snippet">{item.description}</p>

        <div className="food-card-price-row">
          <span className="food-price-text">{formatCurrency(item.price)}</span>
          <span className={`food-availability-text ${isAvailable ? 'in-stock' : 'out-of-stock'}`}>
            {isAvailable ? '• Available' : '• Sold Out'}
          </span>
        </div>

        <div className="food-card-actions">
          <Link
            to={`/customer/food/${item.id}`}
            className="btn btn-outline btn-sm"
            title="View Details"
          >
            <Eye size={15} /> Details
          </Link>

          <button
            type="button"
            className={`btn btn-sm ${added ? 'btn-gold' : 'btn-primary'}`}
            disabled={!isAvailable}
            onClick={handleQuickAdd}
          >
            {added ? (
              <>
                <Check size={15} /> Added!
              </>
            ) : (
              <>
                <ShoppingBag size={15} /> Add to Cart
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

