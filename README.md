# DinePoint – Restaurant Management & Customer Ordering System

A comprehensive, modern, and fully integrated **Restaurant Information System (RIS)** built with React 18, Vite, and CSS3. 

**DinePoint** provides two connected interfaces sharing a single real-time restaurant dataset:
1. **Customer Food Ordering Website**: Clean, appetising, public-facing restaurant site with online menu ordering, shopping cart, customizable checkout, simulated payment processing, and visual order tracking.
2. **Administrator & Staff Dashboard**: Operational portal for managers, chefs, servers, and cashiers to manage orders, live kitchen tickets (KDS), table reservations, inventory, POS payments, and sales analytics.

---

## 🎨 Official Blue Colour Palette

| Token | Colour Name | Hex Code | Purpose |
| :--- | :--- | :--- | :--- |
| **Primary Blue** | Primary Navy Blue | `#123B66` | Secondary buttons, prominent headers, card borders |
| **Deep Blue** | Deep Navy Blue | `#0B2545` | Main navigation bar, admin sidebar, footer, brand background |
| **Royal Blue** | Royal Blue | `#2563EB` | Primary action buttons, active navigation indicators, key highlights |
| **Medium Blue** | Medium Blue | `#3B82F6` | Hover states, secondary highlights, accents |
| **Light Blue** | Light Blue | `#DBEAFE` | Selected info panels, active badges, tags |
| **Pale Blue** | Very Light Blue | `#EFF6FF` | Table header tints, alerts, soft highlight backgrounds |
| **White** | Pure White | `#FFFFFF` | Cards, forms, content surfaces |
| **Soft Background** | Soft Blue Canvas | `#F5F8FC` | Global page body background |
| **Dark Text** | Navy Slate | `#172B4D` | Primary typography & headings |
| **Muted Text** | Slate Grey | `#64748B` | Secondary copy, sub-labels, timestamps |
| **Border Grey** | Subtle Border | `#E2E8F0` | Dividers, card borders, table lines |
| **Success** | Success Green | `#16A34A` | Completed status, paid badges, positive KPIs |
| **Warning** | Warning Amber | `#D97706` | Pending alerts, low-stock warnings |
| **Error / Danger** | Error Red | `#DC2626` | Cancelled status, destructive actions |

---

## 🌐 Dual-Interface Architecture & URL Routes

### 🛒 1. Customer Ordering Interface (Public Storefront)

| Route | Description |
| :--- | :--- |
| `/` | **Customer Homepage**: Hero banner with CTAs, featured dishes, categories, special offers, customer testimonials, and dining hours. |
| `/customer/menu` | **Full Food Menu**: Categorised menu with live search, availability tags, and quick "Add to Cart". |
| `/customer/food/:id` | **Food Details**: Large food photo, ingredients, preparation time, quantity picker, and special instructions. |
| `/cart` | **Shopping Cart**: Item quantity controls, special notes, live subtotal, and delivery fee calculation. |
| `/checkout` | **Customer Checkout**: Dining mode selection (Dine-in with table picker, Takeaway, or Kampala delivery address). |
| `/payment` | **Payment Settlement**: Simulated Mobile Money (MTN MoMo / Airtel Money), Card, and Cash. |
| `/order-confirmation/:orderId` | **Order Confirmation**: Order number, summary, and live visual preparation progress bar. |
| `/my-orders` | **Customer Order History**: Expandable order history cards with real-time status tracking. |
| `/customer/login` | **Customer Sign In**: Guest authentication with one-click demo profiles. |
| `/customer/register` | **Customer Registration**: New account registration with auto-login. |
| `/customer/profile` | **Guest Profile**: Loyalty tier (Platinum/Gold/Silver), delivery address, and order history. |

### 🛡️ 2. Administrator & Staff Portal

