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

**Current Stage**: Dashboard Development & Asset Management Implementation
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

### Next Steps

1. Backend Models and APIs:

   - Create animal model and API endpoints
   - Create inventory model and API endpoints
   - Implement health calculation logic

2. Animal Care Page:

   - Create animal detail page
   - Implement feeding, watering, and vet care functionality
   - Add health tracking with timestamps

3. Farmer's Market:
   - Create market interface
   - Implement buying and selling functionality
   - Add transaction history

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

2. Backend:
   - Robust security setup (bcrypt, helmet, etc.)
   - JWT stored in cookies
   - Local MongoDB first, then Atlas
   - Express server with Vercel deployment planned
   - Email case-insensitivity for login (normalized to lowercase)
   - Increased rate limits for development (to be reduced before production)

### Technical Requirements Tracking

1. Authentication:

   - [x] JWT implementation
   - [x] Protected routes (backend)
   - [x] Protected routes (frontend)
   - [x] Login/Register flows (frontend)
   - [x] Cookie handling
   - [x] Email case-insensitivity

2. Data Management:

   - [x] MongoDB schema design (user model)
   - [x] API endpoints (auth endpoints)
   - [ ] Real-time health calculations
   - [ ] Asset management system

3. Security:
   - [x] Password hashing
   - [x] Route protection (backend)
   - [x] Server health checks
   - [x] Input validation (frontend)
   - [x] Rate limiting (configured for development)

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

4. Animal Care Page:

   - Animal Status Display
   - Action Buttons (Feed, Water, Vet, Sell)

5. Asset Management:
   - Inventory Display
   - Buy/Sell Interface
   - Usage Calculator

### Backend Structure

Key Requirements:

1. Express server on Vercel
2. MongoDB Atlas integration
3. Authentication system with JWT
4. Health calculation system
5. Asset management system
6. Real-time updates and timestamps

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

- 🌼 Light Yellow (`#FFF176`) – A pastel shade to soften elements and create contrast.
- 🌸 Soft Pink (`#FFCDD2`) – A friendly touch for animals and UI highlights.
- 🍃 Light Green (`#A5D6A7`) – A pastel green for gentle backgrounds.
- 🌤 Sky Blue (`#81D4FA`) – A bright, fun alternative for UI elements.
- 🍞 Beige (`#D7CCC8`) – A neutral color to balance out the bright tones.

#### Neutrals (Backgrounds & Text)

- White (`#FFFFFF`) – Clean and crisp for text contrast.
- Light Gray (`#F5F5F5`) – Soft UI backgrounds.
- Dark Gray (`#424242`) – For readable, high-contrast text.

### Usage Guidelines

- Use primary colors for main UI elements and important features
- Use secondary colors for accents, highlights, and to create visual interest
- Use neutrals for backgrounds, text, and to balance the brighter colors
- Maintain sufficient contrast for accessibility (WCAG AA compliance)
- Access colors in CSS using the defined variables:
  ```css
  .example {
    color: var(--color-green);
    background-color: var(--color-light-gray);
  }
  ```

## Development Checklist

### Frontend Checklist

#### Authentication System

- [x] **Create AuthContext**

  - [x] Set up context provider in src/context/AuthContext.jsx
  - [x] Implement state for user data and authentication status
  - [x] Add login, register, and logout functions
  - [x] Handle access token storage (memory only, not localStorage)
  - [x] Add token refresh mechanism
  - [x] **Note**: Never store JWT in localStorage due to XSS vulnerability

- [x] **JWT Handling**

  - [x] Create utility functions in src/services/api.js
  - [x] Implement token decoding with jwt-decode
  - [x] Add token expiration checking
  - [x] **Note**: Use axios interceptors for token refresh

- [x] **Protected Route Component**

  - [x] Create ProtectedRoute.jsx in src/components/ProtectedRoute/
  - [x] Implement authentication checking
  - [x] Add redirect to login for unauthenticated users
  - [x] **Note**: Use AuthContext for auth state

- [x] **SplashScreen Component**

  - [x] Create SplashScreen.jsx in src/pages/SplashScreen/
  - [x] Implement loading animation
  - [x] Add server health check
  - [x] Add 5-second delay before routing to login
  - [x] **Note**: Use background image from assets

