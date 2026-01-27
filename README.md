# Altas - Business Finance Manager

Altas is a comprehensive financial management platform designed for entrepreneurs to track multiple businesses, manage transactions, and analyze cash flow in real-time. It features a modern web dashboard and a secure mobile application.

![Altas Dashboard](public/placeholder.svg)

## 🚀 Features

### Core Capabilities
- **Multi-Business Support**: Manage finances for multiple distinct business portfolios.
- **Transaction Tracking**: Easy income and expense recording with categorization.
- **Real-Time Analytics**: Visual cash flow charts, income vs. expense breakdowns, and profit trends.
- **Business Performance**: Individual performance cards for each business entity.

### 📱 Mobile App Exclusive
- **Secure PIN Authentication**: 
  - 4-digit PIN for quick and secure access.
  - Auto-lock session timeout (3 minutes of inactivity).
  - Secure account locking after failed attempts.
- **On-the-Go Management**: Add transactions instantly from your phone.
- **Dashboard Overview**: View key metrics and recent history at a glance.

### 💻 Web Platform
- **Comprehensive Dashboard**: Detailed charts and extensive data tables.
- **Export Capabilities**: Generate reports and view deep insights.
- **Business Management**: Create and configure new business portfolios.

## 🛠️ Tech Stack

**Frontend (Web)**
- React (Vite)
- TypeScript
- Tailwind CSS
- shadcn/ui
- Recharts

**Mobile Application**
- React Native (Expo)
- TypeScript
- React Navigation
- 3-Factor Authentication Logic

**Backend**
- Node.js & Express
- PostgreSQL (Database)
- JWT Authentication & Bcrypt Hashing

## 🏁 Getting Started

### Prerequisites
- Node.js (v18+)
- PostgreSQL
- Expo Go app on your phone (for mobile testing)

### 1. Database Setup
Create a PostgreSQL database and configure your `.env` file in the `server` directory.
Run the migration scripts located in `server/migrations` to set up tables.

### 2. Backend Server
```bash
cd server
npm install
npm run dev
# Server runs on http://localhost:5000
```

### 3. Web Application
```bash
# Root directory
npm install
npm run dev
# Web app runs on http://localhost:8080
```

### 4. Mobile Application
```bash
cd mobile
npm install
npx expo start --tunnel
# Scan the QR code with Expo Go
```

## 🔐 Security Checks
- **PIN System**: Implementation uses bcrypt for PIN hashing.
- **Session**: 3-minute inactivity timer with React Native AppState monitoring.
- **Network**: Configured for local development via IP/Tunneling.

## 📄 License
Private - Abdillah Ali
