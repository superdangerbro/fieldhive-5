# FieldHive Mobile App

Mobile application for field equipment management and inspections with voice control and barcode scanning capabilities.

## Features

- 📱 React Native + Expo for cross-platform development
- 🎤 Voice-controlled form filling
- 📸 Barcode scanning for equipment identification
- 🗺️ Equipment location tracking
- 📝 Dynamic inspection forms
- 🔄 Offline data synchronization
- 🎯 Hands-free operation mode

## Prerequisites

- Node.js (v16 or later)
- npm or yarn
- Expo CLI (`npm install -g expo-cli`)
- iOS Simulator (macOS) or Android Emulator
- Physical device with Expo Go app (optional)

## Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm start
```

3. Run on a device or simulator:
- Press `i` for iOS Simulator
- Press `a` for Android Emulator
- Scan QR code with Expo Go app on your device

## Development

### Project Structure

```
fieldhive-app/mobile/
├── assets/              # App icons and images
├── src/
│   ├── components/     # Reusable UI components
│   │   ├── BarcodeScanner/
│   │   ├── DynamicForm/
│   │   └── EquipmentInspection/
│   ├── contexts/       # React Context providers
│   ├── hooks/          # Custom React hooks
│   ├── screens/        # App screens
│   └── utils/          # Utility functions
├── App.js              # App entry point
└── app.json           # Expo configuration
```

### Voice Control Features

The app supports hands-free operation through voice commands:

- "Next" / "Previous" - Navigate form fields
- "Submit" / "Complete" - Submit the current form
- "Cancel" / "Exit" - Cancel the current operation
- "Scan" - Activate barcode scanner
- Natural language input for form fields

### Barcode Scanning

Supports multiple barcode formats:
- QR Code
- Code 128
- Code 39
- EAN-13
- EAN-8

### Dynamic Forms

Forms are schema-driven and support:
- Text input
- Number input
- Boolean toggles
- Date/time selection
- Dropdown lists
- File attachments
- Location data
- Voice input

## Testing

Run tests:
```bash
npm test
```

Run linter:
```bash
npm run lint
```

## Building for Production

1. Configure app.json with your project details

2. Build for iOS:
```bash
expo build:ios
```

3. Build for Android:
```bash
expo build:android
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is proprietary and confidential. All rights reserved.

## Support

For support, please contact the development team or create an issue in the project repository.
