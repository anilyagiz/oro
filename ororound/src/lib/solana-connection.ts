import { Connection } from '@solana/web3.js';

/**
 * Solana Connection Singleton
 * Prevents creating new connections on every query
 */

let connection: Connection | null = null;
let connectionUrl: string | null = null;

/**
 * Get or create a Solana connection singleton
 * @param rpcUrl - Optional custom RPC URL
 * @returns Connection instance
 */
export function getSolanaConnection(rpcUrl?: string): Connection {
  const url = rpcUrl || process.env.NEXT_PUBLIC_SOLANA_RPC_URL || 'https://api.mainnet-beta.solana.com';
  
  // Return existing connection if URL matches
  if (connection && connectionUrl === url) {
    return connection;
  }
  
  // Create new connection
  connection = new Connection(url, {
    commitment: 'confirmed',
    confirmTransactionInitialTimeout: 60000, // 60 seconds
  });
  connectionUrl = url;
  
  return connection;
}

/**
 * Reset the connection singleton
 * Useful for testing or switching networks
 */
export function resetConnection(): void {
  connection = null;
  connectionUrl = null;
}

/**
 * Get the current connection URL
 */
export function getConnectionUrl(): string | null {
  return connectionUrl;
}

/**
 * Check if a connection exists
 */
export function hasConnection(): boolean {
  return connection !== null;
}

// Default export for convenience
export default getSolanaConnection;
