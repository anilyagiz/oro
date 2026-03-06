/**
 * Maps Grail API error codes to user-friendly messages.
 *
 * @param code - The error code returned by the Grail API.
 * @returns A user-friendly error message.
 */
export function mapGrailError(code: string): string {
  const errorMap: Record<string, string> = {
    // Authentication & Authorization
    AUTH_FAILED: 'Authentication failed. Please check your credentials.',
    PERMISSION_DENIED: 'You do not have permission to perform this action.',
    UNAUTHORIZED: 'Please connect your wallet to continue.',
    
    // User errors
    USER_NOT_FOUND: 'User not found. Please reconnect your wallet.',
    USER_ALREADY_EXISTS: 'User already exists.',
    INVALID_KYC_HASH: 'Invalid KYC hash provided.',
    
    // Wallet errors
    WALLET_NOT_CONNECTED: 'Please connect your wallet first.',
    WALLET_REJECTED: 'The transaction was rejected by your wallet.',
    WALLET_NOT_FOUND: 'Wallet not found. Please install Phantom or Solflare.',
    SIGNATURE_FAILED: 'Failed to sign the transaction. Please try again.',
    
    // Transaction errors
    TRANSACTION_FAILED: 'Transaction failed. Please try again.',
    TRANSACTION_TIMEOUT: 'The transaction timed out. Please check Solana Explorer for status.',
    TRANSACTION_CANCELLED: 'Transaction was cancelled.',
    INSUFFICIENT_FUNDS: 'You do not have enough funds to complete this transaction.',
    INSUFFICIENT_SOL: 'Not enough SOL for transaction fees. Please add more SOL to your wallet.',
    INSUFFICIENT_USDC: 'Not enough USDC for this purchase. Please add more USDC to your wallet.',
    
    // Quote & Trading errors
    QUOTE_EXPIRED: 'The quote has expired. Please request a new quote.',
    QUOTE_NOT_FOUND: 'Quote not found. Please request a new quote.',
    INSUFFICIENT_LIQUIDITY: 'Insufficient liquidity for this trade. Please try a smaller amount.',
    INVALID_AMOUNT: 'Invalid amount. Please enter a valid number.',
    AMOUNT_TOO_SMALL: 'Amount is too small. Minimum purchase is 0.01 USDC.',
    AMOUNT_TOO_LARGE: 'Amount exceeds maximum limit.',
    SLIPPAGE_EXCEEDED: 'Price changed too much. Please try again.',
    
    // API errors
    INVALID_PARAMETER: 'One or more parameters provided are invalid.',
    RATE_LIMIT_EXCEEDED: 'Too many requests. Please wait a moment and try again.',
    INTERNAL_SERVER_ERROR: 'An unexpected error occurred. Please try again later.',
    SERVICE_UNAVAILABLE: 'Service is temporarily unavailable. Please try again later.',
    
    // Network errors
    NETWORK_ERROR: 'A network error occurred. Please check your internet connection.',
    TIMEOUT: 'The request timed out. Please try again.',
    NOT_FOUND: 'The requested resource was not found.',
    NETWORK_CONGESTED: 'The Solana network is congested. Please try again with higher priority.',
    RPC_ERROR: 'Failed to connect to Solana network. Please try again.',
    
    // Generic
    PURCHASE_ERROR: 'Failed to complete purchase. Please try again.',
    UNKNOWN_ERROR: 'An unexpected error occurred. Please try again.',
  };

  return errorMap[code] || errorMap['UNKNOWN_ERROR'];
}

/**
 * Parse error from various sources (Axios, wallet, etc.)
 */
export function parseError(error: unknown): string {
  if (!error) return 'An unknown error occurred.';
  
  // Handle string errors
  if (typeof error === 'string') {
    return mapGrailError(error);
  }
  
  // Handle Error objects
  if (error instanceof Error) {
    // Wallet rejection
    if (error.message.includes('User rejected') || error.message.includes('rejected')) {
      return mapGrailError('WALLET_REJECTED');
    }
    
    // Insufficient funds patterns
    if (error.message.includes('insufficient') || error.message.includes('Insufficient')) {
      if (error.message.toLowerCase().includes('sol')) {
        return mapGrailError('INSUFFICIENT_SOL');
      }
      if (error.message.toLowerCase().includes('usdc')) {
        return mapGrailError('INSUFFICIENT_USDC');
      }
      return mapGrailError('INSUFFICIENT_FUNDS');
    }
    
    // Network errors
    if (error.message.includes('Network') || error.message.includes('fetch')) {
      return mapGrailError('NETWORK_ERROR');
    }
    
    // Timeout
    if (error.message.includes('timeout') || error.message.includes('Timeout')) {
      return mapGrailError('TIMEOUT');
    }
    
    return error.message;
  }
  
  // Handle Axios-like errors
  if (typeof error === 'object' && error !== null) {
    const axiosError = error as { response?: { data?: { error?: string; message?: string } }; message?: string };
    
    if (axiosError.response?.data?.error) {
      return mapGrailError(axiosError.response.data.error);
    }
    
    if (axiosError.response?.data?.message) {
      return axiosError.response.data.message;
    }
    
    if (axiosError.message) {
      return axiosError.message;
    }
  }
  
  return 'An unknown error occurred. Please try again.';
}

/**
 * Error class for application-specific errors
 */
export class OroError extends Error {
  constructor(
    public code: string,
    message?: string
  ) {
    super(message || mapGrailError(code));
    this.name = 'OroError';
  }
}
