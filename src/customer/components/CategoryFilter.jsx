import React from 'react';

export default function CategoryFilter({
  categories = ['All', 'Breakfast', 'Main Course', 'Fast Food', 'Snacks', 'Drinks', 'Desserts'],
  selectedCategory = 'All',
  onSelectCategory
}) {
  return (
    <div
      style={{
        display: 'flex',
        gap: '10px',
        overflowX: 'auto',
        paddingBottom: '8px',
        margin: '20px 0 32px'
      }}
    >
      {categories.map((cat) => {
        const isSelected = selectedCategory === cat;
        return (
          <button
            key={cat}
            type="button"
            className={`btn btn-sm ${isSelected ? 'btn-primary' : 'btn-outline'}`}
            style={{
              borderRadius: 'var(--radius-full)',
              padding: '8px 18px',
              fontSize: '0.88rem'
            }}
            onClick={() => onSelectCategory(cat)}
          >
            {cat}
          </button>
        );
      })}
    </div>
  );
}

