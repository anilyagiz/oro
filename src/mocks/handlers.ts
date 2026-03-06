import { http, HttpResponse } from 'msw';
import type {
  CreateUserRequest,
  CreateUserResponse,
  GetQuoteResponse,
  CreatePurchaseRequest,
  CreatePurchaseResponse,
  GetTransactionResponse,
  GrailApiResponse,
} from '@/lib/grail/types';
import type { GoldQuote, CreateUserResponse as ApiCreateUserResponse } from '@/types/api';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
const GRAIL_API_URL = process.env.NEXT_PUBLIC_GRAIL_API_URL || 'https://api.grail.example.com';

const mockUser = {
  id: 'user-123',
  walletAddress: '0x1234567890abcdef',
  kycStatus: 'verified' as const,
  createdAt: '2024-01-01T00:00:00Z',
  updatedAt: '2024-01-01T00:00:00Z',
};

const mockQuote = {
  goldPricePerGram: 65.50,
  tokenPrice: 1.00,
  networkFee: 0.50,
  platformFee: 1.00,
  totalCost: 67.00,
  expiresAt: new Date(Date.now() + 5 * 60 * 1000).toISOString(),
};

const mockGoldQuote: GoldQuote = {
  estimatedGold: '1.0',
  exchangeRate: '65.50',
  fees: {
    protocolFee: '1.00',
    networkFee: '0.50',
    totalFee: '1.50',
  },
  paymentAmount: '67.00',
  paymentToken: 'USDC',
  expiresAt: Date.now() + 5 * 60 * 1000,
};

const mockPurchase = {
  id: 'purchase-123',
  userId: 'user-123',
  walletAddress: '0x1234567890abcdef',
  amountGrams: 1.0,
  amountToken: 67.0,
  pricePerGram: 65.50,
  totalCost: 67.0,
  paymentToken: 'USDC',
  paymentAmount: 67.0,
  status: 'pending' as const,
  createdAt: '2024-01-01T00:00:00Z',
  updatedAt: '2024-01-01T00:00:00Z',
};

const mockTransaction = {
  id: 'tx-123',
  type: 'purchase' as const,
  status: 'pending' as const,
  fromAddress: '0x1234567890abcdef',
  toAddress: '0xabcdef1234567890',
  amount: 67.0,
  token: 'USDC',
  confirmations: 0,
  createdAt: '2024-01-01T00:00:00Z',
  updatedAt: '2024-01-01T00:00:00Z',
};

