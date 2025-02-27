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
   JWT_EXPIRE=1h
   REFRESH_TOKEN_SECRET=your_refresh_token_secret_here
   REFRESH_TOKEN_EXPIRE=3d
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

### Animals

- `GET /api/animals` - Get all animals for the current user (protected route)

  - Requires Authorization header with Bearer token
  - Response: Array of animal objects

- `GET /api/animals/:id` - Get a specific animal by ID (protected route)

  - Requires Authorization header with Bearer token
  - Response: Animal object

- `POST /api/animals` - Create a new animal (protected route)

  - Requires Authorization header with Bearer token
  - Request body: `{ type, name, category, price }`
  - Response: `{ success: true, animal: { ... }, user: { ... } }`

- `PUT /api/animals/:id` - Update an animal (protected route)

  - Requires Authorization header with Bearer token
  - Request body: Animal properties to update
  - Response: Updated animal object

- `DELETE /api/animals/:id` - Delete an animal (protected route)

  - Requires Authorization header with Bearer token
  - Response: `{ success: true, message: "Animal deleted" }`

- `POST /api/animals/:id/feed` - Feed an animal (protected route)

  - Requires Authorization header with Bearer token
  - Response: Updated animal object

- `POST /api/animals/:id/water` - Water an animal (protected route)

  - Requires Authorization header with Bearer token
  - Response: Updated animal object

- `POST /api/animals/:id/vet` - Call vet for an animal (protected route)
  - Requires Authorization header with Bearer token
  - Response: Updated animal object

### Inventory

- `GET /api/inventory` - Get all inventory items for the current user (protected route)

  - Requires Authorization header with Bearer token
  - Response: Array of inventory objects

- `GET /api/inventory/:id` - Get a specific inventory item by ID (protected route)

  - Requires Authorization header with Bearer token
  - Response: Inventory object

- `POST /api/inventory/buy` - Buy an inventory item (protected route)

  - Requires Authorization header with Bearer token
  - Request body: `{ type, quantity }`
  - Response: `{ success: true, inventory: { ... }, user: { ... } }`

- `POST /api/inventory/:id/use/:animalId` - Use an inventory item on an animal (protected route)

  - Requires Authorization header with Bearer token
  - Request body: `{ amount }` (optional, defaults to 1)
  - Response: `{ success: true, inventory: { ... }, animal: { ... } }`

- `DELETE /api/inventory/:id` - Delete an inventory item (protected route)
  - Requires Authorization header with Bearer token
  - Response: `{ success: true, message: "Inventory item deleted" }`

### Transactions

- `GET /api/transactions` - Get all transactions for the current user (protected route)

  - Requires Authorization header with Bearer token
  - Response: Array of transaction objects

