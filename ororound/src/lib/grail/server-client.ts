import axios, { AxiosError, AxiosInstance } from 'axios';
import { getServerEnv } from '../env.server';

// Types from OpenAPI spec
export interface GrailUser {
  userId: string;
  userPda: string;
  kycHash: string;
  userWalletAddress?: string;
  metadata?: {
    tags?: string[];
    referenceId?: string;
  };
  balancesManagedByProgram?: {
    gold: {
      valueUsd: number;
      amount: number;
    };
  };
  createdAt: string;
  updatedAt?: string;
  transaction?: {
    txId: string;
    serializedTx: string;
    signingInstructions: {
      walletType: string;
      signers?: string[];
      expiresAt: string;
    };
  };
}

export interface GrailQuote {
  quoteId: string;
  goldAmount: number;
  goldPrice: number;
  usdcAmount: number;
  fee: number;
  expiresAt: string;
}

export interface GrailPurchase {
  purchaseId: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  transaction: {
    txId: string;
    serializedTx: string;
    signingInstructions: {
      walletType: string;
      signers?: string[];
      expiresAt: string;
    };
  };
  goldAmount: number;
  usdcAmount: number;
  createdAt: string;
}

export interface GrailTransaction {
  transactionId: string;
  signature?: string;
  status: 'pending' | 'processing' | 'confirmed' | 'failed';
  goldAmount: number;
  usdcAmount: number;
  createdAt: string;
  updatedAt: string;
}

export interface GrailError {
  success: false;
  error: string;
}

// Retry configuration
const MAX_RETRIES = 3;
const RETRY_DELAY = 1000;
const RETRYABLE_STATUS_CODES = [408, 429, 500, 502, 503, 504];

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

// Create axios instance with server-side API key
function createServerGrailClient(): AxiosInstance {
  const env = getServerEnv();

  const client = axios.create({
    baseURL: env.GRAIL_API_URL,
    timeout: 30000,
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': env.GRAIL_API_KEY,
    },
  });

  // Response interceptor for retry logic
  client.interceptors.response.use(
    (response) => response,
    async (error: AxiosError) => {
      const config = error.config as any;

      if (!config) {
        return Promise.reject(error);
      }

      if (config._retryCount === undefined) {
        config._retryCount = 0;
      }

      if (config._retryCount < MAX_RETRIES && shouldRetry(error)) {
        config._retryCount++;

        // Exponential backoff with jitter
        const baseDelay = RETRY_DELAY * Math.pow(2, config._retryCount - 1);
        const jitter = Math.random() * 500;
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

export function getServerGrailClient(): AxiosInstance {
  if (!grailClient) {
    grailClient = createServerGrailClient();
  }
  return grailClient;
}

// Server-side API functions
export const serverGrailApi = {
  async createUser(kycHash: string, userWalletAddress?: string, metadata?: any): Promise<GrailUser> {
    const client = getServerGrailClient();
    const response = await client.post('/api/users', {
      kycHash,
      userWalletAddress,
      metadata,
    });
    return response.data.data;
  },

  async getUser(userId: string): Promise<GrailUser> {
    const client = getServerGrailClient();
    const response = await client.get(`/api/users/${userId}`);
    return response.data.data;
  },

  async listUsers(page = 1, limit = 20) {
    const client = getServerGrailClient();
    const response = await client.get('/api/users', {
      params: { page, limit },
    });
    return response.data;
  },

  async getGoldPrice() {
    const client = getServerGrailClient();
    const response = await client.get('/api/trading/gold/price');
    return response.data.data;
  },

  async estimateBuy(goldAmount: number) {
    const client = getServerGrailClient();
    const response = await client.get('/api/trading/purchases/estimate', {
      params: { goldAmount },
    });
    return response.data.data;
  },

  async estimateSell(goldAmount: number) {
    const client = getServerGrailClient();
    const response = await client.get('/api/trading/sales/estimate', {
      params: { goldAmount },
    });
    return response.data.data;
  },

  async purchaseGoldForUser(
    userId: string,
    goldAmount: number,
    maxUsdcAmount: number,
    metadata?: { referenceId?: string; notes?: string }
  ): Promise<GrailPurchase> {
    const client = getServerGrailClient();
    const response = await client.post('/api/trading/purchases/user', {
      userId,
      goldAmount,
      maxUsdcAmount,
      metadata,
    });
    return response.data.data;
  },

  async sellGoldForUser(
    userId: string,
    goldAmount: number,
    minimumUsdcAmount: number,
    metadata?: { referenceId?: string; notes?: string }
  ) {
    const client = getServerGrailClient();
    const response = await client.post('/api/trading/sales/user', {
      userId,
      goldAmount,
      minimumUsdcAmount,
      metadata,
    });
    return response.data.data;
  },

  async submitTransaction(txId: string, signedSerializedTx: string) {
    const client = getServerGrailClient();
    const response = await client.post('/api/transactions/submit', {
      txId,
      signedSerializedTx,
    });
    return response.data;
  },

  async requestChallenge(walletAddress: string, keyType: 'ADMIN' | 'PARTNER' = 'PARTNER') {
    const client = getServerGrailClient();
    const response = await client.post('/api/auth/challenge', {
      walletAddress,
      keyType,
    });
    return response.data.data;
  },

  async createApiKey(
    challengeId: string,
    signature: string,
    keyName: string,
    expirationDays?: number
  ) {
    const client = getServerGrailClient();
    const response = await client.post('/api/auth/api-key', {
      challengeId,
      signature,
      keyName,
      expirationDays,
    });
    return response.data.data;
  },
};
