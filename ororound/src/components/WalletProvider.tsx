'use client';

import { FC, ReactNode, useMemo, useCallback, useEffect } from 'react';
import {
  ConnectionProvider,
  WalletProvider as SolanaWalletProvider,
  useWallet,
} from '@solana/wallet-adapter-react';
import { PhantomWalletAdapter } from '@solana/wallet-adapter-phantom';
import { SolflareWalletAdapter } from '@solana/wallet-adapter-solflare';
import { clusterApiUrl } from '@solana/web3.js';
import { WalletError } from '@solana/wallet-adapter-base';
import { useWalletStore } from '@/store/walletStore';

interface Props {
  children: ReactNode;
}

/**
 * Syncs @solana/wallet-adapter-react state → Zustand walletStore.
 * Must be rendered inside SolanaWalletProvider.
 */
function WalletStateSync() {
  const { publicKey, connected, connecting } = useWallet();
  const { setPublicKey, setConnected, setConnecting } = useWalletStore();

  useEffect(() => {
    setConnected(connected);
    setConnecting(connecting);
    setPublicKey(publicKey ? publicKey.toBase58() : null);
  }, [connected, connecting, publicKey, setConnected, setConnecting, setPublicKey]);

  return null;
}

export const WalletProvider: FC<Props> = ({ children }) => {
  const endpoint = useMemo(() => {
    const rpcUrl = process.env.NEXT_PUBLIC_SOLANA_RPC_URL;
    if (rpcUrl) return rpcUrl;
    
    const network = process.env.NEXT_PUBLIC_SOLANA_NETWORK;
    if (network === 'devnet') return clusterApiUrl('devnet');
    if (network === 'testnet') return clusterApiUrl('testnet');
    return clusterApiUrl('mainnet-beta');
  }, []);

  const wallets = useMemo(
    () => [
      new PhantomWalletAdapter(),
      new SolflareWalletAdapter(),
    ],
    []
  );

  const onError = useCallback((error: WalletError) => {
    // Silently ignore common non-critical errors
    const ignoredErrors = [
      'WalletNotReadyError',
      'WalletNotInstalledError',
      'WalletConnectionError',
    ];
    
    if (ignoredErrors.includes(error.name)) {
      return;
    }
    
    console.warn('Wallet error:', error.name, error.message);
  }, []);

  return (
    <ConnectionProvider endpoint={endpoint}>
      <SolanaWalletProvider 
        wallets={wallets} 
        autoConnect={true} 
        onError={onError}
      >
        <WalletStateSync />
        {children}
      </SolanaWalletProvider>
    </ConnectionProvider>
  );
};
