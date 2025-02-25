# Project Development Documentation

## Table of Contents

- [Project Overview](#project-overview)
- [Development Progress](#development-progress)
- [Architecture](#architecture)
  - [Frontend Structure](#frontend-structure)
  - [Backend Structure](#backend-structure)
- [Dependencies](#dependencies)
- [Deployment Strategy](#deployment-strategy)
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

## Development Progress

**Current Stage**: Initial Setup
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

### Next Steps

1. Create folder structure:

   ```
   src/
   ├── components/
   │   ├── SplashScreen/
   │   │   ├── SplashScreen.jsx
   │   │   └── SplashScreen.css
   │   └── [other components...]
   ├── layouts/
   │   └── [layout components...]
   ├── pages/
   │   ├── Landing/
   │   ├── Login/
   │   ├── Register/
   │   ├── Dashboard/
   │   └── AnimalCare/
   ├── utils/
   │   └── auth.js
   ├── services/
   │   └── api.js
   └── context/
       └── AuthContext.js
   ```

2. Backend Setup (Pending):

   - Create server directory
   - Install backend dependencies
   - Set up initial Express server
   - Configure MongoDB connection

3. Priority Components to Build:
   - SplashScreen (First component to tackle)
   - Authentication components
   - Protected route wrapper

### Important Decisions Made

1. Frontend:

   - Using individual CSS files per component
   - No additional styling libraries (handling custom CSS)
   - Router setup will be in App.jsx
   - Planning for future mobile with Capacitor

2. Backend:
   - Will use robust security setup (bcrypt, helmet, etc.)
   - JWT stored in cookies
   - Local MongoDB first, then Atlas
   - Express server with Vercel deployment planned

### Technical Requirements Tracking

1. Authentication:

   - [ ] JWT implementation
   - [ ] Protected routes
   - [ ] Login/Register flows
   - [ ] Cookie handling

2. Data Management:

   - [ ] MongoDB schema design
   - [ ] API endpoints
   - [ ] Real-time health calculations
   - [ ] Asset management system

3. Security:
   - [ ] Password hashing
   - [ ] Route protection
   - [ ] Server health checks
   - [ ] Input validation

## Architecture

### Frontend Structure

Key Components Needed:

1. SplashScreen - Initial loading and server verification
2. Authentication Pages:
   - Landing
   - Login
   - Registration
   - Terms of Service
3. Dashboard:
   - Asset List Component
   - Welcome Header
   - Currency Display
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
Each component/page will have its own CSS file following the naming convention:

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

- Frontend: AWS
- Backend: Vercel
- Database: MongoDB Atlas

## Development Notes

### Session Notes

[Date: YYYY-MM-DD]
Initial documentation setup.

### Important Decisions

[Will track key decisions and their rationale here]

### TODO

- Review storyboards
- Define exact project structure
- Discuss and document dependencies
- Plan component hierarchy

### Questions/Concerns

[Will track any open questions or concerns here]

## Project Structure

Current Structure:
FarmTastic/
├── .git/
├── dev_admin/
│ ├── project_documentation.md
│ ├── storyboards/
│ └── assets/
├── public/
├── src/
│ ├── assets/
│ ├── App.css
│ ├── App.jsx # Will contain router setup
│ ├── main.css # Renamed from index.css
│ └── main.jsx
├── .eslintrc.cjs
├── .gitignore
├── index.html # Updated with FarmTastic title
├── package.json
└── vite.config.js

### Planned Frontend Structure

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

### Asset Management

Key Assets:

1. splash_background.jpg - Located in src/assets/
   - Primary use: Splash screen background
   - Will be used in SplashScreen component
   - Consider adding CSS animations for the loading state
   - Should be responsive and maintain aspect ratio

### Component Details

1. SplashScreen Component (Priority)
   - Location: src/components/SplashScreen/
   - Files:
     - SplashScreen.jsx
     - SplashScreen.css
   - Features:
     - Animated 'F' logo
     - Background image (splash_background.jpg)
     - Server/DB connection check
     - Loading state indicators
