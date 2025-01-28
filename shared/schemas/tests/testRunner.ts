/**
 * Types for the test runner configuration and utilities
 */

export interface TestSuite {
  /** Display name of the test suite */
  name: string;
  /** Pattern to match test files */
  pattern: string;
  /** Whether failures in this suite should stop the entire test run */
  critical: boolean;
}

export interface TestSuites {
  [key: string]: TestSuite;
}

export interface TestConfig {
  /** Stop on first failure for critical suites */
  bail: boolean;
  /** Generate coverage reports */
  coverage: boolean;
  /** Update snapshot files */
  updateSnapshots: boolean;
  /** Running in CI environment */
  ci: boolean;
  /** Show detailed output */
  verbose: boolean;
  /** Specific suite to run */
  suite?: string;
}

export interface TestResult {
  /** Name of the test suite */
  name: string;
  /** Whether all tests passed */
  success: boolean;
  /** Whether this is a critical suite */
  critical: boolean;
}

export interface ConsoleColors {
  reset: string;
  bright: string;
  dim: string;
  red: string;
  green: string;
  yellow: string;
  blue: string;
  magenta: string;
  cyan: string;
}

export interface LogOptions {
  /** Color to use for the message */
  color?: keyof ConsoleColors;
  /** Prefix to add before the message */
  prefix?: string;
}

export interface TestRunner {
  /**
   * Run a specific test suite
   * @param suite Test suite configuration
   * @param pattern Pattern to match test files
   * @returns Test results
   */
  runTestSuite(suite: TestSuite, pattern: string): TestResult;

  /**
   * Generate a report of test results
   * @param results Array of test results
   * @returns Whether all critical tests passed
   */
  generateReport(results: TestResult[]): boolean;

  /**
   * Log a message with optional color and prefix
   * @param message Message to log
   * @param options Logging options
   */
  log(message: string, options?: LogOptions): void;
}

/**
 * Test suite configuration
 */
export const testSuites: TestSuites = {
  core: {
    name: 'Core Components',
    pattern: '(EquipmentInspection|VoiceFormController|BarcodeScanner)',
    critical: true,
  },
  voice: {
    name: 'Voice Recognition',
    pattern: '(VoiceInput|VoiceAndBarcode|nlpProcessor)',
    critical: true,
  },
  forms: {
    name: 'Dynamic Forms',
    pattern: '(DynamicForm|NativeFormRenderer)',
    critical: true,
  },
  schemas: {
    name: 'Schema Validation',
    pattern: '(schema|validation|conditions)',
    critical: true,
  },
  integration: {
    name: 'Integration Tests',
    pattern: '(TestInspection|equipmentInspection)',
    critical: false,
  },
};

/**
 * Default test configuration
 */
export const defaultConfig: TestConfig = {
  bail: true,
  coverage: true,
  updateSnapshots: false,
  ci: false,
  verbose: true,
};

/**
 * Console colors for output formatting
 */
export const colors: ConsoleColors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  dim: '\x1b[2m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
};

/**
 * Parse command line arguments into test configuration
 * @param argv Command line arguments
 * @returns Test configuration
 */
export function parseArgs(argv: string[]): TestConfig {
  return {
    ...defaultConfig,
    updateSnapshots: argv.includes('--updateSnapshot'),
    ci: argv.includes('--ci'),
    verbose: !argv.includes('--quiet'),
    suite: argv.find(arg => arg.startsWith('--suite='))?.split('=')[1],
  };
}

/**
 * Format test results for display
 * @param results Test results to format
 * @returns Formatted string
 */
export function formatResults(results: TestResult[]): string {
  const failedSuites = results.filter(r => !r.success);
  const criticalFailures = failedSuites.filter(r => r.critical);
  const succeeded = results.length - failedSuites.length;

  return [
    '\n═══════════════════════════════════════',
    ' Test Run Summary',
    '═══════════════════════════════════════\n',
    ...results.map(result => {
      const status = result.success ? '✓ PASS' : '✗ FAIL';
      return `${status} ${result.name}`;
    }),
    '\n═══════════════════════════════════════\n',
    `Total Suites: ${results.length}`,
    `Succeeded: ${succeeded}`,
    `Failed: ${failedSuites.length}`,
    criticalFailures.length ? '\n⚠ CRITICAL FAILURES:' : '',
    ...criticalFailures.map(failure => `  • ${failure.name}`),
  ].join('\n');
}
