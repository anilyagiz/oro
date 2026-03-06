import { z } from 'zod';

// ─── Client-side environment variables ───
// These are safe to expose to the browser (no secrets!)
const clientEnvSchema = z.object({
  NEXT_PUBLIC_GRAIL_API_URL: z
    .string()
    .url()
    .default('https://oro-tradebook-mainnet.up.railway.app'),
  NEXT_PUBLIC_SOLANA_RPC_URL: z.string().url().default('https://api.mainnet-beta.solana.com'),
  NEXT_PUBLIC_SOLANA_NETWORK: z.enum(['devnet', 'testnet', 'mainnet-beta']).default('mainnet-beta'),
  NEXT_PUBLIC_GOLD_MINT: z.string().optional(),
  NEXT_PUBLIC_APP_URL: z.string().url().optional(),
});

export const env = clientEnvSchema.parse({
  NEXT_PUBLIC_GRAIL_API_URL: process.env.NEXT_PUBLIC_GRAIL_API_URL,
  NEXT_PUBLIC_SOLANA_RPC_URL: process.env.NEXT_PUBLIC_SOLANA_RPC_URL,
  NEXT_PUBLIC_SOLANA_NETWORK: process.env.NEXT_PUBLIC_SOLANA_NETWORK,
  NEXT_PUBLIC_GOLD_MINT: process.env.NEXT_PUBLIC_GOLD_MINT,
  NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
});

export type Env = z.infer<typeof clientEnvSchema>;
