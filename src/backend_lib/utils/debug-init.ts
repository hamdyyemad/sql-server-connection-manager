// Backend debug initializer - import this to activate console override
// This file ensures the console methods are overridden when imported

import './debug';

// Export a function to check if debug is initialized
export const isDebugInitialized = (): boolean => {
  return process.env.DEBUG !== undefined;
};

// Export original console methods for cases where you need them
export { originalConsoleMethods } from './debug';
