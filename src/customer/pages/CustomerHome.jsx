import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  UtensilsCrossed,
  ShoppingBag,
  Sparkles,
  Award,
  Clock,
  MapPin,
  ShieldCheck,
  Star,
  Coffee,
  Flame,
  Pizza,
  Wine,
  Cake,
  ArrowRight
} from 'lucide-react';
import FoodCard from '../components/FoodCard';
import { useRestaurant } from '../../context/RestaurantContext';
import { restaurantDetails } from '../../data/mockData';

export default function CustomerHome() {
  const { menuItems } = useRestaurant();
  const navigate = useNavigate();

  // Top 4 popular dishes
  const popularDishes = [...menuItems]
    .sort((a, b) => b.ordersCount - a.ordersCount)
    .slice(0, 4);

  const categoryIcons = [
    { name: 'Breakfast', icon: Coffee, desc: 'Rolex & continental' },
    { name: 'Main Course', icon: Flame, desc: 'Tilapia & muchomo' },
    { name: 'Fast Food', icon: Pizza, desc: 'Artisanal burgers & pizza' },
    { name: 'Snacks', icon: UtensilsCrossed, desc: 'Wings, nachos & fries' },
    { name: 'Drinks', icon: Wine, desc: 'Passion coolers & coffee' },
    { name: 'Desserts', icon: Cake, desc: 'Lava cake & cheesecake' }
  ];

  const testimonials = [
    {
      name: 'Grace Achieng',
      role: 'Regular Diner',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
      rating: 5,
      quote: 'The Grilled Lake Victoria Tilapia at DinePoint is unmatched in Kampala! Ordering online and having it hot at my office desk took under 25 minutes.'
    },
    {
      name: 'Kenneth Mugisha',
      role: 'Corporate Guest',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
      rating: 5,
      quote: 'We host our team business lunches here regularly. The Rolex Supreme and Passion Mint Coolers are absolute perfection.'
    },
    {
      name: 'Dr. Rebecca Nakato',
      role: 'Loyalty Member',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=150&q=80',
      rating: 5,
      quote: 'The online ordering interface is remarkably smooth. You can specify table numbers or delivery and pay via MTN MoMo in seconds.'
    }
  ];

  return (
    <div className="customer-homepage">
      {/* Hero Section */}
      <section className="customer-hero">
        <div className="customer-hero-content">
          <div className="hero-subtitle-badge">
            <Sparkles size={16} /> Welcome to DinePoint Restaurant
          </div>
          <h1>
            Delicious Food, <span>Just a Click Away.</span>
          </h1>
          <p>
            Explore our menu, choose your favourite meals and enjoy great food with DinePoint.
            Freshly prepared with authentic Ugandan ingredients and culinary excellence.
          </p>
          <div className="hero-cta-buttons">
            <Link to="/customer/menu" className="btn btn-gold btn-lg" style={{ padding: '14px 32px', fontSize: '1.05rem' }}>
              <UtensilsCrossed size={18} /> Explore Menu
            </Link>
            <Link to="/customer/menu" className="btn btn-secondary btn-lg" style={{ padding: '14px 32px', fontSize: '1.05rem' }}>
              <ShoppingBag size={18} /> Order Now
            </Link>
          </div>
        </div>
      </section>

      {/* Floating Value Stats Bar */}
      <div className="hero-stats-bar">
        <div className="hero-stat-box">
          <div className="hero-stat-icon">
            <Flame size={24} />
          </div>
          <div className="hero-stat-text">
            <h4>Fresh & Hot</h4>
            <p>Made to order in under 20 mins</p>
          </div>
        </div>

        <div className="hero-stat-box">
          <div className="hero-stat-icon">
            <Award size={24} />
          </div>
          <div className="hero-stat-text">
            <h4>Master Chefs</h4>
            <p>Authentic Kampala culinary craft</p>
          </div>
        </div>

        <div className="hero-stat-box">
          <div className="hero-stat-icon">
            <Clock size={24} />
          </div>
          <div className="hero-stat-text">
            <h4>Dine-In & Delivery</h4>
            <p>Table orders or swift doorstep drop</p>
          </div>
        </div>

        <div className="hero-stat-box">
          <div className="hero-stat-icon">
            <ShieldCheck size={24} />
          </div>
          <div className="hero-stat-text">
            <h4>Instant MoMo & Card</h4>
            <p>Safe cashless payments in UGX</p>
          </div>
        </div>
      </div>

      {/* Food Categories Section */}
      <section className="customer-section">
        <div className="section-head">
          <span className="tagline">Explore Flavors</span>
          <h2>Browse By Food Category</h2>
          <p>From sunrise breakfast to nighttime indulgence, discover our handcrafted culinary selections.</p>
        </div>

        <div className="categories-grid">
          {categoryIcons.map(cat => {
            const Icon = cat.icon;
            return (
              <div
                key={cat.name}
                className="category-card"
                onClick={() => navigate(`/customer/menu?cat=${encodeURIComponent(cat.name)}`)}
              >
                <div className="category-card-icon">
                  <Icon size={26} />
                </div>
                <h3>{cat.name}</h3>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{cat.desc}</span>
              </div>
            );
          })}
        </div>
      </section>

      {/* Popular Dishes Section */}
      <section className="customer-section" style={{ backgroundColor: 'var(--surface-alt)' }}>
        <div className="section-head">
          <span className="tagline">Chef's Recommendations</span>
          <h2>Most Popular Dishes</h2>
          <p>Prepared daily by Chef Joseph Kato using locally sourced, fresh Lake Victoria ingredients.</p>
        </div>

        <div className="customer-food-grid">
          {popularDishes.map(item => (
            <FoodCard key={item.id} item={item} />
          ))}
        </div>

        <div style={{ textAlign: 'center', marginTop: '40px' }}>
          <Link to="/customer/menu" className="btn btn-outline-primary btn-lg" style={{ padding: '12px 28px' }}>
            View Full Menu ({menuItems.length} Dishes) <ArrowRight size={18} />
          </Link>
        </div>
      </section>

      {/* Special Offers Promotional Banner */}
      <section className="customer-section">
        <div className="special-offers-banner">
          <div className="special-offers-content">
            <span style={{ background: 'rgba(255,255,255,0.2)', padding: '4px 12px', borderRadius: 'var(--radius-full)', fontSize: '0.78rem', fontWeight: 700, textTransform: 'uppercase' }}>
              Limited Time Combo Deal
            </span>
            <h3>Weekend Feast: Buy Grilled Tilapia & Get 2 Free Passion Coolers</h3>
            <p>
              Order our signature Lake Victoria Tilapia Fillet this week and receive two complimentary
              chilled Passion Mint Coolers on the house. Valid for Dine-In and Delivery orders!
            </p>
            <Link to="/customer/menu" className="btn btn-gold">
              Claim Offer Now <ArrowRight size={16} />
            </Link>
          </div>
          <div style={{ textAlign: 'center', minWidth: '180px' }}>
            <div style={{ fontSize: '3rem', fontWeight: 800, lineHeight: 1 }}>20%</div>
            <div style={{ fontSize: '1rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Discount Value</div>
          </div>
        </div>
      </section>

      {/* About Us Section */}
      <section className="customer-section" id="about">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '48px', alignItems: 'center' }}>
          <div>
            <span style={{ color: 'var(--accent-terracotta)', fontWeight: 700, fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '1.2px' }}>
              About DinePoint
            </span>
            <h2 style={{ fontSize: '2.4rem', fontFamily: 'Playfair Display, serif', color: 'var(--primary-forest)', margin: '10px 0 16px' }}>
              Exquisite Hospitality in the Heart of Kampala
            </h2>
            <p style={{ fontSize: '1rem', color: 'var(--text-muted)', lineHeight: '1.7', marginBottom: '16px' }}>
              Established in Nakasero, DinePoint brings together contemporary restaurant craft and traditional
              Ugandan culinary traditions. Our chefs collaborate directly with local farmers in Masaka,
              fishermen along Lake Victoria, and organic producers across Fort Portal.
            </p>
            <p style={{ fontSize: '1rem', color: 'var(--text-muted)', lineHeight: '1.7', marginBottom: '24px' }}>
              Whether you are dining in our serene Garden Terrace, unwinding in the VIP Lounge, or ordering online
              for express delivery to your home or office, DinePoint guarantees memorable culinary moments.
            </p>
            <div style={{ display: 'flex', gap: '20px' }}>
              <div>
                <strong style={{ fontSize: '1.8rem', color: 'var(--primary-forest)', display: 'block' }}>10k+</strong>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Satisfied Diners</span>
              </div>
              <div>
                <strong style={{ fontSize: '1.8rem', color: 'var(--primary-forest)', display: 'block' }}>15+</strong>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Years Experience</span>
              </div>
              <div>
                <strong style={{ fontSize: '1.8rem', color: 'var(--primary-forest)', display: 'block' }}>100%</strong>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Farm Fresh Food</span>
              </div>
            </div>
          </div>

          <div style={{ position: 'relative' }}>
            <img
              src="https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80"
              alt="DinePoint Cuisine"
              style={{ width: '100%', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-xl)', objectFit: 'cover', height: '420px' }}
            />
            <div
              style={{
                position: 'absolute',
                bottom: '-20px',
                left: '-20px',
                backgroundColor: 'var(--primary-forest)',
                color: 'var(--white)',
                padding: '18px 24px',
                borderRadius: 'var(--radius-md)',
                boxShadow: 'var(--shadow-md)'
              }}
            >
              <div style={{ color: 'var(--accent-gold)', fontWeight: 800, fontSize: '1.1rem' }}>★ Nakasero Kampala</div>
              <div style={{ fontSize: '0.82rem', opacity: 0.9 }}>Open 7 Days a Week</div>
            </div>
          </div>
        </div>
      </section>

      {/* Customer Testimonials Section */}
      <section className="customer-section" style={{ backgroundColor: 'var(--surface-alt)' }}>
        <div className="section-head">
          <span className="tagline">Guest Reviews</span>
          <h2>What Diners Say About Us</h2>
          <p>Read real impressions from guests who love dining with DinePoint.</p>
        </div>

        <div className="testimonials-grid">
          {testimonials.map((t, idx) => (
            <div key={idx} className="testimonial-card">
              <div>
                <div style={{ display: 'flex', gap: '3px', color: '#ecc94b', marginBottom: '12px' }}>
                  {[...Array(t.rating)].map((_, i) => (
                    <Star key={i} size={16} fill="#ecc94b" stroke="#ecc94b" />
                  ))}
                </div>
                <p className="testimonial-quote">"{t.quote}"</p>
              </div>
              <div className="testimonial-author">
                <img src={t.avatar} alt={t.name} className="testimonial-avatar" />
                <div>
                  <h4>{t.name}</h4>
                  <p>{t.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

