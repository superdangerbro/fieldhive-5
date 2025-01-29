# FieldHive

Field equipment management app for pest control companies.

## Firebase Setup

### Prerequisites

1. Node.js (>= 18)
2. npm (>= 9)
3. Firebase CLI (`npm install -g firebase-tools`)
4. A Google account with Firebase access

### Initial Setup

1. Install dependencies:
```bash
npm install
```

2. Login to Firebase:
```bash
npm run firebase:login
```

3. Select the project:
```bash
npm run firebase:use
```

4. Initialize local configuration:
```bash
firebase init
```

### Local Development

1. Start the development environment (includes emulators):
```bash
npm run dev
```

2. Start only the emulators:
```bash
npm run emulators
```

3. Export emulator data:
```bash
npm run emulators:export
```

4. Start emulators with imported data:
```bash
npm run emulators:import
```

### Testing

1. Run all tests:
```bash
npm test
```

2. Run tests in watch mode:
```bash
npm run test:watch
```

3. Generate coverage report:
```bash
npm run test:coverage
```

### Deployment

1. Deploy everything:
```bash
npm run deploy
```

2. Deploy specific services:
```bash
npm run deploy:functions   # Deploy Cloud Functions
npm run deploy:hosting    # Deploy web hosting
npm run deploy:firestore  # Deploy Firestore rules and indexes
npm run deploy:storage    # Deploy Storage rules
```

## Project Structure

```
fieldhive-app/
├── functions/           # Firebase Cloud Functions
│   ├── src/            # TypeScript source files
│   │   ├── index.ts    # Functions entry point
│   │   └── types.ts    # TypeScript type definitions
│   └── package.json    # Functions dependencies
├── mobile/             # React Native mobile app
├── web/               # React web app
├── shared/            # Shared code between mobile and web
├── firestore.rules    # Firestore security rules
├── firestore.indexes.json  # Firestore indexes
├── storage.rules      # Storage security rules
├── firebase.json      # Firebase configuration
└── package.json       # Root package.json
```

## Firebase Services Used

1. **Firestore**
   - Document database for storing equipment, inspections, and work orders
   - Security rules in `firestore.rules`
   - Indexes in `firestore.indexes.json`

2. **Cloud Functions**
   - Backend logic for data processing and automation
   - Written in TypeScript
   - Located in `functions/` directory

3. **Hosting**
   - Hosts the web application
   - Configuration in `firebase.json`

4. **Storage**
   - Stores inspection photos and other files
   - Security rules in `storage.rules`

## Security Rules

### Firestore Rules
- User authentication required for all operations
- Role-based access control (admin, technician, client)
- Document-level security for sensitive data

### Storage Rules
- Authentication required for all operations
- File size limits (10MB per file)
- File type restrictions (images only)
- Role-based access for uploads and deletions

## Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
# Firebase Configuration
FIREBASE_PROJECT_ID=fieldhive-5-0
FIREBASE_API_KEY=your-api-key
FIREBASE_AUTH_DOMAIN=your-auth-domain
FIREBASE_STORAGE_BUCKET=your-storage-bucket

# Development
NODE_ENV=development
```

## Common Issues

1. **Deployment Failures**
   - Ensure you're logged in (`npm run firebase:login`)
   - Check project selection (`npm run firebase:use`)
   - Verify build process (`npm run build`)

2. **Emulator Issues**
   - Clear emulator data: Delete the `emulator-data` directory
   - Check port conflicts in `firebase.json`
   - Ensure Java is installed for Firestore emulator

3. **Function Deployment Errors**
   - Run `npm run lint` in functions directory
   - Check TypeScript compilation (`npm run build:functions`)
   - Verify Node.js version matches `engines` in `package.json`

## Contributing

1. Create a feature branch
2. Make changes
3. Run tests (`npm test`)
4. Run linting (`npm run lint`)
5. Submit pull request

## License

UNLICENSED - All rights reserved
