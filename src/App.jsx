import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { RestaurantProvider } from './context/RestaurantContext';
import { CustomerAuthProvider } from './customer/context/CustomerAuthContext';
import { CartProvider } from './customer/context/CartContext';

// Layouts
import DashboardLayout from './layouts/DashboardLayout';
import CustomerLayout from './customer/layouts/CustomerLayout';

// Admin Pages
import Dashboard from './pages/Dashboard';
import MenuManagement from './pages/MenuManagement';
import OrderManagement from './pages/OrderManagement';
import KitchenManagement from './pages/KitchenManagement';
import Reservations from './pages/Reservations';
import Inventory from './pages/Inventory';
import Payments from './pages/Payments';
import SalesReports from './pages/SalesReports';
import Customers from './pages/Customers';
import UserManagement from './pages/UserManagement';
import Settings from './pages/Settings';
import Login from './pages/Login';

// Customer Pages
import CustomerHome from './customer/pages/CustomerHome';
import CustomerMenu from './customer/pages/CustomerMenu';
import FoodDetails from './customer/pages/FoodDetails';
import ShoppingCart from './customer/pages/ShoppingCart';
import Checkout from './customer/pages/Checkout';
import Payment from './customer/pages/Payment';
import OrderConfirmation from './customer/pages/OrderConfirmation';
import MyOrders from './customer/pages/MyOrders';
import CustomerLogin from './customer/pages/CustomerLogin';
import CustomerRegister from './customer/pages/CustomerRegister';
import CustomerProfile from './customer/pages/CustomerProfile';

// Protected Route for Admin Portal
function ProtectedRoute({ children }) {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace />;
  }
  return children;
}

export default function App() {
  return (
    <AuthProvider>
      <RestaurantProvider>
        <CustomerAuthProvider>
          <CartProvider>
            <BrowserRouter>
              <Routes>
                {/* ================= Customer Public Interface ================= */}
                <Route element={<CustomerLayout />}>
                  <Route path="/" element={<CustomerHome />} />
                  <Route path="/customer/menu" element={<CustomerMenu />} />
                  <Route path="/customer/food/:id" element={<FoodDetails />} />
                  <Route path="/cart" element={<ShoppingCart />} />
                  <Route path="/checkout" element={<Checkout />} />
                  <Route path="/payment" element={<Payment />} />
                  <Route path="/order-confirmation/:orderId" element={<OrderConfirmation />} />
                  <Route path="/my-orders" element={<MyOrders />} />
                  <Route path="/customer/login" element={<CustomerLogin />} />
                  <Route path="/customer/register" element={<CustomerRegister />} />
                  <Route path="/customer/profile" element={<CustomerProfile />} />
                </Route>

                {/* ================= Staff & Admin Portal ================= */}
                <Route path="/admin/login" element={<Login />} />
                <Route path="/login" element={<Login />} />

                <Route
                  path="/admin"
                  element={
                    <ProtectedRoute>
                      <DashboardLayout />
                    </ProtectedRoute>
                  }
                >
                  <Route index element={<Dashboard />} />
                  <Route path="menu" element={<MenuManagement />} />
                  <Route path="orders" element={<OrderManagement />} />
                  <Route path="kitchen" element={<KitchenManagement />} />
                  <Route path="reservations" element={<Reservations />} />
                  <Route path="inventory" element={<Inventory />} />
                  <Route path="payments" element={<Payments />} />
                  <Route path="customers" element={<Customers />} />
                  <Route path="reports" element={<SalesReports />} />
                  <Route path="users" element={<UserManagement />} />
                  <Route path="settings" element={<Settings />} />
                </Route>

                {/* Backward-compatible redirect shortcuts */}
                <Route path="/menu" element={<Navigate to="/customer/menu" replace />} />
                <Route path="/orders" element={<Navigate to="/admin/orders" replace />} />
                <Route path="/kitchen" element={<Navigate to="/admin/kitchen" replace />} />
                <Route path="/reservations" element={<Navigate to="/admin/reservations" replace />} />
                <Route path="/inventory" element={<Navigate to="/admin/inventory" replace />} />
                <Route path="/payments" element={<Navigate to="/admin/payments" replace />} />
                <Route path="/reports" element={<Navigate to="/admin/reports" replace />} />
                <Route path="/users" element={<Navigate to="/admin/users" replace />} />
                <Route path="/settings" element={<Navigate to="/admin/settings" replace />} />

                {/* Catch-all fallback */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </BrowserRouter>
          </CartProvider>
        </CustomerAuthProvider>
      </RestaurantProvider>
    </AuthProvider>
  );
}
