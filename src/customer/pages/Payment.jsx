import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  CreditCard,
  Smartphone,
  Banknote,
  ShieldCheck,
  CheckCircle2,
  Lock,
  ArrowLeft,
  Loader2
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useRestaurant } from '../../context/RestaurantContext';
import { formatCurrency } from '../../utils/formatCurrency';

export default function Payment() {
  const { clearCart } = useCart();
  const { createOrder } = useRestaurant();
  const navigate = useNavigate();

  const [checkoutData, setCheckoutData] = useState(() => {
    try {
      const saved = sessionStorage.getItem('dinepoint_pending_checkout');
      return saved ? JSON.parse(saved) : null;
    } catch (e) {
      return null;
    }
  });

  const [paymentMethod, setPaymentMethod] = useState('Mobile Money');
  const [momoProvider, setMomoProvider] = useState('MTN MoMo');
  const [momoNumber, setMomoNumber] = useState(checkoutData?.phone || '+256 701 452 890');
  const [cardNumber, setCardNumber] = useState('4242 •••• •••• 4242');
  const [cardExpiry, setCardExpiry] = useState('12/28');
  const [cardCvv, setCardCvv] = useState('888');

  const [isProcessing, setIsProcessing] = useState(false);

  if (!checkoutData || !checkoutData.items || checkoutData.items.length === 0) {
    navigate('/cart');
    return null;
  }

  const handleProcessPayment = (e) => {
    e.preventDefault();
    setIsProcessing(true);

    // Simulate payment processing latency
    setTimeout(() => {
      // 1. Create order in central RestaurantContext
      const formattedItems = checkoutData.items.map(item => ({
        id: item.id,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        notes: item.notes || ''
      }));

      const createdOrder = createOrder({
        customerName: checkoutData.fullName,
        customerPhone: checkoutData.phone,
        tableNumber: checkoutData.tableNumber,
        orderType: checkoutData.orderType,
        items: formattedItems,
        totalAmount: checkoutData.grandTotal,
        paymentMethod: paymentMethod === 'Mobile Money' ? momoProvider : paymentMethod,
        paymentStatus: paymentMethod === 'Cash' ? 'Unpaid' : 'Paid',
        serverName: 'Online Web Order',
        specialNotes: checkoutData.deliveryAddress
          ? `Delivery Address: ${checkoutData.deliveryAddress}. ${checkoutData.specialInstructions}`
          : checkoutData.specialInstructions
      });

      // 2. Clear customer shopping cart
      clearCart();
      sessionStorage.removeItem('dinepoint_pending_checkout');

      // 3. Save confirmed order summary in sessionStorage for instant retrieval on confirmation page
      sessionStorage.setItem('dinepoint_latest_order', JSON.stringify({
        ...createdOrder,
        deliveryFee: checkoutData.deliveryFee,
        deliveryAddress: checkoutData.deliveryAddress
      }));

      setIsProcessing(false);

      // 4. Navigate to Order Confirmation
      navigate(`/order-confirmation/${createdOrder.id}`);
    }, 1500);
  };

  return (
    <div className="customer-payment-page">
      <div className="customer-section">
        <Link
          to="/checkout"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            color: 'var(--primary-blue)',
            fontWeight: 600,
            fontSize: '0.92rem',
            marginBottom: '24px',
            textDecoration: 'none'
          }}
        >
          <ArrowLeft size={18} /> Back to Checkout Details
        </Link>

        <h1 style={{ fontSize: '2.4rem', fontFamily: 'Playfair Display, serif', color: 'var(--deep-blue)', marginBottom: '8px' }}>
          Select Payment Method
        </h1>
        <p style={{ color: 'var(--text-muted)', marginBottom: '32px' }}>
          Choose how you would like to settle your order of <strong>{formatCurrency(checkoutData.grandTotal)}</strong>.
        </p>

        <div className="checkout-grid">
          {/* Payment Method Cards */}
          <div className="checkout-form-card">
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '28px' }}>
              {/* Option 1: Mobile Money */}
              <label
                style={{
                  border: `2px solid ${paymentMethod === 'Mobile Money' ? 'var(--royal-blue)' : 'var(--border-grey)'}`,
                  backgroundColor: paymentMethod === 'Mobile Money' ? 'var(--pale-blue)' : 'var(--white)',
                  borderRadius: 'var(--radius-lg)',
                  padding: '18px 20px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '16px',
                  cursor: 'pointer',
                  transition: 'all var(--transition-fast)'
                }}
              >
                <input
                  type="radio"
                  name="paymentMethod"
                  value="Mobile Money"
                  checked={paymentMethod === 'Mobile Money'}
                  onChange={e => setPaymentMethod(e.target.value)}
                  style={{ accentColor: 'var(--royal-blue)', width: '18px', height: '18px' }}
                />
                <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: 'var(--light-blue)', color: 'var(--primary-blue)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Smartphone size={24} />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--deep-blue)' }}>
                    Mobile Money (MTN MoMo / Airtel Money)
                  </div>
                  <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                    Instant USSD payment prompt sent directly to your phone.
                  </div>
                </div>
              </label>

              {/* Option 2: Card */}
              <label
                style={{
                  border: `2px solid ${paymentMethod === 'Card' ? 'var(--royal-blue)' : 'var(--border-grey)'}`,
                  backgroundColor: paymentMethod === 'Card' ? 'var(--pale-blue)' : 'var(--white)',
                  borderRadius: 'var(--radius-lg)',
                  padding: '18px 20px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '16px',
                  cursor: 'pointer',
                  transition: 'all var(--transition-fast)'
                }}
              >
                <input
                  type="radio"
                  name="paymentMethod"
                  value="Card"
                  checked={paymentMethod === 'Card'}
                  onChange={e => setPaymentMethod(e.target.value)}
                  style={{ accentColor: 'var(--royal-blue)', width: '18px', height: '18px' }}
                />
                <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: 'var(--light-blue)', color: 'var(--royal-blue)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <CreditCard size={24} />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--deep-blue)' }}>
                    Credit / Debit Card (Visa / Mastercard)
                  </div>
                  <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                    Secure checkout with international and local Ugandan bank cards.
                  </div>
                </div>
              </label>

              {/* Option 3: Cash */}
              <label
                style={{
                  border: `2px solid ${paymentMethod === 'Cash' ? 'var(--royal-blue)' : 'var(--border-grey)'}`,
                  backgroundColor: paymentMethod === 'Cash' ? 'var(--pale-blue)' : 'var(--white)',
                  borderRadius: 'var(--radius-lg)',
                  padding: '18px 20px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '16px',
                  cursor: 'pointer',
                  transition: 'all var(--transition-fast)'
                }}
              >
                <input
                  type="radio"
                  name="paymentMethod"
                  value="Cash"
                  checked={paymentMethod === 'Cash'}
                  onChange={e => setPaymentMethod(e.target.value)}
                  style={{ accentColor: 'var(--royal-blue)', width: '18px', height: '18px' }}
                />
                <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: 'var(--light-blue)', color: 'var(--deep-blue)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Banknote size={24} />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--deep-blue)' }}>
                    Cash on Delivery / Dining Counter
                  </div>
                  <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                    Pay in Ugandan Shillings (UGX) upon food arrival or table presentation.
                  </div>
                </div>
              </label>
            </div>

            {/* Dynamic Inputs according to selected method */}
            {paymentMethod === 'Mobile Money' && (
              <div style={{ backgroundColor: 'var(--surface-alt)', padding: '20px', borderRadius: 'var(--radius-md)', marginBottom: '24px' }}>
                <h4 style={{ fontSize: '0.95rem', color: 'var(--deep-blue)', marginBottom: '14px' }}>
                  Mobile Money Provider:
                </h4>
                <div style={{ display: 'flex', gap: '16px', marginBottom: '16px' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                    <input
                      type="radio"
                      name="momoProvider"
                      value="MTN MoMo"
                      checked={momoProvider === 'MTN MoMo'}
                      onChange={e => setMomoProvider(e.target.value)}
                    />
                    <strong>MTN Mobile Money (*165#)</strong>
                  </label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                    <input
                      type="radio"
                      name="momoProvider"
                      value="Airtel Money"
                      checked={momoProvider === 'Airtel Money'}
                      onChange={e => setMomoProvider(e.target.value)}
                    />
                    <strong>Airtel Money (*185#)</strong>
                  </label>
                </div>

                <div className="form-group" style={{ margin: 0 }}>
                  <label className="form-label">Phone Number for Prompt:</label>
                  <input
                    type="tel"
                    className="form-control"
                    value={momoNumber}
                    onChange={e => setMomoNumber(e.target.value)}
                    placeholder="+256 701 452 890"
                    required
                  />
                  <small style={{ color: 'var(--text-muted)', marginTop: '4px', display: 'block' }}>
                    A simulation prompt will authorize {formatCurrency(checkoutData.grandTotal)}.
                  </small>
                </div>
              </div>
            )}

            {paymentMethod === 'Card' && (
              <div style={{ backgroundColor: 'var(--surface-alt)', padding: '20px', borderRadius: 'var(--radius-md)', marginBottom: '24px' }}>
                <h4 style={{ fontSize: '0.95rem', color: 'var(--deep-blue)', marginBottom: '14px' }}>
                  Card Details (Simulation):
                </h4>
                <div className="form-group">
                  <label className="form-label">Card Number</label>
                  <input
                    type="text"
                    className="form-control"
                    value={cardNumber}
                    onChange={e => setCardNumber(e.target.value)}
                  />
                </div>
                <div className="form-row">
                  <div className="form-group" style={{ margin: 0 }}>
                    <label className="form-label">Expiry Date</label>
                    <input
                      type="text"
                      className="form-control"
                      value={cardExpiry}
                      onChange={e => setCardExpiry(e.target.value)}
                    />
                  </div>
                  <div className="form-group" style={{ margin: 0 }}>
                    <label className="form-label">CVV / CVC</label>
                    <input
                      type="password"
                      className="form-control"
                      value={cardCvv}
                      onChange={e => setCardCvv(e.target.value)}
                    />
                  </div>
                </div>
              </div>
            )}

            {paymentMethod === 'Cash' && (
              <div style={{ backgroundColor: 'var(--surface-alt)', padding: '16px 20px', borderRadius: 'var(--radius-md)', marginBottom: '24px', fontSize: '0.9rem', color: 'var(--text-charcoal)' }}>
                Please have exact change of <strong>{formatCurrency(checkoutData.grandTotal)}</strong> ready for our dispatch driver or floor waiter.
              </div>
            )}

            <button
              type="button"
              className="btn btn-primary btn-lg"
              disabled={isProcessing}
              style={{ width: '100%', padding: '14px', fontSize: '1.05rem' }}
              onClick={handleProcessPayment}
            >
              {isProcessing ? (
                <>
                  <Loader2 size={18} className="animate-spin" /> Authorizing Payment...
                </>
              ) : (
                <>
                  <Lock size={18} /> Confirm Order & Pay {formatCurrency(checkoutData.grandTotal)}
                </>
              )}
            </button>
          </div>

          {/* Right Summary Card */}
          <div className="cart-summary-card">
            <h3 className="cart-summary-title">Summary & Recipient</h3>

            <div style={{ marginBottom: '16px', fontSize: '0.88rem' }}>
              <div><strong>Name:</strong> {checkoutData.fullName}</div>
              <div><strong>Phone:</strong> {checkoutData.phone}</div>
              <div><strong>Destination:</strong> {checkoutData.tableNumber}</div>
              {checkoutData.deliveryAddress && (
                <div style={{ marginTop: '4px', color: 'var(--text-muted)' }}>
                  {checkoutData.deliveryAddress}
                </div>
              )}
            </div>

            <div className="summary-row">
              <span style={{ color: 'var(--text-muted)' }}>Items Count:</span>
              <span>{checkoutData.items.length} dishes</span>
            </div>

            <div className="summary-row">
              <span style={{ color: 'var(--text-muted)' }}>Food Subtotal:</span>
              <span>{formatCurrency(checkoutData.subtotal)}</span>
            </div>

            <div className="summary-row">
              <span style={{ color: 'var(--text-muted)' }}>Delivery Fee:</span>
              <span>{checkoutData.deliveryFee > 0 ? formatCurrency(checkoutData.deliveryFee) : 'UGX 0'}</span>
            </div>

            <div className="summary-total-row">
              <span>Amount Due:</span>
              <span>{formatCurrency(checkoutData.grandTotal)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

