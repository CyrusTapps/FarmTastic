# FarmTastic 🚜 🐄 🌾

A full-stack farm management simulation game where users can purchase, care for, and sell virtual animals while managing resources and inventory.

![FarmTastic Screenshot](./src/assets/images/appSnip.png)

## 🌟 Features

- **Animal Management**: Purchase and care for individual pets (dogs, cats, horses) and livestock (cows, pigs, chickens, sheep)
- **Dynamic Health System**: Animal health decays realistically over time based on care actions
- **Market Value Evolution**: Animals gain value over time when properly cared for
- **Inventory Management**: Purchase and use supplies like food, water, medicine, and treats
- **Farmer's Market**: Buy and sell animals and supplies
- **Transaction History**: Track all purchases, sales, and care actions

## 🔧 Tech Stack

### Frontend

- **React 19** with Vite for fast development and optimized builds
- **React Router 7** for navigation with hash routing for static hosting compatibility
- **Context API** for state management (AuthContext, RefreshContext)
- **Axios** for API communication with interceptors for token refresh
- **JWT-decode** for token handling
- **CSS** with component-scoped styling and responsive design

### Backend

- **Node.js** with Express for RESTful API
- **MongoDB** with Mongoose ODM for data persistence
- **JWT Authentication** with refresh token rotation
- **Bcrypt** for secure password hashing
- **Helmet** for enhanced HTTP security headers
- **Express Rate Limit** for API abuse prevention
- **Cookie-parser** for HTTP-only cookie management
- **CORS** for cross-origin resource sharing configuration
- **Morgan** for HTTP request logging

### Mobile (Planned)

- **Capacitor** for cross-platform mobile app deployment
- Native device features integration
- Push notifications for animal care reminders
- Offline capabilities

## 🚀 Getting Started

### Prerequisites

- Node.js (v16+)
- MongoDB (local installation or Atlas account)

### Local Development Setup

#### Frontend Setup

1. Clone the repository

   ```bash
   git clone https://github.com/yourusername/farmtastic.git
   cd farmtastic
   ```

2. Install dependencies

   ```bash
   npm install
   ```

3. Set up environment variables

   ```bash
   cp .env.template .env
   ```

   Edit the `.env` file if needed.

4. Start the development server
   ```bash
   npm run dev
   ```
   The frontend will be available at http://localhost:5173

#### Backend Setup

1. Navigate to the server directory

   ```bash
   cd server
   ```

2. Install dependencies

   ```bash
   npm install
   ```

3. Set up MongoDB locally

   - Make sure MongoDB is installed on your system
   - Start the MongoDB service:
     - On Windows: Start the MongoDB service from Services
     - On macOS: `brew services start mongodb-community`
     - On Linux: `sudo systemctl start mongod`
   - The database will be created automatically when the server starts

4. Set up environment variables

   ```bash
   cp .env.template .env
   ```

   - Generate secure JWT secrets:
     ```bash
     node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
     ```
   - Update the JWT_SECRET and REFRESH_TOKEN_SECRET in your .env file with these values

5. Start the server

   ```bash
   npm run dev
   ```

   The backend API will be available at http://localhost:5000/api

6. (Optional) Seed the database with initial data
   ```bash
   npm run seed
   ```

## 🔐 Security Features

### Authentication System

- **JWT-based authentication** with short-lived access tokens (1 hour)
- **Refresh token rotation** with longer-lived tokens (3 days)
- **HTTP-only cookies** for secure token storage
- **Password hashing** with bcrypt and appropriate salt rounds
- **Case-insensitive email** handling for consistent user experience

### API Protection

- **Protected routes** with JWT verification middleware
- **Resource ownership verification** for all data access
- **Rate limiting** to prevent abuse (configurable per endpoint)
- **Helmet integration** for security headers
- **Input validation** on both client and server
- **Centralized error handling** with appropriate error responses

### Token Management

- **In-memory access token** storage (not in localStorage)
- **HTTP-only cookie** for refresh token
- **Automatic token refresh** on 401 responses
- **Request queue system** during token refresh

## 🏗️ Architecture

### Frontend Structure

```
src/
├── assets/            # Images and static files
├── components/        # Reusable UI components
├── context/           # React context providers
├── pages/             # Route components
├── services/          # API service modules
└── main.jsx           # Application entry point
```

### Backend Structure

```
server/
├── config/            # Configuration files
├── controllers/       # Request handlers
├── middleware/        # Express middleware
├── models/            # Mongoose models
├── routes/            # API routes
├── utils/             # Helper functions
└── server.js          # Main application entry point
```

## 📱 Responsive Design

FarmTastic is designed to work on devices of all sizes with a mobile-first approach:

- Small: 0-576px
- Medium: 577px-768px
- Large: 769px-992px
- Extra Large: 993px+

## 🎮 Platform Support

- **Web**: Fully responsive web application
- **Mobile Web**: Optimized for mobile browsers
- **iOS & Android**: Native mobile app support planned (via Capacitor)

## 🎨 Design System

The application uses a farm-themed color palette with consistent component patterns:

- 🌿 Green (`#4CAF50`) – Primary theme color
- 🏡 Brown (`#8D6E63`) – Secondary theme color
- 🌞 Yellow (`#FFD700`) – Accent color
- 🐄 Blue (`#4FC3F7`) – Accent color
- 🍎 Red (`#E57373`) – Accent color

## 🌐 Deployment

The application is configured for deployment to:

- Frontend: AWS S3 (static hosting)
- Backend: Vercel
- Database: MongoDB Atlas
- Mobile: App Store & Google Play (planned)

## 👨‍💻 Developer Information

**Developed by:** Shawn 'Cyrus' Tapps  
**Date:** February 2025
**Contact:** ctapps.dev@gmail.com
**GitHub:** [CyrusTapps](https://github.com/yourusername)

## 📝 License

[MIT](LICENSE)

## 🙏 Acknowledgements

- [React](https://reactjs.org/)
- [Express](https://expressjs.com/)
- [MongoDB](https://www.mongodb.com/)
- [Vite](https://vitejs.dev/)
- [JWT](https://jwt.io/)
- [Capacitor](https://capacitorjs.com/)
