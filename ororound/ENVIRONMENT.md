# Environment Configuration

Copy `.env.local.example` to `.env.local` and fill values before running the app.

## Variables

- `NEXT_PUBLIC_GRAIL_API_URL`: GRAIL API base URL.
- `NEXT_PUBLIC_GRAIL_API_KEY`: Partner API key.
- `NEXT_PUBLIC_SOLANA_RPC_URL`: Solana RPC endpoint.
- `NEXT_PUBLIC_SOLANA_NETWORK`: `devnet`, `testnet`, or `mainnet-beta`.
- `NEXT_PUBLIC_GOLD_MINT`: GOLD token mint address on selected network.
- `NEXT_PUBLIC_APP_URL`: App URL for local/prod environments.

## Notes

- The app uses `src/lib/env.ts` for typed runtime parsing.
- If `NEXT_PUBLIC_GOLD_MINT` is not set, portfolio on-chain GOLD balance falls back to `0`.
