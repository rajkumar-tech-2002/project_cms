# 🍽️ CMS – Canteen Management System

A Full-Stack Web Application for Efficient Canteen Operations Management  
**Developed and Designed for Institutional Deployment**

---

## 📌 Project Overview

**Canteen Management System (CMS)** is a comprehensive web application built to streamline and digitize canteen operations. The system supports **two user roles** — **Admin** and **Counter Operator** — each with dedicated dashboards and workflows.

The application is built using a **React + Vite** frontend and a **Node.js + Express** backend, connected to a **MySQL** database for secure and structured data management.

---

## 🎯 Objectives

- Digitize canteen inventory and purchase management
- Track daily sales and distribution transactions efficiently
- Maintain accurate grocery and prepared-item stock records
- Generate detailed operational and financial reports (PDF & Excel)
- Provide a role-based, responsive, and user-friendly interface
- Support multi-location canteen counter operations

---

## 🚀 Key Features

### 👤 Role-Based Access Control

Two distinct roles with protected routes:

| Role                | Access                                                                                                                                     |
| ------------------- | ------------------------------------------------------------------------------------------------------------------------------------------ |
| **Admin**           | Full system management – Dashboard, Grocery, Items, Vendors, Purchase, Inventory, Distribution, Locations, Reports, Users, Counter Monitor |
| **CounterOperator** | Counter-specific views – Counter Dashboard, Counter Items, Counter Reports                                                                 |

### 📦 Inventory & Stock Management

- Track **grocery items** (raw materials) and **prepared food items**
- Monitor stock levels and distributions across multiple canteen **locations**

### 🛒 Purchase Management

- Record vendor-wise purchases with itemized billing
- Maintain complete purchase history with PDF/Excel export

### 🔄 Distribution Management

- Distribute items from central store to individual counters
- Monitor and track real-time distribution records

### 💰 Sales & Counter Operations

- Counter operators record daily sales per item
- Admin monitors all counter activity in real time via Counter Monitor

### 📊 Reports

- Generate and export detailed reports (PDF via **jsPDF**, Excel via **jspdf-autotable**)
- Available for both Admin and Counter Operator views

### 🔐 Authentication & Security

- JWT-based login with role-based route protection
- Password hashing using **bcryptjs**
- Forgot password functionality

---

## 🛠 Technology Stack

### Frontend (Client)

| Layer                     | Technology                                       |
| :------------------------ | :----------------------------------------------- |
| **Framework**             | React 18 + Vite (SWC)                            |
| **Routing**               | React Router DOM v6                              |
| **State / Data Fetching** | TanStack React Query v5                          |
| **Styling**               | Tailwind CSS v3 + Vanilla CSS                    |
| **UI Components**         | Radix UI (Dialog, Select, Toast, Tooltip, Label) |
| **Forms**                 | React Hook Form                                  |
| **Charts**                | Recharts                                         |
| **Icons**                 | Lucide React                                     |
| **Notifications**         | React Toastify + Sonner                          |
| **PDF Export**            | jsPDF + jspdf-autotable                          |
| **Auth Token**            | jsonwebtoken                                     |
| **Dropdowns**             | React-Select                                     |

### Backend (Server)

| Layer                     | Technology                   |
| :------------------------ | :--------------------------- |
| **Runtime**               | Node.js (ESM modules)        |
| **Framework**             | Express.js v4                |
| **Database**              | MySQL (via mysql2 v3)        |
| **Authentication**        | JWT (jsonwebtoken)           |
| **Password Hashing**      | bcryptjs                     |
| **Process Manager (Dev)** | Nodemon                      |
| **IIS Deploy**            | web.config (serverless-http) |
| **Config**                | dotenv                       |

---

## 🏗 System Architecture

```
CMS/
├── client/                  # Frontend – React + Vite SPA
│   ├── src/
│   │   ├── App.jsx           # Root: Routes & Providers
│   │   ├── main.jsx
│   │   ├── global.css
│   │   ├── components/       # Shared UI components
│   │   │   ├── MainLayout.jsx
│   │   │   ├── ProtectedRoute.jsx
│   │   │   ├── DataTable.jsx
│   │   │   ├── ChartComponent.jsx
│   │   │   ├── StatsCard.jsx
│   │   │   ├── FormInput.jsx
│   │   │   ├── FormModal.jsx
│   │   │   ├── FormSelect.jsx
│   │   │   ├── Footer.jsx
│   │   │   └── ui/           # Radix-based UI primitives
│   │   ├── pages/
│   │   │   ├── homepage/     # Public pages
│   │   │   │   ├── landingpage.jsx
│   │   │   │   ├── login.jsx
│   │   │   │   └── forgotpassword.jsx
│   │   │   ├── mainpage/     # Admin pages
│   │   │   │   ├── Dashboard.jsx
│   │   │   │   ├── Grocery.jsx
│   │   │   │   ├── Items.jsx
│   │   │   │   ├── Vendors.jsx
│   │   │   │   ├── Purchase.jsx
│   │   │   │   ├── Inventory.jsx
│   │   │   │   ├── Distribution.jsx
│   │   │   │   ├── Locations.jsx
│   │   │   │   ├── Reports.jsx
│   │   │   │   ├── User.jsx
│   │   │   │   ├── CounterMonitor.jsx
│   │   │   │   └── NotFound.jsx
│   │   │   └── counterpage/  # Counter Operator pages
│   │   │       ├── CounterDashboard.jsx
│   │   │       ├── CounterItems.jsx
│   │   │       └── CounterReports.jsx
│   │   ├── hooks/
│   │   ├── lib/
│   │   └── utils/
│   ├── public/
│   ├── index.html
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── package.json
│
└── server/                  # Backend – Node.js + Express
    ├── server.js             # Entry point & route registration
    ├── db.js                 # MySQL connection pool
    ├── routes/               # Express route definitions (11 modules)
    │   ├── userRoutes.js
    │   ├── groceryRoutes.js
    │   ├── preparedItemRoutes.js
    │   ├── vendorRoutes.js
    │   ├── purchaseRoutes.js
    │   ├── distributeRoutes.js
    │   ├── inventoryRoutes.js
    │   ├── locationRoutes.js
    │   ├── salesRoutes.js
    │   ├── dashboardRoutes.js
    │   └── demo.js
    ├── controller/           # Business logic (11 controllers)
    │   ├── userController.js
    │   ├── groceryController.js
    │   ├── preparedItemController.js
    │   ├── vendorController.js
    │   ├── purchaseController.js
    │   ├── distributeController.js
    │   ├── inventoryController.js
    │   ├── locationController.js
    │   ├── salesController.js
    │   ├── dashboardController.js
    │   └── reportController.js
    ├── middlewares/          # Auth & validation middleware
    ├── migrations/           # DB migration scripts
    ├── assets/               # Static server assets (e.g. logos)
    ├── uploads/              # Uploaded files
    ├── utils/
    ├── web.config            # IIS deployment configuration
    └── package.json
```

