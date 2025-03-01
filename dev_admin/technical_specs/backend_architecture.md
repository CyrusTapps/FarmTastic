# Backend Architecture

## Structure

server/
├── config/ # Configuration files
│ ├── db.js # Database connection
│ └── .env # Environment variables
├── controllers/ # Request handlers
│ ├── authController.js
│ ├── animalController.js
│ ├── inventoryController.js
│ └── transactionController.js
├── middleware/ # Express middleware
│ ├── authMiddleware.js
│ ├── rateLimitMiddleware.js
│ └── errorMiddleware.js
├── models/ # Mongoose models
│ ├── userModel.js
│ ├── animalModel.js
│ ├── inventoryModel.js
│ └── transactionModel.js
├── routes/ # API routes
│ ├── authRoutes.js
│ ├── animalRoutes.js
│ ├── inventoryRoutes.js
│ └── transactionRoutes.js
├── utils/ # Helper functions
│ ├── jwtUtils.js
│ └── errorUtils.js
└── server.js # Main application entry point

## Key Components

### Models

1. **User Model**

   - Fields: username, email, password (hashed), currency, farmName
   - Features: Password hashing, case-insensitive email

2. **Animal Model**

   - Fields: type, name, health, lastFed, lastWatered, lastVetVisit, owner
   - Features: Health calculation, timestamps for care actions

3. **Inventory Model**

   - Fields: type, quantity, owner
   - Features: Quantity tracking, automatic deletion when quantity reaches zero

4. **Transaction Model**
   - Fields: type, amount, itemId, itemType, itemName, quantity, description, owner, timestamp
   - Features: Records all purchases, sales, and usage actions
   - Types: buy, sell, vet, use

### Controllers

1. **Auth Controller**

   - Endpoints: register, login, logout, refresh token, get current user
   - Features: JWT generation, password verification

2. **Animal Controller**

   - Endpoints: CRUD operations, feeding, watering, vet care, selling
   - Features: Health updates, owner verification

3. **Inventory Controller**

   - Endpoints: CRUD operations, buying, selling, using
   - Features: Quantity updates, owner verification

4. **Transaction Controller**
   - Endpoints: Get transactions, get transaction by ID, filter transactions
   - Features: Transaction history, filtering by type

### Middleware

1. **Auth Middleware**

   - Purpose: Protect routes from unauthorized access
   - Features: Token verification, role checking

2. **Rate Limit Middleware**

   - Purpose: Prevent abuse
   - Features: Configurable limits per endpoint

3. **Error Middleware**
   - Purpose: Centralized error handling
   - Features: Appropriate error responses, logging

## API Endpoints

### Authentication

- POST /api/auth/register - Create new user
- POST /api/auth/login - Authenticate user
- POST /api/auth/logout - End user session
- POST /api/auth/refresh-token - Get new access token
- GET /api/auth/me - Get current user data

### Animals

- GET /api/animals - Get all user's animals
- GET /api/animals/:id - Get specific animal
- POST /api/animals - Create new animal
- POST /api/animals/:id/feed - Feed animal
- POST /api/animals/:id/water - Water animal
- POST /api/animals/:id/vet - Call vet for animal
- POST /api/animals/:id/sell - Sell animal

### Inventory

- GET /api/inventory - Get all user's inventory
- GET /api/inventory/:id - Get specific inventory item
- POST /api/inventory - Buy inventory item
- POST /api/inventory/:id/sell - Sell inventory item

### Transactions

- GET /api/transactions - Get all user's transactions
- GET /api/transactions/:id - Get specific transaction
- GET /api/transactions?type=buy - Filter transactions by type
- GET /api/transactions?itemType=animal - Filter transactions by item type

## Data Flow

1. Client makes request to API endpoint
2. Middleware validates request (auth, rate limiting)
3. Controller processes request
4. Model interacts with database
5. Controller formats response
6. Response sent back to client

## Security Measures

1. Password hashing with bcrypt
2. JWT tokens with short expiration
3. Refresh token rotation
4. Rate limiting
5. Input validation
6. Owner verification for all resources

## Mobile Support

### CORS Configuration

- Configured to accept requests from both web and mobile clients
- Development: Allows localhost and Android emulator origins
- Production: Restricts to specific domains and app origins

### API Optimization

- Response size optimization for mobile data usage
- Efficient data structures to minimize payload size
- Future consideration: Compression for mobile requests

### Authentication Considerations

- Token-based authentication works seamlessly across platforms
- HTTP-only cookies for web client
- Token storage strategy for mobile client
