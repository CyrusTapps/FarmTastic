# Project Development Documentation

## Table of Contents

- [Project Overview](#project-overview)
- [Development Progress](#development-progress)
- [Architecture](#architecture)
  - [Frontend Structure](#frontend-structure)
  - [Backend Structure](#backend-structure)
- [Dependencies](#dependencies)
- [Deployment Strategy](#deployment-strategy)
- [Design System](#design-system)
- [Development Checklist](#development-checklist)
  - [Frontend Checklist](#frontend-checklist)
  - [Backend Checklist](#backend-checklist)
- [Security Implementation](#security-implementation)
- [Asset Management](#asset-management)
- [Pre-Deployment TODOs](#pre-deployment-todos)
- [Development Notes](#development-notes)

## Project Overview

FarmTastic is a farm management game where users can:

- Manage various animals (individual pets like dogs/cats and groups like cows/pigs)
- Monitor and maintain animal health through feeding, watering, and vet care
- Manage inventory of supplies (food, water, etc.)
- Buy and sell animals and supplies through a Farmer's Market
- Track asset health and value over time

Key Technical Requirements:

1. JWT-based authentication system
2. Protected routes with auth checking
3. Real-time health calculation based on timestamps
4. Database integration for user data persistence
5. Server health checking before app initialization
6. Hash routing for static hosting compatibility

## Development Progress

**Current Stage**: Market Implementation & Animal Management
**Last Updated**: [Current Date]

### Completed Tasks

- [x] Initial documentation setup
- [x] Storyboard review
- [x] Create Vite React project
- [x] Install frontend dependencies (react-router-dom, axios, jwt-decode)
- [x] Rename index.css to main.css
- [x] Clean App.jsx for router setup
- [x] Update index.html title
- [x] Add splash_background.jpg to assets
- [x] Create folder structure
- [x] Create API service with axios
- [x] Create AuthContext for authentication state management
- [x] Implement Protected Route component
- [x] Create SplashScreen component with loading animation
- [x] Create Login page component
- [x] Create Register page component
- [x] Create Dashboard page component
- [x] Implement routing in App.jsx with SplashScreen delay
- [x] Create Express server with MongoDB connection
- [x] Implement user model with password hashing
- [x] Create authentication routes and controllers
- [x] Implement JWT token generation and verification
- [x] Add rate limiting for security
- [x] Implement email case-insensitivity for login
- [x] Switch to hash routing for static hosting compatibility
- [x] Enhance index.html with SEO meta tags
- [x] Create reusable AssetCard component
- [x] Create AssetList component for displaying multiple assets
- [x] Implement FarmHeader component
- [x] Update Dashboard layout with asset lists
- [x] Add mock data for animals and inventory
- [x] Create Market page component
- [x] Implement animal purchase functionality
- [x] Add pet naming modal for pet purchases
- [x] Implement inventory purchase functionality
- [x] Fix token refresh mechanism
- [x] Update JWT expiration times for better user experience
- [x] Create animal model and API endpoints
- [x] Create inventory model and API endpoints
- [x] Create transaction model for purchase history
- [x] Implement proper category handling for animals (pet vs. livestock)

### Next Steps

1. Animal Care Page:

   - Create animal detail page
   - Implement feeding, watering, and vet care functionality
   - Add health tracking with timestamps
   - Connect to backend API

2. Inventory Management:

   - Create inventory detail page
   - Implement inventory usage on animals
   - Add inventory tracking

3. Dashboard Enhancements:

   - Connect to real data from backend
   - Add health status indicators
   - Implement sorting and filtering options

4. User Profile:
   - Create user profile page
   - Allow farm name editing
   - Show transaction history

### Important Decisions Made

1. Frontend:

   - Using individual CSS files per component
   - No additional styling libraries (handling custom CSS)
   - Router setup in App.jsx
   - Planning for future mobile with Capacitor
   - SplashScreen implemented as a standalone component with timer
   - AuthContext for centralized authentication state management
   - Switched to hash routing for better compatibility with AWS S3 static hosting
   - Enhanced index.html with SEO meta tags
   - Created reusable components for assets (AssetCard, AssetList)
   - Implemented responsive grid layout for dashboard
   - Added pet naming modal for better user experience
   - Implemented category-based animal handling (pet vs. livestock)

2. Backend:
   - Robust security setup (bcrypt, helmet, etc.)
   - JWT stored in cookies
   - Local MongoDB first, then Atlas
   - Express server with Vercel deployment planned
   - Email case-insensitivity for login (normalized to lowercase)
   - Increased rate limits for development (to be reduced before production)
   - Extended JWT expiration times for better user experience (1h for access token, 3d for refresh token)
   - Implemented proper animal categorization (pet vs. livestock)
   - Created transaction model for purchase history

### Technical Requirements Tracking

1. Authentication:

   - [x] JWT implementation
   - [x] Protected routes (backend)
   - [x] Protected routes (frontend)
   - [x] Login/Register flows (frontend)
   - [x] Cookie handling
   - [x] Email case-insensitivity
   - [x] Token refresh mechanism

2. Data Management:

   - [x] MongoDB schema design (user model)
   - [x] MongoDB schema design (animal model)
   - [x] MongoDB schema design (inventory model)
   - [x] MongoDB schema design (transaction model)
   - [x] API endpoints (auth endpoints)
   - [x] API endpoints (animal endpoints)
   - [x] API endpoints (inventory endpoints)
   - [ ] Real-time health calculations
   - [ ] Asset management system

3. Security:
   - [x] Password hashing
   - [x] Route protection (backend)
   - [x] Server health checks
   - [x] Input validation (frontend)
   - [x] Rate limiting (configured for development)
   - [x] Token refresh mechanism

## Architecture

### Frontend Structure

Key Components Implemented:

1. SplashScreen - Initial loading and server verification

   - Displays for 5 seconds before routing to login
   - Shows FarmTastic logo and loading animation
   - Uses farm-themed background image

2. Authentication Components:

   - Login page with email/password fields
   - Registration page with validation
   - AuthContext for state management
   - Protected Route component for auth checking

3. Dashboard:

   - FarmHeader with farm name and currency display
   - Welcome message
   - AssetList component for displaying animals and inventory
   - AssetCard component for individual assets
   - Responsive grid layout

4. Market:

   - Display of available animals and inventory items
   - Purchase functionality for animals and inventory
   - Pet naming modal for pet purchases
   - Currency update after purchases
   - Error handling for insufficient funds

5. Animal Care Page (Planned):

   - Animal Status Display
   - Action Buttons (Feed, Water, Vet, Sell)
   - Health tracking with timestamps

6. Asset Management (Planned):
   - Inventory Detail Display
   - Usage Interface
   - Inventory Tracking

### Backend Structure

Key Components Implemented:

1. Express server with MongoDB connection
2. Authentication system with JWT

   - User model with password hashing
   - Login/register/logout endpoints
   - Token refresh endpoint
   - Protected route middleware

3. Animal Management System

   - Animal model with health tracking
   - Category-based handling (pet vs. livestock)
   - Purchase endpoints
   - Health calculation methods

4. Inventory Management System

   - Inventory model with quantity tracking
   - Purchase endpoints
   - Usage methods

5. Transaction System
   - Transaction model for purchase history
   - Transaction creation on purchases

## Dependencies

### Frontend

- React (via Vite)
- react-router-dom (routing)
- axios (API calls)
- jwt-decode (token handling)
- [Capacitor to be added later for mobile]

Frontend Structure Note:
Each component/page has its own CSS file following the naming convention:

### Backend

- express (server framework)
- mongoose (MongoDB ODM)
- jsonwebtoken (JWT auth)
- bcrypt (password hashing)
- cookie-parser (cookie handling)
- cors (Cross-Origin Resource Sharing)
- dotenv (environment variables)
- helmet (security headers)
- nodemon (development auto-restart)

Security Focus:

- Password hashing with bcrypt
- JWT tokens stored in cookies
- Helmet for security headers
- Regular auth verification
- No plain text password storage
- Protected routes with middleware

## Deployment Strategy

- Frontend: AWS S3 (static hosting)
- Backend: Vercel
- Database: MongoDB Atlas

## Design System

### Color Palette

The application uses a farm-themed color palette defined as CSS variables in `main.css`:

#### Primary Colors (Core Theme)

- 🌿 Green (`#4CAF50`) – Represents nature, grass, and healthy crops.
- 🏡 Brown (`#8D6E63`) – A warm, earthy tone for barns, soil, and wood elements.
- 🌞 Yellow (`#FFD700`) – Bright and cheerful, representing the sun and hay.
- 🐄 Blue (`#4FC3F7`) – A soft sky blue for a fresh, open atmosphere.
- 🍎 Red (`#E57373`) – A fun, energetic color for apples, barns, and accents.

#### Secondary Colors (Accents & UI Highlights)

- 🌱 Light Green (`#A5D6A7`) – For secondary elements and highlights.
- 🌾 Beige (`#F5DEB3`) – For backgrounds and neutral areas.
- 🌄 Orange (`#FFA726`) – For call-to-action buttons and important elements.
- 🌊 Light Blue (`#B3E5FC`) – For information and secondary elements.
- 🌸 Pink (`#F8BBD0`) – For special features and feminine elements.

#### Utility Colors

- ⚫ Dark Text (`#333333`) – For primary text content.
- ⚪ Light Text (`#FFFFFF`) – For text on dark backgrounds.
- 🔘 Border Gray (`#DDDDDD`) – For subtle borders and dividers.
- 🚫 Error Red (`#D32F2F`) – For error messages and warnings.
- ✅ Success Green (`#388E3C`) – For success messages and confirmations.

## Development Checklist

### Frontend Checklist

#### Initial Setup

- [x] **Project Creation**

  - [x] Create Vite React project
  - [x] Install dependencies
  - [x] Set up folder structure
  - [x] Configure routing

- [x] **Base Styling**
  - [x] Define color palette in main.css
  - [x] Set up global styles
  - [x] Create CSS variables for consistent styling

#### Authentication System

- [x] **AuthContext**

  - [x] Create AuthContext.jsx in src/context/
  - [x] Implement login/register/logout functions
  - [x] Add token refresh mechanism
  - [x] Store user data in context

- [x] **API Service**

  - [x] Create api.js in src/services/
  - [x] Set up axios instance with base URL
  - [x] Add request/response interceptors
  - [x] Implement token handling

- [x] **Protected Route**
  - [x] Create ProtectedRoute.jsx in src/components/ProtectedRoute/
  - [x] Implement authentication checking
  - [x] Add redirect for unauthenticated users

#### Core Pages

- [x] **SplashScreen**

  - [x] Create SplashScreen.jsx in src/pages/SplashScreen/
  - [x] Add loading animation
  - [x] Implement 5-second delay
  - [x] Add background image

- [x] **Login Page**

  - [x] Create Login.jsx in src/pages/Login/
  - [x] Implement login form with validation
  - [x] Add error handling
  - [x] Style with Login.css

- [x] **Register Page**

  - [x] Create Register.jsx in src/pages/Register/
  - [x] Implement registration form with validation
  - [x] Add error handling
  - [x] Style with Register.css

- [x] **Dashboard**

  - [x] Create Dashboard.jsx in src/pages/Dashboard/
  - [x] Add welcome message
  - [x] Implement layout for animals and inventory
  - [x] Style with Dashboard.css

- [x] **Market Page**
  - [x] Create Market.jsx in src/pages/Market/
  - [x] Implement animal and inventory purchase functionality
  - [x] Add pet naming modal for pet purchases
  - [x] Handle currency updates after purchases
  - [x] Style with Market.css

#### Reusable Components

- [x] **AssetCard Component**

  - [x] Create AssetCard.jsx in src/components/AssetCard/
  - [x] Display animal or inventory item
  - [x] Show health for animals
  - [x] Show quantity for inventory
  - [x] Make clickable for detail view

- [x] **AssetList Component**

  - [x] Create AssetList.jsx in src/components/AssetList/
  - [x] Implement grid layout for multiple assets
  - [x] Add section title
  - [x] Make responsive for different screen sizes

- [x] **FarmHeader Component**
  - [x] Create FarmHeader.jsx in src/components/FarmHeader/
  - [x] Display farm name from user data
  - [x] Show currency amount
  - [x] Add logout button
  - [x] Make responsive for mobile

#### Planned Components

- [ ] **AnimalDetail Component**

  - [ ] Create AnimalDetail.jsx in src/pages/AnimalDetail/
  - [ ] Display animal information
  - [ ] Show health status
  - [ ] Add care actions (feed, water, vet)
  - [ ] Implement selling functionality

- [ ] **InventoryDetail Component**

  - [ ] Create InventoryDetail.jsx in src/pages/InventoryDetail/
  - [ ] Display inventory information
  - [ ] Show quantity
  - [ ] Add usage functionality
  - [ ] Implement selling functionality

- [ ] **UserProfile Component**
  - [ ] Create UserProfile.jsx in src/pages/UserProfile/
  - [ ] Display user information
  - [ ] Allow farm name editing
  - [ ] Show transaction history

### Backend Checklist

#### Initial Setup

- [x] **Server Configuration**
  - [x] Create Express server
  - [x] Set up MongoDB connection
  - [x] Configure middleware (cors, helmet, etc.)
  - [x] Implement error handling

#### Authentication System

- [x] **User Model**

  - [x] Create user schema
  - [x] Add password hashing with bcrypt (minimum 10 salt rounds)
  - [x] Add methods for token generation
  - [x] **Note**: Never store plain text passwords

- [x] **Auth Routes**

  - [x] Implement register endpoint
  - [x] Implement login endpoint with rate limiting
  - [x] Implement logout endpoint
  - [x] Add token refresh endpoint
  - [x] **Note**: Validate all inputs

- [x] **Token Strategy**

  - [x] Implement access tokens (1h expiration)
  - [x] Implement refresh tokens (3d expiration)
  - [x] Store refresh tokens in HttpOnly cookies
  - [x] Set secure and SameSite cookie options
  - [x] **Note**: Access tokens should be sent in Authorization header

- [x] **Auth Middleware**
  - [x] Create middleware for route protection
  - [x] Add token verification
  - [x] **Note**: Handle expired tokens gracefully

#### Data Models

- [x] **Animal Model**

  - [x] Create animal schema
  - [x] Add health tracking fields
  - [x] Implement category-based handling (pet vs. livestock)
  - [x] Add timestamps for feeding, watering, etc.
  - [x] **Note**: Different handling for pets vs. livestock

- [x] **Inventory Model**

  - [x] Create inventory schema
  - [x] Add quantity tracking
  - [x] Implement item types
  - [x] **Note**: Track usage and effects

- [x] **Transaction Model**
  - [x] Create transaction schema
  - [x] Track purchase and sale transactions
  - [x] Link to users, animals, and inventory
  - [x] **Note**: Important for financial tracking

#### API Endpoints

- [x] **Animal Endpoints**

  - [x] Create animal purchase endpoint
  - [x] Implement animal retrieval endpoints
  - [x] Add animal care endpoints (feed, water, vet)
  - [x] Implement animal selling endpoint
  - [x] **Note**: Update user currency on transactions

- [x] **Inventory Endpoints**
  - [x] Create inventory purchase endpoint
  - [x] Implement inventory retrieval endpoints
  - [x] Add inventory usage endpoints
  - [x] Implement inventory selling endpoint
  - [x] **Note**: Update user currency on transactions

#### Security and Optimization

- [x] **Security Enhancements**

  - [x] Add rate limiting with express-rate-limit
  - [x] Implement request validation
  - [x] Configure CORS with specific origins
  - [x] Set up Helmet for security headers
  - [x] **Note**: Apply stricter rate limits to auth routes

- [ ] **Performance Optimization**

  - [ ] Add database indexing
  - [ ] Implement query optimization
  - [ ] **Note**: Monitor query performance

- [ ] **Logging System**
  - [ ] Set up structured logging with winston or morgan
  - [ ] Add request logging
  - [ ] Implement error tracking
  - [ ] **Note**: Don't log sensitive information

## Security Implementation

### JWT & Cookie Strategy

- **Access Token**: 1-hour expiration, stored in memory, sent in `Authorization` header.
- **Refresh Token**: 3-day expiration, stored in an **HttpOnly** cookie.
- **Refresh Token Route**: `/api/auth/refresh` to issue new access token when expired.
- **Security**: Set `httpOnly: true`, `secure: true`, and `sameSite: 'strict'` in production.

### Authentication Flow

1. **User Registration** → Hash password → Store in DB.
2. **User Login** → Check password → Issue **JWT** + **Set refresh token cookie**.
3. **Frontend Stores Access Token in Memory** (React state, not localStorage).
4. **API Calls** → Send **JWT in headers** (`Authorization: Bearer <token>`).
5. **Token Expired?** → Use **refresh token** to get a new one.
6. **Logout** → Clear refresh token cookie and remove access token from memory.

### Security Best Practices

- **Password Hashing**: Use `bcrypt.hash(password, saltRounds)` with minimum 10 salt rounds.
- **Helmet for Security Headers**: Protect against XSS, clickjacking, etc.
- **Rate Limiting**: Implement with `express-rate-limit` to prevent brute force attacks:
  ```javascript
  const rateLimit = require("express-rate-limit");
  const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // Limit each IP to 5 login attempts
    message: "Too many login attempts. Try again later.",
  });
  app.use("/api/auth/login", authLimiter);
  ```
- **CORS Settings**: Configure with specific origins:
  ```javascript
  const cors = require("cors");
  app.use(
    cors({
      origin: process.env.CLIENT_URL,
      credentials: true,
    })
  );
  ```
- **Environment Variables**: Use `dotenv` for all secrets and configuration.
- **Input Validation**: Validate all user inputs on both client and server.
- **Error Handling**: Custom error handling that doesn't expose sensitive information.

## Pre-Deployment TODOs

### Backend Security Adjustments

1. **Rate Limiting**:

   - File: `server/middleware/rateLimitMiddleware.js` (Line ~15)
   - Change: Reduce login rate limit from 50 to 5-10 attempts per 15 minutes
   - Current code: `max: 50, // Increased to 50 for development`
   - Target code: `max: 5, // Strict limit for production`

2. **Cookie Security**:

   - File: `server/utils/jwtUtils.js` (Line ~25)
   - Change: Ensure secure flag is enabled for production
   - Current code: `secure: process.env.NODE_ENV === "production"`
   - Verify NODE_ENV is set to "production" in deployment environment

3. **Error Handling**:

   - File: `server/server.js` (Line ~60)
   - Change: Ensure detailed errors are not exposed in production
   - Current code: `error: process.env.NODE_ENV === "production" ? "Server Error" : err.message`
   - Verify NODE_ENV is set to "production" in deployment environment

4. **Environment Variables**:
   - File: `.env` files (both frontend and backend)
   - Change: Create separate .env.production files with appropriate values
   - Remove development-specific variables and set production URLs

### Frontend Security Adjustments

1. **API Base URL**:

   - File: `src/services/api.js` (Line ~10)
   - Change: Update API base URL to production endpoint
   - Current code: `baseURL: "http://localhost:5000/api"`
   - Target code: `baseURL: "https://your-production-api.com/api"`

2. **Console Logging**:

   - Files: Multiple (search for "console.log")
   - Change: Remove or disable excessive console logging in production build
   - Consider implementing a logging utility that only logs in development

3. **Error Messages**:
   - Files: `src/pages/Login/Login.jsx`, `src/pages/Register/Register.jsx`
   - Change: Ensure error messages don't expose sensitive information
   - Review all user-facing error messages

### Database Preparation

1. **MongoDB Connection**:

   - File: `server/.env`
   - Change: Update MONGO_URI to production MongoDB Atlas instance
   - Current code: `MONGO_URI=mongodb://localhost:27017/farmtastic`
   - Target code: `MONGO_URI=mongodb+srv://user:password@cluster.mongodb.net/farmtastic`

2. **Database Indexes**:
   - File: `server/models/userModel.js`
   - Change: Add appropriate indexes for frequently queried fields
   - Consider adding indexes for email and username fields

### Deployment Configuration

1. **CORS Settings**:

   - File: `server/server.js` (Line ~35)
   - Change: Update CLIENT_URL to production frontend URL
   - Verify CORS is properly configured for production domains

2. **Build Configuration**:

   - File: `vite.config.js`
   - Change: Review and optimize build settings for production
   - Consider enabling additional optimizations

3. **Server Configuration**:
   - File: `server/server.js`
   - Change: Add production-specific middleware (compression, etc.)
   - Consider implementing a process manager like PM2

## Development Notes

### Session Notes

[Date: YYYY-MM-DD]

- Initial documentation setup.

[Previous Date]

- Created basic frontend structure
- Implemented SplashScreen, Landing, Login, Register, and Dashboard pages
- Set up routing in App.jsx
- Defined color palette as CSS variables in main.css
- Added security implementation details
- Added animal assets (cow.jpg, dog.jpg, pig.jpg, sheep.jpg) to the project

[Current Date]

- Implemented AuthContext for authentication state management
- Created API service with axios for backend communication
- Implemented Protected Route component for auth checking
- Created SplashScreen component with 5-second delay
- Implemented Login and Register pages with validation
- Created Dashboard page with user welcome
- Fixed SplashScreen to properly display before routing to login
- Added extensive console logging for debugging
- Updated project documentation to reflect progress
- Implemented email case-insensitivity for login
- Increased rate limits for development (with TODO for production)
- Successfully tested full authentication flow with backend
- Switched to hash routing for better compatibility with AWS S3 static hosting
- Enhanced index.html with SEO meta tags
- Created reusable AssetCard component for displaying animals and inventory
- Implemented AssetList component with responsive grid layout
- Created FarmHeader component for displaying farm name and currency
- Updated Dashboard to use new components with mock data
- Created Market page with animal and inventory purchase functionality
- Added pet naming modal for pet purchases
- Fixed token refresh mechanism
- Updated JWT expiration times for better user experience
- Implemented proper category handling for animals (pet vs. livestock)

### Important Decisions

- Moved SplashScreen to pages directory for consistency with other full-screen routed components
- Using CSS variables for consistent styling across components
- Each page has its own directory with separate CSS file
- Implementing JWT authentication with separate access and refresh tokens
- Using animal images for representation in Animal Care page and Dashboard
- Added extensive console logging for development debugging
- Implemented SplashScreen as a standalone component with timer in App.jsx
- Using memory-only storage for access tokens (not localStorage)
- Normalized email addresses to lowercase for case-insensitive login
- Increased rate limits during development phase
- Switched to hash routing for better compatibility with AWS S3 static hosting
- Enhanced index.html with SEO meta tags for better search engine visibility
- Created reusable components for assets to maintain consistency across the application
- Implemented responsive grid layout for better mobile experience
- Added pet naming modal for better user experience when purchasing pets
- Extended JWT expiration times for better user experience (1h for access token, 3d for refresh token)
- Implemented proper category handling for animals (pet vs. livestock)

### Frontend Implementation Notes

- **SplashScreen Strategy**:

  - Implemented as a standalone component rendered directly in App.jsx
  - Uses a 5-second timer before showing the main app with routing
  - Displays FarmTastic logo and loading animation
  - Uses farm-themed background image

- **Authentication Flow**:

  - Login/Register forms with validation
  - AuthContext for centralized auth state management
  - Protected Route component for auth checking
  - API service for backend communication
  - Token refresh mechanism for handling expired tokens

- **Dashboard Implementation**:

  - Reusable AssetCard component for displaying different types of assets
  - AssetList component with responsive grid layout
  - FarmHeader component for displaying farm name and currency
  - Mock data for animals and inventory until backend is implemented

- **Market Implementation**:

  - Display of available animals and inventory items
  - Purchase functionality for animals and inventory
  - Pet naming modal for pet purchases
  - Currency update after purchases
  - Error handling for insufficient funds

- **Console Logging Strategy**:
  - Added detailed console logs throughout the application to track:
    - Component initialization and rendering
    - Authentication state changes
    - API calls and responses
    - Route navigation

### Next Session Plan

For our next session, we should focus on:

1. **Animal Care Page**:

   - Create animal detail page component
   - Implement feeding, watering, and vet care functionality
   - Add health tracking with timestamps
   - Connect to backend API

2. **Inventory Management**:

   - Create inventory detail page
   - Implement inventory usage on animals
   - Add inventory tracking
   - Connect to backend API

3. **Dashboard Enhancements**:

   - Connect to real data from backend
   - Add health status indicators
   - Implement sorting and filtering options

4. **User Profile**:
   - Create user profile page
   - Allow farm name editing
   - Show transaction history

### Required Information for Next Session

To continue efficiently in our next session, we should have:

1. Any design mockups or wireframes for the Animal Care and Inventory Detail pages
2. Specifications for health calculation formulas or rules
3. Requirements for inventory usage on animals
4. Any additional assets needed (icons, images, etc.)

### TODO

- Implement Animal Care page with feeding, watering, and vet care functionality
- Create Inventory Detail page with usage functionality
- Connect Dashboard to real data from backend
- Implement User Profile page
- Add health status indicators to Dashboard
- Implement sorting and filtering options for assets
- Add transaction history to User Profile
- Address all pre-deployment TODOs listed in the dedicated section

### Questions/Concerns

[Will track any open questions or concerns here]

### IMPORTANT REMINDER FOR NEXT SESSION

**NOTE TO CLAUDE**: For EVERY recommended file, component, or util creation, provide the recommended file path as to where it should live based on our agreed file tree. Always specify the full path when suggesting new files or components.

## Project Structure

Current Structure:

```
FarmTastic/
├── .git/
├── dev_admin/
│   ├── project_documentation.md
│   ├── storyboards/
│   └── assets/
├── public/
├── server/
│   ├── config/
│   │   └── db.js
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── animalController.js
│   │   └── inventoryController.js
│   ├── middleware/
│   │   ├── authMiddleware.js
│   │   └── rateLimitMiddleware.js
│   ├── models/
│   │   ├── userModel.js
│   │   ├── animalModel.js
│   │   ├── inventoryModel.js
│   │   └── transactionModel.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── animalRoutes.js
│   │   └── inventoryRoutes.js
│   ├── utils/
│   │   └── jwtUtils.js
│   ├── .env
│   └── server.js
├── src/
│   ├── assets/
│   │   └── splash_background.jpg
│   ├── components/
│   │   ├── AssetCard/
│   │   │   ├── AssetCard.jsx
│   │   │   └── AssetCard.css
│   │   ├── AssetList/
│   │   │   ├── AssetList.jsx
│   │   │   └── AssetList.css
│   │   ├── FarmHeader/
│   │   │   ├── FarmHeader.jsx
│   │   │   └── FarmHeader.css
│   │   ├── MarketButton/
│   │   │   ├── MarketButton.jsx
│   │   │   └── MarketButton.css
│   │   └── ProtectedRoute/
│   │       ├── ProtectedRoute.jsx
│   │       └── ProtectedRoute.css
│   ├── context/
│   │   └── AuthContext.jsx
│   ├── pages/
│   │   ├── Dashboard/
│   │   │   ├── Dashboard.jsx
│   │   │   └── Dashboard.css
│   │   ├── Login/
│   │   │   ├── Login.jsx
│   │   │   └── Login.css
│   │   ├── Market/
│   │   │   ├── Market.jsx
│   │   │   └── Market.css
│   │   ├── Register/
│   │   │   ├── Register.jsx
│   │   │   └── Register.css
│   │   └── SplashScreen/
│   │       ├── SplashScreen.jsx
│   │       └── SplashScreen.css
│   ├── services/
│   │   ├── api.js
│   │   ├── animalService.js
│   │   └── inventoryService.js
│   ├── App.css
│   ├── App.jsx
│   ├── main.css
│   └── main.jsx
├── .eslintrc.cjs
├── .gitignore
├── index.html
├── package.json
└── vite.config.js
```

### Planned Frontend Structure

```
src/
├── assets/
├── components/ # Reusable components
├── layouts/ # Layout components
├── pages/ # Route components
├── utils/ # Helper functions
├── services/ # API calls
├── context/ # React context if needed
├── App.jsx
├── App.css
├── main.jsx
└── main.css
```

### Asset Management

Key Assets:

1. splash_background.jpg - Located in src/assets/
   - Primary use: Splash screen background
   - Used in SplashScreen component
   - Responsive and maintains aspect ratio

// Additional assets will be documented here as they are added

### Component Details

1. SplashScreen Component (Implemented)

   - Location: src/pages/SplashScreen/
   - Files:
     - SplashScreen.jsx
     - SplashScreen.css
   - Features:
     - Animated 'F' logo
     - Background image (splash_background.jpg)
     - Loading animation
     - 5-second display before routing to login

2. Protected Route Component (Implemented)

   - Location: src/components/ProtectedRoute/
   - Files:
     - ProtectedRoute.jsx
     - ProtectedRoute.css
   - Features:
     - Authentication checking
     - Redirect to login for unauthenticated users
     - Uses AuthContext for auth state

3. Authentication Context (Implemented)

   - Location: src/context/AuthContext.jsx
   - Features:
     - User state management
     - Login/register/logout functions
     - Token refresh mechanism
     - Authentication status checking

4. AssetCard Component (Implemented)

   - Location: src/components/AssetCard/
   - Files:
     - AssetCard.jsx
     - AssetCard.css
   - Features:
     - Displays animal or inventory item
     - Shows health for animals
     - Shows quantity for inventory
     - Clickable to navigate to detail page

5. AssetList Component (Implemented)

   - Location: src/components/AssetList/
   - Files:
     - AssetList.jsx
     - AssetList.css
   - Features:
     - Displays multiple assets in a grid
     - Responsive layout for different screen sizes
     - Section title

6. FarmHeader Component (Implemented)
   - Location: src/components/FarmHeader/
   - Files:
     - FarmHeader.jsx
     - FarmHeader.css
   - Features:
     - Displays farm name
     - Shows currency amount
     - Logout button
     - Responsive for mobile

### Planned Backend Structure

```
server/
├── config/
│   ├── db.js
│   └── .env
├── controllers/
│   ├── authController.js
│   ├── animalController.js
│   └── inventoryController.js
├── middleware/
│   ├── authMiddleware.js
│   ├── rateLimitMiddleware.js
│   └── errorMiddleware.js
├── models/
│   ├── userModel.js
│   ├── animalModel.js
│   └── inventoryModel.js
├── routes/
│   ├── authRoutes.js
│   ├── animalRoutes.js
│   └── inventoryRoutes.js
├── utils/
│   ├── jwtUtils.js
│   └── errorUtils.js
└── server.js
```