---

## 🔑 Application Routes

### Public Routes

| Path               | Component      | Description           |
| ------------------ | -------------- | --------------------- |
| `/`                | LandingPage    | Home / Welcome screen |
| `/login`           | Login          | User authentication   |
| `/forgot-password` | ForgotPassword | Password reset        |

### Admin Routes _(Role: Admin)_

| Path               | Component      | Description                           |
| ------------------ | -------------- | ------------------------------------- |
| `/dashboard`       | Dashboard      | Overview & stats                      |
| `/grocery`         | Grocery        | Grocery items management              |
| `/items`           | Items          | Prepared food items management        |
| `/vendors`         | Vendors        | Vendor management                     |
| `/purchase`        | Purchase       | Purchase recording & history          |
| `/inventory`       | Inventory      | Stock inventory view                  |
| `/distribution`    | Distribution   | Item distribution to counters         |
| `/locations`       | Locations      | Canteen location management           |
| `/reports`         | Reports        | System-wide reports & exports         |
| `/user`            | User           | User management                       |
| `/counter-monitor` | CounterMonitor | Real-time counter activity monitoring |

### Counter Operator Routes _(Role: CounterOperator)_

| Path                 | Component        | Description                     |
| -------------------- | ---------------- | ------------------------------- |
| `/counter/dashboard` | CounterDashboard | Counter-specific dashboard      |
| `/counter/items`     | CounterItems     | Available items for the counter |
| `/counter/reports`   | CounterReports   | Counter sales reports & exports |

---

## ⚙️ Installation & Setup Guide

### 1️⃣ Prerequisites

- **Node.js** v18 or higher
- **npm** v9 or higher
- **MySQL** Server (local or remote)
- **Git**

### 2️⃣ Clone Repository

```bash
git clone https://github.com/rajkumar-tech-2002/project_cms.git
cd project_cms
```

### 3️⃣ Backend Setup

```bash
cd server
npm install
```

Create a `.env` file inside the `server/` folder:

```env
PORT=3001
JWT_SECRET=your_jwt_secret_key
DB_HOST=your_db_host
DB_PORT=3306
DB_USER=your_db_username
DB_PASSWORD=your_db_password
DB_NAME=cms
```

Start the backend server:

```bash
# Development (with auto-restart)
npm run dev

# Production
node server.js
```

The server will run at: **`http://localhost:3001`**

### 4️⃣ Frontend Setup

```bash
cd client
npm install
```

Create a `.env` file inside the `client/` folder:

```env
VITE_API_URL=http://localhost:3001
```

Start the development server:

```bash
npm run dev
```

Build for production:

```bash
npm run build
```

The client will run at: **`http://localhost:5173`** (dev) or served from `dist/` directory.

---

## 🔐 Security Considerations

- **JWT Authentication** – Stateless token-based auth with role validation
- **bcryptjs** – Industry-standard password hashing
- **Role-Based Route Protection** – `ProtectedRoute` component restricts Admin vs. CounterOperator access
- **Environment Variables** – Sensitive credentials stored in `.env` (not committed to git)
- **CORS** – Configured on backend to control allowed origins
- **Parameterized Queries** – MySQL2 prevents SQL injection via prepared statements

---

## 🏛️ Deployment

The project supports **IIS deployment** via `server/web.config` using `serverless-http`. The client build (`dist/`) can be served as static files via IIS or any static host.

---

## 👨‍💻 Developer Information

| Field             | Details                                |
| ----------------- | -------------------------------------- |
| **Name**          | Rajkumar Anbazhagan                    |
| **Role**          | Full Stack Developer                   |
| **Project Type**  | Institutional / College Project        |
| **Developed For** | Nandha Engineering College             |
| **Year**          | 2026                                   |

---

## 📜 License

This project is developed for institutional use within the college environment. All rights reserved.

---

<p align="center">
  © 2026 Canteen Management System – Developed by Rajkumar Anbazhagan
</p>
