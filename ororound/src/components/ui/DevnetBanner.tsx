'use client';

import React, { useState, useEffect } from 'react';
import { CheckCircle2, Radio } from 'lucide-react';
import { cn } from '@/lib/utils';

interface NetworkBannerProps {
  className?: string;
}

const STORAGE_KEY = 'ororound-network-banner-dismissed';

export function DevnetBanner({ className }: NetworkBannerProps) {
  const [isVisible, setIsVisible] = useState(true);
  const [isMounted, setIsMounted] = useState(false);

  const isMainnet =
    process.env.NEXT_PUBLIC_SOLANA_NETWORK === 'mainnet-beta' ||
    !process.env.NEXT_PUBLIC_SOLANA_NETWORK;

  useEffect(() => {
    setIsMounted(true);
    const dismissed = localStorage.getItem(STORAGE_KEY);
    if (dismissed === 'true') {
      setIsVisible(false);
    }
  }, []);

  const handleDismiss = () => {
    setIsVisible(false);
    localStorage.setItem(STORAGE_KEY, 'true');
  };

  // On mainnet, don't show any banner (clean look)
  if (!isMounted || !isVisible || isMainnet) {
    return null;
  }

  // Only shown when explicitly on devnet/testnet
  return (
    <div
      className={cn(
        'fixed left-0 right-0 top-0 z-[100]',
        'bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600',
        'text-white shadow-lg',
        className
      )}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between py-2.5">
          <div className="flex min-w-0 flex-1 items-center gap-3">
            <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm">
              <CheckCircle2 className="h-4 w-4 text-white" aria-hidden="true" />
            </div>
            <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:gap-3">
              <p className="text-sm font-semibold tracking-wide">
                ⚠️ Testnet Mode — tokens have no real value
              </p>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-black/20 px-2.5 py-0.5 text-xs font-medium text-white/95">
                <Radio className="h-3 w-3 animate-pulse" aria-hidden="true" />
                <span className="hidden sm:inline">Connected to</span>{' '}
                {process.env.NEXT_PUBLIC_SOLANA_NETWORK || 'devnet'}
              </span>
            </div>
          </div>

          <button
            onClick={handleDismiss}
            className={cn(
              'ml-4 flex-shrink-0 rounded-md p-1.5',
              'text-white/80 hover:bg-white/20 hover:text-white',
              'focus:outline-none focus:ring-2 focus:ring-white/50 focus:ring-offset-2 focus:ring-offset-orange-500',
              'transition-colors duration-200'
            )}
            aria-label="Dismiss network warning"
            title="Dismiss"
          >
            ✕
          </button>
        </div>
      </div>
    </div>
  );
}

export default DevnetBanner;
