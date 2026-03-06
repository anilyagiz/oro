'use client';

import { FC, ReactNode, useEffect } from 'react';
import { ThemeProvider } from 'next-themes';
import * as Sentry from '@sentry/nextjs';
import { Toaster } from 'sonner';
import { WalletProvider } from './WalletProvider';
import { ReactQueryProvider } from './ReactQueryProvider';
import { ErrorBoundary } from './ErrorBoundary';

interface Props {
  children: ReactNode;
}

export const Providers: FC<Props> = ({ children }) => {
  // Global unhandled rejection handler
  useEffect(() => {
    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      console.error('Unhandled promise rejection:', event.reason);
      
      if (process.env.NODE_ENV === 'production') {
        Sentry.captureException(event.reason);
      }
    };

    window.addEventListener('unhandledrejection', handleUnhandledRejection);
    return () => {
      window.removeEventListener('unhandledrejection', handleUnhandledRejection);
    };
  }, []);

  return (
    <ErrorBoundary>
      <ReactQueryProvider>
        <WalletProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <Toaster position="top-right" richColors closeButton />
            {children}
          </ThemeProvider>
        </WalletProvider>
      </ReactQueryProvider>
    </ErrorBoundary>
  );
};
