/** @type {import('@jest/types').Config.InitialOptions} */
module.exports = {
  preset: 'jest-expo',
  roots: ['<rootDir>'],
  testMatch: [
    '**/__tests__/**/*.+(ts|tsx|js|jsx)',
    '**/?(*.)+(spec|test).+(ts|tsx|js|jsx)',
  ],
  transform: {
    '^.+\\.(js|jsx)$': 'babel-jest',
    '^.+\\.(ts|tsx)$': [
      'ts-jest',
      {
        tsconfig: 'tsconfig.json',
        babelConfig: true,
        isolatedModules: true,
      },
    ],
  },
  transformIgnorePatterns: [
    'node_modules/(?!((jest-)?react-native|@react-native(-community)?)|expo(nent)?|@expo(nent)?/.*|@expo-google-fonts/.*|react-navigation|@react-navigation/.*|@unimodules/.*|unimodules|sentry-expo|native-base|react-native-svg|@testing-library/react-native)',
  ],
  moduleNameMapper: {
    '^@mobile/(.*)$': '<rootDir>/mobile/src/$1',
    '^@web/(.*)$': '<rootDir>/web/src/$1',
    '^@shared/(.*)$': '<rootDir>/shared/$1',
    '^@schemas/(.*)$': '<rootDir>/shared/schemas/$1',
    '^@services/(.*)$': '<rootDir>/shared/services/$1',
    '^@utils/(.*)$': '<rootDir>/shared/utils/$1',
    '^@tests/(.*)$': '<rootDir>/shared/schemas/tests/$1',
    '\\.(jpg|jpeg|png|gif|webp|svg)$': '<rootDir>/jest/fileMock.js',
    '\\.(css|scss)$': '<rootDir>/jest/styleMock.js',
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  setupFiles: [
    '<rootDir>/jest/globalSetup.js',
  ],
  setupFilesAfterEnv: [
    '<rootDir>/jest/setupTests.js',
    '<rootDir>/jest/setupMobile.js',
    '<rootDir>/jest/setupWeb.js',
  ],
  testEnvironment: 'jsdom',
  globals: {
    'ts-jest': {
      tsconfig: 'tsconfig.json',
      diagnostics: false,
      isolatedModules: true,
    },
  },
  collectCoverageFrom: [
    'mobile/src/**/*.{ts,tsx,js,jsx}',
    'web/src/**/*.{ts,tsx,js,jsx}',
    'shared/**/*.{ts,tsx,js,jsx}',
    '!**/*.d.ts',
    '!**/node_modules/**',
    '!**/vendor/**',
  ],
  coverageReporters: ['json', 'lcov', 'text', 'clover'],
  coverageDirectory: 'coverage',
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80,
    },
  },
  testPathIgnorePatterns: [
    '/node_modules/',
    '/dist/',
    '/build/',
    '/coverage/',
  ],
  watchPlugins: [
    'jest-watch-typeahead/filename',
    'jest-watch-typeahead/testname',
  ],
  reporters: [
    'default',
    [
      'jest-junit',
      {
        outputDirectory: 'coverage/junit',
        outputName: 'junit.xml',
        classNameTemplate: '{classname}',
        titleTemplate: '{title}',
        ancestorSeparator: ' › ',
        usePathForSuiteName: true,
      },
    ],
  ],
  verbose: true,
  testTimeout: 30000,
  maxWorkers: '50%',
  errorOnDeprecated: true,
  clearMocks: true,
  resetMocks: false,
  restoreMocks: false,
  fakeTimers: {
    enableGlobally: true,
    now: new Date('2025-01-28T00:00:00.000Z').getTime(),
  },
};
