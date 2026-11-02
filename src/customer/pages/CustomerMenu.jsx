import React, { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, Sparkles } from 'lucide-react';
import FoodCard from '../components/FoodCard';
import CategoryFilter from '../components/CategoryFilter';
import { useRestaurant } from '../../context/RestaurantContext';

export default function CustomerMenu() {
  const { menuItems } = useRestaurant();
  const [searchParams, setSearchParams] = useSearchParams();

  const initialCat = searchParams.get('cat') || 'All';
  const [selectedCategory, setSelectedCategory] = useState(initialCat);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const cat = searchParams.get('cat');
    if (cat) {
      setSelectedCategory(cat);
    }
  }, [searchParams]);

  const categories = ['All', 'Breakfast', 'Main Course', 'Fast Food', 'Snacks', 'Drinks', 'Desserts'];

  const filteredItems = useMemo(() => {
    return menuItems.filter(item => {
      const matchCat = selectedCategory === 'All' || item.category === selectedCategory;
      const matchSearch =
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.description.toLowerCase().includes(searchTerm.toLowerCase());
      return matchCat && matchSearch;
    });
  }, [menuItems, selectedCategory, searchTerm]);

  const handleCategoryChange = (cat) => {
    setSelectedCategory(cat);
    if (cat === 'All') {
      searchParams.delete('cat');
    } else {
      searchParams.set('cat', cat);
    }
    setSearchParams(searchParams);
  };

  return (
    <div className="customer-menu-page">
      {/* Header Banner */}
      <div
        style={{
          background: 'linear-gradient(rgba(24, 61, 50, 0.9), rgba(24, 61, 50, 0.95)), url("https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=1600&q=80") center/cover',
          color: 'var(--white)',
          padding: '60px 24px',
          textAlign: 'center'
        }}
      >
        <div style={{ maxWidth: '700px', margin: '0 auto' }}>
          <h1 style={{ fontSize: '2.8rem', fontFamily: 'Playfair Display, serif', color: 'var(--white)', marginBottom: '10px' }}>
            Our Culinary Menu
          </h1>
          <p style={{ fontSize: '1.05rem', color: 'rgba(255,255,255,0.85)', margin: 0 }}>
            Every meal is freshly cooked with passion and high-quality local Ugandan ingredients.
          </p>
        </div>
      </div>

      <div className="customer-section" style={{ paddingTop: '36px' }}>
        {/* Search and Category Filter */}
        <div style={{ maxWidth: '500px', margin: '0 auto 24px', position: 'relative' }}>
          <Search
            size={18}
            style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}
          />
          <input
            type="text"
            className="form-control"
            style={{ paddingLeft: '44px', borderRadius: 'var(--radius-full)', padding: '12px 18px 12px 46px' }}
            placeholder="Search by meal name, ingredient or flavor..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Categories Bar */}
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <CategoryFilter
            categories={categories}
            selectedCategory={selectedCategory}
            onSelectCategory={handleCategoryChange}
          />
        </div>

        {/* Menu Items Grid */}
        {filteredItems.length === 0 ? (
          <div className="card" style={{ padding: '60px 24px', textAlign: 'center' }}>
            <div className="empty-state-icon" style={{ margin: '0 auto 16px' }}>
              <Sparkles size={36} color="var(--royal-blue)" />
            </div>
            <h3 style={{ fontSize: '1.3rem', color: 'var(--deep-blue)' }}>No delicious meals found</h3>
            <p style={{ color: 'var(--text-muted)', marginBottom: '20px' }}>
              We couldn't find any dishes matching "{searchTerm}". Try clearing your search or picking another category.
            </p>
            <button
              className="btn btn-primary btn-sm"
              onClick={() => { setSearchTerm(''); setSelectedCategory('All'); }}
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="customer-food-grid">
            {filteredItems.map(item => (
              <FoodCard key={item.id} item={item} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

