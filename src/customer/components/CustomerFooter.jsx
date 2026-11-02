import React from 'react';
import { Link } from 'react-router-dom';
import {
  Flame,
  Phone,
  Mail,
  MapPin,
  Clock,
  ShieldCheck,
  CreditCard,
  Smartphone
} from 'lucide-react';
import { restaurantDetails } from '../../data/mockData';

export default function CustomerFooter() {
  return (
    <footer className="customer-footer" id="contact">
      <div className="footer-container">
        <div className="footer-grid">
          {/* Brand Col */}
          <div className="footer-col">
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
              <div
                style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '10px',
                  backgroundColor: 'var(--accent-gold)',
                  color: 'var(--primary-forest)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <Flame size={22} />
              </div>
              <h3 style={{ margin: 0 }}>DinePoint</h3>
            </div>
            <p>
              Experience the pinnacle of culinary excellence in Kampala. From chargrilled Lake Victoria Tilapia
              to gourmet artisanal burgers, our chefs blend local Ugandan produce with contemporary culinary artistry.
            </p>
            <div style={{ display: 'flex', gap: '12px', marginTop: '18px', color: 'var(--accent-gold)' }}>
              <span>★ 4.9 Rating</span> • <span>Fresh Daily</span> • <span>Dine-in & Delivery</span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="footer-col">
            <h4>Quick Navigation</h4>
            <ul className="footer-links">
              <li><Link to="/">Home Page</Link></li>
              <li><Link to="/customer/menu">Explore Our Menu</Link></li>
              <li><Link to="/cart">My Shopping Cart</Link></li>
              <li><Link to="/my-orders">Track Active Order</Link></li>
              <li><Link to="/admin">Staff & Admin Login</Link></li>
            </ul>
          </div>

          {/* Operating Hours */}
          <div className="footer-col">
            <h4>Dining Hours</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.88rem', color: 'rgba(255,255,255,0.8)' }}>
              <div>
                <strong>Monday – Friday:</strong>
                <div>07:30 AM – 11:00 PM</div>
              </div>
              <div>
                <strong>Saturday – Sunday:</strong>
                <div>08:00 AM – 11:30 PM</div>
              </div>
              <div style={{ color: 'var(--accent-gold)', marginTop: '4px' }}>
                <Clock size={14} style={{ display: 'inline', marginRight: '4px' }} />
                Kitchen open for online orders now!
              </div>
            </div>
          </div>

          {/* Contact Details & Payment Channels */}
          <div className="footer-col">
            <h4>Reach Out to Us</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.88rem', color: 'rgba(255,255,255,0.8)' }}>
              <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                <MapPin size={18} color="var(--accent-gold)" style={{ flexShrink: 0, marginTop: '2px' }} />
                <span>Plot 14, Lumumba Avenue, Nakasero, Kampala, Uganda</span>
              </div>
              <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                <Phone size={16} color="var(--accent-gold)" style={{ flexShrink: 0 }} />
                <span>+256 312 900 800 / +256 700 123 456</span>
              </div>
              <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                <Mail size={16} color="var(--accent-gold)" style={{ flexShrink: 0 }} />
                <span>orders@dinepoint.ug</span>
              </div>

              <div style={{ marginTop: '12px', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '12px' }}>
                <div style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.6)', marginBottom: '6px' }}>
                  Accepted Payment Methods:
                </div>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  <span style={{ background: 'rgba(255,255,255,0.1)', padding: '3px 8px', borderRadius: '4px', fontSize: '0.74rem' }}>MTN MoMo</span>
                  <span style={{ background: 'rgba(255,255,255,0.1)', padding: '3px 8px', borderRadius: '4px', fontSize: '0.74rem' }}>Airtel Money</span>
                  <span style={{ background: 'rgba(255,255,255,0.1)', padding: '3px 8px', borderRadius: '4px', fontSize: '0.74rem' }}>Visa / Mastercard</span>
                  <span style={{ background: 'rgba(255,255,255,0.1)', padding: '3px 8px', borderRadius: '4px', fontSize: '0.74rem' }}>Cash</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="footer-bottom">
          <div>
            © {new Date().getFullYear()} DinePoint Restaurant & Lounge. All Rights Reserved. TIN: 1004829104.
          </div>
          <div>
            Restaurant Management System • Built with React & Vite
          </div>
        </div>
      </div>
    </footer>
  );
}

