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
let _validated = false;

export function getServerEnv() {
  if (_serverEnv) return _serverEnv;

  try {
    _serverEnv = serverEnvSchema.parse({
      GRAIL_API_KEY: process.env.GRAIL_API_KEY,
      GRAIL_API_URL: process.env.GRAIL_API_URL,
    });
    _validated = true;
  } catch (error) {
    if (error instanceof z.ZodError) {
      const missingVars = error.errors.map((e) => e.path.join('.')).join(', ');
      console.error(`❌ Missing required environment variables: ${missingVars}`);
      console.error('Please check your Vercel environment variables or .env.local file.');
      
      if (process.env.NODE_ENV === 'production') {
        throw new Error(`Missing required environment variables: ${missingVars}`);
      }
    }
    throw error;
  }

  return _serverEnv;
}

export function isServerEnvValid(): boolean {
  if (_validated) return true;
  
  try {
    getServerEnv();
    return true;
  } catch {
    return false;
  }
}

export type ServerEnv = z.infer<typeof serverEnvSchema>;
