// @ts-nocheck
/**
 * Test utilities for mocking barcode scanning and voice recognition
 */

// Mock Barcode Scanner
export const mockBarcodeScanner = {
  scan: jest.fn(),
  onScan: null,
  hasPermission: true,
  requestPermission: jest.fn(() => Promise.resolve(true)),
  simulateScan: function(data) {
    if (this.onScan) {
      this.onScan({ data });
    }
  },
};

// Mock Voice Recognition
export const mockVoiceRecognition = {
  start: jest.fn(() => Promise.resolve()),
  stop: jest.fn(() => Promise.resolve()),
  destroy: jest.fn(() => Promise.resolve()),
  isRecognizing: jest.fn(() => Promise.resolve(false)),
  results: [],
  onResult: null,
  onError: null,
  simulateResult: function(text) {
    this.results.push(text);
    if (this.onResult) {
      this.onResult({ value: [text] });
    }
  },
  simulateError: function(error) {
    if (this.onError) {
      this.onError({ error });
    }
  },
};

// Test Render Helpers
export const renderWithProviders = (ui, {
  initialState = {},
  store = configureStore({ reducer: rootReducer, preloadedState: initialState }),
  ...renderOptions
} = {}) => {
  const Wrapper = ({ children }) => (
    <Provider store={store}>
      <NavigationContainer>
        <SafeAreaProvider>
          {children}
        </SafeAreaProvider>
      </NavigationContainer>
    </Provider>
  );

  return {
    store,
    ...render(ui, { wrapper: Wrapper, ...renderOptions }),
  };
};

// Custom Test Matchers
expect.extend({
  toBeWithinRange(received, floor, ceiling) {
    const pass = received >= floor && received <= ceiling;
    return {
      message: () =>
        `expected ${received} to be within range ${floor} - ${ceiling}`,
      pass,
    };
  },
  toBeValidDate(received) {
    const pass = received instanceof Date && !isNaN(received);
    return {
      message: () =>
        pass
          ? () => `expected ${received} not to be a valid date`
          : () => `expected ${received} to be a valid date`,
      pass,
    };
  },
});

// Mock Firebase
export const mockFirebase = {
  auth: {
    currentUser: {
      uid: 'test-user-id',
      email: 'test@example.com',
    },
    signInWithEmailAndPassword: jest.fn(),
    signOut: jest.fn(),
    onAuthStateChanged: jest.fn(),
  },
  firestore: {
    collection: jest.fn(),
    doc: jest.fn(),
    query: jest.fn(),
    where: jest.fn(),
    orderBy: jest.fn(),
    limit: jest.fn(),
    startAfter: jest.fn(),
    endBefore: jest.fn(),
  },
  storage: {
    ref: jest.fn(),
    uploadBytes: jest.fn(),
    getDownloadURL: jest.fn(),
  },
};

// Mock Async Storage
export const mockAsyncStorage = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
  getAllKeys: jest.fn(),
  multiGet: jest.fn(),
  multiSet: jest.fn(),
  multiRemove: jest.fn(),
};

// Mock Network Info
export const mockNetworkInfo = {
  isConnected: true,
  isInternetReachable: true,
  type: 'wifi',
  details: {
    isConnectionExpensive: false,
    cellularGeneration: '4g',
  },
};

// Mock Location
export const mockLocation = {
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
};

// Test Data Generators
export const generateTestData = {
  equipment: (overrides = {}) => ({
    id: 'TEST-EQUIP-001',
    type: 'trap',
    location: mockLocation,
    lastInspection: new Date(),
    status: 'active',
    ...overrides,
  }),
  inspection: (overrides = {}) => ({
    id: 'TEST-INSP-001',
    equipmentId: 'TEST-EQUIP-001',
    timestamp: new Date(),
    condition: 'good',
    activityFound: false,
    maintenanceNeeded: false,
    notes: '',
    ...overrides,
  }),
  user: (overrides = {}) => ({
    id: 'TEST-USER-001',
    email: 'test@example.com',
    name: 'Test User',
    role: 'technician',
    ...overrides,
  }),
};

// Wait Utilities
export const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export const waitFor = async (callback, { timeout = 1000, interval = 50 } = {}) => {
  const startTime = Date.now();

  while (Date.now() - startTime < timeout) {
    try {
      await callback();
      return;
    } catch (error) {
      await wait(interval);
    }
  }

  throw new Error('Timeout waiting for condition');
};

// Event Simulation
export const simulateEvent = {
  offline: () => window.dispatchEvent(new Event('offline')),
  online: () => window.dispatchEvent(new Event('online')),
  resize: () => window.dispatchEvent(new Event('resize')),
  scroll: () => window.dispatchEvent(new Event('scroll')),
  orientationChange: () => window.dispatchEvent(new Event('orientationchange')),
};

// Clean Up Utility
export const cleanUpTests = async () => {
  // Reset all mocks
  jest.clearAllMocks();
  
  // Reset mock states
  mockBarcodeScanner.onScan = null;
  mockVoiceRecognition.results = [];
  mockVoiceRecognition.onResult = null;
  mockVoiceRecognition.onError = null;

  // Clear storage
  await mockAsyncStorage.clear();

  // Reset network state
  mockNetworkInfo.isConnected = true;
  mockNetworkInfo.isInternetReachable = true;

  // Clear timeouts and intervals
  jest.clearAllTimers();
};
