FarmTastic Session Starter

## Critical Fixes Needed

1. **Currency Update Bug**: When purchasing animals or inventory items, the user's currency is not being permanently updated in the database. We need to:
   - Check the animal creation endpoint to ensure it updates and saves the user's currency
   - Check the inventory purchase endpoint for the same issue
   - Verify that the transaction is being properly recorded
   - Add proper error handling to roll back changes if part of the transaction fails
     Current Status (Last Updated: [Current Date])
     We've successfully implemented the Market page with animal and inventory purchasing functionality. We fixed an issue with the token refresh mechanism and updated JWT expiration times for better user experience. The pet naming modal now works correctly, allowing users to name their pets (dogs and cats) during purchase.
     Last Session Accomplishments
     Fixed the animal purchase functionality in the Market component
     Added proper category handling for animals (pet vs. livestock)
     Implemented a pet naming modal for dogs and cats
     Fixed token refresh mechanism in the API service
     Updated JWT expiration times (1h for access token, 3d for refresh token)
     Updated project documentation and server README
     Current Project Structure

FarmTastic/
├── src/
│ ├── components/
│ │ ├── AssetCard/
│ │ ├── AssetList/
│ │ ├── FarmHeader/
│ │ ├── MarketButton/
│ │ └── ProtectedRoute/
│ ├── context/
│ │ └── AuthContext.jsx
│ ├── pages/
│ │ ├── Dashboard/
│ │ ├── Login/
│ │ ├── Market/
│ │ ├── Register/
│ │ └── SplashScreen/
│ ├── services/
│ │ ├── api.js
│ │ ├── animalService.js
│ │ └── inventoryService.js
│ ├── App.jsx
│ └── main.jsx
├── server/
├── models/
│ ├── userModel.js
│ ├── animalModel.js
│ ├── inventoryModel.js
│ └── transactionModel.js
└── controllers/
├── authController.js
├── animalController.js
└── inventoryController.js

        Key Files We're Working With

src/pages/Market/Market.jsx - Market page with animal and inventory purchasing
src/services/api.js - API service with token refresh mechanism
src/services/animalService.js - Animal service for creating and managing animals
src/services/inventoryService.js - Inventory service for buying and managing inventory
server/models/animalModel.js - Animal model with category enum (pet vs. livestock)
Next Tasks
Our next focus will be on implementing the Animal Care page, which will allow users to:
View detailed information about their animals
Feed and water their animals
Call the vet for their animals
Track animal health over time
Planned Components to Create
src/pages/AnimalDetail/AnimalDetail.jsx - Page for viewing and caring for a specific animal
src/pages/AnimalDetail/AnimalDetail.css - Styling for the animal detail page
src/components/CareAction/CareAction.jsx - Reusable component for care actions (feed, water, vet)
src/components/HealthIndicator/HealthIndicator.jsx - Visual indicator of animal health
API Endpoints We'll Use
GET /api/animals/:id - Get a specific animal
POST /api/animals/:id/feed - Feed an animal
POST /api/animals/:id/water - Water an animal
POST /api/animals/:id/vet - Call vet for an animal
GET /api/inventory - Get inventory items to use on animals
Potential Challenges
Real-time health calculation based on timestamps
Connecting inventory items to specific animal types
Updating the UI after care actions
Handling different care requirements for different animal types
Questions to Address
How should we calculate health decay over time?
Should different animal types have different care requirements?
How should we handle inventory usage on animals?
What visual indicators should we use for animal health?
Reminder of Model Structures
Animal Model
{
userId: ObjectId, // Reference to User model
name: String, // Required for pets, optional for livestock
type: String, // Required, enum: ["dog", "cat", "cow", "pig", "chicken", "horse", "sheep", "goat"]
category: String, // Required, enum: ["pet", "livestock"]
quantity: Number, // Default: 1, min: 1
health: Number, // Default: 100, min: 0, max: 100
value: Number, // Required, min: 0
birthDate: Date, // Default: Date.now
lastFed: Date, // Default: Date.now
lastWatered: Date, // Default: Date.now
lastCaredAt: Date, // Default: Date.now
createdAt: Date, // Default: Date.now
imageUrl: String // URL to animal image
}

Inventory Model
{
userId: ObjectId, // Reference to User model
type: String, // Required, enum: ["dogFood", "catFood", "livestockFeed", "water", "medicine", "treats"]
name: String, // Required
quantity: Number, // Required, min: 0, default: 0
unit: String, // Required, enum: ["lbs", "gallons", "units"], default: "units"
price: Number, // Required, min: 0
imageUrl: String, // URL to inventory image
affectsAnimalTypes: [String], // Array of animal types this item can be used on
healthEffect: Number, // Health points added when used
}
