# Draft: OroRound MVP Planning

## Project Overview
**Name**: OroRound  
**Concept**: Spare change rounding app for gold savings on Solana  
**Core Flow**: Enter amount → Round up → Buy GOLD via GRAIL API  
**Target**: Non-crypto-native UX  
**Timeline**: 2 weeks (Milestone 1 + 2)

## Requirements (Confirmed)
- [x] Simple web UI (amount input + round-up rules: 1/5/10)
- [x] Round-up calculation + confirmation
- [x] GRAIL API integration (USDC → GOLD)
- [x] Success state with amount/price/quote
- [x] Portfolio screen (balance + transaction history)
- [x] Error handling (failed quote, insufficient balance, retry)
- [x] Public demo deployment

## Open Questions
1. **Tech Stack**: Next.js + React? Pure React? Framework preference?
2. **Wallet Integration**: Phantom, Solflare, or both?
3. **GRAIL API**: Do we have API docs/access?
4. **Solana Network**: Mainnet or Devnet for MVP?
5. **Styling**: Tailwind, CSS modules, or component library?
6. **State Management**: React Query, Zustand, Context?

## Technical Decisions Pending
- [ ] Frontend framework
- [ ] Wallet adapter choice
- [ ] API client setup
- [ ] Deployment platform
- [ ] Testing strategy

## Research Findings

### GRAIL API Architecture - CRITICAL DISCOVERIES

#### Model Selection: **Self-Custody Model** ✅
**Why**: Web3 wallet kullanıcıları için ideal. Kullanıcı kendi cüzdanında USDC ve GOLD tutuyor.

**Workflow**:
1. **User Creation**: KYC hash + wallet address → User PDA (compressed account)
2. **Purchase Flow**: 
   - User USDC amount girmek istiyor
   - GRAIL API transaction oluşturuyor
   - User kendi wallet'ı ile imzalıyor
   - API blockchain'e submit ediyor
3. **Balances**: Kullanıcı kendi wallet'ında GOLD tutuyor (Self-Custody)

#### Key Technical Details
- **API Type**: REST API with transaction creation
- **Auth**: API Key + Executive Authority Wallet (partner)
- **User PDA**: Compressed account (KYC hash ↔ wallet link)
- **Gold Token**: SPL token, directly in user wallet
- **Transaction Signing**: User signs with Phantom/Solflare

#### Required API Operations
1. **Create User**: `POST /users` (KYC hash + wallet address)
2. **Purchase Gold**: `POST /purchases` (amount, userId) → returns transaction
3. **Get Price**: Price feed/quote endpoint
4. **Get Balance**: On-chain SPL token balance check
5. **Transaction History**: Partner API'den çekilecek

### Solana Integration Patterns
- **Wallet Adapter**: `@solana/wallet-adapter-react` (Phantom + Solflare)
- **Connection**: `@solana/web3.js` ( Connection, PublicKey, Transaction)
- **Token Operations**: `@solana/spl-token` (ATA checks, balance queries)
- **Transaction Flow**:
  1. API'den transaction al
  2. Wallet adapter ile imzala
  3. Connection ile gönder
  4. Confirm et

### Project Context
- Working directory: `C:\Users\anıl\Desktop\oro` (boş, yeni proje)
- **No existing codebase** - greenfield development
- Need to create everything from scratch

## Technical Decisions - FINALIZED

### 1. Tech Stack ✅
- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS + shadcn/ui
- **State**: React Query (server) + Zustand (client)
- **Wallet**: @solana/wallet-adapter-react

### 2. Wallet Integration ✅
- **Primary**: Phantom (most popular)
- **Secondary**: Solflare
- **Adapter**: @solana/wallet-adapter-react

### 3. Solana Network ✅
- **Devnet**: MVP development + testing
- **Mainnet**: Production deployment (ileride)

### 4. Round-up Logic ✅
**Pattern**: "Round UP to nearest"
- **Round to 1**: $3.20 → $4.00 (round up $0.80)
- **Round to 5**: $3.20 → $5.00 (round up $1.80)
- **Round to 10**: $3.20 → $10.00 (round up $6.80)
- **Amount to invest**: Round up farkı (spare change)

### 5. GRAIL API Integration Plan
- **Environment**: Devnet first
- **Auth**: API Key in environment variables
- **User Flow**: Create user on first connect → Purchase via API
- **Error Handling**: Retry logic, user feedback, transaction status polling

## Implementation Phases

### Phase 1: Foundation (Day 1-2)
- Next.js setup + Tailwind + shadcn/ui
- Wallet adapter configuration
- Basic layout + navigation
- Project structure

### Phase 2: Core UI (Day 3-4)
- Amount input component
- Round-up rule selector (1/5/10)
- Calculation logic
- Confirmation screen

### Phase 3: GRAIL Integration (Day 5-7)
- API client setup
- User creation flow
- Purchase transaction flow
- Success/failure states

### Phase 4: Portfolio (Week 2)
- GOLD balance display (on-chain query)
- Transaction history
- Error handling polish
- UX improvements

### Phase 5: Deployment (Week 2)
- Vercel deployment
- Environment variables
- README + demo video
- Final QA

## Critical Implementation Notes

### 1. Tech Stack
**Options**:
- **Next.js 14 (App Router)**: SSR, API routes, optimal SEO
- **Vite + React**: Lightweight, fast dev, pure client-side
- **Pure React (CRA)**: Simple but outdated

*My recommendation*: Next.js 14 - deployment ve API entegrasyonu için en iyisi

### 2. Wallet Integration
**Options**:
- **Phantom** (most popular, 3M+ users)
- **Solflare** (alternative, good UX)
- **Both** (maximum compatibility)

### 3. GRAIL API Access
- **CRITICAL**: Do you have GRAIL API credentials/access?
- **API Documentation**: Can you share GRAIL API docs or give access?
- **Test Environment**: Is there a devnet/testnet version?

### 4. Solana Network
- **Devnet**: Free, fast, good for development
- **Mainnet**: Real money, real transactions, higher stakes

### 5. Styling Approach
- **Tailwind CSS**: Fast, utility-first, consistent
- **Component Library**: shadcn/ui, Chakra UI, or custom?

### 6. State Management
- **React Query**: Server state (API calls, quotes)
- **Zustand**: Client state (wallet, UI)
- **Context**: Simple, built-in

### 7. Testing Strategy
- **Unit Tests**: Vitest + React Testing Library?
- **E2E Tests**: Playwright for critical flows?
- **Manual QA**: Sufficient for MVP?

## Technical Decisions Pending
- [ ] Frontend framework (awaiting your input)
- [ ] Wallet adapter choice (awaiting your input)
- [ ] GRAIL API credentials (awaiting your input)
- [ ] Network (Devnet vs Mainnet)
- [ ] Styling approach
- [ ] State management
- [ ] Testing strategy

---

*This draft will be updated after each conversation turn and research result.*
