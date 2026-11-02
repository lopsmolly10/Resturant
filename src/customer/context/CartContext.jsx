import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState(() => {
    try {
      const saved = localStorage.getItem('dinepoint_customer_cart');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      console.warn('Failed to parse cart from localStorage:', e);
      return [];
    }
  });

  const [deliveryType, setDeliveryType] = useState('Dine-In'); // 'Dine-In' | 'Takeaway' | 'Delivery'

  // Persist cart to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem('dinepoint_customer_cart', JSON.stringify(cartItems));
    } catch (e) {
      console.warn('Failed to save cart to localStorage:', e);
    }
  }, [cartItems]);

  const addToCart = (menuItem, quantity = 1, notes = '') => {
    setCartItems(prev => {
      const existingIndex = prev.findIndex(
        item => item.id === menuItem.id && item.notes === notes
      );

      if (existingIndex > -1) {
        const updated = [...prev];
        updated[existingIndex].quantity += Number(quantity);
        return updated;
      }

      return [
        ...prev,
        {
          id: menuItem.id,
          name: menuItem.name,
          price: Number(menuItem.price),
          image: menuItem.image,
          category: menuItem.category,
          quantity: Number(quantity),
          notes: notes || ''
        }
      ];
    });
  };

  const updateQuantity = (id, notes, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(id, notes);
      return;
    }
    setCartItems(prev =>
      prev.map(item =>
        item.id === id && item.notes === notes
          ? { ...item, quantity: Number(newQuantity) }
          : item
      )
    );
  };

  const removeFromCart = (id, notes) => {
    setCartItems(prev =>
      prev.filter(item => !(item.id === id && item.notes === notes))
    );
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const itemCount = cartItems.reduce((total, item) => total + item.quantity, 0);
  const subtotal = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
  const deliveryFee = deliveryType === 'Delivery' ? 5000 : 0;
  const grandTotal = subtotal + deliveryFee;

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        itemCount,
        subtotal,
        deliveryFee,
        grandTotal,
        deliveryType,
        setDeliveryType
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}

