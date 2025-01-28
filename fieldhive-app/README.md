# FieldHive App

## Project Overview

We are building a field equipment management app for a pest control company. The app will include:

### Technician App:
- View devices on a map.
- Complete dynamic inspection forms.
- Manage work orders.

### Admin Interface:
- Manage roles and permissions.
- Define equipment types and inspection forms.

### Customer Portal:
- View properties and devices.
- Generate reports and service records.

## Technology Stack

- **Frontend**: React Native (mobile) and React.js (web).
- **Backend**: Firebase (Firestore, Auth, Storage).
- **Database**: Firestore for flexible, schema-less data storage.

## Folder Structure

```
fieldhive-app/
├── mobile/                  # React Native app for technicians
│   ├── src/
│   │   ├── components/      # Reusable UI components
│   │   ├── screens/         # App screens (e.g., Map, Inspections)
│   │   ├── services/        # Firebase and API services
│   │   ├── schemas/         # Dynamic schema definitions (e.g., forms, equipment types)
│   │   ├── contexts/        # React contexts for global state (e.g., user, permissions)
│   │   ├── hooks/           # Custom React hooks
│   │   ├── assets/          # Images, icons, fonts
│   │   └── App.js           # Main app entry point
│   ├── App.js               # Root component
│   ├── app.json             # Expo configuration
│   └── package.json         # Dependencies and scripts
│
├── web/                     # React.js app for customers and admins
│   ├── src/
│   │   ├── components/      # Reusable UI components
│   │   ├── pages/           # App pages (e.g., Dashboard, Reports)
│   │   ├── services/        # Firebase and API services
│   │   ├── schemas/         # Dynamic schema definitions
│   │   ├── contexts/        # React contexts for global state
│   │   ├── hooks/           # Custom React hooks
│   │   ├── assets/          # Images, icons, fonts
│   │   └── App.js           # Main app entry point
│   ├── public/              # Static assets (e.g., index.html)
│   ├── package.json         # Dependencies and scripts
│   └── next.config.js       # Next.js configuration (if using Next.js)
│
├── functions/               # Firebase Functions for backend logic
│   ├── src/
│   │   ├── services/        # Firebase services (e.g., Firestore, Auth)
│   │   ├── schemas/         # Schema validation and utilities
│   │   └── index.js         # Firebase Functions entry point
│   ├── .firebaserc          # Firebase project configuration
│   ├── firebase.json        # Firebase deployment settings
│   └── package.json         # Dependencies and scripts
│
├── shared/                  # Shared code between mobile and web
│   ├── schemas/             # Shared schema definitions
│   ├── services/            # Shared Firebase and API services
│   └── utils/               # Shared utilities (e.g., validation, formatting)
│
├── .gitignore               # Files to ignore in Git
└── package.json             # Root dependencies and scripts (if using a monorepo)
```

## Initial Setup Steps

### Set Up Firebase:
1. Create a Firebase project at Firebase Console.
2. Enable Firestore, Authentication, and Storage.
3. Add your Firebase configuration to the app.

### Initialize the Mobile App:
1. Use Expo to create a new React Native app:
   ```
   npx create-expo-app mobile
   ```
2. Install dependencies:
   ```
   cd mobile
   npm install @react-navigation/native @react-navigation/stack react-native-maps firebase
   ```

### Initialize the Web App:
1. Use Next.js to create a new React.js app:
   ```
   npx create-next-app web
   ```
2. Install dependencies:
   ```
   cd web
   npm install firebase react-leaflet leaflet
   ```

### Initialize Firebase Functions:
1. Install the Firebase CLI:
   ```
   npm install -g firebase-tools
   ```
2. Initialize Firebase Functions:
   ```
   firebase init functions
   ```

### Set Up Shared Code:
- Create a shared folder for code reused between mobile and web.
- Use a monorepo tool like Turborepo or Nx to manage shared dependencies.

## Key Files to Create

### Firebase Configuration:
Create a `firebase.js` file in `mobile/src/services/` and `web/src/services/`:

```javascript
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID",
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
```

### Dynamic Form Component:
Create a `DynamicForm.js` file in `mobile/src/components/`:

```javascript
import React from 'react';
import { View, Text, TextInput, Picker } from 'react-native';

const DynamicForm = ({ fields }) => {
  return (
    <View>
      {fields.map((field) => (
        <View key={field.name}>
          <Text>{field.label}</Text>
          {field.type === 'text' && <TextInput placeholder={field.label} />}
          {field.type === 'select' && (
            <Picker>
              {field.options.map((option) => (
                <Picker.Item key={option} label={option} value={option} />
              ))}
            </Picker>
          )}
        </View>
      ))}
    </View>
  );
};

export default DynamicForm;
```

### Role-Based Access Control:
Create a `permissions.js` file in `shared/schemas/`:

```javascript
export const PERMISSIONS = {
  Devices: ['read:devices', 'write:devices', 'delete:devices'],
  Inspections: ['read:inspections', 'write:inspections', 'delete:inspections'],
  WorkOrders: ['read:workOrders', 'write:workOrders', 'delete:workOrders'],
};
```

## Next Steps

### Set Up Git:
1. Initialize a Git repository:
   ```
   git init
   git add .
   git commit -m "Initial commit"
   ```

### Push to GitHub:
1. Create a new repository on GitHub.
2. Push your code:
   ```
   git remote add origin https://github.com/your-username/fieldhive-app.git
   git push -u origin main
   ```

By following these instructions, you will have a solid foundation to build the app efficiently.
