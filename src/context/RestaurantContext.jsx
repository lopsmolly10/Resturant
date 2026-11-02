import React, { createContext, useContext, useState, useMemo, useEffect, useCallback } from 'react';
import {
  isSupabaseConfigured,
  getInventoryIngredients,
  insertInventoryIngredient,
  updateInventoryIngredient,
  deleteInventoryIngredient
} from '../lib/supabaseClient';
import { useLocalStorage } from '../hooks/useLocalStorage';
import {
  initialMenuItems,
  initialOrders,
  initialTables,
  initialReservations,
  initialInventory,
  initialPayments,
  initialCustomers,
  initialUsers,
  initialNotifications,
  initialCategories
} from '../data/mockData';

const RestaurantContext = createContext();

export function RestaurantProvider({ children }) {
  // Persisted state using useLocalStorage
  const [menuItems, setMenuItems] = useLocalStorage('dinepoint_menu', initialMenuItems);
  const [orders, setOrders] = useLocalStorage('dinepoint_orders', initialOrders);
  const [tables, setTables] = useLocalStorage('dinepoint_tables', initialTables);
  const [reservations, setReservations] = useLocalStorage('dinepoint_reservations', initialReservations);
  const [inventory, setInventory] = useLocalStorage('dinepoint_inventory', initialInventory);
  const [isInventoryLoading, setIsInventoryLoading] = useState(false);
  const [isSupabaseConnected, setIsSupabaseConnected] = useState(isSupabaseConfigured);

  const refreshInventory = useCallback(async (silent = false) => {
    if (!isSupabaseConfigured) return;
    setIsInventoryLoading(true);
    try {
      const { data, error } = await getInventoryIngredients();
      if (error) {
        setIsSupabaseConnected(false);
        if (!silent) {
          showToast(`Supabase notice: ${error.message || 'Unable to fetch inventory'}`, 'error');
        }
      } else if (data) {
        setIsSupabaseConnected(true);
        if (data.length > 0) {
          setInventory(data);
        }
        if (!silent) {
          showToast('Inventory reloaded from Supabase');
        }
      }
    } catch (err) {
      console.error('[Supabase] Error fetching inventory:', err);
      setIsSupabaseConnected(false);
    } finally {
      setIsInventoryLoading(false);
    }
  }, [setInventory]);

  useEffect(() => {
    if (isSupabaseConfigured) {
      refreshInventory(true);
    }
  }, [refreshInventory]);
  const [payments, setPayments] = useLocalStorage('dinepoint_payments', initialPayments);
  const [customers, setCustomers] = useLocalStorage('dinepoint_customers', initialCustomers);
  const [users, setUsers] = useLocalStorage('dinepoint_users', initialUsers);
  const [notifications, setNotifications] = useLocalStorage('dinepoint_notifications', initialNotifications);

  // Ephemeral UI states
  const [searchQuery, setSearchQuery] = useState('');
  const [toasts, setToasts] = useState([]);

  // Toast alert system
  const showToast = (message, type = 'success') => {
    const id = Date.now() + Math.random().toString(36).substring(2, 6);
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      removeToast(id);
    }, 4000);
  };

  const removeToast = (id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  // Notification actions
  const addNotification = (title, message, type = 'info', link = '') => {
    const newNotif = {
      id: `NOTIF-${Date.now()}`,
      title,
      message,
      type,
      timestamp: new Date().toISOString(),
      read: false,
      link
    };
    setNotifications(prev => [newNotif, ...prev]);
  };

  const markNotificationAsRead = (id) => {
    setNotifications(prev =>
      prev.map(n => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const markAllNotificationsAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    showToast('All notifications marked as read', 'info');
  };

  const deleteNotification = (id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  // =================== MENU MANAGEMENT ===================
  const addMenuItem = (item) => {
    const newItem = {
      ...item,
      id: `MN-${Math.floor(100 + Math.random() * 900)}`,
      ordersCount: 0,
      rating: 5.0,
      available: item.available !== undefined ? item.available : true,
      status: item.available ? 'Available' : 'Out of Stock'
    };
    setMenuItems(prev => [newItem, ...prev]);
    showToast(`Added "${newItem.name}" to menu successfully!`);
    return newItem;
  };

  const updateMenuItem = (id, updatedFields) => {
    setMenuItems(prev =>
      prev.map(item => {
        if (item.id === id) {
          const updated = { ...item, ...updatedFields };
          if (updatedFields.available !== undefined) {
            updated.status = updatedFields.available ? 'Available' : 'Out of Stock';
          }
          return updated;
        }
        return item;
      })
    );
    showToast('Menu item updated successfully!');
  };

  const deleteMenuItem = (id) => {
    const item = menuItems.find(i => i.id === id);
    setMenuItems(prev => prev.filter(i => i.id !== id));
    showToast(`Removed "${item?.name || 'Item'}" from menu`, 'info');
  };

  const toggleItemAvailability = (id) => {
    setMenuItems(prev =>
      prev.map(item => {
        if (item.id === id) {
          const nextAvail = !item.available;
          return {
            ...item,
            available: nextAvail,
            status: nextAvail ? 'Available' : 'Out of Stock'
          };
        }
        return item;
      })
    );
    showToast('Item availability updated');
  };

  // =================== ORDER MANAGEMENT ===================
  const createOrder = (orderData) => {
    const newId = `ORD-${Math.floor(9000 + Math.random() * 1000)}`;
    const newOrder = {
      id: newId,
      customerName: orderData.customerName || 'Walk-in Guest',
      customerPhone: orderData.customerPhone || '—',
      tableNumber: orderData.tableNumber || 'Takeaway',
      orderType: orderData.orderType || 'Dine-In',
      items: orderData.items || [],
      totalAmount: orderData.totalAmount || 0,
      orderTime: new Date().toISOString(),
      status: 'Pending',
      paymentStatus: orderData.paymentStatus || 'Unpaid',
      paymentMethod: orderData.paymentMethod || 'Cash',
      serverName: orderData.serverName || 'Staff',
      specialNotes: orderData.specialNotes || ''
    };

    setOrders(prev => [newOrder, ...prev]);

    // Update table status if dine-in
    if (newOrder.tableNumber && newOrder.tableNumber.startsWith('Table')) {
      setTables(prev =>
        prev.map(t =>
          t.name.toLowerCase() === newOrder.tableNumber.toLowerCase()
            ? { ...t, status: 'Occupied' }
            : t
        )
      );
    }

    addNotification(
      'New Order Placed',
      `Order #${newId} for ${newOrder.customerName} (${newOrder.tableNumber})`,
      'order',
      '/orders'
    );

    showToast(`Order #${newId} created successfully!`);
    return newOrder;
  };

  const updateOrderStatus = (orderId, newStatus) => {
    setOrders(prev =>
      prev.map(o => (o.id === orderId ? { ...o, status: newStatus } : o))
    );

    // If order is served or cancelled, free up table if all orders for that table are done
    if (newStatus === 'Served' || newStatus === 'Cancelled') {
      const order = orders.find(o => o.id === orderId);
      if (order && order.tableNumber.startsWith('Table')) {
        setTables(prev =>
          prev.map(t =>
            t.name.toLowerCase() === order.tableNumber.toLowerCase()
              ? { ...t, status: 'Available' }
              : t
          )
        );
      }
    }

    showToast(`Order #${orderId} marked as ${newStatus}`);
  };

  const updateOrderPaymentStatus = (orderId, paymentStatus, paymentMethod) => {
    setOrders(prev =>
      prev.map(o => {
        if (o.id === orderId) {
          return {
            ...o,
            paymentStatus,
            paymentMethod: paymentMethod || o.paymentMethod
          };
        }
        return o;
      })
    );
    showToast(`Order #${orderId} payment marked as ${paymentStatus}`);
  };

  const deleteOrder = (orderId) => {
    setOrders(prev => prev.filter(o => o.id !== orderId));
    showToast(`Order #${orderId} deleted`, 'info');
  };

  // Kitchen Quick Advance
  const advanceKitchenStatus = (orderId) => {
    const order = orders.find(o => o.id === orderId);
    if (!order) return;
    let nextStatus = 'Preparing';
    if (order.status === 'Pending') nextStatus = 'Preparing';
    else if (order.status === 'Preparing') nextStatus = 'Ready';
    else if (order.status === 'Ready') nextStatus = 'Served';

    updateOrderStatus(orderId, nextStatus);
  };

  // =================== RESERVATIONS ===================
  const addReservation = (resData) => {
    const newRes = {
      ...resData,
      id: `RES-${Math.floor(400 + Math.random() * 600)}`,
      status: 'Confirmed'
    };
    setReservations(prev => [newRes, ...prev]);

    // Mark table reserved if matched
    if (newRes.tableNumber) {
      setTables(prev =>
        prev.map(t =>
          t.name.toLowerCase() === newRes.tableNumber.toLowerCase()
            ? { ...t, status: 'Reserved' }
            : t
        )
      );
    }

    addNotification(
      'New Table Reservation',
      `${newRes.customerName} booked ${newRes.tableNumber} for ${newRes.date} at ${newRes.time}`,
      'reservation',
      '/reservations'
    );

    showToast(`Reservation for ${newRes.customerName} created!`);
    return newRes;
  };

  const updateReservationStatus = (id, newStatus) => {
    setReservations(prev =>
      prev.map(r => (r.id === id ? { ...r, status: newStatus } : r))
    );

    const reservation = reservations.find(r => r.id === id);
    if (reservation && reservation.tableNumber) {
      if (newStatus === 'Seated') {
        setTables(prev =>
          prev.map(t =>
            t.name.toLowerCase() === reservation.tableNumber.toLowerCase()
              ? { ...t, status: 'Occupied' }
              : t
          )
        );
      } else if (newStatus === 'Completed' || newStatus === 'Cancelled') {
        setTables(prev =>
          prev.map(t =>
            t.name.toLowerCase() === reservation.tableNumber.toLowerCase()
              ? { ...t, status: 'Available' }
              : t
          )
        );
      }
    }

    showToast(`Reservation marked as ${newStatus}`);
  };

  const deleteReservation = (id) => {
    setReservations(prev => prev.filter(r => r.id !== id));
    showToast('Reservation removed', 'info');
  };

  const updateTableStatus = (tableId, newStatus) => {
    setTables(prev =>
      prev.map(t => (t.id === tableId ? { ...t, status: newStatus } : t))
    );
    showToast('Table status updated');
  };

  // =================== INVENTORY ===================
  const addInventoryItem = async (itemData) => {
    const qty = Number(itemData.quantity) || 0;
    const reorder = Number(itemData.reorderLevel) || 10;
    let status = 'In Stock';
    if (qty === 0) status = 'Out of Stock';
    else if (qty <= reorder) status = 'Low Stock';

    if (isSupabaseConfigured) {
      const { data, error } = await insertInventoryIngredient(itemData);
      if (error) {
        showToast(`Supabase Error: ${error.message || 'Failed to save to database'}`, 'error');
        throw error;
      }
      if (data) {
        setInventory(prev => [data, ...prev.filter(i => i.id !== data.id)]);
        showToast(`Added "${data.name}" to Supabase inventory!`);
        return data;
      }
    }

    const newItem = {
      ...itemData,
      id: `INV-${Math.floor(100 + Math.random() * 900)}`,
      quantity: qty,
      reorderLevel: reorder,
      costPerUnit: Number(itemData.costPerUnit) || 0,
      status,
      lastUpdated: new Date().toISOString().split('T')[0]
    };

    setInventory(prev => [newItem, ...prev]);
    showToast(`Added "${newItem.name}" to inventory!`);
    return newItem;
  };

  const updateInventoryItem = async (id, fields) => {
    if (isSupabaseConfigured) {
      const { data, error } = await updateInventoryIngredient(id, fields);
      if (error) {
        showToast(`Supabase Update Error: ${error.message || 'Failed to update item'}`, 'error');
        throw error;
      }
      if (data) {
        setInventory(prev => prev.map(item => (item.id === id ? data : item)));
        showToast(`Updated "${data.name}" successfully!`);
        return data;
      }
    }

    setInventory(prev =>
      prev.map(item => {
        if (item.id === id) {
          const qty = fields.quantity !== undefined ? Number(fields.quantity) : item.quantity;
          const reorder = fields.reorderLevel !== undefined ? Number(fields.reorderLevel) : item.reorderLevel;
          let status = 'In Stock';
          if (qty <= 0) status = 'Out of Stock';
          else if (qty <= reorder) status = 'Low Stock';

          return {
            ...item,
            ...fields,
            quantity: qty,
            reorderLevel: reorder,
            status,
            lastUpdated: new Date().toISOString().split('T')[0]
          };
        }
        return item;
      })
    );
    showToast('Inventory item updated successfully!');
  };

  const adjustInventoryQuantity = async (id, delta) => {
    const item = inventory.find(i => i.id === id);
    if (!item) return;

    const newQty = Math.max(0, item.quantity + delta);
    let status = 'In Stock';
    if (newQty <= 0) status = 'Out of Stock';
    else if (newQty <= item.reorderLevel) status = 'Low Stock';

    setInventory(prev =>
      prev.map(i =>
        i.id === id
          ? { ...i, quantity: newQty, status, lastUpdated: new Date().toISOString().split('T')[0] }
          : i
      )
    );

    if (isSupabaseConfigured) {
      const { error } = await updateInventoryIngredient(id, { quantity: newQty });
      if (error) {
        console.warn('Failed to sync adjusted quantity to Supabase:', error);
      }
    }
  };

  const deleteInventoryItem = async (id) => {
    const item = inventory.find(i => i.id === id);
    if (isSupabaseConfigured) {
      const { error } = await deleteInventoryIngredient(id);
      if (error) {
        showToast(`Supabase Delete Error: ${error.message || 'Failed to delete item'}`, 'error');
        return;
      }
    }
    setInventory(prev => prev.filter(i => i.id !== id));
    showToast(`Removed "${item?.name || 'Item'}" from inventory`, 'info');
  };

  // =================== PAYMENTS ===================
  const recordPayment = (paymentData) => {
    const newTxn = {
      id: `TXN-${Math.floor(8800 + Math.random() * 1200)}`,
      orderId: paymentData.orderId,
      customerName: paymentData.customerName || 'Walk-in Guest',
      paymentMethod: paymentData.paymentMethod || 'Cash',
      provider: paymentData.provider || (paymentData.paymentMethod === 'Mobile Money' ? 'MTN MoMo' : 'UGX Cash'),
      amount: Number(paymentData.amount) || 0,
      date: new Date().toISOString(),
      status: 'Completed',
      cashier: paymentData.cashier || 'Cashier Desk'
    };

    setPayments(prev => [newTxn, ...prev]);

    // Also update order payment status if linked
    if (paymentData.orderId) {
      updateOrderPaymentStatus(paymentData.orderId, 'Paid', paymentData.paymentMethod);
    }

    showToast(`Recorded payment of UGX ${newTxn.amount.toLocaleString()} (#${newTxn.id})`);
    return newTxn;
  };

  // =================== CUSTOMERS ===================
  const addCustomer = (customerData) => {
    const newCustomer = {
      ...customerData,
      id: `CUST-${Math.floor(100 + Math.random() * 900)}`,
      totalVisits: Number(customerData.totalVisits) || 1,
      totalSpent: Number(customerData.totalSpent) || 0,
      tier: customerData.tier || 'Silver',
      lastVisit: new Date().toISOString().split('T')[0]
    };
    setCustomers(prev => [newCustomer, ...prev]);
    showToast(`Added customer: ${newCustomer.name}`);
    return newCustomer;
  };

  const updateCustomer = (id, fields) => {
    setCustomers(prev =>
      prev.map(c => (c.id === id ? { ...c, ...fields } : c))
    );
    showToast('Customer record updated');
  };

  // =================== USERS (STAFF) ===================
  const addUser = (userData) => {
    const newUser = {
      ...userData,
      id: `USR-${Math.floor(10 + Math.random() * 90)}`,
      status: 'Active',
      joinedDate: new Date().toISOString().split('T')[0],
      avatar: userData.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80'
    };
    setUsers(prev => [...prev, newUser]);
    showToast(`Added staff member: ${newUser.name} (${newUser.role})`);
    return newUser;
  };

  const updateUser = (id, fields) => {
    setUsers(prev =>
      prev.map(u => (u.id === id ? { ...u, ...fields } : u))
    );
    showToast('Staff member details updated');
  };

  const toggleUserStatus = (id) => {
    setUsers(prev =>
      prev.map(u =>
        u.id === id ? { ...u, status: u.status === 'Active' ? 'Inactive' : 'Active' } : u
      )
    );
    showToast('Staff status changed');
  };

  const deleteUser = (id) => {
    setUsers(prev => prev.filter(u => u.id !== id));
    showToast('Staff account removed', 'info');
  };

  // Derived metrics for Dashboard & quick access
  const dashboardStats = useMemo(() => {
    const todayStr = '2026-11-02'; // Matching mock date or today
    const ordersToday = orders.filter(o => o.orderTime.startsWith(todayStr) || o.status !== 'Cancelled');
    const revenueToday = payments
      .filter(p => p.date.startsWith(todayStr) && p.status === 'Completed')
      .reduce((sum, p) => sum + p.amount, 0);

    const activeOrders = orders.filter(
      o => o.status === 'Pending' || o.status === 'Preparing' || o.status === 'Ready'
    ).length;

    const availableTables = tables.filter(t => t.status === 'Available').length;
    const totalTables = tables.length;

    const lowStockItems = inventory.filter(
      i => i.status === 'Low Stock' || i.status === 'Out of Stock'
    );

    return {
      totalOrdersToday: ordersToday.length || 14,
      revenueToday: revenueToday || 4850000,
      activeOrders,
      availableTables,
      totalTables,
      lowStockCount: lowStockItems.length,
      lowStockItems
    };
  }, [orders, payments, tables, inventory]);

  return (
    <RestaurantContext.Provider
      value={{
        menuItems,
        addMenuItem,
        updateMenuItem,
        deleteMenuItem,
        toggleItemAvailability,

        orders,
        createOrder,
        updateOrderStatus,
        updateOrderPaymentStatus,
        deleteOrder,
        advanceKitchenStatus,

        tables,
        updateTableStatus,
        reservations,
        addReservation,
        updateReservationStatus,
        deleteReservation,

        inventory,
        isInventoryLoading,
        isSupabaseConnected,
        refreshInventory,
        addInventoryItem,
        updateInventoryItem,
        adjustInventoryQuantity,
        deleteInventoryItem,

        payments,
        recordPayment,

        customers,
        addCustomer,
        updateCustomer,

        users,
        addUser,
        updateUser,
        toggleUserStatus,
        deleteUser,

        notifications,
        addNotification,
        markNotificationAsRead,
        markAllNotificationsAsRead,
        deleteNotification,

        searchQuery,
        setSearchQuery,
        dashboardStats,

        toasts,
        showToast,
        removeToast,

        categories: initialCategories
      }}
    >
      {children}
    </RestaurantContext.Provider>
  );
}

export function useRestaurant() {
  const context = useContext(RestaurantContext);
  if (!context) {
    throw new Error('useRestaurant must be used within a RestaurantProvider');
  }
  return context;
}

