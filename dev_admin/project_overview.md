# FarmTastic Project Overview

## Project Description

FarmTastic is a farm management game where users can:

- Manage various animals (individual pets like dogs/cats and groups like cows/pigs)
- Monitor and maintain animal health through feeding, watering, and vet care
- Manage inventory of supplies (food, water, etc.)
- Buy and sell animals and supplies through a Farmer's Market
- Track asset health and value over time
- View transaction history with filtering capabilities

## Key Technical Requirements

1. JWT-based authentication system
2. Protected routes with auth checking
3. Real-time health calculation based on timestamps
4. Database integration for user data persistence
5. Server health checking before app initialization
6. Hash routing for static hosting compatibility
7. Comprehensive transaction tracking system

## High-Level Architecture

### Frontend

- React (Vite) single-page application
- Context API for state management
- React Router for navigation
- Axios for API communication
- Individual CSS files per component
- Responsive design for mobile and desktop

### Backend

- Express.js REST API
- MongoDB database with Mongoose ODM
- JWT authentication with refresh tokens
- Rate limiting and security middleware
- MVC architecture (Models, Controllers, Routes)
- Transaction tracking for all financial activities

### Deployment

- Frontend: AWS S3 (static hosting)
- Backend: Vercel
- Database: MongoDB Atlas