| Route | Description |
| :--- | :--- |
| `/admin` | **Executive Dashboard**: Key stats, Recharts revenue graph, popular items, low-stock alerts. |
| `/admin/menu` | **Menu Management**: Catalog management, price editing, photo presets, item CRUD. |
| `/admin/orders` | **Order Management**: Live order table, status advancement, payment status updates. |
| `/admin/kitchen` | **Kitchen Display System (KDS)**: Cook station tickets with timer and stage advancement. |
| `/admin/reservations` | **Table Reservations**: Interactive floor layout for 12 tables and booking management. |
| `/admin/inventory` | **Inventory & Stock**: Ingredient tracking, unit measurements, low-stock warnings, and `+/-` quick controls. |
| `/admin/payments` | **Payments & Receipts**: Transaction logs and printable thermal receipt (`window.print()`). |
| `/admin/reports` | **Sales Reports**: Revenue trends, dish popularity bar charts, category donut charts, and CSV export. |
| `/admin/users` | **Staff Management**: Role permissions matrix and employee accounts. |
| `/admin/settings` | **Restaurant Settings**: Business address, TIN, VAT rate, and data reset. |
| `/admin/login` | **Staff Login**: Secure portal with one-click role demo credentials. |

---

## 🔄 Shared Real-Time Integration Flow

Both interfaces share a central React Context (`RestaurantContext`) and synchronize immediately to **LocalStorage**:

```
[Customer Storefront]                             [Staff / Admin Portal]
        │                                                   │
  Customer adds food                                        │
  to Shopping Cart                                          │
        │                                                   │
  Customer checks out                                       │
  & selects payment (MoMo / Card / Cash)                    │
        │                                                   │
  `createOrder()` executed ════════════════════════════════>│ Order appears instantly in:
        │                                                   │  1. Admin Order Management
        │                                                   │  2. Kitchen Display (KDS)
        │                                                   │  3. Dashboard Today's Stats
        │                                                   │
  Customer opens `/my-orders`                               │ Chef clicks "Start Cooking"
  or Order Tracker                                          │ or "Mark Ready" in KDS
        │                                                   │       │
  Status automatically updates <════════════════════════════╝ Status update synced
  to "Preparing" or "Ready"!
```

---

## 🚀 How to Run in VS Code

### Step 1: Open Folder in VS Code
```bash
c:\Users\Personal\Desktop\Resturant
```

### Step 2: Open Terminal
Press ``Ctrl + ` `` in VS Code.

### Step 3: Run the Development Server
```bash
npm run dev
```

### Step 4: Open in Your Browser
- Customer Storefront: **[http://localhost:5173/](http://localhost:5173/)**
- Staff & Admin Portal: **[http://localhost:5173/admin](http://localhost:5173/admin)**

---

## 🔑 Demo Accounts for Immediate Testing

### Customer Accounts
| Customer | Email / Phone | Password | Status |
| :--- | :--- | :--- | :--- |
| **Brian Kasule** *(pre-loaded)* | `bkasule@yahoo.com` | `password123` | Platinum VIP Member |
| **Florence Tumusiime** | `tumusiime.f@gmail.com` | `password123` | Silver Member |

### Staff & Admin Accounts
| Role | Username | Password | Access Scope |
| :--- | :--- | :--- | :--- |
| **Administrator** | `admin` | `password123` | Full access across all 11 admin modules |
| **Manager** | `manager` | `password123` | Reports, menu editing, staff overview |
| **Chef** | `chef` | `password123` | Kitchen Display System (KDS), stock quantities |
| **Waiter** | `waiter` | `password123` | Floor table map, order creation |
| **Cashier** | `cashier` | `password123` | POS settlement, receipt printing |

---

## 🧪 Testing the Integrated End-to-End Workflow

1. **Place an Online Customer Order**:
   - Go to `http://localhost:5173/` and click **"Explore Menu"**.
   - Click **"Details"** on the *Grilled Tilapia Fillet*, add special instructions (e.g. *"Extra tartar sauce"*), and click **"Add to Cart"**.
   - Navigate to the **Shopping Cart** (`/cart`), choose **Dine-In (Table 4)** or **Delivery**, and click **"Proceed to Checkout"**.
   - Fill in contact information and click **"Proceed to Payment"**.
   - Select **Mobile Money (MTN MoMo)** and click **"Confirm Order & Pay"**.
   - Observe the generated order confirmation and live **Order Tracker**.

2. **Fulfill in Staff Kitchen Display System**:
   - In the navigation bar, click the **"Staff Portal"** button (or navigate to `http://localhost:5173/admin/kitchen`).
   - Notice the newly submitted order ticket appears in the **Kitchen Display System** with the special cooking instructions!
   - Click **"Start Cooking (Preparing)"** on the ticket.
   - Now click **"Customer Site"** in the top navbar and visit **"My Orders"** (`/my-orders`).
   - Notice the progress milestone automatically moved to **"In Kitchen (Preparing)"** in real time!
