# FieldHive

Field equipment management app for pest control companies.

## Development vs Production Configuration

This application can run in two modes:
1. Local Development (using Firebase Emulators)
2. Production (using Firebase Cloud Services)

### Environment Variables

Create a `.env` file in the root directory with the following variables:

```bash
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_API_KEY=your-api-key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
NEXT_PUBLIC_FIREBASE_APP_ID=your-app-id
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=your-measurement-id

# Development Mode Toggle
NEXT_PUBLIC_USE_EMULATOR=true  # Set to 'false' for production

# Local Development Port
NEXT_PUBLIC_PORT=3001

# Emulator Configuration (used when NEXT_PUBLIC_USE_EMULATOR=true)
NEXT_PUBLIC_FIRESTORE_EMULATOR_HOST=localhost
NEXT_PUBLIC_FIRESTORE_EMULATOR_PORT=8080
NEXT_PUBLIC_AUTH_EMULATOR_HOST=localhost
NEXT_PUBLIC_AUTH_EMULATOR_PORT=9099
NEXT_PUBLIC_FUNCTIONS_EMULATOR_HOST=localhost
NEXT_PUBLIC_FUNCTIONS_EMULATOR_PORT=5001

# Mapbox Configuration
NEXT_PUBLIC_MAPBOX_TOKEN=your-mapbox-token
```

### Local Development Setup

1. Install dependencies:
   ```bash
   pnpm install
   ```

2. Ensure your `.env` file has:
   ```bash
   NEXT_PUBLIC_USE_EMULATOR=true
   ```

3. Start the development environment:
   ```bash
   pnpm dev
   ```

   This command runs:
   - Next.js development server
   - Firebase Functions in watch mode
   - Firebase Emulators

4. Access the development environment:
   - Web App: http://localhost:3001
   - Firebase Emulator UI: http://localhost:4000

### Production Setup

1. Update `.env` file:
   ```bash
   NEXT_PUBLIC_USE_EMULATOR=false
   ```

2. Add your Firebase credentials:
   - Go to [Firebase Console](https://console.firebase.google.com)
   - Select your project
   - Click ⚙️ (Project Settings)
   - Under "Your apps", find or create a web app
   - Copy the configuration values to your `.env` file

3. Deploy to Firebase:
   ```bash
   # Deploy everything
   pnpm run deploy

   # Or deploy specific services
   pnpm run deploy:functions  # Deploy only Cloud Functions
   pnpm run deploy:hosting   # Deploy only web app
   pnpm run deploy:firestore # Deploy only Firestore rules
   pnpm run deploy:storage   # Deploy only Storage rules
   ```

### Firebase Service Account

For admin operations (like database initialization), a service account key is required:

1. Get the service account key:
   - Go to Firebase Console > Project Settings > Service Accounts
   - Click "Generate New Private Key"
   - Save as `config/serviceAccountKey.json`

2. Initialize the database:
   ```bash
   # For production
   pnpm run firebase:init-db

   # For local development
   pnpm run firebase:init-db:emulator
   ```

Note: The service account key is gitignored and should never be committed.

### Architecture Overview

The application uses different Firebase initialization based on the environment:

1. Web App (`web/src/lib/firebase.ts`):
   - Initializes Firebase with client credentials
   - Automatically connects to emulators when NEXT_PUBLIC_USE_EMULATOR=true

2. Cloud Functions (`functions/src/index.ts`):
   - Uses admin SDK for Firebase operations
   - Connects to emulators when FUNCTIONS_EMULATOR=true

3. Database Initialization (`scripts/init-db.js`):
   - Uses service account for admin operations
   - Respects emulator configuration when specified

### Common Issues

1. **Firebase Connection Issues**
   - Verify NEXT_PUBLIC_USE_EMULATOR is set correctly
   - Check emulator ports match your .env configuration
   - Ensure Firebase credentials are correct for production

2. **Function Deployment Failures**
   - Verify you're logged in: `pnpm run firebase:login`
   - Check function logs: `pnpm run firebase:logs`

3. **Emulator Data Persistence**
   - Export data: `pnpm run emulators:export`
   - Import data: `pnpm run emulators:import`

### Additional Resources

- [Firebase Documentation](https://firebase.google.com/docs)
- [Next.js Documentation](https://nextjs.org/docs)
- [Firebase Emulator Suite](https://firebase.google.com/docs/emulator-suite)
