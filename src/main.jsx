import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

// Admin & Base Stylesheets
import './styles/global.css';
import './styles/components.css';
import './styles/dashboard.css';
import './styles/responsive.css';

// Customer Interface Stylesheets
import './customer/styles/customer.css';
import './customer/styles/customer-responsive.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
