# OroRound MVP - Complete Work Plan

## TL;DR

> **Quick Summary**: Build a minimal, working OroRound MVP that demonstrates real USDC → GOLD conversion using Oro's GRAIL API. Users enter an amount, choose round-up rules (nearest 1/5/10), and instantly buy GOLD with their spare change.
> 
> **Deliverables**: 
> - Next.js 14 web app with wallet connection (Phantom/Solflare)
> - Amount input + round-up calculation UI
> - GRAIL API integration (user creation, purchase flow)
> - Portfolio screen (GOLD balance + transaction history)
> - Error handling (failed quotes, insufficient balance, retry)
> - Public demo deployment on Vercel
> 
> **Estimated Effort**: Large (2-week sprint, ~25 tasks)
> **Parallel Execution**: YES - 5 waves
> **Critical Path**: Project Setup → Wallet Adapter → GRAIL API Client → Purchase Flow → Final QA

---

## Context

### Original Request
"Automatically convert spare change from everyday spending into GOLD on Solana using Oro's GRAIL API. Build a minimal MVP with simple flow: enter amount → round it → buy gold. Focus on non-crypto-native UX."

### Interview Summary
**Key Discussions**:
- **Tech Stack**: Next.js 14 (App Router) + TypeScript + Tailwind CSS + shadcn/ui
- **Wallet Integration**: Phantom + Solflare via @solana/wallet-adapter-react
- **GRAIL API Model**: Self-Custody (users hold GOLD in their own wallets)
- **Network**: Devnet for MVP development, Mainnet for production
- **Round-up Logic**: Up to nearest 1/5/10, invest the difference (spare change)
- **Timeline**: 2 weeks (Milestone 1: Working MVP, Milestone 2: Polish + Demo)

### Metis Review - Critical Gaps Identified
**Identified Gaps** (addressed in this plan):
- [x] **GRAIL API Access**: Added as Wave 0 task - must validate before coding
- [x] **KYC Flow**: Clarified - GRAIL handles KYC, app only provides KYC hash
- [x] **Scope Guardrails**: Explicit boundaries set (no backend DB, no fiat on-ramp, etc.)
- [x] **Error Handling**: Comprehensive retry logic and user feedback included
- [x] **Edge Cases**: Concurrent transactions, zero round-up, network switches covered
- [x] **Acceptance Criteria**: Detailed QA scenarios for every task

**Risk Mitigation**:
- GRAIL API sandbox validation before implementation
- Fallback to mock data for UI development if API unavailable
- Devnet testing with clear "TESTNET" banners

---

## Work Objectives

### Core Objective
Ship a minimal, working OroRound MVP that demonstrates a real USDC → GOLD conversion flow using Oro's GRAIL API with a simple, non-crypto-native UX.

### Concrete Deliverables
1. **Web Application**: Next.js 14 app with responsive design
2. **Wallet Integration**: Phantom + Solflare connection on Devnet
3. **Round-up Feature**: Amount input with 1/5/10 rounding rules
4. **GRAIL Integration**: User creation + purchase transaction flow
5. **Portfolio Screen**: GOLD balance (on-chain) + transaction history
6. **Error Handling**: Failed quote, insufficient balance, retry mechanisms
7. **Deployment**: Public Vercel demo with documentation

### Definition of Done
- [ ] User can connect wallet (Phantom/Solflare)
- [ ] User can enter amount and see round-up calculation
- [ ] User can complete GOLD purchase end-to-end
- [ ] Portfolio shows accurate GOLD balance
- [ ] All error states handled gracefully
- [ ] Deployed and publicly accessible
- [ ] README with setup instructions

### Must Have (Non-Negotiable)
- [x] Wallet connection (Phantom minimum)
- [x] Amount input with validation (0.01 - 10,000 USDC)
- [x] Round-up calculation (nearest 1/5/10)
- [x] GRAIL API integration for purchases
- [x] Transaction success/failure feedback
- [x] GOLD balance display
- [x] Transaction history (last 20)
- [x] Error handling for all API failures
- [x] Devnet-only operation (clearly labeled)
- [x] Mobile-responsive UI

