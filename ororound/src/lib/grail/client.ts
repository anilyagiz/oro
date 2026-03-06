import axios, { AxiosError, AxiosInstance, AxiosRequestConfig } from 'axios';
import { RateLimiter } from './rate-limiter';

// Types
export interface GrailUser {
  id: string;
  kyc_hash: string;
  created_at: string;
}

export interface GrailQuote {
  quote_id: string;
  gold_amount: number;
  gold_price: number;
  payment_amount: number;
  payment_token: string;
  fee: number;
  expires_at: string;
}

export interface GrailPurchase {
  transaction_id: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  serialized_transaction: string;
  gold_amount: number;
  payment_amount: number;
}

export interface GrailTransaction {
  id: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  gold_amount: number;
  payment_amount: number;
  created_at: string;
  updated_at: string;
  tx_signature?: string;
}

export interface GrailError {
  error: string;
  message: string;
  code: number;
}

// Retry configuration
const MAX_RETRIES = 3;
const RETRY_DELAY = 1000;
const RETRYABLE_STATUS_CODES = [408, 429, 500, 502, 503, 504];

// Rate limiter instance (60 requests per minute)
const rateLimiter = new RateLimiter(60, 60000);

function shouldRetry(error: unknown): boolean {
  if (axios.isAxiosError(error)) {
    const status = error.response?.status;
    return status ? RETRYABLE_STATUS_CODES.includes(status) : false;
  }
  return false;
}

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Custom error class for rate limiting
 */
export class RateLimitError extends Error {
  constructor(
    message: string = 'Rate limit exceeded. Please try again later.',
    public readonly retryAfterMs: number = 0
  ) {
    super(message);
    this.name = 'RateLimitError';
  }
}

// Create axios instance
function createGrailClient(): AxiosInstance {
  const baseURL =
    process.env.NEXT_PUBLIC_GRAIL_API_URL || 'https://oro-tradebook-mainnet.up.railway.app';
  const apiKey = process.env.NEXT_PUBLIC_GRAIL_API_KEY;

  const client = axios.create({
    baseURL,
    timeout: 30000,
    headers: {
      'Content-Type': 'application/json',
      ...(apiKey && { 'X-API-Key': apiKey }),
    },
  });

  // Request interceptor for rate limiting
  client.interceptors.request.use(
    (config) => {
      // Check rate limit before making request
      if (!rateLimiter.tryAcquire()) {
        const retryAfter = rateLimiter.getTimeUntilNextMs();
        return Promise.reject(new RateLimitError('Rate limit exceeded', retryAfter));
      }
      return config;
    },
    (error) => Promise.reject(error)
  );

  // Response interceptor for retry logic
  client.interceptors.response.use(
    (response) => response,
    async (error: AxiosError | RateLimitError) => {
      // Handle rate limit errors from server
      if (error instanceof RateLimitError) {
        return Promise.reject(error);
      }

      const config = error.config as AxiosRequestConfig & { _retryCount?: number };

      if (!config || config._retryCount === undefined) {
        config._retryCount = 0;
      }

      if (config._retryCount < MAX_RETRIES && shouldRetry(error)) {
        config._retryCount++;
        
        // Exponential backoff with jitter
        const baseDelay = RETRY_DELAY * Math.pow(2, config._retryCount - 1);
        const jitter = Math.random() * 500; // Add up to 500ms of jitter
        const delayMs = baseDelay + jitter;
        
        await delay(delayMs);
        return client.request(config);
      }

      return Promise.reject(error);
    }
  );

  return client;
}

// Singleton client
let grailClient: AxiosInstance | null = null;

export function getGrailClient(): AxiosInstance {
  if (!grailClient) {
    grailClient = createGrailClient();
  }
  return grailClient;
}

/**
 * Get rate limiter status
 */
export function getRateLimitStatus() {
  return {
    remaining: rateLimiter.getRemaining(),
    timeUntilNext: rateLimiter.getTimeUntilNextMs(),
  };
}

// API functions
export const grailApi = {
  async createUser(kycHash: string): Promise<GrailUser> {
    const client = getGrailClient();
    const response = await client.post<GrailUser>('/users', { kyc_hash: kycHash });
    return response.data;
  },

  async getQuote(
    userId: string,
    paymentAmount: number,
    paymentToken: string = 'USDC'
  ): Promise<GrailQuote> {
    const client = getGrailClient();
    const response = await client.get<GrailQuote>(`/users/${userId}/quotes`, {
      params: {
        payment_amount: paymentAmount,
        payment_token: paymentToken,
      },
    });
    return response.data;
  },

  async createPurchase(
    userId: string,
    quoteId: string,
    walletAddress: string
  ): Promise<GrailPurchase> {
    const client = getGrailClient();
    const response = await client.post<GrailPurchase>(`/users/${userId}/purchases`, {
      quote_id: quoteId,
      wallet_address: walletAddress,
    });
    return response.data;
  },

  async getTransaction(userId: string, transactionId: string): Promise<GrailTransaction> {
    const client = getGrailClient();
    const response = await client.get<GrailTransaction>(
      `/users/${userId}/transactions/${transactionId}`
    );
    return response.data;
  },

  async getTransactions(userId: string): Promise<GrailTransaction[]> {
    const client = getGrailClient();
    const response = await client.get<GrailTransaction[]>(`/users/${userId}/transactions`);
    return response.data;
  },
};