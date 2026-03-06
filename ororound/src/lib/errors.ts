/**
 * Maps Grail API error codes to user-friendly messages.
 *
 * @param code - The error code returned by the Grail API.
 * @returns A user-friendly error message.
 */
export function mapGrailError(code: string): string {
  const errorMap: Record<string, string> = {
    AUTH_FAILED: 'Authentication failed. Please check your credentials.',
    INSUFFICIENT_FUNDS: 'You do not have enough funds to complete this transaction.',
    INVALID_PARAMETER: 'One or more parameters provided are invalid.',
    RATE_LIMIT_EXCEEDED: 'Too many requests. Please try again later.',
    INTERNAL_SERVER_ERROR: 'An unexpected error occurred on our end. Please try again later.',
    NETWORK_ERROR: 'A network error occurred. Please check your internet connection.',
    NOT_FOUND: 'The requested resource was not found.',
    PERMISSION_DENIED: 'You do not have permission to perform this action.',
    TIMEOUT: 'The request timed out. Please try again.',
    TRANSACTION_TIMEOUT: 'The transaction timed out. Please check the explorer for status.',
    QUOTE_EXPIRED: 'The quote has expired. Please request a new quote.',
    INSUFFICIENT_LIQUIDITY: 'Insufficient liquidity for this trade. Please try a smaller amount.',
    WALLET_REJECTED: 'The transaction was rejected by your wallet.',
    NETWORK_CONGESTED: 'The network is currently congested. Please try again with a higher priority fee.',
  };

  return errorMap[code] || 'An unknown error occurred. Please contact support.';
}
