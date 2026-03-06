# Oro

A modern web application for purchasing tokenized gold on the Solana blockchain. Oro connects users to the Grail protocol, enabling seamless gold acquisition with crypto payments.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Next.js](https://img.shields.io/badge/Next.js-15-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)
![Solana](https://img.shields.io/badge/Solana-Compatible-green)

---

## Table of Contents

- [Overview](#overview)
- [Screenshots](#screenshots)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Installation](#installation)
- [Environment Variables](#environment-variables)
- [Architecture](#architecture)
- [Testing](#testing)
- [Deployment](#deployment)
- [Contributing](#contributing)
- [License](#license)

---

## Overview

Oro provides a clean, intuitive interface for users to:

- Connect their Solana wallet
- View real-time gold quotes
- Purchase tokenized gold using supported payment tokens
- Track transaction status from quote to confirmation
- Monitor their gold holdings

The application integrates with the Grail API for gold pricing, transaction processing, and blockchain settlement.

---

## Screenshots

> Add screenshots to the `public/screenshots/` directory and update the paths below.

### Dashboard

![Dashboard](public/screenshots/dashboard.png)
*Main dashboard showing gold price and portfolio overview*

### Purchase Flow

![Purchase](public/screenshots/purchase.png)
*Step-by-step gold purchase interface*

### Transaction History

![History](public/screenshots/history.png)
*Transaction history and status tracking*

### Wallet Connection

![Wallet](public/screenshots/wallet.png)
*Solana wallet connection modal*

---

## Features

### Core Functionality

- **Wallet Integration**: Seamless Solana wallet connection with automatic balance fetching
- **Devnet Connection**: Full support for Solana Devnet for risk-free testing and development
- **Real-time Quotes**: Live gold pricing with transparent fee breakdown
- **Secure Transactions**: Multi-step purchase flow with transaction signing
- **Status Tracking**: Real-time updates on transaction progress
- **Portfolio Tracking**: Detailed dashboard for monitoring gold holdings and historical performance
- **Responsive Design**: Optimized for desktop and mobile devices

### Technical Features

- **Type Safety**: Full TypeScript coverage across the codebase
- **State Management**: Zustand for efficient client-side state
- **Data Fetching**: TanStack Query for server state and caching
- **Error Handling**: Comprehensive error boundaries and retry logic
- **Testing**: Unit tests with Vitest, E2E tests with Playwright

---

## Tech Stack

### Frontend

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript 5
- **Styling**: CSS Modules / Tailwind CSS
- **State**: Zustand with persistence
- **Data**: TanStack React Query

### Blockchain

- **Network**: Solana
- **SDK**: @solana/web3.js, @solana/spl-token
- **Integration**: Wallet adapter for connection management

### API

- **Client**: Axios with custom retry logic
- **Backend**: Grail API for gold services

### Testing

- **Unit**: Vitest with jsdom
- **E2E**: Playwright (Chromium, Firefox, WebKit, Mobile)
- **Mocking**: MSW for API mocking

### Infrastructure

- **Hosting**: Vercel
- **CI/CD**: GitHub Actions
- **Monitoring**: Playwright reports, coverage reports

---

## Installation

### Prerequisites

- Node.js 18+ 
- npm 9+ or pnpm 8+
- Git

### Setup Steps

1. Clone the repository:

```bash
git clone https://github.com/your-org/oro.git
cd oro
```

2. Install dependencies:

```bash
npm install
```

3. Set up environment variables:

```bash
cp .env.example .env.local
```

Edit `.env.local` with your configuration values.

4. Run the development server:

```bash
npm run dev
```

The application will be available at `http://localhost:3000`.

### Verify Installation

Run the test suite to ensure everything is working:

```bash
# Unit tests
npm run test

# E2E tests (requires dev server running)
npm run test:e2e

# Type checking
npm run type-check
```

---

## Environment Variables

### Required Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `NEXT_PUBLIC_GRAIL_API_URL` | Grail API base URL | `https://api.grail.oro.finance/v1` |
| `NEXT_PUBLIC_GRAIL_API_KEY` | API key for Grail services | `gr_live_...` |
| `GRAIL_API_URL` | Server-side Grail API URL | `https://api.grail.oro.finance/v1` |
| `GRAIL_API_KEY` | Server-side API key | `gr_live_...` |

### Optional Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `NEXT_PUBLIC_SOLANA_RPC_URL` | Solana RPC endpoint | `https://api.mainnet-beta.solana.com` |
| `NEXT_PUBLIC_APP_ENV` | Application environment | `development` |
| `NEXT_PUBLIC_GA_ID` | Google Analytics ID | - |

### Environment Files

Create these files in your project root:

**.env.local** (local development):
```bash
NEXT_PUBLIC_GRAIL_API_URL=https://api.grail.oro.finance/v1
NEXT_PUBLIC_GRAIL_API_KEY=your_api_key_here
GRAIL_API_URL=https://api.grail.oro.finance/v1
GRAIL_API_KEY=your_api_key_here
```

**.env.production** (production):
```bash
NEXT_PUBLIC_GRAIL_API_URL=https://api.grail.oro.finance/v1
NEXT_PUBLIC_GRAIL_API_KEY=gr_live_...
GRAIL_API_URL=https://api.grail.oro.finance/v1
GRAIL_API_KEY=gr_live_...
```

---

## Architecture

For detailed architecture documentation, see [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md).

### High-Level Overview

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│   Next.js App   │────▶│   React Query   │────▶│   Grail API     │
│   (Frontend)    │     │   (Data Layer)  │     │   (Backend)     │
└─────────────────┘     └─────────────────┘     └─────────────────┘
         │                                              │
         │                                              ▼
         │                                       ┌─────────────────┐
         │                                       │   Solana        │
         ▼                                       │   Blockchain    │
┌─────────────────┐                              └─────────────────┐
│   Zustand Store │
│   (State)       │
└─────────────────┘
```

### Key Components

- **Purchase Flow**: Multi-step wizard for gold purchases
- **Wallet Store**: Manages wallet connection and balances
- **Grail Client**: API client with retry logic and error handling
- **Error Boundary**: Catches and displays runtime errors gracefully

---

## Testing

### Unit Tests

Run unit tests with Vitest:

```bash
# Run tests
npm run test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

Coverage thresholds are configured at 80% for all metrics.

### E2E Tests

Run end-to-end tests with Playwright:

```bash
# Run all E2E tests
npm run test:e2e

# Run tests in headed mode (visible browser)
npm run test:e2e:headed

# Run tests in UI mode
npm run test:e2e:ui

# Run specific test file
npx playwright test e2e/purchase.spec.ts
```

Playwright is configured to test on:
- Desktop Chrome, Firefox, Safari
- Mobile Chrome (Pixel 5)
- Mobile Safari (iPhone 12)

### Test Structure

```
src/
├── lib/
│   ├── calculations.test.ts    # Unit tests for math utils
│   └── utils.test.ts           # Unit tests for helpers
├── store/
│   └── walletStore.test.ts     # Store logic tests
└── mocks/
    ├── handlers.ts             # MSW request handlers
    └── server.ts               # Mock server setup

e2e/
├── purchase.spec.ts            # Purchase flow E2E tests
└── wallet.spec.ts              # Wallet connection tests
```

---

## Deployment

For detailed deployment instructions, see [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md).

### Vercel (Recommended)

1. Connect your GitHub repository to Vercel
2. Configure environment variables in Vercel dashboard
3. Deploy on push to main branch

### Manual Deployment

```bash
# Build the application
npm run build

# Start production server
npm start
```

---

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/my-feature`
3. Make your changes with tests
4. Run the test suite: `npm run test && npm run test:e2e`
5. Commit your changes: `git commit -am 'Add my feature'`
6. Push to the branch: `git push origin feature/my-feature`
7. Submit a pull request

### Code Style

- Follow the existing TypeScript patterns
- Write tests for new functionality
- Update documentation for API changes
- Use meaningful commit messages

---

## License

MIT License - see [LICENSE](LICENSE) for details.

---

## Support

For questions or issues:

- Open an issue on GitHub
- Contact the team at support@oro.finance
- Check the [API documentation](docs/API.md)

---

## Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- Powered by [Solana](https://solana.com/)
- Gold pricing by [Grail](https://grail.oro.finance/)
