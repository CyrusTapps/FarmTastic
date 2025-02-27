# Design System

## Color Palette

The application uses a farm-themed color palette defined as CSS variables in `main.css`:

### Primary Colors (Core Theme)

- 🌿 Green (`#4CAF50`) – Represents nature, grass, and healthy crops.
- 🏡 Brown (`#8D6E63`) – A warm, earthy tone for barns, soil, and wood elements.
- 🌞 Yellow (`#FFD700`) – Bright and cheerful, representing the sun and hay.
- 🐄 Blue (`#4FC3F7`) – A soft sky blue for a fresh, open atmosphere.
- 🍎 Red (`#E57373`) – A fun, energetic color for apples, barns, and accents.

### Secondary Colors (Accents & UI Highlights)

- 🌱 Light Green (`#A5D6A7`) – For secondary elements and highlights.
- 🌾 Beige (`#F5DEB3`) – For backgrounds and neutral areas.
- 🌄 Orange (`#FFA726`) – For call-to-action buttons and important elements.
- 🌊 Light Blue (`#B3E5FC`) – For information and secondary elements.
- 🌸 Pink (`#F8BBD0`) – For special features and feminine elements.

### Utility Colors

- ⚫ Dark Text (`#333333`) – For primary text content.
- ⚪ Light Text (`#FFFFFF`) – For text on dark backgrounds.
- 🔘 Border Gray (`#DDDDDD`) – For subtle borders and dividers.
- 🚫 Error Red (`#D32F2F`) – For error messages and warnings.
- ✅ Success Green (`#388E3C`) – For success messages and confirmations.

## Typography

- Primary Font: System font stack for optimal performance
- Headings: Slightly bolder weight for hierarchy
- Body Text: 16px base size for readability
- Button Text: Bold weight for emphasis

## Component Patterns

### Buttons

- Primary: Orange background with white text
- Secondary: Light green background with dark text
- Danger: Red background with white text
- Disabled: Gray background with light text

### Action Buttons (Animal Detail Page)

- Feed Button: Orange background with white text
- Water Button: Light blue background with dark text
- Medicine Button: Light purple background with dark text
- Treats Button: Light yellow background with dark text
- Vitamins Button: Light yellow background with dark text
- Vet Button: White background with dark text and border
- Sell Button: Red background with white text

### Cards

- White background
- Subtle border radius
- Light shadow for depth
- Consistent padding
- Clear visual hierarchy

### Forms

- Stacked layout (label above input)
- Clear validation states
- Consistent input styling
- Helpful error messages

### Status Indicators

- Health bars with color coding:
  - Green: Good health (70-100%)
  - Yellow: Moderate health (40-69%)
  - Red: Poor health (0-39%)

### Transaction Items

- Light gray background with hover effect
- Date displayed in consistent format
- Transaction type with clear labeling
- Amount with color coding:
  - Green: Positive transactions (sales)
  - Red: Negative transactions (purchases, vet visits)
- Clear visual hierarchy with type, item name, and amount

### Modals

- Food Selection Modal: Grid layout for food items
- Medicine Selection Modal: Grid layout for medicine items
- Confirmation Modal: Clear action buttons with appropriate colors

## Responsive Design

- Mobile-first approach
- Breakpoints:
  - Small: 0-576px
  - Medium: 577px-768px
  - Large: 769px-992px
  - Extra Large: 993px+
- Grid-based layout for consistent spacing
- Flexible components that adapt to container width

## Animation Guidelines

- Subtle transitions for state changes
- Loading animations for async operations
- Feedback animations for user actions
- Performance-focused (avoid heavy animations)

## Accessibility Considerations

- Sufficient color contrast
- Keyboard navigation support
- Screen reader friendly markup
- Focus states for interactive elements
- Alternative text for images

## Feedback Messages

- Success messages: Green background with white text
- Error messages: Red background with white text
- Info messages: Blue background with white text
- Temporary messages: Fade in/out with 2-3 second display time
