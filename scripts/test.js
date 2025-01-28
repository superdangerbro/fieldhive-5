#!/usr/bin/env node

const { spawn } = require('child_process');
const path = require('path');

// Parse command line arguments
const args = process.argv.slice(2);
const hasWatch = args.includes('--watch');
const hasCoverage = args.includes('--coverage');
const hasUpdateSnapshot = args.includes('--updateSnapshot');
const hasCI = args.includes('--ci');
const hasQuiet = args.includes('--quiet');
const suite = args.find(arg => arg.startsWith('--suite='))?.split('=')[1];

// Build Jest command
const jestArgs = [
  'jest',
  '--config',
  path.resolve(__dirname, '../jest.config.js'),
  '--colors',
  hasWatch && '--watch',
  hasCoverage && '--coverage',
  hasUpdateSnapshot && '--updateSnapshot',
  hasCI && '--ci',
  hasCI && '--runInBand',
  hasQuiet && '--silent',
  suite && `--testNamePattern=${suite}`,
].filter(Boolean);

// Run Jest
const jest = spawn('npx', jestArgs, {
  stdio: 'inherit',
  env: {
    ...process.env,
    NODE_ENV: 'test',
    TZ: 'UTC',
  },
});

// Handle process exit
jest.on('exit', code => {
  if (code !== 0) {
    console.error('Tests failed');
    process.exit(code);
  }
});

// Handle process errors
jest.on('error', error => {
  console.error('Failed to run tests:', error);
  process.exit(1);
});

// Handle process signals
process.on('SIGTERM', () => {
  jest.kill('SIGTERM');
});

process.on('SIGINT', () => {
  jest.kill('SIGINT');
});

// Make script executable
if (require.main === module) {
  const scriptPath = __filename;
  try {
    require('fs').chmodSync(scriptPath, '755');
  } catch (error) {
    console.warn('Failed to make script executable:', error);
  }
}
