import '@testing-library/jest-dom';
import { mockBarcodeScanner, mockVoiceRecognition, cleanUpTests } from '../shared/schemas/tests/testUtils';

// Mock modules
jest.mock('@react-native-voice/voice', () => mockVoiceRecognition);
jest.mock('expo-barcode-scanner', () => ({
  BarCodeScanner: mockBarcodeScanner,
}));

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};
global.localStorage = localStorageMock;

// Mock fetch
global.fetch = jest.fn();

// Mock FormData
global.FormData = class FormData {
  constructor() {
    this.data = new Map();
  }
  append(key, value) {
    this.data.set(key, value);
  }
  get(key) {
    return this.data.get(key);
  }
  getAll(key) {
    return [this.data.get(key)];
  }
  has(key) {
    return this.data.has(key);
  }
  delete(key) {
    this.data.delete(key);
  }
  entries() {
    return this.data.entries();
  }
  values() {
    return this.data.values();
  }
  keys() {
    return this.data.keys();
  }
};

// Mock URL and URLSearchParams
global.URL = class URL {
  constructor(url) {
    this.href = url;
    this.pathname = url.split('?')[0];
    this.searchParams = new URLSearchParams(url.split('?')[1]);
  }
};

// Mock Headers
global.Headers = class Headers {
  constructor(init = {}) {
    this.headers = new Map();
    if (init) {
      Object.entries(init).forEach(([key, value]) => {
        this.headers.set(key.toLowerCase(), value);
      });
    }
  }
  append(key, value) {
    this.headers.set(key.toLowerCase(), value);
  }
  get(key) {
    return this.headers.get(key.toLowerCase()) || null;
  }
  has(key) {
    return this.headers.has(key.toLowerCase());
  }
  set(key, value) {
    this.headers.set(key.toLowerCase(), value);
  }
  delete(key) {
    this.headers.delete(key.toLowerCase());
  }
};

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

// Mock window.ResizeObserver
global.ResizeObserver = class ResizeObserver {
  constructor(callback) {
    this.callback = callback;
  }
  observe() {}
  unobserve() {}
  disconnect() {}
};

// Mock window.IntersectionObserver
global.IntersectionObserver = class IntersectionObserver {
  constructor(callback) {
    this.callback = callback;
  }
  observe() {}
  unobserve() {}
  disconnect() {}
};

// Mock window.requestAnimationFrame
global.requestAnimationFrame = callback => setTimeout(callback, 0);
global.cancelAnimationFrame = id => clearTimeout(id);

// Mock window.getComputedStyle
global.getComputedStyle = element => ({
  getPropertyValue: prop => '',
  ...element.style,
});

// Custom matchers
expect.extend({
  toMatchFormData(received, expected) {
    const pass = Object.entries(expected).every(
      ([key, value]) => received[key] === value
    );
    return {
      message: () =>
        `expected ${JSON.stringify(received)} to match form data ${JSON.stringify(
          expected
        )}`,
      pass,
    };
  },
});

// Clean up after each test
afterEach(async () => {
  await cleanUpTests();
  jest.clearAllMocks();
  localStorage.clear();
});
