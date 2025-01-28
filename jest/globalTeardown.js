// Clean up global test environment
module.exports = async () => {
  // Restore console methods
  console.error = global.console.error;
  
  // Restore timers
  jest.useRealTimers();

  // Restore Math
  global.Math = Object.create(Math);

  // Restore crypto
  delete global.crypto;

  // Restore performance
  delete global.performance;

  // Clean up window properties
  delete global.innerWidth;
  delete global.innerHeight;

  // Clean up navigator
  delete global.navigator;

  // Clean up environment variables
  delete process.env.NODE_ENV;
  delete process.env.TZ;

  // Clean up any remaining test artifacts
  if (global.gc) {
    global.gc();
  }

  // Wait for any pending timers or promises
  await new Promise(resolve => setImmediate(resolve));
  await new Promise(resolve => setTimeout(resolve, 0));

  // Ensure all handles are closed
  if (process.removeAllListeners) {
    process.removeAllListeners();
  }
};
