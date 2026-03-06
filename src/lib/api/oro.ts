import axios from 'axios';

// The base URL for the Devnet Oro TradeBook API
export const ORO_API_BASE_URL = 'https://oro-tradebook-devnet.up.railway.app';

// Note: In a production environment, this API key MUST NOT be exposed to the client.
// It should be kept securely on a backend server, and the client should call your backend.
export const createOroClient = (apiKey: string) => {
  return axios.create({
    baseURL: ORO_API_BASE_URL,
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
    },
  });
};

export class OroTradeBookApi {
  private client;

  constructor(apiKey: string) {
    this.client = createOroClient(apiKey);
  }

  // --- GENERAL ---
  async checkHealth() {
    const response = await axios.get(`${ORO_API_BASE_URL}/health`);
    return response.data;
  }

  // --- AUTHENTICATION ---
  async requestChallenge(walletAddress: string, keyType: 'ADMIN' | 'PARTNER' = 'PARTNER') {
    const response = await this.client.post('/api/auth/challenge', {
      walletAddress,
      keyType,
    });
    return response.data;
  }

  async createApiKey(challengeId: string, signature: string, keyName: string) {
    const response = await this.client.post('/api/auth/api-key', {
      challengeId,
      signature,
      keyName,
    });
    return response.data;
  }

  // --- USERS ---
  async createUser(kycHash: string, userWalletAddress?: string, metadata?: Record<string, any>) {
    const response = await this.client.post('/api/users', {
      kycHash,
      userWalletAddress,
      metadata,
    });
    return response.data;
  }

  async getUser(userId: string) {
    const response = await this.client.get(`/api/users/${userId}`);
    return response.data;
  }

  async listUsers(page = 1, limit = 20) {
    const response = await this.client.get('/api/users', {
      params: { page, limit },
    });
    return response.data;
  }

  // --- TRADING ---
  async getGoldPrice() {
    const response = await axios.get(`${ORO_API_BASE_URL}/api/trading/gold/price`);
    return response.data;
  }

  async estimateBuy(goldAmount: number) {
    const response = await this.client.get('/api/trading/purchases/estimate', {
      params: { goldAmount },
    });
    return response.data;
  }

  async estimateSell(goldAmount: number) {
    const response = await this.client.get('/api/trading/sales/estimate', {
      params: { goldAmount },
    });
    return response.data;
  }

  async purchaseGoldForUser(userId: string, goldAmount: number, maxUsdcAmount: number) {
    const response = await this.client.post('/api/trading/purchases/user', {
      userId,
      goldAmount,
      maxUsdcAmount,
    });
    return response.data;
  }

  async sellGoldForUser(userId: string, goldAmount: number, minimumUsdcAmount: number) {
    const response = await this.client.post('/api/trading/sales/user', {
      userId,
      goldAmount,
      minimumUsdcAmount,
    });
    return response.data;
  }

  // --- TRANSACTIONS ---
  async submitTransaction(txId: string, signedSerializedTx: string) {
    const response = await this.client.post('/api/transactions/submit', {
      txId,
      signedSerializedTx,
    });
    return response.data;
  }
}