### Must NOT Have (Guardrails from Metis)
- [ ] **NO** backend database (LocalStorage for settings only)
- [ ] **NO** fiat on-ramp (assume user has USDC)
- [ ] **NO** recurring/automated purchases
- [ ] **NO** multi-chain support (Solana only)
- [ ] **NO** other payment tokens (USDC only)
- [ ] **NO** complex portfolio analytics/charts
- [ ] **NO** social features/sharing
- [ ] **NO** price alerts/notifications
- [ ] **NO** DCA strategies
- [ ] **NO** custom round-up amounts (1/5/10 only)

### Accessibility Requirements (WCAG 2.1 AA)
- [ ] All interactive elements keyboard accessible
- [ ] ARIA labels on all form inputs
- [ ] Focus indicators visible
- [ ] Color contrast minimum 4.5:1
- [ ] Screen reader announcements for async operations
- [ ] Reduced motion support
- [ ] Alt text on all images/icons

---

## Technical Architecture

### Rate Limiting & Caching Strategy
**GRAIL API Rate Limits**:
- Quote endpoint: 60 requests/minute per IP
- Purchase endpoint: 10 requests/minute per user
- Status polling: Max 1 request/5 seconds

**Caching Strategy**:
- **Quote cache**: 30 seconds (React Query staleTime)
- **Balance cache**: 10 seconds (frequent updates expected)
- **Transaction history**: 60 seconds
- **User profile**: 5 minutes

**Rate Limiting Implementation**:
- Exponential backoff on 429 errors
- Client-side debounce on rapid user actions
- Queue system for concurrent requests

### Error Recovery & State Persistence
**Transaction State Recovery**:
- Store pending transaction ID in LocalStorage
- On page reload, check for pending transactions
- Auto-resume polling if transaction pending
- Clear storage on confirmed/failed status

**Wallet Connection Recovery**:
- Reconnect wallet automatically if session valid
- Preserve form state (amount, round-up selection)
- Show "Resume Transaction" modal if interrupted

### Analytics & Monitoring (Optional but Recommended)
**Events to Track**:
- Wallet connect/disconnect
- Amount entered, round-up selected
- Quote viewed, purchase initiated
- Transaction success/failure
- Page views, navigation

**Tools**: 
- Mixpanel or PostHog for product analytics
- Vercel Analytics for performance
- Console error logging

**Privacy**: 
- No PII stored in analytics
- Wallet addresses hashed/anonymized
- Opt-out support

---

## Verification Strategy

> **ZERO HUMAN INTERVENTION** — ALL verification is agent-executed. No exceptions.
> Acceptance criteria requiring "user manually tests/confirms" are FORBIDDEN.

### Test Decision
- **Infrastructure exists**: NO (greenfield project)
- **Automated tests**: Tests-after (unit + integration tests in final wave)
- **Framework**: Vitest + React Testing Library + Playwright (E2E)
- **If TDD**: Each critical task follows RED (failing test) → GREEN (minimal impl) → REFACTOR

### QA Policy
Every task MUST include agent-executed QA scenarios (see TODO template below).
Evidence saved to `.sisyphus/evidence/task-{N}-{scenario-slug}.{ext}`.

- **Frontend/UI**: Use Playwright (playwright skill) — Navigate, interact, assert DOM, screenshot
- **API/Backend**: Use Bash (curl) — Send requests, assert status + response fields
- **Wallet/Blockchain**: Use mock transactions + verify UI states
- **E2E Flows**: Playwright full user journey tests

---

## Execution Strategy

### Parallel Execution Waves

