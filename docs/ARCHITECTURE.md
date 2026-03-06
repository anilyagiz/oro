# Architecture Documentation

This document describes the architecture of the Oro application, a Solana-based gold purchasing platform.

---

## Table of Contents

- [System Overview](#system-overview)
- [Technology Stack](#technology-stack)
- [Project Structure](#project-structure)
- [Data Flow](#data-flow)
- [State Management](#state-management)
- [API Integration](#api-integration)
- [Security Considerations](#security-considerations)
- [Performance Optimizations](#performance-optimizations)
- [Error Handling](#error-handling)
- [Development Guidelines](#development-guidelines)
- [Transaction State Persistence](#transaction-state-persistence)

---

## System Overview

Oro is a Next.js application that enables users to purchase tokenized gold on the Solana blockchain. The system follows a layered architecture:

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                        Presentation Layer                           │
│  ┌─────────────────────────────────────────────────────────────────────────────────┐  │
│  │  Components │  Hooks │  Pages (Next.js App Router)           │  │
│  └─────────────────────────────────────────────────────────────────────────────────┘  │
├─────────────────────────────────────────────────────────────────────────────────┤
│                         State Layer                                │
│  ┌─────────────────────────────────────────────────────────────────────────────────┐  │
│  │  Zustand Stores │  React Query Cache │  Local Storage        │  │
│  └─────────────────────────────────────────────────────────────────────────────────┘  │
├─────────────────────────────────────────────────────────────────────────────────┤
│                        Service Layer                               │
│  ┌─────────────────────────────────────────────────────────────────────────────────┐  │
│  │  Grail Client │  Solana Web3 │  Wallet Adapters              │  │
│  └─────────────────────────────────────────────────────────────────────────────────┘  │
├─────────────────────────────────────────────────────────────────────────────────┤
│                     External Services                              │
│  ┌─────────────────────────────────────────────────────────────────────────────────┐  │
│  │  Grail API │  Solana RPC │  Wallet Extensions                   │  │
│  └─────────────────────────────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────────────────┘
```

---

## Technology Stack

### Core Framework

| Technology | Purpose | Version |
|------------|---------|---------|
| Next.js | React framework with App Router | 15.x |
| React | UI library | 19.x |
| TypeScript | Type safety | 5.x |

### State Management

| Technology | Purpose |
|------------|---------|
| Zustand | Client state management |
| TanStack Query | Server state, caching, synchronization |
| Immer | Immutable updates (via Zustand) |

### Blockchain

| Technology | Purpose |
|------------|---------|
| @solana/web3.js | Solana blockchain interaction |
| @solana/spl-token | SPL token operations |
| Wallet Adapter | Wallet connection standard |

### Data Fetching

| Technology | Purpose |
|------------|---------|
| Axios | HTTP client with interceptors |
| TanStack Query | Data fetching, caching, background updates |

### Testing

| Technology | Purpose |
|------------|---------|
| Vitest | Unit testing framework |
| Playwright | E2E testing |
| MSW | API mocking |
| jsdom | DOM environment for tests |

---

## Project Structure

```
oro/
├── app/                          # Next.js App Router
│   ├── providers.tsx             # Global providers (QueryClient, ErrorBoundary)
│   └── ...                       # Route segments
├── src/
│   ├── components/               # React components
│   │   ├── purchase/             # Purchase flow components
│   │   ├── wallet/               # Wallet-related components
│   │   ├── ui/                   # Reusable UI components
│   │   └── layout/               # Layout components
│   ├── hooks/                    # Custom React hooks
│   │   ├── usePurchaseGold.ts    # Purchase flow logic
│   │   ├── useGoldQuote.ts       # Quote fetching hook
│   │   └── usePullToRefresh.ts   # Mobile gesture hook
│   ├── lib/                      # Utility libraries
│   │   ├── grail/                # Grail API client
│   │   │   ├── client.ts         # Axios client with retry logic
│   │   │   └── types.ts          # API type definitions
│   │   ├── utils.ts              # General utilities
│   │   └── calculations.ts       # Math/finance calculations
│   ├── store/                    # Zustand stores
│   │   ├── walletStore.ts        # Wallet state management
│   │   └── userStore.ts          # User state management
│   ├── types/                    # TypeScript definitions
│   │   ├── purchase.ts           # Purchase-related types
│   │   ├── wallet.ts             # Wallet types
│   │   ├── portfolio.ts          # Portfolio types
│   │   └── api.ts                # API response types
│   └── mocks/                    # MSW mocking setup
│       ├── handlers.ts           # Mock API handlers
│       └── server.ts             # Mock server config
├── e2e/                          # Playwright E2E tests
├── docs/                         # Documentation
├── public/                       # Static assets
├── hooks/                        # Git hooks
└── ororound/                     # Additional app directory
```

### Module Organization

#### Components

Components are organized by feature:

- **purchase/**: Components specific to the gold purchase flow
- **wallet/**: Wallet connection and management components
- **ui/**: Generic, reusable UI components (buttons, inputs, modals)
- **layout/**: Layout wrappers, headers, footers

#### Hooks

Custom hooks follow the `use[Feature][Action]` naming convention:

- `usePurchaseGold`: Orchestrates the entire purchase flow
- `useGoldQuote`: Fetches and caches gold price quotes
- `usePullToRefresh`: Adds pull-to-refresh functionality for mobile

#### State Management

**Zustand Stores**:

- `walletStore`: Manages wallet connection, address, chain, and balance
- `userStore`: Manages user profile and KYC status

Both stores use the `persist` middleware to save state to localStorage.

**React Query**:

Used for all server state:

- Quote fetching with automatic refetching
- Transaction status polling
- User data synchronization

---

## Data Flow

### Purchase Flow Data Flow

```
1. User enters amount
        │
        ▼
2. Hook calls getQuote()
        │
        ▼
3. GrailClient fetches quote from API
        │
        ▼
4. User confirms purchase
        │
        ▼
5. Hook calls createPurchase()
        │
        ▼
6. API returns serialized transaction
        │
        ▼
7. User signs transaction with wallet
        │
        ▼
8. Hook calls submitSignedTransaction()
        │
        ▼
9. API submits to Solana network
        │
        ▼
10. Returns txHash and status
```

### State Synchronization

```
┌─────────────────┐    ┌─────────────────┐
│  Server State   │    │  Client State   │
│  (React Query)  │    │  (Zustand)      │
└─────────────────┘    └─────────────────┘
         │                   │
         │                   │
    ┌────────────────────────────────────┐
    │          Components              │
    │  - Read from both sources       │
    │  - Write to appropriate store   │
    └────────────────────────────────────┘
```

**Server State** (React Query):

- Gold quotes
- Transaction status
- User profile
- Portfolio data

**Client State** (Zustand):

- Wallet connection
- UI preferences
- Purchase progress
- Form state

---

## State Management

### Zustand Store Pattern

```typescript
// src/store/walletStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface WalletStore {
  // State
  address: string | null;
  isConnected: boolean;
  chainId: number | null;
  balance: string | null;
  
  // Actions
  connect: (address: string, chainId: number) => void;
  disconnect: () => void;
  updateBalance: (balance: string) => void;
  switchChain: (chainId: number) => void;
}

export const useWalletStore = create<WalletStore>()(
  persist(
    (set) => ({
      address: null,
      isConnected: false,
      chainId: null,
      balance: null,
      
      connect: (address, chainId) =>
        set({ address, isConnected: true, chainId }),
      
      disconnect: () =>
        set({ address: null, isConnected: false, chainId: null, balance: null }),
      
      updateBalance: (balance) => set({ balance }),
      
      switchChain: (chainId) => set({ chainId }),
    }),
    { name: 'wallet-storage' }
  )
);
```

### React Query Pattern

```typescript
// Example hook using React Query
import { useQuery, useMutation } from '@tanstack/react-query';

export function useGoldQuote(params: QuoteParams) {
  return useQuery({
    queryKey: ['gold-quote', params],
    queryFn: () => fetchQuote(params),
    staleTime: 30 * 1000, // 30 seconds
    retry: 3,
  });
}

export function useCreatePurchase() {
  return useMutation({
    mutationFn: createPurchase,
    onSuccess: (data) => {
      // Invalidate relevant queries
      queryClient.invalidateQueries({ queryKey: ['portfolio'] });
    },
  });
}
```

---

## API Integration

### GrailClient Architecture

The `GrailClient` class provides a robust HTTP client with:

- **Automatic retries**: Exponential backoff with jitter
- **Request/response interceptors**: For auth headers and error handling
- **Type safety**: Full TypeScript generics for request/response types
- **Error normalization**: Consistent error format

```typescript
class GrailClient {
  private client: AxiosInstance;
  private retryConfig: RetryConfig;
  
  constructor() {
    // Initialize with env vars
    // Set up interceptors
    // Configure retry logic
  }
  
  async createUser(request: CreateUserRequest): Promise<...>
  async getQuote(request: GetQuoteRequest): Promise<...>
  async createPurchase(request: CreatePurchaseRequest): Promise<...>
  async getTransaction(id: string): Promise<...>
}
```

### Retry Configuration

```typescript
const DEFAULT_RETRY_CONFIG: RetryConfig = {
  maxRetries: 3,
  baseDelayMs: 1000,
  maxDelayMs: 10000,
  retryableStatuses: [408, 429, 500, 502, 503, 504],
};
```

Retry delays use exponential backoff with jitter:

```typescript
delay = min(baseDelay * 2^attempt + random(0, 1000), maxDelay)
```

---

## Security Considerations

### Environment Variables

- **Never expose server-side secrets** in client code
- Use `NEXT_PUBLIC_` prefix only for values safe to expose
- Validate all env vars at startup

### Wallet Security

- Never store private keys
- Use wallet adapters for secure signing
- Validate all transactions before signing
- Show clear transaction details to users

### API Security

- API keys are sent via headers, not query params
- All requests use HTTPS
- Rate limiting on client side (respects API limits)
- Input validation on all user inputs

### Content Security

Vercel configuration includes security headers:

```json
{
  "X-Content-Type-Options": "nosniff",
  "X-Frame-Options": "DENY",
  "X-XSS-Protection": "1; mode=block",
  "Referrer-Policy": "strict-origin-when-cross-origin"
}
```

---

## Performance Optimizations

### Code Splitting

- Next.js automatic code splitting by route
- Dynamic imports for heavy components
- Lazy loading for wallet adapters

### Data Fetching

- React Query caching with configurable stale time
- Background refetching for fresh data
- Optimistic updates for better UX

### Bundle Optimization

- Tree shaking for unused code
- Minification in production
- Compression via Vercel CDN

### Rendering Strategy

- Static generation for marketing pages
- Server components where possible
- Client components only for interactive features

---

## Error Handling

### Error Boundaries

Global error boundary catches React errors:

```typescript
// app/providers.tsx
<ErrorBoundary>
  <QueryClientProvider client={queryClient}>
    {children}
  </QueryClientProvider>
</ErrorBoundary>
```

### API Error Handling

The GrailClient normalizes all errors:

```typescript
interface GrailApiError {
  code: string;
  message: string;
  details?: Record<string, unknown>;
}
```

### User-Facing Errors

All errors are displayed with:

- Clear, actionable messages
- Retry options where appropriate
- Proper error categorization (network, validation, server)

---

## Development Guidelines

### Adding New Features

1. **Define types** in `src/types/`
2. **Create/update API client** in `src/lib/grail/`
3. **Add hooks** in `src/hooks/`
4. **Build components** in `src/components/`
5. **Write tests** alongside implementation
6. **Update documentation**

### Code Style

- Use TypeScript strict mode
- Prefer explicit types over `any`
- Use functional components with hooks
- Keep components small and focused
- Use composition over inheritance

### Testing Strategy

- Unit tests for utilities and hooks
- Integration tests for API clients
- E2E tests for critical user flows
- Mock external services in unit tests

---

## Transaction State Persistence

To ensure a seamless user experience during the multi-step purchase flow, transaction states are persisted using Zustand's `persist` middleware. This allows users to:

- **Resume interrupted flows**: If the browser is refreshed or closed during a transaction, the application can restore the state and continue from the last successful step.
- **Handle network issues**: If a transaction is submitted but the response is lost, the persisted state allows the application to poll for the transaction status upon reconnection.
- **Cross-session consistency**: Purchase progress is maintained across sessions until completion or manual cancellation.

The state includes the current step, quote details, and any pending transaction hashes.
