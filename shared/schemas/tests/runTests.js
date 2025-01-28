#!/usr/bin/env node
// @ts-nocheck

const { spawnSync } = require('child_process');
const path = require('path');
const fs = require('fs');

// Test suites configuration
const testSuites = {
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

// Test run configuration
const config = {
  bail: true, // Stop on first failure for critical suites
  coverage: true,
  updateSnapshots: process.argv.includes('--updateSnapshot'),
  ci: process.argv.includes('--ci'),
  verbose: !process.argv.includes('--quiet'),
  suite: process.argv.find(arg => arg.startsWith('--suite='))?.split('=')[1],
};

// Colors for console output
const colors = {
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

// Utility functions
function log(message, { color = 'reset', prefix = '' } = {}) {
  if (config.verbose) {
    console.log(`${colors[color]}${prefix}${message}${colors.reset}`);
  }
}

function runTestSuite(suite, pattern) {
  log(`\nRunning ${suite.name}...`, { color: 'cyan', prefix: '► ' });

  const args = [
    'jest',
    pattern,
    '--colors',
    config.coverage && '--coverage',
    config.updateSnapshots && '--updateSnapshot',
    config.ci && '--ci',
    suite.critical && config.bail && '--bail',
    config.verbose && '--verbose',
  ].filter(Boolean);

  const result = spawnSync('npx', args, {
    stdio: 'inherit',
    env: {
      ...process.env,
      NODE_ENV: 'test',
      BABEL_ENV: 'test',
    },
  });

  return {
    name: suite.name,
    success: result.status === 0,
    critical: suite.critical,
  };
}

function generateReport(results) {
  const failedSuites = results.filter(r => !r.success);
  const criticalFailures = failedSuites.filter(r => r.critical);
  const succeeded = results.length - failedSuites.length;

  log('\n═══════════════════════════════════════', { color: 'bright' });
  log(' Test Run Summary', { color: 'bright' });
  log('═══════════════════════════════════════\n', { color: 'bright' });

  results.forEach(result => {
    const color = result.success ? 'green' : 'red';
    const status = result.success ? '✓ PASS' : '✗ FAIL';
    log(`${status} ${result.name}`, { color });
  });

  log('\n═══════════════════════════════════════\n', { color: 'bright' });
  log(`Total Suites: ${results.length}`, { color: 'cyan' });
  log(`Succeeded: ${succeeded}`, { color: 'green' });
  log(`Failed: ${failedSuites.length}`, { color: failedSuites.length ? 'red' : 'green' });
  
  if (criticalFailures.length) {
    log('\n⚠ CRITICAL FAILURES:', { color: 'red' });
    criticalFailures.forEach(failure => {
      log(`  • ${failure.name}`, { color: 'red' });
    });
  }

  return criticalFailures.length === 0;
}

// Main execution
async function main() {
  try {
    // Ensure we're in the right directory
    const projectRoot = path.resolve(__dirname, '../../..');
    process.chdir(projectRoot);

    // Run setup
    log('Setting up test environment...', { color: 'blue' });
    
    // Clear coverage directory
    if (config.coverage) {
      const coverageDir = path.join(projectRoot, 'coverage');
      if (fs.existsSync(coverageDir)) {
        fs.rmSync(coverageDir, { recursive: true, force: true });
      }
    }

    // Run tests
    const results = [];
    
    if (config.suite) {
      // Run specific suite
      const suite = testSuites[config.suite];
      if (!suite) {
        throw new Error(`Unknown test suite: ${config.suite}`);
      }
      results.push(runTestSuite(suite, suite.pattern));
    } else {
      // Run all suites
      for (const [key, suite] of Object.entries(testSuites)) {
        results.push(runTestSuite(suite, suite.pattern));
      }
    }

    // Generate report
    const success = generateReport(results);

    // Exit with appropriate code
    process.exit(success ? 0 : 1);
  } catch (error) {
    log('\n⚠ Error running tests:', { color: 'red' });
    log(error.stack || error.message, { color: 'red' });
    process.exit(1);
  }
}

// Run script
if (require.main === module) {
  main().catch(error => {
    console.error(error);
    process.exit(1);
  });
}

module.exports = {
  testSuites,
  runTestSuite,
  generateReport,
};
