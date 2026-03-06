import { z } from 'zod';

// ─── Server-only environment variables ───
// These MUST NEVER be exposed to the client.
// This file should ONLY be imported from API routes or server components.

const serverEnvSchema = z.object({
  GRAIL_API_KEY: z.string().min(1, 'GRAIL_API_KEY is required'),
  GRAIL_API_URL: z
    .string()
    .url()
    .default('https://oro-tradebook-mainnet.up.railway.app'),
});

let _serverEnv: z.infer<typeof serverEnvSchema> | null = null;

export function getServerEnv() {
  if (_serverEnv) return _serverEnv;

  _serverEnv = serverEnvSchema.parse({
    GRAIL_API_KEY: process.env.GRAIL_API_KEY,
    GRAIL_API_URL: process.env.GRAIL_API_URL,
  });

  return _serverEnv;
}

export type ServerEnv = z.infer<typeof serverEnvSchema>;
