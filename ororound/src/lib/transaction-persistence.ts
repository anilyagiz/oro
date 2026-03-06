const PENDING_TX_KEY = 'ororound_pending_tx';

/**
 * Saves the pending transaction ID to localStorage.
 * Safe for SSR.
 */
export function savePendingTransaction(id: string): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem(PENDING_TX_KEY, id);
  }
}

/**
 * Retrieves the pending transaction ID from localStorage.
 * Returns null if no transaction is pending or if called during SSR.
 */
export function getPendingTransaction(): string | null {
  if (typeof window !== 'undefined') {
    return localStorage.getItem(PENDING_TX_KEY);
  }
  return null;
}

/**
 * Clears the pending transaction ID from localStorage.
 * Safe for SSR.
 */
export function clearPendingTransaction(): void {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(PENDING_TX_KEY);
  }
}