- `GET /api/transactions/:id` - Get a specific transaction by ID (protected route)
  - Requires Authorization header with Bearer token
  - Response: Transaction object

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
│   └── db.js                  # Database connection configuration
├── controllers/
│   ├── authController.js      # Authentication controller functions
│   ├── animalController.js    # Animal management controller functions
│   └── inventoryController.js # Inventory management controller functions
├── middleware/
│   ├── authMiddleware.js      # JWT authentication middleware
│   └── rateLimitMiddleware.js # Rate limiting middleware
├── models/
│   ├── userModel.js           # User model with schema definition
│   ├── animalModel.js         # Animal model with schema definition
│   ├── inventoryModel.js      # Inventory model with schema definition
│   └── transactionModel.js    # Transaction model with schema definition
├── routes/
│   ├── authRoutes.js          # Authentication routes
│   ├── animalRoutes.js        # Animal management routes
│   └── inventoryRoutes.js     # Inventory management routes
├── utils/
│   └── jwtUtils.js            # JWT token utilities
├── .env                       # Environment variables (create this file)
├── package.json               # Project dependencies and scripts
└── server.js                  # Main server entry point
```

## Models

### User Model

```javascript
{
  username: String,       // Required, unique, 3-20 chars
  email: String,          // Required, unique, valid email format
  password: String,       // Required, min 8 chars, hashed with bcrypt
  farmName: String,       // Default: "{username}'s Farm"
  currency: Number,       // Default: 1000
  role: String,           // "user" or "admin", default: "user"
  lastLogin: Date,        // Default: Date.now
  createdAt: Date,        // Default: Date.now
  updatedAt: Date         // Default: Date.now
}
```

### Animal Model

```javascript
{
  userId: ObjectId,       // Reference to User model
  name: String,           // Required for pets, optional for livestock
  type: String,           // Required, enum: ["dog", "cat", "cow", "pig", "chicken", "horse", "sheep", "goat"]
  category: String,       // Required, enum: ["pet", "livestock"]
  quantity: Number,       // Default: 1, for livestock can be > 1
  health: Number,         // 0-100, default: 100
  lastFed: Date,          // Default: Date.now
  lastWatered: Date,      // Default: Date.now
  lastCaredAt: Date,      // Default: Date.now
  createdAt: Date,        // Default: Date.now
  imageUrl: String        // URL to animal image
}
```

### Inventory Model

```javascript
{
  userId: ObjectId,       // Reference to User model
  type: String,           // Required, enum: ["dogFood", "catFood", "livestockFeed", "water", "medicine", "treats"]
  name: String,           // Required
  quantity: Number,       // Required, min: 0, default: 0
  unit: String,           // Required, enum: ["lbs", "gallons", "units"], default: "units"
  price: Number,          // Required, min: 0
  imageUrl: String,       // URL to inventory image
  affectsAnimalTypes: [String], // Array of animal types this item can be used on
  healthEffect: Number,   // Health points added when used
  createdAt: Date,        // Default: Date.now
  updatedAt: Date         // Default: Date.now
}
```

### Transaction Model

```javascript
{
  userId: ObjectId,       // Reference to User model
  type: String,           // Required, enum: ["buy", "sell", "vet"]
  itemType: String,       // Required, enum: ["animal", "inventory"]
  itemId: ObjectId,       // Reference to either Animal or Inventory
  itemName: String,       // Required
  amount: Number,         // Required
  quantity: Number,       // Default: 1, min: 1
  description: String,    // Optional
  createdAt: Date         // Default: Date.now
}
```

## Security Features

- Password hashing with bcrypt
- JWT authentication with access and refresh tokens
- Rate limiting for login attempts
- HTTP-only cookies for refresh tokens
- Helmet for security headers
- CORS configuration
- Token expiration (1h for access token, 3d for refresh token)

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

4. Create a new animal:

   ```
   POST http://localhost:5000/api/animals
   Authorization: Bearer <your_access_token>
   Content-Type: application/json

   {
     "type": "dog",
     "name": "Buddy",
     "category": "pet",
     "price": 100
   }
   ```

5. Buy an inventory item:

   ```
   POST http://localhost:5000/api/inventory/buy
   Authorization: Bearer <your_access_token>
   Content-Type: application/json

   {
     "type": "dogFood",
     "quantity": 2
   }
   ```

## Frontend Integration Notes

When integrating with the frontend:

1. The authentication endpoints return an `accessToken` (not `token`)
2. The user object is directly in the response (not nested under a `data` property)
3. All authentication requests should include the token in the Authorization header as `Bearer <token>`
4. For protected routes, ensure the token is included in every request
5. When purchasing animals, ensure the correct category is specified:
   - "pet" for dogs and cats
   - "livestock" for cows, pigs, chickens, horses, sheep, and goats

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

## Troubleshooting

If you encounter connection issues:

1. Ensure MongoDB is running locally
2. Check that the MONGO_URI in .env is correct
3. Verify that the PORT is not in use by another application
4. Check the console logs for detailed error information

## Recent Updates

- Added animal management endpoints
- Added inventory management endpoints
- Added transaction model and tracking
- Updated JWT expiration times (1h for access token, 3d for refresh token)
- Enhanced error handling and logging
- Implemented proper category handling for animals (pet vs. livestock)
- Added detailed API response format documentation
