/* eslint-disable @typescript-eslint/no-explicit-any */
// Debug utility that overrides console methods
// to automatically check DEBUG environment variable

const isDebugEnabled = (): boolean => {
  if (typeof process !== "undefined" && process.env) {
    return process.env.DEBUG === "true";
  }
  return false;
};

// Store original console methods
const originalConsole = {
  log: console.log,
  error: console.error,
  warn: console.warn,
  info: console.info,
  debug: console.debug
};

// Override console methods to check debug status
console.log = (...args: unknown[]): void => {
  if (isDebugEnabled()) {
    originalConsole.log('🔍', ...args);
  }
};

console.error = (...args: unknown[]): void => {
  if (isDebugEnabled()) {
    originalConsole.error('❌', ...args);
  }
};

console.warn = (...args: unknown[]): void => {
  if (isDebugEnabled()) {
    originalConsole.warn('⚠️', ...args);
  }
};

console.info = (...args: unknown[]): void => {
  if (isDebugEnabled()) {
    originalConsole.info('ℹ️', ...args);
  }
};

console.debug = (...args: unknown[]): void => {
  if (isDebugEnabled()) {
    originalConsole.debug('🐛', ...args);
  }
};

// Export the original console methods for cases where you need them
export const originalConsoleMethods = originalConsole;
