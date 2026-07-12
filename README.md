# VOID AVATAR LOUNGE
*A retro-styled dress-up game built with HTML, CSS, JavaScript, and Firebase*

## Overview

Void Avatar Lounge is a web-based dress-up game featuring a black and red terminal aesthetic inspired by Web 1.0 design. Players can create accounts, collect avatar layers, equip items, and trade with other users in a marketplace.

## Features

- **User Authentication** - Register and login with Firebase Auth
- **Avatar Customization** - Stack PNG/SVG layers to create custom avatars
- **Inventory System** - Collect and manage avatar items
- **Marketplace** - Buy and sell items with other players
- **Layer Engine** - Z-indexed PNG stacking system
- **Retro Terminal UI** - Web 1.0 inspired black and red design

## File Structure

```
/
├── index.html          # Landing page with auth forms
├── avatar.html         # Avatar customization room
├── inventory.html      # Item collection management
├── market.html         # Player-to-player trading
├── css/
│   └── style.css       # Retro terminal styling
├── js/
│   ├── auth.js         # Authentication logic
│   ├── avatar.js       # Avatar rendering system
│   ├── inventory.js    # Inventory management
│   ├── market.js       # Marketplace functionality
│   ├── firebase-init.js # Firebase configuration
│   └── setup-data.js   # Sample data creation
└── assets/
    ├── body/           # Base body layer files
    ├── hair/           # Hair style layers
    ├── eyes/           # Eye layers
    ├── top/            # Clothing tops
    ├── bottom/         # Clothing bottoms
    └── accessories/    # Accessory items
```

## Setup Instructions

### 1. Firebase Configuration

1. Create a new Firebase project at [console.firebase.google.com](https://console.firebase.google.com)
2. Enable Authentication with Email/Password
3. Create a Firestore database
4. Get your Firebase config from Project Settings > General > Your apps
5. Update `js/firebase-init.js` with your config:

```javascript
const firebaseConfig = {
  apiKey: "your-api-key",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "your-app-id"
};
```

### 2. Database Setup

1. Run the sample data setup script:
   - Import `js/setup-data.js` in your browser console
   - Call `setupSampleData()` to populate the items collection

Or manually add items to Firestore in the `items` collection.

### 3. Security Rules

Set up Firestore security rules to protect user data:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can only access their own user doc
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
      
      // Users can only access their own inventory
      match /inventory/{itemId} {
        allow read, write: if request.auth != null && request.auth.uid == userId;
      }
      
      // Users can only access their own equipped items
      match /meta/{docId} {
        allow read, write: if request.auth != null && request.auth.uid == userId;
      }
    }
    
    // All authenticated users can read items
    match /items/{itemId} {
      allow read: if request.auth != null;
      allow write: if false; // Only admins can write items
    }
    
    // All authenticated users can read listings
    match /listings/{listingId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null;
    }
  }
}
```

### 4. Local Development

1. Serve the files with a local web server:
   ```bash
   # Using Python 3
   python -m http.server 8000
   
   # Using Node.js
   npx serve .
   
   # Using PHP
   php -S localhost:8000
   ```

2. Open `http://localhost:8000` in your browser

### 5. Deploy to Firebase Hosting

1. Install Firebase CLI: `npm install -g firebase-tools`
2. Login: `firebase login`
3. Initialize: `firebase init hosting`
4. Deploy: `firebase deploy`

## Sample Items

The application includes sample placeholder SVG files for:

- **Base Body** - Default character shell
- **Eyes** - Default eye configuration  
- **Hair** - Black and red hair styles
- **Tops** - Black tee and red hoodie
- **Bottoms** - Blue jeans and black pants
- **Accessories** - Gold chain and silver ring

## Game Flow

1. **Registration/Login** - Users create accounts and start with 1000 coins
2. **Avatar Room** - View current avatar with stacked layers
3. **Inventory** - See collected items and equip new ones
4. **Market** - Buy/sell items with other players

## Technical Details

### Layer System
- Uses absolute positioning with z-index stacking
- SVG files for scalable placeholder graphics
- Each item can have multiple layers for complex customization

### Data Structure

**Users Collection:**
```javascript
{
  email: "user@example.com",
  coins: 1000,
  createdAt: timestamp
}
```

**Items Collection:**
```javascript
{
  displayName: "Item Name",
  category: "hair|top|bottom|accessory",
  slot: "hair|top|bottom|accessory1|accessory2",
  rarity: "common|uncommon|rare",
  z: 30,
  src: "path/to/layer.svg",
  layers: [{ src: "path/to/layer.svg", z: 30 }]
}
```

**Inventory Subcollection:**
```javascript
{
  acquiredAt: timestamp
}
```

## Customization

### Adding New Items
1. Create SVG files in the appropriate `assets/` folder
2. Add item data to Firestore `items` collection
3. Update `js/setup-data.js` for future setups

### Styling
- Edit `css/style.css` for visual changes
- Uses CSS custom properties for easy color theming
- CRT effect can be toggled with `.crt` body class

### Adding Features
- Layer animations in `js/avatar.js`
- Additional inventory slots in the data structure
- More complex pricing/marketplace features

## Browser Compatibility

- Modern browsers with ES6 module support
- Chrome, Firefox, Safari, Edge (latest versions)
- Requires JavaScript enabled

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is open source and available under the MIT License.

## Credits

Built with Firebase, vanilla JavaScript, and pure CSS. Retro terminal aesthetic inspired by early web design.

---

*Haunt the grid. Stack your layers. Become the dream.*