# API Documentation

This document describes the API integration for the Oro application, including the Grail API client and type definitions.

---

## Table of Contents

- [Grail Client](#grail-client)
- [Authentication](#authentication)
- [Endpoints](#endpoints)
- [Types](#types)
- [Error Handling](#error-handling)
- [Usage Examples](#usage-examples)

---

## Grail Client

The `GrailClient` class provides a typed HTTP client for interacting with the Grail API. It includes automatic retry logic, request/response interceptors, and comprehensive error handling.

### Initialization

```typescript
import { getGrailClient } from '@/lib/grail/client';

const client = getGrailClient();
```

The client is a singleton. Use `getGrailClient()` to get the instance, or `resetGrailClient()` to create a fresh instance (useful in testing).

### Configuration

The client reads from environment variables:

```bash
GRAIL_API_URL=https://api.grail.oro.finance/v1
GRAIL_API_KEY=your_api_key_here
```

Required. The client throws if these are not set.

### Features

- **Automatic retries**: Up to 3 retries with exponential backoff
- **Request interceptors**: Adds API key header to all requests
- **Response interceptors**: Handles retry logic for failed requests
- **Type safety**: Full TypeScript support for all requests and responses
- **Error normalization**: Consistent error format across all endpoints

---

## Authentication

All API requests require an API key passed via the `x-api-key` header:

```http
GET /v1/quotes
x-api-key: gr_live_xxxxxxxx
```

The GrailClient automatically adds this header to every request via an interceptor.

---

## Endpoints

### Users

#### Create User

Creates a new user account linked to a wallet address.

```typescript
async createUser(request: CreateUserRequest): Promise<GrailApiResponse<CreateUserResponse>>
```

**Request:**

```typescript
interface CreateUserRequest {
  kycHash: string;        // KYC verification hash
  walletAddress: string;  // Solana wallet address
}
```

**Response:**

```typescript
interface CreateUserResponse {
  userId: string;         // Unique user ID
  kycHash: string;        // KYC hash
  walletAddress: string;  // Wallet address
  createdAt: string;      // ISO 8601 timestamp
}
```

**Example:**

```typescript
const result = await client.createUser({
  kycHash: 'kyc_abc123',
  walletAddress: '7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU'
});

if (result.success) {
  console.log('User created:', result.data.userId);
}
```

---

### Quotes

#### Get Quote

Fetches a real-time gold quote for a purchase amount.

```typescript
async getQuote(request: GetQuoteRequest): Promise<GrailApiResponse<GetQuoteResponse>>
```

**Request:**

```typescript
interface GetQuoteRequest {
  amount: string;         // Amount to purchase (in gold units)
  paymentToken: string;   // Token symbol (e.g., 'USDC', 'USDT')
  projectId?: string;     // Optional project identifier
}
```

**Response:**

```typescript
interface GetQuoteResponse {
  estimatedGold: string;  // Amount of gold to receive
  exchangeRate: string;   // Current gold/payment token rate
  fees: {
    protocolFee: string;  // Protocol fee amount
    networkFee: string;   // Network transaction fee
    totalFee: string;     // Total fees
  };
  paymentAmount: string;  // Total payment required
  paymentToken: string;   // Payment token symbol
  expiresAt: number;      // Quote expiration timestamp (Unix ms)
}
```

**Example:**

```typescript
const result = await client.getQuote({
  amount: '1.0',
  paymentToken: 'USDC'
});

if (result.success) {
  console.log('Gold amount:', result.data.estimatedGold);
  console.log('Total cost:', result.data.paymentAmount);
  console.log('Quote expires:', new Date(result.data.expiresAt));
}
```

---

### Purchases

#### Create Purchase

Creates a new purchase transaction. Returns a serialized transaction for signing.

```typescript
async createPurchase(request: CreatePurchaseRequest): Promise<GrailApiResponse<CreatePurchaseResponse>>
```

**Request:**

```typescript
interface CreatePurchaseRequest {
  quote: GoldQuote;       // Quote from getQuote
  walletAddress: string;  // Buyer's wallet address
  projectId?: string;     // Optional project identifier
}
```

**Response:**

```typescript
interface CreatePurchaseResponse {
  id: string;             // Purchase transaction ID
  serializedTx: string;   // Serialized transaction (base64)
  status: 'pending' | 'signed' | 'submitted' | 'confirmed' | 'failed';
  quote: GoldQuote;       // Quote details
  createdAt: number;      // Creation timestamp (Unix ms)
}
```

**Example:**

```typescript
const result = await client.createPurchase({
  quote: goldQuote,
  walletAddress: '7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU'
});

if (result.success) {
  // Sign the transaction with wallet
  const signed = await wallet.signTransaction(result.data.serializedTx);
  
  // Submit the signed transaction
  await submitSignedTransaction({
    purchaseId: result.data.id,
    signedTx: signed.signedTx,
    signature: signed.signature
  });
}
```

---

### Transactions

#### Get Transaction

Retrieves the status and details of a transaction.

```typescript
async getTransaction(id: string): Promise<GrailApiResponse<GetTransactionResponse>>
```

**Parameters:**

- `id` (string): Transaction ID from createPurchase

**Response:**

```typescript
interface GetTransactionResponse {
  id: string;
  status: 'pending' | 'signed' | 'submitted' | 'confirmed' | 'failed';
  txHash?: string;        // Solana transaction hash (if submitted)
  quote: GoldQuote;
  createdAt: number;
  confirmedAt?: number;   // Confirmation timestamp
  errorMessage?: string;  // Error details (if failed)
}
```

**Example:**

```typescript
const result = await client.getTransaction('purchase_abc123');

if (result.success) {
  console.log('Status:', result.data.status);
  console.log('Tx Hash:', result.data.txHash);
}
```

---

## Types

### Core Types

#### GrailApiResponse

All API responses follow this wrapper format:

```typescript
interface GrailApiResponse<T> {
  success: boolean;       // Whether the request succeeded
  data: T;               // Response payload
  error?: string;        // Error message (if success is false)
}
```

#### GoldQuote

Represents a gold purchase quote:

```typescript
interface GoldQuote {
  estimatedGold: string;
  exchangeRate: string;
  fees: {
    protocolFee: string;
    networkFee: string;
    totalFee: string;
  };
  paymentAmount: string;
  paymentToken: string;
  expiresAt: number;
}
```

#### TransactionStatus

```typescript
type TransactionStatus = 'pending' | 'signed' | 'submitted' | 'confirmed' | 'failed';
```

### Purchase Types

Located in `src/types/purchase.ts`:

```typescript
// Purchase parameters
interface PurchaseParams {
  projectId: string;
  amount: string;
  paymentToken: string;
}

// Purchase receipt (after completion)
interface PurchaseReceipt {
  txHash: string;
  status: 'pending' | 'confirmed' | 'failed';
  timestamp: number;
}

// Purchase progress for UI updates
interface PurchaseProgress {
  step: PurchaseStep;
  message: string;
  txHash?: string;
  error?: string;
}

type PurchaseStep = 
  | 'idle'
  | 'getting-quote'
  | 'creating-purchase'
  | 'signing'
  | 'submitting'
  | 'completed'
  | 'error';
```

### Wallet Types

Located in `src/types/wallet.ts`:

```typescript
interface WalletState {
  address: string | null;
  isConnected: boolean;
  chainId: number | null;
  balance: string | null;
}

interface WalletSigner {
  signTransaction: (serializedTx: string) => Promise<{
    signature: string;
    signedTx: string;
  }>;
  publicKey: string;
  connected: boolean;
}
```

---

## Error Handling

### Error Types

The GrailClient can throw several types of errors:

#### ConfigurationError

Thrown when required environment variables are missing:

```typescript
new Error('GRAIL_API_URL environment variable is required');
new Error('GRAIL_API_KEY environment variable is required');
```

#### NetworkError

Thrown when the request fails due to network issues:

```typescript
// After all retries are exhausted
{
  message: 'Network Error',
  code: 'ECONNABORTED'
}
```

#### ApiError

Thrown when the API returns an error response:

```typescript
interface ApiError {
  response?: {
    status: number;
    data: {
      error: string;
      code?: string;
    };
  };
}
```

### Retry Logic

The client automatically retries requests on:

- Network failures (no response)
- HTTP 408 (Request Timeout)
- HTTP 429 (Too Many Requests)
- HTTP 500, 502, 503, 504 (Server errors)

Retry delays use exponential backoff with jitter:

```
Attempt 1: ~1 second delay
Attempt 2: ~2 seconds delay
Attempt 3: ~4 seconds delay
```

### Handling Errors

```typescript
try {
  const result = await client.getQuote({ amount: '1.0', paymentToken: 'USDC' });
  
  if (!result.success) {
    // API returned error response
    console.error('API Error:', result.error);
    return;
  }
  
  // Use result.data
} catch (error) {
  if (axios.isAxiosError(error)) {
    if (error.response) {
      // Server responded with error status
      console.error('HTTP Error:', error.response.status);
      console.error('Error Data:', error.response.data);
    } else if (error.request) {
      // Request made but no response (network error)
      console.error('Network Error: No response received');
    } else {
      // Error setting up the request
      console.error('Request Error:', error.message);
    }
  } else {
    // Non-Axios error
    console.error('Unexpected Error:', error);
  }
}
```

---

## Usage Examples

### Complete Purchase Flow

```typescript
import { getGrailClient } from '@/lib/grail/client';

async function purchaseGold(
  wallet: WalletSigner,
  amount: string,
  paymentToken: string
) {
  const client = getGrailClient();
  
  // Step 1: Get quote
  const quoteResult = await client.getQuote({ amount, paymentToken });
  
  if (!quoteResult.success) {
    throw new Error(`Quote failed: ${quoteResult.error}`);
  }
  
  console.log('Quote received:', quoteResult.data);
  
  // Step 2: Create purchase
  const purchaseResult = await client.createPurchase({
    quote: quoteResult.data,
    walletAddress: wallet.publicKey
  });
  
  if (!purchaseResult.success) {
    throw new Error(`Purchase creation failed: ${purchaseResult.error}`);
  }
  
  const { id, serializedTx } = purchaseResult.data;
  
  // Step 3: Sign transaction
  const { signature, signedTx } = await wallet.signTransaction(serializedTx);
  
  // Step 4: Submit signed transaction
  const submitResult = await fetch(`${process.env.GRAIL_API_URL}/purchases/${id}/submit`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': process.env.GRAIL_API_KEY!
    },
    body: JSON.stringify({ signedTx, signature })
  });
  
  if (!submitResult.ok) {
    throw new Error('Failed to submit transaction');
  }
  
  const submitData = await submitResult.json();
  
  // Step 5: Poll for confirmation
  let confirmed = false;
  let attempts = 0;
  const maxAttempts = 30;
  
  while (!confirmed && attempts < maxAttempts) {
    await new Promise(r => setTimeout(r, 2000)); // Wait 2 seconds
    
    const txResult = await client.getTransaction(id);
    
    if (txResult.success && txResult.data.status === 'confirmed') {
      confirmed = true;
      console.log('Transaction confirmed:', txResult.data.txHash);
      return txResult.data;
    }
    
    if (txResult.success && txResult.data.status === 'failed') {
      throw new Error(`Transaction failed: ${txResult.data.errorMessage}`);
    }
    
    attempts++;
  }
  
  throw new Error('Transaction confirmation timeout');
}
```

### Using with React Query

```typescript
import { useQuery, useMutation } from '@tanstack/react-query';
import { getGrailClient } from '@/lib/grail/client';

// Fetch quote with caching
export function useGoldQuote(amount: string, paymentToken: string) {
  return useQuery({
    queryKey: ['gold-quote', amount, paymentToken],
    queryFn: async () => {
      const client = getGrailClient();
      const result = await client.getQuote({ amount, paymentToken });
      
      if (!result.success) {
        throw new Error(result.error);
      }
      
      return result.data;
    },
    staleTime: 30 * 1000, // 30 seconds
    retry: 3,
  });
}

// Create purchase mutation
export function useCreatePurchase() {
  return useMutation({
    mutationFn: async (params: {
      quote: GoldQuote;
      walletAddress: string;
    }) => {
      const client = getGrailClient();
      const result = await client.createPurchase(params);
      
      if (!result.success) {
        throw new Error(result.error);
      }
      
      return result.data;
    }
  });
}
```

---

## API Reference Summary

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/users` | Create new user |
| GET | `/quotes` | Get gold quote |
| POST | `/purchases` | Create purchase transaction |
| GET | `/transactions/:id` | Get transaction status |
| POST | `/purchases/:id/submit` | Submit signed transaction |

---

## Rate Limits

The Grail API implements rate limiting:

- **Quotes**: 60 requests per minute
- **Purchases**: 10 requests per minute
- **Transactions**: 120 requests per minute

The GrailClient respects these limits and includes automatic retry for 429 responses.

---

## Changelog

### v1.0.0

- Initial API client implementation
- Support for user creation, quotes, and purchases
- Automatic retry with exponential backoff
- Full TypeScript coverage
