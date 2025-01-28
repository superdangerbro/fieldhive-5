import { NativeModules } from 'react-native';
import mockAsyncStorage from '@react-native-async-storage/async-storage/jest/async-storage-mock';
import mockRNDeviceInfo from 'react-native-device-info/jest/react-native-device-info-mock';

// Mock AsyncStorage
jest.mock('@react-native-async-storage/async-storage', () => mockAsyncStorage);

// Mock Device Info
jest.mock('react-native-device-info', () => mockRNDeviceInfo);

// Mock Reanimated
jest.mock('react-native-reanimated', () => ({
  useAnimatedStyle: () => ({}),
  useSharedValue: jest.fn(),
  withTiming: jest.fn(),
  withSpring: jest.fn(),
  withRepeat: jest.fn(),
  withSequence: jest.fn(),
  withDelay: jest.fn(),
  createAnimatedComponent: (component) => component,
  View: 'View',
  Text: 'Text',
  Image: 'Image',
  ScrollView: 'ScrollView',
  default: {
    View: 'View',
    Text: 'Text',
    Image: 'Image',
    ScrollView: 'ScrollView',
  },
}));

// Mock Expo modules
jest.mock('expo-barcode-scanner', () => ({
  BarCodeScanner: {
    Constants: {
      Type: {
        back: 'back',
        front: 'front',
      },
      BarCodeType: {
        qr: 'qr',
        code128: 'code128',
      },
    },
    requestPermissionsAsync: jest.fn().mockResolvedValue({ status: 'granted' }),
  },
}));

jest.mock('expo-location', () => ({
  requestForegroundPermissionsAsync: jest.fn().mockResolvedValue({ status: 'granted' }),
  getCurrentPositionAsync: jest.fn().mockResolvedValue({
    coords: {
      latitude: 37.7749,
      longitude: -122.4194,
      altitude: 0,
      accuracy: 5,
      altitudeAccuracy: 5,
      heading: 0,
      speed: 0,
    },
    timestamp: Date.now(),
  }),
  watchPositionAsync: jest.fn().mockReturnValue({
    remove: jest.fn(),
  }),
}));

jest.mock('expo-speech', () => ({
  speak: jest.fn(),
  stop: jest.fn(),
  isSpeakingAsync: jest.fn().mockResolvedValue(false),
  getAvailableVoicesAsync: jest.fn().mockResolvedValue([]),
}));

// Mock native modules
NativeModules.SettingsManager = {
  settings: {
    AppleLocale: 'en_US',
    AppleLanguages: ['en'],
  },
};

// Mock dimensions
jest.mock('react-native/Libraries/Utilities/Dimensions', () => ({
  get: jest.fn().mockReturnValue({
    width: 375,
    height: 812,
    scale: 3,
    fontScale: 1,
  }),
  addEventListener: jest.fn(),
  removeEventListener: jest.fn(),
}));

// Mock platform
jest.mock('react-native/Libraries/Utilities/Platform', () => ({
  OS: 'ios',
  select: jest.fn(obj => obj.ios),
  Version: 13,
  isPad: false,
  isTVOS: false,
  isTV: false,
  constants: {
    reactNativeVersion: {
      major: 0,
      minor: 73,
      patch: 2,
    },
  },
}));

// Mock alert
jest.mock('react-native/Libraries/Alert/Alert', () => ({
  alert: jest.fn(),
}));

// Mock linking
jest.mock('react-native/Libraries/Linking/Linking', () => ({
  openURL: jest.fn(),
  canOpenURL: jest.fn().mockResolvedValue(true),
  getInitialURL: jest.fn().mockResolvedValue(null),
  addEventListener: jest.fn(),
  removeEventListener: jest.fn(),
}));

// Mock appearance
jest.mock('react-native/Libraries/Utilities/Appearance', () => ({
  getColorScheme: jest.fn().mockReturnValue('light'),
  addChangeListener: jest.fn(),
  removeChangeListener: jest.fn(),
}));

// Mock keyboard
jest.mock('react-native/Libraries/Components/Keyboard/Keyboard', () => ({
  dismiss: jest.fn(),
  addListener: jest.fn(),
  removeListener: jest.fn(),
}));

// Mock animation
jest.mock('react-native/Libraries/Animated/NativeAnimatedHelper');

// Mock permissions
jest.mock('react-native/Libraries/PermissionsAndroid/PermissionsAndroid', () => ({
  PERMISSIONS: {
    CAMERA: 'android.permission.CAMERA',
    ACCESS_FINE_LOCATION: 'android.permission.ACCESS_FINE_LOCATION',
  },
  RESULTS: {
    GRANTED: 'granted',
    DENIED: 'denied',
    NEVER_ASK_AGAIN: 'never_ask_again',
  },
  check: jest.fn().mockResolvedValue(true),
  request: jest.fn().mockResolvedValue('granted'),
}));
