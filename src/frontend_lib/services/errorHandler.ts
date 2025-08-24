import { AxiosError } from 'axios';

// Error types
export enum ErrorType {
  NETWORK = 'NETWORK',
  AUTHENTICATION = 'AUTHENTICATION',
  AUTHORIZATION = 'AUTHORIZATION',
  NOT_FOUND = 'NOT_FOUND',
  SERVER_ERROR = 'SERVER_ERROR',
  VALIDATION = 'VALIDATION',
  UNKNOWN = 'UNKNOWN'
}

// Error handler interface
export interface ErrorHandler {
  type: ErrorType;
  status?: number;
  message: string;
  action?: () => void;
}

// Error mapping configuration
const ERROR_HANDLERS: Record<number, ErrorHandler> = {
  400: {
    type: ErrorType.VALIDATION,
    status: 400,
    message: 'Bad request - please check your input',
  },
  401: {
    type: ErrorType.AUTHENTICATION,
    status: 401,
    message: 'Unauthorized - please log in again',
    action: () => {
      console.log('🔐 Unauthorized - redirecting to login');
      // TODO: Implement redirect to login
    },
  },
  403: {
    type: ErrorType.AUTHORIZATION,
    status: 403,
    message: 'Forbidden - insufficient permissions',
  },
  404: {
    type: ErrorType.NOT_FOUND,
    status: 404,
    message: 'Resource not found',
  },
  500: {
    type: ErrorType.SERVER_ERROR,
    status: 500,
    message: 'Server error - please try again later',
  },
  502: {
    type: ErrorType.SERVER_ERROR,
    status: 502,
    message: 'Bad gateway - server temporarily unavailable',
  },
  503: {
    type: ErrorType.SERVER_ERROR,
    status: 503,
    message: 'Service unavailable - server is down for maintenance',
  },
  504: {
    type: ErrorType.NETWORK,
    status: 504,
    message: 'Gateway timeout - request took too long',
  },
};

// Network error handler
const NETWORK_ERROR_HANDLER: ErrorHandler = {
  type: ErrorType.NETWORK,
  message: 'Network error - please check your connection',
};

// Unknown error handler
const UNKNOWN_ERROR_HANDLER: ErrorHandler = {
  type: ErrorType.UNKNOWN,
  message: 'An unexpected error occurred',
};

// Main error handler function
export function handleApiError(error: AxiosError): ErrorHandler {
  // Execute action if exists
  const executeAction = (handler: ErrorHandler) => {
    if (handler.action) {
      handler.action();
    }
    return handler;
  };

  if (error.response) {
    // Server responded with error status
    const status = error.response.status;
    const handler = ERROR_HANDLERS[status] || {
      ...UNKNOWN_ERROR_HANDLER,
      status,
      message: `HTTP ${status} Error`,
    };

    // Override message with server response if available
    const data = error.response.data as any;
    if (data?.error || data?.message) {
      handler.message = data.error || data.message;
    }

    return executeAction(handler);
  } else if (error.request) {
    // Network error
    return executeAction(NETWORK_ERROR_HANDLER);
  } else {
    // Other error
    return executeAction(UNKNOWN_ERROR_HANDLER);
  }
}

// Create enhanced error with handler information
export function createEnhancedError(error: AxiosError): Error {
  const handler = handleApiError(error);
  
  const enhancedError = new Error(handler.message);
  (enhancedError as any).type = handler.type;
  (enhancedError as any).status = handler.status;
  (enhancedError as any).originalError = error;
  (enhancedError as any).responseData = error.response?.data;
  (enhancedError as any).isNetworkError = handler.type === ErrorType.NETWORK;
  (enhancedError as any).errorCode = error.code;

  return enhancedError;
}

// Utility function to check if error is of specific type
export function isErrorType(error: any, type: ErrorType): boolean {
  return error?.type === type;
}

// Utility function to get user-friendly error message
export function getUserFriendlyMessage(error: any): string {
  if (error?.message) {
    return error.message;
  }
  
  if (error?.response?.data?.error) {
    return error.response.data.error;
  }
  
  if (error?.response?.data?.message) {
    return error.response.data.message;
  }
  
  return 'An unexpected error occurred';
} 