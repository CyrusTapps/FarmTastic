# FarmTastic Backend

This is the backend server for the FarmTastic farm management game.

## Setup

1. Install dependencies:

   ```
   npm install
   ```

2. Create a `.env` file in the root directory with the following variables:

   ```
   NODE_ENV=development
   PORT=5000
   MONGO_URI=mongodb://localhost:27017/farmtastic
   JWT_SECRET=your_jwt_secret_key_here
   JWT_EXPIRE=15m
   REFRESH_TOKEN_SECRET=your_refresh_token_secret_here
   REFRESH_TOKEN_EXPIRE=7d
   CLIENT_URL=http://localhost:5173
   ```

3. Start the development server:
   ```
   npm run dev
   ```

## API Endpoints

### Authentication

- `POST /api/auth/register` - Register a new user

  - Request body: `{ username, email, password, farmName }`
  - Response: `{ success: true, accessToken: "jwt_token", user: { ... } }`

- `POST /api/auth/login` - Login a user

  - Request body: `{ email, password }`
  - Response: `{ success: true, accessToken: "jwt_token", user: { ... } }`
  - Note: This endpoint has rate limiting (5 attempts per 15 minutes)

- `POST /api/auth/logout` - Logout a user

  - Clears the refresh token cookie

- `GET /api/auth/me` - Get current user (protected route)

  - Requires Authorization header with Bearer token
  - Response: User object

- `POST /api/auth/refresh-token` - Refresh access token
  - Uses refresh token from cookies
  - Response: New access token

### Health Check

- `GET /api/health` - Check if the server is running
  - Response: `{ status: 'ok', message: 'Server is running' }`

## API Response Format

The API follows a consistent response format:

### Success Responses

```json
{
  "success": true,
  "accessToken": "jwt_token_string", // For auth endpoints
  "user": {
    // User object for auth endpoints
    "_id": "user_id",
    "username": "username",
    "email": "user@example.com",
    "farmName": "My Farm",
    "currency": 1000,
    "createdAt": "2023-01-01T00:00:00.000Z",
    "lastLogin": "2023-01-01T00:00:00.000Z"
  }
  // Other data specific to the endpoint
}
```

### Error Responses

```json
{
  "success": false,
  "error": "Error message describing what went wrong"
}
```

## Project Structure

```
server/
├── config/
│   └── db.js             # Database connection configuration
├── controllers/
│   └── authController.js # Authentication controller functions
├── middleware/
│   ├── authMiddleware.js      # JWT authentication middleware
│   └── rateLimitMiddleware.js # Rate limiting middleware
├── models/
│   └── userModel.js      # User model with schema definition
├── routes/
│   └── authRoutes.js     # Authentication routes
├── utils/
│   └── jwtUtils.js       # JWT token utilities
├── .env                  # Environment variables (create this file)
├── package.json          # Project dependencies and scripts
└── server.js             # Main server entry point
```

## Security Features

- Password hashing with bcrypt
- JWT authentication with access and refresh tokens
- Rate limiting for login attempts
- HTTP-only cookies for refresh tokens
- Helmet for security headers
- CORS configuration

## Development Features

- Verbose console logging throughout the application:
  - Server initialization and configuration steps
  - Database connection status and details
  - Authentication flow tracking (register, login, token refresh)
  - Route registration and middleware execution
  - Detailed error information with stack traces in development mode
- Nodemon for automatic server restart during development
- Environment-specific behavior (different error responses in dev vs. production)

## Console Logging

The server includes extensive console logging to help with debugging:

- **Green checkmarks (✅)** indicate successful operations
- **Red X marks (❌)** indicate errors or failures
- Each major component logs its initialization and operation
- Authentication flows are fully logged (excluding sensitive data)
- Database operations are tracked with success/failure indicators

To see all logs, run the server with:

```
npm run dev
```

## Testing the API

You can test the API endpoints using tools like Postman or Insomnia:

1. Register a new user:

   ```
   POST http://localhost:5000/api/auth/register
   Content-Type: application/json

   {
     "username": "testuser",
     "email": "test@example.com",
     "password": "password123",
     "farmName": "Test Farm"
   }
   ```

2. Login with the registered user:

   ```
   POST http://localhost:5000/api/auth/login
   Content-Type: application/json

   {
     "email": "test@example.com",
     "password": "password123"
   }
   ```

3. Access protected route with the received token:
   ```
   GET http://localhost:5000/api/auth/me
   Authorization: Bearer <your_access_token>
   ```

## Frontend Integration Notes

When integrating with the frontend:

1. The authentication endpoints return an `accessToken` (not `token`)
2. The user object is directly in the response (not nested under a `data` property)
3. All authentication requests should include the token in the Authorization header as `Bearer <token>`
4. For protected routes, ensure the token is included in every request

## Deployment

For production deployment:

1. Update the `.env` file with production values:

   ```
   NODE_ENV=production
   MONGO_URI=<your-mongodb-atlas-uri>
   CLIENT_URL=<your-frontend-url>
   ```

2. Start the server with:
   ```
   npm start
   ```

## Future Endpoints (Planned)

- Animal management endpoints
- Inventory management endpoints
- Farm statistics endpoints

## Troubleshooting

If you encounter connection issues:

1. Ensure MongoDB is running locally
2. Check that the MONGO_URI in .env is correct
3. Verify that the PORT is not in use by another application
4. Check the console logs for detailed error information

## Recent Updates

- Added detailed API response format documentation
- Updated authentication endpoints to return consistent response structure
- Enhanced error handling and logging
- Added farmName field to user registration
