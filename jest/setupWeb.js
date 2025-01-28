import '@testing-library/jest-dom';
import { configure } from '@testing-library/react';
import { TextEncoder, TextDecoder } from 'util';

// Configure testing library
configure({
  testIdAttribute: 'data-testid',
  asyncUtilTimeout: 5000,
});

// Mock text encoder/decoder
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;

// Mock IntersectionObserver
class MockIntersectionObserver {
  constructor(callback) {
    this.callback = callback;
  }
  observe() {}
  unobserve() {}
  disconnect() {}
}
global.IntersectionObserver = MockIntersectionObserver;

// Mock ResizeObserver
class MockResizeObserver {
  constructor(callback) {
    this.callback = callback;
  }
  observe() {}
  unobserve() {}
  disconnect() {}
}
global.ResizeObserver = MockResizeObserver;

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

// Mock window.scrollTo
window.scrollTo = jest.fn();

// Mock window.getComputedStyle
window.getComputedStyle = element => ({
  getPropertyValue: prop => '',
  ...element.style,
});

// Mock window.requestAnimationFrame
window.requestAnimationFrame = callback => setTimeout(callback, 0);
window.cancelAnimationFrame = id => clearTimeout(id);

// Mock window.fetch
window.fetch = jest.fn();

// Mock window.localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};
Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

// Mock window.sessionStorage
const sessionStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};
Object.defineProperty(window, 'sessionStorage', {
  value: sessionStorageMock,
});

// Mock window.URL.createObjectURL
window.URL.createObjectURL = jest.fn();
window.URL.revokeObjectURL = jest.fn();

// Mock window.Blob
window.Blob = class Blob {
  constructor(content, options = {}) {
    this.content = content;
    this.options = options;
    this.size = content.reduce((acc, curr) => acc + curr.length, 0);
    this.type = options.type || '';
  }
};

// Mock window.File
window.File = class File extends Blob {
  constructor(content, filename, options = {}) {
    super(content, options);
    this.name = filename;
    this.lastModified = options.lastModified || Date.now();
  }
};

// Mock window.FileReader
window.FileReader = class FileReader {
  constructor() {
    this.EMPTY = 0;
    this.LOADING = 1;
    this.DONE = 2;
    this.readyState = this.EMPTY;
    this.result = null;
    this.error = null;
    this.onload = null;
    this.onloadend = null;
    this.onerror = null;
  }

  readAsDataURL() {
    this.readyState = this.LOADING;
    Promise.resolve().then(() => {
      this.readyState = this.DONE;
      this.result = 'data:image/jpeg;base64,mock';
      if (this.onload) this.onload();
      if (this.onloadend) this.onloadend();
    });
  }

  readAsText() {
    this.readyState = this.LOADING;
    Promise.resolve().then(() => {
      this.readyState = this.DONE;
      this.result = 'mock text content';
      if (this.onload) this.onload();
      if (this.onloadend) this.onloadend();
    });
  }

  abort() {
    this.readyState = this.DONE;
    if (this.onloadend) this.onloadend();
  }
};

// Mock window.MutationObserver
class MockMutationObserver {
  constructor(callback) {
    this.callback = callback;
    this.observations = [];
  }
  observe(element, options) {
    this.observations.push({ element, options });
  }
  unobserve(element) {
    this.observations = this.observations.filter(obs => obs.element !== element);
  }
  disconnect() {
    this.observations = [];
  }
  trigger(mutations) {
    this.callback(mutations, this);
  }
}
global.MutationObserver = MockMutationObserver;
