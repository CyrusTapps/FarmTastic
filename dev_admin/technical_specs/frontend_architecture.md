# Frontend Architecture

## Structure

src/
├── assets/ # Images, icons, and other static files
├── components/ # Reusable UI components
│ ├── AssetCard/
│ ├── AssetList/
│ ├── FarmHeader/
│ ├── LoadingSpinner/
│ ├── ProtectedRoute/
│ └── TransactionList/
├── context/ # React context providers
│ ├── AuthContext.jsx
│ └── RefreshContext.jsx
├── pages/ # Route components
│ ├── AnimalDetail/
│ ├── Dashboard/
│ ├── Login/
│ ├── Market/
│ ├── Register/
│ ├── SplashScreen/
│ └── Transactions/
├── services/ # API service modules
│ ├── api.js
│ ├── animalService.js
│ ├── inventoryService.js
│ └── transactionService.js
├── App.css
├── App.jsx # Main application component
├── main.css # Global styles
└── main.jsx # Application entry point

## Key Components

### Core Components

1. **SplashScreen**

   - Location: `src/pages/SplashScreen/`
   - Purpose: Initial loading and server verification
   - Features: 5-second display, farm-themed background, loading animation

2. **ProtectedRoute**

   - Location: `src/components/ProtectedRoute/`
   - Purpose: Authentication checking for private routes
   - Features: Redirects unauthenticated users to login

3. **AssetCard**

   - Location: `src/components/AssetCard/`
   - Purpose: Displays individual animals or inventory items
   - Features: Shows health for animals, quantity for inventory

4. **AssetList**

   - Location: `src/components/AssetList/`
   - Purpose: Displays multiple assets in a grid
   - Features: Responsive layout, section title

5. **FarmHeader**

   - Location: `src/components/FarmHeader/`
   - Purpose: Top navigation bar
   - Features: Farm name, currency display, logout button

6. **TransactionList**
   - Location: `src/components/TransactionList/`
   - Purpose: Displays transaction history
   - Features: Filtering, date formatting, transaction type labeling

### Context Providers

1. **AuthContext**

   - Location: `src/context/AuthContext.jsx`
   - Purpose: Authentication state management
   - Features: Login/register/logout functions, token refresh

2. **RefreshContext**
   - Location: `src/context/RefreshContext.jsx`
   - Purpose: Manage data refresh triggers
   - Features: Provides a way to trigger data refreshes after actions

### Pages

1. **Login/Register**

   - Location: `src/pages/Login/` and `src/pages/Register/`
   - Purpose: User authentication
   - Features: Form validation, error handling

2. **Dashboard**

   - Location: `src/pages/Dashboard/`
   - Purpose: Main user interface
   - Features: Asset lists, welcome message, farm header

3. **Market**

   - Location: `src/pages/Market/`
   - Purpose: Buy/sell animals and supplies
   - Features: Category tabs, purchase functionality, pet naming

4. **AnimalDetail**

   - Location: `src/pages/AnimalDetail/`
   - Purpose: Animal care interface
   - Features: Feeding, watering, vet care, selling

5. **Transactions**
   - Location: `src/pages/Transactions/`
   - Purpose: Transaction history interface
   - Features: Filtering by type, comprehensive transaction display

## Services

1. **api.js**

   - Location: `src/services/api.js`
   - Purpose: Base API configuration
   - Features: Axios instance, interceptors, token handling

2. **animalService.js**

   - Location: `src/services/animalService.js`
   - Purpose: Animal-related API calls
   - Features: CRUD operations for animals

3. **inventoryService.js**

   - Location: `src/services/inventoryService.js`
   - Purpose: Inventory-related API calls
   - Features: CRUD operations for inventory

4. **transactionService.js**
   - Location: `src/services/transactionService.js`
   - Purpose: Transaction-related API calls
   - Features: Get transactions, filter transactions

## Data Flow

1. User actions trigger service functions
2. Service functions make API calls
3. API responses update state via React hooks or context
4. State changes trigger UI updates
5. RefreshContext triggers data refreshes after actions

## Optimization Strategies

1. 5-minute polling interval for data refreshes
2. Action-based refreshes via RefreshContext
3. Proper cleanup in useEffect hooks
4. Conditional console logging for development only