export const handlers = [
  http.post(API_BASE_URL + '/users', async ({ request }) => {
    const body = await request.json() as CreateUserRequest;
    
    if (body.walletAddress === '0xDUPLICATE') {
      return HttpResponse.json(
        {
          code: 'USER_ALREADY_EXISTS',
          message: 'User with this wallet address already exists',
        },
        { status: 409 }
      );
    }

    if (body.walletAddress === '0xERROR') {
      return HttpResponse.json(
        {
          code: 'INTERNAL_ERROR',
          message: 'Internal server error',
        },
        { status: 500 }
      );
    }

    const response: ApiCreateUserResponse = {
      userId: 'user-123',
      kycHash: body.walletAddress.toLowerCase(),
      walletAddress: body.walletAddress,
      createdAt: new Date().toISOString(),
    };

    return HttpResponse.json(response, { status: 201 });
  }),

  http.get(GRAIL_API_URL + '/quotes', ({ request }) => {
    const url = new URL(request.url);
    const amount = url.searchParams.get('amount');
    const paymentToken = url.searchParams.get('paymentToken');

    if (!amount || !paymentToken) {
      return HttpResponse.json(
        {
          data: null as unknown as GoldQuote,
          success: false,
          error: 'Missing required parameters',
        },
        { status: 400 }
      );
    }

    if (amount === 'error') {
      return HttpResponse.json(
        {
          data: null as unknown as GoldQuote,
          success: false,
          error: 'Failed to fetch quote',
        },
        { status: 500 }
      );
    }

    return HttpResponse.json(
      {
        data: {
          ...mockGoldQuote,
          paymentAmount: amount,
          paymentToken,
        },
        success: true,
      },
      { status: 200 }
    );
  }),

  http.post('https://api.grail.example.com/users', async ({ request }) => {
    const body = await request.json() as CreateUserRequest;

    if (body.walletAddress === 'error') {
      return HttpResponse.json(
        {
          success: false,
          data: null as unknown as CreateUserResponse,
          error: {
            code: 'CREATE_USER_ERROR',
            message: 'Failed to create user',
          },
        } as GrailApiResponse<CreateUserResponse>,
        { status: 500 }
      );
    }

    const response: CreateUserResponse = {
      user: {
        ...mockUser,
        walletAddress: body.walletAddress,
      },
    };

    return HttpResponse.json(
      {
        success: true,
        data: response,
      } as GrailApiResponse<CreateUserResponse>,
      { status: 201 }
    );
  }),

  http.get('https://api.grail.example.com/quotes', ({ request }) => {
    const url = new URL(request.url);
    const paymentToken = url.searchParams.get('paymentToken');

    if (paymentToken === 'error') {
      return HttpResponse.json(
        {
          success: false,
          data: null as unknown as GetQuoteResponse,
          error: {
            code: 'QUOTE_ERROR',
            message: 'Failed to get quote',
          },
        } as GrailApiResponse<GetQuoteResponse>,
        { status: 500 }
      );
    }

    const response: GetQuoteResponse = {
      quote: mockQuote,
      quoteId: 'quote-123',
    };

    return HttpResponse.json(
      {
        success: true,
        data: response,
      } as GrailApiResponse<GetQuoteResponse>,
      { status: 200 }
    );
  }),

  http.post('https://api.grail.example.com/purchases', async ({ request }) => {
    const body = await request.json() as CreatePurchaseRequest;

    if (body.paymentToken === 'error') {
      return HttpResponse.json(
        {
          success: false,
          data: null as unknown as CreatePurchaseResponse,
          error: {
            code: 'PURCHASE_ERROR',
            message: 'Failed to create purchase',
          },
        } as GrailApiResponse<CreatePurchaseResponse>,
        { status: 500 }
      );
    }

    const response: CreatePurchaseResponse = {
      purchase: {
        ...mockPurchase,
        walletAddress: body.walletAddress,
        amountGrams: body.amountGrams,
        paymentToken: body.paymentToken,
        paymentAmount: body.paymentAmount,
      },
      transaction: mockTransaction,
      paymentInstructions: {
        recipientAddress: '0xrecipient123',
        amount: body.paymentAmount,
        token: body.paymentToken,
        expiresAt: new Date(Date.now() + 10 * 60 * 1000).toISOString(),
      },
    };

    return HttpResponse.json(
      {
        success: true,
        data: response,
      } as GrailApiResponse<CreatePurchaseResponse>,
      { status: 201 }
    );
  }),

  http.get('https://api.grail.example.com/transactions/:id', ({ params }) => {
    const { id } = params;

    if (id === 'error') {
      return HttpResponse.json(
        {
          success: false,
          data: null as unknown as GetTransactionResponse,
          error: {
            code: 'TRANSACTION_ERROR',
            message: 'Failed to get transaction',
          },
        } as GrailApiResponse<GetTransactionResponse>,
        { status: 500 }
      );
    }

    if (id === 'not-found') {
      return HttpResponse.json(
        {
          success: false,
          data: null as unknown as GetTransactionResponse,
          error: {
            code: 'NOT_FOUND',
            message: 'Transaction not found',
          },
        } as GrailApiResponse<GetTransactionResponse>,
        { status: 404 }
      );
    }

    const response: GetTransactionResponse = {
      transaction: {
        ...mockTransaction,
        id: id as string,
      },
      confirmationsRequired: 3,
      estimatedConfirmationTime: '2024-01-01T00:05:00Z',
    };

    return HttpResponse.json(
      {
        success: true,
        data: response,
      } as GrailApiResponse<GetTransactionResponse>,
      { status: 200 }
    );
  }),

  http.get('https://api.grail.example.com/retry-test', () => {
    return HttpResponse.json(
      { error: 'Service Unavailable' },
      { status: 503 }
    );
  }),
];