- [x] **Login Page**

  - [x] Create Login.jsx in src/pages/Login/
  - [x] Implement form with email and password fields
  - [x] Add validation
  - [x] Connect to AuthContext for login functionality
  - [x] Add error handling

- [x] **Register Page**

  - [x] Create Register.jsx in src/pages/Register/
  - [x] Implement form with name, email, password fields
  - [x] Add validation
  - [x] Connect to AuthContext for register functionality
  - [x] Add error handling

- [x] **Dashboard Page**

  - [x] Create Dashboard.jsx in src/pages/Dashboard/
  - [x] Implement welcome header
  - [x] Add logout button
  - [x] Connect to AuthContext for user data
  - [x] Create AssetCard component for displaying animals and inventory
  - [x] Create AssetList component for organizing assets
  - [x] Implement responsive grid layout

- [x] **Routing**
  - [x] Set up HashRouter in App.jsx for static hosting compatibility
  - [x] Configure routes for all pages
  - [x] Implement protected routes
  - [x] Add SplashScreen with timer
  - [x] Fix routing issues with hash router implementation

#### Dashboard Components

- [x] **AssetCard Component**

  - [x] Create AssetCard.jsx in src/components/AssetCard/
  - [x] Implement card layout with image placeholder
  - [x] Add health indicator for animals
  - [x] Add quantity display for inventory items
  - [x] Make cards clickable to navigate to detail pages

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

// ... rest of frontend checklist ...

### Backend Checklist

#### Initial Setup

// ... existing code ...

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

  - [x] Implement short-lived access tokens (15-30 min)
  - [x] Implement longer-lived refresh tokens (days/weeks)
  - [x] Store refresh tokens in HttpOnly cookies
  - [x] Set secure and SameSite cookie options
  - [x] **Note**: Access tokens should be sent in Authorization header

- [x] **Auth Middleware**
  - [x] Create middleware for route protection
  - [x] Add token verification
  - [x] **Note**: Handle expired tokens gracefully

// ... rest of backend checklist ...

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

- **Access Token**: Short-lived (15-30 min), stored in memory, sent in `Authorization` header.
- **Refresh Token**: Stored in an **HttpOnly** cookie, longer lifespan (days/weeks).
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

- **Dashboard Implementation**:

  - Reusable AssetCard component for displaying different types of assets
  - AssetList component with responsive grid layout
  - FarmHeader component for displaying farm name and currency
  - Mock data for animals and inventory until backend is implemented

- **Console Logging Strategy**:
  - Added detailed console logs throughout the application to track:
    - Component initialization and rendering
    - Authentication state changes
    - API calls and responses
    - Route navigation

### Next Session Plan

For our next session, we should focus on:

1. **Backend Models**:

   - Design and implement the animal model
   - Design and implement the inventory model
   - Create API endpoints for animal and inventory management
   - Implement health calculation logic based on timestamps

2. **Animal Care Page**:

   - Create animal detail page component
   - Implement feeding, watering, and vet care functionality
   - Add health tracking with timestamps
   - Connect to backend API

3. **Farmer's Market Page**:

   - Create market interface
   - Implement buying and selling functionality
   - Add transaction history
   - Connect to backend API

4. **Testing**:
   - Test the complete animal care flow
   - Verify that health calculations work correctly
   - Test buying and selling functionality

### Required Information for Next Session

To continue efficiently in our next session, we should have:

1. Any design mockups or wireframes for the Animal Care and Farmer's Market pages
2. Specifications for animal types and their attributes
3. Inventory item specifications
4. Health calculation formulas or rules
5. Any additional assets needed (animal images, inventory icons, etc.)

### TODO

- Implement backend models for animals and inventory
- Create API endpoints for animal and inventory management
- Develop animal care page with feeding, watering, and vet care functionality
- Implement Farmer's Market page for buying and selling
- Connect frontend components to backend API
- Add real-time health calculation based on timestamps
- Set up MongoDB Atlas for production
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
│   │   └── authController.js
│   ├── middleware/
│   │   ├── authMiddleware.js
│   │   └── rateLimitMiddleware.js
│   ├── models/
│   │   └── userModel.js
│   ├── routes/
│   │   └── authRoutes.js
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
│   │   ├── Register/
│   │   │   ├── Register.jsx
│   │   │   └── Register.css
│   │   └── SplashScreen/
│   │       ├── SplashScreen.jsx
│   │       └── SplashScreen.css
│   ├── services/
│   │   └── api.js
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
