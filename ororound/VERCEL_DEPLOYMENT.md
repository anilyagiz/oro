# Vercel Deployment Guide - OroRound

## Quick Start

OroRound is deployed to: **https://ororound.vercel.app**

## Required Environment Variables

Go to **Vercel Dashboard > Your Project > Settings > Environment Variables** and add:

### Required (App won't work without these)

| Variable | Description | Example Value |
|----------|-------------|---------------|
| `GRAIL_API_KEY` | Server-side API key from Grail team | `grail_live_xxxxx` |
| `GRAIL_API_URL` | Grail API endpoint | `https://oro-tradebook-mainnet.up.railway.app` |
| `NEXT_PUBLIC_GRAIL_API_URL` | Same as above (client-side) | `https://oro-tradebook-mainnet.up.railway.app` |
| `NEXT_PUBLIC_SOLANA_RPC_URL` | Solana RPC endpoint | `https://api.mainnet-beta.solana.com` |
| `NEXT_PUBLIC_SOLANA_NETWORK` | Network to use | `mainnet-beta` or `devnet` |

### Recommended

| Variable | Description | Example Value |
|----------|-------------|---------------|
| `NEXT_PUBLIC_GOLD_MINT` | GOLD token mint address | Get from Grail team |
| `NEXT_PUBLIC_APP_URL` | Your app URL | `https://ororound.vercel.app` |

### Optional (Monitoring & Analytics)

| Variable | Description |
|----------|-------------|
| `SENTRY_DSN` | Sentry error tracking DSN |
| `SENTRY_AUTH_TOKEN` | Sentry auth token for source maps |
| `NEXT_PUBLIC_SENTRY_DSN` | Client-side Sentry DSN |
| `NEXT_PUBLIC_GA_ID` | Google Analytics ID |

## Deployment Steps

### 1. Connect Repository
1. Go to [vercel.com](https://vercel.com)
2. Import your GitHub repository
3. Vercel will auto-detect Next.js

### 2. Configure Build Settings
The `vercel.json` at root level already configures:
- Build command: `cd ororound && npm run build`
- Output directory: `ororound/.next`
- Install command: `npm install && cd ororound && npm install`

### 3. Add Environment Variables
Add all required variables in Vercel Dashboard.

**For different environments:**
- **Production**: Use mainnet values
- **Preview**: Use devnet values for testing

### 4. Deploy
Push to `main` branch for production deployment.

## Wallet Connection

The app supports:
- **Phantom Wallet**
- **Solflare Wallet**

Users need a Solana wallet browser extension installed. The wallet modal will appear when they click "Select Wallet".

## Blockchain Flow

1. User connects wallet → Creates Grail user profile
2. User enters spend amount → Gets live gold quote
3. User clicks "Buy GOLD" → 
   - API creates purchase transaction
   - User signs with wallet
   - Transaction submitted to Solana
   - Reported back to Grail API
4. Portfolio shows completed transactions

## Troubleshooting

### Wallet not connecting
- Check if Phantom/Solflare extension is installed
- Check CSP headers allow wallet domains
- Check browser console for errors

### API errors
- Verify `GRAIL_API_KEY` is set correctly
- Check if `GRAIL_API_URL` is reachable
- Check Vercel function logs

### Transaction failures
- Ensure user has enough SOL for gas
- Ensure user has USDC for purchase
- Check Solana network status

## Network Configuration

### For Devnet Testing
```
GRAIL_API_URL=https://oro-tradebook-devnet.up.railway.app
NEXT_PUBLIC_GRAIL_API_URL=https://oro-tradebook-devnet.up.railway.app
NEXT_PUBLIC_SOLANA_RPC_URL=https://api.devnet.solana.com
NEXT_PUBLIC_SOLANA_NETWORK=devnet
```

### For Mainnet Production
```
GRAIL_API_URL=https://oro-tradebook-mainnet.up.railway.app
NEXT_PUBLIC_GRAIL_API_URL=https://oro-tradebook-mainnet.up.railway.app
NEXT_PUBLIC_SOLANA_RPC_URL=https://api.mainnet-beta.solana.com
NEXT_PUBLIC_SOLANA_NETWORK=mainnet-beta
```

**⚠️ For production, use a dedicated RPC provider (Helius, QuickNode, Alchemy) instead of public endpoints!**

## Getting API Keys

1. **Grail API Key**: Contact the Grail/Oro Finance team
2. **Solana RPC**: Sign up at [Helius](https://helius.xyz), [QuickNode](https://quicknode.com), or [Alchemy](https://alchemy.com)
3. **Sentry**: Create project at [sentry.io](https://sentry.io)
