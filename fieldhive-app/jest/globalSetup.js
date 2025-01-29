// Set up global test environment
module.exports = async () => {
  // Set test environment variables
  process.env.NODE_ENV = 'test';
  process.env.TZ = 'UTC';

  // Mock console methods to catch errors
  const originalConsoleError = console.error;
  console.error = (...args) => {
    // Fail tests on prop type errors
    if (args[0]?.includes?.('Warning: Failed prop type')) {
      throw new Error(args[0]);
    }
    originalConsoleError.apply(console, args);
  };

  // Mock timers
  jest.useFakeTimers();
  jest.setSystemTime(new Date('2025-01-28T00:00:00.000Z'));

  // Mock random values for consistent tests
  const mockMath = Object.create(global.Math);
  mockMath.random = () => 0.5;
  global.Math = mockMath;

  // Mock crypto for consistent UUIDs
  global.crypto = {
    getRandomValues: (arr) => {
      for (let i = 0; i < arr.length; i++) {
        arr[i] = Math.floor(mockMath.random() * 256);
      }
      return arr;
    },
    subtle: {
      digest: () => Promise.resolve(new ArrayBuffer(32)),
    },
  };

  // Mock performance timing
  if (!global.performance) {
    global.performance = {
      now: () => Date.now(),
      mark: () => {},
      measure: () => {},
      getEntriesByName: () => [],
      clearMarks: () => {},
      clearMeasures: () => {},
    };
  }

  // Mock window dimensions
  global.innerWidth = 1024;
  global.innerHeight = 768;

  // Mock user agent
  global.navigator = {
    userAgent: 'jest-test-environment',
    platform: 'test',
    language: 'en-US',
  };
};