```
WAVE 0 (Pre-Flight — GRAIL Validation):
├── Task 0.1: Validate GRAIL API access and get sandbox keys
└── Task 0.2: Document GRAIL API endpoints and authentication

WAVE 1 (Foundation — Setup + Scaffolding):
├── Task 1.1: Initialize Next.js 14 project with TypeScript
├── Task 1.2: Configure Tailwind CSS + shadcn/ui
├── Task 1.3: Set up project structure and folder organization
├── Task 1.4: Configure environment variables (.env.local template)
└── Task 1.5: Add linting and formatting (ESLint, Prettier)

WAVE 2 (Core Infrastructure — Wallet + State):
├── Task 2.1: Install and configure @solana/wallet-adapter-react
├── Task 2.2: Create WalletConnection component
├── Task 2.3: Set up Zustand store (wallet state, UI state)
├── Task 2.4: Set up React Query (server state, API caching)
├── Task 2.5: Create Devnet banner and network indicator
└── Task 2.6: Add error boundary for wallet/SDK crashes

WAVE 3 (UI Components — Core Interface):
├── Task 3.1: Create AmountInput component with validation
├── Task 3.2: Create RoundUpSelector component (1/5/10)
├── Task 3.3: Implement round-up calculation logic
├── Task 3.4: Create TransactionPreview component
├── Task 3.5: Build main page layout and navigation
└── Task 3.6: Add loading states and skeletons

WAVE 4 (GRAIL Integration — API + Transactions):
├── Task 4.1: Create GRAIL API client (axios/fetch wrapper)
├── Task 4.2: Implement user creation flow (KYC hash + wallet)
├── Task 4.3: Implement quote/price endpoint integration
├── Task 4.4: Create purchase transaction flow
├── Task 4.5: Add transaction status polling
├── Task 4.6: Implement error handling and retry logic
└── Task 4.7: Add transaction success/failure states

WAVE 5 (Portfolio + History):
├── Task 5.1: Create GOLD balance query (on-chain SPL token)
├── Task 5.2: Build BalanceDisplay component
├── Task 5.3: Create transaction history list
├── Task 5.4: Add pull-to-refresh / manual refresh
├── Task 5.5: Create portfolio page layout
└── Task 5.6: Add empty states and loading states

WAVE 6 (Testing + QA):
├── Task 6.1: Write unit tests for calculation logic
├── Task 6.2: Write integration tests for GRAIL client
├── Task 6.3: Create Playwright E2E tests (critical flows)
├── Task 6.4: Test error scenarios and edge cases
└── Task 6.5: Performance audit and optimization

WAVE 7 (Deployment + Documentation):
├── Task 7.1: Configure Vercel deployment
├── Task 7.2: Set up production environment variables
├── Task 7.3: Write comprehensive README
├── Task 7.4: Create demo walkthrough (screenshots/Loom)
└── Task 7.5: Final QA and bug fixes

WAVE FINAL (After ALL tasks — independent review, 4 parallel):
├── Task F1: Plan compliance audit (oracle)
├── Task F2: Code quality review (unspecified-high)
├── Task F3: Real manual QA (unspecified-high + playwright)
└── Task F4: Scope fidelity check (deep)

Critical Path: Wave 0 → Wave 1 → Wave 2 → Wave 4 → Wave 5 → Wave 7 → F1-F4
Parallel Speedup: ~60% faster than sequential
Max Concurrent: 6 (Wave 1 & 2 & 3 can overlap partially)
```

### Dependency Matrix

| Task | Depends On | Blocks | Parallel Group |
|------|-----------|--------|----------------|
| 0.1 | — | 0.2, 4.x | Wave 0 |
| 1.1-1.5 | — | 2.x, 3.x | Wave 1 |
| 2.1-2.6 | 1.x | 3.x, 4.x | Wave 2 |
| 3.1-3.6 | 1.x, 2.x | 4.x | Wave 3 |
| 4.1-4.7 | 0.x, 2.x | 5.x, 6.x | Wave 4 |
| 5.1-5.6 | 2.x, 4.x | 6.x | Wave 5 |
| 6.1-6.5 | All impl | 7.x | Wave 6 |
| 7.1-7.5 | All above | F1-F4 | Wave 7 |
| F1-F4 | All above | — | Wave FINAL |

### Agent Dispatch Summary

- **Wave 0**: 2 tasks → `quick` (API validation)
- **Wave 1**: 5 tasks → `quick` (setup)
- **Wave 2**: 6 tasks → `unspecified-high` (wallet + state)
- **Wave 3**: 6 tasks → `visual-engineering` (UI components)
- **Wave 4**: 7 tasks → `deep` (GRAIL API integration)
- **Wave 5**: 6 tasks → `visual-engineering` (portfolio)
- **Wave 6**: 5 tasks → `unspecified-high` (testing)
- **Wave 7**: 5 tasks → `quick` (deployment)
- **Wave FINAL**: 4 tasks → mixed (oracle, deep, etc.)

---

## TODOs

