# OroRound - AI Agent Instructions

## Project Overview

OroRound is a Next.js 16 web application that allows users to purchase tokenized gold (GOLD) on the Solana blockchain using USDC. The app connects to the Grail API for gold pricing and transaction processing.

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS + CSS Variables
- **State Management**: Zustand with persistence
- **Data Fetching**: TanStack React Query
- **Blockchain**: Solana (web3.js, wallet-adapter)
- **UI Components**: Radix UI primitives + shadcn/ui
- **Notifications**: Sonner (toast)
- **Error Tracking**: Sentry

## Commands

```bash
# Development
npm run dev

# Build
npm run build

# Type checking
npm run typecheck

# Linting
npm run lint
npm run lint:fix

# Formatting
npm run format
npm run format:check

# Testing
npm run test
npm run test:watch
npm run test:coverage
```

## Project Structure

```
ororound/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── api/oro/           # API routes (proxy to Grail)
│   │   ├── portfolio/         # Portfolio page
│   │   ├── page.tsx           # Main purchase page
│   │   └── layout.tsx         # Root layout with providers
│   ├── components/
│   │   ├── layout/            # Header, Footer
│   │   ├── portfolio/         # Portfolio components
│   │   ├── purchase/          # Purchase flow components
│   │   ├── ui/                # shadcn/ui components
│   │   ├── Providers.tsx      # All context providers
│   │   ├── WalletProvider.tsx # Solana wallet setup
│   │   └── WalletButton.tsx   # Wallet connect button
│   ├── hooks/
│   │   ├── useGrail.ts        # Grail API hooks
│   │   ├── useGoldBalance.ts  # On-chain balance
│   │   └── useDebounce.ts     # Utility hook
│   ├── lib/
│   │   ├── grail/             # Grail API clients
│   │   ├── env.ts             # Client env validation
│   │   ├── env.server.ts      # Server env validation
│   │   ├── errors.ts          # Error handling
│   │   ├── transaction.ts     # Transaction flow
│   │   └── calculations.ts    # Price/amount utilities
│   ├── store/
│   │   ├── walletStore.ts     # Wallet state
│   │   ├── userStore.ts       # Grail user state
│   │   └── uiStore.ts         # UI state
│   └── types/                 # TypeScript types
├── public/                    # Static assets
├── .env.local.example         # Environment template
├── VERCEL_DEPLOYMENT.md       # Deployment guide
└── next.config.js             # Next.js config
```

## Key Files

- `src/app/page.tsx` - Main purchase flow
- `src/hooks/useGrail.ts` - All Grail API interactions
- `src/lib/grail/server-client.ts` - Server-side API client
- `src/lib/transaction.ts` - Solana transaction handling
- `src/components/WalletProvider.tsx` - Wallet adapter setup

## Environment Variables

### Required for Production

```env
GRAIL_API_KEY=          # Server-side API key (get from Grail team)
GRAIL_API_URL=          # https://oro-tradebook-mainnet.up.railway.app
NEXT_PUBLIC_GRAIL_API_URL=
NEXT_PUBLIC_SOLANA_RPC_URL=
NEXT_PUBLIC_SOLANA_NETWORK=mainnet-beta
```

See `VERCEL_DEPLOYMENT.md` for full list.

## Code Conventions

1. **Components**: Use `'use client'` directive for client components
2. **API Routes**: Use Next.js App Router route handlers
3. **State**: Client state in Zustand, server state in React Query
4. **Styling**: Tailwind classes, use `cn()` utility for merging
5. **Errors**: Use `parseError()` from `lib/errors.ts`
6. **Types**: Prefer interfaces over types, explicit return types

## Transaction Flow

1. User enters amount → `roundUp()` calculates spare change
2. App fetches quote → `useGoldQuote()` hook
3. User clicks Buy → `usePurchaseGold()` mutation
4. Backend creates transaction → returns serialized tx
5. Wallet signs → `completeTransactionFlow()`
6. Submit to Solana → confirm → report to Grail API

## API Proxy Pattern

Frontend calls `/api/oro/*` routes which proxy to Grail API with server-side API key. This keeps the API key secure.

## Wallet Integration

- Supports Phantom and Solflare
- Uses `@solana/wallet-adapter-react`
- Wallet state synced to Zustand for persistence
- Auto-connect on page load

## Testing

- Unit tests: Vitest + Testing Library
- E2E tests: Playwright (in root `/e2e` folder)
- Mock server: MSW for API mocking

## Deployment

Deployed to Vercel at `ororound.vercel.app`. See `VERCEL_DEPLOYMENT.md` for setup instructions.
