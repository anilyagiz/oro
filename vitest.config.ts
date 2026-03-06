import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react-swc';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./vitest.setup.ts'],
    include: [
      'src/**/*.test.{ts,tsx}', 
      'ororound/src/**/*.test.{ts,tsx}', 
      'hooks/**/*.{test,testx}.{ts,tsx}', 
      'lib/**/*.test.{ts,tsx}'
    ],
    exclude: ['node_modules', 'dist', 'ororound/node_modules', 'e2e'],
    env: {
      NEXT_PUBLIC_API_URL: 'http://localhost:3001',
      NEXT_PUBLIC_GRAIL_API_URL: 'https://api.grail.example.com',
      NEXT_PUBLIC_GRAIL_API_KEY: 'test-api-key',
      GRAIL_API_URL: 'https://api.grail.example.com',
      GRAIL_API_KEY: 'test-api-key',
    },
  },
  resolve: {
    // Dedupe React to avoid "multiple React instances" error
    dedupe: ['react', 'react-dom', '@tanstack/react-query'],
    alias: [
      // Map @/ to ororound/src (main application)
      {
        find: '@/lib/grail',
        replacement: path.resolve(__dirname, 'ororound/src/lib/grail'),
      },
      {
        find: '@/lib',
        replacement: path.resolve(__dirname, 'ororound/src/lib'),
      },
      {
        find: '@/store',
        replacement: path.resolve(__dirname, 'ororound/src/store'),
      },
      {
        find: '@/hooks',
        replacement: path.resolve(__dirname, 'ororound/src/hooks'),
      },
      {
        find: '@/components',
        replacement: path.resolve(__dirname, 'ororound/src/components'),
      },
      {
        find: '@/types',
        replacement: path.resolve(__dirname, 'ororound/src/types'),
      },
      {
        find: '@',
        replacement: path.resolve(__dirname, 'ororound/src'),
      },
    ],
  },
});