- [ ] **0.1. Validate GRAIL API Access and Get Sandbox Keys**

  **What to do**:
  - Contact GRAIL team (via Oro discord/docs) to request API access
  - Obtain sandbox/devnet API keys
  - Document all available endpoints
  - Verify Self-Custody model is available on devnet
  - Get example integration code if available
  - Test API connectivity with simple curl request

  **Must NOT do**:
  - Do NOT proceed to coding if API access is not confirmed
  - Do NOT use production keys on devnet
  - Do NOT skip this validation step

  **Recommended Agent Profile**:
  - **Category**: `quick`
  - **Skills**: None (research task)
  - **Reason**: API validation is a research/setup task requiring communication with external team

  **Parallelization**:
  - **Can Run In Parallel**: YES (with project setup prep)
  - **Parallel Group**: Wave 0
  - **Blocks**: 0.2, 4.x (all GRAIL integration tasks)
  - **Blocked By**: None

  **References**:
  - GRAIL Docs: https://docs.grail.oro.finance/
  - LLMs.txt: https://docs.grail.oro.finance/llms.txt
  - Oro Discord: Check for API support channel
  - Email: Contact Oro team for partner access

  **Acceptance Criteria**:
  - [ ] API key obtained for devnet/sandbox
  - [ ] List of confirmed endpoints (users, purchases, quotes)
  - [ ] Authentication method documented
  - [ ] Test request successful (200 OK)
  - [ ] Example response format documented

  **QA Scenarios**:
  ```
  Scenario: API connectivity test
    Tool: Bash (curl)
    Preconditions: API key available
    Steps:
      1. curl -H "Authorization: Bearer $GRAIL_API_KEY" https://api.grail.oro.finance/v1/health
      2. Verify response status is 200
    Expected Result: API returns healthy status
    Evidence: .sisyphus/evidence/task-0-1-api-health.json
  ```

  **Commit**: NO (documentation only)

---

- [ ] **0.2. Document GRAIL API Endpoints and Authentication**

  **What to do**:
  - Create `/docs/grail-api.md` with complete API documentation
  - Document authentication flow (API key + wallet signing)
  - Document request/response formats for each endpoint:
    - POST /users (create user with KYC hash + wallet)
    - POST /purchases (create purchase transaction)
    - GET /quotes (get GOLD price quote)
    - GET /transactions/:id (get transaction status)
  - Document error codes and handling
  - Create TypeScript interfaces for all API types

  **Must NOT do**:
  - Do NOT hardcode API keys in documentation
  - Do NOT skip error scenarios
  - Do NOT use outdated endpoint versions

  **Recommended Agent Profile**:
  - **Category**: `writing`
  - **Skills**: None
  - **Reason**: Documentation task requiring clear technical writing

  **Parallelization**:
  - **Can Run In Parallel**: YES (with Wave 1 setup)
  - **Parallel Group**: Wave 0
  - **Blocks**: 4.x (GRAIL integration)
  - **Blocked By**: 0.1

  **References**:
  - GRAIL Docs: https://docs.grail.oro.finance/
  - Self-Custody Model docs: User creation + purchase flow
  - OpenAPI spec (if provided by GRAIL)

  **Acceptance Criteria**:
  - [ ] `/docs/grail-api.md` created with full documentation
  - [ ] All endpoints documented with examples
  - [ ] TypeScript interfaces in `/types/grail.ts`
  - [ ] Error handling guide included
  - [ ] Authentication flow documented

  **QA Scenarios**:
  ```
  Scenario: Documentation completeness check
    Tool: Read tool
    Preconditions: Task 0.1 completed
    Steps:
      1. Read /docs/grail-api.md
      2. Verify all 4 endpoints documented
      3. Verify TypeScript interfaces exist
    Expected Result: Complete API documentation
    Evidence: .sisyphus/evidence/task-0-2-docs-check.md
  ```

  **Commit**: YES
  - Message: `docs(grail): add API documentation and TypeScript interfaces`
  - Files: `docs/grail-api.md, types/grail.ts`

---

- [ ] **1.1. Initialize Next.js 14 Project with TypeScript**

  **What to do**:
  - Create new Next.js 14 project with App Router
  - Configure TypeScript with strict mode
  - Set up src directory structure
  - Configure tsconfig.json with path aliases (@/*)
  - Initialize Git repository
  - Add .gitignore for Next.js + Node

  **Must NOT do**:
  - Do NOT use Pages Router (App Router required)
  - Do NOT skip TypeScript strict mode
  - Do NOT use older Next.js versions

  **Recommended Agent Profile**:
  - **Category**: `quick`
  - **Skills**: None
  - **Reason**: Standard project initialization

  **Parallelization**:
  - **Can Run In Parallel**: YES (after Wave 0 starts)
  - **Parallel Group**: Wave 1
  - **Blocks**: 1.2, 1.3, 1.4, 1.5
  - **Blocked By**: None

  **References**:
  - Next.js 14 docs: https://nextjs.org/docs
  - TypeScript config: https://www.typescriptlang.org/tsconfig

  **Acceptance Criteria**:
  - [ ] `npx create-next-app@14` completed
  - [ ] TypeScript strict mode enabled
  - [ ] Path aliases configured (@/* → ./src/*)
  - [ ] `npm run dev` starts successfully
  - [ ] Git repo initialized

  **QA Scenarios**:
  ```
  Scenario: Project starts successfully
    Tool: Bash
    Preconditions: Node.js 18+ installed
    Steps:
      1. cd ororound && npm run dev
      2. Wait 5 seconds
      3. curl http://localhost:3000
    Expected Result: Server responds with 200, default Next.js page
    Evidence: .sisyphus/evidence/task-1-1-server-start.log
  ```

  **Commit**: YES
  - Message: `chore(init): create Next.js 14 project with TypeScript`
  - Files: `*` (initial commit)

---

- [ ] **1.2. Configure Tailwind CSS + shadcn/ui**

  **What to do**:
  - Install and configure Tailwind CSS v3
  - Install shadcn/ui CLI and initialize
  - Configure tailwind.config.ts with custom colors (gold theme)
  - Add base components: Button, Card, Input, Select, Dialog
  - Set up dark mode support
  - Add custom CSS variables for theming

  **Must NOT do**:
  - Do NOT use Tailwind v4 (incompatible with shadcn)
  - Do NOT skip shadcn initialization
  - Do NOT add all components (only needed ones)

  **Recommended Agent Profile**:
  - **Category**: `visual-engineering`
  - **Skills**: None
  - **Reason**: UI styling and component library setup

  **Parallelization**:
  - **Can Run In Parallel**: NO (depends on 1.1)
  - **Parallel Group**: Wave 1
  - **Blocks**: 1.3, 3.x (all UI tasks)
  - **Blocked By**: 1.1

  **References**:
  - shadcn/ui docs: https://ui.shadcn.com/docs
  - Tailwind docs: https://tailwindcss.com/docs
  - Color palette: Gold (#FFD700), Dark (#1a1a1a), Accent (#3b82f6)

  **Acceptance Criteria**:
  - [ ] Tailwind CSS configured and working
  - [ ] shadcn/ui initialized with components.json
  - [ ] Gold theme colors in tailwind.config.ts
  - [ ] Base components installed: Button, Card, Input, Select, Dialog
  - [ ] Dark mode toggle works

  **QA Scenarios**:
  ```
  Scenario: UI components render correctly
    Tool: Playwright
    Preconditions: Dev server running
    Steps:
      1. Create test page with Button, Card, Input
      2. Navigate to test page
      3. Screenshot components
      4. Verify styling matches theme
    Expected Result: Components styled with gold theme
    Evidence: .sisyphus/evidence/task-1-2-components.png
  ```

  **Commit**: YES
  - Message: `feat(ui): add Tailwind CSS and shadcn/ui with gold theme`
  - Files: `tailwind.config.ts, components.json, app/globals.css, components/ui/*`

---

- [ ] **1.3. Set Up Project Structure and Folder Organization**

  **What to do**:
  - Create directory structure:
    ```
    src/
      app/           # Next.js App Router pages
      components/    # React components
        ui/          # shadcn components
        wallet/      # Wallet-related components
        purchase/    # Purchase flow components
        portfolio/   # Portfolio components
      hooks/         # Custom React hooks
      lib/           # Utility functions, API clients
      store/         # Zustand stores
      types/         # TypeScript types
      utils/         # Helper functions
    public/          # Static assets
    docs/            # Documentation
    ```
  - Add README to each folder explaining purpose
  - Set up barrel exports (index.ts) for clean imports

  **Must NOT do**:
  - Do NOT mix concerns (keep UI separate from business logic)
  - Do NOT skip folder READMEs
  - Do NOT use flat structure

  **Recommended Agent Profile**:
  - **Category**: `quick`
  - **Skills**: None
  - **Reason**: File organization task

  **Parallelization**:
  - **Can Run In Parallel**: NO (depends on 1.1)
  - **Parallel Group**: Wave 1
  - **Blocks**: All subsequent tasks
  - **Blocked By**: 1.1

  **References**:
  - Next.js project structure: https://nextjs.org/docs/getting-started/project-structure
  - Feature-based organization pattern

  **Acceptance Criteria**:
  - [ ] All directories created
  - [ ] README files in each major folder
  - [ ] Barrel exports configured
  - [ ] Import paths work correctly

  **QA Scenarios**:
  ```
  Scenario: Import paths work
    Tool: TypeScript compiler
    Preconditions: Project initialized
    Steps:
      1. Create test file importing from @/components, @/lib, @/store
      2. Run tsc --noEmit
    Expected Result: No TypeScript errors
    Evidence: .sisyphus/evidence/task-1-3-imports.log
  ```

  **Commit**: YES
  - Message: `chore(structure): add project folder organization`
  - Files: `src/**/index.ts, src/**/README.md`

---

- [ ] **1.4. Configure Environment Variables (.env.local template)**

  **What to do**:
  - Create `.env.local.example` with all required variables
  - Add `.env.local` to .gitignore
  - Create environment validation schema (Zod)
  - Document each variable in README
  - Add runtime env checks in app startup

  **Must NOT do**:
  - Do NOT commit actual .env.local with secrets
  - Do NOT skip validation
  - Do NOT use process.env directly in components

  **Recommended Agent Profile**:
  - **Category**: `quick`
  - **Skills**: None
  - **Reason**: Configuration task

  **Parallelization**:
  - **Can Run In Parallel**: NO (depends on 1.1)
  - **Parallel Group**: Wave 1
  - **Blocks**: 2.x, 4.x (all tasks using env vars)
  - **Blocked By**: 1.1

  **References**:
  - Next.js env vars: https://nextjs.org/docs/app/building-your-application/configuring/environment-variables
  - Zod validation: https://zod.dev/

  **Acceptance Criteria**:
  - [ ] `.env.local.example` created with all vars
  - [ ] `.env.local` in .gitignore
  - [ ] Zod validation schema in `lib/env.ts`
  - [ ] Startup checks validate env vars
  - [ ] Documentation in README

  **QA Scenarios**:
  ```
  Scenario: Environment validation works
    Tool: Bash
    Preconditions: .env.local.example copied to .env.local
    Steps:
      1. Start dev server without GRAIL_API_KEY
      2. Verify app shows clear error message
      3. Add key and restart
      4. Verify app starts successfully
    Expected Result: Clear validation errors, then successful startup
    Evidence: .sisyphus/evidence/task-1-4-env-validation.log
  ```

  **Commit**: YES
  - Message: `chore(config): add environment variables and validation`
  - Files: `.env.local.example, lib/env.ts, .gitignore`

---

- [ ] **1.5. Add Linting and Formatting (ESLint, Prettier)**

  **What to do**:
  - Configure ESLint with Next.js config + TypeScript
  - Add Prettier with Tailwind plugin
  - Set up lint-staged + husky for pre-commit hooks
  - Add npm scripts: lint, lint:fix, format, format:check
  - Run initial lint/format on all files

  **Must NOT do**:
  - Do NOT skip pre-commit hooks
  - Do NOT use conflicting ESLint/Prettier rules
  - Do NOT ignore TypeScript errors

  **Recommended Agent Profile**:
  - **Category**: `quick`
  - **Skills**: None
  - **Reason**: Code quality setup

  **Parallelization**:
  - **Can Run In Parallel**: NO (depends on 1.1)
  - **Parallel Group**: Wave 1
  - **Blocks**: All subsequent tasks (code quality gate)
  - **Blocked By**: 1.1

  **References**:
  - Next.js ESLint: https://nextjs.org/docs/app/building-your-application/configuring/eslint
  - Prettier: https://prettier.io/docs/en/

  **Acceptance Criteria**:
  - [ ] ESLint configured with TypeScript support
  - [ ] Prettier configured with Tailwind plugin
  - [ ] Pre-commit hooks installed
  - [ ] All files pass lint check
  - [ ] npm scripts working

  **QA Scenarios**:
  ```
  Scenario: Linting and formatting works
    Tool: Bash
    Preconditions: Project set up
    Steps:
      1. Run npm run lint
      2. Run npm run format:check
      3. Verify no errors
    Expected Result: Clean exit code 0
    Evidence: .sisyphus/evidence/task-1-5-lint.log
  ```

  **Commit**: YES
  - Message: `chore(quality): add ESLint, Prettier, and pre-commit hooks`
  - Files: `.eslintrc.json, .prettierrc, .husky/*, package.json`
